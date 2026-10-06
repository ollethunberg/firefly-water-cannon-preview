'use strict';
const $ = (s) => document.querySelector(s);
// Decorative UI symbols use vectors, independent of font glyph metrics.
const uiIcons = {"diagonal": "<svg class=\"ui-icon ui-icon-diagonal\" viewBox=\"0 0 16 16\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M3 13 13 3M3 3h10v10\"/></svg>", "down": "<svg class=\"ui-icon ui-icon-down\" viewBox=\"0 0 16 16\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M8 2v12M3 9l5 5 5-5\"/></svg>", "up": "<svg class=\"ui-icon ui-icon-up\" viewBox=\"0 0 16 16\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M8 14V2M3 7l5-5 5 5\"/></svg>", "play": "<svg class=\"ui-icon ui-icon-play\" viewBox=\"0 0 16 16\" aria-hidden=\"true\" focusable=\"false\"><path d=\"m5 3 8 5-8 5Z\"/></svg>", "pause": "<svg class=\"ui-icon ui-icon-pause\" viewBox=\"0 0 16 16\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M5 3v10M11 3v10\"/></svg>"};
const menu = $('.menu-toggle'), navigation=$('#navigation');
function toggleMenu(open){menu.setAttribute('aria-expanded',String(open));navigation.classList.toggle('open',open);document.body.classList.toggle('site-menu-open',open);if(open){navigation.setAttribute('role','dialog');navigation.setAttribute('aria-modal','true');$('.menu-close').focus();}else{navigation.removeAttribute('role');navigation.removeAttribute('aria-modal');menu.focus();}}
menu.addEventListener('click',()=>toggleMenu(menu.getAttribute('aria-expanded')!=='true'));
$('.menu-close').addEventListener('click',()=>toggleMenu(false));
navigation.addEventListener('click',e=>{if(e.target.closest('a')&&navigation.classList.contains('open'))toggleMenu(false);});
document.addEventListener('keydown',e=>{if(!navigation.classList.contains('open'))return;if(e.key==='Escape'){e.preventDefault();toggleMenu(false);}if(e.key==='Tab'){const items=[...navigation.querySelectorAll('a,button,summary')].filter(el=>el.getClientRects().length);const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
const siteHeader=$('.site-header');
function updateMenuLayout(){
  // Measure the full menu even while compact, using the current font and spacing.
  const sample=siteHeader.cloneNode(true);
  sample.classList.remove('is-compact');
  sample.setAttribute('aria-hidden','true');sample.inert=true;
  sample.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
  sample.style.cssText='position:fixed;top:0;left:0;visibility:hidden;pointer-events:none;overflow:hidden;width:'+siteHeader.clientWidth+'px';
  sample.querySelector('nav').classList.remove('open');
  sample.querySelector('.campaign-links').style.cssText='width:max-content;justify-content:flex-start';
  document.body.append(sample);
  const width=selector=>sample.querySelector(selector).getBoundingClientRect().width;
  const style=getComputedStyle(sample);
  const required=width('.brand img')+width('.campaign-links')+width('.nav-contact')+width('.site-language')+parseFloat(style.paddingLeft)+parseFloat(style.paddingRight)+parseFloat(style.columnGap)+40;
  const compact=siteHeader.clientWidth<Math.ceil(required);
  sample.remove();
  if(!compact&&navigation.classList.contains('open'))toggleMenu(false);
  siteHeader.classList.toggle('is-compact',compact);
}
new ResizeObserver(updateMenuLayout).observe(siteHeader);
document.fonts.ready.then(updateMenuLayout);
updateMenuLayout();
navigation.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)navigation.querySelectorAll('details').forEach(other=>{if(other!==d)other.open=false;});}));
const steps=[['MONITOR','ZONES MONITORED','Flame detectors continuously monitor the defined protection zones.'],['DETECT & AIM','FIRE DETECTED / TARGET ACQUIRED','Detection triggers an alarm and directs the cannon towards the affected zone.'],['SUPPRESS','AUTOMATIC SUPPRESSION','The valve opens and water is released. After suppression, the system returns to its park position.']];
const stageImages=[
  {file:'site.webp',alt:'Water cannon monitoring an outdoor recycling storage area'},
  {file:'stage-02-smoke.jpg',alt:'Illustrative edit showing smoke rising from material in the protected storage bay'},
  {file:'stage-03-water.jpg',alt:'Illustrative edit showing the water cannon spraying towards the affected storage bay'}
];
stageImages.slice(1).forEach(stage=>{const image=new Image();image.src='assets/'+stage.file;});
function setStep(i){document.querySelectorAll('[data-step]').forEach(b=>{let on=Number(b.dataset.step)===i;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;});$('.scene').dataset.state=i;$('#step-image').src='assets/'+stageImages[i].file;$('#step-image').alt=stageImages[i].alt;$('#step-panel').setAttribute('aria-labelledby','step-'+i);$('#status-text').textContent=steps[i][1];$('#step-number').textContent='0'+(i+1)+' / '+steps[i][0];$('#step-text').textContent=steps[i][2];}
document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{setStep(Number(b.dataset.step));keepManualChoice('response',Number(b.dataset.step));}));
function keyboardTabs(selector,select){const tabs=[...document.querySelectorAll(selector)];tabs.forEach((b,i)=>b.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight'||e.key==='ArrowDown')n=(i+1)%tabs.length;if(e.key==='ArrowLeft'||e.key==='ArrowUp')n=(i+tabs.length-1)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==undefined){e.preventDefault();select(tabs[n]);tabs[n].focus();}}));}
keyboardTabs('[data-step]',b=>{setStep(Number(b.dataset.step));keepManualChoice('response',Number(b.dataset.step));});
const models={dn50:{label:'DN50 / 2 INCH',range:'30',flow:'925',weight:'19 kg'},dn80:{label:'DN80 / 3 INCH',range:'45',flow:'3,250',weight:'30 kg'}};
function setModel(key){const m=models[key];document.querySelectorAll('[data-model]').forEach(b=>{const on=b.dataset.model===key;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;});$('#model-panel').setAttribute('aria-labelledby',key+'-tab');$('#model-heading').textContent=m.label;$('#range').replaceChildren(document.createTextNode(m.range),Object.assign(document.createElement('span'),{textContent:'m'}));$('#flow').textContent=m.flow;$('#weight').textContent=m.weight;$('#model-image').src='assets/'+key+'.webp';$('#model-image').alt='Firefly '+key.toUpperCase()+' water cannon';}
document.querySelectorAll('[data-model]').forEach(b=>b.addEventListener('click',()=>setModel(b.dataset.model)));keyboardTabs('[data-model]',b=>setModel(b.dataset.model));
const films={overview:{title:'Automated Water Cannon — overview',file:'overview.mp4'},product:{title:'Automated Water Cannon — product film',file:'product.mp4'},detection:{title:'Detection & suppression',file:'detection.mp4'},'field-01':{title:'Water Cannon — field footage 01',file:'field-01.mp4'},'field-02':{title:'Water Cannon — field footage 02',file:'field-02.mp4'}};
const resources=[...Object.entries(films).map(([id,v])=>({id,title:v.title,type:'video'})),{id:'brochure',title:'Automated Water Cannon — product brochure',type:'document'}];
$('#resource-grid').innerHTML=resources.map(r=>r.type==='video'?`<article class="resource-card" data-type="video"><button class="resource-cover" data-video="${r.id}" aria-label="Play ${r.title}"><img src="assets/${r.id}-poster.jpg" alt="" loading="lazy"><span class="play"><span>${uiIcons.play}</span></span></button><div class="resource-body"><div class="resource-meta"><span>VIDEO / MP4</span><span>EN</span></div><h3>${r.title}</h3><button class="text-button" data-video="${r.id}">Watch film ${uiIcons.diagonal}</button></div></article>`:`<article class="resource-card" data-type="document"><a class="doc-cover" href="assets/water-cannon-brochure.pdf" target="_blank" rel="noopener" aria-label="Open Water Cannon product brochure PDF"><div class="paper"><span>Firefly<br>Automated<br>Water Cannon</span><img src="assets/dn50.webp" alt=""><span>PRODUCT BROCHURE</span></div><span>PRODUCT<br>SPECIFICATIONS<br>${uiIcons.down}</span></a><div class="resource-body"><div class="resource-meta"><span>BROCHURE / PDF</span><span>EN · V1.0</span></div><h3>${r.title}</h3><a class="text-button" href="assets/water-cannon-brochure.pdf" download>Download brochure ${uiIcons.down}</a></div></article>`).join('');
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{const f=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(t=>t.setAttribute('aria-pressed',String(t===b)));let n=0;document.querySelectorAll('.resource-card').forEach(c=>{c.hidden=f!=='all'&&c.dataset.type!==f;if(!c.hidden)n++;});$('#resource-count').textContent='Showing '+n+' material'+(n!==1?'s':'');}));
const dialog=$('#video-dialog'),player=$('#video-player');let opener;
document.addEventListener('click',e=>{const b=e.target.closest('[data-video]');if(!b)return;opener=b;const v=films[b.dataset.video];$('#video-title').textContent=v.title;player.src='assets/'+v.file;player.poster='assets/'+b.dataset.video+'-poster.jpg';$('#video-error').hidden=true;$('#video-fallback').href=player.src;dialog.showModal();player.play().catch(()=>{});});
$('#close-video').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});dialog.addEventListener('close',()=>{player.pause();player.removeAttribute('src');player.load();opener?.focus();});player.addEventListener('error',()=>{if(player.getAttribute('src'))$('#video-error').hidden=false;});
$('#contact-form').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.target);const result=$('#form-result');result.hidden=false;result.textContent=`Enquiry preview — nothing has been sent.\n\n${d.get('name')} · ${d.get('company')}\n${d.get('email')}\n\n${d.get('message')}`;});

// Cinematic landing excerpt, with explicit pause and reduced-motion support.
const heroVideo = document.querySelector('#hero-video');
const heroPlay = document.querySelector('#hero-play');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function updateHeroControl(){heroPlay.innerHTML=heroVideo.paused?uiIcons.play:uiIcons.pause;heroPlay.setAttribute('aria-label',heroVideo.paused?'Play hero film':'Pause hero film');}
heroVideo.addEventListener('play',updateHeroControl);heroVideo.addEventListener('pause',updateHeroControl);
heroPlay.addEventListener('click',()=>{if(heroVideo.paused)heroVideo.play().catch(updateHeroControl);else heroVideo.pause();});
function applyMotionPreference(){if(reducedMotion.matches){heroVideo.removeAttribute('autoplay');heroVideo.pause();}else{heroVideo.play().catch(updateHeroControl);}updateHeroControl();}
reducedMotion.addEventListener('change',applyMotionPreference);applyMotionPreference();

const applicationVideo=$('#application-video'),applicationImage=$('#application-image'),applicationPlay=$('#application-play');
const applicationViews={
 'field-01':{kind:'FIELD FOOTAGE',title:'Automatic protection for open storage.',description:'Flame detectors monitor open storage areas and automatically direct the water cannon towards the affected zone when a fire is detected.'},
 'field-02':{file:'targeted-water',kind:'SUPPLIED FIRE-TEST FOOTAGE',title:'Targeted suppression. High-flow water.',description:'High-flow water is aimed at the detected fire, concentrating suppression where it is needed.'},
 hall:{kind:'APPLICATION ILLUSTRATION',title:'Zone-based protection for storage bays.',description:'Flame detectors continuously monitor each protection zone. When a fire is detected, the cannon targets the affected bay and starts suppression automatically.'}
};
function updateApplicationControl(){applicationPlay.innerHTML=applicationVideo.paused?uiIcons.play:uiIcons.pause;applicationPlay.setAttribute('aria-label',applicationVideo.paused?'Play application film':'Pause application film');}
applicationVideo.addEventListener('play',updateApplicationControl);applicationVideo.addEventListener('pause',updateApplicationControl);
applicationPlay.addEventListener('click',()=>{if(applicationVideo.paused)applicationVideo.play().catch(updateApplicationControl);else applicationVideo.pause();});
function setApplication(key){const view=applicationViews[key];document.querySelectorAll('[data-application]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.application===key)));$('#application-kind').textContent=view.kind;$('#application-title').textContent=view.title;$('#application-description').textContent=view.description;const still=key==='hall';applicationVideo.pause();applicationVideo.hidden=still;applicationImage.hidden=!still;$('#application-illustration-label').hidden=!still;applicationPlay.hidden=still;if(!still){applicationVideo.src='assets/'+(view.file||key)+'.mp4';applicationVideo.poster='assets/'+(view.file||key)+'-poster.jpg';if(!reducedMotion.matches)applicationVideo.play().catch(updateApplicationControl);}updateApplicationControl();}
document.querySelectorAll('[data-application]').forEach((button,i)=>button.addEventListener('click',()=>{setApplication(button.dataset.application);keepManualChoice('applications',i);}));
if(reducedMotion.matches)applicationVideo.pause();reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)applicationVideo.pause();});
const languageMenu=document.querySelector('.site-language');
document.addEventListener('click',e=>{if(!languageMenu.contains(e.target))languageMenu.open=false;});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&languageMenu.open){languageMenu.open=false;languageMenu.querySelector('summary').focus();}});


// Highlight the current content within the original, unmodified page layout.
const scrollViews=[
  {id:'applications',element:$('.application-media'),apply:i=>setApplication(['field-01','field-02','hall'][i]),last:null,manual:false},
  {id:'response',element:$('.scene'),apply:setStep,last:null,manual:false}
];
const sectionLinks=[...navigation.querySelectorAll('a[href^="#"]')];
const trackedSections=[...document.querySelectorAll('main>section')];
let highlightPending=false;
function keepManualChoice(id,index){
  const view=scrollViews.find(v=>v.id===id);
  view.manual=true;view.last=index;
}
function updateScrollHighlights(){
  highlightPending=false;
  const headerHeight=siteHeader.getBoundingClientRect().height;
  const readingLine=headerHeight+(innerHeight-headerHeight)*.5;
  scrollViews.forEach(view=>{
    const rect=view.element.getBoundingClientRect();
    if(rect.bottom<=headerHeight||rect.top>=innerHeight){view.manual=false;view.last=null;return;}
    // An explicit selection stays selected until this media leaves the viewport.
    if(view.manual)return;
    const progress=Math.max(0,Math.min(.999,(readingLine-rect.top)/rect.height));
    const index=Math.floor(progress*3);
    if(view.last!==index){view.last=index;view.apply(index);}
  });
  const marker=headerHeight+Math.min(160,innerHeight*.2);
  let current=trackedSections[0];
  trackedSections.forEach(section=>{if(section.getBoundingClientRect().top<=marker)current=section;});
  sectionLinks.forEach(link=>{if(link.hash==='#'+current.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
}
function queueHighlights(){if(!highlightPending){highlightPending=true;requestAnimationFrame(updateScrollHighlights);}}
addEventListener('scroll',queueHighlights,{passive:true});
addEventListener('resize',queueHighlights);
document.fonts.ready.then(queueHighlights);
queueHighlights();
