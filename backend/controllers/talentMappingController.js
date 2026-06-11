const TalentModel = require('../models/talentMappingModel');

const isSuperAdmin = (user) => user && user.role === 'superadmin';

exports.getTalentMappings = async (req, res) => {
  try {
    const data = await TalentModel.getAllTalentMappings();

    console.log('USER LOGIN:', req.user);
    console.log('TOTAL TALENT DIKIRIM:', data.length);

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil data talenta',
      detail: error.message
    });
  }
};

// TAMBAHAN: Handle Update (Edit)
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

// TAMBAHAN: Handle Delete (Hapus) - Terkunci untuk Superadmin
exports.deleteTalent = async (req, res) => {
  try {
    if (!isSuperAdmin(req.user)) {
      return res.status(403).json({ message: 'Akses ditolak! Hanya Superadmin yang boleh menghapus data.' });
    }

    const { id } = req.params;
    const deletedData = await TalentModel.deleteTalentMapping(id);
    if (!deletedData) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json({ message: "Berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus data', detail: error.message });
  }
};