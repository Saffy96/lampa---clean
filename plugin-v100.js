// Lampa. Clean v1.0.0
(function () {
  'use strict';

  var NAME = 'Lampa Clean';
  var VERSION = '1.0.0';

  if (window.__LAMPA_CLEAN_V100__) return;
  window.__LAMPA_CLEAN_V100__ = true;

  var Lampa = window.Lampa;
  var touched = [];

  function log() {
    try {
      var args = Array.prototype.slice.call(arguments);
      args.unshift('[' + NAME + ']');
      console.log.apply(console, args);
    } catch (e) {}
  }

  function preparePlayerData(event) {
    if (!event || !event.data) return;

    var data = event.data;

    if (!Object.prototype.hasOwnProperty.call(data, '__lampaCleanOriginalIptv')) {
      data.__lampaCleanOriginalIptv = {
        had: Object.prototype.hasOwnProperty.call(data, 'iptv'),
        value: data.iptv
      };
    }

    data.iptv = true;

    if (touched.indexOf(data) === -1) touched.push(data);

    log('preroll bypass armed');
  }

  function restoreData(data) {
    if (!data || !data.__lampaCleanOriginalIptv) return;

    var original = data.__lampaCleanOriginalIptv;

    if (original.had) data.iptv = original.value;
    else {
      try { delete data.iptv; }
      catch (e) { data.iptv = false; }
    }

    try { delete data.__lampaCleanOriginalIptv; } catch (e) {}

    var index = touched.indexOf(data);
    if (index >= 0) touched.splice(index, 1);

    log('player data restored');
  }

  function restoreAll() {
    touched.slice().forEach(restoreData);
  }

  function installPrerollBypass() {
    if (!Lampa || !Lampa.Player || !Lampa.Player.listener || !Lampa.Player.listener.follow) {
      log('Lampa.Player.listener not ready');
      return false;
    }

    if (window.__LAMPA_CLEAN_PREROLL_HOOK__) return true;
    window.__LAMPA_CLEAN_PREROLL_HOOK__ = true;

    Lampa.Player.listener.follow('create', preparePlayerData);
    Lampa.Player.listener.follow('start', restoreData);
    Lampa.Player.listener.follow('external', restoreData);
    Lampa.Player.listener.follow('destroy', restoreAll);

    log('preroll bypass installed');
    return true;
  }

  function removeAdUi(root) {
    root = root || document;

    ['.ad-preroll', '.ad-video-block'].forEach(function (selector) {
      try {
        root.querySelectorAll(selector).forEach(function (node) {
          node.style.setProperty('display', 'none', 'important');
        });
      } catch (e) {}
    });
  }

  function installObserver() {
    if (!window.MutationObserver || window.__LAMPA_CLEAN_AD_OBSERVER__) return;

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (!node || node.nodeType !== 1) return;
          removeAdUi(node);

          try {
            if (node.matches && (node.matches('.ad-preroll') || node.matches('.ad-video-block'))) {
              node.style.setProperty('display', 'none', 'important');
            }
          } catch (e) {}
        });
      });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.__LAMPA_CLEAN_AD_OBSERVER__ = observer;
  }

  function start() {
    removeAdUi();
    installObserver();

    if (!installPrerollBypass()) {
      var attempts = 0;
      var timer = setInterval(function () {
        attempts++;
        if (installPrerollBypass() || attempts > 30) clearInterval(timer);
      }, 500);
    }

    window.LampaClean = window.LampaClean || {};
    window.LampaClean.version = VERSION;
    window.LampaClean.restorePlayerData = restoreAll;

    log('v' + VERSION + ' loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
