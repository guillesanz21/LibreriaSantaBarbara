const mongoose = require("mongoose");
const { Schema } = mongoose;
// const autoIncrement = require("mongoose-auto-increment");

const bookSchema = new Schema({
  // key: typeOfValue,
  reference: {
    type: Number,
    unique: [true, "ERROR (MongoDB): The reference number is duplicated"],
    dropDups: [true, "Dropping the duplicate"],
    required: [true, "ERROR (MongoDB): The reference number is missing"],
  },
  title: {
    type: String,
    required: [true, "ERROR (MongoDB): The title is missing"],
  },
  author: String,
  isbn: String,
  publicationPlace: String,
  publisher: String,
  bookCollection: String,
  year: Number,
  size: String,
  pages: Number,
  illustration: String,
  binding: String,
  condition: {
    type: String,
    default: "",
  },
  dedication: String,
  languages: {
    type: String,
    default: "Español",
  },
  keywords: String,
  topics: String,
  description: String,
  price: {
    type: Number,
    required: [true, "ERROR (MongoDB): The price is missing"],
    min: [0, "ERROR (MongoDB): The price is lower than 0"],
  },
  images: [String],
  location: {
    type: String,
    enum: ["almacen", "almacen alto", "libreria", "feria"],
  },
  privateNote: String,
  state: {
    type: String,
    enum: ["venta", "vendido", "reservado"],
    default: "venta",
  },
  edition: String,

  //format: String,  // formato
  //weight: String,   // peso
  //edition: String,  // edicion
  //printRun: String, // tirada
  //coverCondition: String,   // estado de la cubierta
  //kindArticle: String,      // tipo de articulo
  //quantity: String,         // cantidad
  //catalogue: String,         // catalogo
  //AbeBooksCategory: String,   // Categoría de AbeBooks
});

// bookSchema.plugin(autoIncrement.plugin, { model: "Book", field: "reference" });

// This will load the schema into mongoose
mongoose.model("books", bookSchema);
