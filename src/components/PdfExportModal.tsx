import { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  MapPin, 
  QrCode, 
  FileText,
  UserCheck,
  UtensilsCrossed,
  HeartHandshake
} from 'lucide-react';
import { 
  MahilaMember, 
  DonationRecord, 
  JamanwarPlan, 
  SabhaEvent 
} from '../types';
import { exportElementToPdf } from '../utils/pdfExporter';
import { openGmailSafely } from '../utils/gmailHelper';
import { printElement } from '../utils/printHelper';
import { amountToGujaratiWords } from '../utils/numberToGujaratiWords';
import { 
  buildDonationEmailContent, 
  buildJamanwarEmailContent, 
  buildMemberCardEmailContent, 
  buildSabhaEmailContent 
} from '../utils/emailDocumentFormatter';

export type PdfDocType = 'donation_invoice' | 'jamanwar_bill' | 'member_card' | 'sabha_patrika';

interface Props {
  docType: PdfDocType;
  donation?: DonationRecord;
  member?: MahilaMember;
  jamanwar?: JamanwarPlan;
  sabha?: SabhaEvent;
  onClose: () => void;
  onShowToast?: (title: string, desc: string) => void;
}

export default function PdfExportModal({
  docType,
  donation,
  member,
  jamanwar,
  sabha,
  onClose,
  onShowToast
}: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);

  // Generate appropriate file name with Member Number first
  const getFileName = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const memNum = member?.memberNumber;
    const memPrefix = memNum ? `Mem-${memNum}_` : '';

    switch (docType) {
      case 'donation_invoice':
        return `${memPrefix}Donation_Invoice_${donation?.receiptNo || 'RCP'}_${timestamp}.pdf`;
      case 'jamanwar_bill':
        return `${memPrefix}Jamanwar_Bill_${jamanwar?.id || 'JMN'}_${timestamp}.pdf`;
      case 'member_card':
        return `Member_Account_Card_${memNum || member?.id || 'MEM'}_${member?.firstName || ''}_${timestamp}.pdf`;
      case 'sabha_patrika':
        return `${memPrefix}Sabha_Patrika_${sabha?.id || 'SBH'}_${timestamp}.pdf`;
      default:
        return `${memPrefix}Official_Document_${timestamp}.pdf`;
    }
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsExporting(true);
    try {
      await exportElementToPdf(printRef.current, getFileName(), 'p');
      if (onShowToast) {
        onShowToast('PDF ડાઉનલોડ સફળ!', `${getFileName()} આપના ઉપકરણમાં સફળતાપૂર્વક સાચવવામાં આવી છે.`);
      }
    } catch (err) {
      console.error('PDF Export error:', err);
      alert('PDF બનાવવામાં ખામી આવી. કૃપા કરીને પ્રિન્ટ વિકલ્પનો ઉપયોગ કરો.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      printElement(printRef.current, getFileName());
    } else {
      window.print();
    }
  };

  const handleSendViaGmail = async () => {
    let subject = 'શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય સત્તાવાર દસ્તાવેજ';
    let body = '';
    const recipient = member?.email || 'bhaktidevani81@gmail.com';

    if (docType === 'donation_invoice' && donation) {
      const res = buildDonationEmailContent(donation, member);
      subject = res.subject;
      body = res.body;
    } else if (docType === 'jamanwar_bill' && jamanwar) {
      const res = buildJamanwarEmailContent(jamanwar, member);
      subject = res.subject;
      body = res.body;
    } else if (docType === 'member_card' && member) {
      const res = buildMemberCardEmailContent(member);
      subject = res.subject;
      body = res.body;
    } else if (docType === 'sabha_patrika' && sabha) {
      const res = buildSabhaEmailContent(sabha, member);
      subject = res.subject;
      body = res.body;
    }

    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 5000);

    // Open Gmail safely with full digital document directly embedded into the email body
    await openGmailSafely(recipient, subject, body, (msg: string) => {
      if (onShowToast) {
        onShowToast('સંપૂર્ણ બિલ લખાણ સાથે Gmail માં મોકલાયું!', msg);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto font-gujarati animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-amber-300 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        
        {/* Top Control Bar (No Print) */}
        <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-gradient-to-r from-amber-700 via-rose-800 to-amber-900 text-white shadow-md border-b border-amber-500/30 no-print shrink-0 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-amber-200">
              {docType === 'donation_invoice' && <HeartHandshake className="w-4 h-4" />}
              {docType === 'jamanwar_bill' && <UtensilsCrossed className="w-4 h-4" />}
              {docType === 'member_card' && <UserCheck className="w-4 h-4" />}
              {docType === 'sabha_patrika' && <Calendar className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold tracking-tight font-serif-gujarati">
                {docType === 'donation_invoice' && 'દાન પાવતી & ઇનવોઇસ બિલ (PDF)'}
                {docType === 'jamanwar_bill' && 'જમણવાર & મહાપ્રસાદ ઇનવોઇસ બિલ (PDF)'}
                {docType === 'member_card' && 'મહિલા સભ્ય ઓળખ & એકાઉન્ટ કાર્ડ (PDF)'}
                {docType === 'sabha_patrika' && 'મહિલા સત્સંગ સભા આમંત્રણ પત્રિકા (PDF)'}
              </h3>
              <p className="text-[11px] text-amber-100/90 font-chirp">
                સત્તાવાર દસ્તાવેજ • High-Resolution Retina Export
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-stone-900 hover:bg-amber-100 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-amber-700" />
              <span>{isExporting ? 'PDF બને છે...' : 'PDF ડાઉનલોડ'}</span>
            </button>

            <button
              onClick={handleSendViaGmail}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="PDF ડાઉનલોડ થશે અને સીધું Gmail ખુલી જશે જ્યાં આપ PDF જોડી શકો છો"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Gmail માં મોકલો</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>પ્રિન્ટ</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Informative Banner when sending to Gmail */}
        {copiedNotice && (
          <div className="bg-emerald-50 px-5 py-2.5 border-b border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between no-print shrink-0 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>PDF સાચવવામાં આવી રહી છે & સંપૂર્ણ લખાણ ક્લિપબોર્ડમાં કોપી થયેલ છે.</strong> Gmail માં કોઈ (400/404) error આવશે નહિ!
              </span>
            </div>
            <span className="text-[10px] bg-emerald-200/60 px-2 py-0.5 rounded text-emerald-950 font-chirp">
              Safe Gmail Gateway
            </span>
          </div>
        )}

        {/* Scrollable Printable Document Container */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-stone-100/70 flex-1 flex justify-center items-start">
          <div 
            ref={printRef}
            id="pdf-document-render"
            className="w-full max-w-3xl bg-white text-stone-900 p-8 sm:p-10 rounded-2xl shadow-xl border-4 border-double border-amber-600/70 relative"
            style={{ minHeight: '850px' }}
          >
            {/* Watermark Logo Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] overflow-hidden">
              <img src="/baps-logo.png" alt="" className="w-[450px] h-[450px] object-contain" />
            </div>

            {/* Official Header with Logo and Trust Info */}
            <div className="text-center border-b-2 border-amber-300 pb-5 mb-6 relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-2 border-2 border-amber-400 shadow-md p-1">
                <img 
                  src="/baps-logo.png" 
                  alt="BAPS Swaminarayan Sanstha" 
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-tight font-serif-gujarati">
                શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય
              </h1>
              <p className="text-xs sm:text-sm font-bold text-amber-800 mt-1">
                સર્વ મહિલા સત્સંગ, જમણવાર અને સેવા ટ્રસ્ટ • રજિસ્ટર્ડ ચેરિટેબલ સંસ્થા
              </p>
              <p className="text-[11px] text-stone-500 font-chirp mt-0.5">
                હેડ ઓફિસ: શ્રી સ્વામિનારાયણ મંદિર સંકુલ, ગુજરાત • સત્તાવાર મેલ: bhaktanisamparadayofficial@gmail.com
              </p>

              {/* Document Banner */}
              <div className="mt-3 inline-block px-5 py-1.5 bg-gradient-to-r from-amber-600 to-rose-700 text-white rounded-full text-xs sm:text-sm font-extrabold shadow-sm tracking-wide font-serif-gujarati">
                {docType === 'donation_invoice' && 'સત્તાવાર સેવા ભંડોળ દાન પાવતી & ઇનવોઇસ (Official Invoice)'}
                {docType === 'jamanwar_bill' && 'જમણવાર & મહાપ્રસાદ આયોજન ઇનવોઇસ બિલ (Event Bill)'}
                {docType === 'member_card' && 'અધિકૃત મહિલા સત્સંગી સભ્ય ઓળખ & એકાઉન્ટ કાર્ડ (Member Card)'}
                {docType === 'sabha_patrika' && 'વિશેષ મહિલા સત્સંગ સભા આમંત્રણ પત્રિકા (Official Sabha Patrika)'}
              </div>
            </div>

            {/* Prominent Member Number / Register Badge - ALWAYS FIRST IN PDF */}
            <div className="mb-5 p-3 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/70 rounded-2xl border-2 border-amber-400/90 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                  સત્તાવાર સભ્ય / રજિસ્ટ્રેશન:
                </span>
                {member?.memberNumber ? (
                  <span className="px-3.5 py-1 bg-amber-800 text-white rounded-xl font-black font-chirp text-sm sm:text-base tracking-wide shadow-xs flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-amber-200" />
                    <span>સભ્ય નંબર: #{member.memberNumber}</span>
                  </span>
                ) : (
                  <span className="px-3.5 py-1 bg-amber-800 text-white rounded-xl font-black text-xs sm:text-sm shadow-xs flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-amber-200" />
                    <span>નોંધણી નામ: {member ? `${member.firstName} ${member.surname}` : (donation?.donorName || jamanwar?.hostName || sabha?.prasadDonorName || 'શ્રી સ્વામિનારાયણ સત્સંગી')}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500 font-medium">નામ:</span>
                <strong className="text-stone-900 font-extrabold">
                  {member ? `${member.firstName} ${member.surname}` : (donation?.donorName || jamanwar?.hostName || sabha?.prasadDonorName || '-')}
                </strong>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-full font-bold text-[10px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> સંપ્રદાય રેકોર્ડ
                </span>
              </div>
            </div>

            {/* ========================================================= */}
            {/* TYPE 1: DONATION INVOICE / BILL                          */}
            {/* ========================================================= */}
            {docType === 'donation_invoice' && donation && (
              <div className="space-y-5 text-xs sm:text-sm">
                {/* Meta Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-amber-50/80 rounded-xl border border-amber-200">
                  <div>
                    <span className="text-stone-500 block text-[11px] font-semibold">ઇનવોઇસ / રસીદ નં:</span>
                    <strong className="text-amber-950 font-chirp text-sm sm:text-base font-black">
                      {donation.receiptNo}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px] font-semibold">તારીખ & સમય:</span>
                    <strong className="text-stone-800 font-chirp">
                      {donation.date} • {donation.time}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px] font-semibold">ચૂકવણી મોડ:</span>
                    <strong className="text-emerald-800">
                      {donation.paymentMode} {donation.transactionRef && `(${donation.transactionRef})`}
                    </strong>
                  </div>
                </div>

                {/* Donor Information */}
                <div className="border border-stone-200 rounded-xl p-4 space-y-2.5 bg-white">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider border-b border-stone-100 pb-1.5 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>દાતાશ્રી તથા પારિવારિક વિગત:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-stone-500 text-[11px] block">દાતાનું નામ:</span>
                      <span className="text-base font-extrabold text-stone-900">{donation.donorName}</span>
                    </div>
                    {member && (
                      <div>
                        <span className="text-stone-500 text-[11px] block">સભ્ય નંબર / સંપર્ક:</span>
                        <span className="font-chirp font-bold text-amber-900">
                          #{member.memberNumber || member.id} • {member.phone}
                        </span>
                      </div>
                    )}
                    {member?.address && (
                      <div className="sm:col-span-2">
                        <span className="text-stone-500 text-[11px] block">રહેઠાણ / સરનામું:</span>
                        <span className="text-stone-700">{member.address}, {member.city} ({member.pincode})</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="border border-amber-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-amber-100/80 text-amber-950 font-bold border-b border-amber-200 text-xs">
                        <th className="p-3 w-12 text-center">ક્રમ</th>
                        <th className="p-3">સેવા હેતુ / વર્ણન (Description)</th>
                        <th className="p-3">કેટેગરી</th>
                        <th className="p-3 text-right">રકમ (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100 text-stone-800">
                      <tr>
                        <td className="p-3 text-center font-chirp font-semibold">1</td>
                        <td className="p-3">
                          <strong className="text-stone-900">{donation.category}</strong>
                          {donation.purposeNote && (
                            <div className="text-[11px] text-stone-500 italic mt-0.5">
                              "{donation.purposeNote}"
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-amber-900 font-semibold">{donation.category}</td>
                        <td className="p-3 text-right font-chirp font-black text-stone-900 text-sm">
                          ₹{donation.amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="bg-amber-50 font-bold text-stone-900 border-t-2 border-amber-300">
                        <td colSpan={3} className="p-3 text-right font-serif-gujarati">
                          કુલ અર્પણ રકમ (Total Amount):
                        </td>
                        <td className="p-3 text-right font-chirp text-lg font-black text-amber-950">
                          ₹{donation.amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Amount in Words */}
                <div className="p-3 bg-amber-50/50 rounded-xl border border-dashed border-amber-300 text-xs text-amber-950">
                  <span className="font-bold text-stone-600">શબ્દોમાં રકમ (In Words): </span>
                  <span className="font-extrabold text-amber-900">{amountToGujaratiWords(donation.amount)}</span>
                </div>

                {/* Verification Badge */}
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="font-bold">અધિકૃત સંસ્થાકીય પ્રમાણિત રસીદ</div>
                      <div className="text-[10px] text-emerald-700">Digital Audit Verification & Seva Ledger Confirmed</div>
                    </div>
                  </div>
                  <div className="font-chirp text-xs font-bold text-emerald-800">
                    TAX-EXEMPT SEVA TRUST
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TYPE 2: JAMANWAR MENU & MEAL BILL                        */}
            {/* ========================================================= */}
            {docType === 'jamanwar_bill' && jamanwar && (
              <div className="space-y-5 text-xs sm:text-sm">
                {/* Meta Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-rose-50/80 rounded-xl border border-rose-200">
                  <div>
                    <span className="text-stone-500 block text-[11px] font-semibold">બુકિંગ / ઇનવોઇસ આઈડી:</span>
                    <strong className="text-rose-950 font-chirp text-sm sm:text-base font-black">
                      #{jamanwar.id}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px] font-semibold">તારીખ & ભોજન સમય:</span>
                    <strong className="text-stone-800 font-chirp">
                      {jamanwar.date} • {jamanwar.time}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px] font-semibold">સ્થળ / હોલ:</span>
                    <strong className="text-amber-900">{jamanwar.locationHall}</strong>
                  </div>
                </div>

                {/* Host Details */}
                <div className="border border-stone-200 rounded-xl p-4 bg-white space-y-2">
                  <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider border-b border-stone-100 pb-1.5 flex items-center gap-1.5">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-rose-700" />
                    <span>યજમાન & આયોજન વિગત:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-stone-500 text-[11px] block">યજમાન બહેન:</span>
                      <strong className="text-base text-stone-900">{jamanwar.hostName}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[11px] block">પ્રસંગ / નિમિત્ત:</span>
                      <span className="text-rose-900 font-bold">{jamanwar.occasion}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[11px] block">અંદાજિત હરિભક્તો:</span>
                      <strong className="text-stone-800 font-chirp text-sm">{jamanwar.approxGuests} બહેનો</strong>
                    </div>
                  </div>
                </div>

                {/* Itemized Menu Matrix */}
                <div className="border border-amber-200 rounded-xl p-4 bg-amber-50/40 space-y-3">
                  <h4 className="text-xs font-extrabold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-700" />
                    <span>મહાપ્રસાદ મેનુ વાનગીઓનું સત્તાવાર બિલિંગ લિસ્ટ:</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {jamanwar.menu.map((menuCat, i) => (
                      <div key={i} className="p-2.5 bg-white rounded-lg border border-amber-200 shadow-2xs">
                        <span className="text-xs font-black text-amber-900 uppercase tracking-wider block mb-1">
                          • {menuCat.category}:
                        </span>
                        <div className="text-stone-800 font-medium leading-relaxed pl-2">
                          {menuCat.items.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-amber-200 text-xs">
                    <div>
                      <span className="text-stone-500">રસોઈયા / સેવા ટીમ: </span>
                      <strong className="text-stone-900">{jamanwar.rasoiyaTeam}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500">સંચાલિકા / ઇન્ચાર્જ બહેન: </span>
                      <strong className="text-stone-900">{jamanwar.inchargeSister}</strong>
                    </div>
                  </div>
                </div>

                {/* Amount Total */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-rose-700 to-amber-700 text-white flex justify-between items-center shadow-xs">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-rose-100 font-semibold">
                      જમણવાર કુલ સેવા રકમ (Total Sponsorship Amount)
                    </div>
                    <div className="text-[11px] text-rose-200 mt-0.5">
                      {amountToGujaratiWords(jamanwar.amount)}
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-chirp">
                    ₹{jamanwar.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TYPE 3: MEMBER ACCOUNT CARD                              */}
            {/* ========================================================= */}
            {docType === 'member_card' && member && (
              <div className="space-y-6 text-xs sm:text-sm">
                {/* Prestigious Member Card Header Box */}
                <div className="bg-gradient-to-r from-amber-700 via-rose-800 to-amber-900 text-white p-5 rounded-2xl shadow-md border border-amber-400 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-950 font-black text-2xl flex items-center justify-center shadow-md border-2 border-amber-300 shrink-0">
                      {member.firstName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-amber-200 font-bold">
                        મહિલા સત્સંગી ઓળખ & ખાતા કાર્ડ
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black font-serif-gujarati">
                        {member.surname} {member.firstName} {member.fatherName || member.husbandName}
                      </h3>
                      <div className="text-xs text-amber-100 mt-0.5">
                        હોદ્દો: <strong>{member.mandalRole || 'હરિભક્ત બહેન'}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-center sm:text-right bg-black/20 p-3 rounded-xl border border-white/20 shrink-0">
                    <div className="text-[10px] text-amber-200 uppercase font-bold tracking-wider">
                      ૬ આંકડાનો સભ્ય નંબર
                    </div>
                    <div className="text-2xl sm:text-3xl font-black font-chirp text-amber-300 tracking-wider">
                      #{member.memberNumber || member.id}
                    </div>
                  </div>
                </div>

                {/* Member Primary Particulars */}
                <div className="border border-stone-200 rounded-xl p-5 bg-white space-y-4">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider border-b border-stone-100 pb-2">
                    વ્યક્તિગત અને પારિવારિક સંપૂર્ણ વિગતો:
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                      <span className="text-stone-500 block text-[10px]">ઉંમર & જન્મ તારીખ:</span>
                      <strong className="text-stone-900">{member.age} વર્ષ {member.dob && `(${member.dob})`}</strong>
                    </div>
                    <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                      <span className="text-stone-500 block text-[10px]">મોબાઈલ નંબર:</span>
                      <strong className="text-stone-900 font-chirp">{member.phone}</strong>
                    </div>
                    <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                      <span className="text-stone-500 block text-[10px]">ઈમેઈલ એડ્રેસ:</span>
                      <strong className="text-stone-900 font-chirp text-[11px] truncate block">{member.email || 'N/A'}</strong>
                    </div>
                    <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                      <span className="text-stone-500 block text-[10px]">જોડાયા તારીખ:</span>
                      <strong className="text-stone-900 font-chirp">{member.joinDate}</strong>
                    </div>

                    <div className="col-span-2 sm:col-span-4 p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                      <span className="text-stone-500 block text-[10px]">કાયમી રહેઠાણ / સરનામું:</span>
                      <strong className="text-stone-900">
                        {member.address}, {member.city}, જિલ્લો: {member.district} - {member.pincode}
                      </strong>
                    </div>

                    <div className="col-span-2 p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                      <span className="text-stone-500 block text-[10px]">વ્યવસાય:</span>
                      <strong className="text-stone-900">{member.occupation || 'ગૃહિણી'}</strong>
                    </div>
                    <div className="col-span-2 p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                      <span className="text-stone-500 block text-[10px]">વાર્ષિક આવક:</span>
                      <strong className="text-stone-900">₹{member.annualIncome} ({member.incomeType})</strong>
                    </div>
                  </div>
                </div>

                {/* Linked Family Members Table */}
                {member.familyMembers && member.familyMembers.length > 0 && (
                  <div className="border border-amber-200 rounded-xl overflow-hidden bg-white">
                    <div className="bg-amber-100/70 p-2.5 text-xs font-bold text-amber-950 border-b border-amber-200">
                      નોંધાયેલ પરિવારના સભ્યો ({member.familyMembers.length}):
                    </div>
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                          <th className="p-2 text-center w-10">ક્રમ</th>
                          <th className="p-2">નામ</th>
                          <th className="p-2">સંબંધ</th>
                          <th className="p-2">ઉંમર</th>
                          <th className="p-2">વ્યવસાય</th>
                          <th className="p-2">મોબાઈલ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-stone-800">
                        {member.familyMembers.map((fam, idx) => (
                          <tr key={fam.id}>
                            <td className="p-2 text-center font-chirp">{idx + 1}</td>
                            <td className="p-2 font-bold text-stone-900">{fam.name}</td>
                            <td className="p-2 text-amber-900 font-semibold">{fam.relation}</td>
                            <td className="p-2 font-chirp">{fam.age} વર્ષ</td>
                            <td className="p-2 text-stone-600">{fam.occupation || '-'}</td>
                            <td className="p-2 font-chirp">{fam.phone || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* TYPE 4: SABHA PATRIKA                                     */}
            {/* ========================================================= */}
            {docType === 'sabha_patrika' && sabha && (
              <div className="space-y-5 text-xs sm:text-sm">
                <div className="p-4 bg-teal-50/80 rounded-xl border border-teal-200">
                  <span className="text-teal-800 font-bold block uppercase text-[11px]">સભા શીર્ષક:</span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-teal-950 font-serif-gujarati mt-0.5">
                    {sabha.title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 text-[11px] block">તારીખ & વાર:</span>
                    <strong className="text-stone-900 font-chirp">{sabha.date} ({sabha.dayOfWeek || 'સભા'})</strong>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 text-[11px] block">સમયગાળો:</span>
                    <strong className="text-stone-900 font-chirp">{sabha.time}</strong>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 text-[11px] block">મુખ્ય વક્તા:</span>
                    <strong className="text-amber-950">{sabha.conductedBy.name}</strong>
                    <div className="text-[11px] text-stone-500">{sabha.conductedBy.title}, {sabha.conductedBy.ashramOrCity}</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-500 text-[11px] block">સભા સ્થળ:</span>
                    <strong className="text-stone-900">{sabha.venue}</strong>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1.5">
                  <span className="text-amber-950 font-bold block text-xs">સભા વિષય / ગ્રંથ રહસ્ય:</span>
                  <p className="text-stone-800 font-medium leading-relaxed">{sabha.topic}</p>
                </div>

                {sabha.prasadDonorName && (
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                    <span className="text-rose-900 font-bold block text-xs">પ્રસાદ અર્પણ દાતા:</span>
                    <div className="text-stone-900 font-extrabold mt-0.5">
                      {sabha.prasadDonorName} {sabha.prasadDonorAmount ? `(સેવા રકમ: ₹${sabha.prasadDonorAmount.toLocaleString('en-IN')})` : ''}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Shared Sacred Blessing & Signatures Footer */}
            <div className="mt-8 pt-5 border-t border-dashed border-amber-400">
              <p className="text-center text-xs sm:text-sm font-serif-gujarati text-amber-900 font-semibold italic">
                "શ્રી સ્વામિનારાયણ ભગવાન આપના તથા આપના પરિવાર પર સદા અખંડ કૃપા વરસાવે અને આધ્યાત્મિક ઉત્કર્ષ કરે."
              </p>

              <div className="flex justify-between items-end mt-8 text-xs text-stone-600">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-stone-400 font-chirp text-[11px]">
                    <QrCode className="w-4 h-4 text-amber-700" />
                    <span>Digital Verified System Record</span>
                  </div>
                  <div className="text-[11px] text-stone-400">
                    તારીખ: {new Date().toLocaleDateString('gu-IN')} • સ્વામિનારાયણ સંપ્રદાય
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-32 h-10 border-b-2 border-stone-400 mx-auto flex items-center justify-center text-[10px] text-stone-400 italic">
                    (અધિકૃત મહોર & સહી)
                  </div>
                  <p className="font-bold text-stone-800 mt-1">પ્રમુખશ્રી / ખજાનચીશ્રી</p>
                  <p className="text-[10px] text-stone-500">શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Bottom Action Bar (No Print) */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 no-print shrink-0">
          <div className="text-xs text-stone-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>પ્રિન્ટ અને ઉચ્ચ ગુણવત્તાવાળી PDF ડાઉનલોડ ઉપલબ્ધ છે.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              બંધ કરો
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="px-5 py-2 bg-gradient-to-r from-amber-600 to-rose-700 hover:from-amber-700 hover:to-rose-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'PDF તૈયાર થાય છે...' : 'PDF ડાઉનલોડ કરો'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
