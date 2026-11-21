'use client';

import { useEffect, useState } from 'react';

// WebAuthn buffer conversion helpers
function bufferToBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let str = '';
  for (const byte of bytes) {
    str += String.fromCharCode(byte);
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBuffer(base64Url) {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export default function AccountAuthSync() {
  const [passkeySupported, setPasskeySupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.PublicKeyCredential) {
      setPasskeySupported(true);
    }

    // Helper: Sync cloud orders for an email
    async function syncCloudOrders(email) {
      if (!email) return;
      try {
        const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          const localRaw = localStorage.getItem('angadi:orders');
          const localOrders = localRaw ? JSON.parse(localRaw) : [];
          
          const orderMap = new Map();
          localOrders.forEach(o => orderMap.set(o.id, o));
          data.orders.forEach(o => orderMap.set(o.id, o));

          localStorage.setItem('angadi:orders', JSON.stringify(Array.from(orderMap.values())));
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'angadi:orders',
            newValue: JSON.stringify(Array.from(orderMap.values()))
          }));
          window.dispatchEvent(new CustomEvent('angadi:store', { detail: 'orders' }));
        }
      } catch (err) {
        console.warn('Order sync non-fatal error:', err);
      }
    }

    // Check existing stored account on load
    try {
      const stored = localStorage.getItem('angadi:account');
      if (stored) {
        const acct = JSON.parse(stored);
        if (acct?.email) syncCloudOrders(acct.email);
      }
    } catch {}

    // Handle traditional form submission (Create Account & Sign In)
    function attachTraditionalFormInterceptor() {
      const authForm = document.querySelector('[data-auth]');
      if (!authForm) return;

      // Update the demo note to reflect real cloud authentication
      const noteEl = authForm.querySelector('.note span');
      if (noteEl) {
        noteEl.textContent = 'Secured by Supabase Cloud Authentication. Your account and orders sync across all devices.';
      }

      // Check whether user is in "Create account" or "Sign in" tab
      const isCreateAccount = !!authForm.querySelector('input[name="name"]');
      const existingPasskeyWrap = authForm.querySelector('.passkey-alt-wrap');

      if (isCreateAccount) {
        // While Creating an Account: Remove passkey option completely!
        if (existingPasskeyWrap) {
          existingPasskeyWrap.remove();
        }
      } else {
        // While Signing In: Add Passkey option at bottom as an alternative
        if (!existingPasskeyWrap) {
          const altWrap = document.createElement('div');
          altWrap.className = 'passkey-alt-wrap';
          altWrap.style.cssText = 'margin-top: 18px; text-align: center; border-top: 1px solid #e6e0d4; padding-top: 14px;';
          altWrap.innerHTML = `
            <button type="button" class="btn-passkey-alt" style="background: none; border: none; color: #2e3a2f; font-size: 13px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; transition: background 0.15s ease;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>
              </svg>
              <span>Or sign in with Passkey / Biometrics</span>
            </button>
          `;
          altWrap.querySelector('.btn-passkey-alt')?.addEventListener('click', handlePasskeyLogin);
          authForm.appendChild(altWrap);
        }
      }

      if (authForm.dataset.enhanced === 'true') return;
      authForm.dataset.enhanced = 'true';

      // Intercept traditional form submit with capture
      authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();

        // Clear previous error messages
        const errName = authForm.querySelector('#e-name');
        const errEmail = authForm.querySelector('#e-email');
        const errPass = authForm.querySelector('#e-password');
        if (errName) errName.textContent = '';
        if (errEmail) errEmail.textContent = '';
        if (errPass) errPass.textContent = '';

        const nameInput = authForm.querySelector('input[name="name"]');
        const emailInput = authForm.querySelector('input[name="email"]');
        const passInput = authForm.querySelector('input[name="password"]');
        const submitBtn = authForm.querySelector('button[type="submit"]');

        const isSignUp = !!nameInput;
        const nameVal = nameInput ? nameInput.value.trim() : '';
        const emailVal = emailInput ? emailInput.value.trim().toLowerCase() : '';
        const passVal = passInput ? passInput.value : '';

        // Validation
        let hasError = false;
        if (isSignUp && !nameVal) {
          if (errName) errName.textContent = 'Please enter your full name.';
          hasError = true;
        }

        if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
          if (errEmail) errEmail.textContent = 'Please enter a valid email address.';
          hasError = true;
        }

        if (!passVal || passVal.length < 8) {
          if (errPass) errPass.textContent = 'Password must be at least 8 characters.';
          hasError = true;
        }

        if (hasError) return;

        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = isSignUp ? 'Creating account...' : 'Signing in...';

        try {
          const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/signin';
          const payload = isSignUp 
            ? { email: emailVal, password: passVal, name: nameVal }
            : { email: emailVal, password: passVal };

          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            if (errPass) {
              errPass.textContent = data.error || 'Authentication failed. Please check your credentials.';
              errPass.style.color = '#c85a32';
            }
            return;
          }

          // Successfully authenticated!
          const user = data.user;
          const acctData = {
            name: user.name,
            email: user.email
          };
          sessionStorage.setItem('angadi:account', JSON.stringify(acctData));
          sessionStorage.removeItem('angadi:tab_mode');
          localStorage.setItem('angadi:account', JSON.stringify(acctData));

          // Notify store listeners
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'angadi:account',
            newValue: JSON.stringify(acctData)
          }));
          window.dispatchEvent(new CustomEvent('angadi:store', { detail: 'account' }));

          // Sync cloud orders
          await syncCloudOrders(user.email);

          // Smoothly refresh to account dashboard
          window.location.href = '/account';

        } catch (err) {
          console.error('Auth request error:', err);
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
          if (errPass) {
            errPass.textContent = 'Network error connecting to auth service. Please try again.';
          }
        }
      }, true);
    }

    // Attach sign-out interceptor when user is logged in
    function attachSignoutInterceptor() {
      // Remove any unwanted passkey card from profile/orders view
      document.querySelectorAll('.passkey-security-card').forEach(el => el.remove());

      const signoutBtn = document.querySelector('[data-signout]');
      if (signoutBtn && signoutBtn.dataset.enhanced !== 'true') {
        signoutBtn.dataset.enhanced = 'true';
        signoutBtn.addEventListener('click', async () => {
          try {
            await fetch('/api/auth/signout', { method: 'POST' });
          } catch {}
          localStorage.removeItem('angadi:account');
          try {
            if ('BroadcastChannel' in window) {
              const bc = new BroadcastChannel('angadi_auth_channel');
              bc.postMessage({ type: 'TAB_LOGGED_OUT' });
              bc.close();
            }
          } catch {}
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'angadi:account',
            newValue: null
          }));
          window.dispatchEvent(new CustomEvent('angadi:store', { detail: 'account' }));
          window.location.href = '/account';
        }, true);
      }
    }

    // Polling DOM attacher (runs every 300ms to adapt to tab switching)
    const interval = setInterval(() => {
      attachTraditionalFormInterceptor();
      attachSignoutInterceptor();
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // Passkey Login flow (Only for signing in)
  async function handlePasskeyLogin() {
    try {
      const challengeRes = await fetch('/api/auth/passkey/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'login' })
      });
      const challengeData = await challengeRes.json();
      if (!challengeData.success) {
        alert(challengeData.error || 'Failed to start Passkey login');
        return;
      }

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: base64UrlToBuffer(challengeData.challenge),
          rpId: challengeData.rp.id,
          userVerification: 'preferred',
          timeout: 60000
        }
      });

      if (!credential) return;

      const loginRes = await fetch('/api/auth/passkey/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential: {
            id: credential.id,
            rawId: bufferToBase64Url(credential.rawId),
            type: credential.type,
            response: {
              authenticatorData: bufferToBase64Url(credential.response.authenticatorData),
              clientDataJSON: bufferToBase64Url(credential.response.clientDataJSON),
              signature: bufferToBase64Url(credential.response.signature),
              userHandle: credential.response.userHandle ? bufferToBase64Url(credential.response.userHandle) : null
            }
          },
          clientChallenge: challengeData.challenge
        })
      });

      const loginData = await loginRes.json();
      if (!loginData.success) {
        alert(loginData.error || 'Passkey verification failed');
        return;
      }

      const user = loginData.user;
      const acctData = {
        name: user.name,
        email: user.email,
        passkey: true
      };
      localStorage.setItem('angadi:account', JSON.stringify(acctData));

      try {
        if ('BroadcastChannel' in window) {
          const bc = new BroadcastChannel('angadi_auth_channel');
          bc.postMessage({ type: 'TAB_LOGGED_IN', user: acctData });
          bc.close();
        }
      } catch {}

      // Notify store listeners
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'angadi:account',
        newValue: JSON.stringify(acctData)
      }));
      window.dispatchEvent(new CustomEvent('angadi:store', { detail: 'account' }));

      // Sync user orders in background
      try {
        const ordersRes = await fetch(`/api/orders?email=${encodeURIComponent(user.email)}`);
        const ordersData = await ordersRes.json();
        if (ordersData.success && Array.isArray(ordersData.orders)) {
          const localRaw = localStorage.getItem('angadi:orders');
          const localOrders = localRaw ? JSON.parse(localRaw) : [];
          const orderMap = new Map();
          localOrders.forEach(o => orderMap.set(o.id, o));
          ordersData.orders.forEach(o => orderMap.set(o.id, o));
          localStorage.setItem('angadi:orders', JSON.stringify(Array.from(orderMap.values())));
        }
      } catch {}

      // Immediately navigate to account dashboard
      window.location.href = '/account';

    } catch (err) {
      if (err.name !== 'NotAllowedError') {
        alert('Passkey sign-in note: ' + err.message);
      }
    }
  }

  return null;
}
