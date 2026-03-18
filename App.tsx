
import React, { useState, useEffect } from 'react';
import { Hero, StoryChapter, GameState, UserInput, UserPreferences, PerformanceRecord, CopilotReportData } from './types';
import { startStory, nextChapter, generateCopilotReport } from './services/geminiService';
import { MOCK_LOADING_MESSAGES, LANGUAGES } from './constants';
import LoginPage from './components/LoginPage';
import HeroSelector from './components/HeroSelector';
import StoryStage from './components/StoryStage';
import CopilotReport from './components/CopilotReport';
import AgentChat from './components/AgentChat';
import McpToast from './components/McpToast';
import { Sparkles, BookOpen, Upload, RotateCcw, User, Settings, Languages, MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('LOGIN');
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  
  // Profile & Settings
  const [preferences, setPreferences] = useState<UserPreferences>({
    userName: '',
    gender: '',
    interests: '',
    difficulty: 'Explorer (Easy)',
    chapterCount: 5,
    language: 'English'
  });

  // Input state
  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState<{name: string, data: string, type: string} | null>(null);

  const [currentChapter, setCurrentChapter] = useState<StoryChapter | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(MOCK_LOADING_MESSAGES[0]);
  const [nextChapterPromise, setNextChapterPromise] = useState<Promise<StoryChapter> | null>(null);

  // Favorites
  const [favoriteHeroes, setFavoriteHeroes] = useState<string[]>([]);
  
  // Copilot & Performance Tracking
  const [performanceData, setPerformanceData] = useState<PerformanceRecord[]>([]);
  const [copilotReport, setCopilotReport] = useState<CopilotReportData | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('favoriteHeroes');
      if (savedFavorites) setFavoriteHeroes(JSON.parse(savedFavorites));
    } catch (error) {
      console.error("Failed to load favorites from localStorage", error);
    }
  }, []);

  const toggleFavoriteHero = (heroId: string) => {
    setFavoriteHeroes(prevFavorites => {
      const newFavorites = prevFavorites.includes(heroId)
        ? prevFavorites.filter(id => id !== heroId)
        : [...prevFavorites, heroId];
      try {
        localStorage.setItem('favoriteHeroes', JSON.stringify(newFavorites));
      } catch (error) { console.error("Failed to save favorites", error); }
      return newFavorites;
    });
  };

  const handleLoginSuccess = () => setGameState('HERO_SELECTION');
  const handleHeroSelect = (hero: Hero) => {
    setSelectedHero(hero);
    setGameState('SETUP_PROFILE');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) setAttachedFile({ name: file.name, data: result, type: file.type });
    };
    reader.readAsDataURL(file);
  };

  const beginStory = async () => {
    if (!selectedHero || (!inputText.trim() && !attachedFile) || !preferences.userName.trim()) return;
    
    setGameState('GENERATING_STORY');
    const interval = setInterval(() => {
        setLoadingMessage(prev => MOCK_LOADING_MESSAGES[(MOCK_LOADING_MESSAGES.indexOf(prev) + 1) % MOCK_LOADING_MESSAGES.length]);
    }, 2500);

    try {
        const input: UserInput = { topic: inputText, fileData: attachedFile?.data, mimeType: attachedFile?.type, preferences };
        const chapter1 = await startStory(input, selectedHero);
        setCurrentChapter(chapter1);
        setPerformanceData([]); // Reset performance data for new story
        setCopilotReport(null); // Reset old report
        setGameState('PLAYING');
    } catch (error) {
        console.error("Failed to generate story", error);
        alert("The magic fizzled out (API Error). Please try again!");
        setGameState('SETUP_PROFILE');
    } finally {
        clearInterval(interval);
    }
  };

  const handleAnswerSelected = (userAnswer: string, isCorrect: boolean) => {
    if (currentChapter) {
        setPerformanceData(prev => [...prev, { chapter: currentChapter, userAnswer, isCorrect }]);
        if (!currentChapter.isFinal) {
          setNextChapterPromise(nextChapter(userAnswer, isCorrect));
        }
    }
  };
  
  const handleAdvanceToNextChapter = async () => {
    if (currentChapter?.isFinal) {
      setGameState('COMPLETED');
      setIsReportLoading(true);
      if(selectedHero) {
          generateCopilotReport(performanceData, selectedHero, inputText, preferences)
            .then(report => {
                setCopilotReport(report);
                setIsReportLoading(false);
            });
      }
      return;
    }
  
    setGameState('GENERATING_STORY');
    try {
      if (nextChapterPromise) {
        const next = await nextChapterPromise;
        setCurrentChapter(next);
        setGameState('PLAYING');
        setNextChapterPromise(null);
      } else { throw new Error("Next chapter was not pre-fetched."); }
    } catch (error) {
      console.error("Failed to load next chapter", error);
      alert("The magic fizzled out. Let's try again from the beginning.");
      setGameState('SETUP_PROFILE');
    }
  };

  const resetGame = () => {
    setGameState('LOGIN');
    setSelectedHero(null);
    setInputText('');
    setAttachedFile(null);
    setCurrentChapter(null);
    setNextChapterPromise(null);
    setPerformanceData([]);
    setCopilotReport(null);
    setPreferences({
        userName: '',
        gender: '',
        interests: '',
        difficulty: 'Explorer (Easy)',
        chapterCount: 5,
        language: 'English'
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="fixed top-0 w-full z-50 glass-panel border-b-0 border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={resetGame}>
                <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform"><Sparkles size={24} className="text-white" /></div>
                <h1 className="text-2xl font-bold tracking-tight text-white hero-font drop-shadow-md hidden md:block">SSO2 <span className="text-purple-300 text-sm font-normal">Magical Learning</span> <span className="ml-2 px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] rounded-full border border-green-500/30 uppercase tracking-widest">MCP Server Active</span></h1>
            </div>
            {selectedHero && (gameState === 'PLAYING' || gameState === 'GENERATING_STORY') && (
                <div className="flex items-center gap-3 bg-black/30 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md animate-fade-in">
                     <span className="text-2xl">{selectedHero.emoji}</span>
                    <span className="text-sm font-bold text-white hidden sm:inline">{selectedHero.name}</span>
                </div>
            )}
            <button 
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-full transition-all shadow-lg active:scale-95"
            >
              <MessageSquare size={18} />
              <span className="text-sm font-bold hidden sm:inline">AI Copilot</span>
            </button>
        </div>
      </header>
      <main className="flex-1 flex flex-col w-full pt-24 px-4 pb-8">
        {gameState === 'LOGIN' && <LoginPage onLoginSuccess={handleLoginSuccess} />}
        {gameState === 'HERO_SELECTION' && <HeroSelector onSelect={handleHeroSelect} favoriteHeroes={favoriteHeroes} onToggleFavorite={toggleFavoriteHero} />}
        {gameState === 'SETUP_PROFILE' && selectedHero && (
            <div className="flex-1 flex items-center justify-center animate-fade-in w-full max-w-5xl mx-auto pb-20">
                <div className="w-full glass-panel border border-white/20 p-6 md:p-12 rounded-[2.5rem] shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-8">
                        <div className="text-center lg:text-left">
                            <div className={`w-24 h-24 mx-auto lg:mx-0 mb-6 rounded-full bg-gradient-to-br ${selectedHero.bgGradient} p-1 shadow-xl flex items-center justify-center`}><span className="text-6xl drop-shadow-md">{selectedHero.emoji}</span></div>
                            <h2 className="text-4xl font-bold text-white mb-3 hero-font">Your Journey Begins</h2>
                            <p className="text-purple-200 text-lg">{selectedHero.name} is ready. What wisdom shall we seek?</p>
                        </div>
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-purple-300 uppercase tracking-wider ml-1">Topic to Learn</label>
                            <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="e.g. The French Revolution, React Hooks..." className="w-full h-32 bg-black/30 border-2 border-white/10 rounded-2xl p-5 text-white text-lg placeholder-white/30 focus:outline-none focus:border-purple-400 focus:bg-black/40 transition-all resize-none" />
                            <div className="relative">
                                <input type="file" accept=".txt,.pdf,.md,.png,.jpg,.jpeg" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                <div className={`flex items-center justify-center gap-3 w-full py-4 border-2 border-dashed rounded-xl transition-colors ${attachedFile ? 'border-green-400/50 bg-green-400/10' : 'border-white/20 hover:bg-white/5'}`}>
                                    {attachedFile ? (<><span className="text-green-200 font-bold truncate max-w-[200px]">{attachedFile.name}</span><button onClick={(e) => { e.stopPropagation(); e.preventDefault(); setAttachedFile(null); }} className="z-20 p-1 hover:bg-red-500/20 rounded text-red-300">✕</button></>) : (<><Upload size={18} className="text-purple-300" /><span className="text-purple-200 font-medium">Or upload content</span></>)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6 bg-white/5 p-6 rounded-3xl border border-white/5">
                        <div className="flex items-center gap-2 text-white border-b border-white/10 pb-4"><Settings className="text-purple-400" /><h3 className="text-xl font-bold">Customize Adventure</h3></div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-purple-300 uppercase flex items-center gap-1.5"><User size={12}/> Your Name</label>
                            <input type="text" value={preferences.userName} onChange={(e) => setPreferences({...preferences, userName: e.target.value})} placeholder="e.g. Alex, Maya" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-400" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-purple-300 uppercase flex items-center gap-1.5"><Languages size={12}/> Story Language</label>
                          <select value={preferences.language} onChange={(e) => setPreferences({...preferences, language: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-400 appearance-none">
                            {LANGUAGES.map(lang => <option key={lang.code} value={lang.name}>{lang.name}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-purple-300 uppercase">Difficulty Level</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Explorer (Easy)', 'Adventurer (Medium)', 'Master (Hard)', 'Legend (Expert)'].map((level) => (
                                    <button key={level} onClick={() => setPreferences({...preferences, difficulty: level as any})} className={`p-3 rounded-xl text-sm font-bold transition-all border ${preferences.difficulty === level ? `bg-${selectedHero.themeColor}-500 border-${selectedHero.themeColor}-400 text-white shadow-lg` : 'bg-black/20 border-white/10 text-white/60 hover:bg-white/10'}`}>{level.split(' ')[0]}</button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-purple-300 uppercase">Adventure Length: {preferences.chapterCount} Chapters</label>
                            <input type="range" min="3" max="30" step="1" value={preferences.chapterCount} onChange={(e) => setPreferences({...preferences, chapterCount: parseInt(e.target.value)})} className="w-full accent-purple-500 h-2 bg-black/40 rounded-lg appearance-none cursor-pointer" />
                            <div className="flex justify-between text-xs text-white/40 px-1"><span>Quick (3)</span><span>Deep Dive (30)</span></div>
                        </div>
                        <button onClick={beginStory} disabled={!preferences.userName.trim() || (!inputText.trim() && !attachedFile)} className={`w-full py-4 text-xl font-bold text-white rounded-xl shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 mt-4 ${(!preferences.userName.trim() || (!inputText.trim() && !attachedFile)) ? 'bg-slate-700/50 cursor-not-allowed opacity-50' : `bg-gradient-to-r ${selectedHero.bgGradient} hover:brightness-110`}`}>
                            <BookOpen className="fill-current" /> Start Adventure
                        </button>
                    </div>
                </div>
            </div>
        )}
        {gameState === 'GENERATING_STORY' && selectedHero && (
            <div className="flex-1 flex flex-col items-center justify-center animate-fade-in text-center p-6">
                <div className="relative w-32 h-32 mb-8">
                    <div className="absolute inset-0 border-4 border-white/10 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 border-8 border-t-purple-400 border-r-pink-400 border-b-purple-400 border-l-pink-400 rounded-full animate-spin"></div>
                    <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-inner"><span className="text-6xl animate-pulse">{selectedHero.emoji}</span></div>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 hero-font drop-shadow-lg">{loadingMessage}</h3>
                <p className="text-purple-200 text-lg animate-pulse max-w-md">Weaving your personalized story...</p>
            </div>
        )}
        {gameState === 'PLAYING' && currentChapter && selectedHero && <StoryStage hero={selectedHero} chapter={currentChapter} onAnswerSelected={handleAnswerSelected} onAdvanceToNextChapter={handleAdvanceToNextChapter} />}
        {gameState === 'COMPLETED' && selectedHero && (
            <CopilotReport
                hero={selectedHero}
                reportData={copilotReport}
                isLoading={isReportLoading}
                userName={preferences.userName}
                onReset={resetGame}
            />
        )}
      </main>
      <AgentChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <McpToast />
      <footer className="py-6 text-center text-purple-300/50 text-sm">
        <p>SSO2 Magical Learning &copy; 2024 • Powered by Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
