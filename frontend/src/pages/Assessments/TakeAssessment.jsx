import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, HelpCircle, Sparkles } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import API from '../../api/axios';

export default function TakeAssessment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { saveAssessment } = useAppContext();

  const [assessmentData, setAssessmentData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // MENGAMBIL DATA SOAL DARI DATABASE
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/assessments/${id}`);
        const data = response.data;
        
        setAssessmentData(data);
        
        // Format soal dari database ke format UI
        if (data.questions) {
          const formattedQuestions = data.questions.map((q) => {
            const correctIndex = q.correct_answer === 'A' ? 0 : q.correct_answer === 'B' ? 1 : q.correct_answer === 'C' ? 2 : 3;
            return {
              id: q.id,
              question: q.question_text,
              options: [q.option_a, q.option_b, q.option_c, q.option_d],
              correctIndex: correctIndex
            };
          });
          setQuestions(formattedQuestions);
        }
      } catch (err) {
        console.error(err);
        alert('Gagal mengambil data soal ujian.');
        navigate('/dashboard/assessments');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizData();
  }, [id, navigate]);

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

    // HITUNG SKOR DINAMIS
    const correctCount = questions.reduce((acc, q, idx) => {
      return acc + (answers[idx] === q.correctIndex ? 1 : 0);
    }, 0);
    
    const score = Math.round((correctCount / questions.length) * 100);

    const assessmentResult = {
      assessmentId: id,
      title: assessmentData?.title || 'Talent Mapping Assessment',
      score,
      date: new Date().toISOString()
    };

    try {
      setIsSubmitting(true);
      
      const response = await API.post('/assessments/submit', {
        assessment_id: id,
        score
      });

      const finalResult = {
        ...assessmentResult,
        attemptId: response.data?.data?.id?.toString() || Date.now().toString()
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

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="text-center mt-20 text-slate-500 font-bold">Admin belum menambahkan soal untuk ujian ini.</div>;
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col justify-center min-h-[calc(100vh-4rem)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl shadow-slate-150/30 border border-slate-100">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-800 rounded-xl shadow-md flex items-center justify-center shrink-0">
              <HelpCircle size={22} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            </div>
            <h2 className="font-extrabold text-lg md:text-xl text-slate-800 tracking-tight">
              {assessmentData?.title || 'Assessment'}
            </h2>
          </div>

          <span className="px-4 py-1.5 bg-slate-50 text-slate-500 font-bold text-xs rounded-full border border-slate-200/60 shrink-0 shadow-sm">
            Pertanyaan {currentQuestion + 1} dari {questions.length}
          </span>
        </div>

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

        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-xs font-black text-amber-400 uppercase tracking-widest rounded-lg mb-4 shadow-sm border border-slate-700">
            <Sparkles size={14} className="text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]" /> {assessmentData?.category || 'General'}
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed">
            {questions[currentQuestion].question}
          </h3>
        </div>

        <div className="space-y-4">
          {questions[currentQuestion].options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            return (
              <div
                key={index}
                onClick={() => handleSelectOption(index)}
                className={`group p-4 md:p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 flex items-center gap-4 ${
                  isSelected ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50 text-slate-600'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold border-2 transition-colors text-sm shrink-0 ${
                  isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-400 group-hover:border-indigo-300 group-hover:text-indigo-600'
                }`}>
                  {optionLetters[index]}
                </div>
                <span className="font-semibold text-sm md:text-base leading-relaxed">{option}</span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end mt-10 border-t border-slate-100 pt-6">
          <button
            onClick={handleNext}
            disabled={selectedAnswer === undefined || isSubmitting}
            className={`w-full sm:w-auto px-10 py-4 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-base ${
              selectedAnswer !== undefined && !isSubmitting ? 'bg-slate-900 shadow-xl shadow-slate-900/10 hover:bg-slate-800 hover:scale-[1.02]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>Menyimpan... <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div></>
            ) : currentQuestion === questions.length - 1 ? 'Selesai & Lihat Hasil' : (
              <>Pertanyaan Berikutnya <ChevronRight size={18} /></>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}