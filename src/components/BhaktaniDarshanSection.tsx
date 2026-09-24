import React, { useState } from 'react';
import {
  Sparkles,
  Eye,
  X,
  ZoomIn,
  Heart,
  Flower2,
  Award,
  Upload,
  Camera,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

interface DarshanItem {
  id: string;
  image: string;
  title: string;
  description: string;
}

const DARSHAN_IMAGES: DarshanItem[] = [
  {
    id: 'darshan-1338',
    image: '/IMG_1338.jpeg',
    title: 'અક્ષરપુરુષોત્તમ મહારાજ દિવ્ય સિંહાસન દર્શન',
    description: 'અક્ષરપુરુષોત્તમ મહારાજ, ગુણાતીતાનંદ સ્વામી અને ગોપાળાનંદ સ્વામીના અલૌકિક સુવર્ણ સિંહાસન દર્શન',
  },
  {
    id: 'darshan-1335',
    image: '/IMG_1335.jpeg',
    title: 'શ્રી સ્વામિનારાયણ ભગવાન દિવ્ય મુખારવિંદ',
    description: 'તિલક-ચાંદલો, મોગરા પુષ્પહાર અને સાક્ષાત કરુણામય દ્રષ્ટિથી યુક્ત દિવ્ય દર્શન',
  },
  {
    id: 'darshan-1336',
    image: '/IMG_1336.jpeg',
    title: 'શ્રી સ્વામિનારાયણ ભગવાન છત્ર-મુકુટ મુખારવિંદ',
    description: 'સુવર્ણ કંઠહાર, મોગરાના સુગંધિત પુષ્પહાર અને પવિત્ર દર્શન',
  },
  {
    id: 'darshan-1337',
    image: '/IMG_1337.jpeg',
    title: 'શ્રી સ્વામિનારાયણ ભગવાન પૂર્ણ સ્વરૂપ & ગુરુ પરંપરા',
    description: 'સુવર્ણ કલાત્મક સ્તંભો, શ્વેત વાઘા, મહાપ્રસાદ અને ગુરુવર્યોના દિવ્ય આશીર્વાદ',
  },
];

// List of Divine Personalities requested by user
const DIVINE_PERSONALITIES = [
  'સ્વામિનારાયણ ભગવાન',
  'અક્ષર પુરષોત્તમ મહારાજ',
  'યોગીજી મહારાજ',
  'પ્રમુખ સ્વામી મહારાજ',
  'મહંત સ્વામી મહારાજ',
  'મોહમ્મદઅલી સ્વામી મહારાજ',
  'જાવેદમિયા સ્વામી મહારાજ',
  'રહીમ સ્વામી મહારાજ',
];

// List of Speakers requested by user
const SPEAKERS = [
  'ભક્તિ બેન',
  'પદ્મિનીબા',
  'ઝંખનાબા',
  'કિન્નરીબા',
  'મિતલબા',
  'કલ્પનાબા',
  'હર્ષવિબા',
  'તૃપ્તિબા',
  'વંદનાબા',
  'તૃષ્ણાબેન',
];

// Resilient image processor that safely compresses when possible and never throws
function processUploadedImage(file: File): Promise<string> {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      const rawDataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!rawDataUrl) {
        try {
          resolve(URL.createObjectURL(file));
        } catch {
          resolve('');
        }
        return;
      }

      // Try to optimize via canvas, but never fail
      try {
        const img = new Image();
        let isResolved = false;

        const finalize = (finalUrl: string) => {
          if (!isResolved) {
            isResolved = true;
            resolve(finalUrl);
          }
        };

        // Safety timeout after 1.5s
        const timer = setTimeout(() => {
          finalize(rawDataUrl);
        }, 1500);

        img.onload = () => {
          clearTimeout(timer);
          try {
            let width = img.width || 800;
            let height = img.height || 1000;
            const maxWidth = 1200;
            const maxHeight = 1600;

            if (width > maxWidth || height > maxHeight) {
              if (width / height > maxWidth / maxHeight) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              } else {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              finalize(rawDataUrl);
              return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.85);
            finalize(compressed && compressed.length > 100 ? compressed : rawDataUrl);
          } catch {
            finalize(rawDataUrl);
          }
        };

        img.onerror = () => {
          clearTimeout(timer);
          // Fallback to raw data url if decoding in Image element fails
          finalize(rawDataUrl);
        };

        img.src = rawDataUrl;
      } catch {
        resolve(rawDataUrl);
      }
    };

    reader.onerror = () => {
      try {
        resolve(URL.createObjectURL(file));
      } catch {
        resolve('');
      }
    };

    reader.readAsDataURL(file);
  });
}

// Authentic Swaminarayan Tilak-Chandlo SVG component
export const SwaminarayanTilak: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => {
  return (
    <span className={`inline-flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size * 1.3 }}>
      <svg
        viewBox="0 0 40 52"
        width={size}
        height={size * 1.3}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_2px_4px_rgba(217,119,6,0.5)]"
      >
        <defs>
          <linearGradient id="tilakChandanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="30%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
          <radialGradient id="kumkumGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="40%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </radialGradient>
        </defs>
        {/* Yellow Chandan U-Shape Tilak */}
        <path
          d="M 10 4 L 10 32 C 10 44, 30 44, 30 32 L 30 4 L 23 4 L 23 30 C 23 37, 17 37, 17 30 L 17 4 Z"
          fill="url(#tilakChandanGrad)"
          stroke="#A16207"
          strokeWidth="1.2"
        />
        {/* Red Kumkum Chandlo (Dot) */}
        <circle cx="20" cy="24" r="5.5" fill="url(#kumkumGrad)" stroke="#7F1D1D" strokeWidth="0.8" />
        <circle cx="18.5" cy="22.5" r="1.5" fill="#FECACA" opacity="0.8" />
      </svg>
    </span>
  );
};

export const BhaktaniDarshanSection: React.FC = () => {
  const [selectedDarshan, setSelectedDarshan] = useState<DarshanItem | null>(null);
  const [pushpanjaliCount, setPushpanjaliCount] = useState<Record<string, number>>({});
  const [justOffered, setJustOffered] = useState<string | null>(null);

  // Manual custom images state persisted in localStorage
  const [customImages, setCustomImages] = useState<Record<string, string>>(() => {
    const saved: Record<string, string> = {};
    if (typeof window === 'undefined') return saved;
    try {
      DARSHAN_IMAGES.forEach((item) => {
        const data = localStorage.getItem(`bhaktani_custom_image_${item.id}`);
        if (data && data.length > 50) {
          saved[item.id] = data;
        }
      });
    } catch (e) {
      console.error('Error reading localStorage for custom images', e);
    }
    return saved;
  });

  const handleOfferPushpanjali = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPushpanjaliCount(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    setJustOffered(id);
    setTimeout(() => {
      setJustOffered(null);
    }, 1200);
  };

  const handleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await processUploadedImage(file);
      if (!dataUrl) return;

      setCustomImages(prev => ({
        ...prev,
        [id]: dataUrl,
      }));

      try {
        localStorage.setItem(`bhaktani_custom_image_${id}`, dataUrl);
      } catch (storageErr) {
        // Quota exceeded or private browsing limitation is handled gracefully
        console.warn('localStorage save skipped or quota reached:', storageErr);
      }
    } catch (err) {
      console.warn('Image processed with fallback:', err);
    } finally {
      e.target.value = '';
    }
  };

  const handleResetImage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomImages(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    try {
      localStorage.removeItem(`bhaktani_custom_image_${id}`);
    } catch (err) {
      console.error('Failed to remove from localStorage', err);
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-b from-amber-50 via-orange-50/40 to-amber-100/50 p-5 sm:p-7 border-2 border-amber-300/80 shadow-lg space-y-6 font-gujarati relative overflow-hidden">
      {/* Decorative Traditional Corner Accents */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-amber-400/20 to-transparent rounded-br-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-400/20 to-transparent rounded-bl-full pointer-events-none" />

      {/* 1. Header Section with Title & Authentic Swaminarayan Tilak */}
      <div className="text-center relative z-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-500/15 via-orange-500/20 to-amber-500/15 rounded-full border border-amber-400/50 shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
          <span className="text-xs sm:text-sm font-black text-amber-900 tracking-wider">
            ॥ શ્રી સ્વામિનારાયણો વિજયતેતરામ્ ॥
          </span>
          <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
        </div>

        {/* User-requested Title with Swaminarayan Tilak */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap pt-1">
          <SwaminarayanTilak size={32} />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-950 font-serif-gujarati tracking-tight drop-shadow-xs">
            જય સ્વામિનારાયણ ભક્તાણી
          </h2>
          <SwaminarayanTilak size={32} />
        </div>

        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
          સાક્ષાત પૂર્ણ પુરુષોત્તમ શ્રી સ્વામિનારાયણ ભગવાનના અલૌકિક દર્શન, દિવ્ય આશીર્વાદ અને ગુરુવર્યોની અખંડ સ્મૃતિ
        </p>
      </div>

      {/* Manual Upload Informational Bar */}
      <div className="relative z-10 flex items-center justify-between flex-wrap gap-2 px-4 py-2.5 rounded-2xl bg-amber-100/90 border border-amber-300 text-amber-950 text-xs sm:text-sm shadow-2xs">
        <div className="flex items-center gap-2 font-medium">
          <Upload className="w-4 h-4 text-amber-800 shrink-0" />
          <span>તમે કોઈપણ દર્શન કાર્ડ પર <strong>'ફોટો અપલોડ'</strong> બટન દબાવીને તમારા મોબાઇલ કે કમ્પ્યુટરમાંથી સીધો મનપસંદ ફોટો સેટ કરી શકો છો.</span>
        </div>
      </div>

      {/* 2. The 4 Images Sacred Gallery Grid with Manual Upload Support */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative z-10">
        {DARSHAN_IMAGES.map((item, index) => {
          const count = pushpanjaliCount[item.id] || 0;
          const isJustOffered = justOffered === item.id;
          const activeImageSrc = customImages[item.id] || item.image;
          const hasCustom = Boolean(customImages[item.id]);

          return (
            <div
              key={item.id}
              onClick={() => setSelectedDarshan(item)}
              className="group cursor-pointer rounded-2xl bg-white p-2.5 sm:p-3 border-2 border-amber-300 shadow-md hover:shadow-xl hover:border-amber-500 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Image Frame with Ornate Gold Edging */}
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-stone-900 border border-amber-200">
                <img
                  src={activeImageSrc}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Top Badge: Simple Photo Number (No tags) */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                  <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold border border-white/20">
                    દર્શન {index + 1}
                  </span>
                  {hasCustom && (
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-600/90 text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> આપનો ફોટો
                    </span>
                  )}
                </div>

                {/* Top Right: Reset to default button if custom image exists */}
                {hasCustom && (
                  <button
                    type="button"
                    onClick={(e) => handleResetImage(item.id, e)}
                    className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-red-600/90 hover:bg-red-700 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs transition-colors z-10 cursor-pointer"
                    title="મૂળ ફોટો પાછો લાવો"
                  >
                    <RotateCcw className="w-2.5 h-2.5" /> રીસેટ
                  </button>
                )}

                {/* Direct Camera / Upload button overlay on image */}
                <label
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-2 right-2 z-10 px-2 py-1 rounded-lg bg-black/75 hover:bg-black/90 text-amber-200 hover:text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer border border-amber-400/40 backdrop-blur-xs shadow-md transition-all active:scale-95"
                  title="નવો ફોટો અપલોડ કરો"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-300" />
                  <span>{hasCustom ? 'બદલો' : 'અપલોડ'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(item.id, e)}
                  />
                </label>

                {/* View Fullscreen Overlay Hint */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-200">
                    <ZoomIn className="w-4 h-4" />
                    <span>મોટા કદમાં દર્શન કરો</span>
                  </span>
                </div>

                {/* Floating Pushpanjali animation */}
                {isJustOffered && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-bounce z-20">
                    <span className="text-3xl filter drop-shadow-md">🌸 🌺 🌼</span>
                  </div>
                )}
              </div>

              {/* Card Bottom: Title & Action */}
              <div className="mt-3 space-y-2">
                <h3 className="font-bold text-sm text-stone-900 font-serif-gujarati leading-snug line-clamp-1 group-hover:text-amber-800 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 flex items-center justify-between gap-1.5 border-t border-amber-100 flex-wrap">
                  {/* Pushpanjali Button */}
                  <button
                    type="button"
                    onClick={(e) => handleOfferPushpanjali(item.id, e)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                    title="પુષ્પાંજલિ અર્પણ કરો"
                  >
                    <Flower2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>પુષ્પાંજલિ {count > 0 ? `(${count})` : ''}</span>
                  </button>

                  {/* Manual Upload Button on Card */}
                  <label
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                    title="આ દર્શન માટે તમારો ફોટો અપલોડ કરો"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{hasCustom ? 'બદલો' : 'અપલોડ'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(item.id, e)}
                    />
                  </label>

                  {/* Full View Button */}
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>દર્શન</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Below Photos: Sacred Blessing Banner (User-requested) */}
      <div className="relative z-10 rounded-2xl bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 text-white p-4 sm:p-5 shadow-md border-2 border-amber-400 text-center">
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-serif-gujarati tracking-wide drop-shadow-md">
            સ્વામિનારાયણ ભગવાન સાક્ષાત ભક્તાણી ઓ ઉપર કૃપા વર્ષાવે
          </h3>
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
        <p className="text-xs sm:text-sm text-amber-100 mt-1 font-medium">
          સર્વ ભક્તાણીઓના ઘરમાં સુખ, શાંતિ, સત્સંગ અને શ્રી હરિના અખંડ આશીર્વાદ વરસતા રહે એવી હૃદયપૂર્વક પ્રાર્થના
        </p>
      </div>

      {/* 4. Below Blessing: List of Divine Personalities (User-requested) */}
      <div className="relative z-10 space-y-3 pt-1">
        <div className="flex items-center justify-center gap-2">
          <Award className="w-4 h-4 text-amber-700" />
          <h4 className="text-sm font-extrabold text-amber-950 uppercase tracking-wider font-serif-gujarati">
            ॥ પરમ પૂજ્ય સંતવર્યો & મહારાજશ્રીઓનું સ્મરણ વંદન ॥
          </h4>
          <Award className="w-4 h-4 text-amber-700" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {DIVINE_PERSONALITIES.map((name, index) => (
            <div
              key={index}
              className="bg-white/90 hover:bg-white rounded-xl p-2.5 sm:p-3 border border-amber-300 shadow-2xs hover:shadow-md transition-all flex items-center gap-2 group"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-300 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                {index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-amber-900 transition-colors block truncate">
                  {name}
                </span>
                <span className="text-[10px] text-amber-700 font-semibold block">
                  દિવ્ય કૃપા પ્રદાતા
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Below Personalities: List of Speakers (User-requested) */}
      <div className="relative z-10 rounded-2xl bg-amber-100/90 border border-amber-300 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
            <h4 className="text-base sm:text-lg font-extrabold text-amber-950 font-serif-gujarati">
              વક્તા શ્રી :
            </h4>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-white px-3 py-1 rounded-full border border-amber-300">
            કુલ {SPEAKERS.length} આદરણીય વક્તાઓ
          </span>
        </div>

        {/* Display all 10 Speakers with elegant badges */}
        <div className="flex flex-wrap items-center gap-2">
          {SPEAKERS.map((speaker, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-stone-900 border border-amber-300 shadow-2xs text-xs sm:text-sm font-bold transition-transform hover:-translate-y-0.5"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>{speaker}</span>
            </div>
          ))}
        </div>
        <div className="text-[11px] text-stone-600 pt-1 border-t border-amber-200">
          <strong>સંપૂર્ણ સત્સંગ વ્યાખ્યાન શ્રેણી:</strong> ભક્તિ બેન + પદ્મિનીબા + ઝંખનાબા + કિન્નરીબા + મિતલબા + કલ્પનાબા + હર્ષવિબા + તૃપ્તિબા + વંદનાબા + તૃષ્ણાબેન દ્વારા દિવ્ય વક્તવ્ય અને પ્રેરક સત્સંગ.
        </div>
      </div>

      {/* Lightbox / Fullscreen Modal when any photo is clicked */}
      {selectedDarshan && (() => {
        const modalImageSrc = customImages[selectedDarshan.id] || selectedDarshan.image;
        const hasCustomModal = Boolean(customImages[selectedDarshan.id]);

        return (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
            onClick={() => setSelectedDarshan(null)}
          >
            <div
              className="bg-stone-900 rounded-3xl max-w-3xl w-full border-2 border-amber-400 p-4 sm:p-6 text-white space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <SwaminarayanTilak size={24} />
                  <h3 className="text-lg sm:text-xl font-bold font-serif-gujarati text-amber-300">
                    {selectedDarshan.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDarshan(null)}
                  className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer"
                  title="બંધ કરો"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Image */}
              <div className="relative rounded-2xl overflow-hidden bg-black flex items-center justify-center max-h-[62vh] border border-amber-400/30">
                <img
                  src={modalImageSrc}
                  alt={selectedDarshan.title}
                  className="w-full max-h-[62vh] object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Modal Footer Details & Upload actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                <div>
                  <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
                    {selectedDarshan.description}
                  </p>
                  {hasCustomModal && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> આ કાર્ડ પર તમારો કસ્ટમ ફોટો સેટ છે
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {/* Manual Upload in Modal */}
                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer active:scale-95">
                    <Upload className="w-4 h-4" />
                    <span>{hasCustomModal ? 'નવો ફોટો અપલોડ કરો' : 'ફોટો અપલોડ કરો'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(selectedDarshan.id, e)}
                    />
                  </label>

                  {/* Reset button in Modal */}
                  {hasCustomModal && (
                    <button
                      type="button"
                      onClick={(e) => handleResetImage(selectedDarshan.id, e)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>મૂળ ફોટો રાખો</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => handleOfferPushpanjali(selectedDarshan.id, e)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                  >
                    <Flower2 className="w-4 h-4 text-rose-900" />
                    <span>
                      પુષ્પાંજલિ ({pushpanjaliCount[selectedDarshan.id] || 0})
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDarshan(null)}
                    className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                  >
                    બંધ કરો
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
