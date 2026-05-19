'use client';

import React, { useState, useMemo, useEffect } from 'react';
import data from '../data.json';
import styles from './page.module.css';

/* ── Interactive charts for Project 1 ── */

function PieChart() {
  const [active, setActive] = useState(null);
  const cx = 80, cy = 80, r = 68;
  const angle = 0.00172 * 2 * Math.PI;
  const x1 = cx + r * Math.sin(0), y1 = cy - r * Math.cos(0);
  const x2 = cx + r * Math.sin(angle), y2 = cy - r * Math.cos(angle);
  const explains = {
    legit: { title: 'Legitimate Transactions', val: '284,315', pct: '99.83%', color: '#5b8db8', note: 'Normal cardholder activity. A model must correctly pass these without flagging — false alarms frustrate customers and waste analyst time. A naive model predicting "Legitimate" 100% of the time achieves 99.83% accuracy while catching zero fraud.' },
    fraud: { title: 'Fraudulent Transactions', val: '492', pct: '0.17%', color: '#e8729a', note: 'The minority class the model must catch. Missing even one fraud case can cost hundreds or thousands of dollars. This extreme imbalance makes standard accuracy a misleading metric — Recall on the fraud class is the true measure of success.' },
  };
  const info = active ? explains[active] : null;
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>Transaction Class Distribution <span className={styles.chartHint}>click a segment</span></div>
      <div className={styles.chartRow}>
        <svg width="160" height="160" viewBox="0 0 160 160" style={{cursor:'pointer',flexShrink:0}}>
          <circle cx={cx} cy={cy} r={r} fill={active==='legit'?'#3a7db8':'#d0d0d0'} onClick={()=>setActive(active==='legit'?null:'legit')} style={{transition:'fill 0.2s'}}/>
          <path d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`} fill={active==='fraud'?'#c04070':'#e8729a'} onClick={()=>setActive(active==='fraud'?null:'fraud')} style={{transition:'fill 0.2s'}}/>
          <circle cx={cx} cy={cy} r={r*0.52} fill="white"/>
          <text x={cx} y={cy-5} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1a1a1a">0.17%</text>
          <text x={cx} y={cy+9} textAnchor="middle" fontSize="9" fill="#888">Fraud</text>
        </svg>
        <div className={styles.chartLegend}>
          <div className={styles.legendItem} style={{cursor:'pointer',fontWeight:active==='legit'?700:400}} onClick={()=>setActive(active==='legit'?null:'legit')}>
            <span className={styles.legendDot} style={{background:'#d0d0d0'}}></span><span>Legitimate — 284,315 (99.83%)</span>
          </div>
          <div className={styles.legendItem} style={{cursor:'pointer',fontWeight:active==='fraud'?700:400}} onClick={()=>setActive(active==='fraud'?null:'fraud')}>
            <span className={styles.legendDot} style={{background:'#e8729a'}}></span><span>Fraud — 492 (0.17%)</span>
          </div>
          {!active && <div className={styles.legendNote}>Extreme class imbalance is the core methodological challenge. Click each segment to learn more.</div>}
          {info && (
            <div className={styles.chartExplain} style={{borderLeftColor:info.color}}>
              <div className={styles.chartExplainTitle} style={{color:info.color}}>{info.title} — {info.val} ({info.pct})</div>
              <div className={styles.chartExplainNote}>{info.note}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SmoteChart() {
  const [active, setActive] = useState(null);
  const max = 227454;
  const H = 120, padL = 44, bW = 28, gap = 10, W = 320;
  const groups = [
    { key:'before', label:'Before SMOTE', legit:227454, fraud:391,
      explain:'Without SMOTE, the model sees 391 fraud vs 227,454 legitimate samples during training. It learns to always predict "Legitimate" — achieving 99.8% accuracy while completely ignoring fraud detection.' },
    { key:'after',  label:'After SMOTE',  legit:227454, fraud:227454,
      explain:'SMOTE generates 227,063 synthetic fraud samples by interpolating between real fraud cases using k-nearest neighbors. The training set is now balanced 50/50 — forcing the model to genuinely learn what fraud looks like.' },
  ];
  const groupW = bW*2+gap;
  const groupGap = (W-padL-groupW*2)/3;
  const barExplains = {
    legit_before:'227,454 legitimate transactions', fraud_before:'391 real fraud cases (0.17%)',
    legit_after:'227,454 legitimate transactions', fraud_after:'227,454 samples (391 real + 227,063 synthetic)',
  };
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>Class Distribution Before vs After SMOTE <span className={styles.chartHint}>click a bar group</span></div>
      <svg width="100%" viewBox={`0 0 ${W} ${H+72}`} style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",display:'block'}}>
        {[0,50,100].map(v=>{
          const y=H-(v/100)*H+10;
          return(<g key={v}><line x1={padL} y1={y} x2={W-8} y2={y} stroke="#f0f0f0" strokeWidth="1"/><text x={padL-5} y={y+4} textAnchor="end" fontSize="9" fill="#bbb">{v}%</text></g>);
        })}
        {groups.map((g,gi)=>{
          const gX=padL+groupGap*(gi+1)+groupW*gi;
          const lH=(g.legit/max)*H;
          const fH=Math.max((g.fraud/max)*H,3);
          const isActive=active===g.key;
          return(
            <g key={gi} style={{cursor:'pointer'}} onClick={()=>setActive(isActive?null:g.key)}>
              <rect x={gX-4} y={5} width={groupW+8} height={H+8} fill={isActive?'#f0f6fb':'transparent'} rx="4"/>
              <rect x={gX} y={H-lH+10} width={bW} height={lH} fill={isActive?'#3a7db8':'#5b8db8'} rx="2"/>
              <text x={gX+bW/2} y={H-lH+6} textAnchor="middle" fontSize="8" fill="#5b8db8" fontWeight="600">100%</text>
              <rect x={gX+bW+gap} y={H-fH+10} width={bW} height={fH} fill={isActive?'#c04070':'#e8729a'} rx="2"/>
              <text x={gX+bW+gap+bW/2} y={H-fH+6} textAnchor="middle" fontSize="8" fill="#e8729a" fontWeight="600">{gi===0?'0.17%':'100%'}</text>
              <text x={gX+groupW/2} y={H+24} textAnchor="middle" fontSize="9" fontWeight={isActive?'700':'500'} fill={isActive?'#1a1a1a':'#555'}>{g.label}</text>
            </g>
          );
        })}
        <g transform={`translate(${padL},${H+38})`}>
          <rect width="9" height="9" fill="#5b8db8" rx="1"/><text x="13" y="8" fontSize="9" fill="#666">Legitimate</text>
          <rect x="90" width="9" height="9" fill="#e8729a" rx="1"/><text x="103" y="8" fontSize="9" fill="#666">Fraud</text>
        </g>
      </svg>
      {active && (
        <div className={styles.chartExplain} style={{borderLeftColor:'#5b8db8'}}>
          <div className={styles.chartExplainTitle} style={{color:'#1a1a1a'}}>{groups.find(g=>g.key===active)?.label}</div>
          <div className={styles.chartExplainNote}>{groups.find(g=>g.key===active)?.explain}</div>
        </div>
      )}
      {!active && <div className={styles.legendNote}>Click "Before SMOTE" or "After SMOTE" to understand the balancing technique.</div>}
    </div>
  );
}

function ModelCompareChart() {
  const [active, setActive] = useState(null);
  const models = [
    { name:'LR Baseline', acc:99.92, recall:63.37, prec:87.67, fp:9, fn:37, best:false,
      note:'Without SMOTE, the model is biased toward predicting "Legitimate". 63% recall means 37% of all fraud cases are completely missed — unacceptable in a real banking system.' },
    { name:'LR + SMOTE', acc:97.54, recall:94.06, prec:6.38, fp:1393, fn:6, best:false,
      note:'SMOTE dramatically improves recall to 94% — nearly all fraud is caught. However, 1,393 false positives means flagging 1,393 innocent customers per test window, creating massive operational cost.' },
    { name:'Decision Tree', acc:99.36, recall:83.17, prec:19.49, fp:347, fn:17, best:false,
      note:'Better balance than LR+SMOTE. 83% recall with only 347 false positives. Still, 17% of fraud is missed and precision remains low — 1 in 5 flagged transactions is actually fraud.' },
    { name:'Random Forest', acc:99.95, recall:84.16, prec:89.47, fp:10, fn:16, best:true,
      note:'Best overall model. 84% recall with only 10 false positives — 89% of all flagged transactions are genuinely fraudulent. The ensemble approach (100 decision trees, majority voting) handles class imbalance better than any single model.' },
  ];
  const metrics = [
    {key:'acc',    label:'Accuracy (%)',          color:'#5b8db8'},
    {key:'recall', label:'Recall — Fraud (%)',    color:'#e8729a'},
    {key:'prec',   label:'Precision — Fraud (%)', color:'#5a9e82'},
  ];
  const W=420, H=140, padL=36, padB=60, bW=14, bGap=3;
  const groupW=models.length*(bW+bGap)-bGap;
  const mGap=((W-padL)-groupW*metrics.length)/(metrics.length+1);
  const info = active!==null ? models[active] : null;
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>Model Performance Comparison <span className={styles.chartHint}>click a bar to compare</span></div>
      <svg width="100%" viewBox={`0 0 ${W} ${H+padB+10}`} style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",display:'block'}}>
        {[0,25,50,75,100].map(v=>{
          const y=H-(v/100)*H+10;
          return(<g key={v}><line x1={padL} y1={y} x2={W} y2={y} stroke="#f0f0f0" strokeWidth="1"/><text x={padL-5} y={y+4} textAnchor="end" fontSize="8" fill="#bbb">{v}</text></g>);
        })}
        {metrics.map((m,mi)=>{
          const gX=padL+mGap*(mi+1)+groupW*mi;
          return(
            <g key={m.key}>
              {models.map((mod,bi)=>{
                const val=mod[m.key];
                const bH=(val/100)*H;
                const x=gX+bi*(bW+bGap);
                const y=H-bH+10;
                const isActive=active===bi;
                const fill=isActive?m.color:mod.best?m.color:m.color+'44';
                return(
                  <g key={bi} style={{cursor:'pointer'}} onClick={()=>setActive(isActive?null:bi)}>
                    <rect x={x} y={y} width={bW} height={bH} fill={fill} rx="2" style={{transition:'fill 0.15s'}}/>
                    {(mod.best||isActive)&&<text x={x+bW/2} y={y-4} textAnchor="middle" fontSize="7" fontWeight="700" fill={m.color}>{val}%</text>}
                  </g>
                );
              })}
              <text x={gX+groupW/2} y={H+22} textAnchor="middle" fontSize="9" fontWeight="600" fill="#444">{m.label}</text>
            </g>
          );
        })}
        {models.map((m,i)=>{
          const col=i%2; const row=Math.floor(i/2);
          const lx=padL+col*180; const ly=H+36+row*16;
          const isActive=active===i;
          return(
            <g key={i} transform={`translate(${lx},${ly})`} style={{cursor:'pointer'}} onClick={()=>setActive(isActive?null:i)}>
              <rect width="10" height="10" fill={m.best?'#1a1a1a':'#cccccc'} rx="1"/>
              <text x="14" y="9" fontSize="9" fontWeight={m.best||isActive?'700':'400'} fill={m.best?'#1a1a1a':isActive?'#333':'#888'}>{m.name}{m.best?' — Best':''}</text>
            </g>
          );
        })}
      </svg>
      {info && (
        <div className={styles.chartExplain} style={{borderLeftColor:info.best?'#1a1a1a':'#5b8db8'}}>
          <div className={styles.chartExplainTitle} style={{color:info.best?'#1a1a1a':'#333'}}>{info.name}{info.best?' — Best Model':''}</div>
          <div className={styles.chartExplainStats}>
            <span>Accuracy: <strong>{info.acc}%</strong></span>
            <span>Recall: <strong>{info.recall}%</strong></span>
            <span>Precision: <strong>{info.prec}%</strong></span>
            <span>False Positives: <strong>{info.fp}</strong></span>
            <span>False Negatives: <strong>{info.fn}</strong></span>
          </div>
          <div className={styles.chartExplainNote}>{info.note}</div>
        </div>
      )}
      {!info && <div className={styles.legendNote}>Random Forest (darkest bars) achieves the best Recall–Precision balance. Click any bar or model name to compare.</div>}
    </div>
  );
}

function ConfusionMatrix() {
  const [active, setActive] = useState(null);
  const cells = [
    { key:'tn', label:'TN', val:56851, color:'#5b8db8', light:'#f0f6fb',
      title:'True Negatives — 56,851',
      note:'Legitimate transactions correctly identified as legitimate. These customers experience no disruption. The model successfully processes 99.98% of all legitimate transactions without any false alarm.' },
    { key:'fp', label:'FP', val:10, color:'#5a9e82', light:'#f4faf7',
      title:'False Positives — 10',
      note:'Legitimate transactions wrongly flagged as fraud. Only 10 innocent customers were inconvenienced out of 56,861. This is exceptionally low — most fraud detection systems produce hundreds of false alarms per day.' },
    { key:'fn', label:'FN', val:16, color:'#e8729a', light:'#fdf5f8',
      title:'False Negatives — 16',
      note:'Fraudulent transactions missed by the model — the most costly error. 16 fraud cases slipped through undetected. Each missed fraud can result in financial loss ranging from small amounts to thousands of dollars for Agribank customers.' },
    { key:'tp', label:'TP', val:85, color:'#1a1a1a', light:'#f7f7f7',
      title:'True Positives — 85',
      note:'Fraudulent transactions correctly caught by the model. 85 out of 101 fraud cases were identified — an 84.16% recall rate. These detections prevent direct financial losses and protect customer accounts from unauthorized charges.' },
  ];
  const info = active ? cells.find(c=>c.key===active) : null;
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>Confusion Matrix — Random Forest <span className={styles.chartHint}>click a cell</span></div>
      <div style={{display:'grid',gridTemplateColumns:'auto 1fr 1fr',gap:2,maxWidth:340,margin:'0 auto'}}>
        <div style={{display:'contents'}}>
          <div style={{gridColumn:'1',gridRow:'1'}}></div>
          <div style={{gridColumn:'2',textAlign:'center',fontSize:10,color:'#888',padding:'4px 0',fontWeight:600}}>Pred: Legit</div>
          <div style={{gridColumn:'3',textAlign:'center',fontSize:10,color:'#888',padding:'4px 0',fontWeight:600}}>Pred: Fraud</div>
        </div>
        <div style={{gridColumn:'1',gridRow:'2',writingMode:'vertical-rl',transform:'rotate(180deg)',fontSize:10,color:'#888',padding:'0 4px',fontWeight:600,display:'flex',alignItems:'center'}}>Actual: Legit</div>
        <div style={{gridColumn:'1',gridRow:'3',writingMode:'vertical-rl',transform:'rotate(180deg)',fontSize:10,color:'#888',padding:'0 4px',fontWeight:600,display:'flex',alignItems:'center'}}>Actual: Fraud</div>
        {cells.map((c,i)=>(
          <div key={c.key} onClick={()=>setActive(active===c.key?null:c.key)}
            style={{gridColumn:i%2===0?'2':'3',gridRow:i<2?'2':'3',background:active===c.key?c.light:'#fff',border:`2px solid ${active===c.key?c.color:c.color+'33'}`,borderRadius:6,padding:'14px 10px',textAlign:'center',cursor:'pointer',transition:'all 0.15s'}}>
            <div style={{fontSize:22,fontWeight:800,color:c.color,letterSpacing:'-1px'}}>{c.val.toLocaleString()}</div>
            <div style={{fontSize:11,fontWeight:700,color:c.color,marginTop:2}}>{c.label}</div>
          </div>
        ))}
      </div>
      {info && (
        <div className={styles.chartExplain} style={{borderLeftColor:info.color}}>
          <div className={styles.chartExplainTitle} style={{color:info.color}}>{info.title}</div>
          <div className={styles.chartExplainNote}>{info.note}</div>
        </div>
      )}
      {!info && <div className={styles.legendNote} style={{textAlign:'center'}}>Only 10 false positives out of 56,861 legitimate transactions — 99.98% specificity. Click any cell for interpretation.</div>}
    </div>
  );
}

/* ── Main Portfolio component ── */
export default function Portfolio() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('about');
  const [expandedProject, setExpandedProject] = useState(null);
  const [activeProjectTab, setActiveProjectTab] = useState({});
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const allTags = useMemo(() => {
    const tags = new Set();
    data.projects.forEach(p => p.tags?.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  const filteredProjects = useMemo(() => {
    return data.projects.filter(project => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.context.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'all' || project.tags?.includes(activeFilter);
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const getProjectTab = (id) => activeProjectTab[id] || 'overview';
  const setProjectTab = (id, tab) => setActiveProjectTab(prev => ({ ...prev, [id]: tab }));

  const openProject = (projectId) => {
    setActiveTab('projects');
    setExpandedProject(projectId);
    setTimeout(() => {
      const el = document.getElementById(`project-${projectId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className={`${styles.container} ${mounted ? styles.mounted : ''}`}>

      <header className={styles.header}>
        <div className={styles.avatarWrapper}>
          <img src="/avatar.png" alt="Thảo Nguyên Trần" className={styles.avatar} />
        </div>
        <h1 className={styles.name}>{data.profile.name}</h1>
        <p className={styles.title}>{data.profile.title}</p>
        <p className={styles.tagline}>"{data.profile.tagline}"</p>
        <div className={styles.contact}>
          <a href={`mailto:${data.profile.email}`} className={styles.contactLink}>Email</a>
          <span className={styles.contactDot}>·</span>
          <a href={data.profile.linkedin} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>LinkedIn</a>
          <span className={styles.contactDot}>·</span>
          <span className={styles.contactInfo}>{data.profile.location}</span>
        </div>
      </header>

      <nav className={styles.tabs}>
        {['about', 'projects', 'experience', 'skills'].map(tab => (
          <button key={tab} className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'projects' ? `Projects (${data.projects.length})` : cap(tab)}
          </button>
        ))}
      </nav>

      <main className={styles.content}>

        {activeTab === 'about' && (
          <section className={styles.section}>
            <p className={styles.aboutBio}>{data.profile.bio}</p>
            <div className={styles.aboutGrid}>
              <div className={styles.aboutCard}><span className={styles.cardLabel}>Background</span><p>{data.about.background}</p></div>
              <div className={styles.aboutCard}><span className={styles.cardLabel}>Focus</span><p>{data.about.professional_focus}</p></div>
              <div className={styles.aboutCard}><span className={styles.cardLabel}>Strengths</span><ul className={styles.strengthsList}>{data.about.strengths.map((s,i)=><li key={i}>{s}</li>)}</ul></div>
            </div>
            <Divider label="Education" />
            {data.education.map((edu,i)=>(
              <div key={i} className={styles.eduBlock}>
                <div className={styles.eduLeft}><span className={styles.eduPeriod}>{edu.period}</span><span className={styles.eduStatus}>{edu.status}</span></div>
                <div className={styles.eduRight}><span className={styles.eduDegree}>{edu.degree}</span><span className={styles.eduInst}>{edu.institution}</span><span className={styles.eduField}>{edu.field}</span></div>
              </div>
            ))}
            <Divider label="Scholarships & Awards" />
            <div className={styles.awardsList}>
              {data.scholarships.map((s,i)=>(
                <div key={i} className={styles.awardItem}>
                  <span className={styles.awardYear}>{s.year}</span>
                  <div className={styles.awardBody}><span className={styles.awardTitle}>{s.title}</span><span className={styles.awardOrg}>{s.org}</span></div>
                </div>
              ))}
            </div>
            <Divider label="Training & Courses" />
            <div className={styles.trainingList}>
              {data.training.map((t,i)=>(
                <div key={i} className={styles.trainingItem}>
                  <span className={styles.trainingTitle}>{t.title}</span>
                  <span className={styles.trainingOrg}>{t.org}</span>
                  <ul className={styles.trainingTopics}>{t.topics.map((topic,j)=><li key={j}>{topic}</li>)}</ul>
                </div>
              ))}
            </div>
            <Divider label="Certifications" />
            <ul className={styles.certList}>{data.coursework.map((c,i)=><li key={i}>{c}</li>)}</ul>
            <Divider label="Domain Expertise" />
            <div className={styles.expertiseList}>
              {data.skills.domain_expertise.map((e,i)=><span key={i} className={styles.expertiseBadge}>{e}</span>)}
            </div>
          </section>
        )}

        {activeTab === 'projects' && (
          <>
            <div className={styles.controls}>
              <input type="text" placeholder="Search projects..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className={styles.searchInput}/>
              <div className={styles.filterButtons}>
                <button className={`${styles.filterBtn} ${activeFilter==='all'?styles.active:''}`} onClick={()=>setActiveFilter('all')}>All</button>
                {allTags.map(tag=>(
                  <button key={tag} className={`${styles.filterBtn} ${activeFilter===tag?styles.active:''}`} onClick={()=>setActiveFilter(tag)}>{tag}</button>
                ))}
              </div>
            </div>
            <p className={styles.resultsCount}>{filteredProjects.length} project{filteredProjects.length!==1?'s':''}{activeFilter!=='all'&&` tagged "${activeFilter}"`}{searchTerm&&` matching "${searchTerm}"`}</p>
            {filteredProjects.length===0 ? <p className={styles.noResults}>No projects found.</p> : (
              <div className={styles.projectsList}>
                {filteredProjects.map(project=>{
                  const isExpanded=expandedProject===project.id;
                  const currentTab=getProjectTab(project.id);
                  const hasCharts=project.id===1;
                  return(
                    <article key={project.id} id={`project-${project.id}`} className={`${styles.projectCard} ${isExpanded?styles.projectExpanded:''}`}>
                      <div className={styles.projectHeader}>
                        <div className={styles.projectMeta}>
                          <span className={styles.projectCategory}>{project.category}</span>
                          <span className={styles.projectYear}>{project.year}</span>
                        </div>
                        <h3 className={styles.projectTitle}>{project.title}</h3>
                        <p className={styles.projectType}>{project.type}</p>
                        <p className={styles.projectContext}>{project.context}</p>
                        {project.results?.length>0&&!isExpanded&&(
                          <div className={styles.projectQuickResults}>
                            {project.results.slice(0,2).map((r,i)=>(
                              <div key={i} className={styles.quickResult}><span className={styles.quickResultDot}>→</span><span>{r}</span></div>
                            ))}
                          </div>
                        )}
                        <div className={styles.projectCardFooter}>
                          <div className={styles.toolsList}>{project.tools?.map((t,i)=><span key={i} className={styles.tool}>{t}</span>)}</div>
                          <button className={styles.expandBtn} onClick={()=>{setExpandedProject(isExpanded?null:project.id);if(!isExpanded)setProjectTab(project.id,'overview');}}>
                            {isExpanded?'↑ Close':'Explore Project'}
                          </button>
                        </div>
                      </div>

                      {isExpanded&&(
                        <div className={styles.projectPanel}>
                          <div className={styles.panelTabs}>
                            {['overview','methodology','results'].map(t=>(
                              <button key={t} className={`${styles.panelTab} ${currentTab===t?styles.panelTabActive:''}`} onClick={()=>setProjectTab(project.id,t)}>
                                {t==='overview'?'Overview':t==='methodology'?'Model & Method':'Results'}
                              </button>
                            ))}
                          </div>

                          {currentTab==='overview'&&(
                            <div className={styles.panelContent}>
                              {project.researchQuestion&&(
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Research Question</span>
                                  <p className={styles.panelText}>{project.researchQuestion}</p>
                                </div>
                              )}
                              {project.dataset&&(
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Dataset</span>
                                  <div className={styles.datasetGrid}>
                                    <div className={styles.datasetItem}><span className={styles.datasetNum}>{project.dataset.observations?.toLocaleString()}</span><span className={styles.datasetDesc}>transactions</span></div>
                                    <div className={styles.datasetItem}><span className={styles.datasetNum}>{project.dataset.variables}</span><span className={styles.datasetDesc}>variables</span></div>
                                    <div className={styles.datasetItem}><span className={styles.datasetNum}>0.172%</span><span className={styles.datasetDesc}>fraud rate</span></div>
                                    <div className={styles.datasetItem}><span className={styles.datasetNum}>2 days</span><span className={styles.datasetDesc}>collection window</span></div>
                                  </div>
                                  <p className={styles.panelSubtext}>{project.dataset.source} · {project.dataset.period}</p>
                                </div>
                              )}
                              {hasCharts&&<PieChart/>}
                              {project.supervisor&&(
                                <div className={styles.panelMeta}>
                                  <span>Supervisor: {project.supervisor}</span>
                                  <span>Institution: {project.institution}</span>
                                  <span>Period: {project.period}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {currentTab==='methodology'&&(
                            <div className={styles.panelContent}>
                              <div className={styles.panelBlock}>
                                <span className={styles.panelLabel}>Pipeline</span>
                                <ol className={styles.methodologyList}>{project.methodology?.map((m,i)=><li key={i}>{m}</li>)}</ol>
                              </div>
                              {hasCharts&&<SmoteChart/>}
                              {project.models&&(
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Models Compared</span>
                                  <div className={styles.modelsGrid}>
                                    {project.models.map((m,i)=>(
                                      <div key={i} className={`${styles.modelCard} ${m.name.includes('Best')?styles.modelCardBest:''}`}>
                                        <div className={styles.modelName}>{m.name}</div>
                                        <div className={styles.modelMetrics}>
                                          <div className={styles.modelMetric}><span className={styles.metricVal}>{m.accuracy}</span><span className={styles.metricLabel}>Accuracy</span></div>
                                          <div className={styles.modelMetric}><span className={styles.metricVal}>{m.recall_fraud}</span><span className={styles.metricLabel}>Recall (fraud)</span></div>
                                          <div className={styles.modelMetric}><span className={styles.metricVal}>{m.precision_fraud}</span><span className={styles.metricLabel}>Precision (fraud)</span></div>
                                          <div className={styles.modelMetric}><span className={styles.metricVal}>{m.fp}</span><span className={styles.metricLabel}>False Positives</span></div>
                                        </div>
                                        <p className={styles.modelNote}>{m.note}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {currentTab==='results'&&(
                            <div className={styles.panelContent}>
                              {hasCharts&&<ModelCompareChart/>}
                              <div className={styles.panelBlock}>
                                <span className={styles.panelLabel}>Key Results</span>
                                <ul className={styles.resultsList}>{project.results?.map((r,i)=><li key={i}>{r}</li>)}</ul>
                              </div>
                              {hasCharts&&<ConfusionMatrix/>}
                              {project.keyFindings&&(
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Key Findings & Implications</span>
                                  <ul className={styles.findingsList}>{project.keyFindings.map((f,i)=><li key={i}>{f}</li>)}</ul>
                                </div>
                              )}
                            </div>
                          )}

                          <div className={styles.panelTagRow}>
                            {project.tags?.map(tag=>(
                              <button key={tag} className={`${styles.tag} ${activeFilter===tag?styles.tagActive:''}`} onClick={()=>setActiveFilter(tag===activeFilter?'all':tag)}>{tag}</button>
                            ))}
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab==='experience'&&(
          <section className={styles.section}>
            <div className={styles.timeline}>
              {data.experience.map(job=>(
                <div key={job.id} className={styles.timelineItem}>
                  <div className={styles.timelineLeft}><span className={styles.jobPeriod}>{job.period}</span></div>
                  <div className={styles.timelineLine}><div className={styles.timelineDot}></div><div className={styles.timelineTrack}></div></div>
                  <div className={styles.timelineRight}>
                    <h3 className={styles.jobTitle}>{job.title}</h3>
                    <span className={styles.jobCompany}>{job.company}</span>
                    <ul className={styles.highlightsList}>{job.highlights.map((h,i)=><li key={i}>{h}</li>)}</ul>
                    {job.projectId&&<button className={styles.viewProjectBtn} onClick={()=>openProject(job.projectId)}>View related project →</button>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab==='skills'&&(
          <section className={styles.section}>
            {[
              {label:'Programming & Platforms',items:[...data.skills.technical_tools.programming,...data.skills.technical_tools.platforms]},
              {label:'Visualization & BI',items:data.skills.technical_tools.data_visualization},
              {label:'Statistical Software',items:data.skills.technical_tools.statistical_software},
              {label:'Machine Learning',items:data.skills.methodologies.machine_learning},
              {label:'Econometrics & Time Series',items:data.skills.methodologies.econometrics},
              {label:'Statistical Analysis',items:data.skills.methodologies.statistical_analysis},
              {label:'Structural Modeling',items:data.skills.methodologies.structural_modeling},
              {label:'Risk Management',items:data.skills.methodologies.risk_analysis},
            ].map((group,i)=>(
              <div key={i} className={styles.skillGroup}>
                <span className={styles.skillGroupLabel}>{group.label}</span>
                <div className={styles.skillBadges}>
                  {group.items.map((skill,j)=>(
                    <span key={j} className={`${styles.skillBadge} ${hoveredSkill===skill?styles.skillHovered:''}`} onMouseEnter={()=>setHoveredSkill(skill)} onMouseLeave={()=>setHoveredSkill(null)}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

      </main>

      <footer className={styles.footer}>
        <p>{data.profile.name} · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

function Divider({label}) {
  return(
    <div style={{display:'flex',alignItems:'center',gap:'16px',margin:'48px 0 28px'}}>
      <span style={{fontSize:'11px',letterSpacing:'2.5px',textTransform:'uppercase',color:'#1a1a1a',fontWeight:700,whiteSpace:'nowrap',fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif"}}>{label}</span>
      <div style={{flex:1,height:'1px',background:'#ebebeb'}}></div>
    </div>
  );
}

