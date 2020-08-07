// Import
const catalogueToJSON = require("../services/catalogue/import/catalogueToJSON");
const jsonToCSV = require("../services/catalogue/import/jsonToDB");
// Export
const dbToJSON = require("../services/catalogue/export/dbToJSON");
// const jsonToCSV = require("../services/catalogue/export/jsonToCSV");

exports.test = (req, res, next) => {
  res.send("All ok");
};

exports.import = async (req, res, next) => {
  const booksArray = await catalogueToJSON();
  const successfulImport = await jsonToCSV(booksArray);
  if (!successfulImport) {
    return res.send("Importación fallida!");
  }
  res.send("Importación completada!");
};

exports.export = async (req, res, next) => {
  const booksArray = await dbToJSON();
  console.log(booksArray);
  // In the future add the posibility to export in json, xml and other formats
  // const csv = await jsonToCSV(booksArray);
  res.send(booksArray);
};
