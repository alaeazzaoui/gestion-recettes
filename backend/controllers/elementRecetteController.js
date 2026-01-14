const ElementRecette = require('../models/ElementRecette');

exports.getAll = async (req, res) => {
  try {
    const elements = await ElementRecette.find().populate('recetteId ingredientId');
    res.json(elements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const element = await ElementRecette.findById(req.params.id).populate('recetteId ingredientId');
    if (!element) return res.status(404).json({ message: 'Élément non trouvé' });
    res.json(element);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getByRecette = async (req, res) => {
  try {
    const elements = await ElementRecette.find({ recetteId: req.params.recetteId }).populate('ingredientId');
    res.json(elements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const element = new ElementRecette(req.body);
    const newElement = await element.save();
    res.status(201).json(newElement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const element = await ElementRecette.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!element) return res.status(404).json({ message: 'Élément non trouvé' });
    res.json(element);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const element = await ElementRecette.findByIdAndDelete(req.params.id);
    if (!element) return res.status(404).json({ message: 'Élément non trouvé' });
    res.json({ message: 'Élément supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
