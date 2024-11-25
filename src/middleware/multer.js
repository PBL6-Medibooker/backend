const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "image/"); // Lưu file tạm vào thư mục 'uploads'
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file với timestamp
  },
});

const upload = multer({ storage: storage });

module.exports = upload;