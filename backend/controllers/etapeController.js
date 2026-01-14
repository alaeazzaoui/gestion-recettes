const Etape = require('../models/Etape');

exports.getAll = async (req, res) => {
  try {
    const etapes = await Etape.find().populate('recetteId');
    res.json(etapes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const etape = await Etape.findById(req.params.id).populate('recetteId');
    if (!etape) return res.status(404).json({ message: 'Étape non trouvée' });
    res.json(etape);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getByRecette = async (req, res) => {
  try {
    const etapes = await Etape.find({ recetteId: req.params.recetteId }).sort({ numero: 1 });
    res.json(etapes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const etape = new Etape(req.body);
    const newEtape = await etape.save();
    res.status(201).json(newEtape);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const etape = await Etape.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!etape) return res.status(404).json({ message: 'Étape non trouvée' });
    res.json(etape);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const etape = await Etape.findByIdAndDelete(req.params.id);
    if (!etape) return res.status(404).json({ message: 'Étape non trouvée' });
    res.json({ message: 'Étape supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};