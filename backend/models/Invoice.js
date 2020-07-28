const mongoose = require("mongoose");
const { Schema } = mongoose;

const invoiceSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  _book: {
    type: Schema.Types.ObjectId,
    ref: "Book",
  },
  date: Date,
});

// This will load the schema into mongoose
mongoose.model("invoices", invoiceSchema);
