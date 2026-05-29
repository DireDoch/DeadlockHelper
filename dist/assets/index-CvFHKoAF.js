var jt=Object.defineProperty;var Bt=(i,e,t)=>e in i?jt(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var m=(i,e,t)=>Bt(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();const Rt={HomeIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path>',Cog6ToothIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>',Bars3Icon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>',XMarkIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18 18 6M6 6l12 12"></path>',BugAntIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 12.75c.733 0 1.5-.195 2.062-.532a7.5 7.5 0 0 0 2.625-3.003 7.5 7.5 0 0 1-4.687 2.625c-.384.023-.768.05-1.125.08v2.25c.375-.043.766-.087 1.125-.12A9.344 9.344 0 0 0 12 12.75Zm0 0v2.25M9 3.003a7.5 7.5 0 0 1 6 0M5.25 21.75a18.45 18.45 0 0 1-1.5-7.5v-4.5c0-1.71.54-3.32 1.5-4.5M18.75 21.75a18.49 18.49 0 0 0 1.5-7.5v-4.5c0-1.71-.54-3.32-1.5-4.5M9 6a9 9 0 0 1 6 0M15 18.75v-4.5M12 15.75v-4.5"></path>',TrophyIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.228a46.45 46.45 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.844 1.16v-1.801a6.772 6.772 0 0 0 1.623-.174 3 3 0 0 0 2.198-2.784M13.5 9.75a2.25 2.25 0 0 0-2.25 2.25v15.75m0 0h6.75v-15.75m-6.75 0v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21.75"></path>',VideoCameraIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"></path>',WrenchScrewdriverIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655-5.653a2.548 2.548 0 0 0-3.586-3.586l-1.757 1.757a11.25 11.25 0 0 1 5.983 5.983l1.757-1.757a2.548 2.548 0 0 0 3.586-3.586l-5.653-4.655Z"></path>',ChartBarIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75Zm9.75-8.25c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.875Zm9.75-3c0-.621.504-1.125 1.125-1.125h2.25C20.496.75 21 1.254 21 1.875v16.5c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V1.875Z"></path>',ChevronDoubleLeftIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"></path>',ChevronDoubleRightIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"></path>',ListBulletIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>',CubeIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/>',PresentationChartBarIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"/>'};function te(i){return Rt[i]||""}function se(i,e){return`<svg class="${e}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    ${i}
  </svg>`}const Ht=(i="w-6 h-6")=>se(te("HomeIcon"),i),Nt=(i="w-6 h-6")=>se(te("Cog6ToothIcon"),i),Ft=(i="w-6 h-6")=>se(te("BugAntIcon"),i),Ot=(i="w-6 h-6")=>se(te("VideoCameraIcon"),i),Ut=(i="w-6 h-6")=>se(te("ListBulletIcon"),i),zt=(i="w-6 h-6")=>se(te("CubeIcon"),i),Vt=(i="w-6 h-6")=>se(te("PresentationChartBarIcon"),i);let ot=100;function Gt(i,e){const t=i>=100,s=t?"text-frosted-mint-500":i>=90?"text-yellow-500":"text-orange-500",a=t?"OK":"Degradé",r=t?"bg-frosted-mint-500":i>=90?"bg-yellow-500":"bg-orange-500";return e?`
    <div class="flex items-center gap-2 flex-wrap">
      <span class="w-2 h-2 rounded-full ${r} shrink-0" aria-hidden="true"></span>
      <span class="text-sm text-grey-300">API</span>
      <span class="text-sm font-medium ${s}">${i}%</span>
      <span class="text-xs text-grey-400">${a}</span>
      <button
        id="api-status-refresh-btn"
        class="text-xs px-2 py-1 rounded bg-charcoal-300 text-grey-300 hover:text-frosted-mint-500 hover:bg-charcoal-400 transition-colors"
        type="button"
      >Vérifier</button>
    </div>
  `:`
      <div class="flex items-center justify-center gap-1" title="API ${i}%">
        <span class="w-2 h-2 rounded-full ${r} shrink-0"></span>
      </div>
    `}function ve(i){var a;ot=i;const e=document.getElementById(Ie.containerId);if(!e)return;const t=((a=document.getElementById("sidebar"))==null?void 0:a.classList.contains("w-64"))??!0;e.innerHTML=Gt(i,t);const s=document.getElementById(Ie.refreshButtonId);s==null||s.addEventListener("click",()=>{var r,n;(n=(r=window.api)==null?void 0:r.triggerHealthCheck)==null||n.call(r)})}const Ie={containerId:"api-status-placeholder",refreshButtonId:"api-status-refresh-btn",mount(){var e,t,s;const i=document.getElementById(this.containerId);i&&(i.innerHTML='<div class="text-sm text-grey-500">…</div>',(t=(e=window.api)==null?void 0:e.getApiAvailability)==null||t.call(e).then(a=>ve(a)).catch(()=>ve(100)),(s=window.api)!=null&&s.onHealthStatusChange&&window.api.onHealthStatusChange(a=>ve(a)))},refresh(){ve(ot)}},lt="user-profile-placeholder";function qt(i,e,t){const s=!!(i!=null&&i.steamId64),a=!e.installed&&e.error;return t?s?`
      <div class="flex items-center gap-3">
        ${i!=null&&i.avatarUrl?`<img src="${i.avatarUrl}" alt="Profil Steam" class="w-10 h-10 rounded-full border-2 border-grey-600 object-cover shrink-0" />`:'<div class="w-10 h-10 rounded-full bg-charcoal-300 border-2 border-grey-600 flex items-center justify-center shrink-0"><span class="text-grey-500 text-sm">?</span></div>'}
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium text-white truncate">${(i==null?void 0:i.personaname)||"Steam"}</p>
          <p class="text-xs text-frosted-mint-500">Prêt à analyser</p>
        </div>
      </div>
    `:`
    <div class="space-y-2">
      ${a?`<p class="text-xs text-orange-500">${e.error}</p>`:""}
      <button
        id="user-profile-connect-btn"
        type="button"
        class="w-full px-3 py-2 rounded-lg bg-charcoal-300 text-frosted-mint-500 text-sm font-medium hover:bg-charcoal-400 hover:text-frosted-mint-400 transition-colors border border-grey-600"
      >
        Se connecter avec Steam
      </button>
    </div>
  `:s&&(i!=null&&i.avatarUrl)?`
        <div class="flex items-center justify-center" title="Prêt à analyser">
          <img src="${i.avatarUrl}" alt="Profil Steam" class="w-8 h-8 rounded-full border-2 border-grey-600 object-cover" />
        </div>
      `:`
      <div class="flex items-center justify-center" title="Se connecter avec Steam">
        <div class="w-8 h-8 rounded-full bg-charcoal-300 border-2 border-grey-600 flex items-center justify-center">
          <span class="text-grey-500 text-xs">?</span>
        </div>
      </div>
    `}async function Ae(){var r,n,l;const i=document.getElementById(lt);if(!i)return;const e=((r=document.getElementById("sidebar"))==null?void 0:r.classList.contains("w-64"))??!0;let t=null,s={installed:!1,path:null};try{(n=window.api)!=null&&n.steamGetProfile&&(t=await window.api.steamGetProfile()),(l=window.api)!=null&&l.steamCheckInstallation&&(s=await window.api.steamCheckInstallation())}catch{}i.innerHTML=qt(t,s,e);const a=document.getElementById("user-profile-connect-btn");a&&a.addEventListener("click",async()=>{var o;if((o=window.api)!=null&&o.steamStartAuth){a.disabled=!0;try{const h=await window.api.steamStartAuth();h.success?await Ae():(!h.cancelled&&h.error&&(h.error.includes("déjà en cours")||console.error("Steam auth error:",h.error)),await Ae())}finally{a.disabled=!1}}})}const Ce={containerId:lt,mount(){const i=document.getElementById(this.containerId);i&&(i.innerHTML='<div class="text-sm text-grey-500">…</div>',Ae())},refresh(){Ae()}};let C=null,oe=[],X=!1,Me=!0,ne=!1,Pe=null,Le=null,_e=null;function Be(i){const e=Math.floor(i/1e3);return`${Math.floor(e/60)}:${(e%60).toString().padStart(2,"0")}`}function Z(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ct(){if(!C)return{progressMs:0,pct:0};const i=C.isPlaying?Date.now()-C.fetchedAt:0,e=Math.min(C.progressMs+i,C.durationMs),t=C.durationMs>0?e/C.durationMs*100:0;return{progressMs:e,pct:t}}const B={music:'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>',play:'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',pause:'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',prev:'<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>',next:'<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z"/></svg>',refresh:'<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>',device:'<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>',speaker:'<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 14.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zm3.5-9H8V5h7v2.5z"/></svg>'};function Wt(){return Me?Kt():X?C?Xt():Zt():Yt()}function Kt(i){return`
    <div class="flex items-center gap-2 animate-pulse">
      <div class="w-10 h-10 rounded bg-charcoal-300 shrink-0"></div>
      <div class="flex-1 space-y-2">
        <div class="h-2.5 bg-charcoal-300 rounded w-3/4"></div>
        <div class="h-2.5 bg-charcoal-300 rounded w-1/2"></div>
      </div>
    </div>`}function Yt(i){return`
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-black" style="background:#1DB954">${B.music}</div>
      <div class="flex-1 min-w-0">
        <p class="text-xs font-semibold text-white">Spotify</p>
        <button id="smp-connect-btn" class="text-xs underline hover:opacity-80 transition-opacity mt-0.5" style="color:#1DB954">Se connecter</button>
      </div>
    </div>`}function Zt(i){return`
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded bg-charcoal-100 flex items-center justify-center shrink-0 text-grey-500">${B.music}</div>
      <div class="flex-1 min-w-0">
        <p class="text-xs text-grey-400 leading-tight">Rien en lecture</p>
        <button id="smp-refresh-btn" class="flex items-center gap-1 text-grey-500 hover:text-white transition-colors text-xs mt-1">
          ${B.refresh}<span>Actualiser</span>
        </button>
      </div>
    </div>`}function Xt(i){const{progressMs:e,pct:t}=ct(),s=C,a=oe.find(l=>l.is_active),r=s.albumArtUrl?`<img src="${Z(s.albumArtUrl)}" alt="" class="rounded object-cover shrink-0" style="width:40px;height:40px">`:`<div class="rounded bg-charcoal-100 flex items-center justify-center shrink-0 text-grey-500" style="width:40px;height:40px">${B.music}</div>`,n=ne?Jt():"";return`
    <div class="space-y-2">
      <!-- Track row -->
      <div class="flex items-center gap-2">
        ${r}
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-white leading-tight truncate" title="${Z(s.title)}">${Z(s.title)}</p>
          <p class="text-xs text-grey-400 truncate leading-tight mt-0.5">${Z(s.artist)}</p>
        </div>
        <button id="smp-refresh-btn" class="text-grey-500 hover:text-white transition-colors p-1 shrink-0" title="Actualiser les appareils">
          ${B.refresh}
        </button>
      </div>

      <!-- Progress bar -->
      <div class="h-0.5 rounded-full bg-charcoal-300 overflow-hidden">
        <div id="smp-progress" class="h-full rounded-full" style="background:#1DB954;width:${t.toFixed(1)}%;transition:width 1s linear"></div>
      </div>

      <!-- Time + active device -->
      <div class="flex items-center justify-between text-grey-500" style="font-size:10px">
        <span id="smp-time">${Be(e)}</span>
        ${a?`<span class="flex items-center gap-1 truncate max-w-[90px] px-1">${a.type==="Smartphone"?B.speaker:B.device}<span class="truncate">${Z(a.name)}</span></span>`:""}
        <span>${Be(s.durationMs)}</span>
      </div>

      <!-- Controls -->
      <div class="flex items-center justify-center gap-5">
        <button id="smp-prev" class="text-grey-400 hover:text-white transition-colors" title="Précédent">${B.prev}</button>
        <button id="smp-play-pause" class="text-white hover:opacity-75 transition-opacity" title="${s.isPlaying?"Pause":"Lecture"}">${s.isPlaying?B.pause:B.play}</button>
        <button id="smp-next" class="text-grey-400 hover:text-white transition-colors" title="Suivant">${B.next}</button>
      </div>

      <!-- Device list (toggled) -->
      ${n}
    </div>`}function Jt(){return oe.length===0?'<p class="text-center text-grey-500 py-1" style="font-size:10px">Aucun appareil trouvé</p>':`
    <div id="smp-device-list" class="rounded border border-grey-600 overflow-hidden" style="background:#0d0d0d">
      ${oe.map(i=>`
        <button data-device-id="${Z(i.id)}"
          class="smp-device-btn w-full text-left flex items-center gap-2 px-3 py-1.5 hover:bg-charcoal-300 transition-colors ${i.is_active?"text-white":"text-grey-400"}"
          style="font-size:11px">
          ${i.is_active?'<span style="color:#1DB954;font-size:8px;line-height:1">●</span>':'<span style="width:8px;display:inline-block"></span>'}
          ${i.type==="Smartphone"?B.speaker:B.device}
          <span class="truncate">${Z(i.name)}</span>
        </button>`).join("")}
    </div>`}function q(){const i=document.getElementById("spotify-widget-placeholder");i&&(i.innerHTML=Wt(),Qt())}function Qt(){var i,e,t,s,a,r;(i=document.getElementById("smp-connect-btn"))==null||i.addEventListener("click",()=>{_e==null||_e("spotify-widget")}),(e=document.getElementById("smp-play-pause"))==null||e.addEventListener("click",async()=>{if(!C)return;const n=C.isPlaying;C.isPlaying=!n,n||(C.fetchedAt=Date.now()),q(),n?await window.spotify.pause().catch(()=>null):await window.spotify.play().catch(()=>null),setTimeout(J,600)}),(t=document.getElementById("smp-prev"))==null||t.addEventListener("click",async()=>{await window.spotify.previous().catch(()=>null),setTimeout(J,600)}),(s=document.getElementById("smp-next"))==null||s.addEventListener("click",async()=>{await window.spotify.next().catch(()=>null),setTimeout(J,600)}),(a=document.getElementById("smp-refresh-btn"))==null||a.addEventListener("click",async()=>{ne?ne=!1:(await Re(),ne=!0),q()}),(r=document.getElementById("smp-device-list"))==null||r.querySelectorAll(".smp-device-btn").forEach(n=>{n.addEventListener("click",async()=>{const l=n.dataset.deviceId;l&&(ne=!1,await window.spotify.transferDevice(l).catch(()=>null),setTimeout(()=>{Re(),J()},1200))})})}function es(){if(!(C!=null&&C.isPlaying))return;const{progressMs:i,pct:e}=ct(),t=document.getElementById("smp-progress");t&&(t.style.width=`${e.toFixed(1)}%`);const s=document.getElementById("smp-time");s&&(s.textContent=Be(i)),C.durationMs>0&&i>=C.durationMs-1500&&J()}async function J(){try{const i=await window.spotify.getCurrentlyPlaying();C=i?{...i,fetchedAt:Date.now()}:null,X||(X=!0),q()}catch{}}async function Re(){try{oe=await window.spotify.getDevices()}catch{}}const ts={containerId:"spotify-widget-placeholder",mount(i){_e=i,Me=!0,ne=!1,C=null,oe=[],q(),window.spotify.getAuthStatus().then(({isAuthenticated:e})=>(X=e,Me=!1,e?Promise.all([J(),Re()]):(q(),Promise.resolve()))).catch(()=>{Me=!1,q()}),Le!==null&&clearInterval(Le),Le=setInterval(es,1e3),Pe!==null&&clearInterval(Pe),Pe=setInterval(async()=>{const{isAuthenticated:e}=await window.spotify.getAuthStatus().catch(()=>({isAuthenticated:!1,displayName:null}));e!==X&&(X=e,e||(C=null,oe=[]),q()),X&&J()},1e4)},refresh(){q()}},dt=[{main:"profil",label:"Profile",icon:Ht},{main:"game-overlay",label:"Live Dashboard",icon:Ot,subPages:[{id:"live-dashboard",label:"Live Dashboard"},{id:"tactical-analysis",label:"Tactical Analysis"}]},{main:"hero-stats",label:"Heroes",icon:Ft},{main:"meta-items",label:"Items & Builds",icon:zt},{main:"leaderboards",label:"Leaderboard",icon:Ut,subPages:[{id:"rankings",label:"Rankings"},{id:"rank-analytics",label:"Rank Analytics"}]},{main:"rank-distribution",label:"Rank Distribution",icon:Vt}],ht={main:"settings",label:"Settings",icon:Nt,subPages:[{id:"configuration",label:"Configuration"},{id:"spotify-widget",label:"Spotify Widget"}]},Ve=[...dt,ht];class ss{constructor(e){m(this,"sidebarEl",null);m(this,"isExpanded",!1);m(this,"currentPage","profil");m(this,"expandedMenus",new Set);m(this,"hoverTimer",null);m(this,"onPageChange");this.onPageChange=e}renderNavItem(e){var o,h;const t=this.currentPage===e.main||((o=e.subPages)==null?void 0:o.some(d=>d.id===this.currentPage))===!0,s=this.expandedMenus.has(e.main),a=!!((h=e.subPages)!=null&&h.length),r=t?"bg-charcoal-300 text-dry-sage-400":"text-grey-700 hover:bg-charcoal-200 hover:text-white",n=`
      <svg class="w-3 h-3 transition-transform duration-200 ${s?"rotate-90":""}"
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
      </svg>`,l=a?`
      <ul class="sub-menu overflow-hidden ${s&&this.isExpanded?"":"hidden"}"
          data-parent="${e.main}">
        ${e.subPages.map(d=>{const c=this.currentPage===d.id;return`
            <li>
              <a href="#" data-page="${d.id}"
                class="nav-sub-link flex items-center gap-2 pl-12 pr-4 py-2 text-xs transition-colors
                  ${c?"text-dry-sage-400 bg-charcoal-200":"text-grey-600 hover:text-white hover:bg-charcoal-200"}">
                <span class="w-1 h-1 rounded-full bg-current shrink-0"></span>
                <span class="whitespace-nowrap">${d.label}</span>
              </a>
            </li>`}).join("")}
      </ul>`:"";return`
      <li class="relative">
        <div class="absolute left-0 top-0 h-full w-0.5 rounded-r transition-colors
                    ${t?"bg-dry-sage-400":"bg-transparent"}"></div>
        <a href="#" data-page="${e.main}" data-has-subpages="${a}"
          class="nav-main-link flex items-center gap-3 pl-5 pr-4 py-2.5 transition-colors ${r}">
          <span class="shrink-0">${e.icon("w-5 h-5")}</span>
          <!--
            nav-label : opacity-0 au repos (sidebar w-16).
            Révélé via transition opacity quand la sidebar s'étend à w-64.
            whitespace-nowrap évite que le texte wrap pendant la transition.
          -->
          <span class="nav-label flex-1 text-sm font-medium whitespace-nowrap
                        transition-opacity duration-200
                        ${this.isExpanded?"opacity-100":"opacity-0 pointer-events-none"}">
            ${e.label}
          </span>
          ${a?`
            <span class="nav-chevron shrink-0 transition-opacity duration-200
                          ${this.isExpanded?"opacity-100":"opacity-0"}">
              ${n}
            </span>`:""}
        </a>
        ${l}
      </li>`}render(){return`
      <aside id="sidebar"
        class="fixed left-0 top-0 h-full z-50
               transition-all duration-300 ease-in-out
               ${this.isExpanded?"w-64":"w-16"}">

        <!--
          SECTION PRINCIPALE — clips à la largeur courante du <aside>.
          overflow-hidden masque les labels et chevrons quand la sidebar
          est en w-16 sans qu'on ait besoin de les retirer du DOM.
        -->
        <div class="flex flex-col h-full bg-charcoal-100 border-r border-grey-200 overflow-hidden">

          <!-- Zone 1 : UserProfile -->
          <div id="user-profile-placeholder"
            class="border-b border-grey-200 min-h-[64px] flex items-center px-3 py-3 shrink-0">
            <div class="text-sm text-grey-500">…</div>
          </div>

          <!-- Zone 2 : Navigation scrollable -->
          <nav class="flex-1 overflow-y-auto overflow-x-hidden py-2">
            <ul class="space-y-0.5">
              ${dt.map(e=>this.renderNavItem(e)).join("")}
            </ul>
          </nav>

          <!-- Zone 3 : API Status -->
          <div id="api-status-placeholder"
            class="px-3 py-2.5 min-h-[40px] flex items-center border-t border-grey-200 shrink-0">
            <div class="text-sm text-grey-500">…</div>
          </div>

          <!-- Zone 4 : Settings (épinglé au-dessus du widget Spotify) -->
          <ul class="py-1 border-t border-grey-200 shrink-0">
            ${this.renderNavItem(ht)}
          </ul>

          <!--
            SPACER — réserve la hauteur du widget Spotify absolu.
            h-44 = 176 px. Ajuster si le widget Spotify change de hauteur
            selon son état (connecté / en lecture / inactif).
          -->
          <div class="h-44 shrink-0"></div>
        </div>

        <!--
          WIDGET SPOTIFY — position absolute, toujours w-64.
          Déborde à droite quand la sidebar est en w-16 (64 px), mais
          le contenu principal a margin-left: 16rem (256 px), donc il
          n'y a aucun chevauchement avec le contenu.
          border-t pour le séparer visuellement des zones au-dessus.
        -->
        <div class="absolute bottom-0 left-0 w-64
                    bg-charcoal-100 border-t border-r border-grey-200
                    px-3 py-3">
          <div id="spotify-widget-placeholder"></div>
        </div>
      </aside>`}mount(e){var t,s;e.innerHTML=this.render(),this.sidebarEl=document.getElementById("sidebar"),(t=this.sidebarEl)==null||t.addEventListener("mouseenter",()=>{this.hoverTimer&&clearTimeout(this.hoverTimer),this.hoverTimer=setTimeout(()=>{this.isExpanded=!0,this.applyExpansion()},150)}),(s=this.sidebarEl)==null||s.addEventListener("mouseleave",()=>{this.hoverTimer&&clearTimeout(this.hoverTimer),this.hoverTimer=setTimeout(()=>{this.isExpanded=!1,this.expandedMenus.clear(),this.applyExpansion(),this.updateSubMenus()},100)}),this.wireLinks(),Ce.mount(),Ie.mount(),ts.mount(a=>this.navigateTo(a))}wireLinks(){this.sidebarEl&&(this.sidebarEl.querySelectorAll(".nav-main-link").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault();const s=e,a=s.dataset.page;s.dataset.hasSubpages==="true"?this.toggleSubMenu(a):this.navigateTo(a)})}),this.sidebarEl.querySelectorAll(".nav-sub-link").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault(),this.navigateTo(e.dataset.page)})}))}toggleSubMenu(e){this.expandedMenus.has(e)?this.expandedMenus.delete(e):(this.expandedMenus.clear(),this.expandedMenus.add(e)),this.updateSubMenus()}navigateTo(e){var s,a;this.currentPage=e,this.onPageChange(e);const t=Ve.find(r=>{var n;return r.main===e||((n=r.subPages)==null?void 0:n.some(l=>l.id===e))});t&&((s=t.subPages)!=null&&s.some(r=>r.id===e)?(this.expandedMenus.clear(),this.expandedMenus.add(t.main)):(a=t.subPages)!=null&&a.length?this.expandedMenus.has(t.main)?this.expandedMenus.delete(t.main):(this.expandedMenus.clear(),this.expandedMenus.add(t.main)):this.expandedMenus.clear()),this.updateActiveStates(),this.updateSubMenus()}applyExpansion(){this.sidebarEl&&(this.isExpanded?(this.sidebarEl.classList.remove("w-16"),this.sidebarEl.classList.add("w-64")):(this.sidebarEl.classList.remove("w-64"),this.sidebarEl.classList.add("w-16")),this.sidebarEl.querySelectorAll(".nav-label").forEach(e=>{this.isExpanded?(e.classList.remove("opacity-0","pointer-events-none"),e.classList.add("opacity-100")):(e.classList.remove("opacity-100"),e.classList.add("opacity-0","pointer-events-none"))}),this.sidebarEl.querySelectorAll(".nav-chevron").forEach(e=>{e.classList.toggle("opacity-0",!this.isExpanded),e.classList.toggle("opacity-100",this.isExpanded)}),Ie.refresh(),Ce.refresh())}updateSubMenus(){this.sidebarEl&&(this.sidebarEl.querySelectorAll(".sub-menu").forEach(e=>{const t=e.dataset.parent;e.classList.toggle("hidden",!(this.isExpanded&&this.expandedMenus.has(t)))}),this.sidebarEl.querySelectorAll(".nav-main-link").forEach(e=>{const t=e.querySelector(".nav-chevron svg");t&&t.classList.toggle("rotate-90",this.expandedMenus.has(e.dataset.page))}))}updateActiveStates(){this.sidebarEl&&(this.sidebarEl.querySelectorAll(".nav-main-link").forEach(e=>{var r,n,l;const t=e.dataset.page,s=this.currentPage===t||((n=(r=Ve.find(o=>o.main===t))==null?void 0:r.subPages)==null?void 0:n.some(o=>o.id===this.currentPage))===!0,a=(l=e.closest("li"))==null?void 0:l.querySelector("div.absolute");a&&(a.classList.toggle("bg-dry-sage-400",s),a.classList.toggle("bg-transparent",!s)),s?(e.classList.remove("text-grey-700","hover:bg-charcoal-200","hover:text-white"),e.classList.add("bg-charcoal-300","text-dry-sage-400")):(e.classList.remove("bg-charcoal-300","text-dry-sage-400"),e.classList.add("text-grey-700","hover:bg-charcoal-200","hover:text-white"))}),this.sidebarEl.querySelectorAll(".nav-sub-link").forEach(e=>{this.currentPage===e.dataset.page?(e.classList.remove("text-grey-600","hover:text-white","hover:bg-charcoal-200"),e.classList.add("text-dry-sage-400","bg-charcoal-200")):(e.classList.remove("text-dry-sage-400","bg-charcoal-200"),e.classList.add("text-grey-600","hover:text-white","hover:bg-charcoal-200"))}))}expand(){this.isExpanded=!0,this.applyExpansion()}collapse(){this.isExpanded=!1,this.expandedMenus.clear(),this.applyExpansion(),this.updateSubMenus()}}const ut="game-status-sticky";function as(i){const e=i.state,t=e==="GAME_IN_MATCH"||!e&&i.inMatch,s=e==="GAME_MENU"||!e&&i.isRunning;return t?{label:"En jeu",classes:"text-frosted-mint-500 border-frosted-mint-500/40 bg-frosted-mint-500/10",dotClasses:"bg-frosted-mint-500 animate-pulse"}:s?{label:"Deadlock lancé",classes:"text-blue-400 border-blue-500/40 bg-blue-500/10",dotClasses:"bg-blue-400"}:{label:"Deadlock non lancé",classes:"text-grey-300 border-grey-600 bg-charcoal-300",dotClasses:"bg-grey-500"}}function is(i){const e=as(i);return`
    <button
      type="button"
      class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold shadow-sm ${e.classes}"
      title="${e.label}"
      aria-label="${e.label}"
    >
      <span class="w-2 h-2 rounded-full ${e.dotClasses}"></span>
      <span>${e.label}</span>
    </button>
  `}async function Ge(){var t;const i=document.getElementById(ut);if(!i)return;let e={isRunning:!1,inMatch:!1,matchId:null,state:"GAME_CLOSED",timestamp:Date.now()};try{(t=window.api)!=null&&t.getGameStatus&&(e=await window.api.getGameStatus())}catch{}i.innerHTML=is(e)}const qe={containerId:ut,mount(){const i=document.getElementById(this.containerId);i&&(i.innerHTML='<div class="text-xs text-grey-400">...</div>',Ge())},refresh(){Ge()}},W=[{tier:1,name:"Initiate",badgeMin:10,badgeMax:19},{tier:2,name:"Seeker",badgeMin:20,badgeMax:29},{tier:3,name:"Alchemist",badgeMin:30,badgeMax:39},{tier:4,name:"Arcanist",badgeMin:40,badgeMax:49},{tier:5,name:"Ritualist",badgeMin:50,badgeMax:59},{tier:6,name:"Emissary",badgeMin:60,badgeMax:69},{tier:7,name:"Archon",badgeMin:70,badgeMax:79},{tier:8,name:"Oracle",badgeMin:80,badgeMax:89},{tier:9,name:"Phantom",badgeMin:90,badgeMax:99},{tier:10,name:"Ascendant",badgeMin:100,badgeMax:109},{tier:11,name:"Eternus",badgeMin:110,badgeMax:116}];function He(i){return i==="weapon"?"#f97316":i==="spirit"?"#a855f7":i==="vitality"?"#22c55e":"#4b5563"}function be(i){const e={1:"I",2:"II",3:"III",4:"IV"},t=i.item_tier;return!t||!e[t]?"":`<span class="absolute top-0 right-0 text-[8px] font-bold px-0.5 leading-tight rounded-bl pointer-events-none"
                style="background:${He(i.item_slot_type)};color:#fff;">${e[t]}</span>`}const pt="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAACXBIWXMAAAsTAAALEwEAmpwYAAADI0lEQVQ4ja1VXUgUURg9c2drN8WMre6tJRM0XUlL+0GNsNJxFwkdUlR6CASRDHqJoHApTIM06CHpzVUfDCGI2oWxB9vczKBC0UiUwL8e6qHWVEpLIp25PaTTTjPVSx/ch3vuPWfO981834Bzjr+t+pMd7X1Ns3y4ReN9TbO8/mRH+784AuccVsEYI1fKOnuyUyWPKK7TcVVdxuBE+FFjoKooEoloVlxiBVJGSZ3cGsxN85oERXEdctO8njq5NUgZteSbQMooaSjrCuWlF8uC8OtY1VZw/3kbAEAQCPLSi+WGsq6QlbABoIwSX7E/mOOWJJHYDBdHpp9haLpP34vEhhy3JPmK/SbHOnPNYY5bkggRDYKLS5/Q2nsV8RucRkdExJE9JbJ9fVeIMuqdicxoulPGGPHJ/mC2u8AkuPRtES3dFzA1O/R7lrpwtrtA8sn+IGOM6E6vlHX25KZ5PdE1XIuB8TCeTNy1FIwuxdEMWbbbHD0AvCIf39lesPdEOfmthgDw5sNr3HxwHovf5wAArvhkeLIqLYUFQYDLmZjceqszQehrmuXxsZtNlz5/mcPF2xWYmhvWMYcYh3TXIX1/9vg1JNJUI+/rHGwbY4zFBwDOOXpH7uHN/CsD/k1dxPC7EIgg4kx+M3ZuTTFxN8Y4QRaW5k0Hbz9OYmCyF/t2SDiQ4IVDjDOcJzmzUJhZDkEQTNyFpXmIiVvdCSmujP3Rb31T7GZ4sir1NTL9Au8XpgEArrhUXK5ow3ZnoklQVZfx8OXdDtJ4p7pmcCL8iHPLNjZFdf4lJG3bbcI5137OhDvVNQQAGgNVRf1jiqJqK38VPJZaiRy3ZHaoraB/TFEaA1VFwOp3GolENMpoqd1m3VEAsGvLQZwruYEYh7G+mqZicPxxuFk5XWroKACYicxoDYFT3qej3YqmqSbR2sJ6xMVsMgk+He1WGgKn9BbVnUYLU0ZL7eu7QtnuAn2oHEzOR2byYVPKg+OPw80PfjlcC8shTRklPtkfPJohy4JA9Dm6Fpxr6B9TlOiUo8Pcm6uOGWOldpvjj5P/ulJrKbj61P//j/oBilOoch4mXcEAAAAASUVORK5CYII=",We="https://api.deadlock-api.com",mt="#c8a04f",gt="#5b86d6",ee={0:"THE AMBER HAND",1:"THE SAPPHIRE FLAME"};function Ee(i){return i===1?"#5b86d6":i===4?"#e0c14a":i===6?"#4cc66e":"#6b7280"}function N(i){return i===0?mt:gt}const Ne=[4,1,6];function Ue(i){return i===1}function rs(i,e){if(!Ue(e))return[...i].sort((s,a)=>s.player_slot-a.player_slot);const t=s=>{const a=Ne.indexOf(s);return a<0?Ne.length:a};return[...i].sort((s,a)=>t(s.assigned_lane)-t(a.assigned_lane)||s.player_slot-a.player_slot)}function ns(i){const e=new Set(i.map(t=>t.assigned_lane));return Ne.filter(t=>e.has(t))}function I(i){const e=Math.round(i);return Math.abs(e)>=1e6?`${(e/1e6).toFixed(1)}M`:Math.abs(e)>=1e4?`${(e/1e3).toFixed(1)}k`:Math.abs(e)>=1e3?`${(e/1e3).toFixed(1)}k`:`${e}`}function Q(i){return Math.round(i).toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")}function os(i){return`${Math.round(i/60)}m`}function O(i){return i.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function ls(i,e){var s,a;const t=i.get(e);return((s=t==null?void 0:t.images)==null?void 0:s.icon_hero_card_webp)??((a=t==null?void 0:t.images)==null?void 0:a.minimap_image_webp)??""}function K(i,e){var s,a;const t=i.get(e);return((s=t==null?void 0:t.images)==null?void 0:s.minimap_image_webp)??((a=t==null?void 0:t.images)==null?void 0:a.icon_hero_card_webp)??""}function Fe(i,e){var t;return((t=i.get(e))==null?void 0:t.name)??`Hero #${e}`}function bt(i){return i.shop_image_webp??i.shop_image??i.image_webp??""}function le(i,e){return i.get(e)??`#${e}`}function cs(i){const e=i.players.find(t=>{var s;return(s=t.stats)==null?void 0:s.length});return e?e.stats.map(t=>t.time_stamp_s):[]}function Oe(i,e){const t=i.stats;if(t!=null&&t.length)return e<0||e>=t.length?t[t.length-1]:t[e]}function ft(i){const e=(i.gold_lane_creep??0)+(i.gold_lane_creep_orbs??0),t=(i.gold_neutral_creep??0)+(i.gold_neutral_creep_orbs??0),s=(i.gold_player??0)+(i.gold_player_orbs??0),a=(i.gold_boss??0)+(i.gold_boss_orb??0),r=i.gold_treasure??0;return{laneCreeps:e,neutrals:t,playerKills:s,bosses:a,treasure:r,total:e+t+s+a+r}}function ds(i){const e=(i.shots_hit??0)+(i.shots_missed??0);return e>0?i.shots_hit/e*100:0}function hs(i,e){const t=new Set,s=[];for(const a of i){if(s.length>=12)break;if(a.sold_time_s!==0&&a.sold_time_s!==null||t.has(a.item_id))continue;const r=e.get(a.item_id);!(r!=null&&r.shop_image_webp)||!r.item_tier||(t.add(a.item_id),s.push(r))}return s}function us(i,e){const t=new Map;for(const s of i){const a=e.get(s.item_id);if(!(a!=null&&a.shop_image_webp)||!a.item_tier)continue;const r=t.get(s.item_id);(!r||s.game_time_s<r.game_time_s)&&t.set(s.item_id,s)}return[...t.values()].sort((s,a)=>s.game_time_s-a.game_time_s).map(s=>({item:e.get(s.item_id),gameTimeS:s.game_time_s,sold:s.sold_time_s!==0&&s.sold_time_s!==null}))}function ps(i){const e=i.description;return e?typeof e=="string"?e:(e.desc??e.active??e.passive??"").replace(/<[^>]+>/g,"").trim():""}function ms(i){var s;const e=i.properties;if(!e||!((s=i.tooltip_sections)!=null&&s.length))return[];const t=[];for(const a of i.tooltip_sections){for(const r of a.section_attributes??[])for(const n of r.important_properties??[]){const l=e[n];if(!l||t.length>=5)continue;const o=l.label??n,h=l.value??"",d=l.prefix??"",c=l.postfix??l.display_units??"";h&&t.push(`${o}: ${d}${h}${c}`)}if(t.length>=5)break}return t}function vt(i){const e=["","I","II","III","IV"][i.item_tier??0]??"",t=e?`${i.name} — Tier ${e}`:i.name,s=ms(i),a=s.length?s.join(`
`):ps(i).slice(0,200);return(a?`${t}
${a}`:t).replace(/"/g,"&quot;")}function E(i,e,t,s=I){const a=e+t,r=a>0?e/a*100:50,n=e>t,l=t>e;return`
    <div class="py-1.5">
      <div class="flex items-center justify-between text-sm mb-1">
        <span class="${n?"text-white font-bold":"text-grey-400"} tabular-nums">${s(e)}</span>
        <span class="text-grey-500 text-[11px] uppercase tracking-wider">${i}</span>
        <span class="${l?"text-white font-bold":"text-grey-400"} tabular-nums">${s(t)}</span>
      </div>
      <div class="flex h-1.5 rounded-full overflow-hidden bg-charcoal-300">
        <div style="width:${r}%;background:${mt};${n?"":"opacity:.55;"}"></div>
        <div style="width:${100-r}%;background:${gt};${l?"":"opacity:.55;"}"></div>
      </div>
    </div>`}function xt(i){const e=i.valueFmt??I,t=i.maxValue>0?i.value/i.maxValue*100:0,s=i.action?`data-action="${i.action}" data-slot="${i.slot??""}" role="button"`:"";return`
    <div class="flex items-center gap-2 py-0.5 ${i.action?"cursor-pointer":""} ${i.selected?"ring-1 ring-dry-sage-400 rounded":""}" ${s}>
      ${i.iconUrl?`<img src="${i.iconUrl}" class="w-5 h-5 rounded object-cover flex-shrink-0 pointer-events-none" alt="">`:'<div class="w-5 h-5 rounded bg-grey-700 flex-shrink-0"></div>'}
      <div class="relative flex-1 h-5 rounded bg-charcoal-300 overflow-hidden pointer-events-none">
        <div class="absolute inset-y-0 left-0 rounded" style="width:${t}%;background:${i.color};opacity:.85;"></div>
        <span class="absolute inset-0 flex items-center px-2 text-[11px] text-white truncate">${O(i.name)}</span>
      </div>
      <span class="w-14 text-right text-grey-200 text-xs tabular-nums pointer-events-none">${e(i.value)}</span>
      ${i.pct!==void 0?`<span class="w-12 text-right text-grey-500 text-[10px] tabular-nums pointer-events-none">${i.pct.toFixed(1)}%</span>`:""}
    </div>`}function yt(i){const n=2*Math.PI*42,l=i.segments.reduce((c,u)=>c+u.value,0)||1;let o=0;const h=i.segments.filter(c=>c.value>0).map(c=>{const u=c.value/l,g=Math.max(u*n-1.5,.5),v=-o*n;return o+=u,`<circle cx="60" cy="60" r="42" fill="none" stroke="${c.color}" stroke-width="16"
              stroke-dasharray="${g.toFixed(2)} ${n.toFixed(2)}" stroke-dashoffset="${v.toFixed(2)}"/>`}).join(""),d=i.segments.map((c,u)=>{const g=c.value/l*100;return`<div class="flex items-center gap-2.5 md-rise" style="animation-delay:${u*55}ms">
        <span class="w-3.5 h-3.5 rounded-sm flex-shrink-0" style="background:${c.color};box-shadow:0 0 8px ${c.color}66;"></span>
        <span class="text-grey-300 text-base flex-1 leading-tight">${O(c.label)}</span>
        <span class="text-white text-base font-bold tabular-nums leading-tight">${Q(c.value)}</span>
        <span class="text-grey-500 text-sm tabular-nums w-14 text-right leading-tight">${g.toFixed(1)}%</span>
      </div>`}).join("");return`
    <div class="flex items-center gap-6 flex-wrap">
      <div class="relative w-[124px] h-[124px] flex-shrink-0 md-pop-in">
        <svg viewBox="0 0 120 120" class="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="42" fill="none" stroke="#26262b" stroke-width="16"/>
          ${h}
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span class="text-white text-2xl font-bold leading-none tabular-nums">${i.centerValue}</span>
          <span class="text-grey-500 text-[10px] uppercase tracking-widest mt-1">${O(i.centerLabel)}</span>
        </div>
      </div>
      <div class="flex-1 min-w-[200px] space-y-2">${d}</div>
    </div>`}const Se=new Map,De=new Set;function wt(i){return Se.get(i)}async function gs(i){if(!(Se.has(i)||De.has(i))){De.add(i);try{const[e,t]=await Promise.all([fetch(`${We}/v1/assets/items/by-hero-id/${i}`).then(r=>r.ok?r.json():[]).catch(()=>[]),fetch(`${We}/v1/analytics/ability-order-stats?hero_id=${i}&min_matches=200`).then(r=>r.ok?r.json():[]).catch(()=>[])]),s=(Array.isArray(e)?e:[]).filter(r=>r.name!=="Melee"&&!r.name.includes("_")).slice(0,4),a=(Array.isArray(t)?t:[]).sort((r,n)=>n.matches-r.matches)[0]??null;Se.set(i,{abilities:s,topSeq:a})}catch{Se.set(i,{abilities:[],topSeq:null})}finally{De.delete(i)}}}function bs(i){return i.image_webp??i.image??""}function fs(i,e){const t=i.winning_team===e;return`${ee[e]} <span class="${t?"text-emerald-400":"text-red-400"}">(${t?"WINNER":"LOSER"})</span>`}function z(i,e){return rs(i.meta.players.filter(t=>t.team===e),i.gameMode)}function F(i){return Oe(i,-1)}function fe(i,e,t=""){const s=e.account_id===i.ownerAccountId;return`<button data-action="navigate-player" data-account-id="${e.account_id}"
            class="text-left truncate transition-colors hover:text-dry-sage-400 ${s?"text-white font-semibold":"text-grey-300"} ${t}"
            title="${O(le(i.playerNameMap,e.account_id))}">
            ${O(le(i.playerNameMap,e.account_id))}</button>`}function vs(i){return`<div class="space-y-4">
    ${[0,1].map(e=>xs(i,e)).join("")}
  </div>`}function xs(i,e){const t=z(i,e),s=t.reduce((l,o)=>l+o.kills,0),a=t.reduce((l,o)=>l+o.deaths,0),r=t.reduce((l,o)=>l+o.assists,0),n=s||1;return`
    <div class="rounded-lg border border-grey-700/50 overflow-hidden" style="border-top:2px solid ${N(e)};">
      <div class="flex items-center justify-between px-3 py-2 bg-charcoal-300/40">
        <span class="text-sm font-bold tracking-wide" style="color:${N(e)};">${fs(i.meta,e)}</span>
        <span class="text-white text-sm font-bold tabular-nums">${s}/${a}/${r}</span>
      </div>
      <div class="divide-y divide-grey-700/30">
        ${t.map(l=>ys(i,l,n)).join("")}
      </div>
    </div>`}function ys(i,e,t){var d;const s=ls(i.heroMap,e.hero_id),a=hs(e.items,i.itemMap),r=e.deaths>0?(e.kills+e.assists)/e.deaths:e.kills+e.assists,n=(e.kills+e.assists)/t*100,l=((d=F(e))==null?void 0:d.player_damage)??0,o='<div class="w-7 h-7 rounded border border-grey-700/30 bg-charcoal-100/20"></div>',h=Array(12).fill(null).map((c,u)=>{const g=a[u];return g?`<div class="relative w-7 h-7 rounded overflow-hidden border border-grey-700/60" title="${vt(g)}">
        <img src="${bt(g)}" alt="${O(g.name)}" class="w-full h-full object-cover">
        ${be(g)}
      </div>`:o}).join("");return`
    <div class="flex items-center gap-3 px-3 py-2 hover:bg-charcoal-300/20">
      <div class="flex items-center gap-2 w-40 min-w-0 flex-shrink-0">
        ${s?`<img src="${s}" class="w-9 h-9 rounded object-cover border border-grey-700 flex-shrink-0" alt="${Fe(i.heroMap,e.hero_id)}">`:'<div class="w-9 h-9 rounded bg-grey-700 flex-shrink-0"></div>'}
        <div class="min-w-0">${fe(i,e,"text-sm block w-full")}
          <span class="text-grey-600 text-[10px]">${Fe(i.heroMap,e.hero_id)}</span>
        </div>
      </div>
      <div class="grid grid-cols-6 gap-0.5 flex-shrink-0">${h}</div>
      <div class="flex-1 flex items-center justify-end gap-5 text-right">
        <div class="w-20">
          <p class="text-sm tabular-nums leading-none"><span class="text-emerald-400">${e.kills}</span>/<span class="text-red-400">${e.deaths}</span>/<span class="text-amber-400">${e.assists}</span></p>
          <p class="text-grey-500 text-[10px] mt-0.5">${r.toFixed(2)} KDA</p>
        </div>
        <div class="w-16">
          <p class="text-grey-200 text-sm tabular-nums leading-none">${e.last_hits} CS</p>
          <p class="text-grey-500 text-[10px] mt-0.5">${n.toFixed(1)}% KP</p>
        </div>
        <div class="w-16">
          <p class="text-grey-200 text-sm tabular-nums leading-none">${I(l)}</p>
          <p class="text-grey-500 text-[10px] mt-0.5">DMG</p>
        </div>
      </div>
    </div>`}function ws(i){const{state:e}=i,t=cs(i.meta),s=e.laneSnapshotIdx<0||e.laneSnapshotIdx>=t.length?t.length-1:e.laneSnapshotIdx,a=Ue(i.gameMode),r=a?ns(i.meta.players):[],n=z(i,0),l=z(i,1),o=(p,f)=>{const b=(f==="left"?e.laneLeft:e.laneRight).has(p.player_slot),x=a?Ee(p.assigned_lane):"#4b5563";return`<button data-action="lane-toggle" data-side="${f}" data-slot="${p.player_slot}"
        class="relative w-9 h-9 rounded overflow-hidden transition-all ${b?"ring-2 scale-105":"opacity-50 hover:opacity-90"}"
        style="${b?`box-shadow:0 0 0 2px ${x};`:""}border:2px solid ${x};"
        title="${O(le(i.playerNameMap,p.account_id))}">
        <img src="${K(i.heroMap,p.hero_id)}" class="w-full h-full object-cover pointer-events-none" alt="">
      </button>`},h=(p,f)=>p.filter(b=>f.has(b.player_slot)).map(b=>`<div class="flex items-center gap-1.5">
          <img src="${K(i.heroMap,b.hero_id)}" class="w-4 h-4 rounded-full object-cover" alt="">
          ${fe(i,b,"text-xs")}</div>`).join("")||'<span class="text-grey-600 text-xs">—</span>',d=n.filter(p=>e.laneLeft.has(p.player_slot)),c=l.filter(p=>e.laneRight.has(p.player_slot)),u=(p,f)=>p.reduce((b,x)=>b+(Oe(x,s)?f(Oe(x,s)):0),0),g=(p,f)=>p.length?u(p,f)/p.length:0,v=p=>{const f=u(p,x=>x.shots_hit),b=f+u(p,x=>x.shots_missed);return b>0?f/b*100:0};return`
    <div class="space-y-3">
      ${r.length?`<!-- lane color filter (Normal only) -->
      <div class="flex items-center justify-center gap-3">
        ${r.map(p=>`<button data-action="lane-preset" data-lane="${p}"
            class="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
            style="background:${Ee(p)}40;border-color:${Ee(p)};" title="Lane"></button>`).join("")}
      </div>`:""}

      <!-- hero bar -->
      <div class="flex items-center justify-between gap-2">
        <div class="flex-1">
          <p class="text-[10px] font-bold mb-1" style="color:${N(0)};">${ee[0]}</p>
          <div class="flex flex-wrap gap-1">${n.map(p=>o(p,"left")).join("")}</div>
        </div>
        <span class="text-grey-500 text-xs font-bold px-2">VS</span>
        <div class="flex-1">
          <p class="text-[10px] font-bold mb-1 text-right" style="color:${N(1)};">${ee[1]}</p>
          <div class="flex flex-wrap gap-1 justify-end">${l.map(p=>o(p,"right")).join("")}</div>
        </div>
      </div>

      <!-- time selector -->
      <div class="flex flex-wrap items-center justify-center gap-1">
        ${t.map((p,f)=>`<button data-action="lane-snap" data-idx="${f}"
            class="px-2 py-1 rounded text-xs transition-colors ${f===s?"bg-dry-sage-500 text-charcoal-100 font-semibold":"text-grey-400 hover:bg-charcoal-300"}">
            ${os(p)}</button>`).join("")}
      </div>

      <!-- selected names -->
      <div class="flex justify-between gap-4 border-t border-grey-700/40 pt-2">
        <div class="flex-1 space-y-0.5">${h(n,e.laneLeft)}</div>
        <div class="flex-1 space-y-0.5 flex flex-col items-end">${h(l,e.laneRight)}</div>
      </div>

      <!-- comparison bars -->
      <div class="space-y-0.5">
        ${E("Kills",u(d,p=>p.kills),u(c,p=>p.kills),I)}
        ${E("Souls",u(d,p=>p.net_worth),u(c,p=>p.net_worth),Q)}
        ${E("Last Hits",u(d,p=>p.creep_kills),u(c,p=>p.creep_kills),I)}
        ${E("Denies",u(d,p=>p.denies),u(c,p=>p.denies),I)}
        ${E("Damage",u(d,p=>p.player_damage),u(c,p=>p.player_damage),Q)}
        ${E("Obj Damage",u(d,p=>p.boss_damage),u(c,p=>p.boss_damage),Q)}
        ${E("Shots Hit %",v(d),v(c),p=>`${p.toFixed(0)}%`)}
        ${E("Level",g(d,p=>p.level),g(c,p=>p.level),p=>p.toFixed(0))}
      </div>
    </div>`}function $s(i){const{state:e}=i,t=z(i,0),s=z(i,1),a=(l,o,h)=>l.map(d=>`<button data-action="items-pick" data-side="${o}" data-slot="${d.player_slot}"
        class="relative w-9 h-9 rounded overflow-hidden transition-all ${d.player_slot===h?"ring-2 ring-dry-sage-400 scale-105":"opacity-50 hover:opacity-90"}"
        title="${O(le(i.playerNameMap,d.account_id))}">
        <img src="${K(i.heroMap,d.hero_id)}" class="w-full h-full object-cover" alt=""></button>`).join(""),r=t.find(l=>l.player_slot===e.itemsLeftSlot)??t[0],n=s.find(l=>l.player_slot===e.itemsRightSlot)??s[0];return`
    <div class="space-y-4">
      <div class="flex items-center justify-between gap-2">
        <div class="flex flex-wrap gap-1 flex-1">${a(t,"left",e.itemsLeftSlot)}</div>
        <span class="text-grey-500 text-xs font-bold px-2">VS</span>
        <div class="flex flex-wrap gap-1 flex-1 justify-end">${a(s,"right",e.itemsRightSlot)}</div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        ${Ye(i,r,0)}
        ${Ye(i,n,1)}
      </div>
    </div>`}const Ke=["#6eb3a8","#c9a46e","#a86e9e","#8cb86e"];function ks(i){const e=wt(i.hero_id);if(!e)return`<div class="mt-3 pt-2 border-t border-grey-700/30">
      <p class="text-grey-600 text-[10px] uppercase tracking-wider mb-1">Ability Build</p>
      <p class="text-grey-600 text-xs flex items-center gap-2">
        <span class="w-3 h-3 border-2 border-grey-600 border-t-dry-sage-400 rounded-full animate-spin"></span>
        Chargement de l'ordre de compétences…</p></div>`;if(!e.topSeq||!e.abilities.length)return`<div class="mt-3 pt-2 border-t border-grey-700/30">
      <p class="text-grey-600 text-[10px] uppercase tracking-wider mb-1">Ability Build</p>
      <p class="text-grey-600 text-xs">Ordre de compétences indisponible pour ce héros.</p></div>`;const t=e.topSeq,s=new Map(e.abilities.map((o,h)=>[o.id,h])),a=t.abilities.length,r=Array.from({length:e.abilities.length},()=>Array(a).fill(!1));t.abilities.forEach((o,h)=>{const d=s.get(o);d!==void 0&&(r[d][h]=!0)});const n=t.matches>0?(t.wins/t.matches*100).toFixed(0):"—",l=13;return`
    <div class="mt-3 pt-2 border-t border-grey-700/30">
      <div class="flex items-center justify-between mb-1">
        <p class="text-grey-600 text-[10px] uppercase tracking-wider">Ability Build · + populaire</p>
        <span class="text-grey-500 text-[10px] tabular-nums">${n}% WR · ${Q(t.matches)} matchs</span>
      </div>
      <div class="space-y-0.5 overflow-x-auto">
        ${e.abilities.map((o,h)=>{const d=Ke[h]??Ke[0],c=bs(o);return`<div class="flex items-center gap-1">
            <div class="w-6 h-6 rounded overflow-hidden border border-grey-700/60 flex-shrink-0" title="${O(o.name)}">
              ${c?`<img src="${c}" class="w-full h-full object-cover" alt="">`:`<div class="w-full h-full flex items-center justify-center text-grey-600 text-[9px]">${h+1}</div>`}
            </div>
            <div class="flex gap-0.5">
              ${r[h].map(u=>`<div class="rounded-sm flex-shrink-0 flex items-center justify-center" style="width:${l}px;height:${l}px;background:${u?d+"33":"rgba(255,255,255,0.04)"};">
                ${u?`<img src="${pt}" alt="" class="w-2.5 h-2.5 object-contain"/>`:""}</div>`).join("")}
            </div>
          </div>`}).join("")}
      </div>
      <p class="text-grey-700 text-[9px] mt-1 italic">Ordre communautaire (patch actuel) — pas celui de ce match.</p>
    </div>`}function Ye(i,e,t){if(!e)return"<div></div>";const s=us(e.items,i.itemMap),a=new Map;for(const o of s){const h=Math.floor(o.gameTimeS/60);(a.get(h)??a.set(h,[]).get(h)).push(o)}const r=[...a.keys()].sort((o,h)=>o-h),n=o=>`<div class="flex flex-col items-center gap-1">
        <div class="flex gap-0.5 bg-charcoal-300/40 rounded p-1 border border-grey-700/40">
          ${a.get(o).map(d=>`<div class="relative w-8 h-8 rounded overflow-hidden border border-grey-700/60 ${d.sold?"opacity-40":""}" title="${vt(d.item)}">
              <img src="${bt(d.item)}" class="w-full h-full object-cover" alt="${O(d.item.name)}">
              ${be(d.item)}</div>`).join("")}
        </div>
        <span class="text-grey-500 text-[10px]">${o}m</span>
      </div>`,l=r.map((o,h)=>`${h>0?'<span class="text-grey-600 self-start mt-2.5">→</span>':""}${n(o)}`).join("");return`
    <div class="rounded-lg border border-grey-700/40 p-2" style="border-top:2px solid ${N(t)};">
      <div class="flex items-center gap-2 mb-2">
        <img src="${K(i.heroMap,e.hero_id)}" class="w-5 h-5 rounded-full object-cover" alt="">
        ${fe(i,e,"text-sm")}
      </div>
      <p class="text-grey-600 text-[10px] uppercase tracking-wider mb-1">Item Timeline</p>
      <div class="flex flex-wrap items-start gap-1">${l||'<span class="text-grey-600 text-xs">Aucun objet</span>'}</div>
      ${ks(e)}
    </div>`}const Ms=[{id:"networth",label:"Net Worth"},{id:"income",label:"Income"},{id:"deathloss",label:"Death Loss"}];function _s(i,e){if(i==="networth")return e.net_worth;const t=F(e);return t?i==="deathloss"?t.gold_death_loss:ft(t).total:0}function Ss(i){const{state:e}=i,t=z(i,0),s=z(i,1),a=c=>c.reduce((u,g)=>u+g.net_worth,0),r=c=>c.reduce((u,g)=>u+g.last_hits,0),n=(c,u)=>c.reduce((g,v)=>g+(F(v)?u(F(v)):0),0),l=[...i.meta.players].map(c=>({p:c,v:_s(e.economySubtab,c)})).sort((c,u)=>u.v-c.v),o=Math.max(...l.map(c=>c.v),1),h=Ms.map(c=>`<button data-action="eco-subtab" data-value="${c.id}"
      class="px-3 py-1.5 rounded text-xs transition-colors ${c.id===e.economySubtab?"bg-dry-sage-500 text-charcoal-100 font-semibold":"text-grey-400 hover:bg-charcoal-300"}">${c.label}</button>`).join(""),d=l.map(({p:c,v:u})=>xt({iconUrl:K(i.heroMap,c.hero_id),name:le(i.playerNameMap,c.account_id),value:u,maxValue:o,color:N(c.team),selected:c.player_slot===e.economySlot,slot:c.player_slot,action:"eco-pick"})).join("");return`
    <div class="space-y-4">
      <div class="rounded-lg border border-grey-700/50 p-4">
        <div class="flex justify-between mb-3">
          <span class="text-sm font-bold" style="color:${N(0)};">${ee[0]}</span>
          <span class="text-sm font-bold" style="color:${N(1)};">${ee[1]}</span>
        </div>
        ${E("Net Worth",a(t),a(s),I)}
        ${E("Total CS",r(t),r(s),I)}
        ${E("Denies",n(t,c=>c.gold_denied),n(s,c=>c.gold_denied),I)}
        ${E("Death Loss",n(t,c=>c.gold_death_loss),n(s,c=>c.gold_death_loss),I)}
      </div>

      <div class="rounded-lg border border-grey-700/50 p-4">
        <div class="flex flex-wrap gap-1 mb-3">${h}</div>
        <div class="space-y-0.5">${d}</div>
      </div>

      ${Is(i)}
    </div>`}function Is(i){const e=i.meta.players.find(r=>r.player_slot===i.state.economySlot)??i.meta.players.find(r=>r.account_id===i.ownerAccountId)??i.meta.players[0],t=e?F(e):void 0;if(!e||!t)return"";const s=ft(t),a=[{label:"Lane Creeps",value:s.laneCreeps,color:"#f59e0b"},{label:"Neutrals",value:s.neutrals,color:"#22c55e"},{label:"Player Kills",value:s.playerKills,color:"#ef4444"},{label:"Bosses",value:s.bosses,color:"#a855f7"},{label:"Treasure",value:s.treasure,color:"#38bdf8"}];return`
    <div class="rounded-lg border border-grey-700/50 p-4">
      <div class="flex items-center gap-2 mb-4">
        <img src="${K(i.heroMap,e.hero_id)}" class="w-6 h-6 rounded object-cover" alt="">
        ${fe(i,e,"text-base")}
        <span class="text-grey-500 text-sm">· Income Breakdown</span>
      </div>
      ${yt({segments:a,centerValue:I(s.total),centerLabel:"Souls"})}
    </div>`}const As=[{id:"hero",label:"Hero Damage"},{id:"total",label:"Total Damage"},{id:"healing",label:"Hero Healing"},{id:"obj",label:"Obj Damage"}];function Cs(i,e){if(!e)return 0;switch(i){case"hero":return e.player_damage;case"total":return e.player_damage+e.creep_damage+e.neutral_damage+e.boss_damage;case"healing":return e.player_healing;case"obj":return e.boss_damage}}function Ps(i){const{state:e}=i,t=z(i,0),s=z(i,1),a=(u,g)=>u.reduce((v,p)=>v+(F(p)?g(F(p)):0),0),r=`
    ${E("Hero Damage",a(t,u=>u.player_damage),a(s,u=>u.player_damage),I)}
    ${E("Hero Healing",a(t,u=>u.player_healing),a(s,u=>u.player_healing),I)}
    ${E("Obj Damage",a(t,u=>u.boss_damage),a(s,u=>u.boss_damage),I)}
    ${E("Damage Taken",a(t,u=>u.player_damage_taken),a(s,u=>u.player_damage_taken),I)}
    ${E("Mitigated",a(t,u=>u.damage_mitigated),a(s,u=>u.damage_mitigated),I)}`,l=[...i.meta.players].map(u=>({p:u,v:Cs(e.damageSubtab,F(u))})),o=l.reduce((u,g)=>u+g.v,0)||1,h=Math.max(...l.map(u=>u.v),1);l.sort((u,g)=>g.v-u.v);const d=l.map(({p:u,v:g})=>xt({iconUrl:K(i.heroMap,u.hero_id),name:le(i.playerNameMap,u.account_id),value:g,maxValue:h,pct:g/o*100,color:N(u.team),selected:u.player_slot===e.damageSlot,slot:u.player_slot,action:"dmg-pick"})).join(""),c=As.map(u=>`<button data-action="dmg-subtab" data-value="${u.id}"
      class="px-3 py-1.5 rounded text-xs transition-colors ${u.id===e.damageSubtab?"bg-dry-sage-500 text-charcoal-100 font-semibold":"text-grey-400 hover:bg-charcoal-300"}">
      ${u.label}</button>`).join("");return`
    <div class="space-y-4">
      <div class="rounded-lg border border-grey-700/50 p-4">
        <div class="flex justify-between mb-2">
          <span class="text-sm font-bold" style="color:${N(0)};">${ee[0]}</span>
          <span class="text-sm font-bold" style="color:${N(1)};">${ee[1]}</span>
        </div>
        ${r}
      </div>

      <div class="rounded-lg border border-grey-700/50 p-4">
        <div class="flex flex-wrap gap-1 mb-3">${c}</div>
        <div class="space-y-0.5">${d}</div>
      </div>

      ${Ls(i)}
    </div>`}function Ls(i){const e=i.meta.players.find(c=>c.player_slot===i.state.damageSlot)??i.meta.players.find(c=>c.account_id===i.ownerAccountId)??i.meta.players[0];if(!e)return"";const t=F(e);if(!t)return"";const s=t.player_damage+t.creep_damage+t.neutral_damage+t.boss_damage,a=Math.max(i.meta.duration_s/60,1),r=i.meta.players.filter(c=>c.team===e.team).reduce((c,u)=>{var g;return c+(((g=F(u))==null?void 0:g.player_damage)??0)},0)||1,n=t.shots_hit+t.shots_missed,l=Math.max(e.deaths,1),o=(c,u)=>`
    <div class="rounded-lg border border-grey-700/40 p-3 bg-charcoal-300/20">
      <p class="text-grey-400 text-sm font-semibold mb-2">${c}</p>
      ${u.map(([g,v])=>`<div class="flex justify-between text-sm py-1"><span class="text-grey-500">${g}</span><span class="text-grey-100 tabular-nums font-medium">${v}</span></div>`).join("")}
    </div>`,h=(c,u)=>`
    <div class="flex-1 rounded-lg bg-charcoal-300/40 border border-grey-700/40 px-3 py-2 text-center">
      <p class="text-white text-lg font-bold tabular-nums leading-none">${u}</p>
      <p class="text-grey-500 text-[10px] uppercase tracking-wider mt-1">${c}</p>
    </div>`,d=[{label:"Heroes",value:t.player_damage,color:"#ef4444"},{label:"Creeps",value:t.creep_damage,color:"#f59e0b"},{label:"Neutrals",value:t.neutral_damage,color:"#22c55e"},{label:"Objectives",value:t.boss_damage,color:"#a855f7"}];return`
    <div class="rounded-lg border border-grey-700/50 p-4">
      <div class="flex items-center gap-2 mb-4">
        <img src="${K(i.heroMap,e.hero_id)}" class="w-7 h-7 rounded object-cover" alt="">
        ${fe(i,e,"text-base")}
        <span class="text-grey-500 text-sm">· ${Fe(i.heroMap,e.hero_id)}</span>
      </div>

      <div class="rounded-lg border border-grey-700/40 p-4 bg-charcoal-300/20 mb-3">
        <p class="text-grey-400 text-sm font-semibold mb-3">Damage Breakdown</p>
        ${yt({segments:d,centerValue:I(s),centerLabel:"Damage"})}
        <div class="flex gap-2 mt-4">
          ${h("DMG / min",I(s/a))}
          ${h("Team Share",`${(t.player_damage/r*100).toFixed(1)}%`)}
          ${h("DMG / Death",I(t.player_damage/l))}
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3">
        ${o("Accuracy",[["Shots",Q(n)],["Hits",Q(t.shots_hit)],["Hit Rate",`${ds(t).toFixed(1)}%`]])}
        ${o("Survivability",[["Deaths",`${e.deaths}`],["DMG Taken",I(t.player_damage_taken)],["Mitigated",I(t.damage_mitigated)]])}
        ${o("Power",[["Weapon",`${Math.round(t.weapon_power)}`],["Spirit",`${Math.round(t.tech_power)}`],["Max HP",I(t.max_health)]])}
      </div>
    </div>`}const Es=[{id:"overview",label:"Overview"},{id:"lane",label:"Lane Stats"},{id:"items",label:"Items"},{id:"economy",label:"Economy"},{id:"damage",label:"Damage"}];class Ds{constructor(){m(this,"states",new Map);m(this,"container",null);m(this,"getBase",null)}reset(){this.states.clear()}renderInner(e){const t=this.ensureState(e),s={...e,state:t};return`
      <div class="flex gap-1 border-b border-grey-700/50 mb-3 -mt-1 flex-wrap">
        ${Es.map(a=>`<button data-action="detail-tab" data-value="${a.id}"
            class="px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors ${t.tab===a.id?"text-dry-sage-400 border-dry-sage-400":"text-grey-400 border-transparent hover:text-grey-200"}">${a.label}</button>`).join("")}
      </div>
      ${this.renderTab(s)}`}renderTab(e){switch(e.state.tab){case"overview":return vs(e);case"lane":return ws(e);case"items":return $s(e);case"economy":return Ss(e);case"damage":return Ps(e)}}attach(e,t){this.container=e,this.getBase=t,e.querySelectorAll("[data-detail-root]").forEach(s=>{s._mdBound||(s._mdBound=!0,s.addEventListener("click",r=>this.onClick(r,s,t)));const a=t(Number(s.dataset.matchId));a&&this.ensureState(a).tab==="items"&&this.ensureItemsAbilities(a)})}rerender(e){var a,r;const t=(a=this.getBase)==null?void 0:a.call(this,e),s=(r=this.container)==null?void 0:r.querySelector(`[data-detail-root][data-match-id="${e}"] [data-detail-content]`);t&&s&&(s.innerHTML=this.renderInner(t))}ensureItemsAbilities(e){const t=this.ensureState(e),s=r=>{var n;return(n=e.meta.players.find(l=>l.player_slot===r))==null?void 0:n.hero_id},a=[s(t.itemsLeftSlot),s(t.itemsRightSlot)].filter(r=>typeof r=="number");for(const r of new Set(a))wt(r)||gs(r).then(()=>{this.ensureState(e).tab==="items"&&this.rerender(e.matchId)})}onClick(e,t,s){const a=e.target.closest("[data-action]");if(!a||!t.contains(a))return;const r=a.dataset.action;if(r==="navigate-player"){const d=Number(a.dataset.accountId);d&&document.dispatchEvent(new CustomEvent("navigate-player",{detail:{accountId:d}}));return}const n=Number(t.dataset.matchId),l=s(n);if(!l)return;const o=this.ensureState(l);switch(r){case"detail-tab":o.tab=a.dataset.value;break;case"lane-snap":o.laneSnapshotIdx=Number(a.dataset.idx);break;case"lane-preset":this.applyLanePreset(l.meta,o,Number(a.dataset.lane));break;case"lane-toggle":{const d=a.dataset.side==="left"?o.laneLeft:o.laneRight,c=Number(a.dataset.slot);d.has(c)?d.delete(c):d.add(c);break}case"items-pick":a.dataset.side==="left"?o.itemsLeftSlot=Number(a.dataset.slot):o.itemsRightSlot=Number(a.dataset.slot);break;case"dmg-subtab":o.damageSubtab=a.dataset.value;break;case"dmg-pick":o.damageSlot=Number(a.dataset.slot);break;case"eco-subtab":o.economySubtab=a.dataset.value;break;case"eco-pick":o.economySlot=Number(a.dataset.slot);break;default:return}const h=t.querySelector("[data-detail-content]");h&&(h.innerHTML=this.renderInner(l)),o.tab==="items"&&this.ensureItemsAbilities(l)}ensureState(e){var o,h,d,c;const t=this.states.get(e.matchId);if(t!=null&&t.initialized)return t;const s=e.meta,a=s.players.find(u=>u.account_id===e.ownerAccountId),r=s.players.filter(u=>u.team===0),n=s.players.filter(u=>u.team===1),l={tab:"overview",laneSnapshotIdx:-1,laneLeft:new Set,laneRight:new Set,itemsLeftSlot:((o=(a==null?void 0:a.team)===0?a:r[0])==null?void 0:o.player_slot)??0,itemsRightSlot:((h=(a==null?void 0:a.team)===1?a:n[0])==null?void 0:h.player_slot)??0,damageSubtab:"hero",damageSlot:((d=a??s.players[0])==null?void 0:d.player_slot)??0,economySubtab:"networth",economySlot:((c=a??s.players[0])==null?void 0:c.player_slot)??0,initialized:!0};return Ue(e.gameMode)&&a&&a.assigned_lane!=null&&this.applyLanePreset(s,l,a.assigned_lane),!l.laneLeft.size&&!l.laneRight.size&&(r.forEach(u=>l.laneLeft.add(u.player_slot)),n.forEach(u=>l.laneRight.add(u.player_slot))),this.states.set(e.matchId,l),l}applyLanePreset(e,t,s){t.laneLeft=new Set(e.players.filter(a=>a.team===0&&a.assigned_lane===s).map(a=>a.player_slot)),t.laneRight=new Set(e.players.filter(a=>a.team===1&&a.assigned_lane===s).map(a=>a.player_slot))}}const $t="/assets/Initiator-DuqRnju5.png",kt="/assets/Seekers-CZ-8oZLJ.png",Mt="/assets/Alchemist-B11JBQg4.png",_t="/assets/Arcanist-DOqtYLaY.png",St="/assets/Ritualist-kCHvunP5.png",It="/assets/Emissary-Dv2H0klT.png",At="/assets/Archon-BaUdzOEP.png",Ct="/assets/Oracle-DxOU2f1c.png",Pt="/assets/Phantom-C6YgGs0c.png",Lt="/assets/Ascendent-CY0PjSVE.png",Et="/assets/Eternus-BBaqIrhh.png",U="https://api.deadlock-api.com",Ts={1:$t,2:kt,3:Mt,4:_t,5:St,6:It,7:At,8:Ct,9:Pt,10:Lt,11:Et},js=["","I","II","III","IV","V","VI"],Bs={1:"Normal",4:"Street Brawl"},Rs={1:6,4:4},Ze=[{id:"overview",label:"Overview"},{id:"heroes",label:"Heroes"},{id:"matches",label:"Matches"}];let xe=null,ue=null,ye=null,pe=null,we=null,me=null;function Xe(){return xe?Promise.resolve(xe):ue||(ue=fetch(`${U}/v1/assets/heroes`).then(i=>i.ok?i.json():[]).then(i=>(xe=new Map(i.map(e=>[e.id,e])),xe)).catch(()=>(ue=null,new Map)),ue)}function Je(){return ye?Promise.resolve(ye):pe||(pe=fetch(`${U}/v1/assets/items`).then(i=>i.ok?i.json():[]).then(i=>(ye=new Map(i.map(e=>[e.id,e])),ye)).catch(()=>(pe=null,new Map)),pe)}function Qe(){return we?Promise.resolve(we):me||(me=fetch(`${U}/v1/analytics/badge-distribution`).then(i=>i.ok?i.json():[]).then(i=>(we=i,we)).catch(()=>(me=null,null)),me)}function Hs(i){var s;const e=Math.floor(i/10),t=i%10;return{name:((s=W.find(a=>a.tier===e))==null?void 0:s.name)??"Unknown",subtier:t,tier:e}}function Ns(i,e){const t=e.reduce((s,a)=>s+a.total_matches,0);return t?e.filter(s=>s.badge_level>i).reduce((s,a)=>s+a.total_matches,0)/t*100:0}function Fs(i){const e=Math.floor(Date.now()/1e3)-i;return e<120?`${e}s`:e<3600?`${Math.floor(e/60)}min.`:e<86400?`${Math.floor(e/3600)}h`:e<86400*7?`${Math.floor(e/86400)}d`:e<86400*30?`${Math.floor(e/(86400*7))} weeks`:e<86400*365?`${Math.floor(e/(86400*30))} months`:`${Math.floor(e/(86400*365))}y`}function Os(i){return`${Math.floor(i/60)}:${String(i%60).padStart(2,"0")}`}function Us(i){return i===0?{label:"Inactif",color:"text-grey-500"}:i<6?{label:"Peu actif",color:"text-amber-400"}:i<21?{label:"Actif",color:"text-emerald-400"}:{label:"Très actif",color:"text-emerald-300"}}function zs(i,e){const t=new Set,s=[];for(const a of i){if(s.length>=12)break;if(a.sold_time_s!==0&&a.sold_time_s!==null||t.has(a.item_id))continue;const r=e.get(a.item_id);!(r!=null&&r.shop_image_webp)||!r.item_tier||(t.add(a.item_id),s.push(r))}return s}function Vs(i,e,t=3){const s=new Map;for(const a of i){const r=s.get(a.hero_id)??{total:0,wins:0};r.total++,a.match_result===a.player_team&&r.wins++,s.set(a.hero_id,r)}return[...s.entries()].sort((a,r)=>r[1].total-a[1].total).slice(0,t).map(([a,r])=>{const n=i.filter(u=>u.hero_id===a).slice(0,50),l=n.reduce((u,g)=>u+g.player_kills,0),o=n.reduce((u,g)=>u+g.player_deaths,0),h=n.reduce((u,g)=>u+g.player_assists,0),d=o>0?(l+h)/o:l+h,c=i.filter(u=>u.hero_id===a).slice(0,5).map(u=>u.match_result===u.player_team);return{heroId:a,hero:e.get(a),total:r.total,wins:r.wins,kda:d,kills:l,deaths:o,assists:h,kdaCount:n.length,recent5:c,pickRate:r.total/i.length*100}})}class Gs{constructor(){m(this,"container",null);m(this,"currentTab","overview");m(this,"loading",!0);m(this,"steamProfile",null);m(this,"deadlockProfile",null);m(this,"badgeDist",null);m(this,"allMatches",[]);m(this,"visibleCount",10);m(this,"heroMap",new Map);m(this,"itemMap",new Map);m(this,"matchMetaMap",new Map);m(this,"metaLoadingSet",new Set);m(this,"expandedMatches",new Set);m(this,"matchDetail",new Ds);m(this,"playerNameMap",new Map);m(this,"movingAvgBadge",null);m(this,"externalAccountId",null)}mount(e){this.externalAccountId=null,this._resetState(e),this.loadData()}mountForPlayer(e,t){this.externalAccountId=t,this._resetState(e),this.loadDataForPlayer(t)}_resetState(e){this.container=e,this.loading=!0,this.visibleCount=10,this.allMatches=[],this.matchMetaMap=new Map,this.expandedMatches=new Set,this.matchDetail.reset(),this.movingAvgBadge=null,this.deadlockProfile=null,this.render()}async loadData(){var e,t,s,a;try{if(this.steamProfile=await((t=(e=window.api)==null?void 0:e.steamGetProfile)==null?void 0:t.call(e))??null,!((s=this.steamProfile)!=null&&s.steamId64)){this.loading=!1,this.render();return}const[r,n,l,o]=await Promise.all([fetch(`${U}/v1/players/steam-search?search_query=${encodeURIComponent(this.steamProfile.steamId64)}&min_matches_played_last_30d=0&limit=1`).then(h=>h.ok?h.json():[]).catch(()=>[]),Xe(),Je(),Qe()]);this.deadlockProfile=r[0]??null,this.heroMap=n,this.itemMap=l,this.badgeDist=o,(a=this.deadlockProfile)!=null&&a.account_id&&(this.allMatches=await fetch(`${U}/v1/players/${this.deadlockProfile.account_id}/match-history`).then(h=>h.ok?h.json():[]).catch(()=>[])),this.loading=!1,this.render(),this.fetchBatchMetadata(0,Math.min(50,this.allMatches.length))}catch(r){console.error("[ProfilPage] loadData error:",r),this.loading=!1,this.render()}}async loadDataForPlayer(e){try{const[t,s,a,r]=await Promise.all([fetch(`${U}/v1/players/steam?account_ids=${e}`).then(l=>l.ok?l.json():[]).catch(()=>[]),Xe(),Je(),Qe()]),n=t[0];n&&(this.deadlockProfile={account_id:n.account_id,personaname:n.personaname,avatarmedium:n.avatarmedium,last_team_avg_badge:n.last_team_avg_badge??null,matches_played_last_30d:n.matches_played_last_30d??0}),this.heroMap=s,this.itemMap=a,this.badgeDist=r,this.allMatches=await fetch(`${U}/v1/players/${e}/match-history`).then(l=>l.ok?l.json():[]).catch(()=>[]),this.loading=!1,this.render(),this.fetchBatchMetadata(0,Math.min(50,this.allMatches.length))}catch(t){console.error("[ProfilPage] loadDataForPlayer error:",t),this.loading=!1,this.render()}}async fetchBatchMetadata(e,t){const a=this.allMatches.slice(e,t).filter(r=>!this.matchMetaMap.has(r.match_id)&&!this.metaLoadingSet.has(r.match_id));a.length&&(a.forEach(r=>this.metaLoadingSet.add(r.match_id)),await Promise.all(a.map(async r=>{try{const n=await fetch(`${U}/v1/matches/${r.match_id}/metadata`).then(l=>l.ok?l.json():null);n!=null&&n.match_info&&(delete n.match_info.damage_matrix,this.matchMetaMap.set(r.match_id,n.match_info))}catch{}finally{this.metaLoadingSet.delete(r.match_id)}})),this.updateMovingAverageRank(),this.resolvePlayerNames(),this.refreshMatchRows())}updateMovingAverageRank(){const e=[];for(let t=0;t<Math.min(50,this.allMatches.length);t++){const s=this.allMatches[t],a=this.matchMetaMap.get(s.match_id);if(!a)continue;const r=s.player_team===0?a.average_badge_team0:a.average_badge_team1;r>0&&e.push(r)}e.length&&(this.movingAvgBadge=Math.round(e.reduce((t,s)=>t+s,0)/e.length),this.refreshBanner())}async resolvePlayerNames(){var n,l,o,h;const e=this.allMatches.slice(0,this.visibleCount),t=new Set;for(const d of e){const c=this.matchMetaMap.get(d.match_id);c&&c.players.forEach(u=>t.add(u.account_id))}const s=[...t];if(!s.length)return;let a={};try{a=await((l=(n=window.api)==null?void 0:n.getPlayerNames)==null?void 0:l.call(n,s))??{}}catch{}for(const[d,c]of Object.entries(a))c&&this.playerNameMap.set(Number(d),c);const r=s.filter(d=>!a[d]);if(r.length)try{const d=await fetch(`${U}/v1/players/steam?account_ids=${r.join(",")}`).then(u=>u.ok?u.json():[]).catch(()=>[]),c=[];for(const u of d)this.playerNameMap.set(u.account_id,u.personaname),c.push({accountId:u.account_id,personaname:u.personaname,avatarmedium:u.avatarmedium});c.length&&((h=(o=window.api)==null?void 0:o.cachePlayerNames)==null||h.call(o,c).catch(()=>{}))}catch{}this.refreshMatchRows()}render(){var e,t;if(this.container){if(this.loading){this.container.innerHTML=this.renderSkeleton();return}if(!this.externalAccountId&&!((e=this.steamProfile)!=null&&e.steamId64)){this.container.innerHTML=this.renderNotLoggedIn(),(t=this.container.querySelector("#go-settings-btn"))==null||t.addEventListener("click",s=>{s.preventDefault(),document.dispatchEvent(new CustomEvent("navigate-page",{detail:{page:"settings"}}))});return}this.container.innerHTML=`
      <div class="min-h-screen bg-charcoal-100 relative" id="profil-page-root">
        <!-- Dynamic background: splash art of most played hero (Q4: fade-in) -->
        <div id="profil-bg-layer"
             class="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-top opacity-0 transition-opacity duration-700"
             style="mask-image: linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.06) 50%, transparent 100%);
                    -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.06) 50%, transparent 100%);">
        </div>
        <div class="relative z-10">
          <div id="profil-banner">${this.renderHeroBanner()}</div>
          ${this.renderTabBar()}
          <div id="profil-tab-content" class="pb-12">${this.renderTabContent()}</div>
        </div>
      </div>`,this.attachEvents(),this.applyBackgroundImage()}}applyBackgroundImage(){var r;if(!this.container||!this.allMatches.length)return;const e=[...new Map(this.allMatches.map(n=>[n.hero_id,n])).entries()].reduce((n,[l])=>{const o=this.allMatches.filter(h=>h.hero_id===l).length;return o>n[1]?[l,o]:n},[0,0])[0],t=this.heroMap.get(e),s=(r=t==null?void 0:t.images)==null?void 0:r.background_image_webp;if(!s)return;const a=this.container.querySelector("#profil-bg-layer");a&&(a.style.backgroundImage=`url('${s}')`,requestAnimationFrame(()=>{a.style.opacity="1"}))}renderHeroBanner(){var l;const e=this.deadlockProfile,t=this.steamProfile,s=(e==null?void 0:e.avatarmedium)||(t==null?void 0:t.avatarUrl)||"",a=(e==null?void 0:e.personaname)||(t==null?void 0:t.personaname)||"Unknown",r=this.movingAvgBadge??(e==null?void 0:e.last_team_avg_badge)??null;let n="";if(r){const{name:o,subtier:h,tier:d}=Hs(r),c=Ts[d]??"",u=h>0?` ${js[h]}`:"";let g="";(l=this.badgeDist)!=null&&l.length&&(g=` · Top ${Ns(r,this.badgeDist).toFixed(2)}%`),n=`
        ${c?`<img src="${c}" alt="${o}" class="w-7 h-7 object-contain">`:""}
        <span class="text-grey-200 text-sm font-semibold">${o}${u}</span>
        <span class="text-grey-500 text-xs">${g}</span>`}return`
      <div class="bg-slate-900/75 backdrop-blur border-b border-grey-700/60 px-8 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          ${s?`<img src="${s}" alt="${a}" class="w-14 h-14 rounded-lg object-cover border border-grey-600 flex-shrink-0">`:`<div class="w-14 h-14 rounded-lg bg-grey-700 flex items-center justify-center text-grey-400 text-xl font-bold flex-shrink-0">${(a[0]??"?").toUpperCase()}</div>`}
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-white text-xl font-bold leading-none">${a}</h1>
              ${n}
            </div>
            ${e!=null&&e.account_id?`<p class="text-grey-600 text-xs mt-1">ID: ${e.account_id}</p>`:""}
          </div>
        </div>
      </div>`}refreshBanner(){var t;const e=(t=this.container)==null?void 0:t.querySelector("#profil-banner");e&&(e.innerHTML=this.renderHeroBanner())}renderTabBar(){return`
      <div class="sticky top-0 z-20 bg-charcoal-100/95 backdrop-blur border-b border-grey-700 px-8">
        <div class="flex gap-1 -mb-px">
          ${Ze.map(e=>`
            <button data-tab="${e.id}"
              class="profil-tab-btn px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap
                ${this.currentTab===e.id?"text-dry-sage-400 border-dry-sage-400":"text-grey-400 border-transparent hover:text-grey-200 hover:border-grey-500"}">
              ${e.label}
            </button>`).join("")}
        </div>
      </div>`}renderTabContent(){var e;switch(this.currentTab){case"overview":return this.renderOverviewTab();case"heroes":case"matches":return`
          <div class="flex flex-col items-center justify-center py-32 gap-3">
            <div class="w-12 h-12 rounded-full bg-grey-700 flex items-center justify-center text-grey-500 text-xl">✦</div>
            <p class="text-grey-400 text-sm">Onglet <span class="text-white font-medium">${(e=Ze.find(t=>t.id===this.currentTab))==null?void 0:e.label}</span> — en développement</p>
          </div>`}}refreshTabContent(){var t;const e=(t=this.container)==null?void 0:t.querySelector("#profil-tab-content");e&&(e.innerHTML=this.renderTabContent(),this.attachMatchRowEvents())}renderOverviewTab(){return`
      <div class="px-6 py-5 max-w-7xl mx-auto space-y-5">
        ${this.renderStatsAndHeroesRow()}
        ${this.renderMatchHistory()}
      </div>`}renderStatsAndHeroesRow(){var v;const e=this.allMatches,t=e.length,s=e.filter(p=>p.match_result===p.player_team).length,a=t-s,r=t?s/t*100:0,n=t?e.reduce((p,f)=>p+f.player_kills,0)/t:0,l=t?e.reduce((p,f)=>p+f.player_deaths,0)/t:0,o=t?e.reduce((p,f)=>p+f.player_assists,0)/t:0,h=((v=this.deadlockProfile)==null?void 0:v.matches_played_last_30d)??0,d=Us(h),c=(p,f,b)=>`
      <div class="bg-charcoal-200 border border-grey-700 rounded-xl p-4 hover:border-grey-500 transition-colors">
        <p class="text-grey-500 text-[10px] font-semibold uppercase tracking-widest mb-1.5">${p}</p>
        <p class="text-white text-xl font-bold tabular-nums leading-none mb-1">${f}</p>
        <p class="text-grey-400 text-xs">${b}</p>
      </div>`,g=Vs(e,this.heroMap,3).map(p=>{var P,M,S;const f=((M=(P=p.hero)==null?void 0:P.images)==null?void 0:M.icon_hero_card_webp)??"",b=((S=p.hero)==null?void 0:S.name)??`Hero #${p.heroId}`,x=p.total?p.wins/p.total*100:0,k=p.recent5.filter(Boolean).length,$=p.recent5.length-k;return`
        <tr class="border-b border-grey-700/40 last:border-0 hover:bg-charcoal-100/30 transition-colors">
          <td class="py-2.5 px-4">
            <div class="flex items-center gap-2">
              ${f?`<img src="${f}" alt="${b}" class="w-8 h-8 rounded-full object-cover border border-grey-600 flex-shrink-0">`:'<div class="w-8 h-8 rounded-full bg-grey-700 flex-shrink-0"></div>'}
              <span class="text-white text-sm font-medium">${b}</span>
            </div>
          </td>
          <td class="py-2.5 px-2 text-right">
            <p class="text-white text-sm tabular-nums font-medium">${p.total}G</p>
            <p class="text-grey-500 text-xs">${p.pickRate.toFixed(1)}%</p>
          </td>
          <td class="py-2.5 px-3 min-w-[120px]">
            <p class="text-white text-sm tabular-nums font-medium">${x.toFixed(2)}%</p>
            <div class="w-full h-1 bg-grey-700 rounded-full mt-1 mb-1">
              <div class="h-full bg-emerald-500 rounded-full" style="width:${Math.min(x,100).toFixed(1)}%"></div>
            </div>
            <p class="text-grey-500 text-[10px]">(${k}Win ${$}Lose)</p>
          </td>
          <td class="py-2.5 px-4 text-right">
            <p class="text-white text-sm tabular-nums font-medium">${p.kda.toFixed(2)}</p>
            <p class="text-grey-500 text-[10px]">
              <span class="text-emerald-400">${(p.kills/p.kdaCount).toFixed(1)}</span>/
              <span class="text-red-400">${(p.deaths/p.kdaCount).toFixed(1)}</span>/
              <span class="text-amber-400">${(p.assists/p.kdaCount).toFixed(1)}</span>
            </p>
          </td>
        </tr>`}).join("");return`
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Left: 2×2 stat cards -->
        <div class="grid grid-cols-2 gap-3">
          ${c("Win Rate Global",`${r.toFixed(2)}%`,`${s} Wins / ${a} Losses`)}
          <div class="bg-charcoal-200 border border-grey-700 rounded-xl p-4 hover:border-grey-500 transition-colors">
            <p class="text-grey-500 text-[10px] font-semibold uppercase tracking-widest mb-1.5">KDA Moyen</p>
            <p class="text-lg font-bold tabular-nums leading-none mb-1">
              <span class="text-emerald-400">${n.toFixed(1)}</span>
              <span class="text-grey-600">/</span>
              <span class="text-red-400">${l.toFixed(1)}</span>
              <span class="text-grey-600">/</span>
              <span class="text-amber-400">${o.toFixed(1)}</span>
            </p>
            <p class="text-grey-400 text-xs">K / D / A</p>
          </div>
          ${c("Total Matches",`${t} Games`,"Parties analysées")}
          <div class="bg-charcoal-200 border border-grey-700 rounded-xl p-4 hover:border-grey-500 transition-colors">
            <p class="text-grey-500 text-[10px] font-semibold uppercase tracking-widest mb-1.5">Activité 30j</p>
            <p class="text-white text-xl font-bold tabular-nums leading-none mb-1">${h}<span class="text-sm font-normal text-grey-400 ml-1">parties</span></p>
            <p class="text-xs ${d.color} font-semibold">${d.label}</p>
          </div>
        </div>

        <!-- Right: Most played heroes -->
        <div class="bg-charcoal-200 border border-grey-700 rounded-xl overflow-hidden">
          <div class="px-4 py-3 border-b border-grey-700">
            <h2 class="text-white font-semibold text-xs uppercase tracking-wider">Most Played Heroes</h2>
          </div>
          <table class="w-full">
            <thead>
              <tr class="text-grey-500 text-[10px] uppercase tracking-wider border-b border-grey-700/60">
                <th class="px-4 py-1.5 text-left">Hero</th>
                <th class="px-2 py-1.5 text-right">Matches</th>
                <th class="px-3 py-1.5 text-left">Win Rate</th>
                <th class="px-4 py-1.5 text-right">KDA</th>
              </tr>
            </thead>
            <tbody>${g}</tbody>
          </table>
        </div>
      </div>`}renderMatchHistory(){const e=this.allMatches.slice(0,this.visibleCount),t=this.allMatches.length>this.visibleCount;return`
      <div class="bg-charcoal-200 border border-grey-700 rounded-xl overflow-hidden" id="match-history-section">
        <div class="px-5 py-3.5 border-b border-grey-700 flex items-center justify-between">
          <h2 class="text-white font-semibold text-xs uppercase tracking-wider">Historique des Matchs</h2>
          <span class="text-grey-500 text-xs">${this.allMatches.length} parties</span>
        </div>
        <div id="match-rows-list">${e.map(s=>this.renderMatchRow(s)).join("")}</div>
        ${t?`
          <div class="px-5 py-4 border-t border-grey-700 text-center">
            <button id="load-more-matches"
              class="px-6 py-2 bg-charcoal-100 hover:bg-grey-700 border border-grey-600 hover:border-grey-500
                     text-grey-300 hover:text-white text-sm font-medium rounded-lg transition-all">
              Charger ${Math.min(10,this.allMatches.length-this.visibleCount)} parties de plus
            </button>
          </div>`:""}
      </div>`}buildDetailBase(e){const t=this.matchMetaMap.get(e),s=this.allMatches.find(a=>a.match_id===e);return!t||!s?null:{matchId:e,meta:t,ownerAccountId:s.account_id,gameMode:s.game_mode,heroMap:this.heroMap,itemMap:this.itemMap,playerNameMap:this.playerNameMap}}renderMatchRow(e){var p;const t=e.match_result===e.player_team,s=this.heroMap.get(e.hero_id),a=((p=s==null?void 0:s.images)==null?void 0:p.icon_hero_card_webp)??"",r=(s==null?void 0:s.name)??`Hero #${e.hero_id}`,n=Bs[e.game_mode]??`Mode ${e.game_mode}`,l=Rs[e.game_mode]??6,o=this.matchMetaMap.get(e.match_id),h=this.metaLoadingSet.has(e.match_id),d=this.expandedMatches.has(e.match_id),c=t?"border-l-emerald-500":"border-l-red-500",u=t?"bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400":"bg-red-600/20 hover:bg-red-600/40 text-red-400";let g='<span class="text-grey-600 text-xs">— KP</span>';if(o){const b=o.players.filter(x=>x.team===e.player_team).reduce((x,k)=>x+k.kills,0);b>0&&(g=`<span class="text-grey-300 text-xs font-medium">${((e.player_kills+e.player_assists)/b*100).toFixed(0)}% KP</span>`)}let v="";if(d){const f=this.buildDetailBase(e.match_id),b=f?this.matchDetail.renderInner(f):`<div class="flex items-center gap-2 text-grey-500 text-sm py-6">
             <span class="w-4 h-4 border-2 border-grey-600 border-t-dry-sage-400 rounded-full animate-spin"></span>
             <span>Chargement de la télémétrie du match…</span>
           </div>`;v=`
        <div class="border-t border-grey-700/50 px-6 py-4 bg-charcoal-100/30" data-detail-root data-match-id="${e.match_id}">
          <div data-detail-content>${b}</div>
        </div>`}return`
      <div class="border-l-4 ${c} border-b border-grey-700/40 last:border-b-0" data-match-id="${e.match_id}">
        <div class="flex items-stretch">

          <!-- Left: hero + meta + KDA (×2 scale: larger icon, more padding) -->
          <div class="flex items-center gap-4 px-5 py-5 w-[26%] min-w-0">
            ${a?`<img src="${a}" alt="${r}" class="w-16 h-16 rounded-lg object-cover border border-grey-700 flex-shrink-0">`:'<div class="w-16 h-16 rounded-lg bg-grey-700 flex-shrink-0"></div>'}
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <span class="text-xs font-bold uppercase ${t?"text-emerald-400":"text-red-400"}">${t?"Victoire":"Défaite"}</span>
                <span class="text-[10px] text-grey-400 bg-charcoal-100 px-1.5 py-0.5 rounded">${n}</span>
              </div>
              <p class="text-grey-500 text-xs truncate">#${e.match_id} · ${Os(e.match_duration_s)} · ${Fs(e.start_time)}</p>
              <p class="text-white text-lg font-bold tabular-nums mt-1 leading-none">
                <span class="text-emerald-400">${e.player_kills}</span><span class="text-grey-500"> / </span><span class="text-red-400">${e.player_deaths}</span><span class="text-grey-500"> / </span><span class="text-amber-400">${e.player_assists}</span>
              </p>
              <div class="mt-0.5">${g}</div>
            </div>
          </div>

          <!-- Center: 6×2 build grid + team composition -->
          <div class="flex-1 border-l border-grey-700/40 px-4 py-4 flex gap-4 min-w-0">
            <!-- Build grid 6×2 (12 slots fixed) -->
            <div class="flex-shrink-0">
              <p class="text-grey-600 text-[10px] uppercase tracking-wider mb-2">Build</p>
              ${this.renderBuildGrid(e,o,h)}
            </div>

            <!-- Team composition -->
            <div class="flex-1 border-l border-grey-700/30 pl-4 min-w-0">
              <p class="text-grey-600 text-[10px] uppercase tracking-wider mb-2">Équipes · ${l}v${l}</p>
              ${this.renderTeamComposition(e,o,h,l)}
            </div>
          </div>

          <!-- Right: expand button (win/loss background) -->
          <div class="border-l border-grey-700/40 flex-shrink-0 flex items-center">
            <button class="expand-match-btn ${u} transition-colors h-full px-3 flex items-center justify-center"
                    data-match-id="${e.match_id}" title="Détails">
              <svg class="w-5 h-5 transition-transform ${d?"rotate-180":""}"
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </div>

        </div>
        ${v}
      </div>`}renderBuildGrid(e,t,s){if(s&&!t)return`
        <div class="grid grid-cols-6 gap-1">
          ${Array(12).fill(0).map(()=>'<div class="w-10 h-10 rounded bg-grey-700/40 animate-pulse"></div>').join("")}
        </div>`;const a='<div class="w-10 h-10 rounded border border-grey-700/30 bg-charcoal-100/10"></div>';if(!t)return`<div class="grid grid-cols-6 gap-1">${Array(12).fill(a).join("")}</div>`;const r=t.players.find(o=>o.account_id===e.account_id),n=r?zs(r.items,this.itemMap):[];return`<div class="grid grid-cols-6 gap-1">${Array(12).fill(null).map((o,h)=>{const d=n[h];return d?`
        <div class="relative w-10 h-10 group" title="${d.name}">
          <div class="relative w-10 h-10 rounded overflow-hidden border border-grey-700/60">
            <img src="${d.shop_image_webp}" alt="${d.name}" class="w-full h-full object-cover">
            ${be(d)}
          </div>
        </div>`:a}).join("")}</div>`}renderTeamComposition(e,t,s,a){if(s&&!t)return`
        <div class="grid grid-cols-2 gap-x-4 gap-y-1">
          ${Array(a*2).fill(0).map(()=>`<div class="flex items-center gap-1.5 animate-pulse">
               <div class="w-5 h-5 rounded-full bg-grey-700 flex-shrink-0"></div>
               <div class="h-2.5 w-16 bg-grey-700 rounded"></div>
             </div>`).join("")}
        </div>`;if(!t)return'<div class="text-grey-600 text-xs">— Données indisponibles</div>';const r=t.players.filter(d=>d.team===0).slice(0,a),n=t.players.filter(d=>d.team===1).slice(0,a),l=d=>{var p,f;const c=this.heroMap.get(d.hero_id),u=((p=c==null?void 0:c.images)==null?void 0:p.minimap_image_webp)??((f=c==null?void 0:c.images)==null?void 0:f.icon_hero_card_webp)??"",g=this.playerNameMap.get(d.account_id)??`#${d.account_id}`,v=d.account_id===e.account_id;return`
        <div class="flex items-center gap-1.5">
          ${u?`<img src="${u}" alt="${c==null?void 0:c.name}" class="w-5 h-5 rounded-full object-cover flex-shrink-0 border border-grey-700/60">`:'<div class="w-5 h-5 rounded-full bg-grey-700 flex-shrink-0"></div>'}
          <button class="navigate-player-btn text-left text-xs truncate max-w-[90px] transition-colors hover:text-dry-sage-400
                         ${v?"text-white font-semibold":"text-grey-400"}"
                  data-account-id="${d.account_id}" title="${g}">
            ${g}
          </button>
        </div>`},o=Math.max(r.length,n.length);return`<div class="grid grid-cols-2 gap-x-4 gap-y-1">${Array(o).fill(null).map((d,c)=>{const u=r[c],g=n[c];return`
        ${u?l(u):"<div></div>"}
        ${g?l(g):"<div></div>"}`}).join("")}</div>`}refreshMatchRows(){if(!this.container||this.loading)return;const e=this.container.querySelector("#match-rows-list");e&&(e.innerHTML=this.allMatches.slice(0,this.visibleCount).map(t=>this.renderMatchRow(t)).join(""),this.attachMatchRowEvents())}renderSkeleton(){const e=`
      <div class="bg-charcoal-200 border border-grey-700 rounded-xl p-4 animate-pulse">
        <div class="h-2.5 w-20 bg-grey-600 rounded mb-2"></div>
        <div class="h-6 w-16 bg-grey-500 rounded mb-1.5"></div>
        <div class="h-2.5 w-28 bg-grey-600 rounded"></div>
      </div>`,t=s=>`<div class="border-l-4 border-l-grey-700 border-b border-grey-700/40 animate-pulse"><div class="flex h-${s} items-center px-5 gap-4">
      <div class="w-16 h-16 rounded-lg bg-grey-700 flex-shrink-0"></div>
      <div class="flex-1 space-y-2"><div class="h-3 w-24 bg-grey-600 rounded"></div><div class="h-5 w-32 bg-grey-500 rounded"></div></div>
      <div class="grid grid-cols-6 gap-1">${Array(12).fill('<div class="w-10 h-10 rounded bg-grey-700/40"></div>').join("")}</div>
    </div></div>`;return`
      <div class="min-h-screen bg-charcoal-100">
        <!-- Banner skeleton -->
        <div class="bg-slate-900/75 border-b border-grey-700 px-8 py-4 flex items-center gap-3 animate-pulse">
          <div class="w-14 h-14 rounded-lg bg-grey-700 flex-shrink-0"></div>
          <div class="space-y-1.5">
            <div class="flex items-center gap-2">
              <div class="h-5 w-36 bg-grey-500 rounded"></div>
              <div class="w-7 h-7 rounded bg-grey-600"></div>
              <div class="h-3 w-20 bg-grey-600 rounded"></div>
            </div>
            <div class="h-2.5 w-16 bg-grey-700 rounded"></div>
          </div>
        </div>
        <!-- Tab bar skeleton -->
        <div class="border-b border-grey-700 px-8 h-11 flex items-end gap-6 animate-pulse">
          ${Array(3).fill('<div class="h-3 w-16 bg-grey-700 rounded mb-3"></div>').join("")}
        </div>
        <!-- Content skeleton -->
        <div class="px-6 py-5 max-w-7xl mx-auto space-y-4">
          <!-- Side-by-side row -->
          <div class="grid grid-cols-2 gap-4">
            <div class="grid grid-cols-2 gap-3">${e.repeat(4)}</div>
            <div class="bg-charcoal-200 border border-grey-700 rounded-xl p-4 animate-pulse h-48"></div>
          </div>
          <!-- Match rows -->
          <div class="bg-charcoal-200 border border-grey-700 rounded-xl overflow-hidden">
            ${[28,28,28,28,28].map(s=>t(String(s))).join("")}
          </div>
        </div>
      </div>`}renderNotLoggedIn(){return`
      <div class="flex flex-col items-center justify-center min-h-screen bg-charcoal-100 gap-4">
        <p class="text-grey-400 text-lg">Connectez-vous à Steam pour voir votre profil.</p>
        <a href="#" id="go-settings-btn"
           class="px-4 py-2 bg-dry-sage-500 hover:bg-dry-sage-400 text-charcoal-100 rounded-lg text-sm font-medium transition-colors">
          Aller aux paramètres
        </a>
      </div>`}attachEvents(){this.container&&(this.container.querySelectorAll(".profil-tab-btn").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.tab;t&&t!==this.currentTab&&(this.currentTab=t,this.render())})}),this.attachMatchRowEvents())}attachMatchRowEvents(){var e;this.container&&(this.container.querySelectorAll(".expand-match-btn").forEach(t=>{t.addEventListener("click",()=>{const s=Number(t.dataset.matchId);s&&(this.expandedMatches.has(s)?this.expandedMatches.delete(s):this.expandedMatches.add(s),this.refreshMatchRows())})}),this.container.querySelectorAll(".navigate-player-btn").forEach(t=>{t.addEventListener("click",()=>{const s=Number(t.dataset.accountId);s&&document.dispatchEvent(new CustomEvent("navigate-player",{detail:{accountId:s}}))})}),(e=this.container.querySelector("#load-more-matches"))==null||e.addEventListener("click",()=>{const t=this.visibleCount;this.visibleCount+=10,this.refreshTabContent(),this.fetchBatchMetadata(t,this.visibleCount)}),this.matchDetail.attach(this.container,t=>this.buildDetailBase(t)))}}class qs{constructor(){m(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-6">
            Game Overlay
          </h1>
          <p class="text-grey-300 mb-8">
            Dashboard tactique en temps réel pendant les matchs.
          </p>
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600">
            <p class="text-grey-400">
              Page en développement - Game Overlay
            </p>
          </div>
        </div>
      </div>
    `)}}class Ws{constructor(){m(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-6">
            Leaderboards
          </h1>
          <p class="text-grey-300 mb-8">
            Classements et statistiques de rang mis à jour quotidiennement.
          </p>
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600">
            <p class="text-grey-400">
              Page en développement - Leaderboards
            </p>
          </div>
        </div>
      </div>
    `)}}class Ks{constructor(){m(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-6">
            Meta Items & Builds
          </h1>
          <p class="text-grey-300 mb-8">
            Liste des items avec le plus haut "Win boost" et section "Best Value".
          </p>
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600">
            <p class="text-grey-400">
              Page en développement - Meta Items & Builds
            </p>
          </div>
        </div>
      </div>
    `)}}const Te={1:$t,2:kt,3:Mt,4:_t,5:St,6:It,7:At,8:Ct,9:Pt,10:Lt,11:Et},et="https://api.deadlock-api.com",je={1:"#774D22",2:"#8E445D",3:"#4A5C8E",4:"#436C2C",5:"#BC6020",6:"#D04F5F",7:"#A96BBE",8:"#A66325",9:"#BFBFBF",10:"#EFD970",11:"#5AFFC3"},tt=["I","II","III","IV","V","VI"];function Ys(i){const e=Math.floor(Date.now()/1e3);return i==="24h"?{min:e-86400,max:e}:i==="7d"?{min:e-7*86400,max:e}:i==="30d"?{min:e-30*86400,max:e}:{}}function Zs(i){return i<=2e4?5e3:i<=6e4?1e4:i<=2e5?25e3:5e4}function ie(i){return i.toLocaleString("en-US")}class Xs{constructor(){m(this,"container",null);m(this,"currentPeriod","7d");m(this,"rankAssets",new Map);m(this,"tooltipController",null)}mount(e){this.container=e,this.renderSkeleton(),this.fetchAndRender()}renderSkeleton(){this.container&&(this.container.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-full">
          <div class="flex items-center gap-3 mb-5">
            <div class="h-5 w-14 bg-charcoal-300 rounded animate-pulse"></div>
            <div class="h-7 w-28 bg-charcoal-300 rounded animate-pulse"></div>
          </div>
          <div class="mb-5">
            <div class="h-8 w-96 bg-charcoal-300 rounded animate-pulse mb-2"></div>
            <div class="h-4 bg-charcoal-300 rounded animate-pulse" style="width:480px;max-width:100%;"></div>
          </div>
          <div class="bg-charcoal-200 rounded-lg border border-grey-200 p-4 mb-6 animate-pulse">
            <div class="bg-charcoal-300 rounded" style="width:100%;height:420px;"></div>
          </div>
          <div class="space-y-2">
            ${Array.from({length:6}).map(()=>`
              <div class="h-20 bg-charcoal-200 rounded-lg border border-grey-200 animate-pulse"></div>`).join("")}
          </div>
        </div>
      </div>`)}async fetchAndRender(){if(!this.container)return;const[e,t]=await Promise.allSettled([this.fetchRanks(),this.fetchDistribution(this.currentPeriod)]);if(e.status==="fulfilled")for(const a of e.value)a.tier>=1&&a.tier<=11&&this.rankAssets.set(a.tier,a);const s=t.status==="fulfilled"?this.normalizeTo66(t.value):this.normalizeTo66([]);this.renderFull(s)}async fetchRanks(){const e=await fetch(`${et}/v1/assets/ranks`);if(!e.ok)throw new Error(`ranks ${e.status}`);return e.json()}async fetchDistribution(e){const t=Ys(e),s=new URL(`${et}/v1/analytics/badge-distribution`);s.searchParams.set("game_mode","normal"),t.min!==void 0&&s.searchParams.set("min_unix_timestamp",String(t.min)),t.max!==void 0&&s.searchParams.set("max_unix_timestamp",String(t.max));const a=await fetch(s.toString());if(!a.ok)throw new Error(`badge-distribution ${a.status}`);const r=await a.json();return this.mapDistribution(r)}mapDistribution(e){var s,a,r,n;const t=[];for(const l of e){const o=Math.floor(l.badge_level/10),h=l.badge_level%10;if(o<1||o>11||h<1||h>6)continue;const d=W.find(g=>g.tier===o);if(!d)continue;const c=this.rankAssets.get(o),u=((s=c==null?void 0:c.images)==null?void 0:s[`small_subrank${h}_webp`])??((a=c==null?void 0:c.images)==null?void 0:a[`small_subrank${h}`])??((r=c==null?void 0:c.images)==null?void 0:r.small_webp)??((n=c==null?void 0:c.images)==null?void 0:n.small)??"";t.push({subRankId:`${d.name.toLowerCase()}-${h}`,subRankName:`${d.name} ${tt[h-1]}`,tier:o,subRank:h,matchCount:l.total_matches,colorHex:je[o]??"#888888",subRankImageUrl:u})}return t}normalizeTo66(e){var a,r,n,l;const t=new Map(e.map(o=>[`${o.tier}-${o.subRank}`,o])),s=[];for(const o of W)for(let h=1;h<=6;h++){const d=t.get(`${o.tier}-${h}`);if(d)s.push(d);else{const c=this.rankAssets.get(o.tier),u=((a=c==null?void 0:c.images)==null?void 0:a[`small_subrank${h}_webp`])??((r=c==null?void 0:c.images)==null?void 0:r[`small_subrank${h}`])??((n=c==null?void 0:c.images)==null?void 0:n.small_webp)??((l=c==null?void 0:c.images)==null?void 0:l.small)??"";s.push({subRankId:`${o.name.toLowerCase()}-${h}`,subRankName:`${o.name} ${tt[h-1]}`,tier:o.tier,subRank:h,matchCount:0,colorHex:je[o.tier]??"#888888",subRankImageUrl:u})}}return s}renderFull(e){if(!this.container)return;this.container.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-full">
          ${this.renderPageHeader()}
          <div id="rd-chart-wrapper" class="bg-charcoal-200 rounded-lg border border-grey-200 p-4 mb-6 overflow-hidden">
            ${this.renderChart(e)}
          </div>
          <div id="rd-list-wrapper">
            ${this.renderList(e)}
          </div>
        </div>
      </div>`;const t=this.container.querySelector("#rd-period-select");t&&(t.value=this.currentPeriod,t.addEventListener("change",()=>this.onPeriodChange(t))),this.wireTooltips()}async onPeriodChange(e){var a,r;this.currentPeriod=e.value;const t=(a=this.container)==null?void 0:a.querySelector("#rd-chart-wrapper"),s=(r=this.container)==null?void 0:r.querySelector("#rd-list-wrapper");t&&(t.innerHTML='<div class="bg-charcoal-300 rounded animate-pulse" style="width:100%;height:420px;"></div>'),s&&(s.innerHTML=Array.from({length:4}).map(()=>'<div class="h-20 bg-charcoal-200 rounded-lg border border-grey-200 animate-pulse mb-2"></div>').join(""));try{const n=await this.fetchDistribution(this.currentPeriod),l=this.normalizeTo66(n);t&&(t.innerHTML=this.renderChart(l)),s&&(s.innerHTML=this.renderList(l)),this.wireTooltips()}catch{t&&(t.innerHTML='<div class="p-6 text-grey-500 text-sm">Failed to load distribution data.</div>')}}wireTooltips(){var n,l;if(!this.container)return;(n=this.tooltipController)==null||n.abort(),this.tooltipController=new AbortController;const{signal:e}=this.tooltipController;(l=document.getElementById("rd-tooltip"))==null||l.remove();const t=document.createElement("div");t.id="rd-tooltip",t.style.cssText="position:fixed;z-index:9999;pointer-events:none;min-width:240px;display:none;",document.body.appendChild(t);const s=this.container.querySelector("#rd-list-wrapper");if(!s)return;let a=null;const r=o=>{const h=o.dataset.name??"",d=parseInt(o.dataset.count??"0",10),c=o.dataset.pct??"0.00",u=o.dataset.from??"0.00",g=o.dataset.to??"0.00",v=o.dataset.img??"",p=this.currentPeriod==="all"?"All":this.currentPeriod;t.innerHTML=`
        <div style="background:#252525;border:1px solid #494949;border-radius:8px;
                    box-shadow:0 8px 32px rgba(0,0,0,0.6);overflow:hidden;">
          <div style="display:flex;align-items:center;gap:12px;padding:14px 16px 12px;">
            <img src="${v}" alt="${h}"
                 style="width:40px;height:40px;object-fit:contain;flex-shrink:0;"/>
            <span style="color:#fff;font-weight:700;font-size:18px;letter-spacing:0.04em;">
              ${h.toUpperCase()}
            </span>
          </div>
          <div style="border-top:1px solid #373737;padding:12px 16px;
                      display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;gap:24px;">
              <span style="color:#7d7c7a;font-size:13px;">Matches (Period ${p}):</span>
              <span style="color:#fff;font-size:13px;font-weight:600;">${ie(d)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:baseline;gap:24px;">
              <span style="color:#7d7c7a;font-size:13px;">Percentage:</span>
              <span style="color:#fff;font-size:13px;font-weight:600;">${c}%</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:baseline;gap:24px;">
              <span style="color:#7d7c7a;font-size:13px;">From:</span>
              <span style="color:#fff;font-size:13px;font-weight:600;">${u}% to ${g}%</span>
            </div>
          </div>
        </div>`};s.addEventListener("mouseover",o=>{const d=o.target.closest(".rd-sr-cell, .rd-tier-row");if(d!==a){if(a=d??null,!d){t.style.display="none";return}r(d),t.style.display="block",this.positionTooltip(t,o)}},{signal:e}),s.addEventListener("mousemove",o=>{a&&this.positionTooltip(t,o)},{signal:e}),s.addEventListener("mouseleave",()=>{a=null,t.style.display="none"},{signal:e})}positionTooltip(e,t){const a=e.offsetWidth||240,r=e.offsetHeight||140;let n=t.clientX+14,l=t.clientY-r-14;n+a>window.innerWidth-8&&(n=t.clientX-a-14),l<8&&(l=t.clientY+14),e.style.left=`${n}px`,e.style.top=`${l}px`}renderPageHeader(){return`
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-4">
          <label class="text-grey-500 text-sm font-medium" for="rd-period-select">Period</label>
          <select id="rd-period-select"
            class="bg-charcoal-300 border border-grey-200 text-white text-sm rounded
                   px-3 py-1.5 focus:outline-none focus:border-dry-sage-400
                   cursor-pointer hover:border-grey-600 transition-colors">
            <option value="24h">24 hours</option>
            <option value="7d">7 days</option>
            <option value="30d">30 days</option>
            <option value="all">All</option>
          </select>
        </div>
        <h1 class="text-2xl font-bold text-white tracking-wide mb-1">
          Deadlock Match Rank Distribution
        </h1>
        <p class="text-grey-500 text-sm mb-4">
          This chart shows how many matches were played at each Deadlock badge level for the selected period.
        </p>
        <div class="border-b border-grey-200 pb-3">
          <span class="inline-block text-white text-sm font-medium pb-3 border-b-2 border-dry-sage-400">
            Ranks and Subranks
          </span>
          <p class="text-grey-500 text-xs mt-2">Explore all ranks, their subranks, and match distribution</p>
        </div>
      </div>`}renderChart(e){const t=Math.max(...e.map(w=>w.matchCount),1),s=Math.min(...e.filter(w=>w.matchCount>0).map(w=>w.matchCount),t),a=Zs(t),r=1100,n=490,l=78,o=22,h=150,d=15,c=l,u=o,g=r-l-d,v=n-o-h,p=u+v,f=w=>p-w/t*v,b=12,x=2,k=(g-10*b)/11,$=(k-5*x)/6,P=w=>c+w*(k+b),M=(w,L)=>P(w)+L*($+x),S=w=>P(w)+k/2;let A=`<defs>
      <clipPath id="rd-clip">
        <rect x="${c}" y="${u}" width="${g}" height="${v}"/>
      </clipPath>
    </defs>`;for(let w=0;w<=Math.ceil(t/a)*a;w+=a){const L=f(w);if(L<u-2)break;A+=`
        <line x1="${c}" y1="${L.toFixed(1)}" x2="${c+g}" y2="${L.toFixed(1)}"
              stroke="#2a2a2a" stroke-width="1" stroke-dasharray="4,4"/>
        <text x="${(c-6).toFixed(1)}" y="${(L+4).toFixed(1)}"
              text-anchor="end" font-size="11" fill="#636261" font-family="monospace">${ie(w)}</text>`}const D=f(s);A+=`
      <line x1="${c}" y1="${D.toFixed(1)}" x2="${c+g}" y2="${D.toFixed(1)}"
            stroke="#EFD970" stroke-width="1.5" stroke-dasharray="6,3" opacity="0.75"/>
      <text x="${(c-6).toFixed(1)}" y="${(D-3).toFixed(1)}"
            text-anchor="end" font-size="10" fill="#EFD970" font-weight="bold"
            font-family="monospace">${ie(s)}</text>`;const T=f(t);A+=`
      <line x1="${c}" y1="${T.toFixed(1)}" x2="${c+g}" y2="${T.toFixed(1)}"
            stroke="#5AFFC3" stroke-width="1.5" stroke-dasharray="6,3" opacity="0.75"/>
      <text x="${(c-6).toFixed(1)}" y="${(T-3).toFixed(1)}"
            text-anchor="end" font-size="10" fill="#5AFFC3" font-weight="bold"
            font-family="monospace">${ie(t)}</text>`,A+='<g clip-path="url(#rd-clip)">';for(const w of e){const L=w.tier-1,j=w.subRank-1,R=M(L,j),H=w.matchCount/t*v,ae=p-H,ce=(1-j*.04).toFixed(2);A+=`<rect x="${R.toFixed(1)}" y="${ae.toFixed(1)}"
                    width="${$.toFixed(1)}" height="${H.toFixed(1)}"
                    fill="${w.colorHex}" opacity="${ce}" rx="1"/>`}A+="</g>",A+=`
      <line x1="${c}" y1="${u}" x2="${c}" y2="${p}" stroke="#3a3a3a" stroke-width="1"/>
      <line x1="${c}" y1="${p}" x2="${c+g}" y2="${p}" stroke="#3a3a3a" stroke-width="1"/>
      <text x="${(c-6).toFixed(1)}" y="${(p+4).toFixed(1)}"
            text-anchor="end" font-size="11" fill="#636261" font-family="monospace">0</text>`;const y=72,_=p+16;for(const w of W){const L=w.tier-1,j=S(L),R=Te[w.tier]??"";A+=`<image href="${R}"
                     x="${(j-y/2).toFixed(1)}" y="${_.toFixed(1)}"
                     width="${y}" height="${y}" style="image-rendering:auto;"/>`}return`<svg width="100%" height="${n}" viewBox="0 0 ${r} ${n}" preserveAspectRatio="none">
      ${A}
    </svg>`}renderList(e){const t=e.reduce((o,h)=>o+h.matchCount,0)||1,s=new Map;let a=0;for(const o of e){const h=a/t*100;a+=o.matchCount;const d=a/t*100;s.set(o.subRankId,{from:h.toFixed(2),to:d.toFixed(2)})}const r=new Map;for(const o of e)r.has(o.tier)||r.set(o.tier,[]),r.get(o.tier).push(o);const n=Math.max(...W.map(o=>(r.get(o.tier)??[]).reduce((h,d)=>h+d.matchCount,0)),1);return`
      <div class="mb-4">
        <h2 class="text-white font-bold text-2xl">Deadlock Match Rank Distribution</h2>
        <p class="text-grey-500 text-sm mt-1">
          This chart shows how many matches were played at each Deadlock badge level for the selected period.
        </p>
      </div>
      <div class="space-y-4 pb-8">${W.map(o=>{var P,M;const h=r.get(o.tier)??[],d=h.reduce((S,A)=>S+A.matchCount,0),c=(d/t*100).toFixed(2),u=(d/n*100).toFixed(1),g=je[o.tier]??"#888888",v=Te[o.tier]??"",p=`<img src="${v}" alt="${o.name}" class="w-24 h-24 object-contain shrink-0"/>`,f=`
        <div class="grid grid-cols-3 border-t border-grey-200/20 gap-px bg-grey-200/20">
          ${h.map(S=>{const A=(S.matchCount/t*100).toFixed(2),D=s.get(S.subRankId)??{from:"0.00",to:"0.00"},T=S.subRankImageUrl||Te[S.tier]||"",y=`<img src="${T}" alt="${S.subRankName}"
                                  class="w-16 h-16 object-contain shrink-0"/>`;return`
              <div class="rd-sr-cell flex items-center gap-4 px-5 py-4
                          border-r border-grey-200/20 last:border-r-0 min-w-0
                          cursor-default hover:bg-charcoal-300 transition-colors duration-150"
                   data-name="${S.subRankName}"
                   data-count="${S.matchCount}"
                   data-pct="${A}"
                   data-from="${D.from}"
                   data-to="${D.to}"
                   data-img="${T}">
                ${y}
                <div class="min-w-0">
                  <div class="text-grey-400 text-xl truncate">${S.subRankName}</div>
                  <div class="text-white text-xl font-semibold">${ie(S.matchCount)}</div>
                  <div class="text-grey-500 text-lg">${A}%</div>
                </div>
              </div>`}).join("")}
        </div>`,b=h[0],x=h[h.length-1],k=b?((P=s.get(b.subRankId))==null?void 0:P.from)??"0.00":"0.00",$=x?((M=s.get(x.subRankId))==null?void 0:M.to)??"0.00":"0.00";return`
        <div class="bg-charcoal-200 rounded-lg border border-grey-200 overflow-hidden">
          <div class="rd-tier-row flex items-center gap-5 px-5 py-4
                      cursor-default hover:bg-charcoal-300 transition-colors duration-150"
               data-name="${o.name}"
               data-count="${d}"
               data-pct="${c}"
               data-from="${k}"
               data-to="${$}"
               data-img="${v}">
            ${p}
            <div class="flex-1 min-w-0">
              <span class="text-white font-semibold text-2xl">${o.name}</span>
              <span class="text-grey-500 text-xl ml-3">— Matches: ${ie(d)} (${c}%)</span>
            </div>
            <div class="w-48 bg-charcoal-400 rounded-full h-2 shrink-0 overflow-hidden">
              <div class="h-2 rounded-full transition-all duration-500"
                   style="width:${u}%;background-color:${g};"></div>
            </div>
          </div>
          ${f}
        </div>`}).join("")}</div>`}}class Js{constructor(){m(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-6">
            Settings
          </h1>
          <p class="text-grey-300 mb-8">
            Configuration de l'application, langue, thème, chemins système et intégrations.
          </p>
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600">
            <p class="text-grey-400">
              Page en développement - Settings
            </p>
          </div>
        </div>
      </div>
    `)}}const Qs="https://api.deadlock-api.com";class ea{constructor(){m(this,"container",null)}mount(e){this.container=e,this.renderSkeleton(),this.fetchAndRender()}renderSkeleton(){this.container&&(this.container.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto">
          ${this.renderHeader()}
          <div class="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-9 gap-2">
            ${Array.from({length:27}).map(()=>`
              <div class="flex flex-col items-center gap-2 animate-pulse">
                <div class="w-[96px] h-[128px] rounded-lg bg-charcoal-300 border border-charcoal-400"></div>
                <div class="h-2 w-16 rounded-full bg-charcoal-300"></div>
              </div>`).join("")}
          </div>
        </div>
      </div>`)}renderHeader(){return`
      <div class="mb-5">
        <h1 class="text-3xl font-bold text-white tracking-wide">Heroes</h1>
        <p class="text-dry-sage-500 text-sm mt-1">
          Browse all Deadlock heroes and view their builds, stats, and guides
        </p>
        <div class="mt-4 h-px bg-gradient-to-r from-dry-sage-400/50 via-charcoal-400 to-transparent"></div>
      </div>`}async fetchAndRender(){if(!this.container)return;let e=[];try{const t=await fetch(`${Qs}/v1/assets/heroes`);if(t.ok){const s=await t.json();e=(Array.isArray(s)?s:s.data??[]).filter(r=>r.player_selectable===!0&&r.disabled===!1&&r.in_development===!1),e.sort((r,n)=>(r.name??"").localeCompare(n.name??""))}}catch{}if(this.container){if(e.length===0){this.container.innerHTML=`
        <div class="p-8 bg-charcoal-100 min-h-screen flex flex-col items-center justify-center gap-3">
          <div class="w-12 h-12 rounded-full border-2 border-charcoal-400 flex items-center justify-center">
            <span class="text-grey-500 text-xl">!</span>
          </div>
          <p class="text-grey-500 text-sm">Impossible de charger les héros.</p>
        </div>`;return}this.container.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto">
          ${this.renderHeader()}
          <div class="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-9 gap-2">
            ${e.map(t=>this.renderHeroCard(t)).join("")}
          </div>
        </div>
      </div>`,this.container.querySelectorAll("button[data-hero-id]").forEach(t=>{const s=parseInt(t.dataset.heroId??"",10),a=e.find(r=>r.id===s);a&&t.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("navigate-hero",{detail:{heroId:s,heroData:a}}))})})}}renderHeroCard(e){var r,n,l,o;const t=((r=e.images)==null?void 0:r.icon_hero_card_webp)??((n=e.images)==null?void 0:n.icon_hero_card)??((l=e.images)==null?void 0:l.icon_image_small_webp)??((o=e.images)==null?void 0:o.icon_image_small)??"",s=e.name??"—",a=t?`<img src="${t}" alt="${s}"
              class="w-full h-full object-cover object-top
                     transition-transform duration-300 ease-out
                     group-hover:scale-[1.06]"/>`:`<div class="w-full h-full flex items-center justify-center
                    text-grey-600 text-xs bg-charcoal-300">?</div>`;return`
      <button data-hero-id="${e.id}"
              title="${s}"
              class="group flex flex-col items-center gap-1.5 cursor-pointer bg-transparent border-0 p-0">
        <div class="w-[96px] h-[128px] rounded-lg overflow-hidden
                    border border-charcoal-400
                    group-hover:border-dry-sage-400
                    shadow-md group-hover:shadow-dry-sage-400/20 group-hover:shadow-lg
                    transition-all duration-250 bg-charcoal-200 shrink-0">
          ${a}
        </div>
        <span class="text-[11px] leading-tight text-center text-grey-500
                     w-[96px] truncate
                     transition-colors duration-200 group-hover:text-dry-sage-400">
          ${s}
        </span>
      </button>`}}const G="https://api.deadlock-api.com";let $e=null,ge=null;function ta(){return $e?Promise.resolve($e):ge||(ge=fetch(`${G}/v1/assets/items`).then(i=>i.ok?i.json():Promise.resolve([])).then(i=>($e=new Map(i.map(e=>[e.id,e])),$e)).catch(()=>(ge=null,new Map)),ge)}function re(i){const e=i;return e.shop_image_webp??e.shop_image_small_webp??e.shop_image??e.shop_image_small??e.image_webp??e.image??""}function st(i){const e=i.description;return e?typeof e=="string"?e:(e.desc??e.active??e.passive??"").trim():""}function at(i){var s;const e=i.properties;if(!e||!((s=i.tooltip_sections)!=null&&s.length))return[];const t=[];for(const a of i.tooltip_sections){for(const r of a.section_attributes??[])for(const n of r.important_properties??[]){const l=e[n];if(!l||t.length>=5)break;const o=l.label??n,h=l.prefix??"",d=l.value??"",c=l.postfix??l.display_units??"";d&&t.push(`${o}: ${h}${d}${c}`)}if(t.length>=5)break}return t}const it=[{id:"builds",label:"Builds"},{id:"items",label:"Items"},{id:"skill-path",label:"Skill Path"},{id:"overview",label:"Overview & Abilities"},{id:"lore",label:"Lore"}],rt=["#6eb3a8","#c9a46e","#a86e9e","#8cb86e"];class sa{constructor(){m(this,"container",null);m(this,"hero",null);m(this,"currentTab","builds");m(this,"selectedBuildIdx",0);m(this,"builds",[]);m(this,"buildStats",[]);m(this,"heroAbilities",[]);m(this,"abilityStats",[]);m(this,"items",new Map);m(this,"itemsPeriod","latest");m(this,"itemsRank",{mode:"all",tier:0});m(this,"itemsTiers",new Set([1,2,3,4]));m(this,"itemsCurrentStats",[]);m(this,"itemsRefStats",[]);m(this,"heroMatchesCur",0);m(this,"heroMatchesRef",0);m(this,"patchDays",[]);m(this,"itemsLoading",!1);m(this,"itemsLoaded",!1);m(this,"itemsError",!1);m(this,"itemsSortCol","usage");m(this,"itemsSortDir","desc");m(this,"selectedAbilityIdx",0)}mountWithHero(e,t){this.container=e,this.hero=t,this.currentTab="builds",this.selectedBuildIdx=0,this.builds=[],this.buildStats=[],this.heroAbilities=[],this.abilityStats=[],this.items=new Map,this.itemsPeriod="latest",this.itemsRank={mode:"all",tier:0},this.itemsTiers=new Set([1,2,3,4]),this.itemsCurrentStats=[],this.itemsRefStats=[],this.heroMatchesCur=0,this.heroMatchesRef=0,this.itemsLoading=!1,this.itemsLoaded=!1,this.itemsError=!1,this.itemsSortCol="usage",this.itemsSortDir="desc",this.selectedAbilityIdx=0,this.renderSkeleton(),this.fetchAll()}mount(e){e.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen flex items-center justify-center">
        <p class="text-grey-500 text-sm">Select a hero from the library to view details.</p>
      </div>`}async fetchAll(){if(!this.hero)return;const e=this.hero.id;try{const[t,s,a,r,n]=await Promise.all([fetch(`${G}/v1/builds?hero_id=${e}&sort_by=weekly_favorites&limit=3&only_latest=true&build_language=English`).then(o=>o.ok?o.json():Promise.resolve([])),fetch(`${G}/v1/analytics/hero-build-stats/${e}`).then(o=>o.ok?o.json():Promise.resolve([])),ta(),fetch(`${G}/v1/assets/items/by-hero-id/${e}`).then(o=>o.ok?o.json():Promise.resolve([])),fetch(`${G}/v1/analytics/ability-order-stats?hero_id=${e}&min_matches=200`).then(o=>o.ok?o.json():Promise.resolve([]))]);this.builds=Array.isArray(t)?t.slice(0,3):[],this.buildStats=Array.isArray(s)?s:[],this.items=a,this.abilityStats=(Array.isArray(n)?n:[]).sort((o,h)=>h.matches-o.matches).slice(0,5);const l=Array.isArray(r)?r:[];this.heroAbilities=l.filter(o=>o.name!=="Melee"&&!o.name.includes("_")).slice(0,4).sort((o,h)=>{var u,g;const d=((u=this.items.get(o.id))==null?void 0:u.ability_type)==="ultimate"?1:0,c=((g=this.items.get(h.id))==null?void 0:g.ability_type)==="ultimate"?1:0;return d-c}),this.render()}catch{this.renderError()}}render(){!this.container||!this.hero||(this.container.innerHTML=this.renderHeader()+`<div id="hero-tab-content" class="pb-12">${this.renderTabContent()}</div>`,this.bindEvents())}renderSkeleton(){this.container&&(this.container.innerHTML=`
      <div class="bg-charcoal-100 min-h-screen animate-pulse">
        <div class="sticky top-0 z-50">
          <div class="h-28 bg-charcoal-300 w-full"></div>
          <div class="h-11 bg-charcoal-200 border-b border-charcoal-400 flex gap-6 px-8 items-center">
            ${[1,2,3,4,5].map(()=>'<div class="h-3 w-20 rounded-full bg-charcoal-300"></div>').join("")}
          </div>
        </div>
        <div class="p-8 space-y-5">
          <div class="h-5 w-32 rounded bg-charcoal-300"></div>
          <div class="flex gap-3">
            ${[1,2,3].map(()=>'<div class="h-14 w-48 rounded-lg bg-charcoal-200 border border-charcoal-400"></div>').join("")}
          </div>
          <div class="h-36 rounded-xl bg-charcoal-200 border border-charcoal-400"></div>
          <div class="h-5 w-24 rounded bg-charcoal-300 mt-4"></div>
          <div class="flex flex-wrap gap-2">
            ${Array.from({length:24}).map(()=>'<div class="w-12 h-12 rounded bg-charcoal-300"></div>').join("")}
          </div>
        </div>
      </div>`)}renderError(){var t;if(!this.container)return;const e=this.hero?this.renderHeader():"";this.container.innerHTML=`
      ${e}
      <div class="flex flex-col items-center justify-center gap-4 py-24">
        <div class="w-10 h-10 rounded-full border border-charcoal-400 flex items-center justify-center text-grey-500 text-lg">!</div>
        <p class="text-grey-500 text-sm">Failed to load hero data.</p>
        <button id="retry-btn"
          class="px-4 py-2 bg-charcoal-300 hover:bg-charcoal-200 text-grey-300 text-sm rounded-lg border border-charcoal-400 transition-colors">
          Retry
        </button>
      </div>`,(t=this.container.querySelector("#retry-btn"))==null||t.addEventListener("click",()=>{this.renderSkeleton(),this.fetchAll()})}renderHeader(){var a,r,n,l;if(!this.hero)return"";const e=((a=this.hero.images)==null?void 0:a.background_image_webp)??((r=this.hero.images)==null?void 0:r.background_image)??"",t=((n=this.hero.images)==null?void 0:n.icon_hero_card_webp)??((l=this.hero.images)==null?void 0:l.icon_hero_card)??"",s=this.hero.name??"Unknown Hero";return`
      <div class="sticky top-0 z-50">
        <!-- Background image with gradient overlay -->
        <div class="relative overflow-hidden"
             style="background-image:url('${e}'); background-size:cover; background-position:center top;">
          <div class="absolute inset-0 pointer-events-none"
               style="background:linear-gradient(to bottom,rgba(0,0,0,0.55),rgba(15,17,19,0.97));"></div>
          <div class="relative flex items-center gap-5 px-8 py-4">
            ${t?`<img src="${t}" alt="${s}"
                      class="h-20 rounded-lg border border-charcoal-400 shadow-xl shrink-0 object-cover object-top" />`:""}
            <div>
              <h1 class="text-3xl font-bold text-white tracking-wide">${s}</h1>
              <p class="text-dry-sage-500 text-sm mt-0.5 uppercase tracking-widest">Hero Details</p>
            </div>
          </div>
        </div>

        <!-- Tab bar -->
        <div class="bg-charcoal-200 border-b border-charcoal-400">
          <div class="flex px-8">
            ${it.map(o=>`
              <button data-tab="${o.id}"
                class="hero-tab-btn px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap
                  ${this.currentTab===o.id?"text-dry-sage-400 border-dry-sage-400":"text-grey-500 border-transparent hover:text-grey-300 hover:border-charcoal-300"}">
                ${o.label}
              </button>`).join("")}
          </div>
        </div>
      </div>`}renderTabContent(){var e;switch(this.currentTab){case"builds":return this.renderBuildsTab();case"skill-path":return this.renderSkillPathTab();case"lore":return this.renderLoreTab();case"items":return this.renderItemsTab();case"overview":return this.renderOverviewTab();default:return this.renderPlaceholder(((e=it.find(t=>t.id===this.currentTab))==null?void 0:e.label)??"")}}renderBuildsTab(){if(this.builds.length===0)return`<div class="flex flex-col items-center justify-center gap-3 py-24 text-grey-500">
        <p class="text-sm">No builds found for this hero.</p>
      </div>`;const e=this.recommendedBuildIdx();return`
      <div class="max-w-5xl">
        ${this.renderBuildSelector(e)}
        <div id="build-detail-area" class="p-8 pt-6 space-y-5">
          ${this.renderBuildDetail(this.selectedBuildIdx)}
        </div>
      </div>`}recommendedBuildIdx(){let e=0,t=-1;return this.builds.forEach((s,a)=>{const r=s.num_weekly_favorites??0;r>t&&(t=r,e=a)}),e}damageType(e){let t=0,s=0;return(e.hero_build.details.mod_categories??[]).forEach(a=>{(a.mods??[]).forEach(r=>{const n=this.items.get(r.ability_id);n&&(n.item_slot_type==="weapon"?t++:n.item_slot_type==="spirit"&&s++)})}),t===0&&s===0?null:t>=s?"Gun":"Mystic"}renderBuildSelector(e){return`
      <div class="flex border-b border-charcoal-400 bg-charcoal-200/60">
        ${this.builds.map((t,s)=>{const a=this.buildStats.find(d=>d.hero_build_id===t.hero_build.hero_build_id),r=a&&a.matches>0?Math.round(a.wins/a.matches*100):null,n=this.damageType(t),l=s===this.selectedBuildIdx,o=s===e,h=n==="Gun"?"background:#f9731622;color:#fb923c;border:1px solid #f9731640":n==="Mystic"?"background:#a855f722;color:#c084fc;border:1px solid #a855f740":"background:#37415122;color:#9ca3af;border:1px solid #37415140";return`
            <button data-build-idx="${s}"
              class="build-selector-btn relative flex-1 flex flex-col gap-2 px-5 py-4 text-left
                     transition-all duration-200 border-r border-charcoal-400 last:border-r-0
                     ${l?"bg-charcoal-300/80":"hover:bg-charcoal-300/40"}">
              <!-- Active top accent bar -->
              <div class="absolute top-0 left-0 right-0 h-0.5 transition-all duration-200"
                   style="background:${l?"#9cbc9c":"transparent"};"></div>

              <!-- Row 1: name + recommended badge -->
              <div class="flex items-start gap-2 pr-1">
                <span class="text-sm font-semibold leading-snug truncate
                  ${l?"text-white":"text-grey-400"}"
                  style="max-width:160px;">${t.hero_build.name}</span>
                ${o?`
                  <span class="shrink-0 text-[9px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider"
                        style="background:#9cbc9c22;color:#9cbc9c;border:1px solid #9cbc9c44;">
                    Rec
                  </span>`:""}
              </div>

              <!-- Row 2: damage chip + win rate -->
              <div class="flex items-center gap-2">
                ${n?`
                  <span class="text-[10px] px-2 py-0.5 rounded-sm font-semibold uppercase tracking-wide"
                        style="${h}">${n}</span>`:""}
                ${r!==null?`
                  <span class="text-[11px] font-bold ${l?"text-white":"text-grey-500"}">${r}%</span>
                  <span class="text-[10px] text-grey-600">WR</span>`:""}
              </div>
            </button>`}).join("")}
      </div>`}renderBuildDetail(e){const t=this.builds[e];return t?this.renderBuildSummary(t,e)+this.renderBuildFullGrid(t):""}renderBuildSummary(e,t){var b;const s=this.buildStats.find(x=>x.hero_build_id===e.hero_build.hero_build_id),a=s&&s.matches>0?(s.wins/s.matches*100).toFixed(1):null,r=(s==null?void 0:s.matches)??0;let n=0,l=0,o=0;(e.hero_build.details.mod_categories??[]).forEach(x=>(x.mods??[]).forEach(k=>{const $=this.items.get(k.ability_id);($==null?void 0:$.item_slot_type)==="weapon"?n++:($==null?void 0:$.item_slot_type)==="spirit"?l++:($==null?void 0:$.item_slot_type)==="vitality"&&o++}));const h=n+l+o||1,d=Math.round(n/h*100),c=Math.round(l/h*100),u=100-d-c,g=e.hero_build.details.mod_categories??[],v=g.find(x=>x.name.toLowerCase().includes("core"))??g[0],p=((v==null?void 0:v.mods)??[]).slice(0,12),f=(((b=e.hero_build.details.ability_order)==null?void 0:b.currency_changes)??[]).slice(0,8);return`
      <div class="bg-charcoal-200 rounded-xl border border-charcoal-400 overflow-hidden">

        <!-- ── ZONE A: Stats bar ──────────────────────────────────────── -->
        <div class="grid border-b border-charcoal-400"
             style="grid-template-columns:180px 1fr auto;">

          <!-- Left: Damage split -->
          <div class="px-4 py-3 border-r border-charcoal-400 flex flex-col justify-center gap-1.5">
            <p class="text-[9px] uppercase tracking-widest text-grey-600 mb-0.5">Damage Split</p>
            <div class="flex items-center gap-1.5">
              <div class="relative flex-1 h-4 rounded-sm overflow-hidden bg-charcoal-400 flex">
                <div class="h-full transition-all" style="width:${d}%;background:#f97316;"></div>
                <div class="h-full transition-all" style="width:${c}%;background:#a855f7;"></div>
                <div class="h-full transition-all" style="width:${u}%;background:#22c55e;"></div>
              </div>
            </div>
            <div class="flex items-center gap-2 text-[10px]">
              <span class="text-orange-400 font-semibold">G ${d}%</span>
              <span class="text-purple-400 font-semibold">S ${c}%</span>
              <span class="text-green-400 font-semibold">V ${u}%</span>
            </div>
          </div>

          <!-- Center: Unlock order -->
          <div class="px-4 py-3 flex flex-col justify-center gap-1.5 overflow-x-auto">
            <p class="text-[9px] uppercase tracking-widest text-grey-600 shrink-0">Unlock Order</p>
            <div class="flex items-center gap-1">
              ${f.map((x,k)=>{const $=this.heroAbilities.find(M=>M.id===x.ability_id),P=$?re($):"";return`
                  ${k>0?'<span class="text-charcoal-400 text-[10px] shrink-0">›</span>':""}
                  <div class="relative group shrink-0">
                    <div class="w-8 h-8 rounded border border-charcoal-400 bg-charcoal-300 overflow-hidden">
                      ${P?`<img src="${P}" alt="${($==null?void 0:$.name)??""}" class="w-full h-full object-cover"/>`:`<div class="w-full h-full flex items-center justify-center text-grey-600 text-[9px]">${k+1}</div>`}
                    </div>
                    <span class="absolute -bottom-1 -right-1 text-[8px] bg-charcoal-100 text-grey-500 rounded-sm px-0.5 leading-tight border border-charcoal-400">${k+1}</span>
                    ${$?`
                      <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 hidden group-hover:block pointer-events-none" style="width:140px;">
                        <div class="bg-charcoal-300 border border-charcoal-400 rounded-lg p-2 shadow-xl">
                          <p class="text-white text-[11px] font-semibold">${$.name}</p>
                        </div>
                      </div>`:""}
                  </div>`}).join("")}
            </div>
          </div>

          <!-- Right: Win rate -->
          <div class="px-5 py-3 flex flex-col items-end justify-center gap-0.5 border-l border-charcoal-400">
            ${a!==null?`
              <span class="text-2xl font-bold text-white leading-none">${a}%</span>
              <span class="text-[10px] text-grey-500 uppercase tracking-wider">Win Rate</span>
              <span class="text-[10px] text-grey-600">${r.toLocaleString()} matches</span>
            `:'<span class="text-grey-600 text-xs">No data</span>'}
          </div>
        </div>

        <!-- ── ZONE B: Core items ──────────────────────────────────────── -->
        ${p.length>0?`
          <div class="px-4 py-3">
            <p class="text-[9px] uppercase tracking-widest text-grey-600 mb-2">
              ${(v==null?void 0:v.name)??"Core Items"}
            </p>
            <div class="flex gap-1.5 overflow-x-auto pb-1">
              ${this.renderItemIcons(p.map(x=>x.ability_id),44)}
            </div>
          </div>`:""}
      </div>`}renderBuildFullGrid(e){const t=(e.hero_build.details.mod_categories??[]).filter(s=>(s.mods??[]).length>0);return t.length===0?"":`
      <div>
        <!-- Section header -->
        <div class="flex items-center gap-3 mb-3">
          <p class="text-[9px] uppercase tracking-widest text-grey-600 font-medium">Full Build</p>
          <div class="flex-1 h-px bg-charcoal-400"></div>
        </div>

        <!-- Row layout: each category = header + horizontal icon row -->
        <div class="space-y-4">
          ${t.map(s=>{var o;const a=s.mods??[],r={};a.forEach(h=>{var c;const d=((c=this.items.get(h.ability_id))==null?void 0:c.item_slot_type)??"other";r[d]=(r[d]??0)+1});const n=((o=Object.entries(r).sort((h,d)=>d[1]-h[1])[0])==null?void 0:o[0])??"other",l=n==="weapon"?"#f97316":n==="spirit"?"#a855f7":n==="vitality"?"#22c55e":"#4b5563";return`
              <div>
                <!-- Category label row -->
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-1.5 h-1.5 rounded-full shrink-0" style="background:${l};"></div>
                  <p class="text-[10px] font-semibold uppercase tracking-wider"
                     style="color:${l};">${s.name}</p>
                  <div class="flex-1 h-px" style="background:${l}33;"></div>
                </div>

                <!-- Horizontal icon row -->
                <div class="flex flex-wrap gap-2">
                  ${a.map(h=>{const d=this.items.get(h.ability_id),c=d?re(d):"",u=(d==null?void 0:d.name)??`#${h.ability_id}`,g=d?st(d):"",v=(d==null?void 0:d.cost)??null,p=d?at(d):[],f=He(d==null?void 0:d.item_slot_type);return`
                      <div class="relative group shrink-0 flex flex-col items-center gap-0.5" style="width:52px;">
                        <!-- Icon square -->
                        <div class="relative w-full rounded border bg-charcoal-300 overflow-hidden cursor-default"
                             style="height:52px;border-color:${f}44;">
                          ${c?`<img src="${c}" alt="${u}" class="w-full h-full object-cover"/>`:`<div class="w-full h-full flex items-center justify-center text-grey-600 text-[8px] p-0.5 text-center leading-tight">${u.slice(0,5)}</div>`}
                          <!-- Slot colour bottom strip -->
                          <div class="absolute bottom-0 left-0 right-0 h-0.5" style="background:${f};"></div>
                          <!-- Tier badge top-right (shared utility — Roman numeral + slot color) -->
                          ${d?be(d):""}
                        </div>
                        <!-- Cost always visible below icon -->
                        ${v?`<p class="text-[9px] font-semibold text-yellow-400 leading-none text-center">${v.toLocaleString()}</p>`:""}
                        <!-- Tooltip on hover — above icon -->
                        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[60]
                                    hidden group-hover:block pointer-events-none"
                             style="width:220px;">
                          <div class="bg-charcoal-200 border border-charcoal-400 rounded-lg shadow-2xl overflow-hidden">
                            <div class="flex items-center justify-between gap-2 px-3 pt-2.5 pb-1.5"
                                 style="border-bottom:1px solid ${f}44;">
                              <p class="text-white text-xs font-bold leading-tight">${u}</p>
                              ${v?`<span class="text-yellow-400 text-[11px] font-semibold shrink-0">${v.toLocaleString()} 🪙</span>`:""}
                            </div>
                            <div class="px-3 py-2 space-y-1.5">
                              ${g?`<p class="text-grey-400 text-[11px] leading-snug">${g}</p>`:""}
                              ${p.length>0?`
                                <div class="space-y-0.5 pt-1 border-t border-charcoal-400">
                                  ${p.map(b=>`<p class="text-dry-sage-400 text-[11px] font-medium">${b}</p>`).join("")}
                                </div>`:""}
                            </div>
                          </div>
                        </div>
                      </div>`}).join("")}
                </div>
              </div>`}).join("")}
        </div>
      </div>`}renderItemIcons(e,t){return e.map(s=>{const a=this.items.get(s),r=a?re(a):"",n=(a==null?void 0:a.name)??`#${s}`,l=a?st(a):"",o=(a==null?void 0:a.cost)??null,h=a?at(a):[],d=`${t}px`,c=(a==null?void 0:a.item_slot_type)==="weapon"?"#f97316":(a==null?void 0:a.item_slot_type)==="spirit"?"#a855f7":(a==null?void 0:a.item_slot_type)==="vitality"?"#22c55e":"#4b5563";return`
        <div class="relative group shrink-0" style="width:${d};height:${d};">
          <div class="w-full h-full rounded border bg-charcoal-300 overflow-hidden cursor-default"
               style="border-color:${c}33;">
            ${r?`<img src="${r}" alt="${n}" class="w-full h-full object-cover"/>`:`<div class="w-full h-full flex items-center justify-center text-grey-600 text-[9px] p-0.5 text-center leading-tight">${n.slice(0,6)}</div>`}
            <!-- Slot colour bottom strip -->
            <div class="absolute bottom-0 left-0 right-0 h-0.5" style="background:${c};"></div>
          </div>

          <!-- Tooltip — shown on hover, positioned above, anchored to center -->
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[60]
                      hidden group-hover:block pointer-events-none"
               style="width:220px;">
            <div class="bg-charcoal-200 border border-charcoal-400 rounded-lg shadow-2xl overflow-hidden">
              <!-- Header: name + cost -->
              <div class="flex items-center justify-between gap-2 px-3 pt-2.5 pb-1.5"
                   style="border-bottom:1px solid ${c}44;">
                <p class="text-white text-xs font-bold leading-tight">${n}</p>
                ${o?`<span class="text-yellow-400 text-[11px] font-semibold shrink-0">${o.toLocaleString()} 🪙</span>`:""}
              </div>
              <!-- Body: description + stats -->
              <div class="px-3 py-2 space-y-1.5">
                ${l?`<p class="text-grey-400 text-[11px] leading-snug">${l}</p>`:""}
                ${h.length>0?`
                  <div class="space-y-0.5 pt-1 border-t border-charcoal-400">
                    ${h.map(u=>`<p class="text-dry-sage-400 text-[11px] font-medium">${u}</p>`).join("")}
                  </div>`:""}
              </div>
            </div>
          </div>
        </div>`}).join("")}getWeaponItem(){var t,s;const e=(s=(t=this.hero)==null?void 0:t.items)==null?void 0:s.weapon_primary;if(e){for(const a of this.items.values())if(a.class_name===e)return a}}renderOverviewTab(){return this.hero?`
      <div class="p-8 max-w-6xl">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-wide">${this.hero.name??"Hero"} — Overview &amp; Abilities</h2>
          <p class="text-dry-sage-500 text-sm mt-1">Combat statistics and signature abilities.</p>
          <div class="mt-4 h-px bg-gradient-to-r from-dry-sage-400/50 via-charcoal-400 to-transparent"></div>
        </div>

        <div class="mt-6 flex gap-6">

          <!-- ── LEFT: Stat panels ──────────────────────────────────── -->
          <div class="w-52 shrink-0 space-y-5">
            ${this.renderWeaponStatBlock()}
            ${this.renderBaseStatBlock()}
          </div>

          <!-- ── RIGHT: Abilities ───────────────────────────────────── -->
          <div class="flex-1 min-w-0 space-y-4">
            <div>
              <p class="text-[9px] uppercase tracking-widest text-grey-600 font-medium mb-3">Abilities</p>
              <div id="ability-selector">
                ${this.renderAbilitySelector()}
              </div>
            </div>
            <div id="ability-detail-panel">
              ${this.renderAbilityDetail(this.selectedAbilityIdx)}
            </div>
          </div>

        </div>
      </div>`:""}renderWeaponStatBlock(){var a;const e=(a=this.getWeaponItem())==null?void 0:a.weapon_info,t=(r,n=2)=>typeof r=="number"?r.toFixed(n):"—";return`
      <div class="bg-charcoal-200 rounded-xl border border-charcoal-400 overflow-hidden">
        <div class="px-4 py-2.5 border-b border-charcoal-400 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               class="w-3.5 h-3.5 text-orange-400 shrink-0">
            <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>
            <line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/>
            <line x1="3" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="21" y2="12"/>
          </svg>
          <p class="text-[9px] uppercase tracking-widest text-grey-600 font-medium">Weapon Stats</p>
        </div>
        <div class="divide-y divide-charcoal-400">
          ${[["Clip Size",(e==null?void 0:e.clip_size)!=null?String(e.clip_size):"—"],["Bullet Damage",t(e==null?void 0:e.bullet_damage)],["Fire Rate",(e==null?void 0:e.shots_per_second)!=null?`${t(e.shots_per_second)} rnd/s`:"—"],["DPS",t(e==null?void 0:e.damage_per_second)]].map(([r,n])=>`
            <div class="flex items-center justify-between px-4 py-2">
              <span class="text-grey-500 text-xs">${r}</span>
              <span class="text-white text-xs font-semibold tabular-nums">${n}</span>
            </div>`).join("")}
        </div>
      </div>`}renderBaseStatBlock(){var a;const e=((a=this.hero)==null?void 0:a.starting_stats)??{},t=(r,n="")=>{var o;const l=(o=e[r])==null?void 0:o.value;return l!=null?`${l}${n}`:"—"};return`
      <div class="bg-charcoal-200 rounded-xl border border-charcoal-400 overflow-hidden">
        <div class="px-4 py-2.5 border-b border-charcoal-400 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               class="w-3.5 h-3.5 text-green-400 shrink-0">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          <p class="text-[9px] uppercase tracking-widest text-grey-600 font-medium">Base Stats</p>
        </div>
        <div class="grid grid-cols-2">
          ${[["Max Health",t("max_health")],["Move Speed",t("max_move_speed"," m/s")],["Light Melee",t("light_melee_damage")],["Heavy Melee",t("heavy_melee_damage")]].map(([r,n],l)=>`
            <div class="px-3 py-2.5 ${l%2===0?"border-r":""} ${l<2?"border-b":""} border-charcoal-400">
              <p class="text-[9px] text-grey-600 uppercase tracking-wider mb-0.5 leading-none">${r}</p>
              <p class="text-white text-sm font-bold leading-none tabular-nums">${n}</p>
            </div>`).join("")}
        </div>
      </div>`}renderAbilitySelector(){return this.heroAbilities.length?`
      <div class="grid grid-cols-4 gap-3">
        ${this.heroAbilities.map((e,t)=>{const s=this.items.get(e.id),a=(s==null?void 0:s.ability_type)==="ultimate",r=t===this.selectedAbilityIdx,n=re(e);return`
            <button data-ability-idx="${t}"
              class="ability-btn relative flex flex-col items-center gap-2 p-3
                     rounded-xl border bg-charcoal-200 transition-all duration-200 cursor-pointer
                     ${r?"bg-charcoal-300/80":"hover:bg-charcoal-300/40"}"
              style="border-color:${r?a?"rgba(251,191,36,0.7)":"#b0a472":"rgba(73,73,73,1)"};">
              ${a?`
                <span class="absolute top-1.5 right-1.5 text-[7px] font-bold px-1 py-0.5 rounded leading-none"
                      style="background:rgba(250,180,30,0.15);color:#fbbf24;border:1px solid rgba(250,180,30,0.3);">
                  ULT
                </span>`:""}
              <div class="w-16 h-16 rounded-lg overflow-hidden bg-charcoal-300 shrink-0"
                   style="border:1px solid ${a?"rgba(251,191,36,0.2)":"rgba(255,255,255,0.06)"};">
                ${n?`<img src="${n}" alt="${e.name}" class="w-full h-full object-cover"/>`:`<div class="w-full h-full flex items-center justify-center text-grey-600 text-xs font-bold">${t+1}</div>`}
              </div>
              <span class="text-[11px] font-medium text-center leading-tight w-full truncate
                           ${r?"text-white":"text-grey-400"}">${e.name}</span>
            </button>`}).join("")}
      </div>`:'<p class="text-grey-600 text-xs">No ability data available.</p>'}renderAbilityDetail(e){var D,T;const t=this.heroAbilities[e];if(!t)return`
        <div class="bg-charcoal-200 rounded-xl border border-charcoal-400 px-5 py-8 text-center">
          <p class="text-grey-600 text-sm">Select an ability to view its details.</p>
        </div>`;const s=this.items.get(t.id)??{},a=String((s==null?void 0:s.ability_type)??""),r=a==="ultimate",n=(s==null?void 0:s.properties)??{},l=(s==null?void 0:s.description)??{},o=typeof l=="string"?l:l.desc??l.active??l.passive??"",h=o?this.parseAbilityDesc(o):"",d=typeof l=="object"?String(l.quip??""):"",c=y=>y.replace(/<[^>]+>/g,"").replace(/&[a-z]+;/gi," ").replace(/\s+/g," ").trim(),u=(s==null?void 0:s.upgrades)??[],g=y=>{const _=`t${y+1}_desc`,w=typeof l=="object"&&l?l[_]:void 0;if(w)return c(w);const L=u[y],j=(L==null?void 0:L.property_upgrades)??[];return j.length?j.map(R=>{const H=n[R.name],ae=(H==null?void 0:H.label)??R.name,ce=(H==null?void 0:H.postfix)??"",de=typeof R.bonus=="number"?R.bonus:parseFloat(String(R.bonus));let he;return isNaN(de)?he=`+${R.bonus}`:he=`${de>=0?"+":""}${de}${ce}`,`${he} ${ae}`}).join(" · "):null},v=["#c084fc","#a855f7","#7c3aed"],p=[];for(let y=0;y<3;y++){const _=g(y);_&&p.push({tier:`T${y+1}`,text:_,color:v[y]})}const f=(y,_="0")=>y?`${y.value??_}${y.postfix??""}`:_,b=Number(((D=n.AbilityCharges)==null?void 0:D.value)??0),x=Number(((T=n.AbilityCooldownBetweenCharge)==null?void 0:T.value)??-1),k=[{label:"Cooldown",value:f(n.AbilityCooldown)},{label:"Cast Range",value:f(n.AbilityCastRange)},{label:"Duration",value:f(n.AbilityDuration)},...b>0?[{label:"Charges",value:String(b)}]:[],...b>0&&x>0?[{label:"Charge Delay",value:`${x}s`}]:[]],$=new Set(["AbilityUnitTargetLimit","AbilityCastDelay","AbilityChannelTime","AbilityPostCastDuration","ChannelMoveSpeed","AbilityResourceCost","AbilityCooldown","AbilityDuration","AbilityCastRange","AbilityCharges","AbilityCooldownBetweenCharge"]),P=Object.entries(n).filter(([y,_])=>{if($.has(y)||!(_!=null&&_.label))return!1;const w=String(_.value??"");return w&&w!=="0"&&w!=="-1"&&w!=="0%"&&w!=="0m"&&w!=="0s"&&w!=="0.0"}).slice(0,6).map(([,y])=>({label:y.label,value:`${y.value}${y.postfix??""}`})),M=r?"rgba(251,191,36,0.25)":"#494949",S=r?`<span class="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded font-bold uppercase
                      tracking-widest"
               style="background:rgba(250,180,30,0.12);color:#fbbf24;border:1px solid rgba(250,180,30,0.35);">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-2.5 h-2.5">
             <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
           </svg>
           Ultimate
         </span>`:a==="signature"?`<span class="text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest"
               style="background:rgba(176,164,114,0.1);color:#b0a472;border:1px solid rgba(176,164,114,0.25);">
           Signature
         </span>`:"",A=(y,_)=>`
      <div class="flex flex-col items-center justify-center px-4 py-2 rounded-lg min-w-[76px]
                  bg-charcoal-300/60 border border-charcoal-400 text-center">
        <span class="text-[9px] uppercase tracking-widest text-grey-600 mb-0.5">${y}</span>
        <span class="text-white text-sm font-bold leading-none tabular-nums">${_}</span>
      </div>`;return`
      <div class="bg-charcoal-200 rounded-xl overflow-hidden" style="border:1px solid ${M};">

        <!-- ── Header ──────────────────────────────────────────────── -->
        <div class="px-5 py-4 border-b border-charcoal-400"
             style="${r?"background:linear-gradient(to right,rgba(120,53,15,0.22),transparent);":""}">
          <div class="flex items-center gap-3 flex-wrap">
            <h3 class="text-white text-xl font-bold tracking-wide leading-none">${t.name}</h3>
            ${S}
          </div>
          ${d?`<p class="text-grey-500 text-sm mt-1.5 italic leading-snug">${d}</p>`:""}
        </div>

        <!-- ── Description ─────────────────────────────────────────── -->
        <div class="px-5 py-4">
          <p class="text-grey-800 text-sm leading-relaxed">
            ${h||'<span class="text-grey-600">No description available.</span>'}
          </p>
        </div>

        ${p.length?`
        <!-- ── Upgrade Tiers ───────────────────────────────────────── -->
        <div class="px-5 py-3.5 border-t border-charcoal-400 space-y-2">
          <p class="text-xs font-semibold text-grey-700 uppercase tracking-widest mb-3">Ability Upgrades</p>
          ${p.map(y=>`
            <div class="flex items-start gap-2.5">
              <span class="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-sm leading-tight mt-0.5"
                    style="background:${y.color}22;color:${y.color};border:1px solid ${y.color}44;">${y.tier}</span>
              <span class="text-grey-700 text-xs leading-relaxed">${y.text}</span>
            </div>`).join("")}
        </div>`:""}

        <!-- ── Stats Footer ─────────────────────────────────────────── -->
        <div class="px-5 py-4 border-t border-charcoal-400 space-y-3">
          ${P.length?`
          <div class="flex flex-wrap gap-2">
            ${P.map(y=>`
              <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                          bg-charcoal-300/60 border border-charcoal-400">
                <span class="text-grey-500 text-[10px]">${y.label}</span>
                <span class="text-dry-sage-400 text-[10px] font-semibold tabular-nums">${y.value}</span>
              </div>`).join("")}
          </div>`:""}
          <div class="flex flex-wrap gap-2">
            ${k.map(y=>A(y.label,y.value)).join("")}
          </div>
        </div>

      </div>`}parseAbilityDesc(e){const t=e.replace(/<[^>]+>/g," ").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&nbsp;/g," ").replace(/\s+/g," ").trim(),s=n=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
       class="inline w-3 h-3 shrink-0 -mt-0.5" aria-hidden="true">${n}</svg>`,a=[{re:/\b(spirit damage|mystic damage)\b/gi,cls:"text-purple-400",icon:s('<path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>')},{re:/\b(weapon damage|bullet damage)\b/gi,cls:"text-orange-400",icon:s('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/><line x1="3" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="21" y2="12"/>')},{re:/\b(stun(?:ned|s)?)\b/gi,cls:"text-amber-400",icon:s('<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>')},{re:/\b(slow(?:ed|s)?|movement slow)\b/gi,cls:"text-sky-400",icon:s('<polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/>')},{re:/\b(disarm(?:ed)?)\b/gi,cls:"text-red-400",icon:s('<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>')},{re:/\b(ground(?:ed)?)\b/gi,cls:"text-lime-400",icon:s('<circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="16"/><path d="M7 16c0 2.76 2.24 5 5 5s5-2.24 5-5"/><line x1="3" y1="22" x2="21" y2="22"/>')},{re:/\b(silence(?:d)?|silences)\b/gi,cls:"text-violet-400",icon:s('<path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>')},{re:/\b(immobilize[ds]?|root(?:ed)?)\b/gi,cls:"text-teal-400",icon:s('<line x1="12" y1="2" x2="12" y2="22"/><polyline points="7 7 12 2 17 7"/><line x1="2" y1="22" x2="22" y2="22"/>')},{re:/\b(bleed(?:ing)?)\b/gi,cls:"text-rose-400",icon:s('<path d="M12 22a7 7 0 007-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 007 7z"/>')},{re:/\b(burn(?:ing)?|cursed?)\b/gi,cls:"text-fuchsia-400",icon:s('<path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/>')},{re:/\b(sleep(?:ing)?)\b/gi,cls:"text-indigo-400",icon:s('<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>')},{re:/\b(unstoppable)\b/gi,cls:"text-emerald-400",icon:s('<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>')}],r=new RegExp(a.map(n=>`(?:${n.re.source})`).join("|"),"gi");return t.replace(r,n=>{const l=a.find(o=>new RegExp(`^(?:${o.re.source})$`,"i").test(n));return l?`<span class="${l.cls} inline-flex items-center gap-0.5 font-semibold">${l.icon}${n}</span>`:n})}bindAbilityEvents(){var e;this.currentTab==="overview"&&((e=this.container)==null||e.querySelectorAll(".ability-btn").forEach(t=>{t.addEventListener("click",()=>{var n,l;const s=parseInt(t.dataset.abilityIdx??"",10);if(isNaN(s)||s===this.selectedAbilityIdx)return;this.selectedAbilityIdx=s;const a=(n=this.container)==null?void 0:n.querySelector("#ability-selector");a&&(a.innerHTML=this.renderAbilitySelector());const r=(l=this.container)==null?void 0:l.querySelector("#ability-detail-panel");r&&(r.innerHTML=this.renderAbilityDetail(this.selectedAbilityIdx)),this.bindAbilityEvents()})}))}renderSkillPathTab(){var a;if(this.abilityStats.length===0)return`<div class="flex flex-col items-center justify-center gap-3 py-24 text-grey-500">
        <p class="text-sm">No skill path data available for this hero.</p>
      </div>`;const e=new Map(this.heroAbilities.map((r,n)=>[r.id,n]));return`
      <div class="p-8 space-y-6 max-w-5xl">
        <div>
          <h2 class="text-white font-semibold text-lg mb-0.5">${`${((a=this.hero)==null?void 0:a.name)??""} — Skills`}</h2>
          <p class="text-grey-500 text-sm">
            Skill builds for all games played on the latest patch.
            Top ${this.abilityStats.length} most common upgrade sequences (≥ 200 matches).
          </p>
        </div>
        ${this.abilityStats.map((r,n)=>this.renderSkillVariation(r,n,e)).join("")}
      </div>`}renderSkillVariation(e,t,s){const a=e.matches>0?(e.wins/e.matches*100).toFixed(1):"—",r=e.abilities.length,n=22,l=Array.from({length:4},()=>Array(r).fill(!1));return e.abilities.forEach((o,h)=>{const d=s.get(o);d!==void 0&&(l[d][h]=!0)}),`
      <div class="bg-charcoal-200 rounded-xl border border-charcoal-400 overflow-hidden">
        <!-- Variation header -->
        <div class="flex items-center justify-between px-4 py-2.5 bg-charcoal-300/60 border-b border-charcoal-400">
          <span class="text-grey-400 text-xs font-medium">Build Variation ${t+1}</span>
          <div class="flex items-center gap-5 text-xs">
            <span class="text-white font-bold">${a}% WR</span>
            <span class="text-grey-500">Games: ${e.matches.toLocaleString()}</span>
          </div>
        </div>

        <!-- Skill grid -->
        <div class="p-4 overflow-x-auto">
          <div class="inline-block min-w-full">
            <!-- Step number header -->
            <div class="flex items-center mb-1" style="padding-left:48px;">
              ${Array.from({length:r},(o,h)=>`
                <div class="text-[9px] text-grey-600 text-center shrink-0"
                     style="width:${n}px;">${h+1}</div>`).join("")}
            </div>

            <!-- Ability rows -->
            ${this.heroAbilities.map((o,h)=>{const d=rt[h]??rt[0],c=re(o);return`
                <div class="flex items-center mb-1">
                  <!-- Ability icon -->
                  <div class="shrink-0 mr-2" style="width:40px;height:40px;">
                    <div class="w-full h-full rounded border border-charcoal-400 bg-charcoal-300 overflow-hidden"
                         title="${o.name}">
                      ${c?`<img src="${c}" alt="${o.name}" class="w-full h-full object-cover"/>`:`<div class="w-full h-full flex items-center justify-center text-grey-500 text-[10px]">${h+1}</div>`}
                    </div>
                  </div>

                  <!-- Grid cells -->
                  ${l[h].map(u=>`
                    <div class="shrink-0 flex items-center justify-center rounded-sm"
                         style="width:${n}px;height:${n}px;background:${u?d+"22":"transparent"};">
                      ${u?`<img src="${pt}" alt="" class="w-3.5 h-3.5 object-contain" />`:""}
                    </div>`).join("")}
                </div>`}).join("")}

            ${this.heroAbilities.length===0?`
              <p class="text-grey-600 text-xs py-2 pl-12">Ability icons unavailable — sequence data only.</p>
              <div class="flex gap-1 pl-12 flex-wrap">
                ${e.abilities.map((o,h)=>`
                  <span class="text-[10px] text-grey-500 bg-charcoal-300 px-1.5 py-0.5 rounded border border-charcoal-400">
                    ${h+1}:${o}
                  </span>`).join("")}
              </div>`:""}
          </div>
        </div>
      </div>`}renderPlaceholder(e){return`
      <div class="flex flex-col items-center justify-center gap-3 py-24 text-grey-500">
        <div class="text-4xl opacity-30">🔧</div>
        <p class="text-sm">${e} — Coming soon</p>
      </div>`}renderLoreTab(){var n,l,o,h,d;if(!this.hero)return"";const e=this.hero.name??"Unknown Hero",t=(n=this.hero.description)==null?void 0:n.lore,s=(l=this.hero.description)==null?void 0:l.role,a=(o=this.hero.description)==null?void 0:o.playstyle;return`
      <div class="relative w-full overflow-hidden" style="min-height:520px;">
        <div class="absolute inset-0"
             style="background-image:url('${((h=this.hero.images)==null?void 0:h.background_image_webp)??((d=this.hero.images)==null?void 0:d.background_image)??""}');background-size:cover;background-position:center top;"></div>
        <div class="absolute inset-0"
             style="background:linear-gradient(to bottom,rgba(0,0,0,0.05) 0%,rgba(0,0,0,0.35) 40%,rgba(18,18,18,0.93) 65%,rgba(18,18,18,1) 100%);"></div>
        <div class="relative z-10 flex flex-col justify-end px-10 pt-64 pb-10 space-y-4" style="min-height:520px;">
          <h1 class="text-5xl font-extrabold text-white tracking-wide leading-none">${e}</h1>
          ${s?`<span class="inline-block self-start text-[10px] font-semibold uppercase tracking-widest text-dry-sage-400 bg-dry-sage-100 px-2 py-0.5 rounded border border-dry-sage-400/30">${s}</span>`:""}
          ${t?`
            <div class="max-w-3xl space-y-1">
              <p class="text-[9px] uppercase tracking-widest text-grey-500 font-medium">Lore</p>
              <p class="text-grey-300 text-sm leading-relaxed whitespace-pre-line">${t}</p>
            </div>`:`
            <p class="text-grey-500 text-sm">No lore available for this hero.</p>`}
          ${a?`
            <div class="max-w-3xl border-t border-white/10 pt-4 space-y-1">
              <p class="text-[9px] uppercase tracking-widest text-grey-500 font-medium">Playstyle</p>
              <p class="text-grey-300 text-sm leading-relaxed">${a}</p>
            </div>`:""}
        </div>
      </div>`}async fetchItemsData(){var e,t;if(!(!this.hero||this.itemsLoading)){this.itemsLoading=!0,this.itemsError=!1,this.refreshTabContent();try{if(this.patchDays.length===0){const g=await fetch(`${G}/v1/patches/big-days`).then(v=>v.ok?v.json():Promise.resolve([])).catch(()=>[]);this.patchDays=Array.isArray(g)?g.sort():[]}this.itemsPeriod==="latest"&&this.patchDays.length>0&&(this.itemsPeriod=this.patchDays[this.patchDays.length-1]);const{curStart:s,curEnd:a,refStart:r,refEnd:n}=this.getPeriodTimestamps(),l=g=>g.ok?g.json():Promise.resolve([]),[o,h,d,c]=await Promise.all([fetch(this.buildItemStatsUrl(s,a)).then(l),fetch(this.buildItemStatsUrl(r,n)).then(l),fetch(this.buildHeroStatsUrl(s,a)).then(l),fetch(this.buildHeroStatsUrl(r,n)).then(l)]);this.itemsCurrentStats=Array.isArray(o)?o:[],this.itemsRefStats=Array.isArray(h)?h:[];const u=this.hero.id;this.heroMatchesCur=((e=(Array.isArray(d)?d:[]).find(g=>g.hero_id===u))==null?void 0:e.matches)??0,this.heroMatchesRef=((t=(Array.isArray(c)?c:[]).find(g=>g.hero_id===u))==null?void 0:t.matches)??0,this.itemsLoaded=!0}catch{this.itemsError=!0}finally{this.itemsLoading=!1,this.refreshTabContent()}}}buildItemStatsUrl(e,t){const s=new URLSearchParams;return s.set("hero_ids",String(this.hero.id)),e>0&&s.set("min_unix_timestamp",String(e)),t>0&&s.set("max_unix_timestamp",String(t)),this.appendBadgeParams(s),`${G}/v1/analytics/item-stats?${s}`}buildHeroStatsUrl(e,t){const s=new URLSearchParams;return e>0&&s.set("min_unix_timestamp",String(e)),t>0&&s.set("max_unix_timestamp",String(t)),this.appendBadgeParams(s),`${G}/v1/analytics/hero-stats?${s}`}appendBadgeParams(e){if(this.itemsRank.mode==="all")return;const t=W.find(s=>s.tier===this.itemsRank.tier);t&&(e.set("min_average_badge",String(t.badgeMin)),this.itemsRank.mode==="exact"&&e.set("max_average_badge",String(t.badgeMax)))}getPeriodTimestamps(){const e=Math.floor(Date.now()/1e3),t=86400,s={"7d":7,"14d":14,"30d":30,"90d":90};if(s[this.itemsPeriod]!==void 0){const d=s[this.itemsPeriod]*t;return{curStart:e-d,curEnd:e,refStart:e-2*d,refEnd:e-d}}const a=this.itemsPeriod==="latest"?this.patchDays[this.patchDays.length-1]??null:this.itemsPeriod;if(!a)return{curStart:e-30*t,curEnd:0,refStart:e-60*t,refEnd:e-30*t};const r=this.patchDays.indexOf(a),n=Math.floor(new Date(a).getTime()/1e3),l=r>=0&&r<this.patchDays.length-1?Math.floor(new Date(this.patchDays[r+1]).getTime()/1e3):0,o=r>0?this.patchDays[r-1]:null,h=o?Math.floor(new Date(o).getTime()/1e3):n-14*t;return{curStart:n,curEnd:l,refStart:h,refEnd:n}}computeItemRows(){const e=new Map(this.itemsCurrentStats.map(a=>[a.item_id,a])),t=new Map(this.itemsRefStats.map(a=>[a.item_id,a])),s=[];for(const[a,r]of e){const n=this.items.get(a);if(!(n!=null&&n.item_slot_type))continue;const l=n.item_tier??0;if(l>0&&!this.itemsTiers.has(l))continue;const o=t.get(a),h=r.matches>0?r.wins/r.matches*100:0,d=o&&o.matches>0?o.wins/o.matches*100:0,c=this.heroMatchesCur>0?r.matches/this.heroMatchesCur*100:0,u=o&&this.heroMatchesRef>0?o.matches/this.heroMatchesRef*100:0;s.push({itemId:a,wins:r.wins,losses:r.losses,matches:r.matches,winRate:h,winRateChange:o?h-d:0,usagePct:c,usageChange:o?c-u:0})}return s.sort((a,r)=>{var l,o,h,d;let n=0;switch(this.itemsSortCol){case"name":n=(((l=this.items.get(a.itemId))==null?void 0:l.name)??"").localeCompare(((o=this.items.get(r.itemId))==null?void 0:o.name)??"");break;case"cost":n=(((h=this.items.get(a.itemId))==null?void 0:h.cost)??0)-(((d=this.items.get(r.itemId))==null?void 0:d.cost)??0);break;case"winRate":n=a.winRate-r.winRate;break;case"winRateChange":n=a.winRateChange-r.winRateChange;break;case"usage":n=a.usagePct-r.usagePct;break;case"usageChange":n=a.usageChange-r.usageChange;break;case"winloss":n=a.wins-r.wins;break}return this.itemsSortDir==="desc"?-n:n}),s}renderItemsTab(){if(!this.hero)return"";const e=this.hero.name??"Hero";return this.itemsError?`
        <div class="flex flex-col items-center justify-center gap-3 py-24 text-grey-500">
          <div class="w-10 h-10 rounded-full border border-charcoal-400 flex items-center justify-center text-grey-500 text-lg">!</div>
          <p class="text-sm">Failed to load item statistics.</p>
          <button id="items-retry-btn"
            class="px-4 py-2 bg-charcoal-300 hover:bg-charcoal-200 text-grey-300 text-sm rounded-lg border border-charcoal-400 transition-colors">
            Retry
          </button>
        </div>`:`
      <div class="p-8 space-y-5 max-w-6xl">
        <!-- Title + description -->
        <div>
          <h2 class="text-2xl font-bold text-white tracking-wide">${e} — Items</h2>
          <p class="text-dry-sage-500 text-sm mt-1">
            Analyze the meta trends for all items used on ${e}, filtering by rank,
            item type, item cost, and date range to uncover which items are most popular
            and how well they perform.
          </p>
          <div class="mt-4 h-px bg-gradient-to-r from-dry-sage-400/50 via-charcoal-400 to-transparent"></div>
        </div>

        <!-- Filter bar -->
        ${this.renderItemsFilters()}

        <!-- Table or skeleton -->
        ${this.itemsLoading?this.renderItemsTableSkeleton():this.renderItemsTable(this.computeItemRows())}
      </div>`}isFiltered(){const e=this.patchDays.length>0?this.patchDays[this.patchDays.length-1]:"",t=this.itemsPeriod!==e&&this.itemsPeriod!=="latest",s=this.itemsRank.mode!=="all",a=this.itemsTiers.size!==4||![1,2,3,4].every(r=>this.itemsTiers.has(r));return t||s||a}renderItemsFilters(){const e=W.map(a=>`
      <option value="${a.tier}"
        ${this.itemsRank.mode==="exact"&&this.itemsRank.tier===a.tier?"selected":""}>
        ${a.name}
      </option>
      <option value="${a.tier}+"
        ${this.itemsRank.mode==="plus"&&this.itemsRank.tier===a.tier?"selected":""}>
        ${a.name} +
      </option>`).join(""),t=this.patchDays.slice(-7).reverse();return`
      <div class="flex items-center gap-3 flex-wrap">
        <!-- Period / Patch selector — shows up to 7 past patches + relative options -->
        <select id="items-period-select"
          class="bg-charcoal-200 border border-charcoal-400 text-grey-300 text-sm rounded-lg px-3 py-2
                 cursor-pointer hover:border-charcoal-300 focus:outline-none focus:border-dry-sage-400 transition-colors">
          ${t.length>0?`<optgroup label="Patches">
          ${t.map((a,r)=>`
            <option value="${a}" ${this.itemsPeriod===a?"selected":""}>
              ${a}${r===0?" — Latest Patch":""}
            </option>`).join("")}
         </optgroup>`:'<option value="latest" selected>Latest Patch</option>'}
          <optgroup label="Relative Period">
            <option value="7d"  ${this.itemsPeriod==="7d"?"selected":""}>Last 7 Days</option>
            <option value="14d" ${this.itemsPeriod==="14d"?"selected":""}>Last 14 Days</option>
            <option value="30d" ${this.itemsPeriod==="30d"?"selected":""}>Last Month</option>
            <option value="90d" ${this.itemsPeriod==="90d"?"selected":""}>3 Last Months</option>
          </optgroup>
        </select>

        <!-- Rank selector -->
        <select id="items-rank-select"
          class="bg-charcoal-200 border border-charcoal-400 text-grey-300 text-sm rounded-lg px-3 py-2
                 cursor-pointer hover:border-charcoal-300 focus:outline-none focus:border-dry-sage-400 transition-colors">
          <option value="all" ${this.itemsRank.mode==="all"?"selected":""}>All Ranks</option>
          ${e}
        </select>

        <!-- Tier toggle buttons (multi-select, client-side filter) -->
        <div class="flex items-center gap-1">
          ${[1,2,3,4].map(a=>`
            <button data-tier="${a}"
              class="items-tier-btn px-3 py-1.5 text-sm font-semibold rounded border transition-colors
                ${this.itemsTiers.has(a)?"bg-dry-sage-400/20 border-dry-sage-400 text-dry-sage-400":"bg-charcoal-200 border-charcoal-400 text-grey-500 hover:border-charcoal-300 hover:text-grey-300"}">
              T${a}
            </button>`).join("")}
        </div>

        <!-- Refresh button — enabled only when a non-default filter is active -->
        ${(()=>{const a=this.isFiltered();return`<button id="items-refresh-btn" ${a?"":"disabled"}
            class="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded border transition-colors
              ${a?"bg-dry-sage-400/20 border-dry-sage-400 text-dry-sage-400 hover:bg-dry-sage-400/30 cursor-pointer":"bg-charcoal-200 border-charcoal-400 text-grey-600 cursor-not-allowed opacity-50"}">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M4 4v5h5M20 20v-5h-5M4.93 14A8 8 0 1020 12" />
            </svg>
            Refresh
          </button>`})()}
      </div>`}renderItemsTableSkeleton(){return`
      <div class="overflow-x-auto rounded-xl border border-charcoal-400 animate-pulse">
        <div class="bg-charcoal-300 h-10 w-full border-b border-charcoal-400 rounded-t-xl"></div>
        ${Array.from({length:8}).map((e,t)=>`
          <div class="flex items-center gap-4 px-4 py-3 border-b border-charcoal-400 ${t%2===0?"bg-charcoal-100":"bg-charcoal-200/40"}">
            <div class="w-9 h-9 rounded bg-charcoal-300 shrink-0"></div>
            <div class="h-3 w-32 rounded bg-charcoal-300"></div>
            <div class="ml-auto flex items-center gap-6">
              ${Array.from({length:5}).map(()=>'<div class="h-3 w-14 rounded bg-charcoal-300"></div>').join("")}
            </div>
          </div>`).join("")}
      </div>`}renderItemsTable(e){return e.length===0?`
        <div class="flex flex-col items-center justify-center gap-3 py-16 text-grey-500">
          <p class="text-sm">No item data available for the selected filters.</p>
        </div>`:`
      <div class="overflow-x-auto rounded-xl border border-charcoal-400">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="bg-charcoal-300 border-b border-charcoal-400">
              ${this.sortTh("Item","name","left")}
              ${this.sortTh("Cost","cost","right")}
              ${this.sortTh("Win Rate","winRate","left")}
              ${this.sortTh("WR Change","winRateChange","right")}
              ${this.sortTh("Usage","usage","left")}
              ${this.sortTh("Usage Change","usageChange","right")}
              ${this.sortTh("Win / Loss","winloss","right")}
            </tr>
          </thead>
          <tbody>
            ${e.map((t,s)=>this.renderItemRow(t,s)).join("")}
          </tbody>
        </table>
      </div>`}renderItemRow(e,t){const s=this.items.get(e.itemId),a=s?re(s):"",r=(s==null?void 0:s.name)??`#${e.itemId}`,n=(s==null?void 0:s.cost)??null,l=He(s==null?void 0:s.item_slot_type);return`
      <tr class="border-b border-charcoal-400 ${t%2===0?"bg-charcoal-100":"bg-charcoal-200/40"} hover:bg-charcoal-300/50 transition-colors">

        <!-- Item: icon + tier badge + name -->
        <td class="px-4 py-3">
          <div class="flex items-center gap-3">
            <div class="relative shrink-0" style="width:36px;height:36px;">
              <div class="w-full h-full rounded border bg-charcoal-300 overflow-hidden"
                   style="border-color:${l}55;">
                ${a?`<img src="${a}" alt="${r}" class="w-full h-full object-cover"/>`:""}
                <div class="absolute bottom-0 left-0 right-0 h-0.5" style="background:${l};"></div>
                ${s?be(s):""}
              </div>
            </div>
            <span class="text-grey-900 text-sm font-medium">${r}</span>
          </div>
        </td>

        <!-- Cost: souls icon + value -->
        <td class="px-4 py-3 text-right">
          ${n!==null?`
            <span class="inline-flex items-center gap-1.5 justify-end">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background:#3b82f6;box-shadow:0 0 4px #3b82f655;"></span>
              <span class="text-blue-400 font-semibold text-xs">${n.toLocaleString()}</span>
            </span>`:'<span class="text-grey-600 text-xs">—</span>'}
        </td>

        <!-- Win Rate: percentage + progress bar -->
        <td class="px-4 py-3">
          <div class="flex flex-col gap-1" style="min-width:100px;">
            <span class="text-white text-sm font-semibold">${e.winRate.toFixed(2)}%</span>
            <div class="h-1 rounded-full bg-charcoal-400" style="width:100px;">
              <div class="h-full rounded-full bg-green-500 transition-all"
                   style="width:${Math.min(e.winRate,100).toFixed(1)}%;"></div>
            </div>
          </div>
        </td>

        <!-- Win Rate Change -->
        <td class="px-4 py-3 text-right">
          <span class="${this.changeClass(e.winRateChange)} text-sm">${this.formatChange(e.winRateChange)}</span>
        </td>

        <!-- Usage: percentage + progress bar -->
        <td class="px-4 py-3">
          <div class="flex flex-col gap-1" style="min-width:100px;">
            <span class="text-white text-sm font-semibold">${e.usagePct.toFixed(2)}%</span>
            <div class="h-1 rounded-full bg-charcoal-400" style="width:100px;">
              <div class="h-full rounded-full bg-green-500 transition-all"
                   style="width:${Math.min(e.usagePct,100).toFixed(1)}%;"></div>
            </div>
          </div>
        </td>

        <!-- Usage Change -->
        <td class="px-4 py-3 text-right">
          <span class="${this.changeClass(e.usageChange)} text-sm">${this.formatChange(e.usageChange)}</span>
        </td>

        <!-- Win / Loss volume -->
        <td class="px-4 py-3 text-right">
          <span class="text-grey-400 text-xs font-medium whitespace-nowrap">
            ${this.formatK(e.wins)} / ${this.formatK(e.losses)}
          </span>
        </td>
      </tr>`}sortTh(e,t,s){const a=this.itemsSortCol===t,r=a?this.itemsSortDir==="desc"?"↓":"↑":"↕";return`
      <th class="px-4 py-3 ${s==="right"?"text-right":"text-left"}">
        <button data-sort="${t}" class="items-sort-btn flex items-center gap-1 text-[10px] uppercase tracking-widest font-medium transition-colors whitespace-nowrap ${a?"text-dry-sage-400":"text-grey-500 hover:text-grey-300"} ${s==="right"?"ml-auto":""}">
          ${e}
          <span class="${a?"text-dry-sage-400":"text-grey-700"} text-[11px]">${r}</span>
        </button>
      </th>`}changeClass(e){return e>=5?"text-emerald-500 font-semibold":e>0?"text-green-400":e===0?"text-grey-500":e>-5?"text-orange-400":"text-red-600 font-bold"}formatChange(e){return e===0?"—":`${e>0?"+":""}${e.toFixed(2)}%`}formatK(e){return e>=1e3?`${(e/1e3).toFixed(1)}K`:String(e)}refreshTabContent(){var t;const e=(t=this.container)==null?void 0:t.querySelector("#hero-tab-content");e&&(e.innerHTML=this.renderTabContent(),this.bindBuildEvents(),this.bindItemsEvents())}bindEvents(){var e;(e=this.container)==null||e.querySelectorAll(".hero-tab-btn").forEach(t=>{t.addEventListener("click",()=>{const s=t.dataset.tab;s&&s!==this.currentTab&&(this.currentTab=s,this.render(),s==="items"&&!this.itemsLoaded&&!this.itemsLoading&&this.fetchItemsData())})}),this.bindBuildEvents(),this.bindItemsEvents(),this.bindAbilityEvents()}bindBuildEvents(){var e;(e=this.container)==null||e.querySelectorAll(".build-selector-btn").forEach(t=>{t.addEventListener("click",()=>{var r;const s=parseInt(t.dataset.buildIdx??"",10);if(isNaN(s)||s===this.selectedBuildIdx)return;this.selectedBuildIdx=s;const a=(r=this.container)==null?void 0:r.querySelector("#hero-tab-content");a&&(a.innerHTML=this.renderBuildsTab(),this.bindBuildEvents())})})}bindItemsEvents(){var s,a,r,n,l,o,h,d;if(this.currentTab!=="items")return;const e=(s=this.container)==null?void 0:s.querySelector("#items-period-select");e==null||e.addEventListener("change",()=>{this.itemsPeriod=e.value,this.itemsLoaded=!1,this.itemsCurrentStats=[],this.itemsRefStats=[],this.fetchItemsData()});const t=(a=this.container)==null?void 0:a.querySelector("#items-rank-select");t==null||t.addEventListener("change",()=>{const c=t.value;c==="all"?this.itemsRank={mode:"all",tier:0}:c.endsWith("+")?this.itemsRank={mode:"plus",tier:parseInt(c)}:this.itemsRank={mode:"exact",tier:parseInt(c)},this.itemsLoaded=!1,this.itemsCurrentStats=[],this.itemsRefStats=[],this.fetchItemsData()}),(r=this.container)==null||r.querySelectorAll(".items-sort-btn").forEach(c=>{c.addEventListener("click",()=>{const u=c.dataset.sort;this.itemsSortCol===u?this.itemsSortDir=this.itemsSortDir==="desc"?"asc":"desc":(this.itemsSortCol=u,this.itemsSortDir="desc"),this.refreshTabContent()})}),(n=this.container)==null||n.querySelectorAll(".items-tier-btn").forEach(c=>{c.addEventListener("click",()=>{const u=parseInt(c.dataset.tier??"");isNaN(u)||(this.itemsTiers.has(u)?this.itemsTiers.delete(u):this.itemsTiers.add(u),this.refreshTabContent())})}),(o=(l=this.container)==null?void 0:l.querySelector("#items-retry-btn"))==null||o.addEventListener("click",()=>{this.itemsError=!1,this.fetchItemsData()}),(d=(h=this.container)==null?void 0:h.querySelector("#items-refresh-btn"))==null||d.addEventListener("click",()=>{this.isFiltered()&&(this.itemsLoaded=!1,this.itemsCurrentStats=[],this.itemsRefStats=[],this.fetchItemsData())})}}class aa{constructor(){m(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-6">
            Meta & Builds
          </h1>
          <p class="text-grey-300 mb-8">
            Items à haut "Win boost" et section "Best Value".
          </p>
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600">
            <p class="text-grey-400">
              Page en développement - Meta & Builds
            </p>
          </div>
        </div>
      </div>
    `)}}const ia={yellow:{border:"border-l-yellow-400",dot:"bg-yellow-400",text:"text-yellow-400"},blue:{border:"border-l-blue-400",dot:"bg-blue-400",text:"text-blue-400"},green:{border:"border-l-emerald-400",dot:"bg-emerald-400",text:"text-emerald-400"}};function ke(i){return i.toFixed(1)}class ra{static render(e){var $,P,M,S,A,D,T;const{player:t,laneColor:s}=e,a=ia[s??""]??{border:"border-l-grey-600",dot:"bg-grey-600"},r=(($=t.steamProfile)==null?void 0:$.personaname)??t.name??`Player ${t.player_slot+1}`,n=((P=t.heroData)==null?void 0:P.name)??t.hero_name??"—",l=((M=t.steamProfile)==null?void 0:M.profileurl)??`https://steamcommunity.com/profiles/${BigInt(t.account_id)+BigInt("76561197960265728")}`,o=((A=(S=t.heroData)==null?void 0:S.images)==null?void 0:A.icon_image_small_webp)??((T=(D=t.heroData)==null?void 0:D.images)==null?void 0:T.icon_image_small)??"",h=t.heroMatchesPlayed??0,d=t.heroWinrate!==void 0?Math.round(t.heroWinrate):null,c=t.heroAvgKills!==void 0?ke(t.heroAvgKills):"—",u=t.heroAvgDeaths!==void 0?ke(t.heroAvgDeaths):"—",g=t.heroAvgAssists!==void 0?ke(t.heroAvgAssists):"—",v=t.heroAvgKills!==void 0&&t.heroAvgDeaths!==void 0&&t.heroAvgAssists!==void 0?ke((t.heroAvgKills+t.heroAvgAssists)/Math.max(t.heroAvgDeaths,.1)):null,p=t.rankName??null,f=t.rankImageUrl??null,b=t.rankTopPercent!==void 0?t.rankTopPercent:null,x=t.activity12h,k=t.activity30d;return`
      <div class="
        relative h-full flex flex-col
        bg-[#1a1f24] rounded-lg
        border border-[#2a2f35] border-l-4 ${a.border}
        hover:border-[#3a4048] transition-colors duration-200
        overflow-hidden
      ">
        <!-- HEADER: player name (clickable → Steam profile) + lane dot -->
        <div class="flex items-center justify-between px-3 pt-3 pb-1 shrink-0">
          <a
            href="${l}"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white font-bold text-base leading-tight truncate flex-1 min-w-0 hover:text-frosted-mint-400 transition-colors"
            title="Voir le profil Steam"
          >${r}</a>
          <span class="w-2 h-2 rounded-full ml-2 shrink-0 ${a.dot}"></span>
        </div>

        <!-- HERO SECTION: icon + "as Hero (Xp)" + winrate -->
        <div class="flex items-center gap-2 px-3 pb-2 shrink-0">
          <!-- Hero icon: icon_image_small_webp from /v1/assets/heroes/{id} (full CDN URL) -->
          ${o?`<div class="w-10 h-10 rounded-full bg-[#111518] border-2 border-[#2a2f35] overflow-hidden shrink-0 flex items-center justify-center">
                 <img src="${o}" alt="${n}" class="w-full h-full object-cover" />
               </div>`:`<div class="w-10 h-10 rounded-full bg-[#111518] border-2 border-[#2a2f35] shrink-0 flex items-center justify-center">
                 <svg class="w-5 h-5 text-[#555]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                 </svg>
               </div>`}
          <div class="flex flex-col min-w-0">
            <span class="text-[#c9d1d9] text-sm font-medium leading-tight truncate">
              as ${n}${h>0?` (${h}p)`:""}
            </span>
            ${d!==null?`<span class="text-[#9ca3af] text-xs leading-tight">
                   ${d}% Win
                 </span>`:""}
          </div>
        </div>

        <!-- DIVIDER -->
        <div class="mx-3 border-t border-[#2a2f35] mb-2 shrink-0"></div>

        <!-- KDA SECTION -->
        <div class="px-3 pb-2 shrink-0">
          <div class="flex items-center justify-center gap-1 text-sm font-bold leading-tight">
            <span class="text-emerald-400">${c}</span>
            <span class="text-[#555]">/</span>
            <span class="text-red-400">${u}</span>
            <span class="text-[#555]">/</span>
            <span class="text-yellow-400">${g}</span>
          </div>
          <p class="text-center text-[10px] text-[#555] mt-0.5 leading-tight">
            ${v!==null?`KDA (${v})`:"KDA (—)"}
          </p>
        </div>

        <!-- DIVIDER -->
        <div class="mx-3 border-t border-[#2a2f35] mb-2 shrink-0"></div>

        <!-- RANK SECTION -->
        <div class="flex items-center gap-2 px-3 pb-2 shrink-0">
          ${f?`<img src="${f}" alt="${p??"rank"}" class="w-8 h-8 object-contain shrink-0" />`:'<div class="w-8 h-8 rounded bg-[#111518] border border-[#2a2f35] shrink-0"></div>'}
          <div class="flex flex-col min-w-0">
            <span class="text-white text-xs font-semibold leading-tight truncate">
              ${p??"—"}
            </span>
            ${b!==null?`<span class="text-[#9ca3af] text-[10px] leading-tight">Top ${b}%</span>`:""}
          </div>
        </div>

        <!-- DIVIDER -->
        <div class="mx-3 border-t border-[#2a2f35] mb-2 shrink-0"></div>

        <!-- ACTIVITY: 12H + 30D -->
        <div class="flex gap-2 px-3 pb-2 shrink-0">
          <div class="flex-1 bg-[#111518] rounded px-2 py-1">
            <p class="text-[10px] text-[#555] leading-tight font-medium">12H</p>
            <p class="text-[11px] text-[#9ca3af] leading-tight">
              ${x!==void 0?`${x.games} games · ${x.wins} wins`:"— games · — wins"}
            </p>
          </div>
          <div class="flex-1 bg-[#111518] rounded px-2 py-1">
            <p class="text-[10px] text-[#555] leading-tight font-medium">30D</p>
            <p class="text-[11px] text-[#9ca3af] leading-tight">
              ${k!==void 0?`${k.games} games · ${k.wins} wins`:"— games · — wins"}
            </p>
          </div>
        </div>

        <!-- TAG PLACEHOLDER (future: WARMING UP / IN GAME / etc.) -->
        <div class="mt-auto px-3 pb-3 shrink-0">
          <!-- tag slot: status logic to be wired from MatchHistory endpoint -->
        </div>
      </div>
    `}static mount(e,t){e.innerHTML=this.render(t)}}const Y="https://api.deadlock-api.com",nt=[80659633,84419762,80457157],na=12*60*60,oa=30*24*60*60;class la{constructor(){m(this,"container",null);m(this,"isLoading",!1);m(this,"matchData",null);m(this,"heroCache",new Map);m(this,"detectedMatchId",null);m(this,"currentGameState","GAME_CLOSED");m(this,"isDemoMode",!1);m(this,"demoIndex",0);m(this,"rankDistribution",[]);m(this,"rankAssets",[])}mount(e){this.container=e,this.isDemoMode=localStorage.getItem("demoModeEnabled")==="true",this.renderCurrentState(),this.syncStateFromMain()}handleGameStateChanged(e,t){e==="GAME_IN_MATCH"&&t?(this.detectedMatchId=String(t),localStorage.setItem("detectedMatchId",this.detectedMatchId)):e==="GAME_CLOSED"&&(this.detectedMatchId=null,localStorage.removeItem("detectedMatchId"));const s=this.currentGameState;this.currentGameState=e,!(!this.container||s===e)&&this.transitionToState(e)}handleDetectedMatch(e){this.handleGameStateChanged("GAME_IN_MATCH",e)}clearDetectedMatchId(){this.handleGameStateChanged("GAME_CLOSED")}async syncStateFromMain(){var e;if((e=window.api)!=null&&e.getGameStatus)try{const t=await window.api.getGameStatus(),s=t.state??(t.inMatch?"GAME_IN_MATCH":t.isRunning?"GAME_MENU":"GAME_CLOSED");if(s===this.currentGameState)return;s==="GAME_IN_MATCH"&&t.matchId&&(this.detectedMatchId=String(t.matchId),localStorage.setItem("detectedMatchId",this.detectedMatchId)),this.currentGameState=s,this.renderCurrentState()}catch{}}renderCurrentState(){this.isDemoMode=localStorage.getItem("demoModeEnabled")==="true",this.isDemoMode||this.currentGameState==="GAME_IN_MATCH"?(this.renderInitialLoading(),this.loadMatchData()):this.currentGameState==="GAME_MENU"?this.renderMenuView():this.renderClosedView()}async transitionToState(e){this.container&&(this.container.style.transition="opacity 0.3s ease",this.container.style.opacity="0",await new Promise(t=>setTimeout(t,300)),this.container&&(e==="GAME_IN_MATCH"?(this.renderInitialLoading(),this.loadMatchData()):e==="GAME_MENU"?this.renderMenuView():this.renderClosedView(),this.container.style.opacity="1"))}renderClosedView(){this.container&&(this.container.innerHTML=`
      <div class="bg-charcoal-100 min-h-screen h-screen overflow-hidden flex flex-col items-center justify-center">
        <div class="text-center max-w-lg px-8">
          <div class="w-16 h-16 rounded-full bg-charcoal-200 border border-grey-600 flex items-center justify-center mx-auto mb-8">
            <svg class="w-8 h-8 text-grey-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-white mb-3">No Active Game Detected</h1>
          <p class="text-grey-400 mb-8">We're not detecting any live game data at the moment.</p>
          <div class="bg-charcoal-200 rounded-lg border border-grey-600 p-5 text-left mb-4">
            <h3 class="text-white font-semibold mb-3">Why is this happening?</h3>
            <ul class="text-grey-400 text-sm space-y-2 list-disc list-inside">
              <li>You may not be in an active Deadlock match</li>
              <li>The game client may not be running</li>
            </ul>
          </div>
          <div class="bg-charcoal-200 rounded-lg border border-grey-600 p-5 text-left">
            <h3 class="text-white font-semibold mb-3">What to do next:</h3>
            <ul class="text-grey-400 text-sm space-y-2 list-disc list-inside">
              <li>Start a Deadlock match and this page will update automatically</li>
            </ul>
          </div>
          <p class="text-grey-500 text-xs mt-6 italic">
            This page will automatically refresh when you enter a match
          </p>
        </div>
      </div>
    `)}renderMenuView(){this.container&&(this.container.innerHTML=`
      <div class="bg-charcoal-100 min-h-screen h-screen overflow-hidden flex flex-col items-center justify-center">
        <div class="text-center max-w-lg px-8 w-full">
          <div class="flex items-center justify-center gap-2 mb-6">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse"></span>
            <span class="text-blue-400 text-sm font-medium">Game Detected</span>
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">Waiting for Match to Start</h1>
          <p class="text-grey-400 text-sm mb-10">
            Deadlock is running. This page will update automatically when a match begins.
          </p>
          <div class="grid grid-cols-6 gap-2 opacity-20">
            ${Array(12).fill(0).map(()=>'<div class="bg-charcoal-200 rounded-lg animate-pulse" style="height:100px;"></div>').join("")}
          </div>
        </div>
      </div>
    `)}renderInitialLoading(){this.container&&(this.container.innerHTML=`
      <div class="p-4 bg-charcoal-100 min-h-screen h-screen flex flex-col">
        <div class="shrink-0 mb-4">
          <h1 class="text-2xl font-bold text-white">Live Dashboard</h1>
        </div>
        <div class="flex-1 grid grid-cols-6 gap-2">
          ${Array(12).fill(0).map(()=>'<div class="bg-charcoal-200 rounded-lg animate-pulse border border-grey-600/30 border-l-4 border-l-grey-600"></div>').join("")}
        </div>
      </div>
    `)}resolveMatchId(){if(this.isDemoMode)return String(nt[this.demoIndex]);if(this.detectedMatchId)return this.detectedMatchId;const e=localStorage.getItem("detectedMatchId");return e?(this.detectedMatchId=e,e):"57331114"}async loadMatchData(){var e,t,s,a,r;if(!(this.isLoading||!this.container)){this.isLoading=!0;try{if(!((e=window.api)!=null&&e.executePython))throw new Error("API not available");const n=this.resolveMatchId();let l=await window.api.executePython("match",n,!1),o=!1;if(l.cached)o=!0;else if(!l.success||l.status==="api_error")if((t=window.api)!=null&&t.getCachedMatch){const b=await window.api.getCachedMatch(n);if(b)l={success:!0,data:b,cached:!0},o=!0;else throw new Error(l.error||"Failed to fetch match data and no cache available")}else throw new Error(l.error||"Failed to fetch match data");const h=((s=l.data)==null?void 0:s.match_info)??l.data;if(!(h!=null&&h.players))throw new Error("Invalid match data structure");o&&this.container&&this.showCacheIndicator();let d=h.players.map(b=>({...b,lane:b.lane??this.mapLaneNumber(b.assigned_lane)}));const c=d.map(b=>b.account_id).filter(Boolean);await Promise.all([this.fetchRankDistribution(),this.fetchRankAssets()]);const[u,g,v,p]=await Promise.all([this.fetchSteamProfiles(c),this.fetchHeroDataMap(d.map(b=>b.hero_id).filter(Boolean)),this.fetchHeroStats(c),this.fetchPlayerMMR(c)]),f=await this.fetchAllMatchHistories(c);d=d.map(b=>{const x=v.get(`${b.account_id}:${b.hero_id}`),k=p.get(b.account_id),$=f.get(b.account_id)??[],P=Math.floor(Date.now()/1e3),M=(x==null?void 0:x.matches_played)??0,S=(x==null?void 0:x.wins)??0,A=M>0?S/M*100:void 0,D=x&&M>0?x.kills/M:void 0,T=x&&M>0?x.deaths/M:void 0,y=x&&M>0?x.assists/M:void 0,_=k==null?void 0:k.rank,w=_!==void 0?Math.floor(_/10):void 0,L=_!==void 0?_%10:void 0,j=w!==void 0?this.rankAssets.find(V=>V.tier===w):void 0,R=["","I","II","III","IV","V","VI"],H=j&&L!==void 0?`${j.name} ${R[L]??""}`.trim():void 0,ae=L!==void 0?`small_subrank${L}_webp`:void 0,ce=j?(ae&&j.images[ae])??j.images.small_webp??j.images.small??void 0:void 0,de=_!==void 0?this.computeTopPercent(_):void 0,he=$.filter(V=>V.start_time>=P-na),Dt=$.filter(V=>V.start_time>=P-oa),ze=V=>({games:V.length,wins:V.filter(Tt=>Tt.match_result===1).length});return{...b,steamProfile:u.get(b.account_id),heroData:g.get(b.hero_id),heroMatchesPlayed:M,heroWinrate:A,heroAvgKills:D,heroAvgDeaths:T,heroAvgAssists:y,rankBadgeLevel:_,rankName:H,rankImageUrl:ce,rankTopPercent:de,activity12h:ze(he),activity30d:ze(Dt)}}),this.matchData={match_id:h.match_id,duration_s:h.duration_s,winning_team:h.winning_team,players:d,teams:((a=l.data)==null?void 0:a.teams)??[]},!o&&!this.isDemoMode&&l.success&&((r=window.api)!=null&&r.cacheMatch)&&h.match_id&&window.api.cacheMatch(n,this.matchData).catch(()=>{}),this.renderMatchData()}catch(n){console.error("Failed to load match data:",n),this.showError(n instanceof Error?n.message:"Failed to load match data")}finally{this.isLoading=!1}}}async fetchSteamProfiles(e){const t=new Map;if(!e.length)return t;try{const s=await fetch(`${Y}/v1/players/steam?account_ids=${e.join(",")}`);if(!s.ok)return t;(await s.json()).forEach(r=>t.set(r.account_id,r))}catch{}return t}async fetchHeroDataMap(e){const t=[...new Set(e)],s=await Promise.all(t.map(r=>this.fetchHeroData(r))),a=new Map;return t.forEach((r,n)=>{s[n]&&a.set(r,s[n])}),a}async fetchHeroData(e){if(this.heroCache.has(e))return this.heroCache.get(e);try{const t=await fetch(`${Y}/v1/assets/heroes/${e}`);if(!t.ok)return null;const s=await t.json();return this.heroCache.set(e,s),s}catch{return null}}async fetchHeroStats(e){const t=new Map;if(!e.length)return t;try{const s=await fetch(`${Y}/v1/players/hero-stats?account_ids=${e.join(",")}`);if(!s.ok)return t;(await s.json()).forEach(r=>t.set(`${r.account_id}:${r.hero_id}`,r))}catch{}return t}async fetchPlayerMMR(e){const t=new Map;if(!e.length)return t;try{const s=await fetch(`${Y}/v1/players/mmr?account_ids=${e.join(",")}`);if(!s.ok)return t;(await s.json()).forEach(r=>{const n=t.get(r.account_id);(!n||r.start_time>n.start_time)&&t.set(r.account_id,r)})}catch{}return t}async fetchRankDistribution(){if(!(this.rankDistribution.length>0))try{const e=await fetch(`${Y}/v1/players/mmr/distribution`);if(!e.ok)return;this.rankDistribution=await e.json()}catch{}}async fetchRankAssets(){if(!(this.rankAssets.length>0))try{const e=await fetch(`${Y}/v1/assets/ranks`);if(!e.ok)return;this.rankAssets=await e.json()}catch{}}async fetchAllMatchHistories(e){const t=new Map;return(await Promise.all(e.map(async a=>{try{const r=await fetch(`${Y}/v1/players/${a}/match-history`),n=r.ok?await r.json():[];return{id:a,entries:n}}catch{return{id:a,entries:[]}}}))).forEach(({id:a,entries:r})=>t.set(a,r)),t}computeTopPercent(e){if(!this.rankDistribution.length)return 50;const t=this.rankDistribution.reduce((a,r)=>a+r.players,0);if(t===0)return 50;const s=this.rankDistribution.filter(a=>a.rank>e).reduce((a,r)=>a+r.players,0);return Math.round(s/t*100)}mapLaneNumber(e){return e===1?"blue":e===4?"yellow":e===6?"green":e!==void 0?{0:"yellow",2:"green"}[e]:void 0}organizePlayersIntoGrid(e){const t=(r,n)=>e.filter(l=>l.lane===r&&l.team===n),s=[t("yellow",0)[0]??null,t("yellow",0)[1]??null,t("blue",0)[0]??null,t("blue",0)[1]??null,t("green",0)[0]??null,t("green",0)[1]??null],a=[t("yellow",1)[0]??null,t("yellow",1)[1]??null,t("blue",1)[0]??null,t("blue",1)[1]??null,t("green",1)[0]??null,t("green",1)[1]??null];return{row0:s,row1:a}}renderMatchData(){if(!this.container||!this.matchData)return;const{row0:e,row1:t}=this.organizePlayersIntoGrid(this.matchData.players),s=l=>l<2?"yellow":l<4?"blue":"green",a=(l,o)=>{if(!l)return'<div class="bg-[#1a1f24] rounded-lg border border-[#2a2f35] opacity-20"></div>';const h=document.createElement("div");return ra.mount(h,{player:l,laneColor:s(o)}),h.innerHTML},r=this.matchData.match_id??this.resolveMatchId(),n=this.isDemoMode?'<span class="px-2 py-0.5 rounded text-xs font-medium bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">DEMO</span>':"";this.container.innerHTML=`
      <div class="bg-charcoal-100 min-h-screen h-screen overflow-hidden flex flex-col">

        <!-- HEADER -->
        <div class="flex items-center justify-between px-4 py-3 shrink-0 border-b border-[#2a2f35]">
          <div class="flex items-center gap-3">
            <h1 class="text-lg font-bold text-white">Live Dashboard</h1>
            ${n}
            <!-- Match ID always visible regardless of mode -->
            <span class="text-xs text-[#555] font-mono">Match ID: ${r}</span>
          </div>

          <!-- Refresh: shows cycle arrow in demo mode, simple reload icon in real mode -->
          <button
            id="refresh-match-btn"
            title="${this.isDemoMode?"Next demo match":"Refresh match data"}"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-charcoal-200 hover:bg-charcoal-300 text-white border border-grey-600 hover:border-frosted-mint-500 transition-colors text-sm"
          >
            ${this.isDemoMode?`<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                     d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                 </svg>
                 Refresh`:`<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                     d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                 </svg>
                 Actualiser`}
          </button>
        </div>

        <!-- GRID: 6 columns × 2 rows, each column = one lane matchup -->
        <!-- Yellow (col 0-1) | Blue (col 2-3) | Green (col 4-5) -->
        <div class="flex-1 grid grid-cols-6 grid-rows-2 gap-x-2 gap-y-2 p-2 overflow-hidden">
          ${e.map((l,o)=>`<div class="min-h-0">${a(l,o)}</div>`).join("")}
          ${t.map((l,o)=>`<div class="min-h-0">${a(l,o)}</div>`).join("")}
        </div>
      </div>
    `,this.attachEventListeners()}attachEventListeners(){var e;(e=document.getElementById("refresh-match-btn"))==null||e.addEventListener("click",()=>{this.isDemoMode&&(this.demoIndex=(this.demoIndex+1)%nt.length),this.loadMatchData()})}showError(e){if(!this.container)return;const t=document.createElement("div");t.className="fixed bottom-4 right-4 z-50 bg-red-900/90 border border-red-500/50 rounded-lg p-4 max-w-sm",t.innerHTML=`
      <p class="text-red-400 font-semibold text-sm mb-1">Erreur de chargement</p>
      <p class="text-red-300 text-xs">${e}</p>
    `,this.container.appendChild(t),setTimeout(()=>t.remove(),7e3)}showCacheIndicator(){var t;if(!this.container)return;(t=this.container.querySelector(".cache-indicator"))==null||t.remove();const e=document.createElement("div");e.className="cache-indicator fixed top-16 right-4 z-40 bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-3",e.innerHTML=`
      <p class="text-yellow-400 text-sm font-semibold">Données en cache</p>
      <p class="text-yellow-300 text-xs">L'API est indisponible. Affichage des dernières données.</p>
    `,this.container.appendChild(e),setTimeout(()=>e.parentNode&&e.remove(),5e3)}}class ca{constructor(){m(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-6">
            Tactical Analysis
          </h1>
          <p class="text-grey-300 mb-8">
            Behavior Tags (Python) et Recommandeur d'items (Contres).
          </p>
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600">
            <p class="text-grey-400">
              Page en développement - Tactical Analysis
            </p>
          </div>
        </div>
      </div>
    `)}}class da{constructor(){m(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-6">
            Rankings
          </h1>
          <p class="text-grey-300 mb-8">
            Classement Overall et par Héros avec filtres régionaux.
          </p>
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600">
            <p class="text-grey-400">
              Page en développement - Rankings
            </p>
          </div>
        </div>
      </div>
    `)}}class ha{constructor(){m(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-6">
            Rank Analytics
          </h1>
          <p class="text-grey-300 mb-8">
            Graphique de distribution et volume de matchs par sous-rang.
          </p>
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600">
            <p class="text-grey-400">
              Page en développement - Rank Analytics
            </p>
          </div>
        </div>
      </div>
    `)}}class ua{constructor(){m(this,"container",null);m(this,"demoModeEnabled",!1);m(this,"steamProfile",null);m(this,"boundHandleContainerClick",e=>{const t=e.target;t.closest("#steam-connect-btn")?this.handleSteamStartAuth():t.closest("#steam-disconnect-btn")&&this.handleSteamLogout()})}mount(e){this.container=e,this.container.addEventListener("click",this.boundHandleContainerClick),Promise.all([this.loadDemoModeState(),this.loadSteamProfile()]).then(()=>this.render())}refresh(){this.container&&Promise.all([this.loadDemoModeState(),this.loadSteamProfile()]).then(()=>this.render())}async loadSteamProfile(){var e;try{(e=window.api)!=null&&e.steamGetProfile&&(this.steamProfile=await window.api.steamGetProfile())}catch(t){console.error("Failed to load Steam profile:",t)}}async loadDemoModeState(){try{const e=localStorage.getItem("demoModeEnabled");if(e!==null)this.demoModeEnabled=e==="true";else{const t=localStorage.getItem("mockModeEnabled");t!==null&&(this.demoModeEnabled=t==="true",localStorage.setItem("demoModeEnabled",t),localStorage.removeItem("mockModeEnabled"))}}catch(e){console.error("Failed to load demo mode state:",e)}}async toggleDemoMode(e){try{this.demoModeEnabled=e,localStorage.setItem("demoModeEnabled",e.toString()),this.updateToggleUI()}catch(t){console.error("Failed to toggle demo mode:",t)}}updateToggleUI(){const e=document.getElementById("mock-mode-toggle"),t=document.getElementById("mock-mode-indicator");e&&(e.setAttribute("aria-checked",this.demoModeEnabled.toString()),e.classList.toggle("bg-frosted-mint-500",this.demoModeEnabled),e.classList.toggle("bg-grey-600",!this.demoModeEnabled)),t&&(t.textContent=this.demoModeEnabled?"Actif":"Inactif",t.classList.toggle("text-frosted-mint-500",this.demoModeEnabled),t.classList.toggle("text-grey-400",!this.demoModeEnabled))}render(){var e;this.container&&(this.container.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-6">
            Configuration
          </h1>
          <p class="text-grey-300 mb-8">
            Langue, Thème, Chemins .exe et Authentification Steam.
          </p>
          
          <!-- Mode Démo Toggle -->
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600 mb-6">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-white mb-2">
                  Mode Démo
                </h3>
                <p class="text-sm text-grey-400 mb-1">
                  Simule une partie en utilisant de vrais Match IDs (80659633, 83547202, 80457157). Le bouton Refresh dans le Live Dashboard fait défiler cycliquement ces parties.
                </p>
                <p class="text-xs text-grey-500">
                  <span id="mock-mode-indicator" class="font-semibold ${this.demoModeEnabled?"text-frosted-mint-500":"text-grey-400"}">
                    ${this.demoModeEnabled?"Actif":"Inactif"}
                  </span>
                </p>
              </div>
              <button
                id="mock-mode-toggle"
                role="switch"
                aria-checked="${this.demoModeEnabled}"
                aria-label="Toggle Mode Démo"
                class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-frosted-mint-500 focus:ring-offset-2 focus:ring-offset-charcoal-200 ${this.demoModeEnabled?"bg-frosted-mint-500":"bg-grey-600"}"
              >
                <span
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${this.demoModeEnabled?"translate-x-5":"translate-x-0"}"
                ></span>
              </button>
            </div>
          </div>
          
          <!-- Compte Steam -->
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600 mb-6">
            <h3 class="text-lg font-semibold text-white mb-2">
              Compte Steam
            </h3>
            <p class="text-sm text-grey-400 mb-4">
              Connectez-vous avec Steam pour que l'application puisse afficher vos statistiques automatiquement.
            </p>
            <div id="steam-account-block">
              ${(e=this.steamProfile)!=null&&e.steamId64?`
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  ${this.steamProfile.avatarUrl?`<img src="${this.steamProfile.avatarUrl}" alt="Profil" class="w-12 h-12 rounded-full border-2 border-grey-600 object-cover" />`:'<div class="w-12 h-12 rounded-full bg-charcoal-300 border-2 border-grey-600 flex items-center justify-center"><span class="text-grey-500">?</span></div>'}
                  <div>
                    <p class="text-white font-medium">${this.steamProfile.personaname||"Compte Steam"}</p>
                    <p class="text-xs text-grey-500">ID: ${this.steamProfile.steamId64}</p>
                  </div>
                </div>
                <button id="steam-disconnect-btn" type="button" class="shrink-0 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors border border-red-500 text-sm font-medium">
                  Se déconnecter
                </button>
              </div>
              `:`
              <button id="steam-connect-btn" type="button" class="px-4 py-2 rounded-lg bg-charcoal-300 text-frosted-mint-500 hover:bg-charcoal-400 hover:text-frosted-mint-400 transition-colors border border-grey-600 text-sm font-medium">
                Se connecter avec Steam
              </button>
              `}
            </div>
          </div>
          
          <!-- Other settings placeholder -->
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600">
            <p class="text-grey-400">
              Autres paramètres à venir...
            </p>
          </div>
        </div>
      </div>
    `,this.attachEventListeners())}attachEventListeners(){const e=document.getElementById("mock-mode-toggle");e&&e.addEventListener("click",()=>{this.toggleDemoMode(!this.demoModeEnabled)})}async handleSteamLogout(){var e;try{(e=window.api)!=null&&e.steamLogout&&await window.api.steamLogout()}catch(t){console.error("Steam logout failed:",t)}}async handleSteamStartAuth(){var e;try{if(!((e=window.api)!=null&&e.steamStartAuth))return;(await window.api.steamStartAuth()).success&&(await this.loadSteamProfile(),this.render(),Ce.refresh())}catch(t){console.error("Steam auth failed:",t)}}}class pa{constructor(){m(this,"container",null);m(this,"pollInterval",null);m(this,"tickInterval",null);m(this,"devicesOpen",!1);m(this,"trackFetchedAt",0);m(this,"trackProgressMs",0);m(this,"trackDurationMs",0);m(this,"trackIsPlaying",!1)}mount(e){this.stopAll(),this.container=e,this.init()}stopAll(){this.pollInterval!==null&&(clearInterval(this.pollInterval),this.pollInterval=null),this.tickInterval!==null&&(clearInterval(this.tickInterval),this.tickInterval=null)}async init(){this.renderSkeleton();const e=await window.spotify.getAuthStatus();e.isAuthenticated?(await this.renderPlayer(e.displayName),this.startIntervals()):this.renderLogin()}renderSkeleton(){this.container&&(this.container.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-xl mx-auto">
          <div class="h-8 w-48 bg-charcoal-200 rounded animate-pulse mb-8"></div>
          <div class="bg-charcoal-200 rounded-2xl p-6 border border-grey-600 animate-pulse">
            <div class="flex items-center gap-5 mb-6">
              <div class="w-20 h-20 rounded-xl bg-charcoal-100 shrink-0"></div>
              <div class="flex-1 space-y-3">
                <div class="h-5 bg-charcoal-100 rounded w-3/4"></div>
                <div class="h-4 bg-charcoal-100 rounded w-1/2"></div>
              </div>
            </div>
            <div class="h-1.5 bg-charcoal-100 rounded-full mb-6"></div>
            <div class="flex justify-center gap-6">
              <div class="w-10 h-10 rounded-full bg-charcoal-100"></div>
              <div class="w-12 h-12 rounded-full bg-charcoal-100"></div>
              <div class="w-10 h-10 rounded-full bg-charcoal-100"></div>
            </div>
          </div>
        </div>
      </div>`)}renderLogin(){var e;this.container&&(this.container.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-8">Spotify Widget</h1>
          <div class="bg-charcoal-200 rounded-2xl p-10 border border-grey-600 text-center">
            <div class="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style="background:#1DB954">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="white">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-white mb-2">Connecter Spotify</h2>
            <p class="text-grey-400 mb-8 text-sm">
              Contrôlez votre musique sans quitter l'application.<br>Un compte Spotify Premium est requis.
            </p>
            <button id="spotify-login-btn"
              class="px-8 py-3 rounded-xl font-semibold text-black transition-all duration-200 hover:scale-105 active:scale-95"
              style="background:#1DB954">
              Se connecter avec Spotify
            </button>
          </div>
        </div>
      </div>`,(e=document.getElementById("spotify-login-btn"))==null||e.addEventListener("click",()=>this.handleLogin()))}async handleLogin(){const e=document.getElementById("spotify-login-btn");e&&(e.disabled=!0,e.textContent="Ouverture du navigateur…"),this.renderSkeleton();const t=await window.spotify.login();t.success?(await this.renderPlayer(t.displayName??null),this.startIntervals()):(this.renderLogin(),this.showToast(`Connexion échouée : ${t.error??"erreur inconnue"}`,"error"))}async renderPlayer(e){if(!this.container)return;const[t,s]=await Promise.all([window.spotify.getCurrentlyPlaying(),window.spotify.getDevices()]);this.storeTrackState(t);const{pct:a}=this.currentProgress(),r=s.find(n=>n.is_active);this.container.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-xl mx-auto">
          <div class="flex items-center justify-between mb-8">
            <h1 class="text-3xl font-bold text-white">Spotify Widget</h1>
            <div class="flex items-center gap-3">
              ${e?`<span class="text-grey-400 text-sm">${this.esc(e)}</span>`:""}
              <button id="spotify-logout-btn"
                class="px-3 py-1.5 rounded-lg text-sm text-grey-400 border border-grey-600 hover:border-grey-400 hover:text-white transition-colors">
                Déconnecter
              </button>
            </div>
          </div>

          <!-- Player card -->
          <div class="bg-charcoal-200 rounded-2xl p-6 border border-grey-600 mb-4" id="spotify-player-card">
            ${this.buildTrackHTML(t,a)}
          </div>

          <!-- Device selector -->
          <div class="bg-charcoal-200 rounded-xl border border-grey-600 overflow-hidden" id="devices-section">
            <div class="flex items-center">
              <button id="devices-toggle"
                class="flex-1 flex items-center gap-2 px-5 py-3 text-sm text-grey-300 hover:text-white hover:bg-charcoal-100 transition-colors">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
                </svg>
                <span>${r?this.esc(r.name):"Appareils"}</span>
                <svg id="devices-chevron" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" class="ml-auto transition-transform">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                </svg>
              </button>
              <button id="devices-refresh-btn" title="Actualiser les appareils"
                class="px-3 py-3 text-grey-500 hover:text-white transition-colors border-l border-grey-600">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                  <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
              </button>
            </div>
            <div id="devices-list" class="hidden border-t border-grey-600">
              ${this.buildDevicesHTML(s)}
            </div>
          </div>

          <div id="spotify-toast" class="hidden mt-4 px-4 py-2 rounded-lg text-sm text-center"></div>
        </div>
      </div>`,this.attachPlayerListeners((t==null?void 0:t.isPlaying)??!1,s)}storeTrackState(e){e?(this.trackFetchedAt=Date.now(),this.trackProgressMs=e.progressMs,this.trackDurationMs=e.durationMs,this.trackIsPlaying=e.isPlaying):(this.trackFetchedAt=0,this.trackProgressMs=0,this.trackDurationMs=0,this.trackIsPlaying=!1)}currentProgress(){if(this.trackDurationMs===0)return{progressMs:0,pct:0};const e=this.trackIsPlaying?Date.now()-this.trackFetchedAt:0,t=Math.min(this.trackProgressMs+e,this.trackDurationMs);return{progressMs:t,pct:t/this.trackDurationMs*100}}buildTrackHTML(e,t){return e?`
      <div class="flex items-center gap-5 mb-4">
        ${e.albumArtUrl?`<img src="${this.esc(e.albumArtUrl)}" alt="Pochette" class="w-20 h-20 rounded-xl object-cover shrink-0 shadow-lg">`:`<div class="w-20 h-20 rounded-xl bg-charcoal-100 flex items-center justify-center shrink-0">
               <svg viewBox="0 0 24 24" width="32" height="32" fill="#666"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
             </div>`}
        <div class="min-w-0 flex-1">
          <p class="text-white font-semibold text-lg leading-tight truncate" title="${this.esc(e.title)}">${this.esc(e.title)}</p>
          <p class="text-grey-400 text-sm mt-1 truncate">${this.esc(e.artist)}</p>
        </div>
      </div>
      <div class="h-1.5 bg-charcoal-100 rounded-full mb-2 overflow-hidden">
        <div id="spotify-progress-bar" class="h-full rounded-full" style="background:#1DB954;width:${t.toFixed(1)}%;transition:width 1s linear"></div>
      </div>
      <div class="flex justify-between text-xs text-grey-500 mb-6">
        <span id="spotify-time-current">${this.fmtMs(this.trackProgressMs)}</span>
        <span>${this.fmtMs(e.durationMs)}</span>
      </div>
      ${this.buildControlsHTML(e.isPlaying)}`:`
        <div class="flex items-center gap-5 mb-6">
          <div class="w-20 h-20 rounded-xl bg-charcoal-100 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="#666"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
          </div>
          <div>
            <p class="text-white font-medium">Rien en cours de lecture</p>
            <p class="text-grey-400 text-sm mt-1">Lancez de la musique sur Spotify</p>
          </div>
        </div>
        <div class="h-1.5 bg-charcoal-100 rounded-full mb-2">
          <div class="h-full w-0 rounded-full" style="background:#1DB954"></div>
        </div>
        <div class="flex justify-between text-xs text-grey-500 mb-6"><span>0:00</span><span>0:00</span></div>
        ${this.buildControlsHTML(!1)}`}buildControlsHTML(e){const t="flex items-center justify-center rounded-full transition-all duration-150 active:scale-90";return`
      <div class="flex items-center justify-center gap-6">
        <button id="spotify-prev" title="Précédent" class="${t} w-10 h-10 text-grey-400 hover:text-white">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
        </button>
        <button id="spotify-play-pause" title="${e?"Pause":"Lecture"}"
          class="${t} w-14 h-14 text-black hover:scale-105" style="background:#1DB954">
          ${e?'<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>':'<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'}
        </button>
        <button id="spotify-next" title="Suivant" class="${t} w-10 h-10 text-grey-400 hover:text-white">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z"/></svg>
        </button>
      </div>`}buildDevicesHTML(e){return e.length===0?'<p class="px-5 py-3 text-grey-400 text-sm">Aucun appareil actif trouvé</p>':e.map(t=>`
      <button data-device-id="${this.esc(t.id)}"
        class="device-item w-full flex items-center gap-3 px-5 py-3 text-sm hover:bg-charcoal-100 transition-colors text-left
               ${t.is_active?"text-white":"text-grey-400"}">
        ${t.is_active?'<span style="color:#1DB954;font-size:10px">●</span>':'<span style="width:10px;display:inline-block"></span>'}
        <span class="flex-1 truncate">${this.esc(t.name)}</span>
        ${t.is_active?'<span class="text-xs" style="color:#1DB954">ACTIF</span>':""}
      </button>`).join("")}attachPlayerListeners(e,t){var a,r,n,l,o,h;let s=e;(a=document.getElementById("spotify-logout-btn"))==null||a.addEventListener("click",()=>this.handleLogout()),(r=document.getElementById("spotify-prev"))==null||r.addEventListener("click",async()=>{await window.spotify.previous().catch(()=>null),setTimeout(()=>this.syncTrack(),500)}),(n=document.getElementById("spotify-next"))==null||n.addEventListener("click",async()=>{await window.spotify.next().catch(()=>null),setTimeout(()=>this.syncTrack(),500)}),(l=document.getElementById("spotify-play-pause"))==null||l.addEventListener("click",async()=>{s?(this.trackIsPlaying=!1,await window.spotify.pause().catch(()=>null)):(this.trackIsPlaying=!0,this.trackFetchedAt=Date.now(),await window.spotify.play().catch(()=>null)),s=!s,this.updatePlayPauseBtn(s),setTimeout(()=>this.syncTrack(),500)}),(o=document.getElementById("devices-toggle"))==null||o.addEventListener("click",()=>{var c;this.devicesOpen=!this.devicesOpen,(c=document.getElementById("devices-list"))==null||c.classList.toggle("hidden",!this.devicesOpen);const d=document.getElementById("devices-chevron");d&&(d.style.transform=this.devicesOpen?"rotate(180deg)":"")}),(h=document.getElementById("devices-refresh-btn"))==null||h.addEventListener("click",async()=>{const d=document.getElementById("devices-refresh-btn");d&&(d.style.opacity="0.4");const c=await window.spotify.getDevices().catch(()=>t),u=document.getElementById("devices-list");u&&(u.innerHTML=this.buildDevicesHTML(c)),this.attachDeviceListeners(c);const g=document.getElementById("devices-toggle"),v=c.find(f=>f.is_active),p=g==null?void 0:g.querySelector("span");p&&(p.textContent=v?v.name:"Appareils"),d&&(d.style.opacity="")}),this.attachDeviceListeners(t)}attachDeviceListeners(e){var t;(t=document.getElementById("devices-list"))==null||t.querySelectorAll(".device-item").forEach(s=>{s.addEventListener("click",async()=>{var n;const a=s.dataset.deviceId;await window.spotify.transferDevice(a).catch(()=>null),this.devicesOpen=!1,(n=document.getElementById("devices-list"))==null||n.classList.add("hidden");const r=document.getElementById("devices-chevron");r&&(r.style.transform=""),setTimeout(async()=>{var c;const l=await window.spotify.getDevices().catch(()=>e),o=document.getElementById("devices-list");o&&(o.innerHTML=this.buildDevicesHTML(l)),this.attachDeviceListeners(l);const h=l.find(u=>u.is_active),d=(c=document.getElementById("devices-toggle"))==null?void 0:c.querySelector("span");d&&(d.textContent=h?h.name:"Appareils"),await this.syncTrack()},1200)})})}updatePlayPauseBtn(e){const t=document.getElementById("spotify-play-pause");t&&(t.title=e?"Pause":"Lecture",t.innerHTML=e?'<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>':'<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>')}startIntervals(){this.stopAll(),this.tickInterval=setInterval(()=>this.tick(),1e3),this.pollInterval=setInterval(()=>this.syncTrack(),5e3)}tick(){if(!this.trackIsPlaying||this.trackDurationMs===0)return;const{progressMs:e,pct:t}=this.currentProgress(),s=document.getElementById("spotify-progress-bar");s&&(s.style.width=`${t.toFixed(1)}%`);const a=document.getElementById("spotify-time-current");a&&(a.textContent=this.fmtMs(e)),e>=this.trackDurationMs-1500&&this.syncTrack()}async syncTrack(){var a;const e=await window.spotify.getCurrentlyPlaying().catch(()=>null);this.storeTrackState(e);const t=document.getElementById("spotify-player-card");if(!t)return;if(this.updatePlayPauseBtn(this.trackIsPlaying),(((a=t.querySelector("[title]"))==null?void 0:a.getAttribute("title"))??"")!==((e==null?void 0:e.title)??"")){const{pct:r}=this.currentProgress();t.innerHTML=this.buildTrackHTML(e,r),this.attachPlayerListeners(this.trackIsPlaying,await window.spotify.getDevices().catch(()=>[]))}}async handleLogout(){this.stopAll(),await window.spotify.logout(),this.renderLogin()}showToast(e,t){const s=document.getElementById("spotify-toast");s&&(s.textContent=e,s.className=`mt-4 px-4 py-2 rounded-lg text-sm text-center ${t==="error"?"bg-red-900 text-red-200":"text-black"}`,t==="success"&&(s.style.background="#1DB954"),s.classList.remove("hidden"),setTimeout(()=>s.classList.add("hidden"),5e3))}esc(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}fmtMs(e){const t=Math.floor(e/1e3);return`${Math.floor(t/60)}:${(t%60).toString().padStart(2,"0")}`}}class ma{constructor(){m(this,"container",null);m(this,"isLoading",!1)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-6xl mx-auto">
          <h1 class="text-3xl font-bold text-frosted-mint-500 mb-6">
            Deadlock Helper - Test API
          </h1>
          
          <div class="bg-charcoal-200 rounded-lg p-6 mb-6">
            <p class="text-grey-300 mb-4">
              Cette page permet de tester la récupération des données depuis l'API Deadlock.
              Cliquez sur le bouton ci-dessous pour récupérer les items.
            </p>
            
            <button
              id="test-api-btn"
              class="px-6 py-3 bg-frosted-mint-500 text-charcoal-100 rounded-lg font-semibold hover:bg-frosted-mint-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tester l'API Deadlock
            </button>
          </div>
          
          <div id="loading-indicator" class="hidden mb-4">
            <div class="flex items-center gap-2 text-cream-500">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-cream-500"></div>
              <span>Chargement des données...</span>
            </div>
          </div>
          
          <div id="error-message" class="hidden mb-4 p-4 bg-charcoal-200 border border-grey-600 rounded-lg text-cream-500 whitespace-pre-line"></div>
          
          <div id="success-message" class="hidden mb-4 p-4 bg-charcoal-200 border border-dry-sage-500 rounded-lg text-frosted-mint-500"></div>
          
          <div id="results-container" class="bg-charcoal-200 rounded-lg p-6">
            <h2 class="text-xl font-semibold text-frosted-mint-500 mb-4">
              Résultats
            </h2>
            <div id="results-content" class="text-grey-300">
              <p class="text-dry-sage-400">Aucune donnée récupérée pour le moment.</p>
            </div>
          </div>
        </div>
      </div>
    `,this.attachEventListeners())}attachEventListeners(){const e=document.getElementById("test-api-btn");e&&e.addEventListener("click",()=>this.handleTestApi())}async handleTestApi(){var e;if(!this.isLoading){this.isLoading=!0,this.updateUIState("loading");try{if(!window.api||!window.api.executePython)throw new Error("API Electron non disponible. Assurez-vous que preload.ts est correctement configuré.");const t=await window.api.executePython("items");if(t.success)this.displayResults(t),this.updateUIState("success",`Données récupérées avec succès ! (${((e=t.data)==null?void 0:e.returned_count)||0} items)`);else{let s=t.error||"Erreur inconnue lors de la récupération des données";t.pythonScript&&(s+=`

Chemin Python: ${t.pythonScript}`),t.workingDir&&(s+=`
Répertoire de travail: ${t.workingDir}`),t.stderr&&(s+=`

Détails Python:
${t.stderr}`),this.updateUIState("error",s)}}catch(t){console.error("Erreur lors du test API:",t);let s=t.message||"Erreur lors de la communication avec le processus Python";t.pythonScript&&(s+=`

Chemin Python: ${t.pythonScript}`),t.workingDir&&(s+=`
Répertoire de travail: ${t.workingDir}`),this.updateUIState("error",s)}finally{this.isLoading=!1,this.updateUIState("idle")}}}updateUIState(e,t){const s=document.getElementById("loading-indicator"),a=document.getElementById("error-message"),r=document.getElementById("success-message"),n=document.getElementById("test-api-btn");switch(s&&s.classList.add("hidden"),a&&(a.classList.add("hidden"),a.textContent=""),r&&(r.classList.add("hidden"),r.textContent=""),n&&(n.disabled=!1),e){case"loading":s&&s.classList.remove("hidden"),n&&(n.disabled=!0);break;case"success":r&&(r.classList.remove("hidden"),r.textContent=t||"Succès !");break;case"error":a&&(a.classList.remove("hidden"),a.textContent=t||"Une erreur est survenue");break}}displayResults(e){const t=document.getElementById("results-content");if(!t)return;const s=e.data;if(!s||!s.items||s.items.length===0){t.innerHTML=`
        <p class="text-dry-sage-400">Aucun item trouvé dans la réponse.</p>
        <pre class="mt-4 p-4 bg-charcoal-100 rounded text-xs overflow-auto">${JSON.stringify(e,null,2)}</pre>
      `;return}const a=s.items.map(r=>`
      <div class="bg-charcoal-200 rounded-lg p-4 mb-3 border border-grey-600 hover:border-dry-sage-500 transition-colors">
        <div class="flex items-start gap-4">
          ${r.image_webp||r.image?`
            <div class="shrink-0">
              <img 
                src="${r.image_webp||r.image}" 
                alt="${r.name||"Item"}"
                class="w-20 h-20 object-cover rounded-lg border-2 border-grey-600 bg-charcoal-100"
                onerror="this.onerror=null; this.src='${r.image||""}'; this.onerror=function(){this.style.display='none';}"
                loading="lazy"
              />
            </div>
          `:`
            <div class="shrink-0 w-20 h-20 rounded-lg border-2 border-grey-600 bg-charcoal-100 flex items-center justify-center">
              <span class="text-grey-500 text-xs">No Image</span>
            </div>
          `}
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-frosted-mint-500 mb-2 wrap-break-words">
              ${r.name||"Nom inconnu"}
            </h3>
            <div class="space-y-1">
              <p class="text-sm text-grey-300">
                <span class="text-dry-sage-400 font-medium">ID:</span> 
                <span class="text-cream-500">${r.id||"N/A"}</span>
              </p>
              <p class="text-sm text-grey-300">
                <span class="text-dry-sage-400 font-medium">Class:</span> 
                <span class="text-grey-400">${r.class_name||"N/A"}</span>
              </p>
              ${r.heroes&&r.heroes.length>0?`
                <p class="text-sm text-grey-300">
                  <span class="text-dry-sage-400 font-medium">Heroes:</span> 
                  <span class="text-frosted-mint-400">${r.heroes.length}</span>
                </p>
              `:""}
            </div>
          </div>
        </div>
      </div>
    `).join("");t.innerHTML=`
      <div class="mb-6 p-4 bg-charcoal-100 rounded-lg border border-grey-700">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-dry-sage-400 font-medium">Total d'items disponibles:</span>
            <span class="text-frosted-mint-500 font-semibold ml-2">${s.total_count||0}</span>
          </div>
          <div>
            <span class="text-dry-sage-400 font-medium">Items affichés:</span>
            <span class="text-cream-500 font-semibold ml-2">${s.returned_count||0}</span>
          </div>
        </div>
      </div>
      <div class="space-y-3">
        ${a}
      </div>
    `}}class ga{constructor(){m(this,"sidebar");m(this,"currentPage","profil");m(this,"contentContainer",null);m(this,"profilPage",new Gs);m(this,"gameOverlayPage",new qs);m(this,"leaderboardPage",new Ws);m(this,"metaItemsPage",new Ks);m(this,"rankDistributionPage",new Xs);m(this,"settingsPage",new Js);m(this,"heroLibraryPage",new ea);m(this,"heroDetailsPage",new sa);m(this,"metaBuildsPage",new aa);m(this,"liveDashboardPage",new la);m(this,"tacticalAnalysisPage",new ca);m(this,"rankingsPage",new da);m(this,"rankAnalyticsPage",new ha);m(this,"configurationPage",new ua);m(this,"spotifyWidgetPage",new pa);m(this,"accueilPage",new ma);this.sidebar=new ss(e=>this.handlePageChange(e))}init(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>this.setup()):this.setup()}setup(){var s,a;const e=document.getElementById("app");if(!e){console.error("App container not found");return}e.innerHTML=`
      <div class="flex h-screen bg-charcoal-100">
        <div id="sidebar-container"></div>
        <main id="content" class="flex-1 overflow-y-auto" style="margin-left: 16rem;">
          <!-- Content will be rendered here -->
        </main>
        <div id="game-status-sticky" class="fixed top-4 right-4 z-[70]"></div>
      </div>
    `;const t=document.getElementById("sidebar-container");t&&this.sidebar.mount(t),qe.mount(),(s=window.api)!=null&&s.onSteamProfileUpdated&&window.api.onSteamProfileUpdated(()=>{Ce.refresh(),this.currentPage==="configuration"&&this.configurationPage.refresh()}),(a=window.api)!=null&&a.onGameStateChanged&&window.api.onGameStateChanged(({state:r,matchId:n})=>{qe.refresh(),this.liveDashboardPage.handleGameStateChanged(r,n),(r==="GAME_IN_MATCH"||r==="GAME_MENU")&&this.currentPage!=="live-dashboard"&&this.sidebar.navigateTo("live-dashboard")}),this.contentContainer=document.getElementById("content"),document.addEventListener("navigate-hero",r=>{const{heroData:n}=r.detail;this.contentContainer&&(this.currentPage="hero-details",this.heroDetailsPage.mountWithHero(this.contentContainer,n))}),document.addEventListener("navigate-player",r=>{const{accountId:n}=r.detail;this.contentContainer&&n&&(this.currentPage="profil",this.profilPage.mountForPlayer(this.contentContainer,n))}),this.renderPage(this.currentPage)}handlePageChange(e){this.contentContainer&&this.currentPage!==e?this.animatePageOut(()=>{this.currentPage=e,this.renderPage(e)}):(this.currentPage=e,this.renderPage(e))}animatePageOut(e){if(!this.contentContainer){e();return}this.contentContainer.classList.add("page-fade-out"),this.contentContainer.classList.remove("page-fade-in"),setTimeout(()=>{e(),this.contentContainer&&(this.contentContainer.classList.remove("page-fade-out"),this.contentContainer.classList.add("page-fade-in"),setTimeout(()=>{this.contentContainer&&this.contentContainer.classList.remove("page-fade-in")},250))},250)}renderPage(e){if(this.contentContainer)if(this.isMainPage(e))switch(e){case"profil":this.profilPage.mount(this.contentContainer);break;case"hero-stats":this.heroLibraryPage.mount(this.contentContainer);break;case"game-overlay":this.gameOverlayPage.mount(this.contentContainer);break;case"leaderboards":this.leaderboardPage.mount(this.contentContainer);break;case"meta-items":this.metaItemsPage.mount(this.contentContainer);break;case"rank-distribution":this.rankDistributionPage.mount(this.contentContainer);break;case"settings":this.settingsPage.mount(this.contentContainer);break}else if(this.isSubPage(e))switch(e){case"hero-library":this.heroLibraryPage.mount(this.contentContainer);break;case"hero-details":this.heroDetailsPage.mount(this.contentContainer);break;case"meta-builds":this.metaBuildsPage.mount(this.contentContainer);break;case"live-dashboard":this.liveDashboardPage.mount(this.contentContainer);break;case"tactical-analysis":this.tacticalAnalysisPage.mount(this.contentContainer);break;case"rankings":this.rankingsPage.mount(this.contentContainer);break;case"rank-analytics":this.rankAnalyticsPage.mount(this.contentContainer);break;case"configuration":this.configurationPage.mount(this.contentContainer);break;case"spotify-widget":this.spotifyWidgetPage.mount(this.contentContainer);break}else switch(e){case"accueil":this.accueilPage.mount(this.contentContainer);break;default:console.warn(`Unknown page: ${e}`),this.profilPage.mount(this.contentContainer)}}isMainPage(e){return["profil","hero-stats","game-overlay","leaderboards","meta-items","rank-distribution","settings"].includes(e)}isSubPage(e){return["hero-library","hero-details","meta-builds","live-dashboard","tactical-analysis","rankings","rank-analytics","configuration","spotify-widget"].includes(e)}}const ba=new ga;ba.init();console.log('👋 Application initialized via "renderer.ts"');
