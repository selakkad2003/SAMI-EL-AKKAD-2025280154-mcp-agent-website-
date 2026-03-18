
import React from 'react';
import { Sparkles, KeyRound, LogIn, User } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="flex-1 flex items-center justify-center animate-fade-in p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="glass-panel border border-white/20 p-8 md:p-12 rounded-[2.5rem] shadow-2xl text-center">
          <div className="inline-block bg-gradient-to-br from-pink-500 to-purple-600 p-4 rounded-2xl shadow-lg mb-6">
            <Sparkles size={40} className="text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-3 hero-font">Welcome, Seeker</h1>
          <p className="text-purple-200/80 mb-8">Sign in to begin your magical learning odyssey.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300/50" size={20} />
              <input 
                type="email"
                placeholder="Email Address"
                className="w-full bg-black/30 border-2 border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:bg-black/40 transition-all"
                defaultValue="hero@magic.com"
              />
            </div>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300/50" size={20} />
              <input 
                type="password"
                placeholder="Password"
                className="w-full bg-black/30 border-2 border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:bg-black/40 transition-all"
                defaultValue="password"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg hover:brightness-110 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              Sign In & Begin
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="px-4 text-xs text-white/40 uppercase">OR</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>
          
          <button
            onClick={onLoginSuccess}
            className="w-full bg-white/10 text-white/80 font-bold py-3 rounded-xl hover:bg-white/20 transition-colors"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
