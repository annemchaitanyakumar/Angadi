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

  try {
    const originalGetItem = Storage.prototype.getItem;
    const originalSetItem = Storage.prototype.setItem;

    Storage.prototype.getItem = function (key) {
      try {
        if (this === window.localStorage && key === 'angadi:account') {
          if (window.sessionStorage.getItem('angadi:tab_mode') === 'guest') {
            return null;
          }
          const tabVal = window.sessionStorage.getItem('angadi:account');
          if (tabVal !== null) return tabVal;
        }
      } catch {}
      try {
        return originalGetItem.call(this, key);
      } catch {
        return null;
      }
    };

    Storage.prototype.setItem = function (key, val) {
      try {
        if (this === window.localStorage && key === 'angadi:account') {
          window.sessionStorage.setItem('angadi:account', val);
          window.sessionStorage.removeItem('angadi:tab_mode');
        }
      } catch {}
      try {
        return originalSetItem.call(this, key, val);
      } catch {}
    };
  } catch {}
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
