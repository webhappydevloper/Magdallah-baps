interface GoogleSignInButtonProps {
  onSignIn: () => void;
  isLoading?: boolean;
  userEmail?: string | null;
  userName?: string | null;
  userPhoto?: string | null;
  onSignOut?: () => void;
  variant?: 'standard' | 'compact' | 'pill';
  label?: string;
}

export default function GoogleSignInButton({
  onSignIn,
  isLoading = false,
  userEmail,
  userName,
  userPhoto,
  onSignOut,
  variant = 'standard',
  label = 'Sign in with Google'
}: GoogleSignInButtonProps) {
  if (userEmail) {
    if (variant === 'compact') {
      return (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300/80 rounded-full px-3 py-1 text-xs">
          {userPhoto ? (
            <img src={userPhoto} alt={userName || userEmail} className="w-5 h-5 rounded-full" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
              {userName ? userName.charAt(0).toUpperCase() : userEmail.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-emerald-900 font-medium font-chirp truncate max-w-[140px] text-[11px]" title={userEmail}>
            {userEmail}
          </span>
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="text-stone-400 hover:text-rose-600 font-medium ml-1 cursor-pointer text-[11px]"
              title="Sign Out"
            >
              લૉગ આઉટ
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between gap-3 bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          {userPhoto ? (
            <img src={userPhoto} alt={userName || userEmail} className="w-10 h-10 rounded-full border border-emerald-400" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
              {userName ? userName.charAt(0).toUpperCase() : userEmail.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-900 text-sm truncate">{userName || 'Google એકાઉન્ટ'}</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Gmail જોડાયેલ છે
              </span>
            </div>
            <div className="text-xs text-stone-600 font-chirp truncate">{userEmail}</div>
          </div>
        </div>
        {onSignOut && (
          <button
            onClick={onSignOut}
            className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-rose-600 hover:bg-rose-50 border border-stone-200 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            લૉગ આઉટ
          </button>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onSignIn}
      disabled={isLoading}
      className="gsi-material-button hover:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-xs"
      title="Google વડે સાઇન ઇન કરો"
    >
      <div className="gsi-material-button-icon">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="w-full h-full block"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>
      </div>
      <span className="gsi-material-button-contents">
        {isLoading ? 'જોડાઈ રહ્યું છે...' : label}
      </span>
    </button>
  );
}
