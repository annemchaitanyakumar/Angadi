'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function NavbarAuthSync() {
  const pathname = usePathname();

  useEffect(() => {
    function updateNavbars() {
      if (typeof window === 'undefined') return;

      let account = null;
      try {
        const raw = localStorage.getItem('angadi:account');
        if (raw) account = JSON.parse(raw);
      } catch {}

      const isAuthed = !!(account && account.email);
      const firstName = account?.name 
        ? account.name.trim().split(' ')[0] 
        : (account?.email ? account.email.split('@')[0] : 'Account');

      // 1. Update Hero / Main page .nav__sign button
      const signBtns = document.querySelectorAll('.nav__sign');
      signBtns.forEach(btn => {
        if (isAuthed) {
          btn.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; flex-shrink:0;">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span style="max-width:110px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Hi, ${firstName}</span>
          `;
          btn.setAttribute('title', `Account: ${account.email}`);
          btn.classList.add('nav__sign--authed');
          btn.style.padding = '0 20px';
        } else {
          btn.textContent = 'Sign in';
          btn.removeAttribute('title');
          btn.classList.remove('nav__sign--authed');
          btn.style.padding = '';
        }
      });

      // 2. Update Topbar user icon button on secondary pages (/shop, /about, etc.)
      const topbarUserBtns = document.querySelectorAll('a[data-nav="account"], a[href="/account/"], a[href="/account"]');
      topbarUserBtns.forEach(btn => {
        if (btn.classList.contains('iconbtn')) {
          if (isAuthed) {
            btn.setAttribute('title', `Hi, ${firstName} (${account.email})`);
            btn.setAttribute('aria-label', `Your account: ${account.email}`);
            if (!btn.querySelector('.user-auth-dot')) {
              const dot = document.createElement('span');
              dot.className = 'user-auth-dot';
              dot.style.cssText = `
                position: absolute;
                top: 8px;
                right: 8px;
                width: 8px;
                height: 8px;
                background: #5b8a5d;
                border: 1.5px solid #ece6dc;
                border-radius: 50%;
                pointer-events: none;
              `;
              btn.appendChild(dot);
            }
          } else {
            btn.removeAttribute('title');
            btn.setAttribute('aria-label', 'Your account');
            const dot = btn.querySelector('.user-auth-dot');
            if (dot) dot.remove();
          }
        }
      });

      // 3. Update Mobile Menu drawer account link
      const menuAcctLink = document.querySelector('.menu__sub a[href="/account"]');
      if (menuAcctLink) {
        if (isAuthed) {
          menuAcctLink.innerHTML = `
            <svg width="18" height="18" aria-hidden="true"><use href="#i-user"/></svg>
            <span>Hi, ${firstName}</span>
          `;
        } else {
          menuAcctLink.innerHTML = `
            <svg width="18" height="18" aria-hidden="true"><use href="#i-user"/></svg>
            <span>Account</span>
          `;
        }
      }
    }

    // Run on mount and path change
    updateNavbars();

    // Cache latest authoritative store settings from backend
    try {
      fetch('/api/admin/settings')
        .then(r => r.json())
        .then(data => {
          if (data.success && data.settings) {
            localStorage.setItem('angadi:settings', JSON.stringify(data.settings));
          }
        })
        .catch(() => {});
    } catch {}

    // Listen to local store events
    function handleStoreChange(e) {
      if (e.detail === 'account') {
        updateNavbars();
      }
    }

    window.addEventListener('angadi:store', handleStoreChange);
    window.addEventListener('storage', updateNavbars);

    // Short interval to handle asynchronous DOM mount on page transitions
    const timer = setInterval(updateNavbars, 400);

    return () => {
      window.removeEventListener('angadi:store', handleStoreChange);
      window.removeEventListener('storage', updateNavbars);
      clearInterval(timer);
    };
  }, [pathname]);

  return null;
}
