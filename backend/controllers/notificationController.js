const Notification = require('../models/Notification');

exports.getByClient = async (req, res) => {
  try {
    const notifications = await Notification.find({ clientId: req.params.clientId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNonLues = async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      clientId: req.params.clientId,
      lue: false 
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    const newNotification = await notification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.markAsLue = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { lue: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification non trouvée' });
    res.json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.markAllAsLue = async (req, res) => {
  try {
    await Notification.updateMany(
      { clientId: req.params.clientId, lue: false },
      { lue: true }
    );
    res.json({ message: 'Toutes les notifications marquées comme lues' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification non trouvée' });
    res.json({ message: 'Notification supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};