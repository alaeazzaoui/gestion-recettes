const Notation = require('../models/Notation');

exports.getByRecette = async (req, res) => {
  try {
    const notations = await Notation.find({ recetteId: req.params.recetteId }).populate('clientId');
    res.json(notations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getByClient = async (req, res) => {
  try {
    const notations = await Notation.find({ clientId: req.params.clientId }).populate('recetteId');
    res.json(notations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMoyenneByRecette = async (req, res) => {
  try {
    const notations = await Notation.find({ recetteId: req.params.recetteId });
    if (notations.length === 0) {
      return res.json({ moyenne: 0, total: 0 });
    }
    const total = notations.reduce((sum, n) => sum + n.note, 0);
    const moyenne = total / notations.length;
    res.json({ moyenne: moyenne.toFixed(2), total: notations.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const notation = new Notation(req.body);
    const newNotation = await notation.save();
    res.status(201).json(newNotation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const notation = await Notation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!notation) return res.status(404).json({ message: 'Notation non trouvée' });
    res.json(notation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const notation = await Notation.findByIdAndDelete(req.params.id);
    if (!notation) return res.status(404).json({ message: 'Notation non trouvée' });
    res.json({ message: 'Notation supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};