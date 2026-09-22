import { useState, useRef, useEffect } from 'react';
import { DonationRecord, MahilaMember, FundCategory, PaymentMode } from '../types';
import { HeartHandshake, X, Receipt, Search } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  currentMember: MahilaMember;
  members?: MahilaMember[];
  onClose: () => void;
  onAddDonation: (newDonation: DonationRecord) => void;
}

export default function NewDonationModal({ currentMember, members = [], onClose, onAddDonation }: Props) {
  // Amount string formatted with Indian comma formatting e.g. "11,000"
  const [amountInput, setAmountInput] = useState<string>('11,000');
  
  // Default to current member's name
  const initialDonorName = `${currentMember.firstName} ${currentMember.husbandName ? currentMember.husbandName.split(' ')[0] + ' ' : ''}${currentMember.surname}`.trim();
  const [donorName, setDonorName] = useState(initialDonorName);
  const [selectedMemberId, setSelectedMemberId] = useState<string>(currentMember.id);
  
  // Autocomplete dropdown for members
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 10 categories
  const categories: FundCategory[] = [
    'જમણવાર સેવા',
    'મહાપ્રસાદ સેવા',
    'મંદિર સેવા & નિર્માણ',
    'ઉત્સવ & સમૈયા ભંડોળ',
    'સભ્ય સેવા',
    'વિદ્યાલય & સંસ્કાર ધામ સેવા',
    'સ્વામી સેવા',
    'ભક્તાણી સેવા',
    'પરમપૂજ્ય શ્રી સ્વામી સેવા',
    'અન્ય'
  ];

  const [category, setCategory] = useState<FundCategory>('જમણવાર સેવા');
  
  // Payment mode: રોકડ or ચેક
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('રોકડ');
  
  // Auto-generate initial receipt / voucher number
  const generateAutoRef = (mode: PaymentMode) => {
    const randomNo = Math.floor(1000 + Math.random() * 9000);
    return mode === 'રોકડ' ? `CASH-REC-${randomNo}` : `CHQ-${randomNo}`;
  };

  const [transactionRef, setTransactionRef] = useState(() => generateAutoRef('રોકડ'));
  const [purposeNote, setPurposeNote] = useState('');

  // Whenever payment mode changes, auto-update receipt / check ref if default
  const handlePaymentModeChange = (newMode: PaymentMode) => {
    setPaymentMode(newMode);
    setTransactionRef(generateAutoRef(newMode));
  };

  // English India number formatter helper
  const formatIndianNumber = (valStr: string) => {
    // Keep only digits
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

  const handlePresetClick = (num: number) => {
    setAmountInput(num.toLocaleString('en-IN'));
  };

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter registered members
  const searchClean = donorName.trim().toLowerCase();
  const matchingMembers = members.filter(m => {
    if (!searchClean) return true;
    const fullName = `${m.firstName} ${m.husbandName || ''} ${m.fatherName || ''} ${m.surname}`.toLowerCase();
    const memNo = (m.memberNumber || '').toLowerCase();
    return fullName.includes(searchClean) || memNo.includes(searchClean);
  });

  const handleSelectMember = (m: MahilaMember) => {
    const formattedName = `${m.firstName} ${m.husbandName ? m.husbandName.split(' ')[0] + ' ' : ''}${m.surname}`.trim();
    setDonorName(formattedName);
    setSelectedMemberId(m.id);
    setShowSuggestions(false);
  };

  const handleNameInputChange = (value: string) => {
    setDonorName(value);
    setSelectedMemberId('');
    setShowSuggestions(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseInt(amountInput.replace(/\D/g, ''), 10);
    if (!numericAmount || numericAmount <= 0 || !donorName.trim()) {
      alert('કૃપા કરીને માન્ય રકમ અને દાતા નામ / પરિવાર નું નામ દાખલ કરો.');
      return;
    }

    const receiptNo = `SMMS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('gu-IN', { hour: '2-digit', minute: '2-digit' });

    const newRecord: DonationRecord = {
      id: `DON-${Date.now()}`,
      receiptNo,
      memberId: selectedMemberId || 'MANUAL-DONOR',
      donorName: donorName.trim(),
      amount: numericAmount,
      category,
      paymentMode,
      date: dateStr,
      time: timeStr,
      transactionRef: transactionRef.trim() || generateAutoRef(paymentMode),
      purposeNote: purposeNote.trim() || 'શ્રીહરિ ચરણોમાં સેવા અર્પણ',
      isVerified: true
    };

    try {
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore
    }

    onAddDonation(newRecord);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto font-gujarati">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header - Clean, No extra fluff */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3.5 mb-4">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
            <HeartHandshake className="w-5 h-5 text-amber-700" />
            <span>દાન અર્પણ કરો</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {/* Amount in English India */}
          <div>
            <label className="block text-stone-800 font-bold mb-1">
              રકમ (Amount in ₹) *
            </label>
            
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-amber-900 font-bold text-base">₹</span>
              <input
                type="text"
                required
                inputMode="numeric"
                placeholder="11,000"
                value={amountInput}
                onChange={handleAmountChange}
                className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-xl font-chirp text-lg font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/20"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[2100, 5100, 11000, 21000, 51000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handlePresetClick(amt)}
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

          {/* Donor Name */}
          <div ref={dropdownRef} className="relative">
            <label className="block text-stone-800 font-bold mb-1">
              દાતા nam / પરિવાર નું નામ *
            </label>

            <div className="relative">
              <input
                type="text"
                required
                placeholder="સભ્યનું નામ, સભ્ય નંબર શોધો અથવા મેન્યુઅલ નામ લખો"
                value={donorName}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => handleNameInputChange(e.target.value)}
                className="w-full px-3 py-2.5 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 pr-9"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
            </div>

            {/* Dropdown Suggestions */}
            {showSuggestions && matchingMembers.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border border-stone-200 max-h-48 overflow-y-auto z-50 p-1 divide-y divide-stone-100">
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

          {/* Category Selector */}
          <div>
            <label className="block text-stone-800 font-bold mb-1">
              દાનનો હેતુ / કેટેગરી *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as FundCategory)}
              className="w-full px-3 py-2.5 border border-stone-300 rounded-xl text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Mode & Auto-filled Receipt No */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-800 font-bold mb-1">
                ચૂકવણી પદ્ધતિ *
              </label>
              <select
                value={paymentMode}
                onChange={(e) => handlePaymentModeChange(e.target.value as PaymentMode)}
                className="w-full px-3 py-2.5 border border-stone-300 rounded-xl text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="રોકડ">રોકડ (Cash)</option>
                <option value="ચેક">ચેક (Cheque)</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-800 font-bold mb-1">
                {paymentMode === 'ચેક' ? 'ચેક નંબર (ઓટો-ફિલ)' : 'પહોંચ નંબર (ઓટો-ફિલ)'}
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="w-full px-3 py-2.5 border border-stone-300 rounded-xl text-sm font-chirp font-bold text-amber-900 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Purpose / Sankalp */}
          <div>
            <label className="block text-stone-800 font-bold mb-1">
              સંકલ્પ / વિશેષ નોંધ (વૈકલ્પિક)
            </label>
            <input
              type="text"
              placeholder="દા.ત. સેવા ન્યોછાવર, પુણ્યતિથિ સ્મૃતિ, પારિવારિક સુખ શાંતિ અર્થે"
              value={purposeNote}
              onChange={(e) => setPurposeNote(e.target.value)}
              className="w-full px-3 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
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
              <Receipt className="w-4 h-4" />
              <span>દાન અર્પણ કરો</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
