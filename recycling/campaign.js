(()=>{'use strict';
const $=s=>document.querySelector(s),header=$('.site-header'),nav=$('#navigation'),menu=$('.menu-toggle'),isWaterCannon=document.body.dataset.page==='water-cannon';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const hero=$('#recycling-hero-video'),heroControl=$('#recycling-hero-play');
if(hero){
 const heroSection=$('.recycling-hero');let userPaused=false,userStarted=false;
 hero.muted=true;hero.defaultMuted=true;hero.playsInline=true;
 const playIcon='<svg class="ui-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="m5 3 8 5-8 5Z"/></svg>',pauseIcon='<svg class="ui-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3v10M11 3v10"/></svg>';
 function update(){heroControl.innerHTML=hero.paused?playIcon:pauseIcon;heroControl.setAttribute('aria-label',(hero.paused?'Play':'Pause')+' hero film');}
 function sync(){const r=heroSection.getBoundingClientRect();const visible=r.bottom>0&&r.top<innerHeight;if(!visible||document.hidden||document.querySelector('dialog[open]')||userPaused||(reduced.matches&&!userStarted)){if(!visible)userStarted=false;if(!hero.paused)hero.pause();return;}if(hero.paused)hero.play().catch(update);}
 heroControl.addEventListener('click',()=>{if(hero.paused){userPaused=false;userStarted=true;sync();}else{userPaused=true;userStarted=false;hero.pause();}});
 ['play','pause','error'].forEach(event=>hero.addEventListener(event,update));hero.addEventListener('pause',sync);
 ['loadedmetadata','loadeddata','canplay'].forEach(event=>hero.addEventListener(event,sync));
 new IntersectionObserver(sync,{threshold:0}).observe(heroSection);
 document.addEventListener('visibilitychange',sync);document.addEventListener('campaign:dialogchange',sync);addEventListener('pageshow',sync);document.addEventListener('pointerup',sync,{passive:true});reduced.addEventListener('change',sync);update();sync();
}
// The copied Water Cannon retains its own tested menu and media controller.
if(!isWaterCannon){
 const close=$('.menu-close');
 function toggle(open){menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);document.body.classList.toggle('site-menu-open',open);if(open){nav.setAttribute('role','dialog');nav.setAttribute('aria-modal','true');close.focus();}else{nav.removeAttribute('role');nav.removeAttribute('aria-modal');menu.focus();}}
 menu.addEventListener('click',()=>toggle(menu.getAttribute('aria-expanded')!=='true'));close.addEventListener('click',()=>toggle(false));
 nav.addEventListener('click',e=>{if(e.target.closest('a')&&nav.classList.contains('open'))toggle(false);});
 document.addEventListener('keydown',e=>{if(!nav.classList.contains('open'))return;if(e.key==='Escape')toggle(false);if(e.key==='Tab'){const items=[...nav.querySelectorAll('a,button')].filter(el=>el.getClientRects().length);const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 function layout(){const sample=header.cloneNode(true);sample.classList.remove('is-compact');sample.inert=true;sample.setAttribute('aria-hidden','true');sample.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));sample.querySelector('nav').classList.remove('open');sample.style.cssText='position:fixed;top:0;left:0;visibility:hidden;pointer-events:none;width:'+header.clientWidth+'px';sample.querySelector('.campaign-links').style.cssText='width:max-content;justify-content:flex-start';document.body.append(sample);const width=s=>sample.querySelector(s).getBoundingClientRect().width,style=getComputedStyle(sample);const required=width('.brand img')+width('.campaign-links')+width('.nav-contact')+width('.site-language')+parseFloat(style.paddingLeft)+parseFloat(style.paddingRight)+parseFloat(style.columnGap)+40;sample.remove();const compact=header.clientWidth<Math.ceil(required);if(!compact&&nav.classList.contains('open'))toggle(false);header.classList.toggle('is-compact',compact);document.documentElement.style.setProperty('--header-height',header.getBoundingClientRect().height+'px');}
 new ResizeObserver(layout).observe(header);document.fonts.ready.then(layout);layout();
 let pending=false;function highlight(){pending=false;if(document.body.dataset.page==='overview')header.classList.toggle('has-scrolled',scrollY>24);const line=header.getBoundingClientRect().height+Math.min(160,innerHeight*.2);let current;document.querySelectorAll('main section[id]').forEach(section=>{if(section.getBoundingClientRect().top<=line)current=section;});nav.querySelectorAll('a[href^="#"]').forEach(a=>{if(current&&a.hash==='#'+(['prediction','prevention','protection'].includes(current.id)?'solutions':current.id))a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});document.querySelectorAll('.solution-card').forEach(card=>{const r=card.getBoundingClientRect();card.classList.toggle('is-highlighted',r.top<innerHeight*.7&&r.bottom>innerHeight*.4);});}function queue(){if(!pending){pending=true;requestAnimationFrame(highlight);}}addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);queue();
 document.querySelectorAll('.solution-track').forEach(track=>track.addEventListener('keydown',e=>{if(e.target!==track)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();track.scrollBy({left:(e.key==='ArrowRight'?1:-1)*track.clientWidth*.9,behavior:reduced.matches?'instant':'smooth'});}}));
}
const message=$('#prototype-message');let messageTimer;
function toast(text){message.textContent=text;message.hidden=false;clearTimeout(messageTimer);messageTimer=setTimeout(()=>message.hidden=true,6000);}
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>{toast('Language preview — this campaign is currently available in English. Translations will be added for launch.');const lang=button.closest('details');lang.open=false;lang.querySelector('summary').focus();}));
const language=$('.site-language');document.addEventListener('click',e=>{if(language&&!language.contains(e.target))language.open=false;});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&language?.open){language.open=false;language.querySelector('summary').focus();}});
document.querySelectorAll('[data-resource-filter]').forEach(button=>button.addEventListener('click',()=>{const filter=button.dataset.resourceFilter;document.querySelectorAll('[data-resource-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let count=0;document.querySelectorAll('.material-card').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.kind!==filter;if(!card.hidden)count++;});$('.resource-count').textContent='Showing '+count+' material'+(count===1?'':'s');}));
$('#campaign-contact')?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.target),result=$('#enquiry-result');result.textContent='Enquiry preview — nothing has been sent.\n\n'+d.get('name')+' · '+d.get('company')+'\n'+d.get('email')+'\n\n'+d.get('message');result.hidden=false;});
// A play symbol opens the film directly. Media is fetched only after that choice.
const filmDialog=$('#campaign-video-dialog'),filmPlayer=$('#campaign-video-player');
if(filmDialog&&filmPlayer){
 let filmOpener;
 function motionChange(){document.dispatchEvent(new Event('campaign:dialogchange'));}
 document.addEventListener('click',e=>{
  const button=e.target.closest('[data-resource-video]');if(!button)return;
  filmOpener=button;$('#campaign-video-error').hidden=true;
  filmPlayer.src='assets/overview.mp4';filmPlayer.muted=true;filmPlayer.playsInline=true;
  filmDialog.showModal();$('#campaign-close-video').focus();motionChange();
  filmPlayer.play().catch(()=>{});
 });
 $('#campaign-close-video').addEventListener('click',()=>filmDialog.close());
 filmDialog.addEventListener('click',e=>{if(e.target!==filmDialog)return;const r=filmDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)filmDialog.close();});
 filmDialog.addEventListener('close',()=>{filmPlayer.pause();filmPlayer.removeAttribute('src');filmPlayer.load();filmOpener?.focus();motionChange();});
 filmPlayer.addEventListener('error',()=>{if(filmPlayer.getAttribute('src'))$('#campaign-video-error').hidden=false;});
}
// A broken image remains understandable and does not show an empty media area.
document.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{if(!img.alt)return;const text=document.createElement('span');text.className='media-fallback';text.textContent=img.alt;img.replaceWith(text);},{once:true}));
})();
