import React, { useState, useMemo } from 'react';
import { MahilaMember } from '../types';
import { 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Hash,
  MapPin,
  Shield,
  User,
  Phone
} from 'lucide-react';

interface Props {
  member?: MahilaMember;
  members?: MahilaMember[];
  totalContributed?: number;
  onUpdateMember?: (updated: MahilaMember) => void;
  onAddMember?: (newMember: MahilaMember) => void;
  onOpenNewMemberModal?: () => void;
  onOpenDonateModal?: () => void;
}

const SEVENTY_TWO_HOURS_MS = 72 * 60 * 60 * 1000; // 72 hours in milliseconds

// Initial sample members joined within the last 72 hours to ensure immediate display
const getInitialRecentMembers = (): MahilaMember[] => {
  const now = Date.now();
  return [
    {
      id: 'MEMBER-REC-1',
      memberNumber: '104825',
      surname: 'કાનાણી',
      firstName: 'હેપ્પીબેન',
      fatherName: 'મનસુખભાઈ કાનાણી',
      husbandName: 'ભાવિનકુમાર કાનાણી',
      motherName: 'જયાબેન કાનાણી',
      age: 32,
      address: 'નાના વરાછા, સુરત',
      city: 'સુરત',
      district: 'સુરત',
      pincode: '395006',
      phone: '98250 12345',
      email: 'happykanani8@gmail.com',
      occupation: 'ઉદ્યોગસાહસિક',
      annualIncome: '',
      incomeType: 'પોતાની',
      mandalRole: 'સેવક',
      joinDate: new Date(now - 5 * 60 * 60 * 1000).toISOString().split('T')[0],
      joinedTimestamp: now - 5 * 60 * 60 * 1000, // 5 hours ago
      familyMembers: [],
      avatarColor: 'bg-amber-600',
    },
    {
      id: 'MEMBER-REC-2',
      memberNumber: '104826',
      surname: 'પટેલ',
      firstName: 'કિન્નરીબા',
      fatherName: 'કાંતિલાલ પટેલ',
      husbandName: 'હરેશભાઈ પટેલ',
      motherName: 'પુષ્પાબેન',
      age: 38,
      address: 'મગદલ્લાહ, સુરત',
      city: 'સુરત',
      district: 'સુરત',
      pincode: '395007',
      phone: '94260 78910',
      email: '',
      occupation: 'શિક્ષિકા',
      annualIncome: '',
      incomeType: 'પોતાની',
      mandalRole: 'ભક્તાણી સેવક',
      joinDate: new Date(now - 22 * 60 * 60 * 1000).toISOString().split('T')[0],
      joinedTimestamp: now - 22 * 60 * 60 * 1000, // 22 hours ago
      familyMembers: [],
      avatarColor: 'bg-emerald-600',
    },
    {
      id: 'MEMBER-REC-3',
      memberNumber: '104827',
      surname: 'સાંગાણી',
      firstName: 'રેખાબેન',
      fatherName: 'ગોરધનભાઈ સાંગાણી',
      husbandName: 'રાજેશભાઈ સાંગાણી',
      motherName: 'ગોદાવરીબેન',
      age: 44,
      address: 'કાલાવડ રોડ, રાજકોટ',
      city: 'રાજકોટ',
      district: 'રાજકોટ',
      pincode: '360005',
      phone: '99790 33445',
      email: '',
      occupation: 'ગૃહિણી',
      annualIncome: '',
      incomeType: 'પોતાની',
      mandalRole: 'સેવક',
      joinDate: new Date(now - 46 * 60 * 60 * 1000).toISOString().split('T')[0],
      joinedTimestamp: now - 46 * 60 * 60 * 1000, // 46 hours ago
      familyMembers: [],
      avatarColor: 'bg-rose-600',
    },
  ];
};

export default function MemberProfileView({
  members = [],
  onAddMember
}: Props) {
  // Local list to merge any initial 72hr members + newly added ones
  const [localNewMembers, setLocalNewMembers] = useState<MahilaMember[]>(() => {
    try {
      const saved = localStorage.getItem('bhaktani_72hr_new_members');
      if (saved) {
        const parsed: MahilaMember[] = JSON.parse(saved);
        const filtered = parsed.filter(m => {
          const ts = m.joinedTimestamp || 0;
          return Date.now() - ts <= SEVENTY_TWO_HOURS_MS;
        });
        if (filtered.length > 0) return filtered;
      }
    } catch (e) {
      console.error(e);
    }
    return getInitialRecentMembers();
  });

  // Form states for New Member Registration
  const [memberNumber, setMemberNumber] = useState('');
  const [surname, setSurname] = useState('');
  const [firstName, setFirstName] = useState('');
  const [city, setCity] = useState('');
  const [mandalRole, setMandalRole] = useState('સેવક');
  const [phone, setPhone] = useState('');
  const [fatherOrHusbandName, setFatherOrHusbandName] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-generate next suggested member number
  const suggestedNumber = useMemo(() => {
    const all = [...members, ...localNewMembers];
    const nums = all
      .map(m => parseInt(m.memberNumber.replace(/\D/g, ''), 10))
      .filter(n => !isNaN(n));
    const maxNum = nums.length > 0 ? Math.max(...nums) : 104824;
    return (maxNum + 1).toString();
  }, [members, localNewMembers]);

  // Handle Form Submission
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!surname.trim() || !firstName.trim() || !city.trim()) {
      alert('કૃપા કરીને અટક, નામ અને શહેર પૂર્ણ ભરો.');
      return;
    }

    const assignedNumber = memberNumber.trim() || suggestedNumber;
    const now = Date.now();

    const newMember: MahilaMember = {
      id: `MEMBER-${now}`,
      memberNumber: assignedNumber,
      surname: surname.trim(),
      firstName: firstName.trim(),
      fatherName: fatherOrHusbandName.trim() || '-',
      husbandName: fatherOrHusbandName.trim() || '-',
      motherName: '-',
      age: 30,
      address: `${city.trim()}`,
      city: city.trim(),
      district: city.trim(),
      pincode: '395006',
      phone: phone.trim() || '-',
      email: '',
      occupation: 'સેવિકા / ગૃહિણી',
      annualIncome: '',
      incomeType: 'પોતાની',
      mandalRole: mandalRole.trim() || 'સેવક',
      joinDate: new Date().toISOString().split('T')[0],
      joinedTimestamp: now,
      familyMembers: [],
      avatarColor: 'bg-amber-600',
    };

    // Update local state and persistence
    const updated = [newMember, ...localNewMembers];
    setLocalNewMembers(updated);
    try {
      localStorage.setItem('bhaktani_72hr_new_members', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    // Call parent handler if provided
    onAddMember?.(newMember);

    // Reset fields
    setMemberNumber('');
    setSurname('');
    setFirstName('');
    setCity('');
    setMandalRole('સેવક');
    setPhone('');
    setFatherOrHusbandName('');

    setSuccessMessage(`નવા સભ્યશ્રી ${newMember.surname} ${newMember.firstName} (ભક્તાણી નં: ${newMember.memberNumber}) ની નોંધણી સફળતાપૂર્વક થઈ ગઈ છે!`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  // Filter ONLY members who joined within the last 72 hours
  const recent72HourMembers = useMemo(() => {
    const combined = [...localNewMembers, ...members];
    // Deduplicate by id or memberNumber
    const seen = new Set<string>();
    const unique: MahilaMember[] = [];

    combined.forEach(m => {
      const key = m.id || m.memberNumber;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(m);
      }
    });

    const now = Date.now();
    return unique
      .filter(m => {
        const ts = m.joinedTimestamp || (m.joinDate ? new Date(m.joinDate).getTime() : 0);
        return now - ts <= SEVENTY_TWO_HOURS_MS && ts > 0;
      })
      .sort((a, b) => {
        const tsA = a.joinedTimestamp || (a.joinDate ? new Date(a.joinDate).getTime() : 0);
        const tsB = b.joinedTimestamp || (b.joinDate ? new Date(b.joinDate).getTime() : 0);
        return tsB - tsA;
      });
  }, [localNewMembers, members]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-gujarati animate-in fade-in duration-200">
      {/* 1. નવો સભ્ય નોંધણી સેક્શન (New Member Registration Form) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-md relative overflow-hidden space-y-6">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-amber-400/20 to-transparent rounded-bl-full pointer-events-none" />

        {/* Section Header */}
        <div className="border-b border-amber-200/80 pb-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold mb-1 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>શ્રી સ્વામિનારાયણ ભક્તાણી સંપ્રદાય</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-amber-950 font-serif-gujarati tracking-tight flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-amber-700" />
            <span>નવો સભ્ય નોંધણી</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            નવા જોડાતા સભ્યની વિગતો અહીં ભરો. નોંધણી થતાં જ નીચે ૭૨ કલાકની યાદીમાં તાત્કાલિક દેખાશે.
          </p>
        </div>

        {/* Success Toast */}
        {successMessage && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-semibold shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-5 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* ભક્તાણી નંબર */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-amber-700" />
                <span>ભક્તાણી નંબર (સભ્ય ક્રમાંક)</span>
              </label>
              <input
                type="text"
                value={memberNumber}
                onChange={(e) => setMemberNumber(e.target.value)}
                placeholder={`દા.ત. ${suggestedNumber}`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm font-medium transition-all font-chirp"
              />
              <span className="text-[10px] text-stone-500 block">
                ખાલી રાખશો તો આપોઆપ <strong>{suggestedNumber}</strong> લેવાશે
              </span>
            </div>

            {/* અટક */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-700" />
                <span>અટક (Surname) <span className="text-red-500">*</span></span>
              </label>
              <input
                type="text"
                required
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="દા.ત. પટેલ / કાનાણી"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm font-medium transition-all"
              />
            </div>

            {/* નામ */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-700" />
                <span>નામ (First Name) <span className="text-red-500">*</span></span>
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="દા.ત. હેપ્પીબેન"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm font-medium transition-all"
              />
            </div>

            {/* શહેર */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>શહેર / ગામ (City) <span className="text-red-500">*</span></span>
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="દા.ત. સુરત / મગદલ્લાહ / અમદાવાદ"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm font-medium transition-all"
              />
            </div>

            {/* સેવક કે શું છે તે (હોદ્દો / રોલ) */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                <span>સેવક કે શું છે તે (ભૂમિકા) <span className="text-red-500">*</span></span>
              </label>
              <select
                value={mandalRole}
                onChange={(e) => setMandalRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm font-bold bg-white transition-all text-amber-950"
              >
                <option value="સેવક">સેવક</option>
                <option value="ભક્તાણી સેવક">ભક્તાણી સેવક</option>
                <option value="સત્સંગ સેવિકા">સત્સંગ સેવિકા</option>
                <option value="સભા સંચાલિકા">સભા સંચાલિકા</option>
                <option value="હરિભક્ત">હરિભક્ત</option>
                <option value="કારોબારી સભ્ય">કારોબારી સભ્ય</option>
              </select>
            </div>

            {/* મોબાઈલ નંબર */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-700" />
                <span>મોબાઈલ નંબર</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="દા.ત. 98250 12345"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm font-medium transition-all font-chirp"
              />
            </div>
          </div>

          {/* પિતા / પતિ નું નામ (Optional) */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-800">
              પિતા અથવા પતિનું નામ (વૈકલ્પિક)
            </label>
            <input
              type="text"
              value={fatherOrHusbandName}
              onChange={(e) => setFatherOrHusbandName(e.target.value)}
              placeholder="દા.ત. ભાવિનકુમાર / મનસુખભાઈ"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm font-medium transition-all"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>નવા સભ્યની નોંધણી કરો</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. છેલ્લા ૭૨ કલાકમાં જોડાયેલ સભ્યોની યાદી (Recently Joined in 72 Hours) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-amber-300 shadow-md space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-amber-200 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-700" />
            <h3 className="text-base sm:text-lg font-extrabold text-amber-950 font-serif-gujarati">
              છેલ્લા ૭૨ કલાકમાં જોડાયેલ સભ્યોની યાદી (Recently)
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold font-chirp">
            કુલ: {recent72HourMembers.length}
          </span>
        </div>

        {/* Single-line Text List with Horizontal Lines */}
        {recent72HourMembers.length === 0 ? (
          <div className="py-8 text-center text-stone-500 text-xs sm:text-sm bg-amber-50/40 rounded-2xl border border-dashed border-amber-200">
            છેલ્લા ૭૨ કલાકમાં કોઈ નવા સભ્ય જોડાયેલ નથી.
          </div>
        ) : (
          <div className="divide-y divide-amber-200 border-t border-b border-amber-200">
            {recent72HourMembers.map((m) => (
              <div
                key={m.id || m.memberNumber}
                className="py-3 px-2 sm:px-3 flex items-center justify-between gap-2 text-xs sm:text-sm font-medium hover:bg-amber-50/60 transition-colors"
              >
                {/* Horizontal single line content: ભક્તાણી નંબર + atka nam સાથે + city + સેવક કે શું છે તે */}
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-stone-900">
                  <span className="font-bold text-amber-950 bg-amber-100/90 border border-amber-300/90 px-2 py-0.5 rounded-md font-chirp text-xs shrink-0">
                    ભક્તાણી નં: {m.memberNumber}
                  </span>
                  <span className="text-stone-300 font-bold hidden sm:inline">•</span>
                  <span className="font-extrabold text-stone-950 font-serif-gujarati truncate">
                    {m.surname} {m.firstName}
                  </span>
                  <span className="text-stone-300 font-bold hidden sm:inline">•</span>
                  <span className="text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md text-xs font-semibold shrink-0">
                    {m.city}
                  </span>
                  <span className="text-stone-300 font-bold hidden sm:inline">•</span>
                  <span className="font-bold text-emerald-900 bg-emerald-100/90 border border-emerald-300/90 px-2 py-0.5 rounded-md text-xs shrink-0">
                    {m.mandalRole || 'સેવક'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
