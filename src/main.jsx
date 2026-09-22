import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const copy = {
  ar: { name: 'الاسم بالكامل', title: 'المسمى الوظيفي', email: 'البريد الإلكتروني', phone: 'رقم الهاتف', location: 'الموقع', linkedin: 'رابط لينكدإن', summary: 'الملخص المهني', experience: 'الخبرات المهنية', education: 'التعليم', certificates: 'الشهادات', languages: 'اللغات', skills: 'المهارات', add: 'إضافة', remove: 'حذف', print: 'طباعة / حفظ PDF', language: 'English', company: 'الشركة', role: 'الدور الوظيفي', period: 'الفترة', description: 'المهام والإنجازات', institution: 'الجامعة / الكلية', degree: 'الدرجة العلمية', year: 'السنة', certificate: 'اسم الشهادة', issuer: 'الجهة المانحة', level: 'المستوى' },
  en: { name: 'Full name', title: 'Job title', email: 'Email', phone: 'Phone', location: 'Location', linkedin: 'LinkedIn URL', summary: 'Professional summary', experience: 'Experience', education: 'Education', certificates: 'Certifications', languages: 'Languages', skills: 'Skills', add: 'Add', remove: 'Remove', print: 'Print / Save PDF', language: 'العربية', company: 'Company', role: 'Job role', period: 'Period', description: 'Responsibilities and achievements', institution: 'Institution', degree: 'Degree', year: 'Year', certificate: 'Certificate name', issuer: 'Issuer', level: 'Level' },
};

const initialData = {
  personal: { name: 'حازم موسى', title: 'مستشار موارد بشرية وخبير تطوير تنظيمي', email: 'hazem@risedge.com', phone: '+20 100 000 0000', location: 'الإسكندرية، مصر', linkedin: 'linkedin.com/in/hazemmoussa' },
  summary: 'مستشار موارد بشرية وخبير متمرس في التطوير التنظيمي وإعادة هيكلة الشركات وبناء الكوادر البشرية والتدريب الاحترافي.',
  experience: [{ id: 1, role: 'المؤسس ومستشار الموارد البشرية الرئيسي', company: 'RisEdge Consulting', period: '2023 - الحاضر', description: 'قيادة وتقديم الاستشارات الاستراتيجية في مجالات الهياكل التنظيمية وإدارة المواهب للشركات.' }],
  education: [{ id: 2, degree: 'بكالوريوس التجارة', institution: 'جامعة الإسكندرية', year: '2007' }],
  certificates: [{ id: 3, certificate: 'شهادة محترف موارد بشرية معتمد', issuer: 'إدارة الأعمال والموارد البشرية الدولية', year: '2015' }],
  languages: [{ id: 4, name: 'العربية', level: 'اللغة الأم' }, { id: 5, name: 'الإنجليزية', level: 'طلاقة' }],
  skills: 'التطوير التنظيمي، هيكلة الأجور والمزايا، التدريب، إدارة شؤون العاملين',
};

const sectionFields = {
  experience: ['role', 'company', 'period', 'description'],
  education: ['degree', 'institution', 'year'],
  certificates: ['certificate', 'issuer', 'year'],
  languages: ['name', 'level'],
};

function App() {
  const [lang, setLang] = useState('ar');
  const [data, setData] = useState(initialData);
  const t = copy[lang];
  const isArabic = lang === 'ar';
  const updatePersonal = (key, value) => setData(d => ({ ...d, personal: { ...d.personal, [key]: value } }));
  const update = (key, value) => setData(d => ({ ...d, [key]: value }));
  const add = section => setData(d => ({ ...d, [section]: [...d[section], { id: Date.now() }] }));
  const editItem = (section, id, key, value) => setData(d => ({ ...d, [section]: d[section].map(item => item.id === id ? { ...item, [key]: value } : item) }));
  const remove = (section, id) => setData(d => ({ ...d, [section]: d[section].filter(item => item.id !== id) }));

  return <div className="app" dir={isArabic ? 'rtl' : 'ltr'}>
    <header className="toolbar print-hidden"><div className="brand"><img src="/logo.jpg" alt="RisEdge" /> <strong>RisEdge</strong></div><div><button onClick={() => setLang(isArabic ? 'en' : 'ar')}>{t.language}</button><button className="primary" onClick={() => window.print()}>{t.print}</button></div></header>
    <div className="workspace">
      <aside className="editor print-hidden">
        <h1>{isArabic ? 'بناء سيرة ذاتية احترافية' : 'Build a professional CV'}</h1>
        <FormTitle title={isArabic ? 'بيانات الاتصال' : 'Contact details'} />
        {Object.entries(data.personal).map(([key, value]) => <input key={key} aria-label={t[key]} placeholder={t[key]} value={value} onChange={e => updatePersonal(key, e.target.value)} />)}
        <FormTitle title={t.summary} /><textarea aria-label={t.summary} value={data.summary} onChange={e => update('summary', e.target.value)} />
        {Object.entries(sectionFields).map(([section, fields]) => <section key={section}><div className="section-actions"><FormTitle title={t[section]} /><button onClick={() => add(section)}>{t.add}</button></div>{data[section].map(item => <div className="item-editor" key={item.id}>{fields.map(field => field === 'description' ? <textarea key={field} aria-label={t[field]} placeholder={t[field]} value={item[field] || ''} onChange={e => editItem(section, item.id, field, e.target.value)} /> : <input key={field} aria-label={t[field]} placeholder={t[field]} value={item[field] || ''} onChange={e => editItem(section, item.id, field, e.target.value)} />)}<button className="danger" onClick={() => remove(section, item.id)}>{t.remove}</button></div>)}</section>)}
        <FormTitle title={t.skills} /><textarea aria-label={t.skills} value={data.skills} onChange={e => update('skills', e.target.value)} />
      </aside>
      <main className="preview"><article id="cv-document" className="cv-document"><header className="cv-header"><h1>{data.personal.name || t.name}</h1><h2>{data.personal.title}</h2><p>{[data.personal.location, data.personal.phone, data.personal.email, data.personal.linkedin].filter(Boolean).join(' • ')}</p></header>
        <CVSection title={t.summary}>{data.summary && <p>{data.summary}</p>}</CVSection>
        <CVSection title={t.experience}>{data.experience.map(item => <div className="cv-item" key={item.id}><div className="split"><strong>{item.role}</strong><strong dir="ltr">{item.period}</strong></div><em>{item.company}</em><p>{item.description}</p></div>)}</CVSection>
        <CVSection title={t.education}>{data.education.map(item => <div className="cv-item split" key={item.id}><span><strong>{item.degree}</strong> | {item.institution}</span><span>{item.year}</span></div>)}</CVSection>
        <CVSection title={t.certificates}>{data.certificates.map(item => <div className="cv-item split" key={item.id}><span><strong>{item.certificate}</strong> | {item.issuer}</span><span>{item.year}</span></div>)}</CVSection>
        <CVSection title={t.languages}><p>{data.languages.map(x => `${x.name} (${x.level})`).join(' • ')}</p></CVSection>
        <CVSection title={t.skills}><p>{data.skills}</p></CVSection>
      </article></main>
    </div>
  </div>;
}

function FormTitle({ title }) { return <h2 className="form-title">{title}</h2>; }
function CVSection({ title, children }) { return <section className="cv-section"><h3>{title}</h3>{children}</section>; }

createRoot(document.getElementById('root')).render(<App />);
