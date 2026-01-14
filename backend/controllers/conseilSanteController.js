const ConseilSante = require('../models/ConseilSante');

exports.getAll = async (req, res) => {
  try {
    const conseils = await ConseilSante.find();
    res.json(conseils);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const conseil = await ConseilSante.findById(req.params.id);
    if (!conseil) return res.status(404).json({ message: 'Conseil non trouvé' });
    res.json(conseil);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const conseil = new ConseilSante(req.body);
    const newConseil = await conseil.save();
    res.status(201).json(newConseil);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const conseil = await ConseilSante.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!conseil) return res.status(404).json({ message: 'Conseil non trouvé' });
    res.json(conseil);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const conseil = await ConseilSante.findByIdAndDelete(req.params.id);
    if (!conseil) return res.status(404).json({ message: 'Conseil non trouvé' });
    res.json({ message: 'Conseil supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};