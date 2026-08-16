(function () {
  'use strict';

  const NAME = 'Lampa Clean';
  const VERSION = '0.1.1';
  const Lampa = window.Lampa;

  if (window.__LAMPA_CLEAN_LOADED__) return;
  window.__LAMPA_CLEAN_LOADED__ = true;

  const settings = {
    enabled: localStorage.getItem('lampa_clean_enabled') !== '0',
    debug: localStorage.getItem('lampa_clean_debug') === '1'
  };

  const selectors = [
    '[class*="advert"]',
    '[class*="advertisement"]',
    '[class*="banner"]',
    '[class*="promo"]',
    '[class*="sponsor"]',
    '[class*="ads-"]',
    '[class^="ads"]',
    '[id*="advert"]',
    '[id*="banner"]',
    '[id*="promo"]',
    '[data-ad]',
    '[data-ads]',
    '[data-advert]',
    'iframe[src*="doubleclick"]',
    'iframe[src*="googlesyndication"]',
    'iframe[src*="adservice"]'
  ];

  const blockedHosts = [
    'doubleclick.net',
    'googlesyndication.com',
    'googleadservices.com'
  ];

  function log(...args) {
    if (settings.debug) console.log(`[${NAME}]`, ...args);
  }

  function isBlockedUrl(url) {
    try {
      const parsed = new URL(url, location.href);
      return blockedHosts.some(host =>
        parsed.hostname === host || parsed.hostname.endsWith('.' + host)
      );
    } catch (_) {
      return false;
    }
  }

  function hideElement(el) {
    if (!el || el.dataset?.lampaCleanHidden === '1') return;

    const area = (el.offsetWidth || 0) * (el.offsetHeight || 0);
    const pageArea = Math.max(1, window.innerWidth * window.innerHeight);

    if (area / pageArea > 0.75) return;

    if (el.dataset) el.dataset.lampaCleanHidden = '1';

    el.style.setProperty('display', 'none', 'important');
    el.style.setProperty('visibility', 'hidden', 'important');
    el.style.setProperty('pointer-events', 'none', 'important');

    log('hidden', el);
  }

  function clean(root = document) {
    if (!settings.enabled || !root?.querySelectorAll) return;

    for (const selector of selectors) {
      try {
        root.querySelectorAll(selector).forEach(hideElement);
      } catch (_) {}
    }
  }

  function installStyle() {
    if (document.getElementById('lampa-clean-style')) return;

    const style = document.createElement('style');
    style.id = 'lampa-clean-style';
    style.textContent = selectors
      .filter(s => !s.startsWith('iframe'))
      .map(s => `${s}{display:none!important;visibility:hidden!important;}`)
      .join('\n');

    document.head.appendChild(style);
  }

  function patchFetch() {
    if (!window.fetch || window.fetch.__lampaCleanPatched) return;

    const originalFetch = window.fetch.bind(window);

    function cleanFetch(input, init) {
      if (settings.enabled) {
        const url =
          typeof input === 'string'
            ? input
            : input && typeof input.url === 'string'
              ? input.url
              : '';

        if (url && isBlockedUrl(url)) {
          log('blocked fetch', url);
          return Promise.resolve(
            new Response('', {
              status: 204,
              statusText: 'Blocked by Lampa Clean'
            })
          );
        }
      }

      return originalFetch(input, init);
    }

    cleanFetch.__lampaCleanPatched = true;
    window.fetch = cleanFetch;
  }

  function patchXHR() {
    if (!window.XMLHttpRequest || XMLHttpRequest.prototype.__lampaCleanPatched) return;

    const originalOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      if (settings.enabled && typeof url === 'string' && isBlockedUrl(url)) {
        log('blocked xhr', url);
        this.__lampaCleanBlocked = true;
      }

      return originalOpen.call(
        this,
        method,
        this.__lampaCleanBlocked ? 'data:text/plain,' : url,
        ...rest
      );
    };

    XMLHttpRequest.prototype.__lampaCleanPatched = true;
  }

  function observe() {
    const observer = new MutationObserver(mutations => {
      if (!settings.enabled) return;

      for (const mutation of mutations) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;

          clean(node);

          try {
            for (const selector of selectors) {
              if (node.matches?.(selector)) hideElement(node);
            }
          } catch (_) {}
        });
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    window.__LAMPA_CLEAN_OBSERVER__ = observer;
  }

  function exposeApi() {
    window.LampaClean = {
      version: VERSION,

      enable() {
        settings.enabled = true;
        localStorage.setItem('lampa_clean_enabled', '1');
        installStyle();
        clean();
        console.log(`[${NAME}] enabled`);
      },

      disable() {
        settings.enabled = false;
        localStorage.setItem('lampa_clean_enabled', '0');

        document.getElementById('lampa-clean-style')?.remove();

        document
          .querySelectorAll('[data-lampa-clean-hidden="1"]')
          .forEach(el => {
            el.style.removeProperty('display');
            el.style.removeProperty('visibility');
            el.style.removeProperty('pointer-events');
            delete el.dataset.lampaCleanHidden;
          });

        console.log(`[${NAME}] disabled`);
      },

      debug(value = true) {
        settings.debug = !!value;
        localStorage.setItem('lampa_clean_debug', settings.debug ? '1' : '0');
        console.log(`[${NAME}] debug:`, settings.debug);
      },

      clean() {
        clean();
      },

      addSelector(selector) {
        if (!selectors.includes(selector)) selectors.push(selector);
        clean();
      },

      addHost(host) {
        if (!blockedHosts.includes(host)) blockedHosts.push(host);
      },

      getSelectors() {
        return [...selectors];
      },

      getBlockedHosts() {
        return [...blockedHosts];
      }
    };
  }

  function start() {
    if (Lampa && Lampa.Storage) log('Lampa API detected');

    if (!settings.enabled) {
      exposeApi();
      console.log(`[${NAME}] loaded, disabled`);
      return;
    }

    installStyle();
    patchFetch();
    patchXHR();
    clean();
    observe();
    exposeApi();

    console.log(`[${NAME}] v${VERSION} loaded`);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();