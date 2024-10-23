const Joi = require('joi');

// Define a Joi schema to validate the garage data
const garageSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  contactNumber: Joi.string().optional(),
  services: Joi.array().items(Joi.string()).optional(),
  location: Joi.object({
    type: Joi.string().valid('Point').required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
  }).required(),
});

// Middleware function to validate garage data
const validateGarage = (req, res, next) => {
  const { error } = garageSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

module.exports = validateGarage;
