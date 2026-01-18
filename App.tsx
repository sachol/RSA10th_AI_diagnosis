
import React, { useState, useEffect, useRef } from 'react';
import { 
  BrainCircuit, 
  Building2, 
  Trophy, 
  RefreshCcw, 
  ArrowRight,
  ClipboardCheck,
  Clock,
  Sparkles,
  Zap,
  Quote,
  User,
  ShieldCheck,
  Rocket,
  Copy,
  CheckCircle2,
  FileText,
  Info,
  X,
  FileDown
} from 'lucide-react';
import { AppState, Question, QuizResult } from './types';
import { QUESTIONS } from './constants';
import { getMentorFeedback } from './services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Fix: Added shuffle utility function to resolve 'Cannot find name shuffle' errors
const shuffle = <T,>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const Header: React.FC = () => (
  <header className="py-6 px-8 max-w-6xl mx-auto w-full flex justify-between items-center relative z-20">
    <div className="flex items-center gap-4 group cursor-default">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-indigo-700 p-2.5 rounded-[1rem] shadow-lg shadow-indigo-900/20 border border-white/10 transition-transform duration-500 hover:scale-110">
        <Building2 size={24} className="text-white" />
      </div>
      <div>
        <h1 className="font-black text-xl text-slate-900 tracking-tight flex items-baseline gap-1">
          RSA AI <span className="text-indigo-600 text-lg font-extrabold uppercase tracking-widest">Forum</span>
        </h1>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none mt-1">Diagnosis Elite System</p>
      </div>
    </div>
    <div className="hidden md:flex items-center gap-4 bg-white/40 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white shadow-sm text-[11px] font-bold text-slate-500 transition-all hover:bg-white/60">
      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
      개발자: <span className="text-slate-900 font-black tracking-tight">RSA AI FORUM</span>
    </div>
  </header>
);

const Footer: React.FC = () => (
  <footer className="py-12 text-center text-slate-400 text-sm mt-auto border-t border-slate-100 bg-white/40 backdrop-blur-2xl">
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-full border border-slate-100 shadow-sm">
        <BrainCircuit size={16} className="text-indigo-600" />
        <span className="font-black tracking-[0.2em] uppercase text-[10px] text-slate-600">RSA AI FORUM - Innovation Center</span>
      </div>
      <p className="text-[11px] font-semibold text-slate-400 max-w-sm leading-relaxed">
        본 프로그램은 RSA 10기 공인중개사분들의<br/>압도적인 경쟁력 확보를 위해 설계되었습니다.
      </p>
    </div>
  </footer>
);

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('START');
  const [userName, setUserName] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: number, selectedOption: number, isCorrect: boolean }[]>([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [mentorMsg, setMentorMsg] = useState('');
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const timerRef = useRef<number | null>(null);

  const startQuiz = () => {
    if (!userName.trim()) return;
    const easy = shuffle(QUESTIONS.filter(q => q.difficulty === 'EASY')).slice(0, 4);
    const med = shuffle(QUESTIONS.filter(q => q.difficulty === 'MEDIUM')).slice(0, 4);
    const hard = shuffle(QUESTIONS.filter(q => q.difficulty === 'HARD')).slice(0, 4);
    setSelectedQuestions([...easy, ...med, ...hard]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setAppState('QUIZ');
    setTimeLeft(15);
  };

  const handleAnswer = (optionIndex: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const currentQ = selectedQuestions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQ.correctAnswer;
    const newAnswers = [...answers, { questionId: currentQ.id, selectedOption: optionIndex, isCorrect }];
    setAnswers(newAnswers);
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(15);
    } else {
      const score = newAnswers.filter(a => a.isCorrect).length;
      const result = { score, total: selectedQuestions.length, answers: newAnswers, userName };
      setQuizResult(result);
      setAppState('RESULTS');
      generateFeedback(result);
    }
  };

  useEffect(() => {
    if (appState === 'QUIZ') {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAnswer(-1); 
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [appState, currentQuestionIndex]);

  const generateFeedback = async (result: QuizResult) => {
    setIsLoadingFeedback(true);
    const feedback = await getMentorFeedback(result);
    setMentorMsg(feedback);
    setIsLoadingFeedback(false);
  };

  const copyMentorMessage = async () => {
    try {
      await navigator.clipboard.writeText(mentorMsg);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) { console.error("Copy failed", err); }
  };

  const downloadReportFile = (type: 'md' | 'txt') => {
    if (!quizResult) return;
    const date = new Date().toLocaleDateString();
    let content = `[RSA AI 진단 리포트 - ${quizResult.userName} 공인중개사님]\n`;
    content += `날짜: ${date}\n`;
    content += `점수: ${quizResult.score} / ${quizResult.total} (${Math.round((quizResult.score / quizResult.total) * 100)}%)\n\n`;
    content += `==================================================\n`;
    content += `📩 노제승 교수님의 마중물 편지\n`;
    content += `==================================================\n\n`;
    content += `${mentorMsg}\n\n`;
    content += `Developed by RSA AI FORUM`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RSA_AI_Report_${quizResult.userName}.${type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F9FF] relative overflow-x-hidden antialiased">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 md:p-10 relative z-10 perspective-lg">
        {appState === 'START' && (
          <div className="max-w-2xl w-full animate-in fade-in zoom-in duration-700">
            <div className="bg-white rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(79,70,229,0.12)] p-10 md:p-16 text-center border border-white relative overflow-hidden group hover-3d transition-all duration-700">
              <button onClick={() => setShowInfo(true)} className="absolute top-8 right-8 p-2 rounded-full bg-slate-50 text-slate-400 hover:text-indigo-600 transition-all z-30">
                <Info size={24} />
              </button>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-indigo-100">
                  <Sparkles size={14} className="animate-pulse" /> RSA 10기 리터러시 진단
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-10 leading-[1.2] tracking-tight">
                  AI 시대를 주도하는<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">스마트 공인중개사</span>
                </h2>
                <div className="space-y-6 max-w-sm mx-auto relative">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <User size={20} className="text-slate-400" />
                    </div>
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && userName.trim() && startQuiz()} placeholder="성함을 입력해 주세요" className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-2 border-slate-100 bg-white focus:border-indigo-500 focus:outline-none text-xl font-bold transition-all shadow-sm" />
                  </div>
                  <button onClick={startQuiz} disabled={!userName.trim()} className="w-full bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-200 text-white font-black py-6 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95">
                    <span className="text-lg">AI 진단 시작하기</span>
                    <ArrowRight size={22} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {appState === 'QUIZ' && selectedQuestions.length > 0 && (
          <div className="max-w-3xl w-full animate-in zoom-in-95 duration-500">
            <div className="bg-white rounded-[3.5rem] shadow-[0_50px_100px_-25px_rgba(0,0,0,0.1)] p-10 md:p-14 relative border border-white">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-900 text-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-lg">
                    <span className="text-[10px] font-black opacity-60">Q</span>
                    <span className="text-xl font-black">{currentQuestionIndex + 1}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 px-5 py-2 rounded-2xl border border-slate-100">
                  <div className={`w-3 h-3 rounded-full ${timeLeft < 5 ? 'bg-red-500 animate-pulse' : 'bg-indigo-600'}`} />
                  <span className="text-2xl font-black font-mono tabular-nums text-slate-800">{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-12 leading-[1.35] tracking-tight min-h-[5rem]">{selectedQuestions[currentQuestionIndex].text}</h3>
              <div className="grid grid-cols-1 gap-5">
                {selectedQuestions[currentQuestionIndex].options.map((option, idx) => (
                  <button key={idx} onClick={() => handleAnswer(idx)} className="group w-full flex items-center text-left px-8 py-6 rounded-[2rem] border-2 border-slate-50 bg-slate-50/40 hover:bg-white hover:border-indigo-500 transition-all duration-300 active:scale-[0.98]">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center mr-6 shrink-0 font-black text-lg transition-all">{idx + 1}</div>
                    <span className="text-slate-700 text-lg font-bold group-hover:text-indigo-900">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {appState === 'RESULTS' && quizResult && (
          <div className="max-w-5xl w-full space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="grid lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5 bg-white rounded-[3.5rem] shadow-lg p-14 flex flex-col items-center justify-center border border-slate-100 transition-transform hover:scale-[1.01]">
                <div className="w-64 h-64 relative mb-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={[{ name: '맞춤', value: quizResult.score }, { name: '틀림', value: quizResult.total - quizResult.score }]} innerRadius={85} outerRadius={115} paddingAngle={10} dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                        <Cell fill="url(#resGradient)" /><Cell fill="#F8FAFC" />
                      </Pie>
                      <defs><linearGradient id="resGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#4F46E5" /><stop offset="100%" stopColor="#818CF8" /></linearGradient></defs>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-7xl font-black text-slate-900 tracking-tighter tabular-nums">{Math.round((quizResult.score / quizResult.total) * 100)}<span className="text-2xl ml-0.5 opacity-40">%</span></span>
                  </div>
                </div>
                <div className="text-center w-full">
                  <p className="text-slate-900 text-3xl font-black mb-6"><span className="text-indigo-600 underline decoration-indigo-200 decoration-[10px] underline-offset-[-5px]">{userName}</span> 공인중개사님</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 px-8 py-5 rounded-3xl border border-emerald-100">
                       <span className="block text-[10px] font-black text-emerald-500 uppercase mb-2 tracking-widest">Mastered</span>
                       <span className="text-2xl font-black text-emerald-700">{quizResult.score}</span>
                    </div>
                    <div className="bg-rose-50 px-8 py-5 rounded-3xl border border-rose-100">
                       <span className="block text-[10px] font-black text-rose-500 uppercase mb-2 tracking-widest">Incomplete</span>
                       <span className="text-2xl font-black text-rose-700">{quizResult.total - quizResult.score}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-slate-900 rounded-[3.5rem] shadow-2xl p-12 md:p-16 text-white relative overflow-hidden flex flex-col hover-3d transition-transform duration-700">
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-5">
                      <div className="bg-indigo-600 p-4 rounded-[1.5rem] shadow-xl"><Quote size={28} className="text-white" /></div>
                      <h3 className="text-2xl font-black text-indigo-400">노제승 교수님의 마중물 편지</h3>
                    </div>
                    <button onClick={copyMentorMessage} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-3 rounded-2xl transition-all border border-white/5 active:scale-95 text-[13px] font-bold no-print backdrop-blur-md">
                      {isCopied ? <><CheckCircle2 size={18} className="text-emerald-400" />복사 완료!</> : <><Copy size={18} />편지 복사</>}
                    </button>
                  </div>
                  <div className="flex-grow overflow-y-auto pr-6 custom-scroll">
                    <p className="text-slate-200 leading-[2.1] text-xl whitespace-pre-line font-medium italic opacity-95">{isLoadingFeedback ? "교수님의 조언을 생성 중입니다..." : mentorMsg}</p>
                  </div>
                  <div className="mt-14 pt-10 border-t border-slate-800/60 flex items-center gap-5">
                    <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl"><Rocket size={32} className="text-white" /></div>
                    <div>
                      <p className="text-lg font-black text-white uppercase tracking-wider">RSA 10기 AI 전문가 과정</p>
                      <p className="text-xs text-indigo-400 font-bold tracking-tight opacity-80">AI 리터러시로 완성하는 공인중개사의 새로운 미래</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 no-print">
              <button onClick={() => setAppState('START')} className="flex-1 bg-white text-slate-900 border-2 border-slate-100 font-black py-7 rounded-[2.5rem] hover:bg-slate-50 transition-all flex items-center justify-center gap-4 text-xl shadow-sm active:scale-95"><RefreshCcw size={26} className="text-indigo-600" />다시 진단받기</button>
              <button onClick={() => downloadReportFile('md')} className="flex-[2] bg-slate-900 text-white font-black py-7 rounded-[2.5rem] shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-4 text-xl active:scale-95"><FileText size={26} className="text-indigo-400" />리포트 다운로드 (.md)</button>
              <button onClick={() => downloadReportFile('txt')} className="flex-1 bg-white text-slate-900 border-2 border-slate-100 font-black py-7 rounded-[2.5rem] hover:bg-slate-50 transition-all flex items-center justify-center gap-4 text-xl shadow-sm active:scale-95"><FileDown size={26} className="text-blue-600" />결과 텍스트 저장</button>
            </div>
          </div>
        )}
      </main>
      {showInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowInfo(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowInfo(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-all"><X size={24} /></button>
            <h3 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3"><Sparkles className="text-indigo-600" />앱 소개 및 사용방법</h3>
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed max-h-[60vh] overflow-y-auto pr-4 custom-scroll">
              <p>RSA 10기 공인중개사님들의 성공적인 AI 실무 교육을 위해, 현재의 리터러시 수준을 파악하고 최적의 학습 동기를 부여하기 위해 제작되었습니다.</p>
              <p>총 12문항이 랜덤 출제되며, 진단이 완료되면 노제승 교수님이 직접 제안하는 맞춤형 '마중물 편지'가 생성됩니다.</p>
              <p>결과 화면 하단의 버튼을 통해 상세 리포트를 텍스트 파일로 저장하여 보관하실 수 있습니다.</p>
            </div>
            <button onClick={() => setShowInfo(false)} className="w-full bg-indigo-600 text-white font-black py-5 rounded-3xl mt-10 shadow-lg active:scale-95">확인했습니다</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};
export default App;
