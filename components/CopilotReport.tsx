
import React from 'react';
import { Hero, CopilotReportData } from '../types';
import { RotateCcw, BarChart, Book, Target, CheckCircle } from 'lucide-react';

interface CopilotReportProps {
    hero: Hero;
    reportData: CopilotReportData | null;
    isLoading: boolean;
    userName: string;
    onReset: () => void;
}

const CopilotReport: React.FC<CopilotReportProps> = ({ hero, reportData, isLoading, userName, onReset }) => {

    const getGradeColor = (grade: string) => {
        if (grade.startsWith('A')) return 'text-green-300';
        if (grade.startsWith('B')) return 'text-sky-300';
        if (grade.startsWith('C')) return 'text-yellow-300';
        if (grade.startsWith('D')) return 'text-orange-400';
        return 'text-red-400';
    };

    if (isLoading || !reportData) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center animate-fade-in text-center p-6">
                <div className="relative w-32 h-32 mb-8">
                    <div className="absolute inset-0 border-4 border-white/10 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 border-8 border-t-purple-400 border-r-pink-400 border-b-purple-400 border-l-pink-400 rounded-full animate-spin"></div>
                    <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-inner"><span className="text-6xl animate-pulse">{hero.emoji}</span></div>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 hero-font drop-shadow-lg">Compiling Your Report Card...</h3>
                <p className="text-purple-200 text-lg animate-pulse max-w-md">{hero.name} is analyzing your performance...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex items-center justify-center animate-fade-in p-6">
            <div className="w-full max-w-4xl mx-auto glass-panel p-8 md:p-12 rounded-[3rem] border border-white/20 shadow-2xl text-left">
                <div className="flex flex-col md:flex-row items-start gap-8">
                    {/* Left Column: Grade & Summary */}
                    <div className="w-full md:w-1/3 text-center md:text-left">
                        <div className={`relative inline-block w-40 h-40 rounded-full bg-gradient-to-br ${hero.bgGradient} p-1 shadow-2xl mb-6`}>
                            <div className="h-full w-full bg-[#1a103c] rounded-full flex flex-col items-center justify-center">
                                <span className="text-xs text-purple-300 uppercase">Grade</span>
                                <span className={`text-7xl font-bold hero-font ${getGradeColor(reportData.grade)}`}>
                                    {reportData.grade}
                                </span>
                            </div>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4 hero-font">Report Card</h2>
                        <p className="text-lg text-purple-200 italic">"{reportData.summary}"</p>
                        <p className="text-right text-sm font-bold text-white/70 mt-4">- {hero.name}</p>
                    </div>

                    {/* Right Column: Details & Plan */}
                    <div className="w-full md:w-2/3 space-y-6">
                        {/* Focus Areas */}
                        <div>
                            <h3 className="flex items-center gap-2 text-2xl font-bold text-white mb-3 border-b-2 border-white/10 pb-2">
                                <Target size={22} className="text-rose-400" />
                                Concepts to Review
                            </h3>
                            <ul className="space-y-2">
                                {reportData.focusAreas.map((area, index) => (
                                    <li key={index} className="flex items-start gap-3 text-purple-100">
                                        <div className="w-5 h-5 bg-rose-500/20 rounded-full flex items-center justify-center shrink-0 mt-1"><span className="text-rose-300 font-bold text-xs">{index + 1}</span></div>
                                        <span>{area}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Study Plan */}
                        <div>
                            <h3 className="flex items-center gap-2 text-2xl font-bold text-white mb-3 border-b-2 border-white/10 pb-2">
                                <Book size={22} className="text-sky-400" />
                                Personalized Study Plan
                            </h3>
                            <ul className="space-y-3">
                                {reportData.studyPlan.map((step, index) => (
                                    <li key={index} className="flex items-start gap-3 text-white">
                                        <CheckCircle size={20} className="text-green-400 shrink-0 mt-1" />
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-12 pt-8 border-t-2 border-white/10">
                    <button onClick={onReset} className="inline-flex items-center gap-3 bg-white text-purple-900 hover:bg-purple-50 px-10 py-5 rounded-full font-bold text-xl transition-all shadow-xl hover:shadow-2xl hover:scale-105">
                        <RotateCcw size={24} /> New Adventure
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CopilotReport;
