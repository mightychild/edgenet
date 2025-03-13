const Points = require('../models/Points');

const getExtensionData = async (req, res) => {
  try {
    const points = await Points.findOne({ userId: req.userId });
    if (!points) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(points);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getExtensionData };