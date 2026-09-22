import { useState, useMemo } from 'react';
import { MahilaMember, FamilyMember, RelationType } from '../types';
import { UserPlus, X, Check, Users, Search, Hash, Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  members: MahilaMember[];
  onClose: () => void;
  onAddMember: (newMember: MahilaMember) => void;
}

export default function NewMemberModal({ members = [], onClose, onAddMember }: Props) {
  // Generate next 6-digit member number automatically
  const initialNewMemberNumber = useMemo(() => {
    const numericList = members
      .map(m => parseInt(m.memberNumber || '', 10))
      .filter(n => !isNaN(n) && n >= 100000 && n <= 999999);
    if (numericList.length > 0) {
      return (Math.max(...numericList) + 1).toString();
    }
    return '104825';
  }, [members]);

  // 6-digit Member Number for this new member
  const [memberNumber, setMemberNumber] = useState(initialNewMemberNumber);

  // Parent / Family 6-digit lookup
  const [parentSearchNumber, setParentSearchNumber] = useState('');
  const [matchedParent, setMatchedParent] = useState<MahilaMember | null>(null);
  const [lookupMessage, setLookupMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Member form fields - default to empty as per instruction:
  // "અને જે ડિટેઇલ્સ નથી ઉમેરતી તે ખાણું ખાલી રહેસે"
  const [surname, setSurname] = useState('');
  const [firstName, setFirstName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [husbandName, setHusbandName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [occupation, setOccupation] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [incomeType, setIncomeType] = useState<'પરિવારની' | 'પોતાની' | 'સંયુક્ત'>('પોતાની');
  const [mandalRole, setMandalRole] = useState('સત્સંગી સભ્ય');

  // Initial Family Member option
  const [addInitialFamily, setAddInitialFamily] = useState(false);
  const [famName, setFamName] = useState('');
  const [famRelation, setFamRelation] = useState<RelationType>('પતિ');
  const [famAge, setFamAge] = useState<number | ''>('');

  const avatarColors = [
    'bg-amber-600', 'bg-orange-600', 'bg-rose-600', 
    'bg-emerald-700', 'bg-teal-600', 'bg-purple-600'
  ];

  // Lookup function for parent/family 6-digit member number
  const handleLookupParent = (codeToSearch?: string) => {
    const query = (codeToSearch ?? parentSearchNumber).trim();
    if (!query) {
      setLookupMessage({ type: 'error', text: 'કૃપા કરીને ૬ આંકડાનો સભ્ય નંબર લખો.' });
      return;
    }

    const found = members.find(m => m.memberNumber === query || m.id === query);
    if (found) {
      setMatchedParent(found);
      // Auto-fill family details:
      // address, father name, mother name, mobile number, email, surname, city, district, pincode
      if (found.surname) setSurname(found.surname);
      // Father name: If found member has husband, he is the father of daughter/son
      const derivedFather = found.husbandName ? found.husbandName : found.fatherName;
      if (derivedFather) setFatherName(derivedFather);
      // Mother name:
      setMotherName(`${found.firstName} ${found.surname}`);
      if (found.address) setAddress(found.address);
      if (found.city) setCity(found.city);
      if (found.district) setDistrict(found.district);
      if (found.pincode) setPincode(found.pincode);
      if (found.phone) setPhone(found.phone);
      if (found.email) setEmail(found.email);

      setLookupMessage({
        type: 'success',
        text: `✓ માતા/પરિવાર સભ્ય: ${found.firstName} ${found.surname} (નં: ${found.memberNumber}) ની સરનામું, માતા-પિતા અને સંપર્ક વિગતો આપોઆપ આવી ગઈ છે.`
      });
    } else {
      setMatchedParent(null);
      setLookupMessage({
        type: 'error',
        text: `સભ્ય નંબર "${query}" ધરાવતો કોઈ સભ્ય મળ્યો નથી. કૃપા કરીને સાચો ૬ આંકડાનો નંબર દાખલ કરો.`
      });
    }
  };

  const handleParentNumberChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 6);
    setParentSearchNumber(cleaned);
    if (cleaned.length === 6) {
      handleLookupParent(cleaned);
    } else {
      setLookupMessage(null);
    }
  };

  const handleClearParentLink = () => {
    setMatchedParent(null);
    setParentSearchNumber('');
    setLookupMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      alert('કૃપા કરીને પોતાનું નામ દાખલ કરો.');
      return;
    }

    const familyMembers: FamilyMember[] = [];
    if (addInitialFamily && famName.trim()) {
      familyMembers.push({
        id: `FAM-${Date.now()}`,
        name: famName.trim(),
        relation: famRelation,
        age: Number(famAge) || 0,
        occupation: '',
        phone: '',
        notes: ''
      });
    }

    const newMember: MahilaMember = {
      id: `MEMBER-${Date.now().toString().slice(-4)}`,
      memberNumber: memberNumber.trim() || initialNewMemberNumber,
      surname: surname.trim(),
      firstName: firstName.trim(),
      fatherName: fatherName.trim(),
      husbandName: husbandName.trim(),
      motherName: motherName.trim(),
      age: Number(age) || 0,
      dob: dob || undefined,
      address: address.trim(),
      city: city.trim(),
      district: district.trim(),
      pincode: pincode.trim(),
      phone: phone.trim(),
      email: email.trim(),
      occupation: occupation.trim(),
      annualIncome: annualIncome.trim(),
      incomeType,
      mandalRole: mandalRole.trim() || 'સત્સંગી સભ્ય',
      joinDate: new Date().toISOString().split('T')[0],
      avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
      familyMembers,
      parentMemberNumber: matchedParent ? matchedParent.memberNumber : (parentSearchNumber.trim() || undefined)
    };

    onAddMember(newMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto font-gujarati">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-amber-200 my-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900 font-serif-gujarati">
                નવી મહિલા સભ્ય નોંધણી
              </h3>
              <p className="text-xs text-stone-500">
                શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* TOP SECTION: 6-DIGIT NEW MEMBER NUMBER & PARENT AUTO-FILL LOOKUP */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border-2 border-amber-300 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <label className="block text-amber-950 font-bold mb-1 flex items-center gap-1.5">
                  <Hash className="w-4 h-4 text-amber-700" />
                  <span>નવો ૬ આંકડાનો સભ્ય નંબર</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={memberNumber}
                  onChange={(e) => setMemberNumber(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-36 px-3 py-2 border-2 border-amber-400 rounded-xl text-base font-chirp font-bold text-amber-950 bg-white"
                />
              </div>

              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-stone-800 font-bold mb-1 flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-amber-700" />
                  <span>માતા / પરિવારનો ૬ આંકડાનો સભ્ય નંબર (ઓટો-ફિલ)</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="દા.ત. 104821"
                    value={parentSearchNumber}
                    onChange={(e) => handleParentNumberChange(e.target.value)}
                    className="w-full sm:w-44 px-3 py-2 border border-stone-300 rounded-xl text-sm font-chirp font-bold bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleLookupParent()}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shrink-0"
                  >
                    વિગતો લાવો
                  </button>
                </div>
              </div>
            </div>

            {lookupMessage && (
              <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                lookupMessage.type === 'success' 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                  : 'bg-red-50 border-red-300 text-red-800'
              }`}>
                <div className="flex items-center gap-1.5">
                  {lookupMessage.type === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span>{lookupMessage.text}</span>
                </div>
                {matchedParent && (
                  <button
                    type="button"
                    onClick={handleClearParentLink}
                    className="text-xs text-stone-500 hover:text-red-700 font-bold underline ml-2 shrink-0 cursor-pointer"
                  >
                    દૂર કરો
                  </button>
                )}
              </div>
            )}

            {matchedParent && (
              <div className="p-2 bg-amber-100/60 rounded-xl text-[11px] text-amber-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>માતા/પરિવારની વિગતો આવી ગઈ છે. હવે માત્ર પોતાનું નામ, વ્યવસાય અને આવક ભરો.</span>
              </div>
            )}
          </div>

          {/* SECTION 1: PERSONAL NAMES */}
          <div className="bg-stone-50/70 p-4 rounded-2xl border border-stone-200/80 space-y-3">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wide">
              ૧. વ્યક્તિગત નામો
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-bold mb-1">અટક</label>
                <input
                  type="text"
                  placeholder="દા.ત. કાનાણી / પટેલ"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-1">પોતાનું નામ *</label>
                <input
                  type="text"
                  required
                  placeholder="દા.ત. હેપ્પીબેન"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-700 font-bold mb-1">પિતાનું નામ</label>
                <input
                  type="text"
                  placeholder="દા.ત. મનસુખભાઈ"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-1">પતિનું નામ (જો પરણેલા હોય)</label>
                <input
                  type="text"
                  placeholder="દા.ત. ભાવિનકુમાર"
                  value={husbandName}
                  onChange={(e) => setHusbandName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-1">માતાનું નામ</label>
                <input
                  type="text"
                  placeholder="દા.ત. જયાબેન"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-bold mb-1">ઉંમર (વર્ષ)</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  placeholder="દા.ત. ૩૨"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-chirp"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-1">જન્મ તારીખ</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-chirp"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: RESIDENCE & CONTACT */}
          <div className="bg-stone-50/70 p-4 rounded-2xl border border-stone-200/80 space-y-3">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wide">
              ૨. રહેઠાણ & સંપર્ક વિગતો
            </h4>
            <div>
              <label className="block text-stone-700 font-bold mb-1">રહેઠાણ / સરનામું</label>
              <textarea
                rows={2}
                placeholder="ફ્લેટ/મકાન નંબર, સોસાયટીનું નામ, રોડ, વિસ્તાર..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-700 font-bold mb-1">શહેર / ગામ</label>
                <input
                  type="text"
                  placeholder="દા.ત. સુરત"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-1">જિલ્લો</label>
                <input
                  type="text"
                  placeholder="દા.ત. સુરત"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-1">પિનકોડ</label>
                <input
                  type="text"
                  placeholder="દા.ત. ૩૯૫૦૦૬"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-chirp"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-bold mb-1">મોબાઈલ નંબર</label>
                <input
                  type="text"
                  placeholder="દા.ત. +91 98250 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-chirp"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-1">સંપર્ક ઈમેઈલ</label>
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-chirp"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: OCCUPATION & INCOME */}
          <div className="bg-stone-50/70 p-4 rounded-2xl border border-stone-200/80 space-y-3">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wide">
              ૩. વ્યવસાય & વાર્ષિક આવક
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-700 font-bold mb-1">હાલમાં શું વ્યવસાય કરે છે</label>
                <input
                  type="text"
                  placeholder="દા.ત. ગૃહિણી / શિક્ષિકા / બિઝનેસ"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-1">વાર્ષિક આવક</label>
                <input
                  type="text"
                  placeholder="દા.ત. ₹૮,૫૦,૦૦૦"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-chirp"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-1">આવક પ્રકાર</label>
                <select
                  value={incomeType}
                  onChange={(e) => setIncomeType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm bg-white"
                >
                  <option value="પોતાની">પોતાની</option>
                  <option value="પરિવારની">પરિવારની</option>
                  <option value="સંયુક્ત">સંયુક્ત</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 4: INITIAL FAMILY MEMBER */}
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addInitialFamily}
                  onChange={(e) => setAddInitialFamily(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600"
                />
                <span className="font-bold text-stone-900 text-xs">
                  સાથે ઘરના એક સભ્ય પણ જોડવા છે?
                </span>
              </label>
            </div>

            {addInitialFamily && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">સભ્યનું નામ</label>
                  <input
                    type="text"
                    placeholder="દા.ત. ભાવિનકુમાર"
                    value={famName}
                    onChange={(e) => setFamName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">સંબંધ</label>
                  <select
                    value={famRelation}
                    onChange={(e) => setFamRelation(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm bg-white"
                  >
                    <option value="પતિ">પતિ</option>
                    <option value="પુત્ર">પુત્ર</option>
                    <option value="પુત્રી">પુત્રી</option>
                    <option value="સાસુ">સાસુ</option>
                    <option value="સસરા">સસરા</option>
                    <option value="માતા">માતા</option>
                    <option value="પિતા">પિતા</option>
                    <option value="ભાઈ">ભાઈ</option>
                    <option value="બહેન">બહેન</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">ઉંમર (વર્ષ)</label>
                  <input
                    type="number"
                    placeholder="દા.ત. ૩૫"
                    value={famAge}
                    onChange={(e) => setFamAge(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-chirp"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-stone-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold cursor-pointer transition-colors"
            >
              રદ કરો
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>સભ્ય નોંધણી પૂર્ણ કરો</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
