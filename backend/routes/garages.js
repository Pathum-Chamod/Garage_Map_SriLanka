const express = require('express');
const router = express.Router();
const Garage = require('../models/garage'); 
const validateGarage = require('../middleware/garageValidation'); // Import validation middleware
const authenticate = require('../middleware/authMiddleware'); // Import authentication middleware

// GET all garages with optional filters
router.get('/', async (req, res) => {
  try {
    const { district, city, service, vehicle } = req.query;

    // Construct the query based on filters
    const query = {};

    // Apply district filter
    if (district && district !== 'All of Sri Lanka') {
      query.district = district;
    }

    // Apply city filter, ensuring that "All of [District]" is handled
    if (city && city !== 'All Cities' && !city.startsWith('All of')) {
      query.city = city;
    } else if (city && city.startsWith('All of')) {
      // If "All of [District]" is selected, ensure the district filter is used
      query.district = city.replace('All of ', '');
    }

    // Service category filter
    if (service && service !== 'All Services') {
      query.category = service;
    }

    // Vehicle type filter - use $in to match against vehicleTypes array
    if (vehicle && vehicle !== 'All Types') {
      query.vehicleTypes = { $in: [vehicle] };
    }

    // Debugging: Log the constructed query and request parameters
    console.log('Request Query:', req.query);
    console.log('Constructed MongoDB Query:', query);

    // Fetch garages based on the query
    const garages = await Garage.find(query);
    
    // Debugging: Log the response data to verify filtering results
    console.log('Fetched Garages:', garages);

    res.status(200).json(garages);
  } catch (error) {
    console.error('Error fetching garages:', error);
    res.status(500).json({ error: 'Error fetching garages. Please try again later.' });
  }
});

// Add a new garage (protected route - requires authentication)
router.post('/', authenticate, validateGarage, async (req, res) => {
  try {
    const newGarage = new Garage(req.body);
    await newGarage.save();
    res.status(201).json(newGarage);
  } catch (error) {
    console.error('Error adding a new garage:', error);
    res.status(400).json({ error: 'Error adding a new garage. Please try again later.' });
  }
});

// Get a single garage by ID
router.get('/:id', async (req, res) => {
  try {
    const garage = await Garage.findById(req.params.id);
    if (!garage) {
      return res.status(404).json({ error: 'Garage not found' });
    }
    res.status(200).json(garage);
  } catch (error) {
    console.error('Error fetching the garage:', error);
    res.status(500).json({ error: 'Error fetching the garage. Please try again later.' });
  }
});

// Update a garage by ID (Optional - requires authentication)
router.put('/:id', authenticate, validateGarage, async (req, res) => {
  try {
    const updatedGarage = await Garage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedGarage) {
      return res.status(404).json({ error: 'Garage not found' });
    }
    res.status(200).json(updatedGarage);
  } catch (error) {
    console.error('Error updating the garage:', error);
    res.status(400).json({ error: 'Error updating the garage. Please try again later.' });
  }
});

// Delete a garage by ID (Optional - requires authentication)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const deletedGarage = await Garage.findByIdAndDelete(req.params.id);
    if (!deletedGarage) {
      return res.status(404).json({ error: 'Garage not found' });
    }
    res.status(200).json({ message: 'Garage deleted successfully' });
  } catch (error) {
    console.error('Error deleting the garage:', error);
    res.status(500).json({ error: 'Error deleting the garage. Please try again later.' });
  }
});

module.exports = router;
