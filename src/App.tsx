import { useState } from 'react';
import { 
  MahilaMember, 
  DonationRecord, 
  JamanwarPlan, 
  SabhaEvent, 
  EmailNotification 
} from './types';
import { 
  INITIAL_MEMBERS, 
  INITIAL_DONATIONS, 
  INITIAL_JAMANWAR_PLANS, 
  INITIAL_SABHA_EVENTS, 
  INITIAL_OFFICERS, 
  INITIAL_NOTIFICATIONS 
} from './data/initialData';

import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import MemberProfileView from './components/MemberProfileView';
import DonationFundView from './components/DonationFundView';
import JamanwarView from './components/JamanwarView';
import SabhaScheduleView from './components/SabhaScheduleView';
import SampradayDirectoryView from './components/SampradayDirectoryView';
import GmailUpdateCenter from './components/GmailUpdateCenter';

import DonationReceiptModal from './components/DonationReceiptModal';
import NewMemberModal from './components/NewMemberModal';
import NewDonationModal from './components/NewDonationModal';
import NewJamanwarModal from './components/NewJamanwarModal';
import NewSabhaModal from './components/NewSabhaModal';

import { Sparkles, Mail, CheckCircle2, Heart } from 'lucide-react';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Core Data States
  const [members, setMembers] = useState<MahilaMember[]>(INITIAL_MEMBERS);
  const [currentMemberId, setCurrentMemberId] = useState<string>('MEMBER-001');
  const [donations, setDonations] = useState<DonationRecord[]>(INITIAL_DONATIONS);
  const [jamanwars, setJamanwars] = useState<JamanwarPlan[]>(INITIAL_JAMANWAR_PLANS);
  const [sabhas, setSabhas] = useState<SabhaEvent[]>(INITIAL_SABHA_EVENTS);
  const [officers] = useState(INITIAL_OFFICERS);
  const [notifications, setNotifications] = useState<EmailNotification[]>(INITIAL_NOTIFICATIONS);

  // Modals & Popups
  const [activeReceiptDonation, setActiveReceiptDonation] = useState<DonationRecord | null>(null);
  const [showNewMemberModal, setShowNewMemberModal] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showJamanwarModal, setShowJamanwarModal] = useState(false);
  const [showSabhaModal, setShowSabhaModal] = useState(false);

  // Temporary notification toast banner
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);

  const showToast = (title: string, subtitle: string) => {
    setToastMessage({ title, subtitle });
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  // Helper to append a Gmail update
  const addGmailNotification = (
    subject: string, 
    body: string, 
    type: EmailNotification['type'],
    recipient: string = 'bhaktidevani81@gmail.com',
    sender: string = 'bhaktanisamparadayofficial@gmail.com'
  ) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('gu-IN', { hour: '2-digit', minute: '2-digit' });

    const newNotif: EmailNotification = {
      id: `NOTIF-${Date.now()}`,
      sender,
      recipient,
      subject,
      body,
      date: dateStr,
      time: timeStr,
      type,
      status: 'Delivered'
    };

    setNotifications(prev => [newNotif, ...prev]);
    showToast(
      'Gmail અપડેટ મોકલાયું!',
      `${recipient} પર "${subject}" ઈમેઈલ સૂચના સફળતાપૂર્વક મોકલાઈ.`
    );
  };

  // Current Member Object
  const currentMember = members.find(m => m.id === currentMemberId) || members[0];

  // User Total Contribution
  const currentMemberContribution = donations
    .filter(d => d.memberId === currentMember.id)
    .reduce((sum, d) => sum + d.amount, 0);

  // Handlers
  const handleAddMember = (newMember: MahilaMember) => {
    setMembers(prev => [newMember, ...prev]);
    setCurrentMemberId(newMember.id);
    setShowNewMemberModal(false);

    // Automatic Gmail Notification
    addGmailNotification(
      `નવી સભ્ય નોંધણી: ${newMember.firstName} ${newMember.surname} (${newMember.city})`,
      `શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય
સત્તાવાર સભ્ય નોંધણી પ્રમાણીકરણ

જય સ્વામિનારાયણ!

સ્વામિનારાયણ મહિલા સંપ્રદાય પોર્ટલ પર નવા સભ્યશ્રીની નોંધણી સફળતાપૂર્વક થયેલ છે:

મુખ્ય વિગતો:
• પૂરું નામ: ${newMember.firstName} ${newMember.surname}
• પિતાનું નામ: ${newMember.fatherName}
• પતિનું નામ: ${newMember.husbandName || '-'}
• માતાનું નામ: ${newMember.motherName}
• ઉંમર: ${newMember.age} વર્ષ
• સરનામું: ${newMember.address}, ${newMember.city}
• સંપર્ક ફોન: ${newMember.phone}
• ઈમેઈલ: ${newMember.email || '-'}
• વ્યવસાય: ${newMember.occupation}
• વાર્ષિક આવક: ${newMember.annualIncome} (${newMember.incomeType})
• સભ્ય નંબર: ${newMember.memberNumber}
• હોદ્દો: ${newMember.mandalRole}

સંપ્રદાયના સત્સંગ પરિવારમાં આપનું હાર્દિક સ્વાગત છે.

લી.
શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય સભ્યપદ કાર્યાલય
મોકલનાર: bhaktanisamparadayofficial@gmail.com`,
      'member_registration',
      'bhaktidevani81@gmail.com'
    );
  };

  const handleUpdateMember = (updated: MahilaMember) => {
    setMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
    showToast('પ્રોફાઇલ અપડેટ થઈ!', 'સભ્ય અને પરિવારની વિગતો સાચવી લેવાઈ છે.');

    const familySummary = updated.familyMembers && updated.familyMembers.length > 0
      ? updated.familyMembers.map((f, i) => `${i + 1}. ${f.name} (${f.relation}) - ઉંમર: ${f.age} વર્ષ - વ્યવસાય: ${f.occupation || '-'}`).join('\n')
      : 'કોઈ અન્ય સભ્ય નોંધાયેલ નથી';

    addGmailNotification(
      `પ્રોફાઇલ અને પરિવાર વિગતો અપડેટ: ${updated.firstName} ${updated.surname}`,
      `શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય
સભ્ય & પારિવારિક પ્રોફાઇલ અપડેટ સૂચના

જય સ્વામિનારાયણ!

સભ્ય ${updated.firstName} ${updated.surname} ની પ્રોફાઇલ તથા પારિવારિક સભ્યોની માહિતી સફળતાપૂર્વક અપડેટ કરવામાં આવી છે.

મુખ્ય વિગતો:
• સભ્ય નામ: ${updated.firstName} ${updated.surname}
• શહેર: ${updated.city}
• સંપર્ક: ${updated.phone}
• કુલ પારિવારિક સભ્યો: ${updated.familyMembers.length}

પરિવારના સભ્યોની યાદી:
${familySummary}

લી.
શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય રજિસ્ટ્રાર
મોકલનાર: bhaktanisamparadayofficial@gmail.com`,
      'family_added',
      'bhaktidevani81@gmail.com'
    );
  };

  const handleAddDonation = (newDonation: DonationRecord) => {
    setDonations(prev => [newDonation, ...prev]);
    setShowDonateModal(false);
    setActiveReceiptDonation(newDonation);

    // Automatic Gmail Notification
    addGmailNotification(
      `દાન પાવતી સ્વીકૃતિ: ₹${newDonation.amount.toLocaleString('en-IN')} (${newDonation.category} - રસીદ: ${newDonation.receiptNo})`,
      `શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય
સત્તાવાર સેવા ભંડોળ રસીદ સ્વીકૃતિ

જય સ્વામિનારાયણ!

શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય સેવા ભંડોળમાં આપનું દાન સહર્ષ સ્વીકારાયું છે.

મુખ્ય વિગતો:
• રસીદ નંબર: ${newDonation.receiptNo}
• દાતાનું નામ: ${newDonation.donorName}
• દાન રકમ: ₹${newDonation.amount.toLocaleString('en-IN')}
• સેવા કેટેગરી: ${newDonation.category}
• ચૂકવણી મોડ: ${newDonation.paymentMode}
• તારીખ & સમય: ${newDonation.date} • ${newDonation.time}
• ટ્રાન્ઝેક્શન રેફરન્સ: ${newDonation.transactionRef || 'N/A'}
• વિશેષ હેતુ / નોંધ: ${newDonation.purposeNote}

શ્રીજી મહારાજ આપના પરિવાર પર અખંડ કૃપા વરસાવે અને સેવા ભક્તિમાં ઉત્તરોત્તર વૃદ્ધિ કરે.

લી.
શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય ખજાનચી & સેવા ભંડોળ સમિતિ
મોકલનાર: bhaktanisamparadayofficial@gmail.com`,
      'donation_received',
      'bhaktidevani81@gmail.com'
    );
  };

  const handleAddJamanwar = (newPlan: JamanwarPlan) => {
    setJamanwars(prev => [newPlan, ...prev]);
    setShowJamanwarModal(false);

    // Automatic Gmail Notification
    const menuSummary = newPlan.menu.map(m => `• ${m.category}: ${m.items.join(', ')}`).join('\n');
    addGmailNotification(
      `નવો જમણવાર & મહાપ્રસાદ કન્ફર્મેશન: ${newPlan.occasion} (યજમાન: ${newPlan.hostName})`,
      `શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય
સત્તાવાર જમણવાર આયોજન કન્ફર્મેશન

જય સ્વામિનારાયણ!

શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાયમાં પવિત્ર જમણવાર સેવાનું આયોજન સફળતાપૂર્વક કન્ફર્મ થયેલ છે:

મુખ્ય વિગતો:
• પ્રસંગ: ${newPlan.occasion}
• યજમાન: ${newPlan.hostName}
• તારીખ & સમય: ${newPlan.date} • ${newPlan.time}
• ભોજન પ્રકાર: ${newPlan.mealType}
• સેવા રકમ: ₹${newPlan.amount.toLocaleString('en-IN')}
• અંદાજિત હરિભક્તો / મહેમાનો: ${newPlan.approxGuests}
• સ્થળ / હોલ: ${newPlan.locationHall}
• રસોઈ ટીમ: ${newPlan.rasoiyaTeam}
• સંચાલિકા બહેન: ${newPlan.inchargeSister}

વાનગીઓનું આયોજન (મેનુ):
${menuSummary}

આયોજન વિશેષ નોંધ:
${newPlan.notes || 'શુદ્ધ સાત્વિક અને નિયમબદ્ધ રસોઈ વ્યવસ્થા.'}

લી.
શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય જમણવાર સમિતિ
મોકલનાર: bhaktanisamparadayofficial@gmail.com`,
      'jamanwar_booked',
      'bhaktidevani81@gmail.com'
    );
  };

  const handleAddSabha = (
    newSabha: SabhaEvent,
    prasadExpenseInfo?: { amount: number; note: string; donorName?: string; linkedDonationId?: string }
  ) => {
    setSabhas(prev => [newSabha, ...prev]);
    setShowSabhaModal(false);

    // If prasad has an expense amount, record it as a deduction from fund
    if (prasadExpenseInfo && prasadExpenseInfo.amount > 0) {
      const expenseDonationRecord: DonationRecord = {
        id: `EXPENSE-${Date.now()}`,
        receiptNo: `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
        memberId: currentMember.id,
        donorName: prasadExpenseInfo.donorName || 'સભા પ્રસાદ વપરાશ (ભંડોળ)',
        amount: prasadExpenseInfo.amount,
        category: 'ભક્તાણી સેવા',
        paymentMode: 'રોકડ',
        date: newSabha.date,
        time: newSabha.time.split(' ')[1] || '૧૨:૦૦ PM',
        transactionRef: `SABHA-PRASAD-${newSabha.id.slice(-4)}`,
        purposeNote: prasadExpenseInfo.note,
        isVerified: true,
        isExpense: true // Deducted from total community fund
      };

      setDonations(prev => [expenseDonationRecord, ...prev]);

      showToast(
        'સભા & પ્રસાદ ભંડોળ નોંધાયું!',
        `સભા આયોજિત થઈ અને પ્રસાદ પેટે ₹${prasadExpenseInfo.amount.toLocaleString('en-IN')} સેવા ભંડોળમાંથી બાદ થયા.`
      );
    } else {
      showToast('સભા આયોજિત થઈ!', `${newSabha.title} સફળતાપૂર્વક શેડ્યૂલ થઈ.`);
    }

    // Automatic Gmail Notification
    const hasDonor = newSabha.prasadSource === 'donation' && Boolean(newSabha.prasadDonorName || prasadExpenseInfo?.donorName);
    const donorName = newSabha.prasadDonorName || prasadExpenseInfo?.donorName || '';
    const donorAmount = newSabha.prasadDonorAmount || prasadExpenseInfo?.amount || 0;

    let prasadLines = '';
    if (hasDonor) {
      const dishes = newSabha.prasadMenu && newSabha.prasadMenu.length > 0 
        ? newSabha.prasadMenu.join(', ') 
        : 'શુદ્ધ સાત્વિક પ્રસાદ';
      prasadLines = `\n• પ્રસાદ અર્પણ દાતાશ્રી: ${donorName}\n• પ્રસાદ અર્પણ સેવા રકમ: ₹${donorAmount.toLocaleString('en-IN')}\n• સભા પ્રસાદ વાનગીઓ: ${dishes}`;
    } else {
      const dishes = newSabha.prasadMenu && newSabha.prasadMenu.length > 0 
        ? newSabha.prasadMenu.join(', ') 
        : 'શુદ્ધ સાત્વિક પ્રસાદ વ્યવસ્થા';
      const countNote = newSabha.memberCount ? ` (${newSabha.memberCount} બહેનો માટે)` : '';
      prasadLines = `\n• સભા પ્રસાદ વાનગીઓ: ${dishes}${countNote}`;
    }

    const uniformDetails = newSabha.uniform ? `\n• સભા યુનિફોર્મ (ડ્રેસકોડ): ${newSabha.uniform}` : '';

    const sabhaEmailSubject = hasDonor
      ? `મહિલા સત્સંગ સભા & પ્રસાદ સેવા: ${newSabha.title} (પ્રસાદ દાતા: ${donorName} - ₹${donorAmount.toLocaleString('en-IN')})`
      : `મહિલા સત્સંગ સભા આયોજન: ${newSabha.title} (${newSabha.date} - ${newSabha.dayOfWeek || ''})`;

    addGmailNotification(
      sabhaEmailSubject,
      `શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય
સત્સંગ સભા આમંત્રણ પત્રિકા

જય સ્વામિનારાયણ સર્વ મહિલા મંડળ!

આગામી સત્સંગ સભાનું આયોજન સફળતાપૂર્વક નક્કી થયેલ છે:

મુખ્ય વિગતો:
• સભાનું નામ: ${newSabha.title}
• તારીખ & વાર: ${newSabha.date} (${newSabha.dayOfWeek || ''})
• સમયગાળો: ${newSabha.time}
• મુખ્ય વક્તા: ${newSabha.conductedBy.name} (${newSabha.conductedBy.title}, ${newSabha.conductedBy.ashramOrCity})${uniformDetails}${prasadLines}
• સભા વિષય / રહસ્ય: ${newSabha.topic}
• કીર્તન ભક્તિ: ${newSabha.kirtanBhakti}
• સભા સ્થળ: ${newSabha.venue}
• અંદાજિત ઉપસ્થિતિ: ${newSabha.expectedAttendees} બહેનો

તમામ બહેનોને નિયત યુનિફોર્મમાં સમયસર પધારવા ભાવભર્યું આમંત્રણ છે.

લી.
શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય સભા આયોજન સમિતિ
મોકલનાર: bhaktanisamparadayofficial@gmail.com`,
      'sabha_scheduled',
      'bhaktidevani81@gmail.com'
    );
  };

  const handleToggleRsvp = (sabhaId: string) => {
    setSabhas(prev => prev.map(s => {
      if (s.id === sabhaId) {
        const isRsvpd = !s.isUserRsvpd;
        const countDiff = isRsvpd ? 1 : -1;
        if (isRsvpd) {
          showToast('હાજરી નોંધાઈ ગઈ!', `${s.title}માં આપની હાજરી કન્ફર્મ થઈ.`);
        }
        return {
          ...s,
          isUserRsvpd: isRsvpd,
          rsvpCount: Math.max(0, s.rsvpCount + countDiff)
        };
      }
      return s;
    }));
  };

  return (
    <div className="min-h-screen bg-[#fdfaf6] text-stone-800 flex flex-col font-gujarati">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-400/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-amber-300">{toastMessage.title}</div>
            <div className="text-stone-300 font-chirp mt-0.5">{toastMessage.subtitle}</div>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-white ml-2 text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        members={members}
        currentMember={currentMember}
        setCurrentMemberId={setCurrentMemberId}
        onOpenNewMemberModal={() => setShowNewMemberModal(true)}
        onOpenDonateModal={() => setShowDonateModal(true)}
        onOpenJamanwarModal={() => setShowJamanwarModal(true)}
        notifications={notifications}
      />

      {/* Main Body Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <DashboardOverview
            currentMember={currentMember}
            donations={donations}
            jamanwars={jamanwars}
            sabhas={sabhas}
            onNavigateTab={setCurrentTab}
            onOpenDonateModal={() => setShowDonateModal(true)}
            onOpenJamanwarModal={() => setShowJamanwarModal(true)}
            onOpenAddFamilyModal={() => setCurrentTab('profile')}
            onViewReceipt={(d) => setActiveReceiptDonation(d)}
          />
        )}

        {currentTab === 'profile' && (
          <MemberProfileView
            member={currentMember}
            totalContributed={currentMemberContribution}
            onUpdateMember={handleUpdateMember}
            onOpenNewMemberModal={() => setShowNewMemberModal(true)}
            onOpenDonateModal={() => setShowDonateModal(true)}
          />
        )}

        {currentTab === 'donations' && (
          <DonationFundView
            donations={donations}
            currentMember={currentMember}
            onOpenDonateModal={() => setShowDonateModal(true)}
            onViewReceipt={(d) => setActiveReceiptDonation(d)}
          />
        )}

        {currentTab === 'jamanwar' && (
          <JamanwarView
            jamanwars={jamanwars}
            currentMember={currentMember}
            onOpenJamanwarModal={() => setShowJamanwarModal(true)}
            onOpenDonateModal={() => setShowDonateModal(true)}
          />
        )}

        {currentTab === 'sabha' && (
          <SabhaScheduleView
            sabhas={sabhas}
            currentMember={currentMember}
            onToggleRsvp={handleToggleRsvp}
            onOpenNewSabhaModal={() => setShowSabhaModal(true)}
          />
        )}

        {currentTab === 'directory' && (
          <SampradayDirectoryView
            officers={officers}
            members={members}
            onSelectMember={(id) => {
              setCurrentMemberId(id);
              setCurrentTab('profile');
            }}
            onOpenNewMemberModal={() => setShowNewMemberModal(true)}
          />
        )}

        {currentTab === 'gmail' && (
          <GmailUpdateCenter
            notifications={notifications}
            currentMember={currentMember}
            onSendCustomEmail={(to, su, bo, sender, type) => {
              addGmailNotification(su, bo, type || 'sabha_scheduled', to, sender);
            }}
          />
        )}
      </main>

      {/* Sacred Footer */}
      <footer className="bg-stone-900 text-stone-300 border-t border-amber-900/40 py-10 font-gujarati no-print mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-stone-800 pb-6 text-center md:text-left">
            <div className="flex items-center gap-3.5 justify-center md:justify-start">
              <div className="w-13 h-13 rounded-2xl bg-white p-1 shrink-0 flex items-center justify-center border-2 border-amber-400/40 shadow-sm">
                <img 
                  src="/baps-logo.png" 
                  alt="BAPS Swaminarayan Sanstha Logo" 
                  className="w-full h-full object-contain bg-white rounded-xl" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <div>
                <div className="text-xl font-bold text-amber-400 font-serif-gujarati">
                  શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય મંડળ
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  સર્વ મહિલા આધ્યાત્મિક જાગૃતિ, સાત્વિક જમણવાર સેવા અને કલ્યાણકારી પ્રવૃત્તિઓ
                </p>
              </div>
            </div>
            <div className="text-xs text-stone-400 font-chirp text-center md:text-right">
              <div>મોકલનાર: bhaktanisamparadayofficial@gmail.com</div>
              <div>પ્રાપ્તકર્તા: bhaktidevani81@gmail.com</div>
              <div className="text-emerald-400 font-semibold mt-0.5">● Gmail Integration Live</div>
            </div>
          </div>

          <div className="text-center text-xs text-stone-500 font-serif-gujarati">
            "સહજાનંદ સ્વામી અંતર્યામી, દયાળુ સ્વામી દયા કરો • શ્રીજી મહારાજ સદા સર્વદા સહાયક રહે."
          </div>

          <div className="text-center text-[11px] text-stone-600 font-chirp">
            © 2026 Shree Swaminarayan Mahila Sampraday Portal. All rights reserved.
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {activeReceiptDonation && (
        <DonationReceiptModal
          donation={activeReceiptDonation}
          member={members.find(m => m.id === activeReceiptDonation.memberId)}
          onClose={() => setActiveReceiptDonation(null)}
        />
      )}

      {showNewMemberModal && (
        <NewMemberModal
          members={members}
          onClose={() => setShowNewMemberModal(false)}
          onAddMember={handleAddMember}
        />
      )}

      {showDonateModal && (
        <NewDonationModal
          currentMember={currentMember}
          members={members}
          onClose={() => setShowDonateModal(false)}
          onAddDonation={handleAddDonation}
        />
      )}

      {showJamanwarModal && (
        <NewJamanwarModal
          currentMember={currentMember}
          members={members}
          onClose={() => setShowJamanwarModal(false)}
          onAddJamanwar={handleAddJamanwar}
        />
      )}

      {showSabhaModal && (
        <NewSabhaModal
          currentMember={currentMember}
          donations={donations}
          onClose={() => setShowSabhaModal(false)}
          onAddSabha={handleAddSabha}
        />
      )}
    </div>
  );
}
