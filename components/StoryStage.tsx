
import React, { useState, useEffect, useRef } from 'react';
import { Hero, StoryChapter, QuestionType } from '../types';
import { generateChapterImage, generateSpeech, decodeAudioData } from '../services/geminiService';
import { CheckCircle, XCircle, ArrowRight, Wand2, ArrowLeft, Crown, Volume2, VolumeX, Mic, MicOff, Loader2, Sparkles, Link2, ChevronsRight } from 'lucide-react';

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface StoryStageProps {
  hero: Hero;
  chapter: StoryChapter;
  onAnswerSelected: (userAnswer: string, isCorrect: boolean) => void;
  onAdvanceToNextChapter: () => void;
}

const StoryStage: React.FC<StoryStageProps> = ({
  hero,
  chapter,
  onAnswerSelected,
  onAdvanceToNextChapter,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  
  const [quizState, setQuizState] = useState<'answering' | 'result'>('answering');
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [wasSkipped, setWasSkipped] = useState(false);
  
  // Quiz-specific state
  const [orderingItems, setOrderingItems] = useState<string[]>([]);
  const [matchSelections, setMatchSelections] = useState<{ left: { index: number, value: string } | null, right: { index: number, value: string } | null }>({ left: null, right: null });
  const [userPairs, setUserPairs] = useState<Array<{ left: string, right: string }>>([]);
  const [shuffledMatchOptions, setShuffledMatchOptions] = useState<string[]>([]);

  // TTS State
  const [isMuted, setIsMuted] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const isMutedRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  
  // STT (Voice Command) State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const speakingRef = useRef(false);
  const isListeningRef = useRef(false);

  // Refs for State Access inside Speech Callbacks (prevents stale closures)
  const stateRef = useRef({ chapter, quizState, orderingItems, userPairs, userAnswer, isCorrect, onAdvanceToNextChapter });

  // Update state ref whenever these change
  useEffect(() => {
      stateRef.current = { chapter, quizState, orderingItems, userPairs, userAnswer, isCorrect, onAdvanceToNextChapter };
  }, [chapter, quizState, orderingItems, userPairs, userAnswer, isCorrect, onAdvanceToNextChapter]);

  // --- AUDIO CONTEXT SETUP ---
  useEffect(() => {
    if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioContextRef.current = new AudioCtx({ sampleRate: 24000 });
    }
    return () => {
        stopAudio();
        if (audioContextRef.current?.state !== 'closed') {
            audioContextRef.current?.close().catch(console.error);
        }
    };
  }, []);

  const stopAudio = () => {
    if (sourceNodeRef.current) {
        try { sourceNodeRef.current.stop(); } catch(e) {}
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
    }
    window.speechSynthesis.cancel();
    speakingRef.current = false;
    if (isListeningRef.current && recognitionRef.current) {
         try { recognitionRef.current?.start(); } catch(e) {}
    }
  };
  
  const playFallbackBrowserTTS = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const config = hero.voiceConfig;
    
    let preferredVoice = voices.find(v => 
        v.name.includes(config.gender === 'male' ? 'Male' : 'Female') || 
        (config.gender === 'male' ? v.name.includes('David') || v.name.includes('Google US English') : v.name.includes('Zira') || v.name.includes('Google US English'))
    );
    if (!preferredVoice) preferredVoice = voices.find(v => v.lang === 'en-US') || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.pitch = config.pitch; 
    utterance.rate = config.rate;
    
    utterance.onstart = () => {
        speakingRef.current = true;
        setAudioLoading(false); // Fallback is fast, so stop loading indicator
    };
    utterance.onend = () => {
        speakingRef.current = false;
        if (isListeningRef.current && recognitionRef.current) {
             try { recognitionRef.current.start(); } catch(e) {}
        }
    };

    window.speechSynthesis.speak(utterance);
  };

  const playGeminiAudio = async (text: string) => {
    if (isMutedRef.current) return;
    
    stopAudio();
    speakingRef.current = true;
    if (recognitionRef.current && isListeningRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
    }

    setAudioLoading(true);

    try {
        if (audioContextRef.current?.state === 'suspended') {
            await audioContextRef.current.resume();
        }

        const audioData = await generateSpeech(text, hero.voiceConfig.geminiVoice);
        
        if (audioData && audioContextRef.current) {
            const buffer = await decodeAudioData(audioData, audioContextRef.current);
            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current.destination);
            
            source.onended = () => {
                speakingRef.current = false;
                setAudioLoading(false);
                if (isListeningRef.current && recognitionRef.current) {
                     try { recognitionRef.current.start(); } catch(e) {}
                }
            };
            
            sourceNodeRef.current = source;
            source.start(0);
        } else {
             console.warn("Gemini TTS returned no data, falling back.");
             playFallbackBrowserTTS(text);
        }
    } catch (e) {
        console.warn("Gemini TTS failed, falling back to browser TTS.", e);
        playFallbackBrowserTTS(text);
    } finally {
        setTimeout(() => setAudioLoading(false), 500);
    }
  };
  
  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      isListeningRef.current = false;
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        isListeningRef.current = true;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) { 
          console.error(e);
          isListeningRef.current = false;
          setIsListening(false);
      }
    }
  };

  const handleVoiceCommand = (text: string) => {
    const { chapter, quizState, onAdvanceToNextChapter } = stateRef.current;

    if (quizState === 'result') {
        if (text.includes('next') || text.includes('finish') || text.includes('continue') || text.includes('go')) {
            onAdvanceToNextChapter();
        }
        return;
    }
    
    if (text.includes('skip')) {
        handleSkipQuestion();
        return;
    }

    if (chapter.quiz.type === QuestionType.MULTIPLE_CHOICE) {
        if (text.includes('option a') || text === 'a' || text.includes('first')) handleAnswerSubmitInternal(chapter.quiz.options?.[0]);
        else if (text.includes('option b') || text === 'b' || text.includes('second')) handleAnswerSubmitInternal(chapter.quiz.options?.[1]);
        else if (text.includes('option c') || text === 'c' || text.includes('third')) handleAnswerSubmitInternal(chapter.quiz.options?.[2]);
        else if (text.includes('option d') || text === 'd' || text.includes('fourth')) handleAnswerSubmitInternal(chapter.quiz.options?.[3]);
    } 
    else if (chapter.quiz.type === QuestionType.TRUE_FALSE) {
        if (text.includes('true') || text.includes('yes')) handleAnswerSubmitInternal('True');
        else if (text.includes('false') || text.includes('no')) handleAnswerSubmitInternal('False');
    }

    if (text.includes('submit') || text.includes('answer') || text.includes('check')) {
        handleAnswerSubmitInternal();
    }
  };
  
  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    isMutedRef.current = newState;
    
    if (newState) {
        stopAudio();
    } else {
        if (quizState === 'answering') {
            playGeminiAudio(chapter.storyContent.replace(/\*\*/g, ''));
        } else {
            playGeminiAudio(chapter.quiz.explanation.replace(/\*\*/g, ''));
        }
    }
  };

  // --- CHAPTER INITIALIZATION ---
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onresult = (event: any) => { const last = event.results.length - 1; const transcript = event.results[last][0].transcript.trim().toLowerCase(); console.log("Voice Command:", transcript); handleVoiceCommand(transcript); };
      recognition.onerror = (event: any) => { console.warn("Speech recognition error", event.error); if (event.error === 'not-allowed') { setIsListening(false); isListeningRef.current = false; alert("Microphone access was denied."); } };
      recognition.onend = () => { if (isListeningRef.current && !speakingRef.current) { try { recognition.start(); } catch(e) { console.warn("Failed to restart recognition", e); } } else if (!isListeningRef.current) { setIsListening(false); } };
      recognitionRef.current = recognition;
    }

    let isMounted = true;
    setImageLoading(true);
    setImageUrl(null);
    setQuizState('answering');
    setUserAnswer('');
    setIsCorrect(false);
    setWasSkipped(false);
    
    if (isMounted) {
        playGeminiAudio(chapter.storyContent.replace(/\*\*/g, ''));
    }

    if (chapter.quiz.type === QuestionType.ORDERING && chapter.quiz.options) {
      setOrderingItems([...chapter.quiz.options].sort(() => Math.random() - 0.5));
    }
    if (chapter.quiz.type === QuestionType.MATCHING && chapter.quiz.options && chapter.quiz.matchOptions) {
      setShuffledMatchOptions([...chapter.quiz.matchOptions].sort(() => Math.random() - 0.5));
      setUserPairs([]);
      setMatchSelections({ left: null, right: null });
    }

    generateChapterImage(chapter.imagePrompt, hero.stylePrompt)
      .then((url) => { if (isMounted) { setImageUrl(url); setImageLoading(false); }})
      .catch(() => { if (isMounted) setImageLoading(false); });

    return () => { 
        isMounted = false; 
        stopAudio();
        if (recognitionRef.current) {
            recognitionRef.current.abort();
        }
    };
  }, [chapter, hero]);

  const handleAnswerSubmitInternal = (selectedOption?: string) => {
      if (quizState === 'result') return;
      const { orderingItems, userPairs, userAnswer: currentUserAns, chapter } = stateRef.current;
      
      let correct = false;
      let finalAnswer = selectedOption || currentUserAns;

      switch (chapter.quiz.type) {
          case QuestionType.ORDERING:
              finalAnswer = orderingItems.join(',');
              correct = finalAnswer.replace(/\s/g, '').toLowerCase() === chapter.quiz.correctAnswer.replace(/\s/g, '').toLowerCase();
              break;
          
          case QuestionType.MATCHING:
              const formatPairs = (pairs: Array<{left: string, right: string}>) => pairs.map(p => `${p.left}:${p.right}`).sort().join(',');
              finalAnswer = formatPairs(userPairs);
              const normalizedUser = finalAnswer.replace(/\s/g, '').toLowerCase();
              const normalizedCorrect = chapter.quiz.correctAnswer.split(',').map(s => s.trim()).sort().join(',').replace(/\s/g, '').toLowerCase();
              correct = normalizedUser === normalizedCorrect;
              break;
          
          default:
              if (selectedOption) finalAnswer = selectedOption;
              correct = finalAnswer.toLowerCase().trim() === chapter.quiz.correctAnswer.toLowerCase().trim();
              break;
      }
      
      setUserAnswer(finalAnswer);
      setIsCorrect(correct);
      setQuizState('result');
      setWasSkipped(false);
      onAnswerSelected(finalAnswer, correct);

      const feedbackIntro = correct ? "That is correct! " : "Not quite. ";
      playGeminiAudio(feedbackIntro + chapter.quiz.explanation.replace(/\*\*/g, ''));
  };

  const handleAnswerSubmit = (selectedOption?: string) => { handleAnswerSubmitInternal(selectedOption); };
  
  const handleSkipQuestion = () => {
    if (quizState !== 'answering') return;
    setWasSkipped(true);
    setUserAnswer("skipped");
    setIsCorrect(false); 
    setQuizState('result');
    onAnswerSelected("skipped", false);

    playGeminiAudio(`No problem, let's look at the answer together. ${chapter.quiz.explanation.replace(/\*\*/g, '')}`);
  };

  const moveOrderingItem = (index: number, direction: -1 | 1) => {
    if (quizState === 'result') return;
    const newItems = [...orderingItems];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setOrderingItems(newItems);
  };
  
  const handleMatchSelect = (column: 'left' | 'right', index: number, value: string) => {
    if (quizState === 'result') return;
    const newSelections = { ...matchSelections };
    newSelections[column] = { index, value };

    if (newSelections.left && newSelections.right) {
        setUserPairs([...userPairs, { left: newSelections.left.value, right: newSelections.right.value }]);
        setMatchSelections({ left: null, right: null });
    } else {
        setMatchSelections(newSelections);
    }
  };
  
  const getThemeClasses = () => {
    if (!hero) {
      return { border: 'border-purple-400', borderDark: 'border-b-purple-700', bg: 'bg-purple-500', bgDark: 'bg-purple-800/50', textHighlight: 'text-purple-300' };
    }
    const color = hero.themeColor;
    return { border: `border-${color}-400`, borderDark: `border-b-${color}-700`, bg: `bg-${color}-500`, bgDark: `bg-${color}-800/50`, textHighlight: `text-${color}-300` };
  };
  
  const getOptionClasses = (index: number) => {
    const t = hero.themeColor;
    const shades = [500, 600, 700, 800, 900];
    const shade = shades[index % shades.length];
    
    return {
        bg: `bg-${t}-${shade}`,
        border: `border-${t}-${Math.min(900, shade + 100)}` 
    };
  };

  const tc = getThemeClasses();
  
  const renderFormattedText = (text: string) => {
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={index} className={`font-bold ${tc.textHighlight}`}>{part.slice(2, -2)}</strong>;
          }
          return <span key={index}>{part}</span>;
      });
  };

  return (
    <div className="w-full h-[calc(100vh-85px)] max-w-[98%] mx-auto flex flex-col p-2 animate-fade-in font-sans pb-2">
      {/* PROGRESS BAR */}
      <div className="w-full px-1">
        <div className="flex justify-between items-center mb-1.5 px-2">
            <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider hero-font">
                Your Odyssey
            </h3>
            <span className="text-sm font-bold text-white bg-black/20 px-2 py-0.5 rounded-md">
                Chapter {chapter.chapterNumber} <span className="text-white/50">of</span> {chapter.totalChapters}
            </span>
        </div>
        <div className="w-full bg-black/40 rounded-full h-4 border-2 border-white/10 p-1 shadow-inner">
            <div 
                className={`h-full rounded-full bg-gradient-to-r ${hero.bgGradient} transition-all duration-1000 ease-in-out flex items-center justify-end pr-2`}
                style={{ width: `${(chapter.chapterNumber / chapter.totalChapters) * 100}%` }}
            >
                <Sparkles size={12} className="text-white/70 opacity-0 animate-fade-in" style={{ animationDelay: '1s'}}/>
            </div>
        </div>
      </div>
      
      {/* 1. IMAGE AREA */}
      <div className={`flex-1 min-h-0 w-full relative rounded-[1.5rem] overflow-hidden border-4 ${tc.border} bg-black/90 shadow-xl group mt-2`}>
         {imageLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 gap-2">
                <Wand2 className={`animate-spin text-${hero.themeColor}-400`} size={40} />
                <span className="font-bold tracking-widest uppercase text-xs">Visualizing...</span>
            </div>
         ) : (
             <img 
                src={imageUrl || ''} 
                alt="Scene" 
                className="w-full h-full object-contain animate-fade-in" 
             />
         )}
         
         <div className="absolute top-4 left-4 z-10">
             <span className={`px-4 py-1.5 rounded-full ${tc.bgDark} text-white text-xs font-bold uppercase tracking-wider shadow-lg border-2 ${tc.border} flex items-center gap-2`}>
                <Crown size={14} className="text-yellow-400" />
                Chapter {chapter.chapterNumber}
             </span>
         </div>
      </div>

      {/* 2. TEXT STRIP with Controls */}
      <div className={`shrink-0 glass-panel py-3 px-6 rounded-2xl border-l-8 ${tc.border} bg-black/40 flex flex-col md:flex-row items-center gap-4 shadow-lg relative pr-24 mt-3`}>
         
         <div className="absolute top-3 right-3 flex gap-2">
            {window.webkitSpeechRecognition && (<button onClick={toggleListening} className={`p-2 rounded-full ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-white/50'} hover:bg-white/20 transition-all border border-white/10`} title={isListening ? "Listening..." : "Enable Voice Commands"}>{isListening ? <Mic size={20} /> : <MicOff size={20} />}</button>)}
            <button onClick={toggleMute} className={`p-2 rounded-full ${isMuted ? 'bg-red-500/20 text-red-300' : audioLoading ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'} hover:bg-white/10 transition-colors border border-white/10`} title={isMuted ? "Unmute" : "Mute"}>{audioLoading ? <Loader2 size={20} className="animate-spin" /> : isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>
         </div>

         <div className="shrink-0 flex items-center gap-3 md:border-r border-white/10 md:pr-4">
             <div className={`w-12 h-12 rounded-full ${tc.bg} p-0.5 border-2 border-white/20 shadow-inner flex items-center justify-center relative`}>
                <span className={`text-3xl select-none relative z-10 ${speakingRef.current ? 'animate-bounce' : ''}`}>{hero.emoji}</span>
                {speakingRef.current && (<div className={`absolute inset-0 rounded-full ${tc.bg} animate-ping opacity-50`}></div>)}
             </div>
             <div className="flex flex-col"><span className={`text-xs font-bold uppercase ${tc.textHighlight}`}>{hero.name}</span><span className="text-[10px] text-white/50 uppercase tracking-widest">Guide</span></div>
         </div>
         <p className="text-white text-lg md:text-xl font-medium leading-snug flex-1">{renderFormattedText(chapter.storyContent)}</p>
      </div>

      {/* 3. QUESTION & ANSWERS */}
      <div className="shrink-0 flex flex-col gap-2 mt-2">
        <div className="relative text-center px-4 py-1">
            <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-md leading-none inline-block max-w-full">
               {chapter.quiz.question}
            </h2>
            {quizState === 'answering' && (
                <button 
                    onClick={handleSkipQuestion} 
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/10 text-white/60 hover:bg-white/20 hover:text-white text-xs font-bold py-1.5 px-4 rounded-full transition-all flex items-center gap-1 group"
                    aria-label="Skip question"
                >
                    Skip <ChevronsRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
            )}
        </div>

          <div className="relative w-full h-24 md:h-32">
             {quizState === 'result' && ( <div className="absolute inset-0 z-30 flex items-center justify-center backdrop-blur-md bg-black/60 rounded-2xl border-2 border-white/10"> <div className="flex items-center gap-6 p-4"> {isCorrect ? <CheckCircle size={40} className="text-green-400" /> : <XCircle size={40} className="text-red-400" />} <div className="flex flex-col text-left"> <h3 className={`text-2xl font-bold ${wasSkipped ? 'text-yellow-300' : isCorrect ? 'text-green-300' : 'text-red-300'} hero-font`}>{wasSkipped ? 'Question Skipped' : isCorrect ? 'Correct!' : 'Incorrect'}</h3> <p className="text-white/90 text-sm max-w-2xl font-medium line-clamp-2">{renderFormattedText(chapter.quiz.explanation)}</p></div> <button onClick={onAdvanceToNextChapter} className={`ml-4 px-8 py-3 rounded-xl font-bold text-lg text-white shadow-lg transition-transform hover:scale-105 active:scale-95 whitespace-nowrap ${isCorrect ? `bg-gradient-to-r ${hero.bgGradient}` : 'bg-slate-700'}`}>{chapter.isFinal ? 'Finish' : 'Next'} <ArrowRight className="inline ml-2" size={18}/></button></div></div> )}
             <div className={`w-full h-full ${quizState === 'result' ? 'opacity-0' : ''}`}>
                {chapter.quiz.type === QuestionType.MULTIPLE_CHOICE && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 h-full">
                        {chapter.quiz.options?.map((option, idx) => {
                            const optStyle = getOptionClasses(idx);
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswerSubmit(option)}
                                    className={`relative w-full h-full rounded-2xl ${optStyle.bg} border-b-4 ${optStyle.border} hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all flex flex-col md:flex-row items-center justify-center px-4 gap-2 group`}
                                >
                                    <span className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center text-white font-bold text-xs border border-white/10 shrink-0">{String.fromCharCode(65 + idx)}</span>
                                    <span className="text-white text-base md:text-lg font-bold text-center leading-tight drop-shadow-md line-clamp-2">{option}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
                {chapter.quiz.type === QuestionType.TRUE_FALSE && (
                     <div className="grid grid-cols-2 gap-3 h-full">
                        {['True', 'False'].map((option, idx) => {
                            const optStyle = getOptionClasses(idx);
                             return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswerSubmit(option)}
                                    className={`relative w-full h-full rounded-2xl ${optStyle.bg} border-b-4 ${optStyle.border} hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center px-4 gap-4 group text-white text-2xl font-bold`}
                                >
                                    {option === 'True' ? <CheckCircle/> : <XCircle/>}
                                    {option}
                                </button>
                            );
                        })}
                     </div>
                )}

                {chapter.quiz.type === QuestionType.ORDERING && (
                    <div className="flex h-full gap-2 items-center">
                         <div className="flex-1 flex gap-2 overflow-x-auto custom-scrollbar px-2 h-full items-center">
                            {orderingItems.map((item, idx) => (
                                <div key={idx} className={`shrink-0 w-40 md:w-56 h-full ${tc.bg} rounded-xl border-b-4 ${tc.borderDark} flex flex-col justify-center relative p-2`}>
                                    <span className="absolute top-1 left-2 text-[10px] uppercase font-bold text-black/30">Step {idx+1}</span>
                                    <p className="text-white text-sm font-bold text-center leading-tight">{item}</p>
                                    <div className="absolute bottom-1 right-1 flex gap-1">
                                         <button onClick={() => moveOrderingItem(idx, -1)} disabled={idx === 0} className="p-1 hover:bg-black/20 rounded text-white disabled:opacity-20"><ArrowLeft size={12}/></button>
                                         <button onClick={() => moveOrderingItem(idx, 1)} disabled={idx === orderingItems.length - 1} className="p-1 hover:bg-black/20 rounded text-white disabled:opacity-20"><ArrowRight size={12}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={() => handleAnswerSubmit()}
                            className={`h-full px-6 ${tc.bgDark} text-white border-2 ${tc.border} hover:bg-white hover:${tc.textHighlight} rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all`}
                        >Submit</button>
                    </div>
                )}
                
                {chapter.quiz.type === QuestionType.MATCHING && (
                    <div className="flex h-full gap-2 items-center">
                        <div className="flex-1 grid grid-cols-2 gap-2 h-full">
                            <div className="flex flex-col gap-1.5">{chapter.quiz.options?.map((item, idx) => {
                                const isSelected = matchSelections.left?.index === idx;
                                const isPaired = userPairs.some(p => p.left === item);
                                return <button key={`L${idx}`} onClick={() => handleMatchSelect('left', idx, item)} disabled={isPaired} className={`w-full flex-1 rounded-lg text-sm font-semibold p-2 transition-all ${ isPaired ? 'bg-slate-700 text-white/40' : isSelected ? `bg-yellow-400 text-black ring-2 ring-white` : `bg-white/10 text-white hover:bg-white/20`}`}>{item}</button>
                            })}</div>
                            <div className="flex flex-col gap-1.5">{shuffledMatchOptions.map((item, idx) => {
                                const isSelected = matchSelections.right?.index === idx;
                                const isPaired = userPairs.some(p => p.right === item);
                                return <button key={`R${idx}`} onClick={() => handleMatchSelect('right', idx, item)} disabled={isPaired} className={`w-full flex-1 rounded-lg text-sm font-semibold p-2 transition-all ${ isPaired ? 'bg-slate-700 text-white/40' : isSelected ? `bg-yellow-400 text-black ring-2 ring-white` : `bg-white/10 text-white hover:bg-white/20`}`}>{item}</button>
                            })}</div>
                        </div>
                        <div className="w-24 flex flex-col items-center justify-center gap-2">
                             {userPairs.map((p,i) => <div key={i} className="text-green-300 animate-fade-in"><Link2 size={16}/></div>)}
                        </div>
                        <button onClick={() => handleAnswerSubmit()} disabled={userPairs.length !== chapter.quiz.options?.length} className={`h-full px-6 ${tc.bgDark} text-white border-2 ${tc.border} hover:bg-white hover:${tc.textHighlight} rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed`}>Submit</button>
                    </div>
                )}
             </div>
          </div>
      </div>
    </div>
  );
};

export default StoryStage;
