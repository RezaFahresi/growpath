import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, HelpCircle, Sparkles } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import API from '../../api/axios';

export default function TakeAssessment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { saveAssessment, availableAssessments } = useAppContext();

  const assessmentData = availableAssessments.find(
    (a) => String(a.id) === String(id)
  );

  // BANK SOAL IT KOMPREHENSIF (TALENT MAPPING DASAR)
  const questions = [
    {
      id: 1,
      question: "Manakah dari teknologi berikut yang digunakan untuk menstrukturkan kerangka utama sebuah halaman web?",
      options: ["CSS", "HTML", "JavaScript", "SQL"],
      correctIndex: 1 
    },
    {
      id: 2,
      question: "Di bawah ini, manakah yang merupakan peran utama dari sebuah Web Server API dalam arsitektur software?",
      options: [
        "Mendesain antarmuka visual aplikasi", 
        "Menghubungkan client dengan database dan memproses logika bisnis", 
        "Menyimpan file gambar secara lokal di komputer user", 
        "Mempercepat rendering animasi CSS"
      ],
      correctIndex: 1
    },
    {
      id: 3,
      question: "Dalam dunia UI/UX design, apa fungsi utama dari pembuatan sebuah Wireframe?",
      options: [
        "Membuat animasi transisi halaman",
        "Menyusun kerangka tata letak layout digital tanpa elemen visual detail",
        "Menulis kode CSS untuk responsivitas layar ponsel",
        "Melakukan backup basis data server ke cloud"
      ],
      correctIndex: 1
    },
    {
      id: 4,
      question: "Sintaks standar SQL manakah yang digunakan secara khusus untuk mengambil atau menampilkan data dari tabel database?",
      options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
      correctIndex: 2 
    },
    {
      id: 5,
      question: "Apa keuntungan utama menggunakan arsitektur komponen seperti React dalam pengembangan Frontend?",
      options: [
        "Komponen dapat digunakan kembali (reusable) sehingga mempercepat development",
        "Secara otomatis membuat database PostgreSQL",
        "Menghilangkan kebutuhan memprogram logika Javascript",
        "Membuat aplikasi langsung terbit di Google Play Store"
      ],
      correctIndex: 0
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectOption = (optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: optionIndex
    }));
  };

  const selectedAnswer = answers[currentQuestion];

  const handleNext = async () => {
    const isLast = currentQuestion === questions.length - 1;

    if (!isLast) {
      setCurrentQuestion((prev) => prev + 1);
      return;
    }

    const correctCount = questions.reduce((acc, q, idx) => {
      return acc + (answers[idx] === q.correctIndex ? 1 : 0);
    }, 0);
    
    const score = Math.round((correctCount / questions.length) * 100);

    const breakdown = [
      { topic: 'React & Frontend Basics', score: answers[4] === questions[4].correctIndex || answers[0] === questions[0].correctIndex ? 90 : 55 },
      { topic: 'Logic & API Systems', score: answers[1] === questions[1].correctIndex ? 85 : 50 },
      { topic: 'UI/UX Principles', score: answers[2] === questions[2].correctIndex ? 90 : 60 },
      { topic: 'Database Fundamentals', score: answers[3] === questions[3].correctIndex ? 95 : 45 }
    ];

    const assessmentResult = {
      assessmentId: id,
      title: assessmentData?.title || 'Talent Mapping Assessment',
      score,
      date: new Date().toISOString(),
      breakdown,
      recommendation:
        score >= 80
          ? "Great job! Anda memiliki pemahaman logika IT yang sangat kuat."
          : "Focus more on fundamentals. Mari bangun fondasi dasarmu bersama-sama."
    };

    try {
      setIsSubmitting(true);
      
      const response = await API.post('/assessments/submit', {
        assessment_id: id,
        score
      });

      const data = response.data;

      const finalResult = {
        ...assessmentResult,
        attemptId: data?.data?.id?.toString() || Date.now().toString()
      };

      saveAssessment(finalResult);
      navigate(`/dashboard/assessments/result/${finalResult.attemptId}`);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Submit failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    // Margin diseragamkan: max-w-4xl, w-full, p-4 md:p-8 agar fit in
    <div className="max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col justify-center min-h-[calc(100vh-4rem)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl shadow-slate-150/30 border border-slate-100">

        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 mb-6 gap-4">
          <div className="flex items-center gap-3">
            {/* Ikon di-highlight dengan background abu tua dan glow */}
            <div className="p-2.5 bg-slate-800 rounded-xl shadow-md flex items-center justify-center shrink-0">
              <HelpCircle size={22} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            </div>
            <h2 className="font-extrabold text-lg md:text-xl text-slate-800 tracking-tight">
              {assessmentData?.title || 'Talent Mapping Assessment'}
            </h2>
          </div>

          <span className="px-4 py-1.5 bg-slate-50 text-slate-500 font-bold text-xs rounded-full border border-slate-200/60 shrink-0 shadow-sm">
            Pertanyaan {currentQuestion + 1} dari {questions.length}
          </span>
        </div>

        {/* Progress Bar Area */}
        <div className="space-y-2 mb-10">
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-2.5 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Progress Pengerjaan</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Soal Kuis */}
        <div className="mb-8">
          {/* Badge Kategori dengan warna solid */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-xs font-black text-amber-400 uppercase tracking-widest rounded-lg mb-4 shadow-sm border border-slate-700">
            <Sparkles size={14} className="text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]" /> Kompetensi IT Dasar
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed">
            {questions[currentQuestion].question}
          </h3>
        </div>

        {/* Pilihan Ganda */}
        <div className="space-y-4">
          {questions[currentQuestion].options.map((option, index) => {
            const isSelected = selectedAnswer === index;

            return (
              <div
                key={index}
                onClick={() => handleSelectOption(index)}
                className={`group p-4 md:p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 flex items-center gap-4 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm'
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50 text-slate-600'
                }`}
              >
                {/* Badge Abjad (A, B, C, D) */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold border-2 transition-colors text-sm shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white border-slate-200 text-slate-400 group-hover:border-indigo-300 group-hover:text-indigo-600'
                }`}>
                  {optionLetters[index]}
                </div>
                
                <span className="font-semibold text-sm md:text-base leading-relaxed">
                  {option}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer Navigation Bar */}
        <div className="flex justify-end mt-10 border-t border-slate-100 pt-6">
          <button
            onClick={handleNext}
            disabled={selectedAnswer === undefined || isSubmitting}
            className={`w-full sm:w-auto px-10 py-4 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-base ${
              selectedAnswer !== undefined && !isSubmitting
                ? 'bg-slate-900 shadow-xl shadow-slate-900/10 hover:bg-slate-800 hover:scale-[1.02]'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>Menyimpan Jawaban... <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div></>
            ) : currentQuestion === questions.length - 1 ? (
              'Selesai & Lihat Hasil'
            ) : (
              <>Pertanyaan Berikutnya <ChevronRight size={18} /></>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}