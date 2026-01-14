const Ingredient = require('../models/Ingredient');

exports.getAll = async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) return res.status(404).json({ message: 'Ingrédient non trouvé' });
    res.json(ingredient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getByFamille = async (req, res) => {
  try {
    const ingredients = await Ingredient.find({ famille: req.params.famille });
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const ingredient = new Ingredient(req.body);
    const newIngredient = await ingredient.save();
    res.status(201).json(newIngredient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ingredient) return res.status(404).json({ message: 'Ingrédient non trouvé' });
    res.json(ingredient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
    if (!ingredient) return res.status(404).json({ message: 'Ingrédient non trouvé' });
    res.json({ message: 'Ingrédient supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};