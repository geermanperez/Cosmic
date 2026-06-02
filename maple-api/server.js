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

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3307),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cosmic",
  waitForConnections: true,
  connectionLimit: 10,
});

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

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
      return res.json({ ok: true, ranking: [] });
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

    return res.json({ ok: true, ranking });
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
ensureWebProfilesTable().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Maple API corriendo en puerto ${PORT}`);
  });
});
