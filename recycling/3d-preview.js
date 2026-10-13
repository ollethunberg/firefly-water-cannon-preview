(()=>{'use strict';
const viewer=document.querySelector('model-viewer'),status=document.querySelector('#model-status'),title=document.querySelector('#model-title'),rotate=document.querySelector('#rotate-model');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let selected='water-cannon',finish='steel',rotating=false;
const models={'water-cannon':{title:'Automated Water Cannon',src:'assets/models/water-cannon.glb',alt:'Interactive preview of the supplied Water Cannon geometry',poster:'assets/dn50.webp'},'flame-detector':{title:'Flame Detector',src:'assets/models/flame-detector.glb',alt:'Interactive preview of the supplied flame detector geometry',poster:'assets/models/flame-placeholder.svg'}};
function applyFinish(){if(!viewer.model)return;viewer.model.materials.forEach(material=>{const p=material.pbrMetallicRoughness;p.setMetallicFactor(finish==='steel'?.72:0);p.setRoughnessFactor(finish==='steel'?.27:.75);p.setBaseColorFactor(finish==='steel'?[.53,.57,.63,1]:[.66,.67,.68,1]);});}
function setRotation(value){rotating=value;viewer.autoRotate=value;rotate.setAttribute('aria-pressed',String(value));rotate.textContent=value?'Stop rotation':'Rotate automatically';}
function reset(){viewer.cameraOrbit='35deg 68deg auto';viewer.cameraTarget='auto auto auto';viewer.fieldOfView='30deg';if(typeof viewer.resetTurntableRotation==='function')viewer.resetTurntableRotation();if(reduced.matches&&typeof viewer.jumpCameraToGoal==='function')viewer.jumpCameraToGoal();}
function chooseModel(key){selected=key;const model=models[key];document.querySelectorAll('[data-model-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.modelChoice===key)));status.hidden=false;status.classList.remove('failed');status.textContent='Loading 3D model…';title.textContent=model.title;viewer.alt=model.alt;viewer.poster=model.poster;viewer.src=model.src;setRotation(false);reset();}
document.querySelectorAll('[data-model-choice]').forEach(button=>button.addEventListener('click',()=>{if(button.dataset.modelChoice!==selected)chooseModel(button.dataset.modelChoice);}));
document.querySelectorAll('[data-finish]').forEach(button=>button.addEventListener('click',()=>{finish=button.dataset.finish;document.querySelectorAll('[data-finish]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));applyFinish();}));
document.querySelector('#reset-model').addEventListener('click',()=>{setRotation(false);reset();});rotate.addEventListener('click',()=>setRotation(!rotating));
viewer.addEventListener('load',()=>{status.hidden=true;applyFinish();reset();});viewer.addEventListener('error',()=>{status.hidden=false;status.classList.add('failed');status.textContent='3D could not be loaded. You can still explore the product images and films.';});
reduced.addEventListener('change',()=>{if(reduced.matches)setRotation(false);});document.addEventListener('visibilitychange',()=>{if(document.hidden)setRotation(false);});
function unavailable(){status.hidden=false;status.textContent='3D is unavailable in this browser. Use the product preview instead.';status.classList.add('failed');}
document.querySelector('script[src*="model-viewer.min.js"]').addEventListener('error',unavailable);
const definitionTimeout=setTimeout(()=>{if(!customElements.get('model-viewer'))unavailable();},20000);
customElements.whenDefined('model-viewer').then(()=>{clearTimeout(definitionTimeout);chooseModel(selected);}).catch(unavailable);
})();
