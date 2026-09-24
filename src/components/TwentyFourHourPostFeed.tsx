import React, { useState, useEffect } from 'react';
import {
  Clock,
  Send,
  PlusCircle,
  Mail,
  User,
  Calendar,
  Sparkles,
  CheckCircle2,
  Trash2,
  ExternalLink,
  X,
  AlertCircle,
} from 'lucide-react';

export interface ActivePost {
  id: string;
  subject: string; // વિષય
  message: string; // મેસેજ / લખાણ
  authorName: string; // કોણે મેસેજ લખ્યો
  authorPhone?: string; // સંપર્ક
  timestamp: number; // Date.now()
  formattedDate: string; // e.g. 24 સપ્ટેમ્બર 2026
  formattedTime: string; // e.g. 10:30 AM
  recipientEmail?: string;
}

const STORAGE_KEY = 'bhaktani_24hr_posts';
const DEFAULT_EMAIL = 'happykanani8@gmail.com';
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

// Gujarati month names helper
const GUJARATI_MONTHS = [
  'જાન્યુઆરી', 'ફેબ્રુઆરી', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન',
  'જુલાઈ', 'ઓગસ્ટ', 'સપ્ટેમ્બર', 'ઓક્ટોબર', 'નવેમ્બર', 'ડિસેમ્બર'
];

function getFormattedGujaratiDateTime(date: Date) {
  const day = date.getDate();
  const month = GUJARATI_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  const formattedDate = `${day} ${month} ${year}`;

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedTime = `${hours}:${minutes} ${ampm}`;

  return { formattedDate, formattedTime };
}

// Initial sample posts within the last 24 hours
const getInitialSamplePosts = (): ActivePost[] => {
  const now = Date.now();
  const date1 = new Date(now - 2 * 60 * 60 * 1000); // 2 hours ago
  const date2 = new Date(now - 6 * 60 * 60 * 1000); // 6 hours ago

  const dt1 = getFormattedGujaratiDateTime(date1);
  const dt2 = getFormattedGujaratiDateTime(date2);

  return [
    {
      id: 'post-init-1',
      subject: 'આગામી રવિવાર સત્સંગ સભા & વિશેષ કીર્તન આરાધના',
      message: 'જય સ્વામિનારાયણ વહાલી સર્વ ભક્તાણી બહેનો! આગામી રવિવારે બપોરે ૩:૩૦ કલાકે મગદલ્લાહ મંદિર સભાગૃહમાં વિશેષ સત્સંગ સભા અને કીર્તન ભક્તિનું આયોજન છે. સર્વે બહેનોએ સપરિવાર પધારવા ભાવભર્યું આમંત્રણ છે.',
      authorName: 'ભક્તિ બેન (સભા સંચાલિકા)',
      authorPhone: '98251 00000',
      timestamp: date1.getTime(),
      formattedDate: dt1.formattedDate,
      formattedTime: dt1.formattedTime,
      recipientEmail: DEFAULT_EMAIL,
    },
    {
      id: 'post-init-2',
      subject: 'મંદિર પરિસર પવિત્ર પુષ્પહાર & સાત્વિક પ્રસાદ સેવા',
      message: 'શનિવારે સવારે ૭:૩૦ કલાકે શ્રી ઠાકોરજીના શણગાર, મોગરા-ગુલાબના પુષ્પહાર ગૂંથણી અને મહાપ્રસાદ પેકિંગ સેવા રાખેલ છે. સેવામાં રસ ધરાવતી સર્વ ભક્તાણી બહેનોએ સમયસર ઉપસ્થિત રહેવું.',
      authorName: 'પદ્મિનીબા',
      authorPhone: '98252 11111',
      timestamp: date2.getTime(),
      formattedDate: dt2.formattedDate,
      formattedTime: dt2.formattedTime,
      recipientEmail: DEFAULT_EMAIL,
    },
  ];
};

export const TwentyFourHourPostFeed: React.FC = () => {
  const [posts, setPosts] = useState<ActivePost[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: ActivePost[] = JSON.parse(saved);
        // Filter only posts within the last 24 hours
        const activeOnly = parsed.filter(p => Date.now() - p.timestamp < TWENTY_FOUR_HOURS_MS);
        if (activeOnly.length > 0) return activeOnly;
      }
    } catch (e) {
      console.error('Failed to load 24hr posts from localStorage', e);
    }
    return getInitialSamplePosts();
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorPhone, setAuthorPhone] = useState('');
  const [recipientEmail, setRecipientEmail] = useState(DEFAULT_EMAIL);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Auto-clean expired posts every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPosts(prev => {
        const stillActive = prev.filter(p => Date.now() - p.timestamp < TWENTY_FOUR_HOURS_MS);
        if (stillActive.length !== prev.length) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stillActive));
          } catch (e) {
            console.error(e);
          }
        }
        return stillActive;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Save to localStorage whenever posts change
  const savePosts = (newPosts: ActivePost[]) => {
    setPosts(newPosts);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosts));
    } catch (e) {
      console.error('Failed to save posts', e);
    }
  };

  // Construct and trigger Gmail compose with subject, message, author, and date/time
  const openInGmail = (post: ActivePost) => {
    const targetEmail = post.recipientEmail || DEFAULT_EMAIL;
    const emailSubject = encodeURIComponent(`[ભક્તાણી સંપ્રદાય પોસ્ટ] ${post.subject}`);
    const emailBody = encodeURIComponent(
`જય સ્વામિનારાયણ

શ્રી સ્વામિનારાયણ ભક્તાણી સંપ્રદાય (મગદલ્લાહ-સુરત)
૨૪ કલાક સક્રિય પોસ્ટ / અપડેટ વિગત:
==================================================
• વિષય: ${post.subject}

• મેસેજ:
${post.message}

• કોણે મેસેજ લખ્યો: ${post.authorName} ${post.authorPhone ? `(${post.authorPhone})` : ''}
• તારીખ: ${post.formattedDate}
• સમય: ${post.formattedTime}
• પોસ્ટ આઈડી: ${post.id}
==================================================
શ્રી પરમકૃપાળુ સ્વામીનારાયણ મહારાજ ની વહાલી ભક્તાણી`
    );

    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${emailSubject}&body=${emailBody}`;
    const mailtoFallback = `mailto:${targetEmail}?subject=${emailSubject}&body=${emailBody}`;

    // Try opening Gmail Web Compose tab, fallback to mailto
    const newWindow = window.open(gmailWebUrl, '_blank');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = mailtoFallback;
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || !authorName.trim()) {
      alert('કૃપા કરીને વિષય, મેસેજ અને કોણે મેસેજ લખ્યો તે વિગતો પૂર્ણ કરો.');
      return;
    }

    const now = new Date();
    const { formattedDate, formattedTime } = getFormattedGujaratiDateTime(now);

    const newPost: ActivePost = {
      id: `post-${Date.now()}`,
      subject: subject.trim(),
      message: message.trim(),
      authorName: authorName.trim(),
      authorPhone: authorPhone.trim() || undefined,
      timestamp: now.getTime(),
      formattedDate,
      formattedTime,
      recipientEmail: recipientEmail.trim() || DEFAULT_EMAIL,
    };

    const updated = [newPost, ...posts];
    savePosts(updated);

    // Reset Form & Close Modal
    setSubject('');
    setMessage('');
    setAuthorName('');
    setAuthorPhone('');
    setIsModalOpen(false);

    // Show Toast
    setSuccessToast(`પોસ્ટ સફળતાપૂર્વક ઉમેરાઈ ગઈ અને Gmail ડાઇરેક્ટ ઓપન કરવામાં આવી રહ્યું છે!`);
    setTimeout(() => setSuccessToast(null), 5000);

    // Automatically trigger direct Gmail redirection with all details
    openInGmail(newPost);
  };

  const handleDeletePost = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('શું તમે આ પોસ્ટ હટાવવા માંગો છો?')) {
      const remaining = posts.filter(p => p.id !== id);
      savePosts(remaining);
    }
  };

  // Helper to calculate remaining hours & minutes from 24 hours
  const getRemainingTime = (timestamp: number) => {
    const elapsed = Date.now() - timestamp;
    const remainingMs = Math.max(0, TWENTY_FOUR_HOURS_MS - elapsed);
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} કલાક ${minutes} મિનિટ બાકી`;
  };

  return (
    <div className="rounded-3xl bg-white border-2 border-amber-300/90 p-5 sm:p-7 shadow-lg space-y-5 font-gujarati relative overflow-hidden">
      {/* Decorative Traditional Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-400/15 via-orange-300/10 to-transparent rounded-bl-full pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-4 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 border border-amber-300 text-xs font-bold mb-1.5 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" style={{ animationDuration: '10s' }} />
            <span>૨૪ કલાક સક્રિય પોસ્ટિંગ બોર્ડ</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-amber-950 font-serif-gujarati tracking-tight flex items-center gap-2">
            <span>સત્સંગ પોસ્ટ્સ & તાજા અપડેટ્સ</span>
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
            અહીં ઉમેરેલી પોસ્ટ્સ ૨૪ કલાક સુધી લાઈવ રહેશે. કોઈપણ પોસ્ટ પર ક્લિક કરતા જ વિષય, મેસેજ, લેખક અને તારીખ-સમય સાથે <strong>સીધું જ Gmail</strong> માં ડાઇરેક્ટ ઓપન થશે.
          </p>
        </div>

        {/* Action Button: Add New Post */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ નવી પોસ્ટ ઉમેરો</span>
        </button>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-semibold shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="flex-1">{successToast}</span>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-emerald-700 hover:text-emerald-950"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Active Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-10 px-4 bg-amber-50/50 rounded-2xl border-2 border-dashed border-amber-200 space-y-3">
          <Clock className="w-10 h-10 text-amber-400 mx-auto" />
          <h4 className="text-base font-bold text-stone-800">
            હાલમાં કોઈ ૨૪ કલાક સક્રિય પોસ્ટ નથી
          </h4>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            તમે ઉપર આપેલા <strong>'+ નવી પોસ્ટ ઉમેરો'</strong> બટન પર ક્લિક કરીને નવો મેસેજ કે અપડેટ પોસ્ટ કરી શકો છો.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>પ્રથમ પોસ્ટ ઉમેરો</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => openInGmail(post)}
              className="group cursor-pointer rounded-2xl bg-gradient-to-br from-white via-amber-50/20 to-orange-50/30 p-5 border-2 border-amber-200 hover:border-amber-500 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden space-y-4"
              title="Gmail માં ખોલવા માટે ક્લિક કરો"
            >
              {/* Top Meta Bar */}
              <div className="flex items-center justify-between gap-2 border-b border-amber-100 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    ૨૪ કલાક સક્રિય
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-bold font-chirp">
                    {getRemainingTime(post.timestamp)}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-amber-700 font-bold group-hover:text-amber-900 transition-colors flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Gmail</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleDeletePost(post.id, e)}
                    className="p-1 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors ml-1"
                    title="આ પોસ્ટ હટાવો"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Subject & Message Content */}
              <div className="space-y-2">
                <h4 className="text-base sm:text-lg font-bold text-amber-950 font-serif-gujarati leading-snug group-hover:text-amber-800 transition-colors">
                  {post.subject}
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 whitespace-pre-line leading-relaxed line-clamp-4">
                  {post.message}
                </p>
              </div>

              {/* Author & Timestamp Footer */}
              <div className="pt-2 border-t border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-stone-800">
                  <User className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>
                    લખનાર: <strong className="text-amber-950">{post.authorName}</strong>
                    {post.authorPhone && (
                      <span className="text-stone-500 ml-1 font-chirp text-[11px]">
                        ({post.authorPhone})
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-stone-500 font-chirp text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>
                    {post.formattedDate} • {post.formattedTime}
                  </span>
                </div>
              </div>

              {/* Hover Highlight prompt */}
              <div className="pt-1 flex items-center justify-end">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/15 group-hover:bg-amber-600 text-amber-900 group-hover:text-white font-bold text-[11px] transition-all">
                  <Mail className="w-3 h-3" />
                  <span>ક્લિક કરીને Gmail માં મોકલો / ખોલો →</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog for Adding a 24-Hour Post */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full border-2 border-amber-400 p-5 sm:p-7 text-stone-900 space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <PlusCircle className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-serif-gujarati text-amber-950">
                    નવી ૨૪ કલાક સત્સંગ પોસ્ટ ઉમેરો
                  </h3>
                  <p className="text-xs text-stone-500">
                    પોસ્ટ ઉમેરતા જ વિષય, મેસેજ, લેખક અને તારીખ સાથે ડાઇરેક્ટ Gmail માં જશે
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
                title="બંધ કરો"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleCreatePost} className="space-y-4">
              {/* Subject */}
              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-bold text-stone-800">
                  ૧. વિષય (Subject) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="દા.ત. આગામી રવિવાર સત્સંગ સભા & વિશેષ જાહેરાત"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm font-medium transition-all"
                />
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-bold text-stone-800">
                  ૨. મેસેજ / લખાણ (Message) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="મેસેજની સંપૂર્ણ વિગત અહીં લખો (દા.ત. સમય, સ્થળ, સેવા અથવા જાહેરાત)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm font-medium transition-all resize-y"
                />
              </div>

              {/* Author & Phone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-bold text-stone-800">
                    ૩. કોણે મેસેજ લખ્યો (લેખકનું નામ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="દા.ત. ભક્તિ બેન પટેલ"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm font-medium transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-bold text-stone-800">
                    ૪. મોબાઈલ નંબર (વૈકલ્પિક)
                  </label>
                  <input
                    type="tel"
                    value={authorPhone}
                    onChange={(e) => setAuthorPhone(e.target.value)}
                    placeholder="દા.ત. 98250 00000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm font-medium transition-all font-chirp"
                  />
                </div>
              </div>

              {/* Gmail Recipient */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700 flex items-center justify-between">
                  <span>૫. પ્રાપ્તકર્તા Gmail સરનામું</span>
                  <span className="text-[11px] text-amber-700 font-normal">ડાઇરેક્ટ Gmail સિંક</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-700 font-chirp focus:border-amber-500 outline-none"
                    placeholder="happykanani8@gmail.com"
                  />
                </div>
              </div>

              {/* Live Info Banner */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>આ પોસ્ટ બરાબર ૨૪ કલાક સુધી ડેશબોર્ડમાં લાઈવ રહેશે.</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  આજના સમય અને તારીખ સાથેનું ડ્રાફ્ટ ઈમેલ સીધું જ Gmail માં ઓપન થશે.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>પોસ્ટ કરો & Gmail માં મોકલો</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
