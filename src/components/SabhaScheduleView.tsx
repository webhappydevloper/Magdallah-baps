import { useState } from 'react';
import { SabhaEvent, MahilaMember } from '../types';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Users, 
  UserCheck, 
  Sparkles, 
  BookOpen, 
  Music, 
  Radio, 
  Plus, 
  Check, 
  Phone,
  Shirt,
  Utensils
} from 'lucide-react';
import { useThakorjiImage } from '../utils/imageStore';

interface Props {
  sabhas: SabhaEvent[];
  currentMember: MahilaMember;
  onToggleRsvp: (sabhaId: string) => void;
  onOpenNewSabhaModal: () => void;
}

export default function SabhaScheduleView({
  sabhas,
  currentMember,
  onToggleRsvp,
  onOpenNewSabhaModal
}: Props) {
  const [thakorjiImg] = useThakorjiImage();
  const [filterMode, setFilterMode] = useState<string>('all');

  const filteredSabhas = sabhas.filter(s => {
    if (filterMode === 'all') return true;
    return s.mode === filterMode;
  });

  return (
    <div className="space-y-6 font-gujarati animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-amber-50 p-1 shrink-0 items-center justify-center border-2 border-amber-300 ring-2 ring-amber-400/30 shadow-md overflow-hidden">
            <img 
              src={thakorjiImg || "/swaminarayan-logo.png"} 
              alt="શ્રી સ્વામિનારાયણ ભગવાન" 
              className="w-full h-full object-cover rounded-xl" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full text-xs font-semibold backdrop-blur-xs text-emerald-100 border border-white/10 mb-2">
              <CalendarDays className="w-3.5 h-3.5 text-emerald-300" />
              <span>મહિલા સત્સંગ & સ્વાધ્યાય સભા શેડ્યૂલ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif-gujarati">
              સ્વામિનારાયણ મહિલા સભા કાર્યક્રમ
            </h2>
            <p className="text-emerald-100 text-sm mt-1 max-w-2xl leading-relaxed">
              સભા ક્યારે થાય છે, તારીખ અને સમય, સભા કોણ કરાવે છે (સાંખ્યયોગી વિદુષી બહેનો), વિષય અને કીર્તન આરાધનાની તમામ બાહ્ય વિગતો સાથેનું આયોજન.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenNewSabhaModal}
          className="px-6 py-3 bg-white text-emerald-950 hover:bg-emerald-50 rounded-2xl text-sm font-bold shadow-md transition-all cursor-pointer inline-flex items-center gap-2 shrink-0"
        >
          <Plus className="w-5 h-5 text-emerald-700" />
          <span>નવી સભા આયોજિત કરો</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            સભા પ્રકાર:
          </span>
          <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
            {['all', 'રૂબરૂ સભા', 'લાઈવ પ્રસારણ સહિત', 'વિશેષ શિબિર'].map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                  filterMode === mode
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {mode === 'all' ? 'બધી સભાઓ' : mode}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-stone-500 font-medium">
          કુલ {filteredSabhas.length} સભાઓ ઉપલબ્ધ
        </span>
      </div>

      {/* Sabha Cards List */}
      <div className="space-y-6">
        {filteredSabhas.map((sabha) => {
          return (
            <div
              key={sabha.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all space-y-5"
            >
              {/* Sabha Header with Badges & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="px-3 py-0.5 bg-emerald-100 text-emerald-900 font-bold rounded-full text-xs">
                      {sabha.mode}
                    </span>
                    <span className="text-xs text-stone-500 flex items-center gap-1 font-chirp">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" />
                      {sabha.time}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                    {sabha.title}
                  </h3>
                </div>

                {/* RSVP Attendance Button */}
                <button
                  onClick={() => onToggleRsvp(sabha.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs inline-flex items-center gap-2 shrink-0 ${
                    sabha.isUserRsvpd
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 ring-2 ring-emerald-400/30'
                      : 'bg-stone-100 hover:bg-emerald-50 text-stone-800 border border-stone-300'
                  }`}
                >
                  {sabha.isUserRsvpd ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>હાજરી નોંધાઈ ગઈ છે ({sabha.rsvpCount})</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4 text-emerald-700" />
                      <span>હું હાજરી આપીશ (RSVP)</span>
                    </>
                  )}
                </button>
              </div>

              {/* WHO CONDUCTS THE SABHA: Highlight Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0 font-serif-gujarati">
                    {sabha.conductedBy.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                      સભા કોણ કરાવે છે (મુખ્ય વક્તા / પ્રવચનકાર):
                    </span>
                    <h4 className="text-lg font-extrabold text-stone-900 mt-0.5">
                      {sabha.conductedBy.name}
                    </h4>
                    <p className="text-xs text-stone-600">
                      {sabha.conductedBy.title} • {sabha.conductedBy.ashramOrCity}
                    </p>
                  </div>
                </div>

                {sabha.conductedBy.phone && (
                  <div className="flex items-center gap-1.5 text-xs text-stone-600 font-chirp bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{sabha.conductedBy.phone}</span>
                  </div>
                )}
              </div>

              {/* Sabha Details Grid: Date, Venue, Topic, Kirtan, Coordinators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {/* Date & Time */}
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block font-semibold flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5 text-emerald-700" /> તારીખ, વાર & સમય:
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <strong className="text-sm text-stone-900 font-chirp">{sabha.date}</strong>
                    {sabha.dayOfWeek && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 font-bold rounded text-[11px]">
                        {sabha.dayOfWeek}
                      </span>
                    )}
                  </div>
                  <p className="text-stone-600 mt-0.5">{sabha.time}</p>
                </div>

                {/* Venue */}
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" /> સભા સ્થાન / હોલ:
                  </span>
                  <strong className="text-sm text-stone-900 block mt-1">{sabha.venue}</strong>
                  <p className="text-stone-600 mt-0.5">અંદાજિત {sabha.expectedAttendees} બહેનોની બેઠક વ્યવસ્થા</p>
                </div>

                {/* Coordinators */}
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block font-semibold flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-700" /> સહ-સંચાલિકા બહેનો:
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {sabha.coordinators.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white rounded-md border border-stone-200 text-stone-800 font-medium text-[11px]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Topic / Grantha Path */}
                <div className="sm:col-span-2 lg:col-span-2 p-3.5 bg-amber-50/40 rounded-xl border border-amber-200">
                  <span className="text-amber-900 block font-bold flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-amber-700" /> સભાનો વિષય / ગ્રંથ રહસ્ય:
                  </span>
                  <p className="text-stone-800 font-semibold mt-1 text-sm leading-relaxed">
                    {sabha.topic}
                  </p>
                </div>

                {/* Kirtan Bhakti */}
                <div className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-200">
                  <span className="text-amber-900 block font-bold flex items-center gap-1">
                    <Music className="w-3.5 h-3.5 text-amber-700" /> કીર્તન આરાધના:
                  </span>
                  <p className="text-stone-800 font-medium mt-1 italic">
                    {sabha.kirtanBhakti}
                  </p>
                </div>

                {/* Sabha Uniform (ડ્રેસકોડ) */}
                <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200">
                  <span className="text-rose-900 block font-bold flex items-center gap-1">
                    <Shirt className="w-3.5 h-3.5 text-rose-700" /> સભા યુનિફોર્મ (ડ્રેસકોડ):
                  </span>
                  <p className="text-rose-950 font-bold mt-1 text-xs">
                    {sabha.uniform || 'લાલ / મરૂન કલરની સાડી (પરંપરાગત સભા પરિધાન)'}
                  </p>
                </div>

                {/* Prasad Details & Expense from Fund */}
                <div className="sm:col-span-2 lg:col-span-2 p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-300">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-950 block font-bold flex items-center gap-1">
                      <Utensils className="w-3.5 h-3.5 text-emerald-700" /> સભા મહાપ્રસાદ આયોજન:
                    </span>
                    {sabha.prasadExpense ? (
                      <span className="px-2 py-0.5 bg-emerald-200 text-emerald-950 font-extrabold rounded-md text-[11px] font-chirp">
                        ભંડોળ વપરાશ: ₹{sabha.prasadExpense.toLocaleString('en-IN')}
                      </span>
                    ) : null}
                  </div>
                  
                  {sabha.prasadMenu && sabha.prasadMenu.length > 0 ? (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {sabha.prasadMenu.map((m, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-white border border-emerald-200 rounded-md text-[11px] font-semibold text-emerald-950">
                          ✓ {m}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-stone-600 mt-1">શુદ્ધ સાત્વિક પ્રસાદ (મોહનથાળ, ખમણ ઢોકળા, છાશ)</p>
                  )}

                  {sabha.dishPrice && sabha.memberCount ? (
                    <div className="text-[10px] text-emerald-800 mt-1 font-chirp">
                      ગણતરી: {sabha.memberCount} સભ્યો × ₹{sabha.dishPrice}/ડીશ = ₹{(sabha.dishPrice * sabha.memberCount).toLocaleString('en-IN')} (સેવા ભંડોળમાંથી બાદ)
                    </div>
                  ) : sabha.prasadSource === 'donation' ? (
                    <div className="text-[10px] text-emerald-800 mt-1">
                      દાન અર્પણમાંથી માન્ય પ્રસાદ સેવા ભંડોળ વપરાશ
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
