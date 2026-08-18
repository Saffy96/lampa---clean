// Lampa. Clean v1.0.0
(function () {
  'use strict';
  var NAME='Lampa Clean', VERSION='1.0.0';
  if(window.__LAMPA_CLEAN_V100__) return;
  window.__LAMPA_CLEAN_V100__=true;
  var Lampa=window.Lampa, touched=[];
  function log(){try{var a=Array.prototype.slice.call(arguments);a.unshift('['+NAME+']');console.log.apply(console,a)}catch(e){}}
  function preparePlayerData(event){if(!event||!event.data)return;var data=event.data;if(!Object.prototype.hasOwnProperty.call(data,'__lampaCleanOriginalIptv'))data.__lampaCleanOriginalIptv={had:Object.prototype.hasOwnProperty.call(data,'iptv'),value:data.iptv};data.iptv=true;if(touched.indexOf(data)===-1)touched.push(data);log('preroll bypass armed')}
  function restoreData(data){if(!data||!data.__lampaCleanOriginalIptv)return;var o=data.__lampaCleanOriginalIptv;if(o.had)data.iptv=o.value;else{try{delete data.iptv}catch(e){data.iptv=false}}try{delete data.__lampaCleanOriginalIptv}catch(e){}var i=touched.indexOf(data);if(i>=0)touched.splice(i,1);log('player data restored')}
  function restoreAll(){touched.slice().forEach(restoreData)}
  function installPrerollBypass(){if(!Lampa||!Lampa.Player||!Lampa.Player.listener||!Lampa.Player.listener.follow){log('Lampa.Player.listener not ready');return false}if(window.__LAMPA_CLEAN_PREROLL_HOOK__)return true;window.__LAMPA_CLEAN_PREROLL_HOOK__=true;Lampa.Player.listener.follow('create',preparePlayerData);Lampa.Player.listener.follow('start',restoreData);Lampa.Player.listener.follow('external',restoreData);Lampa.Player.listener.follow('destroy',restoreAll);log('preroll bypass installed');return true}
  function removeAdUi(root){root=root||document;['.ad-preroll','.ad-video-block'].forEach(function(s){try{root.querySelectorAll(s).forEach(function(n){n.style.setProperty('display','none','important')})}catch(e){}})}
  function installObserver(){if(!window.MutationObserver||window.__LAMPA_CLEAN_AD_OBSERVER__)return;var o=new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(!n||n.nodeType!==1)return;removeAdUi(n);try{if(n.matches&&(n.matches('.ad-preroll')||n.matches('.ad-video-block')))n.style.setProperty('display','none','important')}catch(e){}})})});o.observe(document.documentElement,{childList:true,subtree:true});window.__LAMPA_CLEAN_AD_OBSERVER__=o}
  function start(){removeAdUi();installObserver();if(!installPrerollBypass()){var a=0,t=setInterval(function(){a++;if(installPrerollBypass()||a>30)clearInterval(t)},500)}window.LampaClean=window.LampaClean||{};window.LampaClean.version=VERSION;window.LampaClean.restorePlayerData=restoreAll;log('v'+VERSION+' loaded')}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
