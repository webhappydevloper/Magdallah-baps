import { 
  MahilaMember, 
  DonationRecord, 
  JamanwarPlan, 
  SabhaEvent 
} from '../types';
import { 
  HeartHandshake, 
  UtensilsCrossed, 
  CalendarDays, 
  UserPlus, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowRight,
  ShieldAlert,
  Database,
  ShieldCheck,
  HardDrive
} from 'lucide-react';

interface Props {
  currentMember: MahilaMember;
  donations: DonationRecord[];
  jamanwars: JamanwarPlan[];
  sabhas: SabhaEvent[];
  onNavigateTab: (tab: string) => void;
  onOpenDonateModal: () => void;
  onOpenJamanwarModal: () => void;
  onOpenAddFamilyModal: () => void;
  onViewReceipt: (donation: DonationRecord) => void;
  onOpenBackupModal?: () => void;
}

export default function DashboardOverview({
  currentMember,
  donations,
  jamanwars,
  sabhas,
  onNavigateTab,
  onOpenDonateModal,
  onOpenJamanwarModal,
  onOpenAddFamilyModal,
  onViewReceipt,
  onOpenBackupModal
}: Props) {
  // Calculations
  const totalReceived = donations.filter(d => !d.isExpense).reduce((sum, d) => sum + d.amount, 0);
  const totalExpenses = donations.filter(d => d.isExpense).reduce((sum, d) => sum + d.amount, 0);
  const totalCommunityFund = totalReceived - totalExpenses;

  const myTotalContribution = donations
    .filter(d => d.memberId === currentMember.id && !d.isExpense)
    .reduce((sum, d) => sum + d.amount, 0);

  const nextJamanwar = jamanwars[0];
  const nextSabha = sabhas[0];

  return (
    <div className="space-y-6 font-gujarati animate-in fade-in duration-200">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-700 via-orange-600 to-amber-900 text-white p-6 sm:p-8 shadow-xl border border-amber-500/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* BAPS Logo with White Background */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 shadow-lg flex items-center justify-center shrink-0 border-2 border-amber-300">
              <img 
                src="/baps-logo.png" 
                alt="BAPS Swaminarayan Sanstha Logo" 
                className="w-full h-full object-contain bg-white rounded-xl" 
                referrerPolicy="no-referrer" 
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full text-xs font-semibold backdrop-blur-xs text-amber-100 border border-white/10 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>જય સ્વામિનારાયણ • BAPS મહિલા મંડળ સ્વાગતમ્</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif-gujarati">
                {currentMember.firstName} {currentMember.husbandName ? currentMember.husbandName.split(' ')[0] : ''} {currentMember.surname}
              </h2>
              <p className="text-amber-100 text-sm mt-1 max-w-2xl leading-relaxed">
                સ્વામિનારાયણ મહિલા સંપ્રદાય પોર્ટલમાં આપનું હાર્દિક સ્વાગત છે. અહીં આપ આપની પારિવારિક વિગતો, જમણવાર સેવા, દાન રસીદો અને આગામી સભાઓની તમામ માહિતી એક જ ક્લિકમાં સંભાળી શકો છો.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-medium text-amber-200">
                <span className="bg-black/20 px-2.5 py-1 rounded-lg">
                  મંડળ હોદ્દો: <strong className="text-white">{currentMember.mandalRole}</strong>
                </span>
                <span className="bg-black/20 px-2.5 py-1 rounded-lg">
                  શહેર: <strong className="text-white">{currentMember.city}</strong>
                </span>
                <span className="bg-black/20 px-2.5 py-1 rounded-lg">
                  પરિવારના સભ્યો: <strong className="text-white">{currentMember.familyMembers.length} વ્યક્તિ</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={onOpenDonateModal}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-amber-900 hover:bg-amber-50 rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-amber-700" />
              <span>દાન / ભંડોળ અર્પણ કરો</span>
            </button>
            <button
              onClick={onOpenJamanwarModal}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500/30 hover:bg-amber-500/40 text-white border border-white/25 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              <UtensilsCrossed className="w-4 h-4 text-amber-200" />
              <span>જમણવાર સ્પોન્સર કરો</span>
            </button>
          </div>
        </div>

        {/* Decorative BAPS Logo background watermark with white background */}
        <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none select-none">
          <div className="w-48 h-48 rounded-full bg-white p-3 shadow-2xl flex items-center justify-center">
            <img 
              src="/baps-logo.png" 
              alt="BAPS Logo" 
              className="w-full h-full object-contain bg-white rounded-full" 
              referrerPolicy="no-referrer" 
            />
          </div>
        </div>
      </div>

      {/* Persistent Storage Assurance Bar (5MB Limit Free IndexedDB) */}
      <div className="bg-emerald-50/90 border border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-emerald-950 font-serif-gujarati">
                ડેટાબેઝ સુરક્ષિત: કાયમી સાચવેલ (Persistent Storage Active)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-black font-chirp">
                NO 5MB LIMIT
              </span>
            </div>
            <p className="text-xs text-emerald-800 mt-0.5">
              પેજ રિફ્રેશ કરો, બ્રાઉઝર બંધ કરો કે થોડા દિવસ પછી ખોલો — તમારો તમામ ડેટા (સભ્યો, દાન, જમણવાર, સભાઓ) ક્યારેય ક્લિયર નહીં થાય.
            </p>
          </div>
        </div>

        {onOpenBackupModal && (
          <button
            type="button"
            onClick={onOpenBackupModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>બેકઅપ & રિસ્ટોર ટૂલ</span>
          </button>
        )}
      </div>

      {/* 4 Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Community Fund */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              સંપ્રદાયનું કુલ એકત્રિત ભંડોળ
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <span className="text-lg font-bold">₹</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-amber-950 font-chirp tracking-tight">
              ₹{totalCommunityFund.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>સર્વ મહિલા મંડળનું એકત્રિત ભંડોળ</span>
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('donations')}
            className="mt-4 text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <span>સંપૂર્ણ હિસાબ જુઓ</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Personal Contribution */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-2xl p-5 border border-amber-300 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              તમારો અંગત ફાળો (My Contribution)
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-amber-900 font-chirp tracking-tight">
              ₹{myTotalContribution.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-amber-800 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>{currentMember.firstName} દ્વારા સમર્પિત સેવા</span>
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('donations')}
            className="mt-4 text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
          >
            <span>તમારી દાન પાવતીઓ</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Upcoming Jamanwar highlight */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              આગામી જમણવાર સેવા
            </span>
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-lg font-bold text-stone-900 truncate">
              {nextJamanwar ? nextJamanwar.occasion : 'આયોજન ટૂંક સમયમાં'}
            </div>
            <p className="text-xs text-stone-600 mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{nextJamanwar?.date} • {nextJamanwar?.time}</span>
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('jamanwar')}
            className="mt-4 text-xs font-bold text-orange-700 hover:text-orange-800 flex items-center gap-1 cursor-pointer"
          >
            <span>જમણવાર મેનુ & વિગતો</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Next Sabha highlight */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              આગામી મહિલા સભા
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-base font-bold text-stone-900 line-clamp-1">
              {nextSabha ? nextSabha.conductedBy.name : 'મહિલા સત્સંગ સભા'}
            </div>
            <p className="text-xs text-stone-600 mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{nextSabha?.date} • {nextSabha?.time}</span>
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('sabha')}
            className="mt-4 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>સભા શેડ્યૂલ & વક્તા</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Two Columns: Active Jamanwar Prasad Menu & Next Sabha Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Featured Jamanwar & Satvik Menu (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-amber-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-orange-100 text-orange-800 text-xs font-bold rounded-full">
                  મહાપ્રસાદ આયોજન
                </span>
                <span className="text-xs text-stone-500">
                  સેવા રકમ: <strong className="text-amber-800 font-chirp font-bold">₹{nextJamanwar?.amount.toLocaleString('en-IN')}</strong>
                </span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mt-1">
                {nextJamanwar?.occasion}
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('jamanwar')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 underline cursor-pointer self-start sm:self-auto"
            >
              બધા જમણવાર જુઓ
            </button>
          </div>

          {/* Jamanwar Meta Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60">
            <div>
              <span className="text-stone-500">યજમાન બહેન / પરિવાર:</span>
              <p className="font-bold text-stone-900 mt-0.5">{nextJamanwar?.hostName}</p>
            </div>
            <div>
              <span className="text-stone-500">તારીખ & સમય:</span>
              <p className="font-bold text-amber-900 mt-0.5">{nextJamanwar?.date} • {nextJamanwar?.time}</p>
            </div>
            <div className="sm:col-span-2">
              <span className="text-stone-500">સ્થળ / સભાગૃહ:</span>
              <p className="font-medium text-stone-800 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>{nextJamanwar?.locationHall}</span>
              </p>
            </div>
          </div>

          {/* Sacred Satvik Menu Box */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                <UtensilsCrossed className="w-4 h-4 text-amber-600" />
                <span>જમણવારમાં શું શું Menu રહેશે (સાત્વિક મહાપ્રસાદ વાનગીઓ)</span>
              </h4>
              <span className="text-xs text-stone-500">
                અંદાજિત {nextJamanwar?.approxGuests} હરિભક્તો
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {nextJamanwar?.menu.map((categoryGroup, idx) => (
                <div 
                  key={idx} 
                  className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-stone-200 pb-1.5 mb-2">
                    <span className="text-xs font-bold text-amber-900">
                      {categoryGroup.category}
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-chirp px-1.5 py-0.2 rounded-full">
                      {categoryGroup.items.length} આઈટમ
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {categoryGroup.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="text-xs text-stone-700 flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 border-t border-stone-100">
            <span>રસોઈ સંચાલન: <strong className="text-stone-800">{nextJamanwar?.rasoiyaTeam}</strong></span>
            <button
              onClick={onOpenJamanwarModal}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-colors cursor-pointer"
            >
              + નવો જમણવાર નોંધાવો
            </button>
          </div>
        </div>

        {/* Right Column: Next Sabha & Profile Family Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Next Sabha Card */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5" /> આગામી મહિલા સભા
              </span>
              <span className="text-xs text-stone-500 font-chirp">
                {nextSabha?.date}
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-stone-900 leading-snug">
                {nextSabha?.title}
              </h4>
              <div className="mt-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
                <span className="text-xs text-stone-500">સભા કોણ કરાવે છે:</span>
                <p className="text-sm font-bold text-emerald-950 mt-0.5">
                  {nextSabha?.conductedBy.name}
                </p>
                <p className="text-xs text-emerald-800">
                  {nextSabha?.conductedBy.title} • {nextSabha?.conductedBy.ashramOrCity}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-stone-700">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900">સમય: </strong>
                  <span>{nextSabha?.time}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900">સ્થળ: </strong>
                  <span>{nextSabha?.venue}</span>
                </div>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-stone-600 italic">
                <strong>વિષય:</strong> {nextSabha?.topic}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs text-stone-500">
                હાજરી નોંધણી: <strong className="text-emerald-700 font-chirp">{nextSabha?.rsvpCount}</strong> બહેનો
              </div>
              <button
                onClick={() => onNavigateTab('sabha')}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                સભા વિગતો જુઓ
              </button>
            </div>
          </div>

          {/* Quick Family Snapshot Card */}
          <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-stone-900">
                  પરિવારના સભ્યો ({currentMember.familyMembers.length})
                </h4>
              </div>
              <button
                onClick={onOpenAddFamilyModal}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ સભ્ય ઉમેરો</span>
              </button>
            </div>

            <div className="space-y-2">
              {currentMember.familyMembers.map((fam) => (
                <div 
                  key={fam.id} 
                  className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/40 border border-amber-200/50 text-xs"
                >
                  <div>
                    <span className="font-bold text-stone-900">{fam.name}</span>
                    <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md font-semibold text-[10px]">
                      {fam.relation}
                    </span>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {fam.age ? `ઉંમર: ${fam.age} વર્ષ` : ''}
                      {fam.age && fam.occupation ? ' • ' : ''}
                      {fam.occupation || ''}
                    </p>
                  </div>
                  {fam.phone && (
                    <span className="text-[11px] font-chirp text-stone-500">
                      {fam.phone}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('profile')}
              className="w-full py-2 bg-stone-100 hover:bg-amber-100/70 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
            >
              સંપૂર્ણ સભ્ય પ્રોફાઇલ અને ઘરના સભ્યો વ્યવસ્થાપન →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Donations Ledger Preview */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              તાજેતરમાં નોંધાયેલ દાન પાવતીઓ & ભંડોળ
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              સંપ્રદાયના તમામ સેવા ફંડની પારદર્શક નોંધણી
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('donations')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
          >
            બધી રસીદો જુઓ →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500">
                <th className="py-2.5 px-3 font-semibold">રસીદ નંબર</th>
                <th className="py-2.5 px-3 font-semibold">દાતા બહેનનું નામ</th>
                <th className="py-2.5 px-3 font-semibold">હેતુ / કેટેગરી</th>
                <th className="py-2.5 px-3 font-semibold">તારીખ</th>
                <th className="py-2.5 px-3 font-semibold">પદ્ધતિ</th>
                <th className="py-2.5 px-3 font-semibold text-right">રકમ (₹)</th>
                <th className="py-2.5 px-3 font-semibold text-center">પાવતી</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {donations.slice(0, 5).map((donation) => (
                <tr key={donation.id} className="hover:bg-amber-50/40 transition-colors">
                  <td className="py-3 px-3 font-chirp font-semibold text-amber-900">
                    {donation.receiptNo}
                  </td>
                  <td className="py-3 px-3 font-bold text-stone-900">
                    {donation.donorName}
                    {donation.memberId === currentMember.id && (
                      <span className="ml-1.5 px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] rounded-sm font-semibold">
                        આપનું દાન
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-stone-600 font-medium">
                    {donation.category}
                  </td>
                  <td className="py-3 px-3 font-chirp text-stone-500">
                    {donation.date}
                  </td>
                  <td className="py-3 px-3 text-stone-600">
                    {donation.paymentMode}
                  </td>
                  <td className="py-3 px-3 text-right font-chirp font-bold text-amber-900 text-sm">
                    ₹{donation.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => onViewReceipt(donation)}
                      className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-md font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      રસીદ જુઓ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
