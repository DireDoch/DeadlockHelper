var es=Object.defineProperty;var ts=(i,e,t)=>e in i?es(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var p=(i,e,t)=>ts(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();const ss={HomeIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path>',Cog6ToothIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>',Bars3Icon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>',XMarkIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18 18 6M6 6l12 12"></path>',BugAntIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 12.75c.733 0 1.5-.195 2.062-.532a7.5 7.5 0 0 0 2.625-3.003 7.5 7.5 0 0 1-4.687 2.625c-.384.023-.768.05-1.125.08v2.25c.375-.043.766-.087 1.125-.12A9.344 9.344 0 0 0 12 12.75Zm0 0v2.25M9 3.003a7.5 7.5 0 0 1 6 0M5.25 21.75a18.45 18.45 0 0 1-1.5-7.5v-4.5c0-1.71.54-3.32 1.5-4.5M18.75 21.75a18.49 18.49 0 0 0 1.5-7.5v-4.5c0-1.71-.54-3.32-1.5-4.5M9 6a9 9 0 0 1 6 0M15 18.75v-4.5M12 15.75v-4.5"></path>',TrophyIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.228a46.45 46.45 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.844 1.16v-1.801a6.772 6.772 0 0 0 1.623-.174 3 3 0 0 0 2.198-2.784M13.5 9.75a2.25 2.25 0 0 0-2.25 2.25v15.75m0 0h6.75v-15.75m-6.75 0v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21.75"></path>',VideoCameraIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"></path>',WrenchScrewdriverIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655-5.653a2.548 2.548 0 0 0-3.586-3.586l-1.757 1.757a11.25 11.25 0 0 1 5.983 5.983l1.757-1.757a2.548 2.548 0 0 0 3.586-3.586l-5.653-4.655Z"></path>',ChartBarIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75Zm9.75-8.25c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.875Zm9.75-3c0-.621.504-1.125 1.125-1.125h2.25C20.496.75 21 1.254 21 1.875v16.5c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V1.875Z"></path>',ChevronDoubleLeftIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"></path>',ChevronDoubleRightIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"></path>',ListBulletIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>',CubeIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/>',PresentationChartBarIcon:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"/>'};function re(i){return ss[i]||""}function ie(i,e){return`<svg class="${e}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    ${i}
  </svg>`}const as=(i="w-6 h-6")=>ie(re("HomeIcon"),i),rs=(i="w-6 h-6")=>ie(re("Cog6ToothIcon"),i),is=(i="w-6 h-6")=>ie(re("BugAntIcon"),i),ns=(i="w-6 h-6")=>ie(re("VideoCameraIcon"),i),os=(i="w-6 h-6")=>ie(re("ListBulletIcon"),i),ls=(i="w-6 h-6")=>ie(re("CubeIcon"),i),cs=(i="w-6 h-6")=>ie(re("PresentationChartBarIcon"),i);let Ht=100;function ds(i,e){const t=i>=100,s=t?"text-frosted-mint-500":i>=90?"text-yellow-500":"text-orange-500",a=t?"OK":"Degradé",r=t?"bg-frosted-mint-500":i>=90?"bg-yellow-500":"bg-orange-500";return e?`
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
    `}function $e(i){var a;Ht=i;const e=document.getElementById(De.containerId);if(!e)return;const t=((a=document.getElementById("sidebar"))==null?void 0:a.classList.contains("w-64"))??!0;e.innerHTML=ds(i,t);const s=document.getElementById(De.refreshButtonId);s==null||s.addEventListener("click",()=>{var r,n;(n=(r=window.api)==null?void 0:r.triggerHealthCheck)==null||n.call(r)})}const De={containerId:"api-status-placeholder",refreshButtonId:"api-status-refresh-btn",mount(){var e,t,s;const i=document.getElementById(this.containerId);i&&(i.innerHTML='<div class="text-sm text-grey-500">…</div>',(t=(e=window.api)==null?void 0:e.getApiAvailability)==null||t.call(e).then(a=>$e(a)).catch(()=>$e(100)),(s=window.api)!=null&&s.onHealthStatusChange&&window.api.onHealthStatusChange(a=>$e(a)))},refresh(){$e(Ht)}},Nt="user-profile-placeholder";function hs(i,e,t){const s=!!(i!=null&&i.steamId64),a=!e.installed&&e.error;return t?s?`
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
    `}async function Re(){var r,n,l;const i=document.getElementById(Nt);if(!i)return;const e=((r=document.getElementById("sidebar"))==null?void 0:r.classList.contains("w-64"))??!0;let t=null,s={installed:!1,path:null};try{(n=window.api)!=null&&n.steamGetProfile&&(t=await window.api.steamGetProfile()),(l=window.api)!=null&&l.steamCheckInstallation&&(s=await window.api.steamCheckInstallation())}catch{}i.innerHTML=hs(t,s,e);const a=document.getElementById("user-profile-connect-btn");a&&a.addEventListener("click",async()=>{var o;if((o=window.api)!=null&&o.steamStartAuth){a.disabled=!0;try{const d=await window.api.steamStartAuth();d.success?await Re():(!d.cancelled&&d.error&&(d.error.includes("déjà en cours")||console.error("Steam auth error:",d.error)),await Re())}finally{a.disabled=!1}}})}const je={containerId:Nt,mount(){const i=document.getElementById(this.containerId);i&&(i.innerHTML='<div class="text-sm text-grey-500">…</div>',Re())},refresh(){Re()}};let C=null,ce=[],ee=!1,Le=!0,le=!1,Fe=null,Oe=null,Ee=null;function Ve(i){const e=Math.floor(i/1e3);return`${Math.floor(e/60)}:${(e%60).toString().padStart(2,"0")}`}function J(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ft(){if(!C)return{progressMs:0,pct:0};const i=C.isPlaying?Date.now()-C.fetchedAt:0,e=Math.min(C.progressMs+i,C.durationMs),t=C.durationMs>0?e/C.durationMs*100:0;return{progressMs:e,pct:t}}const R={music:'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>',play:'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',pause:'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',prev:'<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>',next:'<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z"/></svg>',refresh:'<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>',device:'<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>',speaker:'<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 14.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zm3.5-9H8V5h7v2.5z"/></svg>'};function us(){return Le?ps():ee?C?bs():gs():ms()}function ps(i){return`
    <div class="flex items-center gap-2 animate-pulse">
      <div class="w-10 h-10 rounded bg-charcoal-300 shrink-0"></div>
      <div class="flex-1 space-y-2">
        <div class="h-2.5 bg-charcoal-300 rounded w-3/4"></div>
        <div class="h-2.5 bg-charcoal-300 rounded w-1/2"></div>
      </div>
    </div>`}function ms(i){return`
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-black" style="background:#1DB954">${R.music}</div>
      <div class="flex-1 min-w-0">
        <p class="text-xs font-semibold text-white">Spotify</p>
        <button id="smp-connect-btn" class="text-xs underline hover:opacity-80 transition-opacity mt-0.5" style="color:#1DB954">Se connecter</button>
      </div>
    </div>`}function gs(i){return`
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded bg-charcoal-100 flex items-center justify-center shrink-0 text-grey-500">${R.music}</div>
      <div class="flex-1 min-w-0">
        <p class="text-xs text-grey-400 leading-tight">Rien en lecture</p>
        <button id="smp-refresh-btn" class="flex items-center gap-1 text-grey-500 hover:text-white transition-colors text-xs mt-1">
          ${R.refresh}<span>Actualiser</span>
        </button>
      </div>
    </div>`}function bs(i){const{progressMs:e,pct:t}=Ft(),s=C,a=ce.find(l=>l.is_active),r=s.albumArtUrl?`<img src="${J(s.albumArtUrl)}" alt="" class="rounded object-cover shrink-0" style="width:40px;height:40px">`:`<div class="rounded bg-charcoal-100 flex items-center justify-center shrink-0 text-grey-500" style="width:40px;height:40px">${R.music}</div>`,n=le?fs():"";return`
    <div class="space-y-2">
      <!-- Track row -->
      <div class="flex items-center gap-2">
        ${r}
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-white leading-tight truncate" title="${J(s.title)}">${J(s.title)}</p>
          <p class="text-xs text-grey-400 truncate leading-tight mt-0.5">${J(s.artist)}</p>
        </div>
        <button id="smp-refresh-btn" class="text-grey-500 hover:text-white transition-colors p-1 shrink-0" title="Actualiser les appareils">
          ${R.refresh}
        </button>
      </div>

      <!-- Progress bar -->
      <div class="h-0.5 rounded-full bg-charcoal-300 overflow-hidden">
        <div id="smp-progress" class="h-full rounded-full" style="background:#1DB954;width:${t.toFixed(1)}%;transition:width 1s linear"></div>
      </div>

      <!-- Time + active device -->
      <div class="flex items-center justify-between text-grey-500" style="font-size:10px">
        <span id="smp-time">${Ve(e)}</span>
        ${a?`<span class="flex items-center gap-1 truncate max-w-[90px] px-1">${a.type==="Smartphone"?R.speaker:R.device}<span class="truncate">${J(a.name)}</span></span>`:""}
        <span>${Ve(s.durationMs)}</span>
      </div>

      <!-- Controls -->
      <div class="flex items-center justify-center gap-5">
        <button id="smp-prev" class="text-grey-400 hover:text-white transition-colors" title="Précédent">${R.prev}</button>
        <button id="smp-play-pause" class="text-white hover:opacity-75 transition-opacity" title="${s.isPlaying?"Pause":"Lecture"}">${s.isPlaying?R.pause:R.play}</button>
        <button id="smp-next" class="text-grey-400 hover:text-white transition-colors" title="Suivant">${R.next}</button>
      </div>

      <!-- Device list (toggled) -->
      ${n}
    </div>`}function fs(){return ce.length===0?'<p class="text-center text-grey-500 py-1" style="font-size:10px">Aucun appareil trouvé</p>':`
    <div id="smp-device-list" class="rounded border border-grey-600 overflow-hidden" style="background:#0d0d0d">
      ${ce.map(i=>`
        <button data-device-id="${J(i.id)}"
          class="smp-device-btn w-full text-left flex items-center gap-2 px-3 py-1.5 hover:bg-charcoal-300 transition-colors ${i.is_active?"text-white":"text-grey-400"}"
          style="font-size:11px">
          ${i.is_active?'<span style="color:#1DB954;font-size:8px;line-height:1">●</span>':'<span style="width:8px;display:inline-block"></span>'}
          ${i.type==="Smartphone"?R.speaker:R.device}
          <span class="truncate">${J(i.name)}</span>
        </button>`).join("")}
    </div>`}function Y(){const i=document.getElementById("spotify-widget-placeholder");i&&(i.innerHTML=us(),vs())}function vs(){var i,e,t,s,a,r;(i=document.getElementById("smp-connect-btn"))==null||i.addEventListener("click",()=>{Ee==null||Ee("spotify-widget")}),(e=document.getElementById("smp-play-pause"))==null||e.addEventListener("click",async()=>{if(!C)return;const n=C.isPlaying;C.isPlaying=!n,n||(C.fetchedAt=Date.now()),Y(),n?await window.spotify.pause().catch(()=>null):await window.spotify.play().catch(()=>null),setTimeout(te,600)}),(t=document.getElementById("smp-prev"))==null||t.addEventListener("click",async()=>{await window.spotify.previous().catch(()=>null),setTimeout(te,600)}),(s=document.getElementById("smp-next"))==null||s.addEventListener("click",async()=>{await window.spotify.next().catch(()=>null),setTimeout(te,600)}),(a=document.getElementById("smp-refresh-btn"))==null||a.addEventListener("click",async()=>{le?le=!1:(await We(),le=!0),Y()}),(r=document.getElementById("smp-device-list"))==null||r.querySelectorAll(".smp-device-btn").forEach(n=>{n.addEventListener("click",async()=>{const l=n.dataset.deviceId;l&&(le=!1,await window.spotify.transferDevice(l).catch(()=>null),setTimeout(()=>{We(),te()},1200))})})}function xs(){if(!(C!=null&&C.isPlaying))return;const{progressMs:i,pct:e}=Ft(),t=document.getElementById("smp-progress");t&&(t.style.width=`${e.toFixed(1)}%`);const s=document.getElementById("smp-time");s&&(s.textContent=Ve(i)),C.durationMs>0&&i>=C.durationMs-1500&&te()}async function te(){try{const i=await window.spotify.getCurrentlyPlaying();C=i?{...i,fetchedAt:Date.now()}:null,ee||(ee=!0),Y()}catch{}}async function We(){try{ce=await window.spotify.getDevices()}catch{}}const ys={containerId:"spotify-widget-placeholder",mount(i){Ee=i,Le=!0,le=!1,C=null,ce=[],Y(),window.spotify.getAuthStatus().then(({isAuthenticated:e})=>(ee=e,Le=!1,e?Promise.all([te(),We()]):(Y(),Promise.resolve()))).catch(()=>{Le=!1,Y()}),Oe!==null&&clearInterval(Oe),Oe=setInterval(xs,1e3),Fe!==null&&clearInterval(Fe),Fe=setInterval(async()=>{const{isAuthenticated:e}=await window.spotify.getAuthStatus().catch(()=>({isAuthenticated:!1,displayName:null}));e!==ee&&(ee=e,e||(C=null,ce=[]),Y()),ee&&te()},1e4)},refresh(){Y()}},Ot=[{main:"profil",label:"Profile",icon:as},{main:"game-overlay",label:"Live Dashboard",icon:ns,subPages:[{id:"live-dashboard",label:"Live Dashboard"},{id:"tactical-analysis",label:"Tactical Analysis"}]},{main:"hero-stats",label:"Heroes",icon:is},{main:"meta-items",label:"Items",icon:ls},{main:"leaderboards",label:"Leaderboard",icon:os,subPages:[{id:"rankings",label:"Rankings"},{id:"rank-analytics",label:"Rank Analytics"}]},{main:"rank-distribution",label:"Rank Distribution",icon:cs}],Ut={main:"settings",label:"Settings",icon:rs,subPages:[{id:"configuration",label:"Configuration"},{id:"spotify-widget",label:"Spotify Widget"}]},ht=[...Ot,Ut];class ws{constructor(e){p(this,"sidebarEl",null);p(this,"isExpanded",!1);p(this,"currentPage","profil");p(this,"expandedMenus",new Set);p(this,"hoverTimer",null);p(this,"onPageChange");this.onPageChange=e}renderNavItem(e){var o,d;const t=this.currentPage===e.main||((o=e.subPages)==null?void 0:o.some(h=>h.id===this.currentPage))===!0,s=this.expandedMenus.has(e.main),a=!!((d=e.subPages)!=null&&d.length),r=t?"bg-charcoal-300 text-dry-sage-400":"text-grey-700 hover:bg-charcoal-200 hover:text-white",n=`
      <svg class="w-3 h-3 transition-transform duration-200 ${s?"rotate-90":""}"
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
      </svg>`,l=a?`
      <ul class="sub-menu overflow-hidden ${s&&this.isExpanded?"":"hidden"}"
          data-parent="${e.main}">
        ${e.subPages.map(h=>{const c=this.currentPage===h.id;return`
            <li>
              <a href="#" data-page="${h.id}"
                class="nav-sub-link flex items-center gap-2 pl-12 pr-4 py-2 text-xs transition-colors
                  ${c?"text-dry-sage-400 bg-charcoal-200":"text-grey-600 hover:text-white hover:bg-charcoal-200"}">
                <span class="w-1 h-1 rounded-full bg-current shrink-0"></span>
                <span class="whitespace-nowrap">${h.label}</span>
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
              ${Ot.map(e=>this.renderNavItem(e)).join("")}
            </ul>
          </nav>

          <!-- Zone 3 : API Status -->
          <div id="api-status-placeholder"
            class="px-3 py-2.5 min-h-[40px] flex items-center border-t border-grey-200 shrink-0">
            <div class="text-sm text-grey-500">…</div>
          </div>

          <!-- Zone 4 : Settings (épinglé au-dessus du widget Spotify) -->
          <ul class="py-1 border-t border-grey-200 shrink-0">
            ${this.renderNavItem(Ut)}
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
      </aside>`}mount(e){var t,s;e.innerHTML=this.render(),this.sidebarEl=document.getElementById("sidebar"),(t=this.sidebarEl)==null||t.addEventListener("mouseenter",()=>{this.hoverTimer&&clearTimeout(this.hoverTimer),this.hoverTimer=setTimeout(()=>{this.isExpanded=!0,this.applyExpansion()},150)}),(s=this.sidebarEl)==null||s.addEventListener("mouseleave",()=>{this.hoverTimer&&clearTimeout(this.hoverTimer),this.hoverTimer=setTimeout(()=>{this.isExpanded=!1,this.expandedMenus.clear(),this.applyExpansion(),this.updateSubMenus()},100)}),this.wireLinks(),je.mount(),De.mount(),ys.mount(a=>this.navigateTo(a))}wireLinks(){this.sidebarEl&&(this.sidebarEl.querySelectorAll(".nav-main-link").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault();const s=e,a=s.dataset.page;s.dataset.hasSubpages==="true"?this.toggleSubMenu(a):this.navigateTo(a)})}),this.sidebarEl.querySelectorAll(".nav-sub-link").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault(),this.navigateTo(e.dataset.page)})}))}toggleSubMenu(e){this.expandedMenus.has(e)?this.expandedMenus.delete(e):(this.expandedMenus.clear(),this.expandedMenus.add(e)),this.updateSubMenus()}navigateTo(e){var s,a;this.currentPage=e,this.onPageChange(e);const t=ht.find(r=>{var n;return r.main===e||((n=r.subPages)==null?void 0:n.some(l=>l.id===e))});t&&((s=t.subPages)!=null&&s.some(r=>r.id===e)?(this.expandedMenus.clear(),this.expandedMenus.add(t.main)):(a=t.subPages)!=null&&a.length?this.expandedMenus.has(t.main)?this.expandedMenus.delete(t.main):(this.expandedMenus.clear(),this.expandedMenus.add(t.main)):this.expandedMenus.clear()),this.updateActiveStates(),this.updateSubMenus()}applyExpansion(){this.sidebarEl&&(this.isExpanded?(this.sidebarEl.classList.remove("w-16"),this.sidebarEl.classList.add("w-64")):(this.sidebarEl.classList.remove("w-64"),this.sidebarEl.classList.add("w-16")),this.sidebarEl.querySelectorAll(".nav-label").forEach(e=>{this.isExpanded?(e.classList.remove("opacity-0","pointer-events-none"),e.classList.add("opacity-100")):(e.classList.remove("opacity-100"),e.classList.add("opacity-0","pointer-events-none"))}),this.sidebarEl.querySelectorAll(".nav-chevron").forEach(e=>{e.classList.toggle("opacity-0",!this.isExpanded),e.classList.toggle("opacity-100",this.isExpanded)}),De.refresh(),je.refresh())}updateSubMenus(){this.sidebarEl&&(this.sidebarEl.querySelectorAll(".sub-menu").forEach(e=>{const t=e.dataset.parent;e.classList.toggle("hidden",!(this.isExpanded&&this.expandedMenus.has(t)))}),this.sidebarEl.querySelectorAll(".nav-main-link").forEach(e=>{const t=e.querySelector(".nav-chevron svg");t&&t.classList.toggle("rotate-90",this.expandedMenus.has(e.dataset.page))}))}updateActiveStates(){this.sidebarEl&&(this.sidebarEl.querySelectorAll(".nav-main-link").forEach(e=>{var r,n,l;const t=e.dataset.page,s=this.currentPage===t||((n=(r=ht.find(o=>o.main===t))==null?void 0:r.subPages)==null?void 0:n.some(o=>o.id===this.currentPage))===!0,a=(l=e.closest("li"))==null?void 0:l.querySelector("div.absolute");a&&(a.classList.toggle("bg-dry-sage-400",s),a.classList.toggle("bg-transparent",!s)),s?(e.classList.remove("text-grey-700","hover:bg-charcoal-200","hover:text-white"),e.classList.add("bg-charcoal-300","text-dry-sage-400")):(e.classList.remove("bg-charcoal-300","text-dry-sage-400"),e.classList.add("text-grey-700","hover:bg-charcoal-200","hover:text-white"))}),this.sidebarEl.querySelectorAll(".nav-sub-link").forEach(e=>{this.currentPage===e.dataset.page?(e.classList.remove("text-grey-600","hover:text-white","hover:bg-charcoal-200"),e.classList.add("text-dry-sage-400","bg-charcoal-200")):(e.classList.remove("text-dry-sage-400","bg-charcoal-200"),e.classList.add("text-grey-600","hover:text-white","hover:bg-charcoal-200"))}))}expand(){this.isExpanded=!0,this.applyExpansion()}collapse(){this.isExpanded=!1,this.expandedMenus.clear(),this.applyExpansion(),this.updateSubMenus()}}const qt="game-status-sticky";function $s(i){const e=i.state,t=e==="GAME_IN_MATCH"||!e&&i.inMatch,s=e==="GAME_MENU"||!e&&i.isRunning;return t?{label:"En jeu",classes:"text-frosted-mint-500 border-frosted-mint-500/40 bg-frosted-mint-500/10",dotClasses:"bg-frosted-mint-500 animate-pulse"}:s?{label:"Deadlock lancé",classes:"text-blue-400 border-blue-500/40 bg-blue-500/10",dotClasses:"bg-blue-400"}:{label:"Deadlock non lancé",classes:"text-grey-300 border-grey-600 bg-charcoal-300",dotClasses:"bg-grey-500"}}function ks(i){const e=$s(i),t=i.state==="GAME_CLOSED"||!i.isRunning&&!i.inMatch,s=`
    <div
      class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold shadow-sm ${e.classes}"
      title="${e.label}"
    >
      <span class="w-2 h-2 rounded-full ${e.dotClasses}"></span>
      <span>${e.label}</span>
    </div>
  `;return`<div class="flex items-center gap-2">${t?`
    <button
      id="launch-deadlock-btn"
      type="button"
      class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-frosted-mint-500/60 bg-frosted-mint-500/15 text-frosted-mint-400 text-xs font-bold shadow-md hover:bg-frosted-mint-500/25 hover:border-frosted-mint-400 transition-all duration-150 cursor-pointer"
      title="Lancer Deadlock avec les options configurées"
    >
      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
      </svg>
      Lancer Deadlock
    </button>
  `:""}${s}</div>`}async function ut(){var t;const i=document.getElementById(qt);if(!i)return;let e={isRunning:!1,inMatch:!1,matchId:null,state:"GAME_CLOSED",timestamp:Date.now()};try{(t=window.api)!=null&&t.getGameStatus&&(e=await window.api.getGameStatus())}catch{}i.innerHTML=ks(e)}function pt(){const i=document.getElementById("launch-deadlock-btn");i&&i.addEventListener("click",async()=>{var e,t;i.setAttribute("disabled","true"),i.classList.add("opacity-60");try{await((t=(e=window.api).launchDeadlock)==null?void 0:t.call(e))}catch(s){console.error("[GameStatus] Failed to launch Deadlock:",s)}setTimeout(()=>{i.removeAttribute("disabled"),i.classList.remove("opacity-60")},3e3)})}const mt={containerId:qt,mount(){const i=document.getElementById(this.containerId);i&&(i.innerHTML='<div class="text-xs text-grey-400">...</div>',ut().then(()=>pt()))},refresh(){ut().then(()=>pt())}},F=[{tier:1,name:"Initiate",badgeMin:10,badgeMax:19},{tier:2,name:"Seeker",badgeMin:20,badgeMax:29},{tier:3,name:"Alchemist",badgeMin:30,badgeMax:39},{tier:4,name:"Arcanist",badgeMin:40,badgeMax:49},{tier:5,name:"Ritualist",badgeMin:50,badgeMax:59},{tier:6,name:"Emissary",badgeMin:60,badgeMax:69},{tier:7,name:"Archon",badgeMin:70,badgeMax:79},{tier:8,name:"Oracle",badgeMin:80,badgeMax:89},{tier:9,name:"Phantom",badgeMin:90,badgeMax:99},{tier:10,name:"Ascendant",badgeMin:100,badgeMax:109},{tier:11,name:"Eternus",badgeMin:110,badgeMax:116}];function Be(i){return i==="weapon"?"#f97316":i==="spirit"?"#a855f7":i==="vitality"?"#22c55e":"#4b5563"}function de(i){const e={1:"I",2:"II",3:"III",4:"IV"},t=i.item_tier;return!t||!e[t]?"":`<span class="absolute top-0 right-0 text-[8px] font-bold px-0.5 leading-tight rounded-bl pointer-events-none"
                style="background:${Be(i.item_slot_type)};color:#fff;">${e[t]}</span>`}const Gt="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAACXBIWXMAAAsTAAALEwEAmpwYAAADI0lEQVQ4ja1VXUgUURg9c2drN8WMre6tJRM0XUlL+0GNsNJxFwkdUlR6CASRDHqJoHApTIM06CHpzVUfDCGI2oWxB9vczKBC0UiUwL8e6qHWVEpLIp25PaTTTjPVSx/ch3vuPWfO981834Bzjr+t+pMd7X1Ns3y4ReN9TbO8/mRH+784AuccVsEYI1fKOnuyUyWPKK7TcVVdxuBE+FFjoKooEoloVlxiBVJGSZ3cGsxN85oERXEdctO8njq5NUgZteSbQMooaSjrCuWlF8uC8OtY1VZw/3kbAEAQCPLSi+WGsq6QlbABoIwSX7E/mOOWJJHYDBdHpp9haLpP34vEhhy3JPmK/SbHOnPNYY5bkggRDYKLS5/Q2nsV8RucRkdExJE9JbJ9fVeIMuqdicxoulPGGPHJ/mC2u8AkuPRtES3dFzA1O/R7lrpwtrtA8sn+IGOM6E6vlHX25KZ5PdE1XIuB8TCeTNy1FIwuxdEMWbbbHD0AvCIf39lesPdEOfmthgDw5sNr3HxwHovf5wAArvhkeLIqLYUFQYDLmZjceqszQehrmuXxsZtNlz5/mcPF2xWYmhvWMYcYh3TXIX1/9vg1JNJUI+/rHGwbY4zFBwDOOXpH7uHN/CsD/k1dxPC7EIgg4kx+M3ZuTTFxN8Y4QRaW5k0Hbz9OYmCyF/t2SDiQ4IVDjDOcJzmzUJhZDkEQTNyFpXmIiVvdCSmujP3Rb31T7GZ4sir1NTL9Au8XpgEArrhUXK5ow3ZnoklQVZfx8OXdDtJ4p7pmcCL8iHPLNjZFdf4lJG3bbcI5137OhDvVNQQAGgNVRf1jiqJqK38VPJZaiRy3ZHaoraB/TFEaA1VFwOp3GolENMpoqd1m3VEAsGvLQZwruYEYh7G+mqZicPxxuFk5XWroKACYicxoDYFT3qej3YqmqSbR2sJ6xMVsMgk+He1WGgKn9BbVnUYLU0ZL7eu7QtnuAn2oHEzOR2byYVPKg+OPw80PfjlcC8shTRklPtkfPJohy4JA9Dm6Fpxr6B9TlOiUo8Pcm6uOGWOldpvjj5P/ulJrKbj61P//j/oBilOoch4mXcEAAAAASUVORK5CYII=",gt="https://api.deadlock-api.com",zt="#c8a04f",Vt="#5b86d6",ae={0:"THE AMBER HAND",1:"THE SAPPHIRE FLAME"};function Ue(i){return i===1?"#5b86d6":i===4?"#e0c14a":i===6?"#4cc66e":"#6b7280"}function H(i){return i===0?zt:Vt}const Ke=[4,1,6];function Je(i){return i===1}function _s(i,e){if(!Je(e))return[...i].sort((s,a)=>s.player_slot-a.player_slot);const t=s=>{const a=Ke.indexOf(s);return a<0?Ke.length:a};return[...i].sort((s,a)=>t(s.assigned_lane)-t(a.assigned_lane)||s.player_slot-a.player_slot)}function Ms(i){const e=new Set(i.map(t=>t.assigned_lane));return Ke.filter(t=>e.has(t))}function I(i){const e=Math.round(i);return Math.abs(e)>=1e6?`${(e/1e6).toFixed(1)}M`:Math.abs(e)>=1e4?`${(e/1e3).toFixed(1)}k`:Math.abs(e)>=1e3?`${(e/1e3).toFixed(1)}k`:`${e}`}function se(i){return Math.round(i).toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")}function Ss(i){return`${Math.round(i/60)}m`}function U(i){return i.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function Is(i,e){var s,a;const t=i.get(e);return((s=t==null?void 0:t.images)==null?void 0:s.icon_hero_card_webp)??((a=t==null?void 0:t.images)==null?void 0:a.minimap_image_webp)??""}function X(i,e){var s,a;const t=i.get(e);return((s=t==null?void 0:t.images)==null?void 0:s.minimap_image_webp)??((a=t==null?void 0:t.images)==null?void 0:a.icon_hero_card_webp)??""}function Ye(i,e){var t;return((t=i.get(e))==null?void 0:t.name)??`Hero #${e}`}function Wt(i){return i.shop_image_webp??i.shop_image??i.image_webp??""}function he(i,e){return i.get(e)??`#${e}`}function As(i){const e=i.players.find(t=>{var s;return(s=t.stats)==null?void 0:s.length});return e?e.stats.map(t=>t.time_stamp_s):[]}function Ze(i,e){const t=i.stats;if(t!=null&&t.length)return e<0||e>=t.length?t[t.length-1]:t[e]}function Kt(i){const e=(i.gold_lane_creep??0)+(i.gold_lane_creep_orbs??0),t=(i.gold_neutral_creep??0)+(i.gold_neutral_creep_orbs??0),s=(i.gold_player??0)+(i.gold_player_orbs??0),a=(i.gold_boss??0)+(i.gold_boss_orb??0),r=i.gold_treasure??0;return{laneCreeps:e,neutrals:t,playerKills:s,bosses:a,treasure:r,total:e+t+s+a+r}}function Ps(i){const e=(i.shots_hit??0)+(i.shots_missed??0);return e>0?i.shots_hit/e*100:0}function Cs(i,e){const t=new Set,s=[];for(const a of i){if(s.length>=12)break;if(a.sold_time_s!==0&&a.sold_time_s!==null||t.has(a.item_id))continue;const r=e.get(a.item_id);!(r!=null&&r.shop_image_webp)||!r.item_tier||(t.add(a.item_id),s.push(r))}return s}function Ls(i,e){const t=new Map;for(const s of i){const a=e.get(s.item_id);if(!(a!=null&&a.shop_image_webp)||!a.item_tier)continue;const r=t.get(s.item_id);(!r||s.game_time_s<r.game_time_s)&&t.set(s.item_id,s)}return[...t.values()].sort((s,a)=>s.game_time_s-a.game_time_s).map(s=>({item:e.get(s.item_id),gameTimeS:s.game_time_s,sold:s.sold_time_s!==0&&s.sold_time_s!==null}))}function Es(i){const e=i.description;return e?typeof e=="string"?e:(e.desc??e.active??e.passive??"").replace(/<[^>]+>/g,"").trim():""}function Ts(i){var s;const e=i.properties;if(!e||!((s=i.tooltip_sections)!=null&&s.length))return[];const t=[];for(const a of i.tooltip_sections){for(const r of a.section_attributes??[])for(const n of r.important_properties??[]){const l=e[n];if(!l||t.length>=5)continue;const o=l.label??n,d=l.value??"",h=l.prefix??"",c=l.postfix??l.display_units??"";d&&t.push(`${o}: ${h}${d}${c}`)}if(t.length>=5)break}return t}function Yt(i){const e=["","I","II","III","IV"][i.item_tier??0]??"",t=e?`${i.name} — Tier ${e}`:i.name,s=Ts(i),a=s.length?s.join(`
`):Es(i).slice(0,200);return(a?`${t}
${a}`:t).replace(/"/g,"&quot;")}function L(i,e,t,s=I){const a=e+t,r=a>0?e/a*100:50,n=e>t,l=t>e;return`
    <div class="py-1.5">
      <div class="flex items-center justify-between text-sm mb-1">
        <span class="${n?"text-white font-bold":"text-grey-400"} tabular-nums">${s(e)}</span>
        <span class="text-grey-500 text-[11px] uppercase tracking-wider">${i}</span>
        <span class="${l?"text-white font-bold":"text-grey-400"} tabular-nums">${s(t)}</span>
      </div>
      <div class="flex h-1.5 rounded-full overflow-hidden bg-charcoal-300">
        <div style="width:${r}%;background:${zt};${n?"":"opacity:.55;"}"></div>
        <div style="width:${100-r}%;background:${Vt};${l?"":"opacity:.55;"}"></div>
      </div>
    </div>`}function Zt(i){const e=i.valueFmt??I,t=i.maxValue>0?i.value/i.maxValue*100:0,s=i.action?`data-action="${i.action}" data-slot="${i.slot??""}" role="button"`:"";return`
    <div class="flex items-center gap-2 py-0.5 ${i.action?"cursor-pointer":""} ${i.selected?"ring-1 ring-dry-sage-400 rounded":""}" ${s}>
      ${i.iconUrl?`<img src="${i.iconUrl}" class="w-5 h-5 rounded object-cover flex-shrink-0 pointer-events-none" alt="">`:'<div class="w-5 h-5 rounded bg-grey-700 flex-shrink-0"></div>'}
      <div class="relative flex-1 h-5 rounded bg-charcoal-300 overflow-hidden pointer-events-none">
        <div class="absolute inset-y-0 left-0 rounded" style="width:${t}%;background:${i.color};opacity:.85;"></div>
        <span class="absolute inset-0 flex items-center px-2 text-[11px] text-white truncate">${U(i.name)}</span>
      </div>
      <span class="w-14 text-right text-grey-200 text-xs tabular-nums pointer-events-none">${e(i.value)}</span>
      ${i.pct!==void 0?`<span class="w-12 text-right text-grey-500 text-[10px] tabular-nums pointer-events-none">${i.pct.toFixed(1)}%</span>`:""}
    </div>`}function Xt(i){const n=2*Math.PI*42,l=i.segments.reduce((c,u)=>c+u.value,0)||1;let o=0;const d=i.segments.filter(c=>c.value>0).map(c=>{const u=c.value/l,g=Math.max(u*n-1.5,.5),v=-o*n;return o+=u,`<circle cx="60" cy="60" r="42" fill="none" stroke="${c.color}" stroke-width="16"
              stroke-dasharray="${g.toFixed(2)} ${n.toFixed(2)}" stroke-dashoffset="${v.toFixed(2)}"/>`}).join(""),h=i.segments.map((c,u)=>{const g=c.value/l*100;return`<div class="flex items-center gap-2.5 md-rise" style="animation-delay:${u*55}ms">
        <span class="w-3.5 h-3.5 rounded-sm flex-shrink-0" style="background:${c.color};box-shadow:0 0 8px ${c.color}66;"></span>
        <span class="text-grey-300 text-base flex-1 leading-tight">${U(c.label)}</span>
        <span class="text-white text-base font-bold tabular-nums leading-tight">${se(c.value)}</span>
        <span class="text-grey-500 text-sm tabular-nums w-14 text-right leading-tight">${g.toFixed(1)}%</span>
      </div>`}).join("");return`
    <div class="flex items-center gap-6 flex-wrap">
      <div class="relative w-[124px] h-[124px] flex-shrink-0 md-pop-in">
        <svg viewBox="0 0 120 120" class="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="42" fill="none" stroke="#26262b" stroke-width="16"/>
          ${d}
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span class="text-white text-2xl font-bold leading-none tabular-nums">${i.centerValue}</span>
          <span class="text-grey-500 text-[10px] uppercase tracking-widest mt-1">${U(i.centerLabel)}</span>
        </div>
      </div>
      <div class="flex-1 min-w-[200px] space-y-2">${h}</div>
    </div>`}const Te=new Map,qe=new Set;function Jt(i){return Te.get(i)}async function Ds(i){if(!(Te.has(i)||qe.has(i))){qe.add(i);try{const[e,t]=await Promise.all([fetch(`${gt}/v1/assets/items/by-hero-id/${i}`).then(r=>r.ok?r.json():[]).catch(()=>[]),fetch(`${gt}/v1/analytics/ability-order-stats?hero_id=${i}&min_matches=200`).then(r=>r.ok?r.json():[]).catch(()=>[])]),s=(Array.isArray(e)?e:[]).filter(r=>r.name!=="Melee"&&!r.name.includes("_")).slice(0,4),a=(Array.isArray(t)?t:[]).sort((r,n)=>n.matches-r.matches)[0]??null;Te.set(i,{abilities:s,topSeq:a})}catch{Te.set(i,{abilities:[],topSeq:null})}finally{qe.delete(i)}}}function Rs(i){return i.image_webp??i.image??""}function js(i,e){const t=i.winning_team===e;return`${ae[e]} <span class="${t?"text-emerald-400":"text-red-400"}">(${t?"WINNER":"LOSER"})</span>`}function V(i,e){return _s(i.meta.players.filter(t=>t.team===e),i.gameMode)}function O(i){return Ze(i,-1)}function we(i,e,t=""){const s=e.account_id===i.ownerAccountId;return`<button data-action="navigate-player" data-account-id="${e.account_id}"
            class="text-left truncate transition-colors hover:text-dry-sage-400 ${s?"text-white font-semibold":"text-grey-300"} ${t}"
            title="${U(he(i.playerNameMap,e.account_id))}">
            ${U(he(i.playerNameMap,e.account_id))}</button>`}function Bs(i){return`<div class="space-y-4">
    ${[0,1].map(e=>Hs(i,e)).join("")}
  </div>`}function Hs(i,e){const t=V(i,e),s=t.reduce((l,o)=>l+o.kills,0),a=t.reduce((l,o)=>l+o.deaths,0),r=t.reduce((l,o)=>l+o.assists,0),n=s||1;return`
    <div class="rounded-lg border border-grey-700/50 overflow-hidden" style="border-top:2px solid ${H(e)};">
      <div class="flex items-center justify-between px-3 py-2 bg-charcoal-300/40">
        <span class="text-sm font-bold tracking-wide" style="color:${H(e)};">${js(i.meta,e)}</span>
        <span class="text-white text-sm font-bold tabular-nums">${s}/${a}/${r}</span>
      </div>
      <div class="divide-y divide-grey-700/30">
        ${t.map(l=>Ns(i,l,n)).join("")}
      </div>
    </div>`}function Ns(i,e,t){var h;const s=Is(i.heroMap,e.hero_id),a=Cs(e.items,i.itemMap),r=e.deaths>0?(e.kills+e.assists)/e.deaths:e.kills+e.assists,n=(e.kills+e.assists)/t*100,l=((h=O(e))==null?void 0:h.player_damage)??0,o='<div class="w-7 h-7 rounded border border-grey-700/30 bg-charcoal-100/20"></div>',d=Array(12).fill(null).map((c,u)=>{const g=a[u];return g?`<div class="relative w-7 h-7 rounded overflow-hidden border border-grey-700/60" title="${Yt(g)}">
        <img src="${Wt(g)}" alt="${U(g.name)}" class="w-full h-full object-cover">
        ${de(g)}
      </div>`:o}).join("");return`
    <div class="flex items-center gap-3 px-3 py-2 hover:bg-charcoal-300/20">
      <div class="flex items-center gap-2 w-40 min-w-0 flex-shrink-0">
        ${s?`<img src="${s}" class="w-9 h-9 rounded object-cover border border-grey-700 flex-shrink-0" alt="${Ye(i.heroMap,e.hero_id)}">`:'<div class="w-9 h-9 rounded bg-grey-700 flex-shrink-0"></div>'}
        <div class="min-w-0">${we(i,e,"text-sm block w-full")}
          <span class="text-grey-600 text-[10px]">${Ye(i.heroMap,e.hero_id)}</span>
        </div>
      </div>
      <div class="grid grid-cols-6 gap-0.5 flex-shrink-0">${d}</div>
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
    </div>`}function Fs(i){const{state:e}=i,t=As(i.meta),s=e.laneSnapshotIdx<0||e.laneSnapshotIdx>=t.length?t.length-1:e.laneSnapshotIdx,a=Je(i.gameMode),r=a?Ms(i.meta.players):[],n=V(i,0),l=V(i,1),o=(m,b)=>{const f=(b==="left"?e.laneLeft:e.laneRight).has(m.player_slot),y=a?Ue(m.assigned_lane):"#4b5563";return`<button data-action="lane-toggle" data-side="${b}" data-slot="${m.player_slot}"
        class="relative w-9 h-9 rounded overflow-hidden transition-all ${f?"ring-2 scale-105":"opacity-50 hover:opacity-90"}"
        style="${f?`box-shadow:0 0 0 2px ${y};`:""}border:2px solid ${y};"
        title="${U(he(i.playerNameMap,m.account_id))}">
        <img src="${X(i.heroMap,m.hero_id)}" class="w-full h-full object-cover pointer-events-none" alt="">
      </button>`},d=(m,b)=>m.filter(f=>b.has(f.player_slot)).map(f=>`<div class="flex items-center gap-1.5">
          <img src="${X(i.heroMap,f.hero_id)}" class="w-4 h-4 rounded-full object-cover" alt="">
          ${we(i,f,"text-xs")}</div>`).join("")||'<span class="text-grey-600 text-xs">—</span>',h=n.filter(m=>e.laneLeft.has(m.player_slot)),c=l.filter(m=>e.laneRight.has(m.player_slot)),u=(m,b)=>m.reduce((f,y)=>f+(Ze(y,s)?b(Ze(y,s)):0),0),g=(m,b)=>m.length?u(m,b)/m.length:0,v=m=>{const b=u(m,y=>y.shots_hit),f=b+u(m,y=>y.shots_missed);return f>0?b/f*100:0};return`
    <div class="space-y-3">
      ${r.length?`<!-- lane color filter (Normal only) -->
      <div class="flex items-center justify-center gap-3">
        ${r.map(m=>`<button data-action="lane-preset" data-lane="${m}"
            class="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
            style="background:${Ue(m)}40;border-color:${Ue(m)};" title="Lane"></button>`).join("")}
      </div>`:""}

      <!-- hero bar -->
      <div class="flex items-center justify-between gap-2">
        <div class="flex-1">
          <p class="text-[10px] font-bold mb-1" style="color:${H(0)};">${ae[0]}</p>
          <div class="flex flex-wrap gap-1">${n.map(m=>o(m,"left")).join("")}</div>
        </div>
        <span class="text-grey-500 text-xs font-bold px-2">VS</span>
        <div class="flex-1">
          <p class="text-[10px] font-bold mb-1 text-right" style="color:${H(1)};">${ae[1]}</p>
          <div class="flex flex-wrap gap-1 justify-end">${l.map(m=>o(m,"right")).join("")}</div>
        </div>
      </div>

      <!-- time selector -->
      <div class="flex flex-wrap items-center justify-center gap-1">
        ${t.map((m,b)=>`<button data-action="lane-snap" data-idx="${b}"
            class="px-2 py-1 rounded text-xs transition-colors ${b===s?"bg-dry-sage-500 text-charcoal-100 font-semibold":"text-grey-400 hover:bg-charcoal-300"}">
            ${Ss(m)}</button>`).join("")}
      </div>

      <!-- selected names -->
      <div class="flex justify-between gap-4 border-t border-grey-700/40 pt-2">
        <div class="flex-1 space-y-0.5">${d(n,e.laneLeft)}</div>
        <div class="flex-1 space-y-0.5 flex flex-col items-end">${d(l,e.laneRight)}</div>
      </div>

      <!-- comparison bars -->
      <div class="space-y-0.5">
        ${L("Kills",u(h,m=>m.kills),u(c,m=>m.kills),I)}
        ${L("Souls",u(h,m=>m.net_worth),u(c,m=>m.net_worth),se)}
        ${L("Last Hits",u(h,m=>m.creep_kills),u(c,m=>m.creep_kills),I)}
        ${L("Denies",u(h,m=>m.denies),u(c,m=>m.denies),I)}
        ${L("Damage",u(h,m=>m.player_damage),u(c,m=>m.player_damage),se)}
        ${L("Obj Damage",u(h,m=>m.boss_damage),u(c,m=>m.boss_damage),se)}
        ${L("Shots Hit %",v(h),v(c),m=>`${m.toFixed(0)}%`)}
        ${L("Level",g(h,m=>m.level),g(c,m=>m.level),m=>m.toFixed(0))}
      </div>
    </div>`}function Os(i){const{state:e}=i,t=V(i,0),s=V(i,1),a=(l,o,d)=>l.map(h=>`<button data-action="items-pick" data-side="${o}" data-slot="${h.player_slot}"
        class="relative w-9 h-9 rounded overflow-hidden transition-all ${h.player_slot===d?"ring-2 ring-dry-sage-400 scale-105":"opacity-50 hover:opacity-90"}"
        title="${U(he(i.playerNameMap,h.account_id))}">
        <img src="${X(i.heroMap,h.hero_id)}" class="w-full h-full object-cover" alt=""></button>`).join(""),r=t.find(l=>l.player_slot===e.itemsLeftSlot)??t[0],n=s.find(l=>l.player_slot===e.itemsRightSlot)??s[0];return`
    <div class="space-y-4">
      <div class="flex items-center justify-between gap-2">
        <div class="flex flex-wrap gap-1 flex-1">${a(t,"left",e.itemsLeftSlot)}</div>
        <span class="text-grey-500 text-xs font-bold px-2">VS</span>
        <div class="flex flex-wrap gap-1 flex-1 justify-end">${a(s,"right",e.itemsRightSlot)}</div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        ${ft(i,r,0)}
        ${ft(i,n,1)}
      </div>
    </div>`}const bt=["#6eb3a8","#c9a46e","#a86e9e","#8cb86e"];function Us(i){const e=Jt(i.hero_id);if(!e)return`<div class="mt-3 pt-2 border-t border-grey-700/30">
      <p class="text-grey-600 text-[10px] uppercase tracking-wider mb-1">Ability Build</p>
      <p class="text-grey-600 text-xs flex items-center gap-2">
        <span class="w-3 h-3 border-2 border-grey-600 border-t-dry-sage-400 rounded-full animate-spin"></span>
        Chargement de l'ordre de compétences…</p></div>`;if(!e.topSeq||!e.abilities.length)return`<div class="mt-3 pt-2 border-t border-grey-700/30">
      <p class="text-grey-600 text-[10px] uppercase tracking-wider mb-1">Ability Build</p>
      <p class="text-grey-600 text-xs">Ordre de compétences indisponible pour ce héros.</p></div>`;const t=e.topSeq,s=new Map(e.abilities.map((o,d)=>[o.id,d])),a=t.abilities.length,r=Array.from({length:e.abilities.length},()=>Array(a).fill(!1));t.abilities.forEach((o,d)=>{const h=s.get(o);h!==void 0&&(r[h][d]=!0)});const n=t.matches>0?(t.wins/t.matches*100).toFixed(0):"—",l=13;return`
    <div class="mt-3 pt-2 border-t border-grey-700/30">
      <div class="flex items-center justify-between mb-1">
        <p class="text-grey-600 text-[10px] uppercase tracking-wider">Ability Build · + populaire</p>
        <span class="text-grey-500 text-[10px] tabular-nums">${n}% WR · ${se(t.matches)} matchs</span>
      </div>
      <div class="space-y-0.5 overflow-x-auto">
        ${e.abilities.map((o,d)=>{const h=bt[d]??bt[0],c=Rs(o);return`<div class="flex items-center gap-1">
            <div class="w-6 h-6 rounded overflow-hidden border border-grey-700/60 flex-shrink-0" title="${U(o.name)}">
              ${c?`<img src="${c}" class="w-full h-full object-cover" alt="">`:`<div class="w-full h-full flex items-center justify-center text-grey-600 text-[9px]">${d+1}</div>`}
            </div>
            <div class="flex gap-0.5">
              ${r[d].map(u=>`<div class="rounded-sm flex-shrink-0 flex items-center justify-center" style="width:${l}px;height:${l}px;background:${u?h+"33":"rgba(255,255,255,0.04)"};">
                ${u?`<img src="${Gt}" alt="" class="w-2.5 h-2.5 object-contain"/>`:""}</div>`).join("")}
            </div>
          </div>`}).join("")}
      </div>
      <p class="text-grey-700 text-[9px] mt-1 italic">Ordre communautaire (patch actuel) — pas celui de ce match.</p>
    </div>`}function ft(i,e,t){if(!e)return"<div></div>";const s=Ls(e.items,i.itemMap),a=new Map;for(const o of s){const d=Math.floor(o.gameTimeS/60);(a.get(d)??a.set(d,[]).get(d)).push(o)}const r=[...a.keys()].sort((o,d)=>o-d),n=o=>`<div class="flex flex-col items-center gap-1">
        <div class="flex gap-0.5 bg-charcoal-300/40 rounded p-1 border border-grey-700/40">
          ${a.get(o).map(h=>`<div class="relative w-8 h-8 rounded overflow-hidden border border-grey-700/60 ${h.sold?"opacity-40":""}" title="${Yt(h.item)}">
              <img src="${Wt(h.item)}" class="w-full h-full object-cover" alt="${U(h.item.name)}">
              ${de(h.item)}</div>`).join("")}
        </div>
        <span class="text-grey-500 text-[10px]">${o}m</span>
      </div>`,l=r.map((o,d)=>`${d>0?'<span class="text-grey-600 self-start mt-2.5">→</span>':""}${n(o)}`).join("");return`
    <div class="rounded-lg border border-grey-700/40 p-2" style="border-top:2px solid ${H(t)};">
      <div class="flex items-center gap-2 mb-2">
        <img src="${X(i.heroMap,e.hero_id)}" class="w-5 h-5 rounded-full object-cover" alt="">
        ${we(i,e,"text-sm")}
      </div>
      <p class="text-grey-600 text-[10px] uppercase tracking-wider mb-1">Item Timeline</p>
      <div class="flex flex-wrap items-start gap-1">${l||'<span class="text-grey-600 text-xs">Aucun objet</span>'}</div>
      ${Us(e)}
    </div>`}const qs=[{id:"networth",label:"Net Worth"},{id:"income",label:"Income"},{id:"deathloss",label:"Death Loss"}];function Gs(i,e){if(i==="networth")return e.net_worth;const t=O(e);return t?i==="deathloss"?t.gold_death_loss:Kt(t).total:0}function zs(i){const{state:e}=i,t=V(i,0),s=V(i,1),a=c=>c.reduce((u,g)=>u+g.net_worth,0),r=c=>c.reduce((u,g)=>u+g.last_hits,0),n=(c,u)=>c.reduce((g,v)=>g+(O(v)?u(O(v)):0),0),l=[...i.meta.players].map(c=>({p:c,v:Gs(e.economySubtab,c)})).sort((c,u)=>u.v-c.v),o=Math.max(...l.map(c=>c.v),1),d=qs.map(c=>`<button data-action="eco-subtab" data-value="${c.id}"
      class="px-3 py-1.5 rounded text-xs transition-colors ${c.id===e.economySubtab?"bg-dry-sage-500 text-charcoal-100 font-semibold":"text-grey-400 hover:bg-charcoal-300"}">${c.label}</button>`).join(""),h=l.map(({p:c,v:u})=>Zt({iconUrl:X(i.heroMap,c.hero_id),name:he(i.playerNameMap,c.account_id),value:u,maxValue:o,color:H(c.team),selected:c.player_slot===e.economySlot,slot:c.player_slot,action:"eco-pick"})).join("");return`
    <div class="space-y-4">
      <div class="rounded-lg border border-grey-700/50 p-4">
        <div class="flex justify-between mb-3">
          <span class="text-sm font-bold" style="color:${H(0)};">${ae[0]}</span>
          <span class="text-sm font-bold" style="color:${H(1)};">${ae[1]}</span>
        </div>
        ${L("Net Worth",a(t),a(s),I)}
        ${L("Total CS",r(t),r(s),I)}
        ${L("Denies",n(t,c=>c.gold_denied),n(s,c=>c.gold_denied),I)}
        ${L("Death Loss",n(t,c=>c.gold_death_loss),n(s,c=>c.gold_death_loss),I)}
      </div>

      <div class="rounded-lg border border-grey-700/50 p-4">
        <div class="flex flex-wrap gap-1 mb-3">${d}</div>
        <div class="space-y-0.5">${h}</div>
      </div>

      ${Vs(i)}
    </div>`}function Vs(i){const e=i.meta.players.find(r=>r.player_slot===i.state.economySlot)??i.meta.players.find(r=>r.account_id===i.ownerAccountId)??i.meta.players[0],t=e?O(e):void 0;if(!e||!t)return"";const s=Kt(t),a=[{label:"Lane Creeps",value:s.laneCreeps,color:"#f59e0b"},{label:"Neutrals",value:s.neutrals,color:"#22c55e"},{label:"Player Kills",value:s.playerKills,color:"#ef4444"},{label:"Bosses",value:s.bosses,color:"#a855f7"},{label:"Treasure",value:s.treasure,color:"#38bdf8"}];return`
    <div class="rounded-lg border border-grey-700/50 p-4">
      <div class="flex items-center gap-2 mb-4">
        <img src="${X(i.heroMap,e.hero_id)}" class="w-6 h-6 rounded object-cover" alt="">
        ${we(i,e,"text-base")}
        <span class="text-grey-500 text-sm">· Income Breakdown</span>
      </div>
      ${Xt({segments:a,centerValue:I(s.total),centerLabel:"Souls"})}
    </div>`}const Ws=[{id:"hero",label:"Hero Damage"},{id:"total",label:"Total Damage"},{id:"healing",label:"Hero Healing"},{id:"obj",label:"Obj Damage"}];function Ks(i,e){if(!e)return 0;switch(i){case"hero":return e.player_damage;case"total":return e.player_damage+e.creep_damage+e.neutral_damage+e.boss_damage;case"healing":return e.player_healing;case"obj":return e.boss_damage}}function Ys(i){const{state:e}=i,t=V(i,0),s=V(i,1),a=(u,g)=>u.reduce((v,m)=>v+(O(m)?g(O(m)):0),0),r=`
    ${L("Hero Damage",a(t,u=>u.player_damage),a(s,u=>u.player_damage),I)}
    ${L("Hero Healing",a(t,u=>u.player_healing),a(s,u=>u.player_healing),I)}
    ${L("Obj Damage",a(t,u=>u.boss_damage),a(s,u=>u.boss_damage),I)}
    ${L("Damage Taken",a(t,u=>u.player_damage_taken),a(s,u=>u.player_damage_taken),I)}
    ${L("Mitigated",a(t,u=>u.damage_mitigated),a(s,u=>u.damage_mitigated),I)}`,l=[...i.meta.players].map(u=>({p:u,v:Ks(e.damageSubtab,O(u))})),o=l.reduce((u,g)=>u+g.v,0)||1,d=Math.max(...l.map(u=>u.v),1);l.sort((u,g)=>g.v-u.v);const h=l.map(({p:u,v:g})=>Zt({iconUrl:X(i.heroMap,u.hero_id),name:he(i.playerNameMap,u.account_id),value:g,maxValue:d,pct:g/o*100,color:H(u.team),selected:u.player_slot===e.damageSlot,slot:u.player_slot,action:"dmg-pick"})).join(""),c=Ws.map(u=>`<button data-action="dmg-subtab" data-value="${u.id}"
      class="px-3 py-1.5 rounded text-xs transition-colors ${u.id===e.damageSubtab?"bg-dry-sage-500 text-charcoal-100 font-semibold":"text-grey-400 hover:bg-charcoal-300"}">
      ${u.label}</button>`).join("");return`
    <div class="space-y-4">
      <div class="rounded-lg border border-grey-700/50 p-4">
        <div class="flex justify-between mb-2">
          <span class="text-sm font-bold" style="color:${H(0)};">${ae[0]}</span>
          <span class="text-sm font-bold" style="color:${H(1)};">${ae[1]}</span>
        </div>
        ${r}
      </div>

      <div class="rounded-lg border border-grey-700/50 p-4">
        <div class="flex flex-wrap gap-1 mb-3">${c}</div>
        <div class="space-y-0.5">${h}</div>
      </div>

      ${Zs(i)}
    </div>`}function Zs(i){const e=i.meta.players.find(c=>c.player_slot===i.state.damageSlot)??i.meta.players.find(c=>c.account_id===i.ownerAccountId)??i.meta.players[0];if(!e)return"";const t=O(e);if(!t)return"";const s=t.player_damage+t.creep_damage+t.neutral_damage+t.boss_damage,a=Math.max(i.meta.duration_s/60,1),r=i.meta.players.filter(c=>c.team===e.team).reduce((c,u)=>{var g;return c+(((g=O(u))==null?void 0:g.player_damage)??0)},0)||1,n=t.shots_hit+t.shots_missed,l=Math.max(e.deaths,1),o=(c,u)=>`
    <div class="rounded-lg border border-grey-700/40 p-3 bg-charcoal-300/20">
      <p class="text-grey-400 text-sm font-semibold mb-2">${c}</p>
      ${u.map(([g,v])=>`<div class="flex justify-between text-sm py-1"><span class="text-grey-500">${g}</span><span class="text-grey-100 tabular-nums font-medium">${v}</span></div>`).join("")}
    </div>`,d=(c,u)=>`
    <div class="flex-1 rounded-lg bg-charcoal-300/40 border border-grey-700/40 px-3 py-2 text-center">
      <p class="text-white text-lg font-bold tabular-nums leading-none">${u}</p>
      <p class="text-grey-500 text-[10px] uppercase tracking-wider mt-1">${c}</p>
    </div>`,h=[{label:"Heroes",value:t.player_damage,color:"#ef4444"},{label:"Creeps",value:t.creep_damage,color:"#f59e0b"},{label:"Neutrals",value:t.neutral_damage,color:"#22c55e"},{label:"Objectives",value:t.boss_damage,color:"#a855f7"}];return`
    <div class="rounded-lg border border-grey-700/50 p-4">
      <div class="flex items-center gap-2 mb-4">
        <img src="${X(i.heroMap,e.hero_id)}" class="w-7 h-7 rounded object-cover" alt="">
        ${we(i,e,"text-base")}
        <span class="text-grey-500 text-sm">· ${Ye(i.heroMap,e.hero_id)}</span>
      </div>

      <div class="rounded-lg border border-grey-700/40 p-4 bg-charcoal-300/20 mb-3">
        <p class="text-grey-400 text-sm font-semibold mb-3">Damage Breakdown</p>
        ${Xt({segments:h,centerValue:I(s),centerLabel:"Damage"})}
        <div class="flex gap-2 mt-4">
          ${d("DMG / min",I(s/a))}
          ${d("Team Share",`${(t.player_damage/r*100).toFixed(1)}%`)}
          ${d("DMG / Death",I(t.player_damage/l))}
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3">
        ${o("Accuracy",[["Shots",se(n)],["Hits",se(t.shots_hit)],["Hit Rate",`${Ps(t).toFixed(1)}%`]])}
        ${o("Survivability",[["Deaths",`${e.deaths}`],["DMG Taken",I(t.player_damage_taken)],["Mitigated",I(t.damage_mitigated)]])}
        ${o("Power",[["Weapon",`${Math.round(t.weapon_power)}`],["Spirit",`${Math.round(t.tech_power)}`],["Max HP",I(t.max_health)]])}
      </div>
    </div>`}const Xs=[{id:"overview",label:"Overview"},{id:"lane",label:"Lane Stats"},{id:"items",label:"Items"},{id:"economy",label:"Economy"},{id:"damage",label:"Damage"}];class Js{constructor(){p(this,"states",new Map);p(this,"container",null);p(this,"getBase",null)}reset(){this.states.clear()}renderInner(e){const t=this.ensureState(e),s={...e,state:t};return`
      <div class="flex gap-1 border-b border-grey-700/50 mb-3 -mt-1 flex-wrap">
        ${Xs.map(a=>`<button data-action="detail-tab" data-value="${a.id}"
            class="px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors ${t.tab===a.id?"text-dry-sage-400 border-dry-sage-400":"text-grey-400 border-transparent hover:text-grey-200"}">${a.label}</button>`).join("")}
      </div>
      ${this.renderTab(s)}`}renderTab(e){switch(e.state.tab){case"overview":return Bs(e);case"lane":return Fs(e);case"items":return Os(e);case"economy":return zs(e);case"damage":return Ys(e)}}attach(e,t){this.container=e,this.getBase=t,e.querySelectorAll("[data-detail-root]").forEach(s=>{s._mdBound||(s._mdBound=!0,s.addEventListener("click",r=>this.onClick(r,s,t)));const a=t(Number(s.dataset.matchId));a&&this.ensureState(a).tab==="items"&&this.ensureItemsAbilities(a)})}rerender(e){var a,r;const t=(a=this.getBase)==null?void 0:a.call(this,e),s=(r=this.container)==null?void 0:r.querySelector(`[data-detail-root][data-match-id="${e}"] [data-detail-content]`);t&&s&&(s.innerHTML=this.renderInner(t))}ensureItemsAbilities(e){const t=this.ensureState(e),s=r=>{var n;return(n=e.meta.players.find(l=>l.player_slot===r))==null?void 0:n.hero_id},a=[s(t.itemsLeftSlot),s(t.itemsRightSlot)].filter(r=>typeof r=="number");for(const r of new Set(a))Jt(r)||Ds(r).then(()=>{this.ensureState(e).tab==="items"&&this.rerender(e.matchId)})}onClick(e,t,s){const a=e.target.closest("[data-action]");if(!a||!t.contains(a))return;const r=a.dataset.action;if(r==="navigate-player"){const h=Number(a.dataset.accountId);h&&document.dispatchEvent(new CustomEvent("navigate-player",{detail:{accountId:h}}));return}const n=Number(t.dataset.matchId),l=s(n);if(!l)return;const o=this.ensureState(l);switch(r){case"detail-tab":o.tab=a.dataset.value;break;case"lane-snap":o.laneSnapshotIdx=Number(a.dataset.idx);break;case"lane-preset":this.applyLanePreset(l.meta,o,Number(a.dataset.lane));break;case"lane-toggle":{const h=a.dataset.side==="left"?o.laneLeft:o.laneRight,c=Number(a.dataset.slot);h.has(c)?h.delete(c):h.add(c);break}case"items-pick":a.dataset.side==="left"?o.itemsLeftSlot=Number(a.dataset.slot):o.itemsRightSlot=Number(a.dataset.slot);break;case"dmg-subtab":o.damageSubtab=a.dataset.value;break;case"dmg-pick":o.damageSlot=Number(a.dataset.slot);break;case"eco-subtab":o.economySubtab=a.dataset.value;break;case"eco-pick":o.economySlot=Number(a.dataset.slot);break;default:return}const d=t.querySelector("[data-detail-content]");d&&(d.innerHTML=this.renderInner(l)),o.tab==="items"&&this.ensureItemsAbilities(l)}ensureState(e){var o,d,h,c;const t=this.states.get(e.matchId);if(t!=null&&t.initialized)return t;const s=e.meta,a=s.players.find(u=>u.account_id===e.ownerAccountId),r=s.players.filter(u=>u.team===0),n=s.players.filter(u=>u.team===1),l={tab:"overview",laneSnapshotIdx:-1,laneLeft:new Set,laneRight:new Set,itemsLeftSlot:((o=(a==null?void 0:a.team)===0?a:r[0])==null?void 0:o.player_slot)??0,itemsRightSlot:((d=(a==null?void 0:a.team)===1?a:n[0])==null?void 0:d.player_slot)??0,damageSubtab:"hero",damageSlot:((h=a??s.players[0])==null?void 0:h.player_slot)??0,economySubtab:"networth",economySlot:((c=a??s.players[0])==null?void 0:c.player_slot)??0,initialized:!0};return Je(e.gameMode)&&a&&a.assigned_lane!=null&&this.applyLanePreset(s,l,a.assigned_lane),!l.laneLeft.size&&!l.laneRight.size&&(r.forEach(u=>l.laneLeft.add(u.player_slot)),n.forEach(u=>l.laneRight.add(u.player_slot))),this.states.set(e.matchId,l),l}applyLanePreset(e,t,s){t.laneLeft=new Set(e.players.filter(a=>a.team===0&&a.assigned_lane===s).map(a=>a.player_slot)),t.laneRight=new Set(e.players.filter(a=>a.team===1&&a.assigned_lane===s).map(a=>a.player_slot))}}const Qe="/assets/Initiator-DuqRnju5.png",et="/assets/Seekers-CZ-8oZLJ.png",tt="/assets/Alchemist-B11JBQg4.png",st="/assets/Arcanist-DOqtYLaY.png",at="/assets/Ritualist-kCHvunP5.png",rt="/assets/Emissary-Dv2H0klT.png",it="/assets/Archon-BaUdzOEP.png",nt="/assets/Oracle-DxOU2f1c.png",ot="/assets/Phantom-C6YgGs0c.png",lt="/assets/Ascendent-CY0PjSVE.png",ct="/assets/Eternus-BBaqIrhh.png",z="https://api.deadlock-api.com",Qs={1:Qe,2:et,3:tt,4:st,5:at,6:rt,7:it,8:nt,9:ot,10:lt,11:ct},ea=["","I","II","III","IV","V","VI"],ta={1:"Normal",4:"Street Brawl"},sa={1:6,4:4},vt=[{id:"overview",label:"Overview"},{id:"heroes",label:"Heroes"},{id:"matches",label:"Matches"}];let ke=null,be=null,_e=null,fe=null,Me=null,ve=null;function xt(){return ke?Promise.resolve(ke):be||(be=fetch(`${z}/v1/assets/heroes`).then(i=>i.ok?i.json():[]).then(i=>(ke=new Map(i.map(e=>[e.id,e])),ke)).catch(()=>(be=null,new Map)),be)}function yt(){return _e?Promise.resolve(_e):fe||(fe=fetch(`${z}/v1/assets/items`).then(i=>i.ok?i.json():[]).then(i=>(_e=new Map(i.map(e=>[e.id,e])),_e)).catch(()=>(fe=null,new Map)),fe)}function wt(){return Me?Promise.resolve(Me):ve||(ve=fetch(`${z}/v1/analytics/badge-distribution`).then(i=>i.ok?i.json():[]).then(i=>(Me=i,Me)).catch(()=>(ve=null,null)),ve)}function aa(i){var s;const e=Math.floor(i/10),t=i%10;return{name:((s=F.find(a=>a.tier===e))==null?void 0:s.name)??"Unknown",subtier:t,tier:e}}function ra(i,e){const t=e.reduce((s,a)=>s+a.total_matches,0);return t?e.filter(s=>s.badge_level>i).reduce((s,a)=>s+a.total_matches,0)/t*100:0}function ia(i){const e=Math.floor(Date.now()/1e3)-i;return e<120?`${e}s`:e<3600?`${Math.floor(e/60)}min.`:e<86400?`${Math.floor(e/3600)}h`:e<86400*7?`${Math.floor(e/86400)}d`:e<86400*30?`${Math.floor(e/(86400*7))} weeks`:e<86400*365?`${Math.floor(e/(86400*30))} months`:`${Math.floor(e/(86400*365))}y`}function na(i){return`${Math.floor(i/60)}:${String(i%60).padStart(2,"0")}`}function oa(i){return i===0?{label:"Inactif",color:"text-grey-500"}:i<6?{label:"Peu actif",color:"text-amber-400"}:i<21?{label:"Actif",color:"text-emerald-400"}:{label:"Très actif",color:"text-emerald-300"}}function la(i,e){const t=new Set,s=[];for(const a of i){if(s.length>=12)break;if(a.sold_time_s!==0&&a.sold_time_s!==null||t.has(a.item_id))continue;const r=e.get(a.item_id);!(r!=null&&r.shop_image_webp)||!r.item_tier||(t.add(a.item_id),s.push(r))}return s}function ca(i,e,t=3){const s=new Map;for(const a of i){const r=s.get(a.hero_id)??{total:0,wins:0};r.total++,a.match_result===a.player_team&&r.wins++,s.set(a.hero_id,r)}return[...s.entries()].sort((a,r)=>r[1].total-a[1].total).slice(0,t).map(([a,r])=>{const n=i.filter(u=>u.hero_id===a).slice(0,50),l=n.reduce((u,g)=>u+g.player_kills,0),o=n.reduce((u,g)=>u+g.player_deaths,0),d=n.reduce((u,g)=>u+g.player_assists,0),h=o>0?(l+d)/o:l+d,c=i.filter(u=>u.hero_id===a).slice(0,5).map(u=>u.match_result===u.player_team);return{heroId:a,hero:e.get(a),total:r.total,wins:r.wins,kda:h,kills:l,deaths:o,assists:d,kdaCount:n.length,recent5:c,pickRate:r.total/i.length*100}})}class da{constructor(){p(this,"container",null);p(this,"currentTab","overview");p(this,"loading",!0);p(this,"steamProfile",null);p(this,"deadlockProfile",null);p(this,"badgeDist",null);p(this,"allMatches",[]);p(this,"visibleCount",10);p(this,"heroMap",new Map);p(this,"itemMap",new Map);p(this,"matchMetaMap",new Map);p(this,"metaLoadingSet",new Set);p(this,"expandedMatches",new Set);p(this,"matchDetail",new Js);p(this,"playerNameMap",new Map);p(this,"movingAvgBadge",null);p(this,"externalAccountId",null)}mount(e){this.externalAccountId=null,this._resetState(e),this.loadData()}mountForPlayer(e,t){this.externalAccountId=t,this._resetState(e),this.loadDataForPlayer(t)}_resetState(e){this.container=e,this.loading=!0,this.visibleCount=10,this.allMatches=[],this.matchMetaMap=new Map,this.expandedMatches=new Set,this.matchDetail.reset(),this.movingAvgBadge=null,this.deadlockProfile=null,this.render()}async loadData(){var e,t,s,a;try{if(this.steamProfile=await((t=(e=window.api)==null?void 0:e.steamGetProfile)==null?void 0:t.call(e))??null,!((s=this.steamProfile)!=null&&s.steamId64)){this.loading=!1,this.render();return}const[r,n,l,o]=await Promise.all([fetch(`${z}/v1/players/steam-search?search_query=${encodeURIComponent(this.steamProfile.steamId64)}&min_matches_played_last_30d=0&limit=1`).then(d=>d.ok?d.json():[]).catch(()=>[]),xt(),yt(),wt()]);this.deadlockProfile=r[0]??null,this.heroMap=n,this.itemMap=l,this.badgeDist=o,(a=this.deadlockProfile)!=null&&a.account_id&&(this.allMatches=await fetch(`${z}/v1/players/${this.deadlockProfile.account_id}/match-history`).then(d=>d.ok?d.json():[]).catch(()=>[])),this.loading=!1,this.render(),this.fetchBatchMetadata(0,Math.min(50,this.allMatches.length))}catch(r){console.error("[ProfilPage] loadData error:",r),this.loading=!1,this.render()}}async loadDataForPlayer(e){try{const[t,s,a,r]=await Promise.all([fetch(`${z}/v1/players/steam?account_ids=${e}`).then(l=>l.ok?l.json():[]).catch(()=>[]),xt(),yt(),wt()]),n=t[0];n&&(this.deadlockProfile={account_id:n.account_id,personaname:n.personaname,avatarmedium:n.avatarmedium,last_team_avg_badge:n.last_team_avg_badge??null,matches_played_last_30d:n.matches_played_last_30d??0}),this.heroMap=s,this.itemMap=a,this.badgeDist=r,this.allMatches=await fetch(`${z}/v1/players/${e}/match-history`).then(l=>l.ok?l.json():[]).catch(()=>[]),this.loading=!1,this.render(),this.fetchBatchMetadata(0,Math.min(50,this.allMatches.length))}catch(t){console.error("[ProfilPage] loadDataForPlayer error:",t),this.loading=!1,this.render()}}async fetchBatchMetadata(e,t){const a=this.allMatches.slice(e,t).filter(r=>!this.matchMetaMap.has(r.match_id)&&!this.metaLoadingSet.has(r.match_id));a.length&&(a.forEach(r=>this.metaLoadingSet.add(r.match_id)),await Promise.all(a.map(async r=>{try{const n=await fetch(`${z}/v1/matches/${r.match_id}/metadata`).then(l=>l.ok?l.json():null);n!=null&&n.match_info&&(delete n.match_info.damage_matrix,this.matchMetaMap.set(r.match_id,n.match_info))}catch{}finally{this.metaLoadingSet.delete(r.match_id)}})),this.updateMovingAverageRank(),this.resolvePlayerNames(),this.refreshMatchRows())}updateMovingAverageRank(){const e=[];for(let t=0;t<Math.min(50,this.allMatches.length);t++){const s=this.allMatches[t],a=this.matchMetaMap.get(s.match_id);if(!a)continue;const r=s.player_team===0?a.average_badge_team0:a.average_badge_team1;r>0&&e.push(r)}e.length&&(this.movingAvgBadge=Math.round(e.reduce((t,s)=>t+s,0)/e.length),this.refreshBanner())}async resolvePlayerNames(){var n,l,o,d;const e=this.allMatches.slice(0,this.visibleCount),t=new Set;for(const h of e){const c=this.matchMetaMap.get(h.match_id);c&&c.players.forEach(u=>t.add(u.account_id))}const s=[...t];if(!s.length)return;let a={};try{a=await((l=(n=window.api)==null?void 0:n.getPlayerNames)==null?void 0:l.call(n,s))??{}}catch{}for(const[h,c]of Object.entries(a))c&&this.playerNameMap.set(Number(h),c);const r=s.filter(h=>!a[h]);if(r.length)try{const h=await fetch(`${z}/v1/players/steam?account_ids=${r.join(",")}`).then(u=>u.ok?u.json():[]).catch(()=>[]),c=[];for(const u of h)this.playerNameMap.set(u.account_id,u.personaname),c.push({accountId:u.account_id,personaname:u.personaname,avatarmedium:u.avatarmedium});c.length&&((d=(o=window.api)==null?void 0:o.cachePlayerNames)==null||d.call(o,c).catch(()=>{}))}catch{}this.refreshMatchRows()}render(){var e,t;if(this.container){if(this.loading){this.container.innerHTML=this.renderSkeleton();return}if(!this.externalAccountId&&!((e=this.steamProfile)!=null&&e.steamId64)){this.container.innerHTML=this.renderNotLoggedIn(),(t=this.container.querySelector("#go-settings-btn"))==null||t.addEventListener("click",s=>{s.preventDefault(),document.dispatchEvent(new CustomEvent("navigate-page",{detail:{page:"settings"}}))});return}this.container.innerHTML=`
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
      </div>`,this.attachEvents(),this.applyBackgroundImage()}}applyBackgroundImage(){var r;if(!this.container||!this.allMatches.length)return;const e=[...new Map(this.allMatches.map(n=>[n.hero_id,n])).entries()].reduce((n,[l])=>{const o=this.allMatches.filter(d=>d.hero_id===l).length;return o>n[1]?[l,o]:n},[0,0])[0],t=this.heroMap.get(e),s=(r=t==null?void 0:t.images)==null?void 0:r.background_image_webp;if(!s)return;const a=this.container.querySelector("#profil-bg-layer");a&&(a.style.backgroundImage=`url('${s}')`,requestAnimationFrame(()=>{a.style.opacity="1"}))}renderHeroBanner(){var l;const e=this.deadlockProfile,t=this.steamProfile,s=(e==null?void 0:e.avatarmedium)||(t==null?void 0:t.avatarUrl)||"",a=(e==null?void 0:e.personaname)||(t==null?void 0:t.personaname)||"Unknown",r=this.movingAvgBadge??(e==null?void 0:e.last_team_avg_badge)??null;let n="";if(r){const{name:o,subtier:d,tier:h}=aa(r),c=Qs[h]??"",u=d>0?` ${ea[d]}`:"";let g="";(l=this.badgeDist)!=null&&l.length&&(g=` · Top ${ra(r,this.badgeDist).toFixed(2)}%`),n=`
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
          ${vt.map(e=>`
            <button data-tab="${e.id}"
              class="profil-tab-btn px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap
                ${this.currentTab===e.id?"text-dry-sage-400 border-dry-sage-400":"text-grey-400 border-transparent hover:text-grey-200 hover:border-grey-500"}">
              ${e.label}
            </button>`).join("")}
        </div>
      </div>`}renderTabContent(){var e;switch(this.currentTab){case"overview":return this.renderOverviewTab();case"heroes":case"matches":return`
          <div class="flex flex-col items-center justify-center py-32 gap-3">
            <div class="w-12 h-12 rounded-full bg-grey-700 flex items-center justify-center text-grey-500 text-xl">✦</div>
            <p class="text-grey-400 text-sm">Onglet <span class="text-white font-medium">${(e=vt.find(t=>t.id===this.currentTab))==null?void 0:e.label}</span> — en développement</p>
          </div>`}}refreshTabContent(){var t;const e=(t=this.container)==null?void 0:t.querySelector("#profil-tab-content");e&&(e.innerHTML=this.renderTabContent(),this.attachMatchRowEvents())}renderOverviewTab(){return`
      <div class="px-6 py-5 max-w-7xl mx-auto space-y-5">
        ${this.renderStatsAndHeroesRow()}
        ${this.renderMatchHistory()}
      </div>`}renderStatsAndHeroesRow(){var v;const e=this.allMatches,t=e.length,s=e.filter(m=>m.match_result===m.player_team).length,a=t-s,r=t?s/t*100:0,n=t?e.reduce((m,b)=>m+b.player_kills,0)/t:0,l=t?e.reduce((m,b)=>m+b.player_deaths,0)/t:0,o=t?e.reduce((m,b)=>m+b.player_assists,0)/t:0,d=((v=this.deadlockProfile)==null?void 0:v.matches_played_last_30d)??0,h=oa(d),c=(m,b,f)=>`
      <div class="bg-charcoal-200 border border-grey-700 rounded-xl p-4 hover:border-grey-500 transition-colors">
        <p class="text-grey-500 text-[10px] font-semibold uppercase tracking-widest mb-1.5">${m}</p>
        <p class="text-white text-xl font-bold tabular-nums leading-none mb-1">${b}</p>
        <p class="text-grey-400 text-xs">${f}</p>
      </div>`,g=ca(e,this.heroMap,3).map(m=>{var k,E,M;const b=((E=(k=m.hero)==null?void 0:k.images)==null?void 0:E.icon_hero_card_webp)??"",f=((M=m.hero)==null?void 0:M.name)??`Hero #${m.heroId}`,y=m.total?m.wins/m.total*100:0,_=m.recent5.filter(Boolean).length,$=m.recent5.length-_;return`
        <tr class="border-b border-grey-700/40 last:border-0 hover:bg-charcoal-100/30 transition-colors">
          <td class="py-2.5 px-4">
            <div class="flex items-center gap-2">
              ${b?`<img src="${b}" alt="${f}" class="w-8 h-8 rounded-full object-cover border border-grey-600 flex-shrink-0">`:'<div class="w-8 h-8 rounded-full bg-grey-700 flex-shrink-0"></div>'}
              <span class="text-white text-sm font-medium">${f}</span>
            </div>
          </td>
          <td class="py-2.5 px-2 text-right">
            <p class="text-white text-sm tabular-nums font-medium">${m.total}G</p>
            <p class="text-grey-500 text-xs">${m.pickRate.toFixed(1)}%</p>
          </td>
          <td class="py-2.5 px-3 min-w-[120px]">
            <p class="text-white text-sm tabular-nums font-medium">${y.toFixed(2)}%</p>
            <div class="w-full h-1 bg-grey-700 rounded-full mt-1 mb-1">
              <div class="h-full bg-emerald-500 rounded-full" style="width:${Math.min(y,100).toFixed(1)}%"></div>
            </div>
            <p class="text-grey-500 text-[10px]">(${_}Win ${$}Lose)</p>
          </td>
          <td class="py-2.5 px-4 text-right">
            <p class="text-white text-sm tabular-nums font-medium">${m.kda.toFixed(2)}</p>
            <p class="text-grey-500 text-[10px]">
              <span class="text-emerald-400">${(m.kills/m.kdaCount).toFixed(1)}</span>/
              <span class="text-red-400">${(m.deaths/m.kdaCount).toFixed(1)}</span>/
              <span class="text-amber-400">${(m.assists/m.kdaCount).toFixed(1)}</span>
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
            <p class="text-white text-xl font-bold tabular-nums leading-none mb-1">${d}<span class="text-sm font-normal text-grey-400 ml-1">parties</span></p>
            <p class="text-xs ${h.color} font-semibold">${h.label}</p>
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
      </div>`}buildDetailBase(e){const t=this.matchMetaMap.get(e),s=this.allMatches.find(a=>a.match_id===e);return!t||!s?null:{matchId:e,meta:t,ownerAccountId:s.account_id,gameMode:s.game_mode,heroMap:this.heroMap,itemMap:this.itemMap,playerNameMap:this.playerNameMap}}renderMatchRow(e){var m;const t=e.match_result===e.player_team,s=this.heroMap.get(e.hero_id),a=((m=s==null?void 0:s.images)==null?void 0:m.icon_hero_card_webp)??"",r=(s==null?void 0:s.name)??`Hero #${e.hero_id}`,n=ta[e.game_mode]??`Mode ${e.game_mode}`,l=sa[e.game_mode]??6,o=this.matchMetaMap.get(e.match_id),d=this.metaLoadingSet.has(e.match_id),h=this.expandedMatches.has(e.match_id),c=t?"border-l-emerald-500":"border-l-red-500",u=t?"bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400":"bg-red-600/20 hover:bg-red-600/40 text-red-400";let g='<span class="text-grey-600 text-xs">— KP</span>';if(o){const f=o.players.filter(y=>y.team===e.player_team).reduce((y,_)=>y+_.kills,0);f>0&&(g=`<span class="text-grey-300 text-xs font-medium">${((e.player_kills+e.player_assists)/f*100).toFixed(0)}% KP</span>`)}let v="";if(h){const b=this.buildDetailBase(e.match_id),f=b?this.matchDetail.renderInner(b):`<div class="flex items-center gap-2 text-grey-500 text-sm py-6">
             <span class="w-4 h-4 border-2 border-grey-600 border-t-dry-sage-400 rounded-full animate-spin"></span>
             <span>Chargement de la télémétrie du match…</span>
           </div>`;v=`
        <div class="border-t border-grey-700/50 px-6 py-4 bg-charcoal-100/30" data-detail-root data-match-id="${e.match_id}">
          <div data-detail-content>${f}</div>
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
              <p class="text-grey-500 text-xs truncate">#${e.match_id} · ${na(e.match_duration_s)} · ${ia(e.start_time)}</p>
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
              ${this.renderBuildGrid(e,o,d)}
            </div>

            <!-- Team composition -->
            <div class="flex-1 border-l border-grey-700/30 pl-4 min-w-0">
              <p class="text-grey-600 text-[10px] uppercase tracking-wider mb-2">Équipes · ${l}v${l}</p>
              ${this.renderTeamComposition(e,o,d,l)}
            </div>
          </div>

          <!-- Right: expand button (win/loss background) -->
          <div class="border-l border-grey-700/40 flex-shrink-0 flex items-center">
            <button class="expand-match-btn ${u} transition-colors h-full px-3 flex items-center justify-center"
                    data-match-id="${e.match_id}" title="Détails">
              <svg class="w-5 h-5 transition-transform ${h?"rotate-180":""}"
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
        </div>`;const a='<div class="w-10 h-10 rounded border border-grey-700/30 bg-charcoal-100/10"></div>';if(!t)return`<div class="grid grid-cols-6 gap-1">${Array(12).fill(a).join("")}</div>`;const r=t.players.find(o=>o.account_id===e.account_id),n=r?la(r.items,this.itemMap):[];return`<div class="grid grid-cols-6 gap-1">${Array(12).fill(null).map((o,d)=>{const h=n[d];return h?`
        <div class="relative w-10 h-10 group" title="${h.name}">
          <div class="relative w-10 h-10 rounded overflow-hidden border border-grey-700/60">
            <img src="${h.shop_image_webp}" alt="${h.name}" class="w-full h-full object-cover">
            ${de(h)}
          </div>
        </div>`:a}).join("")}</div>`}renderTeamComposition(e,t,s,a){if(s&&!t)return`
        <div class="grid grid-cols-2 gap-x-4 gap-y-1">
          ${Array(a*2).fill(0).map(()=>`<div class="flex items-center gap-1.5 animate-pulse">
               <div class="w-5 h-5 rounded-full bg-grey-700 flex-shrink-0"></div>
               <div class="h-2.5 w-16 bg-grey-700 rounded"></div>
             </div>`).join("")}
        </div>`;if(!t)return'<div class="text-grey-600 text-xs">— Données indisponibles</div>';const r=t.players.filter(h=>h.team===0).slice(0,a),n=t.players.filter(h=>h.team===1).slice(0,a),l=h=>{var m,b;const c=this.heroMap.get(h.hero_id),u=((m=c==null?void 0:c.images)==null?void 0:m.minimap_image_webp)??((b=c==null?void 0:c.images)==null?void 0:b.icon_hero_card_webp)??"",g=this.playerNameMap.get(h.account_id)??`#${h.account_id}`,v=h.account_id===e.account_id;return`
        <div class="flex items-center gap-1.5">
          ${u?`<img src="${u}" alt="${c==null?void 0:c.name}" class="w-5 h-5 rounded-full object-cover flex-shrink-0 border border-grey-700/60">`:'<div class="w-5 h-5 rounded-full bg-grey-700 flex-shrink-0"></div>'}
          <button class="navigate-player-btn text-left text-xs truncate max-w-[90px] transition-colors hover:text-dry-sage-400
                         ${v?"text-white font-semibold":"text-grey-400"}"
                  data-account-id="${h.account_id}" title="${g}">
            ${g}
          </button>
        </div>`},o=Math.max(r.length,n.length);return`<div class="grid grid-cols-2 gap-x-4 gap-y-1">${Array(o).fill(null).map((h,c)=>{const u=r[c],g=n[c];return`
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
      </div>`}attachEvents(){this.container&&(this.container.querySelectorAll(".profil-tab-btn").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.tab;t&&t!==this.currentTab&&(this.currentTab=t,this.render())})}),this.attachMatchRowEvents())}attachMatchRowEvents(){var e;this.container&&(this.container.querySelectorAll(".expand-match-btn").forEach(t=>{t.addEventListener("click",()=>{const s=Number(t.dataset.matchId);s&&(this.expandedMatches.has(s)?this.expandedMatches.delete(s):this.expandedMatches.add(s),this.refreshMatchRows())})}),this.container.querySelectorAll(".navigate-player-btn").forEach(t=>{t.addEventListener("click",()=>{const s=Number(t.dataset.accountId);s&&document.dispatchEvent(new CustomEvent("navigate-player",{detail:{accountId:s}}))})}),(e=this.container.querySelector("#load-more-matches"))==null||e.addEventListener("click",()=>{const t=this.visibleCount;this.visibleCount+=10,this.refreshTabContent(),this.fetchBatchMetadata(t,this.visibleCount)}),this.matchDetail.attach(this.container,t=>this.buildDetailBase(t)))}}class ha{constructor(){p(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
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
    `)}}class ua{constructor(){p(this,"container",null)}mount(e){this.container=e,document.dispatchEvent(new CustomEvent("navigate-to-subpage",{detail:{page:"rankings"}}))}}const He="https://api.deadlock-api.com";let Se=null,xe=null;function pa(){return Se?Promise.resolve(Se):xe||(xe=fetch(`${He}/v1/assets/items`).then(i=>i.ok?i.json():Promise.resolve([])).then(i=>(Se=new Map(i.map(e=>[e.id,e])),Se)).catch(()=>(xe=null,new Map)),xe)}let Ie=null;async function ma(){if(Ie)return Ie;const i=await fetch(`${He}/v1/patches/big-days`).then(e=>e.ok?e.json():Promise.resolve([])).catch(()=>[]);return Ie=Array.isArray(i)?i.sort():[],Ie}function ga(i){return i.shop_image_webp??i.shop_image_small_webp??i.shop_image??i.shop_image_small??i.image_webp??i.image??""}const $t="latest",kt={mode:"all",tier:0},_t=new Set([1,2,3,4]),Mt="usage",St="desc",Q=class Q{constructor(){p(this,"container",null);p(this,"itemsPeriod",$t);p(this,"itemsRank",{...kt});p(this,"itemsTiers",new Set(_t));p(this,"itemsSortCol",Mt);p(this,"itemsSortDir",St);p(this,"items",new Map);p(this,"currentStats",[]);p(this,"refStats",[]);p(this,"totalMatchesCur",0);p(this,"totalMatchesRef",0);p(this,"patchDays",[]);p(this,"loading",!1);p(this,"loaded",!1);p(this,"error",!1)}mount(e){this.container=e,this.resetFilters(),this.renderSkeleton(),this.fetchAll()}async fetchAll(){if(!this.loading){this.loading=!0,this.error=!1,this.renderPage();try{if(this.patchDays=await ma(),this.itemsPeriod==="latest"){const c=new Date(Date.now()-Q.MAX_GLOBAL_WINDOW_DAYS*86400*1e3).toISOString().slice(0,10),u=[...this.patchDays].reverse().find(g=>g>=c);this.itemsPeriod=u||"7d"}const{curStart:e,curEnd:t,refStart:s,refEnd:a}=this.getPeriodTimestamps(),r=c=>c.ok?c.json():Promise.resolve([]),[n,l,o,d,h]=await Promise.all([pa(),fetch(this.buildItemStatsUrl(e,t)).then(r),fetch(this.buildItemStatsUrl(s,a)).then(r),fetch(this.buildHeroStatsUrl(e,t)).then(r),fetch(this.buildHeroStatsUrl(s,a)).then(r)]);this.items=n,this.currentStats=Array.isArray(l)?l:[],this.refStats=Array.isArray(o)?o:[],this.totalMatchesCur=(Array.isArray(d)?d:[]).reduce((c,u)=>c+u.matches,0),this.totalMatchesRef=(Array.isArray(h)?h:[]).reduce((c,u)=>c+u.matches,0),this.loaded=!0}catch{this.error=!0}finally{this.loading=!1,this.renderPage()}}}buildItemStatsUrl(e,t){const{safeMin:s,safeMax:a}=this.clampToGlobalWindow(e,t),r=new URLSearchParams;return r.set("min_unix_timestamp",String(s)),r.set("max_unix_timestamp",String(a)),this.appendBadgeParams(r),`${He}/v1/analytics/item-stats?${r}`}buildHeroStatsUrl(e,t){const{safeMin:s,safeMax:a}=this.clampToGlobalWindow(e,t),r=new URLSearchParams;return r.set("min_unix_timestamp",String(s)),r.set("max_unix_timestamp",String(a)),this.appendBadgeParams(r),`${He}/v1/analytics/hero-stats?${r}`}clampToGlobalWindow(e,t){const s=Math.floor(Date.now()/1e3),a=Q.MAX_GLOBAL_WINDOW_DAYS*86400,r=t>0?Math.min(t,s):s,n=r-a;return{safeMin:Math.max(e>0?e:n,n),safeMax:r}}appendBadgeParams(e){if(this.itemsRank.mode==="all")return;const t=F.find(s=>s.tier===this.itemsRank.tier);t&&(e.set("min_average_badge",String(t.badgeMin)),this.itemsRank.mode==="exact"&&e.set("max_average_badge",String(t.badgeMax)))}getPeriodTimestamps(){const e=Math.floor(Date.now()/1e3),t=86400,s={"7d":7,"14d":14,"30d":30,"90d":90};if(s[this.itemsPeriod]!==void 0){const h=s[this.itemsPeriod]*t;return{curStart:e-h,curEnd:e,refStart:e-2*h,refEnd:e-h}}const a=this.itemsPeriod==="latest"?this.patchDays[this.patchDays.length-1]??null:this.itemsPeriod;if(!a)return{curStart:e-14*t,curEnd:e,refStart:e-28*t,refEnd:e-14*t};const r=this.patchDays.indexOf(a),n=Math.floor(new Date(a).getTime()/1e3),l=r>=0&&r<this.patchDays.length-1?Math.floor(new Date(this.patchDays[r+1]).getTime()/1e3):e,o=r>0?this.patchDays[r-1]:null,d=o?Math.floor(new Date(o).getTime()/1e3):n-14*t;return{curStart:n,curEnd:l,refStart:d,refEnd:n}}computeItemRows(){const e=new Map(this.currentStats.map(a=>[a.item_id,a])),t=new Map(this.refStats.map(a=>[a.item_id,a])),s=[];for(const[a,r]of e){const n=this.items.get(a);if(!(n!=null&&n.item_slot_type))continue;const l=n.item_tier??0;if(l>0&&!this.itemsTiers.has(l))continue;const o=t.get(a),d=r.matches>0?r.wins/r.matches*100:0,h=o&&o.matches>0?o.wins/o.matches*100:0,c=this.totalMatchesCur>0?r.matches/this.totalMatchesCur*100:0,u=o&&this.totalMatchesRef>0?o.matches/this.totalMatchesRef*100:0;s.push({itemId:a,wins:r.wins,losses:r.losses,matches:r.matches,winRate:d,winRateChange:o?d-h:0,usagePct:c,usageChange:o?c-u:0})}return s.sort((a,r)=>{var l,o,d,h;let n=0;switch(this.itemsSortCol){case"name":n=(((l=this.items.get(a.itemId))==null?void 0:l.name)??"").localeCompare(((o=this.items.get(r.itemId))==null?void 0:o.name)??"");break;case"cost":n=(((d=this.items.get(a.itemId))==null?void 0:d.cost)??0)-(((h=this.items.get(r.itemId))==null?void 0:h.cost)??0);break;case"winRate":n=a.winRate-r.winRate;break;case"winRateChange":n=a.winRateChange-r.winRateChange;break;case"usage":n=a.usagePct-r.usagePct;break;case"usageChange":n=a.usageChange-r.usageChange;break;case"winloss":n=a.wins-r.wins;break}return this.itemsSortDir==="desc"?-n:n}),s}resetFilters(){this.itemsPeriod=$t,this.itemsRank={...kt},this.itemsTiers=new Set(_t),this.itemsSortCol=Mt,this.itemsSortDir=St}isFiltered(){const e=this.patchDays.length>0?this.patchDays[this.patchDays.length-1]:"",t=this.itemsPeriod!==e&&this.itemsPeriod!=="latest",s=this.itemsRank.mode!=="all",a=this.itemsTiers.size!==4||![1,2,3,4].every(r=>this.itemsTiers.has(r));return t||s||a}renderSkeleton(){this.container&&(this.container.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen animate-pulse">
        <div class="max-w-7xl mx-auto space-y-5">
          <div class="h-8 w-48 rounded bg-charcoal-300"></div>
          <div class="h-4 w-96 rounded bg-charcoal-300/60"></div>
          <div class="h-px bg-charcoal-400 w-full"></div>
          <div class="flex gap-3">
            <div class="h-9 w-40 rounded-lg bg-charcoal-300"></div>
            <div class="h-9 w-36 rounded-lg bg-charcoal-300"></div>
            <div class="flex gap-1">
              ${[1,2,3,4].map(()=>'<div class="h-9 w-12 rounded bg-charcoal-300"></div>').join("")}
            </div>
          </div>
          <div class="rounded-xl border border-charcoal-400 overflow-hidden">
            <div class="bg-charcoal-300 h-10 w-full border-b border-charcoal-400"></div>
            ${Array.from({length:10}).map((e,t)=>`
              <div class="flex items-center gap-4 px-4 py-3 border-b border-charcoal-400 ${t%2===0?"bg-charcoal-100":"bg-charcoal-200/40"}">
                <div class="w-9 h-9 rounded bg-charcoal-300 shrink-0"></div>
                <div class="h-3 w-32 rounded bg-charcoal-300"></div>
                <div class="ml-auto flex items-center gap-6">
                  ${Array.from({length:5}).map(()=>'<div class="h-3 w-14 rounded bg-charcoal-300"></div>').join("")}
                </div>
              </div>`).join("")}
          </div>
        </div>
      </div>`)}renderPage(){if(!this.container)return;const e=this.loaded?this.computeItemRows():[];this.container.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto space-y-5">

          <!-- Header -->
          <div>
            <h1 class="text-3xl font-bold text-white tracking-wide">Item Statistics</h1>
            <p class="text-dry-sage-500 text-sm mt-1">
              Analyze the meta trends for all Deadlock items, filtering by rank bracket, item type,
              item cost, and date range to uncover which items are most popular and how well they perform.
            </p>
            <div class="mt-4 h-px bg-gradient-to-r from-dry-sage-400/50 via-charcoal-400 to-transparent"></div>
          </div>

          <!-- Filter bar -->
          ${this.renderFilters()}

          <!-- Content -->
          ${this.error?this.renderError():this.loading?this.renderTableSkeleton():this.renderTable(e)}

        </div>
      </div>`,this.bindEvents()}renderFilters(){const e=F.map(n=>`
      <option value="${n.tier}"  ${this.itemsRank.mode==="exact"&&this.itemsRank.tier===n.tier?"selected":""}>${n.name}</option>
      <option value="${n.tier}+" ${this.itemsRank.mode==="plus"&&this.itemsRank.tier===n.tier?"selected":""}>${n.name} +</option>
    `).join(""),t=new Date(Date.now()-Q.MAX_GLOBAL_WINDOW_DAYS*86400*1e3).toISOString().slice(0,10),s=this.patchDays.filter(n=>n>=t).slice(-7).reverse(),a=s.length>0?`<optgroup label="Patches (last ${Q.MAX_GLOBAL_WINDOW_DAYS} days)">
          ${s.map((n,l)=>`
            <option value="${n}" ${this.itemsPeriod===n?"selected":""}>
              ${n}${l===0?" — Latest Patch":""}
            </option>`).join("")}
         </optgroup>`:'<option value="7d" selected>Last 7 Days</option>',r=this.isFiltered();return`
      <div class="flex items-center gap-3 flex-wrap">

        <!-- Patch / period selector -->
        <select id="gi-period-select"
          class="bg-charcoal-200 border border-charcoal-400 text-grey-300 text-sm rounded-lg px-3 py-2
                 cursor-pointer hover:border-charcoal-300 focus:outline-none focus:border-dry-sage-400 transition-colors">
          ${a}
          <optgroup label="Relative Period">
            <option value="7d"  ${this.itemsPeriod==="7d"?"selected":""}>Last 7 Days</option>
            <option value="14d" ${this.itemsPeriod==="14d"?"selected":""}>Last 14 Days</option>
            <option value="30d" ${this.itemsPeriod==="30d"?"selected":""}>Last Month</option>
            <option value="90d" ${this.itemsPeriod==="90d"?"selected":""}>3 Last Months</option>
          </optgroup>
        </select>

        <!-- Rank selector -->
        <select id="gi-rank-select"
          class="bg-charcoal-200 border border-charcoal-400 text-grey-300 text-sm rounded-lg px-3 py-2
                 cursor-pointer hover:border-charcoal-300 focus:outline-none focus:border-dry-sage-400 transition-colors">
          <option value="all" ${this.itemsRank.mode==="all"?"selected":""}>All Ranks</option>
          ${e}
        </select>

        <!-- Tier toggle buttons -->
        <div class="flex items-center gap-1">
          ${[1,2,3,4].map(n=>`
            <button data-tier="${n}"
              class="gi-tier-btn px-3 py-1.5 text-sm font-semibold rounded border transition-colors
                ${this.itemsTiers.has(n)?"bg-dry-sage-400/20 border-dry-sage-400 text-dry-sage-400":"bg-charcoal-200 border-charcoal-400 text-grey-500 hover:border-charcoal-300 hover:text-grey-300"}">
              T${n}
            </button>`).join("")}
        </div>

        <!-- Refresh — resets all filters to default -->
        <button id="gi-refresh-btn" ${r?"":"disabled"}
          class="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded border transition-colors
            ${r?"bg-dry-sage-400/20 border-dry-sage-400 text-dry-sage-400 hover:bg-dry-sage-400/30 cursor-pointer":"bg-charcoal-200 border-charcoal-400 text-grey-600 cursor-not-allowed opacity-50"}">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M4 4v5h5M20 20v-5h-5M4.93 14A8 8 0 1020 12"/>
          </svg>
          Refresh
        </button>

      </div>`}renderTableSkeleton(){return`
      <div class="overflow-x-auto rounded-xl border border-charcoal-400 animate-pulse">
        <div class="bg-charcoal-300 h-10 w-full border-b border-charcoal-400 rounded-t-xl"></div>
        ${Array.from({length:10}).map((e,t)=>`
          <div class="flex items-center gap-4 px-4 py-3 border-b border-charcoal-400
                      ${t%2===0?"bg-charcoal-100":"bg-charcoal-200/40"}">
            <div class="w-9 h-9 rounded bg-charcoal-300 shrink-0"></div>
            <div class="h-3 w-32 rounded bg-charcoal-300"></div>
            <div class="ml-auto flex items-center gap-6">
              ${Array.from({length:5}).map(()=>'<div class="h-3 w-14 rounded bg-charcoal-300"></div>').join("")}
            </div>
          </div>`).join("")}
      </div>`}renderError(){return`
      <div class="flex flex-col items-center justify-center gap-4 py-24 text-grey-500">
        <div class="w-10 h-10 rounded-full border border-charcoal-400 flex items-center justify-center text-lg">!</div>
        <p class="text-sm">Failed to load item statistics.</p>
        <button id="gi-retry-btn"
          class="px-4 py-2 bg-charcoal-300 hover:bg-charcoal-200 text-grey-300 text-sm rounded-lg
                 border border-charcoal-400 transition-colors">
          Retry
        </button>
      </div>`}renderTable(e){return e.length===0?`
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
            ${e.map((t,s)=>this.renderRow(t,s)).join("")}
          </tbody>
        </table>
      </div>`}sortTh(e,t,s){const a=this.itemsSortCol===t,r=a?this.itemsSortDir==="desc"?"↓":"↑":"↕";return`
      <th class="px-4 py-3 ${s==="right"?"text-right":"text-left"}">
        <button data-sort="${t}"
          class="gi-sort-btn flex items-center gap-1 text-[10px] uppercase tracking-widest font-medium
                 transition-colors whitespace-nowrap ${a?"text-dry-sage-400":"text-grey-500 hover:text-grey-300"} ${s==="right"?"ml-auto":""}">
          ${e}
          <span class="${a?"text-dry-sage-400":"text-grey-700"} text-[11px]">${r}</span>
        </button>
      </th>`}renderRow(e,t){const s=this.items.get(e.itemId),a=s?ga(s):"",r=(s==null?void 0:s.name)??`#${e.itemId}`,n=(s==null?void 0:s.cost)??null,l=Be((s==null?void 0:s.item_slot_type)??void 0);return`
      <tr class="border-b border-charcoal-400
                 ${t%2===0?"bg-charcoal-100":"bg-charcoal-200/40"}
                 hover:bg-charcoal-300/50 transition-colors">

        <!-- Item: icon + tier badge + name -->
        <td class="px-4 py-3">
          <div class="flex items-center gap-3">
            <div class="relative shrink-0" style="width:36px;height:36px;">
              <div class="w-full h-full rounded border bg-charcoal-300 overflow-hidden"
                   style="border-color:${l}55;">
                ${a?`<img src="${a}" alt="${r}" class="w-full h-full object-cover"/>`:""}
                <div class="absolute bottom-0 left-0 right-0 h-0.5" style="background:${l};"></div>
                ${s?de({item_tier:s.item_tier??void 0,item_slot_type:s.item_slot_type??void 0}):""}
              </div>
            </div>
            <span class="text-grey-900 text-sm font-medium">${r}</span>
          </div>
        </td>

        <!-- Cost -->
        <td class="px-4 py-3 text-right">
          ${n!==null?`
            <span class="inline-flex items-center gap-1.5 justify-end">
              <span class="w-2.5 h-2.5 rounded-full shrink-0"
                    style="background:#3b82f6;box-shadow:0 0 4px #3b82f655;"></span>
              <span class="text-blue-400 font-semibold text-xs">${n.toLocaleString()}</span>
            </span>`:'<span class="text-grey-600 text-xs">—</span>'}
        </td>

        <!-- Win Rate -->
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
          <span class="${this.changeClass(e.winRateChange)} text-sm">
            ${this.formatChange(e.winRateChange)}
          </span>
        </td>

        <!-- Usage -->
        <td class="px-4 py-3">
          <div class="flex flex-col gap-1" style="min-width:100px;">
            <span class="text-white text-sm font-semibold">${e.usagePct.toFixed(2)}%</span>
            <div class="h-1 rounded-full bg-charcoal-400" style="width:100px;">
              <div class="h-full rounded-full bg-dry-sage-400 transition-all"
                   style="width:${Math.min(e.usagePct,100).toFixed(1)}%;"></div>
            </div>
          </div>
        </td>

        <!-- Usage Change -->
        <td class="px-4 py-3 text-right">
          <span class="${this.changeClass(e.usageChange)} text-sm">
            ${this.formatChange(e.usageChange)}
          </span>
        </td>

        <!-- Win / Loss -->
        <td class="px-4 py-3 text-right">
          <span class="text-grey-400 text-xs font-medium whitespace-nowrap">
            ${this.formatK(e.wins)} / ${this.formatK(e.losses)}
          </span>
        </td>

      </tr>`}bindEvents(){var s,a,r,n,l,o,d,h;const e=(s=this.container)==null?void 0:s.querySelector("#gi-period-select");e==null||e.addEventListener("change",()=>{this.itemsPeriod=e.value,this.loaded=!1,this.currentStats=[],this.refStats=[],this.fetchAll()});const t=(a=this.container)==null?void 0:a.querySelector("#gi-rank-select");t==null||t.addEventListener("change",()=>{const c=t.value;c==="all"?this.itemsRank={mode:"all",tier:0}:c.endsWith("+")?this.itemsRank={mode:"plus",tier:parseInt(c)}:this.itemsRank={mode:"exact",tier:parseInt(c)},this.loaded=!1,this.currentStats=[],this.refStats=[],this.fetchAll()}),(r=this.container)==null||r.querySelectorAll(".gi-tier-btn").forEach(c=>{c.addEventListener("click",()=>{const u=parseInt(c.dataset.tier??"");isNaN(u)||(this.itemsTiers.has(u)?this.itemsTiers.delete(u):this.itemsTiers.add(u),this.renderPage())})}),(n=this.container)==null||n.querySelectorAll(".gi-sort-btn").forEach(c=>{c.addEventListener("click",()=>{const u=c.dataset.sort;this.itemsSortCol===u?this.itemsSortDir=this.itemsSortDir==="desc"?"asc":"desc":(this.itemsSortCol=u,this.itemsSortDir="desc"),this.renderPage()})}),(o=(l=this.container)==null?void 0:l.querySelector("#gi-refresh-btn"))==null||o.addEventListener("click",()=>{this.isFiltered()&&(this.resetFilters(),this.loaded=!1,this.currentStats=[],this.refStats=[],this.fetchAll())}),(h=(d=this.container)==null?void 0:d.querySelector("#gi-retry-btn"))==null||h.addEventListener("click",()=>{this.error=!1,this.fetchAll()})}changeClass(e){return e>=5?"text-emerald-500 font-semibold":e>0?"text-green-400":e===0?"text-grey-500":e>-5?"text-orange-400":"text-red-600 font-bold"}formatChange(e){return e===0?"—":`${e>0?"+":""}${e.toFixed(2)}%`}formatK(e){return e>=1e3?`${(e/1e3).toFixed(1)}K`:String(e)}};p(Q,"MAX_GLOBAL_WINDOW_DAYS",28);let Xe=Q;const Ge={1:Qe,2:et,3:tt,4:st,5:at,6:rt,7:it,8:nt,9:ot,10:lt,11:ct},It="https://api.deadlock-api.com",ze={1:"#774D22",2:"#8E445D",3:"#4A5C8E",4:"#436C2C",5:"#BC6020",6:"#D04F5F",7:"#A96BBE",8:"#A66325",9:"#BFBFBF",10:"#EFD970",11:"#5AFFC3"},At=["I","II","III","IV","V","VI"];function ba(i){const e=Math.floor(Date.now()/1e3);return i==="24h"?{min:e-86400,max:e}:i==="7d"?{min:e-7*86400,max:e}:i==="30d"?{min:e-30*86400,max:e}:{}}function fa(i){return i<=2e4?5e3:i<=6e4?1e4:i<=2e5?25e3:5e4}function ne(i){return i.toLocaleString("en-US")}class va{constructor(){p(this,"container",null);p(this,"currentPeriod","7d");p(this,"rankAssets",new Map);p(this,"tooltipController",null)}mount(e){this.container=e,this.renderSkeleton(),this.fetchAndRender()}renderSkeleton(){this.container&&(this.container.innerHTML=`
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
      </div>`)}async fetchAndRender(){if(!this.container)return;const[e,t]=await Promise.allSettled([this.fetchRanks(),this.fetchDistribution(this.currentPeriod)]);if(e.status==="fulfilled")for(const a of e.value)a.tier>=1&&a.tier<=11&&this.rankAssets.set(a.tier,a);const s=t.status==="fulfilled"?this.normalizeTo66(t.value):this.normalizeTo66([]);this.renderFull(s)}async fetchRanks(){const e=await fetch(`${It}/v1/assets/ranks`);if(!e.ok)throw new Error(`ranks ${e.status}`);return e.json()}async fetchDistribution(e){const t=ba(e),s=new URL(`${It}/v1/analytics/badge-distribution`);s.searchParams.set("game_mode","normal"),t.min!==void 0&&s.searchParams.set("min_unix_timestamp",String(t.min)),t.max!==void 0&&s.searchParams.set("max_unix_timestamp",String(t.max));const a=await fetch(s.toString());if(!a.ok)throw new Error(`badge-distribution ${a.status}`);const r=await a.json();return this.mapDistribution(r)}mapDistribution(e){var s,a,r,n;const t=[];for(const l of e){const o=Math.floor(l.badge_level/10),d=l.badge_level%10;if(o<1||o>11||d<1||d>6)continue;const h=F.find(g=>g.tier===o);if(!h)continue;const c=this.rankAssets.get(o),u=((s=c==null?void 0:c.images)==null?void 0:s[`small_subrank${d}_webp`])??((a=c==null?void 0:c.images)==null?void 0:a[`small_subrank${d}`])??((r=c==null?void 0:c.images)==null?void 0:r.small_webp)??((n=c==null?void 0:c.images)==null?void 0:n.small)??"";t.push({subRankId:`${h.name.toLowerCase()}-${d}`,subRankName:`${h.name} ${At[d-1]}`,tier:o,subRank:d,matchCount:l.total_matches,colorHex:ze[o]??"#888888",subRankImageUrl:u})}return t}normalizeTo66(e){var a,r,n,l;const t=new Map(e.map(o=>[`${o.tier}-${o.subRank}`,o])),s=[];for(const o of F)for(let d=1;d<=6;d++){const h=t.get(`${o.tier}-${d}`);if(h)s.push(h);else{const c=this.rankAssets.get(o.tier),u=((a=c==null?void 0:c.images)==null?void 0:a[`small_subrank${d}_webp`])??((r=c==null?void 0:c.images)==null?void 0:r[`small_subrank${d}`])??((n=c==null?void 0:c.images)==null?void 0:n.small_webp)??((l=c==null?void 0:c.images)==null?void 0:l.small)??"";s.push({subRankId:`${o.name.toLowerCase()}-${d}`,subRankName:`${o.name} ${At[d-1]}`,tier:o.tier,subRank:d,matchCount:0,colorHex:ze[o.tier]??"#888888",subRankImageUrl:u})}}return s}renderFull(e){if(!this.container)return;this.container.innerHTML=`
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
      </div>`;const t=this.container.querySelector("#rd-period-select");t&&(t.value=this.currentPeriod,t.addEventListener("change",()=>this.onPeriodChange(t))),this.wireTooltips()}async onPeriodChange(e){var a,r;this.currentPeriod=e.value;const t=(a=this.container)==null?void 0:a.querySelector("#rd-chart-wrapper"),s=(r=this.container)==null?void 0:r.querySelector("#rd-list-wrapper");t&&(t.innerHTML='<div class="bg-charcoal-300 rounded animate-pulse" style="width:100%;height:420px;"></div>'),s&&(s.innerHTML=Array.from({length:4}).map(()=>'<div class="h-20 bg-charcoal-200 rounded-lg border border-grey-200 animate-pulse mb-2"></div>').join(""));try{const n=await this.fetchDistribution(this.currentPeriod),l=this.normalizeTo66(n);t&&(t.innerHTML=this.renderChart(l)),s&&(s.innerHTML=this.renderList(l)),this.wireTooltips()}catch{t&&(t.innerHTML='<div class="p-6 text-grey-500 text-sm">Failed to load distribution data.</div>')}}wireTooltips(){var n,l;if(!this.container)return;(n=this.tooltipController)==null||n.abort(),this.tooltipController=new AbortController;const{signal:e}=this.tooltipController;(l=document.getElementById("rd-tooltip"))==null||l.remove();const t=document.createElement("div");t.id="rd-tooltip",t.style.cssText="position:fixed;z-index:9999;pointer-events:none;min-width:240px;display:none;",document.body.appendChild(t);const s=this.container.querySelector("#rd-list-wrapper");if(!s)return;let a=null;const r=o=>{const d=o.dataset.name??"",h=parseInt(o.dataset.count??"0",10),c=o.dataset.pct??"0.00",u=o.dataset.from??"0.00",g=o.dataset.to??"0.00",v=o.dataset.img??"",m=this.currentPeriod==="all"?"All":this.currentPeriod;t.innerHTML=`
        <div style="background:#252525;border:1px solid #494949;border-radius:8px;
                    box-shadow:0 8px 32px rgba(0,0,0,0.6);overflow:hidden;">
          <div style="display:flex;align-items:center;gap:12px;padding:14px 16px 12px;">
            <img src="${v}" alt="${d}"
                 style="width:40px;height:40px;object-fit:contain;flex-shrink:0;"/>
            <span style="color:#fff;font-weight:700;font-size:18px;letter-spacing:0.04em;">
              ${d.toUpperCase()}
            </span>
          </div>
          <div style="border-top:1px solid #373737;padding:12px 16px;
                      display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;gap:24px;">
              <span style="color:#7d7c7a;font-size:13px;">Matches (Period ${m}):</span>
              <span style="color:#fff;font-size:13px;font-weight:600;">${ne(h)}</span>
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
        </div>`};s.addEventListener("mouseover",o=>{const h=o.target.closest(".rd-sr-cell, .rd-tier-row");if(h!==a){if(a=h??null,!h){t.style.display="none";return}r(h),t.style.display="block",this.positionTooltip(t,o)}},{signal:e}),s.addEventListener("mousemove",o=>{a&&this.positionTooltip(t,o)},{signal:e}),s.addEventListener("mouseleave",()=>{a=null,t.style.display="none"},{signal:e})}positionTooltip(e,t){const a=e.offsetWidth||240,r=e.offsetHeight||140;let n=t.clientX+14,l=t.clientY-r-14;n+a>window.innerWidth-8&&(n=t.clientX-a-14),l<8&&(l=t.clientY+14),e.style.left=`${n}px`,e.style.top=`${l}px`}renderPageHeader(){return`
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
      </div>`}renderChart(e){const t=Math.max(...e.map(w=>w.matchCount),1),s=Math.min(...e.filter(w=>w.matchCount>0).map(w=>w.matchCount),t),a=fa(t),r=1100,n=490,l=78,o=22,d=150,h=15,c=l,u=o,g=r-l-h,v=n-o-d,m=u+v,b=w=>m-w/t*v,f=12,y=2,_=(g-10*f)/11,$=(_-5*y)/6,k=w=>c+w*(_+f),E=(w,P)=>k(w)+P*($+y),M=w=>k(w)+_/2;let A=`<defs>
      <clipPath id="rd-clip">
        <rect x="${c}" y="${u}" width="${g}" height="${v}"/>
      </clipPath>
    </defs>`;for(let w=0;w<=Math.ceil(t/a)*a;w+=a){const P=b(w);if(P<u-2)break;A+=`
        <line x1="${c}" y1="${P.toFixed(1)}" x2="${c+g}" y2="${P.toFixed(1)}"
              stroke="#2a2a2a" stroke-width="1" stroke-dasharray="4,4"/>
        <text x="${(c-6).toFixed(1)}" y="${(P+4).toFixed(1)}"
              text-anchor="end" font-size="11" fill="#636261" font-family="monospace">${ne(w)}</text>`}const T=b(s);A+=`
      <line x1="${c}" y1="${T.toFixed(1)}" x2="${c+g}" y2="${T.toFixed(1)}"
            stroke="#EFD970" stroke-width="1.5" stroke-dasharray="6,3" opacity="0.75"/>
      <text x="${(c-6).toFixed(1)}" y="${(T-3).toFixed(1)}"
            text-anchor="end" font-size="10" fill="#EFD970" font-weight="bold"
            font-family="monospace">${ne(s)}</text>`;const D=b(t);A+=`
      <line x1="${c}" y1="${D.toFixed(1)}" x2="${c+g}" y2="${D.toFixed(1)}"
            stroke="#5AFFC3" stroke-width="1.5" stroke-dasharray="6,3" opacity="0.75"/>
      <text x="${(c-6).toFixed(1)}" y="${(D-3).toFixed(1)}"
            text-anchor="end" font-size="10" fill="#5AFFC3" font-weight="bold"
            font-family="monospace">${ne(t)}</text>`,A+='<g clip-path="url(#rd-clip)">';for(const w of e){const P=w.tier-1,q=w.subRank-1,j=E(P,q),B=w.matchCount/t*v,ue=m-B,pe=(1-q*.04).toFixed(2);A+=`<rect x="${j.toFixed(1)}" y="${ue.toFixed(1)}"
                    width="${$.toFixed(1)}" height="${B.toFixed(1)}"
                    fill="${w.colorHex}" opacity="${pe}" rx="1"/>`}A+="</g>",A+=`
      <line x1="${c}" y1="${u}" x2="${c}" y2="${m}" stroke="#3a3a3a" stroke-width="1"/>
      <line x1="${c}" y1="${m}" x2="${c+g}" y2="${m}" stroke="#3a3a3a" stroke-width="1"/>
      <text x="${(c-6).toFixed(1)}" y="${(m+4).toFixed(1)}"
            text-anchor="end" font-size="11" fill="#636261" font-family="monospace">0</text>`;const x=72,S=m+16;for(const w of F){const P=w.tier-1,q=M(P),j=Ge[w.tier]??"";A+=`<image href="${j}"
                     x="${(q-x/2).toFixed(1)}" y="${S.toFixed(1)}"
                     width="${x}" height="${x}" style="image-rendering:auto;"/>`}return`<svg width="100%" height="${n}" viewBox="0 0 ${r} ${n}" preserveAspectRatio="none">
      ${A}
    </svg>`}renderList(e){const t=e.reduce((o,d)=>o+d.matchCount,0)||1,s=new Map;let a=0;for(const o of e){const d=a/t*100;a+=o.matchCount;const h=a/t*100;s.set(o.subRankId,{from:d.toFixed(2),to:h.toFixed(2)})}const r=new Map;for(const o of e)r.has(o.tier)||r.set(o.tier,[]),r.get(o.tier).push(o);const n=Math.max(...F.map(o=>(r.get(o.tier)??[]).reduce((d,h)=>d+h.matchCount,0)),1);return`
      <div class="mb-4">
        <h2 class="text-white font-bold text-2xl">Deadlock Match Rank Distribution</h2>
        <p class="text-grey-500 text-sm mt-1">
          This chart shows how many matches were played at each Deadlock badge level for the selected period.
        </p>
      </div>
      <div class="space-y-4 pb-8">${F.map(o=>{var k,E;const d=r.get(o.tier)??[],h=d.reduce((M,A)=>M+A.matchCount,0),c=(h/t*100).toFixed(2),u=(h/n*100).toFixed(1),g=ze[o.tier]??"#888888",v=Ge[o.tier]??"",m=`<img src="${v}" alt="${o.name}" class="w-24 h-24 object-contain shrink-0"/>`,b=`
        <div class="grid grid-cols-3 border-t border-grey-200/20 gap-px bg-grey-200/20">
          ${d.map(M=>{const A=(M.matchCount/t*100).toFixed(2),T=s.get(M.subRankId)??{from:"0.00",to:"0.00"},D=M.subRankImageUrl||Ge[M.tier]||"",x=`<img src="${D}" alt="${M.subRankName}"
                                  class="w-16 h-16 object-contain shrink-0"/>`;return`
              <div class="rd-sr-cell flex items-center gap-4 px-5 py-4
                          border-r border-grey-200/20 last:border-r-0 min-w-0
                          cursor-default hover:bg-charcoal-300 transition-colors duration-150"
                   data-name="${M.subRankName}"
                   data-count="${M.matchCount}"
                   data-pct="${A}"
                   data-from="${T.from}"
                   data-to="${T.to}"
                   data-img="${D}">
                ${x}
                <div class="min-w-0">
                  <div class="text-grey-400 text-xl truncate">${M.subRankName}</div>
                  <div class="text-white text-xl font-semibold">${ne(M.matchCount)}</div>
                  <div class="text-grey-500 text-lg">${A}%</div>
                </div>
              </div>`}).join("")}
        </div>`,f=d[0],y=d[d.length-1],_=f?((k=s.get(f.subRankId))==null?void 0:k.from)??"0.00":"0.00",$=y?((E=s.get(y.subRankId))==null?void 0:E.to)??"0.00":"0.00";return`
        <div class="bg-charcoal-200 rounded-lg border border-grey-200 overflow-hidden">
          <div class="rd-tier-row flex items-center gap-5 px-5 py-4
                      cursor-default hover:bg-charcoal-300 transition-colors duration-150"
               data-name="${o.name}"
               data-count="${h}"
               data-pct="${c}"
               data-from="${_}"
               data-to="${$}"
               data-img="${v}">
            ${m}
            <div class="flex-1 min-w-0">
              <span class="text-white font-semibold text-2xl">${o.name}</span>
              <span class="text-grey-500 text-xl ml-3">— Matches: ${ne(h)} (${c}%)</span>
            </div>
            <div class="w-48 bg-charcoal-400 rounded-full h-2 shrink-0 overflow-hidden">
              <div class="h-2 rounded-full transition-all duration-500"
                   style="width:${u}%;background-color:${g};"></div>
            </div>
          </div>
          ${b}
        </div>`}).join("")}</div>`}}class xa{constructor(){p(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
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
    `)}}const ya="https://api.deadlock-api.com";class wa{constructor(){p(this,"container",null)}mount(e){this.container=e,this.renderSkeleton(),this.fetchAndRender()}renderSkeleton(){this.container&&(this.container.innerHTML=`
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
      </div>`}async fetchAndRender(){if(!this.container)return;let e=[];try{const t=await fetch(`${ya}/v1/assets/heroes`);if(t.ok){const s=await t.json();e=(Array.isArray(s)?s:s.data??[]).filter(r=>r.player_selectable===!0&&r.disabled===!1&&r.in_development===!1),e.sort((r,n)=>(r.name??"").localeCompare(n.name??""))}}catch{}if(this.container){if(e.length===0){this.container.innerHTML=`
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
      </button>`}}const K="https://api.deadlock-api.com";let Ae=null,ye=null;function $a(){return Ae?Promise.resolve(Ae):ye||(ye=fetch(`${K}/v1/assets/items`).then(i=>i.ok?i.json():Promise.resolve([])).then(i=>(Ae=new Map(i.map(e=>[e.id,e])),Ae)).catch(()=>(ye=null,new Map)),ye)}function oe(i){const e=i;return e.shop_image_webp??e.shop_image_small_webp??e.shop_image??e.shop_image_small??e.image_webp??e.image??""}function Pt(i){const e=i.description;return e?typeof e=="string"?e:(e.desc??e.active??e.passive??"").trim():""}function Ct(i){var s;const e=i.properties;if(!e||!((s=i.tooltip_sections)!=null&&s.length))return[];const t=[];for(const a of i.tooltip_sections){for(const r of a.section_attributes??[])for(const n of r.important_properties??[]){const l=e[n];if(!l||t.length>=5)break;const o=l.label??n,d=l.prefix??"",h=l.value??"",c=l.postfix??l.display_units??"";h&&t.push(`${o}: ${d}${h}${c}`)}if(t.length>=5)break}return t}const Lt=[{id:"builds",label:"Builds"},{id:"items",label:"Items"},{id:"skill-path",label:"Skill Path"},{id:"overview",label:"Overview & Abilities"},{id:"lore",label:"Lore"}],Et=["#6eb3a8","#c9a46e","#a86e9e","#8cb86e"];class ka{constructor(){p(this,"container",null);p(this,"hero",null);p(this,"currentTab","builds");p(this,"selectedBuildIdx",0);p(this,"builds",[]);p(this,"buildStats",[]);p(this,"heroAbilities",[]);p(this,"abilityStats",[]);p(this,"items",new Map);p(this,"itemsPeriod","latest");p(this,"itemsRank",{mode:"all",tier:0});p(this,"itemsTiers",new Set([1,2,3,4]));p(this,"itemsCurrentStats",[]);p(this,"itemsRefStats",[]);p(this,"heroMatchesCur",0);p(this,"heroMatchesRef",0);p(this,"patchDays",[]);p(this,"itemsLoading",!1);p(this,"itemsLoaded",!1);p(this,"itemsError",!1);p(this,"itemsSortCol","usage");p(this,"itemsSortDir","desc");p(this,"selectedAbilityIdx",0)}mountWithHero(e,t){this.container=e,this.hero=t,this.currentTab="builds",this.selectedBuildIdx=0,this.builds=[],this.buildStats=[],this.heroAbilities=[],this.abilityStats=[],this.items=new Map,this.itemsPeriod="latest",this.itemsRank={mode:"all",tier:0},this.itemsTiers=new Set([1,2,3,4]),this.itemsCurrentStats=[],this.itemsRefStats=[],this.heroMatchesCur=0,this.heroMatchesRef=0,this.itemsLoading=!1,this.itemsLoaded=!1,this.itemsError=!1,this.itemsSortCol="usage",this.itemsSortDir="desc",this.selectedAbilityIdx=0,this.renderSkeleton(),this.fetchAll()}mount(e){e.innerHTML=`
      <div class="p-8 bg-charcoal-100 min-h-screen flex items-center justify-center">
        <p class="text-grey-500 text-sm">Select a hero from the library to view details.</p>
      </div>`}async fetchAll(){if(!this.hero)return;const e=this.hero.id;try{const[t,s,a,r,n]=await Promise.all([fetch(`${K}/v1/builds?hero_id=${e}&sort_by=weekly_favorites&limit=3&only_latest=true&build_language=English`).then(o=>o.ok?o.json():Promise.resolve([])),fetch(`${K}/v1/analytics/hero-build-stats/${e}`).then(o=>o.ok?o.json():Promise.resolve([])),$a(),fetch(`${K}/v1/assets/items/by-hero-id/${e}`).then(o=>o.ok?o.json():Promise.resolve([])),fetch(`${K}/v1/analytics/ability-order-stats?hero_id=${e}&min_matches=200`).then(o=>o.ok?o.json():Promise.resolve([]))]);this.builds=Array.isArray(t)?t.slice(0,3):[],this.buildStats=Array.isArray(s)?s:[],this.items=a,this.abilityStats=(Array.isArray(n)?n:[]).sort((o,d)=>d.matches-o.matches).slice(0,5);const l=Array.isArray(r)?r:[];this.heroAbilities=l.filter(o=>o.name!=="Melee"&&!o.name.includes("_")).slice(0,4).sort((o,d)=>{var u,g;const h=((u=this.items.get(o.id))==null?void 0:u.ability_type)==="ultimate"?1:0,c=((g=this.items.get(d.id))==null?void 0:g.ability_type)==="ultimate"?1:0;return h-c}),this.render()}catch{this.renderError()}}render(){!this.container||!this.hero||(this.container.innerHTML=this.renderHeader()+`<div id="hero-tab-content" class="pb-12">${this.renderTabContent()}</div>`,this.bindEvents())}renderSkeleton(){this.container&&(this.container.innerHTML=`
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
            ${Lt.map(o=>`
              <button data-tab="${o.id}"
                class="hero-tab-btn px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap
                  ${this.currentTab===o.id?"text-dry-sage-400 border-dry-sage-400":"text-grey-500 border-transparent hover:text-grey-300 hover:border-charcoal-300"}">
                ${o.label}
              </button>`).join("")}
          </div>
        </div>
      </div>`}renderTabContent(){var e;switch(this.currentTab){case"builds":return this.renderBuildsTab();case"skill-path":return this.renderSkillPathTab();case"lore":return this.renderLoreTab();case"items":return this.renderItemsTab();case"overview":return this.renderOverviewTab();default:return this.renderPlaceholder(((e=Lt.find(t=>t.id===this.currentTab))==null?void 0:e.label)??"")}}renderBuildsTab(){if(this.builds.length===0)return`<div class="flex flex-col items-center justify-center gap-3 py-24 text-grey-500">
        <p class="text-sm">No builds found for this hero.</p>
      </div>`;const e=this.recommendedBuildIdx();return`
      <div class="max-w-5xl">
        ${this.renderBuildSelector(e)}
        <div id="build-detail-area" class="p-8 pt-6 space-y-5">
          ${this.renderBuildDetail(this.selectedBuildIdx)}
        </div>
      </div>`}recommendedBuildIdx(){let e=0,t=-1;return this.builds.forEach((s,a)=>{const r=s.num_weekly_favorites??0;r>t&&(t=r,e=a)}),e}damageType(e){let t=0,s=0;return(e.hero_build.details.mod_categories??[]).forEach(a=>{(a.mods??[]).forEach(r=>{const n=this.items.get(r.ability_id);n&&(n.item_slot_type==="weapon"?t++:n.item_slot_type==="spirit"&&s++)})}),t===0&&s===0?null:t>=s?"Gun":"Mystic"}renderBuildSelector(e){return`
      <div class="flex border-b border-charcoal-400 bg-charcoal-200/60">
        ${this.builds.map((t,s)=>{const a=this.buildStats.find(h=>h.hero_build_id===t.hero_build.hero_build_id),r=a&&a.matches>0?Math.round(a.wins/a.matches*100):null,n=this.damageType(t),l=s===this.selectedBuildIdx,o=s===e,d=n==="Gun"?"background:#f9731622;color:#fb923c;border:1px solid #f9731640":n==="Mystic"?"background:#a855f722;color:#c084fc;border:1px solid #a855f740":"background:#37415122;color:#9ca3af;border:1px solid #37415140";return`
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
                        style="${d}">${n}</span>`:""}
                ${r!==null?`
                  <span class="text-[11px] font-bold ${l?"text-white":"text-grey-500"}">${r}%</span>
                  <span class="text-[10px] text-grey-600">WR</span>`:""}
              </div>
            </button>`}).join("")}
      </div>`}renderBuildDetail(e){const t=this.builds[e];return t?this.renderBuildSummary(t,e)+this.renderBuildFullGrid(t):""}renderBuildSummary(e,t){var f;const s=this.buildStats.find(y=>y.hero_build_id===e.hero_build.hero_build_id),a=s&&s.matches>0?(s.wins/s.matches*100).toFixed(1):null,r=(s==null?void 0:s.matches)??0;let n=0,l=0,o=0;(e.hero_build.details.mod_categories??[]).forEach(y=>(y.mods??[]).forEach(_=>{const $=this.items.get(_.ability_id);($==null?void 0:$.item_slot_type)==="weapon"?n++:($==null?void 0:$.item_slot_type)==="spirit"?l++:($==null?void 0:$.item_slot_type)==="vitality"&&o++}));const d=n+l+o||1,h=Math.round(n/d*100),c=Math.round(l/d*100),u=100-h-c,g=e.hero_build.details.mod_categories??[],v=g.find(y=>y.name.toLowerCase().includes("core"))??g[0],m=((v==null?void 0:v.mods)??[]).slice(0,12),b=(((f=e.hero_build.details.ability_order)==null?void 0:f.currency_changes)??[]).slice(0,8);return`
      <div class="bg-charcoal-200 rounded-xl border border-charcoal-400 overflow-hidden">

        <!-- ── ZONE A: Stats bar ──────────────────────────────────────── -->
        <div class="grid border-b border-charcoal-400"
             style="grid-template-columns:180px 1fr auto;">

          <!-- Left: Damage split -->
          <div class="px-4 py-3 border-r border-charcoal-400 flex flex-col justify-center gap-1.5">
            <p class="text-[9px] uppercase tracking-widest text-grey-600 mb-0.5">Damage Split</p>
            <div class="flex items-center gap-1.5">
              <div class="relative flex-1 h-4 rounded-sm overflow-hidden bg-charcoal-400 flex">
                <div class="h-full transition-all" style="width:${h}%;background:#f97316;"></div>
                <div class="h-full transition-all" style="width:${c}%;background:#a855f7;"></div>
                <div class="h-full transition-all" style="width:${u}%;background:#22c55e;"></div>
              </div>
            </div>
            <div class="flex items-center gap-2 text-[10px]">
              <span class="text-orange-400 font-semibold">G ${h}%</span>
              <span class="text-purple-400 font-semibold">S ${c}%</span>
              <span class="text-green-400 font-semibold">V ${u}%</span>
            </div>
          </div>

          <!-- Center: Unlock order -->
          <div class="px-4 py-3 flex flex-col justify-center gap-1.5 overflow-x-auto">
            <p class="text-[9px] uppercase tracking-widest text-grey-600 shrink-0">Unlock Order</p>
            <div class="flex items-center gap-1">
              ${b.map((y,_)=>{const $=this.heroAbilities.find(E=>E.id===y.ability_id),k=$?oe($):"";return`
                  ${_>0?'<span class="text-charcoal-400 text-[10px] shrink-0">›</span>':""}
                  <div class="relative group shrink-0">
                    <div class="w-8 h-8 rounded border border-charcoal-400 bg-charcoal-300 overflow-hidden">
                      ${k?`<img src="${k}" alt="${($==null?void 0:$.name)??""}" class="w-full h-full object-cover"/>`:`<div class="w-full h-full flex items-center justify-center text-grey-600 text-[9px]">${_+1}</div>`}
                    </div>
                    <span class="absolute -bottom-1 -right-1 text-[8px] bg-charcoal-100 text-grey-500 rounded-sm px-0.5 leading-tight border border-charcoal-400">${_+1}</span>
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
        ${m.length>0?`
          <div class="px-4 py-3">
            <p class="text-[9px] uppercase tracking-widest text-grey-600 mb-2">
              ${(v==null?void 0:v.name)??"Core Items"}
            </p>
            <div class="flex gap-1.5 overflow-x-auto pb-1">
              ${this.renderItemIcons(m.map(y=>y.ability_id),44)}
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
          ${t.map(s=>{var o;const a=s.mods??[],r={};a.forEach(d=>{var c;const h=((c=this.items.get(d.ability_id))==null?void 0:c.item_slot_type)??"other";r[h]=(r[h]??0)+1});const n=((o=Object.entries(r).sort((d,h)=>h[1]-d[1])[0])==null?void 0:o[0])??"other",l=n==="weapon"?"#f97316":n==="spirit"?"#a855f7":n==="vitality"?"#22c55e":"#4b5563";return`
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
                  ${a.map(d=>{const h=this.items.get(d.ability_id),c=h?oe(h):"",u=(h==null?void 0:h.name)??`#${d.ability_id}`,g=h?Pt(h):"",v=(h==null?void 0:h.cost)??null,m=h?Ct(h):[],b=Be(h==null?void 0:h.item_slot_type);return`
                      <div class="relative group shrink-0 flex flex-col items-center gap-0.5" style="width:52px;">
                        <!-- Icon square -->
                        <div class="relative w-full rounded border bg-charcoal-300 overflow-hidden cursor-default"
                             style="height:52px;border-color:${b}44;">
                          ${c?`<img src="${c}" alt="${u}" class="w-full h-full object-cover"/>`:`<div class="w-full h-full flex items-center justify-center text-grey-600 text-[8px] p-0.5 text-center leading-tight">${u.slice(0,5)}</div>`}
                          <!-- Slot colour bottom strip -->
                          <div class="absolute bottom-0 left-0 right-0 h-0.5" style="background:${b};"></div>
                          <!-- Tier badge top-right (shared utility — Roman numeral + slot color) -->
                          ${h?de(h):""}
                        </div>
                        <!-- Cost always visible below icon -->
                        ${v?`<p class="text-[9px] font-semibold text-yellow-400 leading-none text-center">${v.toLocaleString()}</p>`:""}
                        <!-- Tooltip on hover — above icon -->
                        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[60]
                                    hidden group-hover:block pointer-events-none"
                             style="width:220px;">
                          <div class="bg-charcoal-200 border border-charcoal-400 rounded-lg shadow-2xl overflow-hidden">
                            <div class="flex items-center justify-between gap-2 px-3 pt-2.5 pb-1.5"
                                 style="border-bottom:1px solid ${b}44;">
                              <p class="text-white text-xs font-bold leading-tight">${u}</p>
                              ${v?`<span class="text-yellow-400 text-[11px] font-semibold shrink-0">${v.toLocaleString()} 🪙</span>`:""}
                            </div>
                            <div class="px-3 py-2 space-y-1.5">
                              ${g?`<p class="text-grey-400 text-[11px] leading-snug">${g}</p>`:""}
                              ${m.length>0?`
                                <div class="space-y-0.5 pt-1 border-t border-charcoal-400">
                                  ${m.map(f=>`<p class="text-dry-sage-400 text-[11px] font-medium">${f}</p>`).join("")}
                                </div>`:""}
                            </div>
                          </div>
                        </div>
                      </div>`}).join("")}
                </div>
              </div>`}).join("")}
        </div>
      </div>`}renderItemIcons(e,t){return e.map(s=>{const a=this.items.get(s),r=a?oe(a):"",n=(a==null?void 0:a.name)??`#${s}`,l=a?Pt(a):"",o=(a==null?void 0:a.cost)??null,d=a?Ct(a):[],h=`${t}px`,c=(a==null?void 0:a.item_slot_type)==="weapon"?"#f97316":(a==null?void 0:a.item_slot_type)==="spirit"?"#a855f7":(a==null?void 0:a.item_slot_type)==="vitality"?"#22c55e":"#4b5563";return`
        <div class="relative group shrink-0" style="width:${h};height:${h};">
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
                ${d.length>0?`
                  <div class="space-y-0.5 pt-1 border-t border-charcoal-400">
                    ${d.map(u=>`<p class="text-dry-sage-400 text-[11px] font-medium">${u}</p>`).join("")}
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
        ${this.heroAbilities.map((e,t)=>{const s=this.items.get(e.id),a=(s==null?void 0:s.ability_type)==="ultimate",r=t===this.selectedAbilityIdx,n=oe(e);return`
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
      </div>`:'<p class="text-grey-600 text-xs">No ability data available.</p>'}renderAbilityDetail(e){var T,D;const t=this.heroAbilities[e];if(!t)return`
        <div class="bg-charcoal-200 rounded-xl border border-charcoal-400 px-5 py-8 text-center">
          <p class="text-grey-600 text-sm">Select an ability to view its details.</p>
        </div>`;const s=this.items.get(t.id)??{},a=String((s==null?void 0:s.ability_type)??""),r=a==="ultimate",n=(s==null?void 0:s.properties)??{},l=(s==null?void 0:s.description)??{},o=typeof l=="string"?l:l.desc??l.active??l.passive??"",d=o?this.parseAbilityDesc(o):"",h=typeof l=="object"?String(l.quip??""):"",c=x=>x.replace(/<[^>]+>/g,"").replace(/&[a-z]+;/gi," ").replace(/\s+/g," ").trim(),u=(s==null?void 0:s.upgrades)??[],g=x=>{const S=`t${x+1}_desc`,w=typeof l=="object"&&l?l[S]:void 0;if(w)return c(w);const P=u[x],q=(P==null?void 0:P.property_upgrades)??[];return q.length?q.map(j=>{const B=n[j.name],ue=(B==null?void 0:B.label)??j.name,pe=(B==null?void 0:B.postfix)??"",me=typeof j.bonus=="number"?j.bonus:parseFloat(String(j.bonus));let ge;return isNaN(me)?ge=`+${j.bonus}`:ge=`${me>=0?"+":""}${me}${pe}`,`${ge} ${ue}`}).join(" · "):null},v=["#c084fc","#a855f7","#7c3aed"],m=[];for(let x=0;x<3;x++){const S=g(x);S&&m.push({tier:`T${x+1}`,text:S,color:v[x]})}const b=(x,S="0")=>x?`${x.value??S}${x.postfix??""}`:S,f=Number(((T=n.AbilityCharges)==null?void 0:T.value)??0),y=Number(((D=n.AbilityCooldownBetweenCharge)==null?void 0:D.value)??-1),_=[{label:"Cooldown",value:b(n.AbilityCooldown)},{label:"Cast Range",value:b(n.AbilityCastRange)},{label:"Duration",value:b(n.AbilityDuration)},...f>0?[{label:"Charges",value:String(f)}]:[],...f>0&&y>0?[{label:"Charge Delay",value:`${y}s`}]:[]],$=new Set(["AbilityUnitTargetLimit","AbilityCastDelay","AbilityChannelTime","AbilityPostCastDuration","ChannelMoveSpeed","AbilityResourceCost","AbilityCooldown","AbilityDuration","AbilityCastRange","AbilityCharges","AbilityCooldownBetweenCharge"]),k=Object.entries(n).filter(([x,S])=>{if($.has(x)||!(S!=null&&S.label))return!1;const w=String(S.value??"");return w&&w!=="0"&&w!=="-1"&&w!=="0%"&&w!=="0m"&&w!=="0s"&&w!=="0.0"}).slice(0,6).map(([,x])=>({label:x.label,value:`${x.value}${x.postfix??""}`})),E=r?"rgba(251,191,36,0.25)":"#494949",M=r?`<span class="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded font-bold uppercase
                      tracking-widest"
               style="background:rgba(250,180,30,0.12);color:#fbbf24;border:1px solid rgba(250,180,30,0.35);">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-2.5 h-2.5">
             <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
           </svg>
           Ultimate
         </span>`:a==="signature"?`<span class="text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest"
               style="background:rgba(176,164,114,0.1);color:#b0a472;border:1px solid rgba(176,164,114,0.25);">
           Signature
         </span>`:"",A=(x,S)=>`
      <div class="flex flex-col items-center justify-center px-4 py-2 rounded-lg min-w-[76px]
                  bg-charcoal-300/60 border border-charcoal-400 text-center">
        <span class="text-[9px] uppercase tracking-widest text-grey-600 mb-0.5">${x}</span>
        <span class="text-white text-sm font-bold leading-none tabular-nums">${S}</span>
      </div>`;return`
      <div class="bg-charcoal-200 rounded-xl overflow-hidden" style="border:1px solid ${E};">

        <!-- ── Header ──────────────────────────────────────────────── -->
        <div class="px-5 py-4 border-b border-charcoal-400"
             style="${r?"background:linear-gradient(to right,rgba(120,53,15,0.22),transparent);":""}">
          <div class="flex items-center gap-3 flex-wrap">
            <h3 class="text-white text-xl font-bold tracking-wide leading-none">${t.name}</h3>
            ${M}
          </div>
          ${h?`<p class="text-grey-500 text-sm mt-1.5 italic leading-snug">${h}</p>`:""}
        </div>

        <!-- ── Description ─────────────────────────────────────────── -->
        <div class="px-5 py-4">
          <p class="text-grey-800 text-sm leading-relaxed">
            ${d||'<span class="text-grey-600">No description available.</span>'}
          </p>
        </div>

        ${m.length?`
        <!-- ── Upgrade Tiers ───────────────────────────────────────── -->
        <div class="px-5 py-3.5 border-t border-charcoal-400 space-y-2">
          <p class="text-xs font-semibold text-grey-700 uppercase tracking-widest mb-3">Ability Upgrades</p>
          ${m.map(x=>`
            <div class="flex items-start gap-2.5">
              <span class="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-sm leading-tight mt-0.5"
                    style="background:${x.color}22;color:${x.color};border:1px solid ${x.color}44;">${x.tier}</span>
              <span class="text-grey-700 text-xs leading-relaxed">${x.text}</span>
            </div>`).join("")}
        </div>`:""}

        <!-- ── Stats Footer ─────────────────────────────────────────── -->
        <div class="px-5 py-4 border-t border-charcoal-400 space-y-3">
          ${k.length?`
          <div class="flex flex-wrap gap-2">
            ${k.map(x=>`
              <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                          bg-charcoal-300/60 border border-charcoal-400">
                <span class="text-grey-500 text-[10px]">${x.label}</span>
                <span class="text-dry-sage-400 text-[10px] font-semibold tabular-nums">${x.value}</span>
              </div>`).join("")}
          </div>`:""}
          <div class="flex flex-wrap gap-2">
            ${_.map(x=>A(x.label,x.value)).join("")}
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
      </div>`}renderSkillVariation(e,t,s){const a=e.matches>0?(e.wins/e.matches*100).toFixed(1):"—",r=e.abilities.length,n=22,l=Array.from({length:4},()=>Array(r).fill(!1));return e.abilities.forEach((o,d)=>{const h=s.get(o);h!==void 0&&(l[h][d]=!0)}),`
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
              ${Array.from({length:r},(o,d)=>`
                <div class="text-[9px] text-grey-600 text-center shrink-0"
                     style="width:${n}px;">${d+1}</div>`).join("")}
            </div>

            <!-- Ability rows -->
            ${this.heroAbilities.map((o,d)=>{const h=Et[d]??Et[0],c=oe(o);return`
                <div class="flex items-center mb-1">
                  <!-- Ability icon -->
                  <div class="shrink-0 mr-2" style="width:40px;height:40px;">
                    <div class="w-full h-full rounded border border-charcoal-400 bg-charcoal-300 overflow-hidden"
                         title="${o.name}">
                      ${c?`<img src="${c}" alt="${o.name}" class="w-full h-full object-cover"/>`:`<div class="w-full h-full flex items-center justify-center text-grey-500 text-[10px]">${d+1}</div>`}
                    </div>
                  </div>

                  <!-- Grid cells -->
                  ${l[d].map(u=>`
                    <div class="shrink-0 flex items-center justify-center rounded-sm"
                         style="width:${n}px;height:${n}px;background:${u?h+"22":"transparent"};">
                      ${u?`<img src="${Gt}" alt="" class="w-3.5 h-3.5 object-contain" />`:""}
                    </div>`).join("")}
                </div>`}).join("")}

            ${this.heroAbilities.length===0?`
              <p class="text-grey-600 text-xs py-2 pl-12">Ability icons unavailable — sequence data only.</p>
              <div class="flex gap-1 pl-12 flex-wrap">
                ${e.abilities.map((o,d)=>`
                  <span class="text-[10px] text-grey-500 bg-charcoal-300 px-1.5 py-0.5 rounded border border-charcoal-400">
                    ${d+1}:${o}
                  </span>`).join("")}
              </div>`:""}
          </div>
        </div>
      </div>`}renderPlaceholder(e){return`
      <div class="flex flex-col items-center justify-center gap-3 py-24 text-grey-500">
        <div class="text-4xl opacity-30">🔧</div>
        <p class="text-sm">${e} — Coming soon</p>
      </div>`}renderLoreTab(){var n,l,o,d,h;if(!this.hero)return"";const e=this.hero.name??"Unknown Hero",t=(n=this.hero.description)==null?void 0:n.lore,s=(l=this.hero.description)==null?void 0:l.role,a=(o=this.hero.description)==null?void 0:o.playstyle;return`
      <div class="relative w-full overflow-hidden" style="min-height:520px;">
        <div class="absolute inset-0"
             style="background-image:url('${((d=this.hero.images)==null?void 0:d.background_image_webp)??((h=this.hero.images)==null?void 0:h.background_image)??""}');background-size:cover;background-position:center top;"></div>
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
      </div>`}async fetchItemsData(){var e,t;if(!(!this.hero||this.itemsLoading)){this.itemsLoading=!0,this.itemsError=!1,this.refreshTabContent();try{if(this.patchDays.length===0){const g=await fetch(`${K}/v1/patches/big-days`).then(v=>v.ok?v.json():Promise.resolve([])).catch(()=>[]);this.patchDays=Array.isArray(g)?g.sort():[]}this.itemsPeriod==="latest"&&this.patchDays.length>0&&(this.itemsPeriod=this.patchDays[this.patchDays.length-1]);const{curStart:s,curEnd:a,refStart:r,refEnd:n}=this.getPeriodTimestamps(),l=g=>g.ok?g.json():Promise.resolve([]),[o,d,h,c]=await Promise.all([fetch(this.buildItemStatsUrl(s,a)).then(l),fetch(this.buildItemStatsUrl(r,n)).then(l),fetch(this.buildHeroStatsUrl(s,a)).then(l),fetch(this.buildHeroStatsUrl(r,n)).then(l)]);this.itemsCurrentStats=Array.isArray(o)?o:[],this.itemsRefStats=Array.isArray(d)?d:[];const u=this.hero.id;this.heroMatchesCur=((e=(Array.isArray(h)?h:[]).find(g=>g.hero_id===u))==null?void 0:e.matches)??0,this.heroMatchesRef=((t=(Array.isArray(c)?c:[]).find(g=>g.hero_id===u))==null?void 0:t.matches)??0,this.itemsLoaded=!0}catch{this.itemsError=!0}finally{this.itemsLoading=!1,this.refreshTabContent()}}}buildItemStatsUrl(e,t){const s=new URLSearchParams;return s.set("hero_ids",String(this.hero.id)),e>0&&s.set("min_unix_timestamp",String(e)),t>0&&s.set("max_unix_timestamp",String(t)),this.appendBadgeParams(s),`${K}/v1/analytics/item-stats?${s}`}buildHeroStatsUrl(e,t){const s=new URLSearchParams;return e>0&&s.set("min_unix_timestamp",String(e)),t>0&&s.set("max_unix_timestamp",String(t)),this.appendBadgeParams(s),`${K}/v1/analytics/hero-stats?${s}`}appendBadgeParams(e){if(this.itemsRank.mode==="all")return;const t=F.find(s=>s.tier===this.itemsRank.tier);t&&(e.set("min_average_badge",String(t.badgeMin)),this.itemsRank.mode==="exact"&&e.set("max_average_badge",String(t.badgeMax)))}getPeriodTimestamps(){const e=Math.floor(Date.now()/1e3),t=86400,s={"7d":7,"14d":14,"30d":30,"90d":90};if(s[this.itemsPeriod]!==void 0){const h=s[this.itemsPeriod]*t;return{curStart:e-h,curEnd:e,refStart:e-2*h,refEnd:e-h}}const a=this.itemsPeriod==="latest"?this.patchDays[this.patchDays.length-1]??null:this.itemsPeriod;if(!a)return{curStart:e-30*t,curEnd:0,refStart:e-60*t,refEnd:e-30*t};const r=this.patchDays.indexOf(a),n=Math.floor(new Date(a).getTime()/1e3),l=r>=0&&r<this.patchDays.length-1?Math.floor(new Date(this.patchDays[r+1]).getTime()/1e3):0,o=r>0?this.patchDays[r-1]:null,d=o?Math.floor(new Date(o).getTime()/1e3):n-14*t;return{curStart:n,curEnd:l,refStart:d,refEnd:n}}computeItemRows(){const e=new Map(this.itemsCurrentStats.map(a=>[a.item_id,a])),t=new Map(this.itemsRefStats.map(a=>[a.item_id,a])),s=[];for(const[a,r]of e){const n=this.items.get(a);if(!(n!=null&&n.item_slot_type))continue;const l=n.item_tier??0;if(l>0&&!this.itemsTiers.has(l))continue;const o=t.get(a),d=r.matches>0?r.wins/r.matches*100:0,h=o&&o.matches>0?o.wins/o.matches*100:0,c=this.heroMatchesCur>0?r.matches/this.heroMatchesCur*100:0,u=o&&this.heroMatchesRef>0?o.matches/this.heroMatchesRef*100:0;s.push({itemId:a,wins:r.wins,losses:r.losses,matches:r.matches,winRate:d,winRateChange:o?d-h:0,usagePct:c,usageChange:o?c-u:0})}return s.sort((a,r)=>{var l,o,d,h;let n=0;switch(this.itemsSortCol){case"name":n=(((l=this.items.get(a.itemId))==null?void 0:l.name)??"").localeCompare(((o=this.items.get(r.itemId))==null?void 0:o.name)??"");break;case"cost":n=(((d=this.items.get(a.itemId))==null?void 0:d.cost)??0)-(((h=this.items.get(r.itemId))==null?void 0:h.cost)??0);break;case"winRate":n=a.winRate-r.winRate;break;case"winRateChange":n=a.winRateChange-r.winRateChange;break;case"usage":n=a.usagePct-r.usagePct;break;case"usageChange":n=a.usageChange-r.usageChange;break;case"winloss":n=a.wins-r.wins;break}return this.itemsSortDir==="desc"?-n:n}),s}renderItemsTab(){if(!this.hero)return"";const e=this.hero.name??"Hero";return this.itemsError?`
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
      </div>`}isFiltered(){const e=this.patchDays.length>0?this.patchDays[this.patchDays.length-1]:"",t=this.itemsPeriod!==e&&this.itemsPeriod!=="latest",s=this.itemsRank.mode!=="all",a=this.itemsTiers.size!==4||![1,2,3,4].every(r=>this.itemsTiers.has(r));return t||s||a}renderItemsFilters(){const e=F.map(a=>`
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
      </div>`}renderItemRow(e,t){const s=this.items.get(e.itemId),a=s?oe(s):"",r=(s==null?void 0:s.name)??`#${e.itemId}`,n=(s==null?void 0:s.cost)??null,l=Be(s==null?void 0:s.item_slot_type);return`
      <tr class="border-b border-charcoal-400 ${t%2===0?"bg-charcoal-100":"bg-charcoal-200/40"} hover:bg-charcoal-300/50 transition-colors">

        <!-- Item: icon + tier badge + name -->
        <td class="px-4 py-3">
          <div class="flex items-center gap-3">
            <div class="relative shrink-0" style="width:36px;height:36px;">
              <div class="w-full h-full rounded border bg-charcoal-300 overflow-hidden"
                   style="border-color:${l}55;">
                ${a?`<img src="${a}" alt="${r}" class="w-full h-full object-cover"/>`:""}
                <div class="absolute bottom-0 left-0 right-0 h-0.5" style="background:${l};"></div>
                ${s?de(s):""}
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
      </th>`}changeClass(e){return e>=5?"text-emerald-500 font-semibold":e>0?"text-green-400":e===0?"text-grey-500":e>-5?"text-orange-400":"text-red-600 font-bold"}formatChange(e){return e===0?"—":`${e>0?"+":""}${e.toFixed(2)}%`}formatK(e){return e>=1e3?`${(e/1e3).toFixed(1)}K`:String(e)}refreshTabContent(){var t;const e=(t=this.container)==null?void 0:t.querySelector("#hero-tab-content");e&&(e.innerHTML=this.renderTabContent(),this.bindBuildEvents(),this.bindItemsEvents())}bindEvents(){var e;(e=this.container)==null||e.querySelectorAll(".hero-tab-btn").forEach(t=>{t.addEventListener("click",()=>{const s=t.dataset.tab;s&&s!==this.currentTab&&(this.currentTab=s,this.render(),s==="items"&&!this.itemsLoaded&&!this.itemsLoading&&this.fetchItemsData())})}),this.bindBuildEvents(),this.bindItemsEvents(),this.bindAbilityEvents()}bindBuildEvents(){var e;(e=this.container)==null||e.querySelectorAll(".build-selector-btn").forEach(t=>{t.addEventListener("click",()=>{var r;const s=parseInt(t.dataset.buildIdx??"",10);if(isNaN(s)||s===this.selectedBuildIdx)return;this.selectedBuildIdx=s;const a=(r=this.container)==null?void 0:r.querySelector("#hero-tab-content");a&&(a.innerHTML=this.renderBuildsTab(),this.bindBuildEvents())})})}bindItemsEvents(){var s,a,r,n,l,o,d,h;if(this.currentTab!=="items")return;const e=(s=this.container)==null?void 0:s.querySelector("#items-period-select");e==null||e.addEventListener("change",()=>{this.itemsPeriod=e.value,this.itemsLoaded=!1,this.itemsCurrentStats=[],this.itemsRefStats=[],this.fetchItemsData()});const t=(a=this.container)==null?void 0:a.querySelector("#items-rank-select");t==null||t.addEventListener("change",()=>{const c=t.value;c==="all"?this.itemsRank={mode:"all",tier:0}:c.endsWith("+")?this.itemsRank={mode:"plus",tier:parseInt(c)}:this.itemsRank={mode:"exact",tier:parseInt(c)},this.itemsLoaded=!1,this.itemsCurrentStats=[],this.itemsRefStats=[],this.fetchItemsData()}),(r=this.container)==null||r.querySelectorAll(".items-sort-btn").forEach(c=>{c.addEventListener("click",()=>{const u=c.dataset.sort;this.itemsSortCol===u?this.itemsSortDir=this.itemsSortDir==="desc"?"asc":"desc":(this.itemsSortCol=u,this.itemsSortDir="desc"),this.refreshTabContent()})}),(n=this.container)==null||n.querySelectorAll(".items-tier-btn").forEach(c=>{c.addEventListener("click",()=>{const u=parseInt(c.dataset.tier??"");isNaN(u)||(this.itemsTiers.has(u)?this.itemsTiers.delete(u):this.itemsTiers.add(u),this.refreshTabContent())})}),(o=(l=this.container)==null?void 0:l.querySelector("#items-retry-btn"))==null||o.addEventListener("click",()=>{this.itemsError=!1,this.fetchItemsData()}),(h=(d=this.container)==null?void 0:d.querySelector("#items-refresh-btn"))==null||h.addEventListener("click",()=>{this.isFiltered()&&(this.itemsLoaded=!1,this.itemsCurrentStats=[],this.itemsRefStats=[],this.fetchItemsData())})}}class _a{constructor(){p(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
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
    `)}}const Ma={yellow:{border:"border-l-yellow-400",dot:"bg-yellow-400",text:"text-yellow-400"},blue:{border:"border-l-blue-400",dot:"bg-blue-400",text:"text-blue-400"},green:{border:"border-l-emerald-400",dot:"bg-emerald-400",text:"text-emerald-400"}};function Pe(i){return i.toFixed(1)}class Sa{static render(e){var E,M,A,T,D,x,S;const{player:t,laneColor:s,showLane:a}=e,r={border:"border-l-grey-600",dot:"bg-grey-600"},n=a===!1?r:Ma[s??""]??r,l=((E=t.steamProfile)==null?void 0:E.personaname)??t.name??`Player ${t.player_slot+1}`,o=((M=t.heroData)==null?void 0:M.name)??t.hero_name??"—",d=((A=t.steamProfile)==null?void 0:A.profileurl)??`https://steamcommunity.com/profiles/${BigInt(t.account_id)+BigInt("76561197960265728")}`,h=((D=(T=t.heroData)==null?void 0:T.images)==null?void 0:D.icon_image_small_webp)??((S=(x=t.heroData)==null?void 0:x.images)==null?void 0:S.icon_image_small)??"",c=t.heroMatchesPlayed??0,u=t.heroWinrate!==void 0?Math.round(t.heroWinrate):null,g=t.heroAvgKills!==void 0?Pe(t.heroAvgKills):"—",v=t.heroAvgDeaths!==void 0?Pe(t.heroAvgDeaths):"—",m=t.heroAvgAssists!==void 0?Pe(t.heroAvgAssists):"—",b=t.heroAvgKills!==void 0&&t.heroAvgDeaths!==void 0&&t.heroAvgAssists!==void 0?Pe((t.heroAvgKills+t.heroAvgAssists)/Math.max(t.heroAvgDeaths,.1)):null,f=t.rankName??null,y=t.rankImageUrl??null,_=t.rankTopPercent!==void 0?t.rankTopPercent:null,$=t.activity12h,k=t.activity30d;return`
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
            href="${d}"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white font-bold text-base leading-tight truncate flex-1 min-w-0 hover:text-frosted-mint-400 transition-colors"
            title="Voir le profil Steam"
          >${l}</a>
          ${a===!1?"":`<span class="w-2 h-2 rounded-full ml-2 shrink-0 ${n.dot}"></span>`}
        </div>

        <!-- HERO SECTION: icon + "as Hero (Xp)" + winrate -->
        <div class="flex items-center gap-2 px-3 pb-2 shrink-0">
          <!-- Hero icon: icon_image_small_webp from /v1/assets/heroes/{id} (full CDN URL) -->
          ${h?`<div class="w-10 h-10 rounded-full bg-[#111518] border-2 border-[#2a2f35] overflow-hidden shrink-0 flex items-center justify-center">
                 <img src="${h}" alt="${o}" class="w-full h-full object-cover" />
               </div>`:`<div class="w-10 h-10 rounded-full bg-[#111518] border-2 border-[#2a2f35] shrink-0 flex items-center justify-center">
                 <svg class="w-5 h-5 text-[#555]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                 </svg>
               </div>`}
          <div class="flex flex-col min-w-0">
            <span class="text-[#c9d1d9] text-sm font-medium leading-tight truncate">
              as ${o}${c>0?` (${c}p)`:""}
            </span>
            ${u!==null?`<span class="text-[#9ca3af] text-xs leading-tight">
                   ${u}% Win
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
            <span class="text-red-400">${v}</span>
            <span class="text-[#555]">/</span>
            <span class="text-yellow-400">${m}</span>
          </div>
          <p class="text-center text-[10px] text-[#555] mt-0.5 leading-tight">
            ${b!==null?`KDA (${b})`:"KDA (—)"}
          </p>
        </div>

        <!-- DIVIDER -->
        <div class="mx-3 border-t border-[#2a2f35] mb-2 shrink-0"></div>

        <!-- RANK SECTION -->
        <div class="flex items-center gap-2 px-3 pb-2 shrink-0">
          ${y?`<img src="${y}" alt="${f??"rank"}" class="w-8 h-8 object-contain shrink-0" />`:'<div class="w-8 h-8 rounded bg-[#111518] border border-[#2a2f35] shrink-0"></div>'}
          <div class="flex flex-col min-w-0">
            <span class="text-white text-xs font-semibold leading-tight truncate">
              ${f??"—"}
            </span>
            ${_!==null?`<span class="text-[#9ca3af] text-[10px] leading-tight">Top ${_}%</span>`:""}
          </div>
        </div>

        <!-- DIVIDER -->
        <div class="mx-3 border-t border-[#2a2f35] mb-2 shrink-0"></div>

        <!-- ACTIVITY: 12H + 30D -->
        <div class="flex gap-2 px-3 pb-2 shrink-0">
          <div class="flex-1 bg-[#111518] rounded px-2 py-1">
            <p class="text-[10px] text-[#555] leading-tight font-medium">12H</p>
            <p class="text-[11px] text-[#9ca3af] leading-tight">
              ${$!==void 0?`${$.games} games · ${$.wins} wins`:"— games · — wins"}
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
    `}static mount(e,t){e.innerHTML=this.render(t)}}const G="https://api.deadlock-api.com",Tt=[80659633,84419762,80457157,84553413],Ia=12*60*60,Aa=30*24*60*60;class Pa{constructor(){p(this,"container",null);p(this,"isLoading",!1);p(this,"matchData",null);p(this,"heroCache",new Map);p(this,"detectedMatchId",null);p(this,"loadedMatchId",null);p(this,"currentGameState","GAME_CLOSED");p(this,"isDemoMode",!1);p(this,"demoIndex",0);p(this,"livePollTimer",null);p(this,"ocrRoster",null);p(this,"rankDistribution",[]);p(this,"rankAssets",[])}mount(e){var t,s;this.container=e,this.isDemoMode=localStorage.getItem("demoModeEnabled")==="true",this.renderCurrentState(),this.syncStateFromMain(),(s=(t=window.api)==null?void 0:t.onOcrRosterUpdated)==null||s.call(t,a=>{this.ocrRoster=a,this.currentGameState==="GAME_IN_MATCH"&&!this.isLoading&&!this.matchData&&this.renderOcrRosterView(a)})}handleGameStateChanged(e,t){e==="GAME_IN_MATCH"&&t?(this.detectedMatchId=String(t),localStorage.setItem("detectedMatchId",this.detectedMatchId)):e==="GAME_CLOSED"&&(this.detectedMatchId=null,this.ocrRoster=null,localStorage.removeItem("detectedMatchId"));const s=this.currentGameState;this.currentGameState=e,!(!this.container||s===e)&&this.transitionToState(e)}handleDetectedMatch(e){this.handleGameStateChanged("GAME_IN_MATCH",e)}clearDetectedMatchId(){this.handleGameStateChanged("GAME_CLOSED")}async syncStateFromMain(){var e;if((e=window.api)!=null&&e.getGameStatus)try{const t=await window.api.getGameStatus(),s=t.state??(t.inMatch?"GAME_IN_MATCH":t.isRunning?"GAME_MENU":"GAME_CLOSED");if(s===this.currentGameState)return;s==="GAME_IN_MATCH"&&t.matchId&&(this.detectedMatchId=String(t.matchId),localStorage.setItem("detectedMatchId",this.detectedMatchId)),this.currentGameState=s,this.renderCurrentState()}catch{}}renderCurrentState(){this.isDemoMode=localStorage.getItem("demoModeEnabled")==="true",this.isDemoMode||this.currentGameState==="GAME_IN_MATCH"||this.detectedMatchId?(this.renderInitialLoading(),this.loadMatchData()):this.currentGameState==="GAME_MENU"?this.renderMenuView():this.renderClosedView()}async transitionToState(e){this.container&&(this.stopLivePoll(),this.container.style.transition="opacity 0.3s ease",this.container.style.opacity="0",await new Promise(t=>setTimeout(t,300)),this.container&&(this.renderCurrentState(),this.container.style.opacity="1"))}renderClosedView(){this.container&&(this.container.innerHTML=`
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
    `)}renderLivePending(e){if(this.container){if(this.ocrRoster&&(this.ocrRoster.myTeam.length>0||this.ocrRoster.enemyTeam.length>0)){this.renderOcrRosterView(this.ocrRoster);return}this.container.innerHTML=`
      <div class="bg-charcoal-100 min-h-screen h-screen overflow-hidden flex flex-col items-center justify-center text-center px-8">
        <div class="flex items-center gap-2 mb-6">
          <span class="w-2.5 h-2.5 rounded-full bg-frosted-mint-500 animate-pulse"></span>
          <span class="text-frosted-mint-500 text-sm font-medium">Partie détectée — Match ID ${e}</span>
        </div>
        <h1 class="text-2xl font-bold text-white mb-3">Données indisponibles en direct</h1>
        <p class="text-grey-400 text-sm max-w-md mb-6">
          L'API publie les données des joueurs pendant / après la partie, pas en temps réel.
          Ce tableau se remplira automatiquement dès qu'elles seront disponibles.
        </p>
        <p class="text-grey-500 text-xs mb-10">
          ESP actif — ouvrez l'onglet PLAYERS dans le jeu (ESC) pour afficher le roster immédiatement.
        </p>
        <div class="grid grid-cols-4 gap-2 opacity-20 w-full max-w-3xl">
          ${Array(8).fill(0).map(()=>'<div class="bg-charcoal-200 rounded-lg animate-pulse" style="height:90px;"></div>').join("")}
        </div>
      </div>
    `}}renderOcrRosterView(e){if(!this.container)return;const t=(a,r)=>{var h,c;const n=a.heroId!==null?this.heroCache.get(a.heroId):null,l=((h=n==null?void 0:n.images)==null?void 0:h.icon_image_small_webp)??((c=n==null?void 0:n.images)==null?void 0:c.icon_image_small)??null,o=r==="ally"?"border-frosted-mint-500/40":"border-red-500/40",d=Math.round(a.heroScore);return`
        <div class="bg-charcoal-200 rounded-lg border ${o} border p-2 flex items-center gap-2 min-w-0">
          <div class="w-10 h-10 rounded bg-charcoal-300 shrink-0 overflow-hidden flex items-center justify-center text-grey-500 text-xs">
            ${l?`<img src="${l}" alt="${a.heroName}" class="w-full h-full object-cover" />`:`<span>${a.heroName.slice(0,2)}</span>`}
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-white text-sm font-medium truncate">${a.heroName==="unknown_hero"?"???":a.heroName}</div>
            <div class="text-grey-400 text-xs truncate">${a.steamName||"—"}</div>
          </div>
          <span class="text-grey-600 text-xs font-mono shrink-0">${d}%</span>
        </div>`},s=(a,r,n)=>a.length===0?"":`
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-widest ${n==="ally"?"text-frosted-mint-400":"text-red-400"} mb-2 px-1">${r}</h2>
          <div class="space-y-1.5">${a.map(o=>t(o,n)).join("")}</div>
        </div>`;this.container.innerHTML=`
      <div class="bg-charcoal-100 min-h-screen h-screen overflow-hidden flex flex-col p-4">
        <div class="shrink-0 mb-4 flex items-center gap-3 flex-wrap">
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-frosted-mint-500 animate-pulse"></span>
            <span class="text-frosted-mint-500 text-xs font-medium uppercase tracking-wider">ESP Live Scan</span>
          </div>
          <h1 class="text-lg font-bold text-white">Roster détecté</h1>
          <span class="ml-auto text-grey-500 text-xs">Aucune stat — pseudo Steam non résolvable</span>
        </div>
        <div class="flex-1 grid grid-cols-2 gap-4 overflow-auto min-h-0">
          ${s(e.myTeam,"Mon équipe","ally")}
          ${s(e.enemyTeam,"Équipe ennemie","enemy")}
        </div>
        <div class="shrink-0 mt-3 text-center text-grey-600 text-xs">
          Ouvrez l'onglet PLAYERS dans le jeu (ESC) pour rafraîchir · l'API se remplira automatiquement
        </div>
      </div>
    `}async resolveMatchId(){if(this.isDemoMode)return String(Tt[this.demoIndex]);if(this.detectedMatchId)return this.detectedMatchId;const e=localStorage.getItem("detectedMatchId");return e?(this.detectedMatchId=e,e):null}steamId64ToAccountId(e){try{const t=76561197960265728n,s=BigInt(e);if(s<t)return null;const a=Number(s-t);return Number.isSafeInteger(a)?a:null}catch{return null}}async fetchBulkMatchInfo(e){try{const t=`${G}/v1/matches/metadata?match_ids=${e}&include_info=true&include_player_info=true`,s=await fetch(t);if(!s.ok)return null;const a=await s.json(),r=Array.isArray(a)?a[0]:a;return this.normalizeMatchInfo(r)}catch{return null}}async fetchActiveMatchInfo(e){var t,s;try{const a=await((s=(t=window.api)==null?void 0:t.steamGetProfile)==null?void 0:s.call(t));if(!(a!=null&&a.steamId64))return null;const r=this.steamId64ToAccountId(a.steamId64);if(r===null)return null;const n=await fetch(`${G}/v1/matches/active?account_ids=${r}`);if(!n.ok)return null;const l=await n.json();if(!Array.isArray(l)||l.length===0)return null;const o=l.find(d=>String(d.match_id)===String(e)&&Array.isArray(d.players)&&d.players.length)??l.find(d=>Array.isArray(d.players)&&d.players.length);return o?this.normalizeMatchInfo({match_id:Number(e),game_mode:o.game_mode_parsed??o.game_mode,duration_s:o.duration_s,winning_team:o.winning_team,players:o.players.map((d,h)=>({account_id:d.account_id,hero_id:d.hero_id,team:d.team_parsed??d.team,player_slot:h,assigned_lane:d.assigned_lane}))}):null}catch{return null}}normalizeMatchInfo(e){var a;const t=(e==null?void 0:e.match_info)??e;if(!((a=t==null?void 0:t.players)!=null&&a.length))return null;const s=t.players.map((r,n)=>({...r,player_slot:r.player_slot??n,team:this.normalizeTeam(r.team)}));return{...t,match_id:t.match_id,game_mode:t.game_mode,game_mode_label:this.gameModeLabel(t.game_mode),duration_s:t.duration_s,winning_team:this.normalizeTeam(t.winning_team),players:s}}normalizeTeam(e){return e===1||e==="Team1"?1:0}isStreetBrawl(e){return e===4||typeof e=="string"&&/street_?brawl/i.test(e)}gameModeLabel(e){return this.isStreetBrawl(e)?"Street Brawl":e===1||typeof e=="string"&&/normal/i.test(e)?"Normal":""}scheduleLivePoll(){this.stopLivePoll(),this.livePollTimer=setTimeout(()=>{this.livePollTimer=null,this.loadMatchData()},2e4)}stopLivePoll(){this.livePollTimer&&(clearTimeout(this.livePollTimer),this.livePollTimer=null)}async loadMatchData(){var e,t,s,a,r;if(!(this.isLoading||!this.container)){this.isLoading=!0;try{if(!window.api)throw new Error("API not available");const n=await this.resolveMatchId();if(!n){this.renderClosedView();return}this.loadedMatchId=n;const l=!this.isDemoMode&&this.detectedMatchId===n;let o=null;if(l){if(o=await this.fetchActiveMatchInfo(n),o||(o=await this.fetchBulkMatchInfo(n)),!o){this.renderLivePending(n),this.scheduleLivePoll();return}}else if(o=await this.fetchBulkMatchInfo(n),!o){const b=await((t=(e=window.api).getCachedMatch)==null?void 0:t.call(e,n)),f=b?this.normalizeMatchInfo(b):null;if((s=f==null?void 0:f.players)!=null&&s.length){this.matchData={match_id:f.match_id,game_mode:f.game_mode,duration_s:f.duration_s,winning_team:f.winning_team,players:f.players,teams:f.teams??[]},this.renderMatchData(),this.showCacheIndicator();return}throw new Error("Failed to fetch match data and no cache available")}if(!((a=o==null?void 0:o.players)!=null&&a.length))throw new Error("Invalid match data structure");this.stopLivePoll();let d=o.players.map(b=>({...b,lane:b.lane??this.mapLaneNumber(b.assigned_lane)}));const h=d.map(b=>b.account_id).filter(Boolean);await Promise.all([this.fetchRankDistribution(),this.fetchRankAssets()]);const[c,u,g,v]=await Promise.all([this.fetchSteamProfiles(h),this.fetchHeroDataMap(d.map(b=>b.hero_id).filter(Boolean)),this.fetchHeroStats(h),this.fetchPlayerMMR(h)]),m=await this.fetchAllMatchHistories(h);d=d.map(b=>{const f=g.get(`${b.account_id}:${b.hero_id}`),y=v.get(b.account_id),_=m.get(b.account_id)??[],$=Math.floor(Date.now()/1e3),k=(f==null?void 0:f.matches_played)??0,E=(f==null?void 0:f.wins)??0,M=k>0?E/k*100:void 0,A=f&&k>0?f.kills/k:void 0,T=f&&k>0?f.deaths/k:void 0,D=f&&k>0?f.assists/k:void 0,x=y==null?void 0:y.rank,S=x!==void 0?Math.floor(x/10):void 0,w=x!==void 0?x%10:void 0,P=S!==void 0?this.rankAssets.find(W=>W.tier===S):void 0,q=["","I","II","III","IV","V","VI"],j=P&&w!==void 0?`${P.name} ${q[w]??""}`.trim():void 0,B=w!==void 0?`small_subrank${w}_webp`:void 0,ue=P?(B&&P.images[B])??P.images.small_webp??P.images.small??void 0:void 0,pe=x!==void 0?this.computeTopPercent(x):void 0,me=_.filter(W=>W.start_time>=$-Ia),ge=_.filter(W=>W.start_time>=$-Aa),dt=W=>({games:W.length,wins:W.filter(Qt=>Qt.match_result===1).length});return{...b,steamProfile:c.get(b.account_id),heroData:u.get(b.hero_id),heroMatchesPlayed:k,heroWinrate:M,heroAvgKills:A,heroAvgDeaths:T,heroAvgAssists:D,rankBadgeLevel:x,rankName:j,rankImageUrl:ue,rankTopPercent:pe,activity12h:dt(me),activity30d:dt(ge)}}),this.matchData={match_id:o.match_id,game_mode:o.game_mode,duration_s:o.duration_s,winning_team:o.winning_team,players:d,teams:o.teams??[]},!this.isDemoMode&&((r=window.api)!=null&&r.cacheMatch)&&o.match_id&&window.api.cacheMatch(n,this.matchData).catch(()=>{}),this.renderMatchData()}catch(n){console.error("Failed to load match data:",n),this.showError(n instanceof Error?n.message:"Failed to load match data")}finally{this.isLoading=!1}}}async fetchSteamProfiles(e){const t=new Map;if(!e.length)return t;try{const s=await fetch(`${G}/v1/players/steam?account_ids=${e.join(",")}`);if(!s.ok)return t;(await s.json()).forEach(r=>t.set(r.account_id,r))}catch{}return t}async fetchHeroDataMap(e){const t=[...new Set(e)],s=await Promise.all(t.map(r=>this.fetchHeroData(r))),a=new Map;return t.forEach((r,n)=>{s[n]&&a.set(r,s[n])}),a}async fetchHeroData(e){if(this.heroCache.has(e))return this.heroCache.get(e);try{const t=await fetch(`${G}/v1/assets/heroes/${e}`);if(!t.ok)return null;const s=await t.json();return this.heroCache.set(e,s),s}catch{return null}}async fetchHeroStats(e){const t=new Map;if(!e.length)return t;try{const s=await fetch(`${G}/v1/players/hero-stats?account_ids=${e.join(",")}`);if(!s.ok)return t;(await s.json()).forEach(r=>t.set(`${r.account_id}:${r.hero_id}`,r))}catch{}return t}async fetchPlayerMMR(e){const t=new Map;if(!e.length)return t;try{const s=await fetch(`${G}/v1/players/mmr?account_ids=${e.join(",")}`);if(!s.ok)return t;(await s.json()).forEach(r=>{const n=t.get(r.account_id);(!n||r.start_time>n.start_time)&&t.set(r.account_id,r)})}catch{}return t}async fetchRankDistribution(){if(!(this.rankDistribution.length>0))try{const e=await fetch(`${G}/v1/players/mmr/distribution`);if(!e.ok)return;this.rankDistribution=await e.json()}catch{}}async fetchRankAssets(){if(!(this.rankAssets.length>0))try{const e=await fetch(`${G}/v1/assets/ranks`);if(!e.ok)return;this.rankAssets=await e.json()}catch{}}async fetchAllMatchHistories(e){const t=new Map;return(await Promise.all(e.map(async a=>{try{const r=await fetch(`${G}/v1/players/${a}/match-history`),n=r.ok?await r.json():[];return{id:a,entries:n}}catch{return{id:a,entries:[]}}}))).forEach(({id:a,entries:r})=>t.set(a,r)),t}computeTopPercent(e){if(!this.rankDistribution.length)return 50;const t=this.rankDistribution.reduce((a,r)=>a+r.players,0);if(t===0)return 50;const s=this.rankDistribution.filter(a=>a.rank>e).reduce((a,r)=>a+r.players,0);return Math.round(s/t*100)}mapLaneNumber(e){return e===1?"blue":e===4?"yellow":e===6?"green":e!==void 0?{0:"yellow",2:"green"}[e]:void 0}organizePlayersIntoGrid(e){const t={yellow:0,blue:1,green:2},s=r=>(t[r.lane??""]??9)*100+(r.player_slot??0),a=r=>e.filter(n=>n.team===r).sort((n,l)=>s(n)-s(l));return{row0:a(0),row1:a(1)}}renderMatchData(){if(!this.container||!this.matchData)return;const{row0:e,row1:t}=this.organizePlayersIntoGrid(this.matchData.players),s=Math.max(e.length,t.length,1),a=this.isStreetBrawl(this.matchData.game_mode),r=m=>m.lane??"blue",n=m=>{if(!m)return'<div class="bg-[#1a1f24] rounded-lg border border-[#2a2f35] opacity-20"></div>';const b=document.createElement("div");return Sa.mount(b,{player:m,laneColor:r(m),showLane:!a}),b.innerHTML},l=m=>{let b="";for(let f=0;f<s;f++)b+=`<div class="min-h-0">${n(m[f]??null)}</div>`;return b},o=this.matchData.match_id??this.loadedMatchId??"",d=this.matchData.players.length,h=`${e.length}v${t.length} • ${d} joueurs`,c=this.isDemoMode?'<span class="px-2 py-0.5 rounded text-xs font-medium bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">DEMO</span>':"",u=this.gameModeLabel(this.matchData.game_mode),g=u?`<span class="px-2 py-0.5 rounded text-xs font-bold ${a?"bg-amber-400/15 text-amber-400 border border-amber-400/40":"bg-slate-400/10 text-slate-300 border border-slate-400/30"}">${u}</span>`:"",v=`
      <button
        id="refresh-match-btn"
        title="${this.isDemoMode?"Next demo match":"Refresh match data"}"
        class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-charcoal-200 hover:bg-charcoal-300 text-white border border-grey-600 hover:border-frosted-mint-500 transition-colors text-sm"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        ${this.isDemoMode?"Refresh":"Actualiser"}
      </button>`;this.container.innerHTML=`
      <div class="bg-charcoal-100 min-h-screen h-screen overflow-hidden flex flex-col">

        <!-- HEADER (all controls left-aligned; right corner reserved for global status badge) -->
        <div class="flex items-center gap-3 flex-wrap px-4 py-3 shrink-0 border-b border-[#2a2f35]" style="padding-right: 320px;">
          <h1 class="text-lg font-bold text-white">Live Dashboard</h1>
          ${c}
          ${g}
          <!-- Player count derived from real metadata (adapts 12 / 8 / …) -->
          <span class="px-2 py-0.5 rounded text-xs font-medium bg-frosted-mint-500/10 text-frosted-mint-500 border border-frosted-mint-500/30">${h}</span>
          <span class="text-xs text-[#555] font-mono">Match ID: ${o}</span>
          ${v}
        </div>

        <!-- GRID: row 0 = team 0, row 1 = team 1. Columns adapt to team size. -->
        <div class="flex-1 grid gap-x-2 gap-y-2 p-2 overflow-hidden"
             style="grid-template-columns: repeat(${s}, minmax(0, 1fr)); grid-template-rows: repeat(2, minmax(0, 1fr));">
          ${l(e)}
          ${l(t)}
        </div>
      </div>
    `,this.attachEventListeners()}attachEventListeners(){var e;(e=document.getElementById("refresh-match-btn"))==null||e.addEventListener("click",()=>{this.isDemoMode&&(this.demoIndex=(this.demoIndex+1)%Tt.length),this.loadMatchData()})}showError(e){if(!this.container)return;const t=document.createElement("div");t.className="fixed bottom-4 right-4 z-50 bg-red-900/90 border border-red-500/50 rounded-lg p-4 max-w-sm",t.innerHTML=`
      <p class="text-red-400 font-semibold text-sm mb-1">Erreur de chargement</p>
      <p class="text-red-300 text-xs">${e}</p>
    `,this.container.appendChild(t),setTimeout(()=>t.remove(),7e3)}showCacheIndicator(){var t;if(!this.container)return;(t=this.container.querySelector(".cache-indicator"))==null||t.remove();const e=document.createElement("div");e.className="cache-indicator fixed top-16 right-4 z-40 bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-3",e.innerHTML=`
      <p class="text-yellow-400 text-sm font-semibold">Données en cache</p>
      <p class="text-yellow-300 text-xs">L'API est indisponible. Affichage des dernières données.</p>
    `,this.container.appendChild(e),setTimeout(()=>e.parentNode&&e.remove(),5e3)}}class Ca{constructor(){p(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
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
    `)}}const Ce="https://api.deadlock-api.com",N=50,Dt={1:Qe,2:et,3:tt,4:st,5:at,6:rt,7:it,8:nt,9:ot,10:lt,11:ct},La={1:"Initiate",2:"Seeker",3:"Alchemist",4:"Arcanist",5:"Ritualist",6:"Emissary",7:"Archon",8:"Oracle",9:"Phantom",10:"Ascendant",11:"Eternus"},Ea=["","I","II","III","IV","V","VI"],Rt=[{value:"NAmerica",label:"North America"},{value:"Europe",label:"Europe"},{value:"Asia",label:"Asia"},{value:"SAmerica",label:"South America"},{value:"Oceania",label:"Oceania"}],Z=["Salah","TTV/Reimux_xx","Maht","adofan11","dew","FPSL Lomein","eve","DiscoVirtuoso.ttv","wander","read this if noob lol","Teemo","BlazeRunner99","NocturnalX","Phosphophyllite","Jitler (Fraudmaxx?)","Jonny","Caleb","unbound cripple","Twitch/Shieere","Cac2510 TTV","MCCAIN","chunky chips","BigDWH15","The Aura King","Ice","GlitchHunter","StormBringer","PixelKnight","DarkMage","SilverArrow","VoidWalker","CrimsonFang","IronWill","ShadowStep"],jt=[1,2,3,4,5,6,7,8,9,10,11,12];function Ta(i){return Array.from({length:i},(e,t)=>{const s=t%Z.length,a=t>=Z.length?` #${Math.floor(t/Z.length)+1}`:"",r=t<10?6:t<30?5:t<60?4:t<80?3:2,n=t%4===0?0:t%3+1,l=t%jt.length;return{displayRank:t+1,accountName:Z[s]+a,badgeLevel:110+r,accountId:100001+t,topHeroIds:jt.slice(l,l+n),rankTier:11,rankSubtier:r,avatarUrl:""}})}function Da(i){return Array.from({length:i},(e,t)=>{const s=t%Z.length,a=t>=Z.length?` #${Math.floor(t/Z.length)+1}`:"",r=t<10?6:t<30?5:t<60?4:t<80?3:2;return{displayRank:t+1,accountName:Z[s]+a,badgeLevel:110+r,accountId:100001+t,globalRank:t+1+t*3%11,rankTier:11,rankSubtier:r,avatarUrl:""}})}const Ra=Ta(100),ja=Da(100);function Ne(i){const e=Math.floor(i/10),t=i%10,s=La[e]??"Unknown",a=Ea[t]??"";return{tier:e,subtier:t,label:a?`${s} ${a}`:s}}function Ba(i){return i.slice(0,2).toUpperCase()}function Bt(i,e){const t=e.replace(/"/g,"&quot;");return`
    <div class="relative w-7 h-7 rounded-full shrink-0 overflow-hidden border border-charcoal-400">
      <div class="absolute inset-0 bg-charcoal-400 flex items-center justify-center">
        <span class="text-[9px] font-bold text-grey-500 select-none">${Ba(e)}</span>
      </div>
      ${i?`<img src="${i}" alt="${t}"
               class="absolute inset-0 w-full h-full object-cover"
               onerror="this.remove()">`:""}
    </div>`}function Ha(i){return i.map((e,t)=>{const s=e.badge_level??116,{tier:a,subtier:r}=Ne(s);return{displayRank:t+1,accountName:e.account_name??`Player #${t+1}`,badgeLevel:s,accountId:e.possible_account_ids[0]??null,topHeroIds:e.top_hero_ids??[],rankTier:a,rankSubtier:r,avatarUrl:""}})}function Na(i,e){return i.map((t,s)=>{var d;const a=t.badge_level??116,{tier:r,subtier:n}=Ne(a),l=t.possible_account_ids[0]??null,o=l?((d=e.find(h=>h.accountId===l))==null?void 0:d.displayRank)??0:0;return{displayRank:s+1,accountName:t.account_name??`Player #${s+1}`,badgeLevel:a,accountId:l,globalRank:o,rankTier:r,rankSubtier:n,avatarUrl:""}})}class Fa{constructor(){p(this,"container",null);p(this,"activeTab","player");p(this,"selectedRegion","NAmerica");p(this,"selectedHeroId",null);p(this,"playerPage",1);p(this,"heroPage",1);p(this,"heroes",[]);p(this,"heroMap",new Map);p(this,"playerCache",new Map);p(this,"heroLbCache",new Map);p(this,"steamCache",new Map);p(this,"loadingRegions",new Set);p(this,"loadingHeroKeys",new Set);p(this,"heroesLoaded",!1)}mount(e){this.container=e,this.renderShell(),this.init()}async init(){await this.fetchHeroes(),await this.fetchPlayerLeaderboard(this.selectedRegion),this.renderContent()}renderShell(){this.container&&(this.container.innerHTML=`
      <div id="rankings-root" class="min-h-screen bg-charcoal-100">
        <div class="max-w-7xl mx-auto px-6 py-6">

          <!-- Page header -->
          <div class="mb-5">
            <h1 class="text-2xl font-bold text-white tracking-wide">Deadlock Leaderboard</h1>
            <p id="rankings-desc" class="text-grey-600 text-sm mt-1 leading-relaxed max-w-2xl">
              Welcome to the Deadlock elite player rankings! This leaderboard showcases the top
              players based on Deadlock's in-game ranking system. This leaderboard mirrors the
              in-game leaderboard and is updated daily.
            </p>
          </div>

          <!-- Controls bar -->
          <div class="flex flex-wrap items-center justify-between gap-3 mb-5">

            <!-- Tab Switcher -->
            <div class="flex gap-1 bg-charcoal-200 rounded-lg p-1 border border-grey-200">
              <button class="tab-btn px-4 py-1.5 rounded-md text-sm font-medium transition-all
                             duration-150 bg-charcoal-300 text-dry-sage-400"
                      data-tab="player">
                Leaderboard Player
              </button>
              <button class="tab-btn px-4 py-1.5 rounded-md text-sm font-medium transition-all
                             duration-150 text-grey-600 hover:text-white"
                      data-tab="hero">
                Leaderboard Heroes
              </button>
            </div>

            <!-- Region Selector -->
            <div class="flex items-center gap-2">
              <span class="text-grey-500 text-xs uppercase tracking-wider">Region</span>
              <div class="relative">
                <select id="region-select"
                  class="appearance-none bg-charcoal-200 border border-grey-200 text-white text-sm
                         rounded-lg pl-3 pr-8 py-1.5 cursor-pointer focus:outline-none
                         focus:border-dry-sage-400 hover:border-grey-400 transition-colors">
                  ${Rt.map(e=>`
                    <option value="${e.value}" ${e.value===this.selectedRegion?"selected":""}>
                      ${e.label}
                    </option>`).join("")}
                </select>
                <svg class="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-grey-500
                            pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m19 9-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Separator -->
          <div class="h-px bg-gradient-to-r from-dry-sage-400/30 via-charcoal-400
                      to-transparent mb-5"></div>

          <!-- Dynamic content — only this section is re-rendered -->
          <div id="rankings-content">
            ${this.renderSkeletonRows(15)}
          </div>

        </div>
      </div>`,this.wireShellEvents())}wireShellEvents(){if(!this.container)return;this.container.querySelectorAll(".tab-btn").forEach(t=>{t.addEventListener("click",async()=>{const s=t.dataset.tab;if(s!==this.activeTab&&(this.activeTab=s,this.playerPage=1,this.heroPage=1,this.updateTabButtons(),this.updateHeaderDesc(),this.renderContent(),s==="hero"&&this.selectedHeroId!==null)){const a=`${this.selectedRegion}:${this.selectedHeroId}`;this.heroLbCache.has(a)||(await this.fetchHeroLeaderboard(this.selectedRegion,this.selectedHeroId),this.renderContent())}})});const e=this.container.querySelector("#region-select");e==null||e.addEventListener("change",async()=>{this.selectedRegion=e.value,this.playerPage=1,this.heroPage=1,this.updateHeaderDesc(),this.renderContent(),this.activeTab==="player"?await this.fetchPlayerLeaderboard(this.selectedRegion):this.selectedHeroId!==null&&await this.fetchHeroLeaderboard(this.selectedRegion,this.selectedHeroId),this.renderContent()})}updateTabButtons(){this.container&&this.container.querySelectorAll(".tab-btn").forEach(e=>{const t=e.dataset.tab===this.activeTab;e.className=`tab-btn px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${t?"bg-charcoal-300 text-dry-sage-400":"text-grey-600 hover:text-white"}`})}updateHeaderDesc(){var t;const e=(t=this.container)==null?void 0:t.querySelector("#rankings-desc");e&&(this.activeTab==="hero"?e.style.display="none":(e.style.display="",e.textContent="Welcome to the Deadlock elite player rankings! This leaderboard showcases the top players based on Deadlock's in-game ranking system. This leaderboard mirrors the in-game leaderboard and is updated daily."))}renderContent(){var t;const e=(t=this.container)==null?void 0:t.querySelector("#rankings-content");if(e)if(this.activeTab==="player"){const s=this.playerCache.get(this.selectedRegion);if(!s&&this.loadingRegions.has(this.selectedRegion)){e.innerHTML=this.renderSkeletonRows(15);return}const a=s??Ra,r=a.length,n=Math.max(1,Math.ceil(r/N));this.playerPage=Math.min(this.playerPage,n);const l=a.slice((this.playerPage-1)*N,this.playerPage*N);e.innerHTML=this.renderPlayerTable(l,this.playerPage,n,r),this.wireTableLinks(e),this.wirePaginationEvents(e,"player")}else{if(!this.heroesLoaded){e.innerHTML=this.renderSkeletonRows(10);return}const s=`${this.selectedRegion}:${this.selectedHeroId}`,a=this.selectedHeroId!==null?this.heroLbCache.get(s):void 0,n=this.loadingHeroKeys.has(s)&&!a?void 0:a??(this.selectedHeroId!==null?ja:void 0);let l,o=1,d=0;n&&(d=n.length,o=Math.max(1,Math.ceil(d/N)),this.heroPage=Math.min(this.heroPage,o),l=n.slice((this.heroPage-1)*N,this.heroPage*N)),e.innerHTML=this.renderHeroTab(l,this.heroPage,o,d),this.wireHeroTabEvents(e),this.wirePaginationEvents(e,"hero")}}renderPlayerTable(e,t,s,a){const r=(t-1)*N+1,n=Math.min(t*N,a);return`
      <div class="bg-charcoal-200 rounded-xl border border-grey-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-grey-200 text-grey-500 text-xs uppercase tracking-wider">
              <th class="text-left pl-5 pr-3 py-3 w-14">Rank</th>
              <th class="text-left px-3 py-3">Player</th>
              <th class="text-left px-3 py-3">Rank Badge</th>
              <th class="text-left px-3 py-3">Top Heroes</th>
            </tr>
          </thead>
          <tbody>
            ${e.map(l=>this.renderPlayerRow(l)).join("")}
          </tbody>
        </table>
      </div>
      ${this.renderPagination(t,s,a,r,n,"player")}`}renderPlayerRow(e){const{label:t}=Ne(e.badgeLevel),s=Dt[e.rankTier]??"",a=e.displayRank===1?"text-yellow-400 font-bold":e.displayRank===2?"text-grey-500 font-semibold":e.displayRank===3?"text-grey-600 font-semibold":"text-grey-500",r=e.topHeroIds.slice(0,3).map(n=>{var h,c;const l=this.heroMap.get(n),o=((h=l==null?void 0:l.images)==null?void 0:h.icon_image_small_webp)??((c=l==null?void 0:l.images)==null?void 0:c.icon_image_small)??"",d=((l==null?void 0:l.name)??"").replace(/"/g,"&quot;");return o?`<img src="${o}" alt="${d}" title="${d}"
               class="w-7 h-7 rounded-full object-cover border border-charcoal-400"
               onerror="this.remove()">`:`<div class="w-7 h-7 rounded-full bg-charcoal-400 border border-charcoal-500
                       flex items-center justify-center">
             <span class="text-grey-500 text-[9px]">?</span>
           </div>`}).join("");return`
      <tr class="border-b border-charcoal-300 last:border-0
                 hover:bg-charcoal-300/40 transition-colors">
        <td class="pl-5 pr-3 py-2.5">
          <span class="${a} text-sm tabular-nums">${e.displayRank}</span>
        </td>
        <td class="px-3 py-2.5">
          <div class="flex items-center gap-2">
            ${Bt(e.avatarUrl,e.accountName)}
            <a href="#" data-account-id="${e.accountId??""}"
               class="player-link text-white hover:text-dry-sage-400 font-medium
                      truncate max-w-[200px] transition-colors">
              ${e.accountName}
            </a>
          </div>
        </td>
        <td class="px-3 py-2.5">
          <div class="flex items-center gap-2">
            ${s?`<img src="${s}" alt="${t}"
                     class="w-5 h-5 object-contain" onerror="this.remove()">`:""}
            <span class="text-grey-600 text-xs whitespace-nowrap">${t}</span>
          </div>
        </td>
        <td class="px-3 py-2.5">
          <div class="flex items-center gap-1">
            ${r||'<span class="text-grey-500 text-xs">—</span>'}
          </div>
        </td>
      </tr>`}renderHeroTab(e,t,s,a){var o;const r=this.selectedHeroId!==null?this.heroMap.get(this.selectedHeroId):null,n=(r==null?void 0:r.name)??"Hero",l=((o=Rt.find(d=>d.value===this.selectedRegion))==null?void 0:o.label)??this.selectedRegion;return`
      <div class="flex gap-5" style="min-height: 600px;">

        <!-- LEFT: Hero Grid -->
        <div class="shrink-0 w-52 bg-charcoal-200 rounded-xl border border-grey-200
                    flex flex-col overflow-hidden">
          <div class="px-3 py-2 border-b border-grey-200 shrink-0">
            <p class="text-grey-500 text-xs uppercase tracking-wider font-medium">Heroes</p>
          </div>
          <div class="overflow-y-auto flex-1">
            <div class="grid grid-cols-3 gap-0.5 p-1.5">
              ${this.heroes.map(d=>this.renderHeroGridItem(d)).join("")}
            </div>
          </div>
        </div>

        <!-- RIGHT: Leaderboard Panel -->
        <div class="flex-1 min-w-0">
          ${this.selectedHeroId===null?`<div class="flex flex-col items-center justify-center h-64 gap-3">
                 <svg class="w-10 h-10 text-grey-500 opacity-30" fill="none"
                      stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                         d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2
                            0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                 </svg>
                 <p class="text-grey-500 text-sm">Select a hero to view their leaderboard</p>
               </div>`:`<!-- Dynamic hero title + description -->
               <div class="mb-4">
                 <h2 class="text-xl font-bold text-white">${n} Leaderboard</h2>
                 <p class="text-grey-600 text-sm mt-1 leading-relaxed">
                   Explore the top Deadlock ${n} players in ${l}.
                   This hero-specific leaderboard mirrors the in-game rankings and updates daily.
                 </p>
               </div>
               ${e?this.renderHeroTable(e,t,s,a):this.renderSkeletonRows(10)}`}
        </div>
      </div>`}renderHeroGridItem(e){var n,l,o,d;const t=e.id===this.selectedHeroId,s=((n=e.images)==null?void 0:n.icon_hero_card_webp)??((l=e.images)==null?void 0:l.icon_hero_card)??((o=e.images)==null?void 0:o.icon_image_small_webp)??((d=e.images)==null?void 0:d.icon_image_small)??"",a=e.name.replace(/"/g,"&quot;"),r=e.name.slice(0,2);return`
      <button data-hero-id="${e.id}"
        class="hero-grid-btn flex flex-col items-center gap-0.5 p-1 rounded-lg
               transition-all duration-150
               ${t?"bg-dry-sage-200/30 ring-1 ring-dry-sage-400":"hover:bg-charcoal-300"}">
        <!-- Portrait with absolute-layered fallback initials -->
        <div class="relative w-14 h-14 rounded-lg overflow-hidden bg-charcoal-400
                    border ${t?"border-dry-sage-400":"border-charcoal-300"}">
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-grey-500 text-xs select-none">${r}</span>
          </div>
          ${s?`<img src="${s}" alt="${a}"
                   class="absolute inset-0 w-full h-full object-cover"
                   onerror="this.remove()">`:""}
        </div>
        <span class="text-[10px] text-center leading-tight w-full truncate px-0.5
                     ${t?"text-dry-sage-400 font-medium":"text-grey-600"}">
          ${e.name}
        </span>
      </button>`}renderHeroTable(e,t,s,a){const r=(t-1)*N+1,n=Math.min(t*N,a);return`
      <div class="bg-charcoal-200 rounded-xl border border-grey-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-grey-200 text-grey-500 text-xs uppercase tracking-wider">
              <th class="text-left pl-5 pr-3 py-3 w-14">Rank</th>
              <th class="text-left px-3 py-3">Player</th>
              <th class="text-left px-3 py-3">Rank Badge</th>
              <th class="text-left px-3 py-3 w-28">Global Rank</th>
            </tr>
          </thead>
          <tbody>
            ${e.map(l=>this.renderHeroRow(l)).join("")}
          </tbody>
        </table>
      </div>
      ${this.renderPagination(t,s,a,r,n,"hero")}`}renderHeroRow(e){const{label:t}=Ne(e.badgeLevel),s=Dt[e.rankTier]??"";return`
      <tr class="border-b border-charcoal-300 last:border-0
                 hover:bg-charcoal-300/40 transition-colors">
        <td class="pl-5 pr-3 py-2.5">
          <span class="${e.displayRank===1?"text-yellow-400 font-bold":e.displayRank===2?"text-grey-500 font-semibold":e.displayRank===3?"text-grey-600 font-semibold":"text-grey-500"} text-sm tabular-nums">${e.displayRank}</span>
        </td>
        <td class="px-3 py-2.5">
          <div class="flex items-center gap-2">
            ${Bt(e.avatarUrl,e.accountName)}
            <a href="#" data-account-id="${e.accountId??""}"
               class="player-link text-white hover:text-dry-sage-400 font-medium
                      truncate max-w-[180px] transition-colors">
              ${e.accountName}
            </a>
          </div>
        </td>
        <td class="px-3 py-2.5">
          <div class="flex items-center gap-2">
            ${s?`<img src="${s}" alt="${t}"
                     class="w-5 h-5 object-contain" onerror="this.remove()">`:""}
            <span class="text-grey-600 text-xs whitespace-nowrap">${t}</span>
          </div>
        </td>
        <td class="px-3 py-2.5">
          ${e.globalRank>0?`<span class="text-grey-500 tabular-nums">#${e.globalRank}</span>`:'<span class="text-grey-500 text-xs">—</span>'}
        </td>
      </tr>`}renderPagination(e,t,s,a,r,n){if(t<=1)return"";const l=e>1,o=e<t,d="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",h=`${d} bg-charcoal-300 text-white hover:bg-charcoal-400 border border-grey-200`,c=`${d} bg-charcoal-200 text-grey-500 opacity-40 cursor-not-allowed`;return`
      <div class="flex items-center justify-between mt-3 px-1">
        <span class="text-grey-500 text-xs">
          Showing <span class="text-grey-400 font-medium">${a}–${r}</span>
          of <span class="text-grey-400 font-medium">${s}</span> players
        </span>
        <div class="flex items-center gap-2">
          <button data-pag-action="prev" data-pag-type="${n}"
                  class="${l?h:c}" ${l?"":"disabled"}>
            ← Prev
          </button>
          <span class="text-grey-500 text-xs tabular-nums px-1">
            ${e} / ${t}
          </span>
          <button data-pag-action="next" data-pag-type="${n}"
                  class="${o?h:c}" ${o?"":"disabled"}>
            Next →
          </button>
        </div>
      </div>`}wirePaginationEvents(e,t){e.querySelectorAll(`[data-pag-type="${t}"]`).forEach(s=>{s.addEventListener("click",()=>{if(s.disabled)return;const a=s.dataset.pagAction==="prev"?-1:1;t==="player"?this.playerPage+=a:this.heroPage+=a,this.renderContent(),e.scrollIntoView({behavior:"smooth",block:"start"})})})}renderSkeletonRows(e){return`
      <div class="bg-charcoal-200 rounded-xl border border-grey-200 overflow-hidden">
        <div class="flex gap-8 px-5 py-3 border-b border-grey-200">
          ${["w-8","w-20","w-24","w-16"].map(t=>`<div class="h-2.5 ${t} rounded bg-charcoal-300 animate-pulse"></div>`).join("")}
        </div>
        ${Array.from({length:e},()=>`
          <div class="flex items-center gap-4 px-5 py-3 border-b border-charcoal-300
                      last:border-0 animate-pulse">
            <div class="h-4 w-5 rounded bg-charcoal-300 shrink-0"></div>
            <div class="flex items-center gap-2 flex-1">
              <div class="w-7 h-7 rounded-full bg-charcoal-300 shrink-0"></div>
              <div class="h-3 w-32 rounded bg-charcoal-300"></div>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 rounded bg-charcoal-300"></div>
              <div class="h-3 w-20 rounded bg-charcoal-300"></div>
            </div>
            <div class="flex gap-1">
              <div class="w-7 h-7 rounded-full bg-charcoal-300"></div>
              <div class="w-7 h-7 rounded-full bg-charcoal-300"></div>
              <div class="w-7 h-7 rounded-full bg-charcoal-300"></div>
            </div>
          </div>`).join("")}
      </div>`}wireTableLinks(e){e.querySelectorAll(".player-link").forEach(t=>{t.addEventListener("click",s=>{s.preventDefault();const a=parseInt(t.dataset.accountId??"",10);a&&document.dispatchEvent(new CustomEvent("navigate-player",{detail:{accountId:a}}))})})}wireHeroTabEvents(e){e.querySelectorAll(".hero-grid-btn").forEach(t=>{t.addEventListener("click",async()=>{const s=parseInt(t.dataset.heroId??"",10);if(isNaN(s)||s===this.selectedHeroId)return;this.selectedHeroId=s,this.heroPage=1,this.renderContent();const a=`${this.selectedRegion}:${s}`;this.heroLbCache.has(a)||(await this.fetchHeroLeaderboard(this.selectedRegion,s),this.renderContent())})}),this.wireTableLinks(e)}async fetchHeroes(){try{const e=await fetch(`${Ce}/v1/assets/heroes`);if(!e.ok)return;const t=await e.json();this.heroes=t.filter(s=>s.player_selectable!==!1&&!s.disabled&&!s.in_development).sort((s,a)=>s.name.localeCompare(a.name)),this.heroMap=new Map(this.heroes.map(s=>[s.id,s])),this.selectedHeroId===null&&this.heroes.length>0&&(this.selectedHeroId=this.heroes[0].id)}catch{}finally{this.heroesLoaded=!0}}async fetchPlayerLeaderboard(e){if(!(this.playerCache.has(e)||this.loadingRegions.has(e))){this.loadingRegions.add(e);try{const t=await fetch(`${Ce}/v1/leaderboard/${e}`);if(!t.ok)return;const s=await t.json(),a=Ha(s.entries??[]);this.playerCache.set(e,a),await this.enrichAvatars(a.map(r=>({accountId:r.accountId,setUrl:n=>{r.avatarUrl=n}})))}catch{}finally{this.loadingRegions.delete(e)}}}async fetchHeroLeaderboard(e,t){const s=`${e}:${t}`;if(!(this.heroLbCache.has(s)||this.loadingHeroKeys.has(s))){this.loadingHeroKeys.add(s);try{const a=await fetch(`${Ce}/v1/leaderboard/${e}/${t}`);if(!a.ok)return;const r=await a.json(),n=this.playerCache.get(e)??[],l=Na(r.entries??[],n);this.heroLbCache.set(s,l),await this.enrichAvatars(l.map(o=>({accountId:o.accountId,setUrl:d=>{o.avatarUrl=d}})))}catch{}finally{this.loadingHeroKeys.delete(s)}}}async enrichAvatars(e){const t=e.filter(s=>s.accountId!==null&&!this.steamCache.has(s.accountId)).map(s=>s.accountId).slice(0,100);if(t.length>0)try{const s=await fetch(`${Ce}/v1/players/steam?account_ids=${t.join(",")}`);s.ok&&(await s.json()).forEach(r=>this.steamCache.set(r.account_id,r))}catch{}e.forEach(s=>{if(s.accountId!==null){const a=this.steamCache.get(s.accountId);a&&s.setUrl(a.avatarmedium||a.avatar||"")}})}}class Oa{constructor(){p(this,"container",null)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
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
    `)}}const Ua={corner:"center-right",opacity:.25,logPath:"",showSoulsPerMin:!0,showMidBossTimer:!0,showUrnTimer:!0,showItemSuggestions:!0};class qa{constructor(){p(this,"container",null);p(this,"demoModeEnabled",!1);p(this,"steamProfile",null);p(this,"overlaySettings",{...Ua});p(this,"kwinFix",null);p(this,"boundHandleContainerClick",e=>{const t=e.target;t.closest("#steam-connect-btn")?this.handleSteamStartAuth():t.closest("#steam-disconnect-btn")&&this.handleSteamLogout()})}mount(e){this.container=e,this.container.addEventListener("click",this.boundHandleContainerClick),Promise.all([this.loadDemoModeState(),this.loadSteamProfile(),this.loadOverlaySettings(),this.loadKwinFixStatus()]).then(()=>this.render())}refresh(){this.container&&Promise.all([this.loadDemoModeState(),this.loadSteamProfile(),this.loadOverlaySettings(),this.loadKwinFixStatus()]).then(()=>this.render())}async loadSteamProfile(){var e;try{(e=window.api)!=null&&e.steamGetProfile&&(this.steamProfile=await window.api.steamGetProfile())}catch(t){console.error("Failed to load Steam profile:",t)}}async loadOverlaySettings(){var e,t;try{const s=await((t=(e=window.api).getOverlaySettings)==null?void 0:t.call(e));s&&(this.overlaySettings=s)}catch{}}async saveOverlaySettings(){var e,t;try{await((t=(e=window.api).updateOverlaySettings)==null?void 0:t.call(e,this.overlaySettings))}catch{}}async loadKwinFixStatus(){var e,t;try{const s=await((t=(e=window.api).getKwinOverlayFixStatus)==null?void 0:t.call(e));this.kwinFix=s?{applicable:!!s.applicable,installed:!!s.installed}:null}catch{this.kwinFix=null}}async toggleAutoKwinFix(e){var t,s,a,r,n,l;this.overlaySettings.autoKwinFix=e,await this.saveOverlaySettings();try{if(!e)await((s=(t=window.api).removeKwinOverlayFix)==null?void 0:s.call(t));else{const o=await((r=(a=window.api).getGameStatus)==null?void 0:r.call(a));o!=null&&o.isRunning&&await((l=(n=window.api).applyKwinOverlayFix)==null?void 0:l.call(n))}}catch(o){console.error("Toggle auto KWin fix failed:",o)}await this.loadKwinFixStatus(),this.render()}async loadDemoModeState(){try{const e=localStorage.getItem("demoModeEnabled");if(e!==null)this.demoModeEnabled=e==="true";else{const t=localStorage.getItem("mockModeEnabled");t!==null&&(this.demoModeEnabled=t==="true",localStorage.setItem("demoModeEnabled",t),localStorage.removeItem("mockModeEnabled"))}}catch(e){console.error("Failed to load demo mode state:",e)}}async toggleDemoMode(e){try{this.demoModeEnabled=e,localStorage.setItem("demoModeEnabled",e.toString()),this.updateToggleUI()}catch(t){console.error("Failed to toggle demo mode:",t)}}updateToggleUI(){const e=document.getElementById("mock-mode-toggle"),t=document.getElementById("mock-mode-indicator");e&&(e.setAttribute("aria-checked",this.demoModeEnabled.toString()),e.classList.toggle("bg-frosted-mint-500",this.demoModeEnabled),e.classList.toggle("bg-grey-600",!this.demoModeEnabled)),t&&(t.textContent=this.demoModeEnabled?"Actif":"Inactif",t.classList.toggle("text-frosted-mint-500",this.demoModeEnabled),t.classList.toggle("text-grey-400",!this.demoModeEnabled))}render(){var e,t;this.container&&(this.container.innerHTML=`
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
                  Simule une partie en utilisant de vrais Match IDs : 80659633, 84419762, 80457157 (Normal 6v6) et 84553413 (Street Brawl 4v4). Le bouton Refresh dans le Live Dashboard fait défiler cycliquement ces parties.
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
          
          <!-- Overlay In-Game -->
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600">
            <h3 class="text-lg font-semibold text-white mb-1">Overlay In-Game</h3>
            <p class="text-sm text-grey-400 mb-4">
              Apparaît automatiquement quand Deadlock est lancé.
              Requiert <code class="text-frosted-mint-400">-condebug</code> dans les launch options Steam
              et le mode <strong class="text-white">Borderless Windowed</strong> dans le jeu.
            </p>

            <!-- Corner -->
            <div class="mb-4">
              <label class="block text-sm text-grey-300 mb-2">Position</label>
              <div class="grid grid-cols-2 gap-2 w-48">
                ${["center-right","top-right","top-left","bottom-right"].map(s=>`
                  <button
                    data-ov-corner="${s}"
                    class="px-3 py-1.5 rounded text-xs border transition-colors ${this.overlaySettings.corner===s?"border-frosted-mint-500 text-frosted-mint-400 bg-frosted-mint-500/10":"border-grey-600 text-grey-400 hover:border-grey-400"}"
                  >${s.replace("-"," ")}</button>
                `).join("")}
              </div>
            </div>

            <!-- Opacity -->
            <div class="mb-4">
              <label class="block text-sm text-grey-300 mb-2">
                Opacité du fond — <span id="ov-opacity-label">${Math.round(this.overlaySettings.opacity*100)}%</span>
              </label>
              <input
                id="ov-opacity-slider"
                type="range" min="20" max="90" step="5"
                value="${Math.round(this.overlaySettings.opacity*100)}"
                class="w-48 accent-frosted-mint-500"
              />
            </div>

            <!-- Log path -->
            <div class="mb-4">
              <label class="block text-sm text-grey-300 mb-1">Chemin console.log Deadlock</label>
              <p class="text-xs text-grey-500 mb-2">Laissez vide pour l'auto-détection (Linux / Windows).</p>
              <input
                id="ov-log-path"
                type="text"
                value="${this.overlaySettings.logPath}"
                placeholder="Auto-détecté…"
                class="w-full bg-charcoal-300 border border-grey-600 rounded px-3 py-2 text-sm text-white placeholder-grey-600 focus:outline-none focus:border-frosted-mint-500"
              />
            </div>

            <!-- Component toggles -->
            <div class="mb-4">
              <label class="block text-sm text-grey-300 mb-2">Composants affichés</label>
              <div class="flex flex-col gap-2">
                ${[["showSoulsPerMin","Souls / min (placeholder)"],["showMidBossTimer","Mid Boss Timer"],["showUrnTimer","Urn Timer"],["showItemSuggestions","Item Suggestions"]].map(([s,a])=>`
                  <label class="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      data-ov-toggle="${s}"
                      ${this.overlaySettings[s]?"checked":""}
                      class="w-4 h-4 accent-frosted-mint-500 cursor-pointer"
                    />
                    <span class="text-sm text-grey-300">${a}</span>
                  </label>
                `).join("")}
              </div>
            </div>

            ${(t=this.kwinFix)!=null&&t.applicable?(()=>{const s=this.overlaySettings.autoKwinFix!==!1;return`
            <!-- KDE/Wayland keep-above fix (automatic on game launch) -->
            <div class="mb-4 pt-4 border-t border-grey-600">
              <div class="flex items-center justify-between gap-4">
                <div class="flex-1">
                  <label class="block text-sm text-grey-300 mb-1">Correctif KDE / Wayland — automatique</label>
                  <p class="text-xs text-grey-500">
                    Applique automatiquement les règles KWin
                    (<code class="text-frosted-mint-400">keepAbove</code> sur l'overlay +
                    <code class="text-frosted-mint-400">fullscreen=No</code> sur Deadlock) dès que le jeu est
                    lancé, puis les retire à la fermeture — quel que soit le Window Mode. Requiert Borderless/Windowed.
                  </p>
                  <p class="text-xs mt-1 ${this.kwinFix.installed?"text-frosted-mint-500":"text-grey-500"}">
                    ${this.kwinFix.installed?"✓ Règles actives (Deadlock détecté)":s?"En attente — s'appliquera au lancement de Deadlock":"Désactivé"}
                  </p>
                </div>
                <button
                  id="kwin-auto-toggle"
                  role="switch"
                  aria-checked="${s}"
                  aria-label="Correctif KWin automatique"
                  class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-frosted-mint-500 focus:ring-offset-2 focus:ring-offset-charcoal-200 ${s?"bg-frosted-mint-500":"bg-grey-600"}"
                >
                  <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${s?"translate-x-5":"translate-x-0"}"></span>
                </button>
              </div>
            </div>
            `})():""}

            <!-- OS info -->
            <p class="text-xs text-grey-600">
              OS détecté : <span class="text-grey-400">${window.api.platform==="linux"?"Linux (par défaut)":window.api.platform==="win32"?"Windows":window.api.platform??"Inconnu"}</span>
            </p>
          </div>
        </div>
      </div>
    `,this.attachEventListeners())}attachEventListeners(){const e=document.getElementById("mock-mode-toggle");e&&e.addEventListener("click",()=>{this.toggleDemoMode(!this.demoModeEnabled)}),document.querySelectorAll("[data-ov-corner]").forEach(n=>{n.addEventListener("click",()=>{this.overlaySettings.corner=n.dataset.ovCorner,this.saveOverlaySettings(),this.render()})});const t=document.getElementById("ov-opacity-slider"),s=document.getElementById("ov-opacity-label");t==null||t.addEventListener("input",()=>{const n=Number(t.value);s&&(s.textContent=`${n}%`),this.overlaySettings.opacity=n/100,this.saveOverlaySettings()});const a=document.getElementById("ov-log-path");a==null||a.addEventListener("change",()=>{this.overlaySettings.logPath=a.value.trim(),this.saveOverlaySettings()}),document.querySelectorAll("[data-ov-toggle]").forEach(n=>{n.addEventListener("change",()=>{const l=n.dataset.ovToggle;this.overlaySettings[l]=n.checked,this.saveOverlaySettings()})});const r=document.getElementById("kwin-auto-toggle");r==null||r.addEventListener("click",()=>{this.toggleAutoKwinFix(this.overlaySettings.autoKwinFix===!1)})}async handleSteamLogout(){var e;try{(e=window.api)!=null&&e.steamLogout&&await window.api.steamLogout()}catch(t){console.error("Steam logout failed:",t)}}async handleSteamStartAuth(){var e;try{if(!((e=window.api)!=null&&e.steamStartAuth))return;(await window.api.steamStartAuth()).success&&(await this.loadSteamProfile(),this.render(),je.refresh())}catch(t){console.error("Steam auth failed:",t)}}}class Ga{constructor(){p(this,"container",null);p(this,"pollInterval",null);p(this,"tickInterval",null);p(this,"devicesOpen",!1);p(this,"trackFetchedAt",0);p(this,"trackProgressMs",0);p(this,"trackDurationMs",0);p(this,"trackIsPlaying",!1)}mount(e){this.stopAll(),this.container=e,this.init()}stopAll(){this.pollInterval!==null&&(clearInterval(this.pollInterval),this.pollInterval=null),this.tickInterval!==null&&(clearInterval(this.tickInterval),this.tickInterval=null)}async init(){this.renderSkeleton();const e=await window.spotify.getAuthStatus();e.isAuthenticated?(await this.renderPlayer(e.displayName),this.startIntervals()):this.renderLogin()}renderSkeleton(){this.container&&(this.container.innerHTML=`
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
      </button>`).join("")}attachPlayerListeners(e,t){var a,r,n,l,o,d;let s=e;(a=document.getElementById("spotify-logout-btn"))==null||a.addEventListener("click",()=>this.handleLogout()),(r=document.getElementById("spotify-prev"))==null||r.addEventListener("click",async()=>{await window.spotify.previous().catch(()=>null),setTimeout(()=>this.syncTrack(),500)}),(n=document.getElementById("spotify-next"))==null||n.addEventListener("click",async()=>{await window.spotify.next().catch(()=>null),setTimeout(()=>this.syncTrack(),500)}),(l=document.getElementById("spotify-play-pause"))==null||l.addEventListener("click",async()=>{s?(this.trackIsPlaying=!1,await window.spotify.pause().catch(()=>null)):(this.trackIsPlaying=!0,this.trackFetchedAt=Date.now(),await window.spotify.play().catch(()=>null)),s=!s,this.updatePlayPauseBtn(s),setTimeout(()=>this.syncTrack(),500)}),(o=document.getElementById("devices-toggle"))==null||o.addEventListener("click",()=>{var c;this.devicesOpen=!this.devicesOpen,(c=document.getElementById("devices-list"))==null||c.classList.toggle("hidden",!this.devicesOpen);const h=document.getElementById("devices-chevron");h&&(h.style.transform=this.devicesOpen?"rotate(180deg)":"")}),(d=document.getElementById("devices-refresh-btn"))==null||d.addEventListener("click",async()=>{const h=document.getElementById("devices-refresh-btn");h&&(h.style.opacity="0.4");const c=await window.spotify.getDevices().catch(()=>t),u=document.getElementById("devices-list");u&&(u.innerHTML=this.buildDevicesHTML(c)),this.attachDeviceListeners(c);const g=document.getElementById("devices-toggle"),v=c.find(b=>b.is_active),m=g==null?void 0:g.querySelector("span");m&&(m.textContent=v?v.name:"Appareils"),h&&(h.style.opacity="")}),this.attachDeviceListeners(t)}attachDeviceListeners(e){var t;(t=document.getElementById("devices-list"))==null||t.querySelectorAll(".device-item").forEach(s=>{s.addEventListener("click",async()=>{var n;const a=s.dataset.deviceId;await window.spotify.transferDevice(a).catch(()=>null),this.devicesOpen=!1,(n=document.getElementById("devices-list"))==null||n.classList.add("hidden");const r=document.getElementById("devices-chevron");r&&(r.style.transform=""),setTimeout(async()=>{var c;const l=await window.spotify.getDevices().catch(()=>e),o=document.getElementById("devices-list");o&&(o.innerHTML=this.buildDevicesHTML(l)),this.attachDeviceListeners(l);const d=l.find(u=>u.is_active),h=(c=document.getElementById("devices-toggle"))==null?void 0:c.querySelector("span");h&&(h.textContent=d?d.name:"Appareils"),await this.syncTrack()},1200)})})}updatePlayPauseBtn(e){const t=document.getElementById("spotify-play-pause");t&&(t.title=e?"Pause":"Lecture",t.innerHTML=e?'<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>':'<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>')}startIntervals(){this.stopAll(),this.tickInterval=setInterval(()=>this.tick(),1e3),this.pollInterval=setInterval(()=>this.syncTrack(),5e3)}tick(){if(!this.trackIsPlaying||this.trackDurationMs===0)return;const{progressMs:e,pct:t}=this.currentProgress(),s=document.getElementById("spotify-progress-bar");s&&(s.style.width=`${t.toFixed(1)}%`);const a=document.getElementById("spotify-time-current");a&&(a.textContent=this.fmtMs(e)),e>=this.trackDurationMs-1500&&this.syncTrack()}async syncTrack(){var a;const e=await window.spotify.getCurrentlyPlaying().catch(()=>null);this.storeTrackState(e);const t=document.getElementById("spotify-player-card");if(!t)return;if(this.updatePlayPauseBtn(this.trackIsPlaying),(((a=t.querySelector("[title]"))==null?void 0:a.getAttribute("title"))??"")!==((e==null?void 0:e.title)??"")){const{pct:r}=this.currentProgress();t.innerHTML=this.buildTrackHTML(e,r),this.attachPlayerListeners(this.trackIsPlaying,await window.spotify.getDevices().catch(()=>[]))}}async handleLogout(){this.stopAll(),await window.spotify.logout(),this.renderLogin()}showToast(e,t){const s=document.getElementById("spotify-toast");s&&(s.textContent=e,s.className=`mt-4 px-4 py-2 rounded-lg text-sm text-center ${t==="error"?"bg-red-900 text-red-200":"text-black"}`,t==="success"&&(s.style.background="#1DB954"),s.classList.remove("hidden"),setTimeout(()=>s.classList.add("hidden"),5e3))}esc(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}fmtMs(e){const t=Math.floor(e/1e3);return`${Math.floor(t/60)}:${(t%60).toString().padStart(2,"0")}`}}class za{constructor(){p(this,"container",null);p(this,"isLoading",!1)}mount(e){this.container=e,this.render()}render(){this.container&&(this.container.innerHTML=`
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
    `}}class Va{constructor(){p(this,"sidebar");p(this,"currentPage","profil");p(this,"contentContainer",null);p(this,"profilPage",new da);p(this,"gameOverlayPage",new ha);p(this,"leaderboardPage",new ua);p(this,"metaItemsPage",new Xe);p(this,"rankDistributionPage",new va);p(this,"settingsPage",new xa);p(this,"heroLibraryPage",new wa);p(this,"heroDetailsPage",new ka);p(this,"metaBuildsPage",new _a);p(this,"liveDashboardPage",new Pa);p(this,"tacticalAnalysisPage",new Ca);p(this,"rankingsPage",new Fa);p(this,"rankAnalyticsPage",new Oa);p(this,"configurationPage",new qa);p(this,"spotifyWidgetPage",new Ga);p(this,"accueilPage",new za);this.sidebar=new ws(e=>this.handlePageChange(e))}init(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>this.setup()):this.setup()}setup(){var s,a;const e=document.getElementById("app");if(!e){console.error("App container not found");return}e.innerHTML=`
      <div class="flex h-screen bg-charcoal-100">
        <div id="sidebar-container"></div>
        <main id="content" class="flex-1 overflow-y-auto" style="margin-left: 16rem;">
          <!-- Content will be rendered here -->
        </main>
        <div id="game-status-sticky" class="fixed top-4 right-4 z-[70]"></div>
      </div>
    `;const t=document.getElementById("sidebar-container");t&&this.sidebar.mount(t),mt.mount(),(s=window.api)!=null&&s.onSteamProfileUpdated&&window.api.onSteamProfileUpdated(()=>{je.refresh(),this.currentPage==="configuration"&&this.configurationPage.refresh()}),(a=window.api)!=null&&a.onGameStateChanged&&window.api.onGameStateChanged(({state:r,matchId:n})=>{mt.refresh(),this.liveDashboardPage.handleGameStateChanged(r,n),(r==="GAME_IN_MATCH"||r==="GAME_MENU")&&this.currentPage!=="live-dashboard"&&this.sidebar.navigateTo("live-dashboard")}),this.contentContainer=document.getElementById("content"),document.addEventListener("navigate-hero",r=>{const{heroData:n}=r.detail;this.contentContainer&&(this.currentPage="hero-details",this.heroDetailsPage.mountWithHero(this.contentContainer,n))}),document.addEventListener("navigate-to-subpage",r=>{const{page:n}=r.detail;this.contentContainer&&(this.currentPage=n,this.renderPage(n),this.sidebar.navigateTo(n))}),document.addEventListener("navigate-player",r=>{const{accountId:n}=r.detail;this.contentContainer&&n&&(this.currentPage="profil",this.profilPage.mountForPlayer(this.contentContainer,n))}),this.renderPage(this.currentPage)}handlePageChange(e){this.contentContainer&&this.currentPage!==e?this.animatePageOut(()=>{this.currentPage=e,this.renderPage(e)}):(this.currentPage=e,this.renderPage(e))}animatePageOut(e){if(!this.contentContainer){e();return}this.contentContainer.classList.add("page-fade-out"),this.contentContainer.classList.remove("page-fade-in"),setTimeout(()=>{e(),this.contentContainer&&(this.contentContainer.classList.remove("page-fade-out"),this.contentContainer.classList.add("page-fade-in"),setTimeout(()=>{this.contentContainer&&this.contentContainer.classList.remove("page-fade-in")},250))},250)}renderPage(e){if(this.contentContainer)if(this.isMainPage(e))switch(e){case"profil":this.profilPage.mount(this.contentContainer);break;case"hero-stats":this.heroLibraryPage.mount(this.contentContainer);break;case"game-overlay":this.gameOverlayPage.mount(this.contentContainer);break;case"leaderboards":this.leaderboardPage.mount(this.contentContainer);break;case"meta-items":this.metaItemsPage.mount(this.contentContainer);break;case"rank-distribution":this.rankDistributionPage.mount(this.contentContainer);break;case"settings":this.settingsPage.mount(this.contentContainer);break}else if(this.isSubPage(e))switch(e){case"hero-library":this.heroLibraryPage.mount(this.contentContainer);break;case"hero-details":this.heroDetailsPage.mount(this.contentContainer);break;case"meta-builds":this.metaBuildsPage.mount(this.contentContainer);break;case"live-dashboard":this.liveDashboardPage.mount(this.contentContainer);break;case"tactical-analysis":this.tacticalAnalysisPage.mount(this.contentContainer);break;case"rankings":this.rankingsPage.mount(this.contentContainer);break;case"rank-analytics":this.rankAnalyticsPage.mount(this.contentContainer);break;case"configuration":this.configurationPage.mount(this.contentContainer);break;case"spotify-widget":this.spotifyWidgetPage.mount(this.contentContainer);break}else switch(e){case"accueil":this.accueilPage.mount(this.contentContainer);break;default:console.warn(`Unknown page: ${e}`),this.profilPage.mount(this.contentContainer)}}isMainPage(e){return["profil","hero-stats","game-overlay","leaderboards","meta-items","rank-distribution","settings"].includes(e)}isSubPage(e){return["hero-library","hero-details","meta-builds","live-dashboard","tactical-analysis","rankings","rank-analytics","configuration","spotify-widget"].includes(e)}}const Wa=new Va;Wa.init();console.log('👋 Application initialized via "renderer.ts"');
