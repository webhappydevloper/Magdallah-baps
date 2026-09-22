import { useState, useRef, useEffect } from 'react';
import { JamanwarPlan, MahilaMember, JamanwarMenuItem } from '../types';
import { Utensils, X, Check, Search, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  currentMember: MahilaMember;
  members?: MahilaMember[];
  onClose: () => void;
  onAddJamanwar: (newPlan: JamanwarPlan) => void;
}

// Swaminarayan temple traditional menu items with categories
const TEMPLE_MENU_ITEMS: { category: JamanwarMenuItem['category']; items: string[] }[] = [
  {
    category: 'મિઠાઈ',
    items: [
      'મોહનથાળ (શુદ્ધ ઘી)',
      'લાડુ (ચૂરમા લાડુ)',
      'બુંદીના લાડુ',
      'સુખડી (ગોળ પાપડી)',
      'શ્રીખંડ (કેસર-પિસ્તા)',
      'દૂધપાક',
      'ખીર (ડ્રાયફ્રૂટ)',
      'જલેબી',
      'ગુલાબજાંબુ',
      'મેસૂર પાક',
      'કાજુકતરી',
      'કેસર પેંડા',
      'હલવો (દૂધીનો/ગાજરનો)',
      'પંચામૃત પ્રસાદ'
    ]
  },
  {
    category: 'શાક',
    items: [
      'ઊંધિયું (સ્વામિનારાયણ સ્પેશિયલ)',
      'કાજુ કરી (સાત્વિક)',
      'પનીર ભુરજી (સાત્વિક)',
      'ભરેલા રવૈયા બટાકા',
      'રસોવાળા બટાકાનું શાક',
      'ચણાનું શાક (દેશી ચણા)',
      'મિક્સ કઠોળ શાક (વાલ/મગ)',
      'દૂધી ચણાની દાળ',
      'સેવ ટામેટાનું શાક',
      'ભીંડાનું શાક'
    ]
  },
  {
    category: 'ફરસાણ',
    items: [
      'ખમણ ઢોકળા',
      'ફૂલવડી',
      'મિક્સ ભજીયા',
      'પાત્રા',
      'સમોસા (સાત્વિક)',
      'કચોરી (લીલવાની/દાળની)',
      'ગાંઠિયા / પાપડી'
    ]
  },
  {
    category: 'રોટલી / પૂરી',
    items: [
      'ગરમાગરમ પૂરી',
      'ફુલકા રોટલી',
      'થેપલા'
    ]
  },
  {
    category: 'દાળ-ભાત',
    items: [
      'ગુજરાતી દાળ (મીઠી)',
      'બાસમતી જીરા રાઇસ',
      'રાજભોગ પુલાવ',
      'ગુજરાતી કઢી',
      'વઘારેલી ખીચડી'
    ]
  },
  {
    category: 'પીણા & સંભારો',
    items: [
      'તાજી છાશ (જીરાવાળી)',
      'સાંભારો (પપૈયા/ગાજર)',
      'અડદના પાપડ',
      'તળેલી લીલી મરચી',
      'કેરીનું અથાણું'
    ]
  }
];

export default function NewJamanwarModal({
  currentMember,
  members = [],
  onClose,
  onAddJamanwar
}: Props) {
  // 1. Yajman: Registered Member Lookup + Manual Name Entry
  const initialYajman = `${currentMember.firstName} ${currentMember.husbandName ? currentMember.husbandName.split(' ')[0] + ' ' : ''}${currentMember.surname}`.trim();
  const [hostName, setHostName] = useState(initialYajman);
  const [selectedMemberId, setSelectedMemberId] = useState<string>(currentMember.id);
  const [showMemberSuggestions, setShowMemberSuggestions] = useState(false);
  const memberDropdownRef = useRef<HTMLDivElement>(null);

  // 2. Title: jamnvar રકમ (₹) with English India input formatting
  const [amountInput, setAmountInput] = useState('25,000');

  // Occasion & Basic details
  const [occasion, setOccasion] = useState('એકાદશી વિશેષ જમણવાર સેવા');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('બપોરે ૧૧:૩૦ કલાકે');
  const [mealType, setMealType] = useState<JamanwarPlan['mealType']>('બપોરનું ભોજન (લંચ)');
  const [approxGuests, setApproxGuests] = useState<number>(300);
  const [locationHall, setLocationHall] = useState('શ્રી સ્વામિનારાયણ મંદિર - ભોજનાલય ખંડ');

  // 3. Menu items: pre-selected + temple items + manual addition
  const [selectedItems, setSelectedItems] = useState<string[]>([
    'મોહનથાળ (શુદ્ધ ઘી)',
    'ઊંધિયું (સ્વામિનારાયણ સ્પેશિયલ)',
    'ગરમાગરમ પૂરી',
    'ગુજરાતી દાળ (મીઠી)',
    'બાસમતી જીરા રાઇસ',
    'તાજી છાશ (જીરાવાળી)'
  ]);

  const [customItem, setCustomItem] = useState('');
  const [itemSearch, setItemSearch] = useState('');

  // Close member suggestion when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (memberDropdownRef.current && !memberDropdownRef.current.contains(event.target as Node)) {
        setShowMemberSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter members for autocomplete
  const searchClean = hostName.trim().toLowerCase();
  const matchingMembers = members.filter(m => {
    if (!searchClean) return true;
    const fullName = `${m.firstName} ${m.husbandName || ''} ${m.fatherName || ''} ${m.surname}`.toLowerCase();
    const memNo = (m.memberNumber || '').toLowerCase();
    return fullName.includes(searchClean) || memNo.includes(searchClean);
  });

  const handleSelectMember = (m: MahilaMember) => {
    const formatted = `${m.firstName} ${m.husbandName ? m.husbandName.split(' ')[0] + ' ' : ''}${m.surname}`.trim();
    setHostName(formatted);
    setSelectedMemberId(m.id);
    setShowMemberSuggestions(false);
  };

  // English India format handler
  const formatIndianNumber = (valStr: string) => {
    const digits = valStr.replace(/\D/g, '');
    if (!digits) return '';
    const num = parseInt(digits, 10);
    if (isNaN(num)) return '';
    return num.toLocaleString('en-IN');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatIndianNumber(e.target.value);
    setAmountInput(formatted);
  };

  const handlePresetAmount = (amt: number) => {
    setAmountInput(amt.toLocaleString('en-IN'));
  };

  // Menu item toggle
  const toggleItem = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(prev => prev.filter(i => i !== item));
    } else {
      setSelectedItems(prev => [...prev, item]);
    }
  };

  // Add custom manual item
  const handleAddCustomItem = () => {
    const trimmed = customItem.trim();
    if (!trimmed) return;
    if (!selectedItems.includes(trimmed)) {
      setSelectedItems(prev => [...prev, trimmed]);
    }
    setCustomItem('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseInt(amountInput.replace(/\D/g, ''), 10);

    if (!hostName.trim()) {
      alert('કૃપા કરીને યજમાનનું નામ દાખલ કરો.');
      return;
    }
    if (!numericAmount || numericAmount <= 0) {
      alert('કૃપા કરીને માન્ય jamnvar રકમ દાખલ કરો.');
      return;
    }
    if (selectedItems.length === 0) {
      alert('કૃપા કરીને ઓછામાં ઓછી ૧ વાનગી મેનુમાં પસંદ કરો.');
      return;
    }

    // Map selected flat items back to categorized menu structure
    const structuredMenu: JamanwarMenuItem[] = TEMPLE_MENU_ITEMS.map(cat => ({
      category: cat.category,
      items: cat.items.filter(i => selectedItems.includes(i))
    })).filter(cat => cat.items.length > 0);

    // Any custom added items that didn't match default categories go under 'ફરસાણ' or 'મિઠાઈ'
    const defaultAllItems = TEMPLE_MENU_ITEMS.flatMap(c => c.items);
    const extraCustomItems = selectedItems.filter(i => !defaultAllItems.includes(i));
    if (extraCustomItems.length > 0) {
      structuredMenu.push({
        category: 'ફરસાણ',
        items: extraCustomItems
      });
    }

    const newPlan: JamanwarPlan = {
      id: `JAM-${Date.now()}`,
      hostName: hostName.trim(),
      memberId: selectedMemberId,
      occasion: occasion.trim(),
      date,
      time: time.trim(),
      mealType,
      amount: numericAmount,
      approxGuests: Number(approxGuests) || 250,
      locationHall: locationHall.trim(),
      menu: structuredMenu,
      rasoiyaTeam: 'શ્રી સ્વામિનારાયણ મહિલા મંડળ સેવા ટીમ',
      inchargeSister: currentMember.firstName + ' ' + currentMember.surname,
      notes: 'શુદ્ધ સાત્વિક સ્વામિનારાયણ પ્રસાદ',
      status: 'કન્ફર્મ'
    };

    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore
    }

    onAddJamanwar(newPlan);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto font-gujarati">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-amber-200 my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3.5 mb-4">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-base sm:text-lg">
            <Utensils className="w-5 h-5 text-amber-700" />
            <span>નવો જમણવાર નોંધવો</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* 1. Yajman: Registered Member Lookup or Manual Entry */}
          <div ref={memberDropdownRef} className="relative">
            <label className="block text-stone-800 font-bold mb-1">
              યજમાન નું નામ *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="સભ્યનું નામ, સભ્ય નંબર શોધો અથવા નવું મેન્યુઅલ નામ લખો"
                value={hostName}
                onFocus={() => setShowMemberSuggestions(true)}
                onChange={(e) => {
                  setHostName(e.target.value);
                  setSelectedMemberId('');
                  setShowMemberSuggestions(true);
                }}
                className="w-full px-3 py-2.5 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 pr-9"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
            </div>

            {/* Suggestions list */}
            {showMemberSuggestions && matchingMembers.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border border-stone-200 max-h-48 overflow-y-auto z-50 p-1 divide-y divide-stone-100">
                <div className="px-3 py-1.5 text-[11px] font-bold text-amber-900 bg-amber-50/70 rounded-lg flex items-center justify-between">
                  <span>રજિસ્ટર્ડ સભ્યોમાંથી પસંદ કરો:</span>
                  <span className="text-stone-500 font-normal">અથવા ઉપર મેન્યુઅલ નામ લખો</span>
                </div>
                {matchingMembers.map((m) => {
                  const mFullName = `${m.firstName} ${m.husbandName ? m.husbandName.split(' ')[0] + ' ' : ''}${m.surname}`.trim();
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelectMember(m)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-stone-50 text-stone-800 transition-colors flex items-center justify-between text-xs cursor-pointer"
                    >
                      <div>
                        <div className="font-semibold">{mFullName}</div>
                        <div className="text-[10px] text-stone-500">{m.city}</div>
                      </div>
                      <span className="font-chirp text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {m.memberNumber}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Title: jamnvar રકમ (₹) with English India input formatting */}
          <div>
            <label className="block text-stone-800 font-bold mb-1">
              jamnvar રકમ (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-amber-900 font-bold text-base">₹</span>
              <input
                type="text"
                required
                inputMode="numeric"
                placeholder="25,000"
                value={amountInput}
                onChange={handleAmountChange}
                className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-xl font-chirp text-lg font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/20"
              />
            </div>

            {/* Quick preset buttons */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[11000, 25000, 51000, 101000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handlePresetAmount(amt)}
                  className={`px-3 py-1 rounded-lg font-chirp font-bold text-xs border transition-all cursor-pointer ${
                    amountInput === amt.toLocaleString('en-IN')
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-stone-50 hover:bg-amber-50 text-stone-700 border-stone-200'
                  }`}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Occasion & Date / Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-800 font-bold mb-1">
                પ્રસંગ / ઉત્સવ *
              </label>
              <input
                type="text"
                required
                placeholder="દા.ત. એકાદશી મહાપ્રસાદ, જન્મોત્સવ, પુણ્યતિથિ સ્મૃતિ"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-stone-800 font-bold mb-1">
                તારીખ *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-chirp focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-stone-800 font-bold mb-1">
                સમય
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="દા.ત. બપોરે ૧૧:૩૦ કલાકે"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-stone-800 font-bold mb-1">
                ભોજન પ્રકાર
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as JamanwarPlan['mealType'])}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="બપોરનું ભોજન (લંચ)">બપોરનું ભોજન (લંચ)</option>
                <option value="સાંજનું ભોજન (ડિનર)">સાંજનું ભોજન (ડિનર)</option>
                <option value="સાંજના અલ્પાહાર / નાસ્તો">સાંજના અલ્પાહાર / નાસ્તો</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-800 font-bold mb-1">
                અંદાજિત હરિભક્તો સંખ્યા
              </label>
              <input
                type="number"
                min="10"
                value={approxGuests}
                onChange={(e) => setApproxGuests(Number(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-chirp focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* 3. Jamanwar Menu with Temple Items and Manual Addition */}
          <div className="border border-stone-200 rounded-2xl p-3.5 bg-stone-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-stone-900 font-bold text-xs">
                  જમણવારમાં શું શું menu રહશે *
                </label>
                <span className="text-[11px] text-stone-500">
                  પસંદ કરેલી વાનગીઓ: {selectedItems.length}
                </span>
              </div>

              {/* Search filter for menu items */}
              <input
                type="text"
                placeholder="વાનગી શોધો..."
                value={itemSearch}
                onChange={(e) => setItemSearch(e.target.value)}
                className="px-2.5 py-1 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 w-36 sm:w-44"
              />
            </div>

            {/* Currently Selected Badges */}
            {selectedItems.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-xl border border-amber-200">
                {selectedItems.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-950 font-bold text-xs rounded-lg border border-amber-300"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => toggleItem(item)}
                      className="hover:text-red-700 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Manual custom item entry */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="+ અન્ય કોઈ નવી વાનગી મેન્યુઅલ ઉમેરો (દા.ત. ખાસ ડ્રાયફ્રૂટ શીરો)"
                value={customItem}
                onChange={(e) => setCustomItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomItem();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={handleAddCustomItem}
                className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors inline-flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ઉમેરો</span>
              </button>
            </div>

            {/* Swaminarayan Temple Items (Organized by Category) */}
            <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
              {TEMPLE_MENU_ITEMS.map((group) => {
                const groupItems = group.items.filter(item =>
                  !itemSearch.trim() || item.toLowerCase().includes(itemSearch.trim().toLowerCase())
                );

                if (groupItems.length === 0) return null;

                return (
                  <div key={group.category} className="bg-white p-2 rounded-xl border border-stone-200">
                    <div className="text-[11px] font-bold text-amber-900 mb-1.5">
                      {group.category}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {groupItems.map((item) => {
                        const isChecked = selectedItems.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleItem(item)}
                            className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                              isChecked
                                ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300'
                                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                            }`}
                          >
                            <span className="truncate">{item}</span>
                            {isChecked && <Check className="w-3.5 h-3.5 text-amber-800 shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Location / Hall */}
          <div>
            <label className="block text-stone-800 font-bold mb-1">
              સ્થળ / ભોજનાલય ખંડ
            </label>
            <input
              type="text"
              value={locationHall}
              onChange={(e) => setLocationHall(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-stone-100 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold cursor-pointer transition-colors"
            >
              રદ કરો
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold transition-all shadow-md cursor-pointer inline-flex items-center gap-1.5"
            >
              <Utensils className="w-4 h-4" />
              <span>જમણવાર નોંધ પુષ્ટિ કરો</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
