import { useState } from 'react';
import { SampradayOfficer, MahilaMember } from '../types';
import { 
  Users, 
  Search, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Award, 
  Briefcase, 
  Heart,
  ChevronRight,
  Check,
  Hash
} from 'lucide-react';
import { useThakorjiImage } from '../utils/imageStore';

interface Props {
  officers: SampradayOfficer[];
  members: MahilaMember[];
  onSelectMember: (memberId: string) => void;
  onOpenNewMemberModal: () => void;
}

export default function SampradayDirectoryView({
  officers,
  members,
  onSelectMember,
  onOpenNewMemberModal
}: Props) {
  const [thakorjiImg] = useThakorjiImage();
  const [activeTab, setActiveTab] = useState<'officers' | 'members'>('officers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  // Unique cities from members
  const cities = Array.from(new Set(members.map(m => m.city)));

  // Filtered members
  const filteredMembers = members.filter(m => {
    if (selectedCity !== 'all' && m.city !== selectedCity) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        m.firstName.toLowerCase().includes(q) ||
        m.surname.toLowerCase().includes(q) ||
        m.husbandName.toLowerCase().includes(q) ||
        m.fatherName.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        m.occupation.toLowerCase().includes(q) ||
        (m.memberNumber && m.memberNumber.includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-gujarati animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-800 via-stone-800 to-amber-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-amber-600/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full text-xs font-semibold backdrop-blur-xs text-amber-200 border border-white/10 mb-2">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>સંપ્રદાય કારોબારી સમિતિ & સભ્ય ડિરેક્ટરી</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif-gujarati">
              સંપ્રદાયમાં કોણ કોણ છે: તમામ હોદ્દેદારો & સભ્યો
            </h2>
            <p className="text-stone-300 text-sm mt-1 max-w-2xl leading-relaxed">
              શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાયના પ્રમુખશ્રી, કારોબારી સમિતિ, સભા સંચાલિકા બહેનો અને તમામ સક્રિય સભ્યોની અધિકૃત વિગતો.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenNewMemberModal}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-sm font-bold shadow-md transition-all cursor-pointer inline-flex items-center gap-2 shrink-0"
        >
          <span>+ નવી મહિલા સભ્ય ઉમેરો</span>
        </button>
      </div>

      {/* Directory Navigation Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex rounded-xl bg-stone-100 p-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('officers')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'officers'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            કારોબારી સમિતિ & વરિષ્ઠ હોદ્દેદારો ({officers.length})
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'members'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            સર્વ નોંધાયેલ મહિલા સભ્યો ({members.length})
          </button>
        </div>

        {activeTab === 'members' && (
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="નામ, શહેર કે વ્યવસાય શોધો..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* City filter */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-1.5 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">બધા શહેરો</option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* VIEW 1: OFFICERS & EXECUTIVE LEADERSHIP */}
      {activeTab === 'officers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {officers.map((officer) => (
            <div
              key={officer.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-14 h-14 rounded-2xl ${officer.isSankhyayogi ? 'bg-amber-700' : 'bg-stone-800'} text-white flex items-center justify-center font-bold text-xl shadow-xs font-serif-gujarati`}>
                    {officer.name.charAt(0)}
                  </div>
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[11px] font-bold rounded-full font-chirp">
                    {officer.serviceYears}
                  </span>
                </div>

                <div className="mt-4">
                  <span className="text-xs text-amber-800 font-bold block">
                    {officer.department}
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 mt-0.5">
                    {officer.name}
                  </h3>
                  <p className="text-xs font-semibold text-amber-950 mt-0.5">
                    {officer.designation}
                  </p>
                </div>

                <p className="text-xs text-stone-600 mt-3 leading-relaxed border-t border-stone-100 pt-3">
                  {officer.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>{officer.city}</span>
                </span>
                <span className="flex items-center gap-1 font-chirp">
                  <Phone className="w-3.5 h-3.5 text-amber-700" />
                  <span>{officer.contact}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: ALL REGISTERED MAHILA MEMBERS */}
      {activeTab === 'members' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-3xl p-5 border border-stone-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${member.avatarColor} text-white flex items-center justify-center font-bold text-lg shadow-xs`}>
                    {member.firstName.charAt(0)}
                  </div>
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold rounded-full">
                    {member.mandalRole}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-base font-bold text-stone-900">
                      {member.firstName} {member.husbandName ? member.husbandName.split(' ')[0] : ''} {member.surname}
                    </h4>
                    <span 
                      title="વેરિફાઇડ સભ્ય" 
                      className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white shrink-0"
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-chirp font-bold text-amber-950 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300 flex items-center gap-1">
                      <Hash className="w-3 h-3 text-amber-700" />
                      <span>{member.memberNumber || member.id}</span>
                    </span>
                    {(member.fatherName || member.motherName) && (
                      <p className="text-xs text-stone-500 truncate">
                        {member.motherName ? `માતા: ${member.motherName.split(' ')[0]}` : ''}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3 p-3 bg-stone-50 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">વ્યવસાય:</span>
                    <strong className="text-stone-800">{member.occupation}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">વાર્ષિક આવક:</span>
                    <strong className="text-amber-900 font-chirp">{member.annualIncome}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">પરિવાર સભ્યો:</span>
                    <strong className="text-stone-800">{member.familyMembers.length} સભ્યો</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>{member.city}</span>
                </span>

                <button
                  onClick={() => onSelectMember(member.id)}
                  className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <span>પ્રોફાઇલ ખોલો</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
