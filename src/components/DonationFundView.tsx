import { useState } from 'react';
import { DonationRecord, MahilaMember, FundCategory } from '../types';
import { 
  HeartHandshake, 
  Receipt, 
  Search, 
  Plus, 
  PieChart
} from 'lucide-react';

interface Props {
  donations: DonationRecord[];
  currentMember: MahilaMember;
  onOpenDonateModal: () => void;
  onViewReceipt: (donation: DonationRecord) => void;
}

export default function DonationFundView({
  donations,
  currentMember,
  onOpenDonateModal,
  onViewReceipt
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterView, setFilterView] = useState<'all' | 'mine'>('all');

  // Exact 10 categories as instructed by user
  const ALL_CATEGORIES: FundCategory[] = [
    'જમણવાર સેવા',
    'મહાપ્રસાદ સેવા',
    'મંદિર સેવા & નિર્માણ',
    'ઉત્સવ & સમૈયા ભંડોળ',
    'સભ્ય સેવા',
    'વિદ્યાલય & સંસ્કાર ધામ સેવા',
    'સ્વામી સેવા',
    'ભક્તાણી સેવા',
    'પરમપૂજ્ય શ્રી સ્વામી સેવા',
    'અન્ય'
  ];

  // Calculations: Subtract isExpense donations from total
  const totalReceivedFund = donations
    .filter(d => !d.isExpense)
    .reduce((sum, d) => sum + d.amount, 0);

  const totalExpenseFund = donations
    .filter(d => d.isExpense)
    .reduce((sum, d) => sum + d.amount, 0);

  const totalCommunityFund = totalReceivedFund - totalExpenseFund;

  const myTotalContribution = donations
    .filter(d => d.memberId === currentMember.id && !d.isExpense)
    .reduce((sum, d) => sum + d.amount, 0);

  // Category totals
  const categoryTotals: Record<FundCategory, number> = {
    'જમણવાર સેવા': 0,
    'મહાપ્રસાદ સેવા': 0,
    'મંદિર સેવા & નિર્માણ': 0,
    'ઉત્સવ & સમૈયા ભંડોળ': 0,
    'સભ્ય સેવા': 0,
    'વિદ્યાલય & સંસ્કાર ધામ સેવા': 0,
    'સ્વામી સેવા': 0,
    'ભક્તાણી સેવા': 0,
    'પરમપૂજ્ય શ્રી સ્વામી સેવા': 0,
    'અન્ય': 0,
  };

  donations.forEach(d => {
    if (categoryTotals[d.category] !== undefined) {
      if (d.isExpense) {
        categoryTotals[d.category] -= d.amount;
      } else {
        categoryTotals[d.category] += d.amount;
      }
    }
  });

  // Filtered donations
  const filteredDonations = donations.filter(d => {
    if (filterView === 'mine' && d.memberId !== currentMember.id) return false;
    if (selectedCategory !== 'all' && d.category !== selectedCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        d.receiptNo.toLowerCase().includes(q) ||
        d.donorName.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.paymentMode.toLowerCase().includes(q) ||
        d.purposeNote.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5 font-gujarati animate-in fade-in duration-200">
      
      {/* Overview Cards (Clean, extra promotional text removed) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Total Fund Card */}
        <div className="md:col-span-2 bg-gradient-to-r from-amber-800 to-orange-700 text-white rounded-3xl p-6 shadow-md border border-amber-500/30 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-200">
              કુલ એકત્રિત સેવા ભંડોળ
            </span>
            <div className="mt-2 text-3xl sm:text-5xl font-black font-chirp tracking-tight">
              ₹{totalCommunityFund.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/20 flex items-center justify-between">
            <span className="text-xs text-amber-200">
              કુલ {donations.length} દાન નોંધાયેલ છે
            </span>
            <button
              onClick={onOpenDonateModal}
              className="px-5 py-2.5 bg-white text-amber-900 hover:bg-amber-50 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-amber-700" />
              <span>દાન અર્પણ કરો</span>
            </button>
          </div>
        </div>

        {/* My Contribution Card */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-600">
                આપનું સેવા ભંડોળ
              </span>
              <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md">
                {currentMember.firstName}
              </span>
            </div>

            <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-950 font-chirp tracking-tight">
              ₹{myTotalContribution.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex gap-2">
            <button
              onClick={() => setFilterView('all')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center ${
                filterView === 'all'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              સર્વ દાન
            </button>
            <button
              onClick={() => setFilterView('mine')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center ${
                filterView === 'mine'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
              }`}
            >
              મારું દાન
            </button>
          </div>
        </div>
      </div>

      {/* 10 Fund Categories */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
          <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-700" />
            <span>દાન સેવા કેટેગરી</span>
          </h3>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs text-amber-700 hover:text-amber-900 font-bold cursor-pointer"
            >
              ફિલ્ટર સાફ કરો ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {ALL_CATEGORIES.map((cat) => {
            const amt = categoryTotals[cat] || 0;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat)}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs' 
                    : 'bg-stone-50 hover:bg-amber-50/70 text-stone-800 border-stone-200'
                }`}
              >
                <div className="text-[11px] font-bold truncate">
                  {cat}
                </div>
                <div className={`text-sm font-black font-chirp mt-1 tracking-tight ${
                  isSelected ? 'text-white' : 'text-amber-950'
                }`}>
                  ₹{amt.toLocaleString('en-IN')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Receipts Ledger */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-xs space-y-4">
        
        {/* Search & Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-700" />
            <span className="text-base font-bold text-stone-900">દાન રસીદ ખાતાવહી</span>
            <span className="text-xs text-stone-500 font-chirp">({filteredDonations.length})</span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="નામ, રસીદ નંબર કે કેટેગરી શોધો..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-amber-50/70 border-b border-amber-200 text-amber-950">
                <th className="py-2.5 px-3 font-bold">રસીદ નંબર</th>
                <th className="py-2.5 px-3 font-bold">દાતા / પરિવાર નું નામ</th>
                <th className="py-2.5 px-3 font-bold">સેવા કેટેગરી</th>
                <th className="py-2.5 px-3 font-bold">તારીખ</th>
                <th className="py-2.5 px-3 font-bold">ચૂકવણી</th>
                <th className="py-2.5 px-3 font-bold text-right">રકમ (₹)</th>
                <th className="py-2.5 px-3 font-bold text-center">પાવતી</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-stone-500">
                    કોઈ દાન પાવતી મળી નથી.
                  </td>
                </tr>
              ) : (
                filteredDonations.map((donation) => {
                  const isMine = donation.memberId === currentMember.id;
                  return (
                    <tr key={donation.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3 px-3 font-chirp font-bold text-amber-900">
                        {donation.receiptNo}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-stone-900 text-sm">
                          {donation.donorName}
                        </div>
                        {isMine && (
                          <span className="inline-block px-1.5 py-0.2 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-sm mt-0.5">
                            આપનું ખાતું
                          </span>
                        )}
                        {donation.purposeNote && (
                          <div className="text-[11px] text-stone-500 truncate max-w-xs mt-0.5">
                            {donation.purposeNote}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 bg-stone-100 text-stone-800 rounded-lg font-medium text-xs">
                          {donation.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-stone-600 font-chirp">
                        <div>{donation.date}</div>
                        <div className="text-[10px] text-stone-400">{donation.time}</div>
                      </td>
                      <td className="py-3 px-3 text-stone-700">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          donation.paymentMode === 'રોકડ' 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}>
                          {donation.paymentMode}
                        </span>
                        {donation.transactionRef && (
                          <div className="text-[10px] text-stone-400 font-chirp mt-0.5">
                            {donation.transactionRef}
                          </div>
                        )}
                      </td>
                      <td className={`py-3 px-3 text-right font-chirp font-black text-sm sm:text-base ${
                        donation.isExpense ? 'text-rose-600' : 'text-amber-950'
                      }`}>
                        {donation.isExpense ? `-₹${donation.amount.toLocaleString('en-IN')}` : `₹${donation.amount.toLocaleString('en-IN')}`}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => onViewReceipt(donation)}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>પાવતી જુઓ</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
