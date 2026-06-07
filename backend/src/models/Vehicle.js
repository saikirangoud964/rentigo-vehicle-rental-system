const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["2W", "4W"],
      required: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      trim: true,
    },

    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "CNG"],
    },

    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
    },

    pricePerDay: {
      type: Number,
      required: true,
      min: 1,
    },

    available: {
      type: Boolean,
      default: true,
    },

    image: {
      type: String,
      default: "",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
