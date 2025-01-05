import React from 'react';

export const AuthFooter = () => {
  return (
    <p className="text-center text-sm text-gray-300 font-sans">
      By signing in, you agree to our{' '}
      <a href="/terms" className="text-[#9b87f5] hover:text-[#D6BCFA] transition-colors">
        Terms of Service
      </a>{' '}
      and{' '}
      <a href="/privacy" className="text-[#9b87f5] hover:text-[#D6BCFA] transition-colors">
        Privacy Policy
      </a>
    </p>
  );
};