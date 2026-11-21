'use client';

import { useEffect } from 'react';

// Initialize tab-isolated multi-account support once per window execution
if (typeof window !== 'undefined' && !window.__tab_account_initialized) {
  window.__tab_account_initialized = true;

  try {
    const rawLocal = localStorage.getItem('angadi:account');
    const isExplicitGuest = sessionStorage.getItem('angadi:tab_mode') === 'guest';
    const hasTabAcct = sessionStorage.getItem('angadi:account');

    if (!isExplicitGuest && !hasTabAcct && rawLocal) {
      sessionStorage.setItem('angadi:account', rawLocal);
    }
  } catch {}

  const originalGetItem = Storage.prototype.getItem;
  const originalSetItem = Storage.prototype.setItem;

  Storage.prototype.getItem = function (key) {
    if (this === localStorage && key === 'angadi:account') {
      try {
        if (sessionStorage.getItem('angadi:tab_mode') === 'guest') {
          return null;
        }
        const tabVal = sessionStorage.getItem('angadi:account');
        if (tabVal !== null) return tabVal;
      } catch {}
    }
    return originalGetItem.apply(this, arguments);
  };

  Storage.prototype.setItem = function (key, val) {
    if (this === localStorage && key === 'angadi:account') {
      try {
        sessionStorage.setItem('angadi:account', val);
        sessionStorage.removeItem('angadi:tab_mode');
      } catch {}
    }
    return originalSetItem.apply(this, arguments);
  };
}

export default function TabAccountManager() {
  useEffect(() => {
    // Inject "Sign in with another account" button on /account page when logged in
    function injectSwitchAccountButton() {
      const headEl = document.querySelector('.acct__head');
      const signoutBtn = document.querySelector('[data-signout]');
      if (!headEl || !signoutBtn) return;

      if (headEl.querySelector('.btn-switch-account')) return;

      const switchBtn = document.createElement('button');
      switchBtn.type = 'button';
      switchBtn.className = 'pill pill--ink btn-switch-account';
      switchBtn.style.cssText = 'height: 42px; padding: 0 18px; font-size: 13px; font-weight: 600; cursor: pointer; margin-right: 10px;';
      switchBtn.innerHTML = `<span>+ Sign in with another account</span>`;

      switchBtn.addEventListener('click', () => {
        // Set this tab into independent guest/sign-in mode without affecting other tabs
        try {
          sessionStorage.setItem('angadi:tab_mode', 'guest');
          sessionStorage.removeItem('angadi:account');
        } catch {}

        // Reload current tab to display clean Sign in / Create account form
        window.location.reload();
      });

      signoutBtn.parentNode.insertBefore(switchBtn, signoutBtn);
    }

    const interval = setInterval(injectSwitchAccountButton, 300);
    return () => clearInterval(interval);
  }, []);

  return null;
}
