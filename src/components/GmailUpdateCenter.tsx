import { useState, useMemo, useEffect } from 'react';
import { EmailNotification, MahilaMember } from '../types';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  FileText,
  UserCheck,
  HeartHandshake,
  UtensilsCrossed,
  CalendarDays,
  Copy,
  Check,
  Edit3,
  Plus,
  RefreshCw,
  Sparkles,
  Search,
  Filter,
  Eye,
  Radio,
  Share2,
  Info,
  RotateCcw
} from 'lucide-react';

interface Props {
  notifications: EmailNotification[];
  currentMember: MahilaMember;
  onSendCustomEmail: (
    recipient: string, 
    subject: string, 
    body: string, 
    sender?: string, 
    type?: EmailNotification['type']
  ) => void;
}

export default function GmailUpdateCenter({
  notifications,
  currentMember,
  onSendCustomEmail
}: Props) {
  // Configured official email addresses
  const DEFAULT_SENDER = 'bhaktanisamparadayofficial@gmail.com';
  const DEFAULT_RECIPIENT = 'bhaktidevani81@gmail.com';

  const [selectedNotif, setSelectedNotif] = useState<EmailNotification | null>(notifications[0] || null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for composed / reviewed email
  const [senderEmail, setSenderEmail] = useState(DEFAULT_SENDER);
  const [recipientChoice, setRecipientChoice] = useState<'default' | 'manual'>('default');
  const [manualRecipient, setManualRecipient] = useState('');
  const [customSubject, setCustomSubject] = useState(notifications[0]?.subject || 'મહિલા સત્સંગ સભા આયોજન');
  const [customBody, setCustomBody] = useState(notifications[0]?.body || '');

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [activeTemplateCategory, setActiveTemplateCategory] = useState<string | null>(null);

  // Synchronize the Message Body and Subject directly with the selected notification details
  useEffect(() => {
    if (selectedNotif) {
      setCustomSubject(selectedNotif.subject);
      setCustomBody(selectedNotif.body);
      setSenderEmail(selectedNotif.sender || DEFAULT_SENDER);
      if (selectedNotif.recipient && selectedNotif.recipient !== DEFAULT_RECIPIENT) {
        setRecipientChoice('manual');
        setManualRecipient(selectedNotif.recipient);
      } else {
        setRecipientChoice('default');
      }
    }
  }, [selectedNotif]);

  // Filtered notifications list
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const matchType = filterType === 'all' || n.type === filterType;
      const matchQuery = !searchQuery.trim() || 
        n.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.recipient.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchQuery;
    });
  }, [notifications, filterType, searchQuery]);

  // When changing category filter, automatically select the first email of that category
  const handleFilterChange = (type: string) => {
    setFilterType(type);
    if (type !== 'all') {
      const match = notifications.find(n => n.type === type);
      if (match) {
        setSelectedNotif(match);
      }
    } else if (notifications.length > 0) {
      setSelectedNotif(notifications[0]);
    }
  };

  // Reset to currently selected notification's exact subject and body
  const handleResetToSelected = () => {
    if (selectedNotif) {
      setCustomSubject(selectedNotif.subject);
      setCustomBody(selectedNotif.body);
      setSenderEmail(selectedNotif.sender || DEFAULT_SENDER);
      if (selectedNotif.recipient && selectedNotif.recipient !== DEFAULT_RECIPIENT) {
        setRecipientChoice('manual');
        setManualRecipient(selectedNotif.recipient);
      } else {
        setRecipientChoice('default');
      }
    }
  };

  // Actual recipient value based on radio selection
  const effectiveRecipient = recipientChoice === 'default' ? DEFAULT_RECIPIENT : manualRecipient.trim();

  const handleSendForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveRecipient || !customSubject.trim() || !customBody.trim()) return;

    // Detect correct category from subject and body content so it is never miscategorized
    let notifType: EmailNotification['type'] = selectedNotif?.type || 'sabha_scheduled';
    const subLower = customSubject.toLowerCase();
    const bodyLower = customBody.toLowerCase();

    if (subLower.includes('દાન') || subLower.includes('ભંડોળ') || subLower.includes('રસીદ') || bodyLower.includes('દાન રકમ') || bodyLower.includes('દાતાનું નામ')) {
      notifType = 'donation_received';
    } else if (subLower.includes('જમણવાર') || subLower.includes('રસોઈ') || subLower.includes('યજમાન') || bodyLower.includes('જમણવાર સેવા')) {
      notifType = 'jamanwar_booked';
    } else if (subLower.includes('સભા') || subLower.includes('સત્સંગ') || bodyLower.includes('સત્સંગ સભા આમંત્રણ')) {
      notifType = 'sabha_scheduled';
    } else if (subLower.includes('સભ્ય') || subLower.includes('નોંધણી')) {
      notifType = 'member_registration';
    }

    onSendCustomEmail(effectiveRecipient, customSubject.trim(), customBody.trim(), senderEmail, notifType);
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 4500);
  };

  const getGmailComposeUrl = (recipient: string, subject: string, body: string) => {
    const baseUrl = 'https://mail.google.com/mail/?view=cm&fs=1';
    const to = encodeURIComponent(recipient || DEFAULT_RECIPIENT);
    const su = encodeURIComponent(subject);
    const b = encodeURIComponent(body);
    return `${baseUrl}&to=${to}&su=${su}&body=${b}`;
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getIconForType = (type: EmailNotification['type']) => {
    switch (type) {
      case 'donation_received': return HeartHandshake;
      case 'jamanwar_booked': return UtensilsCrossed;
      case 'sabha_scheduled': return CalendarDays;
      case 'member_registration': return UserCheck;
      case 'family_added': return UserCheck;
      default: return Mail;
    }
  };

  const getTypeLabel = (type: EmailNotification['type']) => {
    switch (type) {
      case 'donation_received': return 'દાન & ભંડોળ';
      case 'jamanwar_booked': return 'જમણવાર & મેનુ';
      case 'sabha_scheduled': return 'મહિલા સભા';
      case 'member_registration': return 'નવી સભ્ય';
      case 'family_added': return 'પારિવારિક વિગત';
      default: return 'સામાન્ય';
    }
  };

  // Pure category templates - STRICTLY separated with NO mixing of Dan/Jamanwar in Mahila Sabha
  const loadTemplate = (category: 'sabha_donor' | 'sabha_no_donor' | 'donation' | 'jamanwar') => {
    setActiveTemplateCategory(category);
    if (category === 'sabha_donor') {
      // Mahila Sabha where prasad is sponsored by a donor (includes Donor Name and Amount)
      setCustomSubject('મહિલા સત્સંગ સભા & પ્રસાદ સેવા: રવિવારીય વિશેષ સભા (પ્રસાદ દાતાશ્રી સહયોગ)');
      setCustomBody(
`શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય
સત્સંગ સભા આમંત્રણ પત્રિકા

જય સ્વામિનારાયણ સર્વ મહિલા મંડળ!

આગામી મહિલા સત્સંગ સભાનું આયોજન સફળતાપૂર્વક નક્કી થયેલ છે:

મુખ્ય વિગતો:
• સભાનું નામ: રવિવારીય વિશેષ મહિલા સત્સંગ સભા & વચનામૃત રહસ્ય કથા
• તારીખ & વાર: ${new Date().toISOString().split('T')[0]} (રવિવાર)
• સમયગાળો: બપોરે ૦૩:૦૦ થી ૦૫:૩૦ કલાકે
• મુખ્ય વક્તા: પૂજ્ય સાંખ્યયોગી કંચનબા (વરિષ્ઠ સાંખ્યયોગી વિદુષી બહેન)
• સભા યુનિફોર્મ: લાલ / મરૂન કલરની સાડી (પરંપરાગત ઉત્સવ પરિધાન)
• પ્રસાદ અર્પણ દાતાશ્રી: હેપ્પીબેન ભાવિનકુમાર કાનાણી
• પ્રસાદ અર્પણ સેવા રકમ: ₹૨૧,૦૦૦
• સભા પ્રસાદ વાનગીઓ: મોહનથાળ (શુદ્ધ ઘી), ખમણ ઢોકળા, મસાલા છાશ
• સભા વિષય / રહસ્ય: ગઢડા મધ્ય પ્રકરણનું ૬૨મું વચનામૃત: "પરમેશ્વરમાં અખંડ હેત રાખવાની રીત"
• કીર્તન ભક્તિ: મુક્તાનંદ સ્વામી રચિત: "મારે ઘેર આવ્યા રે સુંદર શ્યામ..."
• સભા સ્થળ: મહિલા સભા મંડપ, શ્રી સ્વામિનારાયણ મંદિર પરિસર
• અંદાજિત ઉપસ્થિતિ: ૩૫૦ બહેનો

તમામ બહેનોને નિયત યુનિફોર્મમાં સમયસર પધારવા ભાવભર્યું આમંત્રણ છે.

લી.
શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય સભા આયોજન સમિતિ
મોકલનાર: bhaktanisamparadayofficial@gmail.com`
      );
    } else if (category === 'sabha_no_donor') {
      // Mahila Sabha where prasad has NO specific donor (only sabha prasad items listed)
      setCustomSubject('મહિલા સત્સંગ સભા આયોજન: પવિત્ર એકાદશી ઉપવાસ મહિમા & સ્વાધ્યાય સભા');
      setCustomBody(
`શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય
સત્સંગ સભા આમંત્રણ પત્રિકા

જય સ્વામિનારાયણ સર્વ મહિલા મંડળ!

આગામી મહિલા સત્સંગ સભાનું આયોજન સફળતાપૂર્વક નક્કી થયેલ છે:

મુખ્ય વિગતો:
• સભાનું નામ: પવિત્ર એકાદશી ઉપવાસ મહિમા & શિક્ષાપત્રી સ્વાધ્યાય સભા
• તારીખ & વાર: ${new Date().toISOString().split('T')[0]} (મંગળવાર)
• સમયગાળો: બપોરે ૦૨:૩૦ થી ૦૫:૦૦ કલાકે
• મુખ્ય વક્તા: પૂજ્ય સાંખ્યયોગી હર્ષિદાબા (ધર્મવિદ્યા પ્રવીણા બહેન)
• સભા યુનિફોર્મ: પીળા / કેસરી રંગની સાડી (સભા પરિધાન)
• સભા પ્રસાદ વાનગીઓ: સુખડી પ્રસાદ, બટાકા પૌંઆ, પંચામૃત
• સભા વિષય / રહસ્ય: શિક્ષાપત્રી શ્લોક ૭૯ થી ૮૪: મહિલા ભક્તો માટે સદાચાર અને ધર્મપાલન
• કીર્તન ભક્તિ: ધ્યાન અને થાળ કીર્તન આરાધના
• સભા સ્થળ: અક્ષર જ્યોત સભા હોલ
• અંદાજિત ઉપસ્થિતિ: ૪૦૦ બહેનો

તમામ બહેનોને નિયત યુનિફોર્મમાં સમયસર પધારવા ભાવભર્યું આમંત્રણ છે.

લી.
શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય સભા આયોજન સમિતિ
મોકલનાર: bhaktanisamparadayofficial@gmail.com`
      );
    } else if (category === 'donation') {
      // Strictly donation receipt
      setCustomSubject('દાન પાવતી સ્વીકૃતિ: શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય સેવા ભંડોળ');
      setCustomBody(
`શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય
સત્તાવાર સેવા ભંડોળ રસીદ સ્વીકૃતિ

જય સ્વામિનારાયણ!

શ્રી સ્વામિનારાયણ સંપ્રદાય મહિલા મંડળ સેવા ભંડોળમાં આપનું દાન સફળતાપૂર્વક સ્વીકારાયું છે:

મુખ્ય વિગતો:
• દાતાનું નામ: હેપ્પીબેન ભાવિનકુમાર કાનાણી
• દાન રકમ: ₹૨૧,૦૦૦
• સેવા હેતુ / કેટેગરી: ભક્તાણી સેવા / મહાપ્રસાદ
• ચૂકવણી મોડ: રોકડ
• તારીખ: ${new Date().toISOString().split('T')[0]}
• નોંધ: મહિલા સભા અર્પણ ભોગ પ્રસાદ સેવા

આપના નિઃસ્વાર્થ સહયોગ બદલ ખૂબ ખૂબ સાધુવાદ. શ્રીજી મહારાજ સદા આપના પરિવાર પર કૃપા વરસાવે.

લી.
શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય ભંડોળ સમિતિ
મોકલનાર: bhaktanisamparadayofficial@gmail.com`
      );
    } else if (category === 'jamanwar') {
      // Strictly jamanwar confirmation
      setCustomSubject('જમણવાર & મહાપ્રસાદ આયોજન કન્ફર્મેશન: શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય');
      setCustomBody(
`શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય
સત્તાવાર જમણવાર સેવા કન્ફર્મેશન

જય સ્વામિનારાયણ!

શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાયમાં પવિત્ર જમણવાર સેવાનું આયોજન સફળતાપૂર્વક કન્ફર્મ થયેલ છે:

મુખ્ય વિગતો:
• પ્રસંગ: દીકરીના જન્મદિન નિમિત્તે સાત્વિક મહાપ્રસાદ ભોજન સેવા
• યજમાન: રેખાબેન મુકેશભાઈ સાંગાણી
• સેવા રકમ: ₹૧૫,૦૦૦
• તારીખ & સમય: ${new Date().toISOString().split('T')[0]} • બપોરે ૧૧:૩૦ કલાકે
• અંદાજિત હરિભક્તો: ૩૫૦ બહેનો
• મેનુ વાનગીઓ: મોહનથાળ, પૂરી, રસાવાળા બટાકાનું શાક, ગુજરાતી દાળ-ભાત, છાશ
• રસોઈ ટીમ: અન્નપૂર્ણા સેવા દળ

લી.
શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય જમણવાર સમિતિ
મોકલનાર: bhaktanisamparadayofficial@gmail.com`
      );
    }
  };

  // Render formatted preview with bold labels
  const renderFormattedPreview = (bodyText: string) => {
    const lines = bodyText.split('\n');
    return (
      <div className="space-y-1.5 text-stone-800 text-xs sm:text-sm leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) {
            return <div key={idx} className="h-2" />;
          }

          // Bullet points or key-values
          if (line.startsWith('•') || line.startsWith('*') || line.includes(':')) {
            const parts = line.split(':');
            if (parts.length >= 2) {
              const label = parts[0];
              const value = parts.slice(1).join(':');
              const isHighlight = label.includes('દાતા') || label.includes('રકમ') || label.includes('વાનગી');
              return (
                <div 
                  key={idx} 
                  className={`flex flex-wrap items-baseline gap-1 py-0.5 rounded px-1.5 ${
                    isHighlight ? 'bg-amber-100/60 text-amber-950 font-semibold' : ''
                  }`}
                >
                  <span className="font-extrabold text-stone-900 font-gujarati">{label}:</span>
                  <span className="font-medium text-stone-800">{value}</span>
                </div>
              );
            }
          }

          // Salutation or closings
          if (line.includes('જય સ્વામિનારાયણ')) {
            return (
              <div key={idx} className="font-bold text-amber-900 py-1 text-sm font-serif-gujarati">
                {line}
              </div>
            );
          }

          if (line.startsWith('લી.') || line.startsWith('મોકલનાર:')) {
            return (
              <div key={idx} className="font-bold text-stone-700 text-xs mt-1">
                {line}
              </div>
            );
          }

          return <p key={idx} className="text-stone-700">{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 font-gujarati animate-in fade-in duration-200">
      {/* Clean Official Email Status Header */}
      <div className="bg-gradient-to-r from-red-800 via-rose-700 to-amber-800 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-red-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full text-xs font-semibold backdrop-blur-xs text-red-100 border border-white/10 mb-2">
            <Mail className="w-3.5 h-3.5 text-amber-200" />
            <span>Gmail Integration Gateway • સત્તાવાર મેલ સંચાર</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif-gujarati">
            Gmail અપડેટ કેન્દ્ર
          </h2>
          <p className="text-red-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            મોકલનાર: <strong className="text-white font-chirp select-all">bhaktanisamparadayofficial@gmail.com</strong> અને પ્રાપ્તકર્તા: <strong className="text-amber-200 font-chirp select-all">bhaktidevani81@gmail.com</strong> નિયત છે. અન્યથા મેન્યુઅલ ઈમેઈલ પણ ઉમેરી શકાય છે.
          </p>
        </div>

        {/* Sender & Receiver Summary Card */}
        <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs shrink-0 w-full md:w-auto space-y-2">
          <div>
            <div className="text-red-200 font-bold uppercase text-[10px] tracking-wider">
              મોકલનાર (From Sender):
            </div>
            <div className="text-white font-black text-xs sm:text-sm font-chirp select-all">
              {DEFAULT_SENDER}
            </div>
          </div>
          <div className="pt-2 border-t border-white/15">
            <div className="text-red-200 font-bold uppercase text-[10px] tracking-wider">
              પ્રાપ્તકર્તા (Default Recipient To):
            </div>
            <div className="text-amber-200 font-black text-xs sm:text-sm font-chirp select-all">
              {DEFAULT_RECIPIENT}
            </div>
          </div>
          <div className="text-emerald-300 flex items-center gap-1 font-semibold text-[11px] pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> સિસ્ટમ કનેક્ટેડ & ડાયરેક્ટ Gmail ટ્રાન્સફર સક્રિય
          </div>
        </div>
      </div>

      {/* Main Layout: Left Side List + Right Side Details & Synced Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Notification Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-600" />
                <span>ઈમેઈલ યાદી ({filteredNotifications.length})</span>
              </h3>
              <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-md text-[11px] font-bold font-chirp">
                Real-time
              </span>
            </div>

            {/* Search & Category Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="મેલ વિષય, તારીખ કે પ્રાપ્તકર્તા શોધો..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Specific Categories - clicking selects the relevant email immediately */}
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {[
                  { id: 'all', label: 'બધા' },
                  { id: 'sabha_scheduled', label: 'મહિલા સભા' },
                  { id: 'donation_received', label: 'દાન & ભંડોળ' },
                  { id: 'jamanwar_booked', label: 'જમણવાર' },
                  { id: 'member_registration', label: 'નવા સભ્ય' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => handleFilterChange(tab.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      filterType === tab.id
                        ? 'bg-red-700 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List of Email Notifications */}
          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center text-stone-500 text-xs">
                કોઈ ઈમેઈલ રેકોર્ડ મળ્યો નથી.
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const Icon = getIconForType(notif.type);
                const isSelected = selectedNotif?.id === notif.id;
                return (
                  <div
                    key={notif.id}
                    onClick={() => setSelectedNotif(notif)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left space-y-2 ${
                      isSelected
                        ? 'bg-amber-50/90 border-red-500 shadow-md ring-2 ring-red-400/20'
                        : 'bg-white hover:bg-stone-50 border-stone-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-stone-900 line-clamp-1">
                          {notif.subject}
                        </span>
                      </div>
                      <span className="px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded text-[10px] font-semibold shrink-0">
                        {getTypeLabel(notif.type)}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                      {notif.body}
                    </p>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] font-chirp text-stone-500">
                      <span className="font-semibold text-stone-700">To: {notif.recipient || DEFAULT_RECIPIENT}</span>
                      <span>{notif.date} • {notif.time}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Email Details (Above) + Message Body Review & Send (Below) (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* 1. TOP CARD: Selected Email Details & Direct Actions */}
          {selectedNotif && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-black font-chirp flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> તૈયાર ઈમેઈલ વિગત (Details)
                  </span>
                  <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded text-xs font-bold">
                    {getTypeLabel(selectedNotif.type)}
                  </span>
                  <span className="text-xs text-stone-500 font-chirp">
                    {selectedNotif.date} • {selectedNotif.time}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedNotif.body, selectedNotif.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {copiedId === selectedNotif.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">કોપી થયું!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>લખાણ કોપી</span>
                      </>
                    )}
                  </button>

                  <a
                    href={getGmailComposeUrl(selectedNotif.recipient || DEFAULT_RECIPIENT, selectedNotif.subject, selectedNotif.body)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>સીધું Gmail માં મોકલો</span>
                  </a>
                </div>
              </div>

              {/* Sender & Recipient bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                <div>
                  <span className="text-stone-500 font-bold block">મોકલનાર (From):</span>
                  <strong className="text-stone-900 font-chirp block mt-0.5">
                    {selectedNotif.sender || DEFAULT_SENDER}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-500 font-bold block">પ્રાપ્તકર્તા (To):</span>
                  <strong className="text-amber-950 font-chirp block mt-0.5">
                    {selectedNotif.recipient || DEFAULT_RECIPIENT}
                  </strong>
                </div>
              </div>

              {/* Subject */}
              <div>
                <span className="text-[11px] text-stone-400 font-bold uppercase tracking-wider block">
                  ઈમેઈલ વિષય (Subject):
                </span>
                <h4 className="text-base font-extrabold text-stone-950 mt-0.5">
                  {selectedNotif.subject}
                </h4>
              </div>

              {/* Formatted Body with clear sections */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-200">
                {renderFormattedPreview(selectedNotif.body)}
              </div>
            </div>
          )}

          {/* 2. BOTTOM CARD: Message Body & Direct Send Form (Synced with Details above) */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                  <Send className="w-4 h-4 text-red-600" />
                  <span>લખાણ (Message Body) ચેક કરો & Gmail મોકલો</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  ઉપર જે ડિટેલ્સ છે તે જ લખાણ નીચે તૈયાર છે. મારે માત્ર ચેક કરવાનું જ રહે — જો જરૂર હોય તો જ ઉમેરો.
                </p>
              </div>

              {/* Quick Template Switchers for pristine separate drafts */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <button
                  type="button"
                  title="જો મહિલા સભામાં કોઈ દાતા દ્વારા પ્રસાદ અર્પણ હોય તો દાતાનું નામ અને રકમ સહિત લખાણ"
                  onClick={() => loadTemplate('sabha_donor')}
                  className={`px-2.5 py-1 border rounded-lg font-bold cursor-pointer transition-all ${
                    activeTemplateCategory === 'sabha_donor' 
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs' 
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
                  }`}
                >
                  સભા (દાતા પ્રસાદ)
                </button>
                <button
                  type="button"
                  title="જો કોઈ દાતા ના હોય તો માત્ર સભા પ્રસાદ વાનગીઓનું લખાણ"
                  onClick={() => loadTemplate('sabha_no_donor')}
                  className={`px-2.5 py-1 border rounded-lg font-bold cursor-pointer transition-all ${
                    activeTemplateCategory === 'sabha_no_donor' 
                      ? 'bg-teal-700 text-white border-teal-700 shadow-xs' 
                      : 'bg-teal-50 hover:bg-teal-100 text-teal-900 border-teal-200'
                  }`}
                >
                  સભા (સામાન્ય પ્રસાદ)
                </button>
                <button
                  type="button"
                  title="માત્ર દાન અને ભંડોળ રસીદ સ્વીકૃતિ"
                  onClick={() => loadTemplate('donation')}
                  className={`px-2.5 py-1 border rounded-lg font-bold cursor-pointer transition-all ${
                    activeTemplateCategory === 'donation' 
                      ? 'bg-amber-700 text-white border-amber-700 shadow-xs' 
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                  }`}
                >
                  દાન પાવતી
                </button>
                <button
                  type="button"
                  title="માત્ર જમણવાર અને રસોઈ આયોજન કન્ફર્મેશન"
                  onClick={() => loadTemplate('jamanwar')}
                  className={`px-2.5 py-1 border rounded-lg font-bold cursor-pointer transition-all ${
                    activeTemplateCategory === 'jamanwar' 
                      ? 'bg-rose-700 text-white border-rose-700 shadow-xs' 
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border-rose-200'
                  }`}
                >
                  જમણવાર
                </button>
              </div>
            </div>

            {/* Sync reassurance badge */}
            <div className="p-3 bg-blue-50/80 border border-blue-200 text-blue-900 rounded-2xl text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  <strong>સંપૂર્ણ મેળ (Synced):</strong> ઉપર દર્શાવેલ વિગત (Details) નું જ લખાણ નીચે Message Body માં આવી ગયું છે.
                </span>
              </div>
              <button
                type="button"
                onClick={handleResetToSelected}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-800 border border-blue-300 rounded-lg font-bold text-[11px] transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>ડિટેલ્સમાંથી પુનઃ લો</span>
              </button>
            </div>

            {sentSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ઈમેઈલ સફળતાપૂર્વક Gmail લોગમાં નોંધાઈ ગયો છે અને પ્રાપ્તકર્તાને મોકલાઈ ગયો છે!</span>
              </div>
            )}

            <form onSubmit={handleSendForm} className="space-y-4 text-xs">
              {/* Sender Fixed Field */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <label className="block text-stone-600 font-bold mb-1">
                  મોકલનાર (From Sender Email):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl font-chirp text-xs font-bold text-stone-800"
                  />
                  <span className="text-[11px] text-stone-500 whitespace-nowrap">સત્તાવાર મેલ</span>
                </div>
              </div>

              {/* Recipient Selection: Default vs Manual */}
              <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-2.5">
                <label className="block text-amber-950 font-extrabold text-xs">
                  પ્રાપ્ત કરનાર ઈમેઈલ પસંદ કરો (Recipient To):
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Option 1: Default bhaktidevani81@gmail.com */}
                  <label 
                    className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      recipientChoice === 'default' 
                        ? 'bg-amber-100/80 border-red-500 ring-2 ring-red-400/20 font-bold' 
                        : 'bg-white border-stone-200 text-stone-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="recipientType"
                      checked={recipientChoice === 'default'}
                      onChange={() => setRecipientChoice('default')}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <div>
                      <div className="text-xs font-black text-amber-950 font-chirp">{DEFAULT_RECIPIENT}</div>
                      <div className="text-[10px] text-stone-500">ડિફોલ્ટ પ્રાપ્તકર્તા (આપોઆપ)</div>
                    </div>
                  </label>

                  {/* Option 2: Manual Recipient */}
                  <label 
                    className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      recipientChoice === 'manual' 
                        ? 'bg-amber-100/80 border-red-500 ring-2 ring-red-400/20 font-bold' 
                        : 'bg-white border-stone-200 text-stone-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="recipientType"
                      checked={recipientChoice === 'manual'}
                      onChange={() => setRecipientChoice('manual')}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-900">અન્યને મોકલવો હોય તો (મેન્યુઅલ)</div>
                      <div className="text-[10px] text-stone-500">નવું ઈમેઈલ સરનામું ઉમેરો</div>
                    </div>
                  </label>
                </div>

                {/* Manual Email Input if Selected */}
                {recipientChoice === 'manual' && (
                  <div className="pt-2 animate-in fade-in duration-150">
                    <input
                      type="email"
                      required
                      placeholder="દા.ત. member@gmail.com"
                      value={manualRecipient}
                      onChange={(e) => setManualRecipient(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-chirp text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                )}
              </div>

              {/* Subject Field */}
              <div>
                <label className="block text-stone-800 font-bold mb-1">
                  ઈમેઈલ વિષય (Subject):
                </label>
                <input
                  type="text"
                  required
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                />
              </div>

              {/* Message Body Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-stone-800 font-bold">
                    લખાણ (Message Body) - જે વિગતો ઉપર છે તે જ અહીં તૈયાર છે:
                  </label>
                  <span className="text-[11px] text-stone-400">માત્ર ચેક કરી લો / જરૂર હોય તો જ ઉમેરો</span>
                </div>
                <textarea
                  rows={9}
                  required
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 leading-relaxed font-gujarati bg-stone-50/50"
                />
              </div>

              {/* Submit & External Gmail Compose buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={getGmailComposeUrl(effectiveRecipient, customSubject, customBody)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-red-600" />
                  <span>Gmail એપ્લિકેશનમાં ખોલો</span>
                </a>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>ડાયરેક્ટ Gmail મોકલો</span>
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
