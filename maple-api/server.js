const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
require("dotenv").config();

const app = express();

// CORS: allow production frontend and localhost during development
const FRONTEND_URL = process.env.FRONTEND_URL;
const allowedOrigins = [
  "https://latinms.redly.com.ar",
  "https://www.latinms.redly.com.ar",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
];
if (FRONTEND_URL && !allowedOrigins.includes(FRONTEND_URL)) {
  allowedOrigins.push(FRONTEND_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests like curl/postman
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS not allowed"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3307),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cosmic",
  waitForConnections: true,
  connectionLimit: 10,
});

const VOTE_BASE_NX = Number(process.env.VOTE_BASE_NX || 500);
const VOTE_WEEKLY_BONUS_NX = Number(process.env.VOTE_WEEKLY_BONUS_NX || 1000);
const VOTE_MONTHLY_BONUS_NX = Number(process.env.VOTE_MONTHLY_BONUS_NX || 5000);
const VOTE_DAILY_SECONDS = Number(process.env.VOTE_DAILY_SECONDS || 86400);
const VOTE_STREAK_RESET_SECONDS = Number(process.env.VOTE_STREAK_RESET_SECONDS || 172800);
const GTOP100_PINGBACK_KEY = process.env.GTOP100_PINGBACK_KEY || "";

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const ADMIN_HTTP_URL = (process.env.ADMIN_HTTP_URL || "http://127.0.0.1:9001").replace(/\/+$/, "");
const ADMIN_HTTP_TOKEN = process.env.ADMIN_HTTP_TOKEN || "";

function hashPassword(password, algorithm) {
  return crypto.createHash(algorithm).update(password, "utf8").digest("hex");
}

function verifyPassword(inputPassword, storedPassword) {
  if (!inputPassword || !storedPassword) return false;
  if (storedPassword === inputPassword) return true;

  if (storedPassword.startsWith("$2")) {
    try {
      return bcrypt.compareSync(inputPassword, storedPassword);
    } catch {
      return false;
    }
  }

  const normalizedStoredPassword = storedPassword.toLowerCase();
  return (
    hashPassword(inputPassword, "sha1") === normalizedStoredPassword ||
    hashPassword(inputPassword, "sha512") === normalizedStoredPassword
  );
}

// Create web_profiles table if not exists (non-intrusive)
async function ensureWebProfilesTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS web_profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        account_id INT NOT NULL UNIQUE,
        display_name VARCHAR(50),
        avatar_url VARCHAR(255),
        bio VARCHAR(255),
        country VARCHAR(80),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    try {
      await pool.query("ALTER TABLE web_profiles ADD COLUMN country VARCHAR(80)");
    } catch (err) {
      if (err.code !== "ER_DUP_FIELDNAME") throw err;
    }
    console.log("web_profiles table ensured");
  } catch (err) {
    console.error("Error ensuring web_profiles table:", err.message);
  }
}

function getIpFromRequest(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || req.connection.remoteAddress || "unknown";
}

function normalizeVoteField(req, names) {
  for (const name of names) {
    const value = req.query?.[name] ?? req.body?.[name];
    if (typeof value !== "undefined") {
      return value;
    }
  }
  return undefined;
}

app.all("/vote/gtop100/pingback", async (req, res) => {
  try {
    const pingbackKey = normalizeVoteField(req, ["pingbackkey", "key", "secret"]);
    if (!GTOP100_PINGBACK_KEY) {
      console.error("GTop100 pingback request rejected because pingback key is not configured.");
      return res.status(500).json({ ok: false, message: "Pingback key no configurada" });
    }
    if (!pingbackKey || pingbackKey !== GTOP100_PINGBACK_KEY) {
      console.warn("GTop100 pingback rejected: invalid pingback key", { pingbackKey: !!pingbackKey });
      return res.status(401).json({ ok: false, message: "Pingback key inválida" });
    }

    const siteid = normalizeVoteField(req, ["siteid", "site_id", "site"]);
    const pb_id = normalizeVoteField(req, ["pb_id", "pbid", "id", "voteid"]);
    const successValue = normalizeVoteField(req, ["success", "status"]);
    const username = normalizeVoteField(req, [
      "username",
      "pingUsername",
      "PingUsername",
      "pingusername",
      "PINGUSERNAME",
      "name",
      "user",
      "account",
    ]);
    const ip = getIpFromRequest(req);
    const success = Number(successValue);

    if (!siteid || !pb_id || typeof successValue === "undefined" || !username) {
      console.warn("GTop100 pingback rejected: missing required fields", { siteid, pb_id, username, successValue });
      return res.status(400).json({ ok: false, message: "Faltan campos obligatorios en pingback" });
    }

    const [accountRows] = await pool.query(
      "SELECT id, nxCredit, nxPrepaid FROM accounts WHERE UPPER(name) = UPPER(?) LIMIT 1",
      [username]
    );
    if (accountRows.length === 0) {
      console.warn("GTop100 pingback rejected: account not found", { username });
      return res.status(404).json({ ok: false, message: "Cuenta no encontrada" });
    }

    const account = accountRows[0];
    const [existingRows] = await pool.query(
      "SELECT id FROM gtop100_votes WHERE siteid = ? AND pb_id = ? LIMIT 1",
      [siteid, pb_id]
    );
    if (existingRows.length > 0) {
      console.warn("GTop100 vote duplicate", { accountId: account.id, siteid, pb_id });
      return res.status(200).json({ ok: false, status: "duplicate", message: "Voto duplicado" });
    }

    const now = new Date();
    const [lastVoteRows] = await pool.query(
      `SELECT * FROM gtop100_votes WHERE account_id = ? AND success = 0 ORDER BY vote_time DESC LIMIT 1`,
      [account.id]
    );
    const lastVote = lastVoteRows[0] || null;
    let streak = 1;
    let totalVotes = 0;
    let lastWeeklyReward = null;
    let lastMonthlyReward = null;
    let rewardNx = 0;
    let status = "rejected";
    let votedWithinDay = false;
    let weeklyBonus = 0;
    let monthlyBonus = 0;

    if (lastVote) {
      totalVotes = lastVote.total_votes || 0;
      lastWeeklyReward = lastVote.last_weekly_reward;
      lastMonthlyReward = lastVote.last_monthly_reward;
      const ageSeconds = (now.getTime() - new Date(lastVote.vote_time).getTime()) / 1000;
      if (ageSeconds < VOTE_DAILY_SECONDS) {
        votedWithinDay = true;
        streak = lastVote.streak || 0;
      } else if (ageSeconds <= VOTE_STREAK_RESET_SECONDS) {
        streak = (lastVote.streak || 0) + 1;
      } else {
        streak = 1;
        console.info("GTop100 vote streak reset", { accountId: account.id, username, ageSeconds });
      }
    }

    if (success === 0) {
      const [totalRows] = await pool.query(
        `SELECT COUNT(*) AS total_votes FROM gtop100_votes WHERE account_id = ? AND status = 'accepted'`,
        [account.id]
      );
      totalVotes = totalRows[0]?.total_votes ?? 0;
      if (!votedWithinDay) {
        rewardNx = VOTE_BASE_NX;
        status = "accepted";
        totalVotes += 1;
        if (streak >= 7 && streak % 7 === 0) {
          weeklyBonus = VOTE_WEEKLY_BONUS_NX;
          rewardNx += weeklyBonus;
          console.info("GTop100 weekly bonus delivered", { accountId: account.id, username, streak, weeklyBonus });
        }
        if (streak === 30) {
          monthlyBonus = VOTE_MONTHLY_BONUS_NX;
          rewardNx += monthlyBonus;
          console.info("GTop100 monthly bonus delivered", { accountId: account.id, username, streak, monthlyBonus });
        }
        await pool.query(
          `UPDATE accounts SET nxCredit = nxCredit + ? WHERE id = ?`,
          [rewardNx, account.id]
        );
        console.info("GTop100 vote reward delivered", { accountId: account.id, username, rewardNx, streak });
      } else {
        status = "too_soon";
        streak = lastVote ? lastVote.streak || 0 : 0;
        console.warn("GTop100 vote rejected: reward already granted in last 24h", { accountId: account.id, username, streak });
      }
    } else {
      status = "failed";
      streak = lastVote ? lastVote.streak || 0 : 0;
      console.warn("GTop100 pingback with non-zero success rejected", { accountId: account.id, username, success });
    }

    await pool.query(
      `INSERT INTO gtop100_votes
         (account_id, siteid, pb_id, success, status, vote_time, ip, reward_nx, streak, total_votes, last_weekly_reward, last_monthly_reward)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        account.id,
        String(siteid),
        String(pb_id),
        success,
        status,
        now,
        ip,
        rewardNx,
        streak,
        totalVotes,
        weeklyBonus > 0 ? now : lastWeeklyReward,
        monthlyBonus > 0 ? now : lastMonthlyReward,
      ]
    );

    return res.json({ ok: true, status, reward_nx: rewardNx, streak, total_votes: totalVotes });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      console.warn("GTop100 vote duplicate prevented by constraint", { error: err.message });
      return res.status(200).json({ ok: false, status: "duplicate", message: "Voto duplicado" });
    }
    console.error("Error processing GTop100 pingback:", err);
    return res.status(500).json({ ok: false, message: "Error interno al procesar voto", error: err.message });
  }
});

app.get("/vote/status", authMiddleware, async (req, res) => {
  try {
    const uid = req.user.id;
    const [latestRows] = await pool.query(
      `SELECT vote_time, streak, total_votes
       FROM gtop100_votes
       WHERE account_id = ? AND status = 'accepted'
       ORDER BY vote_time DESC
       LIMIT 1`,
      [uid]
    );
    const latest = latestRows[0] || null;
    const now = new Date();
    let alreadyVotedToday = false;
    let nextVoteInSeconds = 0;
    let streak = 0;
    let totalVotes = 0;
    let lastVoteTime = null;

    if (latest) {
      lastVoteTime = new Date(latest.vote_time);
      streak = latest.streak || 0;
      totalVotes = latest.total_votes || 0;
      const elapsed = (now.getTime() - lastVoteTime.getTime()) / 1000;
      if (elapsed < VOTE_DAILY_SECONDS) {
        alreadyVotedToday = true;
        nextVoteInSeconds = Math.max(0, VOTE_DAILY_SECONDS - Math.floor(elapsed));
      }
    }

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const [monthRows] = await pool.query(
      `SELECT COALESCE(SUM(reward_nx), 0) AS nx_this_month
       FROM gtop100_votes
       WHERE account_id = ? AND success = 0 AND vote_time >= ?`,
      [uid, monthStart]
    );
    const nxThisMonth = monthRows[0]?.nx_this_month || 0;

    return res.json({
      ok: true,
      alreadyVotedToday,
      nextVoteInSeconds,
      currentStreak: streak,
      nxGainedThisMonthApprox: nxThisMonth,
      lastVoteTime,
      totalVotes,
    });
  } catch (err) {
    console.error("Error getting vote status:", err);
    return res.status(500).json({ ok: false, message: "Error obteniendo estado de votación", error: err.message });
  }
});

async function ensureGTop100VotesTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS gtop100_votes (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        account_id INT UNSIGNED NOT NULL,
        siteid VARCHAR(64) NOT NULL,
        pb_id VARCHAR(128) NOT NULL,
        success TINYINT UNSIGNED NOT NULL DEFAULT 0,
        status VARCHAR(32) NOT NULL,
        vote_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        ip VARCHAR(45) NOT NULL,
        reward_nx INT NOT NULL DEFAULT 0,
        streak INT NOT NULL DEFAULT 0,
        total_votes INT NOT NULL DEFAULT 0,
        last_weekly_reward TIMESTAMP NULL DEFAULT NULL,
        last_monthly_reward TIMESTAMP NULL DEFAULT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY unique_vote (siteid, pb_id),
        KEY account_idx (account_id)
      )
    `);
    console.log("gtop100_votes table ensured");
  } catch (err) {
    console.error("Error ensuring gtop100_votes table:", err.message);
  }
}

// Auth middleware
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ ok: false, message: "No autorizado" });

  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.id, name: payload.name };
    return next();
  } catch (err) {
    return res.status(401).json({ ok: false, message: "Token inválido" });
  }
}

// Admin middleware dinámico
async function adminMiddleware(req, res, next) {
  try {
    const uid = req.user.id;
    const dbName = process.env.DB_NAME || "cosmic";

    console.log(`[AdminCheck] Verificando permisos para UID: ${uid} en DB: ${dbName}`);

    // Verificar columnas existentes en la tabla accounts
    const [accCols] = await pool.query(
      "SELECT COLUMN_NAME FROM information_schema.columns WHERE table_schema = ? AND table_name = 'accounts'",
      [dbName]
    );
    const accColNames = accCols.map(c => c.COLUMN_NAME.toLowerCase());
    console.log(`[AdminCheck] Columnas encontradas en accounts:`, accColNames);

    let isAdmin = false;
    const accChecks = [];
    if (accColNames.includes('gm')) accChecks.push("gm > 0");
    if (accColNames.includes('admin')) accChecks.push("admin > 0");

    if (accChecks.length > 0) {
      const [accRows] = await pool.query(
        `SELECT id FROM accounts WHERE id = ? AND (${accChecks.join(" OR ")}) LIMIT 1`,
        [uid]
      );
      console.log(`[AdminCheck] Resultado chequeo cuentas:`, accRows.length > 0 ? "Admin encontrado" : "No es admin en accounts");
      if (accRows.length > 0) isAdmin = true;
    }

    // Si no es admin por cuenta, verificar si tiene algún personaje GM
    if (!isAdmin) {
      const [charCols] = await pool.query(
        "SELECT COLUMN_NAME FROM information_schema.columns WHERE table_schema = ? AND table_name = 'characters'",
        [dbName]
      );
      const charColNames = charCols.map(c => c.COLUMN_NAME.toLowerCase());

      if (charColNames.includes('gm')) {
        const [charRows] = await pool.query(
          "SELECT id FROM characters WHERE accountid = ? AND gm > 0 LIMIT 1",
          [uid]
        );
        console.log(`[AdminCheck] Resultado chequeo personajes:`, charRows.length > 0 ? "GM encontrado" : "No tiene personajes GM");
        if (charRows.length > 0) isAdmin = true;
      }
    }

    if (!isAdmin) {
      console.warn(`[AdminCheck] Acceso denegado para UID: ${uid}`);
      return res.status(403).json({ ok: false, message: "No tenés permisos de administrador." });
    }

    next();
  } catch (err) {
    console.error("Error en adminMiddleware:", err);
    res.status(500).json({ ok: false, message: "Error al verificar permisos." });
  }
}

app.get("/admin/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const dbName = process.env.DB_NAME || "cosmic";

    const [accCols] = await pool.query("SELECT COLUMN_NAME FROM information_schema.columns WHERE table_schema = ? AND table_name = 'accounts'", [dbName]);
    const accColNames = accCols.map(c => c.COLUMN_NAME.toLowerCase());

    const [charCols] = await pool.query("SELECT COLUMN_NAME FROM information_schema.columns WHERE table_schema = ? AND table_name = 'characters'", [dbName]);
    const charColNames = charCols.map(c => c.COLUMN_NAME.toLowerCase());

    const stats = {};

    // Conteos básicos
    const [totalAcc] = await pool.query("SELECT COUNT(*) AS total FROM accounts");
    stats.totalAccounts = totalAcc[0].total;

    const [totalChar] = await pool.query("SELECT COUNT(*) AS total FROM characters");
    stats.totalCharacters = totalChar[0].total;

    // Baneados
    if (accColNames.includes('banned')) {
      const [banned] = await pool.query("SELECT COUNT(*) AS total FROM accounts WHERE banned = 1");
      stats.bannedAccounts = banned[0].total;
    } else stats.bannedAccounts = 0;

    // Online (loggedin)
    if (accColNames.includes('loggedin')) {
      const [online] = await pool.query("SELECT COUNT(*) AS total FROM accounts WHERE loggedin > 0");
      stats.onlineUsers = online[0].total;
    } else stats.onlineUsers = 0;

    // GMs en personajes
    if (charColNames.includes('gm')) {
      const [gms] = await pool.query("SELECT COUNT(*) AS total FROM characters WHERE gm > 0");
      stats.gmCharacters = gms[0].total;
    } else stats.gmCharacters = 0;

    stats.normalCharacters = stats.totalCharacters - stats.gmCharacters;

    // Listas (sin datos sensibles)
    stats.latestAccounts = (await pool.query("SELECT id, name FROM accounts ORDER BY id DESC LIMIT 5"))[0];
    stats.latestCharacters = (await pool.query("SELECT id, name, level, job FROM characters ORDER BY id DESC LIMIT 5"))[0];

    res.json({ ok: true, stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "No se pudieron cargar las estadísticas.", error: err.message });
  }
});

app.get("/admin/online-players", authMiddleware, adminMiddleware, async (req, res) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const headers = {};
    if (ADMIN_HTTP_TOKEN) headers["X-Admin-Token"] = ADMIN_HTTP_TOKEN;

    const response = await fetch(`${ADMIN_HTTP_URL}/admin/online-players`, {
      headers,
      signal: controller.signal,
    });
    const body = await response.json().catch(() => null);

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        message: "No se pudo consultar el servidor admin interno.",
        upstreamStatus: response.status,
        upstream: body,
      });
    }

    return res.json({
      ok: true,
      players: Array.isArray(body?.players) ? body.players : [],
    });
  } catch (err) {
    console.error("Error loading online players from AdminHttpServer:", err.message);
    return res.status(502).json({
      ok: false,
      message: "No se pudo conectar con el servidor admin interno.",
      error: err.message,
    });
  } finally {
    clearTimeout(timeout);
  }
});

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Maple API funcionando" });
});

async function buildStatusPayload() {
  const [accounts] = await pool.query("SELECT COUNT(*) AS total FROM accounts");
  const [characters] = await pool.query("SELECT COUNT(*) AS total FROM characters");
  const [onlinePlayers] = await pool.query("SELECT COUNT(*) AS total FROM accounts WHERE loggedin > 0");
  const [loginStates] = await pool.query(`
    SELECT loggedin, COUNT(*) AS total
    FROM accounts
    GROUP BY loggedin
    ORDER BY loggedin
  `);

  return {
    ok: true,
    server: "online",
    statusVersion: "online-counter-v2",
    accounts: Number(accounts[0].total || 0),
    characters: Number(characters[0].total || 0),
    onlinePlayers: Number(onlinePlayers[0].total || 0),
    playersOnline: Number(onlinePlayers[0].total || 0),
    online_players: Number(onlinePlayers[0].total || 0),
    loginStates,
  };
}

app.get("/status", async (req, res) => {
  try {
    res.json(await buildStatusPayload());
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, server: "offline", message: "No se pudo conectar a la base de datos", error: error.message });
  }
});

app.get("/status/debug", async (req, res) => {
  try {
    const status = await buildStatusPayload();
    res.json({
      ...status,
      database: {
        host: process.env.DB_HOST || "127.0.0.1",
        port: Number(process.env.DB_PORT || 3307),
        name: process.env.DB_NAME || "cosmic",
      },
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, server: "offline", message: "No se pudo conectar a la base de datos", error: error.message });
  }
});

app.get("/ranking", async (req, res) => {
  try {
    const { job, country } = req.query;
    const where = ["c.gm = 0"];
    const params = [];

    if (job && job !== "all") {
      const jobId = Number(job);
      if (!Number.isInteger(jobId)) {
        return res.status(400).json({ ok: false, message: "Filtro de job invalido." });
      }
      where.push("c.job = ?");
      params.push(jobId);
    }

    if (country && country !== "all") {
      where.push("p.country = ?");
      params.push(country);
    }

    const [rows] = await pool.query(`
      SELECT
        c.id,
        c.name,
        c.level,
        c.job,
        c.fame,
        c.gender,
        c.skincolor AS skin,
        c.face,
        c.hair,
        c.guildid,
        g.name AS guild_name,
        p.country
      FROM characters c
      LEFT JOIN guilds g ON c.guildid = g.guildid
      LEFT JOIN web_profiles p ON c.accountid = p.account_id
      WHERE ${where.join(" AND ")}
      ORDER BY c.level DESC, c.exp DESC
      LIMIT 50
    `, params);

    if (rows.length === 0) {
      return res.json({ ok: true, rankingVersion: "equips-filters-v1", filters: { job: job || "all", country: country || "all" }, ranking: [] });
    }

    const characterIds = rows.map((row) => row.id);
    const placeholders = characterIds.map(() => "?").join(",");
    const [equipRows] = await pool.query(`
      SELECT characterid, itemid, position
      FROM inventoryitems
      WHERE characterid IN (${placeholders})
        AND inventorytype = -1
        AND position < 0
      ORDER BY characterid, position
    `, characterIds);

    const equipsByCharacter = new Map();
    for (const equip of equipRows) {
      if (!equipsByCharacter.has(equip.characterid)) {
        equipsByCharacter.set(equip.characterid, []);
      }
      equipsByCharacter.get(equip.characterid).push({
        itemid: equip.itemid,
        position: equip.position,
      });
    }

    const ranking = rows.map((row) => ({
      ...row,
      equips: equipsByCharacter.get(row.id) || [],
    }));

    return res.json({ ok: true, rankingVersion: "equips-filters-v1", filters: { job: job || "all", country: country || "all" }, ranking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "No se pudo cargar el ranking.",
      error: error.message,
    });
  }
});

// Register - keep compatibility, don't return sensitive fields
app.post("/register", async (req, res) => {
  try {
    const { username, displayName, email, password, confirmPassword, country, birthDate } = req.body;

    if (!username || !displayName || !email || !password || !confirmPassword || !country || !birthDate) {
      return res.status(400).json({ ok: false, message: "Completá todos los campos." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ ok: false, message: "Las contraseñas no coinciden." });
    }

    if (username.length < 4 || username.length > 13) {
      return res.status(400).json({ ok: false, message: "El usuario debe tener entre 4 y 13 caracteres." });
    }

    if (password.length < 4 || password.length > 30) {
      return res.status(400).json({ ok: false, message: "La contraseña debe tener entre 4 y 30 caracteres." });
    }

    if (displayName.length > 20) {
      return res.status(400).json({ ok: false, message: "El nombre debe tener hasta 20 caracteres." });
    }

    if (email.length > 45 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, message: "Ingresa un correo electronico valido." });
    }

    if (country.length > 80) {
      return res.status(400).json({ ok: false, message: "El pais es demasiado largo." });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      return res.status(400).json({ ok: false, message: "Ingresa una fecha de cumpleanos valida." });
    }

    const [existing] = await pool.query("SELECT id FROM accounts WHERE name = ? LIMIT 1", [username]);
    if (existing.length > 0) return res.status(409).json({ ok: false, message: "Ese usuario ya existe." });

    const [created] = await pool.query(
      `INSERT INTO accounts (name, password, pin, pic, loggedin, banned, birthday, email, nick)
       VALUES (?, ?, '0000', '000000', 0, 0, ?, ?, ?)`,
      [username, password, birthDate, email, displayName]
    );

    await pool.query(
      `INSERT INTO web_profiles (account_id, display_name, country)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE display_name = VALUES(display_name), country = VALUES(country)`,
      [created.insertId, displayName, country]
    );

    return res.json({ ok: true, message: "Cuenta creada correctamente." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: "Error al crear la cuenta.", error: error.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ ok: false, message: "username y password requeridos" });

    const [rows] = await pool.query("SELECT id, name, password, banned FROM accounts WHERE name = ? LIMIT 1", [username]);
    const account = rows[0];

    console.log("[login] usuario:", username);
    console.log("[login] cuenta encontrada:", Boolean(account));

    if (!account) return res.status(401).json({ ok: false, message: "Credenciales inválidas" });

    console.log("[login] banned:", account?.banned);
    console.log("[login] password length DB:", account?.password?.length);
    console.log("[login] password prefix DB:", account?.password?.slice(0, 8));

    if (Number(account.banned) === 1) return res.status(403).json({ ok: false, message: "Cuenta bloqueada" });

    const passwordMatches = verifyPassword(password, account.password);
    console.log("[login] password match:", passwordMatches);
    if (!passwordMatches) return res.status(401).json({ ok: false, message: "Credenciales inválidas" });

    const token = jwt.sign({ id: account.id, name: account.name }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({ ok: true, message: "Inicio de sesión correcto.", token, account: { id: account.id, name: account.name } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error en login", error: err.message });
  }
});

app.post("/login-legacy-disabled", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ ok: false, message: "username y password requeridos" });

    const [rows] = await pool.query("SELECT id, name, password, banned FROM accounts WHERE name = ? LIMIT 1", [username]);
    if (rows.length === 0) return res.status(401).json({ ok: false, message: "Credenciales inválidas" });

    const account = rows[0];
    console.log("[login] usuario:", username);
    console.log("[login] cuenta encontrada:", Boolean(account));
    console.log("[login] banned:", account?.banned);
    console.log("[login] password length DB:", account?.password?.length);
    console.log("[login] password prefix DB:", account?.password?.slice(0, 8));

    if (Number(account.banned) === 1) return res.status(403).json({ ok: false, message: "Cuenta bloqueada" });

    // direct comparison to remain compatible with existing /register
    if (!verifyPassword(password, account.password)) return res.status(401).json({ ok: false, message: "Credenciales inválidas" });

    const token = jwt.sign({ id: account.id, name: account.name }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({ ok: true, message: "Inicio de sesión correcto.", token, account: { id: account.id, name: account.name } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error en login", error: err.message });
  }
});

// Get logged account and profile
app.get("/account/me", authMiddleware, async (req, res) => {
  try {
    const uid = req.user.id;
    const [accRows] = await pool.query("SELECT id, name, loggedin, banned FROM accounts WHERE id = ? LIMIT 1", [uid]);
    if (accRows.length === 0) return res.status(404).json({ ok: false, message: "Cuenta no encontrada" });

    const account = accRows[0];

    const [profiles] = await pool.query("SELECT display_name, avatar_url, bio FROM web_profiles WHERE account_id = ? LIMIT 1", [uid]);
    let profile = profiles[0];

    if (!profile) {
      await pool.query("INSERT INTO web_profiles (account_id, display_name, avatar_url, bio) VALUES (?, ?, ?, ?)", [uid, null, null, null]);
      const [newp] = await pool.query("SELECT display_name, avatar_url, bio FROM web_profiles WHERE account_id = ? LIMIT 1", [uid]);
      profile = newp[0];
    }

    return res.json({ ok: true, account, profile });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error al obtener cuenta", error: err.message });
  }
});

// Get characters for account
app.get("/account/me/characters", authMiddleware, async (req, res) => {
  try {
    const uid = req.user.id;
    // detect available columns to remain compatible with different schemas
    const [cols] = await pool.query(
      `SELECT COLUMN_NAME FROM information_schema.columns WHERE table_schema = ? AND table_name = 'characters'`,
      [process.env.DB_NAME || "cosmic"]
    );

    const available = cols.map((c) => c.COLUMN_NAME.toLowerCase());
    const desired = [
      "id",
      "name",
      "level",
      "job",
      "fame",
      "mesos",
      "map",
      "gender",
      "skincolor",
      "face",
      "hair",
      "exp",
    ];

    const toSelect = desired.filter((d) => available.includes(d));
    if (!toSelect.includes("id")) toSelect.unshift("id");

    const selectParts = toSelect.map((col) => (col === "skincolor" ? "skincolor AS skin" : col));
    const orderParts = ["level DESC"];
    if (available.includes("exp")) orderParts.push("exp DESC");

    const sql = `SELECT ${selectParts.join(", ")} FROM characters WHERE accountid = ? ORDER BY ${orderParts.join(", ")}`;
    const [rows] = await pool.query(sql, [uid]);

    return res.json({ ok: true, characters: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error al obtener personajes", error: err.message });
  }
});

// Update or create profile
app.put("/account/me/profile", authMiddleware, async (req, res) => {
  try {
    const uid = req.user.id;
    const { display_name, avatar_url, bio } = req.body;

    if (display_name && display_name.length > 50) return res.status(400).json({ ok: false, message: "display_name demasiado largo" });
    if (avatar_url && avatar_url.length > 255) return res.status(400).json({ ok: false, message: "avatar_url demasiado largo" });
    if (bio && bio.length > 255) return res.status(400).json({ ok: false, message: "bio demasiado larga" });

    await pool.query(
      `INSERT INTO web_profiles (account_id, display_name, avatar_url, bio)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE display_name = VALUES(display_name), avatar_url = VALUES(avatar_url), bio = VALUES(bio)`,
      [uid, display_name || null, avatar_url || null, bio || null]
    );

    const [profiles] = await pool.query("SELECT display_name, avatar_url, bio FROM web_profiles WHERE account_id = ? LIMIT 1", [uid]);
    return res.json({ ok: true, message: "Perfil actualizado correctamente.", profile: profiles[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error al actualizar perfil", error: err.message });
  }
});

// Change password
app.post("/account/me/change-password", authMiddleware, async (req, res) => {
  try {
    const uid = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmPassword) return res.status(400).json({ ok: false, message: "Todos los campos son requeridos" });
    if (newPassword !== confirmPassword) return res.status(400).json({ ok: false, message: "Las nuevas contraseñas no coinciden" });
    if (newPassword.length < 4 || newPassword.length > 30) return res.status(400).json({ ok: false, message: "La contraseña debe tener entre 4 y 30 caracteres." });

    const [rows] = await pool.query("SELECT password FROM accounts WHERE id = ? LIMIT 1", [uid]);
    if (rows.length === 0) return res.status(404).json({ ok: false, message: "Cuenta no encontrada" });
    const account = rows[0];

    if (account.password !== currentPassword) return res.status(401).json({ ok: false, message: "Contraseña actual incorrecta" });

    await pool.query("UPDATE accounts SET password = ? WHERE id = ?", [newPassword, uid]);
    return res.json({ ok: true, message: "Contraseña actualizada correctamente." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error al cambiar contraseña", error: err.message });
  }
});

// Authenticated health check
app.get("/account/check", authMiddleware, (req, res) => {
  return res.json({ ok: true, user: req.user });
});

const PORT = process.env.PORT || 3001;

// Ensure web_profiles and start server
Promise.all([ensureWebProfilesTable(), ensureGTop100VotesTable()]).then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Maple API corriendo en puerto ${PORT}`);
  });
});
