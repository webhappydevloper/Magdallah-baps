import { useState, useRef } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  HardDrive, 
  X, 
  ShieldCheck, 
  FileJson,
  Layers,
  Clock
} from 'lucide-react';
import { 
  MahilaMember, 
  DonationRecord, 
  JamanwarPlan, 
  SabhaEvent, 
  EmailNotification 
} from '../types';
import { generateFullBackup, resetDatabase, AppCompleteBackup } from '../utils/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  members: MahilaMember[];
  currentMemberId: string;
  donations: DonationRecord[];
  jamanwars: JamanwarPlan[];
  sabhas: SabhaEvent[];
  notifications: EmailNotification[];
  onRestoreData: (backup: AppCompleteBackup) => void;
  onResetToDefaults: () => void;
  lastSavedTime: string | null;
}

export default function BackupRestoreModal({
  isOpen,
  onClose,
  members,
  currentMemberId,
  donations,
  jamanwars,
  sabhas,
  notifications,
  onRestoreData,
  onResetToDefaults,
  lastSavedTime
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  // Handle Export / Download
  const handleDownloadBackup = async () => {
    try {
      setIsExporting(true);
      const jsonContent = await generateFullBackup({
        members,
        currentMemberId,
        donations,
        jamanwars,
        sabhas,
        notifications
      });

      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `swaminarayan_mahila_portal_backup_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setImportSuccess('બેકઅપ ફાઈલ (.json) સફળતાપૂર્વક ડાઉનલોડ થઈ ગઈ છે!');
      setTimeout(() => setImportSuccess(null), 4000);
    } catch (err) {
      console.error(err);
      setImportError('બેકઅપ બનાવવામાં ભૂલ આવી.');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Import / Restore from file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text) as AppCompleteBackup;

        // Validation of backup shape
        if (!parsed.members || !Array.isArray(parsed.members) || !parsed.donations) {
          throw new Error('માન્ય બેકઅપ ફાઈલ નથી.');
        }

        onRestoreData(parsed);
        setImportSuccess(`ડેટા સફળતાપૂર્વક પુનઃસ્થાપિત થયો! (${parsed.members.length} સભ્યો, ${parsed.donations.length} દાન રસીદો)`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setTimeout(() => {
          setImportSuccess(null);
          onClose();
        }, 2500);
      } catch (err) {
        console.error(err);
        setImportError('અમાન્ય ફાઈલ! કૃપા કરીને પોર્ટલ દ્વારા એક્સપોર્ટ કરેલી .json ફાઈલ જ અપલોડ કરો.');
      }
    };
    reader.readAsText(file);
  };

  // Trigger file dialog
  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-gujarati animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-amber-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-emerald-200 border border-white/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold font-chirp text-emerald-100 mb-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-300" /> કાયમી IndexedDB ડેટાબેઝ સુરક્ષા
              </div>
              <h3 className="text-lg sm:text-xl font-black font-serif-gujarati">
                ડેટાબેઝ & બેકઅપ સંચાલન
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-stone-800 text-xs sm:text-sm">
          
          {/* Permanent Storage Assurance Card */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>પેજ રિફ્રેશ કે રી-ઓપન કરવાથી ડેટા ક્યારેય નષ્ટ નહીં થાય!</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed font-medium">
              આ પોર્ટલ બ્રાઉઝરની હાઈ-કેપેસિટી <strong>IndexedDB ટ્રાન્ઝેક્શનલ ડેટાબેઝ એન્જિન</strong> સાથે જોડાયેલું છે. આમાં <strong>5 MB ની લિમિટ નથી</strong> (અનલિમિટેડ ડેટા સુરક્ષિત રહી શકે છે). તમે પેજ રિફ્રેશ કરો, બ્રાઉઝર બંધ કરો કે થોડા દિવસ પછી ખોલો - તમારો સમગ્ર ડેટા જેમનો તેમ સાચવેલો જ રહેશે.
            </p>
            {lastSavedTime && (
              <div className="pt-2 border-t border-emerald-200/60 flex items-center gap-1.5 text-[11px] text-emerald-700 font-chirp font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>છેલ્લે ડેટાબેઝમાં સ્વયં સાચવ્યા સમય: {new Date(lastSavedTime).toLocaleString('gu-IN')}</span>
              </div>
            )}
          </div>

          {/* Current Live Records Count */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block">
              હાલ ડેટાબેઝમાં સાચવેલ લાઈવ રેકોર્ડ્સ:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="text-[11px] text-stone-500 font-medium">કુલ સભ્યો</div>
                <div className="text-lg font-black text-stone-900 font-chirp">{members.length}</div>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="text-[11px] text-stone-500 font-medium">દાન પાવતીઓ</div>
                <div className="text-lg font-black text-amber-700 font-chirp">{donations.length}</div>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="text-[11px] text-stone-500 font-medium">જમણવાર આયોજન</div>
                <div className="text-lg font-black text-rose-700 font-chirp">{jamanwars.length}</div>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="text-[11px] text-stone-500 font-medium">મહિલા સભાઓ</div>
                <div className="text-lg font-black text-emerald-700 font-chirp">{sabhas.length}</div>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 col-span-2 sm:col-span-2">
                <div className="text-[11px] text-stone-500 font-medium">Gmail નોટિફિકેશન લોગ્સ</div>
                <div className="text-lg font-black text-indigo-700 font-chirp">{notifications.length}</div>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {importSuccess && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{importSuccess}</span>
            </div>
          )}

          {importError && (
            <div className="p-3 bg-rose-100 border border-rose-300 text-rose-900 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          {/* Export & Import Action Buttons */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block">
              ઓફલાઇન બેકઅપ & પુનઃસ્થાપિત વિકલ્પો:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. Download Backup */}
              <button
                type="button"
                onClick={handleDownloadBackup}
                disabled={isExporting}
                className="p-4 rounded-2xl border border-amber-300 bg-amber-50 hover:bg-amber-100/90 text-left transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <FileJson className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <div className="font-extrabold text-stone-900 text-sm">
                    આખું બેકઅપ ડાઉનલોડ કરો
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    તમામ ડેટા એક ક્લિકમાં .json ફાઈલ તરીકે કોમ્પ્યુટરમાં સેવ થશે.
                  </div>
                </div>
              </button>

              {/* 2. Upload / Restore Backup */}
              <button
                type="button"
                onClick={handleTriggerUpload}
                className="p-4 rounded-2xl border border-teal-300 bg-teal-50 hover:bg-teal-100/90 text-left transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <HardDrive className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <div className="font-extrabold text-stone-900 text-sm">
                    બેકઅપ ફાઈલ રીસ્ટોર કરો
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    પહેલા સેવ કરેલી .json ફાઈલ અપલોડ કરી ડેટા પાછો લાવો.
                  </div>
                </div>
              </button>
            </div>

            {/* Hidden Input for file selection */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".json,application/json" 
              className="hidden" 
            />
          </div>

          {/* Reset Database section */}
          <div className="pt-3 border-t border-stone-200">
            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="text-[11px] text-stone-500 hover:text-rose-700 underline font-medium cursor-pointer"
              >
                ડેટાબેઝ રીસેટ કરી સેમ્પલ ડેટા પર જવું છે?
              </button>
            ) : (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2 animate-in fade-in">
                <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>શું તમે ખરેખર મૂળ સેમ્પલ ડેટા રીસેટ કરવા માંગો છો?</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await resetDatabase();
                      onResetToDefaults();
                      setShowResetConfirm(false);
                      onClose();
                    }}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    હા, રીસેટ કરો
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1 bg-stone-200 text-stone-700 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    રદ કરો
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            બંધ કરો
          </button>
        </div>

      </div>
    </div>
  );
}
