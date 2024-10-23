// Step 3.1: Import mongoose
const mongoose = require('mongoose');

// Step 3.2: Define the schema for the garage collection
const garageSchema = new mongoose.Schema({
  // Garage name, required field
  name: {
    type: String,
    required: true,
  },
  // Address of the garage, required field
  address: {
    type: String,
    required: true,
  },
  // City in which the garage is located, required field
  city: {
    type: String,
    required: true,
  },
  // Contact number of the garage (not required)
  contactNumber: {
    type: String,
  },
  // List of services offered by the garage
  services: {
    type: [String], // An array of strings, e.g., ["Repair", "Towing"]
  },
  // Location information for the garage, includes type and coordinates
  location: {
    type: {
      type: String,
      enum: ['Point'], // The type of geometry, must be "Point"
      required: true,
    },
    coordinates: {
      type: [Number], // Latitude and Longitude coordinates
      required: true,
    },
  },
});

// Step 3.3: Create a spatial index to allow geo-queries
garageSchema.index({ location: '2dsphere' });

// Step 3.4: Create the model using the schema
const Garage = mongoose.model('Garage', garageSchema);

// Step 3.5: Export the model to use it in other parts of the project
module.exports = Garage;
