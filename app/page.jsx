'use client';

import React, { useState, useMemo, useEffect } from 'react';
import data from '../data.json';
import styles from './page.module.css';

/* ── Interactive charts ── */

function PieChart() {
  const [active, setActive] = useState(null);
  const cx = 70, cy = 70, r = 60;
  const angle = 0.00172 * 2 * Math.PI;
  const x1 = cx + r * Math.sin(0), y1 = cy - r * Math.cos(0);
  const x2 = cx + r * Math.sin(angle), y2 = cy - r * Math.cos(angle);
  const explains = {
    legit: { title: 'Legitimate — 284,315 (99.83%)', color: '#5b8db8', note: 'A model predicting "Legitimate" 100% of the time still achieves 99.83% accuracy — while catching zero fraud. Standard accuracy is meaningless here.' },
    fraud: { title: 'Fraud — 492 (0.17%)', color: '#e8729a', note: 'Missing one fraud case = direct financial loss. Recall on the fraud class, not overall accuracy, is the true success metric.' },
  };
  const info = active ? explains[active] : null;
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>Class Distribution <span className={styles.chartHint}>click to explore</span></div>
      <div className={styles.chartRow}>
        <svg width="140" height="140" viewBox="0 0 140 140" style={{cursor:'pointer',flexShrink:0}}>
          <circle cx={cx} cy={cy} r={r} fill={active==='legit'?'#3a7db8':'#d0d0d0'} onClick={()=>setActive(active==='legit'?null:'legit')} style={{transition:'fill 0.2s'}}/>
          <path d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`} fill={active==='fraud'?'#c04070':'#e8729a'} onClick={()=>setActive(active==='fraud'?null:'fraud')} style={{transition:'fill 0.2s'}}/>
          <circle cx={cx} cy={cy} r={r*0.5} fill="white"/>
          <text x={cx} y={cy-4} textAnchor="middle" fontSize="13" fontWeight="800" fill="#1a1a1a">0.17%</text>
          <text x={cx} y={cy+11} textAnchor="middle" fontSize="9" fill="#888">fraud</text>
        </svg>
        <div className={styles.chartLegend}>
          <div className={styles.legendItem} style={{cursor:'pointer',fontWeight:active==='legit'?700:400}} onClick={()=>setActive(active==='legit'?null:'legit')}>
            <span className={styles.legendDot} style={{background:'#d0d0d0'}}></span><span>Legitimate 99.83%</span>
          </div>
          <div className={styles.legendItem} style={{cursor:'pointer',fontWeight:active==='fraud'?700:400}} onClick={()=>setActive(active==='fraud'?null:'fraud')}>
            <span className={styles.legendDot} style={{background:'#e8729a'}}></span><span>Fraud 0.17%</span>
          </div>
          {!info && <div className={styles.legendNote}>Extreme imbalance — core challenge of this study.</div>}
          {info && (
            <div className={styles.chartExplain} style={{borderLeftColor:info.color}}>
              <div className={styles.chartExplainTitle} style={{color:info.color}}>{info.title}</div>
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
  const H = 110, padL = 40, bW = 26, gap = 8, W = 300;
  const groups = [
    { key:'before', label:'Before SMOTE', legit:227454, fraud:391, explain:'391 fraud vs 227,454 legitimate — the model learns to always predict "Legitimate" and gets 99.8% accuracy while catching zero fraud.' },
    { key:'after',  label:'After SMOTE',  legit:227454, fraud:227454, explain:'227,063 synthetic fraud samples generated via k-nearest neighbors interpolation. Training set balanced 50/50 — model now learns genuine fraud patterns.' },
  ];
  const groupW = bW*2+gap;
  const groupGap = (W-padL-groupW*2)/3;
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>SMOTE Balancing <span className={styles.chartHint}>click a group</span></div>
      <svg width="100%" viewBox={`0 0 ${W} ${H+68}`} style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",display:'block'}}>
        {[0,50,100].map(v=>{
          const y=H-(v/100)*H+10;
          return(<g key={v}><line x1={padL} y1={y} x2={W-8} y2={y} stroke="#f0f0f0" strokeWidth="1"/><text x={padL-5} y={y+4} textAnchor="end" fontSize="8" fill="#bbb">{v}%</text></g>);
        })}
        {groups.map((g,gi)=>{
          const gX=padL+groupGap*(gi+1)+groupW*gi;
          const lH=(g.legit/max)*H;
          const fH=Math.max((g.fraud/max)*H,3);
          const isActive=active===g.key;
          return(
            <g key={gi} style={{cursor:'pointer'}} onClick={()=>setActive(isActive?null:g.key)}>
              <rect x={gX-3} y={6} width={groupW+6} height={H+6} fill={isActive?'#f0f6fb':'transparent'} rx="3"/>
              <rect x={gX} y={H-lH+10} width={bW} height={lH} fill={isActive?'#3a7db8':'#5b8db8'} rx="2"/>
              <text x={gX+bW/2} y={H-lH+6} textAnchor="middle" fontSize="7" fill="#5b8db8" fontWeight="600">100%</text>
              <rect x={gX+bW+gap} y={H-fH+10} width={bW} height={fH} fill={isActive?'#c04070':'#e8729a'} rx="2"/>
              <text x={gX+bW+gap+bW/2} y={H-fH+6} textAnchor="middle" fontSize="7" fill="#e8729a" fontWeight="600">{gi===0?'0.17%':'100%'}</text>
              <text x={gX+groupW/2} y={H+24} textAnchor="middle" fontSize="9" fontWeight={isActive?700:500} fill={isActive?'#1a1a1a':'#555'}>{g.label}</text>
            </g>
          );
        })}
        <g transform={`translate(${padL},${H+36})`}>
          <rect width="8" height="8" fill="#5b8db8" rx="1"/><text x="11" y="7" fontSize="8" fill="#666">Legitimate</text>
          <rect x="82" width="8" height="8" fill="#e8729a" rx="1"/><text x="93" y="7" fontSize="8" fill="#666">Fraud</text>
        </g>
      </svg>
      {active && <div className={styles.chartExplain} style={{borderLeftColor:'#5b8db8'}}><div className={styles.chartExplainTitle} style={{color:'#1a1a1a'}}>{groups.find(g=>g.key===active)?.label}</div><div className={styles.chartExplainNote}>{groups.find(g=>g.key===active)?.explain}</div></div>}
      {!active && <div className={styles.legendNote}>Click each group to understand why balancing matters.</div>}
    </div>
  );
}

function ModelCompareChart() {
  const [active, setActive] = useState(null);
  const models = [
    { name:'LR Baseline', acc:99.92, recall:63.37, prec:87.67, fp:9, fn:37, best:false, note:'63% recall — 37% of all fraud missed. High accuracy hides the failure.' },
    { name:'LR + SMOTE',  acc:97.54, recall:94.06, prec:6.38,  fp:1393, fn:6, best:false, note:'94% recall but 1,393 false positives — massive operational cost.' },
    { name:'Dec. Tree',   acc:99.36, recall:83.17, prec:19.49, fp:347,  fn:17, best:false, note:'Better balance. Still 17% fraud missed, low precision.' },
    { name:'Rand. Forest',acc:99.95, recall:84.16, prec:89.47, fp:10,   fn:16, best:true,  note:'Best: 84% recall, 89% precision, only 10 false positives.' },
  ];
  const metrics = [
    {key:'acc',    label:'Accuracy',  color:'#5b8db8'},
    {key:'recall', label:'Recall',    color:'#e8729a'},
    {key:'prec',   label:'Precision', color:'#5a9e82'},
  ];
  const W=380, H=120, padL=32, padB=52, bW=12, bGap=3;
  const groupW=models.length*(bW+bGap)-bGap;
  const mGap=((W-padL)-groupW*metrics.length)/(metrics.length+1);
  const info = active!==null ? models[active] : null;
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>Model Comparison <span className={styles.chartHint}>click a bar</span></div>
      <svg width="100%" viewBox={`0 0 ${W} ${H+padB}`} style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",display:'block'}}>
        {[0,50,100].map(v=>{
          const y=H-(v/100)*H+10;
          return(<g key={v}><line x1={padL} y1={y} x2={W} y2={y} stroke="#f0f0f0" strokeWidth="1"/><text x={padL-4} y={y+4} textAnchor="end" fontSize="7" fill="#bbb">{v}</text></g>);
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
                const fill=isActive?m.color:mod.best?m.color+'cc':m.color+'33';
                return(
                  <g key={bi} style={{cursor:'pointer'}} onClick={()=>setActive(isActive?null:bi)}>
                    <rect x={x} y={y} width={bW} height={bH} fill={fill} rx="2" style={{transition:'fill 0.15s'}}/>
                    {(mod.best||isActive)&&<text x={x+bW/2} y={y-3} textAnchor="middle" fontSize="6" fontWeight="700" fill={m.color}>{val}%</text>}
                  </g>
                );
              })}
              <text x={gX+groupW/2} y={H+20} textAnchor="middle" fontSize="8" fontWeight="600" fill="#555">{m.label}</text>
            </g>
          );
        })}
        {models.map((m,i)=>{
          const lx=padL+(i%2)*160; const ly=H+32+(Math.floor(i/2)*13);
          return(
            <g key={i} transform={`translate(${lx},${ly})`} style={{cursor:'pointer'}} onClick={()=>setActive(active===i?null:i)}>
              <rect width="8" height="8" fill={m.best?'#1a1a1a':'#ccc'} rx="1"/>
              <text x="11" y="7" fontSize="8" fontWeight={m.best||active===i?700:400} fill={m.best?'#1a1a1a':active===i?'#333':'#888'}>{m.name}{m.best?' ★':''}</text>
            </g>
          );
        })}
      </svg>
      {info && (
        <div className={styles.chartExplain} style={{borderLeftColor:info.best?'#1a1a1a':'#5b8db8'}}>
          <div className={styles.chartExplainTitle} style={{color:info.best?'#1a1a1a':'#333'}}>{info.name}{info.best?' — Best Model':''}</div>
          <div className={styles.chartExplainStats}>
            <span>Accuracy <strong>{info.acc}%</strong></span>
            <span>Recall <strong>{info.recall}%</strong></span>
            <span>Precision <strong>{info.prec}%</strong></span>
            <span>False Positives <strong>{info.fp}</strong></span>
            <span>Missed Fraud <strong>{info.fn}</strong></span>
          </div>
          <div className={styles.chartExplainNote}>{info.note}</div>
        </div>
      )}
      {!info && <div className={styles.legendNote}>Random Forest (darkest) = best Recall–Precision trade-off. Click any bar to compare.</div>}
    </div>
  );
}

function ConfusionMatrix() {
  const [active, setActive] = useState(null);
  const cells = [
    { key:'tn', label:'TN', val:56851, color:'#5b8db8', light:'#f0f6fb', title:'56,851 correctly passed', note:'Legitimate customers experience zero disruption. 99.98% specificity.' },
    { key:'fp', label:'FP', val:10,    color:'#5a9e82', light:'#f4faf7', title:'10 false alarms',         note:'Only 10 innocent customers flagged — exceptionally low operational cost.' },
    { key:'fn', label:'FN', val:16,    color:'#e8729a', light:'#fdf5f8', title:'16 fraud missed',         note:'Each missed fraud = direct financial loss. This is the most costly error type.' },
    { key:'tp', label:'TP', val:85,    color:'#1a1a1a', light:'#f7f7f7', title:'85 fraud caught',         note:'85 of 101 fraud cases stopped — 84.16% recall rate.' },
  ];
  const info = active ? cells.find(c=>c.key===active) : null;
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>Confusion Matrix — Random Forest <span className={styles.chartHint}>click a cell</span></div>
      <div className={styles.cmGrid}>
        <div></div>
        <div className={styles.cmAxisLabel}>Pred: Legit</div>
        <div className={styles.cmAxisLabel}>Pred: Fraud</div>
        <div className={styles.cmRowLabel}>Actual: Legit</div>
        {cells.slice(0,2).map(c=>(
          <div key={c.key} onClick={()=>setActive(active===c.key?null:c.key)}
            className={styles.cmCell} style={{background:active===c.key?c.light:'#fff',borderColor:active===c.key?c.color:c.color+'33'}}>
            <div className={styles.cmVal} style={{color:c.color}}>{c.val.toLocaleString()}</div>
            <div className={styles.cmLabel} style={{color:c.color}}>{c.label}</div>
          </div>
        ))}
        <div className={styles.cmRowLabel}>Actual: Fraud</div>
        {cells.slice(2,4).map(c=>(
          <div key={c.key} onClick={()=>setActive(active===c.key?null:c.key)}
            className={styles.cmCell} style={{background:active===c.key?c.light:'#fff',borderColor:active===c.key?c.color:c.color+'33'}}>
            <div className={styles.cmVal} style={{color:c.color}}>{c.val.toLocaleString()}</div>
            <div className={styles.cmLabel} style={{color:c.color}}>{c.label}</div>
          </div>
        ))}
      </div>
      {info && <div className={styles.chartExplain} style={{borderLeftColor:info.color}}><div className={styles.chartExplainTitle} style={{color:info.color}}>{info.title}</div><div className={styles.chartExplainNote}>{info.note}</div></div>}
      {!info && <div className={styles.legendNote} style={{textAlign:'center'}}>Click any cell to understand its real-world impact.</div>}
    </div>
  );
}

/* ── Main ── */
export default function Portfolio() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('about');
  const [expandedProject, setExpandedProject] = useState(null);
  const [activeProjectTab, setActiveProjectTab] = useState({});
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(()=>{setMounted(true);},[]);

  const allTags = useMemo(()=>{
    const tags=new Set();
    data.projects.forEach(p=>p.tags?.forEach(t=>tags.add(t)));
    return Array.from(tags).sort();
  },[]);

  const filteredProjects = useMemo(()=>data.projects.filter(project=>{
    const matchesSearch=project.title.toLowerCase().includes(searchTerm.toLowerCase())||project.context.toLowerCase().includes(searchTerm.toLowerCase())||project.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter=activeFilter==='all'||project.tags?.includes(activeFilter);
    return matchesSearch&&matchesFilter;
  }),[searchTerm,activeFilter]);

  const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
  const getProjectTab=id=>activeProjectTab[id]||'overview';
  const setProjectTab=(id,tab)=>setActiveProjectTab(prev=>({...prev,[id]:tab}));

  const openProject=projectId=>{
    setActiveTab('projects');
    setExpandedProject(projectId);
    setTimeout(()=>{
      const el=document.getElementById(`project-${projectId}`);
      if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
    },100);
  };

  return (
    <div className={`${styles.container} ${mounted?styles.mounted:''}`}>

      <header className={styles.header}>
        <div className={styles.avatarWrapper}>
          <img src="/avatar.png" alt="Thảo Nguyên Trần" className={styles.avatar}/>
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
        {['about','projects','experience','skills'].map(tab=>(
          <button key={tab} className={`${styles.tab} ${activeTab===tab?styles.tabActive:''}`} onClick={()=>setActiveTab(tab)}>
            {tab==='projects'?`Projects (${data.projects.length})`:cap(tab)}
          </button>
        ))}
      </nav>

      <main className={styles.content}>

        {activeTab==='about'&&(
          <section className={styles.section}>
            <p className={styles.aboutBio}>{data.profile.bio}</p>
            <div className={styles.aboutGrid}>
              <div className={styles.aboutCard}><span className={styles.cardLabel}>Background</span><p>{data.about.background}</p></div>
              <div className={styles.aboutCard}><span className={styles.cardLabel}>Focus</span><p>{data.about.professional_focus}</p></div>
              <div className={styles.aboutCard}><span className={styles.cardLabel}>Strengths</span><ul className={styles.strengthsList}>{data.about.strengths.map((s,i)=><li key={i}>{s}</li>)}</ul></div>
            </div>
            <Divider label="Education"/>
            {data.education.map((edu,i)=>(
              <div key={i} className={styles.eduBlock}>
                <div className={styles.eduLeft}><span className={styles.eduPeriod}>{edu.period}</span><span className={styles.eduStatus}>{edu.status}</span></div>
                <div className={styles.eduRight}><span className={styles.eduDegree}>{edu.degree}</span><span className={styles.eduInst}>{edu.institution}</span><span className={styles.eduField}>{edu.field}</span></div>
              </div>
            ))}
            <Divider label="Scholarships & Awards"/>
            <div className={styles.awardsList}>
              {data.scholarships.map((s,i)=>(
                <div key={i} className={styles.awardItem}>
                  <span className={styles.awardYear}>{s.year}</span>
                  <div className={styles.awardBody}><span className={styles.awardTitle}>{s.title}</span><span className={styles.awardOrg}>{s.org}</span></div>
                </div>
              ))}
            </div>
            <Divider label="Training & Courses"/>
            <div className={styles.trainingList}>
              {data.training.map((t,i)=>(
                <div key={i} className={styles.trainingItem}>
                  <span className={styles.trainingTitle}>{t.title}</span>
                  <span className={styles.trainingOrg}>{t.org}</span>
                  <ul className={styles.trainingTopics}>{t.topics.map((topic,j)=><li key={j}>{topic}</li>)}</ul>
                </div>
              ))}
            </div>
            <Divider label="Certifications"/>
            <ul className={styles.certList}>{data.coursework.map((c,i)=><li key={i}>{c}</li>)}</ul>
            <Divider label="Domain Expertise"/>
            <div className={styles.expertiseList}>{data.skills.domain_expertise.map((e,i)=><span key={i} className={styles.expertiseBadge}>{e}</span>)}</div>
          </section>
        )}

        {activeTab==='projects'&&(
          <>
            <div className={styles.controls}>
              <input type="text" placeholder="Search projects..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className={styles.searchInput}/>
              <div className={styles.filterButtons}>
                <button className={`${styles.filterBtn} ${activeFilter==='all'?styles.active:''}`} onClick={()=>setActiveFilter('all')}>All</button>
                {allTags.map(tag=><button key={tag} className={`${styles.filterBtn} ${activeFilter===tag?styles.active:''}`} onClick={()=>setActiveFilter(tag)}>{tag}</button>)}
              </div>
            </div>
            <p className={styles.resultsCount}>{filteredProjects.length} project{filteredProjects.length!==1?'s':''}{activeFilter!=='all'&&` tagged "${activeFilter}"`}{searchTerm&&` matching "${searchTerm}"`}</p>
            {filteredProjects.length===0?<p className={styles.noResults}>No projects found.</p>:(
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
                        {!isExpanded&&project.results?.length>0&&(
                          <div className={styles.projectQuickResults}>
                            {project.results.slice(0,2).map((r,i)=><div key={i} className={styles.quickResult}><span className={styles.quickResultDot}>→</span><span>{r}</span></div>)}
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
                                {t==='overview'?'Overview':t==='methodology'?'Method':'Results'}
                              </button>
                            ))}
                          </div>

                          {/* ── OVERVIEW ── */}
                          {currentTab==='overview'&&(
                            <div className={styles.panelContent}>

                              {/* Problem statement */}
                              {project.researchQuestion&&(
                                <div className={styles.problemBox}>
                                  <div className={styles.problemLabel}>The Problem</div>
                                  <div className={styles.problemText}>{project.researchQuestion}</div>
                                </div>
                              )}

                              {/* Dataset stat row */}
                              {project.dataset&&(
                                <div className={styles.statRow}>
                                  <div className={styles.statBox}>
                                    <div className={styles.statNum}>284,807</div>
                                    <div className={styles.statLabel}>Transactions</div>
                                  </div>
                                  <div className={styles.statBox}>
                                    <div className={styles.statNum}>31</div>
                                    <div className={styles.statLabel}>Variables</div>
                                  </div>
                                  <div className={styles.statBox}>
                                    <div className={styles.statNum} style={{color:'#e8729a'}}>0.17%</div>
                                    <div className={styles.statLabel}>Fraud Rate</div>
                                  </div>
                                  <div className={styles.statBox}>
                                    <div className={styles.statNum}>2 days</div>
                                    <div className={styles.statLabel}>Collection Period</div>
                                  </div>
                                </div>
                              )}

                              {/* Pie chart */}
                              {hasCharts&&<PieChart/>}

                              {/* Context footer */}
                              {project.supervisor&&(
                                <div className={styles.contextMeta}>
                                  <span>Supervisor · {project.supervisor}</span>
                                  <span>{project.institution} · {project.period}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* ── METHODOLOGY ── */}
                          {currentTab==='methodology'&&(
                            <div className={styles.panelContent}>

                              {/* Pipeline steps — horizontal chips */}
                              {project.methodology&&(
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Pipeline</span>
                                  <div className={styles.pipelineSteps}>
                                    {project.methodology.map((step,i)=>(
                                      <div key={i} className={styles.pipelineStep}>
                                        <div className={styles.pipelineNum}>{i+1}</div>
                                        <div className={styles.pipelineText}>{step}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* SMOTE chart */}
                              {hasCharts&&<SmoteChart/>}

                              {/* Model cards — compact */}
                              {project.models&&(
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Models</span>
                                  <div className={styles.modelsCompact}>
                                    {project.models.map((m,i)=>(
                                      <div key={i} className={`${styles.modelCompact} ${m.name.includes('Best')?styles.modelCompactBest:''}`}>
                                        <div className={styles.modelCompactName}>{m.name}</div>
                                        <div className={styles.modelCompactStats}>
                                          <span className={styles.mStat}><span className={styles.mVal}>{m.accuracy}</span><span className={styles.mKey}>Acc</span></span>
                                          <span className={styles.mStat}><span className={styles.mVal} style={{color:'#e8729a'}}>{m.recall_fraud}</span><span className={styles.mKey}>Recall</span></span>
                                          <span className={styles.mStat}><span className={styles.mVal}>{m.fp}</span><span className={styles.mKey}>FP</span></span>
                                        </div>
                                        <div className={styles.modelCompactNote}>{m.note}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* ── RESULTS ── */}
                          {currentTab==='results'&&(
                            <div className={styles.panelContent}>

                              {/* 3 hero numbers */}
                              <div className={styles.heroStats}>
                                <div className={styles.heroStat}>
                                  <div className={styles.heroNum}>99.95%</div>
                                  <div className={styles.heroLabel}>Accuracy</div>
                                  <div className={styles.heroSub}>Random Forest</div>
                                </div>
                                <div className={styles.heroStat} style={{borderColor:'#e8729a'}}>
                                  <div className={styles.heroNum} style={{color:'#e8729a'}}>84.16%</div>
                                  <div className={styles.heroLabel}>Recall on Fraud</div>
                                  <div className={styles.heroSub}>85 of 101 caught</div>
                                </div>
                                <div className={styles.heroStat} style={{borderColor:'#5a9e82'}}>
                                  <div className={styles.heroNum} style={{color:'#5a9e82'}}>10</div>
                                  <div className={styles.heroLabel}>False Positives</div>
                                  <div className={styles.heroSub}>vs 1,393 (LR)</div>
                                </div>
                              </div>

                              {/* Model comparison chart */}
                              {hasCharts&&<ModelCompareChart/>}

                              {/* Confusion matrix */}
                              {hasCharts&&<ConfusionMatrix/>}

                              {/* Key findings — compact pills */}
                              {project.keyFindings&&(
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Key Findings</span>
                                  <div className={styles.findingPills}>
                                    {project.keyFindings.map((f,i)=>(
                                      <div key={i} className={styles.findingPill}>
                                        <span className={styles.findingIcon}>◆</span>
                                        <span>{f}</span>
                                      </div>
                                    ))}
                                  </div>
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

