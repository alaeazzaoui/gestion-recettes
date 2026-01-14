const Client = require('../models/Client');

exports.getAll = async (req, res) => {
  try {
    const clients = await Client.find().select('-password');
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).select('-password');
    if (!client) return res.status(404).json({ message: 'Client non trouvé' });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { password, ...data } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const client = new Client({ ...data, password: hashedPassword });
    const newClient = await client.save();
    const clientData = newClient.toObject();
    delete clientData.password;
    res.status(201).json(clientData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!client) return res.status(404).json({ message: 'Client non trouvé' });
    res.json(client);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client non trouvé' });
    res.json({ message: 'Client supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
