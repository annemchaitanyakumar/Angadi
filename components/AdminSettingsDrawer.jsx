'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function AdminSettingsDrawer({ isOpen, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('taxes'); // 'taxes' | 'promos' | 'flash' | 'customers'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // ══ Taxes & Shipping State ══
  const [taxRatePct, setTaxRatePct] = useState(8);
  const [taxLabel, setTaxLabel] = useState('Estimated GST / Tax');
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [freeThreshold, setFreeThreshold] = useState(150);
  const [standardShip, setStandardShip] = useState(8);
  const [expressShip, setExpressShip] = useState(18);

  // ══ Promo Codes State ══
  const [promos, setPromos] = useState([]);
  const [newCode, setNewCode] = useState('');
  const [newPct, setNewPct] = useState(10);
  const [newMinSpend, setNewMinSpend] = useState(0);

  // ══ Flash Sales State ══
  const [flashActive, setFlashActive] = useState(true);
  const [flashBanner, setFlashBanner] = useState('SUMMIT PROMOTION: Limited Time Technical Gear Pricing Applied.');
  const [flashItems, setFlashItems] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [selectedProductToAdd, setSelectedProductToAdd] = useState('');
  const [productDiscountPct, setProductDiscountPct] = useState(20);

  // ══ Customer Directory & Management State ══
  const [customers, setCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState('customer');
  const [isUpdatingCustomer, setIsUpdatingCustomer] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const [isDeletingCustomer, setIsDeletingCustomer] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load current settings, products, and customers
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);

    Promise.all([
      fetch('/api/admin/settings').then(r => r.json()).catch(() => ({ success: false })),
      fetch('/api/products').then(r => r.json()).catch(() => ({ products: [] })),
      fetch('/api/admin/customers').then(r => r.json()).catch(() => ({ customers: [] }))
    ]).then(([settingsRes, productsRes, customersRes]) => {
      if (settingsRes.success && settingsRes.settings) {
        const s = settingsRes.settings;
        try {
          localStorage.setItem('angadi:settings', JSON.stringify(s));
        } catch {}
        setTaxRatePct(Math.round((s.taxes?.rate || 0.08) * 100));
        setTaxLabel(s.taxes?.label || 'Estimated GST / Tax');
        setTaxEnabled(s.taxes?.enabled ?? true);
        setFreeThreshold(s.shipping?.freeThreshold || 150);
        setStandardShip(s.shipping?.standard || 8);
        setExpressShip(s.shipping?.express || 18);
        setPromos(s.promos || []);
        setFlashActive(s.flashSales?.active ?? true);
        setFlashBanner(s.flashSales?.bannerText || 'SUMMIT PROMOTION: Limited Time Technical Gear Pricing Applied.');
        setFlashItems(s.flashSales?.items || []);
      }
      if (productsRes.products) {
        setProductsList(productsRes.products);
        if (productsRes.products.length > 0) {
          setSelectedProductToAdd(productsRes.products[0].id);
        }
      }
      if (customersRes.success && Array.isArray(customersRes.customers)) {
        setCustomers(customersRes.customers);
      }
      setLoading(false);
    }).catch(err => {
      console.error('Error loading admin settings:', err);
      setLoading(false);
    });
  }, [isOpen]);

  // ══ Save Store Governance Settings ══
  async function handleSaveSettings() {
    setSaving(true);
    setSaveMsg('');

    try {
      const payload = {
        taxes: {
          rate: Number(taxRatePct) / 100,
          label: taxLabel,
          enabled: taxEnabled
        },
        shipping: {
          standard: Number(standardShip),
          express: Number(expressShip),
          freeThreshold: Number(freeThreshold)
        },
        promos,
        flashSales: {
          active: flashActive,
          bannerText: flashBanner,
          items: flashItems
        }
      };

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        const savedSettings = data.settings || payload;
        try {
          localStorage.setItem('angadi:settings', JSON.stringify(savedSettings));
          window.dispatchEvent(new StorageEvent('storage', { key: 'angadi:settings', newValue: JSON.stringify(savedSettings) }));
          window.dispatchEvent(new CustomEvent('angadi:settings-updated', { detail: savedSettings }));
          window.dispatchEvent(new StorageEvent('storage', { key: 'angadi:bag2' }));
        } catch {}
        setSaveMsg('Store parameters saved and live across cart and checkout.');
        setTimeout(() => setSaveMsg(''), 4000);
      } else {
        alert('Failed to save settings: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error saving settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  // ══ Promo Handlers ══
  function handleAddPromo(e) {
    e.preventDefault();
    const clean = newCode.trim().toUpperCase();
    if (!clean) return;
    if (promos.some(p => p.code.toUpperCase() === clean)) {
      alert(`Promo code ${clean} already exists.`);
      return;
    }

    const newPromo = {
      code: clean,
      pct: Number(newPct),
      label: `${newPct}% Off Order`,
      active: true,
      minSpend: Number(newMinSpend) || 0
    };

    setPromos([...promos, newPromo]);
    setNewCode('');
    setNewPct(10);
    setNewMinSpend(0);
  }

  function handleTogglePromo(code) {
    setPromos(promos.map(p => p.code === code ? { ...p, active: !p.active } : p));
  }

  function handleDeletePromo(code) {
    if (confirm(`Remove promo code ${code}?`)) {
      setPromos(promos.filter(p => p.code !== code));
    }
  }

  // ══ Flash Sale Handlers ══
  function handleAddFlashItem() {
    if (!selectedProductToAdd) return;
    const exists = flashItems.find(i => i.id === selectedProductToAdd);
    if (exists) {
      alert('This product is already in the flash sale list.');
      return;
    }

    const prod = productsList.find(p => p.id === selectedProductToAdd);
    const newItem = {
      id: selectedProductToAdd,
      discountPct: Number(productDiscountPct),
      label: `${productDiscountPct}% Off ${prod?.name || selectedProductToAdd}`
    };

    setFlashItems([...flashItems, newItem]);
  }

  function handleRemoveFlashItem(id) {
    setFlashItems(flashItems.filter(i => i.id !== id));
  }

  // ══ Customer Handlers ══
  function handleOpenCustomerEdit(c) {
    setEditingCustomer(c);
    setEditName(c.name || '');
    setEditPhone(c.phone || '');
    setEditRole(c.role || 'customer');
  }

  async function handleSaveCustomerEdit(e) {
    e.preventDefault();
    if (!editingCustomer) return;

    setIsUpdatingCustomer(true);
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: editingCustomer.email,
          name: editName,
          phone: editPhone,
          role: editRole
        })
      });
      const data = await res.json();
      if (data.success) {
        setCustomers(customers.map(c => c.email === editingCustomer.email ? { ...c, name: editName, phone: editPhone, role: editRole } : c));
        setEditingCustomer(null);
      } else {
        alert('Failed to update customer: ' + data.error);
      }
    } catch (err) {
      alert('Error updating customer: ' + err.message);
    } finally {
      setIsUpdatingCustomer(false);
    }
  }

  async function handleConfirmDeleteCustomer() {
    if (!deletingCustomer) return;

    setIsDeletingCustomer(true);
    try {
      const res = await fetch(`/api/admin/customers?email=${encodeURIComponent(deletingCustomer.email)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setCustomers(customers.filter(c => c.email !== deletingCustomer.email));
        setDeletingCustomer(null);
      } else {
        alert('Failed to delete customer: ' + data.error);
      }
    } catch (err) {
      alert('Error deleting customer: ' + err.message);
    } finally {
      setIsDeletingCustomer(false);
    }
  }

  const filteredCustomers = customers.filter(c => {
    const q = customerSearch.toLowerCase().trim();
    return !q || (c.name || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q);
  });

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  const drawerContent = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        pointerEvents: 'auto'
      }}
      aria-label="Store Settings & Governance"
    >
      {/* Native Scrim Overlay - covering the FULL viewport */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(26, 32, 27, 0.6)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 1
        }}
      />

      {/* Slide-out Panel - 100vh height, anchored to right */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: 'min(700px, 100vw)',
          height: '100vh',
          maxHeight: '100vh',
          background: '#fbf9f5',
          color: '#2e3a2f',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-16px 0 60px rgba(0,0,0,0.35)',
          borderLeft: '1px solid rgba(46,58,47,0.16)',
          borderRadius: '24px 0 0 24px',
          overflow: 'hidden',
          animation: 'solumSlideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: '20px clamp(16px, 4vw, 30px)',
            borderBottom: '1px solid rgba(46,58,47,0.14)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fbf9f5',
            flexShrink: 0
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#625d54'
              }}
            >
              Store Governance & Parameters
            </p>
            <h2
              style={{
                margin: '4px 0 0',
                fontFamily: 'var(--font-display, "Archivo", sans-serif)',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#2e3a2f',
                letterSpacing: '-0.01em'
              }}
            >
              Settings & Promotions
            </h2>
          </div>
          <button
            type="button"
            className="iconbtn"
            onClick={onClose}
            aria-label="Close"
            title="Close"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1px solid rgba(46,58,47,0.16)',
              background: '#f4efe6',
              color: '#2e3a2f',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(46,58,47,0.14)',
            background: '#fbf9f5',
            padding: '0 clamp(16px, 4vw, 30px)',
            gap: '8px',
            flexShrink: 0,
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none'
          }}
        >
          {[
            { id: 'taxes', label: 'Taxes & Shipping' },
            { id: 'promos', label: `Promo Codes (${promos.length})` },
            { id: 'flash', label: `Flash Sales (${flashItems.length})` },
            { id: 'customers', label: `Customer Accounts (${customers.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px 14px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '13px',
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? '#2e3a2f' : '#625d54',
                borderBottom: activeTab === tab.id ? '2.5px solid #2e3a2f' : '2.5px solid transparent',
                transition: 'color 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Drawer Body Container - Scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px clamp(16px, 4vw, 30px)' }}>
          {loading ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#625d54' }}>
              Loading store parameters...
            </div>
          ) : (
            <>
              {/* ══ TAB 1: TAXES & SHIPPING ══ */}
              {activeTab === 'taxes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  <div style={{ background: '#fff', padding: '22px', borderRadius: '16px', border: '1px solid rgba(46,58,47,0.14)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#2e3a2f' }}>
                        GST / Tax Calculation Engine
                      </h3>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                        <input
                          type="checkbox"
                          checked={taxEnabled}
                          onChange={e => setTaxEnabled(e.target.checked)}
                          style={{ accentColor: '#2e3a2f', width: '16px', height: '16px' }}
                        />
                        <span>Enable Tax on Orders</span>
                      </label>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#625d54', marginBottom: '6px' }}>
                          Tax Rate (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.5"
                          value={taxRatePct}
                          onChange={e => setTaxRatePct(e.target.value)}
                          style={{
                            width: '100%',
                            height: '42px',
                            padding: '0 12px',
                            borderRadius: '10px',
                            border: '1px solid rgba(46,58,47,0.24)',
                            background: '#fffdf9',
                            fontSize: '14px',
                            fontWeight: 600
                          }}
                        />
                        <span style={{ fontSize: '11px', color: '#625d54', marginTop: '4px', display: 'block' }}>
                          Standard rate is 8% (e.g. 5%, 8%, 12%, 18%)
                        </span>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#625d54', marginBottom: '6px' }}>
                          Checkout Line Item Label
                        </label>
                        <input
                          type="text"
                          value={taxLabel}
                          onChange={e => setTaxLabel(e.target.value)}
                          style={{
                            width: '100%',
                            height: '42px',
                            padding: '0 12px',
                            borderRadius: '10px',
                            border: '1px solid rgba(46,58,47,0.24)',
                            background: '#fffdf9',
                            fontSize: '14px'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Authoritative Shipping Rates */}
                  <div style={{ background: '#fff', padding: '22px', borderRadius: '16px', border: '1px solid rgba(46,58,47,0.14)' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: '#2e3a2f' }}>
                      Shipping Tariffs & Thresholds
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#625d54', marginBottom: '6px' }}>
                          Standard Shipping (₹)
                        </label>
                        <input
                          type="number"
                          step="1"
                          value={standardShip}
                          onChange={e => setStandardShip(e.target.value)}
                          style={{
                            width: '100%',
                            height: '42px',
                            padding: '0 12px',
                            borderRadius: '10px',
                            border: '1px solid rgba(46,58,47,0.24)',
                            background: '#fffdf9',
                            fontSize: '14px',
                            fontWeight: 600
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#625d54', marginBottom: '6px' }}>
                          Express Shipping (₹)
                        </label>
                        <input
                          type="number"
                          step="1"
                          value={expressShip}
                          onChange={e => setExpressShip(e.target.value)}
                          style={{
                            width: '100%',
                            height: '42px',
                            padding: '0 12px',
                            borderRadius: '10px',
                            border: '1px solid rgba(46,58,47,0.24)',
                            background: '#fffdf9',
                            fontSize: '14px',
                            fontWeight: 600
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#625d54', marginBottom: '6px' }}>
                          Free Ship Threshold (₹)
                        </label>
                        <input
                          type="number"
                          step="1"
                          value={freeThreshold}
                          onChange={e => setFreeThreshold(e.target.value)}
                          style={{
                            width: '100%',
                            height: '42px',
                            padding: '0 12px',
                            borderRadius: '10px',
                            border: '1px solid rgba(46,58,47,0.24)',
                            background: '#fffdf9',
                            fontSize: '14px',
                            fontWeight: 600
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ══ TAB 2: PROMO CODES ══ */}
              {activeTab === 'promos' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  {/* Create New Promo Form */}
                  <form onSubmit={handleAddPromo} style={{ background: '#fff', padding: '22px', borderRadius: '16px', border: '1px solid rgba(46,58,47,0.14)' }}>
                    <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 700, color: '#2e3a2f' }}>
                      Create New Promo Code
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', alignItems: 'flex-end' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#625d54', marginBottom: '4px' }}>
                          CODE
                        </label>
                        <input
                          type="text"
                          placeholder="TRAIL10"
                          value={newCode}
                          onChange={e => setNewCode(e.target.value.toUpperCase())}
                          required
                          style={{
                            width: '100%',
                            height: '40px',
                            padding: '0 12px',
                            borderRadius: '10px',
                            border: '1px solid rgba(46,58,47,0.24)',
                            textTransform: 'uppercase',
                            fontWeight: 700
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#625d54', marginBottom: '4px' }}>
                          DISCOUNT (%)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="90"
                          value={newPct}
                          onChange={e => setNewPct(e.target.value)}
                          required
                          style={{
                            width: '100%',
                            height: '40px',
                            padding: '0 12px',
                            borderRadius: '10px',
                            border: '1px solid rgba(46,58,47,0.24)',
                            fontWeight: 600
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#625d54', marginBottom: '4px' }}>
                          MIN SPEND (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={newMinSpend}
                          onChange={e => setNewMinSpend(e.target.value)}
                          style={{
                            width: '100%',
                            height: '40px',
                            padding: '0 12px',
                            borderRadius: '10px',
                            border: '1px solid rgba(46,58,47,0.24)'
                          }}
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn--dark btn--sm"
                        style={{ height: '40px', padding: '0 20px', borderRadius: '10px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        Add Code
                      </button>
                    </div>
                  </form>

                  {/* Promo Directory Table */}
                  <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(46,58,47,0.14)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(46,58,47,0.14)', fontWeight: 700, fontSize: '14px', color: '#2e3a2f' }}>
                      Active Coupon Directory
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ background: '#f4f0e9', borderBottom: '1px solid rgba(46,58,47,0.14)', textAlign: 'left', color: '#625d54' }}>
                          <th style={{ padding: '12px 20px' }}>Code</th>
                          <th style={{ padding: '12px 14px' }}>Discount</th>
                          <th style={{ padding: '12px 14px' }}>Min Spend</th>
                          <th style={{ padding: '12px 14px' }}>Status</th>
                          <th style={{ padding: '12px 20px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {promos.length === 0 ? (
                          <tr>
                            <td colSpan="5" style={{ padding: '24px 20px', textAlign: 'center', color: '#625d54' }}>
                              No promo codes created yet.
                            </td>
                          </tr>
                        ) : (
                          promos.map(p => (
                            <tr key={p.code} style={{ borderBottom: '1px solid rgba(46,58,47,0.08)' }}>
                              <td style={{ padding: '14px 20px', fontWeight: 700, color: '#2e3a2f' }}>
                                {p.code}
                              </td>
                              <td style={{ padding: '14px 14px', fontWeight: 600, color: '#2e6b3a' }}>
                                {p.pct}% off
                              </td>
                              <td style={{ padding: '14px 14px', color: '#625d54' }}>
                                {p.minSpend > 0 ? `₹${p.minSpend}` : 'None'}
                              </td>
                              <td style={{ padding: '14px 14px' }}>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    padding: '2px 8px',
                                    borderRadius: '999px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    background: p.active ? 'rgba(46,107,58,0.1)' : 'rgba(0,0,0,0.06)',
                                    color: p.active ? '#2e6b3a' : '#717d6f'
                                  }}
                                >
                                  {p.active ? 'Active' : 'Disabled'}
                                </span>
                              </td>
                              <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                <button
                                  type="button"
                                  onClick={() => handleTogglePromo(p.code)}
                                  style={{ background: 'none', border: 'none', color: '#625d54', cursor: 'pointer', marginRight: '12px', fontSize: '12px', textDecoration: 'underline' }}
                                >
                                  {p.active ? 'Disable' : 'Enable'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePromo(p.code)}
                                  style={{ background: 'none', border: 'none', color: '#b5562f', cursor: 'pointer', fontSize: '12px' }}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ══ TAB 3: FLASH SALES & DISCOUNTED ITEMS ══ */}
              {activeTab === 'flash' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  {/* Master Announcement */}
                  <div style={{ background: '#fff', padding: '22px', borderRadius: '16px', border: '1px solid rgba(46,58,47,0.14)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#2e3a2f' }}>
                        Flash Sale Master Switch
                      </h3>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                        <input
                          type="checkbox"
                          checked={flashActive}
                          onChange={e => setFlashActive(e.target.checked)}
                          style={{ accentColor: '#2e3a2f', width: '16px', height: '16px' }}
                        />
                        <span>Enable Flash Deals</span>
                      </label>
                    </div>

                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#625d54', marginBottom: '6px' }}>
                      Storefront Promotional Announcement
                    </label>
                    <input
                      type="text"
                      value={flashBanner}
                      onChange={e => setFlashBanner(e.target.value)}
                      style={{
                        width: '100%',
                        height: '42px',
                        padding: '0 12px',
                        borderRadius: '10px',
                        border: '1px solid rgba(46,58,47,0.24)',
                        background: '#fffdf9',
                        fontSize: '13px'
                      }}
                    />
                  </div>

                  {/* Add Product to Flash Sale */}
                  <div style={{ background: '#fff', padding: '22px', borderRadius: '16px', border: '1px solid rgba(46,58,47,0.14)' }}>
                    <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 700, color: '#2e3a2f' }}>
                      Add Product to Flash Discounts
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', alignItems: 'flex-end' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#625d54', marginBottom: '4px' }}>
                          CHOOSE PRODUCT
                        </label>
                        <select
                          value={selectedProductToAdd}
                          onChange={e => setSelectedProductToAdd(e.target.value)}
                          style={{
                            width: '100%',
                            height: '40px',
                            padding: '0 12px',
                            borderRadius: '10px',
                            border: '1px solid rgba(46,58,47,0.24)',
                            background: '#fffdf9',
                            fontSize: '13px'
                          }}
                        >
                          {productsList.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} (Base: ₹{p.price})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#625d54', marginBottom: '4px' }}>
                          DISCOUNT (%)
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="80"
                          value={productDiscountPct}
                          onChange={e => setProductDiscountPct(e.target.value)}
                          style={{
                            width: '100%',
                            height: '40px',
                            padding: '0 12px',
                            borderRadius: '10px',
                            border: '1px solid rgba(46,58,47,0.24)',
                            fontWeight: 600
                          }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleAddFlashItem}
                        className="btn btn--dark btn--sm"
                        style={{ height: '40px', padding: '0 20px', borderRadius: '10px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        Apply Discount
                      </button>
                    </div>
                  </div>

                  {/* Flash Items Table */}
                  <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(46,58,47,0.14)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(46,58,47,0.14)', fontWeight: 700, fontSize: '14px', color: '#2e3a2f' }}>
                      Discounted Flash Items ({flashItems.length})
                    </div>
                    {flashItems.length === 0 ? (
                      <div style={{ padding: '24px 20px', textAlign: 'center', color: '#625d54' }}>
                        No items currently marked down. Select a product above to add a promotional deal.
                      </div>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ background: '#f4f0e9', borderBottom: '1px solid rgba(46,58,47,0.14)', textAlign: 'left', color: '#625d54' }}>
                            <th style={{ padding: '12px 20px' }}>Product</th>
                            <th style={{ padding: '12px 14px' }}>Discount</th>
                            <th style={{ padding: '12px 14px' }}>Sale Price Preview</th>
                            <th style={{ padding: '12px 20px', textAlign: 'right' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {flashItems.map(item => {
                            const p = productsList.find(x => x.id === item.id);
                            const basePrice = p ? p.price : 100;
                            const salePrice = (basePrice * (1 - item.discountPct / 100)).toFixed(2);
                            return (
                              <tr key={item.id} style={{ borderBottom: '1px solid rgba(46,58,47,0.08)' }}>
                                <td style={{ padding: '14px 20px' }}>
                                  <strong style={{ color: '#2e3a2f' }}>{p?.name || item.id}</strong>
                                  <span style={{ fontSize: '11px', color: '#625d54', display: 'block' }}>ID: {item.id} · Base: ₹{basePrice}</span>
                                </td>
                                <td style={{ padding: '14px 14px', fontWeight: 700, color: '#b5562f' }}>
                                  {item.discountPct}% off
                                </td>
                                <td style={{ padding: '14px 14px' }}>
                                  <strong style={{ color: '#2e6b3a' }}>₹{salePrice}</strong>
                                  <span style={{ textDecoration: 'line-through', color: '#625d54', marginLeft: '6px', fontSize: '11px' }}>₹{basePrice}</span>
                                </td>
                                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFlashItem(item.id)}
                                    style={{ background: 'none', border: 'none', color: '#b5562f', cursor: 'pointer', fontSize: '12px' }}
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* ══ TAB 4: CUSTOMER DIRECTORY & MANAGEMENT ══ */}
              {activeTab === 'customers' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* Search Customer Input */}
                  <div style={{ display: 'flex', alignItems: 'center', background: '#fff', padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(46,58,47,0.14)' }}>
                    <input
                      type="search"
                      placeholder="Search customers by name or email..."
                      value={customerSearch}
                      onChange={e => setCustomerSearch(e.target.value)}
                      style={{
                        width: '100%',
                        height: '36px',
                        border: 'none',
                        background: 'transparent',
                        fontSize: '13px',
                        outline: 'none',
                        color: '#2e3a2f'
                      }}
                    />
                  </div>

                  {/* Customer Table */}
                  <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(46,58,47,0.14)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ background: '#f4f0e9', borderBottom: '1px solid rgba(46,58,47,0.14)', textAlign: 'left', color: '#625d54' }}>
                          <th style={{ padding: '12px 20px' }}>Customer</th>
                          <th style={{ padding: '12px 12px' }}>Role</th>
                          <th style={{ padding: '12px 12px' }}>Orders</th>
                          <th style={{ padding: '12px 12px' }}>Spent</th>
                          <th style={{ padding: '12px 20px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomers.length === 0 ? (
                          <tr>
                            <td colSpan="5" style={{ padding: '24px 20px', textAlign: 'center', color: '#625d54' }}>
                              No registered customers found.
                            </td>
                          </tr>
                        ) : (
                          filteredCustomers.map(c => (
                            <tr key={c.email} style={{ borderBottom: '1px solid rgba(46,58,47,0.08)' }}>
                              <td style={{ padding: '14px 20px' }}>
                                <strong style={{ color: '#2e3a2f' }}>{c.name}</strong>
                                <span style={{ fontSize: '11px', color: '#625d54', display: 'block' }}>{c.email}</span>
                              </td>
                              <td style={{ padding: '12px 12px' }}>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    padding: '2px 8px',
                                    borderRadius: '999px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    background: c.role === 'admin' ? 'rgba(181,86,47,0.1)' : 'rgba(46,58,47,0.07)',
                                    color: c.role === 'admin' ? '#b5562f' : '#2e3a2f'
                                  }}
                                >
                                  {c.role || 'customer'}
                                </span>
                              </td>
                              <td style={{ padding: '12px 12px', fontWeight: 600 }}>
                                {c.totalOrders || 0}
                              </td>
                              <td style={{ padding: '12px 12px', fontWeight: 600, color: '#2e6b3a' }}>
                                ₹{Number(c.totalSpent || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                              <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenCustomerEdit(c)}
                                  style={{
                                    padding: '5px 12px',
                                    borderRadius: '999px',
                                    border: '1px solid rgba(46,58,47,0.24)',
                                    background: '#fbf9f5',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    marginRight: '6px'
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeletingCustomer(c)}
                                  style={{
                                    padding: '5px 12px',
                                    borderRadius: '999px',
                                    border: '1px solid rgba(181,86,47,0.25)',
                                    background: 'rgba(181,86,47,0.05)',
                                    color: '#b5562f',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                  }}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <footer
          style={{
            padding: '16px clamp(16px, 4vw, 30px)',
            borderTop: '1px solid rgba(46,58,47,0.14)',
            background: '#fbf9f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            flexShrink: 0
          }}
        >
          <div>
            {saveMsg && (
              <span style={{ color: '#2e6b3a', fontWeight: 600, fontSize: '13px' }}>
                {saveMsg}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn btn--sm"
              onClick={onClose}
              style={{
                height: '42px',
                padding: '0 20px',
                borderRadius: '999px',
                border: '1px solid rgba(46,58,47,0.24)',
                background: '#fff',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn--dark btn--sm"
              disabled={saving}
              onClick={handleSaveSettings}
              style={{
                height: '42px',
                padding: '0 24px',
                borderRadius: '999px',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </footer>
      </div>

      {/* ══ EDIT CUSTOMER MODAL ══ */}
      {editingCustomer && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000001,
            background: 'rgba(26, 32, 27, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <form
            onSubmit={handleSaveCustomerEdit}
            style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '26px 30px',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              border: '1px solid rgba(46,58,47,0.14)'
            }}
          >
            <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 700, color: '#2e3a2f' }}>
              Edit Customer Profile
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#625d54' }}>
              Account: <strong>{editingCustomer.email}</strong>
            </p>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#625d54', marginBottom: '4px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                required
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid rgba(46,58,47,0.24)' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#625d54', marginBottom: '4px' }}>
                Phone Number
              </label>
              <input
                type="text"
                value={editPhone}
                onChange={e => setEditPhone(e.target.value)}
                placeholder="+91 98765 43210"
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid rgba(46,58,47,0.24)' }}
              />
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#625d54', marginBottom: '4px' }}>
                Role
              </label>
              <select
                value={editRole}
                onChange={e => setEditRole(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid rgba(46,58,47,0.24)', background: '#fffdf9' }}
              >
                <option value="customer">Customer</option>
                <option value="admin">Store Admin</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn btn--sm"
                onClick={() => setEditingCustomer(null)}
                style={{ height: '40px', padding: '0 18px', borderRadius: '999px', border: '1px solid rgba(46,58,47,0.24)', background: '#fff', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdatingCustomer}
                className="btn btn--dark btn--sm"
                style={{ height: '40px', padding: '0 22px', borderRadius: '999px', cursor: 'pointer' }}
              >
                {isUpdatingCustomer ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ══ DELETE CUSTOMER CONFIRMATION MODAL ══ */}
      {deletingCustomer && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000001,
            background: 'rgba(26, 32, 27, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '26px 30px',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              textAlign: 'center',
              border: '1px solid rgba(46,58,47,0.14)'
            }}
          >
            <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 700, color: '#2e3a2f' }}>
              Delete Customer Account?
            </h3>
            <p style={{ margin: '0 0 22px', fontSize: '13px', lineHeight: '1.5', color: '#625d54' }}>
              Are you sure you want to permanently delete <strong>{deletingCustomer.name}</strong> ({deletingCustomer.email})? This action cannot be reversed.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                type="button"
                className="btn btn--sm"
                onClick={() => setDeletingCustomer(null)}
                style={{ height: '40px', padding: '0 20px', borderRadius: '999px', border: '1px solid rgba(46,58,47,0.24)', background: '#fff', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingCustomer}
                onClick={handleConfirmDeleteCustomer}
                style={{
                  height: '40px',
                  padding: '0 22px',
                  borderRadius: '999px',
                  border: 'none',
                  background: '#b5562f',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {isDeletingCustomer ? 'Deleting...' : 'Delete Customer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(drawerContent, document.body);
}
