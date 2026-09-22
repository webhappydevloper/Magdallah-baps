import { useState } from 'react';
import { JamanwarPlan, MahilaMember, JamanwarMenuItem } from '../types';
import { 
  UtensilsCrossed, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  CheckCircle2, 
  Sparkles, 
  UserCheck, 
  ChevronRight,
  Receipt
} from 'lucide-react';

interface Props {
  jamanwars: JamanwarPlan[];
  currentMember: MahilaMember;
  onOpenJamanwarModal: () => void;
  onOpenDonateModal: () => void;
}

export default function JamanwarView({
  jamanwars,
  currentMember,
  onOpenJamanwarModal,
  onOpenDonateModal
}: Props) {
  const [activePlanId, setActivePlanId] = useState<string>(jamanwars[0]?.id || '');
  const selectedPlan = jamanwars.find(j => j.id === activePlanId) || jamanwars[0];

  return (
    <div className="space-y-6 font-gujarati animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-amber-400/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-white p-1.5 shrink-0 items-center justify-center border-2 border-amber-300 shadow-md">
            <img 
              src="/baps-logo.png" 
              alt="BAPS Swaminarayan Sanstha Logo" 
              className="w-full h-full object-contain bg-white rounded-xl" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full text-xs font-semibold backdrop-blur-xs text-amber-100 border border-white/10 mb-2">
              <UtensilsCrossed className="w-3.5 h-3.5 text-amber-300" />
              <span>મહાપ્રસાદ સેવા • અન્નદાનં મહાદાનમ્</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif-gujarati">
              જમણવાર આયોજન & સાત્વિક મેનુ પ્રબંધન
            </h2>
            <p className="text-amber-100 text-sm mt-1 max-w-2xl leading-relaxed">
              સ્વામિનારાયણ મહિલા સંપ્રદાયમાં પવિત્ર એકાદશી, ઉત્સવો અને પારિવારિક મંગલ પ્રસંગોએ યોજાતા જમણવારની તારીખ, સમય, સેવા રકમ અને સાત્વિક વાનગીઓની સંપૂર્ણ વિગત.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenJamanwarModal}
          className="px-6 py-3 bg-white text-amber-900 hover:bg-amber-50 rounded-2xl text-sm font-bold shadow-md transition-all cursor-pointer inline-flex items-center gap-2 shrink-0"
        >
          <Plus className="w-5 h-5 text-amber-700" />
          <span>નવો જમણવાર નોંધાવો / સ્પોન્સર કરો</span>
        </button>
      </div>

      {/* Main Layout: List of Jamanwar Schedules + Detail Active Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Jamanwar Event selector cards (4 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-base font-bold text-stone-900 flex items-center justify-between">
            <span>આયોજિત જમણવાર સૂચિ ({jamanwars.length})</span>
            <span className="text-xs text-stone-500 font-normal">ક્લિક કરી મેનુ જુઓ</span>
          </h3>

          <div className="space-y-3">
            {jamanwars.map((plan) => {
              const isSelected = plan.id === selectedPlan?.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setActivePlanId(plan.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-amber-50/90 border-amber-500 shadow-md ring-2 ring-amber-400/20'
                      : 'bg-white hover:bg-amber-50/40 border-stone-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[11px] font-bold rounded-full">
                      {plan.mealType}
                    </span>
                    <span className="text-sm font-black text-amber-950 font-chirp">
                      ₹{plan.amount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-stone-900 mt-2 line-clamp-1">
                    {plan.occasion}
                  </h4>

                  <p className="text-xs text-stone-600 mt-1">
                    યજમાન: <strong className="text-stone-800">{plan.hostName}</strong>
                  </p>

                  <div className="flex items-center gap-3 text-xs text-stone-500 mt-2 font-chirp">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      {plan.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      {plan.time}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-500">
                      અંદાજે {plan.approxGuests} હરિભક્તો
                    </span>
                    <span className={`font-bold flex items-center gap-1 ${
                      isSelected ? 'text-amber-700' : 'text-stone-400'
                    }`}>
                      <span>મેનુ જુઓ</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Selected Jamanwar Complete Dossier & Menu (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-amber-200 shadow-xs space-y-6">
          {selectedPlan ? (
            <>
              {/* Header Details */}
              <div className="border-b border-stone-100 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-900 rounded-full text-xs font-bold">
                    {selectedPlan.status}
                  </span>
                  <div className="text-right">
                    <span className="text-xs text-stone-500 block">જમણવાર સેવા રકમ (Amount):</span>
                    <span className="text-2xl font-black text-amber-950 font-chirp">
                      ₹{selectedPlan.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-2">
                  {selectedPlan.occasion}
                </h3>
                <p className="text-sm text-stone-600 mt-1">
                  યજમાનશ્રી: <strong className="text-amber-900 text-base">{selectedPlan.hostName}</strong>
                </p>
              </div>

              {/* Event Logistics Grid (Date, Time, Location, Attendance, Coordinators) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-amber-50/50 p-4 rounded-2xl border border-amber-200/70">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-stone-500 block">તારીખ & ભોજન પ્રકાર:</span>
                    <strong className="text-stone-900 font-chirp text-sm">{selectedPlan.date}</strong>
                    <p className="text-amber-900 font-semibold">{selectedPlan.mealType}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-stone-500 block">સમયગાળો (Time):</span>
                    <strong className="text-stone-900 text-sm">{selectedPlan.time}</strong>
                    <p className="text-stone-500">મહાપ્રસાદ પીરસવાનો સમય</p>
                  </div>
                </div>

                <div className="sm:col-span-2 flex items-start gap-2 pt-2 border-t border-amber-200/50">
                  <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-stone-500 block">સ્થળ / ભોજનશાળા હોલ:</span>
                    <strong className="text-stone-900 text-sm">{selectedPlan.locationHall}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-2 border-t border-amber-200/50">
                  <Users className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-stone-500 block">અંદાજિત હરિભક્તો સંખ્યા:</span>
                    <strong className="text-stone-900 text-sm font-chirp">{selectedPlan.approxGuests} વ્યક્તિઓ</strong>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-2 border-t border-amber-200/50">
                  <UserCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-stone-500 block">સંચાલિકા / સંપર્ક બહેન:</span>
                    <strong className="text-stone-900 text-sm">{selectedPlan.inchargeSister}</strong>
                  </div>
                </div>
              </div>

              {/* WHAT MENU WILL BE SERVED (શું શું Menu રહેશે) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5 text-amber-700" />
                    <span>જમણવારનું સત્તાવાર સાત્વિક Menu (વાનગીઓની યાદી)</span>
                  </h4>
                  <span className="text-xs text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md font-semibold">
                    શુદ્ધ ઘી માંથી તૈયાર
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {selectedPlan.menu.map((menuGroup, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors"
                    >
                      <div className="flex items-center justify-between border-b border-stone-200 pb-2 mb-2.5">
                        <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                          {menuGroup.category}
                        </span>
                        <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-bold font-chirp">
                          {menuGroup.items.length} વાનગીઓ
                        </span>
                      </div>

                      <ul className="space-y-1.5">
                        {menuGroup.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="text-xs font-medium text-stone-800 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Organization & Cooking Team Details */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">રસોઈયા સમિતિ:</span>
                  <strong className="text-stone-900">{selectedPlan.rasoiyaTeam}</strong>
                </div>
                {selectedPlan.notes && (
                  <div className="pt-2 border-t border-stone-200 text-stone-600">
                    <strong className="text-amber-900">આયોજન નોંધ: </strong>
                    <span>{selectedPlan.notes}</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-stone-500">
              કૃપા કરીને ડાબી બાજુથી કોઈ જમણવાર પસંદ કરો.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
