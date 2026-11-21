'use client';

import { useEffect } from 'react';

export default function CustomDropdownProvider() {
  useEffect(() => {
    let activeSelect = null;
    let menuEl = null;
    let highlightedIndex = -1;

    // Create the global floating menu element once
    menuEl = document.createElement('div');
    menuEl.id = 'solum-custom-dropdown';
    menuEl.className = 'solum-dropdown-menu';
    menuEl.setAttribute('role', 'listbox');
    menuEl.hidden = true;
    document.body.appendChild(menuEl);

    function closeMenu() {
      if (!menuEl || menuEl.hidden) return;
      menuEl.hidden = true;
      menuEl.innerHTML = '';
      if (activeSelect) {
        activeSelect.classList.remove('is-dropdown-open');
        activeSelect.parentElement?.classList.remove('is-dropdown-open');
        activeSelect = null;
      }
      highlightedIndex = -1;
    }

    function selectOption(select, value) {
      if (!select) return;
      if (select.value !== value) {
        select.value = value;
        // Dispatch React and standard DOM change and input events
        select.dispatchEvent(new Event('change', { bubbles: true }));
        select.dispatchEvent(new Event('input', { bubbles: true }));
      }
      closeMenu();
      try {
        select.focus({ preventScroll: true });
      } catch {}
    }

    function openMenuFor(select) {
      if (!select || select.disabled || !select.options || select.options.length === 0) return;

      // If already open for this select, toggle it closed
      if (activeSelect === select && !menuEl.hidden) {
        closeMenu();
        return;
      }

      closeMenu();
      activeSelect = select;
      select.classList.add('is-dropdown-open');
      select.parentElement?.classList.add('is-dropdown-open');

      // Make sure menu is in the proper container (if inside dialog, append to dialog so it's not trapped behind top layer)
      const activeDialog = select.closest('dialog[open]');
      const targetContainer = activeDialog || document.body;
      if (menuEl.parentElement !== targetContainer) {
        targetContainer.appendChild(menuEl);
      }

      const options = Array.from(select.options);
      menuEl.innerHTML = '';

      options.forEach((opt, idx) => {
        const item = document.createElement('div');
        const isSelected = opt.selected || opt.value === select.value;
        item.className = 'solum-dropdown-item' + (isSelected ? ' is-selected' : '');
        item.setAttribute('role', 'option');
        item.setAttribute('aria-selected', String(isSelected));
        item.dataset.value = opt.value;
        item.dataset.index = String(idx);

        const textSpan = document.createElement('span');
        textSpan.className = 'solum-dropdown-text';
        textSpan.textContent = opt.textContent || opt.label;
        item.appendChild(textSpan);

        if (isSelected) {
          highlightedIndex = idx;
          const check = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          check.setAttribute('class', 'solum-check-icon');
          check.setAttribute('width', '16');
          check.setAttribute('height', '16');
          check.setAttribute('viewBox', '0 0 24 24');
          check.setAttribute('fill', 'none');
          check.setAttribute('stroke', 'currentColor');
          check.setAttribute('stroke-width', '2.5');
          check.setAttribute('stroke-linecap', 'round');
          check.setAttribute('stroke-linejoin', 'round');
          check.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
          item.appendChild(check);
        }

        // Handle item selection on pointerdown to prevent blur interference
        item.addEventListener('pointerdown', (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          selectOption(select, opt.value);
        });

        menuEl.appendChild(item);
      });

      // Calculate position relative to viewport
      const rect = select.getBoundingClientRect();
      const menuMaxHeight = 280;
      const estimatedHeight = Math.min(options.length * 40 + 16, menuMaxHeight);
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const openUpwards = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;

      const menuWidth = Math.max(rect.width, 160);
      let left = rect.left;
      if (left + menuWidth > window.innerWidth - 12) {
        left = window.innerWidth - menuWidth - 12;
      }
      if (left < 12) left = 12;

      menuEl.style.position = 'fixed';
      menuEl.style.zIndex = '9999999';
      menuEl.style.width = `${menuWidth}px`;
      menuEl.style.left = `${left}px`;

      if (openUpwards) {
        menuEl.style.bottom = `${window.innerHeight - rect.top + 6}px`;
        menuEl.style.top = 'auto';
        menuEl.style.transformOrigin = 'bottom center';
      } else {
        menuEl.style.top = `${rect.bottom + 6}px`;
        menuEl.style.bottom = 'auto';
        menuEl.style.transformOrigin = 'top center';
      }

      menuEl.hidden = false;

      // Scroll selected item into view
      const selectedItem = menuEl.querySelector('.solum-dropdown-item.is-selected');
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest' });
      }
    }

    // Intercept clicks on any select element
    function handlePointerDown(e) {
      // If clicking inside our custom menu, do nothing (item listener handles it)
      if (menuEl && menuEl.contains(e.target)) return;

      const select = e.target.closest('select');
      if (select) {
        e.preventDefault();
        e.stopPropagation();
        openMenuFor(select);
        return;
      }

      // If clicking a label or wrapper pointing to a select
      const label = e.target.closest('label.select, .select, label');
      if (label && !e.target.closest('button, a, input, textarea')) {
        const innerSelect = label.querySelector('select');
        if (innerSelect) {
          e.preventDefault();
          e.stopPropagation();
          openMenuFor(innerSelect);
          return;
        }
      }

      // Clicked outside
      closeMenu();
    }

    // Intercept keyboard controls on select
    function handleKeyDown(e) {
      const select = e.target.closest('select');

      if (!menuEl || menuEl.hidden) {
        if (select && (e.key === ' ' || e.key === 'Enter' || (e.altKey && e.key === 'ArrowDown'))) {
          e.preventDefault();
          openMenuFor(select);
        }
        return;
      }

      // Menu is currently open
      if (e.key === 'Escape' || e.key === 'Tab') {
        closeMenu();
        return;
      }

      const items = Array.from(menuEl.querySelectorAll('.solum-dropdown-item'));
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        highlightedIndex = (highlightedIndex + 1) % items.length;
        updateHighlight(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlightedIndex = (highlightedIndex - 1 + items.length) % items.length;
        updateHighlight(items);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < items.length) {
          const val = items[highlightedIndex].dataset.value;
          selectOption(activeSelect, val);
        }
      }
    }

    function updateHighlight(items) {
      items.forEach((item, idx) => {
        if (idx === highlightedIndex) {
          item.classList.add('is-focused');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('is-focused');
        }
      });
    }

    // Dismiss on window resize or scroll outside menu
    function handleScroll(e) {
      if (menuEl && !menuEl.hidden) {
        if (menuEl.contains(e.target)) return; // Allow scrolling inside dropdown list
        closeMenu();
      }
    }

    // Prevent native dropdown on mousedown as well (for full cross-browser reliability)
    function handleMouseDown(e) {
      if (menuEl && menuEl.contains(e.target)) return;
      const select = e.target.closest('select');
      if (select) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const label = e.target.closest('label.select, .select, label');
      if (label && !e.target.closest('button, a, input, textarea')) {
        const innerSelect = label.querySelector('select');
        if (innerSelect) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    }

    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('mousedown', handleMouseDown, true);
    document.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', closeMenu);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('mousedown', handleMouseDown, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', closeMenu);
      if (menuEl && menuEl.parentNode) {
        menuEl.parentNode.removeChild(menuEl);
      }
    };
  }, []);

  return null;
}
