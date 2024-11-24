require("dotenv").config();
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "c32rh.h.filess.io",
  user: "nadiashop_saysection",
  password: "02608815b1a78652aa789db70580a71d2ecece60",
  database: "nadiashop_saysection",
  port: 3307,
});

// Membungkus koneksi untuk mendukung Promise
const db = {
  query: (sql, params) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, params, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  },
};

module.exports = db;
