import { createClient } from '@supabase/supabase-js';

// 1. Mengambil konfigurasi URL dan Anon Key dari file .env milik Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validasi opsional untuk memastikan variabel lingkungan terisi dengan benar
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Peringatan: VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum dikonfigurasi di file .env"
  );
}

// 2. Inisialisasi client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);