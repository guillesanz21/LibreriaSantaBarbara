const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    unique: [true, "ERROR (MongoDB): The username is duplicated"],
    minlength: 1,
    lowercase: true,
  },
  password: {
    type: String,
    minlength: 1,
  },
  googleId: {
    type: String,
    unique: [true, "ERROR (MongoDB): The Google ID is duplicated"],
  },
  /*
  twitterId: {
    type: String,
    unique: [true, "ERROR (MongoDB): The Twitter ID is duplicated"],
  },
  facebookId: {
    type: String,
    unique: [true, "ERROR (MongoDB): The Facebook ID is duplicated"],
  },
  */
  isAdmin: {
    type: Boolean,
    default: false,
  },

  // ############## TO-DO ##############
  // address, invoicing, dni, name, last name, email (sames as username?)...
});

// This will load the schema into mongoose
mongoose.model("users", userSchema);
