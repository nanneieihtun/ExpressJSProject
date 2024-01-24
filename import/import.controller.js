const multer = require("multer");
const { importCsv } = require("./import.service");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Create an 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // filename
  },
});
const upload = multer({ storage: storage });
const uploadMiddleware = upload.single("csvFile");

module.exports = {
  importCsvFile: (req, res) => {
    uploadMiddleware(req, res, (err) => {
      console.log(req.file);
      if (err) {
        return res.status(400).json({
          success: 0,
          message: "File can not uploaded.",
        });
      }
      const fileName = req.file.originalname;
      const fileSize = req.file.size;
      const filePath = req.file.path;

      importCsv(fileName, filePath, fileSize, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection error",
          });
        }

        return res.json(results);
      });
    });
  },
};
