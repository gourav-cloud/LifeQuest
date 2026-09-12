import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { sounds } from '../lib/soundEffects.ts';
import {
  Swords,
  Scroll,
  Beer,
  Trophy,
  History,
  Volume2,
  VolumeX,
  LogOut,
  ShieldAlert,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

export type NavTab = 'quests' | 'character' | 'tavern' | 'badges' | 'activity';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  gold: number;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, gold }) => {
  const { user, demoUser, logout } = useAuth();
  const [muted, setMuted] = useState(sounds.isMuted);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleToggleSound = () => {
    const isNowMuted = sounds.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      sounds.playClick();
    }
  };

  const navItems = [
    { id: 'quests' as NavTab, label: 'Quest Board', icon: Swords },
    { id: 'character' as NavTab, label: 'Character Sheet', icon: Scroll },
    { id: 'tavern' as NavTab, label: 'Reward Tavern', icon: Beer },
    { id: 'badges' as NavTab, label: 'Hall of Fame', icon: Trophy },
    { id: 'activity' as NavTab, label: 'Chronicles', icon: History },
  ];

  return (
    <header className="w-full bg-[#12101b] border-b-3 border-[#3b3355] shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo / Title */}
        <div
          onClick={() => {
            sounds.playClick();
            onSelectTab('quests');
          }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded bg-[#2b1f3d] border-2 border-[#ffd166] flex items-center justify-center text-lg shadow-[0_0_10px_rgba(255,209,102,0.4)] group-hover:scale-105 transition-transform">
            <span>⚔️</span>
          </div>
          <div>
            <div className="font-pixel text-base sm:text-lg tracking-wider text-[#ffd166] flex items-center gap-1.5 drop-shadow">
              LIFEQUEST
            </div>
            <div className="font-retro text-sm text-[#06d6a0] -mt-1 tracking-wider">
              16-BIT RPG TODO REALM
            </div>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playClick();
                  onSelectTab(item.id);
                }}
                className={`font-pixel text-[11px] px-3 py-2 rounded flex items-center gap-1.5 cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#ffd166] text-[#12101b] font-bold shadow-[inset_0_2px_0_#fff,0_2px_8px_rgba(255,209,102,0.5)] scale-102 border-2 border-[#ffe89e]'
                    : 'text-[#a7a9be] hover:text-[#fffffe] hover:bg-[#201b30] border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Tools: Audio toggle, Logout, Mobile Hamburger */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded rpg-panel-dark text-[#a7a9be] hover:text-[#ffd166] border border-[#3b3355] cursor-pointer"
            title={muted ? 'Unmute 8-Bit Audio' : 'Mute Sound'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-[#ef476f]" /> : <Volume2 className="w-4 h-4 text-[#06d6a0]" />}
          </button>

          {/* User Signout */}
          <button
            onClick={() => {
              sounds.playClick();
              logout();
            }}
            className="hidden sm:flex items-center gap-1 font-pixel text-[10px] px-2.5 py-1.5 rounded rpg-panel-dark text-[#ef476f] hover:text-white hover:bg-[#d90429]/40 border border-[#ef476f]/40 cursor-pointer"
            title="Log Out Adventurer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>EXIT</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded rpg-panel-dark text-[#fffffe] border border-[#3b3355]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#161324] border-b-2 border-[#3b3355] px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playClick();
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full font-pixel text-xs px-3 py-2.5 rounded flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#ffd166] text-[#12101b] font-bold border-2 border-[#ffe89e]'
                    : 'text-[#a7a9be] hover:text-[#fffffe] hover:bg-[#201b30]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-[#3b3355]">
            <button
              onClick={() => {
                sounds.playClick();
                logout();
              }}
              className="w-full font-pixel text-xs text-[#ef476f] py-2 flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
