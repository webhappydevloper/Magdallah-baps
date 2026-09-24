import { DonationRecord, MahilaMember } from '../types';
import { X, Printer, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';
import { useThakorjiImage } from '../utils/imageStore';

interface Props {
  donation: DonationRecord;
  member?: MahilaMember;
  onClose: () => void;
  onOpenGmail?: () => void;
}

export default function DonationReceiptModal({ donation, member, onClose, onOpenGmail }: Props) {
  const [thakorjiImg] = useThakorjiImage();
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto font-gujarati">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-amber-200 overflow-hidden my-6">
        {/* Header toolbar */}
        <div className="flex items-center justify-between px-6 py-4 bg-amber-50 border-b border-amber-200 no-print">
          <div className="flex items-center gap-2 text-amber-900 font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>દાન પાવતી / સત્તાવાર રસીદ (Official Receipt)</span>
          </div>
          <div className="flex items-center gap-2.5">
            {onOpenGmail && (
              <button
                onClick={onOpenGmail}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-xs"
                title="Gmail માં રસીદ વિગતો જુઓ અને મોકલો"
              >
                <Mail className="w-4 h-4 text-amber-700" />
                <span>Gmail રસીદ</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>પ્રિન્ટ / PDF સાચવો</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-amber-100/60 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-8 bg-amber-50/20 text-stone-800">
          <div className="border-4 border-double border-amber-600/60 rounded-xl p-6 bg-white shadow-xs">
            {/* Top Emblem & Header */}
            <div className="text-center border-b-2 border-amber-200 pb-4 mb-5">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 mb-2 border-2 border-amber-300 shadow-xs p-0.5 overflow-hidden ring-2 ring-amber-400/30">
                <img 
                  src={thakorjiImg || "/swaminarayan-logo.png"} 
                  alt="શ્રી સ્વામિનારાયણ ભગવાન" 
                  className="w-full h-full object-cover rounded-full" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <h2 className="text-2xl font-bold text-amber-900 tracking-tight">
                શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય મંડળ
              </h2>
              <p className="text-xs text-amber-800 font-medium mt-1">
                સર્વ મહિલા સત્સંગ & સેવા કેન્દ્ર • રજિ. ચેરિટેબલ ટ્રસ્ટ
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                હેડ ઓફિસ: શ્રી સ્વામિનારાયણ મંદિર પરિસર, ગુજરાત • સંપર્ક: info@swaminarayanmahila.org
              </p>
            </div>

            {/* Receipt Meta */}
            <div className="flex flex-wrap justify-between items-center bg-amber-50/60 rounded-lg p-3 border border-amber-200/70 mb-5 text-sm">
              <div>
                <span className="text-stone-500">રસીદ નંબર: </span>
                <span className="font-bold text-amber-900 font-chirp">{donation.receiptNo}</span>
              </div>
              <div>
                <span className="text-stone-500">તારીખ: </span>
                <span className="font-semibold text-stone-800 font-chirp">{donation.date}</span>
                <span className="text-stone-500 ml-2">સમય: {donation.time}</span>
              </div>
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" /> અધિકૃત પ્રમાણિત
                </span>
              </div>
            </div>

            {/* Donor & Amount Details */}
            <div className="space-y-3.5 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-stone-100 pb-2">
                <span className="text-stone-500">દાતા / પરિવાર નું નામ:</span>
                <span className="md:col-span-2 font-bold text-stone-900 text-base">
                  {donation.donorName}
                </span>
              </div>

              {member && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-stone-100 pb-2">
                  <span className="text-stone-500">રહેઠાણ / સરનામું:</span>
                  <span className="md:col-span-2 text-stone-700">
                    {member.address}, {member.city} ({member.pincode})
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-stone-100 pb-2">
                <span className="text-stone-500">દાનનો હેતુ / કેટેગરી:</span>
                <span className="md:col-span-2 font-semibold text-amber-800">
                  {donation.category}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-stone-100 pb-2">
                <span className="text-stone-500">ચૂકવણી પદ્ધતિ (Mode):</span>
                <span className="md:col-span-2 text-stone-700">
                  {donation.paymentMode} {donation.transactionRef && <span className="text-stone-500 font-chirp text-xs">({donation.transactionRef})</span>}
                </span>
              </div>

              {donation.purposeNote && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-stone-100 pb-2">
                  <span className="text-stone-500">સંકલ્પ / વિશેષ નોંધ:</span>
                  <span className="md:col-span-2 text-stone-600 italic">
                    "{donation.purposeNote}"
                  </span>
                </div>
              )}

              {/* Amount Box */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white flex justify-between items-center shadow-xs">
                <div>
                  <div className="text-xs uppercase tracking-wider text-amber-100 font-medium">
                    દાનમાં પ્રાપ્ત કુલ રકમ (Total Amount Received)
                  </div>
                  <div className="text-xs text-amber-100 mt-0.5">
                    શ્રીહરિના ચરણોમાં અર્પણ
                  </div>
                </div>
                <div className="text-3xl font-extrabold font-chirp tracking-tight">
                  ₹{donation.amount.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Sacred blessings footer */}
            <div className="mt-6 pt-4 border-t border-dashed border-amber-300 text-center">
              <p className="text-sm font-serif-gujarati text-amber-900 font-semibold italic">
                "શ્રી સ્વામિનારાયણ ભગવાન આપના તથા આપના પરિવાર પર સદા અખંડ કૃપા વરસાવે અને આધ્યાત્મિક ઉત્કર્ષ કરે."
              </p>
              
              <div className="flex justify-between items-end mt-8 text-xs text-stone-500">
                <div className="text-left">
                  <p className="font-chirp text-[11px] text-stone-400">Computer Generated Receipt</p>
                  <p>સ્વામિનારાયણ મહિલા સંપ્રદાય પોર્ટલ</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-12 border-b border-stone-400 mx-auto mb-1 flex items-end justify-center pb-1 text-stone-400 italic text-[11px]">
                    (મહોર / સહી)
                  </div>
                  <p className="font-medium text-stone-700">ખજાનચી / પ્રમુખશ્રી</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex justify-end gap-3 no-print">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            બંધ કરો
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-xs inline-flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>રસીદ પ્રિન્ટ કરો</span>
          </button>
        </div>
      </div>
    </div>
  );
}
