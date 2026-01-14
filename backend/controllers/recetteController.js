const Recette = require('../models/Recette');

exports.getAll = async (req, res) => {
  try {
    const recettes = await Recette.find().populate('categorieId');
    res.json(recettes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const recette = await Recette.findById(req.params.id).populate('categorieId');
    if (!recette) return res.status(404).json({ message: 'Recette non trouvée' });
    res.json(recette);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getByCategorie = async (req, res) => {
  try {
    const recettes = await Recette.find({ categorieId: req.params.categorie }).populate('categorieId');
    res.json(recettes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    const recettes = await Recette.find({
      $or: [
        { nom: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    }).populate('categorieId');
    res.json(recettes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const recette = new Recette(req.body);
    const newRecette = await recette.save();
    res.status(201).json(newRecette);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const recette = await Recette.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!recette) return res.status(404).json({ message: 'Recette non trouvée' });
    res.json(recette);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const recette = await Recette.findByIdAndDelete(req.params.id);
    if (!recette) return res.status(404).json({ message: 'Recette non trouvée' });
    res.json({ message: 'Recette supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};