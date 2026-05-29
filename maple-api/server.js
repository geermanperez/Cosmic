const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// CORS: allow FRONTEND_URL and localhost during development
const FRONTEND_URL = process.env.FRONTEND_URL;
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests like curl/postman
    const allowed = [];
    if (FRONTEND_URL) allowed.push(FRONTEND_URL);
    allowed.push(
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000"
    );
    if (allowed.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error("CORS not allowed"));
  },
};

app.use(cors(corsOptions));
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
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

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Maple API funcionando" });
});

app.get("/status", async (req, res) => {
  try {
    const [accounts] = await pool.query("SELECT COUNT(*) AS total FROM accounts");
    const [characters] = await pool.query("SELECT COUNT(*) AS total FROM characters");

    res.json({
      ok: true,
      server: "online",
      accounts: accounts[0].total,
      characters: characters[0].total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, server: "offline", message: "No se pudo conectar a la base de datos", error: error.message });
  }
});

// Register - keep compatibility, don't return sensitive fields
app.post("/register", async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    if (!username || !password || !confirmPassword) {
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

    const [existing] = await pool.query("SELECT id FROM accounts WHERE name = ? LIMIT 1", [username]);
    if (existing.length > 0) return res.status(409).json({ ok: false, message: "Ese usuario ya existe." });

    await pool.query(
      `INSERT INTO accounts (name, password, pin, pic, loggedin, banned) VALUES (?, ?, '0000', '000000', 0, 0)`,
      [username, password]
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
    if (rows.length === 0) return res.status(401).json({ ok: false, message: "Credenciales inválidas" });

    const account = rows[0];
    if (Number(account.banned) === 1) return res.status(403).json({ ok: false, message: "Cuenta bloqueada" });

    // direct comparison to remain compatible with existing /register
    if (account.password !== password) return res.status(401).json({ ok: false, message: "Credenciales inválidas" });

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
  app.listen(PORT, () => {
    console.log(`Maple API corriendo en puerto ${PORT}`);
  });
});