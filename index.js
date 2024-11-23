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
const produkRoutes = require("./api/produk"); // Pastikan rute produk sesuai path

// Gunakan rute API
app.use("/api/produk", produkRoutes); // Base URL untuk rute produk

// Default route (optional)
app.get("/", (req, res) => {
  res.send("Backend API berjalan!");
});

// Jalankan server
const PORT = process.env.PORT || 5000; // Gunakan port dari .env jika tersedia, atau default 5000
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
