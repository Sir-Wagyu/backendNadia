const express = require("express"); // Framework Express
const cors = require("cors"); // Middleware CORS
const dotenv = require("dotenv"); // Konfigurasi environment variables

// Inisialisasi dotenv
dotenv.config();

// Inisialisasi Express
const app = express();

// Middleware
app.use(cors()); // Mengizinkan CORS
app.use(express.json()); // Untuk parsing body JSON

// Import routes
const produkRoutes = require("./produk"); // Pastikan rute produk sesuai path

// Gunakan rute API
app.use("/api/produk", produkRoutes); // Base URL untuk rute produk

// Default route (optional)
app.get("/", (req, res) => {
  res.send("Backend API berjalan!");
});

// Error handling untuk endpoint yang tidak ditemukan
app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

// Error handling middleware untuk menangkap error lainnya
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error ke console
  res.status(500).json({ message: "Terjadi kesalahan pada server" });
});

// Jalankan server
const PORT = process.env.PORT || 5000; // Gunakan port dari .env jika tersedia, atau default 5000
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
