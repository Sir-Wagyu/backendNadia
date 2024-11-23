require("dotenv").config();
const mysql = require("mysql2/promise"); // Pastikan menggunakan mysql2/promise

// Membuat koneksi ke database menggunakan mysql2/promise
const connection = mysql.createPool({
  // Gunakan createPool untuk mendukung multiple query dengan koneksi yang lebih baik
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true, // Menunggu koneksi jika sedang tidak ada
  connectionLimit: 10, // Tentukan batas koneksi
  queueLimit: 0, // Tidak ada batasan untuk antrian koneksi
});

module.exports = connection;
