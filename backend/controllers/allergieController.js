const Allergie = require('../models/Allergie');

exports.getAll = async (req, res) => {
  try {
    const allergies = await Allergie.find();
    res.json(allergies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const allergie = await Allergie.findById(req.params.id);
    if (!allergie) return res.status(404).json({ message: 'Allergie non trouvée' });
    res.json(allergie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const allergie = new Allergie(req.body);
    const newAllergie = await allergie.save();
    res.status(201).json(newAllergie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const allergie = await Allergie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!allergie) return res.status(404).json({ message: 'Allergie non trouvée' });
    res.json(allergie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const allergie = await Allergie.findByIdAndDelete(req.params.id);
    if (!allergie) return res.status(404).json({ message: 'Allergie non trouvée' });
    res.json({ message: 'Allergie supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};