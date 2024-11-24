// Memuat environment variables dari .env file
require("dotenv").config();

// Menyambungkan ke database MySQL
const mysql = require("mysql2");

// Membuat koneksi ke database menggunakan data dari .env
const connection = mysql.createConnection({
  host: process.env.DB_HOST, // host database
  user: process.env.DB_USER, // username database
  password: process.env.DB_PASS, // password database
  database: process.env.DB_NAME, // nama database
});

// Mengecek apakah koneksi berhasil
connection.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to the database as ID " + connection.threadId);
});

module.exports = connection;
