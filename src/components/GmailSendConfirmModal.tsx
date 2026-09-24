import { Mail, AlertTriangle, Send, X, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSend: () => void;
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  body: string;
  isSending: boolean;
}

export default function GmailSendConfirmModal({
  isOpen,
  onClose,
  onConfirmSend,
  senderEmail,
  recipientEmail,
  subject,
  body,
  isSending
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs font-gujarati animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-amber-200 animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">Gmail મોકલવાની પુષ્ટિ (Confirmation)</h3>
              <p className="text-xs text-amber-100">ઈમેઈલ મોકલતા પહેલા કૃપા કરીને વિગતો ચકાસો</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSending}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-sm text-stone-700">
          {/* Official Permission Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong>પરવાનગી સાથે ઈમેઈલ પ્રેષણ:</strong> આ ક્રિયા આપના અધિકૃત Google એકાઉન્ટ (Gmail API) દ્વારા નીચે દર્શાવેલ પ્રાપ્તકર્તાને સત્તાવાર ઈમેઈલ મોકલશે.
            </div>
          </div>

          {/* Email Details summary card */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2.5">
            <div className="grid grid-cols-3 gap-1">
              <span className="text-xs font-semibold text-stone-500">મોકલનાર (From):</span>
              <span className="col-span-2 text-xs font-medium text-stone-800 font-chirp truncate" title={senderEmail}>
                {senderEmail}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1 border-t border-stone-200 pt-2">
              <span className="text-xs font-semibold text-stone-500">પ્રાપ્તકર્તા (To):</span>
              <span className="col-span-2 text-xs font-bold text-amber-900 font-chirp truncate" title={recipientEmail}>
                {recipientEmail}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1 border-t border-stone-200 pt-2">
              <span className="text-xs font-semibold text-stone-500">વિષય (Subject):</span>
              <span className="col-span-2 text-xs font-semibold text-stone-900">
                {subject}
              </span>
            </div>
          </div>

          {/* Email Body Preview */}
          <div>
            <span className="text-xs font-semibold text-stone-600 mb-1.5 block">ઈમેઈલ સંદેશ પ્રિવ્યુ:</span>
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 max-h-48 overflow-y-auto text-xs text-stone-700 font-mono whitespace-pre-wrap leading-relaxed">
              {body}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800 bg-white border border-stone-300 rounded-xl hover:bg-stone-100 cursor-pointer disabled:opacity-50"
          >
            રદ કરો (Cancel)
          </button>
          <button
            type="button"
            onClick={onConfirmSend}
            disabled={isSending}
            className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>મોકલાઈ રહ્યું છે...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>હા, Gmail મોકલો (Confirm Send)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
