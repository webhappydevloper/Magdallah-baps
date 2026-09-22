export type RelationType = 
  | 'પતિ'
  | 'પુત્ર'
  | 'પુત્રી'
  | 'સાસુ'
  | 'સસરા'
  | 'માતા'
  | 'પિતા'
  | 'ભાઈ'
  | 'બહેન'
  | 'જેઠ'
  | 'જેઠાણી'
  | 'દિયર'
  | 'દેરાણી'
  | 'નણંદ'
  | 'પુત્રવધૂ'
  | 'પૌત્ર'
  | 'પૌત્રી'
  | 'અન્ય સંબંધ';

export interface FamilyMember {
  id: string;
  name: string;
  relation: RelationType;
  age: number;
  occupation: string;
  phone?: string;
  notes?: string;
}

export interface MahilaMember {
  id: string;
  memberNumber: string;  // ૬ આંકડાનો સભ્ય નંબર (6-digit Member Number, e.g. "104821")
  surname: string;       // અટક
  firstName: string;     // નામ
  fatherName: string;    // પિતા નું નામ
  husbandName: string;   // પતિ નું નામ
  motherName: string;    // માતા નું નામ
  age: number;           // ઉંમર
  dob?: string;          // જન્મ તારીખ
  address: string;       // રહેઠાણ / સરનામું
  city: string;          // શહેર / ગામ
  district: string;      // જિલ્લો
  pincode: string;       // પિનકોડ
  phone: string;         // મોબાઈલ નંબર
  email: string;         // ઈમેઈલ
  occupation: string;    // હાલ માં શું વ્યવસાય કરે છે
  annualIncome: string;  // વાર્ષિક આવક પરિવાર ની અથવા પોતાની
  incomeType: 'પરિવારની' | 'પોતાની' | 'સંયુક્ત';
  mandalRole: string;    // મંડળમાં હોદ્દો
  joinDate: string;      // જોડાયા તારીખ
  familyMembers: FamilyMember[]; // ઘરના સભ્યો
  avatarColor: string;
  parentMemberNumber?: string; // જોડાયેલ માતા/પિતાનો સભ્ય નંબર (જો હોય તો)
}

export type FundCategory = 
  | 'જમણવાર સેવા'
  | 'મહાપ્રસાદ સેવા'
  | 'મંદિર સેવા & નિર્માણ'
  | 'ઉત્સવ & સમૈયા ભંડોળ'
  | 'સભ્ય સેવા'
  | 'વિદ્યાલય & સંસ્કાર ધામ સેવા'
  | 'સ્વામી સેવા'
  | 'ભક્તાણી સેવા'
  | 'પરમપૂજ્ય શ્રી સ્વામી સેવા'
  | 'અન્ય';

export type PaymentMode = 'રોકડ' | 'ચેક';

export interface DonationRecord {
  id: string;
  receiptNo: string;
  memberId: string;
  donorName: string;
  amount: number;
  category: FundCategory;
  paymentMode: PaymentMode;
  date: string;
  time: string;
  transactionRef?: string;
  purposeNote: string;
  isVerified: boolean;
  isExpense?: boolean; // સાચી વપરાશ/ખર્ચ એન્ટ્રી જે ભંડોળમાંથી બાદ થાય
}

export interface JamanwarMenuItem {
  category: 'મિઠાઈ' | 'ફરસાણ' | 'શાક' | 'રોટલી / પૂરી' | 'દાળ-ભાત' | 'પીણા & સંભારો';
  items: string[];
}

export interface JamanwarPlan {
  id: string;
  hostName: string;           // યજમાન નામ
  memberId?: string;
  occasion: string;           // પ્રસંગ (દા.ત. એકાદશી પર્વ, વાર્ષિક પાટોત્સવ, સ્મૃતિ જમણવાર)
  date: string;               // તારીખ
  time: string;               // સમય (દા.ત. બપોરે ૧૧:૩૦ કલાકે)
  mealType: 'બપોરનું ભોજન (લંચ)' | 'સાંજનું ભોજન (ડિનર)' | 'સાંજના અલ્પાહાર / નાસ્તો';
  amount: number;             // જમણવાર સેવા રકમ (₹)
  approxGuests: number;       // અંદાજિત હરિભક્તો / બહેનો સંખ્યા
  locationHall: string;       // સ્થળ / હોલ
  menu: JamanwarMenuItem[];    // મેનુ વિગતો
  rasoiyaTeam: string;        // રસોઈયા / સેવા ટીમ
  inchargeSister: string;     // સંચાલિકા / સંપર્ક બહેન
  notes: string;              // વિશેષ આયોજન નોંધ
  status: 'કન્ફર્મ' | 'આયોજન હેઠળ' | 'સંપન્ન';
}

export interface SabhaSpeaker {
  name: string;
  title: string;              // દા.ત. સાંખ્યયોગી બહેન, વિદુષી વક્તા, મંડળ પ્રમુખ
  ashramOrCity: string;       // આશ્રમ / કેન્દ્ર
  phone?: string;
}

export interface SabhaEvent {
  id: string;
  title: string;              // સભાનું નામ
  date: string;               // તારીખ
  dayOfWeek?: string;         // વાર (સોમવાર, મંગળવાર, બુધવાર...)
  startTime?: string;         // શરૂ સમય
  endTime?: string;           // પ્રાપ્ત / પૂર્ણ સમય
  time: string;               // સમયગાળો (દા.ત. બપોરે ૩:૦૦ થી ૫:૦૦)
  conductedBy: SabhaSpeaker;  // સભા કોણ કરાવે છે
  coordinators: string[];     // સહ-સંચાલિકા બહેનો
  topic: string;              // સભાનો વિષય / ગ્રંથ પાઠ
  kirtanBhakti: string;       // કીર્તન આરાધના વિગત
  venue: string;              // સભા હોલ / મંદિર પ્રાંગણ
  mode: 'રૂબરૂ સભા' | 'લાઈવ પ્રસારણ સહિત' | 'વિશેષ શિબિર';
  expectedAttendees: number;
  rsvpCount: number;
  isUserRsvpd?: boolean;
  uniform?: string;           // સભાનો યુનિફોર્મ (ડ્રેસકોડ)
  prasadSource?: 'donation' | 'manual'; // પ્રસાદ પ્રકાર: દાન અર્પણ ભંડોળમાંથી કે મેન્યુઅલ
  linkedDonationId?: string;  // લિંક થયેલ દાન રેકોર્ડ
  prasadDonorName?: string;   // પ્રસાદ અર્પણ કરનાર દાતાશ્રીનું નામ (જો હોય તો)
  prasadDonorAmount?: number; // પ્રસાદ અર્પણ સેવા રકમ (જો દાતા દ્વારા હોય તો)
  prasadMenu?: string[];      // પ્રસાદમાં શું શું વાનગી રહેશે
  dishPrice?: number;         // એક ડીશ ના ભાવ (₹)
  memberCount?: number;       // કેટલા સભ્યો / હરિભક્તો માટે
  prasadExpense?: number;     // કુલ પ્રસાદ વપરાશ રકમ (જે ભંડોળમાંથી બાદ થાય)
}

export interface SampradayOfficer {
  id: string;
  name: string;
  designation: string;       // હોદ્દો (પ્રમુખ, ઉપ-પ્રમુખ, મંત્રી, ખજાનચી વગેરે)
  serviceYears: string;
  city: string;
  contact: string;
  department: string;        // વિભાગ (કારોબારી, જમણવાર સમિતિ, સભા સમિતિ, ભંડોળ સમિતિ)
  bio: string;
  isSankhyayogi?: boolean;
}

export interface EmailNotification {
  id: string;
  sender?: string;            // મોકલનાર (ડિફોલ્ટ: bhaktanisamparadayofficial@gmail.com)
  recipient: string;          // પ્રાપ્તકર્તા (ડિફોલ્ટ: bhaktidevani81@gmail.com અથવા અન્ય)
  subject: string;            // ઈમેઈલ વિષય
  body: string;               // મુખ્ય સંદેશ લખાણ
  date: string;               // તારીખ
  time: string;               // સમય
  type: 'member_registration' | 'family_added' | 'donation_received' | 'jamanwar_booked' | 'sabha_scheduled';
  status: 'Sent' | 'Delivered';
}
