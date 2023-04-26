const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema
const DogSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 50 },
  breed: { type: Schema.Types.ObjectId, ref: "Breed", required: true },
  favoriteFood: { type: String, maxLength: 50 },
  description: { type: String, required: true, minLength: 3 },
});

// Virtual for dog's url
DogSchema.virtual("url").get(function () {
  // We don't use an arrow function as we will need the 'this object'.
  return this._id;
});

// Export model
module.exports = mongoose.model("Dog", DogSchema);
