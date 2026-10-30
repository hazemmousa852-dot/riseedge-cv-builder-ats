import React,{useEffect,useRef,useState} from 'react';

// Uses the actual rendered font metrics, A4 dimensions and selected margins.
// Text remains DOM text; no canvas or image conversion is involved.
function paginate(source,target,margin,arabic){
 target.replaceChildren();
 const warnings=[];let page,content,section,heading;
 const full=()=>content.scrollHeight>content.clientHeight+1;
 const createPage=()=>{
  const frame=document.createElement('div');frame.className='page-frame';frame.dataset.page=(arabic?'صفحة ':'Page ')+(target.children.length+1);
  page=document.createElement('article');page.className='cv-document cv-page';page.dir=source.dir;page.lang=source.lang;
  page.setAttribute('aria-label',(arabic?'صفحة ':'Page ')+(target.children.length+1));
  content=document.createElement('div');content.className='page-content';content.style.height=`${297-2*margin}mm`;
  page.append(content);frame.append(page);target.append(frame);section=null;
 };
 const sectionHere=()=>{if(!section){section=document.createElement('section');section.className='cv-section';if(heading)section.append(heading.cloneNode(true));content.append(section);}return section;};
 const cleanEmpty=()=>{if(section&&section.children.length===1&&section.firstElementChild?.tagName==='H3'){section.remove();section=null;}};
 const next=()=>{cleanEmpty();createPage();};
 const tryAppend=node=>{sectionHere().append(node);if(!full())return true;node.remove();return false;};
 const textPart=(original,text)=>{const node=original.cloneNode(false);node.textContent=text;return node;};
 const wrap=(node,item)=>{
  if(!item)return node;
  const box=document.createElement('div');box.className='cv-item continued-item';
  if(node.tagName==='LI'){const ul=document.createElement('ul');ul.append(node);box.append(ul);}else box.append(node);
  return box;
 };
 const splitText=(original,item)=>{
  let remaining=original.textContent;
  while(remaining.length){
   let low=1,high=remaining.length,best=0;
   while(low<=high){const n=Math.floor((low+high)/2),probe=wrap(textPart(original,remaining.slice(0,n)),item);if(tryAppend(probe)){best=n;probe.remove();low=n+1;}else high=n-1;}
   if(!best){cleanEmpty();if(content.children.length){next();continue;}warnings.push(arabic?'جزء من المحتوى أكبر من مساحة الصفحة. قلّل الخط أو اختصر النص.':'A content block exceeds the page area. Reduce font size or shorten the text.');const node=wrap(textPart(original,remaining),item);sectionHere().append(node);break;}
   if(best<remaining.length){const boundary=remaining.lastIndexOf(' ',best-1);if(boundary>best*.65)best=boundary+1;}
   sectionHere().append(wrap(textPart(original,remaining.slice(0,best)),item));remaining=remaining.slice(best);if(remaining.length)next();
  }
 };
 createPage();
 for(const block of source.children){
  if(block.tagName==='HEADER'){
   heading=null;content.append(block.cloneNode(true));if(full())warnings.push(arabic?'بيانات العنوان طويلة جدًا؛ اختصرها قبل الطباعة.':'The contact header is too long; shorten it before printing.');continue;
  }
  heading=block.querySelector('h3');section=null;
  for(const child of [...block.children].filter(x=>x.tagName!=='H3')){
   const clone=child.cloneNode(true);
   if(tryAppend(clone))continue;
   // Keep a complete item on one page whenever it fits a fresh page.
   cleanEmpty();const previous={page,content,section};const moved=content.children.length>0;if(moved)next();
   if(tryAppend(clone))continue;
   if(moved){target.lastElementChild.remove();page=previous.page;content=previous.content;section=previous.section?.isConnected?previous.section:null;}
   if(child.tagName==='P'){splitText(child,false);continue;}
   if(child.classList.contains('cv-item')){
    const prefix=child.cloneNode(false),bullets=[];
    for(const part of child.children){if(part.tagName==='UL')bullets.push(...part.children);else prefix.append(part.cloneNode(true));}
    if(prefix.childNodes.length){
     // Keep item identity and the first achievement together where possible.
     const lead=prefix.cloneNode(true);if(bullets.length){const ul=document.createElement('ul');ul.append(bullets[0].cloneNode(true));lead.append(ul);}
     if(tryAppend(lead)){bullets.shift();}
     else if(!tryAppend(prefix)){warnings.push(arabic?'عنوان خبرة طويل جدًا؛ اختصر بيانات المسمى أو الشركة.':'An experience heading is too long; shorten its title or company.');sectionHere().append(prefix);}
    }
    for(const bullet of bullets){const unit=wrap(bullet.cloneNode(true),true);if(tryAppend(unit))continue;next();if(!tryAppend(unit))splitText(bullet,true);}
   }else{sectionHere().append(clone);warnings.push(arabic?'راجع توزيع المحتوى الطويل قبل الطباعة.':'Review long content before printing.');}
  }
 }
 cleanEmpty();
 // No trailing blank pages, including a heading-only page from a failed fit.
 if(target.children.length>1&&!content.textContent.trim())target.lastElementChild.remove();
 const plain=root=>{const clone=root.cloneNode(true);clone.querySelectorAll('h3').forEach(x=>x.remove());return clone.textContent.replace(/\s/g,'');};
 const intact=plain(source)===plain(target);
 if(!intact)warnings.push(arabic?'تعذر التأكد من تطابق النص؛ راجع جميع الصفحات قبل التصدير.':'Text integrity could not be confirmed; review all pages before export.');
 for(const area of target.querySelectorAll('.page-content'))if(area.scrollHeight>area.clientHeight+1)warnings.push(arabic?'يوجد تجاوز لمساحة صفحة؛ قلّل الخط أو اختصر المحتوى.':'A page overflows; reduce font size or shorten content.');
 return{count:target.children.length,intact,text:target.innerText,warnings:[...new Set(warnings)]};
}

export default function Pagination({sourceRef,revision,margin,arabic,onReport}){
 const target=useRef(null),host=useRef(null),[scale,setScale]=useState(1),[busy,setBusy]=useState(true),[report,setReport]=useState({count:0,warnings:[]});
 useEffect(()=>{const observer=new ResizeObserver(([entry])=>setScale(Math.min(1,entry.contentRect.width/(210*96/25.4))));observer.observe(host.current);return()=>observer.disconnect();},[]);
 useEffect(()=>{let cancelled=false;setBusy(true);onReport({busy:true});
  document.fonts.ready.then(()=>{if(cancelled)return;try{const result=paginate(sourceRef.current,target.current,margin,arabic);setReport(result);setBusy(false);onReport({...result,busy:false});}catch{const result={count:0,intact:false,warnings:[arabic?'تعذر توزيع الصفحات. قلّل حجم المحتوى وأعد المحاولة.':'Could not paginate the document. Reduce content and try again.']};setReport(result);setBusy(false);onReport({...result,busy:false});}});
  return()=>{cancelled=true;};
 },[revision,margin,arabic]);
 return <div ref={host} className="pages-preview" style={{'--page-scale':scale}} aria-busy={busy}>
  <div className="page-status print-hidden" role="status">{busy?(arabic?'جارٍ توزيع الصفحات…':'Preparing pages…'):(arabic?`عدد الصفحات: ${report.count}`:`Pages: ${report.count}`)}{!busy&&report.intact&&<small>{arabic?'تم التحقق من اكتمال النص وترتيبه داخل المعاينة.':'Preview text integrity and order verified.'}</small>}{report.warnings.map(w=><p key={w}>{w}</p>)}</div>
  <div ref={target} className="pages-stack"/>
 </div>;
}
