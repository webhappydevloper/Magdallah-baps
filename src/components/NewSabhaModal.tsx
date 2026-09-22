import { useState, useMemo } from 'react';
import { SabhaEvent, MahilaMember, DonationRecord } from '../types';
import { CalendarDays, X, Clock, Shirt, Utensils, Search, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  currentMember: MahilaMember;
  donations: DonationRecord[];
  onClose: () => void;
  onAddSabha: (newSabha: SabhaEvent, prasadExpenseInfo?: { amount: number; note: string; donorName?: string; linkedDonationId?: string }) => void;
}

// Day of week mapping in Gujarati
const GUJARATI_DAYS = [
  'રવિવાર',   // 0: Sunday
  'સોમવાર',   // 1: Monday
  'મંગળવાર',  // 2: Tuesday
  'બુધવાર',   // 3: Wednesday
  'ગુરુવાર',  // 4: Thursday
  'શુક્રવાર', // 5: Friday
  'શનિવાર'    // 6: Saturday
];

export const getGujaratiDayFromDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return '';
  return GUJARATI_DAYS[d.getDay()] || '';
};

// Common Swaminarayan Prasad items for quick selection
const COMMON_PRASAD_ITEMS = [
  'મોહનથાળ (શુદ્ધ ઘી)',
  'સુખડી',
  'ચૂરમા લાડુ',
  'બુંદીના લાડુ',
  'શ્રીખંડ (કેસર-પિસ્તા)',
  'દૂધપાક & પૂરી',
  'ખમણ ઢોકળા',
  'ફૂલવડી',
  'પાત્રા',
  'ગાંઠિયા & જલેબી',
  'સાત્વિક સમોસા',
  'બટાકા પૌંઆ',
  'મસાલા છાશ',
  'પંચામૃત પ્રસાદ',
  'ઋતુફળ પ્રસાદ (કેળા/સફરજન)'
];

// Uniform suggestions for Mahila Sabha
const UNIFORM_OPTIONS = [
  'લાલ / મરૂન કલરની સાડી (પરંપરાગત ઉત્સવ પરિધાન)',
  'પીળા / કેસરી રંગની સાડી (સભા પરિધાન)',
  'સફેદ / ક્રીમ સાડી (સાત્વિક પૂજા પરિધાન)',
  'ગુલાબી (પિંક) કલર ડ્રેસકોડ સાડી',
  'જાંબલી / નેવી બ્લૂ પાટોત્સવ પરિધાન',
  'કોઈપણ સાત્વિક શિષ્ટ પરિધાન / સાડી'
];

export default function NewSabhaModal({ currentMember, donations, onClose, onAddSabha }: Props) {
  // 1. Sabha Basics
  const [title, setTitle] = useState('રવિવારીય વિશેષ મહિલા સત્સંગ સભા & વચનામૃત કથા');
  const [date, setDate] = useState('2026-09-22');
  
  // 1. Separate Start Time and End/Prāpta Time
  const [startTime, setStartTime] = useState('15:00'); // ૦૩:૦૦ PM
  const [endTime, setEndTime] = useState('17:30');   // ૦૫:૩૦ PM
  
  // 2. Day of week calculated automatically from date
  const dayOfWeek = useMemo(() => getGujaratiDayFromDate(date), [date]);

  // 3. Sabha Uniform (ડ્રેસકોડ)
  const [uniform, setUniform] = useState('લાલ / મરૂન કલરની સાડી (પરંપરાગત ઉત્સવ પરિધાન)');
  const [customUniform, setCustomUniform] = useState('');
  const [isCustomUniform, setIsCustomUniform] = useState(false);

  // Speaker & Sabha metadata
  const [speakerName, setSpeakerName] = useState('પૂજ્ય સાંખ્યયોગી કંચનબા');
  const [speakerTitle, setSpeakerTitle] = useState('વરિષ્ઠ સાંખ્યયોગી વિદુષી બહેન');
  const [speakerAshram, setSpeakerAshram] = useState('શ્રી લક્ષ્મીનારાયણ દેવ મહિલા આશ્રમ, વડતાલ');
  const [speakerPhone, setSpeakerPhone] = useState('+91 98980 11223');
  const [topic, setTopic] = useState('વચનામૃત સાર: "હરિભક્તોના ગુણ ગ્રહણ કરવાનો મહિમા"');
  const [kirtanBhakti, setKirtanBhakti] = useState('કીર્તન: "મારે ઘેર આવ્યા રે સુંદર શ્યામ..."');
  const [venue, setVenue] = useState('શ્રી સ્વામિનારાયણ મંદિર સત્સંગ હોલ, સુરત');
  const [mode, setMode] = useState<SabhaEvent['mode']>('રૂબરૂ સભા');
  const [expectedAttendees, setExpectedAttendees] = useState<number | ''>(350);
  const [coordinatorsStr, setCoordinatorsStr] = useState('હેપ્પીબેન કાનાણી, રેખાબેન સાંગાણી');

  // 4. PRASAD MANAGEMENT:
  // Source: 'donation' (જેને જેણે દાન અર્પણ કરો મા જે જે સંખ્યા મુજબ લખાવેલ હશે તે) or 'manual' (જો કોઈએ નથી લખાયેલ તો)
  // Filter donations that match either current date or prasadam/bhaktani categories
  const matchingDonations = useMemo(() => {
    return donations.filter(d => {
      const isDateMatch = d.date === date;
      const isRelevantCategory = 
        d.category === 'ભક્તાણી સેવા' || 
        d.category === 'મહાપ્રસાદ સેવા' || 
        d.category === 'જમણવાર સેવા' ||
        d.category === 'સભ્ય સેવા';
      return isDateMatch || isRelevantCategory;
    });
  }, [donations, date]);

  // Default mode selection: if matching donation found for exact date, default to donation
  const exactDateDonation = matchingDonations.find(d => d.date === date);
  const [prasadSource, setPrasadSource] = useState<'donation' | 'manual'>(
    exactDateDonation ? 'donation' : 'manual'
  );
  
  const [selectedDonationId, setSelectedDonationId] = useState<string>(
    exactDateDonation ? exactDateDonation.id : (matchingDonations[0]?.id || '')
  );

  // Prasad Menu Items (વાનગીઓ)
  const [prasadMenuItems, setPrasadMenuItems] = useState<string[]>([
    'મોહનથાળ (શુદ્ધ ઘી)',
    'ખમણ ઢોકળા',
    'સુખડી',
    'મસાલા છાશ'
  ]);
  const [newManualDish, setNewManualDish] = useState('');

  // Manual calculation: એક ડીશ ના ભાવ (₹) & કેટલા સભ્યો છે
  const [dishPrice, setDishPrice] = useState<number | ''>(60);
  const [memberCount, setMemberCount] = useState<number | ''>(300);

  // Selected donation object if source === 'donation'
  const activeDonation = donations.find(d => d.id === selectedDonationId);

  // When activeDonation changes, try to extract dish suggestions or items
  const handleSelectDonation = (dId: string) => {
    setSelectedDonationId(dId);
    const don = donations.find(d => d.id === dId);
    if (don) {
      // If note has parentheses or items, add them if helpful
      if (don.purposeNote && don.purposeNote.includes('(')) {
        const match = don.purposeNote.match(/\((.*?)\)/);
        if (match && match[1]) {
          const extracted = match[1]
            .split(/[,&]/)
            .map(s => s.replace(/\d+\s*બહેનો/, '').trim())
            .filter(Boolean);
          if (extracted.length > 0) {
            setPrasadMenuItems(extracted);
          }
        }
      }
    }
  };

  // Calculate Prasad Expense that will be deducted from fund
  const calculatedExpense = useMemo(() => {
    if (prasadSource === 'donation') {
      return activeDonation ? activeDonation.amount : 0;
    } else {
      const price = Number(dishPrice) || 0;
      const count = Number(memberCount) || 0;
      return price * count;
    }
  }, [prasadSource, activeDonation, dishPrice, memberCount]);

  const toggleMenuItem = (item: string) => {
    setPrasadMenuItems(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleAddManualDish = () => {
    if (!newManualDish.trim()) return;
    if (!prasadMenuItems.includes(newManualDish.trim())) {
      setPrasadMenuItems(prev => [...prev, newManualDish.trim()]);
    }
    setNewManualDish('');
  };

  const handleRemoveDish = (dish: string) => {
    setPrasadMenuItems(prev => prev.filter(i => i !== dish));
  };

  // Convert "15:00" to Gujarati display e.g. "બપોરે ૦૩:૦૦ કલાકે"
  const formatTimeToGujarati = (tStr: string) => {
    if (!tStr) return '';
    const [h, m] = tStr.split(':').map(Number);
    if (isNaN(h)) return tStr;
    const period = h < 12 ? 'સવારે' : h < 16 ? 'બપોરે' : h < 19 ? 'સાંજે' : 'રાત્રે';
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    const pad = (n: number) => n < 10 ? `0${n}` : `${n}`;
    return `${period} ${pad(displayH)}:${pad(m || 0)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !speakerName.trim()) {
      alert('કૃપા કરીને સભાનું શીર્ષક અને વક્તા નામ દાખલ કરો.');
      return;
    }

    const coordinators = coordinatorsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    // Formatted time string
    const startFormatted = formatTimeToGujarati(startTime);
    const endFormatted = formatTimeToGujarati(endTime);
    const combinedTime = `${startFormatted} થી ${endFormatted} કલાકે`;

    const finalUniform = isCustomUniform ? customUniform.trim() || uniform : uniform;

    const newSabha: SabhaEvent = {
      id: `SABHA-${Date.now()}`,
      title: title.trim(),
      date,
      dayOfWeek,
      startTime,
      endTime,
      time: combinedTime,
      conductedBy: {
        name: speakerName.trim(),
        title: speakerTitle.trim(),
        ashramOrCity: speakerAshram.trim(),
        phone: speakerPhone.trim()
      },
      coordinators: coordinators.length > 0 ? coordinators : [currentMember.firstName + ' ' + currentMember.surname],
      topic: topic.trim(),
      kirtanBhakti: kirtanBhakti.trim(),
      venue: venue.trim(),
      mode,
      expectedAttendees: Number(expectedAttendees) || Number(memberCount) || 300,
      rsvpCount: 1,
      isUserRsvpd: true,
      uniform: finalUniform,
      prasadSource,
      linkedDonationId: prasadSource === 'donation' ? selectedDonationId : undefined,
      prasadDonorName: (prasadSource === 'donation' && activeDonation) ? activeDonation.donorName : undefined,
      prasadDonorAmount: (prasadSource === 'donation' && activeDonation) ? activeDonation.amount : undefined,
      prasadMenu: prasadMenuItems,
      dishPrice: prasadSource === 'manual' ? (Number(dishPrice) || 0) : undefined,
      memberCount: prasadSource === 'manual' ? (Number(memberCount) || 0) : undefined,
      prasadExpense: calculatedExpense
    };

    // Prasad expense info for deduction from community fund
    let prasadExpenseInfo = undefined;
    if (calculatedExpense > 0) {
      if (prasadSource === 'donation' && activeDonation) {
        prasadExpenseInfo = {
          amount: calculatedExpense,
          note: `સભા પ્રસાદ વપરાશ (${title.slice(0, 30)}... - દાતા: ${activeDonation.donorName})`,
          donorName: activeDonation.donorName,
          linkedDonationId: activeDonation.id
        };
      } else {
        prasadExpenseInfo = {
          amount: calculatedExpense,
          note: `સભા પ્રસાદ વપરાશ (${title.slice(0, 30)}... - ${memberCount} સભ્યો @ ₹${dishPrice}/ડીશ)`
        };
      }
    }

    onAddSabha(newSabha, prasadExpenseInfo);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto font-gujarati">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-emerald-200 my-8 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-5">
          <div className="flex items-center gap-2.5 text-emerald-950 font-bold text-lg">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-base sm:text-lg">નવી મહિલા સભા આયોજિત કરો</span>
              <span className="block text-xs font-normal text-stone-500 font-chirp">
                સભા સમયગાળો, વાર, યુનિફોર્મ & પ્રસાદ વપરાશ આયોજન
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          
          {/* Sabha Title */}
          <div>
            <label className="block text-stone-700 font-bold mb-1">
              સભાનું નામ / શીર્ષક *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-emerald-50/20"
            />
          </div>

          {/* 1 & 2: DATE (WITH AUTO DAY OF WEEK) & TIME (SEPARATE START & END TIME) */}
          <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider">
              <CalendarDays className="w-4 h-4 text-emerald-700" />
              <span>૧. તારીખ, વાર & સમયગાળો (શરૂ & પ્રાપ્ત સમય)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              
              {/* Date */}
              <div className="sm:col-span-4">
                <label className="block text-stone-700 font-bold mb-1">તારીખ *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-chirp bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* 2. Auto-calculated Day of Week (જે વાર હોય તે આવી જશે) */}
              <div className="sm:col-span-2">
                <label className="block text-stone-700 font-bold mb-1">વાર (આપોઆપ)</label>
                <div className="px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-100/70 text-emerald-950 font-extrabold text-sm flex items-center justify-center">
                  {dayOfWeek || 'વાર'}
                </div>
              </div>

              {/* 1. Start Time (શરૂ સમય) */}
              <div className="sm:col-span-3">
                <label className="block text-stone-700 font-bold mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" /> શરૂ સમય *
                </label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-chirp bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* 1. End/Prāpta Time (પ્રાપ્ત / પૂર્ણ સમય) */}
              <div className="sm:col-span-3">
                <label className="block text-stone-700 font-bold mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" /> પ્રાપ્ત (પૂર્ણ) સમય *
                </label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-chirp bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Time preview in Gujarati */}
            <div className="text-[11px] text-stone-600 font-medium bg-white px-3 py-1.5 rounded-lg border border-stone-200 flex items-center justify-between">
              <span>સભા સમયગાળો:</span>
              <strong className="text-emerald-900 font-bold">
                {date} ({dayOfWeek}) • {formatTimeToGujarati(startTime)} થી {formatTimeToGujarati(endTime)} કલાકે
              </strong>
            </div>
          </div>

          {/* 3. SABHA UNIFORM (સભા નો યુનિફોર્મ શું પેરવાનો રહશે) */}
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase tracking-wider">
                <Shirt className="w-4 h-4 text-amber-800" />
                <span>૨. સભા નો યુનિફોર્મ (ડ્રેસકોડ) શું પેરવાનો રહશે *</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomUniform(!isCustomUniform)}
                className="text-[11px] text-amber-900 hover:text-amber-950 font-bold underline cursor-pointer"
              >
                {isCustomUniform ? 'લિસ્ટ માંથી પસંદ કરો' : '+ મેન્યુઅલ યુનિફોર્મ લખો'}
              </button>
            </div>

            {!isCustomUniform ? (
              <div>
                <select
                  value={uniform}
                  onChange={(e) => setUniform(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-amber-300 rounded-xl text-sm bg-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {UNIFORM_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="દા.ત. ગુલાબી બોર્ડર વાળી પીળી સાડી / વિશેષ મંડળ યુનિફોર્મ"
                  value={customUniform}
                  onChange={(e) => setCustomUniform(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-amber-300 rounded-xl text-sm bg-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            )}

            {/* Quick badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['લાલ / મરૂન સાડી', 'પીળી / કેસરી સાડી', 'સફેદ સાડી', 'ગુલાબી સાડી'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setIsCustomUniform(false);
                    const matched = UNIFORM_OPTIONS.find(o => o.includes(tag.split(' ')[0]));
                    if (matched) setUniform(matched);
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100/70 border border-amber-200 rounded-lg text-[11px] font-semibold text-amber-950 transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 4. SABHA PRASAD & EXPENSE / BHAKTA-ARPAN SECTION */}
          <div className="bg-emerald-50/70 p-4 sm:p-5 rounded-2xl border-2 border-emerald-300 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-3">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs uppercase tracking-wider">
                <Utensils className="w-4.5 h-4.5 text-emerald-800" />
                <span>૩. સભામાં પ્રસાદ આયોજન & સેવા ભંડોળ વપરાશ</span>
              </div>

              {/* Toggle: Donation Source vs Manual */}
              <div className="flex items-center bg-white p-1 rounded-xl border border-emerald-300 text-xs">
                <button
                  type="button"
                  onClick={() => setPrasadSource('donation')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    prasadSource === 'donation'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-emerald-900'
                  }`}
                >
                  દાન અર્પણમાંથી (લખાવેલ દાન)
                </button>
                <button
                  type="button"
                  onClick={() => setPrasadSource('manual')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    prasadSource === 'manual'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-emerald-900'
                  }`}
                >
                  મેન્યુઅલ વાનગી & ડીશ ભાવ
                </button>
              </div>
            </div>

            {/* CASE A: દાન અર્પણ કરો મા જે જે સંખ્યા મુજબ લખાવેલ હશે તે અનુસાર */}
            {prasadSource === 'donation' && (
              <div className="space-y-3 bg-white p-3.5 rounded-xl border border-emerald-200">
                <div className="flex items-center justify-between">
                  <label className="text-stone-800 font-bold block text-xs">
                    દાન અર્પણ રેકોર્ડ પસંદ કરો (તારીખ: {date} અથવા ભક્તાણી / પ્રસાદ સેવા):
                  </label>
                  {matchingDonations.length > 0 && (
                    <span className="text-[11px] text-emerald-700 font-bold">
                      {matchingDonations.length} દાન ઉપલબ્ધ
                    </span>
                  )}
                </div>

                {matchingDonations.length === 0 ? (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                    આ તારીખ માટે કોઈ દાન અર્પણ નોંધાયેલ નથી. કૃપા કરીને "મેન્યુઅલ વાનગી & ડીશ ભાવ" વિકલ્પ પસંદ કરો.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {matchingDonations.map((don) => {
                      const isSelected = selectedDonationId === don.id;
                      const isExactDate = don.date === date;
                      return (
                        <div
                          key={don.id}
                          onClick={() => handleSelectDonation(don.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                              : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <input
                              type="radio"
                              name="selectedDonation"
                              checked={isSelected}
                              onChange={() => handleSelectDonation(don.id)}
                              className="mt-1 accent-emerald-700"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-stone-900 text-xs">{don.donorName}</span>
                                {isExactDate && (
                                  <span className="px-2 py-0.2 bg-emerald-200 text-emerald-950 font-bold rounded text-[10px]">
                                    આજનું દાન ({don.date})
                                  </span>
                                )}
                                <span className="px-2 py-0.2 bg-amber-100 text-amber-900 font-bold rounded text-[10px]">
                                  {don.category}
                                </span>
                              </div>
                              <p className="text-[11px] text-stone-600 mt-0.5 line-clamp-1">
                                {don.purposeNote}
                              </p>
                              <div className="text-[10px] text-stone-500 font-chirp mt-0.5">
                                રસીદ: {don.receiptNo} • તારીખ: {don.date}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="font-extrabold font-chirp text-sm text-emerald-950">
                              ₹{don.amount.toLocaleString('en-IN')}
                            </div>
                            <span className="text-[10px] text-stone-500 font-medium">
                              {don.paymentMode}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeDonation && (
                  <div className="p-2.5 bg-emerald-100/60 rounded-xl border border-emerald-300 text-emerald-950 flex items-center justify-between text-xs">
                    <span>
                      દાન અર્પણ વપરાશ: <strong>{activeDonation.donorName}</strong> ({activeDonation.category})
                    </span>
                    <strong className="font-chirp text-sm text-emerald-900">
                      ₹{activeDonation.amount.toLocaleString('en-IN')}
                    </strong>
                  </div>
                )}
              </div>
            )}

            {/* CASE B: જો કોઈએ નથી લખાયેલ તો મેન્યુઅલ વાનગી & એક ડીશ ના ભાવ & કેટલા સભ્યો છે */}
            {prasadSource === 'manual' && (
              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      એક ડીશ ના ભાવ (₹ Dish Price) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 font-bold text-stone-500">₹</span>
                      <input
                        type="number"
                        min="1"
                        required={prasadSource === 'manual'}
                        value={dishPrice}
                        onChange={(e) => setDishPrice(e.target.value ? Number(e.target.value) : '')}
                        className="w-full pl-7 pr-3 py-2 border border-stone-300 rounded-xl text-sm font-chirp font-bold text-stone-900 bg-white"
                        placeholder="દા.ત. 60"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      કેટલા સભ્યો / બહેનો છે (Member Count) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required={prasadSource === 'manual'}
                      value={memberCount}
                      onChange={(e) => setMemberCount(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-chirp font-bold text-stone-900 bg-white"
                      placeholder="દા.ત. 300"
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 flex items-center justify-between text-xs">
                  <span>
                    ગણતરી: {Number(memberCount) || 0} સભ્યો × ₹{Number(dishPrice) || 0}/ડીશ =
                  </span>
                  <strong className="font-chirp text-sm text-amber-950 font-black">
                    ₹{((Number(dishPrice) || 0) * (Number(memberCount) || 0)).toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>
            )}

            {/* PRASAD MENU ITEMS (વાનગીઓનું લિસ્ટ & ઉમેરો) */}
            <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-2.5">
              <label className="block text-stone-800 font-bold text-xs">
                પ્રસાદમાં શું શું વાનગી રહેશે (પસંદ કરો અથવા મેન્યુઅલ ઉમેરો):
              </label>

              {/* Selected Dishes Chips */}
              <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-stone-50 rounded-xl border border-stone-200">
                {prasadMenuItems.length === 0 ? (
                  <span className="text-stone-400 text-xs">કોઈ વાનગી પસંદ કરેલ નથી. નીચેથી પસંદ કરો અથવા ઉમેરો.</span>
                ) : (
                  prasadMenuItems.map((dish) => (
                    <span
                      key={dish}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-950 font-bold rounded-lg text-xs border border-emerald-300 shadow-2xs"
                    >
                      <span>{dish}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDish(dish)}
                        className="hover:text-red-700 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Manual Dish Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="મેન્યુઅલ વાનગી લખો (દા.ત. મોહનથાળ, ગરમાગરમ સુખડી, ખમણ...)"
                  value={newManualDish}
                  onChange={(e) => setNewManualDish(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddManualDish();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 border border-stone-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddManualDish}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ઉમેરો</span>
                </button>
              </div>

              {/* Quick Preset Common Swaminarayan Prasad items */}
              <div>
                <span className="text-[11px] text-stone-500 font-semibold block mb-1">
                  વારંવાર બનતી સાત્વિક વાનગીઓ:
                </span>
                <div className="flex flex-wrap gap-1">
                  {COMMON_PRASAD_ITEMS.map((item) => {
                    const isPicked = prasadMenuItems.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleMenuItem(item)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                          isPicked
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-stone-50 hover:bg-emerald-50 text-stone-700 border-stone-200'
                        }`}
                      >
                        {isPicked ? `✓ ${item}` : `+ ${item}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* FUND DEDUCTION NOTICE (આ અમોઉન્ટ સભા માં પ્રસાદ માં વપરાશ ઠસે એટલે ટોટલ ભંડોળ માં થી માઇનસ થશે) */}
            <div className="p-3 bg-amber-500/15 rounded-xl border border-amber-400 text-amber-950 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <span className="font-bold block text-amber-950">
                  સેવા ભંડોળમાંથી બાદ થનાર કુલ પ્રસાદ વપરાશ રકમ: ₹{calculatedExpense.toLocaleString('en-IN')}
                </span>
                <p className="text-[11px] text-stone-700 leading-relaxed">
                  આ સભા સાચવતાં આ રકમ સભા પ્રસાદ વપરાશ પેટે કુલ ભંડોળમાંથી આપોઆપ માઇનસ (બાદ) થશે.
                  {prasadSource === 'donation' && activeDonation && (
                    <span> (દાતા: {activeDonation.donorName} ના અર્પણ ભંડોળમાંથી વપરાશ)</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* SPEAKER BOX: સભા કોણ કરાવે છે */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
            <h4 className="font-bold text-emerald-950 text-xs uppercase tracking-wide">
              સભા કોણ કરાવે છે (મુખ્ય વક્તા / સાંખ્યયોગી બહેનોની વિગતો) *
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-bold mb-1">વક્તાનું પૂરું નામ *</label>
                <input
                  type="text"
                  required
                  value={speakerName}
                  onChange={(e) => setSpeakerName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-1">હોદ્દો / પદવી *</label>
                <input
                  type="text"
                  required
                  value={speakerTitle}
                  onChange={(e) => setSpeakerTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-bold mb-1">આશ્રમ / સંસ્કાર કેન્દ્ર</label>
                <input
                  type="text"
                  value={speakerAshram}
                  onChange={(e) => setSpeakerAshram(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-1">સંપર્ક નંબર</label>
                <input
                  type="text"
                  value={speakerPhone}
                  onChange={(e) => setSpeakerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm bg-white font-chirp"
                />
              </div>
            </div>
          </div>

          {/* Topic & Kirtan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-bold mb-1">
                સભાનો વિષય / ગ્રંથ રહસ્ય (Topic) *
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">કીર્તન આરાધના</label>
              <input
                type="text"
                value={kirtanBhakti}
                onChange={(e) => setKirtanBhakti(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm bg-white"
              />
            </div>
          </div>

          {/* Venue & Attendees & Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-stone-700 font-bold mb-1">સભા હોલ / સ્થળ *</label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">અપેક્ષિત બહેનોની સંખ્યા</label>
              <input
                type="number"
                value={expectedAttendees}
                onChange={(e) => setExpectedAttendees(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-chirp bg-white"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">સભા મોડ *</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm bg-white"
              >
                <option value="રૂબરૂ સભા">રૂબરૂ સભા</option>
                <option value="લાઈવ પ્રસારણ સહિત">લાઈવ પ્રસારણ સહિત</option>
                <option value="વિશેષ શિબિર">વિશેષ શિબિર</option>
              </select>
            </div>
          </div>

          {/* Coordinators */}
          <div>
            <label className="block text-stone-700 font-bold mb-1">
              સહ-સંચાલિકા બહેનો (અલ્પવિરામ વડે અલગ કરો)
            </label>
            <input
              type="text"
              value={coordinatorsStr}
              onChange={(e) => setCoordinatorsStr(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm bg-white"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row justify-end gap-3 items-center">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold cursor-pointer"
            >
              રદ કરો
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition-all shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <CalendarDays className="w-4 h-4" />
              <span>સભા આયોજન સાચવો & ભંડોળ વપરાશ કન્ફર્મ કરો</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
