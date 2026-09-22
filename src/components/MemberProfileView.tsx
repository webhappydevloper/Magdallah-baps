import { useState } from 'react';
import { MahilaMember, FamilyMember, RelationType } from '../types';
import { 
  UserRound, 
  Users, 
  MapPin, 
  Briefcase, 
  Coins, 
  Phone, 
  Mail, 
  Plus, 
  Trash2, 
  Edit3, 
  Check,
  Hash
} from 'lucide-react';

interface Props {
  member: MahilaMember;
  totalContributed: number;
  onUpdateMember: (updated: MahilaMember) => void;
  onOpenNewMemberModal: () => void;
  onOpenDonateModal: () => void;
}

export default function MemberProfileView({
  member,
  totalContributed,
  onUpdateMember,
  onOpenNewMemberModal,
  onOpenDonateModal
}: Props) {
  // Local state for Add Family Member Modal
  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // Form states for adding family member
  const [famName, setFamName] = useState('');
  const [famRelation, setFamRelation] = useState<RelationType>('પતિ');
  const [famAge, setFamAge] = useState<number | ''>('');
  const [famOccupation, setFamOccupation] = useState('');
  const [famPhone, setFamPhone] = useState('');
  const [famNotes, setFamNotes] = useState('');

  // Edit profile form state
  const [editMemberNumber, setEditMemberNumber] = useState(member.memberNumber || '');
  const [editSurname, setEditSurname] = useState(member.surname || '');
  const [editFirstName, setEditFirstName] = useState(member.firstName || '');
  const [editFatherName, setEditFatherName] = useState(member.fatherName || '');
  const [editHusbandName, setEditHusbandName] = useState(member.husbandName || '');
  const [editMotherName, setEditMotherName] = useState(member.motherName || '');
  const [editAge, setEditAge] = useState<number | ''>(member.age || '');
  const [editAddress, setEditAddress] = useState(member.address || '');
  const [editCity, setEditCity] = useState(member.city || '');
  const [editDistrict, setEditDistrict] = useState(member.district || '');
  const [editPincode, setEditPincode] = useState(member.pincode || '');
  const [editPhone, setEditPhone] = useState(member.phone || '');
  const [editEmail, setEditEmail] = useState(member.email || '');
  const [editOccupation, setEditOccupation] = useState(member.occupation || '');
  const [editAnnualIncome, setEditAnnualIncome] = useState(member.annualIncome || '');
  const [editIncomeType, setEditIncomeType] = useState(member.incomeType || 'પોતાની');
  const [editMandalRole, setEditMandalRole] = useState(member.mandalRole || '');

  const relationsList: RelationType[] = [
    'પતિ', 'પુત્ર', 'પુત્રી', 'સાસુ', 'સસરા', 'માતા', 'પિતા', 
    'ભાઈ', 'બહેન', 'જેઠ', 'જેઠાણી', 'દિયર', 'દેરાણી', 'નણંદ', 
    'પુત્રવધૂ', 'પૌત્ર', 'પૌત્રી', 'અન્ય સંબંધ'
  ];

  const handleAddFamilyMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!famName.trim()) return;

    const newFamilyMember: FamilyMember = {
      id: `FAM-${Date.now()}`,
      name: famName.trim(),
      relation: famRelation,
      age: Number(famAge) || 0,
      occupation: famOccupation.trim(),
      phone: famPhone.trim(),
      notes: famNotes.trim()
    };

    const updated: MahilaMember = {
      ...member,
      familyMembers: [...member.familyMembers, newFamilyMember]
    };

    onUpdateMember(updated);
    setFamName('');
    setFamRelation('પતિ');
    setFamAge('');
    setFamOccupation('');
    setFamPhone('');
    setFamNotes('');
    setShowAddFamilyModal(false);
  };

  const handleRemoveFamilyMember = (familyId: string) => {
    const updated: MahilaMember = {
      ...member,
      familyMembers: member.familyMembers.filter(f => f.id !== familyId)
    };
    onUpdateMember(updated);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: MahilaMember = {
      ...member,
      memberNumber: editMemberNumber.trim() || member.memberNumber,
      surname: editSurname.trim(),
      firstName: editFirstName.trim(),
      fatherName: editFatherName.trim(),
      husbandName: editHusbandName.trim(),
      motherName: editMotherName.trim(),
      age: Number(editAge) || 0,
      address: editAddress.trim(),
      city: editCity.trim(),
      district: editDistrict.trim(),
      pincode: editPincode.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
      occupation: editOccupation.trim(),
      annualIncome: editAnnualIncome.trim(),
      incomeType: editIncomeType,
      mandalRole: editMandalRole.trim()
    };
    onUpdateMember(updated);
    setShowEditProfileModal(false);
  };

  return (
    <div className="space-y-6 font-gujarati animate-in fade-in duration-200">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl ${member.avatarColor} text-white flex items-center justify-center text-3xl font-extrabold shadow-lg border-4 border-amber-100 shrink-0`}>
              {member.firstName ? member.firstName.charAt(0) : 'સ'}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-3 py-1 bg-amber-100 text-amber-950 rounded-xl text-xs font-bold border border-amber-300 font-chirp tracking-wide flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-amber-700" />
                  <span>સભ્ય નં: {member.memberNumber || member.id}</span>
                </span>
                {member.mandalRole && (
                  <span className="px-3 py-1 bg-stone-100 text-stone-800 rounded-xl text-xs font-bold border border-stone-200">
                    {member.mandalRole}
                  </span>
                )}
                {member.parentMemberNumber && (
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200 font-chirp">
                    પરિવાર સભ્ય નં: {member.parentMemberNumber}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-serif-gujarati">
                  {member.firstName} {member.husbandName ? member.husbandName.split(' ')[0] : ''} {member.surname}
                </h2>
                {/* Blue Tick Verified Icon */}
                <span 
                  title="વેરિફાઇડ સભ્ય" 
                  className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-600 text-white shadow-xs shrink-0"
                >
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                </span>
              </div>

              <p className="text-sm text-stone-600 mt-1 flex flex-wrap items-center gap-3">
                {(member.city || member.district) && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-amber-700" />
                    {member.city}{member.district ? `, ${member.district}` : ''}
                  </span>
                )}
                {member.phone && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4 text-amber-700" />
                      <span className="font-chirp">{member.phone}</span>
                    </span>
                  </>
                )}
                {member.email && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-chirp text-xs">
                      <Mail className="w-4 h-4 text-amber-700" />
                      {member.email}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => {
                setEditMemberNumber(member.memberNumber || '');
                setEditSurname(member.surname || '');
                setEditFirstName(member.firstName || '');
                setEditFatherName(member.fatherName || '');
                setEditHusbandName(member.husbandName || '');
                setEditMotherName(member.motherName || '');
                setEditAge(member.age || '');
                setEditAddress(member.address || '');
                setEditCity(member.city || '');
                setEditDistrict(member.district || '');
                setEditPincode(member.pincode || '');
                setEditPhone(member.phone || '');
                setEditEmail(member.email || '');
                setEditOccupation(member.occupation || '');
                setEditAnnualIncome(member.annualIncome || '');
                setEditIncomeType(member.incomeType || 'પોતાની');
                setEditMandalRole(member.mandalRole || '');
                setShowEditProfileModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>પ્રોફાઇલમાં ફેરફાર કરો</span>
            </button>
            <button
              onClick={onOpenNewMemberModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>નવી સભ્ય નોંધણી</span>
            </button>
          </div>
        </div>

        {/* User Total Contribution Metric Pill */}
        <div className="mt-6 pt-5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              કુલ સમર્પિત સેવા ભંડોળ
            </span>
            <div className="text-2xl font-black text-amber-950 font-chirp tracking-tight mt-0.5">
              ₹{totalContributed.toLocaleString('en-IN')}
            </div>
          </div>
          <button
            onClick={onOpenDonateModal}
            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            + નવું દાન અર્પણ કરો
          </button>
        </div>
      </div>

      {/* Grid: Full Personal Profile Details & Linked Family Members */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Bio Details (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-amber-200 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <UserRound className="w-5 h-5 text-amber-700" />
              <span>સભ્ય વિગતો</span>
            </h3>
            <span className="text-xs text-amber-900 font-chirp font-bold bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">
              સભ્ય નં: {member.memberNumber || member.id}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 min-h-[64px]">
              <span className="text-xs text-stone-500 block mb-0.5">૬ આંકડાનો સભ્ય નંબર</span>
              <strong className="text-base text-amber-950 font-chirp">{member.memberNumber || ''}</strong>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 min-h-[64px]">
              <span className="text-xs text-stone-500 block mb-0.5">અટક</span>
              <strong className="text-base text-stone-900">{member.surname || ''}</strong>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 min-h-[64px]">
              <span className="text-xs text-stone-500 block mb-0.5">પોતાનું નામ</span>
              <strong className="text-base text-stone-900">{member.firstName || ''}</strong>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 min-h-[64px]">
              <span className="text-xs text-stone-500 block mb-0.5">પિતાનું નામ</span>
              <strong className="text-stone-800">{member.fatherName || ''}</strong>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 min-h-[64px]">
              <span className="text-xs text-stone-500 block mb-0.5">પતિનું નામ</span>
              <strong className="text-stone-800">{member.husbandName || ''}</strong>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 min-h-[64px]">
              <span className="text-xs text-stone-500 block mb-0.5">માતાનું નામ</span>
              <strong className="text-stone-800">{member.motherName || ''}</strong>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 min-h-[64px]">
              <span className="text-xs text-stone-500 block mb-0.5">ઉંમર</span>
              <strong className="text-stone-800">{member.age ? `${member.age} વર્ષ` : ''}</strong>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 min-h-[64px]">
              <span className="text-xs text-stone-500 block mb-0.5">જન્મ તારીખ</span>
              <strong className="text-stone-800 font-chirp">{member.dob || ''}</strong>
            </div>

            <div className="sm:col-span-2 p-3 bg-stone-50 rounded-xl border border-stone-200/70 min-h-[64px]">
              <span className="text-xs text-stone-500 block mb-0.5">રહેઠાણ / સરનામું</span>
              <p className="text-stone-800 font-medium">{member.address || ''}</p>
              {(member.city || member.district || member.pincode) && (
                <p className="text-xs text-stone-500 mt-1">
                  {member.city || ''}{member.district ? `, જિલ્લો: ${member.district}` : ''}{member.pincode ? ` - પિનકોડ: ${member.pincode}` : ''}
                </p>
              )}
            </div>

            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 min-h-[64px]">
              <span className="text-xs text-amber-800 font-semibold block flex items-center gap-1 mb-0.5">
                <Briefcase className="w-3.5 h-3.5" /> વ્યવસાય
              </span>
              <strong className="text-stone-900 block">{member.occupation || ''}</strong>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 min-h-[64px]">
              <span className="text-xs text-amber-800 font-semibold block flex items-center gap-1 mb-0.5">
                <Coins className="w-3.5 h-3.5" /> વાર્ષિક આવક
              </span>
              <strong className="text-amber-950 font-chirp text-base block">
                {member.annualIncome || ''} {member.annualIncome && member.incomeType ? `(${member.incomeType})` : ''}
              </strong>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 min-h-[64px]">
              <span className="text-xs text-stone-500 block mb-0.5">મોબાઈલ નંબર</span>
              <span className="text-stone-800 font-chirp font-semibold">{member.phone || ''}</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 min-h-[64px]">
              <span className="text-xs text-stone-500 block mb-0.5">સંપર્ક ઈમેઈલ</span>
              <span className="text-stone-800 font-chirp font-medium text-xs break-all">{member.email || ''}</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 min-h-[64px]">
              <span className="text-xs text-stone-500 block mb-0.5">જોડાયા તારીખ</span>
              <span className="text-stone-800 font-chirp font-semibold">{member.joinDate || ''}</span>
            </div>

            {member.parentMemberNumber && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/70 min-h-[64px]">
                <span className="text-xs text-emerald-800 block mb-0.5">જોડાયેલ માતા/પરિવાર સભ્ય નં</span>
                <span className="text-emerald-950 font-chirp font-bold text-base">{member.parentMemberNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Family Members Management (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-amber-200 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-700" />
              <span>ઘરના સભ્યો ({member.familyMembers.length})</span>
            </h3>
            <button
              onClick={() => setShowAddFamilyModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>સભ્ય જોડો</span>
            </button>
          </div>

          {/* Family members cards */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {member.familyMembers.length === 0 ? (
              <div className="text-center py-8 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
                <Users className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="text-sm text-stone-600 font-medium">કોઈ ઘરના સભ્ય ઉમેરેલા નથી</p>
                <button
                  onClick={() => setShowAddFamilyModal(true)}
                  className="mt-3 text-xs text-amber-700 font-bold underline cursor-pointer"
                >
                  અહીં ક્લિક કરી સભ્ય જોડો
                </button>
              </div>
            ) : (
              member.familyMembers.map((fam) => (
                <div 
                  key={fam.id}
                  className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200/70 hover:border-amber-300 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">{fam.name}</span>
                      <span className="px-2.5 py-0.5 bg-amber-200 text-amber-950 font-bold rounded-full text-[11px]">
                        {fam.relation}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveFamilyMember(fam.id)}
                      title="સભ્ય દૂર કરો"
                      className="p-1 text-stone-400 hover:text-red-600 rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
                    <div>
                      <span className="text-stone-400">ઉંમર: </span>
                      <strong className="text-stone-700">{fam.age ? `${fam.age} વર્ષ` : ''}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400">વ્યવસાય: </span>
                      <strong className="text-stone-700">{fam.occupation || ''}</strong>
                    </div>
                  </div>

                  {fam.phone && (
                    <div className="text-xs text-stone-500 font-chirp flex items-center gap-1">
                      <Phone className="w-3 h-3 text-amber-700" />
                      <span>{fam.phone}</span>
                    </div>
                  )}

                  {fam.notes && (
                    <p className="text-[11px] text-amber-900/80 italic pt-1 border-t border-amber-200/50">
                      {fam.notes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD FAMILY MEMBER MODAL */}
      {showAddFamilyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto font-gujarati">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-700" />
                <span>ઘરના સભ્ય ઉમેરો</span>
              </h3>
              <button
                onClick={() => setShowAddFamilyModal(false)}
                className="text-stone-400 hover:text-stone-600 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFamilyMember} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  સભ્યનું પૂરું નામ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="દા.ત. ભાવિનકુમાર કાનાણી"
                  value={famName}
                  onChange={(e) => setFamName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    સંબંધ *
                  </label>
                  <select
                    value={famRelation}
                    onChange={(e) => setFamRelation(e.target.value as RelationType)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white"
                  >
                    {relationsList.map((rel) => (
                      <option key={rel} value={rel}>{rel}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    ઉંમર (વર્ષ)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    placeholder="દા.ત. ૩૫"
                    value={famAge}
                    onChange={(e) => setFamAge(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-chirp"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    વ્યવસાય
                  </label>
                  <input
                    type="text"
                    placeholder="દા.ત. બિઝનેસ / સર્વિસ"
                    value={famOccupation}
                    onChange={(e) => setFamOccupation(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    મોબાઈલ નંબર
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98250 12345"
                    value={famPhone}
                    onChange={(e) => setFamPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-chirp"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  વિશેષ નોંધ
                </label>
                <input
                  type="text"
                  placeholder="દા.ત. સેવા પ્રવૃત્તિ"
                  value={famNotes}
                  onChange={(e) => setFamNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddFamilyModal(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold cursor-pointer"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-colors cursor-pointer shadow-xs"
                >
                  સભ્ય સાચવો
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT FULL PROFILE MODAL */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto font-gujarati">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-amber-200 my-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-700" />
                <span>સભ્ય પ્રોફાઇલમાં ફેરફાર કરો</span>
              </h3>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="text-stone-400 hover:text-stone-600 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">૬ આંકડાનો સભ્ય નંબર *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={editMemberNumber}
                    onChange={(e) => setEditMemberNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-chirp font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">અટક *</label>
                  <input
                    type="text"
                    required
                    value={editSurname}
                    onChange={(e) => setEditSurname(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">પોતાનું નામ *</label>
                  <input
                    type="text"
                    required
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">પિતાનું નામ</label>
                  <input
                    type="text"
                    value={editFatherName}
                    onChange={(e) => setEditFatherName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">પતિનું નામ</label>
                  <input
                    type="text"
                    value={editHusbandName}
                    onChange={(e) => setEditHusbandName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">માતાનું નામ</label>
                  <input
                    type="text"
                    value={editMotherName}
                    onChange={(e) => setEditMotherName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">ઉંમર (વર્ષ)</label>
                  <input
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-chirp"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">મોબાઈલ નંબર</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-chirp"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">સંપર્ક ઈમેઈલ</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-chirp"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">રહેઠાણ / સરનામું</label>
                <textarea
                  rows={2}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">શહેર / ગામ</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">જિલ્લો</label>
                  <input
                    type="text"
                    value={editDistrict}
                    onChange={(e) => setEditDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">પિનકોડ</label>
                  <input
                    type="text"
                    value={editPincode}
                    onChange={(e) => setEditPincode(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-chirp"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">વ્યવસાય</label>
                  <input
                    type="text"
                    value={editOccupation}
                    onChange={(e) => setEditOccupation(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">વાર્ષિક આવક</label>
                  <input
                    type="text"
                    value={editAnnualIncome}
                    onChange={(e) => setEditAnnualIncome(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-chirp"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">આવક પ્રકાર</label>
                  <select
                    value={editIncomeType}
                    onChange={(e) => setEditIncomeType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm bg-white"
                  >
                    <option value="પોતાની">પોતાની</option>
                    <option value="પરિવારની">પરિવારની</option>
                    <option value="સંયુક્ત">સંયુક્ત</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">મંડળમાં હોદ્દો</label>
                <input
                  type="text"
                  value={editMandalRole}
                  onChange={(e) => setEditMandalRole(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold cursor-pointer"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-colors cursor-pointer shadow-xs"
                >
                  પ્રોફાઇલ સાચવો
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
