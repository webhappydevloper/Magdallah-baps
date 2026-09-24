import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User 
} from 'firebase/auth';
import { auth } from '../firebase';

// All requested and configured Gmail scopes
export const GMAIL_SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.addons.current.action.compose',
  'https://www.googleapis.com/auth/gmail.addons.current.message.action',
  'https://www.googleapis.com/auth/gmail.addons.current.message.metadata',
  'https://www.googleapis.com/auth/gmail.addons.current.message.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.insert',
  'https://www.googleapis.com/auth/gmail.labels',
  'https://www.googleapis.com/auth/gmail.metadata',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.settings.basic',
  'https://www.googleapis.com/auth/gmail.settings.sharing',
];

const provider = new GoogleAuthProvider();
GMAIL_SCOPES.forEach(scope => provider.addScope(scope));
provider.setCustomParameters({
  prompt: 'select_account'
});

// CRITICAL (SKILL MANDATE): In-memory caching only. NEVER store in localStorage/sessionStorage.
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
}

type AuthCallback = (state: AuthState) => void;
const listeners: Set<AuthCallback> = new Set();

function notifyListeners(user: User | null, token: string | null, isLoading: boolean = false) {
  listeners.forEach(cb => cb({ user, accessToken: token, isLoading }));
}

// Initialize auth state listener. Call this on app load.
export const initAuth = (
  onAuthChange?: (user: User | null, token: string | null) => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthChange) onAuthChange(user, cachedAccessToken);
        notifyListeners(user, cachedAccessToken, false);
      } else if (!isSigningIn) {
        // If user is returned from Firebase persistence but token was not obtained in this session yet
        cachedAccessToken = null;
        if (onAuthChange) onAuthChange(user, null);
        notifyListeners(user, null, false);
      }
    } else {
      cachedAccessToken = null;
      if (onAuthChange) onAuthChange(null, null);
      notifyListeners(null, null, false);
    }
  });
};

export const subscribeToAuth = (callback: AuthCallback): (() => void) => {
  listeners.add(callback);
  callback({ 
    user: auth.currentUser, 
    accessToken: cachedAccessToken, 
    isLoading: false 
  });
  return () => {
    listeners.delete(callback);
  };
};

// Must be called from a user action (click)
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    notifyListeners(auth.currentUser, cachedAccessToken, true);
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }

    cachedAccessToken = credential.accessToken;
    notifyListeners(result.user, cachedAccessToken, false);
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign in error:', error);
    notifyListeners(auth.currentUser, null, false);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  notifyListeners(null, null, false);
};
