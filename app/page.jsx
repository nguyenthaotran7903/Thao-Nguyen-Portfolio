'use client';

import React, { useState, useMemo, useEffect } from 'react';
import data from '../data.json';
import styles from './page.module.css';

/* ── Inline charts for Project 1 ── */

function PieChart() {
  const cx = 80, cy = 80, r = 70;
  const fraud = 0.00172, legit = 1 - fraud;
  const angle = fraud * 2 * Math.PI;
  const x1 = cx + r * Math.sin(0), y1 = cy - r * Math.cos(0);
  const x2 = cx + r * Math.sin(angle), y2 = cy - r * Math.cos(angle);
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>Transaction Class Distribution</div>
      <div className={styles.chartRow}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx={cx} cy={cy} r={r} fill="#e8e8e8" />
          <path
            d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
            fill="#e8729a"
          />
          <circle cx={cx} cy={cy} r={r * 0.55} fill="white" />
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1a1a1a">0.17%</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill="#888">Fraud</text>
        </svg>
        <div className={styles.chartLegend}>
          <div className={styles.legendItem}><span className={styles.legendDot} style={{background:'#e8e8e8'}}></span><span>Legitimate — 284,315 (99.83%)</span></div>
          <div className={styles.legendItem}><span className={styles.legendDot} style={{background:'#e8729a'}}></span><span>Fraud — 492 (0.17%)</span></div>
          <div className={styles.legendNote}>Extreme imbalance = core challenge of this study</div>
        </div>
      </div>
    </div>
  );
}

function SmoteChart() {
  const bars = [
    { label: 'Before SMOTE', legit: 227454, fraud: 391, maxH: 120 },
    { label: 'After SMOTE', legit: 227454, fraud: 227454, maxH: 120 },
  ];
  const max = 227454;
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>Class Distribution Before vs After SMOTE</div>
      <div className={styles.chartRow} style={{gap: 32}}>
        {bars.map((b, i) => {
          const lH = (b.legit / max) * b.maxH;
          const fH = Math.max((b.fraud / max) * b.maxH, 2);
          return (
            <div key={i} style={{textAlign:'center'}}>
              <svg width="80" height="140" viewBox="0 0 80 140">
                <rect x="8" y={140 - lH - 20} width="24" height={lH} fill="#5b8db8" rx="2"/>
                <rect x="48" y={140 - fH - 20} width="24" height={fH} fill="#e8729a" rx="2"/>
                <text x="20" y="138" textAnchor="middle" fontSize="8" fill="#888">Legit</text>
                <text x="60" y="138" textAnchor="middle" fontSize="8" fill="#888">Fraud</text>
              </svg>
              <div style={{fontSize:11, color:'#555', marginTop:4}}>{b.label}</div>
            </div>
          );
        })}
        <div className={styles.chartLegend}>
          <div className={styles.legendItem}><span className={styles.legendDot} style={{background:'#5b8db8'}}></span><span>Legitimate: 227,454</span></div>
          <div className={styles.legendItem}><span className={styles.legendDot} style={{background:'#e8729a'}}></span><span>Fraud: 391 → 227,454</span></div>
          <div className={styles.legendNote}>SMOTE generates synthetic minority samples — training set balanced without losing data</div>
        </div>
      </div>
    </div>
  );
}

function ModelCompareChart() {
  const models = [
    { name: 'LR Baseline', short: 'LR\nBaseline', acc: 99.92, recall: 63.37, prec: 87.67, fp: 9 },
    { name: 'LR + SMOTE', short: 'LR\n+SMOTE', acc: 97.54, recall: 94.06, prec: 6.38, fp: 1393 },
    { name: 'Decision Tree', short: 'Dec.\nTree', acc: 99.36, recall: 83.17, prec: 19.49, fp: 347 },
    { name: 'Random Forest', short: 'Rand.\nForest', acc: 99.95, recall: 84.16, prec: 89.47, fp: 10 },
  ];
  const metrics = [
    { key: 'acc', label: 'Accuracy (%)', color: '#5b8db8' },
    { key: 'recall', label: 'Recall — Fraud (%)', color: '#e8729a' },
    { key: 'prec', label: 'Precision — Fraud (%)', color: '#5a9e82' },
  ];
  const W = 320, H = 140, pad = 40, barW = 14, gap = 6;
  const groupW = models.length * (barW + gap) - gap;
  const groupGap = (W - pad - groupW * metrics.length) / (metrics.length + 1);

  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>Model Performance Comparison</div>
      <svg width="100%" viewBox={`0 0 ${W} ${H + 40}`} style={{maxWidth: 480}}>
        {/* Y axis lines */}
        {[0,25,50,75,100].map(v => (
          <g key={v}>
            <line x1={pad} y1={H - (v/100)*H + 10} x2={W} y2={H - (v/100)*H + 10} stroke="#f0f0f0" strokeWidth="1"/>
            <text x={pad - 4} y={H - (v/100)*H + 14} textAnchor="end" fontSize="8" fill="#bbb">{v}</text>
          </g>
        ))}
        {metrics.map((m, mi) => {
          const groupX = pad + groupGap * (mi + 1) + groupW * mi;
          return (
            <g key={m.key}>
              {models.map((mod, bi) => {
                const val = mod[m.key];
                const bH = (val / 100) * H;
                const x = groupX + bi * (barW + gap);
                const y = H - bH + 10;
                return (
                  <g key={bi}>
                    <rect x={x} y={y} width={barW} height={bH} fill={bi === 3 ? m.color : m.color + '66'} rx="2"/>
                    {bi === 3 && <text x={x + barW/2} y={y - 3} textAnchor="middle" fontSize="7" fontWeight="700" fill={m.color}>{val}%</text>}
                  </g>
                );
              })}
              <text x={groupX + groupW/2} y={H + 22} textAnchor="middle" fontSize="8" fill="#555">{m.label}</text>
            </g>
          );
        })}
        {/* Model legend at bottom */}
        {models.map((m, i) => (
          <g key={i} transform={`translate(${pad + i * 72}, ${H + 34})`}>
            <rect width="10" height="10" fill={i === 3 ? '#1a1a1a' : '#ccc'} rx="1"/>
            <text x="13" y="9" fontSize="7" fill={i === 3 ? '#1a1a1a' : '#888'}>{m.name}</text>
          </g>
        ))}
      </svg>
      <div className={styles.legendNote} style={{marginTop: 8}}>Darker bars = Random Forest (best model). Highlighted values shown on top.</div>
    </div>
  );
}

function ConfusionMatrix() {
  const cells = [
    { label: 'TN', val: 56851, desc: 'Correctly identified\nas legitimate', color: '#5b8db8', light: '#f0f6fb' },
    { label: 'FP', val: 10, desc: 'Legitimate flagged\nas fraud', color: '#5a9e82', light: '#f4faf7' },
    { label: 'FN', val: 16, desc: 'Fraud missed\nby model', color: '#e8729a', light: '#fdf5f8' },
    { label: 'TP', val: 85, desc: 'Correctly identified\nas fraud', color: '#1a1a1a', light: '#f7f7f7' },
  ];
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>Confusion Matrix — Random Forest (Best Model)</div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:2, maxWidth:320, margin:'0 auto'}}>
        {cells.map((c, i) => (
          <div key={i} style={{background: c.light, border: `1px solid ${c.color}33`, borderRadius:6, padding:'16px 12px', textAlign:'center'}}>
            <div style={{fontSize:24, fontWeight:800, color: c.color, fontFamily:'Helvetica Neue, sans-serif', letterSpacing:'-1px'}}>{c.val.toLocaleString()}</div>
            <div style={{fontSize:11, fontWeight:700, color: c.color, marginTop:2}}>{c.label}</div>
            <div style={{fontSize:11, color:'#888', marginTop:4, lineHeight:1.4, whiteSpace:'pre-line'}}>{c.desc}</div>
          </div>
        ))}
      </div>
      <div style={{display:'flex', gap:16, marginTop:12, fontSize:11, color:'#888', justifyContent:'center'}}>
        <span>Predicted →</span>
        <span style={{color:'#5b8db8'}}>Legitimate | </span>
        <span style={{color:'#e8729a'}}>Fraud</span>
      </div>
      <div className={styles.legendNote} style={{marginTop:8, textAlign:'center'}}>Only 10 false positives out of 56,861 legitimate transactions — 99.98% specificity</div>
    </div>
  );
}

/* ── Main component ── */
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

      {/* HEADER */}
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

      {/* TABS */}
      <nav className={styles.tabs}>
        {['about', 'projects', 'experience', 'skills'].map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'projects' ? `Projects (${data.projects.length})` : cap(tab)}
          </button>
        ))}
      </nav>

      <main className={styles.content}>

        {/* ── ABOUT ── */}
        {activeTab === 'about' && (
          <section className={styles.section}>
            <p className={styles.aboutBio}>{data.profile.bio}</p>
            <div className={styles.aboutGrid}>
              <div className={styles.aboutCard}>
                <span className={styles.cardLabel}>Background</span>
                <p>{data.about.background}</p>
              </div>
              <div className={styles.aboutCard}>
                <span className={styles.cardLabel}>Focus</span>
                <p>{data.about.professional_focus}</p>
              </div>
              <div className={styles.aboutCard}>
                <span className={styles.cardLabel}>Strengths</span>
                <ul className={styles.strengthsList}>
                  {data.about.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>

            <Divider label="Education" />
            {data.education.map((edu, i) => (
              <div key={i} className={styles.eduBlock}>
                <div className={styles.eduLeft}>
                  <span className={styles.eduPeriod}>{edu.period}</span>
                  <span className={styles.eduStatus}>{edu.status}</span>
                </div>
                <div className={styles.eduRight}>
                  <span className={styles.eduDegree}>{edu.degree}</span>
                  <span className={styles.eduInst}>{edu.institution}</span>
                  <span className={styles.eduField}>{edu.field}</span>
                </div>
              </div>
            ))}

            <Divider label="Scholarships & Awards" />
            <div className={styles.awardsList}>
              {data.scholarships.map((s, i) => (
                <div key={i} className={styles.awardItem}>
                  <span className={styles.awardYear}>{s.year}</span>
                  <div className={styles.awardBody}>
                    <span className={styles.awardTitle}>{s.title}</span>
                    <span className={styles.awardOrg}>{s.org}</span>
                  </div>
                </div>
              ))}
            </div>

            <Divider label="Training & Courses" />
            <div className={styles.trainingList}>
              {data.training.map((t, i) => (
                <div key={i} className={styles.trainingItem}>
                  <span className={styles.trainingTitle}>{t.title}</span>
                  <span className={styles.trainingOrg}>{t.org}</span>
                  <ul className={styles.trainingTopics}>
                    {t.topics.map((topic, j) => <li key={j}>{topic}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            <Divider label="Certifications" />
            <ul className={styles.certList}>
              {data.coursework.map((c, i) => <li key={i}>{c}</li>)}
            </ul>

            <Divider label="Domain Expertise" />
            <div className={styles.expertiseList}>
              {data.skills.domain_expertise.map((e, i) => (
                <span key={i} className={styles.expertiseBadge}>{e}</span>
              ))}
            </div>
          </section>
        )}

        {/* ── PROJECTS ── */}
        {activeTab === 'projects' && (
          <>
            <div className={styles.controls}>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <div className={styles.filterButtons}>
                <button className={`${styles.filterBtn} ${activeFilter === 'all' ? styles.active : ''}`} onClick={() => setActiveFilter('all')}>All</button>
                {allTags.map(tag => (
                  <button key={tag} className={`${styles.filterBtn} ${activeFilter === tag ? styles.active : ''}`} onClick={() => setActiveFilter(tag)}>{tag}</button>
                ))}
              </div>
            </div>

            <p className={styles.resultsCount}>
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
              {activeFilter !== 'all' && ` tagged "${activeFilter}"`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>

            {filteredProjects.length === 0 ? (
              <p className={styles.noResults}>No projects found.</p>
            ) : (
              <div className={styles.projectsList}>
                {filteredProjects.map(project => {
                  const isExpanded = expandedProject === project.id;
                  const currentTab = getProjectTab(project.id);
                  const hasCharts = project.id === 1;

                  return (
                    <article key={project.id} id={`project-${project.id}`} className={`${styles.projectCard} ${isExpanded ? styles.projectExpanded : ''}`}>

                      {/* Card header */}
                      <div className={styles.projectHeader}>
                        <div className={styles.projectMeta}>
                          <span className={styles.projectCategory}>{project.category}</span>
                          <span className={styles.projectYear}>{project.year}</span>
                        </div>
                        <h3 className={styles.projectTitle}>{project.title}</h3>
                        <p className={styles.projectType}>{project.type}</p>
                        <p className={styles.projectContext}>{project.context}</p>

                        {project.results?.length > 0 && !isExpanded && (
                          <div className={styles.projectQuickResults}>
                            {project.results.slice(0, 2).map((r, i) => (
                              <div key={i} className={styles.quickResult}>
                                <span className={styles.quickResultDot}>→</span>
                                <span>{r}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className={styles.projectCardFooter}>
                          <div className={styles.toolsList}>
                            {project.tools?.map((t, i) => <span key={i} className={styles.tool}>{t}</span>)}
                          </div>
                          <button
                            className={styles.expandBtn}
                            onClick={() => {
                              setExpandedProject(isExpanded ? null : project.id);
                              if (!isExpanded) setProjectTab(project.id, 'overview');
                            }}
                          >
                            {isExpanded ? '↑ Close' : 'Explore Project'}
                          </button>
                        </div>
                      </div>

                      {/* Expanded panel */}
                      {isExpanded && (
                        <div className={styles.projectPanel}>
                          <div className={styles.panelTabs}>
                            {['overview', 'methodology', 'results'].map(t => (
                              <button
                                key={t}
                                className={`${styles.panelTab} ${currentTab === t ? styles.panelTabActive : ''}`}
                                onClick={() => setProjectTab(project.id, t)}
                              >
                                {t === 'overview' ? 'Overview' : t === 'methodology' ? 'Model & Method' : 'Results'}
                              </button>
                            ))}
                          </div>

                          {/* OVERVIEW */}
                          {currentTab === 'overview' && (
                            <div className={styles.panelContent}>
                              {project.researchQuestion && (
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Research Question</span>
                                  <p className={styles.panelText}>{project.researchQuestion}</p>
                                </div>
                              )}

                              {project.dataset && (
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Dataset</span>
                                  <div className={styles.datasetGrid}>
                                    <div className={styles.datasetItem}>
                                      <span className={styles.datasetNum}>{project.dataset.observations?.toLocaleString()}</span>
                                      <span className={styles.datasetDesc}>transactions</span>
                                    </div>
                                    <div className={styles.datasetItem}>
                                      <span className={styles.datasetNum}>{project.dataset.variables}</span>
                                      <span className={styles.datasetDesc}>variables</span>
                                    </div>
                                    <div className={styles.datasetItem}>
                                      <span className={styles.datasetNum}>0.172%</span>
                                      <span className={styles.datasetDesc}>fraud rate</span>
                                    </div>
                                    <div className={styles.datasetItem}>
                                      <span className={styles.datasetNum}>2 days</span>
                                      <span className={styles.datasetDesc}>collection window</span>
                                    </div>
                                  </div>
                                  <p className={styles.panelSubtext}>{project.dataset.source} · {project.dataset.period}</p>
                                </div>
                              )}

                              {/* Fig 4.2 — Pie chart */}
                              {hasCharts && <PieChart />}

                              {project.supervisor && (
                                <div className={styles.panelMeta}>
                                  <span>Supervisor: {project.supervisor}</span>
                                  <span>Institution: {project.institution}</span>
                                  <span>Period: {project.period}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* METHODOLOGY */}
                          {currentTab === 'methodology' && (
                            <div className={styles.panelContent}>
                              <div className={styles.panelBlock}>
                                <span className={styles.panelLabel}>Pipeline</span>
                                <ol className={styles.methodologyList}>
                                  {project.methodology?.map((m, i) => <li key={i}>{m}</li>)}
                                </ol>
                              </div>

                              {/* Fig 4.8/4.9 — SMOTE chart */}
                              {hasCharts && <SmoteChart />}

                              {project.models && (
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Models Compared</span>
                                  <div className={styles.modelsGrid}>
                                    {project.models.map((m, i) => (
                                      <div key={i} className={`${styles.modelCard} ${m.name.includes('Best') ? styles.modelCardBest : ''}`}>
                                        <div className={styles.modelName}>{m.name}</div>
                                        <div className={styles.modelMetrics}>
                                          <div className={styles.modelMetric}>
                                            <span className={styles.metricVal}>{m.accuracy}</span>
                                            <span className={styles.metricLabel}>Accuracy</span>
                                          </div>
                                          <div className={styles.modelMetric}>
                                            <span className={styles.metricVal}>{m.recall_fraud}</span>
                                            <span className={styles.metricLabel}>Recall (fraud)</span>
                                          </div>
                                          <div className={styles.modelMetric}>
                                            <span className={styles.metricVal}>{m.precision_fraud}</span>
                                            <span className={styles.metricLabel}>Precision (fraud)</span>
                                          </div>
                                          <div className={styles.modelMetric}>
                                            <span className={styles.metricVal}>{m.fp}</span>
                                            <span className={styles.metricLabel}>False Positives</span>
                                          </div>
                                        </div>
                                        <p className={styles.modelNote}>{m.note}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* RESULTS */}
                          {currentTab === 'results' && (
                            <div className={styles.panelContent}>
                              {/* Fig 4.13 — Model comparison chart */}
                              {hasCharts && <ModelCompareChart />}

                              <div className={styles.panelBlock}>
                                <span className={styles.panelLabel}>Key Results</span>
                                <ul className={styles.resultsList}>
                                  {project.results?.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                              </div>

                              {/* Fig 4.13 — Confusion matrix RF */}
                              {hasCharts && <ConfusionMatrix />}

                              {project.keyFindings && (
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Key Findings & Implications</span>
                                  <ul className={styles.findingsList}>
                                    {project.keyFindings.map((f, i) => <li key={i}>{f}</li>)}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}

                          <div className={styles.panelTagRow}>
                            {project.tags?.map(tag => (
                              <button key={tag} className={`${styles.tag} ${activeFilter === tag ? styles.tagActive : ''}`} onClick={() => setActiveFilter(tag === activeFilter ? 'all' : tag)}>{tag}</button>
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

        {/* ── EXPERIENCE ── */}
        {activeTab === 'experience' && (
          <section className={styles.section}>
            <div className={styles.timeline}>
              {data.experience.map((job) => (
                <div key={job.id} className={styles.timelineItem}>
                  <div className={styles.timelineLeft}>
                    <span className={styles.jobPeriod}>{job.period}</span>
                  </div>
                  <div className={styles.timelineLine}>
                    <div className={styles.timelineDot}></div>
                    <div className={styles.timelineTrack}></div>
                  </div>
                  <div className={styles.timelineRight}>
                    <h3 className={styles.jobTitle}>{job.title}</h3>
                    <span className={styles.jobCompany}>{job.company}</span>
                    <ul className={styles.highlightsList}>
                      {job.highlights.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                    {job.projectId && (
                      <button className={styles.viewProjectBtn} onClick={() => openProject(job.projectId)}>
                        View related project →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── SKILLS ── */}
        {activeTab === 'skills' && (
          <section className={styles.section}>
            {[
              { label: 'Programming & Platforms', items: [...data.skills.technical_tools.programming, ...data.skills.technical_tools.platforms] },
              { label: 'Visualization & BI', items: data.skills.technical_tools.data_visualization },
              { label: 'Statistical Software', items: data.skills.technical_tools.statistical_software },
              { label: 'Machine Learning', items: data.skills.methodologies.machine_learning },
              { label: 'Econometrics & Time Series', items: data.skills.methodologies.econometrics },
              { label: 'Statistical Analysis', items: data.skills.methodologies.statistical_analysis },
              { label: 'Structural Modeling', items: data.skills.methodologies.structural_modeling },
              { label: 'Risk Management', items: data.skills.methodologies.risk_analysis },
            ].map((group, i) => (
              <div key={i} className={styles.skillGroup}>
                <span className={styles.skillGroupLabel}>{group.label}</span>
                <div className={styles.skillBadges}>
                  {group.items.map((skill, j) => (
                    <span key={j} className={`${styles.skillBadge} ${hoveredSkill === skill ? styles.skillHovered : ''}`} onMouseEnter={() => setHoveredSkill(skill)} onMouseLeave={() => setHoveredSkill(null)}>{skill}</span>
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

function Divider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '48px 0 28px' }}>
      <span style={{ fontSize: '11px', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#1a1a1a', fontWeight: 700, whiteSpace: 'nowrap', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>{label}</span>
      <div style={{ flex: 1, height: '1px', background: '#ebebeb' }}></div>
    </div>
  );
}
