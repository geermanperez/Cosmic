const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
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

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "Maple API funcionando",
  });
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

    res.status(500).json({
      ok: false,
      server: "offline",
      message: "No se pudo conectar a la base de datos",
      error: error.message,
    });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    if (!username || !password || !confirmPassword) {
      return res.status(400).json({
        ok: false,
        message: "Completá todos los campos.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        ok: false,
        message: "Las contraseñas no coinciden.",
      });
    }

    if (username.length < 4 || username.length > 13) {
      return res.status(400).json({
        ok: false,
        message: "El usuario debe tener entre 4 y 13 caracteres.",
      });
    }

    if (password.length < 4 || password.length > 30) {
      return res.status(400).json({
        ok: false,
        message: "La contraseña debe tener entre 4 y 30 caracteres.",
      });
    }

    const [existing] = await pool.query(
      "SELECT id FROM accounts WHERE name = ? LIMIT 1",
      [username]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        ok: false,
        message: "Ese usuario ya existe.",
      });
    }

    await pool.query(
  `
  INSERT INTO accounts 
  (name, password, pin, pic, loggedin, banned)
  VALUES (?, ?, '0000', '000000', 0, 0)
  `,
  [username, password]
);

    res.json({
      ok: true,
      message: "Cuenta creada correctamente.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      message: "Error al crear la cuenta.",
      error: error.message,
    });
  }
});

app.get("/ranking", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT name, level, job, fame
      FROM characters
      WHERE gm = 0
      ORDER BY level DESC, exp DESC
      LIMIT 50
    `);

    res.json({
      ok: true,
      ranking: rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      message: "No se pudo cargar el ranking.",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Maple API corriendo en puerto ${PORT}`);
});