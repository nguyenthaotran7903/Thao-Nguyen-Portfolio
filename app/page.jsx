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
        <svg width="140" height="140" viewBox="0 0 140 140" style={{cursor:'pointer',flexShrink:0,display:'block'}}>
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
  const H = 120, padL = 32, bW = 12, gap = 3, W = 380;
  const groups = [
    { key:'before', label:'Before SMOTE', legit:227454, fraud:391, explain:'391 fraud vs 227,454 legitimate — model learns to always predict "Legitimate". Gets 99.8% accuracy while catching zero fraud.' },
    { key:'after',  label:'After SMOTE',  legit:227454, fraud:227454, explain:'227,063 synthetic fraud samples generated via k-nearest neighbors. Training set balanced 50/50 — model now learns genuine fraud patterns.' },
  ];
  const groupW = 2*(bW+gap)-gap;
  const mGap = ((W-padL)-groupW*groups.length)/(groups.length+1);
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>SMOTE Balancing <span className={styles.chartHint}>click a group</span></div>
      <svg width="100%" viewBox={`0 0 ${W} ${H+52}`} style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",display:'block'}}>
        {[0,50,100].map(v=>{
          const y=H-(v/100)*H+10;
          return(<g key={v}><line x1={padL} y1={y} x2={W} y2={y} stroke="#f0f0f0" strokeWidth="1"/><text x={padL-4} y={y+4} textAnchor="end" fontSize="7" fill="#bbb">{v}</text></g>);
        })}
        {groups.map((g,gi)=>{
          const gX=padL+mGap*(gi+1)+groupW*gi;
          const isActive=active===g.key;
          const lH=(g.legit/max)*H;
          const fH=Math.max((g.fraud/max)*H,2);
          return(
            <g key={gi} style={{cursor:'pointer'}} onClick={()=>setActive(isActive?null:g.key)}>
              <rect x={gX-3} y={5} width={groupW+6} height={H+8} fill={isActive?'#f0f6fb':'transparent'} rx="2"/>
              <rect x={gX} y={H-lH+10} width={bW} height={lH} fill={isActive?'#3a7db8':'#5b8db8'} rx="2"/>
              {isActive&&<text x={gX+bW/2} y={H-lH+6} textAnchor="middle" fontSize="6" fill="#5b8db8" fontWeight="700">100%</text>}
              <rect x={gX+bW+gap} y={H-fH+10} width={bW} height={fH} fill={isActive?'#c04070':'#e8729a'} rx="2"/>
              {isActive&&<text x={gX+bW+gap+bW/2} y={H-fH+6} textAnchor="middle" fontSize="6" fill="#e8729a" fontWeight="700">{gi===0?'0.17%':'100%'}</text>}
              <text x={gX+groupW/2} y={H+22} textAnchor="middle" fontSize="8" fontWeight={isActive?700:500} fill={isActive?'#1a1a1a':'#666'}>{g.label}</text>
            </g>
          );
        })}
        <g transform={`translate(${padL},${H+34})`}>
          <rect width="7" height="7" fill="#5b8db8" rx="1"/><text x="10" y="6" fontSize="8" fill="#888">Legitimate</text>
          <rect x="76" width="7" height="7" fill="#e8729a" rx="1"/><text x="86" y="6" fontSize="8" fill="#888">Fraud</text>
        </g>
      </svg>
      {active&&<div className={styles.chartExplain} style={{borderLeftColor:'#5b8db8'}}><div className={styles.chartExplainTitle} style={{color:'#1a1a1a'}}>{groups.find(g=>g.key===active)?.label}</div><div className={styles.chartExplainNote}>{groups.find(g=>g.key===active)?.explain}</div></div>}
      {!active&&<div className={styles.legendNote}>Click Before/After to understand why balancing matters.</div>}
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

/* ── EDA Viz Components (proper React components with hooks) ── */
function OutlierViz() {
  const [hov, setHov] = useState(null);
  const pts = [[5,120],[8,200],[12,800],[18,1200],[22,5000],[28,800],[35,9800],[40,200],[42,25691],[48,400]];
  const maxY = 25691, W = 380, H = 120;
  const getX = x => 28 + (x/50)*(W-36);
  const getY = y => (H-14) - (y/maxY)*((H-14)-4);
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:'block'}} onMouseLeave={()=>setHov(null)}>
      <line x1="28" y1="4" x2="28" y2={H-14} stroke="#eee" strokeWidth="1"/>
      <line x1="28" y1={H-14} x2={W-8} y2={H-14} stroke="#eee" strokeWidth="1"/>
      <line x1="28" y1="22" x2={W-8} y2="22" stroke="#e8729a44" strokeWidth="1" strokeDasharray="4,3"/>
      <text x="30" y="19" fontSize="6" fill="#e8729a88">IQR upper bound</text>
      {pts.map(([x,y],i)=>{
        const cx=getX(x), cy=getY(y), isOut=y>5000;
        return(
          <circle key={i} cx={cx} cy={cy} r={hov===i?6:isOut?4:2}
            fill={isOut?'#e8729a':'#5b8db8'} opacity={0.85}
            style={{cursor:isOut?'pointer':'default',transition:'r 0.15s'}}
            onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}/>
        );
      })}
      {hov!==null&&(()=>{
        const [x,y]=pts[hov], cx=getX(x), cy=getY(y), isOut=y>5000;
        const tx = cx > W-130 ? cx-120 : cx+8;
        return(
          <g>
            <rect x={tx} y={cy-18} width={112} height={22} fill="white" stroke={isOut?'#e8729a':'#5b8db8'} strokeWidth="1" rx="3"/>
            <text x={tx+6} y={cy-8} fontSize="7" fill="#1a1a1a" fontWeight="600">${y.toLocaleString()}</text>
            <text x={tx+6} y={cy+1} fontSize="6" fill={isOut?'#e8729a':'#888'}>{isOut?'Outlier detected':'Normal transaction'}</text>
          </g>
        );
      })()}
      <text x="28" y={H-3} fontSize="6" fill="#bbb">0h</text>
      <text x={W/2} y={H-3} fontSize="6" fill="#bbb">25h</text>
      <text x={W-20} y={H-3} fontSize="6" fill="#bbb">50h</text>
    </svg>
  );
}

function CorrelationViz() {
  const [hovCell, setHovCell] = useState(null);
  const n=8, cellSize=14, cellGap=2, padL=28, padT=20, W=380;
  const labels=['V1','V2','V3','V4','V5','V6','V14','Class'];
  return (
    <svg width="100%" viewBox={`0 0 ${W} 140`} style={{display:'block'}}>
      {labels.map((l,i)=>(
        <text key={`rl${i}`} x={padL-4} y={padT+i*(cellSize+cellGap)+cellSize/2+3} textAnchor="end" fontSize="6" fill="#bbb">{l}</text>
      ))}
      {labels.map((l,j)=>(
        <text key={`cl${j}`} x={padL+j*(cellSize+cellGap)+cellSize/2} y={padT-5} textAnchor="middle" fontSize="6" fill="#bbb">{l}</text>
      ))}
      {Array.from({length:n}).map((_,i)=>
        Array.from({length:n}).map((_,j)=>{
          const v=Math.abs(Math.cos((i+1)*(j+1)*0.5));
          const highlight=(i===7||j===7)&&i!==j;
          const isHov=hovCell&&hovCell[0]===i&&hovCell[1]===j;
          return(
            <rect key={`${i}-${j}`}
              x={padL+j*(cellSize+cellGap)} y={padT+i*(cellSize+cellGap)}
              width={cellSize} height={cellSize}
              fill={highlight?'#e8729a':i===j?'#1a1a1a':'#5b8db8'}
              opacity={isHov?1:highlight?0.85:i===j?1:v*0.6+0.1}
              rx="1" style={{cursor:'pointer',transition:'opacity 0.15s'}}
              onMouseEnter={()=>setHovCell([i,j])} onMouseLeave={()=>setHovCell(null)}/>
          );
        })
      )}
      {hovCell&&(()=>{
        const [i,j]=hovCell;
        const v=Math.abs(Math.cos((i+1)*(j+1)*0.5));
        const highlight=(i===7||j===7)&&i!==j;
        const x=padL+j*(cellSize+cellGap), y=padT+i*(cellSize+cellGap);
        const tx = x > W-120 ? x-108 : x+16;
        return(
          <g>
            <rect x={tx} y={y-2} width={100} height={26} fill="white" stroke={highlight?'#e8729a':'#5b8db8'} strokeWidth="1" rx="3"/>
            <text x={tx+6} y={y+9} fontSize="7" fill="#1a1a1a" fontWeight="600">{labels[i]} vs {labels[j]}</text>
            <text x={tx+6} y={y+19} fontSize="6" fill={highlight?'#e8729a':'#888'}>{highlight?'r = 0.8+ (fraud signal)':'r = '+v.toFixed(2)}</text>
          </g>
        );
      })()}
      <text x={padL} y="133" fontSize="6" fill="#bbb">Pink = correlated with Class (fraud target)</text>
    </svg>
  );
}

function TimeViz() {
  const [hovHour, setHovHour] = useState(null);
  const pts=[2,3,5,8,14,20,28,35,40,38,30,28,24,20,28,35,38,32,20,12,7,4,3,2];
  const W=380, H=100, n=pts.length, maxV=Math.max(...pts), padL=16, padB=18;
  const getX=i=>(i/(n-1))*(W-padL*2)+padL;
  const getY=v=>H-padB-(v/maxV)*(H-padB-10);
  const pathD=pts.map((v,i)=>`${i===0?'M':'L'}${getX(i)},${getY(v)}`).join(' ');
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:'block'}} onMouseLeave={()=>setHovHour(null)}>
      <path d={pathD} fill="none" stroke="#9060c0" strokeWidth="2"/>
      <path d={`${pathD} L${getX(n-1)},${H-padB} L${getX(0)},${H-padB} Z`} fill="#9060c0" opacity="0.08"/>
      <line x1={padL} y1={H-padB} x2={W-padL} y2={H-padB} stroke="#eee" strokeWidth="1"/>
      {pts.map((v,i)=>(
        <rect key={i} x={getX(i)-8} y={10} width={16} height={H-padB-10} fill="transparent"
          style={{cursor:'crosshair'}} onMouseEnter={()=>setHovHour(i)}/>
      ))}
      {hovHour!==null&&(()=>{
        const x=getX(hovHour), y=getY(pts[hovHour]), isFraud=hovHour<4||hovHour>20;
        const tx = x > W-130 ? x-120 : x+8;
        return(
          <g>
            <line x1={x} y1={10} x2={x} y2={H-padB} stroke="#9060c060" strokeWidth="1" strokeDasharray="3,2"/>
            <circle cx={x} cy={y} r={4} fill="#9060c0"/>
            <rect x={tx} y={y-18} width={112} height={26} fill="white" stroke="#9060c0" strokeWidth="1" rx="3"/>
            <text x={tx+6} y={y-7} fontSize="7" fill="#1a1a1a" fontWeight="600">{hovHour}:00 — {hovHour+1}:00</text>
            <text x={tx+6} y={y+2} fontSize="6" fill={isFraud?'#e8729a':'#888'}>{isFraud?'Higher fraud risk period':'Normal activity'}</text>
          </g>
        );
      })()}
      <text x={padL} y={H-4} fontSize="6" fill="#bbb">0h</text>
      <text x={W/2-6} y={H-4} fontSize="6" fill="#bbb">12h</text>
      <text x={W-22} y={H-4} fontSize="6" fill="#bbb">24h</text>
      <text x="68" y="18" fontSize="6" fill="#9060c0" fontWeight="700">Morning peak</text>
      <text x="210" y="18" fontSize="6" fill="#9060c0" fontWeight="700">Afternoon peak</text>
    </svg>
  );
}

/* ── Interactive EDA Cards ── */
function EdaCards() {
  const [active, setActive] = useState('outlier');
  const cards = [
    { key:'outlier', title:'Outliers', icon:'◈', color:'#5b8db8',
      stat:'$25,691', statLabel:'Max transaction',
      summary:'IQR method flags extreme amounts. Robust Scaler applied.',
      detail:'IQR = Q3 - Q1. Bounds: Lower = Q1 - 1.5×IQR, Upper = Q3 + 1.5×IQR. Mean = $88.35 but max = $25,691 — extreme skew. Robust Scaler prevents distortion of model training.',
      Viz: OutlierViz },
    { key:'correlation', title:'Correlation', icon:'◉', color:'#5a9e82',
      stat:'r > 0.8', statLabel:'Top predictors',
      summary:'31-feature heatmap. Payment history & collateral = top signals.',
      detail:'V14 and V17 show strongest negative correlation with fraud class. PCA reduced 15 raw features to 8 components retaining 95% variance. Hover cells to explore relationships.',
      Viz: CorrelationViz },
    { key:'time', title:'Time Pattern', icon:'◷', color:'#9060c0',
      stat:'2× higher', statLabel:'Overnight fraud rate',
      summary:'Bimodal distribution — peaks at business hours.',
      detail:'Two clear peaks: 9-12h and 14-17h. Overnight (0-6h) transactions are sparse but have disproportionately higher fraud rate — key feature for real-time monitoring.',
      Viz: TimeViz },
  ];
  const activeCard = cards.find(c=>c.key===active);
  return (
    <div className={styles.edaInteractive}>
      <div className={styles.eda3col}>
        {cards.map(c=>(
          <div key={c.key}
            className={`${styles.edaCard} ${active===c.key?styles.edaCardActive:''}`}
            style={{borderColor:active===c.key?c.color:'#ebebeb',cursor:'pointer'}}
            onClick={()=>setActive(c.key)}>
            <div className={styles.edaCardHeader}>
              <span className={styles.edaIcon} style={{color:c.color}}>{c.icon}</span>
              <span className={styles.edaTitle}>{c.title}</span>
              <span className={styles.edaArrow}>{active===c.key?'▲':'▼'}</span>
            </div>
            <div className={styles.edaStat} style={{color:c.color}}>{c.stat}</div>
            <div className={styles.edaStatLabel}>{c.statLabel}</div>
            <div className={styles.edaDesc}>{c.summary}</div>
          </div>
        ))}
      </div>
      {activeCard&&(
        <div className={styles.edaDetail} style={{borderLeftColor:activeCard.color}}>
          <div className={styles.edaDetailViz}><activeCard.Viz/></div>
          <div className={styles.edaDetailText}>
            <div className={styles.edaDetailTitle} style={{color:activeCard.color}}>{activeCard.title}</div>
            <div className={styles.edaDetailBody}>{activeCard.detail}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Interactive Pipeline Steps ── */
function PipelineSteps({steps, hasCharts}) {
  const [active, setActive] = useState(null);
  const stepNames = ['EDA','Data Preprocessing','Correlation Analysis','Train/Test Split','Imbalance Handling','Model Training','Evaluation'];
  const stepColors = ['#5b8db8','#5a9e82','#9060c0','#f0a030','#e8729a','#1a1a1a','#5b8db8'];
  return (
    <div className={styles.panelBlock}>
      <span className={styles.panelLabel}>Pipeline</span>
      <div className={styles.pipelineGrid}>
        {steps.map((step,i)=>{
          const isActive = active===i;
          const color = stepColors[i] || '#888';
          const name = stepNames[i] || `Step ${i+1}`;
          return(
            <div key={i} className={`${styles.pipelineRow} ${isActive?styles.pipelineRowActive:''}`}
              style={{borderLeftColor:isActive?color:'#ebebeb'}}
              onClick={()=>setActive(isActive?null:i)}>
              <div className={styles.pipelineRowLeft}>
                <div className={styles.pipelineNum} style={{background:isActive?color:'#ebebeb',color:isActive?'#fff':'#888'}}>{i+1}</div>
                <div className={styles.pipelineStepName} style={{color:isActive?color:'#1a1a1a'}}>{name}</div>
                <div className={styles.pipelineArrow}>{isActive?'▲':'▼'}</div>
              </div>
              {isActive&&(
                <div className={styles.pipelineDetail}>
                  <div className={styles.pipelineDetailText}>{step.includes(':')?step.split(':').slice(1).join(':').trim():step}</div>
                  {i===4&&hasCharts&&<SmoteChart/>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Real-world Parallel Cases ── */
function ParallelCases() {
  const [active, setActive] = useState(null);
  const cases = [
    {
      id:0, industry:'Banking · Vietnam', color:'#e8729a',
      title:'Vietcombank — Digital Fraud Surge 2023',
      tag:'Same problem, scaled',
      desc:'VCB reported 340% increase in card fraud attempts following digital banking expansion.',
      ref:'State Bank of Vietnam Annual Report 2023 · sbv.gov.vn',
      refUrl:'https://www.sbv.gov.vn',
      analysis:'VCB deployed ML-based transaction scoring and reduced fraud losses by 60% within 6 months. They faced the same core challenge as this project: extreme class imbalance in a rapidly expanding credit portfolio. Key difference: VCB added behavioral biometrics (typing speed, device fingerprinting) as additional features — a natural next step for Agribank.',
      approach:'Gradient Boosting + behavioral biometrics',
      relevance:'Validates this approach for Vietnamese banking context',
    },
    {
      id:1, industry:'Fintech · Global', color:'#5b8db8',
      title:'PayPal — Fraud Detection at Scale',
      tag:'Industry benchmark',
      desc:'40M+ transactions/day, fraud rate under 0.32%, 95%+ detected in real-time.',
      ref:'PayPal Technology Blog · medium.com/paypal-tech',
      refUrl:'https://medium.com/paypal-tech',
      analysis:'PayPal uses ensemble models almost identical to this study's approach — Random Forest as base with XGBoost boosting. Critical insight: they weight false negatives 15× heavier than false positives in their loss function, directly reflecting the asymmetric cost of missed fraud. This is the cost-sensitive approach this project should adopt in v2.',
      approach:'Random Forest + XGBoost + graph anomaly detection',
      relevance:'Direct benchmark — same model family, production-validated',
    },
    {
      id:2, industry:'Banking · SE Asia', color:'#5a9e82',
      title:'DBS Bank — AI Credit Risk for SMEs',
      tag:'Closest business context',
      desc:'Replaced manual credit review for SME loans. Accuracy: 91%. Review time: 3 days → 4 hours.',
      ref:'DBS Group Research · dbs.com/research',
      refUrl:'https://www.dbs.com/research',
      analysis:'DBS used Logistic Regression + Decision Tree ensemble with SMOTE — exactly this project's methodology. Their NPL ratio dropped 1.2 percentage points after deployment. Most relevant finding: analyst trust was the biggest adoption barrier, not model performance. They solved this with SHAP explanations showing which features drove each decision — the exact next step recommended here.',
      approach:'LR + Decision Tree + SMOTE (same as this project)',
      relevance:'Identical methodology, proven in production banking environment',
    },
  ];
  const activeCase = active!==null ? cases[active] : null;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <div className={styles.parallelGrid}>
        {cases.map(c=>(
          <div key={c.id}
            className={`${styles.parallelCard} ${active===c.id?styles.parallelCardActive:''}`}
            style={{borderTopColor:active===c.id?c.color:'#ebebeb', cursor:'pointer'}}
            onClick={()=>setActive(active===c.id?null:c.id)}>
            <div className={styles.parallelIndustry} style={{color:c.color}}>{c.industry}</div>
            <div className={styles.parallelTitle}>{c.title}</div>
            <div className={styles.parallelTagBadge} style={{background:c.color+'18',color:c.color}}>{c.tag}</div>
            <div className={styles.parallelDesc}>{c.desc}</div>
            <div className={styles.parallelExpandHint}>{active===c.id?'▲ collapse':'▼ see analysis'}</div>
          </div>
        ))}
      </div>
      {activeCase&&(
        <div className={styles.parallelDetail} style={{borderLeftColor:activeCase.color}}>
          <div className={styles.parallelDetailInner}>
            <div className={styles.parallelDetailAnalysis}>{activeCase.analysis}</div>
            <div className={styles.parallelDetailMeta}>
              <div className={styles.parallelApproachRow}>
                <span className={styles.parallelApproach}>Approach:</span> {activeCase.approach}
              </div>
              <div className={styles.parallelRelevanceRow}>
                <span className={styles.parallelApproach} style={{color:activeCase.color}}>Why relevant:</span> {activeCase.relevance}
              </div>
              <a href={activeCase.refUrl} target="_blank" rel="noopener noreferrer" className={styles.parallelRefLink}>
                ↗ {activeCase.ref}
              </a>
            </div>
          </div>
        </div>
      )}
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
  const [contextHighlight, setContextHighlight] = useState(null);
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
  const getProjectTab=id=>activeProjectTab[id]||'context';
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
            {expandedProject!==null&&(
              <button className={styles.showAllBtn} onClick={()=>setExpandedProject(null)}>← Show all projects</button>
            )}
            {filteredProjects.length===0?<p className={styles.noResults}>No projects found.</p>:(
              <div className={styles.projectsList}>
                {filteredProjects.filter(p=>expandedProject===null||p.id===expandedProject).map(project=>{
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
                          <button className={styles.expandBtn} onClick={()=>{setExpandedProject(isExpanded?null:project.id);if(!isExpanded){setProjectTab(project.id,'context');setContextHighlight(project.id);setTimeout(()=>setContextHighlight(null),1500);}}}>
                            {isExpanded?'↑ Close':'Explore Project'}
                          </button>
                        </div>
                      </div>

                      {isExpanded&&(
                        <div className={styles.projectPanel}>
                          <div className={styles.panelTabs}>
                            {['context','approach','analysis','methodology','results','outcome'].map(t=>(
                              <button key={t} className={`${styles.panelTab} ${currentTab===t?styles.panelTabActive:''}`} onClick={()=>setProjectTab(project.id,t)}>
                                {t.charAt(0).toUpperCase()+t.slice(1)}
                              </button>
                            ))}
                          </div>

                          {/* ── CONTEXT ── */}
                          {currentTab==='context'&&(
                            <div className={`${styles.panelContent} ${contextHighlight===project.id?styles.panelContentHighlight:''}`}>
                              <div className={styles.problemBox}>
                                <div className={styles.problemLabel}>The Problem</div>
                                <div className={styles.problemText}>
                                  {hasCharts
                                    ? "Vietnam's rapid credit expansion has intensified fraud risk in personal credit portfolios. This study addresses a critical gap: Agribank Saigon Branch lacked an automated, data-driven early-warning system for credit card fraud detection, relying instead on manual review processes vulnerable to human error."
                                    : project.context}
                                </div>
                              </div>
                              <div className={styles.statRow}>
                                <div className={styles.statBox}>
                                  <div className={styles.statNum} style={{color:'#e8729a'}}>0.17%</div>
                                  <div className={styles.statLabel}>Fraud Rate</div>
                                </div>
                                <div className={styles.statBox}>
                                  <div className={styles.statNum}>Manual</div>
                                  <div className={styles.statLabel}>Detection Method</div>
                                </div>
                                <div className={styles.statBox}>
                                  <div className={styles.statNum}>NPL</div>
                                  <div className={styles.statLabel}>1.5% (below avg)</div>
                                </div>
                                <div className={styles.statBox}>
                                  <div className={styles.statNum}>Tier 1</div>
                                  <div className={styles.statLabel}>Branch Rank</div>
                                </div>
                              </div>
                              {project.supervisor&&(
                                <div className={styles.contextMeta}>
                                  <span>Supervisor: {project.supervisor}</span>
                                  <span>{project.institution} / {project.period}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* ── APPROACH ── */}
                          {currentTab==='approach'&&(
                            <div className={styles.panelContent}>
                              {project.researchQuestion&&(
                                <div className={styles.problemBox}>
                                  <div className={styles.problemLabel}>Research Question</div>
                                  <div className={styles.problemText}>{project.researchQuestion}</div>
                                </div>
                              )}
                              <div className={styles.approachGrid}>
                                {[
                                  {icon:'01', label:'Classify', desc:'Binary classification — Fraud (1) vs Legitimate (0)'},
                                  {icon:'02', label:'Handle Imbalance', desc:'SMOTE oversampling to balance 0.17% minority class'},
                                  {icon:'03', label:'Compare Models', desc:'Logistic Regression, Decision Tree, Random Forest'},
                                  {icon:'04', label:'Optimize Recall', desc:'Maximize fraud detection, minimize false positives'},
                                ].map((a,i)=>(
                                  <div key={i} className={styles.approachCard}>
                                    <div className={styles.approachIcon}>{a.icon}</div>
                                    <div className={styles.approachLabel}>{a.label}</div>
                                    <div className={styles.approachDesc}>{a.desc}</div>
                                  </div>
                                ))}
                              </div>
                              <div className={styles.toolsRow}>
                                <span className={styles.panelLabel}>Tools</span>
                                <div className={styles.toolsList} style={{marginTop:8}}>
                                  {project.tools?.map((t,i)=><span key={i} className={styles.tool} style={{fontSize:13,padding:'5px 12px'}}>{t}</span>)}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ── ANALYSIS ── */}
                          {currentTab==='analysis'&&(
                            <div className={styles.panelContent}>
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
                                    <div className={styles.statLabel}>Window</div>
                                  </div>
                                </div>
                              )}
                              {hasCharts&&<PieChart/>}
                              <EdaCards/>
                            </div>
                          )}

                          {/* ── METHODOLOGY ── */}
                          {currentTab==='methodology'&&(
                            <div className={styles.panelContent}>
                              {project.methodology&&<PipelineSteps steps={project.methodology} hasCharts={hasCharts}/>}
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
                                  <div className={styles.heroSub}>vs 1,393 (LR+SMOTE)</div>
                                </div>
                              </div>
                              {hasCharts&&<ModelCompareChart/>}
                              {hasCharts&&<ConfusionMatrix/>}
                            </div>
                          )}

                          {/* ── OUTCOME ── */}
                          {currentTab==='outcome'&&(
                            <div className={styles.panelContent}>

                              {/* 1. Impact first */}
                              <div className={styles.panelBlock}>
                                <span className={styles.panelLabel}>Impact</span>
                                <div className={styles.impactRow}>
                                  <div className={styles.impactStat} style={{borderColor:'#5a9e82'}}>
                                    <div className={styles.impactNum} style={{color:'#5a9e82'}}>99.98%</div>
                                    <div className={styles.impactLabel}>Specificity</div>
                                    <div className={styles.impactSub}>Legitimate customers — zero disruption</div>
                                  </div>
                                  <div className={styles.impactStat} style={{borderColor:'#e8729a'}}>
                                    <div className={styles.impactNum} style={{color:'#e8729a'}}>84%</div>
                                    <div className={styles.impactLabel}>Fraud Caught</div>
                                    <div className={styles.impactSub}>Before financial loss occurs</div>
                                  </div>
                                  <div className={styles.impactStat} style={{borderColor:'#5b8db8'}}>
                                    <div className={styles.impactNum} style={{color:'#5b8db8'}}>~99%</div>
                                    <div className={styles.impactLabel}>Workload Cut</div>
                                    <div className={styles.impactSub}>Manual review reduced</div>
                                  </div>
                                  <div className={styles.impactStat} style={{borderColor:'#9060c0'}}>
                                    <div className={styles.impactNum} style={{color:'#9060c0'}}>10</div>
                                    <div className={styles.impactLabel}>False Positives</div>
                                    <div className={styles.impactSub}>vs 1,393 from Logistic Regression</div>
                                  </div>
                                </div>
                                <div className={styles.tierGrid}>
                                  <div className={styles.tierCard} style={{borderTopColor:'#5a9e82'}}>
                                    <div className={styles.tierLabel} style={{color:'#5a9e82'}}>Now: Deploy</div>
                                    <div className={styles.tierDesc}>3-tier alert system. Auto-approve / Flag / Block replacing manual review.</div>
                                  </div>
                                  <div className={styles.tierCard} style={{borderTopColor:'#f0a030'}}>
                                    <div className={styles.tierLabel} style={{color:'#f0a030'}}>Next: Explain</div>
                                    <div className={styles.tierDesc}>SHAP explainability for regulatory compliance and analyst trust.</div>
                                  </div>
                                  <div className={styles.tierCard} style={{borderTopColor:'#5b8db8'}}>
                                    <div className={styles.tierLabel} style={{color:'#5b8db8'}}>Future: Real-time</div>
                                    <div className={styles.tierDesc}>Sub-second stream scoring pipeline as transactions happen.</div>
                                  </div>
                                </div>
                              </div>

                              {/* 2. Reflection */}
                              <div className={styles.panelBlock}>
                                <span className={styles.panelLabel}>Reflection</span>
                                <div className={styles.reflectGrid}>
                                  <div className={styles.reflectCard} style={{borderTopColor:'#5a9e82'}}>
                                    <div className={styles.reflectHeader} style={{color:'#5a9e82'}}>
                                      <span>✓</span> What worked
                                    </div>
                                    <ul className={styles.reflectList}>
                                      <li><span className={styles.reflectHL}>SMOTE + Random Forest</span> solved class imbalance elegantly — recall jumped from 63% to 84% while keeping false positives at just 10</li>
                                      <li><span className={styles.reflectHL}>Robust Scaler</span> was the right call — standard normalization would have been distorted by $25,691 outliers</li>
                                      <li>Framing results around <span className={styles.reflectHL}>operational cost (FP count)</span> rather than accuracy % was far more persuasive to bank leadership</li>
                                    </ul>
                                  </div>
                                  <div className={styles.reflectCard} style={{borderTopColor:'#e8729a'}}>
                                    <div className={styles.reflectHeader} style={{color:'#e8729a'}}>
                                      <span>→</span> What I would do differently
                                    </div>
                                    <ul className={styles.reflectList}>
                                      <li>Add <span className={styles.reflectHL}>real-time scoring pipeline</span> — fraud detection value degrades with delay; most losses occur within 30 minutes</li>
                                      <li>Use <span className={styles.reflectHL}>cost-sensitive loss function</span> weighting missed fraud 10× higher than false positives, reflecting actual financial stakes</li>
                                      <li>Build <span className={styles.reflectHL}>SHAP explainability layer</span> so analysts can understand why a transaction was flagged — critical for regulatory compliance</li>
                                    </ul>
                                  </div>
                                </div>
                              </div>

                              {/* 3. Real-world parallels */}
                              <div className={styles.panelBlock}>
                                <span className={styles.panelLabel}>Real-world Parallels <span style={{fontWeight:400,color:'#bbb',fontSize:9,letterSpacing:0}}>click a case</span></span>
                                <ParallelCases/>
                              </div>

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
