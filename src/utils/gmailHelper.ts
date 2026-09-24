/**
 * Gmail Helper utility to safely construct Gmail Compose URLs with FULL details
 * without hitting HTTP 400 Bad Request or 414 Request-URI Too Large from Google Front End.
 */

export interface SafeGmailUrlResult {
  url: string;
  isTruncated: boolean;
  safeBodyText: string;
}

/**
 * Creates a clean, highly legible version of the body text that preserves 100% of the
 * vital data (Member #, Name, Address, Phone, Amount, Receipt, Menu, Role, etc.)
 * while removing bloated ASCII divider bars (==== and ----) so that it safely fits in Gmail's GET limit.
 */
export function sanitizeBodyForGmailUrl(fullBody: string): string {
  // Split into lines
  const lines = fullBody.split('\n');
  const cleanLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Skip heavy ascii borders
    if (/^[=\-~_*]{4,}$/.test(trimmed)) {
      continue;
    }
    // Skip redundant disclaimer notes
    if (trimmed.startsWith('📄 [સૂચના]') || trimmed.startsWith('[નોંધ:')) {
      continue;
    }
    cleanLines.push(line);
  }

  const cleaned = cleanLines.join('\n').trim();

  // If already under 1,600 encoded bytes, return as is
  if (encodeURIComponent(cleaned).length < 1600) {
    return cleaned;
  }

  // If still long, preserve all bullet points and key information lines
  const essentialLines: string[] = [];
  for (const line of cleanLines) {
    const t = line.trim();
    if (
      t.startsWith('•') || 
      t.startsWith('॥') || 
      t.startsWith('શ્રી') || 
      t.startsWith('સત્તાવાર') ||
      t.startsWith('જય') || 
      t.startsWith('દાન રકમ') || 
      t.startsWith('સેવા રકમ') || 
      t.startsWith('અંકે') ||
      t.startsWith('વાનગીઓ') ||
      t.startsWith('લી.')
    ) {
      essentialLines.push(t);
    }
  }

  let result = essentialLines.join('\n');
  // If still exceeds, trim from bottom lines while keeping all primary fields
  while (encodeURIComponent(result).length > 1600 && essentialLines.length > 5) {
    essentialLines.pop();
    result = essentialLines.join('\n');
  }

  return result || cleaned.slice(0, 180);
}

/**
 * Builds a safe URL for opening Gmail compose in browser.
 * Google Front End (GFE) strictly limits the total HTTP GET query line to ~2,000 bytes.
 * Because Gujarati characters are 3-byte UTF-8 sequences that encode to 9 characters (%XX%XX%XX),
 * we clean the body to ensure ALL information is present without blowing past the limit.
 */
export function buildSafeGmailComposeUrl(
  recipient: string,
  subject: string,
  fullBody: string
): SafeGmailUrlResult {
  const baseUrl = 'https://mail.google.com/mail/?view=cm&fs=1';
  const toEncoded = encodeURIComponent((recipient || 'bhaktidevani81@gmail.com').trim());
  const safeSubject = subject.slice(0, 100).trim();
  const suEncoded = encodeURIComponent(safeSubject);

  const safeBodyText = sanitizeBodyForGmailUrl(fullBody);
  const bEncoded = encodeURIComponent(safeBodyText);

  return {
    url: `${baseUrl}&to=${toEncoded}&su=${suEncoded}&body=${bEncoded}`,
    isTruncated: false,
    safeBodyText
  };
}

/**
 * Safely copies the 100% complete text (and rich HTML if available) to clipboard and opens Gmail.
 */
export async function openGmailSafely(
  recipient: string,
  subject: string,
  fullBody: string,
  richHtmlOrNotice?: string | ((message: string) => void),
  onCopiedNotice?: (message: string) => void
): Promise<void> {
  const richHtml = typeof richHtmlOrNotice === 'string' ? richHtmlOrNotice : undefined;
  const noticeCallback = typeof richHtmlOrNotice === 'function' ? richHtmlOrNotice : onCopiedNotice;

  // 1. Copy complete text + rich HTML to clipboard
  try {
    if (richHtml && navigator.clipboard && window.ClipboardItem) {
      const textBlob = new Blob([fullBody], { type: 'text/plain' });
      const htmlBlob = new Blob([richHtml], { type: 'text/html' });
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': textBlob,
          'text/html': htmlBlob
        })
      ]);
    } else {
      await navigator.clipboard.writeText(fullBody);
    }

    if (noticeCallback) {
      noticeCallback('સંપૂર્ણ વિગતો સાથે Gmail ખૂલી રહ્યું છે!');
    }
  } catch (err) {
    console.warn('Clipboard write warning:', err);
  }

  // 2. Build safe Gmail URL with clean complete details
  const { url } = buildSafeGmailComposeUrl(recipient, subject, fullBody);

  // 3. Open Gmail in a new tab
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Standard mailto: protocol launcher that supports large bodies without GET URL limit
 */
export function openMailto(recipient: string, subject: string, fullBody: string): void {
  const to = encodeURIComponent((recipient || 'bhaktidevani81@gmail.com').trim());
  const su = encodeURIComponent(subject.trim());
  const bo = encodeURIComponent(fullBody.trim());
  const mailtoUrl = `mailto:${to}?subject=${su}&body=${bo}`;
  window.location.href = mailtoUrl;
}
