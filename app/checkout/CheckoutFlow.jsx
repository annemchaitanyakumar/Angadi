'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Common Indian PIN code directory for instant auto-fill
const PIN_CODE_DIRECTORY = {
  '500081': { city: 'Hyderabad', region: 'Telangana' },
  '500032': { city: 'Hyderabad', region: 'Telangana' },
  '500001': { city: 'Hyderabad', region: 'Telangana' },
  '560001': { city: 'Bengaluru', region: 'Karnataka' },
  '560100': { city: 'Bengaluru', region: 'Karnataka' },
  '110001': { city: 'New Delhi', region: 'Delhi' },
  '400001': { city: 'Mumbai', region: 'Maharashtra' },
  '400050': { city: 'Mumbai', region: 'Maharashtra' },
  '600001': { city: 'Chennai', region: 'Tamil Nadu' },
  '700001': { city: 'Kolkata', region: 'West Bengal' },
  '380001': { city: 'Ahmedabad', region: 'Gujarat' },
  '411001': { city: 'Pune', region: 'Maharashtra' }
};

export default function CheckoutFlow() {
  const router = useRouter();

  // Accordion Step Section Refs for automatic viewport centering
  const stepContactRef = useRef(null);
  const stepDeliveryRef = useRef(null);
  const stepPaymentRef = useRef(null);

  // State
  const [bag, setBag] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState('contact'); // 'contact' | 'delivery' | 'payment'

  // Centered step navigation with smooth viewport scroll
  const goToStep = useCallback((targetStep) => {
    setCurrentStep(targetStep);
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        setTimeout(() => {
          let el = null;
          if (targetStep === 'contact') el = stepContactRef.current;
          else if (targetStep === 'delivery') el = stepDeliveryRef.current;
          else if (targetStep === 'payment') el = stepPaymentRef.current;

          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 60);
      });
    }
  }, []);

  // Server-Quoted Financial Figures (Single Source of Truth from Backend)
  const [quote, setQuote] = useState({
    subtotal: 0,
    discount: 0,
    shipping: 8,
    tax: 0,
    total: 0,
    promo: null,
    freeShipLeft: 150,
    shippingMethod: 'standard'
  });
  const [isQuoting, setIsQuoting] = useState(false);
  
  // Contact & Address
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [postal, setPostal] = useState('');
  const [country, setCountry] = useState('IN');
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);

  // Delivery Speed (standard = ₹8 / express = ₹18, free over ₹150)
  const [deliveryMethod, setDeliveryMethod] = useState('standard');

  // Payment State
  const [paymentType, setPaymentType] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cod'
  const [upiStatus, setUpiStatus] = useState('waiting'); // 'waiting' | 'verifying' | 'paid'
  const [upiSessionId] = useState(() => 'UPI-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000));
  const [upiTxnId, setUpiTxnId] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardBrand, setCardBrand] = useState('Visa');
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // Promo Code
  const [promoInput, setPromoInput] = useState('');
  const [promoCode, setPromoCode] = useState('');

  // Errors & Loading
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  // Backend Quotation Engine (Fetches official authoritative pricing from /api/checkout/quote)
  const fetchBackendQuote = useCallback(async (currentBag, code, speed) => {
    if (!currentBag || currentBag.length === 0) return;
    setIsQuoting(true);
    try {
      const res = await fetch('/api/checkout/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: currentBag.map(i => ({ id: i.id, kind: i.kind, size: i.size, qty: i.qty })),
          promoCode: code || '',
          shippingMethod: speed || 'standard'
        })
      });
      const data = await res.json();
      if (data.success && data.quote) {
        setQuote(data.quote);
        if (data.quote.items) {
          setBag(data.quote.items);
        }
      }
    } catch (err) {
      console.error('Quote fetch error:', err);
    } finally {
      setIsQuoting(false);
    }
  }, []);

  // Hydrate bag, applied promo from cart, and user profile
  useEffect(() => {
    let initialBag = [];
    let initialPromo = '';

    try {
      // 1. Read bag items
      const rawBag = localStorage.getItem('angadi:bag2') || localStorage.getItem('angadi:bag');
      if (rawBag) {
        const parsed = JSON.parse(rawBag);
        initialBag = parsed.filter(i => i.qty > 0);
        setBag(initialBag);
      }

      // 2. Read applied promo from cart (angadi:promo)
      const rawPromo = localStorage.getItem('angadi:promo');
      if (rawPromo) {
        try {
          const parsedPromo = JSON.parse(rawPromo);
          initialPromo = typeof parsedPromo === 'string' ? parsedPromo : (parsedPromo?.code || '');
        } catch {
          initialPromo = rawPromo;
        }
        if (initialPromo) {
          setPromoCode(initialPromo);
          setPromoInput(initialPromo);
        }
      }

      // 3. Pre-fill customer account if logged in
      const rawAccount = localStorage.getItem('angadi:account');
      if (rawAccount) {
        const acct = JSON.parse(rawAccount);
        if (acct.email) setEmail(acct.email);
        if (acct.name) {
          setFullName(acct.name.trim());
          setCardName(acct.name.trim());
        }
      }

      // Pre-fill default Indian address
      setLine1('Flat 402, Whispering Pines');
      setLine2('Trail Ridge Rd, Gachibowli');
      setCity('Hyderabad');
      setRegion('Telangana');
      setPostal('500081');
      setPhone('+91 98765 43210');

    } catch (e) {
      console.warn('Hydration error:', e);
    }

    setMounted(true);

    // Call backend quote API immediately with initial cart state
    if (initialBag.length > 0) {
      fetchBackendQuote(initialBag, initialPromo, 'standard');
    }
  }, [fetchBackendQuote]);

  // Automated UPI Payment Tracking & Auto-Order Placement
  useEffect(() => {
    if (currentStep !== 'payment' || paymentType !== 'upi' || isSubmitting) return;

    let isCancelled = false;
    let pollTimer = null;

    async function checkPaymentStatus(triggerVerify = false) {
      if (isCancelled || isSubmitting) return;
      try {
        const query = `/api/checkout/payment-status?id=${encodeURIComponent(upiSessionId)}&amount=${quote.total}${triggerVerify ? '&verify=true' : ''}`;
        const res = await fetch(query);
        const data = await res.json();

        if (data.success && data.status === 'paid' && !isCancelled) {
          setUpiStatus('paid');
          const txn = data.transactionId || `UPI_${Date.now()}`;
          setUpiTxnId(txn);
          handlePlaceOrder(txn);
        }
      } catch (e) {
        // Safe polling ignore
      }
    }

    // Immediate check
    checkPaymentStatus(false);

    // Poll every 3 seconds while on the QR screen
    pollTimer = setInterval(() => {
      checkPaymentStatus(false);
    }, 3000);

    // If customer switches back to this browser tab (e.g. from PhonePe, GPay, Paytm)
    function handleVisibilityOrFocus() {
      if (document.visibilityState === 'visible') {
        checkPaymentStatus(true);
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    return () => {
      isCancelled = true;
      if (pollTimer) clearInterval(pollTimer);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, [currentStep, paymentType, isSubmitting, upiSessionId, quote.total]);

  // Recalculate quote when delivery speed changes
  function handleDeliveryMethodChange(speed) {
    setDeliveryMethod(speed);
    fetchBackendQuote(bag, promoCode, speed);
  }

  // Promo code apply / remove
  function handleApplyPromo() {
    const clean = promoInput.trim().toUpperCase();
    if (!clean) return;
    setPromoCode(clean);
    fetchBackendQuote(bag, clean, deliveryMethod).then(() => {
      try {
        localStorage.setItem('angadi:promo', JSON.stringify(clean));
        window.dispatchEvent(new CustomEvent('angadi:store', { detail: 'promo' }));
      } catch {}
    });
  }

  function handleRemovePromo() {
    setPromoCode('');
    setPromoInput('');
    fetchBackendQuote(bag, '', deliveryMethod).then(() => {
      try {
        localStorage.removeItem('angadi:promo');
        window.dispatchEvent(new CustomEvent('angadi:store', { detail: 'promo' }));
      } catch {}
    });
  }

  // PIN code auto-detect city/region
  function handlePostalChange(val) {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setPostal(clean);
    if (clean.length === 6 && PIN_CODE_DIRECTORY[clean]) {
      setCity(PIN_CODE_DIRECTORY[clean].city);
      setRegion(PIN_CODE_DIRECTORY[clean].region);
      setErrors(prev => ({ ...prev, postal: '' }));
    }
  }

  // Card formatting & brand detection
  function handleCardChange(val) {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);

    if (digits.startsWith('4')) setCardBrand('Visa');
    else if (/^(5[1-5]|2[2-7])/.test(digits)) setCardBrand('Mastercard');
    else if (/^(60|65|81|82)/.test(digits)) setCardBrand('RuPay');
    else if (/^3[47]/.test(digits)) setCardBrand('Amex');
    else setCardBrand('Card');
  }

  function handleExpChange(val) {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      setCardExp(`${digits.slice(0, 2)} / ${digits.slice(2)}`);
    } else {
      setCardExp(digits);
    }
  }

  // Step 1 Validation
  function validateContact() {
    const errs = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address.';
    if (!fullName.trim()) errs.fullName = 'Full name is required.';
    if (!line1.trim()) errs.line1 = 'Street address is required.';
    if (!city.trim()) errs.city = 'City is required.';
    if (!region.trim()) errs.region = 'State / province is required.';
    if (!postal.trim() || postal.length < 5) errs.postal = 'Enter a valid 6-digit PIN code.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // Step 3 Validation
  function validatePayment() {
    const errs = {};
    if (paymentType === 'card') {
      if (!cardName.trim()) errs.cardname = 'Enter name on card.';
      const rawCard = cardNumber.replace(/\s/g, '');
      if (rawCard.length < 15) errs.card = 'Enter a valid card number.';
      if (!cardExp.includes('/') || cardExp.length < 7) errs.exp = 'Enter MM / YY.';
      if (cardCvc.length < 3) errs.cvc = 'Enter 3-digit CVV.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // Order Placement
  async function handlePlaceOrder(externalTxnId) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitStatus(paymentType === 'upi' ? 'Payment confirmed! Securing order...' : 'Authorizing payment with bank...');

    try {
      await new Promise(r => setTimeout(r, 600));
      setSubmitStatus('Deducting inventory & creating order...');

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const generatedOrderId = `ANG-${new Date().getFullYear()}-${randomSuffix}`;

      let paymentMethodDisplay = 'UPI';
      if (paymentType === 'upi') {
        paymentMethodDisplay = 'UPI (Direct Real UPI)';
      } else if (paymentType === 'cod') {
        paymentMethodDisplay = 'Cash on Delivery (COD)';
      } else if (paymentType === 'netbanking') {
        paymentMethodDisplay = `NetBanking (${selectedBank})`;
      } else {
        paymentMethodDisplay = `${cardBrand} ****${cardNumber.slice(-4) || '4242'}`;
      }

      const orderPayload = {
        orderId: generatedOrderId,
        customer: {
          name: fullName.trim() || 'Customer',
          email: email.trim().toLowerCase(),
          phone: phone.trim()
        },
        address: {
          line1,
          line2: line2 || undefined,
          city,
          region,
          postal,
          country
        },
        lines: bag.map(i => ({
          id: i.id,
          name: i.name,
          size: i.size || 'M',
          qty: i.qty || 1,
          price: i.price,
          img: i.img
        })),
        promoCode,
        method: deliveryMethod,
        paymentMethod: paymentMethodDisplay,
        transactionId: paymentType === 'upi' ? (externalTxnId || upiTxnId || `UPI_${Date.now()}`) : undefined
      };

      // Call backend order creation API (which enforces server-side price verification)
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order');
      }

      setSubmitStatus('Order confirmed! Redirecting...');

      // Clear shopping bag
      localStorage.setItem('angadi:bag2', JSON.stringify([]));
      localStorage.setItem('angadi:bag', JSON.stringify([]));
      localStorage.removeItem('angadi:promo');
      window.dispatchEvent(new StorageEvent('storage', { key: 'angadi:bag2', newValue: '[]' }));
      window.dispatchEvent(new CustomEvent('angadi:store', { detail: 'bag' }));

      // Save to local orders list & session locks
      try {
        sessionStorage.setItem('angadi:last-order', generatedOrderId);
        sessionStorage.setItem(`angadi:unlocked:${generatedOrderId}`, '1');

        const storedOrders = JSON.parse(localStorage.getItem('angadi:orders') || '[]');
        storedOrders.unshift({
          id: generatedOrderId,
          createdAt: new Date().toISOString(),
          customer: orderPayload.customer,
          address: orderPayload.address,
          lines: orderPayload.lines,
          subtotal: quote.subtotal,
          discount: quote.discount,
          promo: quote.promo ? quote.promo.code : null,
          shipping: quote.shipping,
          tax: quote.tax,
          total: quote.total,
          status: 'Pending',
          method: deliveryMethod || 'standard',
          history: [
            { status: 'Pending', at: new Date().toISOString() }
          ],
          payment: { brand: paymentMethodDisplay, last4: '4242' },
          source: 'store'
        });
        localStorage.setItem('angadi:orders', JSON.stringify(storedOrders));
        window.dispatchEvent(new StorageEvent('storage', { key: 'angadi:orders', newValue: JSON.stringify(storedOrders) }));
        window.dispatchEvent(new CustomEvent('angadi:store', { detail: 'orders' }));
      } catch (storageErr) {
        console.warn('Storage sync warning:', storageErr);
      }

      // Redirect to live order tracking stepper
      router.push(`/order?id=${encodeURIComponent(generatedOrderId)}&new=1`);

    } catch (err) {
      console.error('Order submission error:', err);
      setIsSubmitting(false);
      setSubmitStatus('');
      alert('Order placement error: ' + err.message);
    }
  }

  if (!mounted) {
    return <div style={{ minHeight: '60vh' }}></div>;
  }

  if (bag.length === 0) {
    return (
      <div className="empty" style={{ gridColumn: '1 / -1', padding: '60px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Your bag is empty</h2>
        <p style={{ margin: '12px 0 24px', color: 'var(--c-muted)' }}>Explore our outdoor trail-running catalog to add high-performance gear.</p>
        <a className="pill pill--ink" href="/shop/">Explore the Shop</a>
      </div>
    );
  }

  return (
    <div className="co">
      {/* ══ LEFT ACCORDION STEPS (Amazon / Nike / Puma style) ══ */}
      <div className="steps">
        
        {/* STEP 1: CONTACT & DELIVERY ADDRESS */}
        <section ref={stepContactRef} id="checkout-step-contact" className="step" data-state={currentStep === 'contact' ? 'active' : 'done'}>
          <div className="step__head">
            <span className="step__num">1</span>
            <h2 className="step__title">Delivery Address</h2>
            {currentStep !== 'contact' && (
              <>
                <p className="step__sum">{fullName || 'Customer'} · {line1}, {city} {postal}</p>
                <button className="link step__edit" type="button" onClick={() => goToStep('contact')}>Edit</button>
              </>
            )}
          </div>

          {currentStep === 'contact' && (
            <div className="step__body" style={{ padding: '0 26px 26px' }}>
              <div style={{ background: '#f4f0e9', borderRadius: '14px', padding: '14px 18px', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="radio" 
                    id="addr-default" 
                    name="address-sel" 
                    checked={selectedAddressIndex === 0} 
                    onChange={() => setSelectedAddressIndex(0)} 
                    style={{ accentColor: 'var(--c-moss)', cursor: 'pointer' }}
                  />
                  <label htmlFor="addr-default" style={{ fontSize: '13px', cursor: 'pointer' }}>
                    <strong>Default Home Address:</strong> {fullName || 'Customer'} · {line1}, {city} {postal}
                  </label>
                </div>
                <span style={{ fontSize: '11px', background: '#e8efe9', color: '#2e3a2f', padding: '3px 8px', borderRadius: '999px', fontWeight: 600 }}>SAVED</span>
              </div>

              <label className="field">
                <span>Email address (for live tracking & receipt)</span>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="runner@trailmail.com" 
                  required 
                />
                {errors.email && <em className="field__err">{errors.email}</em>}
              </label>

              <label className="field">
                <span>Full Name</span>
                <input 
                  type="text" 
                  value={fullName} 
                  onChange={e => setFullName(e.target.value)} 
                  placeholder="e.g. Chaitanya Kumar"
                  required 
                />
                {errors.fullName && <em className="field__err">{errors.fullName}</em>}
              </label>

              <label className="field">
                <span>Street Address</span>
                <input 
                  type="text" 
                  value={line1} 
                  onChange={e => setLine1(e.target.value)} 
                  placeholder="House/Flat No., Street, Landmark" 
                  required 
                />
                {errors.line1 && <em className="field__err">{errors.line1}</em>}
              </label>

              <label className="field">
                <span>Apartment, suite, area <small className="field__hint">(optional)</small></span>
                <input type="text" value={line2} onChange={e => setLine2(e.target.value)} />
              </label>

              <div className="row3">
                <label className="field">
                  <span>PIN / Postal code</span>
                  <input 
                    type="text" 
                    value={postal} 
                    onChange={e => handlePostalChange(e.target.value)} 
                    placeholder="e.g. 500081" 
                    maxLength={6} 
                    required 
                  />
                  {errors.postal && <em className="field__err">{errors.postal}</em>}
                </label>

                <label className="field">
                  <span>City</span>
                  <input type="text" value={city} onChange={e => setCity(e.target.value)} required />
                  {errors.city && <em className="field__err">{errors.city}</em>}
                </label>

                <label className="field">
                  <span>State</span>
                  <input type="text" value={region} onChange={e => setRegion(e.target.value)} required />
                  {errors.region && <em className="field__err">{errors.region}</em>}
                </label>
              </div>

              <div className="row2">
                <label className="field">
                  <span>Country</span>
                  <select value={country} onChange={e => setCountry(e.target.value)}>
                    <option value="IN">India (₹ INR)</option>
                    <option value="US">United States ($)</option>
                    <option value="CA">Canada ($)</option>
                    <option value="GB">United Kingdom (£)</option>
                  </select>
                </label>
                <label className="field">
                  <span>Mobile Phone <small className="field__hint">(for delivery OTP)</small></span>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" />
                </label>
              </div>

              <div className="step__actions" style={{ marginTop: '20px' }}>
                <button 
                  className="pill pill--ink" 
                  type="button" 
                  onClick={() => {
                    if (validateContact()) goToStep('delivery');
                  }}
                >
                  Continue to Delivery
                </button>
              </div>
            </div>
          )}
        </section>

        {/* STEP 2: DELIVERY SPEED (Canonical Shipping: Standard ₹8.00 / Express ₹18.00, Free over ₹150) */}
        <section ref={stepDeliveryRef} id="checkout-step-delivery" className="step" data-state={currentStep === 'delivery' ? 'active' : currentStep === 'contact' ? 'todo' : 'done'}>
          <div className="step__head">
            <span className="step__num">2</span>
            <h2 className="step__title">Delivery Speed</h2>
            {currentStep === 'payment' && (
              <>
                <p className="step__sum">
                  {deliveryMethod === 'express' ? 'Express Courier · 1–2 Days (₹18.00)' : `Standard Trail · 3–5 Days (${quote.freeShipLeft === 0 ? 'FREE' : '₹8.00'})`}
                </p>
                <button className="link step__edit" type="button" onClick={() => goToStep('delivery')}>Edit</button>
              </>
            )}
          </div>

          {currentStep === 'delivery' && (
            <div className="step__body" style={{ padding: '0 26px 26px' }}>
              <fieldset className="methods">
                <legend className="sr-only">Choose delivery speed</legend>

                {/* Standard */}
                <label 
                  className={`method ${deliveryMethod === 'standard' ? 'is-selected' : ''}`} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '16px 20px', 
                    borderRadius: '14px', 
                    border: deliveryMethod === 'standard' ? '2px solid var(--c-moss)' : '1px solid var(--c-line)', 
                    background: deliveryMethod === 'standard' ? '#fbf9f5' : '#fff', 
                    cursor: 'pointer', 
                    marginBottom: '10px' 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input 
                      type="radio" 
                      name="deliveryMethod" 
                      value="standard" 
                      checked={deliveryMethod === 'standard'} 
                      onChange={() => handleDeliveryMethodChange('standard')} 
                      style={{ accentColor: 'var(--c-moss)' }}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '15px' }}>Standard Trail Ground Delivery</strong>
                      <small style={{ color: 'var(--c-muted)', fontSize: '13px' }}>Estimated arrival in 3–5 Business Days (Dispatches from Hyderabad)</small>
                    </div>
                  </div>
                  <strong style={{ color: quote.freeShipLeft === 0 ? '#2e7d32' : 'var(--c-moss)', fontSize: '15px' }}>
                    {quote.freeShipLeft === 0 ? 'FREE' : '₹8.00'}
                  </strong>
                </label>

                {/* Express */}
                <label 
                  className={`method ${deliveryMethod === 'express' ? 'is-selected' : ''}`} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '16px 20px', 
                    borderRadius: '14px', 
                    border: deliveryMethod === 'express' ? '2px solid var(--c-moss)' : '1px solid var(--c-line)', 
                    background: deliveryMethod === 'express' ? '#fbf9f5' : '#fff', 
                    cursor: 'pointer' 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input 
                      type="radio" 
                      name="deliveryMethod" 
                      value="express" 
                      checked={deliveryMethod === 'express'} 
                      onChange={() => handleDeliveryMethodChange('express')} 
                      style={{ accentColor: 'var(--c-moss)' }}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '15px' }}>Express Air Courier (Priority)</strong>
                      <small style={{ color: 'var(--c-muted)', fontSize: '13px' }}>Guaranteed arrival in 1–2 Business Days with live tracking</small>
                    </div>
                  </div>
                  <strong style={{ color: 'var(--c-moss)', fontSize: '15px' }}>₹18.00</strong>
                </label>
              </fieldset>

              <div className="step__actions" style={{ marginTop: '20px' }}>
                <button className="pill pill--ink" type="button" onClick={() => goToStep('payment')}>
                  Continue to Payment
                </button>
              </div>
            </div>
          )}
        </section>

        {/* STEP 3: PAYMENT ENGINE (UPI / Card / NetBanking / COD) */}
        <section ref={stepPaymentRef} id="checkout-step-payment" className="step" data-state={currentStep === 'payment' ? 'active' : 'todo'}>
          <div className="step__head">
            <span className="step__num">3</span>
            <h2 className="step__title">Payment Method</h2>
          </div>

          {currentStep === 'payment' && (
            <div className="step__body" style={{ padding: '0 26px 26px' }}>
              
              <div className="checkout-methods-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '22px' }}>
                {/* 1. UPI */}
                <button 
                  type="button" 
                  onClick={() => setPaymentType('upi')}
                  style={{
                    padding: '12px 10px',
                    borderRadius: '14px',
                    border: paymentType === 'upi' ? '2px solid var(--c-moss)' : '1px solid var(--c-line)',
                    background: paymentType === 'upi' ? '#2e3a2f' : '#fff',
                    color: paymentType === 'upi' ? '#fbf9f5' : 'var(--c-moss)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
                    <path d="M12 18h.01"/>
                  </svg>
                  <span>UPI / QR</span>
                </button>

                {/* 2. Card */}
                <button 
                  type="button" 
                  onClick={() => setPaymentType('card')}
                  style={{
                    padding: '12px 10px',
                    borderRadius: '14px',
                    border: paymentType === 'card' ? '2px solid var(--c-moss)' : '1px solid var(--c-line)',
                    background: paymentType === 'card' ? '#2e3a2f' : '#fff',
                    color: paymentType === 'card' ? '#fbf9f5' : 'var(--c-moss)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="14" x="2" y="5" rx="2"/>
                    <line x1="2" x2="22" y1="10" y2="10"/>
                  </svg>
                  <span>Cards</span>
                </button>

                {/* 3. NetBanking */}
                <button 
                  type="button" 
                  onClick={() => setPaymentType('netbanking')}
                  style={{
                    padding: '12px 10px',
                    borderRadius: '14px',
                    border: paymentType === 'netbanking' ? '2px solid var(--c-moss)' : '1px solid var(--c-line)',
                    background: paymentType === 'netbanking' ? '#2e3a2f' : '#fff',
                    color: paymentType === 'netbanking' ? '#fbf9f5' : 'var(--c-moss)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" x2="21" y1="22" y2="22"/>
                    <line x1="6" x2="6" y1="18" y2="11"/>
                    <line x1="10" x2="10" y1="18" y2="11"/>
                    <line x1="14" x2="14" y1="18" y2="11"/>
                    <line x1="18" x2="18" y1="18" y2="11"/>
                    <polygon points="12 2 20 7 4 7"/>
                  </svg>
                  <span>NetBanking</span>
                </button>

                {/* 4. COD */}
                <button 
                  type="button" 
                  onClick={() => setPaymentType('cod')}
                  style={{
                    padding: '12px 10px',
                    borderRadius: '14px',
                    border: paymentType === 'cod' ? '2px solid var(--c-moss)' : '1px solid var(--c-line)',
                    background: paymentType === 'cod' ? '#2e3a2f' : '#fff',
                    color: paymentType === 'cod' ? '#fbf9f5' : 'var(--c-moss)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" x2="12" y1="2" y2="22"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  <span>COD</span>
                </button>
              </div>

              {/* UPI */}
              {paymentType === 'upi' && (() => {
                const storeUpiId = process.env.NEXT_PUBLIC_STORE_UPI_ID || 'annemchaitanyakumarreddy@sbi';
                const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'ANGADI Outdoor';
                const upiPayUri = `upi://pay?pa=${encodeURIComponent(storeUpiId)}&pn=${encodeURIComponent(storeName)}&am=${quote.total.toFixed(2)}&cu=INR&tn=${encodeURIComponent('ANGADI Order ' + upiSessionId)}`;
                const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(upiPayUri)}`;

                return (
                  <div style={{ background: '#fff', border: '1px solid var(--c-line)', borderRadius: '16px', padding: '24px 20px', textAlign: 'center' }}>
                    <div style={{ 
                      width: '200px', 
                      height: '200px', 
                      margin: '0 auto 14px', 
                      background: '#fff', 
                      border: '1px solid var(--c-line)', 
                      borderRadius: '16px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      overflow: 'hidden',
                      padding: '8px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                    }}>
                      <img 
                        src={qrCodeUrl} 
                        alt={`UPI QR code to pay ₹${quote.total.toFixed(2)} to ${storeUpiId}`} 
                        width="184" 
                        height="184" 
                        style={{ display: 'block', borderRadius: '8px' }}
                      />
                    </div>

                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--c-moss)', margin: '0 0 6px' }}>
                      Scan &amp; pay ₹{quote.total.toFixed(2)} to <code style={{ background: '#f4f0e9', padding: '2px 8px', borderRadius: '6px' }}>{storeUpiId}</code>
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--c-muted)', margin: '0 0 16px' }}>
                      Google Pay · PhonePe · Paytm · CRED · BHIM
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                      <a 
                        href={upiPayUri}
                        className="pill pill--light"
                        style={{ height: '40px', padding: '0 18px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        Open in UPI App
                      </a>

                      <button
                        type="button"
                        className="pill pill--ink"
                        onClick={() => {
                          setUpiStatus('paid');
                          const txn = `DEMO_UPI_${Date.now()}`;
                          setUpiTxnId(txn);
                          handlePlaceOrder(txn);
                        }}
                        style={{ height: '40px', padding: '0 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        Simulate Payment (Demo)
                      </button>
                    </div>

                    {/* Automatic Live Payment Tracking Indicator */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: upiStatus === 'paid' ? '#e8f5e9' : '#f0f5ee',
                      border: upiStatus === 'paid' ? '1px solid #a5d6a7' : '1px solid #c8dec6',
                      padding: '10px 20px',
                      borderRadius: '999px',
                      margin: '4px auto 0'
                    }}>
                      <span style={{
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        background: upiStatus === 'paid' ? '#2e7d32' : '#388e3c',
                        boxShadow: '0 0 0 4px rgba(46,125,50,0.18)',
                        display: 'inline-block'
                      }} />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: upiStatus === 'paid' ? '#1b5e20' : '#2e3a2f' }}>
                        {upiStatus === 'paid' 
                          ? '✓ Payment confirmed · Placing your order...' 
                          : 'Waiting for payment · Scan QR or click Simulate Payment'}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* CARDS */}
              {paymentType === 'card' && (
                <div style={{ background: '#fff', border: '1px solid var(--c-line)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--c-muted)' }}>Accepted: Visa, Mastercard, RuPay</span>
                  </div>

                  <label className="field">
                    <span>Name on Card</span>
                    <input type="text" value={cardName} onChange={e => setCardName(e.target.value)} required />
                    {errors.cardname && <em className="field__err">{errors.cardname}</em>}
                  </label>

                  <div className="card-in" style={{ position: 'relative' }}>
                    <label className="field">
                      <span>Card Number</span>
                      <input 
                        type="text" 
                        value={cardNumber} 
                        onChange={e => handleCardChange(e.target.value)} 
                        placeholder="1234 5678 9012 3456" 
                        maxLength={19} 
                        required 
                      />
                      {errors.card && <em className="field__err">{errors.card}</em>}
                    </label>
                    <span className="brand" style={{ position: 'absolute', right: '14px', top: '38px', fontWeight: 600, fontSize: '13px', color: 'var(--c-moss)' }}>
                      {cardBrand}
                    </span>
                  </div>

                  <div className="row2">
                    <label className="field">
                      <span>Expiry Date (MM / YY)</span>
                      <input type="text" value={cardExp} onChange={e => handleExpChange(e.target.value)} placeholder="MM / YY" maxLength={7} required />
                      {errors.exp && <em className="field__err">{errors.exp}</em>}
                    </label>
                    <label className="field">
                      <span>CVV / CVC</span>
                      <input type="password" value={cardCvc} onChange={e => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" maxLength={4} required />
                      {errors.cvc && <em className="field__err">{errors.cvc}</em>}
                    </label>
                  </div>
                </div>
              )}

              {/* NETBANKING */}
              {paymentType === 'netbanking' && (
                <div style={{ background: '#fff', border: '1px solid var(--c-line)', borderRadius: '16px', padding: '20px' }}>
                  <p style={{ fontSize: '13px', color: 'var(--c-muted)', margin: '0 0 14px' }}>Select your bank:</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
                    {['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak', 'Others'].map(bank => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        style={{
                          padding: '12px 8px',
                          borderRadius: '12px',
                          border: selectedBank === bank ? '2px solid var(--c-moss)' : '1px solid var(--c-line)',
                          background: selectedBank === bank ? '#fbf9f5' : '#fff',
                          fontWeight: 600,
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        {bank} Bank
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CASH ON DELIVERY */}
              {paymentType === 'cod' && (
                <div style={{ background: '#fbf9f5', border: '1px solid var(--c-line)', borderRadius: '16px', padding: '20px' }}>
                  <h4 style={{ margin: '0 0 6px', fontSize: '15px' }}>Pay on Delivery Available</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--c-muted)' }}>
                    Pay in cash or scan QR code using your UPI app when the courier arrives at your doorstep. Zero prepayment required.
                  </p>
                </div>
              )}

              {/* PLACE ORDER ACTION */}
              <div style={{ marginTop: '28px' }}>
                <button 
                  type="button"
                  className="pill pill--ink" 
                  disabled={isSubmitting || isQuoting}
                  onClick={() => {
                    if (paymentType === 'upi') {
                      fetch(`/api/checkout/payment-status?id=${encodeURIComponent(upiSessionId)}&verify=true`)
                        .then(() => handlePlaceOrder(`UPI_${Date.now()}`))
                        .catch(() => handlePlaceOrder());
                    } else if (validatePayment()) {
                      handlePlaceOrder();
                    }
                  }}
                  style={{
                    width: '100%',
                    height: '56px',
                    fontSize: '16px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    boxShadow: '0 8px 24px rgba(46,58,47,0.22)'
                  }}
                >
                  {isSubmitting 
                    ? (submitStatus || 'Processing order...') 
                    : paymentType === 'upi'
                      ? (upiStatus === 'paid' ? 'Payment confirmed · Placing order...' : `Place order · ₹${quote.total.toFixed(2)}`)
                      : `Place order · ₹${quote.total.toFixed(2)}`
                  }
                </button>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '14px', fontSize: '12px', color: 'var(--c-muted)' }}>
                  <span>Free 60-day returns</span>
                  <span>·</span>
                  <span>Dispatches within 24 hours</span>
                </div>
              </div>

            </div>
          )}
        </section>

      </div>

      {/* ══ RIGHT RAIL: CANONICAL ORDER SUMMARY (100% Locked to Backend & /cart) ══ */}
      <aside className="summary">
        <h2>Order Summary ({bag.reduce((s, i) => s + i.qty, 0)})</h2>

        {/* Free Shipping Progress Indicator (Matches /cart) */}
        {quote.freeShipLeft > 0 && (
          <p style={{ fontSize: '13px', color: 'var(--c-muted)', margin: 0 }}>
            Add ₹{quote.freeShipLeft.toFixed(2)} more for free shipping
          </p>
        )}

        {/* Thumbnail Preview Items */}
        <div style={{ display: 'grid', gap: '12px', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
          {bag.map((item, idx) => (
            <div key={item.key || idx} className="mini">
              <div className="mini__img">
                <img src={item.img} alt={item.name} />
                <span className="mini__qty">{item.qty}</span>
              </div>
              <div>
                <p className="mini__name">{item.name}</p>
                <p className="mini__meta">Size {item.size || 'M'} · ₹{Number(item.price).toFixed(2)} each</p>
              </div>
              <strong style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>₹{(item.price * item.qty).toFixed(2)}</strong>
            </div>
          ))}
        </div>

        {/* Promo Code Box */}
        <div style={{ borderTop: '1px solid var(--c-line)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              value={promoInput} 
              onChange={e => setPromoInput(e.target.value)} 
              placeholder="Promo code (e.g. TRAIL10)" 
              style={{
                flex: 1,
                height: '42px',
                borderRadius: '999px',
                border: '1px solid var(--c-line)',
                padding: '0 16px',
                fontSize: '13px',
                background: '#fff'
              }}
            />
            <button 
              type="button" 
              onClick={handleApplyPromo} 
              className="pill pill--light" 
              style={{ height: '42px', padding: '0 18px', fontSize: '12px', fontWeight: 600 }}
            >
              Apply
            </button>
          </div>
          {errors.promo && <p style={{ color: 'var(--c-clay)', fontSize: '12px', margin: '6px 0 0' }}>{errors.promo}</p>}
          {quote.promo && (
            <p style={{ color: '#2e7d32', fontSize: '12px', fontWeight: 600, margin: '6px 0 0', display: 'flex', justifyContent: 'space-between' }}>
              <span>✓ {quote.promo.code} applied: {quote.promo.pct}% off</span>
              <button type="button" className="link" onClick={handleRemovePromo} style={{ color: 'var(--c-muted)', fontSize: '11px' }}>Remove</button>
            </p>
          )}
        </div>

        {/* Authoritative Totals Breakdown (Matches /cart down to the exact paisa) */}
        <dl className="sum">
          <div>
            <dt>Subtotal</dt>
            <dd>₹{quote.subtotal.toFixed(2)}</dd>
          </div>

          {quote.discount > 0 && (
            <div style={{ color: '#2e7d32' }}>
              <dt>
                Promo {quote.promo?.code ? `${quote.promo.code} (-${quote.promo.pct}%)` : 'Discount'}{' '}
                <button type="button" className="link" onClick={handleRemovePromo} style={{ fontSize: '11px', textDecoration: 'underline' }}>Remove</button>
              </dt>
              <dd>-₹{quote.discount.toFixed(2)}</dd>
            </div>
          )}

          <div>
            <dt>Shipping</dt>
            <dd style={{ color: quote.shipping === 0 ? '#2e7d32' : 'inherit', fontWeight: quote.shipping === 0 ? 600 : 'normal' }}>
              {quote.shipping === 0 ? 'FREE' : `₹${quote.shipping.toFixed(2)}`}
            </dd>
          </div>

          <div>
            <dt>Estimated tax</dt>
            <dd>₹{quote.tax.toFixed(2)}</dd>
          </div>

          <div className="sum__total">
            <dt>Total</dt>
            <dd>₹{quote.total.toFixed(2)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
