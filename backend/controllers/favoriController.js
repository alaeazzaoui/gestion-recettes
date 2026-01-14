const Favori = require('../models/Favori');

exports.getByClient = async (req, res) => {
  try {
    const favoris = await Favori.find({ clientId: req.params.clientId }).populate('recetteId');
    res.json(favoris);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const favori = new Favori(req.body);
    const newFavori = await favori.save();
    res.status(201).json(newFavori);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const favori = await Favori.findByIdAndDelete(req.params.id);
    if (!favori) return res.status(404).json({ message: 'Favori non trouvé' });
    res.json({ message: 'Favori supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteByClientAndRecette = async (req, res) => {
  try {
    const favori = await Favori.findOneAndDelete({
      clientId: req.params.clientId,
      recetteId: req.params.recetteId
    });
    if (!favori) return res.status(404).json({ message: 'Favori non trouvé' });
    res.json({ message: 'Favori supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};