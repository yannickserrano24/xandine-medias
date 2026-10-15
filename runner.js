window.__deep=(root=document,acc=[])=>{root.querySelectorAll('*').forEach(e=>{acc.push(e); if(e.shadowRoot) window.__deep(e.shadowRoot,acc)}); return acc};
if(!window.__origClick){ window.__origClick=HTMLInputElement.prototype.click; HTMLInputElement.prototype.click=function(){ if(this.type==='file'){ window.__fileInput=this; return; } return window.__origClick.call(this); }; }
window.__NAMES={ar:'Arabe',az:'Azerbaïdjanais',be:'Biélorusse',bg:'Bulgare',br:'Breton',ca:'Catalan',co:'Corse',cy:'Gallois',da:'Danois',de:'Allemand',el:'Grec',en:'Anglais',es:'Espagnol',eu:'Basque',fa:'Persan',ga:'Irlandais',gd:'Gaélique écossais',gl:'Galicien',hi:'Hindi',hr:'Croate',hu:'Hongrois',hy:'Arménien',id:'Indonésien',it:'Italien',iw:'Hébreu',ja:'Japonais',ka:'Géorgien',ko:'Coréen',lt:'Lituanien',lv:'Letton',my:'Birman',nl:'Néerlandais',no:'Norvégien',oc:'Occitan',pl:'Polonais',pt:'Portugais',ro:'Roumain',ru:'Russe',scn:'Sicilien',sr:'Serbe',sv:'Suédois',th:'Thaï',tr:'Turc',uk:'Ukrainien',vi:'Vietnamien',yi:'Yiddish',zh:'Chinois'};
window.__run=async(slug)=>{
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 const W=async(fn,ms=15000)=>{const t0=Date.now(); while(Date.now()-t0<ms){const v=fn(); if(v) return v; await sleep(300);} return null;};
 const vis=e=>e&&e.offsetParent!==null;
 const shown=e=>{ if(!e) return false; const q=e.getBoundingClientRect(); return q.width>0&&q.height>0; };
 const P=window.__prog={slug,done:[],fail:[],cur:null,start:Date.now(),finished:false};
 const L=await (await fetch('https://raw.githubusercontent.com/yannickserrano24/xandine-medias/tmp-dt/ytloc/'+slug+'.json')).json();
 const codes=Object.keys(window.__NAMES);
 for(const c of codes){
  if(window.__stop) break;
  P.cur=c; const name=window.__NAMES[c];
  try{
   await sleep(1200);
   if(window.__rows().some(r=>r.name.toLowerCase()===name.toLowerCase())){ P.done.push(c+':exists'); continue; }
   let item=null;
   for(let a=0;a<3&&!item;a++){
    const add=await W(()=>{const b=window.__deep().find(e=>e.id==='add-translations-button'); return vis(b)&&!b.hasAttribute('disabled')?b:null;});
    if(!add) throw new Error('add btn');
    add.click();
    item=await W(()=>{const m=window.__deep().find(e=>e.tagName==='YTCP-TEXT-MENU'); return m&&[...m.querySelectorAll('tp-yt-paper-item')].find(e=>(e.textContent||'').trim()===name&&shown(e));},8000);
    if(!item) await sleep(1500);
   }
   if(!item) throw new Error('menu item');
   item.click();
   const dlg=await W(()=>window.__deep().find(e=>vis(e)&&e.tagName==='YTGN-LANGUAGE-DIALOG'));
   if(!dlg) throw new Error('lang dialog');
   await sleep(800);
   const tbs=window.__deep(dlg).filter(e=>e.id==='textbox');
   for(const [tb,text] of [[tbs[0],L[c].titre],[tbs[1],L[c].description]]){ tb.focus(); document.execCommand('selectAll',false,null); document.execCommand('insertText',false,text); tb.dispatchEvent(new Event('input',{bubbles:true})); await sleep(300);} 
   const sb=window.__deep(dlg).find(e=>e.id==='language-details-text-button-subtitles'); if(!sb) throw new Error('subs btn'); sb.click();
   const conf=await W(()=>window.__deep().find(e=>vis(e)&&e.tagName==='YTCP-CONFIRMATION-DIALOG'));
   if(!conf) throw new Error('confirm');
   window.__deep(conf).find(e=>e.id==='confirm-button').click();
   const up=await W(()=>{const a=window.__deep().filter(e=>vis(e)&&(e.innerText||'').trim()==='Téléverser un fichier'); return a[a.length-1];},20000);
   if(!up) throw new Error('editor');
   up.click();
   const rad=await W(()=>window.__deep().find(e=>vis(e)&&e.tagName==='TP-YT-PAPER-RADIO-BUTTON'&&e.getAttribute('name')==='with-timing'));
   if(!rad) throw new Error('radio'); rad.click(); await sleep(300);
   const ud=window.__deep().find(e=>vis(e)&&e.tagName==='YTVE-CAPTIONS-EDITOR-UPLOAD-DIALOG');
   window.__fileInput=null; window.__deep(ud).find(e=>e.tagName==='YTCP-BUTTON'&&(e.innerText||'').trim()==='Continuer').click();
   const fi=await W(()=>window.__fileInput,8000); if(!fi) throw new Error('fileinput');
   const dt=new DataTransfer(); dt.items.add(new File([L[c].srt],slug+'-'+c+'.srt',{type:'application/x-subrip'})); fi.files=dt.files; fi.dispatchEvent(new Event('change',{bubbles:true}));
   await sleep(2500);
   const pub=await W(()=>{const a=window.__deep().filter(e=>vis(e)&&e.tagName==='YTCP-BUTTON'&&(e.innerText||'').trim()==='Publier'&&!e.hasAttribute('disabled')); return a[a.length-1];},15000);
   if(!pub) throw new Error('publish');
   pub.click();
   const closed=await W(()=>!window.__deep().some(e=>vis(e)&&(e.tagName==='YTGN-LANGUAGE-DIALOG'||(e.innerText||'').trim()==='Téléverser un fichier')),20000);
   await sleep(1500);
   P.done.push(c);
  }catch(err){
   P.fail.push(c+':'+err.message);
   for(let k=0;k<3;k++){ const x=window.__deep().find(e=>shown(e)&&e.tagName==='YTCP-ICON-BUTTON'&&/Fermer|Close|Annuler/.test(e.getAttribute('aria-label')||'')); if(x){x.click(); await sleep(1200); const cd=window.__deep().find(e=>shown(e)&&e.tagName==='YTCP-CONFIRMATION-DIALOG'); if(cd){ const b=window.__deep(cd).find(e=>e.id==='cancel-button'); b&&b.click(); await sleep(1000);} } }
   await sleep(1500);
  }
 }
 P.cur=null; P.finished=true; P.end=Date.now();
};
window.__rows=()=>window.__deep().filter(e=>e.tagName==='YTGN-VIDEO-TRANSLATION-ROW').map(r=>{const tds=[...window.__deep(r)].filter(e=>e.tagName==='TD'); const b=window.__deep(r).find(e=>e.tagName==='BUTTON'&&/language-display-name/.test(e.className)); return {name:b?(b.textContent||'').trim():'', cells:tds.map(t=>(t.innerText||'').trim().replace(/\s+/g,' '))};});
window.__runFR=async(slug)=>{
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 const W=async(fn,ms=15000)=>{const t0=Date.now(); while(Date.now()-t0<ms){const v=fn(); if(v) return v; await sleep(300);} return null;};
 const vis=e=>e&&e.offsetParent!==null;
 const L=await (await fetch('https://raw.githubusercontent.com/yannickserrano24/xandine-medias/tmp-dt/ytloc/'+slug+'.json')).json();
 window.__fr={slug,step:'start'};
 const m2=await W(()=>{const b=window.__deep().find(e=>e.id==='m2-editor-button'); return vis(b)?b:null;},8000);
 if(m2){ m2.click(); window.__fr.step='m2';
   const opt=await W(()=>window.__deep().find(e=>vis(e)&&e.tagName==='YTCP-ICON-BUTTON'&&/Options/.test(e.getAttribute('aria-label')||'')),20000);
   const up0=window.__deep().filter(e=>vis(e)&&(e.innerText||'').trim()==='Téléverser un fichier');
   if(up0.length){ up0[up0.length-1].click(); } else { if(!opt) throw new Error('no options'); opt.click(); const it=await W(()=>window.__deep().find(e=>vis(e)&&e.tagName==='TP-YT-PAPER-ITEM'&&(e.innerText||'').trim()==='Téléverser un fichier')); if(!it) throw new Error('no upload item'); it.click(); }
 } else { const b=window.__deep().find(e=>e.id==='upload-default-language-button'); b.click(); window.__fr.step='direct'; }
 const rad=await W(()=>window.__deep().find(e=>vis(e)&&e.tagName==='TP-YT-PAPER-RADIO-BUTTON'&&e.getAttribute('name')==='with-timing'));
 if(!rad) throw new Error('radio'); rad.click(); await sleep(300);
 const ud=window.__deep().find(e=>vis(e)&&e.tagName==='YTVE-CAPTIONS-EDITOR-UPLOAD-DIALOG');
 window.__fileInput=null; window.__deep(ud).find(e=>e.tagName==='YTCP-BUTTON'&&(e.innerText||'').trim()==='Continuer').click();
 const fi=await W(()=>window.__fileInput,8000); if(!fi) throw new Error('fileinput');
 const dt=new DataTransfer(); dt.items.add(new File([L.fr.srt],slug+'-fr.srt',{type:'application/x-subrip'})); fi.files=dt.files; fi.dispatchEvent(new Event('change',{bubbles:true}));
 await sleep(3000);
 const conf=window.__deep().find(e=>vis(e)&&e.tagName==='YTCP-CONFIRMATION-DIALOG'); if(conf){ window.__deep(conf).find(e=>e.id==='confirm-button').click(); await sleep(2500);} 
 const pub=await W(()=>{const a=window.__deep().filter(e=>vis(e)&&e.tagName==='YTCP-BUTTON'&&(e.innerText||'').trim()==='Publier'&&!e.hasAttribute('disabled')); return a[a.length-1];},15000);
 if(!pub){ window.__fr.step='nopub'; return; }
 pub.click(); await W(()=>!window.__deep().some(e=>vis(e)&&/YTVE-CAPTIONS-EDITOR/.test(e.tagName)),20000); await sleep(1500);
 window.__fr.step='done';
};
window.__runAll=async(slug)=>{ try{ await window.__runFR(slug);}catch(e){ window.__fr={slug,step:'err '+e.message}; } await new Promise(r=>setTimeout(r,2000)); await window.__run(slug); };
window.__stop=false;
