/**
 * Gmail REST API integration service for Google Workspace
 */

export interface GmailProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

export interface GmailMessageHeader {
  name: string;
  value: string;
}

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet?: string;
  subject?: string;
  from?: string;
  to?: string;
  date?: string;
  labelIds?: string[];
  isUnread?: boolean;
}

export interface GmailMessageDetail extends GmailMessageSummary {
  bodyText?: string;
  bodyHtml?: string;
  headers: GmailMessageHeader[];
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  body: string;
  cc?: string;
  replyTo?: string;
}

// Convert Unicode string to base64url (RFC 4648)
export function encodeBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Convert base64url to UTF-8 decoded string
export function decodeBase64Url(str: string): string {
  try {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
  } catch (err) {
    console.error('Failed to decode base64url data:', err);
    return '';
  }
}

/**
 * Format RFC 2822 Email Message
 */
export function buildRfc822Email({
  to,
  subject,
  body,
  cc,
  replyTo
}: SendEmailPayload): string {
  // UTF-8 subject encode for non-ASCII Gujarati characters
  const encodedSubject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;

  const headerLines = [
    `To: ${to}`,
    cc ? `Cc: ${cc}` : null,
    replyTo ? `Reply-To: ${replyTo}` : null,
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit'
  ].filter(Boolean);

  return `${headerLines.join('\r\n')}\r\n\r\n${body}`;
}

/**
 * Fetch authenticated user's Gmail profile
 */
export async function getGmailProfile(accessToken: string): Promise<GmailProfile> {
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Gmail API Error: ${res.statusText}`);
  }

  return res.json();
}

/**
 * List messages with optional search query & labels
 */
export async function listGmailMessages(
  accessToken: string,
  options: {
    maxResults?: number;
    q?: string;
    labelIds?: string[];
    pageToken?: string;
  } = {}
): Promise<{ messages: { id: string; threadId: string }[]; nextPageToken?: string }> {
  const url = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
  url.searchParams.set('maxResults', String(options.maxResults || 15));
  if (options.q) url.searchParams.set('q', options.q);
  if (options.pageToken) url.searchParams.set('pageToken', options.pageToken);
  if (options.labelIds && options.labelIds.length > 0) {
    options.labelIds.forEach(l => url.searchParams.append('labelIds', l));
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Gmail API Error: ${res.statusText}`);
  }

  const data = await res.json();
  return {
    messages: data.messages || [],
    nextPageToken: data.nextPageToken
  };
}

/**
 * Parse a message payload to extract plain body text and html
 */
function extractBodyFromPayload(payload: any): { text?: string; html?: string } {
  let text = '';
  let html = '';

  function traverse(part: any) {
    if (part.mimeType === 'text/plain' && part.body?.data) {
      text = decodeBase64Url(part.body.data);
    } else if (part.mimeType === 'text/html' && part.body?.data) {
      html = decodeBase64Url(part.body.data);
    }

    if (part.parts && Array.isArray(part.parts)) {
      part.parts.forEach(traverse);
    }
  }

  if (payload.body?.data) {
    if (payload.mimeType === 'text/html') {
      html = decodeBase64Url(payload.body.data);
    } else {
      text = decodeBase64Url(payload.body.data);
    }
  }

  if (payload.parts) {
    payload.parts.forEach(traverse);
  }

  return { text, html };
}

/**
 * Retrieve complete message details
 */
export async function getGmailMessageDetails(
  accessToken: string,
  messageId: string
): Promise<GmailMessageDetail> {
  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Gmail API Error: ${res.statusText}`);
  }

  const msg = await res.json();
  const headers: GmailMessageHeader[] = msg.payload?.headers || [];

  const getHeader = (name: string) => 
    headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

  const { text, html } = extractBodyFromPayload(msg.payload || {});

  return {
    id: msg.id,
    threadId: msg.threadId,
    snippet: msg.snippet,
    subject: getHeader('Subject') || '(કોઈ વિષય નથી)',
    from: getHeader('From'),
    to: getHeader('To'),
    date: getHeader('Date'),
    labelIds: msg.labelIds || [],
    isUnread: (msg.labelIds || []).includes('UNREAD'),
    bodyText: text || msg.snippet || '',
    bodyHtml: html,
    headers
  };
}

/**
 * Send an email using authenticated user's Gmail
 */
export async function sendGmailEmail(
  accessToken: string,
  payload: SendEmailPayload
): Promise<{ id: string; threadId: string; labelIds?: string[] }> {
  const rawRfc = buildRfc822Email(payload);
  const rawBase64 = encodeBase64Url(rawRfc);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      raw: rawBase64
    })
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Failed to send email: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Save email as a Draft in user's Gmail
 */
export async function createGmailDraft(
  accessToken: string,
  payload: SendEmailPayload
): Promise<{ id: string; message: { id: string; threadId: string } }> {
  const rawRfc = buildRfc822Email(payload);
  const rawBase64 = encodeBase64Url(rawRfc);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      message: {
        raw: rawBase64
      }
    })
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Failed to create draft: ${res.statusText}`);
  }

  return res.json();
}
