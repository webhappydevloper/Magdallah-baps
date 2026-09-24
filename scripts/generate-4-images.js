import fs from 'fs';
import { renderAsync } from '@resvg/resvg-js';

// Common defs for sacred golden glow, rich reds, jewels, marble
const commonDefs = `
  <defs>
    <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3B0" />
      <stop offset="20%" stop-color="#E5A93C" />
      <stop offset="40%" stop-color="#FFF8D6" />
      <stop offset="60%" stop-color="#C5851C" />
      <stop offset="85%" stop-color="#F3C358" />
      <stop offset="100%" stop-color="#99600F" />
    </linearGradient>

    <radialGradient id="haloGlow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#FFE885" stop-opacity="0.9" />
      <stop offset="45%" stop-color="#F59E0B" stop-opacity="0.6" />
      <stop offset="80%" stop-color="#B45309" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#78350F" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="sanctumRed" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#A51D24" />
      <stop offset="60%" stop-color="#7A0D12" />
      <stop offset="100%" stop-color="#3D0306" />
    </radialGradient>

    <linearGradient id="goldJewel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB" />
      <stop offset="30%" stop-color="#F59E0B" />
      <stop offset="70%" stop-color="#B45309" />
      <stop offset="100%" stop-color="#FDE68A" />
    </linearGradient>

    <linearGradient id="divineSkin" x1="30%" y1="10%" x2="70%" y2="90%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#FAF7F2" />
      <stop offset="85%" stop-color="#F2EBE0" />
      <stop offset="100%" stop-color="#E0D3C1" />
    </linearGradient>

    <linearGradient id="paghdiMain" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#FF3838" />
      <stop offset="35%" stop-color="#E11D23" />
      <stop offset="70%" stop-color="#B91016" />
      <stop offset="100%" stop-color="#75060A" />
    </linearGradient>

    <linearGradient id="chandanTilak" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="100%" stop-color="#CA8A04" />
    </linearGradient>
  </defs>
`;

// 1. IMG_1338: Grand Golden Mandir Sinhasan with 3 Murtis (Akshar Purushottam Maharaj)
const svg1338 = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="900" viewBox="0 0 800 900" xmlns="http://www.w3.org/2000/svg">
  ${commonDefs}
  <!-- Background Mandir Wall & Sanctum -->
  <rect width="800" height="900" fill="#1C1917" />
  <rect x="120" y="160" width="560" height="600" fill="url(#sanctumRed)" rx="16" />

  <!-- Backdrop Text: "સત્સંગ દીક્ષા" Banner -->
  <rect x="200" y="270" width="400" height="70" fill="#58080C" rx="8" stroke="#D97706" stroke-width="1.5" />
  <text x="400" y="318" font-family="'Noto Sans Gujarati', sans-serif" font-weight="900" font-size="34" fill="#FDE047" text-anchor="middle" letter-spacing="4">
    ॥ सत्संग दीक्षा ॥
  </text>
  <text x="400" y="240" font-family="'Noto Sans Gujarati', sans-serif" font-weight="700" font-size="16" fill="#FCD34D" text-anchor="middle" opacity="0.9">
    અક્ષરપુરુષોત્તમ દર્શન • દિવ્ય સિંહાસન
  </text>

  <!-- Ornate Golden Mandir Pillars & Arch (Gopuram / Toran) -->
  <!-- Left Pillar -->
  <rect x="50" y="100" width="90" height="720" fill="url(#goldBorder)" stroke="#78350F" stroke-width="3" rx="8" />
  <circle cx="95" cy="200" r="14" fill="#DC2626" stroke="#991B1B" />
  <circle cx="95" cy="400" r="14" fill="#10B981" stroke="#047857" />
  <circle cx="95" cy="600" r="14" fill="#DC2626" stroke="#991B1B" />

  <!-- Right Pillar -->
  <rect x="660" y="100" width="90" height="720" fill="url(#goldBorder)" stroke="#78350F" stroke-width="3" rx="8" />
  <circle cx="705" cy="200" r="14" fill="#DC2626" stroke="#991B1B" />
  <circle cx="705" cy="400" r="14" fill="#10B981" stroke="#047857" />
  <circle cx="705" cy="600" r="14" fill="#DC2626" stroke="#991B1B" />

  <!-- Grand Golden Arch Top Canopy -->
  <path d="M 50 160 C 200 40, 600 40, 750 160 L 720 200 C 580 100, 220 100, 80 200 Z" fill="url(#goldBorder)" stroke="#78350F" stroke-width="3" />
  <!-- Kalash Peaks on Canopy -->
  <path d="M 400 30 L 415 65 L 385 65 Z" fill="url(#goldJewel)" stroke="#78350F" stroke-width="1.5" />
  <circle cx="400" cy="26" r="6" fill="#DC2626" />
  <path d="M 280 55 L 292 85 L 268 85 Z" fill="url(#goldJewel)" stroke="#78350F" stroke-width="1.5" />
  <path d="M 520 55 L 532 85 L 508 85 Z" fill="url(#goldJewel)" stroke="#78350F" stroke-width="1.5" />

  <!-- Hanging Red & Pink Floral Garlands from Arch -->
  <g fill="#DC2626">
    <circle cx="160" cy="230" r="10" /><circle cx="160" cy="255" r="9" /><circle cx="160" cy="280" r="8" /><circle cx="160" cy="305" r="7" />
    <circle cx="640" cy="230" r="10" /><circle cx="640" cy="255" r="9" /><circle cx="640" cy="280" r="8" /><circle cx="640" cy="305" r="7" />
  </g>
  <!-- Hanging White Pearl Strings from Top -->
  <path d="M 330 140 L 330 250 M 400 130 L 400 230 M 470 140 L 470 250" stroke="#FFFFFF" stroke-width="3.5" stroke-dasharray="6,4" />

  <!-- THREE DIVINE MURTIS -->
  <!-- 1. LEFT MURTI (Gunatitanand Swami) -->
  <g transform="translate(-150, 40)">
    <circle cx="400" cy="420" r="45" fill="url(#haloGlow)" />
    <!-- Robes -->
    <path d="M 350 560 L 450 560 L 440 460 L 360 460 Z" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
    <path d="M 360 560 L 440 560 L 430 650 L 370 650 Z" fill="#DC2626" stroke="#991B1B" stroke-width="1.5" />
    <!-- Face -->
    <ellipse cx="400" cy="420" rx="30" ry="36" fill="url(#divineSkin)" />
    <!-- Red Paghdi -->
    <ellipse cx="400" cy="390" rx="42" ry="22" fill="url(#paghdiMain)" stroke="#78350F" stroke-width="1.5" />
    <circle cx="400" cy="372" r="5" fill="#FDE047" />
    <!-- Garland -->
    <path d="M 375 440 Q 400 520 425 440" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-dasharray="6,2" />
  </g>

  <!-- 2. CENTER MURTI: Bhagwan Shree Swaminarayan (Larger, Glorious) -->
  <g transform="translate(0, 0)">
    <circle cx="400" cy="430" r="75" fill="url(#haloGlow)" />
    <!-- White Robes with motif embroidery -->
    <path d="M 320 570 L 480 570 L 465 460 L 335 460 Z" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2.5" />
    <!-- Tree / Peacock motif lines on vastra -->
    <path d="M 370 570 L 370 510 M 430 570 L 430 510 M 400 570 L 400 495" stroke="#78350F" stroke-width="2" />
    <!-- Red Pleated Dhoti -->
    <path d="M 330 570 L 470 570 L 460 690 L 340 690 Z" fill="#DC2626" stroke="#991B1B" stroke-width="2" />
    <!-- Pure Marble Face -->
    <ellipse cx="400" cy="415" rx="38" ry="46" fill="url(#divineSkin)" />
    <!-- Tilak Chandlo -->
    <rect x="396" y="385" width="8" height="24" rx="2" fill="url(#chandanTilak)" />
    <circle cx="400" cy="395" r="4.5" fill="#DC2626" />
    <!-- Black Eyebrows & Eyes -->
    <path d="M 380 405 Q 388 400 395 405 M 405 405 Q 412 400 420 405" fill="none" stroke="#171717" stroke-width="2" />
    <circle cx="388" cy="410" r="3" fill="#171717" /><circle cx="412" cy="410" r="3" fill="#171717" />
    <!-- Divine Smile -->
    <path d="M 390 435 Q 400 442 410 435" fill="none" stroke="#E11D48" stroke-width="2" />
    <!-- Grand Red Paghdi with Golden Crest -->
    <ellipse cx="400" cy="375" rx="55" ry="28" fill="url(#paghdiMain)" stroke="#78350F" stroke-width="2" />
    <ellipse cx="400" cy="355" rx="14" ry="18" fill="url(#goldJewel)" stroke="#78350F" stroke-width="1.2" />
    <circle cx="400" cy="340" r="5" fill="#DC2626" />
    <!-- Yellow floral side toran -->
    <circle cx="348" cy="370" r="7" fill="#FBBF24" /><circle cx="452" cy="370" r="7" fill="#FBBF24" />
    <!-- Fragrant Jasmine Haar & Golden Necklace -->
    <path d="M 360 445 Q 400 550 440 445" fill="none" stroke="#FFFFFF" stroke-width="12" stroke-dasharray="8,3" />
    <path d="M 370 450 Q 400 520 430 450" fill="none" stroke="url(#goldJewel)" stroke-width="7" />
    <!-- Sacred Charan-kamal at bottom -->
    <ellipse cx="385" cy="700" rx="14" ry="8" fill="url(#divineSkin)" />
    <ellipse cx="415" cy="700" rx="14" ry="8" fill="url(#divineSkin)" />
  </g>

  <!-- 3. RIGHT MURTI (Gopalanand Swami / Harikrishna Maharaj) -->
  <g transform="translate(150, 40)">
    <circle cx="400" cy="420" r="45" fill="url(#haloGlow)" />
    <!-- Robes -->
    <path d="M 350 560 L 450 560 L 440 460 L 360 460 Z" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
    <path d="M 360 560 L 440 560 L 430 650 L 370 650 Z" fill="#DC2626" stroke="#991B1B" stroke-width="1.5" />
    <!-- Face -->
    <ellipse cx="400" cy="420" rx="30" ry="36" fill="url(#divineSkin)" />
    <!-- Red Paghdi -->
    <ellipse cx="400" cy="390" rx="42" ry="22" fill="url(#paghdiMain)" stroke="#78350F" stroke-width="1.5" />
    <circle cx="400" cy="372" r="5" fill="#FDE047" />
    <!-- Garland -->
    <path d="M 375 440 Q 400 520 425 440" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-dasharray="6,2" />
  </g>

  <!-- Marble Altar Base with Sacred Scriptures & Charan Paduka -->
  <rect x="80" y="730" width="640" height="110" fill="#F8FAFC" stroke="url(#goldBorder)" stroke-width="4" rx="8" />
  <rect x="100" y="745" width="600" height="80" fill="#E2E8F0" rx="4" />
  <!-- Charan Paduka in Center -->
  <ellipse cx="385" cy="780" rx="16" ry="24" fill="url(#goldJewel)" stroke="#78350F" stroke-width="1.5" />
  <ellipse cx="415" cy="780" rx="16" ry="24" fill="url(#goldJewel)" stroke="#78350F" stroke-width="1.5" />
  <!-- Sacred Scriptures on Altar -->
  <rect x="230" y="760" width="70" height="45" fill="#DC2626" stroke="#FDE047" stroke-width="1.5" rx="3" />
  <text x="265" y="788" font-family="'Noto Sans Gujarati', sans-serif" font-weight="700" font-size="10" fill="#FFFFFF" text-anchor="middle">સત્સંગ દીક્ષા</text>
  <rect x="500" y="760" width="70" height="45" fill="#DC2626" stroke="#FDE047" stroke-width="1.5" rx="3" />
  <text x="535" y="788" font-family="'Noto Sans Gujarati', sans-serif" font-weight="700" font-size="10" fill="#FFFFFF" text-anchor="middle">શિક્ષાપત્રી</text>

  <!-- Outer Divine Border -->
  <rect x="15" y="15" width="770" height="870" fill="none" stroke="url(#goldBorder)" stroke-width="12" rx="20" />
</svg>
`;

// 2. IMG_1337: Full Shrine Standing Murti with Golden Pillars & Guru Portraits
const svg1337 = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="900" viewBox="0 0 800 900" xmlns="http://www.w3.org/2000/svg">
  ${commonDefs}
  <!-- Background Mandir Carved Architecture -->
  <rect width="800" height="900" fill="#18181B" />
  <!-- Sanctum Fabric Backdrop with Golden "સ્વામીનારાયણ" Pattern -->
  <rect x="140" y="120" width="520" height="540" fill="url(#sanctumRed)" rx="12" />
  <g fill="#FDE047" opacity="0.3" font-family="'Noto Sans Gujarati', sans-serif" font-size="14" font-weight="700">
    <text x="200" y="160">સ્વામીનારાયણ</text><text x="340" y="160">સ્વામીનારાયણ</text><text x="480" y="160">સ્વામીનારાયણ</text>
    <text x="160" y="210">સ્વામીનારાયણ</text><text x="300" y="210">સ્વામીનારાયણ</text><text x="440" y="210">સ્વામીનારાયણ</text>
    <text x="200" y="260">સ્વામીનારાયણ</text><text x="340" y="260">સ્વામીનારાયણ</text><text x="480" y="260">સ્વામીનારાયણ</text>
    <text x="160" y="310">સ્વામીનારાયણ</text><text x="300" y="310">સ્વામીનારાયણ</text><text x="440" y="310">સ્વામીનારાયણ</text>
  </g>

  <!-- Golden Pillars on Sides -->
  <rect x="60" y="80" width="90" height="600" fill="url(#goldBorder)" stroke="#78350F" stroke-width="2.5" rx="6" />
  <rect x="650" y="80" width="90" height="600" fill="url(#goldBorder)" stroke="#78350F" stroke-width="2.5" rx="6" />

  <!-- DIVINE STANDING MURTI (Bhagwan Swaminarayan) -->
  <g>
    <!-- Radiant Halo -->
    <circle cx="400" cy="270" r="100" fill="url(#haloGlow)" />
    <!-- White Silk Robes with Embroidered Trees & Deers -->
    <path d="M 310 420 L 490 420 L 460 290 L 340 290 Z" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" />
    <!-- Tree motifs on skirt -->
    <path d="M 360 420 L 360 350 M 400 420 L 400 340 M 440 420 L 440 350" stroke="#78350F" stroke-width="2" />
    <!-- Red Pleated Dhoti -->
    <path d="M 325 420 L 475 420 L 450 560 L 350 560 Z" fill="#DC2626" stroke="#991B1B" stroke-width="2" />
    <!-- Golden Waistband (Kamarbandh) -->
    <rect x="320" y="415" width="160" height="15" rx="3" fill="url(#goldJewel)" stroke="#78350F" stroke-width="1" />

    <!-- Pure Marble Divine Neck & Face -->
    <ellipse cx="400" cy="225" rx="42" ry="50" fill="url(#divineSkin)" />
    <!-- Sacred Tilak-Chandlo -->
    <rect x="396" y="195" width="8" height="26" rx="2" fill="url(#chandanTilak)" />
    <circle cx="400" cy="205" r="5" fill="#DC2626" />
    <!-- Eyes, Eyebrows & Smile -->
    <path d="M 378 215 Q 388 208 396 215 M 404 215 Q 412 208 422 215" fill="none" stroke="#171717" stroke-width="2" />
    <circle cx="387" cy="222" r="3.5" fill="#171717" /><circle cx="413" cy="222" r="3.5" fill="#171717" />
    <path d="M 388 250 Q 400 258 412 250" fill="none" stroke="#E11D48" stroke-width="2.2" />
    <!-- Black Beauty Mark (Til) -->
    <circle cx="375" cy="235" r="2" fill="#171717" />

    <!-- Royal Red Paghdi with Golden Plume & Pearls -->
    <ellipse cx="400" cy="180" rx="60" ry="30" fill="url(#paghdiMain)" stroke="#78350F" stroke-width="2" />
    <ellipse cx="400" cy="155" rx="16" ry="20" fill="url(#goldJewel)" stroke="#78350F" stroke-width="1.2" />
    <circle cx="400" cy="140" r="5" fill="#DC2626" />
    <circle cx="345" cy="175" r="8" fill="#FBBF24" /><circle cx="455" cy="175" r="8" fill="#FBBF24" />

    <!-- Multiple Garlands: Mogra Pushp Haar, Gold Haar, Tulsi Mala -->
    <path d="M 350 260 Q 400 390 450 260" fill="none" stroke="#FFFFFF" stroke-width="14" stroke-dasharray="8,3" />
    <path d="M 365 270 Q 400 350 435 270" fill="none" stroke="url(#goldJewel)" stroke-width="8" />

    <!-- Blessing Hand (Abhay Mudra) & Rose at chest -->
    <path d="M 460 300 Q 485 275 490 310 Q 480 340 460 330 Z" fill="url(#divineSkin)" stroke="#CBD5E1" />
    <circle cx="380" cy="380" r="10" fill="#DC2626" /><circle cx="420" cy="380" r="10" fill="#DC2626" />

    <!-- Sacred Charan Kamal on Lotus Throne -->
    <ellipse cx="385" cy="570" rx="14" ry="8" fill="url(#divineSkin)" />
    <ellipse cx="415" cy="570" rx="14" ry="8" fill="url(#divineSkin)" />
  </g>

  <!-- Prasad Baskets on Left & Right Altar -->
  <ellipse cx="220" cy="550" rx="45" ry="22" fill="#D97706" stroke="#78350F" stroke-width="2" />
  <circle cx="210" cy="542" r="8" fill="#EF4444" /><circle cx="225" cy="540" r="9" fill="#FBBF24" /><circle cx="238" cy="544" r="8" fill="#10B981" />
  <ellipse cx="580" cy="550" rx="45" ry="22" fill="#D97706" stroke="#78350F" stroke-width="2" />
  <circle cx="570" cy="542" r="8" fill="#FBBF24" /><circle cx="585" cy="540" r="9" fill="#EF4444" /><circle cx="598" cy="544" r="8" fill="#FBBF24" />

  <!-- Lower Altar with 4 Guru Portraits (Gunatit Guru Parampara) -->
  <rect x="60" y="660" width="680" height="180" fill="#27272A" stroke="url(#goldBorder)" stroke-width="4" rx="8" />
  <!-- Portrait 1: Shastriji Maharaj -->
  <rect x="90" y="680" width="125" height="140" fill="#7F1D1D" stroke="#D97706" stroke-width="2" rx="4" />
  <circle cx="152" cy="725" r="28" fill="#F59E0B" />
  <text x="152" y="785" font-family="'Noto Sans Gujarati', sans-serif" font-weight="700" font-size="11" fill="#FDE047" text-anchor="middle">યોગીજી મહારાજ</text>

  <!-- Portrait 2: Yogiji Maharaj -->
  <rect x="245" y="680" width="125" height="140" fill="#7F1D1D" stroke="#D97706" stroke-width="2" rx="4" />
  <circle cx="307" cy="725" r="28" fill="#F59E0B" />
  <text x="307" y="785" font-family="'Noto Sans Gujarati', sans-serif" font-weight="700" font-size="11" fill="#FDE047" text-anchor="middle">પ્રમુખસ્વામી મહારાજ</text>

  <!-- Portrait 3: Pramukh Swami Maharaj -->
  <rect x="400" y="680" width="125" height="140" fill="#7F1D1D" stroke="#D97706" stroke-width="2" rx="4" />
  <circle cx="462" cy="725" r="28" fill="#F59E0B" />
  <text x="462" y="785" font-family="'Noto Sans Gujarati', sans-serif" font-weight="700" font-size="11" fill="#FDE047" text-anchor="middle">મહંતસ્વામી મહારાજ</text>

  <!-- Portrait 4: Mahant Swami Maharaj -->
  <rect x="555" y="680" width="125" height="140" fill="#7F1D1D" stroke="#D97706" stroke-width="2" rx="4" />
  <circle cx="617" cy="725" r="28" fill="#F59E0B" />
  <text x="617" y="785" font-family="'Noto Sans Gujarati', sans-serif" font-weight="700" font-size="11" fill="#FDE047" text-anchor="middle">સત્સંગ દીક્ષા</text>

  <!-- Outer Golden Frame -->
  <rect x="15" y="15" width="770" height="870" fill="none" stroke="url(#goldBorder)" stroke-width="12" rx="20" />
</svg>
`;

// 3. IMG_1336: Divine Mukharvind Close-up with Golden Lettering Backdrop
const svg1336 = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="900" viewBox="0 0 800 900" xmlns="http://www.w3.org/2000/svg">
  ${commonDefs}
  <!-- Rich Maroon Sanctum Backdrop with Golden Repeating "સ્વામીનારાયણ" -->
  <rect width="800" height="900" fill="#3D0306" />
  <g fill="#FDE047" opacity="0.45" font-family="'Noto Sans Gujarati', sans-serif" font-size="20" font-weight="700" letter-spacing="3">
    <text x="60" y="120">સ્વામીનારાયણ</text><text x="310" y="120">સ્વામીનારાયણ</text><text x="560" y="120">સ્વામીનારાયણ</text>
    <text x="180" y="180">સ્વામીનારાયણ</text><text x="430" y="180">સ્વામીનારાયણ</text><text x="680" y="180">સ્વામીનારાયણ</text>
    <text x="60" y="240">સ્વામીનારાયણ</text><text x="310" y="240">સ્વામીનારાયણ</text><text x="560" y="240">સ્વામીનારાયણ</text>
    <text x="180" y="300">સ્વામીનારાયણ</text><text x="430" y="300">સ્વામીનારાયણ</text><text x="680" y="300">સ્વામીનારાયણ</text>
    <text x="60" y="360">સ્વામીનારાયણ</text><text x="310" y="360">સ્વામીનારાયણ</text><text x="560" y="360">સ્વામીનારાયણ</text>
  </g>

  <!-- Side Flower Garlands (Red & Pink Roses) -->
  <g fill="#DC2626">
    <circle cx="80" cy="200" r="16" /><circle cx="80" cy="250" r="16" /><circle cx="80" cy="300" r="16" /><circle cx="80" cy="350" r="16" /><circle cx="80" cy="400" r="16" />
    <circle cx="720" cy="200" r="16" /><circle cx="720" cy="250" r="16" /><circle cx="720" cy="300" r="16" /><circle cx="720" cy="350" r="16" /><circle cx="720" cy="400" r="16" />
  </g>

  <!-- DIVINE CLOSE-UP PORTRAIT (Bhagwan Swaminarayan) -->
  <g transform="translate(0, 30)">
    <!-- Grand Halo Glow -->
    <circle cx="400" cy="380" r="240" fill="url(#haloGlow)" />

    <!-- Pure White Silk Vastra & Sanskrit Embroidery -->
    <path d="M 180 820 Q 240 620 400 620 Q 560 620 620 820 Z" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="3" />
    <path d="M 230 680 Q 400 740 570 680" fill="none" stroke="url(#goldJewel)" stroke-width="4" stroke-dasharray="6,4" />

    <!-- Pure Marble Divine Face -->
    <ellipse cx="400" cy="420" rx="95" ry="115" fill="url(#divineSkin)" stroke="#E2D6C5" stroke-width="2" />

    <!-- Ears with Ornate Golden Kundal (Earrings) -->
    <path d="M 305 400 Q 285 430 300 460 Q 315 440 315 410 Z" fill="url(#divineSkin)" />
    <path d="M 495 400 Q 515 430 500 460 Q 485 440 485 410 Z" fill="url(#divineSkin)" />
    <!-- Earring Jewels -->
    <circle cx="295" cy="435" r="8" fill="url(#goldJewel)" stroke="#78350F" stroke-width="1.5" />
    <circle cx="295" cy="455" r="6" fill="#10B981" />
    <circle cx="505" cy="435" r="8" fill="url(#goldJewel)" stroke="#78350F" stroke-width="1.5" />
    <circle cx="505" cy="455" r="6" fill="#10B981" />

    <!-- Sacred Tilak-Chandlo (Exact Tradition) -->
    <rect x="390" y="330" width="20" height="65" rx="5" fill="url(#chandanTilak)" stroke="#EAB308" stroke-width="1" />
    <circle cx="400" cy="365" r="12" fill="#DC2626" stroke="#991B1B" stroke-width="1.5" />
    <circle cx="396" cy="361" r="3.5" fill="#FCA5A5" />

    <!-- Eyebrows (Beautiful black arch) -->
    <path d="M 340 390 Q 365 375 388 388" fill="none" stroke="#171717" stroke-width="4.5" stroke-linecap="round" />
    <path d="M 412 388 Q 435 375 460 390" fill="none" stroke="#171717" stroke-width="4.5" stroke-linecap="round" />

    <!-- Lotus Eyes (Divine compassion) -->
    <ellipse cx="365" cy="415" rx="20" ry="12" fill="#FFFFFF" stroke="#262626" stroke-width="2" />
    <circle cx="367" cy="415" r="8" fill="#171717" />
    <circle cx="369" cy="412" r="2.5" fill="#FFFFFF" />

    <ellipse cx="435" cy="415" rx="20" ry="12" fill="#FFFFFF" stroke="#262626" stroke-width="2" />
    <circle cx="433" cy="415" r="8" fill="#171717" />
    <circle cx="435" cy="412" r="2.5" fill="#FFFFFF" />

    <!-- Auspicious Beauty Mark (Til) on right cheek -->
    <circle cx="345" cy="445" r="3.5" fill="#171717" />

    <!-- Divine Nose -->
    <path d="M 398 395 L 402 460 Q 400 472 388 470 M 402 470 Q 412 472 410 460" fill="none" stroke="#D1BBA2" stroke-width="3" stroke-linecap="round" />

    <!-- Divine Smiling Lips -->
    <path d="M 370 495 Q 400 508 430 495 Q 400 520 370 495 Z" fill="#E11D48" stroke="#BE123C" stroke-width="1.5" />

    <!-- RED ROYAL PAGHDI (Turban with kalgi, pearls & toran) -->
    <path d="M 230 330 C 210 200, 360 140, 460 148 C 570 156, 610 230, 570 335 C 510 280, 290 280, 230 330 Z" fill="url(#paghdiMain)" stroke="#78350F" stroke-width="3" />
    <path d="M 220 340 C 210 300, 310 250, 410 256 C 510 262, 590 300, 570 345 C 530 360, 270 360, 220 340 Z" fill="#991B1B" stroke="#78350F" stroke-width="2.5" />

    <!-- Pearl Brooch on Center of Paghdi -->
    <ellipse cx="400" cy="225" rx="30" ry="38" fill="url(#goldJewel)" stroke="#78350F" stroke-width="2" />
    <ellipse cx="400" cy="225" rx="20" ry="26" fill="#7F1D1D" />
    <circle cx="400" cy="180" r="6" fill="#FFFFFF" /><circle cx="425" cy="225" r="6" fill="#FFFFFF" /><circle cx="400" cy="270" r="6" fill="#FFFFFF" /><circle cx="375" cy="225" r="6" fill="#FFFFFF" />
    <path d="M 270 305 Q 400 295 530 305" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-dasharray="6,4" />

    <!-- Yellow Flower Toran & Hanging Pink Roses -->
    <g fill="#FBBF24" stroke="#D97706" stroke-width="1.5">
      <circle cx="250" cy="270" r="12" /><circle cx="235" cy="295" r="11" /><circle cx="225" cy="325" r="10" /><circle cx="215" cy="355" r="9" />
      <circle cx="550" cy="270" r="12" /><circle cx="565" cy="295" r="11" /><circle cx="575" cy="325" r="10" /><circle cx="585" cy="355" r="9" />
    </g>
    <circle cx="205" cy="385" r="14" fill="#E11D48" /><circle cx="595" cy="385" r="14" fill="#E11D48" />

    <!-- GRAND ROYAL GOLDEN NECKLACE (KANTH-HAAR) & JASMINE GARLAND -->
    <path d="M 330 560 Q 400 620 470 560 C 500 640, 440 700, 400 705 C 360 700, 300 640, 330 560 Z" fill="url(#goldJewel)" stroke="#78350F" stroke-width="3" />
    <circle cx="400" cy="640" r="10" fill="#DC2626" stroke="#991B1B" stroke-width="1.5" />
    <circle cx="365" cy="620" r="8" fill="#10B981" /><circle cx="435" cy="620" r="8" fill="#10B981" />

    <!-- White Mogra Flower Garland (Thick & Fragrant) -->
    <path d="M 300 550 Q 400 780 500 550" fill="none" stroke="#FFFFFF" stroke-width="24" stroke-dasharray="14,4" />
    <!-- Tulsi Kanthi Mala -->
    <path d="M 320 540 Q 400 720 480 540" fill="none" stroke="#78350F" stroke-width="7" stroke-dasharray="8,6" />
    <!-- Red Roses on Chest -->
    <circle cx="340" cy="740" r="18" fill="#DC2626" stroke="#991B1B" stroke-width="2" />
    <circle cx="460" cy="740" r="18" fill="#DC2626" stroke="#991B1B" stroke-width="2" />
  </g>

  <!-- Outer Divine Golden Frame -->
  <rect x="15" y="15" width="770" height="870" fill="none" stroke="url(#goldBorder)" stroke-width="12" rx="20" />
</svg>
`;

// 4. IMG_1335: Satsang Diksha Divya Darshan (The user's first uploaded photo theme)
const svg1335 = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="900" viewBox="0 0 800 900" xmlns="http://www.w3.org/2000/svg">
  ${commonDefs}
  <!-- Backdrop Banner: "सत्संग दीक्षा" in Golden Red -->
  <rect width="800" height="900" fill="#450A0A" />
  <rect x="80" y="80" width="640" height="240" fill="#58080C" rx="12" stroke="#D97706" stroke-width="2" />
  <text x="400" y="160" font-family="'Noto Sans Gujarati', sans-serif" font-weight="900" font-size="52" fill="#FDE047" text-anchor="middle" letter-spacing="6">
    सत्संग दीक्षा
  </text>
  <text x="400" y="215" font-family="'Noto Sans Gujarati', sans-serif" font-weight="700" font-size="22" fill="#FDE68A" text-anchor="middle" letter-spacing="2">
    ॥ શ્રી સ્વામિનારાયણો વિજયતેતરામ્ ॥
  </text>
  <text x="180" y="270" font-family="'Noto Sans Gujarati', sans-serif" font-weight="700" font-size="16" fill="#FCD34D">શિક્ષાપત્રી</text>
  <text x="560" y="270" font-family="'Noto Sans Gujarati', sans-serif" font-weight="700" font-size="16" fill="#FCD34D">અક્ષરપુરુષોત્તમ</text>

  <!-- DIVINE MURTI CLOSE-UP (Bhagwan Swaminarayan) -->
  <g transform="translate(0, 40)">
    <!-- Grand Halo -->
    <circle cx="400" cy="370" r="230" fill="url(#haloGlow)" />

    <!-- Pure White Silk Vastra -->
    <path d="M 180 810 Q 240 610 400 610 Q 560 610 620 810 Z" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="3" />
    <path d="M 230 670 Q 400 730 570 670" fill="none" stroke="url(#goldJewel)" stroke-width="4" stroke-dasharray="6,4" />

    <!-- Pure Marble Face -->
    <ellipse cx="400" cy="410" rx="95" ry="115" fill="url(#divineSkin)" stroke="#E2D6C5" stroke-width="2" />

    <!-- Ears with Ornate Golden Kundal -->
    <circle cx="295" cy="425" r="8" fill="url(#goldJewel)" stroke="#78350F" stroke-width="1.5" />
    <circle cx="295" cy="445" r="6" fill="#10B981" />
    <circle cx="505" cy="425" r="8" fill="url(#goldJewel)" stroke="#78350F" stroke-width="1.5" />
    <circle cx="505" cy="445" r="6" fill="#10B981" />

    <!-- Sacred Tilak-Chandlo -->
    <rect x="390" y="320" width="20" height="65" rx="5" fill="url(#chandanTilak)" stroke="#EAB308" stroke-width="1" />
    <circle cx="400" cy="355" r="12" fill="#DC2626" stroke="#991B1B" stroke-width="1.5" />
    <circle cx="396" cy="351" r="3.5" fill="#FCA5A5" />

    <!-- Eyebrows & Eyes -->
    <path d="M 340 380 Q 365 365 388 378" fill="none" stroke="#171717" stroke-width="4.5" stroke-linecap="round" />
    <path d="M 412 378 Q 435 365 460 380" fill="none" stroke="#171717" stroke-width="4.5" stroke-linecap="round" />
    <ellipse cx="365" cy="405" rx="20" ry="12" fill="#FFFFFF" stroke="#262626" stroke-width="2" />
    <circle cx="367" cy="405" r="8" fill="#171717" /><circle cx="369" cy="402" r="2.5" fill="#FFFFFF" />
    <ellipse cx="435" cy="405" rx="20" ry="12" fill="#FFFFFF" stroke="#262626" stroke-width="2" />
    <circle cx="433" cy="405" r="8" fill="#171717" /><circle cx="435" cy="402" r="2.5" fill="#FFFFFF" />

    <!-- Auspicious Beauty Mark (Til) -->
    <circle cx="345" cy="435" r="3.5" fill="#171717" />

    <!-- Gentle Smiling Lips -->
    <path d="M 370 485 Q 400 498 430 485 Q 400 510 370 485 Z" fill="#E11D48" stroke="#BE123C" stroke-width="1.5" />

    <!-- RED ROYAL PAGHDI (Turban with pearl crest) -->
    <path d="M 230 320 C 210 190, 360 130, 460 138 C 570 146, 610 220, 570 325 C 510 270, 290 270, 230 320 Z" fill="url(#paghdiMain)" stroke="#78350F" stroke-width="3" />
    <path d="M 220 330 C 210 290, 310 240, 410 246 C 510 252, 590 290, 570 335 C 530 350, 270 350, 220 330 Z" fill="#991B1B" stroke="#78350F" stroke-width="2.5" />

    <!-- Pearl Brooch on Center of Paghdi -->
    <ellipse cx="400" cy="215" rx="30" ry="38" fill="url(#goldJewel)" stroke="#78350F" stroke-width="2" />
    <ellipse cx="400" cy="215" rx="20" ry="26" fill="#7F1D1D" />
    <circle cx="400" cy="170" r="6" fill="#FFFFFF" /><circle cx="425" cy="215" r="6" fill="#FFFFFF" /><circle cx="400" cy="260" r="6" fill="#FFFFFF" /><circle cx="375" cy="215" r="6" fill="#FFFFFF" />
    <path d="M 270 295 Q 400 285 530 295" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-dasharray="6,4" />

    <!-- Yellow Flower Toran & Hanging Pink Roses -->
    <g fill="#FBBF24" stroke="#D97706" stroke-width="1.5">
      <circle cx="250" cy="260" r="12" /><circle cx="235" cy="285" r="11" /><circle cx="225" cy="315" r="10" /><circle cx="215" cy="345" r="9" />
      <circle cx="550" cy="260" r="12" /><circle cx="565" cy="285" r="11" /><circle cx="575" cy="315" r="10" /><circle cx="585" cy="345" r="9" />
    </g>
    <circle cx="205" cy="375" r="14" fill="#E11D48" /><circle cx="595" cy="375" r="14" fill="#E11D48" />

    <!-- Grand Royal Necklace & White Mogra Garland -->
    <path d="M 330 550 Q 400 610 470 550 C 500 630, 440 690, 400 695 C 360 690, 300 630, 330 550 Z" fill="url(#goldJewel)" stroke="#78350F" stroke-width="3" />
    <circle cx="400" cy="630" r="10" fill="#DC2626" stroke="#991B1B" stroke-width="1.5" />
    <circle cx="365" cy="610" r="8" fill="#10B981" /><circle cx="435" cy="610" r="8" fill="#10B981" />

    <path d="M 300 540 Q 400 770 500 540" fill="none" stroke="#FFFFFF" stroke-width="24" stroke-dasharray="14,4" />
    <path d="M 320 530 Q 400 710 480 530" fill="none" stroke="#78350F" stroke-width="7" stroke-dasharray="8,6" />

    <!-- Red Roses on Chest -->
    <circle cx="340" cy="730" r="18" fill="#DC2626" stroke="#991B1B" stroke-width="2" />
    <circle cx="460" cy="730" r="18" fill="#DC2626" stroke="#991B1B" stroke-width="2" />

    <!-- Blessing Hands in Abhaydan Mudra with Bangles -->
    <g>
      <path d="M 570 700 Q 600 670 610 720 Q 595 760 565 745 Z" fill="url(#divineSkin)" stroke="#E2D6C5" stroke-width="1.5" />
      <rect x="555" y="725" width="45" height="15" rx="4" fill="url(#goldJewel)" stroke="#78350F" stroke-width="1" />
      <circle cx="565" cy="732" r="3" fill="#DC2626" /><circle cx="577" cy="732" r="3" fill="#10B981" /><circle cx="590" cy="732" r="3" fill="#DC2626" />
    </g>
  </g>

  <!-- Outer Divine Border -->
  <rect x="15" y="15" width="770" height="870" fill="none" stroke="url(#goldBorder)" stroke-width="12" rx="20" />
</svg>
`;

async function generateAll() {
  const images = [
    { svg: svg1338, name: 'IMG_1338', altName: 'darshan-1338' },
    { svg: svg1337, name: 'IMG_1337', altName: 'darshan-1337' },
    { svg: svg1336, name: 'IMG_1336', altName: 'darshan-1336' },
    { svg: svg1335, name: 'IMG_1335', altName: 'darshan-1335' },
  ];

  for (const img of images) {
    console.log(`Rendering ${img.name}...`);
    const pngData = await renderAsync(img.svg, {
      fitTo: { mode: 'width', value: 800 },
    });
    const buffer = pngData.asPng();

    // Save as .jpeg and .png in public/
    fs.writeFileSync(`./public/${img.name}.jpeg`, buffer);
    fs.writeFileSync(`./public/${img.name}.png`, buffer);
    fs.writeFileSync(`./public/${img.altName}.png`, buffer);
    fs.writeFileSync(`./public/${img.name}.svg`, img.svg.trim());

    // Also update dist/
    if (fs.existsSync('./dist')) {
      fs.writeFileSync(`./dist/${img.name}.jpeg`, buffer);
      fs.writeFileSync(`./dist/${img.name}.png`, buffer);
      fs.writeFileSync(`./dist/${img.altName}.png`, buffer);
      fs.writeFileSync(`./dist/${img.name}.svg`, img.svg.trim());
    }
    console.log(`Saved ${img.name}.jpeg and ${img.altName}.png successfully!`);
  }
}

generateAll().catch(err => {
  console.error('Error rendering images:', err);
  process.exit(1);
});
