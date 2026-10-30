export const uid=()=>globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2);
export const KEY='hazem-cv-draft-v1';
export const fields={experience:['role','company','start','end','description'],education:['degree','institution','year'],certificates:['certificate','issuer','year'],languages:['name','level'],projects:['role','description'],training:['certificate','issuer','year'],volunteering:['role','company','description']};
export const blank=()=>({personal:{name:'',title:'',email:'',phone:'',location:'',linkedin:''},summary:'',skills:'',...Object.fromEntries(Object.keys(fields).map(k=>[k,[]]))});
export function normalize(d){
 if(!d||!d.personal)throw Error('Invalid CV'); const out=blank();
 for(const k of Object.keys(out.personal)){if(typeof d.personal[k]!=='string'||d.personal[k].length>10000)throw Error('Invalid contact');out.personal[k]=d.personal[k];}
 for(const k of ['summary','skills']){if(typeof d[k]!=='string'||d[k].length>100000)throw Error('Invalid text');out[k]=d[k];}
 for(const [s,fs]of Object.entries(fields)){if(d[s]==null)continue;if(!Array.isArray(d[s])||d[s].length>100)throw Error('Invalid list');out[s]=d[s].map(x=>{if(!x||typeof x!=='object')throw Error('Invalid item');let item={id:uid()};for(const k of [...fs,'period']){if(x[k]!=null&&typeof x[k]!=='string')throw Error('Invalid field');item[k]=(x[k]||'').slice(0,100000);}item.current=x.current===true;return item;});}return out;
}
export function placeholders(d){return typeof d==='string'?/[\[\]]/.test(d):d&&typeof d==='object'?Object.values(d).some(placeholders):false;}
export const nonempty=x=>Object.entries(x).some(([k,v])=>k!=='id'&&typeof v==='string'&&v.trim());
export function review(d){const p=d.personal;return [
 ['name',!!p.name.trim()],['contact',!!(p.email.trim()||p.phone.trim())],['email',!p.email||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)],['phone',!p.phone||/^\+?[\d\s().-]{7,25}$/.test(p.phone)],['title',!!p.title.trim()],['summary',!!d.summary.trim()],['skills',!!d.skills.trim()],['evidence',[...d.experience,...d.projects,...d.education].some(nonempty)],['dates',d.experience.every(x=>!nonempty(x)||((x.start&&(x.current||x.end)&&(!x.end||x.current||x.end>=x.start))||(!x.start&&!x.end&&x.period)))],['achievements',!d.experience.some(nonempty)||d.experience.filter(nonempty).every(x=>x.description?.trim())],['sample',!JSON.stringify(d).includes('example.com')&&!JSON.stringify(d).includes('hazem@risedge.com')&&!placeholders(d)]
 ];}
export function terms(text){return [...new Set((text.toLowerCase().match(/[\p{L}\p{N}+#.]+/gu)||[]).filter(x=>x.length>2&&!new Set(['the','and','with','for','you','are','our','this','that','from','will','have','job','في','من','على','إلى','الى','عن','مع','أن','ان','العمل','المطلوب','الوظيفة','خبرة','سنوات','شركة']).has(x)))].slice(0,60);}
