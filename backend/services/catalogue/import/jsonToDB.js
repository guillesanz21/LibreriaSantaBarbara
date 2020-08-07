const mongoose = require("mongoose");

const jsonToDB = async (books) => {
  let successful = false;
  // This will pull the model out of mongoose
  const Book = mongoose.model("books");

  /*
   * Maybe in the future:
   * Get the last reference number stored and slice the booksArray (from CSV) in two parts:
   * from 0 to the reference number: check for updates and delete the sold books.
   * from the reference number to the very end: insertMany().
   * For the update part maybe convert the document model to JSON object and check the differences, if
   * one book doesn't exist anymore, delete it, and if one parameter has changed, update it.
   * Problem: the csv exported may have the last book stored in the database sold, therefore, it won't work
   * when slicing the array
   */

  await Book.deleteMany((err) => {
    console.log("Book collection dropped");
  });

  await Book.insertMany(books, (err, docs) => {
    if (err) throw err;
    successful = true;
    console.info("%d books were successfully stored.", docs.length);
  });

  return true;

  // In order to find the last book reference stored in the db, use:
  // This will pull the model out of mongoose
  /* const Book = mongoose.model("books");
    Book.findOne()
        .sort({
        reference: -1,
        })
        .exec((err, book) => {
        console.log(book.reference);
        }); */
};

module.exports = jsonToDB;
