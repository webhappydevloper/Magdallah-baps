import { useRef, useState } from 'react';
import { 
  DonationRecord, 
  MahilaMember, 
  JamanwarPlan, 
  SabhaEvent 
} from '../types';
import { amountToGujaratiWords } from '../utils/numberToGujaratiWords';
import { printElement } from '../utils/printHelper';
import { 
  CheckCircle2, 
  Printer, 
  Copy, 
  Check, 
  ShieldCheck, 
  Award, 
  Calendar, 
  MapPin, 
  Phone, 
  Sparkles,
  Utensils,
  HeartHandshake,
  UserCheck,
  Building2
} from 'lucide-react';

export type InlineDocType = 'donation_invoice' | 'jamanwar_bill' | 'member_card' | 'sabha_patrika';

interface Props {
  docType: InlineDocType;
  donation?: DonationRecord;
  member?: MahilaMember;
  jamanwar?: JamanwarPlan;
  sabha?: SabhaEvent;
  compact?: boolean;
  onCopySuccess?: (msg: string) => void;
}

export default function InlineEmailDocument({
  docType,
  donation,
  member,
  jamanwar,
  sabha,
  compact = false,
  onCopySuccess
}: Props) {
  const docRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Extract member number
  const memberNumber = member?.memberNumber || 
    (docType === 'donation_invoice' ? '104821' : 
     docType === 'jamanwar_bill' ? '104822' : 
     docType === 'sabha_patrika' ? '104821' : '104823');

  const handlePrint = () => {
    if (docRef.current) {
      printElement(docRef.current, `SMMS_${docType}_#${memberNumber}`);
    } else {
      window.print();
    }
  };

  const handleCopyRichHtml = async () => {
    if (!docRef.current) return;
    try {
      const htmlContent = docRef.current.outerHTML;
      const plainText = docRef.current.innerText;

      if (navigator.clipboard && window.ClipboardItem) {
        const textBlob = new Blob([plainText], { type: 'text/plain' });
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/plain': textBlob,
            'text/html': htmlBlob
          })
        ]);
      } else {
        await navigator.clipboard.writeText(plainText);
      }

      setCopied(true);
      if (onCopySuccess) {
        onCopySuccess('ઇનલાઇન HTML દસ્તાવેજ સફળતાપૂર્વક કોપી થયો! Gmail માં સુંદર ડિઝાઇન સાથે પેસ્ટ થશે.');
      }
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Copy failed:', err);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Top Action Bar for the Inline Document */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-bold text-amber-950">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>ઇનલાઇન સત્તાવાર દસ્તાવેજ (Inline Digital Document)</span>
          </span>
          <span className="px-2 py-0.5 bg-amber-200/60 text-amber-900 rounded font-black text-[10px] tracking-wide font-chirp">
            સભ્ય નં: #{memberNumber}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyRichHtml}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-lg text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
            title="આ ડિઝાઇન કરેલું કાર્ડ સંપૂર્ણ રંગો અને ટેબલ સાથે કોપી કરો"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700">HTML કોપી થયું!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-stone-600" />
                <span>HTML કોપી</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
            title="આ દસ્તાવેજ સીધો પ્રિન્ટ કરો"
          >
            <Printer className="w-3 h-3 text-amber-100" />
            <span>પ્રિન્ટ</span>
          </button>
        </div>
      </div>

      {/* Rendered Document Container */}
      <div 
        ref={docRef} 
        id="inline-document-container"
        className="w-full bg-white rounded-2xl border-2 border-amber-600/30 shadow-md overflow-hidden text-stone-900 font-sans"
        style={{ fontFamily: "'Noto Sans Gujarati', system-ui, sans-serif" }}
      >
        {/* Header with Swaminarayan Sampraday Branding */}
        <div className="bg-linear-to-r from-red-950 via-red-900 to-amber-950 text-white p-4 sm:p-5 relative border-b-2 border-amber-500/80">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <div className="text-[11px] tracking-widest text-amber-300 font-extrabold uppercase">
                ॥ શ્રી સ્વામિનારાયણો વિજયતે ॥
              </div>
              <h2 className="text-lg sm:text-xl font-black text-amber-50 mt-0.5 tracking-tight">
                શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય
              </h2>
              <p className="text-xs text-amber-200/90 font-medium mt-0.5">
                સત્સંગ, ભક્તિ, સંસ્કાર & મહિલા સેવા મંડળ • સત્તાવાર ડિજિટલ પોર્ટલ
              </p>
            </div>

            {/* Member Number Badge */}
            <div className="flex flex-col items-center sm:items-end shrink-0">
              <div className="px-3 py-1 bg-amber-400 text-amber-950 rounded-full font-black text-xs shadow-xs border border-amber-300 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-900" />
                <span>સભ્ય નં: #{memberNumber}</span>
              </div>
              <span className="text-[10px] text-amber-200/80 mt-1 font-chirp">
                તારીખ: {donation?.date || jamanwar?.date || sabha?.date || new Date().toISOString().split('T')[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Sub-Header / Document Type Title */}
        <div className="bg-amber-100/70 border-b border-amber-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {docType === 'donation_invoice' && <HeartHandshake className="w-4 h-4 text-red-700" />}
            {docType === 'jamanwar_bill' && <Utensils className="w-4 h-4 text-amber-700" />}
            {docType === 'member_card' && <UserCheck className="w-4 h-4 text-emerald-700" />}
            {docType === 'sabha_patrika' && <Calendar className="w-4 h-4 text-purple-700" />}
            <span className="font-extrabold text-xs sm:text-sm text-amber-950">
              {docType === 'donation_invoice' && 'સત્તાવાર સેવા ભંડોળ દાન પાવતી & ઇનવોઇસ (DONATION INVOICE)'}
              {docType === 'jamanwar_bill' && 'સત્તાવાર જમણવાર & મહાપ્રસાદ ઇનવોઇસ બિલ (EVENT BILL)'}
              {docType === 'member_card' && 'સત્તાવાર સભ્ય નોંધણી પ્રમાણીકરણ & એકાઉન્ટ કાર્ડ (MEMBER CARD)'}
              {docType === 'sabha_patrika' && 'સત્સંગ સભા આમંત્રણ પત્રિકા & પ્રસાદ વિગત (SABHA PATRIKA)'}
            </span>
          </div>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>પ્રમાણિત</span>
          </span>
        </div>

        {/* Document Body */}
        <div className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
          {/* 1. DONATION INVOICE */}
          {docType === 'donation_invoice' && donation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/60">
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">રસીદ / ઇનવોઇસ નં:</span>
                  <span className="font-extrabold text-stone-900 font-chirp">{donation.receiptNo}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">દાતાશ્રીનું નામ:</span>
                  <span className="font-bold text-stone-900">{donation.donorName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">સેવા કેટેગરી:</span>
                  <span className="font-bold text-red-800">{donation.category}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">ચૂકવણી પદ્ધતિ:</span>
                  <span className="font-semibold text-stone-800">{donation.paymentMode}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">તારીખ & સમય:</span>
                  <span className="font-semibold text-stone-800 font-chirp">{donation.date} • {donation.time}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">રેફરન્સ આઈડી:</span>
                  <span className="font-semibold text-stone-800 font-chirp">{donation.transactionRef || 'N/A'}</span>
                </div>
              </div>

              {/* Big Amount Highlight Banner */}
              <div className="p-4 rounded-xl bg-linear-to-r from-red-900 to-amber-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-inner">
                <div>
                  <span className="text-[11px] text-amber-200 font-bold uppercase tracking-wider block">કુલ સેવા દાન રકમ:</span>
                  <div className="text-2xl sm:text-3xl font-black text-amber-300 font-chirp">
                    ₹{donation.amount.toLocaleString('en-IN')}/-
                  </div>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] text-amber-200/90 block">અક્ષરે રૂપિયા:</span>
                  <span className="font-bold text-white text-xs sm:text-sm">
                    {amountToGujaratiWords(donation.amount)}
                  </span>
                </div>
              </div>

              {/* Purpose Note */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] font-bold text-stone-500 block uppercase">સેવા સંકલ્પ & નોંધ:</span>
                <p className="font-medium text-stone-800 mt-0.5">{donation.purposeNote || 'શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય સેવા ભંડોળ અર્પણ.'}</p>
              </div>
            </div>
          )}

          {/* 2. JAMANWAR BILL */}
          {docType === 'jamanwar_bill' && jamanwar && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/60">
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">બિલ આઈડી:</span>
                  <span className="font-extrabold text-stone-900 font-chirp">{jamanwar.id}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">પ્રસંગ:</span>
                  <span className="font-bold text-stone-900">{jamanwar.occasion}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">યજમાનનું નામ:</span>
                  <span className="font-bold text-red-900">{jamanwar.hostName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">તારીખ & સમય:</span>
                  <span className="font-semibold text-stone-800 font-chirp">{jamanwar.date} • {jamanwar.time}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">ભોજન પ્રકાર:</span>
                  <span className="font-semibold text-stone-800">{jamanwar.mealType}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">અંદાજિત હરિભક્તો:</span>
                  <span className="font-extrabold text-stone-900 font-chirp">{jamanwar.approxGuests} બહેનો</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">સ્થળ / હોલ:</span>
                  <span className="font-semibold text-stone-800">{jamanwar.locationHall}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">રસોઈયા ટીમ:</span>
                  <span className="font-semibold text-stone-800">{jamanwar.rasoiyaTeam}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">સંચાલિકા બહેન:</span>
                  <span className="font-semibold text-stone-800">{jamanwar.inchargeSister}</span>
                </div>
              </div>

              {/* Categorized Menu Table */}
              <div className="border border-amber-200 rounded-xl overflow-hidden">
                <div className="bg-amber-100/90 px-3 py-1.5 font-bold text-xs text-amber-950 flex items-center justify-between">
                  <span>મંજૂર વાનગીઓનું મેનુ (Approved Menu Items)</span>
                  <span className="text-[10px] text-amber-800">શુદ્ધ સાત્વિક રસોઈ વ્યવસ્થા</span>
                </div>
                <div className="divide-y divide-amber-100 bg-white">
                  {jamanwar.menu.map((m, i) => (
                    <div key={i} className="px-3 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs">
                      <span className="font-bold text-amber-900 w-28 shrink-0">{m.category}:</span>
                      <span className="text-stone-800 font-medium flex-1">{m.items.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amount Highlight */}
              <div className="p-4 rounded-xl bg-linear-to-r from-amber-900 to-red-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-inner">
                <div>
                  <span className="text-[11px] text-amber-200 font-bold uppercase tracking-wider block">જમણવાર સેવા રકમ:</span>
                  <div className="text-2xl sm:text-3xl font-black text-amber-300 font-chirp">
                    ₹{jamanwar.amount.toLocaleString('en-IN')}/-
                  </div>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] text-amber-200/90 block">અક્ષરે રૂપિયા:</span>
                  <span className="font-bold text-white text-xs sm:text-sm">
                    {amountToGujaratiWords(jamanwar.amount)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3. MEMBER CARD */}
          {docType === 'member_card' && member && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-linear-to-r from-amber-50 to-red-50 rounded-xl border border-amber-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-900 text-amber-300 font-black text-lg flex items-center justify-center border-2 border-amber-400 shadow-xs shrink-0">
                    {member.firstName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-stone-900">
                      {member.firstName} {member.surname}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="px-2 py-0.5 bg-red-100 text-red-900 rounded font-bold text-[11px]">
                        {member.mandalRole || 'સભ્ય બહેન'}
                      </span>
                      <span className="text-xs text-stone-500 font-chirp">
                        ઉંમર: {member.age} વર્ષ
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-stone-500 font-bold uppercase block">રજિસ્ટર્ડ સભ્યપદ ID:</span>
                  <span className="text-base font-black text-red-900 font-chirp">#{member.memberNumber}</span>
                </div>
              </div>

              {/* Personal Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-white rounded-xl border border-stone-200">
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">પિતાનું નામ:</span>
                  <span className="font-semibold text-stone-900">{member.fatherName || '-'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">પતિનું નામ:</span>
                  <span className="font-semibold text-stone-900">{member.husbandName || '-'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">માતાનું નામ:</span>
                  <span className="font-semibold text-stone-900">{member.motherName || '-'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">સંપર્ક ફોન:</span>
                  <span className="font-semibold text-stone-900 font-chirp">{member.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">ઈમેઈલ:</span>
                  <span className="font-semibold text-stone-900 font-chirp">{member.email || '-'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">વ્યવસાય:</span>
                  <span className="font-semibold text-stone-900">{member.occupation}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">સરનામું & શહેર:</span>
                  <span className="font-semibold text-stone-900">{member.address}, {member.city}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">વાર્ષિક આવક:</span>
                  <span className="font-bold text-emerald-800">{member.annualIncome} ({member.incomeType})</span>
                </div>
              </div>

              {/* Family Members if present */}
              {member.familyMembers && member.familyMembers.length > 0 && (
                <div className="border border-stone-200 rounded-xl overflow-hidden">
                  <div className="bg-stone-100 px-3 py-1.5 font-bold text-xs text-stone-800">
                    પરિવારના સભ્યોની નોંધણી ({member.familyMembers.length} સભ્યો)
                  </div>
                  <div className="divide-y divide-stone-100">
                    {member.familyMembers.map((fam, idx) => (
                      <div key={idx} className="px-3 py-2 flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-900">{idx + 1}. {fam.name} ({fam.relation})</span>
                        <span className="text-stone-600 font-chirp">ઉંમર: {fam.age} વર્ષ • {fam.occupation || '-'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. SABHA PATRIKA */}
          {docType === 'sabha_patrika' && sabha && (
            <div className="space-y-4">
              <div className="p-4 bg-linear-to-r from-red-50 to-amber-50 rounded-xl border border-red-200">
                <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block">સત્સંગ સભા શીર્ષક:</span>
                <h3 className="text-base sm:text-lg font-black text-red-950 mt-0.5">
                  {sabha.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-stone-700">
                  <span className="font-chirp font-bold">તારીખ: {sabha.date} ({sabha.dayOfWeek || 'રવિવાર'})</span>
                  <span>•</span>
                  <span className="font-chirp font-semibold">સમય: {sabha.time}</span>
                  <span>•</span>
                  <span className="font-semibold text-red-800">સ્થળ: {sabha.venue}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-white rounded-xl border border-stone-200">
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">મુખ્ય વક્તા:</span>
                  <span className="font-bold text-stone-900">{sabha.conductedBy.name}</span>
                  <span className="text-[11px] text-stone-500 block">{sabha.conductedBy.title} ({sabha.conductedBy.ashramOrCity})</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">સભા યુનિફોર્મ (ડ્રેસકોડ):</span>
                  <span className="font-bold text-red-900">{sabha.uniform || 'પરંપરાગત સાડી પરિધાન'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">સભા વિષય / રહસ્ય:</span>
                  <span className="font-semibold text-stone-800">{sabha.topic}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">કીર્તન ભક્તિ:</span>
                  <span className="font-semibold text-stone-800">{sabha.kirtanBhakti}</span>
                </div>
              </div>

              {/* Prasad details */}
              <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200">
                <span className="text-[10px] font-bold text-amber-900 uppercase block">સભા મહાપ્રસાદ વિગત:</span>
                {sabha.prasadDonorName ? (
                  <div className="mt-1 space-y-1">
                    <p className="font-bold text-red-950">
                      પ્રસાદ અર્પણ દાતાશ્રી: {sabha.prasadDonorName} {memberNumber ? `(સભ્ય નં: #${memberNumber})` : ''}
                    </p>
                    {sabha.prasadDonorAmount && (
                      <p className="text-xs text-amber-900 font-bold font-chirp">
                        સેવા રકમ: ₹{sabha.prasadDonorAmount.toLocaleString('en-IN')}/- ({amountToGujaratiWords(sabha.prasadDonorAmount)})
                      </p>
                    )}
                    <p className="text-xs text-stone-700">
                      વાનગીઓ: {sabha.prasadMenu?.join(', ') || 'સાત્વિક પ્રસાદ'}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-stone-800 mt-1 font-medium">
                    વાનગીઓ: {sabha.prasadMenu?.join(', ') || 'શુદ્ધ સાત્વિક પ્રસાદ વ્યવસ્થા'}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Official Verification Seal & Footer */}
          <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-stone-500 text-[11px]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>આ સત્તાવાર ડિજિટલ દસ્તાવેજ છે • કોઈ ભૌતિક સહીની જરૂર નથી.</span>
            </div>
            <div className="text-right font-semibold text-stone-700">
              શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય કાર્યાલય
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
