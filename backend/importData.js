const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Enable Mongoose debugging
mongoose.set('debug', true);

// Define the schema for your garage data
const garageSchema = new mongoose.Schema({
  name: String,
  district: String,
  category: String,
  city: String,
  vehicleTypes: [String],
  phoneNumber: String,
  email: String,
  mailAddress: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

// Create a model
const Garage = mongoose.model('Garage', garageSchema);

// Connect to MongoDB with increased timeout
mongoose.connect('mongodb+srv://GarageSri:ustFKdyCiX73EW1J@garage.osteb.mongodb.net/?retryWrites=true&w=majority&appName=Garage', {
  connectTimeoutMS: 30000,
});

// Read JSON data
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'garages.json'), 'utf-8'));

// Import data to MongoDB
const importData = async () => {
  try {
    await Garage.insertMany(data);
    console.log('Data Imported Successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error importing data:', error);
    mongoose.connection.close();
  }
};

// Call the function
importData();
