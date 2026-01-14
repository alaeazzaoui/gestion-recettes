const Admin = require('../models/Admin');

exports.getAll = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin non trouvé' });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { password, ...data } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ ...data, password: hashedPassword });
    const newAdmin = await admin.save();
    const adminData = newAdmin.toObject();
    delete adminData.password;
    res.status(201).json(adminData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, admin: { id: admin._id, email: admin.email, nom: admin.nom } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin non trouvé' });
    res.json(admin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin non trouvé' });
    res.json({ message: 'Admin supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
