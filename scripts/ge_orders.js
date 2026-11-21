function Ge(e,n){e.title(`Orders`);let r=We(n.params.get(`status`))?n.params.get(`status`):`All`,i=n.params.get(`q`)??``,a=n.params.get(`sort`)in Ve?n.params.get(`sort`):`new`,o=He,c,l=D(`
    <section class="view view--orders">
      <div class="toolbar" data-rise>
        <div class="search">
          <label class="sr-only" for="o-q">Search orders</label>
          ${S(`search`,18)}
          <input id="o-q" type="search" placeholder="Search by order number, name or email" autocomplete="off" spellcheck="false" />
        </div>
        <label class="select"><span>Sort</span>
          <select id="o-sort">${Object.entries(Ve).map(([e,t])=>`<option value="${e}">${t}</option>`).join(``)}</select>
          ${S(`sort`,16)}
        </label>
      </div>
      <div class="tabs-wrap" data-rise>
        <div class="tabs" role="group" aria-label="Filter by status">
          ${[`All`,...m].map(e=>`<button type="button" class="tab" data-status="${e}" aria-pressed="false">${e} <span class="tab__n"></span></button>`).join(``)}
          <span class="tabs__line" aria-hidden="true"></span>
        </div>
      </div>
      <div class="card card--table" data-rise>
        <table class="tbl tbl--orders">
          <caption class="sr-only" data-cap></caption>
          <thead><tr>
            <th scope="col">Order</th><th scope="col">Date</th><th scope="col">Customer</th>
            <th scope="col" class="num">Items</th><th scope="col" class="num">Total</th><th scope="col">Status</th>
          </tr></thead>
          <tbody data-rows></tbody>
        </table>
        <div class="empty" data-empty hidden>
          <p class="empty__title">No orders match</p>
          <p class="empty__text" data-empty-text></p>
          <button type="button" class="btn btn--ghost" data-clear>Clear search and filter</button>
        </div>
        <div class="more" data-more>
          <p class="more__count" data-count aria-live="polite"></p>
          <button type="button" class="btn btn--ghost" data-load>Show more</button>
        </div>
      </div>

      <dialog class="sheet sheet--drawer" aria-labelledby="od-title">
        <div class="sheet__scrim"></div>
        <div class="sheet__panel" data-drawer></div>
      </dialog>
    </section>`),u=e=>l.querySelector(e),f=u(`[data-rows]`),p=u(`#o-q`),h=u(`#o-sort`),g=u(`.tabs__line`);p.value=i,h.value=a;let _=new Map,y=new Map;function b(e){let t=_.get(e.id);if(!t){let n=e.lines.reduce((e,t)=>e+t.qty,0);t=D(`<table><tbody><tr data-id="${T(e.id)}">
        <th scope="row" data-label="Order"><a class="rowlink" href="#/orders/${T(e.id)}">${T(e.id)}</a></th>
        <td data-label="Date"><span class="cell-main">${L(e.createdAt)}</span><span class="cell-sub">${R(e.createdAt)}</span></td>
        <td data-label="Customer" class="cell-who"><span class="cell-main">${T(e.customer.name)}</span><span class="cell-sub">${T(e.customer.email)}</span></td>
        <td data-label="Items" class="num">${n}<span class="cell-unit"> ${n===1?`item`:`items`}</span></td>
        <td data-label="Total" class="num cell-total">${A(e.total)}</td>
        <td data-label="Status" class="cell-status">${ve(e.status)}</td>
      </tr></tbody></table>`).querySelector(`tr`),_.set(e.id,t),y.set(e.id,e.status)}if(y.get(e.id)!==e.status){y.set(e.id,e.status);let n=t.querySelector(`[data-pill]`);t.isConnected?se(n,()=>ye(n,e.status)):ye(n,e.status)}return t}function x(e){let t=i.trim().toLowerCase();return e.filter(e=>(r===`All`||e.status===r)&&(!t||e.id.toLowerCase().includes(t)||e.customer.name.toLowerCase().includes(t)||e.customer.email.toLowerCase().includes(t))).sort({new:(e,t)=>t.createdAt.localeCompare(e.createdAt),old:(e,t)=>e.createdAt.localeCompare(t.createdAt),high:(e,t)=>t.total-e.total,low:(e,t)=>e.total-t.total}[a])}function C(e){let n=l.querySelector(`.tab[data-status="${r}"]`),i={x:n.offsetLeft+12,scaleX:(n.offsetWidth-24)/100};!e||E()?t.set(g,i):t.to(g,{...i,duration:.45,ease:`back.out(1.25)`})}function w(e,n=[]){let a=s();for(let e of l.querySelectorAll(`.tab`)){let t=e.dataset.status;e.setAttribute(`aria-pressed`,String(t===r)),e.querySelector(`.tab__n`).textContent=String(t===`All`?a.length:a.filter(e=>e.status===t).length)}let c=x(a),d=c.slice(0,o),p=[...f.children],m=k().split(`?`)[1],h=()=>{let e=d.map(b);for(let t of e)t.querySelector(`.rowlink`).href=`#/orders/${t.dataset.id}${m?`?`+m:``}`;return f.replaceChildren(...e),e};if(e===`flip`)oe(p,h);else{let t=h();e===`first`&&U(t,.15),e===`append`&&U(t.slice(p.length))}let g=n.map(e=>_.get(e)).filter(e=>!!e&&e.isConnected);g.length&&!E()&&t.fromTo(g,{opacity:0,x:-20},{opacity:1,x:0,duration:.55,stagger:.06,ease:`power3.out`,clearProps:`transform,opacity`}),u(`[data-cap]`).textContent=`Orders${r===`All`?``:`, ${r}`}${i?`, matching “${i}”`:``}. ${H(c.length,`result`)}.`,u(`[data-empty]`).hidden=c.length>0,u(`[data-empty-text]`).textContent=`Nothing ${r===`All`?``:`in ${r} `}${i?`matches “${i}”`:`here yet`}.`,u(`[data-more]`).hidden=c.length===0,u(`[data-count]`).textContent=`Showing ${Math.min(o,c.length)} of ${H(c.length,`order`)}`,u(`[data-load]`).hidden=c.length<=o}let O=()=>e.sync(Se(c?`orders/${c}`:`orders`,{status:r===`All`?void 0:r,q:i||void 0,sort:a===`new`?void 0:a})),k=()=>Se(`orders`,{status:r===`All`?void 0:r,q:i||void 0,sort:a===`new`?void 0:a});l.querySelector(`.tabs`).addEventListener(`click`,e=>{let t=e.target.closest(`.tab`);!t||t.dataset.status===r||(r=t.dataset.status,o=He,C(!0),w(`flip`),O())}),p.addEventListener(`input`,ee(()=>{i=p.value,o=He,w(`flip`),O()},140)),h.addEventListener(`change`,()=>{a=h.value,w(`flip`),O()}),u(`[data-load]`).addEventListener(`click`,()=>{o+=He,w(`append`)}),u(`[data-clear]`).addEventListener(`click`,()=>{i=``,p.value=``,r=`All`,o=He,C(!0),w(`flip`),O(),p.focus()}),f.addEventListener(`click`,e=>{let t=e.target.closest(`tr[data-id]`);!t||e.target.closest(`a`)||t.querySelector(`.rowlink`).click()});let j=u(`dialog`),M=u(`[data-drawer]`),N=ue(j,{from:`right`,onDismiss:()=>e.go(k())}),P=0;function F(n,r){let i=n.lines.reduce((e,t)=>e+t.qty,0);if(M.innerHTML=`
      <header class="dr__head">
        <div>
          <p class="dr__eyebrow">Order · ${z(n.createdAt)}</p>
          <h2 class="dr__title" id="od-title">${T(n.id)}</h2>
        </div>
        <button type="button" class="iconbtn" data-close aria-label="Close order ${T(n.id)}">${S(`close`)}</button>
      </header>
      <div class="dr__body">
        <div class="dr__status">${ve(n.status)}<span class="dr__src">${n.source===`store`?`Placed in the shop`:`Demo order`}</span></div>

        <section class="dr__sec" aria-labelledby="od-cust">
          <h3 id="od-cust" class="dr__h">Customer</h3>
          <div class="dr__cols">
            <p class="dr__block">${S(`mail`,18)}<span><b>${T(n.customer.name)}</b><a href="mailto:${T(n.customer.email)}">${T(n.customer.email)}</a>${n.customer.phone?`<span>${T(n.customer.phone)}</span>`:``}</span></p>
            <p class="dr__block">${S(`pin`,18)}<span><b>Ship to</b>${T(n.address.line1)}${n.address.line2?`, ${T(n.address.line2)}`:``}<br />${T(n.address.city)}, ${T(n.address.region)} ${T(n.address.postal)}<br />${T(n.address.country)}</span></p>
          </div>
          <a class="link" href="#/customers/${encodeURIComponent(n.customer.email)}">See this customer</a>
        </section>

        <section class="dr__sec" aria-labelledby="od-items">
          <h3 id="od-items" class="dr__h">${H(i,`item`)}</h3>
          <ul class="dr__lines">
            ${n.lines.map(e=>`<li>${xe(e.img,``,56)}<span class="dr__lname"><b>${T(e.name)}</b><span>${e.size?`Size ${T(e.size)} · `:``}Qty ${e.qty} × ${A(e.price)}</span></span><span class="dr__lsum">${A(e.price*e.qty)}</span></li>`).join(``)}
          </ul>
          <dl class="dr__totals">
            <div><dt>Subtotal</dt><dd>${A(n.subtotal)}</dd></div>
            ${n.discount?`<div><dt>Discount${n.promo?` (${T(n.promo)})`:``}</dt><dd>−${A(n.discount)}</dd></div>`:``}
            <div><dt>Shipping, ${n.method===`express`?`express`:`standard`}</dt><dd>${n.shipping?A(n.shipping):`Free`}</dd></div>
            <div><dt>Tax</dt><dd>${A(n.tax)}</dd></div>
            <div class="is-total"><dt>Total</dt><dd>${A(n.total)}</dd></div>
          </dl>
          <p class="dr__block dr__pay">${S(`card`,18)}<span>Paid by ${T(n.payment.brand)} ending ${T(n.payment.last4)}</span></p>
        </section>

        <section class="dr__sec" aria-labelledby="od-tl">
          <h3 id="od-tl" class="dr__h">Timeline</h3>
          <ol class="tl" data-tl>
            ${n.history.map((e,t)=>`<li class="tl__step${t===n.history.length-1?` is-now`:``}"><i class="tl__dot dot--${e.status.toLowerCase()}" aria-hidden="true"></i><span class="tl__what">${e.status}</span><time datetime="${e.at}">${z(e.at)}</time></li>`).join(``)}
          </ol>
        </section>

        <section class="dr__sec" aria-labelledby="od-change">
          <h3 id="od-change" class="dr__h">Change status</h3>
          <form class="stform" data-stform novalidate>
            <label class="sr-only" for="od-st">New status</label>
            <div class="select select--full"><select id="od-st">${m.map(e=>`<option value="${e}"${e===n.status?` selected`:``}>${e}</option>`).join(``)}</select>${S(`sort`,16)}</div>
            <button type="submit" class="btn btn--dark">Update status</button>
            <p class="stform__msg" data-stmsg aria-live="polite"></p>
          </form>
          <div class="confirm" data-confirm hidden role="group" aria-labelledby="od-confirm-t">
            <p class="confirm__t" id="od-confirm-t"></p>
            <p class="confirm__d">In a real store this would also email the customer and release the payment hold. It can be changed back here, but the step stays on the timeline.</p>
            <div class="confirm__btns"><button type="button" class="btn btn--danger" data-yes></button><button type="button" class="btn btn--ghost" data-no>Keep current status</button></div>
          </div>
        </section>
      </div>`,P=n.history.length,M.querySelector(`[data-close]`).addEventListener(`click`,()=>e.go(k())),I(n),r&&!E()){let e=M.querySelector(`.tl__step:last-child`);t.fromTo(e,{opacity:0,y:-14},{opacity:1,y:0,duration:.5,ease:`back.out(1.6)`,clearProps:`transform,opacity`});let n=M.querySelector(`.dr__status [data-pill]`);t.fromTo(n,{scale:.8,opacity:0},{scale:1,opacity:1,duration:.45,ease:`back.out(1.6)`,clearProps:`transform,opacity`})}}function I(e){let n=M.querySelector(`[data-stform]`),r=n.querySelector(`select`),i=M.querySelector(`[data-stmsg]`),a=M.querySelector(`[data-confirm]`),o=t=>{v(e.id,t),me(`${e.id} is now ${t}`),M.querySelector(`[data-tl]`)?.closest(`.dr__sec`)?.scrollIntoView({block:`nearest`,behavior:E()?`auto`:`smooth`})};n.addEventListener(`submit`,s=>{s.preventDefault();let c=r.value;if(c===e.status){i.textContent=`This order is already ${c}. Pick a different status.`,ce(r.parentElement);return}if(i.textContent=``,Ue.includes(c)){a.hidden=!1,n.hidden=!0,a.querySelector(`.confirm__t`).textContent=c===`Cancelled`?`Cancel order ${e.id}?`:`Refund ${A(e.total)} on ${e.id}?`;let i=a.querySelector(`[data-yes]`);i.textContent=c===`Cancelled`?`Yes, cancel order`:`Yes, refund order`,i.onclick=()=>o(c),a.querySelector(`[data-no]`).onclick=()=>{a.hidden=!0,n.hidden=!1,r.value=e.status,r.focus()},E()||t.fromTo(a,{opacity:0,y:8},{opacity:1,y:0,duration:.35,clearProps:`transform,opacity`}),i.focus();return}o(c)})}function B(t){if(!t){c=void 0,N.isOpen&&N.close();return}let n=d(t);if(!n){me(`Order ${t} was not found`,{tone:`warn`}),e.go(k(),!0);return}let r=_.get(t)?.querySelector(`.rowlink`)??document.activeElement;c=t,F(n,!1),N.isOpen||N.open(r),M.scrollTop=0}return w(e.firstVisit(`orders`)?`first`:`none`),queueMicrotask(()=>{C(!1),n.id&&B(n.id)}),{el:l,update(e){let t=We(e.params.get(`status`))?e.params.get(`status`):`All`,n=e.params.get(`q`)??``,s=e.params.get(`sort`)in Ve?e.params.get(`sort`):`new`;(t!==r||n!==i||s!==a)&&(r=t,i=n,a=s,o=He,p.value=i,h.value=a,C(!0),w(`flip`)),e.id!==c&&B(e.id)},refresh(e,t){if(e===`orders`&&(w(`none`,t),c)){let e=d(c);if(e&&e.history.length!==P){let t=M.contains(document.activeElement)||document.activeElement===document.body;F(e,!0),t&&M.querySelector(`#od-st`)?.focus({preventScroll:!0})}}},destroy(){j.open&&j.close(),y=new Map}}}var Y=`grid`;