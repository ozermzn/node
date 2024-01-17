const fs = require("fs");

const deleteFile = (req, res, next) => {
  fs.unlink(filePath, (err) => {
    if (err) throw err;
  });
};

exports.deleteFile = deleteFile;
