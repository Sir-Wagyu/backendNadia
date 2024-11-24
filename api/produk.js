const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Import koneksi database

// Mendapatkan semua produk dengan pagination
router.get("/all", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const products = await db.query("SELECT * FROM produk LIMIT ? OFFSET ?", [limit, offset]);
    const countResult = await db.query("SELECT COUNT(*) as total FROM produk");
    const total = countResult[0].total;

    const totalPages = Math.ceil(total / limit);

    res.json({
      data: products,
      total_pages: totalPages,
      total,
      current_page: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mendapatkan detail produk
router.get("/detail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [product] = await db.query("SELECT * FROM produk WHERE id = ?", [id]);

    if (product.length > 0) {
      res.json(product[0]);
    } else {
      res.status(404).json({ message: "Produk tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mendapatkan produk terkait
router.get("/related/:category/:id", async (req, res) => {
  try {
    const { category, id } = req.params;
    const limit = 10;

    // Ambil produk dengan id < current
    const [productsBefore] = await db.query("SELECT * FROM produk WHERE category = ? AND id < ? ORDER BY id DESC LIMIT ?", [category, id, limit]);

    // Jika produk kurang dari 10, tambahkan produk dengan id > current
    if (productsBefore.length < limit) {
      const remainingLimit = limit - productsBefore.length;
      const [productsAfter] = await db.query("SELECT * FROM produk WHERE category = ? AND id > ? ORDER BY id ASC LIMIT ?", [category, id, remainingLimit]);

      productsBefore.push(...productsAfter);
    }

    // Filter produk dengan id yang sama
    const result = productsBefore.filter((p) => p.id !== parseInt(id));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mendapatkan produk berdasarkan filter
router.get("/filter", async (req, res) => {
  try {
    const { category, material, size, color, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let sql = "SELECT * FROM produk WHERE 1=1";
    let countSql = "SELECT COUNT(*) as total FROM produk WHERE 1=1";
    const params = [];
    const countParams = [];

    if (category) {
      sql += " AND category = ?";
      countSql += " AND category = ?";
      params.push(category);
      countParams.push(category);
    }

    if (material) {
      sql += " AND material LIKE ?";
      countSql += " AND material LIKE ?";
      params.push(`%${material}%`);
      countParams.push(`%${material}%`);
    }

    if (size) {
      sql += " AND size LIKE ?";
      countSql += " AND size LIKE ?";
      params.push(`%${size}%`);
      countParams.push(`%${size}%`);
    }

    if (color) {
      sql += " AND color LIKE ?";
      countSql += " AND color LIKE ?";
      params.push(`%${color}%`);
      countParams.push(`%${color}%`);
    }

    if (search) {
      sql += " AND (name LIKE ? OR deskripsi LIKE ?)";
      countSql += " AND (name LIKE ? OR deskripsi LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
      countParams.push(`%${search}%`, `%${search}%`);
    }

    sql += " LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));

    const [products] = await db.query(sql, params);
    const [[{ total }]] = await db.query(countSql, countParams);
    const totalPages = Math.ceil(total / limit);

    res.json({
      data: products,
      total_pages: totalPages,
      total,
      current_page: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
