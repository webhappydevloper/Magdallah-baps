import React from 'react';
import { 
  MahilaMember, 
  DonationRecord, 
  JamanwarPlan, 
  SabhaEvent 
} from '../types';
import { BhaktaniDarshanSection } from './BhaktaniDarshanSection';
import { TwentyFourHourPostFeed } from './TwentyFourHourPostFeed';

interface Props {
  currentMember: MahilaMember;
  donations: DonationRecord[];
  jamanwars: JamanwarPlan[];
  sabhas: SabhaEvent[];
  onNavigateTab: (tab: string) => void;
  onOpenDonateModal: () => void;
  onOpenJamanwarModal: () => void;
  onOpenAddFamilyModal: () => void;
  onViewReceipt: (donation: DonationRecord) => void;
  onOpenBackupModal?: () => void;
}

export default function DashboardOverview({
  currentMember,
  donations,
  jamanwars,
  sabhas,
  onNavigateTab,
  onOpenDonateModal,
  onOpenJamanwarModal,
  onOpenAddFamilyModal,
  onViewReceipt,
  onOpenBackupModal
}: Props) {
  return (
    <div className="space-y-6 font-gujarati animate-in fade-in duration-200">
      {/* 1. Sacred Bhaktani Darshan Section (includes 4 photos, blessings, personalities & વક્તા શ્રી) */}
      <BhaktaniDarshanSection />

      {/* 2. Twenty-Four Hour Active Post Feed directly below વક્તા શ્રી */}
      <TwentyFourHourPostFeed />
    </div>
  );
}
