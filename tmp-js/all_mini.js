const D=window.__deep=(r=document,a=[])=>{r.querySelectorAll('*').forEach(e=>{a.push(e);if(e.shadowRoot)D(e.shadowRoot,a)});return a};
const B='https://raw.githubusercontent.com/yannickserrano24/xandine-medias/fa3ee9274d72a0438420775802dc1c70fcafe3b8/ytloc/';
if(!window.__CD){const j=await(await fetch(B+'spotify-cta.json')).json();window.__CTA=j.cta;window.__CNAMES=j.names;window.__CD=1;const v=await(await fetch(B+'spotify-videos.json')).json();window.__VIDS=v.videos;window.__AR=v.artist;}
window.__o=id=>{const v=window.__VIDS.find(x=>x.id===id);return {id,T:v.song,TR:v.track,AR:window.__AR,orig:v.orig};};
window.__ctaApply=(d,c,o)=>{d=(d||'').replace(/\r/g,'');if(d.includes(o.AR)&&(!o.TR||d.includes(o.TR)))return null;let L=d.split('\n');while(L.length&&/open\.spotify\.com\/(artist|track)\//.test(L[0]))L.shift();while(L.length&&!L[0].trim())L.shift();const t=window.__CTA[c];return (o.TR?t[0].replace('{T}',o.T).replace('{TR}',o.TR)+'\n':'')+t[1].replace('{AR}',o.AR)+'\n\n'+L.join('\n');};
const sl=ms=>new Promise(r=>setTimeout(r,ms));const W=async(f,ms=15000)=>{const t=Date.now();while(Date.now()-t<ms){const v=f();if(v)return v;await sl(300)}return null};const vis=e=>e&&e.offsetParent!==null;const shown=e=>{if(!e)return false;const q=e.getBoundingClientRect();return q.width>0&&q.height>0};
const auth=()=>D().some(e=>vis(e)&&e.tagName==='YTCP-AUTH-CONFIRMATION-DIALOG');
const setBox=async(tb,x)=>{tb.focus();document.execCommand('selectAll',false,null);document.execCommand('insertText',false,x);tb.dispatchEvent(new Event('input',{bubbles:true}));await sl(400);return tb.innerText||''};
window.__ctaDetails=async(id)=>{const o=window.__o(id);if(!location.pathname.includes('/video/'+id+'/edit'))return 'mauvaise page';const ed=await W(()=>document.querySelector('ytcp-video-metadata-editor'),20000);if(!ed)return 'pas d editeur';await sl(1500);const h=D(ed).find(e=>e.id==='description-textarea');const tb=h&&D(h).find(e=>e.id==='textbox');if(!tb)return 'pas de description';const n=window.__ctaApply(tb.innerText||'',o.orig,o);if(n===null)return 'deja';if(n.length>5000)return 'trop long '+n.length;const g=await setBox(tb,n);if(!g.includes(o.AR))return 'saisie ratee';await sl(600);const sv=D().find(e=>e.tagName==='YTCP-BUTTON'&&e.id==='save');if(!sv)return 'pas de bouton';sv.click();for(let i=0;i<40;i++){await sl(500);if(auth())return 'AUTH';if(sv.hasAttribute('disabled'))return 'ok '+n.length}return 'save ?'};
const rows=()=>D().filter(e=>e.tagName==='YTGN-VIDEO-TRANSLATION-ROW').map(r=>{const b=D(r).find(e=>e.tagName==='BUTTON');return {btn:b,name:b?(b.textContent||'').trim():''}});
window.__ctaLangs=async(id)=>{const o=window.__o(id);const P=window.__cprog={id,done:[],same:[],fail:[],skip:[],cur:null,finished:false,start:Date.now()};if(!location.pathname.includes('/video/'+id+'/translations')){P.fail.push('page');P.finished=true;return}
await W(()=>rows().length,20000);await sl(1500);const by={};for(const[c,n]of Object.entries(window.__CNAMES))by[n.toLowerCase()]=c;
const close=async()=>{for(let k=0;k<3;k++){const d=D().find(e=>shown(e)&&e.tagName==='YTGN-LANGUAGE-DIALOG');if(!d)return;const x=D(d).find(e=>shown(e)&&e.tagName==='YTCP-ICON-BUTTON'&&/Fermer|Close/.test(e.getAttribute('aria-label')||''));if(x)x.click();else document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await sl(1200)}};
for(const name of rows().map(r=>r.name)){if(window.__cstop)break;if(auth()){P.fail.push('AUTH');window.__cstop=true;break}const c=by[name.toLowerCase()];if(!c){P.skip.push(name);continue}if(c===o.orig){P.skip.push(c+':origine');continue}P.cur=c;
try{const r=rows().find(x=>x.name===name);if(!r)throw new Error('row');r.btn.click();const dl=await W(()=>D().find(e=>vis(e)&&e.tagName==='YTGN-LANGUAGE-DIALOG'));if(!dl)throw new Error('dialog');await sl(900);const tbs=D(dl).filter(e=>e.id==='textbox');if(tbs.length<2)throw new Error('tb '+tbs.length);const cur=tbs[1].innerText||'';if(!cur.trim()){P.skip.push(c+':vide');await close();continue}
const n=window.__ctaApply(cur,c,o);if(n===null){P.same.push(c);await close();continue}if(n.length>5000)throw new Error('long '+n.length);const g=await setBox(tbs[1],n);if(!g.includes(o.AR))throw new Error('saisie');await sl(500);
const up=D(dl).find(e=>vis(e)&&e.tagName==='YTCP-BUTTON'&&(e.innerText||'').trim()==='Mettre à jour');if(!up||up.hasAttribute('disabled'))throw new Error('bouton');up.click();
const ok=await W(()=>D().some(e=>vis(e)&&/SNACKBAR|TOAST/.test(e.tagName)&&/publiés/.test(e.innerText||'')),12000);if(auth())throw new Error('AUTH');if(!ok)throw new Error('pas publie');await W(()=>!D().some(e=>vis(e)&&e.tagName==='YTGN-LANGUAGE-DIALOG'),8000);await sl(1200);P.done.push(c)}
catch(err){P.fail.push(c+':'+err.message);if(/AUTH/.test(err.message)){window.__cstop=true;break}await close();await sl(1000)}}P.cur=null;P.finished=true;P.end=Date.now()};
window.__cstop=false;


const btn=(root,txt)=>D(root).find(e=>vis(e)&&e.tagName==='YTCP-BUTTON'&&(e.innerText||'').trim()===txt);
const setIn=async(el,x)=>{el.focus();if(el.select)el.select();document.execCommand('selectAll',false,null);document.execCommand('insertText',false,x);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));await sl(300);return el.value};
const pickLink=async(url)=>{const it=await W(()=>D().find(e=>vis(e)&&e.tagName==='TP-YT-PAPER-ITEM'&&(e.innerText||'').trim()==='Lien'),5000);if(!it)throw new Error('item Lien');it.click();
 const dl=await W(()=>D().find(e=>vis(e)&&e.tagName==='YTVE-LINK-PICK-DIALOG'),8000);if(!dl)throw new Error('dialogue lien');await sl(1500);const inp=D(dl).find(e=>e.id==='url-input');for(let k=0;k<4&&inp.value!==url;k++){inp.focus();inp.select();document.execCommand('insertText',false,url);inp.dispatchEvent(new Event('input',{bubbles:true}));await sl(800)}if(inp.value!==url)throw new Error('saisie url');
 const ap=await W(()=>{const b=btn(dl,'Appliquer');return b&&!b.hasAttribute('disabled')?b:null},10000);if(!ap)throw new Error('appliquer lien');await sl(1200);ap.click();await sl(2500)};
const pickImg=async()=>{const t=D().filter(e=>vis(e)&&e.tagName==='YTCP-DROPDOWN-TRIGGER').find(x=>!(x.innerText||'').trim()&&!/Lien/.test(x.innerText||''));
 const tr=t||D().filter(e=>vis(e)&&e.tagName==='YTCP-DROPDOWN-TRIGGER').pop();tr.click();
 const dl=await W(()=>D().find(e=>vis(e)&&e.tagName==='YTVE-LINK-ICON-PICK-DIALOG'),8000);if(!dl)throw new Error('dialogue image');
 const img=await W(()=>D(dl).find(e=>vis(e)&&e.tagName==='DIV'&&/url\(/.test(getComputedStyle(e).backgroundImage)),12000);if(!img)throw new Error('image du site');img.click();await sl(700);
 const ap=btn(dl,'Appliquer');if(!ap||ap.hasAttribute('disabled'))throw new Error('appliquer image');ap.click();await sl(1500)};
const saveEd=async()=>{const s=await W(()=>{const b=btn(document,'Enregistrer');return b&&!b.hasAttribute('disabled')?b:null},6000);if(!s)throw new Error('enregistrer');s.click();await sl(4500);
 const warn=D().find(e=>vis(e)&&/doivent|manquante/.test(e.innerText||'')&&(e.innerText||'').length<90);if(warn)throw new Error('alerte '+warn.innerText)};
window.__edState=()=>{const es=D().find(e=>e.tagName==='YTVE-ENDSCREEN-EDITOR-PLUGIN');const ic=D().find(e=>e.tagName==='YTVE-INFO-CARDS-EDITOR-PLUGIN');let e=[],c=null;try{e=(es&&es.endscreen&&es.endscreen.elements)||[]}catch(x){}try{c=ic?JSON.stringify(ic.infoCards||ic.cards||ic.data||null):null}catch(x){}return {es:e.map(x=>Object.keys(x).find(k=>/Element$/.test(k))+(x.websiteEndscreenElement?':'+JSON.stringify(x.websiteEndscreenElement).slice(0,120):'')),cards:c?c.slice(0,600):null}};
// Écran final : ajoute un élément Lien (page artiste) ; importe d'abord le modèle si l'écran final est vide
window.__esAdd=async(o)=>{const st=window.__edState();if(st.es.some(x=>/spotify\.com\/artist/.test(x)))return 'deja';
 if(st.es.length>=4)return 'plein '+st.es.join(',');
 const row=D().filter(e=>vis(e)&&/Écran final/.test(e.innerText||'')&&(e.innerText||'').length<40).pop();
 const mod=st.es.length?D().find(e=>vis(e)&&e.tagName==='YTCP-BUTTON'&&(e.innerText||'').trim()==='Modifier'&&e.getBoundingClientRect().top<(row?row.getBoundingClientRect().bottom+5:9999)&&e.getBoundingClientRect().bottom>(row?row.getBoundingClientRect().top-5:0)):null;
 if(st.es.length){if(!mod)throw new Error('modifier ecran final');mod.click()}else{const add=D().find(e=>vis(e)&&e.tagName==='YTCP-ICON-BUTTON'&&/écrans? fina/i.test(e.getAttribute('aria-label')||''));if(!add)throw new Error('plus ecran final');add.click();await sl(1500);
  const tpl=await W(()=>D().find(e=>vis(e)&&e.tagName==='TP-YT-PAPER-ITEM'&&/Appliquer un modèle/.test(e.innerText||'')),5000);if(!tpl)throw new Error('modele');tpl.click();await sl(2500);
  const imp=await W(()=>btn(document,'Importer à partir d\'une vidéo'),8000);if(!imp)throw new Error('importer');imp.click();await sl(2000);
  const q=await W(()=>D().find(e=>vis(e)&&e.tagName==='INPUT'&&/Rechercher vos vidéos/.test(e.getAttribute('placeholder')||'')),8000);if(!q)throw new Error('recherche');q.focus();document.execCommand('insertText',false,o.tplQuery);q.dispatchEvent(new Event('input',{bubbles:true}));q.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',keyCode:13,bubbles:true}));await sl(3000);
  const card=await W(()=>D().find(e=>vis(e)&&/option/.test(e.getAttribute('role')||'')&&(e.getAttribute('aria-label')||e.innerText||'').includes(o.tplTitle)),8000);if(!card)throw new Error('carte modele');card.click();await sl(4000)}
 const add=await W(()=>D().find(e=>vis(e)&&e.id==='add-element-menu-button'),10000);if(!add)throw new Error('+ element');add.click();await sl(1000);
 await pickLink(o.AR);
 const ta=await W(()=>D().find(e=>vis(e)&&e.tagName==='TEXTAREA'&&e.getAttribute('aria-label')==='Message personnalisé'),8000);if(!ta)throw new Error('message');await setIn(ta,'Suivez Xandine sur Spotify');
 const cta=D().find(e=>vis(e)&&e.id==='cta-button');cta.click();await sl(800);const it=await W(()=>D().find(e=>vis(e)&&e.tagName==='TP-YT-PAPER-ITEM'&&(e.innerText||'').trim()==="S'abonner"),4000);if(!it)throw new Error('cta');it.click();await sl(800);
 await pickImg();await saveEd();const s2=window.__edState();return 'ok '+s2.es.length+(s2.es.some(x=>/spotify\.com\/artist/.test(x))?'':' ?')};
// Carte d'information Lien vers le titre
window.__cardAdd=async(o)=>{if(!o.TR)return 'pas de titre';
 const add=D().find(e=>vis(e)&&e.id==='add-info-cards-icon-button')||D().find(e=>vis(e)&&e.tagName==='YTCP-ICON-BUTTON'&&/cartes d'information/i.test(e.getAttribute('aria-label')||''));
 if(!add){ return 'deja des cartes ?' }
 add.click();await sl(1200);await pickLink(o.TR);
 const T=await W(()=>D().find(e=>vis(e)&&e.tagName==='TEXTAREA'&&e.getAttribute('aria-label')==='Titre de la carte'),8000);if(!T)throw new Error('titre carte');await setIn(T,o.T);
 const C=D().find(e=>vis(e)&&e.tagName==='TEXTAREA'&&e.getAttribute('aria-label')==="Appel à l'action");await setIn(C,'Écouter sur Spotify');
 const X=D().find(e=>vis(e)&&e.tagName==='TEXTAREA'&&e.getAttribute('aria-label')==="Texte de l'accroche");await setIn(X,'Écoutez ce titre sur Spotify');
 await pickImg();
 const tm=D().find(e=>vis(e)&&e.tagName==='INPUT'&&/Heure de début de l'accroche/.test(e.getAttribute('aria-label')||''));if(tm){tm.focus();tm.select();document.execCommand('insertText',false,'0:40:00');tm.dispatchEvent(new Event('input',{bubbles:true}));for(const t of ['keydown','keypress','keyup'])tm.dispatchEvent(new KeyboardEvent(t,{key:'Enter',code:'Enter',keyCode:13,which:13,bubbles:true}));tm.dispatchEvent(new Event('change',{bubbles:true}));tm.dispatchEvent(new FocusEvent('blur'));tm.dispatchEvent(new FocusEvent('focusout',{bubbles:true}));tm.blur();await sl(800)}
 await saveEd();return 'ok'};



// Contrôleur : enchaîne les vidéos dans Studio sans recharger la page (navigation interne).
window.__go=async(path)=>{history.pushState({},'',path);window.dispatchEvent(new PopStateEvent('popstate',{state:{}}));window.dispatchEvent(new CustomEvent('location-changed'));await sl(4500)};
window.__cardTime=()=>{const ic=D().find(e=>e.tagName==='YTVE-INFO-CARDS-EDITOR-PLUGIN');return ((ic&&ic.infoCards)||[]).map(c=>[c.teaserStartMs,c.productInfoCard&&c.productInfoCard.targetUrl])};
window.__runAll=async(ids)=>{const R=window.__RUN={todo:ids.slice(),log:[],cur:null,finished:false,start:Date.now()};
 for(const id of ids){if(window.__rstop)break;R.cur=id;const o=window.__o(id);const L={id,song:o.T};
  try{await window.__go('/video/'+id+'/edit');await W(()=>document.querySelector('ytcp-video-metadata-editor'),20000);await sl(1500);L.desc=await window.__ctaDetails(id);if(L.desc==='AUTH')throw new Error('AUTH');}catch(e){L.desc='ERR '+e.message}
  try{await window.__go('/video/'+id+'/editor');await W(()=>D().find(e=>e.tagName==='YTVE-ENDSCREEN-EDITOR-PLUGIN'),20000);await sl(3500);
   o.tplQuery=/Visualizer/.test(window.__VIDS.find(x=>x.id===id).kind)?'Les visages':'Le chant des trompettes';o.tplTitle=/Visualizer/.test(window.__VIDS.find(x=>x.id===id).kind)?'Xandine - Les visages (Official Visualizer)':'Xandine - Le chant des trompettes (Official Music Video)';
   try{L.es=await window.__esAdd(o)}catch(e){L.es='ERR '+e.message;await window.__go('/video/'+id+'/editor');await sl(3000)}
   try{L.card=await window.__cardAdd(o)}catch(e){L.card='ERR '+e.message}
   await sl(1500);L.ct=JSON.stringify(window.__cardTime());
  }catch(e){L.ed='ERR '+e.message}
  if(/AUTH/.test(JSON.stringify(L))){R.log.push(L);window.__rstop=true;break}
  R.log.push(L);
 }R.cur=null;R.finished=true;R.end=Date.now()};
window.__rstop=false;'controleur pret '+window.__VIDS.length
