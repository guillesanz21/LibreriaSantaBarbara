// The main goal of this script is to parse the catalogue from any extension (initially CSV) to JS Object
// Therefore, when called, this script will return an JS Object

const fs = require("fs");
const iconv = require("iconv-lite");
const csv = require("csvtojson");

const headersEquivalence = require("../catalogueHeaders/headersImport");

const changeHeaders = (badHeaders) => {
  const goodHeaders = badHeaders.map((header) => {
    return headersEquivalence[header];
  });
  return goodHeaders;
};

const filePath = `${__dirname}/../../../data/tmp/catalogue.txt`;
const data = fs.readFileSync(filePath, { encoding: "binary" });
const librostxt = iconv.decode(data, "ISO-8859-1");

const catalogueToJSON = async () => {
  let headers;
  // Extracting the headers
  await csv({ delimiter: [",", "\t"] })
    .fromString(librostxt)
    .on("header", (header) => {
      headers = changeHeaders(header);
    });

  const csvConverter = csv({
    delimiter: [",", "\t"],
    noheader: false,
    headers: headers,
    ignoreColumns: /(format|weight|edition|printRun|coverCondition|kindArticle|quantity|catalogue|AbeBooksCategory)/,
    colParser: {
      images: (item) => [item],
    },
  });
  // Extracting the csv with the new headers
  const jsonArray = await csvConverter.fromString(librostxt);

  return jsonArray;
};

module.exports = catalogueToJSON;
