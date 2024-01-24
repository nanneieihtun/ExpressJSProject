const { importCsvFile } = require("./import.controller");

const router = require("express").Router();

router.post("/importCsv", importCsvFile);

module.exports = router;
