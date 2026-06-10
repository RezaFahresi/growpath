// backend/controllers/talentMappingController.js
const TalentModel = require('../models/talentMappingModel');

exports.getTalentMappings = async (req, res) => {
  try {
    const data = await TalentModel.getAllTalentMappings();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data talenta', detail: error.message });
  }
};

// 🔥 TAMBAHAN: Handle Update (Edit)
exports.updateTalent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = await TalentModel.updateTalentMapping(id, req.body);
    if (!updatedData) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json({ message: "Berhasil diupdate", data: updatedData });
  } catch (error) {
    res.status(500).json({ message: 'Gagal update data', detail: error.message });
  }
};

// 🔥 TAMBAHAN: Handle Delete (Hapus)
exports.deleteTalent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedData = await TalentModel.deleteTalentMapping(id);
    if (!deletedData) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json({ message: "Berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus data', detail: error.message });
  }
};