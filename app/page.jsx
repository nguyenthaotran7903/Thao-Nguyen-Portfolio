'use client';

import React, { useState, useMemo, useEffect } from 'react';
import data from '../data.json';
import styles from './page.module.css';

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
                placeholder="Search by title, context, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <div className={styles.filterButtons}>
                <button
                  className={`${styles.filterBtn} ${activeFilter === 'all' ? styles.active : ''}`}
                  onClick={() => setActiveFilter('all')}
                >All</button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    className={`${styles.filterBtn} ${activeFilter === tag ? styles.active : ''}`}
                    onClick={() => setActiveFilter(tag)}
                  >{tag}</button>
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

                  return (
                    <article
                      key={project.id}
                      id={`project-${project.id}`}
                      className={`${styles.projectCard} ${isExpanded ? styles.projectExpanded : ''}`}
                    >
                      {/* Card header — always visible */}
                      <div className={styles.projectHeader}>
                        <div className={styles.projectMeta}>
                          <span className={styles.projectCategory}>{project.category}</span>
                          <span className={styles.projectYear}>{project.year}</span>
                        </div>
                        <h3 className={styles.projectTitle}>{project.title}</h3>
                        <p className={styles.projectType}>{project.type}</p>
                        <p className={styles.projectContext}>{project.context}</p>

                        {/* Quick results — always visible */}
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
                            {isExpanded ? '↑ Close' : '↓ Read full study'}
                          </button>
                        </div>
                      </div>

                      {/* Expanded panel */}
                      {isExpanded && (
                        <div className={styles.projectPanel}>

                          {/* Panel tabs */}
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

                          {/* OVERVIEW tab */}
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
                                  <p className={styles.panelSubtext}>Class imbalance: {project.dataset.imbalance}</p>
                                </div>
                              )}
                              {project.figures && (
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Key Figures in Study</span>
                                  <ul className={styles.figuresList}>
                                    {project.figures.map((f, i) => <li key={i}>{f}</li>)}
                                  </ul>
                                </div>
                              )}
                              {project.supervisor && (
                                <div className={styles.panelMeta}>
                                  <span>Supervisor: {project.supervisor}</span>
                                  <span>Institution: {project.institution}</span>
                                  <span>Period: {project.period}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* METHODOLOGY tab */}
                          {currentTab === 'methodology' && (
                            <div className={styles.panelContent}>
                              <div className={styles.panelBlock}>
                                <span className={styles.panelLabel}>Pipeline</span>
                                <ol className={styles.methodologyList}>
                                  {project.methodology?.map((m, i) => <li key={i}>{m}</li>)}
                                </ol>
                              </div>

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

                          {/* RESULTS tab */}
                          {currentTab === 'results' && (
                            <div className={styles.panelContent}>
                              <div className={styles.panelBlock}>
                                <span className={styles.panelLabel}>Key Results</span>
                                <ul className={styles.resultsList}>
                                  {project.results?.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                              </div>
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

                          {/* Tags */}
                          <div className={styles.panelTagRow}>
                            {project.tags?.map(tag => (
                              <button
                                key={tag}
                                className={`${styles.tag} ${activeFilter === tag ? styles.tagActive : ''}`}
                                onClick={() => setActiveFilter(tag === activeFilter ? 'all' : tag)}
                              >{tag}</button>
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
                      <button
                        className={styles.viewProjectBtn}
                        onClick={() => openProject(job.projectId)}
                      >
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
                    <span
                      key={j}
                      className={`${styles.skillBadge} ${hoveredSkill === skill ? styles.skillHovered : ''}`}
                      onMouseEnter={() => setHoveredSkill(skill)}
                      onMouseLeave={() => setHoveredSkill(null)}
                    >{skill}</span>
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
