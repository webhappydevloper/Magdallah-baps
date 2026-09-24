import { useState } from 'react';
import { MahilaMember, EmailNotification } from '../types';
import { 
  Users, 
  HeartHandshake, 
  UtensilsCrossed, 
  CalendarDays, 
  LayoutDashboard, 
  UserRoundCheck, 
  Mail, 
  Plus, 
  ChevronDown,
  Sparkles,
  Bell,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { User } from 'firebase/auth';
import GoogleSignInButton from './GoogleSignInButton';
import { useThakorjiImage } from '../utils/imageStore';

interface Props {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  members: MahilaMember[];
  currentMember: MahilaMember;
  setCurrentMemberId: (id: string) => void;
  onOpenNewMemberModal: () => void;
  onOpenDonateModal: () => void;
  onOpenJamanwarModal: () => void;
  notifications: EmailNotification[];
  firebaseConnected?: boolean;
  authUser?: User | null;
  authToken?: string | null;
  onGoogleSignIn?: () => void;
  onSignOut?: () => void;
  isSigningIn?: boolean;
}

export default function Header({
  currentTab,
  setCurrentTab,
  members,
  currentMember,
  setCurrentMemberId,
  onOpenNewMemberModal,
  onOpenDonateModal,
  onOpenJamanwarModal,
  notifications,
  firebaseConnected = true,
  authUser,
  authToken,
  onGoogleSignIn,
  onSignOut,
  isSigningIn = false
}: Props) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [thakorjiImg] = useThakorjiImage();

  const tabs = [
    { id: 'dashboard', label: 'ડેશબોર્ડ', icon: LayoutDashboard },
    { id: 'profile', label: 'સભ્ય પ્રોફાઇલ & પરિવાર', icon: UserRoundCheck },
    { id: 'donations', label: 'દાન & ભંડોળ', icon: HeartHandshake },
    { id: 'jamanwar', label: 'જમણવાર & મેનુ', icon: UtensilsCrossed },
    { id: 'sabha', label: 'મહિલા સભા આયોજન', icon: CalendarDays },
    { id: 'directory', label: 'સમિતિ & સભ્યો', icon: Users },
    { 
      id: 'gmail', 
      label: 'Gmail & સૂચનાઓ', 
      icon: Mail, 
      badge: notifications.length,
      isLive: Boolean(authToken)
    }
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-amber-200/80 sticky top-0 z-40 shadow-xs font-gujarati no-print">
      {/* Main Brand & Actions Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Portal Title */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            {/* Shree Swaminarayan Bhagwan Divine Logo Badge */}
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 p-0.5 shadow-md flex items-center justify-center shrink-0 border border-amber-300 ring-2 ring-amber-400/30 overflow-hidden">
              <img 
                src={thakorjiImg || "/swaminarayan-logo.png"} 
                alt="શ્રી સ્વામિનારાયણ ભગવાન" 
                className="w-full h-full object-cover rounded-xl" 
                referrerPolicy="no-referrer" 
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-amber-950 tracking-tight leading-none font-serif-gujarati">
                  શ્રી સ્વામિનારાયણ ભક્તાણી સંપ્રદાય
                </h1>
                <span className="hidden sm:inline-block text-[11px] font-bold tracking-wider px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full border border-amber-300 font-serif-gujarati">
                  મગદલ્લાહ-સુરત
                </span>
              </div>
              <p className="text-xs text-amber-800 font-medium mt-1">
                શ્રી પરમકૃપાળુ સ્વામીનારાયણ મહારાજ ની વહાલી ભક્તાણી
              </p>
            </div>
          </div>

          {/* Mobile Profile pill */}
          <div className="md:hidden flex items-center gap-2">
            {onGoogleSignIn && (
              <GoogleSignInButton
                onSignIn={onGoogleSignIn}
                isLoading={isSigningIn}
                userEmail={authUser?.email}
                userName={authUser?.displayName}
                userPhoto={authUser?.photoURL}
                onSignOut={onSignOut}
                variant="compact"
              />
            )}
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-medium text-amber-900"
            >
              <div className={`w-5 h-5 rounded-full ${currentMember.avatarColor} text-white flex items-center justify-center text-[10px] font-bold`}>
                {currentMember.firstName.charAt(0)}
              </div>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right side: Quick Action Buttons, Google Sign In & Current Profile Switcher */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
          {/* Official Google Sign In Button */}
          {onGoogleSignIn && (
            <div className="hidden sm:block">
              <GoogleSignInButton
                onSignIn={onGoogleSignIn}
                isLoading={isSigningIn}
                userEmail={authUser?.email}
                userName={authUser?.displayName}
                userPhoto={authUser?.photoURL}
                onSignOut={onSignOut}
                variant="compact"
                label="Sign in with Google"
              />
            </div>
          )}

          {/* Quick Donate Button */}
          <button
            onClick={onOpenDonateModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>દાન અર્પણ કરો</span>
          </button>

          {/* Quick Jamanwar Booking */}
          <button
            onClick={onOpenJamanwarModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <UtensilsCrossed className="w-4 h-4 text-amber-700" />
            <span>જમણવાર સેવા</span>
          </button>

          {/* Notifications button */}
          <button
            onClick={() => setCurrentTab('gmail')}
            title="Gmail નોટિફિકેશન્સ"
            className="relative p-2 text-stone-600 hover:text-amber-800 hover:bg-amber-100/70 rounded-xl transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center font-chirp border-2 border-white">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Member Profile Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 rounded-xl transition-all cursor-pointer text-left"
            >
              <div className={`w-8 h-8 rounded-full ${currentMember.avatarColor} text-white flex items-center justify-center text-sm font-bold shadow-xs`}>
                {currentMember.firstName.charAt(0)}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-stone-900 flex items-center gap-1">
                  <span>{currentMember.firstName} {currentMember.surname}</span>
                  <span className="text-[10px] font-chirp text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded font-bold">
                    #{currentMember.memberNumber || currentMember.id}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </div>
                <div className="text-[11px] text-amber-700 font-medium truncate max-w-[130px]">
                  {currentMember.mandalRole}
                </div>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-amber-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-stone-100">
                  <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    હાલનું સભ્ય પ્રોફાઇલ પસંદ કરો
                  </p>
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {members.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setCurrentMemberId(m.id);
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-amber-50/70 transition-colors cursor-pointer ${
                        m.id === currentMember.id ? 'bg-amber-50/90 text-amber-900 font-semibold' : 'text-stone-700'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full ${m.avatarColor} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
                        {m.firstName.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold truncate">
                          {m.firstName} {m.husbandName ? m.husbandName.split(' ')[0] : ''} {m.surname}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate">
                          #{m.memberNumber || m.id} • {m.city} • {m.occupation}
                        </div>
                      </div>
                      {m.id === currentMember.id && (
                        <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0"></span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="p-2 border-t border-stone-100 bg-stone-50/50">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenNewMemberModal();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-amber-800 bg-amber-100/80 hover:bg-amber-200 rounded-xl transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>નવી મહિલા સભ્ય નોંધણી કરો</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-amber-50/60 border-t border-amber-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-700 hover:text-amber-900 hover:bg-amber-100/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-amber-700'}`} />
                  <span>{tab.label}</span>
                  {tab.isLive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Gmail કનેક્ટેડ"></span>
                  )}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`text-[10px] font-chirp px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white text-amber-700' : 'bg-amber-200 text-amber-900'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
