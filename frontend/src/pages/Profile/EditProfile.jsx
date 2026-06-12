import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X, User, Mail, MapPin, AlignLeft, Check } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import API from '../../api/axios';
import Swal from 'sweetalert2';

export default function EditProfile() {
  const { user, updateProfile, login } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || 'Indonesia',
    bio: user?.bio || '',
  });

  // State untuk penanganan foto
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.image || null);
  const fileInputRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handler saat file dipilih dari komputer
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran (Maksimal 2MB)
      if (file.size > 2 * 1024 * 1024) {
        return Swal.fire({
          icon: 'warning',
          title: 'File Terlalu Besar',
          text: 'Ukuran foto maksimal adalah 2MB.',
          confirmButtonColor: '#071226'
        });
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Tampilkan preview instan
    }
  };

  // Handler untuk tombol "Hapus" foto
  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handler utama saat tombol "Simpan Perubahan" diklik
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let finalImageUrl = user?.image;

      // 1. Jika ada foto baru yang dipilih, upload dulu ke server (ImgBB)
      if (selectedFile) {
        const imageFormData = new FormData();
        imageFormData.append('profile_image', selectedFile);

        const uploadRes = await API.post('/users/upload-photo', imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        finalImageUrl = uploadRes.data.imageUrl;
      } else if (!previewUrl) {
        // Jika user sengaja menghapus foto, pastikan url kosong
        finalImageUrl = null; 
      }

      // 2. Gabungkan data teks dengan URL foto terbaru
      const finalData = { ...formData, image: finalImageUrl };

      // 3. Simpan data ke context / database
      if (updateProfile) {
        await updateProfile(finalData);
      } else if (login) {
        // Fallback jika tidak ada fungsi updateProfile khusus
        const updatedUser = { ...user, ...finalData };
        localStorage.setItem('growpath_user', JSON.stringify(updatedUser));
        await login(updatedUser);
      }

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil Disimpan!',
        text: 'Profil Anda telah diperbarui.',
        confirmButtonColor: '#071226',
        timer: 2000,
        showConfirmButton: false
      });

      navigate('/dashboard/profile');

    } catch (error) {
      console.error('Update Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: error.response?.data?.message || 'Terjadi kesalahan sistem.',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 p-4 md:p-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Edit Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Perbarui informasi personal dan foto profil Anda.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/profile')}
          className="p-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-full transition-all text-slate-500 shadow-sm"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
        
        {/* ========================================= */}
        {/* PROFILE PICTURE SECTION */}
        {/* ========================================= */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Profile Picture</h2>
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#071226] to-slate-800 flex items-center justify-center text-white shadow-xl group-hover:shadow-slate-800/50 transition-all duration-300 overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User size={56} strokeWidth={2} className="text-slate-300" />
                )}
              </div>
              <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-white rounded-2xl border-4 border-white flex items-center justify-center text-[#071226] shadow-md group-hover:scale-110 transition-transform">
                <Camera size={20} />
              </div>
            </div>

            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/png, image/jpeg, image/jpg" 
              className="hidden" 
            />

            <div className="space-y-4 text-center sm:text-left mt-2">
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                Unggah foto profil baru. Kami merekomendasikan gambar dengan rasio 1:1, berukuran setidaknya <strong>400x400px</strong>.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current.click()}
                  className="px-6 py-2.5 bg-[#071226] text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-md"
                >
                  Pilih Foto
                </button>
                {(previewUrl || selectedFile) && (
                  <button 
                    type="button" 
                    onClick={handleRemovePhoto}
                    className="px-6 py-2.5 bg-white text-slate-500 border border-slate-200 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* FORM INPUTS SECTION */}
        {/* ========================================= */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm space-y-8">
          <h2 className="text-xl font-extrabold text-slate-800 mb-2">Informasi Personal</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 font-semibold"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  name="email"
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly // Email biasanya readOnly agar tidak konflik dengan auth
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-100 opacity-70 cursor-not-allowed transition-all text-slate-700 font-semibold"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <MapPin size={18} />
                </div>
                <input 
                  type="text" 
                  name="location"
                  placeholder="Contoh: Jakarta, Indonesia"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 font-semibold"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Short Bio</label>
              <div className="relative">
                <div className="absolute top-4 left-4 text-slate-400 pointer-events-none">
                  <AlignLeft size={18} />
                </div>
                <textarea 
                  name="bio"
                  rows={4}
                  placeholder="Tulis sedikit deskripsi tentang minat dan fokus belajarmu..."
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 font-medium resize-none"
                ></textarea>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-medium ml-1">
                Deskripsi singkat untuk profil Anda. Maksimal 200 karakter.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button 
              type="submit"
              disabled={isSaving}
              className={`w-full md:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-bold transition-all shadow-lg ${
                isSaving 
                ? 'bg-slate-400 text-white cursor-not-allowed' 
                : 'bg-[#071226] text-white hover:bg-slate-800 shadow-[#071226]/20 hover:-translate-y-0.5'
              }`}
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Check size={20} /> Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}