const ListeCourse = require('../models/ListeCourse');

exports.getByClient = async (req, res) => {
  try {
    const items = await ListeCourse.find({ clientId: req.params.clientId }).populate('ingredientId');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const item = new ListeCourse(req.body);
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await ListeCourse.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Article non trouvé' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.markAsAchete = async (req, res) => {
  try {
    const item = await ListeCourse.findByIdAndUpdate(
      req.params.id,
      { achete: true },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Article non trouvé' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const item = await ListeCourse.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Article non trouvé' });
    res.json({ message: 'Article supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAllByClient = async (req, res) => {
  try {
    await ListeCourse.deleteMany({ clientId: req.params.clientId });
    res.json({ message: 'Liste de courses vidée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};