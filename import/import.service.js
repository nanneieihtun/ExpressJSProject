const dbConnection = require("../server/dbService");
const fs = require("fs");
const fastcsv = require("fast-csv");
const uuid = require("uuid");

module.exports = {
  importCsv: (fileName, filePath, fileSize, callBack) => {
    const fileID = uuid.v4();
    dbConnection.query(
      "INSERT INTO fileinfo (FileID, FileName, FilePath, FileSize) VALUES (?,?,?,?)",
      [fileID, fileName, filePath, fileSize],
      (err, results) => {
        if (err) {
          return callBack(err);
        } else {
          processCSVFile(filePath)
            .then(() => {
              return callBack(null, results);
            })
            .catch((err) => {
              return callBack(err);
            });
        }
      }
    );
  },
};

function processCSVFile(filePath) {
  const results = [];
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(filePath);
    fastcsv
      .parseStream(readStream, { headers: true })
      .on("data", (data) => {
        const uniqueId = uuid.v1().substring(0, 8);
        console.log(`Generated uniqueId for this row: ${uniqueId}`);
        results.push({ uniqueId, data });
      })
      .on("end", () => {
        const insertData = results.map((row) => {
          return insertInfos(row.uniqueId, row.data);
        });

        Promise.all(insertData)
          .then(() => {
            resolve("CSV data is added successfully!");
          })
          .catch((err) => {
            reject(err);
          });
      });
  });
}

function insertInfos(uniqueId, data) {
  return new Promise((resolve, reject) => {
    dbConnection.query(
      "SELECT COUNT(*) AS count FROM person-info WHERE ID = ?",
      [uniqueId],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          const count = results[0].count;
          if (count === 0) {
            dbConnection.query(
              "INSERT INTO sample (ID, Name, Age, DateBirth, Gender, CreatedDate) VALUES (?,?,?,?,?,?)",
              [
                uniqueId,
                data.Name,
                data.Age,
                data.DateBirth,
                data.Gender,
                data.CreatedDate
              ],
              (err) => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              }
            );
          } else {
            resolve();
          }
        }
      }
    );
  });
}
