const TalentModel = require('../models/talentMappingModel');

exports.getTalentMappings = async (req, res) => {
  try {
    const data = await TalentModel.getAllTalentMappings();
    res.json(data);
  } catch (error) {
    console.error("Error getTalentMappings:", error);
    res.status(500).json({ message: 'Gagal mengambil data talenta' });
  }
};