import { useState, useMemo, useEffect, useCallback } from 'react';
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
  RotateCcw,
  Inbox,
  FileEdit,
  ShieldCheck,
  AlertCircle,
  FolderOpen
} from 'lucide-react';
import GoogleSignInButton from './GoogleSignInButton';
import GmailSendConfirmModal from './GmailSendConfirmModal';
import { 
  googleSignIn, 
  logout, 
  getAccessToken 
} from '../services/authService';
import { 
  getGmailProfile, 
  listGmailMessages, 
  getGmailMessageDetails, 
  sendGmailEmail, 
  createGmailDraft, 
  GmailProfile, 
  GmailMessageDetail 
} from '../services/gmailService';
import { User } from 'firebase/auth';

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
  authUser: User | null;
  authToken: string | null;
  onAuthChange?: () => void;
}

export default function GmailUpdateCenter({
  notifications,
  currentMember,
  onSendCustomEmail,
  authUser,
  authToken
}: Props) {
  // Configured official email addresses
  const DEFAULT_SENDER = 'bhaktanisamparadayofficial@gmail.com';
  const DEFAULT_RECIPIENT = 'bhaktidevani81@gmail.com';

  // Active view mode: 'notifications' | 'live_gmail' | 'compose'
  const [activeView, setActiveView] = useState<'notifications' | 'live_gmail' | 'compose'>('notifications');

  // Auth & Profile state
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [gmailProfile, setGmailProfile] = useState<GmailProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Live Gmail messages state
  const [liveMailbox, setLiveMailbox] = useState<'INBOX' | 'SENT' | 'DRAFT'>('INBOX');
  const [liveMessages, setLiveMessages] = useState<GmailMessageDetail[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [liveSearchQuery, setLiveSearchQuery] = useState('');
  const [selectedLiveMessage, setSelectedLiveMessage] = useState<GmailMessageDetail | null>(null);

  // Mandal notification state
  const [selectedNotif, setSelectedNotif] = useState<EmailNotification | null>(notifications[0] || null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for composed / reviewed email
  const [senderEmail, setSenderEmail] = useState(authUser?.email || DEFAULT_SENDER);
  const [recipientChoice, setRecipientChoice] = useState<'default' | 'manual'>('default');
  const [manualRecipient, setManualRecipient] = useState('');
  const [customSubject, setCustomSubject] = useState(notifications[0]?.subject || 'મહિલા સત્સંગ સભા આયોજન');
  const [customBody, setCustomBody] = useState(notifications[0]?.body || '');

  // Confirmation Modal state for destructive email sending
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingSendPayload, setPendingSendPayload] = useState<{
    to: string;
    subject: string;
    body: string;
    sender: string;
    type?: EmailNotification['type'];
  } | null>(null);
  const [isSendingApi, setIsSendingApi] = useState(false);

  // UI feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sentSuccess, setSentSuccess] = useState<string | null>(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [activeTemplateCategory, setActiveTemplateCategory] = useState<string | null>(null);

  // Fetch Gmail Profile when user is authenticated
  const loadProfile = useCallback(async (token: string) => {
    try {
      setProfileLoading(true);
      const prof = await getGmailProfile(token);
      setGmailProfile(prof);
    } catch (err: any) {
      console.warn('Could not load Gmail profile:', err);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // Fetch Live Gmail Messages
  const loadLiveMessages = useCallback(async (token: string, mailbox: string, query: string) => {
    try {
      setIsLoadingMessages(true);
      const labelIds = [mailbox];
      const res = await listGmailMessages(token, {
        maxResults: 12,
        labelIds,
        q: query.trim() ? query.trim() : undefined
      });

      if (res.messages.length === 0) {
        setLiveMessages([]);
        setSelectedLiveMessage(null);
        return;
      }

      // Fetch details for each message
      const details = await Promise.all(
        res.messages.slice(0, 10).map(m => getGmailMessageDetails(token, m.id).catch(() => null))
      );

      const validDetails = details.filter((d): d is GmailMessageDetail => d !== null);
      setLiveMessages(validDetails);
      if (validDetails.length > 0) {
        setSelectedLiveMessage(validDetails[0]);
      } else {
        setSelectedLiveMessage(null);
      }
    } catch (err: any) {
      console.error('Failed to load live messages:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  // Update profile and messages when authToken is available
  useEffect(() => {
    if (authToken) {
      loadProfile(authToken);
      if (authUser?.email) {
        setSenderEmail(authUser.email);
      }
    } else {
      setGmailProfile(null);
      setLiveMessages([]);
    }
  }, [authToken, authUser, loadProfile]);

  // Load messages when mailbox or live search changes
  useEffect(() => {
    if (authToken && activeView === 'live_gmail') {
      loadLiveMessages(authToken, liveMailbox, liveSearchQuery);
    }
  }, [authToken, activeView, liveMailbox, liveSearchQuery, loadLiveMessages]);

  // Synchronize form when selectedNotif changes
  useEffect(() => {
    if (selectedNotif) {
      setCustomSubject(selectedNotif.subject);
      setCustomBody(selectedNotif.body);
      setSenderEmail(authUser?.email || selectedNotif.sender || DEFAULT_SENDER);
      if (selectedNotif.recipient && selectedNotif.recipient !== DEFAULT_RECIPIENT) {
        setRecipientChoice('manual');
        setManualRecipient(selectedNotif.recipient);
      } else {
        setRecipientChoice('default');
      }
    }
  }, [selectedNotif, authUser]);

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setAuthError(null);
      const res = await googleSignIn();
      if (res) {
        setSentSuccess('Google એકાઉન્ટ અને Gmail સફળતાપૂર્વક જોડાઈ ગયું!');
        setTimeout(() => setSentSuccess(null), 4000);
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setAuthError(err.message || 'Google સાઇન ઇન કરવામાં સમસ્યા આવી.');
    } finally {
      setIsSigningIn(false);
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await logout();
      setGmailProfile(null);
      setLiveMessages([]);
      setSelectedLiveMessage(null);
      setSentSuccess('સફળતાપૂર્વક લૉગ આઉટ થયા.');
      setTimeout(() => setSentSuccess(null), 3000);
    } catch (err: any) {
      console.error('Sign-out error:', err);
    }
  };

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

  const effectiveRecipient = recipientChoice === 'default' ? DEFAULT_RECIPIENT : manualRecipient.trim();

  // Initiate Send: Prompts user confirmation modal (MANDATORY SKILL REQUIREMENT)
  const initiateSendForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveRecipient || !customSubject.trim() || !customBody.trim()) return;

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

    setPendingSendPayload({
      to: effectiveRecipient,
      subject: customSubject.trim(),
      body: customBody.trim(),
      sender: authUser?.email || senderEmail || DEFAULT_SENDER,
      type: notifType
    });
    setConfirmModalOpen(true);
  };

  // Trigger send from a specific notification card
  const initiateSendNotificationDirect = (notif: EmailNotification) => {
    setPendingSendPayload({
      to: notif.recipient || DEFAULT_RECIPIENT,
      subject: notif.subject,
      body: notif.body,
      sender: authUser?.email || notif.sender || DEFAULT_SENDER,
      type: notif.type
    });
    setConfirmModalOpen(true);
  };

  // Execution after explicit user confirmation in modal
  const handleConfirmSend = async () => {
    if (!pendingSendPayload) return;

    setIsSendingApi(true);
    try {
      const token = await getAccessToken();

      if (token) {
        // Send via official Gmail REST API
        await sendGmailEmail(token, {
          to: pendingSendPayload.to,
          subject: pendingSendPayload.subject,
          body: pendingSendPayload.body,
          replyTo: pendingSendPayload.sender
        });

        // Record in app state
        onSendCustomEmail(
          pendingSendPayload.to,
          pendingSendPayload.subject,
          pendingSendPayload.body,
          pendingSendPayload.sender,
          pendingSendPayload.type
        );

        setSentSuccess(`Gmail API દ્વારા ${pendingSendPayload.to} પર ઈમેઈલ સફળતાપૂર્વક મોકલાઈ ગયો!`);
      } else {
        // If not connected to Google OAuth yet, save in portal & inform user
        onSendCustomEmail(
          pendingSendPayload.to,
          pendingSendPayload.subject,
          pendingSendPayload.body,
          pendingSendPayload.sender,
          pendingSendPayload.type
        );
        setSentSuccess(`સૂચના પોર્ટલમાં નોંધાઈ ગઈ! સત્તાવાર Gmail થી મોકલવા માટે ઉપર Google વડે સાઇન ઇન કરો.`);
      }
      setConfirmModalOpen(false);
      setPendingSendPayload(null);
    } catch (err: any) {
      console.error('Failed to send email:', err);
      alert(`Gmail મોકલવામાં ભૂલ: ${err.message || 'અજ્ઞાત ક્ષતિ'}`);
    } finally {
      setIsSendingApi(false);
      setTimeout(() => setSentSuccess(null), 5000);
    }
  };

  // Save as Draft in Gmail
  const handleSaveAsDraft = async () => {
    if (!effectiveRecipient || !customSubject.trim() || !customBody.trim()) return;

    try {
      setIsDrafting(true);
      const token = await getAccessToken();
      if (!token) {
        alert('Gmail ડ્રાફ્ટ સાચવવા માટે કૃપા કરીને પહેલા Google વડે સાઇન ઇન કરો.');
        return;
      }

      await createGmailDraft(token, {
        to: effectiveRecipient,
        subject: customSubject.trim(),
        body: customBody.trim(),
        replyTo: authUser?.email || senderEmail
      });

      setSentSuccess('આ સંદેશ આપના Gmail એકાઉન્ટમાં "Drafts" તરીકે સાચવી લેવાયો!');
      setTimeout(() => setSentSuccess(null), 4500);
    } catch (err: any) {
      console.error('Draft error:', err);
      alert(`ડ્રાફ્ટ સાચવવામાં ક્ષતિ: ${err.message}`);
    } finally {
      setIsDrafting(false);
    }
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

  // Pure category templates
  const loadTemplate = (category: 'sabha_donor' | 'sabha_no_donor' | 'donation' | 'jamanwar') => {
    setActiveTemplateCategory(category);
    if (category === 'sabha_donor') {
      setCustomSubject('રવિવારીય વિશેષ મહિલા સત્સંગ સભા & વચનામૃત રહસ્ય કથા');
      setCustomBody(
`શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય
સત્સંગ સભા આમંત્રણ પત્રિકા

જય સ્વામિનારાયણ સર્વ મહિલા મંડળ!

આગામી મહિલા સત્સંગ સભાનું આયોજન સફળતાપૂર્વક નક્કી થયેલ છે:

મુખ્ય વિગતો:
• સભાનું નામ: રવિવારીય વિશેષ મહિલા સત્સંગ સભા & વચનામૃત રહસ્ય કથા
• તારીખ & વાર: ${new Date().toISOString().split('T')[0]} (રવિવાર)
• સમયગાળો: બપોરે ૦૩:૦૦ થી ૦૫:૩૦ કલાકે
• મુખ્ય વક્તા: પૂજ્ય સાંખ્યયોગી કંચનબા
• હોદ્દો / પદવી: વરિષ્ઠ સાંખ્યયોગી વિદુષી બહેન
• આશ્રમ / કેન્દ્ર: શ્રી લક્ષ્મીનારાયણ દેવ મહિલા આશ્રમ, વડતાલ
• સહ-સંચાલિકા બહેનો: હેપ્પીબેન કાનાણી, રેખાબેન સાંગાણી, મીનાક્ષીબેન ગજેરા
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
મોકલનાર: ${authUser?.email || DEFAULT_SENDER}`
      );
    } else if (category === 'sabha_no_donor') {
      setCustomSubject('પવિત્ર એકાદશી ઉપવાસ મહિમા & શિક્ષાપત્રી સ્વાધ્યાય સભા');
      setCustomBody(
`શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય
સત્સંગ સભા આમંત્રણ પત્રિકા

જય સ્વામિનારાયણ સર્વ મહિલા મંડળ!

આગામી મહિલા સત્સંગ સભાનું આયોજન સફળતાપૂર્વક નક્કી થયેલ છે:

મુખ્ય વિગતો:
• સભાનું નામ: પવિત્ર એકાદશી ઉપવાસ મહિમા & શિક્ષાપત્રી સ્વાધ્યાય સભા
• તારીખ & વાર: ${new Date().toISOString().split('T')[0]} (મંગળવાર)
• સમયગાળો: બપોરે ૦૨:૩૦ થી ૦૫:૦૦ કલાકે
• મુખ્ય વક્તા: પૂજ્ય સાંખ્યયોગી હર્ષિદાબા
• હોદ્દો / પદવી: ધર્મવિદ્યા પ્રવીણા બહેન
• આશ્રમ / કેન્દ્ર: શ્રી સ્વામિનારાયણ મહિલા સંસ્કાર કેન્દ્ર, ભુજ-કચ્છ
• સહ-સંચાલિકા બહેનો: જાગૃતિબેન પટેલ, હંસાબેન વેકરીયા
• સભા યુનિફોર્મ: પીળા / કેસરી રંગની સાડી (સભા પરિધાન)
• સભા પ્રસાદ વાનગીઓ: સુખડી પ્રસાદ, બટાકા પૌંઆ, પંચામૃત
• સભા વિષય / રહસ્ય: શિક્ષાપત્રી શ્લોક ૭૯ થી ૮૪: મહિલા ભક્તો માટે સદાચાર અને ધર્મપાલન
• કીર્તન ભક્તિ: ધ્યાન અને થાળ કીર્તન આરાધના
• સભા સ્થળ: અક્ષર જ્યોત સભા હોલ
• અંદાજિત ઉપસ્થિતિ: ૪૦૦ બહેનો

તમામ બહેનોને નિયત યુનિફોર્મમાં સમયસર પધારવા ભાવભર્યું આમંત્રણ છે.

લી.
શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય સભા આયોજન સમિતિ
મોકલનાર: ${authUser?.email || DEFAULT_SENDER}`
      );
    } else if (category === 'donation') {
      setCustomSubject('દાન પાવતી સ્વીકૃતિ: શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય સેવા ભંડોળ');
      setCustomBody(
`શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય
સત્તાવાર સેવા ભંડોળ રસીદ સ્વીકૃતિ

જય સ્વામિનારાયણ!

શ્રી સ્વામિનારાયણ સંપ્રદાય મહિલા મંડળ સેવા ભંડોળમાં આપનું દાન સફળતાપૂર્વક સ્વીકારાયું છે:

મુખ્ય વિગતો:
• દાતાનું નામ: ${currentMember.firstName} ${currentMember.surname}
• દાન રકમ: ₹૨૧,૦૦૦
• સેવા હેતુ / કેટેગરી: ભક્તાણી સેવા / મહાપ્રસાદ
• ચૂકવણી મોડ: રોકડ
• તારીખ: ${new Date().toISOString().split('T')[0]}
• નોંધ: મહિલા સભા અર્પણ ભોગ પ્રસાદ સેવા

આપના નિઃસ્વાર્થ સહયોગ બદલ ખૂબ ખૂબ સાધુવાદ. શ્રીજી મહારાજ સદા આપના પરિવાર પર કૃપા વરસાવે.

લી.
શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય ભંડોળ સમિતિ
મોકલનાર: ${authUser?.email || DEFAULT_SENDER}`
      );
    } else if (category === 'jamanwar') {
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
મોકલનાર: ${authUser?.email || DEFAULT_SENDER}`
      );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-gujarati">
      {/* Confirmation Modal */}
      <GmailSendConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirmSend={handleConfirmSend}
        senderEmail={pendingSendPayload?.sender || senderEmail}
        recipientEmail={pendingSendPayload?.to || effectiveRecipient}
        subject={pendingSendPayload?.subject || customSubject}
        body={pendingSendPayload?.body || customBody}
        isSending={isSendingApi}
      />

      {/* Hero / Integration Status Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs">
              <Mail className="w-3.5 h-3.5 text-amber-200" />
              <span>Google Workspace • સત્તાવાર Gmail એકીકરણ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-serif-gujarati">
              Gmail કનેક્શન અને ઈમેઈલ વ્યવસ્થાપન કેન્દ્ર
            </h2>
            <p className="text-amber-100 text-sm leading-relaxed">
              સભા આમંત્રણો, દાન રસીદો અને જમણવાર કન્ફર્મેશન સીધા તમારા Gmail થી મોકલો, અને લાઈવ ઇનબૉક્સ સંદેશાઓ અહીંથી જ જુઓ.
            </p>
          </div>

          {/* Google Sign In / Account Status Card */}
          <div className="shrink-0 w-full md:w-auto bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            {authToken && authUser ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {authUser.photoURL ? (
                    <img src={authUser.photoURL} alt={authUser.displayName || ''} className="w-11 h-11 rounded-full border-2 border-amber-300" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-base">
                      {authUser.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-white text-sm">{authUser.displayName || 'Google વપરાશકર્તા'}</div>
                    <div className="text-xs text-amber-200 font-chirp">{authUser.email}</div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 mt-0.5">
                      <ShieldCheck className="w-3 h-3" /> Gmail સક્રિય
                    </span>
                  </div>
                </div>

                {gmailProfile && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/15 text-[11px]">
                    <div className="bg-black/20 rounded-lg p-1.5 text-center">
                      <span className="text-stone-300 block">કુલ સંદેશા</span>
                      <span className="font-bold text-white font-chirp">{gmailProfile.messagesTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="bg-black/20 rounded-lg p-1.5 text-center">
                      <span className="text-stone-300 block">થ્રેડ્સ</span>
                      <span className="font-bold text-white font-chirp">{gmailProfile.threadsTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSignOut}
                  className="w-full py-1.5 text-xs text-amber-100 hover:text-white hover:bg-white/10 rounded-lg border border-white/20 transition cursor-pointer"
                >
                  લૉગ આઉટ (Sign Out)
                </button>
              </div>
            ) : (
              <div className="space-y-2 text-center md:text-left">
                <div className="text-xs text-amber-100 mb-1">
                  લાઈવ Gmail વાપરવા માટે સાઇન ઇન કરો:
                </div>
                <GoogleSignInButton
                  onSignIn={handleGoogleSignIn}
                  isLoading={isSigningIn}
                  label="Gmail સાથે સાઇન ઇન કરો"
                />
                {authError && (
                  <div className="text-rose-200 text-xs mt-1 max-w-xs">{authError}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/20 overflow-x-auto">
          <button
            onClick={() => setActiveView('notifications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeView === 'notifications'
                ? 'bg-white text-stone-900 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>મંડળ સૂચના રેકોર્ડ્સ ({notifications.length})</span>
          </button>

          <button
            onClick={() => setActiveView('live_gmail')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeView === 'live_gmail'
                ? 'bg-white text-stone-900 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>લાઈવ Gmail ઇનબૉક્સ {authToken && '●'}</span>
          </button>

          <button
            onClick={() => setActiveView('compose')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeView === 'compose'
                ? 'bg-white text-stone-900 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>નવો ઈમેઈલ કંપોઝ & મોકલો</span>
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {sentSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-5 py-3.5 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs font-semibold">{sentSuccess}</div>
          <button
            onClick={() => setSentSuccess(null)}
            className="ml-auto text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* VIEW 1: LIVE GMAIL INBOX / SENT / DRAFTS */}
      {activeView === 'live_gmail' && (
        <div className="bg-white rounded-3xl border border-amber-200/80 shadow-md overflow-hidden">
          {!authToken ? (
            <div className="p-12 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Google એકાઉન્ટ સાઇન ઇન જરૂરી છે</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                તમારા અંગત અથવા સંપ્રદાયના Gmail ઇનબૉક્સના ઈમેઈલ સીધા અહીં જોવા અને નવો ઈમેઈલ મોકલવા માટે પરવાનગી આપો.
              </p>
              <div className="pt-2 flex justify-center">
                <GoogleSignInButton
                  onSignIn={handleGoogleSignIn}
                  isLoading={isSigningIn}
                  label="Sign in with Google"
                />
              </div>
            </div>
          ) : (
            <div>
              {/* Mailbox Sub-header */}
              <div className="p-4 bg-amber-50/50 border-b border-amber-200/70 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLiveMailbox('INBOX')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      liveMailbox === 'INBOX' ? 'bg-amber-600 text-white' : 'bg-white text-stone-700 hover:bg-amber-100'
                    }`}
                  >
                    ઇનબૉક્સ (Inbox)
                  </button>
                  <button
                    onClick={() => setLiveMailbox('SENT')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      liveMailbox === 'SENT' ? 'bg-amber-600 text-white' : 'bg-white text-stone-700 hover:bg-amber-100'
                    }`}
                  >
                    મોકલેલા (Sent)
                  </button>
                  <button
                    onClick={() => setLiveMailbox('DRAFT')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      liveMailbox === 'DRAFT' ? 'bg-amber-600 text-white' : 'bg-white text-stone-700 hover:bg-amber-100'
                    }`}
                  >
                    ડ્રાફ્ટ્સ (Drafts)
                  </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Gmail માં શોધો..."
                      value={liveSearchQuery}
                      onChange={(e) => setLiveSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                  <button
                    onClick={() => loadLiveMessages(authToken, liveMailbox, liveSearchQuery)}
                    disabled={isLoadingMessages}
                    className="p-2 text-stone-600 hover:text-amber-700 hover:bg-white rounded-xl border border-stone-200 cursor-pointer disabled:opacity-50"
                    title="રિફ્રેશ કરો"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Message List and Detail Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
                {/* Message List Column */}
                <div className="lg:col-span-5 border-r border-stone-200 overflow-y-auto max-h-[600px] divide-y divide-stone-100">
                  {isLoadingMessages ? (
                    <div className="p-8 text-center text-xs text-stone-500 space-y-2">
                      <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
                      <span>Gmail સંદેશાઓ આવી રહ્યા છે...</span>
                    </div>
                  ) : liveMessages.length === 0 ? (
                    <div className="p-8 text-center text-xs text-stone-500 space-y-1">
                      <Inbox className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                      <div className="font-semibold text-stone-700">કોઈ સંદેશા મળ્યા નથી</div>
                      <div>આ ફોલ્ડરમાં હજુ કોઈ ઈમેઈલ નથી.</div>
                    </div>
                  ) : (
                    liveMessages.map((msg) => (
                      <div
                        key={msg.id}
                        onClick={() => setSelectedLiveMessage(msg)}
                        className={`p-3.5 transition cursor-pointer text-xs ${
                          selectedLiveMessage?.id === msg.id
                            ? 'bg-amber-50/80 border-l-4 border-amber-600'
                            : 'hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`font-semibold truncate max-w-[180px] ${msg.isUnread ? 'text-amber-950 font-bold' : 'text-stone-700'}`}>
                            {msg.from || '(અજ્ઞાત મોકલનાર)'}
                          </span>
                          <span className="text-[10px] text-stone-400 font-chirp shrink-0">
                            {msg.date ? new Date(msg.date).toLocaleDateString('gu-IN') : ''}
                          </span>
                        </div>
                        <div className={`text-xs truncate ${msg.isUnread ? 'font-bold text-stone-900' : 'font-medium text-stone-800'}`}>
                          {msg.subject}
                        </div>
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">
                          {msg.snippet}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Detail Column */}
                <div className="lg:col-span-7 p-6 overflow-y-auto max-h-[600px] flex flex-col justify-between">
                  {selectedLiveMessage ? (
                    <div className="space-y-4">
                      <div className="border-b border-stone-200 pb-4 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-base font-bold text-stone-900">
                            {selectedLiveMessage.subject}
                          </h3>
                          <a
                            href={`https://mail.google.com/mail/u/0/#inbox/${selectedLiveMessage.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 font-medium cursor-pointer"
                          >
                            <span>Gmail પર જુઓ</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <div className="text-xs text-stone-600 space-y-1">
                          <div><span className="font-semibold text-stone-500">મોકલનાર:</span> {selectedLiveMessage.from}</div>
                          <div><span className="font-semibold text-stone-500">પ્રાપ્તકર્તા:</span> {selectedLiveMessage.to}</div>
                          <div><span className="font-semibold text-stone-500">તારીખ:</span> {selectedLiveMessage.date}</div>
                        </div>
                      </div>

                      {/* Rendered Body */}
                      <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs text-stone-800 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto font-mono">
                        {selectedLiveMessage.bodyText || selectedLiveMessage.snippet || 'સંદેશા સામગ્રી ઉપલબ્ધ નથી.'}
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => {
                            setCustomSubject(`Re: ${selectedLiveMessage.subject}`);
                            setRecipientChoice('manual');
                            setManualRecipient(selectedLiveMessage.from?.match(/<([^>]+)>/)?.[1] || selectedLiveMessage.from || '');
                            setActiveView('compose');
                          }}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>જવાબ આપો (Reply)</span>
                        </button>
                        <button
                          onClick={() => handleCopy(selectedLiveMessage.bodyText || '', selectedLiveMessage.id)}
                          className="px-3 py-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedId === selectedLiveMessage.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>કોપી લખાણ</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 text-xs text-stone-400">
                      વિગતો જોવા માટે ડાબી બાજુથી કોઈ ઈમેઈલ પસંદ કરો.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: MANDAL NOTIFICATIONS LIST (EXISTING RICH CARDS + ONE-CLICK GMAIL API DISPATCH) */}
      {activeView === 'notifications' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Notification Feed */}
          <div className="lg:col-span-5 space-y-4">
            {/* Search & Filter Controls */}
            <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-xs space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="સૂચનાઓમાં શોધો..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {/* Filter pills */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  { id: 'all', label: 'બધા' },
                  { id: 'sabha_scheduled', label: 'મહિલા સભા' },
                  { id: 'donation_received', label: 'દાન' },
                  { id: 'jamanwar_booked', label: 'જમણવાર' },
                  { id: 'member_registration', label: 'સભ્ય' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterType(tab.id)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer text-[11px] ${
                      filterType === tab.id
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-amber-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List of items */}
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {filteredNotifications.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-xs text-stone-500 border border-amber-200/80">
                  કોઈ સૂચના મળી નથી.
                </div>
              ) : (
                filteredNotifications.map((notif) => {
                  const Icon = getIconForType(notif.type);
                  const isSelected = selectedNotif?.id === notif.id;

                  return (
                    <div
                      key={notif.id}
                      onClick={() => setSelectedNotif(notif)}
                      className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer text-xs shadow-xs relative ${
                        isSelected
                          ? 'border-amber-500 ring-2 ring-amber-400/40 bg-amber-50/30'
                          : 'border-amber-200/70 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-stone-800 text-[11px]">
                            {getTypeLabel(notif.type)}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 font-chirp">
                          {notif.date} • {notif.time}
                        </span>
                      </div>

                      <h4 className="font-bold text-stone-900 line-clamp-1 mb-1">
                        {notif.subject}
                      </h4>
                      <p className="text-stone-500 text-[11px] line-clamp-2 leading-relaxed">
                        {notif.body}
                      </p>

                      <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500">
                        <span className="font-chirp truncate max-w-[150px]">To: {notif.recipient}</span>
                        <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>રેકોર્ડ સિંક</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Notification Detail & Direct Send */}
          <div className="lg:col-span-7">
            {selectedNotif ? (
              <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-md space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                        {getTypeLabel(selectedNotif.type)}
                      </span>
                      <span className="text-xs text-stone-400 font-chirp">{selectedNotif.date} • {selectedNotif.time}</span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 mt-1">
                      {selectedNotif.subject}
                    </h3>
                  </div>

                  {/* Primary Direct Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => initiateSendNotificationDirect(selectedNotif)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Gmail થી મોકલો</span>
                    </button>
                    <a
                      href={getGmailComposeUrl(selectedNotif.recipient, selectedNotif.subject, selectedNotif.body)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl border border-stone-200 cursor-pointer"
                      title="Gmail Web પર ખોલો"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-50 rounded-2xl p-4 border border-stone-200">
                  <div>
                    <span className="text-stone-500 block">મોકલનાર સરનામું (From):</span>
                    <span className="font-chirp font-semibold text-stone-800">
                      {authUser?.email || selectedNotif.sender || DEFAULT_SENDER}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">સત્તાવાર પ્રાપ્તકર્તા (To):</span>
                    <span className="font-chirp font-bold text-amber-900">
                      {selectedNotif.recipient}
                    </span>
                  </div>
                </div>

                {/* Message Body preview */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-stone-600">સત્તાવાર સંદેશા લખાણ:</span>
                    <button
                      onClick={() => handleCopy(selectedNotif.body, selectedNotif.id)}
                      className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === selectedNotif.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>લખાણ કોપી કરો</span>
                    </button>
                  </div>
                  <div className="bg-amber-50/30 border border-amber-200/80 rounded-2xl p-5 text-xs text-stone-800 font-mono whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                    {selectedNotif.body}
                  </div>
                </div>

                {/* Footer Switcher */}
                <div className="pt-2 flex items-center justify-between text-xs text-stone-500">
                  <span>આ સંદેશામાં ફેરફાર કરવો છે?</span>
                  <button
                    onClick={() => {
                      setCustomSubject(selectedNotif.subject);
                      setCustomBody(selectedNotif.body);
                      setActiveView('compose');
                    }}
                    className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>કંપોઝરમાં એડિટ કરો</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center text-xs text-stone-400 border border-amber-200/80">
                સૂચના વિગતો જોવા માટે ડાબી બાજુથી સિલેક્ટ કરો.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: COMPOSE & SEND EMAIL */}
      {activeView === 'compose' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <FileEdit className="w-5 h-5 text-amber-600" />
                <span>નવો Gmail સંદેશો કંપોઝ કરો</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                મંડળના સભ્યો અથવા યજમાનોને વિગતવાર ઈમેઈલ સીધા મોકલો
              </p>
            </div>

            {/* Quick Category Template Buttons */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              <span className="text-stone-400 self-center text-[11px] mr-1">ટેમ્પલેટ:</span>
              <button
                type="button"
                onClick={() => loadTemplate('sabha_donor')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer text-[11px] ${
                  activeTemplateCategory === 'sabha_donor' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-amber-100'
                }`}
              >
                સભા (દાતા સહિત)
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('sabha_no_donor')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer text-[11px] ${
                  activeTemplateCategory === 'sabha_no_donor' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-amber-100'
                }`}
              >
                સભા (સામાન્ય)
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('donation')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer text-[11px] ${
                  activeTemplateCategory === 'donation' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-amber-100'
                }`}
              >
                દાન રસીદ
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('jamanwar')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer text-[11px] ${
                  activeTemplateCategory === 'jamanwar' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-amber-100'
                }`}
              >
                જમણવાર
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={initiateSendForm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sender address */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  મોકલનાર ઈમેઈલ (From):
                </label>
                <input
                  type="email"
                  value={authUser?.email || senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-chirp focus:outline-hidden focus:border-amber-500"
                  readOnly={Boolean(authUser?.email)}
                />
                <span className="text-[10px] text-stone-400 mt-0.5 block">
                  {authUser?.email ? 'અધિકૃત Google એકાઉન્ટ સરનામું' : 'સત્તાવાર સંપ્રદાય પ્રેષક'}
                </span>
              </div>

              {/* Recipient Selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  પ્રાપ્તકર્તા ઈમેઈલ (To):
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={recipientChoice === 'default'}
                        onChange={() => setRecipientChoice('default')}
                        className="text-amber-600"
                      />
                      <span>સત્તાવાર ({DEFAULT_RECIPIENT})</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={recipientChoice === 'manual'}
                        onChange={() => setRecipientChoice('manual')}
                        className="text-amber-600"
                      />
                      <span>અન્ય સરનામું</span>
                    </label>
                  </div>

                  {recipientChoice === 'manual' && (
                    <input
                      type="email"
                      required
                      placeholder="ઉદા. devotee@example.com"
                      value={manualRecipient}
                      onChange={(e) => setManualRecipient(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-xl font-chirp focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                ઈમેઈલ શીર્ષક (Subject):
              </label>
              <input
                type="text"
                required
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-white border border-stone-200 rounded-xl font-semibold focus:outline-hidden focus:border-amber-500"
                placeholder="સંદેશાનો સત્તાવાર વિષય લખો..."
              />
            </div>

            {/* Body */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-700">
                  ઈમેઈલ સંદેશ સામગ્રી (Body):
                </label>
                <button
                  type="button"
                  onClick={() => handleCopy(customBody, 'custom-body')}
                  className="text-xs text-amber-700 hover:text-amber-900 font-medium flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === 'custom-body' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>લખાણ કોપી</span>
                </button>
              </div>
              <textarea
                required
                rows={10}
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                className="w-full p-4 text-xs font-mono bg-stone-50 border border-stone-200 rounded-2xl focus:outline-hidden focus:border-amber-500 leading-relaxed"
                placeholder="સંપૂર્ણ વિગતો સાથે ઈમેઈલ લખાણ દાખલ કરો..."
              />
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-stone-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>ઈમેઈલ મોકલતા પહેલા પુષ્ટિ ડાયલોગ (Confirmation Dialog) પ્રદર્શિત થશે.</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {authToken && (
                  <button
                    type="button"
                    onClick={handleSaveAsDraft}
                    disabled={isDrafting}
                    className="px-4 py-2.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer disabled:opacity-50"
                  >
                    {isDrafting ? 'સાચવી રહ્યું છે...' : 'Gmail Drafts માં સાચવો'}
                  </button>
                )}

                <a
                  href={getGmailComposeUrl(effectiveRecipient, customSubject, customBody)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Gmail Web માં ખોલો</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>સત્તાવાર મોકલો (Send Email)</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
