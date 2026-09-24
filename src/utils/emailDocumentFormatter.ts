import { MahilaMember, DonationRecord, JamanwarPlan, SabhaEvent } from '../types';
import { amountToGujaratiWords } from './numberToGujaratiWords';

/**
 * Creates a complete, beautifully structured Digital Invoice / Bill / Member Card 
 * directly embedded into the email message body.
 * This eliminates the need for the user to manually download a PDF and attach it to Gmail!
 */

export function buildDonationEmailContent(
  donation: DonationRecord,
  member?: MahilaMember
): { subject: string; body: string } {
  const memNum = member?.memberNumber;
  const prefix = memNum ? `[સભ્ય નં: ${memNum}]` : `[નામ: ${donation.donorName}]`;
  const subject = `${prefix} દાન પાવતી & ઇનવોઇસ: ${donation.receiptNo} - ${donation.donorName} (₹${donation.amount.toLocaleString('en-IN')})`;

  const words = amountToGujaratiWords(donation.amount);

  const body = `============================================================
              શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય
     સત્તાવાર સેવા ભંડોળ દાન પાવતી & ઇનવોઇસ (DIGITAL INVOICE)
============================================================
${memNum ? `• સભ્ય નંબર: #${memNum}` : `• દાતાશ્રી: ${donation.donorName}`}
• ઇનવોઇસ / રસીદ નંબર: ${donation.receiptNo}
• તારીખ & સમય: ${donation.date} • ${donation.time}
• દાતાનું પૂરું નામ: ${donation.donorName}
• સેવા કેટેગરી (Fund): ${donation.category}
• ચૂકવણી પદ્ધતિ (Mode): ${donation.paymentMode} ${donation.transactionRef ? `(${donation.transactionRef})` : ''}
${member?.phone ? `• સંપર્ક નંબર: ${member.phone}` : ''}
${member?.city ? `• શહેર / કેન્દ્ર: ${member.city}` : ''}
------------------------------------------------------------
કુલ દાન રકમ: ₹${donation.amount.toLocaleString('en-IN')}/-
અંકે રૂપિયા: ${words}
સેવા સંકલ્પ / નોંધ: ${donation.purposeNote || 'શ્રીજી ચરણોમાં સાદર સમર્પિત'}
------------------------------------------------------------
📄 [સૂચના]: આ સત્તાવાર PDF ઇનવોઇસ બિલ સીધું જ લખાણની અંદર
જોડી દેવામાં આવ્યું છે, જેથી અલગથી ફાઇલ ડાઉનલોડ કરીને જોડવાની
કોઈ જંજટ રહેતી નથી.
------------------------------------------------------------
પ્રમાણીકરણ સ્થિતિ: કમ્પ્યુટર જનરેટેડ અધિકૃત ડિજિટલ રસીદ
સંસ્થા: શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય સેવા ટ્રસ્ટ
મુખ્ય કાર્યાલય: શ્રી સ્વામિનારાયણ મંદિર સંકુલ, ગુજરાત
ઈમેઈલ: bhaktanisamparadayofficial@gmail.com
============================================================

જય સ્વામિનારાયણ!
આપના દ્વારા સમર્પિત સેવા ભંડોળ શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાયમાં સહર્ષ સ્વીકારવામાં આવેલ છે. શ્રીજી મહારાજ આપના પરિવાર પર સદા દિવ્ય કૃપા વરસાવે.

લી.
શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય સેવા ભંડોળ સમિતિ`;

  return { subject, body };
}

export function buildJamanwarEmailContent(
  jamanwar: JamanwarPlan,
  member?: MahilaMember
): { subject: string; body: string } {
  const memNum = member?.memberNumber;
  const prefix = memNum ? `[સભ્ય નં: ${memNum}]` : `[નામ: ${jamanwar.hostName}]`;
  const subject = `${prefix} જમણવાર & મહાપ્રસાદ બિલ: ${jamanwar.occasion} - ${jamanwar.hostName}`;

  const words = amountToGujaratiWords(jamanwar.amount);
  const menuLines = jamanwar.menu
    .map(m => `  • ${m.category}: ${m.items.join(', ')}`)
    .join('\n');

  const body = `============================================================
              શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય
    સત્તાવાર જમણવાર & મહાપ્રસાદ ઇનવોઇસ બિલ (EVENT BILL)
============================================================
${memNum ? `• સભ્ય નંબર: #${memNum}` : `• યજમાનશ્રી: ${jamanwar.hostName}`}
• બિલ આઈડી: ${jamanwar.id}
• પ્રસંગ: ${jamanwar.occasion}
• યજમાનનું નામ: ${jamanwar.hostName}
• તારીખ & સમય: ${jamanwar.date} • ${jamanwar.time}
• ભોજન પ્રકાર: ${jamanwar.mealType}
• સ્થળ / હોલ: ${jamanwar.locationHall}
• અંદાજિત હરિભક્તો: ${jamanwar.approxGuests} બહેનો
• રસોઈયા ટીમ: ${jamanwar.rasoiyaTeam}
• સંપર્ક / સંચાલિકા: ${jamanwar.inchargeSister}
------------------------------------------------------------
જમણવાર સેવા રકમ: ₹${jamanwar.amount.toLocaleString('en-IN')}/-
અંકે રૂપિયા: ${words}
------------------------------------------------------------
વાનગીઓનું મેનુ (Approved Menu):
${menuLines}
------------------------------------------------------------
આયોજન વિશેષ નોંધ:
${jamanwar.notes || 'શુદ્ધ સાત્વિક દેશી ઘીની સામગ્રી અને નિયમબદ્ધ રસોઈ વ્યવસ્થા.'}
------------------------------------------------------------
📄 [સૂચના]: આ અધિકૃત જમણવાર બિલ સીધું જ લખાણની અંદર જોડેલ છે.
અલગથી ફાઇલ ડાઉનલોડ કરીને જોડવાની જરૂર નથી.
પ્રમાણીકરણ: અધિકૃત ડિજિટલ મંજૂર બિલ (સ્ટેટસ: ${jamanwar.status})
============================================================

જય સ્વામિનારાયણ!
મહાપ્રસાદ જમણવાર સેવાનું આયોજન સુવ્યવસ્થિત રીતે સંપન્ન કરવા બદલ યજમાન પરિવારનો હૃદયપૂર્વક આભાર.

લી.
શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય જમણવાર સમિતિ
મોકલનાર: bhaktanisamparadayofficial@gmail.com`;

  return { subject, body };
}

export function buildMemberCardEmailContent(
  member: MahilaMember
): { subject: string; body: string } {
  const prefix = member.memberNumber ? `[સભ્ય નં: ${member.memberNumber}]` : `[નામ: ${member.firstName} ${member.surname}]`;
  const subject = `${prefix} સભ્ય ઓળખ & એકાઉન્ટ કાર્ડ: ${member.firstName} ${member.surname} (${member.city})`;

  const familyList = member.familyMembers && member.familyMembers.length > 0
    ? member.familyMembers.map((f, i) => `  ${i + 1}. ${f.name} (${f.relation}) - ઉંમર: ${f.age} વર્ષ - વ્યવસાય: ${f.occupation || '-'}`).join('\n')
    : '  કોઈ અન્ય પારિવારિક સભ્ય નોંધાયેલ નથી';

  const body = `============================================================
              શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય
     સત્તાવાર મહિલા સભ્ય ઓળખ & એકાઉન્ટ કાર્ડ (MEMBER CARD)
============================================================
• સભ્ય નંબર: #${member.memberNumber || member.id}
• પૂરું નામ: ${member.surname} ${member.firstName} ${member.fatherName || member.husbandName}
• પિતાનું નામ: ${member.fatherName || '-'}
• પતિનું નામ: ${member.husbandName || '-'}
• માતાનું નામ: ${member.motherName || '-'}
• ઉંમર: ${member.age} વર્ષ
• સરનામું: ${member.address}, ${member.city} (${member.pincode})
• જિલ્લો: ${member.district}
• સંપર્ક ફોન: ${member.phone}
• ઈમેઈલ: ${member.email || 'N/A'}
• વ્યવસાય: ${member.occupation}
• વાર્ષિક આવક: ${member.annualIncome} (${member.incomeType})
• મંડળમાં હોદ્દો: ${member.mandalRole || 'સત્સંગી બહેન'}
• નોંધણી તારીખ: ${member.joinDate}
------------------------------------------------------------
પરિવારના સભ્યોની વિગત (Linked Family):
${familyList}
------------------------------------------------------------
📄 [સૂચના]: આ સત્તાવાર સભ્ય ઓળખ અને એકાઉન્ટ કાર્ડ સીધું જ
લખાણની અંદર જોડી દેવામાં આવ્યું છે.
અલગથી ફાઇલ ડાઉનલોડ કરીને જોડવાની જરૂર નથી.
પ્રમાણીકરણ: સંપ્રદાય રજિસ્ટર્ડ સભ્ય આઈડી કાર્ડ
============================================================

જય સ્વામિનારાયણ!
શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય સત્સંગ પરિવારમાં આપનું સહર્ષ સ્વાગત છે.

લી.
શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય સભ્ય નોંધણી કાર્યાલય
મોકલનાર: bhaktanisamparadayofficial@gmail.com`;

  return { subject, body };
}

export function buildSabhaEmailContent(
  sabha: SabhaEvent,
  donorMember?: MahilaMember
): { subject: string; body: string } {
  const hasDonor = !!sabha.prasadDonorName;
  const memNum = donorMember?.memberNumber;
  const prefix = memNum
    ? `[સભ્ય નં: ${memNum}]`
    : hasDonor
      ? `[દાતા: ${sabha.prasadDonorName}]`
      : `[સભા: ${sabha.title}]`;

  const subject = `${prefix} ${sabha.title} - સત્સંગ સભા આમંત્રણ`;

  const prasadInfo = hasDonor
    ? `• પ્રસાદ અર્પણ દાતાશ્રી: ${sabha.prasadDonorName} ${memNum ? `(સભ્ય નં: #${memNum})` : ''}
• પ્રસાદ અર્પણ સેવા રકમ: ₹${sabha.prasadDonorAmount?.toLocaleString('en-IN') || '0'}/- (${sabha.prasadDonorAmount ? amountToGujaratiWords(sabha.prasadDonorAmount) : ''})`
    : `• પ્રસાદ વ્યવસ્થા: મહિલા મંડળ સેવા ભંડોળમાંથી`;

  const menuInfo = sabha.prasadMenu && sabha.prasadMenu.length > 0
    ? sabha.prasadMenu.join(', ')
    : 'મોહનથાળ, ખમણ ઢોકળા, મસાલા છાશ';

  const body = `============================================================
              શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય
     વિશેષ મહિલા સત્સંગ સભા આમંત્રણ પત્રિકા (SABHA PATRIKA)
============================================================
${memNum ? `• દાતા સભ્ય નંબર: #${memNum}` : `• સભા આઈડી: ${sabha.id}`}
• સભાનું નામ: ${sabha.title}
• તારીખ & વાર: ${sabha.date} ${sabha.dayOfWeek ? `(${sabha.dayOfWeek})` : ''}
• સમયગાળો: ${sabha.time}
• સભા સ્થળ / હોલ: ${sabha.venue}
• સભા વિષય: ${sabha.topic}
• મુખ્ય વક્તા: ${sabha.conductedBy.name} (${sabha.conductedBy.title})
• આશ્રમ / કેન્દ્ર: ${sabha.conductedBy.ashramOrCity}
• સહ-સંચાલિકા બહેનો: ${sabha.coordinators && sabha.coordinators.length > 0 ? sabha.coordinators.join(', ') : 'મંડળ સંચાલિકા બહેનો'}
• સભા યુનિફોર્મ (Dress Code): ${sabha.uniform || 'પરંપરાગત સત્સંગી સાડી'}
------------------------------------------------------------
મહાપ્રસાદ વિગત:
${prasadInfo}
• સભા પ્રસાદ વાનગીઓ: ${menuInfo}
------------------------------------------------------------
📄 [સૂચના]: આ સત્સંગ સભા પત્રિકા સીધી જ લખાણની અંદર
જોડી દેવામાં આવી છે. અલગથી ડાઉનલોડ કરીને જોડવાની જરૂર નથી.
============================================================

જય સ્વામિનારાયણ સર્વ સત્સંગી બહેનો!
આપ સર્વે બહેનોને નિયત યુનિફોર્મમાં સમયસર પધારી સત્સંગ લાભ લેવા ભાવભર્યું નિમંત્રણ છે.

લી.
શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય સભા આયોજન સમિતિ
મોકલનાર: bhaktanisamparadayofficial@gmail.com`;

  return { subject, body };
}
