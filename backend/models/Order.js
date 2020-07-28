const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  _book: {
    type: Schema.Types.ObjectId,
    ref: "Book",
  },
  status: {
    type: String,
    enum: [
      "pendiente",
      "cancelado",
      "aceptado",
      "pagado",
      "cobrado",
      "enviado",
      "entregado",
    ],
    default: "pendiente",
  },
  date: Date,
});

// This will load the schema into mongoose
mongoose.model("orders", orderSchema);
