var we=Object.defineProperty;var Me=(a,e,t)=>e in a?we(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var o=(a,e,t)=>Me(a,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}})();const ke={HomeIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path>',Cog6ToothIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>',Bars3Icon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>',XMarkIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18 18 6M6 6l12 12"></path>',BugAntIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 12.75c.733 0 1.5-.195 2.062-.532a7.5 7.5 0 0 0 2.625-3.003 7.5 7.5 0 0 1-4.687 2.625c-.384.023-.768.05-1.125.08v2.25c.375-.043.766-.087 1.125-.12A9.344 9.344 0 0 0 12 12.75Zm0 0v2.25M9 3.003a7.5 7.5 0 0 1 6 0M5.25 21.75a18.45 18.45 0 0 1-1.5-7.5v-4.5c0-1.71.54-3.32 1.5-4.5M18.75 21.75a18.49 18.49 0 0 0 1.5-7.5v-4.5c0-1.71-.54-3.32-1.5-4.5M9 6a9 9 0 0 1 6 0M15 18.75v-4.5M12 15.75v-4.5"></path>',TrophyIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.228a46.45 46.45 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.844 1.16v-1.801a6.772 6.772 0 0 0 1.623-.174 3 3 0 0 0 2.198-2.784M13.5 9.75a2.25 2.25 0 0 0-2.25 2.25v15.75m0 0h6.75v-15.75m-6.75 0v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21.75"></path>',VideoCameraIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"></path>',WrenchScrewdriverIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655-5.653a2.548 2.548 0 0 0-3.586-3.586l-1.757 1.757a11.25 11.25 0 0 1 5.983 5.983l1.757-1.757a2.548 2.548 0 0 0 3.586-3.586l-5.653-4.655Z"></path>',ChartBarIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75Zm9.75-8.25c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.875Zm9.75-3c0-.621.504-1.125 1.125-1.125h2.25C20.496.75 21 1.254 21 1.875v16.5c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V1.875Z"></path>',ChevronDoubleLeftIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"></path>',ChevronDoubleRightIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"></path>',ListBulletIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>',CubeIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/>',PresentationChartBarIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"/>'};function $(a){return ke[a]||""}function C(a,e){return`<svg class="${e}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    ${a}
  </svg>`}const Ie=(a="w-6 h-6")=>C($("HomeIcon"),a),Pe=(a="w-6 h-6")=>C($("Cog6ToothIcon"),a),Ee=(a="w-6 h-6")=>C($("BugAntIcon"),a),Le=(a="w-6 h-6")=>C($("VideoCameraIcon"),a),Se=(a="w-6 h-6")=>C($("ListBulletIcon"),a),Ae=(a="w-6 h-6")=>C($("CubeIcon"),a),$e=(a="w-6 h-6")=>C($("PresentationChartBarIcon"),a);let oe=100;function Ce(a,e){const t=a>=100,s=t?"text-frosted-mint-500":a>=90?"text-yellow-500":"text-orange-500",n=t?"OK":"Degradé",i=t?"bg-frosted-mint-500":a>=90?"bg-yellow-500":"bg-orange-500";return e?`
    <div class="flex items-center gap-2 flex-wrap">
      <span class="w-2 h-2 rounded-full ${i} shrink-0" aria-hidden="true"></span>
      <span class="text-sm text-grey-300">API</span>
      <span class="text-sm font-medium ${s}">${a}%</span>
      <span class="text-xs text-grey-400">${n}</span>
      <button
        id="api-status-refresh-btn"
        class="text-xs px-2 py-1 rounded bg-charcoal-300 text-grey-300 hover:text-frosted-mint-500 hover:bg-charcoal-400 transition-colors"
        type="button"
      >Vérifier</button>
    </div>
  `:`
      <div class="flex items-center justify-center gap-1" title="API ${a}%">
        <span class="w-2 h-2 rounded-full ${i} shrink-0"></span>
      </div>
    `}function O(a){var n;oe=a;const e=document.getElementById(W.containerId);if(!e)return;const t=((n=document.getElementById("sidebar"))==null?void 0:n.classList.contains("w-64"))??!0;e.innerHTML=Ce(a,t);const s=document.getElementById(W.refreshButtonId);s==null||s.addEventListener("click",()=>{var i,r;(r=(i=window.api)==null?void 0:i.triggerHealthCheck)==null||r.call(i)})}const W={containerId:"api-status-placeholder",refreshButtonId:"api-status-refresh-btn",mount(){var e,t,s;const a=document.getElementById(this.containerId);a&&(a.innerHTML='<div class="text-sm text-grey-500">…</div>',(t=(e=window.api)==null?void 0:e.getApiAvailability)==null||t.call(e).then(n=>O(n)).catch(()=>O(100)),(s=window.api)!=null&&s.onHealthStatusChange&&window.api.onHealthStatusChange(n=>O(n)))},refresh(){O(oe)}},le="user-profile-placeholder";function De(a,e,t){const s=!!(a!=null&&a.steamId64),n=!e.installed&&e.error;return t?s?`
      <div class="flex items-center gap-3">
        ${a!=null&&a.avatarUrl?`<img src="${a.avatarUrl}" alt="Profil Steam" class="w-10 h-10 rounded-full border-2 border-grey-600 object-cover shrink-0" />`:'<div class="w-10 h-10 rounded-full bg-charcoal-300 border-2 border-grey-600 flex items-center justify-center shrink-0"><span class="text-grey-500 text-sm">?</span></div>'}
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium text-white truncate">${(a==null?void 0:a.personaname)||"Steam"}</p>
          <p class="text-xs text-frosted-mint-500">Prêt à analyser</p>
        </div>
      </div>
    `:`
    <div class="space-y-2">
      ${n?`<p class="text-xs text-orange-500">${e.error}</p>`:""}
      <button
        id="user-profile-connect-btn"
        type="button"
        class="w-full px-3 py-2 rounded-lg bg-charcoal-300 text-frosted-mint-500 text-sm font-medium hover:bg-charcoal-400 hover:text-frosted-mint-400 transition-colors border border-grey-600"
      >
        Se connecter avec Steam
      </button>
    </div>
  `:s&&(a!=null&&a.avatarUrl)?`
        <div class="flex items-center justify-center" title="Prêt à analyser">
          <img src="${a.avatarUrl}" alt="Profil Steam" class="w-8 h-8 rounded-full border-2 border-grey-600 object-cover" />
        </div>
      `:`
      <div class="flex items-center justify-center" title="Se connecter avec Steam">
        <div class="w-8 h-8 rounded-full bg-charcoal-300 border-2 border-grey-600 flex items-center justify-center">
          <span class="text-grey-500 text-xs">?</span>
        </div>
      </div>
    `}async function Z(){var i,r,l;const a=document.getElementById(le);if(!a)return;const e=((i=document.getElementById("sidebar"))==null?void 0:i.classList.contains("w-64"))??!0;let t=null,s={installed:!1,path:null};try{(r=window.api)!=null&&r.steamGetProfile&&(t=await window.api.steamGetProfile()),(l=window.api)!=null&&l.steamCheckInstallation&&(s=await window.api.steamCheckInstallation())}catch{}a.innerHTML=De(t,s,e);const n=document.getElementById("user-profile-connect-btn");n&&n.addEventListener("click",async()=>{var c;if((c=window.api)!=null&&c.steamStartAuth){n.disabled=!0;try{const d=await window.api.steamStartAuth();d.success?await Z():(!d.cancelled&&d.error&&(d.error.includes("déjà en cours")||console.error("Steam auth error:",d.error)),await Z())}finally{n.disabled=!1}}})}const K={containerId:le,mount(){const a=document.getElementById(this.containerId);a&&(a.innerHTML='<div class="text-sm text-grey-500">…</div>',Z())},refresh(){Z()}};let m=null,H=[],S=!1,U=!0,B=!1,Y=null,X=null,F=null;function J(a){const e=Math.floor(a/1e3);return`${Math.floor(e/60)}:${(e%60).toString().padStart(2,"0")}`}function L(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ce(){if(!m)return{progressMs:0,pct:0};const a=m.isPlaying?Date.now()-m.fetchedAt:0,e=Math.min(m.progressMs+a,m.durationMs),t=m.durationMs>0?e/m.durationMs*100:0;return{progressMs:e,pct:t}}const v={music:'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>',play:'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',pause:'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',prev:'<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>',next:'<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z"/></svg>',refresh:'<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>',device:'<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>',speaker:'<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 14.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zm3.5-9H8V5h7v2.5z"/></svg>'};function Te(){return U?Be():S?m?je():_e():He()}function Be(a){return`
    <div class="flex items-center gap-2 animate-pulse">
      <div class="w-10 h-10 rounded bg-charcoal-300 shrink-0"></div>
      <div class="flex-1 space-y-2">
        <div class="h-2.5 bg-charcoal-300 rounded w-3/4"></div>
        <div class="h-2.5 bg-charcoal-300 rounded w-1/2"></div>
      </div>
    </div>`}function He(a){return`
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-black" style="background:#1DB954">${v.music}</div>
      <div class="flex-1 min-w-0">
        <p class="text-xs font-semibold text-white">Spotify</p>
        <button id="smp-connect-btn" class="text-xs underline hover:opacity-80 transition-opacity mt-0.5" style="color:#1DB954">Se connecter</button>
      </div>
    </div>`}function _e(a){return`
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded bg-charcoal-100 flex items-center justify-center shrink-0 text-grey-500">${v.music}</div>
      <div class="flex-1 min-w-0">
        <p class="text-xs text-grey-400 leading-tight">Rien en lecture</p>
        <button id="smp-refresh-btn" class="flex items-center gap-1 text-grey-500 hover:text-white transition-colors text-xs mt-1">
          ${v.refresh}<span>Actualiser</span>
        </button>
      </div>
    </div>`}function je(a){const{progressMs:e,pct:t}=ce(),s=m,n=H.find(l=>l.is_active),i=s.albumArtUrl?`<img src="${L(s.albumArtUrl)}" alt="" class="rounded object-cover shrink-0" style="width:40px;height:40px">`:`<div class="rounded bg-charcoal-100 flex items-center justify-center shrink-0 text-grey-500" style="width:40px;height:40px">${v.music}</div>`,r=B?Ge():"";return`
    <div class="space-y-2">
      <!-- Track row -->
      <div class="flex items-center gap-2">
        ${i}
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-white leading-tight truncate" title="${L(s.title)}">${L(s.title)}</p>
          <p class="text-xs text-grey-400 truncate leading-tight mt-0.5">${L(s.artist)}</p>
        </div>
        <button id="smp-refresh-btn" class="text-grey-500 hover:text-white transition-colors p-1 shrink-0" title="Actualiser les appareils">
          ${v.refresh}
        </button>
      </div>

      <!-- Progress bar -->
      <div class="h-0.5 rounded-full bg-charcoal-300 overflow-hidden">
        <div id="smp-progress" class="h-full rounded-full" style="background:#1DB954;width:${t.toFixed(1)}%;transition:width 1s linear"></div>
      </div>

      <!-- Time + active device -->
      <div class="flex items-center justify-between text-grey-500" style="font-size:10px">
        <span id="smp-time">${J(e)}</span>
        ${n?`<span class="flex items-center gap-1 truncate max-w-[90px] px-1">${n.type==="Smartphone"?v.speaker:v.device}<span class="truncate">${L(n.name)}</span></span>`:""}
        <span>${J(s.durationMs)}</span>
      </div>

      <!-- Controls -->
      <div class="flex items-center justify-center gap-5">
        <button id="smp-prev" class="text-grey-400 hover:text-white transition-colors" title="Précédent">${v.prev}</button>
        <button id="smp-play-pause" class="text-white hover:opacity-75 transition-opacity" title="${s.isPlaying?"Pause":"Lecture"}">${s.isPlaying?v.pause:v.play}</button>
        <button id="smp-next" class="text-grey-400 hover:text-white transition-colors" title="Suivant">${v.next}</button>
      </div>

      <!-- Device list (toggled) -->
      ${r}
    </div>`}function Ge(){return H.length===0?'<p class="text-center text-grey-500 py-1" style="font-size:10px">Aucun appareil trouvé</p>':`
    <div id="smp-device-list" class="rounded border border-grey-600 overflow-hidden" style="background:#0d0d0d">
      ${H.map(a=>`
        <button data-device-id="${L(a.id)}"
          class="smp-device-btn w-full text-left flex items-center gap-2 px-3 py-1.5 hover:bg-charcoal-300 transition-colors ${a.is_active?"text-white":"text-grey-400"}"
          style="font-size:11px">
          ${a.is_active?'<span style="color:#1DB954;font-size:8px;line-height:1">●</span>':'<span style="width:8px;display:inline-block"></span>'}
          ${a.type==="Smartphone"?v.speaker:v.device}
          <span class="truncate">${L(a.name)}</span>
        </button>`).join("")}
    </div>`}function y(){const a=document.getElementById("spotify-widget-placeholder");a&&(a.innerHTML=Te(),ze())}function ze(){var a,e,t,s,n,i;(a=document.getElementById("smp-connect-btn"))==null||a.addEventListener("click",()=>{F==null||F("spotify-widget")}),(e=document.getElementById("smp-play-pause"))==null||e.addEventListener("click",async()=>{if(!m)return;const r=m.isPlaying;m.isPlaying=!r,r||(m.fetchedAt=Date.now()),y(),r?await window.spotify.pause().catch(()=>null):await window.spotify.play().catch(()=>null),setTimeout(A,600)}),(t=document.getElementById("smp-prev"))==null||t.addEventListener("click",async()=>{await window.spotify.previous().catch(()=>null),setTimeout(A,600)}),(s=document.getElementById("smp-next"))==null||s.addEventListener("click",async()=>{await window.spotify.next().catch(()=>null),setTimeout(A,600)}),(n=document.getElementById("smp-refresh-btn"))==null||n.addEventListener("click",async()=>{B?B=!1:(await Q(),B=!0),y()}),(i=document.getElementById("smp-device-list"))==null||i.querySelectorAll(".smp-device-btn").forEach(r=>{r.addEventListener("click",async()=>{const l=r.dataset.deviceId;l&&(B=!1,await window.spotify.transferDevice(l).catch(()=>null),setTimeout(()=>{Q(),A()},1200))})})}function Ne(){if(!(m!=null&&m.isPlaying))return;const{progressMs:a,pct:e}=ce(),t=document.getElementById("smp-progress");t&&(t.style.width=`${e.toFixed(1)}%`);const s=document.getElementById("smp-time");s&&(s.textContent=J(a)),m.durationMs>0&&a>=m.durationMs-1500&&A()}async function A(){try{const a=await window.spotify.getCurrentlyPlaying();m=a?{...a,fetchedAt:Date.now()}:null,S||(S=!0),y()}catch{}}async function Q(){try{H=await window.spotify.getDevices()}catch{}}const Ve={containerId:"spotify-widget-placeholder",mount(a){F=a,U=!0,B=!1,m=null,H=[],y(),window.spotify.getAuthStatus().then(({isAuthenticated:e})=>(S=e,U=!1,e?Promise.all([A(),Q()]):(y(),Promise.resolve()))).catch(()=>{U=!1,y()}),X!==null&&clearInterval(X),X=setInterval(Ne,1e3),Y!==null&&clearInterval(Y),Y=setInterval(async()=>{const{isAuthenticated:e}=await window.spotify.getAuthStatus().catch(()=>({isAuthenticated:!1,displayName:null}));e!==S&&(S=e,e||(m=null,H=[]),y()),S&&A()},1e4)},refresh(){y()}},de=[{main:"profil",label:"Profile",icon:Ie},{main:"game-overlay",label:"Live Dashboard",icon:Le,subPages:[{id:"live-dashboard",label:"Live Dashboard"},{id:"tactical-analysis",label:"Tactical Analysis"}]},{main:"hero-stats",label:"Heroes",icon:Ee},{main:"meta-items",label:"Items & Builds",icon:Ae},{main:"leaderboards",label:"Leaderboard",icon:Se,subPages:[{id:"rankings",label:"Rankings"},{id:"rank-analytics",label:"Rank Analytics"}]},{main:"rank-distribution",label:"Rank Distribution",icon:$e}],he={main:"settings",label:"Settings",icon:Pe,subPages:[{id:"configuration",label:"Configuration"},{id:"spotify-widget",label:"Spotify Widget"}]},ae=[...de,he];class Re{constructor(e){o(this,"sidebarEl",null);o(this,"isExpanded",!1);o(this,"currentPage","profil");o(this,"expandedMenus",new Set);o(this,"hoverTimer",null);o(this,"onPageChange");this.onPageChange=e}renderNavItem(e){var c,d;const t=this.currentPage===e.main||((c=e.subPages)==null?void 0:c.some(h=>h.id===this.currentPage))===!0,s=this.expandedMenus.has(e.main),n=!!((d=e.subPages)!=null&&d.length),i=t?"bg-charcoal-300 text-dry-sage-400":"text-grey-700 hover:bg-charcoal-200 hover:text-white",r=`
      <svg class="w-3 h-3 transition-transform duration-200 ${s?"rotate-90":""}"
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
      </svg>`,l=n?`
      <ul class="sub-menu overflow-hidden ${s&&this.isExpanded?"":"hidden"}"
          data-parent="${e.main}">
        ${e.subPages.map(h=>{const g=this.currentPage===h.id;return`
            <li>
              <a href="#" data-page="${h.id}"
                class="nav-sub-link flex items-center gap-2 pl-12 pr-4 py-2 text-xs transition-colors
                  ${g?"text-dry-sage-400 bg-charcoal-200":"text-grey-600 hover:text-white hover:bg-charcoal-200"}">
                <span class="w-1 h-1 rounded-full bg-current shrink-0"></span>
                <span class="whitespace-nowrap">${h.label}</span>
              </a>
            </li>`}).join("")}
      </ul>`:"";return`
      <li class="relative">
        <div class="absolute left-0 top-0 h-full w-0.5 rounded-r transition-colors
                    ${t?"bg-dry-sage-400":"bg-transparent"}"></div>
        <a href="#" data-page="${e.main}" data-has-subpages="${n}"
          class="nav-main-link flex items-center gap-3 pl-5 pr-4 py-2.5 transition-colors ${i}">
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
          ${n?`
            <span class="nav-chevron shrink-0 transition-opacity duration-200
                          ${this.isExpanded?"opacity-100":"opacity-0"}">
              ${r}
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
              ${de.map(e=>this.renderNavItem(e)).join("")}
            </ul>
          </nav>

          <!-- Zone 3 : API Status -->
          <div id="api-status-placeholder"
            class="px-3 py-2.5 min-h-[40px] flex items-center border-t border-grey-200 shrink-0">
            <div class="text-sm text-grey-500">…</div>
          </div>

          <!-- Zone 4 : Settings (épinglé au-dessus du widget Spotify) -->
          <ul class="py-1 border-t border-grey-200 shrink-0">
            ${this.renderNavItem(he)}
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
      </aside>`}mount(e){var t,s;e.innerHTML=this.render(),this.sidebarEl=document.getElementById("sidebar"),(t=this.sidebarEl)==null||t.addEventListener("mouseenter",()=>{this.hoverTimer&&clearTimeout(this.hoverTimer),this.hoverTimer=setTimeout(()=>{this.isExpanded=!0,this.applyExpansion()},150)}),(s=this.sidebarEl)==null||s.addEventListener("mouseleave",()=>{this.hoverTimer&&clearTimeout(this.hoverTimer),this.hoverTimer=setTimeout(()=>{this.isExpanded=!1,this.expandedMenus.clear(),this.applyExpansion(),this.updateSubMenus()},100)}),this.wireLinks(),K.mount(),W.mount(),Ve.mount(n=>this.navigateTo(n))}wireLinks(){this.sidebarEl&&(this.sidebarEl.querySelectorAll(".nav-main-link").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault();const s=e,n=s.dataset.page;s.dataset.hasSubpages==="true"?this.toggleSubMenu(n):this.navigateTo(n)})}),this.sidebarEl.querySelectorAll(".nav-sub-link").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault(),this.navigateTo(e.dataset.page)})}))}toggleSubMenu(e){this.expandedMenus.has(e)?this.expandedMenus.delete(e):(this.expandedMenus.clear(),this.expandedMenus.add(e)),this.updateSubMenus()}navigateTo(e){var s,n;this.currentPage=e,this.onPageChange(e);const t=ae.find(i=>{var r;return i.main===e||((r=i.subPages)==null?void 0:r.some(l=>l.id===e))});t&&((s=t.subPages)!=null&&s.some(i=>i.id===e)?(this.expandedMenus.clear(),this.expandedMenus.add(t.main)):(n=t.subPages)!=null&&n.length?this.expandedMenus.has(t.main)?this.expandedMenus.delete(t.main):(this.expandedMenus.clear(),this.expandedMenus.add(t.main)):this.expandedMenus.clear()),this.updateActiveStates(),this.updateSubMenus()}applyExpansion(){this.sidebarEl&&(this.isExpanded?(this.sidebarEl.classList.remove("w-16"),this.sidebarEl.classList.add("w-64")):(this.sidebarEl.classList.remove("w-64"),this.sidebarEl.classList.add("w-16")),this.sidebarEl.querySelectorAll(".nav-label").forEach(e=>{this.isExpanded?(e.classList.remove("opacity-0","pointer-events-none"),e.classList.add("opacity-100")):(e.classList.remove("opacity-100"),e.classList.add("opacity-0","pointer-events-none"))}),this.sidebarEl.querySelectorAll(".nav-chevron").forEach(e=>{e.classList.toggle("opacity-0",!this.isExpanded),e.classList.toggle("opacity-100",this.isExpanded)}),W.refresh(),K.refresh())}updateSubMenus(){this.sidebarEl&&(this.sidebarEl.querySelectorAll(".sub-menu").forEach(e=>{const t=e.dataset.parent;e.classList.toggle("hidden",!(this.isExpanded&&this.expandedMenus.has(t)))}),this.sidebarEl.querySelectorAll(".nav-main-link").forEach(e=>{const t=e.querySelector(".nav-chevron svg");t&&t.classList.toggle("rotate-90",this.expandedMenus.has(e.dataset.page))}))}updateActiveStates(){this.sidebarEl&&(this.sidebarEl.querySelectorAll(".nav-main-link").forEach(e=>{var i,r,l;const t=e.dataset.page,s=this.currentPage===t||((r=(i=ae.find(c=>c.main===t))==null?void 0:i.subPages)==null?void 0:r.some(c=>c.id===this.currentPage))===!0,n=(l=e.closest("li"))==null?void 0:l.querySelector("div.absolute");n&&(n.classList.toggle("bg-dry-sage-400",s),n.classList.toggle("bg-transparent",!s)),s?(e.classList.remove("text-grey-700","hover:bg-charcoal-200","hover:text-white"),e.classList.add("bg-charcoal-300","text-dry-sage-400")):(e.classList.remove("bg-charcoal-300","text-dry-sage-400"),e.classList.add("text-grey-700","hover:bg-charcoal-200","hover:text-white"))}),this.sidebarEl.querySelectorAll(".nav-sub-link").forEach(e=>{this.currentPage===e.dataset.page?(e.classList.remove("text-grey-600","hover:text-white","hover:bg-charcoal-200"),e.classList.add("text-dry-sage-400","bg-charcoal-200")):(e.classList.remove("text-dry-sage-400","bg-charcoal-200"),e.classList.add("text-grey-600","hover:text-white","hover:bg-charcoal-200"))}))}expand(){this.isExpanded=!0,this.applyExpansion()}collapse(){this.isExpanded=!1,this.expandedMenus.clear(),this.applyExpansion(),this.updateSubMenus()}}const ue="game-status-sticky";function Oe(a){const e=a.state,t=e==="GAME_IN_MATCH"||!e&&a.inMatch,s=e==="GAME_MENU"||!e&&a.isRunning;return t?{label:"En jeu",classes:"text-frosted-mint-500 border-frosted-mint-500/40 bg-frosted-mint-500/10",dotClasses:"bg-frosted-mint-500 animate-pulse"}:s?{label:"Deadlock lancé",classes:"text-blue-400 border-blue-500/40 bg-blue-500/10",dotClasses:"bg-blue-400"}:{label:"Deadlock non lancé",classes:"text-grey-300 border-grey-600 bg-charcoal-300",dotClasses:"bg-grey-500"}}function qe(a){const e=Oe(a);return`
    <button
      type="button"
      class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold shadow-sm ${e.classes}"
      title="${e.label}"
      aria-label="${e.label}"
    >
      <span class="w-2 h-2 rounded-full ${e.dotClasses}"></span>
      <span>${e.label}</span>
    </button>
  `}async function ie(){var t;const a=document.getElementById(ue);if(!a)return;let e={isRunning:!1,inMatch:!1,matchId:null,state:"GAME_CLOSED",timestamp:Date.now()};try{(t=window.api)!=null&&t.getGameStatus&&(e=await window.api.getGameStatus())}catch{}a.innerHTML=qe(e)}const ne={containerId:ue,mount(){const a=document.getElementById(this.containerId);a&&(a.innerHTML='<div class="text-xs text-grey-400">...</div>',ie())},refresh(){ie()}};class Ue{constructor(){o(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-6">
            Profil
          </h1>
          <p class="text-grey-300 mb-8">
            Votre profil et statistiques personnelles.
          </p>
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600">
            <p class="text-grey-400">
              Page en développement - Profil
            </p>
          </div>
        </div>
      </div>
    `)}}class Fe{constructor(){o(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
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
    `)}}class We{constructor(){o(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
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
    `)}}class Ze{constructor(){o(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
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
    `)}}class Ke{constructor(){o(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-6">
            Rank Distribution
          </h1>
          <p class="text-grey-300 mb-8">
            Graphique de distribution des rangs et volume de matchs par sous-rang.
          </p>
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600">
            <p class="text-grey-400">
              Page en développement - Rank Distribution
            </p>
          </div>
        </div>
      </div>
    `)}}class Ye{constructor(){o(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
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
    `)}}const Xe="https://api.deadlock-api.com";class Je{constructor(){o(this,"container",null)}mount(e){this.container=e,this.renderSkeleton(),this.fetchAndRender()}renderSkeleton(){this.container&&(this.container.innerHTML=`
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
      </div>`}async fetchAndRender(){if(!this.container)return;let e=[];try{const t=await fetch(`${Xe}/v1/assets/heroes`);if(t.ok){const s=await t.json();e=(Array.isArray(s)?s:s.data??[]).filter(i=>i.player_selectable===!0&&i.disabled===!1&&i.in_development===!1),e.sort((i,r)=>(i.name??"").localeCompare(r.name??""))}}catch{}if(this.container){if(e.length===0){this.container.innerHTML=`
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
      </div>`}}renderHeroCard(e){var i,r,l,c;const t=((i=e.images)==null?void 0:i.icon_hero_card_webp)??((r=e.images)==null?void 0:r.icon_hero_card)??((l=e.images)==null?void 0:l.icon_image_small_webp)??((c=e.images)==null?void 0:c.icon_image_small)??"",s=e.name??"—",n=t?`<img src="${t}" alt="${s}"
              class="w-full h-full object-cover object-top
                     transition-transform duration-300 ease-out
                     group-hover:scale-[1.06]"/>`:`<div class="w-full h-full flex items-center justify-center
                    text-grey-600 text-xs bg-charcoal-300">?</div>`;return`
      <a href="#hero-${e.id}"
         title="${s}"
         class="group flex flex-col items-center gap-1.5 cursor-pointer">
        <div class="w-[96px] h-[128px] rounded-lg overflow-hidden
                    border border-charcoal-400
                    group-hover:border-dry-sage-400
                    shadow-md group-hover:shadow-dry-sage-400/20 group-hover:shadow-lg
                    transition-all duration-250 bg-charcoal-200 shrink-0">
          ${n}
        </div>
        <span class="text-[11px] leading-tight text-center text-grey-500
                     w-[96px] truncate
                     transition-colors duration-200 group-hover:text-dry-sage-400">
          ${s}
        </span>
      </a>`}}class Qe{constructor(){o(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-6">
            Hero Details
          </h1>
          <p class="text-grey-300 mb-8">
            Stats par patch, Tier List interactive et Ability Order.
          </p>
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600">
            <p class="text-grey-400">
              Page en développement - Hero Details
            </p>
          </div>
        </div>
      </div>
    `)}}class et{constructor(){o(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
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
    `)}}const tt={yellow:{border:"border-l-yellow-400",dot:"bg-yellow-400",text:"text-yellow-400"},blue:{border:"border-l-blue-400",dot:"bg-blue-400",text:"text-blue-400"},green:{border:"border-l-emerald-400",dot:"bg-emerald-400",text:"text-emerald-400"}};function q(a){return a.toFixed(1)}class st{static render(e){var _,j,f,G,z,N,V;const{player:t,laneColor:s}=e,n=tt[s??""]??{border:"border-l-grey-600",dot:"bg-grey-600"},i=((_=t.steamProfile)==null?void 0:_.personaname)??t.name??`Player ${t.player_slot+1}`,r=((j=t.heroData)==null?void 0:j.name)??t.hero_name??"—",l=((f=t.steamProfile)==null?void 0:f.profileurl)??`https://steamcommunity.com/profiles/${BigInt(t.account_id)+BigInt("76561197960265728")}`,c=((z=(G=t.heroData)==null?void 0:G.images)==null?void 0:z.icon_image_small_webp)??((V=(N=t.heroData)==null?void 0:N.images)==null?void 0:V.icon_image_small)??"",d=t.heroMatchesPlayed??0,h=t.heroWinrate!==void 0?Math.round(t.heroWinrate):null,g=t.heroAvgKills!==void 0?q(t.heroAvgKills):"—",b=t.heroAvgDeaths!==void 0?q(t.heroAvgDeaths):"—",w=t.heroAvgAssists!==void 0?q(t.heroAvgAssists):"—",M=t.heroAvgKills!==void 0&&t.heroAvgDeaths!==void 0&&t.heroAvgAssists!==void 0?q((t.heroAvgKills+t.heroAvgAssists)/Math.max(t.heroAvgDeaths,.1)):null,k=t.rankName??null,D=t.rankImageUrl??null,u=t.rankTopPercent!==void 0?t.rankTopPercent:null,p=t.activity12h,I=t.activity30d;return`
      <div class="
        relative h-full flex flex-col
        bg-[#1a1f24] rounded-lg
        border border-[#2a2f35] border-l-4 ${n.border}
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
          >${i}</a>
          <span class="w-2 h-2 rounded-full ml-2 shrink-0 ${n.dot}"></span>
        </div>

        <!-- HERO SECTION: icon + "as Hero (Xp)" + winrate -->
        <div class="flex items-center gap-2 px-3 pb-2 shrink-0">
          <!-- Hero icon: icon_image_small_webp from /v1/assets/heroes/{id} (full CDN URL) -->
          ${c?`<div class="w-10 h-10 rounded-full bg-[#111518] border-2 border-[#2a2f35] overflow-hidden shrink-0 flex items-center justify-center">
                 <img src="${c}" alt="${r}" class="w-full h-full object-cover" />
               </div>`:`<div class="w-10 h-10 rounded-full bg-[#111518] border-2 border-[#2a2f35] shrink-0 flex items-center justify-center">
                 <svg class="w-5 h-5 text-[#555]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                 </svg>
               </div>`}
          <div class="flex flex-col min-w-0">
            <span class="text-[#c9d1d9] text-sm font-medium leading-tight truncate">
              as ${r}${d>0?` (${d}p)`:""}
            </span>
            ${h!==null?`<span class="text-[#9ca3af] text-xs leading-tight">
                   ${h}% Win
                 </span>`:""}
          </div>
        </div>

        <!-- DIVIDER -->
        <div class="mx-3 border-t border-[#2a2f35] mb-2 shrink-0"></div>

        <!-- KDA SECTION -->
        <div class="px-3 pb-2 shrink-0">
          <div class="flex items-center justify-center gap-1 text-sm font-bold leading-tight">
            <span class="text-emerald-400">${g}</span>
            <span class="text-[#555]">/</span>
            <span class="text-red-400">${b}</span>
            <span class="text-[#555]">/</span>
            <span class="text-yellow-400">${w}</span>
          </div>
          <p class="text-center text-[10px] text-[#555] mt-0.5 leading-tight">
            ${M!==null?`KDA (${M})`:"KDA (—)"}
          </p>
        </div>

        <!-- DIVIDER -->
        <div class="mx-3 border-t border-[#2a2f35] mb-2 shrink-0"></div>

        <!-- RANK SECTION -->
        <div class="flex items-center gap-2 px-3 pb-2 shrink-0">
          ${D?`<img src="${D}" alt="${k??"rank"}" class="w-8 h-8 object-contain shrink-0" />`:'<div class="w-8 h-8 rounded bg-[#111518] border border-[#2a2f35] shrink-0"></div>'}
          <div class="flex flex-col min-w-0">
            <span class="text-white text-xs font-semibold leading-tight truncate">
              ${k??"—"}
            </span>
            ${u!==null?`<span class="text-[#9ca3af] text-[10px] leading-tight">Top ${u}%</span>`:""}
          </div>
        </div>

        <!-- DIVIDER -->
        <div class="mx-3 border-t border-[#2a2f35] mb-2 shrink-0"></div>

        <!-- ACTIVITY: 12H + 30D -->
        <div class="flex gap-2 px-3 pb-2 shrink-0">
          <div class="flex-1 bg-[#111518] rounded px-2 py-1">
            <p class="text-[10px] text-[#555] leading-tight font-medium">12H</p>
            <p class="text-[11px] text-[#9ca3af] leading-tight">
              ${p!==void 0?`${p.games} games · ${p.wins} wins`:"— games · — wins"}
            </p>
          </div>
          <div class="flex-1 bg-[#111518] rounded px-2 py-1">
            <p class="text-[10px] text-[#555] leading-tight font-medium">30D</p>
            <p class="text-[11px] text-[#9ca3af] leading-tight">
              ${I!==void 0?`${I.games} games · ${I.wins} wins`:"— games · — wins"}
            </p>
          </div>
        </div>

        <!-- TAG PLACEHOLDER (future: WARMING UP / IN GAME / etc.) -->
        <div class="mt-auto px-3 pb-3 shrink-0">
          <!-- tag slot: status logic to be wired from MatchHistory endpoint -->
        </div>
      </div>
    `}static mount(e,t){e.innerHTML=this.render(t)}}const E="https://api.deadlock-api.com",re=[80659633,84419762,80457157],at=12*60*60,it=30*24*60*60;class nt{constructor(){o(this,"container",null);o(this,"isLoading",!1);o(this,"matchData",null);o(this,"heroCache",new Map);o(this,"detectedMatchId",null);o(this,"currentGameState","GAME_CLOSED");o(this,"isDemoMode",!1);o(this,"demoIndex",0);o(this,"rankDistribution",[]);o(this,"rankAssets",[])}mount(e){this.container=e,this.isDemoMode=localStorage.getItem("demoModeEnabled")==="true",this.renderCurrentState(),this.syncStateFromMain()}handleGameStateChanged(e,t){e==="GAME_IN_MATCH"&&t?(this.detectedMatchId=String(t),localStorage.setItem("detectedMatchId",this.detectedMatchId)):e==="GAME_CLOSED"&&(this.detectedMatchId=null,localStorage.removeItem("detectedMatchId"));const s=this.currentGameState;this.currentGameState=e,!(!this.container||s===e)&&this.transitionToState(e)}handleDetectedMatch(e){this.handleGameStateChanged("GAME_IN_MATCH",e)}clearDetectedMatchId(){this.handleGameStateChanged("GAME_CLOSED")}async syncStateFromMain(){var e;if((e=window.api)!=null&&e.getGameStatus)try{const t=await window.api.getGameStatus(),s=t.state??(t.inMatch?"GAME_IN_MATCH":t.isRunning?"GAME_MENU":"GAME_CLOSED");if(s===this.currentGameState)return;s==="GAME_IN_MATCH"&&t.matchId&&(this.detectedMatchId=String(t.matchId),localStorage.setItem("detectedMatchId",this.detectedMatchId)),this.currentGameState=s,this.renderCurrentState()}catch{}}renderCurrentState(){this.isDemoMode=localStorage.getItem("demoModeEnabled")==="true",this.isDemoMode||this.currentGameState==="GAME_IN_MATCH"?(this.renderInitialLoading(),this.loadMatchData()):this.currentGameState==="GAME_MENU"?this.renderMenuView():this.renderClosedView()}async transitionToState(e){this.container&&(this.container.style.transition="opacity 0.3s ease",this.container.style.opacity="0",await new Promise(t=>setTimeout(t,300)),this.container&&(e==="GAME_IN_MATCH"?(this.renderInitialLoading(),this.loadMatchData()):e==="GAME_MENU"?this.renderMenuView():this.renderClosedView(),this.container.style.opacity="1"))}renderClosedView(){this.container&&(this.container.innerHTML=`
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
    `)}resolveMatchId(){if(this.isDemoMode)return String(re[this.demoIndex]);if(this.detectedMatchId)return this.detectedMatchId;const e=localStorage.getItem("detectedMatchId");return e?(this.detectedMatchId=e,e):"57331114"}async loadMatchData(){var e,t,s,n,i;if(!(this.isLoading||!this.container)){this.isLoading=!0;try{if(!((e=window.api)!=null&&e.executePython))throw new Error("API not available");const r=this.resolveMatchId();let l=await window.api.executePython("match",r,!1),c=!1;if(l.cached)c=!0;else if(!l.success||l.status==="api_error")if((t=window.api)!=null&&t.getCachedMatch){const u=await window.api.getCachedMatch(r);if(u)l={success:!0,data:u,cached:!0},c=!0;else throw new Error(l.error||"Failed to fetch match data and no cache available")}else throw new Error(l.error||"Failed to fetch match data");const d=((s=l.data)==null?void 0:s.match_info)??l.data;if(!(d!=null&&d.players))throw new Error("Invalid match data structure");c&&this.container&&this.showCacheIndicator();let h=d.players.map(u=>({...u,lane:u.lane??this.mapLaneNumber(u.assigned_lane)}));const g=h.map(u=>u.account_id).filter(Boolean);await Promise.all([this.fetchRankDistribution(),this.fetchRankAssets()]);const[b,w,M,k]=await Promise.all([this.fetchSteamProfiles(g),this.fetchHeroDataMap(h.map(u=>u.hero_id).filter(Boolean)),this.fetchHeroStats(g),this.fetchPlayerMMR(g)]),D=await this.fetchAllMatchHistories(g);h=h.map(u=>{const p=M.get(`${u.account_id}:${u.hero_id}`),I=k.get(u.account_id),_=D.get(u.account_id)??[],j=Math.floor(Date.now()/1e3),f=(p==null?void 0:p.matches_played)??0,G=(p==null?void 0:p.wins)??0,z=f>0?G/f*100:void 0,N=p&&f>0?p.kills/f:void 0,V=p&&f>0?p.deaths/f:void 0,me=p&&f>0?p.assists/f:void 0,P=I==null?void 0:I.rank,ee=P!==void 0?Math.floor(P/10):void 0,R=P!==void 0?P%10:void 0,T=ee!==void 0?this.rankAssets.find(x=>x.tier===ee):void 0,ge=["","I","II","III","IV","V","VI"],pe=T&&R!==void 0?`${T.name} ${ge[R]??""}`.trim():void 0,te=R!==void 0?`small_subrank${R}_webp`:void 0,ve=T?(te&&T.images[te])??T.images.small_webp??T.images.small??void 0:void 0,fe=P!==void 0?this.computeTopPercent(P):void 0,be=_.filter(x=>x.start_time>=j-at),xe=_.filter(x=>x.start_time>=j-it),se=x=>({games:x.length,wins:x.filter(ye=>ye.match_result===1).length});return{...u,steamProfile:b.get(u.account_id),heroData:w.get(u.hero_id),heroMatchesPlayed:f,heroWinrate:z,heroAvgKills:N,heroAvgDeaths:V,heroAvgAssists:me,rankBadgeLevel:P,rankName:pe,rankImageUrl:ve,rankTopPercent:fe,activity12h:se(be),activity30d:se(xe)}}),this.matchData={match_id:d.match_id,duration_s:d.duration_s,winning_team:d.winning_team,players:h,teams:((n=l.data)==null?void 0:n.teams)??[]},!c&&!this.isDemoMode&&l.success&&((i=window.api)!=null&&i.cacheMatch)&&d.match_id&&window.api.cacheMatch(r,this.matchData).catch(()=>{}),this.renderMatchData()}catch(r){console.error("Failed to load match data:",r),this.showError(r instanceof Error?r.message:"Failed to load match data")}finally{this.isLoading=!1}}}async fetchSteamProfiles(e){const t=new Map;if(!e.length)return t;try{const s=await fetch(`${E}/v1/players/steam?account_ids=${e.join(",")}`);if(!s.ok)return t;(await s.json()).forEach(i=>t.set(i.account_id,i))}catch{}return t}async fetchHeroDataMap(e){const t=[...new Set(e)],s=await Promise.all(t.map(i=>this.fetchHeroData(i))),n=new Map;return t.forEach((i,r)=>{s[r]&&n.set(i,s[r])}),n}async fetchHeroData(e){if(this.heroCache.has(e))return this.heroCache.get(e);try{const t=await fetch(`${E}/v1/assets/heroes/${e}`);if(!t.ok)return null;const s=await t.json();return this.heroCache.set(e,s),s}catch{return null}}async fetchHeroStats(e){const t=new Map;if(!e.length)return t;try{const s=await fetch(`${E}/v1/players/hero-stats?account_ids=${e.join(",")}`);if(!s.ok)return t;(await s.json()).forEach(i=>t.set(`${i.account_id}:${i.hero_id}`,i))}catch{}return t}async fetchPlayerMMR(e){const t=new Map;if(!e.length)return t;try{const s=await fetch(`${E}/v1/players/mmr?account_ids=${e.join(",")}`);if(!s.ok)return t;(await s.json()).forEach(i=>{const r=t.get(i.account_id);(!r||i.start_time>r.start_time)&&t.set(i.account_id,i)})}catch{}return t}async fetchRankDistribution(){if(!(this.rankDistribution.length>0))try{const e=await fetch(`${E}/v1/players/mmr/distribution`);if(!e.ok)return;this.rankDistribution=await e.json()}catch{}}async fetchRankAssets(){if(!(this.rankAssets.length>0))try{const e=await fetch(`${E}/v1/assets/ranks`);if(!e.ok)return;this.rankAssets=await e.json()}catch{}}async fetchAllMatchHistories(e){const t=new Map;return(await Promise.all(e.map(async n=>{try{const i=await fetch(`${E}/v1/players/${n}/match-history`),r=i.ok?await i.json():[];return{id:n,entries:r}}catch{return{id:n,entries:[]}}}))).forEach(({id:n,entries:i})=>t.set(n,i)),t}computeTopPercent(e){if(!this.rankDistribution.length)return 50;const t=this.rankDistribution.reduce((n,i)=>n+i.players,0);if(t===0)return 50;const s=this.rankDistribution.filter(n=>n.rank>e).reduce((n,i)=>n+i.players,0);return Math.round(s/t*100)}mapLaneNumber(e){return e===1?"blue":e===4?"yellow":e===6?"green":e!==void 0?{0:"yellow",2:"green"}[e]:void 0}organizePlayersIntoGrid(e){const t=(i,r)=>e.filter(l=>l.lane===i&&l.team===r),s=[t("yellow",0)[0]??null,t("yellow",0)[1]??null,t("blue",0)[0]??null,t("blue",0)[1]??null,t("green",0)[0]??null,t("green",0)[1]??null],n=[t("yellow",1)[0]??null,t("yellow",1)[1]??null,t("blue",1)[0]??null,t("blue",1)[1]??null,t("green",1)[0]??null,t("green",1)[1]??null];return{row0:s,row1:n}}renderMatchData(){if(!this.container||!this.matchData)return;const{row0:e,row1:t}=this.organizePlayersIntoGrid(this.matchData.players),s=l=>l<2?"yellow":l<4?"blue":"green",n=(l,c)=>{if(!l)return'<div class="bg-[#1a1f24] rounded-lg border border-[#2a2f35] opacity-20"></div>';const d=document.createElement("div");return st.mount(d,{player:l,laneColor:s(c)}),d.innerHTML},i=this.matchData.match_id??this.resolveMatchId(),r=this.isDemoMode?'<span class="px-2 py-0.5 rounded text-xs font-medium bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">DEMO</span>':"";this.container.innerHTML=`
      <div class="bg-charcoal-100 min-h-screen h-screen overflow-hidden flex flex-col">

        <!-- HEADER -->
        <div class="flex items-center justify-between px-4 py-3 shrink-0 border-b border-[#2a2f35]">
          <div class="flex items-center gap-3">
            <h1 class="text-lg font-bold text-white">Live Dashboard</h1>
            ${r}
            <!-- Match ID always visible regardless of mode -->
            <span class="text-xs text-[#555] font-mono">Match ID: ${i}</span>
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
          ${e.map((l,c)=>`<div class="min-h-0">${n(l,c)}</div>`).join("")}
          ${t.map((l,c)=>`<div class="min-h-0">${n(l,c)}</div>`).join("")}
        </div>
      </div>
    `,this.attachEventListeners()}attachEventListeners(){var e;(e=document.getElementById("refresh-match-btn"))==null||e.addEventListener("click",()=>{this.isDemoMode&&(this.demoIndex=(this.demoIndex+1)%re.length),this.loadMatchData()})}showError(e){if(!this.container)return;const t=document.createElement("div");t.className="fixed bottom-4 right-4 z-50 bg-red-900/90 border border-red-500/50 rounded-lg p-4 max-w-sm",t.innerHTML=`
      <p class="text-red-400 font-semibold text-sm mb-1">Erreur de chargement</p>
      <p class="text-red-300 text-xs">${e}</p>
    `,this.container.appendChild(t),setTimeout(()=>t.remove(),7e3)}showCacheIndicator(){var t;if(!this.container)return;(t=this.container.querySelector(".cache-indicator"))==null||t.remove();const e=document.createElement("div");e.className="cache-indicator fixed top-16 right-4 z-40 bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-3",e.innerHTML=`
      <p class="text-yellow-400 text-sm font-semibold">Données en cache</p>
      <p class="text-yellow-300 text-xs">L'API est indisponible. Affichage des dernières données.</p>
    `,this.container.appendChild(e),setTimeout(()=>e.parentNode&&e.remove(),5e3)}}class rt{constructor(){o(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
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
    `)}}class ot{constructor(){o(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
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
    `)}}class lt{constructor(){o(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
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
    `)}}class ct{constructor(){o(this,"container",null);o(this,"demoModeEnabled",!1);o(this,"steamProfile",null);o(this,"boundHandleContainerClick",e=>{const t=e.target;t.closest("#steam-connect-btn")?this.handleSteamStartAuth():t.closest("#steam-disconnect-btn")&&this.handleSteamLogout()})}mount(e){this.container=e,this.container.addEventListener("click",this.boundHandleContainerClick),Promise.all([this.loadDemoModeState(),this.loadSteamProfile()]).then(()=>this.render())}refresh(){this.container&&Promise.all([this.loadDemoModeState(),this.loadSteamProfile()]).then(()=>this.render())}async loadSteamProfile(){var e;try{(e=window.api)!=null&&e.steamGetProfile&&(this.steamProfile=await window.api.steamGetProfile())}catch(t){console.error("Failed to load Steam profile:",t)}}async loadDemoModeState(){try{const e=localStorage.getItem("demoModeEnabled");if(e!==null)this.demoModeEnabled=e==="true";else{const t=localStorage.getItem("mockModeEnabled");t!==null&&(this.demoModeEnabled=t==="true",localStorage.setItem("demoModeEnabled",t),localStorage.removeItem("mockModeEnabled"))}}catch(e){console.error("Failed to load demo mode state:",e)}}async toggleDemoMode(e){try{this.demoModeEnabled=e,localStorage.setItem("demoModeEnabled",e.toString()),this.updateToggleUI()}catch(t){console.error("Failed to toggle demo mode:",t)}}updateToggleUI(){const e=document.getElementById("mock-mode-toggle"),t=document.getElementById("mock-mode-indicator");e&&(e.setAttribute("aria-checked",this.demoModeEnabled.toString()),e.classList.toggle("bg-frosted-mint-500",this.demoModeEnabled),e.classList.toggle("bg-grey-600",!this.demoModeEnabled)),t&&(t.textContent=this.demoModeEnabled?"Actif":"Inactif",t.classList.toggle("text-frosted-mint-500",this.demoModeEnabled),t.classList.toggle("text-grey-400",!this.demoModeEnabled))}render(){var e;this.container&&(this.container.innerHTML=`
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
    `,this.attachEventListeners())}attachEventListeners(){const e=document.getElementById("mock-mode-toggle");e&&e.addEventListener("click",()=>{this.toggleDemoMode(!this.demoModeEnabled)})}async handleSteamLogout(){var e;try{(e=window.api)!=null&&e.steamLogout&&await window.api.steamLogout()}catch(t){console.error("Steam logout failed:",t)}}async handleSteamStartAuth(){var e;try{if(!((e=window.api)!=null&&e.steamStartAuth))return;(await window.api.steamStartAuth()).success&&(await this.loadSteamProfile(),this.render(),K.refresh())}catch(t){console.error("Steam auth failed:",t)}}}class dt{constructor(){o(this,"container",null);o(this,"pollInterval",null);o(this,"tickInterval",null);o(this,"devicesOpen",!1);o(this,"trackFetchedAt",0);o(this,"trackProgressMs",0);o(this,"trackDurationMs",0);o(this,"trackIsPlaying",!1)}mount(e){this.stopAll(),this.container=e,this.init()}stopAll(){this.pollInterval!==null&&(clearInterval(this.pollInterval),this.pollInterval=null),this.tickInterval!==null&&(clearInterval(this.tickInterval),this.tickInterval=null)}async init(){this.renderSkeleton();const e=await window.spotify.getAuthStatus();e.isAuthenticated?(await this.renderPlayer(e.displayName),this.startIntervals()):this.renderLogin()}renderSkeleton(){this.container&&(this.container.innerHTML=`
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
      </div>`,(e=document.getElementById("spotify-login-btn"))==null||e.addEventListener("click",()=>this.handleLogin()))}async handleLogin(){const e=document.getElementById("spotify-login-btn");e&&(e.disabled=!0,e.textContent="Ouverture du navigateur…"),this.renderSkeleton();const t=await window.spotify.login();t.success?(await this.renderPlayer(t.displayName??null),this.startIntervals()):(this.renderLogin(),this.showToast(`Connexion échouée : ${t.error??"erreur inconnue"}`,"error"))}async renderPlayer(e){if(!this.container)return;const[t,s]=await Promise.all([window.spotify.getCurrentlyPlaying(),window.spotify.getDevices()]);this.storeTrackState(t);const{pct:n}=this.currentProgress(),i=s.find(r=>r.is_active);this.container.innerHTML=`
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
            ${this.buildTrackHTML(t,n)}
          </div>

          <!-- Device selector -->
          <div class="bg-charcoal-200 rounded-xl border border-grey-600 overflow-hidden" id="devices-section">
            <div class="flex items-center">
              <button id="devices-toggle"
                class="flex-1 flex items-center gap-2 px-5 py-3 text-sm text-grey-300 hover:text-white hover:bg-charcoal-100 transition-colors">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
                </svg>
                <span>${i?this.esc(i.name):"Appareils"}</span>
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
      </button>`).join("")}attachPlayerListeners(e,t){var n,i,r,l,c,d;let s=e;(n=document.getElementById("spotify-logout-btn"))==null||n.addEventListener("click",()=>this.handleLogout()),(i=document.getElementById("spotify-prev"))==null||i.addEventListener("click",async()=>{await window.spotify.previous().catch(()=>null),setTimeout(()=>this.syncTrack(),500)}),(r=document.getElementById("spotify-next"))==null||r.addEventListener("click",async()=>{await window.spotify.next().catch(()=>null),setTimeout(()=>this.syncTrack(),500)}),(l=document.getElementById("spotify-play-pause"))==null||l.addEventListener("click",async()=>{s?(this.trackIsPlaying=!1,await window.spotify.pause().catch(()=>null)):(this.trackIsPlaying=!0,this.trackFetchedAt=Date.now(),await window.spotify.play().catch(()=>null)),s=!s,this.updatePlayPauseBtn(s),setTimeout(()=>this.syncTrack(),500)}),(c=document.getElementById("devices-toggle"))==null||c.addEventListener("click",()=>{var g;this.devicesOpen=!this.devicesOpen,(g=document.getElementById("devices-list"))==null||g.classList.toggle("hidden",!this.devicesOpen);const h=document.getElementById("devices-chevron");h&&(h.style.transform=this.devicesOpen?"rotate(180deg)":"")}),(d=document.getElementById("devices-refresh-btn"))==null||d.addEventListener("click",async()=>{const h=document.getElementById("devices-refresh-btn");h&&(h.style.opacity="0.4");const g=await window.spotify.getDevices().catch(()=>t),b=document.getElementById("devices-list");b&&(b.innerHTML=this.buildDevicesHTML(g)),this.attachDeviceListeners(g);const w=document.getElementById("devices-toggle"),M=g.find(D=>D.is_active),k=w==null?void 0:w.querySelector("span");k&&(k.textContent=M?M.name:"Appareils"),h&&(h.style.opacity="")}),this.attachDeviceListeners(t)}attachDeviceListeners(e){var t;(t=document.getElementById("devices-list"))==null||t.querySelectorAll(".device-item").forEach(s=>{s.addEventListener("click",async()=>{var r;const n=s.dataset.deviceId;await window.spotify.transferDevice(n).catch(()=>null),this.devicesOpen=!1,(r=document.getElementById("devices-list"))==null||r.classList.add("hidden");const i=document.getElementById("devices-chevron");i&&(i.style.transform=""),setTimeout(async()=>{var g;const l=await window.spotify.getDevices().catch(()=>e),c=document.getElementById("devices-list");c&&(c.innerHTML=this.buildDevicesHTML(l)),this.attachDeviceListeners(l);const d=l.find(b=>b.is_active),h=(g=document.getElementById("devices-toggle"))==null?void 0:g.querySelector("span");h&&(h.textContent=d?d.name:"Appareils"),await this.syncTrack()},1200)})})}updatePlayPauseBtn(e){const t=document.getElementById("spotify-play-pause");t&&(t.title=e?"Pause":"Lecture",t.innerHTML=e?'<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>':'<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>')}startIntervals(){this.stopAll(),this.tickInterval=setInterval(()=>this.tick(),1e3),this.pollInterval=setInterval(()=>this.syncTrack(),5e3)}tick(){if(!this.trackIsPlaying||this.trackDurationMs===0)return;const{progressMs:e,pct:t}=this.currentProgress(),s=document.getElementById("spotify-progress-bar");s&&(s.style.width=`${t.toFixed(1)}%`);const n=document.getElementById("spotify-time-current");n&&(n.textContent=this.fmtMs(e)),e>=this.trackDurationMs-1500&&this.syncTrack()}async syncTrack(){var n;const e=await window.spotify.getCurrentlyPlaying().catch(()=>null);this.storeTrackState(e);const t=document.getElementById("spotify-player-card");if(!t)return;if(this.updatePlayPauseBtn(this.trackIsPlaying),(((n=t.querySelector("[title]"))==null?void 0:n.getAttribute("title"))??"")!==((e==null?void 0:e.title)??"")){const{pct:i}=this.currentProgress();t.innerHTML=this.buildTrackHTML(e,i),this.attachPlayerListeners(this.trackIsPlaying,await window.spotify.getDevices().catch(()=>[]))}}async handleLogout(){this.stopAll(),await window.spotify.logout(),this.renderLogin()}showToast(e,t){const s=document.getElementById("spotify-toast");s&&(s.textContent=e,s.className=`mt-4 px-4 py-2 rounded-lg text-sm text-center ${t==="error"?"bg-red-900 text-red-200":"text-black"}`,t==="success"&&(s.style.background="#1DB954"),s.classList.remove("hidden"),setTimeout(()=>s.classList.add("hidden"),5e3))}esc(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}fmtMs(e){const t=Math.floor(e/1e3);return`${Math.floor(t/60)}:${(t%60).toString().padStart(2,"0")}`}}class ht{constructor(){o(this,"container",null);o(this,"isLoading",!1)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
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
Répertoire de travail: ${t.workingDir}`),this.updateUIState("error",s)}finally{this.isLoading=!1,this.updateUIState("idle")}}}updateUIState(e,t){const s=document.getElementById("loading-indicator"),n=document.getElementById("error-message"),i=document.getElementById("success-message"),r=document.getElementById("test-api-btn");switch(s&&s.classList.add("hidden"),n&&(n.classList.add("hidden"),n.textContent=""),i&&(i.classList.add("hidden"),i.textContent=""),r&&(r.disabled=!1),e){case"loading":s&&s.classList.remove("hidden"),r&&(r.disabled=!0);break;case"success":i&&(i.classList.remove("hidden"),i.textContent=t||"Succès !");break;case"error":n&&(n.classList.remove("hidden"),n.textContent=t||"Une erreur est survenue");break}}displayResults(e){const t=document.getElementById("results-content");if(!t)return;const s=e.data;if(!s||!s.items||s.items.length===0){t.innerHTML=`
        <p class="text-dry-sage-400">Aucun item trouvé dans la réponse.</p>
        <pre class="mt-4 p-4 bg-charcoal-100 rounded text-xs overflow-auto">${JSON.stringify(e,null,2)}</pre>
      `;return}const n=s.items.map(i=>`
      <div class="bg-charcoal-200 rounded-lg p-4 mb-3 border border-grey-600 hover:border-dry-sage-500 transition-colors">
        <div class="flex items-start gap-4">
          ${i.image_webp||i.image?`
            <div class="shrink-0">
              <img 
                src="${i.image_webp||i.image}" 
                alt="${i.name||"Item"}"
                class="w-20 h-20 object-cover rounded-lg border-2 border-grey-600 bg-charcoal-100"
                onerror="this.onerror=null; this.src='${i.image||""}'; this.onerror=function(){this.style.display='none';}"
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
              ${i.name||"Nom inconnu"}
            </h3>
            <div class="space-y-1">
              <p class="text-sm text-grey-300">
                <span class="text-dry-sage-400 font-medium">ID:</span> 
                <span class="text-cream-500">${i.id||"N/A"}</span>
              </p>
              <p class="text-sm text-grey-300">
                <span class="text-dry-sage-400 font-medium">Class:</span> 
                <span class="text-grey-400">${i.class_name||"N/A"}</span>
              </p>
              ${i.heroes&&i.heroes.length>0?`
                <p class="text-sm text-grey-300">
                  <span class="text-dry-sage-400 font-medium">Heroes:</span> 
                  <span class="text-frosted-mint-400">${i.heroes.length}</span>
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
        ${n}
      </div>
    `}}class ut{constructor(){o(this,"sidebar");o(this,"currentPage","profil");o(this,"contentContainer",null);o(this,"profilPage",new Ue);o(this,"gameOverlayPage",new Fe);o(this,"leaderboardPage",new We);o(this,"metaItemsPage",new Ze);o(this,"rankDistributionPage",new Ke);o(this,"settingsPage",new Ye);o(this,"heroLibraryPage",new Je);o(this,"heroDetailsPage",new Qe);o(this,"metaBuildsPage",new et);o(this,"liveDashboardPage",new nt);o(this,"tacticalAnalysisPage",new rt);o(this,"rankingsPage",new ot);o(this,"rankAnalyticsPage",new lt);o(this,"configurationPage",new ct);o(this,"spotifyWidgetPage",new dt);o(this,"accueilPage",new ht);this.sidebar=new Re(e=>this.handlePageChange(e))}init(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>this.setup()):this.setup()}setup(){var s,n;const e=document.getElementById("app");if(!e){console.error("App container not found");return}e.innerHTML=`
      <div class="flex h-screen bg-charcoal-100">
        <div id="sidebar-container"></div>
        <main id="content" class="flex-1 overflow-y-auto" style="margin-left: 16rem;">
          <!-- Content will be rendered here -->
        </main>
        <div id="game-status-sticky" class="fixed top-4 right-4 z-[70]"></div>
      </div>
    `;const t=document.getElementById("sidebar-container");t&&this.sidebar.mount(t),ne.mount(),(s=window.api)!=null&&s.onSteamProfileUpdated&&window.api.onSteamProfileUpdated(()=>{K.refresh(),this.currentPage==="configuration"&&this.configurationPage.refresh()}),(n=window.api)!=null&&n.onGameStateChanged&&window.api.onGameStateChanged(({state:i,matchId:r})=>{ne.refresh(),this.liveDashboardPage.handleGameStateChanged(i,r),(i==="GAME_IN_MATCH"||i==="GAME_MENU")&&this.currentPage!=="live-dashboard"&&this.sidebar.navigateTo("live-dashboard")}),this.contentContainer=document.getElementById("content"),this.renderPage(this.currentPage)}handlePageChange(e){this.contentContainer&&this.currentPage!==e?this.animatePageOut(()=>{this.currentPage=e,this.renderPage(e)}):(this.currentPage=e,this.renderPage(e))}animatePageOut(e){if(!this.contentContainer){e();return}this.contentContainer.classList.add("page-fade-out"),this.contentContainer.classList.remove("page-fade-in"),setTimeout(()=>{e(),this.contentContainer&&(this.contentContainer.classList.remove("page-fade-out"),this.contentContainer.classList.add("page-fade-in"),setTimeout(()=>{this.contentContainer&&this.contentContainer.classList.remove("page-fade-in")},250))},250)}renderPage(e){if(this.contentContainer)if(this.isMainPage(e))switch(e){case"profil":this.profilPage.mount(this.contentContainer);break;case"hero-stats":this.heroLibraryPage.mount(this.contentContainer);break;case"game-overlay":this.gameOverlayPage.mount(this.contentContainer);break;case"leaderboards":this.leaderboardPage.mount(this.contentContainer);break;case"meta-items":this.metaItemsPage.mount(this.contentContainer);break;case"rank-distribution":this.rankDistributionPage.mount(this.contentContainer);break;case"settings":this.settingsPage.mount(this.contentContainer);break}else if(this.isSubPage(e))switch(e){case"hero-library":this.heroLibraryPage.mount(this.contentContainer);break;case"hero-details":this.heroDetailsPage.mount(this.contentContainer);break;case"meta-builds":this.metaBuildsPage.mount(this.contentContainer);break;case"live-dashboard":this.liveDashboardPage.mount(this.contentContainer);break;case"tactical-analysis":this.tacticalAnalysisPage.mount(this.contentContainer);break;case"rankings":this.rankingsPage.mount(this.contentContainer);break;case"rank-analytics":this.rankAnalyticsPage.mount(this.contentContainer);break;case"configuration":this.configurationPage.mount(this.contentContainer);break;case"spotify-widget":this.spotifyWidgetPage.mount(this.contentContainer);break}else switch(e){case"accueil":this.accueilPage.mount(this.contentContainer);break;default:console.warn(`Unknown page: ${e}`),this.profilPage.mount(this.contentContainer)}}isMainPage(e){return["profil","hero-stats","game-overlay","leaderboards","meta-items","rank-distribution","settings"].includes(e)}isSubPage(e){return["hero-library","hero-details","meta-builds","live-dashboard","tactical-analysis","rankings","rank-analytics","configuration","spotify-widget"].includes(e)}}const mt=new ut;mt.init();console.log('👋 Application initialized via "renderer.ts"');
