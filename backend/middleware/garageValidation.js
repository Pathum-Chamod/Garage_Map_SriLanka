const Joi = require('joi');

// Define a Joi schema to validate the garage data
const garageSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name is required',
  }),
  address: Joi.string().required().messages({
    'string.empty': 'Address is required',
  }),
  city: Joi.string().required().messages({
    'string.empty': 'City is required',
  }),
  contactNumber: Joi.string().optional(),
  services: Joi.array().items(Joi.string()).optional(),
  location: Joi.object({
    type: Joi.string().valid('Point').required().messages({
      'any.only': 'Location type must be "Point"',
    }),
    coordinates: Joi.array().items(Joi.number()).length(2).required().messages({
      'array.length': 'Coordinates must have exactly two numbers [longitude, latitude]',
    }),
  }).required().messages({
    'object.base': 'Location is required and should include type and coordinates',
  }),
});

// Middleware function to validate garage data
const validateGarage = (req, res, next) => {
  const { error } = garageSchema.validate(req.body, { abortEarly: false });
  if (error) {
    // Combine all error messages for better feedback
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).send(errorMessage);
  }
  next();
};

module.exports = validateGarage;
