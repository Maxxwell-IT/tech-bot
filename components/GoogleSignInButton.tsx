import React from 'react';

interface GoogleSignInButtonProps {
  onClick: () => void;
  isShort?: boolean;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onClick, isShort = false }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center justify-center gap-3 bg-white text-dark-900 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-800 focus:ring-white"
  >
    <svg className="w-5 h-5" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd">
        <path d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4818h4.8436c-.2086 1.125-.8441 2.0782-1.7777 2.7164v2.2582h2.9086c1.7018-1.5668 2.6864-3.8736 2.6864-6.6155z" fill="#4285F4"></path>
        <path d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9086-2.2582c-.806.544-1.8368.868-3.0477.868-2.344 0-4.3282-1.5832-5.036-3.7104H.957v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853"></path>
        <path d="M3.964 10.71c-.18-.544-.2822-1.1168-.2822-1.71s.1023-1.166.2823-1.71V4.9582H.957C.3477 6.1732 0 7.5477 0 9c0 1.4523.3477 2.8268.957 4.0418L3.964 10.71z" fill="#FBBC05"></path>
        <path d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5814-2.5814C13.4636.8918 11.4259 0 9 0 5.4818 0 2.4382 2.0168.957 4.9582L3.964 7.29C4.6718 5.1632 6.656 3.5795 9 3.5795z" fill="#EA4335"></path>
      </g>
    </svg>
    {!isShort && <span>Увійти через Google</span>}
  </button>
);