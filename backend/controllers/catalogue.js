const fs = require("fs");
const csv = require("csvtojson");

exports.test = (req, res, next) => {
  res.send("All ok");
};

exports.import = async (req, res, next) => {
  /*const path = "./bbdd.txt";
  // Sacar headers de la primera linea... asociar con algun tipo de logica cada etiqueta en español con la de ingles
  // por ejemplo, año de publicación --> year. Despues con la propiedad "headers" asignar los headers adecuados
  const csvConverter = csv({
    delimiter: [",", "\t"],
    noheader: false,
    headers: [],
  });
  const jsonArray = await csvConverter.fromFile(path);
  console.log(jsonArray);*/

  res.send("All working just fine");
};
