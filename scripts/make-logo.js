import fs from 'fs';
import { renderAsync } from '@resvg/resvg-js';

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Rich Gold Gradients -->
    <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3B0" />
      <stop offset="20%" stop-color="#E5A93C" />
      <stop offset="40%" stop-color="#FFF8D6" />
      <stop offset="60%" stop-color="#C5851C" />
      <stop offset="85%" stop-color="#F3C358" />
      <stop offset="100%" stop-color="#99600F" />
    </linearGradient>

    <radialGradient id="haloGlow" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#FFE885" stop-opacity="0.9" />
      <stop offset="45%" stop-color="#F59E0B" stop-opacity="0.6" />
      <stop offset="75%" stop-color="#D97706" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#78350F" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="sanctumRed" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#A51D24" />
      <stop offset="60%" stop-color="#7A0D12" />
      <stop offset="100%" stop-color="#3D0306" />
    </radialGradient>

    <!-- Red Royal Paghdi Gradients -->
    <linearGradient id="paghdiMain" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#FF3838" />
      <stop offset="35%" stop-color="#E11D23" />
      <stop offset="70%" stop-color="#B91016" />
      <stop offset="100%" stop-color="#75060A" />
    </linearGradient>

    <linearGradient id="paghdiFold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#9E0B0F" />
      <stop offset="50%" stop-color="#EF4444" />
      <stop offset="100%" stop-color="#7E060A" />
    </linearGradient>

    <!-- Divine Marble Face Gradients -->
    <linearGradient id="divineSkin" x1="30%" y1="10%" x2="70%" y2="90%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#FAF7F2" />
      <stop offset="85%" stop-color="#F2EBE0" />
      <stop offset="100%" stop-color="#E0D3C1" />
    </linearGradient>

    <linearGradient id="chandanTilak" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="100%" stop-color="#CA8A04" />
    </linearGradient>

    <!-- Ornate Jewelry -->
    <linearGradient id="goldJewel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB" />
      <stop offset="30%" stop-color="#F59E0B" />
      <stop offset="70%" stop-color="#B45309" />
      <stop offset="100%" stop-color="#FDE68A" />
    </linearGradient>

    <!-- White Vastra Silk -->
    <linearGradient id="silkRobe" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="60%" stop-color="#F8FAFC" />
      <stop offset="100%" stop-color="#E2E8F0" />
    </linearGradient>
  </defs>

  <!-- Circular Base Backdrop -->
  <circle cx="256" cy="256" r="250" fill="url(#sanctumRed)" />

  <!-- Divine Halo Glow -->
  <circle cx="256" cy="225" r="190" fill="url(#haloGlow)" />

  <!-- Outer Divine Golden Frame Rings -->
  <circle cx="256" cy="256" r="248" fill="none" stroke="url(#goldBorder)" stroke-width="10" />
  <circle cx="256" cy="256" r="239" fill="none" stroke="#3D0306" stroke-width="2.5" />
  <circle cx="256" cy="256" r="234" fill="none" stroke="url(#goldBorder)" stroke-width="4" />

  <!-- Sacred Decorative Golden Beads around Ring -->
  <g fill="#FDE68A">
    <circle cx="256" cy="14" r="3.5" /><circle cx="298" cy="18" r="3.5" /><circle cx="339" cy="28" r="3.5" />
    <circle cx="378" cy="46" r="3.5" /><circle cx="414" cy="71" r="3.5" /><circle cx="444" cy="103" r="3.5" />
    <circle cx="468" cy="140" r="3.5" /><circle cx="484" cy="180" r="3.5" /><circle cx="493" cy="223" r="3.5" />
    <circle cx="493" cy="268" r="3.5" /><circle cx="485" cy="312" r="3.5" /><circle cx="468" cy="353" r="3.5" />
    <circle cx="443" cy="391" r="3.5" /><circle cx="412" cy="423" r="3.5" /><circle cx="376" cy="448" r="3.5" />
    <circle cx="336" cy="466" r="3.5" /><circle cx="294" cy="476" r="3.5" /><circle cx="256" cy="480" r="3.5" />
    <circle cx="218" cy="476" r="3.5" /><circle cx="176" cy="466" r="3.5" /><circle cx="136" cy="448" r="3.5" />
    <circle cx="100" cy="423" r="3.5" /><circle cx="69" cy="391" r="3.5" /><circle cx="44" cy="353" r="3.5" />
    <circle cx="27" cy="312" r="3.5" /><circle cx="19" cy="268" r="3.5" /><circle cx="19" cy="223" r="3.5" />
    <circle cx="28" cy="180" r="3.5" /><circle cx="44" cy="140" r="3.5" /><circle cx="68" cy="103" r="3.5" />
    <circle cx="98" cy="71" r="3.5" /><circle cx="134" cy="46" r="3.5" /><circle cx="173" cy="28" r="3.5" />
    <circle cx="214" cy="18" r="3.5" />
  </g>

  <!-- Sacred Text: Gujarati Banner at Top and Bottom -->
  <path id="topTextArc" d="M 82,256 A 174,174 0 0,1 430,256" fill="none" />
  <path id="bottomTextArc" d="M 74,256 A 182,182 0 0,0 438,256" fill="none" />

  <text font-family="'Noto Sans Gujarati', 'Noto Serif Gujarati', 'Segoe UI', serif" font-weight="700" font-size="14" fill="#FDE047" letter-spacing="2">
    <textPath href="#topTextArc" startOffset="50%" text-anchor="middle">
      ॥ શ્રી સ્વામિનારાયણો વિજયતેતરામ્ ॥
    </textPath>
  </text>
  <text font-family="'Noto Sans Gujarati', 'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="#FFFBEB" letter-spacing="1">
    <textPath href="#bottomTextArc" startOffset="50%" text-anchor="middle">
      શ્રી સ્વામિનારાયણ મહિલા સંપ્રદાય
    </textPath>
  </text>

  <!-- SACRED MURTI COMPOSITION (Centered Darshan from IMG_1335.jpeg) -->
  <g>
    <!-- White Silk Vastra (Body & Robes) -->
    <path d="M 120 460 Q 150 370 210 330 L 302 330 Q 362 370 392 460 Z" fill="url(#silkRobe)" stroke="#CBD5E1" stroke-width="1.5" />
    
    <!-- Gold Embroidery on Vastra Chest -->
    <path d="M 210 330 L 256 390 L 302 330 Z" fill="#FEF3C7" stroke="url(#goldJewel)" stroke-width="2" />
    <path d="M 225 340 Q 256 375 287 340" fill="none" stroke="#D97706" stroke-width="2" stroke-dasharray="2,3" />

    <!-- Pure Marble Divine Neck -->
    <path d="M 230 270 Q 230 320 256 325 Q 282 320 282 270 Z" fill="url(#divineSkin)" />

    <!-- Pure Marble Divine Face (Graceful oval) -->
    <path d="M 198 185 Q 186 245 220 278 Q 256 298 292 278 Q 326 245 314 185 Q 256 168 198 185 Z" fill="url(#divineSkin)" stroke="#E2D6C5" stroke-width="1" />

    <!-- Left Earring with Pearl Drop & Emerald -->
    <g>
      <path d="M 190 205 Q 180 220 188 238 Q 196 230 196 210 Z" fill="url(#divineSkin)" />
      <path d="M 180 215 C 172 235, 175 255, 186 265 C 192 250, 192 230, 185 218 Z" fill="url(#goldJewel)" stroke="#78350F" stroke-width="0.7" />
      <circle cx="182" cy="235" r="3.5" fill="#10B981" stroke="#047857" stroke-width="0.5" />
      <circle cx="184" cy="265" r="3" fill="#FFFFFF" stroke="#D1D5DB" stroke-width="0.5" />
    </g>

    <!-- Right Earring with Pearl Drop & Emerald -->
    <g>
      <path d="M 322 205 Q 332 220 324 238 Q 316 230 316 210 Z" fill="url(#divineSkin)" />
      <path d="M 332 215 C 340 235, 337 255, 326 265 C 320 250, 320 230, 327 218 Z" fill="url(#goldJewel)" stroke="#78350F" stroke-width="0.7" />
      <circle cx="330" cy="235" r="3.5" fill="#10B981" stroke="#047857" stroke-width="0.5" />
      <circle cx="328" cy="265" r="3" fill="#FFFFFF" stroke="#D1D5DB" stroke-width="0.5" />
    </g>

    <!-- Eyebrows (Black, delicately curved arch) -->
    <path d="M 215 198 Q 232 191 247 197" fill="none" stroke="#171717" stroke-width="2.6" stroke-linecap="round" />
    <path d="M 265 197 Q 280 191 297 198" fill="none" stroke="#171717" stroke-width="2.6" stroke-linecap="round" />

    <!-- Lotus Eyes (Graceful, compassionate) -->
    <!-- Left Eye -->
    <path d="M 216 211 Q 231 202 245 211 Q 231 220 216 211 Z" fill="#FFFFFF" stroke="#262626" stroke-width="1.2" />
    <circle cx="232" cy="211" r="4.2" fill="#171717" />
    <circle cx="232" cy="211" r="2.2" fill="#3D2612" />
    <circle cx="233" cy="210" r="1.2" fill="#FFFFFF" />

    <!-- Right Eye -->
    <path d="M 267 211 Q 281 202 296 211 Q 281 220 267 211 Z" fill="#FFFFFF" stroke="#262626" stroke-width="1.2" />
    <circle cx="280" cy="211" r="4.2" fill="#171717" />
    <circle cx="280" cy="211" r="2.2" fill="#3D2612" />
    <circle cx="281" cy="210" r="1.2" fill="#FFFFFF" />

    <!-- Sacred Tilak-Chandlo (Yellow Chandan U-shape + Red Kumkum Chandlo) -->
    <path d="M 247 172 L 247 215 Q 256 226 265 215 L 265 172 L 259 172 L 259 208 Q 256 214 253 208 L 253 172 Z" fill="url(#chandanTilak)" stroke="#EAB308" stroke-width="0.6" />
    <circle cx="256" cy="192" r="5.2" fill="#DC2626" stroke="#991B1B" stroke-width="0.8" />
    <circle cx="254.5" cy="190.5" r="1.5" fill="#FCA5A5" opacity="0.8" />

    <!-- Divine Nose -->
    <path d="M 255 200 L 257 232 Q 256 238 250 238 M 256 238 Q 262 238 261 233" fill="none" stroke="#D1BBA2" stroke-width="1.6" stroke-linecap="round" />

    <!-- Gentle Smiling Lips -->
    <path d="M 238 252 Q 256 258 274 252 Q 256 266 238 252 Z" fill="#E11D48" stroke="#BE123C" stroke-width="0.8" />
    <path d="M 238 252 Q 256 256 274 252" fill="none" stroke="#881337" stroke-width="1" />

    <!-- Beauty Mark (Til) on right cheek -->
    <circle cx="225" cy="235" r="1.8" fill="#1C1917" />

    <!-- RED ROYAL PAGHDI (Sacred Turban with folds & ornate crest) -->
    <path d="M 152 178 C 145 105, 230 70, 290 74 C 360 78, 385 130, 360 185 C 330 155, 180 150, 152 178 Z" fill="url(#paghdiMain)" stroke="#7F1D1D" stroke-width="2" />
    <path d="M 148 182 C 140 160, 200 130, 260 134 C 320 138, 375 160, 362 188 C 340 198, 175 198, 148 182 Z" fill="url(#paghdiFold)" stroke="#991B1B" stroke-width="1.8" />

    <!-- Golden Kalgi & Pearl Brooch on Paghdi -->
    <g>
      <path d="M 238 78 Q 256 42 274 78 Q 256 70 238 78 Z" fill="url(#goldJewel)" stroke="#B45309" stroke-width="1" />
      <circle cx="256" cy="46" r="3" fill="#DC2626" />
      <ellipse cx="256" cy="115" rx="19" ry="24" fill="url(#goldJewel)" stroke="#78350F" stroke-width="1.2" />
      <ellipse cx="256" cy="115" rx="12" ry="16" fill="#7F1D1D" />
      <circle cx="256" cy="94" r="2.8" fill="#FFFFFF" /><circle cx="268" cy="99" r="2.8" fill="#FFFFFF" />
      <circle cx="274" cy="112" r="2.8" fill="#FFFFFF" /><circle cx="270" cy="126" r="2.8" fill="#FFFFFF" />
      <circle cx="256" cy="133" r="2.8" fill="#FFFFFF" /><circle cx="242" cy="126" r="2.8" fill="#FFFFFF" />
      <circle cx="238" cy="112" r="2.8" fill="#FFFFFF" /><circle cx="244" cy="99" r="2.8" fill="#FFFFFF" />
      <path d="M 175 166 Q 256 160 338 168" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="4,3" />
    </g>

    <!-- Yellow Flower Toran & Pink Roses on sides -->
    <g fill="#FBBF24" stroke="#D97706" stroke-width="0.8">
      <circle cx="160" cy="145" r="7" /><circle cx="152" cy="158" r="6.5" />
      <circle cx="145" cy="173" r="6.5" /><circle cx="138" cy="190" r="6" />
      <circle cx="132" cy="208" r="5.5" />
    </g>
    <path d="M 125 220 C 118 226, 122 245, 134 248 C 142 244, 142 228, 132 220 Z" fill="#E11D48" stroke="#9F1239" stroke-width="1" />
    
    <g fill="#FBBF24" stroke="#D97706" stroke-width="0.8">
      <circle cx="352" cy="145" r="7" /><circle cx="360" cy="158" r="6.5" />
      <circle cx="367" cy="173" r="6.5" /><circle cx="374" cy="190" r="6" />
      <circle cx="380" cy="208" r="5.5" />
    </g>
    <path d="M 387 220 C 394 226, 390 245, 378 248 C 370 244, 370 228, 380 220 Z" fill="#E11D48" stroke="#9F1239" stroke-width="1" />

    <!-- GRAND ORNATE ROYAL NECKLACE (KANTH-HAAR) -->
    <g>
      <path d="M 215 315 Q 256 348 297 315 C 315 355, 275 390, 256 395 C 237 390, 197 355, 215 315 Z" fill="url(#goldJewel)" stroke="#78350F" stroke-width="1.5" />
      <circle cx="256" cy="355" r="6" fill="#DC2626" stroke="#991B1B" stroke-width="1" />
      <circle cx="236" cy="342" r="4.5" fill="#10B981" stroke="#047857" stroke-width="0.8" />
      <circle cx="276" cy="342" r="4.5" fill="#10B981" stroke="#047857" stroke-width="0.8" />
      <circle cx="222" cy="328" r="3.5" fill="#DC2626" stroke="#991B1B" stroke-width="0.6" />
      <circle cx="290" cy="328" r="3.5" fill="#DC2626" stroke="#991B1B" stroke-width="0.6" />
      <circle cx="256" cy="405" r="4" fill="#FFFFFF" stroke="#D1D5DB" stroke-width="0.8" />
      <circle cx="242" cy="396" r="3.5" fill="#FFFFFF" stroke="#D1D5DB" stroke-width="0.8" />
      <circle cx="270" cy="396" r="3.5" fill="#FFFFFF" stroke="#D1D5DB" stroke-width="0.8" />
      <circle cx="228" cy="380" r="3" fill="#FFFFFF" stroke="#D1D5DB" stroke-width="0.8" />
      <circle cx="284" cy="380" r="3" fill="#FFFFFF" stroke="#D1D5DB" stroke-width="0.8" />
    </g>

    <!-- Brown Kanthi Bead Mala -->
    <path d="M 205 310 Q 256 425 307 310" fill="none" stroke="#78350F" stroke-width="4.5" stroke-dasharray="5,4" />

    <!-- Fragrant White Mogra Flower Garland (Pushpa Haar) -->
    <g fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1">
      <circle cx="198" cy="315" r="7.5" /><circle cx="190" cy="335" r="8" />
      <circle cx="185" cy="358" r="8.5" /><circle cx="182" cy="382" r="9" />
      <circle cx="184" cy="408" r="9.5" /><circle cx="192" cy="432" r="10" />
      <circle cx="314" cy="315" r="7.5" /><circle cx="322" cy="335" r="8" />
      <circle cx="327" cy="358" r="8.5" /><circle cx="330" cy="382" r="9" />
      <circle cx="328" cy="408" r="9.5" /><circle cx="320" cy="432" r="10" />
      <circle cx="208" cy="340" r="6" /><circle cx="204" cy="365" r="6.5" />
      <circle cx="304" cy="340" r="6" /><circle cx="308" cy="365" r="6.5" />
    </g>

    <!-- Two Fresh Red Roses on Chest -->
    <g>
      <circle cx="218" cy="445" r="12" fill="#DC2626" stroke="#991B1B" stroke-width="1.2" />
      <path d="M 213 440 C 218 435, 224 445, 222 450 C 215 452, 212 445, 213 440 Z" fill="#B91016" />
      <circle cx="294" cy="445" r="12" fill="#DC2626" stroke="#991B1B" stroke-width="1.2" />
      <path d="M 289 440 C 294 435, 300 445, 298 450 C 291 452, 288 445, 289 440 Z" fill="#B91016" />
    </g>

    <!-- Blessing Hand with Bangles -->
    <g>
      <path d="M 370 420 Q 388 400 395 430 Q 385 455 365 448 Z" fill="url(#divineSkin)" stroke="#E2D6C5" stroke-width="1" />
      <rect x="360" y="435" width="28" height="10" rx="3" fill="url(#goldJewel)" stroke="#78350F" stroke-width="0.8" />
      <circle cx="366" cy="440" r="2" fill="#DC2626" /><circle cx="374" cy="440" r="2" fill="#10B981" /><circle cx="382" cy="440" r="2" fill="#DC2626" />
    </g>
  </g>
</svg>
`;

async function main() {
  // 1. Write SVG
  fs.writeFileSync('./public/swaminarayan-logo.svg', svg.trim());
  console.log('Wrote ./public/swaminarayan-logo.svg');

  // 2. Render SVG to high-res PNG (512x512) using @resvg/resvg-js
  const pngData = await renderAsync(svg, {
    fitTo: {
      mode: 'width',
      value: 512,
    },
  });

  const pngBuffer = pngData.asPng();

  // 3. Save to all target image locations
  fs.writeFileSync('./public/swaminarayan-logo.png', pngBuffer);
  fs.writeFileSync('./public/baps-logo.png', pngBuffer);
  fs.writeFileSync('./public/logo.png', pngBuffer);
  fs.writeFileSync('./public/IMG_1335.jpeg', pngBuffer);
  if (fs.existsSync('./public/assets')) {
    fs.writeFileSync('./public/assets/baps-logo.png', pngBuffer);
  }

  // 4. Also update dist directory if present
  if (fs.existsSync('./dist')) {
    fs.writeFileSync('./dist/swaminarayan-logo.png', pngBuffer);
    fs.writeFileSync('./dist/swaminarayan-logo.svg', svg.trim());
    fs.writeFileSync('./dist/baps-logo.png', pngBuffer);
    fs.writeFileSync('./dist/logo.png', pngBuffer);
    fs.writeFileSync('./dist/IMG_1335.jpeg', pngBuffer);
    if (fs.existsSync('./dist/assets')) {
      fs.writeFileSync('./dist/assets/baps-logo.png', pngBuffer);
    }
  }

  console.log('Successfully generated all Swaminarayan logo assets in public and dist!');
}

main().catch(err => {
  console.error('Failed to generate logo:', err);
  process.exit(1);
});
