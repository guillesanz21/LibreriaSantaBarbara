const mongoose = require("mongoose");

const dbToJSON = async () => {
  // This will pull the model out of mongoose
  const Book = mongoose.model("books");

  /*
   * Things to consider for exporting (AlL OF THIS NEEDS TO BE DONE IN THIS SCRIPT):
   * Change the english headers to spanish headers
   * Add the ignored headers from the import and set them to blank
   * Change the array of images to one image (????)
   * Ignore _id and _v
   */
  let booksJSON;
  await Book.find()
    .select({ _id: false, __v: false })
    .sort({ reference: -1 })
    .lean()
    .exec((err, books) => {
      if (err) throw err;
      booksJSON = JSON.stringify(books);
    });
  // doesn't work
  console.log(booksJSON);
  return booksJSON;
};

module.exports = dbToJSON;
