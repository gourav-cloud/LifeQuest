import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { sounds } from '../lib/soundEffects.ts';
import {
  Swords,
  Shield,
  Coins,
  Sparkles,
  Trophy,
  Flame,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { loginWithGoogle, loginAsDemoHero } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      sounds.playClick();
      await loginWithGoogle();
    } catch (err: any) {
      console.error('Login error', err);
      setError(err.message || 'Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    sounds.playLevelUp();
    loginAsDemoHero('Arthur the Brave');
  };

  return (
    <div className="min-h-screen bg-[#0d0b14] text-[#fffffe] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle CRT background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#251d38_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />

      <div className="relative z-10 w-full max-w-xl text-center space-y-6">
        {/* Crest */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded bg-[#201733] border-3 border-[#ffd166] shadow-[0_0_30px_rgba(255,209,102,0.4)] mb-2">
          <span className="text-4xl">⚔️</span>
        </div>

        {/* Title */}
        <div>
          <h1 className="font-pixel text-2xl sm:text-4xl text-[#ffd166] tracking-wider drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
            LIFEQUEST
          </h1>
          <p className="font-retro text-2xl sm:text-3xl text-[#06d6a0] mt-1 tracking-widest uppercase">
            16-Bit RPG Productivity Realm
          </p>
          <p className="font-pixel-sans text-sm text-[#a7a9be] mt-2 max-w-md mx-auto">
            Transform real-world tasks into epic quests. Gain XP, level up, boost attributes, earn Gold, and reward yourself at the tavern.
          </p>
        </div>

        {/* Action Panel */}
        <div className="rpg-panel-gold p-6 sm:p-8 space-y-4">
          <h2 className="font-pixel text-xs sm:text-sm text-[#ffd166] uppercase tracking-wider">
            CHOOSE YOUR ENTRANCE TO THE GUILD
          </h2>

          {error && (
            <div className="p-3 bg-[#360812] border border-[#ef476f] text-xs font-pixel text-[#ef476f] rounded">
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded bg-[#fffffe] text-[#12101b] font-pixel text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-3 cursor-pointer shadow-lg hover:bg-[#eaeaea] active:scale-98 transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{loading ? 'OPENING GUILD GATES...' : 'SIGN IN WITH GOOGLE'}</span>
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-[#3b3355]" />
            <span className="font-pixel text-[9px] text-[#a7a9be] uppercase">OR TEST AS GUEST</span>
            <div className="flex-1 h-px bg-[#3b3355]" />
          </div>

          {/* Quick Demo Login */}
          <button
            onClick={handleDemoLogin}
            className="w-full py-3 px-4 rounded rpg-btn-gold font-pixel text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow hover:scale-102 transition-transform"
          >
            <UserCheck className="w-4 h-4" />
            <span>ENTER AS DEMO HERO (KNIGHT ARTHUR)</span>
          </button>
        </div>

        {/* Feature Highlights Bento */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-left font-pixel-sans">
          <div className="rpg-panel-dark p-3 rounded border border-[#3b3355]">
            <Sparkles className="w-4 h-4 text-[#06d6a0] mb-1" />
            <div className="font-pixel text-[9px] text-white">XP & Levels</div>
            <div className="text-[10px] text-[#a7a9be] mt-0.5">Non-linear leveling curve</div>
          </div>

          <div className="rpg-panel-dark p-3 rounded border border-[#3b3355]">
            <Shield className="w-4 h-4 text-[#4cc9f0] mb-1" />
            <div className="font-pixel text-[9px] text-white">5 RPG Stats</div>
            <div className="text-[10px] text-[#a7a9be] mt-0.5">INT, STR, DIS, CRE, VIT</div>
          </div>

          <div className="rpg-panel-dark p-3 rounded border border-[#3b3355]">
            <Coins className="w-4 h-4 text-[#ffd166] mb-1" />
            <div className="font-pixel text-[9px] text-white">Tavern Shop</div>
            <div className="text-[10px] text-[#a7a9be] mt-0.5">Redeem Gold for rewards</div>
          </div>

          <div className="rpg-panel-dark p-3 rounded border border-[#3b3355]">
            <Flame className="w-4 h-4 text-[#ff5400] mb-1" />
            <div className="font-pixel text-[9px] text-white">Streak Multipliers</div>
            <div className="text-[10px] text-[#a7a9be] mt-0.5">Bonus loot for consistency</div>
          </div>
        </div>
      </div>
    </div>
  );
};
