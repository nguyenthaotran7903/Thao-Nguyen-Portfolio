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

/* ── P3 Parallel Cases ── */
function P3ParallelCases() {
  const [active, setActive] = useState(null);
  const cases = [
    {
      id:0, industry:'Banking Research · Global', color:'#5b8db8',
      title:'Basel III IT Risk Framework',
      tag:'Regulatory context',
      desc:'Basel III requires banks to assess operational risk from IT systems, directly validating the DAP finding that e-payment expansion increases credit exposure.',
      ref:'Bank for International Settlements · bis.org/basel_framework',
      refUrl:'https://www.bis.org/basel_framework/',
      analysis:'The DAP coefficient (+0.206) aligns precisely with Basel III operational risk concerns: rapid digitization without adequate controls creates new risk vectors. Basel III mandates that banks hold capital against IT-related operational risk — implying regulators already knew what this regression confirmed empirically. This study provides Vietnamese-specific quantification of that theoretical concern. The policy implication: DAP expansion must be paired with increased operational risk capital buffers.',
      approach:'Operational risk capital requirements tied to IT system complexity',
      relevance:'Validates DAP finding with global regulatory framework',
    },
    {
      id:1, industry:'Fintech Research · Vietnam', color:'#e8729a',
      title:'SBV Digital Banking Circular 2023',
      tag:'Direct policy link',
      desc:'State Bank of Vietnam Circular 09/2023 mandates IT risk assessment for all commercial banks — directly citing e-payment risk as a priority concern.',
      ref:'State Bank of Vietnam · sbv.gov.vn',
      refUrl:'https://www.sbv.gov.vn',
      analysis:'SBV Circular 09/2023 requires banks to implement comprehensive IT risk management frameworks specifically for e-payment systems — precisely the risk identified by the DAP coefficient in this study. The timing is notable: the circular was issued as Vietnamese banks were rapidly expanding QR payment and mobile banking. This study provides empirical evidence that the regulatory concern was warranted: each unit increase in DAP index raises RIST by 0.206 percentage points of bad debt ratio.',
      approach:'Mandatory IT risk assessment + e-payment monitoring requirements',
      relevance:'This study directly supports the regulatory rationale behind SBV Circular 09/2023',
    },
    {
      id:2, industry:'Academic · SE Asia', color:'#5a9e82',
      title:'IT-Credit Risk Studies in Emerging Markets',
      tag:'Literature gap filled',
      desc:'Prior studies examined IT in banking but none combined COB + BAD + DAP simultaneously in a single regularized model for Vietnamese banks.',
      ref:'Journal of Social Research and Behavioral Sciences · Altunoz (2024)',
      refUrl:'https://doi.org/10.52096/jsrbs.10.21.32',
      analysis:'Altunoz (2024) and similar studies use logistic regression or neural networks for credit risk prediction — but focus on customer-level data (income, credit history). This study takes a different angle: bank-level IT infrastructure as predictors. The Ridge approach is novel in this literature — Moumane et al. (2024) specifically identified regularized regression as an underexplored method for banking credit risk. This paper directly addresses that gap while adding a Vietnamese emerging-market context absent from most existing studies.',
      approach:'Ridge regularized regression — novel method in Vietnamese banking literature',
      relevance:'Fills identified research gap; adds emerging market evidence to IT-credit risk literature',
    },
  ];
  const activeCase = active!==null ? cases[active] : null;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <div className={styles.parallelGrid}>
        {cases.map(c=>(
          <div key={c.id}
            className={`${styles.parallelCard} ${active===c.id?styles.parallelCardActive:''}`}
            style={{borderTopColor:active===c.id?c.color:'#ebebeb',cursor:'pointer'}}
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
              <div className={styles.parallelApproachRow}><span className={styles.parallelApproach}>Approach:</span> {activeCase.approach}</div>
              <div className={styles.parallelRelevanceRow}><span className={styles.parallelApproach} style={{color:activeCase.color}}>Why relevant:</span> {activeCase.relevance}</div>
              <a href={activeCase.refUrl} target="_blank" rel="noopener noreferrer" className={styles.parallelRefLink}>↗ {activeCase.ref}</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* ══════════════════════════════════════════
   PROJECT 4 — AI Impact on Sharing Economy
   ══════════════════════════════════════════ */

function GSCAPathChart() {
  const [active, setActive] = useState(null);
  const paths = [
    { id:0, label:'SC → BAI', sector:'Shared Transportation', beta:0.385, color:'#5b8db8', note:'Strongest impact (β=0.385). Real-time AI optimization — dynamic pricing, route scheduling, predictive maintenance — yields the clearest measurable benefit in transportation.' },
    { id:1, label:'HS → BAI', sector:'Shared Accommodation', beta:0.295, color:'#5a9e82', note:'Second strongest (β=0.295). Recommendation systems and demand forecasting drive trust and booking efficiency. Personalization is the key AI lever in accommodation.' },
    { id:2, label:'SOS → BAI', sector:'Other Shared Services', beta:0.265, color:'#9060c0', note:'Positive but lower (β=0.265). Emerging sector — electronics, household, sports sharing. High AI potential (loadings 0.748–0.750) but market is still maturing.' },
  ];
  const W=380, H=130, barH=28, gap=14, padL=150, maxBeta=0.45;
  const info = active!==null ? paths[active] : null;
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>GSCA Path Coefficients (β) <span className={styles.chartHint}>click a path</span></div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",display:'block'}}>
        <line x1={padL} y1={8} x2={padL} y2={H-16} stroke="#eee" strokeWidth="1"/>
        {[0,0.1,0.2,0.3,0.4].map(v=>{
          const x=padL+(v/maxBeta)*(W-padL-16);
          return(<g key={v}><line x1={x} y1={8} x2={x} y2={H-16} stroke="#f0f0f0" strokeWidth="1"/><text x={x} y={H-4} textAnchor="middle" fontSize="6" fill="#bbb">{v}</text></g>);
        })}
        {paths.map((p,i)=>{
          const y=12+i*(barH+gap);
          const bW=(p.beta/maxBeta)*(W-padL-16);
          const isActive=active===i;
          return(
            <g key={i} style={{cursor:'pointer'}} onClick={()=>setActive(isActive?null:i)}>
              <text x={padL-8} y={y+barH/2+4} textAnchor="end" fontSize="8" fontWeight={isActive?700:500} fill={isActive?p.color:'#555'}>{p.label}</text>
              <rect x={padL} y={y} width={bW} height={barH} fill={isActive?p.color:p.color+'88'} rx="3" style={{transition:'all 0.15s'}}/>
              <text x={padL+bW+6} y={y+barH/2+4} fontSize="10" fontWeight="800" fill={p.color}>β={p.beta}</text>
              {isActive&&<rect x={padL-2} y={y-2} width={bW+4+36} height={barH+4} fill="none" stroke={p.color} strokeWidth="1.5" rx="4" opacity="0.4"/>}
            </g>
          );
        })}
      </svg>
      {info&&(<div className={styles.chartExplain} style={{borderLeftColor:info.color}}><div className={styles.chartExplainTitle} style={{color:info.color}}>{info.sector} — β = {info.beta}</div><div className={styles.chartExplainNote}>{info.note}</div></div>)}
      {!info&&<div className={styles.legendNote}>Transportation AI has the strongest impact. Click each path to explore why.</div>}
    </div>
  );
}

function SectorLoadingChart() {
  const [active, setActive] = useState(null);
  const [activeSector, setActiveSector] = useState('sc');
  const W=380, H=160, padL=44, padB=28;
  const sectors = [
    { key:'sc', label:'Transportation (SC)', color:'#5b8db8', items:[{name:'PDP',val:0.727,desc:'Demand forecasting & price optimization'},{name:'CS',val:0.690,desc:'Automated customer support'},{name:'AVE',val:0.674,desc:'User authentication & evaluation'},{name:'PMA',val:0.671,desc:'Predictive maintenance & repair'},{name:'SO',val:0.633,desc:'Schedule optimization'}] },
    { key:'hs', label:'Accommodation (HS)', color:'#5a9e82', items:[{name:'FDT',val:0.704,desc:'Demand forecasting & trend analysis'},{name:'PS',val:0.687,desc:'Recommendation system'},{name:'VAS',val:0.681,desc:'Enhanced authentication & security'},{name:'EVE',val:0.632,desc:'Enhanced user experience (chatbot)'}] },
    { key:'sos', label:'Other Services (SOS)', color:'#9060c0', items:[{name:'SH',val:0.750,desc:'Household item sharing platform'},{name:'SE',val:0.748,desc:'Electronics sharing platform'},{name:'SS',val:0.666,desc:'Sports equipment sharing'}] },
  ];
  const current = sectors.find(s=>s.key===activeSector);
  const maxVal=0.80, minVal=0.60;
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>AI Application Loadings by Sector <span className={styles.chartHint}>select sector · click bar</span></div>
      <div style={{display:'flex',gap:6,marginBottom:10}}>
        {sectors.map(s=>(
          <button key={s.key} onClick={()=>{setActiveSector(s.key);setActive(null);}} style={{flex:1,padding:'5px 4px',fontSize:9,fontWeight:activeSector===s.key?700:400,background:activeSector===s.key?s.color:'#f5f5f5',color:activeSector===s.key?'#fff':'#666',border:'none',borderRadius:4,cursor:'pointer',transition:'all 0.15s'}}>
            {s.label.split(' ')[0]}
          </button>
        ))}
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",display:'block'}}>
        {[0.60,0.65,0.70,0.75,0.80].map(v=>{
          const y=H-padB-((v-minVal)/(maxVal-minVal))*(H-padB-10);
          return(<g key={v}><line x1={padL} y1={y} x2={W-8} y2={y} stroke="#f0f0f0" strokeWidth="1"/><text x={padL-4} y={y+4} textAnchor="end" fontSize="6" fill="#bbb">{v}</text></g>);
        })}
        {current.items.map((item,i)=>{
          const bW=Math.floor((W-padL-16)/current.items.length)-6;
          const x=padL+8+i*(bW+6);
          const bH=((item.val-minVal)/(maxVal-minVal))*(H-padB-10);
          const y=H-padB-bH;
          const isActive=active===i;
          return(
            <g key={i} style={{cursor:'pointer'}} onClick={()=>setActive(isActive?null:i)}>
              <rect x={x} y={y} width={bW} height={bH} fill={isActive?current.color:current.color+'77'} rx="2" style={{transition:'all 0.15s'}}/>
              <text x={x+bW/2} y={y-4} textAnchor="middle" fontSize="8" fontWeight="700" fill={current.color}>{item.val}</text>
              <text x={x+bW/2} y={H-padB+12} textAnchor="middle" fontSize="8" fontWeight={isActive?700:400} fill={isActive?'#1a1a1a':'#666'}>{item.name}</text>
            </g>
          );
        })}
      </svg>
      {active!==null&&(<div className={styles.chartExplain} style={{borderLeftColor:current.color}}><div className={styles.chartExplainTitle} style={{color:current.color}}>{current.items[active].name} — Loading: {current.items[active].val}</div><div className={styles.chartExplainNote}>{current.items[active].desc}. Loading of {current.items[active].val} means this AI application is a strong, reliable indicator of overall sector benefit.</div></div>)}
      {active===null&&<div className={styles.legendNote}>Higher loading = AI application more tightly linked to overall sector benefit. Switch sectors above to compare.</div>}
    </div>
  );
}

function BAILoadingChart() {
  const [active, setActive] = useState(null);
  const dims = [
    {name:'BSO', label:'Other Services Benefit', val:0.820, color:'#9060c0', note:'Highest loading (0.820): AI benefit to other shared services is the most reliable indicator of overall AI benefit — suggesting untapped potential in this sector.'},
    {name:'BSH', label:'Accommodation Benefit',  val:0.816, color:'#5a9e82', note:'Second highest (0.816): AI-driven benefits in accommodation strongly reflect overall AI impact.'},
    {name:'BSC', label:'Transportation Benefit', val:0.797, color:'#5b8db8', note:'Third (0.797): Despite transportation having the strongest path coefficient (β=0.385), its benefit loading is slightly lower — impact is broad, not concentrated.'},
  ];
  const W=380, H=90, padL=60, maxVal=0.85, minVal=0.78;
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>BAI Benefit Dimension Loadings <span className={styles.chartHint}>click a bar</span></div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",display:'block'}}>
        {dims.map((d,i)=>{
          const bW=((d.val-minVal)/(maxVal-minVal))*(W-padL-20);
          const y=10+i*26;
          const isActive=active===i;
          return(
            <g key={i} style={{cursor:'pointer'}} onClick={()=>setActive(isActive?null:i)}>
              <text x={padL-6} y={y+11} textAnchor="end" fontSize="9" fontWeight={isActive?700:500} fill={isActive?d.color:'#555'}>{d.name}</text>
              <rect x={padL} y={y} width={bW} height={18} fill={isActive?d.color:d.color+'88'} rx="2" style={{transition:'all 0.15s'}}/>
              <text x={padL+bW+4} y={y+12} fontSize="8" fontWeight="700" fill={d.color}>{d.val}</text>
            </g>
          );
        })}
        <text x={padL} y={H-2} fontSize="6" fill="#bbb">Loadings 0.797–0.820 — all benefit dimensions tightly linked to overall AI impact</text>
      </svg>
      {active!==null&&(<div className={styles.chartExplain} style={{borderLeftColor:dims[active].color}}><div className={styles.chartExplainTitle} style={{color:dims[active].color}}>{dims[active].name} — {dims[active].label}: {dims[active].val}</div><div className={styles.chartExplainNote}>{dims[active].note}</div></div>)}
      {active===null&&<div className={styles.legendNote}>Click each dimension to understand what it means for the overall model.</div>}
    </div>
  );
}

function ModelFitCard() {
  const fits = [
    {name:'GFI', val:0.973, threshold:'>0.93', pass:true, color:'#5a9e82', note:'Goodness of Fit Index = 0.973 — well above 0.93 threshold. Model fits observed data very well.'},
    {name:'SRMR', val:0.046, threshold:'<0.08', pass:true, color:'#5b8db8', note:'Standardized Root Mean Square Residual = 0.046 — below 0.08. Small residuals confirm good fit.'},
    {name:'FIT', val:0.579, threshold:'—', pass:true, color:'#9060c0', note:'Overall FIT = 0.579. Structural model (FITs=0.441) + measurement model (FITm=0.622) both acceptable.'},
    {name:'AFIT', val:0.574, threshold:'—', pass:true, color:'#f0a030', note:'Adjusted FIT = 0.574. Penalizes model complexity — confirms the 3-sector framework is parsimonious.'},
  ];
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>GSCA Model Fit Indices</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8}}>
        {fits.map((f,i)=>(
          <div key={i} style={{background:'#fff',border:`1px solid ${f.color}44`,borderTop:`3px solid ${f.color}`,borderRadius:6,padding:'12px 10px'}}>
            <div style={{display:'flex',alignItems:'baseline',gap:6}}><div style={{fontSize:22,fontWeight:800,color:f.color}}>{f.val}</div><div style={{fontSize:9,color:f.pass?'#5a9e82':'#e8729a',fontWeight:700}}>{f.threshold} {f.pass?'✓':''}</div></div>
            <div style={{fontSize:10,fontWeight:700,color:'#1a1a1a',textTransform:'uppercase',letterSpacing:'0.5px',margin:'4px 0'}}>{f.name}</div>
            <div style={{fontSize:10,color:'#888',lineHeight:1.4}}>{f.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function P4ParallelCases() {
  const [active, setActive] = useState(null);
  const cases = [
    { id:0, industry:'Platform Economy · Global', color:'#5b8db8', title:'Uber & Grab — AI-Powered Dynamic Pricing', tag:'Transportation AI benchmark', desc:'Grab uses surge pricing algorithms that reduced driver idle time by 20% and cut average wait time under 4 minutes across Southeast Asia.', ref:'Grab Tech Blog · engineering.grab.com', refUrl:'https://engineering.grab.com', analysis:'This study found SC (transportation) has the strongest AI impact (β=0.385), with PDP (demand forecasting & pricing) as the highest-loading application (0.727). Grab and Uber prove this empirically at scale: their ML-based pricing and routing systems are precisely the "scheduling optimization" and "demand forecasting" constructs measured in this paper. The student respondents in HCMC — heavy Grab users — likely scored these constructs highly based on lived experience, which validates the survey instrument.', approach:'Real-time ML surge pricing + route optimization + driver-rider matching algorithms', relevance:'Direct real-world validation of the SC→BAI path and PDP loading finding' },
    { id:1, industry:'Hospitality Tech · Global', color:'#5a9e82', title:'Airbnb — Recommendation Engine & Dynamic Trust', tag:'Accommodation AI validation', desc:'Airbnb AI recommendation system increased booking conversion by 10%+ and host acceptance rates rose 15% after AI-assisted identity verification.', ref:'Airbnb Engineering · medium.com/airbnb-engineering', refUrl:'https://medium.com/airbnb-engineering', analysis:'The study found HS (accommodation) ranks second (β=0.295), driven by recommendation systems (PS=0.687) and enhanced authentication (VAS=0.681). Airbnb confirms these exact mechanisms: their recommendation engine matches guests to listings using 100+ signals, while their AI trust system directly corresponds to the VAS construct. This study quantifies the Vietnamese student perception of what Airbnb has already deployed globally.', approach:'Collaborative filtering + deep learning; facial recognition + document verification for trust', relevance:'Validates HS sector framework — accommodation AI loadings mirror Airbnb deployed systems' },
    { id:2, industry:'Peer-to-Peer Sharing · SE Asia', color:'#9060c0', title:'Shareitt & Circular Economy Platforms', tag:'Other services — untapped potential', desc:'Household and electronics sharing platforms using AI catalog recognition achieve 3x faster item discovery vs manual listing.', ref:'Ellen MacArthur Foundation — Circular Economy Report · ellenmacarthurfoundation.org', refUrl:'https://ellenmacarthurfoundation.org', analysis:'The study found SOS has the highest BAI loading (BSO=0.820) despite the lowest path coefficient (β=0.265) — suggesting students perceive strong AI potential but current adoption is low. This mirrors the global P2P goods sharing market: AI-powered item recognition and peer trust systems exist (Shareitt, Peerby) but are barely adopted in Vietnam. The gap between high loading and lower path coefficient is itself a key finding: AI potential exceeds current deployment in this sector.', approach:'Computer vision for item cataloging + availability prediction + peer reputation scoring', relevance:'Explains the BSO=0.820 loading despite lower SOS path coefficient — high potential, low current adoption' },
  ];
  const activeCase = active!==null ? cases[active] : null;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <div className={styles.parallelGrid}>
        {cases.map(c=>(
          <div key={c.id} className={`${styles.parallelCard} ${active===c.id?styles.parallelCardActive:''}`} style={{borderTopColor:active===c.id?c.color:'#ebebeb',cursor:'pointer'}} onClick={()=>setActive(active===c.id?null:c.id)}>
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
              <div className={styles.parallelApproachRow}><span className={styles.parallelApproach}>Approach:</span> {activeCase.approach}</div>
              <div className={styles.parallelRelevanceRow}><span className={styles.parallelApproach} style={{color:activeCase.color}}>Why relevant:</span> {activeCase.relevance}</div>
              <a href={activeCase.refUrl} target="_blank" rel="noopener noreferrer" className={styles.parallelRefLink}>↗ {activeCase.ref}</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* ══════════════════════════════════════════
   PROJECT 5 — Panel Data Credit Risk
   ══════════════════════════════════════════ */

function P5DriverChart() {
  const [active, setActive] = useState(null);
  const drivers = [
    {
      id:0, name:'Past Bad Loans', beta:0.496, color:'#5b8db8',
      plain:'If a bank had high bad debt last year, it will almost certainly have high bad debt again this year.',
      detail:'beta=0.496 means half of this year\'s bad debt is explained by last year\'s bad debt alone. Risk does not disappear. Banks that ignore their own history are flying blind.',
      action:'Monitor trend, not just current snapshot'
    },
    {
      id:1, name:'Unemployment Rate', beta:0.0025, color:'#f0a030',
      plain:'When more people lose jobs, banks get hit with more unpaid loans. Borrowers cannot repay what they do not earn.',
      detail:'Each 1% rise in unemployment adds 0.0025pp to bad debt ratio. Small per unit, but unemployment swings of 5 to 10% can matter significantly across the whole banking system.',
      action:'Watch macroeconomic signals, not just bank-specific data'
    },
    {
      id:2, name:'Inflation', beta:0.0016, color:'#9060c0',
      plain:'Rising prices eat into borrowers\' real income. Even people with stable jobs may struggle to repay loans when everything costs more.',
      detail:'beta=0.0016 per 1% inflation. Like unemployment, the compounding effect across high-inflation periods creates meaningful pressure on default rates.',
      action:'Stress-test loan books against inflation scenarios'
    },
    {
      id:3, name:'Bank Size', beta:-0.0014, color:'#5a9e82',
      plain:'Larger banks have lower bad debt rates. They have more resources to screen borrowers carefully and diversify across more customers.',
      detail:'beta=-0.0014 (negative = protective). Bigger banks benefit from economies of scale in credit assessment and can absorb individual defaults better.',
      action:'Small banks need stricter credit standards to compensate'
    },
  ];
  const info = active !== null ? drivers[active] : null;
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>What Drives Bank Bad Debt? <span className={styles.chartHint}>click each factor</span></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8,marginBottom:10}}>
        {drivers.map((d,i)=>(
          <div key={i} onClick={()=>setActive(active===i?null:i)}
            style={{border:`2px solid ${active===i?d.color:'#ebebeb'}`,borderRadius:6,padding:'12px 14px',cursor:'pointer',background:active===i?d.color+'0d':'#fff',transition:'all 0.15s'}}>
            <div style={{fontSize:11,fontWeight:700,color:active===i?d.color:'#1a1a1a',marginBottom:6}}>{d.name}</div>
            <div style={{fontSize:10,color:'#666',lineHeight:1.55}}>{d.plain}</div>
            <div style={{marginTop:6,fontSize:9,fontWeight:700,color:d.color}}>
              {d.beta>0?'Increases risk':'Reduces risk'} — beta={d.beta>0?'+':''}{d.beta}
            </div>
          </div>
        ))}
      </div>
      {info&&(
        <div className={styles.chartExplain} style={{borderLeftColor:info.color}}>
          <div className={styles.chartExplainTitle} style={{color:info.color}}>{info.name}</div>
          <div className={styles.chartExplainNote}>{info.detail}</div>
          <div style={{marginTop:8,fontSize:10,fontWeight:700,color:info.color}}>{info.action}</div>
        </div>
      )}
      {!info&&<div className={styles.legendNote}>Each factor tells a different story about why banks fail. Click to understand the so what.</div>}
    </div>
  );
}

function P5BankSizeViz() {
  const [hov, setHov] = useState(null);
  const banks = [
    {name:'VietinBank', size:95, npl:1.8, color:'#5b8db8'},
    {name:'BIDV',       size:90, npl:1.6, color:'#5b8db8'},
    {name:'Vietcombank',size:88, npl:1.2, color:'#5b8db8'},
    {name:'MB Bank',    size:65, npl:2.1, color:'#5a9e82'},
    {name:'TPBank',     size:58, npl:2.3, color:'#5a9e82'},
    {name:'VPBank',     size:55, npl:3.4, color:'#9060c0'},
    {name:'OCB',        size:38, npl:3.8, color:'#f0a030'},
    {name:'KienLong',   size:28, npl:4.2, color:'#1a6b5c'},
    {name:'VietBank',   size:22, npl:5.1, color:'#1a6b5c'},
  ];
  const W=380, H=140, padL=36, padB=28, padR=16;
  const getX=s=>padL+(s/100)*(W-padL-padR);
  const getY=n=>H-padB-(n/6)*(H-padB-12);
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>Bank Size vs Bad Debt Rate <span className={styles.chartHint}>hover to explore</span></div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",display:'block'}} onMouseLeave={()=>setHov(null)}>
        {[1,2,3,4,5].map(v=>{
          const y=getY(v);
          return(<g key={v}><line x1={padL} y1={y} x2={W-padR} y2={y} stroke="#f0f0f0" strokeWidth="1"/><text x={padL-4} y={y+4} textAnchor="end" fontSize="6" fill="#bbb">{v}%</text></g>);
        })}
        {[20,40,60,80,100].map(v=>{
          const x=getX(v);
          return(<g key={v}><line x1={x} y1={12} x2={x} y2={H-padB} stroke="#f0f0f0" strokeWidth="1"/><text x={x} y={H-4} textAnchor="middle" fontSize="6" fill="#bbb">{v}</text></g>);
        })}
        <line x1={padL} y1={H-padB} x2={W-padR} y2={12} stroke="#5b8db8" strokeWidth="1" strokeDasharray="4,3" opacity="0.3"/>
        {banks.map((b,i)=>{
          const cx=getX(b.size), cy=getY(b.npl);
          const isHov=hov===i;
          const tx=cx>W-130?cx-118:cx+10;
          const ty=cy-22;
          return(
            <g key={i} style={{cursor:'pointer'}} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
              <circle cx={cx} cy={cy} r={isHov?7:5} fill={b.color} opacity={isHov?1:0.7} style={{transition:'all 0.15s'}}/>
              {isHov&&(
                <g>
                  <rect x={tx} y={ty} width={108} height={30} fill="white" stroke={b.color} strokeWidth="1" rx="3"/>
                  <text x={tx+6} y={ty+11} fontSize="8" fontWeight="700" fill="#1a1a1a">{b.name}</text>
                  <text x={tx+6} y={ty+22} fontSize="7" fill={b.color}>NPL {b.npl}%  Size {b.size}</text>
                </g>
              )}
            </g>
          );
        })}
        <text x={padL} y={10} fontSize="6" fill="#bbb">NPL rate (%)</text>
        <text x={W-padR} y={H-padB+16} textAnchor="end" fontSize="6" fill="#bbb">Bank size (larger to right)</text>
      </svg>
      <div className={styles.legendNote}>Bigger banks consistently show lower bad debt rates. Hover each dot to see the bank.</div>
    </div>
  );
}

function P5MacroChart() {
  const [active, setActive] = useState(null);
  const years = [2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022];
  const npl =   [4.1,  3.6,  3.2,  2.9,  2.5,  2.3,  2.0,  1.9,  2.3,  1.8,  2.1];
  const unemp = [2.0,  2.2,  2.1,  2.3,  2.3,  2.2,  2.2,  2.2,  2.5,  3.2,  2.8];
  const W=380, H=120, padL=28, padB=22, padR=8;
  const n=years.length;
  const getX=i=>padL+(i/(n-1))*(W-padL-padR);
  const getNplY=v=>H-padB-(v/5)*(H-padB-10);
  const getUnY=v=>H-padB-(v/4)*(H-padB-10);
  const nplPath=npl.map((v,i)=>`${i===0?'M':'L'}${getX(i)},${getNplY(v)}`).join(' ');
  const unPath=unemp.map((v,i)=>`${i===0?'M':'L'}${getX(i)},${getUnY(v)}`).join(' ');
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>Bad Debt Tracks the Economy <span className={styles.chartHint}>click a year</span></div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",display:'block'}}>
        <path d={nplPath} fill="none" stroke="#5b8db8" strokeWidth="2"/>
        <path d={unPath} fill="none" stroke="#9060c0" strokeWidth="1.5" strokeDasharray="4,2"/>
        <line x1={padL} y1={H-padB} x2={W-padR} y2={H-padB} stroke="#eee" strokeWidth="1"/>
        {years.map((y,i)=>{
          const x=getX(i);
          const isActive=active===i;
          const isCovid=y===2020||y===2021;
          return(
            <g key={i} style={{cursor:'pointer'}} onClick={()=>setActive(isActive?null:i)}>
              {isCovid&&<rect x={x-8} y={10} width={16} height={H-padB-10} fill="#f0a03010"/>}
              <rect x={x-10} y={10} width={20} height={H-padB-10} fill="transparent"/>
              <circle cx={x} cy={getNplY(npl[i])} r={isActive?5:3} fill="#5b8db8" style={{transition:'r 0.1s'}}/>
              <text x={x} y={H-6} textAnchor="middle" fontSize="6" fill={isActive?'#1a1a1a':'#ccc'}>{y}</text>
            </g>
          );
        })}
        {active!==null&&(()=>{
          const ax=getX(active);
          const isCovid=years[active]===2020||years[active]===2021;
          const tx=ax>W-140?ax-138:ax+6;
          return(
            <g>
              <line x1={ax} y1={10} x2={ax} y2={H-padB} stroke="#88888840" strokeWidth="1" strokeDasharray="3,2"/>
              <rect x={tx} y={18} width={130} height={isCovid?44:34} fill="white" stroke="#5b8db8" strokeWidth="1" rx="3"/>
              <text x={tx+6} y={30} fontSize="7" fontWeight="700" fill="#1a1a1a">{years[active]}: NPL {npl[active]}%</text>
              <text x={tx+6} y={41} fontSize="6" fill="#9060c0">Unemployment: {unemp[active]}%</text>
              {isCovid&&<text x={tx+6} y={52} fontSize="6" fill="#f0a030">COVID impact year</text>}
            </g>
          );
        })()}
        <g transform="translate(190,12)">
          <line x1="0" y1="4" x2="12" y2="4" stroke="#5b8db8" strokeWidth="2"/><text x="14" y="7" fontSize="7" fill="#5b8db8">NPL %</text>
          <line x1="60" y1="4" x2="72" y2="4" stroke="#9060c0" strokeWidth="1.5" strokeDasharray="4,2"/><text x="74" y="7" fontSize="7" fill="#9060c0">Unemp %</text>
        </g>
      </svg>
      <div className={styles.legendNote}>When unemployment rises, bad loans follow. Click any year to see the numbers.</div>
    </div>
  );
}

function P5ParallelCases() {
  const [active, setActive] = useState(null);
  const cases = [
    { id:0, industry:'Banking · Vietnam', color:'#5b8db8', title:'SBV Stress Testing Framework 2022', tag:'Direct policy application', desc:'State Bank of Vietnam now runs annual stress tests on all commercial banks — exactly the scenario analysis this study enables.', ref:'State Bank of Vietnam · sbv.gov.vn', refUrl:'https://www.sbv.gov.vn', analysis:'This study\'s finding that unemployment (beta=0.0025) and inflation (beta=0.0016) are significant drivers of NPL ratios directly informs the SBV stress testing methodology. When SBV runs high-unemployment or high-inflation scenarios, they are asking precisely the question this regression model answers. The beta coefficients become the input parameters for stress scenario impact calculations.', approach:'Macro stress testing: simulate NPL under adverse unemployment and inflation scenarios', relevance:'This model\'s coefficients are usable inputs for regulatory stress testing' },
    { id:1, industry:'Finance · Global', color:'#5a9e82', title:'Basel II/III Internal Ratings-Based Approach', tag:'Regulatory framework alignment', desc:'Basel III requires banks to model their own credit risk using historical data — this study demonstrates exactly that capability.', ref:'Bank for International Settlements · bis.org', refUrl:'https://www.bis.org', analysis:'Basel II/III Internal Ratings-Based (IRB) approach requires banks to use their own historical loss data to estimate Probability of Default. The methodology in this study — panel regression across 27 banks with macro variables — is a simplified version of the quantitative models banks build for IRB compliance. The lagged NPL finding (beta=0.496) directly maps to the IRB concept of persistent credit risk in portfolio modeling.', approach:'IRB approach: bank-specific PD models using historical data and macroeconomic conditioning variables', relevance:'Study methodology directly parallels Basel IRB credit risk modeling requirements' },
    { id:2, industry:'Research · SE Asia', color:'#9060c0', title:'Vietnam Banking System NPL Report', tag:'Empirical validation', desc:'Vietnam\'s system-wide NPL has tracked unemployment with 0.7+ correlation since 2012, consistent with this study\'s findings.', ref:'Vietnam Banks Association · vnba.org.vn', refUrl:'https://vnba.org.vn', analysis:'The macro variables in this study (unemployment, inflation, GDP growth) reflect the key drivers identified in Vietnam Banking Association\'s annual NPL reports. The 2012 to 2022 period captured three distinct regimes: post-GFC recovery (high NPL declining), pre-COVID stability (NPL at historic lows), and COVID disruption (NPL spike in 2020). The panel data model captures all three phases, giving it predictive validity across different economic conditions.', approach:'System-level NPL monitoring using macro indicators across full economic cycles', relevance:'Model validated against actual Vietnamese banking crisis and recovery data' },
  ];
  const activeCase = active!==null ? cases[active] : null;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <div className={styles.parallelGrid}>
        {cases.map(c=>(
          <div key={c.id} className={`${styles.parallelCard} ${active===c.id?styles.parallelCardActive:''}`} style={{borderTopColor:active===c.id?c.color:'#ebebeb',cursor:'pointer'}} onClick={()=>setActive(active===c.id?null:c.id)}>
            <div className={styles.parallelIndustry} style={{color:c.color}}>{c.industry}</div>
            <div className={styles.parallelTitle}>{c.title}</div>
            <div className={styles.parallelTagBadge} style={{background:c.color+'18',color:c.color}}>{c.tag}</div>
            <div className={styles.parallelDesc}>{c.desc}</div>
            <div className={styles.parallelExpandHint}>{active===c.id?'collapse':'see analysis'}</div>
          </div>
        ))}
      </div>
      {activeCase&&(
        <div className={styles.parallelDetail} style={{borderLeftColor:activeCase.color}}>
          <div className={styles.parallelDetailInner}>
            <div className={styles.parallelDetailAnalysis}>{activeCase.analysis}</div>
            <div className={styles.parallelDetailMeta}>
              <div className={styles.parallelApproachRow}><span className={styles.parallelApproach}>Approach:</span> {activeCase.approach}</div>
              <div className={styles.parallelRelevanceRow}><span className={styles.parallelApproach} style={{color:activeCase.color}}>Why relevant:</span> {activeCase.relevance}</div>
              <a href={activeCase.refUrl} target="_blank" rel="noopener noreferrer" className={styles.parallelRefLink}>{activeCase.ref}</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   PROJECT 6 — Stock Bubble Detection
   ══════════════════════════════════════════ */

function P6CrashTimeline() {
  const [active, setActive] = useState(null);
  const events = [
    { year:'2017', idx:100, label:'Baseline', note:'VN-Index stable around 750 points. Normal conditions.' },
    { year:'Mar 18', idx:148, label:'Peak 2018', peak:true, note:'VN-Index up 48% in 12 months. Price disconnects from fundamentals.' },
    { year:'Dec 18', idx:85,  label:'Crash 2018', crash:true, note:'35% crash in 9 months. Investors who missed warning lost 35%.' },
    { year:'2019', idx:100, label:'Recovery', note:'Slow recovery. Early sellers preserved gains.' },
    { year:'Feb 20', idx:110, label:'Pre-COVID', note:'Market at new high just before COVID hits.' },
    { year:'Apr 20', idx:70,  label:'COVID Drop', crash:true, note:'37% drop in 6 weeks. System correctly flagged this.' },
    { year:'Jan 21', idx:130, label:'Recovery', note:'V-shaped recovery driven by retail investor surge.' },
    { year:'Apr 22', idx:160, label:'Peak 2022', peak:true, note:'VN-Index at 1,500+. Same signals fired again.' },
    { year:'Dec 22', idx:95,  label:'Crash 2022', crash:true, note:'38% crash. Third confirmed prediction.' },
  ];
  const W=380, H=130, padL=20, padB=28, padR=12;
  const n=events.length;
  const maxIdx=170, minIdx=60;
  const getX=i=>padL+(i/(n-1))*(W-padL-padR);
  const getY=v=>H-padB-((v-minIdx)/(maxIdx-minIdx))*(H-padB-12);
  const pathD=events.map((e,i)=>`${i===0?'M':'L'}${getX(i)},${getY(e.idx)}`).join(' ');
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>VN-Index: Three Bubbles, Three Crashes <span className={styles.chartHint}>click each point</span></div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",display:'block'}}>
        {[80,100,120,140,160].map(v=>{
          const y=getY(v);
          return(<g key={v}><line x1={padL} y1={y} x2={W-padR} y2={y} stroke="#f0f0f0" strokeWidth="1"/><text x={padL-2} y={y+4} textAnchor="end" fontSize="6" fill="#bbb">{v}</text></g>);
        })}
        <path d={pathD} fill="none" stroke="#5b8db8" strokeWidth="2"/>
        <path d={`${pathD} L${getX(n-1)},${H-padB} L${getX(0)},${H-padB} Z`} fill="#5b8db8" opacity="0.06"/>
        {events.map((e,i)=>{
          const cx=getX(i), cy=getY(e.idx);
          const isActive=active===i;
          const dotColor=e.peak?'#1a6b5c':e.crash?'#c04040':'#5b8db8';
          return(
            <g key={i} style={{cursor:'pointer'}} onClick={()=>setActive(isActive?null:i)}>
              <circle cx={cx} cy={cy} r={isActive?7:e.peak||e.crash?5:3} fill={dotColor} opacity={isActive?1:0.8} style={{transition:'all 0.15s'}}/>
              {(e.peak||e.crash)&&!isActive&&<text x={cx} y={cy-10} textAnchor="middle" fontSize="6" fill={dotColor} fontWeight="700">{e.label}</text>}
            </g>
          );
        })}
        {active!==null&&(()=>{
          const e=events[active], cx=getX(active), cy=getY(e.idx);
          const tx=cx>W-150?cx-148:cx+8;
          const dotColor=e.peak?'#1a6b5c':e.crash?'#c04040':'#5b8db8';
          const shortNote=e.note.length>55?e.note.substring(0,55)+'...':e.note;
          return(
            <g>
              <line x1={cx} y1={12} x2={cx} y2={H-padB} stroke={dotColor+'50'} strokeWidth="1" strokeDasharray="3,2"/>
              <rect x={tx} y={Math.max(4,cy-20)} width={140} height={34} fill="white" stroke={dotColor} strokeWidth="1" rx="3"/>
              <text x={tx+6} y={Math.max(4,cy-20)+12} fontSize="7" fontWeight="700" fill="#1a1a1a">{e.label} ({e.year})</text>
              <text x={tx+6} y={Math.max(4,cy-20)+23} fontSize="6" fill="#666">{shortNote}</text>
            </g>
          );
        })()}
        <g transform={`translate(${padL},${H-padB+10})`}>
          <circle cx="4" cy="4" r="4" fill="#1a6b5c"/><text x="12" y="7" fontSize="6" fill="#1a6b5c">Peak</text>
          <circle cx="54" cy="4" r="4" fill="#c04040"/><text x="62" y="7" fontSize="6" fill="#c04040">Crash</text>
          <circle cx="104" cy="4" r="4" fill="#5b8db8"/><text x="112" y="7" fontSize="6" fill="#5b8db8">Normal</text>
        </g>
      </svg>
      <div className={styles.legendNote}>Each crash cost retail investors 35 to 38%. This system was built to spot them early. Click any point.</div>
    </div>
  );
}

function P6SignalChart() {
  const [active, setActive] = useState(null);
  const signals = [
    {
      id:0, name:'Market Complexity', label:'MF-DFA Hurst Exponent', color:'#5b8db8',
      plain:'When the market becomes too predictable or too chaotic, something is wrong. Normal healthy markets sit in between.',
      tech:'Hurst Exponent H from MF-DFA analysis. H above 0.7 means trending bubble. H below 0.3 means crash imminent.',
      example:'Before the 2018 peak: H hit 0.78. Market was too trendy, momentum traders piling in, fundamentals ignored.',
      importance:92
    },
    {
      id:1, name:'Volatility Asymmetry', label:'MF-DFA Asymmetry Index', color:'#9060c0',
      plain:'In bubbles, prices rise smoothly but crash violently. This signal measures that asymmetry — when rises and falls stop being balanced, a bubble is forming.',
      tech:'MF-DFA Asymmetry index A. Positive asymmetry combined with rising H is the classic bubble signature.',
      example:'March 2018: Asymmetry peaked at 0.34. Prices rising in unusually smooth, one-directional pattern. 4 weeks later: crash began.',
      importance:88
    },
    {
      id:2, name:'Search Momentum', label:'Google Trends SVI', color:'#5a9e82',
      plain:'When ordinary people suddenly start searching how to buy stocks in large numbers, that is a classic bubble signal — everyone piles in at the top.',
      tech:'Google Trends SVI and Delta-SVI (week-over-week change). Retail FOMO captured via search volume spikes.',
      example:'January 2021: search volume for stock-related terms tripled in 3 weeks — exactly when VN-Index was most overvalued.',
      importance:76
    },
  ];
  const info = active !== null ? signals[active] : null;
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>Three Warning Signals <span className={styles.chartHint}>click each signal</span></div>
      <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:10}}>
        {signals.map((s,i)=>(
          <div key={i} onClick={()=>setActive(active===i?null:i)}
            style={{border:`2px solid ${active===i?s.color:'#ebebeb'}`,borderRadius:6,padding:'12px 14px',cursor:'pointer',background:active===i?s.color+'0d':'#fff',transition:'all 0.15s'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
              <span style={{fontSize:11,fontWeight:700,color:active===i?s.color:'#1a1a1a'}}>{s.name}</span>
              <span style={{fontSize:9,color:s.color,fontWeight:700}}>Strength {s.importance}%</span>
            </div>
            <div style={{fontSize:9,color:'#888',marginBottom:4}}>{s.label}</div>
            <div style={{fontSize:10,color:'#555',lineHeight:1.55}}>{s.plain}</div>
          </div>
        ))}
      </div>
      {info&&(
        <div className={styles.chartExplain} style={{borderLeftColor:info.color}}>
          <div className={styles.chartExplainTitle} style={{color:info.color}}>{info.name}: Real example</div>
          <div className={styles.chartExplainNote} style={{fontStyle:'italic',marginBottom:6}}>{info.example}</div>
          <div style={{fontSize:10,color:'#888',lineHeight:1.5}}>{info.tech}</div>
        </div>
      )}
      {!info&&<div className={styles.legendNote}>Together these three signals caught all three crashes 2 to 4 weeks early. Click each to see a real example.</div>}
    </div>
  );
}

function P6ModelCompare() {
  const [active, setActive] = useState(null);
  const models = [
    { name:'Random guess', f1:50, color:'#ccc', note:'No better than flipping a coin. But many retail investors effectively do this.', best:false },
    { name:'Search only', f1:72, color:'#9060c0', note:'Google Trends alone captures retail FOMO but misses early structural signals. Catches the bubble late.', best:false },
    { name:'Math only', f1:85, color:'#5b8db8', note:'Hurst and Asymmetry alone are strong but blind to human behavior. Missed the 2021 retail-driven recovery timing.', best:false },
    { name:'Combined', f1:97.5, color:'#5a9e82', note:'Both signals together. F1 97.5%, AUC 0.992. Sharpe ratio 1.87 vs 0.94 buy-and-hold. Max drawdown cut from 47% to 18%.', best:true },
  ];
  const W=360, H=100, padL=28, padB=20, bW=22, gap=14;
  const groupW=models.length*(bW+gap)-gap;
  const startX=(W-padL-groupW)/2+padL;
  const info=active!==null?models[active]:null;
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>Which Approach Works Best? <span className={styles.chartHint}>click a bar</span></div>
      <svg width="100%" viewBox={`0 0 ${W} ${H+padB}`} style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",display:'block'}}>
        {[50,75,100].map(v=>{
          const y=H-(v/100)*H+10;
          return(<g key={v}><line x1={padL} y1={y} x2={W-8} y2={y} stroke="#f0f0f0" strokeWidth="1"/><text x={padL-4} y={y+4} textAnchor="end" fontSize="6" fill="#bbb">{v}%</text></g>);
        })}
        {models.map((m,i)=>{
          const x=startX+i*(bW+gap);
          const bH=(m.f1/100)*(H-10);
          const y=H-bH+10;
          const isActive=active===i;
          return(
            <g key={i} style={{cursor:'pointer'}} onClick={()=>setActive(isActive?null:i)}>
              <rect x={x} y={y} width={bW} height={bH} fill={isActive?m.color:m.best?m.color+'cc':m.color+'44'} rx="2" style={{transition:'all 0.15s'}}/>
              <text x={x+bW/2} y={y-4} textAnchor="middle" fontSize="7" fontWeight="700" fill={m.best?m.color:'#999'}>{m.f1}%</text>
              <text x={x+bW/2} y={H+14} textAnchor="middle" fontSize="6" fill={isActive?'#1a1a1a':m.best?'#1a1a1a':'#bbb'}>{m.best?'Best':m.name.split(' ')[0]}</text>
            </g>
          );
        })}
        <text x={W/2} y={20} textAnchor="middle" fontSize="7" fill="#888">Detection Accuracy (F1 Score)</text>
      </svg>
      {info&&(
        <div className={styles.chartExplain} style={{borderLeftColor:info.color}}>
          <div className={styles.chartExplainTitle} style={{color:info.best?'#1a1a1a':info.color}}>{info.name}{info.best?' — Winner':''}</div>
          <div className={styles.chartExplainNote}>{info.note}</div>
        </div>
      )}
      {!info&&<div className={styles.legendNote}>Neither math nor behavior alone is enough. Combined, they catch 97.5% of bubble events.</div>}
    </div>
  );
}

function P6AlertSystem() {
  const [active, setActive] = useState(null);
  const levels = [
    { level:'Yellow Alert', trigger:'Hurst H crossing 0.65 and Google Trends momentum rising', meaning:'Market entering overheated territory. Not a crash yet — reduce new positions and review stop-losses.', action:'Reduce exposure by 20%. Tighten stop-loss orders.', color:'#c08820', who:'Individual investors, fund managers' },
    { level:'Orange Alert', trigger:'H above 0.70, Asymmetry above 0.25, and Search volume spike above 50%', meaning:'Classic bubble signature. All three signals firing simultaneously. High probability of correction within 4 to 8 weeks.', action:'Reduce exposure by 50%. Hedge with options or move to cash.', color:'#9060c0', who:'Institutional risk committees, portfolio managers' },
    { level:'Red Alert', trigger:'All signals at maximum and price momentum diverging from fundamentals', meaning:'Crash imminent. Historical base rate: correction of 25 to 40% follows within 2 to 4 weeks when all red criteria met.', action:'Exit long positions. Preserve capital. Wait for stabilization signal.', color:'#c04040', who:'State Securities Commission, systemic risk monitors' },
  ];
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>3-Tier Early Warning System <span className={styles.chartHint}>click each level</span></div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {levels.map((l,i)=>(
          <div key={i} onClick={()=>setActive(active===i?null:i)}
            style={{border:`2px solid ${active===i?l.color:'#ebebeb'}`,borderRadius:6,padding:'12px 14px',cursor:'pointer',background:active===i?l.color+'0d':'#fff',transition:'all 0.15s'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:4}}>
              <span style={{fontSize:11,fontWeight:700,color:l.color}}>{l.level}</span>
              <span style={{fontSize:9,color:'#888'}}>For: {l.who}</span>
            </div>
            <div style={{fontSize:10,color:'#555',marginTop:4,lineHeight:1.55}}>{l.meaning}</div>
            {active===i&&(
              <div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${l.color}33`}}>
                <div style={{fontSize:9,color:'#888',marginBottom:4,lineHeight:1.5}}>Trigger: {l.trigger}</div>
                <div style={{fontSize:10,fontWeight:700,color:l.color}}>{l.action}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={styles.legendNote} style={{marginTop:4}}>Each level has objective, data-driven triggers. Click each to see what fires the alarm.</div>
    </div>
  );
}

function P6ParallelCases() {

function CoefficientChart() {
  const [active, setActive] = useState(null);
  const vars = [
    {name:'COB', beta:-0.009, color:'#5a9e82', note:'Core Banking: more modules + better integration reduces credit risk. Each unit increase in COB decreases RIST by 0.009 — digitization helps but effect is modest.'},
    {name:'BAD', beta:-0.020, color:'#5b8db8', note:'Basic IT Applications: strongest risk-reducing effect. Data management and analytics tools improve credit assessment accuracy. Each unit increase decreases RIST by 0.020.'},
    {name:'DAP', beta:+0.206, color:'#e8729a', note:'E-Payment: INCREASES credit risk (β=+0.206) — largest coefficient. Rapid e-payment expansion without strict controls creates new fraud vectors and credit exposure. Critical policy finding.'},
  ];
  const W=380, H=120, cx=190, zeroY=60;
  const maxAbs=0.25;
  const info = active!==null ? vars[active] : null;
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>Regression Coefficients (β) <span className={styles.chartHint}>click a bar</span></div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",display:'block'}}>
        <line x1={40} y1={zeroY} x2={W-10} y2={zeroY} stroke="#1a1a1a" strokeWidth="1"/>
        <text x={38} y={zeroY+4} textAnchor="end" fontSize="7" fill="#888">0</text>
        {[-0.2,-0.1,0.1,0.2].map(v=>{
          const y=zeroY-(v/maxAbs)*(zeroY-10);
          return(<g key={v}><line x1={36} y1={y} x2={W-10} y2={y} stroke="#f0f0f0" strokeWidth="1"/><text x={34} y={y+4} textAnchor="end" fontSize="6" fill="#bbb">{v}</text></g>);
        })}
        {vars.map((v,i)=>{
          const bW=48, x=60+i*90;
          const bH=Math.abs(v.beta/maxAbs)*(zeroY-10);
          const isPos=v.beta>0;
          const y=isPos?zeroY:zeroY-bH;
          const isActive=active===i;
          return(
            <g key={i} style={{cursor:'pointer'}} onClick={()=>setActive(isActive?null:i)}>
              <rect x={x-bW/2} y={y} width={bW} height={bH} fill={isActive?v.color:v.color+'88'} rx="2" style={{transition:'fill 0.15s'}}/>
              <text x={x} y={isPos?zeroY+bH+10:zeroY-bH-4} textAnchor="middle" fontSize="8" fontWeight="700" fill={v.color}>{v.beta>0?'+':''}{v.beta}</text>
              <text x={x} y={H-2} textAnchor="middle" fontSize="9" fontWeight={isActive?700:500} fill={isActive?'#1a1a1a':'#555'}>{v.name}</text>
            </g>
          );
        })}
        <text x={cx} y={8} textAnchor="middle" fontSize="6" fill="#888">RIST = 0.838 - 0.009·COB - 0.020·BAD + 0.206·DAP</text>
      </svg>
      {info&&(
        <div className={styles.chartExplain} style={{borderLeftColor:info.color}}>
          <div className={styles.chartExplainTitle} style={{color:info.color}}>{info.name} (β = {info.beta>0?'+':''}{info.beta})</div>
          <div className={styles.chartExplainNote}>{info.note}</div>
        </div>
      )}
      {!info&&<div className={styles.legendNote}>Click each variable to understand its effect on credit risk.</div>}
    </div>
  );
}

function FeatureImportanceChart() {
  const [active, setActive] = useState(null);
  const features = [
    {name:'BAD', score:0.837, color:'#5b8db8', rank:1, note:'Basic IT Applications rank #1 in feature importance. Data quality and analytics infrastructure matter more than system complexity for credit risk prediction.'},
    {name:'DAP', score:0.832, color:'#e8729a', rank:2, note:'E-Payment ranks #2 — its large positive coefficient (+0.206) combined with high importance makes it the most impactful variable to monitor and control.'},
    {name:'COB', score:0.816, rank:3, color:'#5a9e82', note:'Core Banking ranks #3 — still important but scores are close (0.816-0.837), suggesting all 3 IT dimensions contribute meaningfully to credit risk prediction.'},
  ];
  const W=380, H=90, padL=50;
  const maxScore=0.85, minScore=0.80;
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>Feature Importance (Mean Dropout Loss) <span className={styles.chartHint}>click a bar</span></div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",display:'block'}}>
        {features.map((f,i)=>{
          const bW=((f.score-minScore)/(maxScore-minScore))*(W-padL-20);
          const y=10+i*26;
          const isActive=active===i;
          return(
            <g key={i} style={{cursor:'pointer'}} onClick={()=>setActive(isActive?null:i)}>
              <text x={padL-6} y={y+11} textAnchor="end" fontSize="9" fontWeight={isActive?700:500} fill={isActive?f.color:'#555'}>#{f.rank} {f.name}</text>
              <rect x={padL} y={y} width={bW} height={18} fill={isActive?f.color:f.color+'88'} rx="2" style={{transition:'all 0.15s'}}/>
              <text x={padL+bW+4} y={y+12} fontSize="8" fontWeight="700" fill={f.color}>{f.score}</text>
            </g>
          );
        })}
        <text x={padL} y={H-2} fontSize="6" fill="#bbb">Scores 0.80-0.85 — all variables contribute meaningfully (small gap)</text>
      </svg>
      {active!==null&&(
        <div className={styles.chartExplain} style={{borderLeftColor:features[active].color}}>
          <div className={styles.chartExplainTitle} style={{color:features[active].color}}>#{features[active].rank} {features[active].name} — Score: {features[active].score}</div>
          <div className={styles.chartExplainNote}>{features[active].note}</div>
        </div>
      )}
      {active===null&&<div className={styles.legendNote}>Click each feature to understand its importance ranking.</div>}
    </div>
  );
}

function ModelMetricsChart() {
  const metrics = [
    {name:'Val MSE', val:0.423, threshold:0.5, good:true, note:'Validation MSE = 0.423 < 0.5 threshold — acceptable model quality', color:'#5a9e82'},
    {name:'Test MSE', val:0.363, threshold:0.5, good:true, note:'Test MSE = 0.363 < Val MSE — model is not overfit. Lower on unseen data is a good sign.', color:'#5b8db8'},
    {name:'MAE/MAD', val:0.457, threshold:0.5, good:true, note:'MAE/MAD = 0.457 < 0.5 — model explains most variation in credit risk data', color:'#9060c0'},
  ];
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>Model Performance Metrics</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
        {metrics.map((m,i)=>(
          <div key={i} style={{background:'#fff',border:`1px solid ${m.color}44`,borderTop:`3px solid ${m.color}`,borderRadius:6,padding:'12px 10px',textAlign:'center'}}>
            <div style={{fontSize:22,fontWeight:800,color:m.color,letterSpacing:'-0.5px'}}>{m.val}</div>
            <div style={{fontSize:10,fontWeight:700,color:'#1a1a1a',textTransform:'uppercase',letterSpacing:'0.5px',margin:'4px 0 2px'}}>{m.name}</div>
            <div style={{fontSize:10,color:'#5a9e82',fontWeight:600}}>below threshold</div>
            <div style={{fontSize:10,color:'#888',marginTop:4,lineHeight:1.4}}>{m.note}</div>
          </div>
        ))}
      </div>
      <div className={styles.legendNote}>MAPE=55.55% is acknowledged as a limitation — point prediction accuracy needs improvement.</div>
    </div>
  );
}

/* ── Project 2 Charts ── */
function RevenueBarChart({models}) {
  const [active, setActive] = useState(null);
  const W=380, H=120, padL=60, padB=20;
  const max = Math.max(...models.map(m=>m.rev));
  const info = active!==null ? models[active] : null;
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>Revenue by Category (K INR) <span className={styles.chartHint}>click a bar</span></div>
      <svg width="100%" viewBox={`0 0 ${W} ${H+padB}`} style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",display:'block'}}>
        {models.map((m,i)=>{
          const bH=(m.rev/max)*(H-10);
          const x=padL+(i*(W-padL-10)/models.length);
          const bW=(W-padL-10)/models.length-4;
          const isActive=active===i;
          return(
            <g key={i} style={{cursor:'pointer'}} onClick={()=>setActive(isActive?null:i)}>
              <rect x={x} y={H-bH} width={bW} height={bH} fill={isActive?m.color:m.color+'99'} rx="2" style={{transition:'fill 0.15s'}}/>
              {isActive&&<text x={x+bW/2} y={H-bH-4} textAnchor="middle" fontSize="8" fontWeight="700" fill={m.color}>{m.rev}K</text>}
              <text x={x+bW/2} y={H+14} textAnchor="middle" fontSize="7" fill={isActive?'#1a1a1a':'#888'}>{m.dim}</text>
            </g>
          );
        })}
      </svg>
      {info&&(
        <div className={styles.chartExplain} style={{borderLeftColor:info.color}}>
          <div className={styles.chartExplainTitle} style={{color:info.color}}>{info.dim} — {info.rev}K INR ({info.pct}% of total)</div>
          <div className={styles.chartExplainNote}>
            {info.dim==='Electronics'&&'Highest demand category. Strong across all gender groups (~5,000+ purchases each). SEASONALOFFER21 drove 15,000 discount purchases — highest across all categories.'}
            {info.dim==='Clothing'&&'Second largest, 339K INR. Especially popular with female customers (3,800 purchases). Steady demand year-round with seasonal spikes in Q1 and Q4.'}
            {info.dim==='Beauty'&&'Third place at 276K INR. Led by female customers but with strong cross-gender appeal. Growing trend in self-care and wellness spending.'}
            {info.dim==='Home'&&'178K INR — moderate but essential category. Driven by 25-45 age group investing in home improvement during pandemic-era lifestyle shifts.'}
            {info.dim==='Sports'&&'166K INR — smallest of top 5 but growing. Rising fitness awareness post-COVID. Potential for targeted promotions to boost engagement.'}
            {info.dim==='Other'&&'Books, Pet Care, Toys combined. Niche markets with low volume but stable repeat customers. Low-hanging fruit for personalized recommendations.'}
          </div>
        </div>
      )}
      {!info&&<div className={styles.legendNote}>Click any bar to explore category insights.</div>}
    </div>
  );
}

function SeasonalChart() {
  const [hovMonth, setHovMonth] = useState(null);
  const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const sales=[12,10,11,13,13.5,11,13,14,14,15,16,18];
  const events={1:'Lowest point — clearance opportunity',3:'Recovery — spring collections',6:'Mid-year dip',9:'Festival season starts',10:'Q4 surge begins',11:'December peak — holiday shopping'};
  const W=380,H=100,padL=20,padB=22,maxV=20;
  const getX=i=>padL+(i/(months.length-1))*(W-padL*2);
  const getY=v=>H-padB-(v/maxV)*(H-padB-8);
  const pathD=sales.map((v,i)=>`${i===0?'M':'L'}${getX(i)},${getY(v)}`).join(' ');
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>Monthly Sales Trend (M INR) <span className={styles.chartHint}>hover to explore</span></div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",display:'block'}} onMouseLeave={()=>setHovMonth(null)}>
        {[10,14,18].map(v=>(
          <g key={v}>
            <line x1={padL} y1={getY(v)} x2={W-padL} y2={getY(v)} stroke="#f0f0f0" strokeWidth="1"/>
            <text x={padL-2} y={getY(v)+4} textAnchor="end" fontSize="6" fill="#bbb">{v}M</text>
          </g>
        ))}
        <path d={pathD} fill="none" stroke="#5b8db8" strokeWidth="2"/>
        <path d={`${pathD} L${getX(11)},${H-padB} L${getX(0)},${H-padB} Z`} fill="#5b8db8" opacity="0.08"/>
        {sales.map((v,i)=>(
          <g key={i}>
            <rect x={getX(i)-10} y={8} width={20} height={H-padB-8} fill="transparent" style={{cursor:'crosshair'}} onMouseEnter={()=>setHovMonth(i)}/>
            <text x={getX(i)} y={H-6} textAnchor="middle" fontSize="6" fill={hovMonth===i?'#1a1a1a':'#bbb'}>{months[i]}</text>
          </g>
        ))}
        {hovMonth!==null&&(()=>{
          const x=getX(hovMonth), y=getY(sales[hovMonth]);
          const tx=x>W-130?x-120:x+8;
          return(
            <g>
              <line x1={x} y1={8} x2={x} y2={H-padB} stroke="#5b8db860" strokeWidth="1" strokeDasharray="3,2"/>
              <circle cx={x} cy={y} r={4} fill="#5b8db8"/>
              <rect x={tx} y={y-18} width={118} height={events[hovMonth]?32:22} fill="white" stroke="#5b8db8" strokeWidth="1" rx="3"/>
              <text x={tx+6} y={y-7} fontSize="7" fontWeight="700" fill="#1a1a1a">{months[hovMonth]}: {sales[hovMonth]}M INR</text>
              {events[hovMonth]&&<text x={tx+6} y={y+4} fontSize="6" fill="#888">{events[hovMonth]}</text>}
            </g>
          );
        })()}
      </svg>
    </div>
  );
}

function PaymentChart() {
  const [active, setActive] = useState(null);
  const methods=[
    {name:'Credit Card', pct:40.2, color:'#5b8db8', note:'Dominates due to cashback & loyalty rewards. Core segment to retain.'},
    {name:'Debit Card',  pct:25.1, color:'#5a9e82', note:'Direct bank transactions. Stable, lower-engagement segment.'},
    {name:'Net Banking', pct:9.97, color:'#9060c0', note:'Secure bank-mediated payments. Appeals to trust-conscious users.'},
    {name:'UPI (Total)', pct:14.6, color:'#f0a030', note:'PhonePe 4.88% + Paytm 4.86% + GPay 4.85%. Fastest growing segment.'},
    {name:'Intl Card',   pct:5.12, color:'#1a6b5c', note:'Global shoppers. Niche but high-value segment.'},
    {name:'Cash on Del', pct:5.03, color:'#bbb',    note:'Trust-based. Common in markets where online payment trust is developing.'},
  ];
  const W=380, cx=100, cy=85, r=70;
  let cumAngle=0;
  const slices=methods.map(m=>{
    const angle=(m.pct/100)*2*Math.PI;
    const start=cumAngle, end=cumAngle+angle;
    cumAngle+=angle;
    return{...m,start,end};
  });
  const arcPath=(start,end,r)=>{
    const x1=cx+r*Math.sin(start), y1=cy-r*Math.cos(start);
    const x2=cx+r*Math.sin(end), y2=cy-r*Math.cos(end);
    const large=end-start>Math.PI?1:0;
    return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`;
  };
  const info=active!==null?methods[active]:null;
  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>Payment Method Distribution <span className={styles.chartHint}>click a slice</span></div>
      <div className={styles.chartRow}>
        <svg width="200" height="170" viewBox="0 0 200 170" style={{flexShrink:0}}>
          {slices.map((s,i)=>(
            <path key={i} d={arcPath(s.start,s.end,active===i?r+4:r)}
              fill={s.color} opacity={active===null||active===i?0.9:0.3}
              style={{cursor:'pointer',transition:'all 0.2s'}}
              onClick={()=>setActive(active===i?null:i)}/>
          ))}
          <circle cx={cx} cy={cy} r={r*0.45} fill="white"/>
          <text x={cx} y={cy-4} textAnchor="middle" fontSize="10" fontWeight="800" fill="#1a1a1a">6</text>
          <text x={cx} y={cy+9} textAnchor="middle" fontSize="7" fill="#888">methods</text>
        </svg>
        <div className={styles.chartLegend}>
          {methods.map((m,i)=>(
            <div key={i} className={styles.legendItem} style={{cursor:'pointer',fontWeight:active===i?700:400,opacity:active===null||active===i?1:0.4}} onClick={()=>setActive(active===i?null:i)}>
              <span className={styles.legendDot} style={{background:m.color}}></span>
              <span>{m.name} — {m.pct}%</span>
            </div>
          ))}
          {info&&(
            <div className={styles.chartExplain} style={{borderLeftColor:info.color,marginTop:8}}>
              <div className={styles.chartExplainTitle} style={{color:info.color}}>{info.name}</div>
              <div className={styles.chartExplainNote}>{info.note}</div>
            </div>
          )}
        </div>
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
      analysis:"PayPal uses ensemble models almost identical to this study's approach — Random Forest as base with XGBoost boosting. Critical insight: they weight false negatives 15× heavier than false positives in their loss function, directly reflecting the asymmetric cost of missed fraud. This is the cost-sensitive approach this project should adopt in v2.",
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
      analysis:"DBS used Logistic Regression + Decision Tree ensemble with SMOTE — exactly this project's methodology. Their NPL ratio dropped 1.2 percentage points after deployment. Most relevant finding: analyst trust was the biggest adoption barrier, not model performance. They solved this with SHAP explanations showing which features drove each decision — the exact next step recommended here.",
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

/* ── P2 Parallel Cases ── */
function P2ParallelCases() {
  const [active, setActive] = useState(null);
  const cases = [
    {
      id:0, industry:'E-commerce · India', color:'#5b8db8',
      title:'Flipkart — Big Billion Days Analytics',
      tag:'Closest market context',
      desc:'Flipkart uses real-time dashboards during Big Billion Days to track category performance and reallocate inventory within hours.',
      ref:'Flipkart Tech Blog · tech.flipkart.com',
      refUrl:'https://tech.flipkart.com',
      analysis:'Flipkart faces the identical challenge: massive transaction data across diverse Indian demographics and geographies. Their key innovation was moving from post-hoc analysis (like this project) to real-time dashboards with automated alerts. When Electronics inventory dropped below threshold during a sale event, the system auto-triggered restocking — directly analogous to the seasonal insights this project uncovered. The December 18M INR peak we identified could trigger the same automated inventory logic.',
      approach:'Real-time streaming analytics + automated inventory triggers',
      relevance:'Same market, same demographic patterns — validates December peak finding',
    },
    {
      id:1, industry:'E-commerce · SE Asia', color:'#e8729a',
      title:'Lazada — Persona-Based Segmentation',
      tag:'Methodology parallel',
      desc:'Lazada segments customers into behavioral personas to drive personalized recommendations, lifting average order value by 23%.',
      ref:'Lazada Group Tech · lazada.com',
      refUrl:'https://www.lazada.com',
      analysis:"This project built 3 narrative personas (Khari, Nayar, Sam) as a storytelling device — Lazada operationalizes this into ML-driven segments that feed recommendation engines. The 25-45 age group driving 60% of revenue in this data mirrors Lazada's professional millennial segment, their highest CLV cohort. The next step for this analysis: move from descriptive personas to predictive CLV models that identify which customers within the 25-45 group are worth premium retention investment.",
      approach:'ML clustering for persona generation + personalized recommendation engine',
      relevance:'Validates persona approach — Lazada proves it scales to 8-figure revenue impact',
    },
    {
      id:2, industry:'Retail · Global', color:'#5a9e82',
      title:'Walmart US — Omnichannel Payment Strategy',
      tag:'Parent company benchmark',
      desc:'Walmart US saw 34% increase in digital payment adoption after introducing Walmart Pay and UPI-equivalent integrations.',
      ref:'Walmart Corporate · corporate.walmart.com',
      refUrl:'https://corporate.walmart.com',
      analysis:"The UPI growth trend (14.6% combined share, fastest growing) in this India data directly mirrors Walmart US's experience with digital wallet adoption. Walmart US found that each 1% shift from cash/card to digital wallets reduced transaction processing cost by 0.3% — for a platform the size of Walmart India, this compounds significantly. The recommendation from this project to invest in UPI incentives aligns exactly with Walmart global's payment digitization strategy.",
      approach:'Omnichannel payment integration + digital wallet incentive programs',
      relevance:'Parent company validation — UPI growth trajectory mirrors Walmart US digital wallet adoption',
    },
  ];
  const activeCase = active!==null ? cases[active] : null;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <div className={styles.parallelGrid}>
        {cases.map(c=>(
          <div key={c.id}
            className={`${styles.parallelCard} ${active===c.id?styles.parallelCardActive:''}`}
            style={{borderTopColor:active===c.id?c.color:'#ebebeb',cursor:'pointer'}}
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
              <div className={styles.parallelApproachRow}><span className={styles.parallelApproach}>Approach:</span> {activeCase.approach}</div>
              <div className={styles.parallelRelevanceRow}><span className={styles.parallelApproach} style={{color:activeCase.color}}>Why relevant:</span> {activeCase.relevance}</div>
              <a href={activeCase.refUrl} target="_blank" rel="noopener noreferrer" className={styles.parallelRefLink}>↗ {activeCase.ref}</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
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

  // Helper for safe download links
  const downloadLink = (filename) => `/${encodeURIComponent(filename)}`;

  return (
    <div className={`${styles.container} ${mounted?styles.mounted:''}`}>

      <header className={styles.header}>
        <div className={styles.avatarWrapper}>
          <img src="/avatar.png" alt="Thao Nguyen Tran" className={styles.avatar}/>
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
        {['about','experience','projects','skills'].map(tab=>(
          <button key={tab} className={`${styles.tab} ${activeTab===tab?styles.tabActive:''}`} onClick={()=>setActiveTab(tab)}>
            {tab==='projects'?`Projects (${data.projects.length})`:cap(tab)}
          </button>
        ))}
      </nav>

      <main className={styles.content}>

        {activeTab === 'about' && (
          <section className={styles.section}>
            <p className={styles.aboutBio}>{data.profile.bio}</p>
            <div className={styles.aboutGrid}>
              <div className={styles.aboutCard}>
                <span className={styles.cardLabel}>Background</span>
                <div>
                  <p>{data.about.background}</p>
                  {data.about.exchange && <p>{data.about.exchange}</p>}
                </div>
              </div>
              <div className={styles.aboutCard}>
                <span className={styles.cardLabel}>Focus</span>
                <p>{data.about.professional_focus}</p>
              </div>
              <div className={styles.aboutCard}>
                <span className={styles.cardLabel}>Strengths</span>
                <ul className={styles.strengthsList}>
                  {data.about.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
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
                  {(() => {
                    let link = null;
                    if (edu.institution.includes('University of Economics and Law')) link = 'https://www.uel.edu.vn/';
                    if (edu.institution.includes('HSB Hochschule Bremen')) link = 'https://www.hs-bremen.de/en/';
                    return link ? (
                      <a href={link} target="_blank" rel="noopener noreferrer" className={styles.eduInst}>
                        {edu.institution}
                      </a>
                    ) : (
                      <span className={styles.eduInst}>{edu.institution}</span>
                    );
                  })()}
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
                    {t.topics.map((topic, j) => (
                      <li key={j}>{topic}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

<Divider label="Certifications" />
            <ul className={styles.certList}>
              <li style={{ marginBottom: '12px' }}>
                <div>Certified Risk Management FMEA – ISO 31000 Expert | Six Sigma Academy Amsterdam (SSAA)</div>
                <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.6 }}>
                  <a href="/Cert1_ISO31000.pdf" download style={{ textDecoration: 'none', color: '#555' }}>
                    ⬇ Download certificate (PDF)
                  </a>
                </div>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <div>Spring School on Statistical & Machine Learning 2025 | VIASM & Toulouse Institute of Mathematics, ENS Paris-Saclay</div>
                <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.6 }}>
                  <a href="/Cert2_SpringSchool2025.pdf" download style={{ textDecoration: 'none', color: '#555' }}>
                    ⬇ Download certificate (PDF)
                  </a>
                </div>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <div>Machine Learning for Data Science | University of Science – VNUHCM</div>
                <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.6 }}>
                  <a href="/Cert3_MLDataScience.pdf" download style={{ textDecoration: 'none', color: '#555' }}>
                    ⬇ Download certificate (PDF)
                  </a>
                </div>
              </li>
            </ul>
            
            <Divider label="Domain Expertise" />
            <div className={styles.expertiseList}>
              {data.skills.domain_expertise.map((e, i) => (
                <span key={i} className={styles.expertiseBadge}>{e}</span>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'experience' && (
          <section className={styles.section}>
            <div className={styles.timeline}>
              {data.experience.map(job=>(
                <div key={job.id} className={styles.timelineItem}>
                  <div className={styles.timelineLeft}><span className={styles.jobPeriod}>{job.period}</span></div>
                  <div className={styles.timelineLine}><div className={styles.timelineDot}></div><div className={styles.timelineTrack}></div></div>
                  <div className={styles.timelineRight}>
                    <h3 className={styles.jobTitle}>{job.title}</h3>
                    {(() => {
                      let link = null;
                      if (job.company.includes('Hung Vuong University')) link = 'https://dhv.edu.vn/';
                      if (job.company.includes('Agribank')) link = 'https://www.agribank.com.vn/';
                      return link ? (
                        <a href={link} target="_blank" rel="noopener noreferrer" className={styles.jobCompany}>
                          {job.company}
                        </a>
                      ) : (
                        <span className={styles.jobCompany}>{job.company}</span>
                      );
                    })()}
                    <ul className={styles.highlightsList}>{job.highlights.map((h,i)=><li key={i}>{h}</li>)}</ul>
                    {job.projectId&&<button className={styles.viewProjectBtn} onClick={()=>openProject(job.projectId)}>View related project →</button>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'projects' && (
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
                  const isP2=project.id===2;
                  const isP3=project.id===3;
                  const isP4=project.id===4;
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

                          {/* ══ PROJECT 1 TABS ══ */}
                          {hasCharts&&(
                            <>
                            {currentTab==='context'&&(
                              <div className={`${styles.panelContent} ${contextHighlight===project.id?styles.panelContentHighlight:''}`}>
                                <div className={styles.problemBox}>
                                  <div className={styles.problemLabel}>The Problem</div>
                                  <div className={styles.problemText}>{"Vietnam's rapid credit expansion has intensified fraud risk in personal credit portfolios. This study addresses a critical gap: Agribank Saigon Branch lacked an automated, data-driven early-warning system for credit card fraud detection, relying instead on manual review processes vulnerable to human error."}</div>
                                </div>
                                <div className={styles.statRow}>
                                  <div className={styles.statBox}><div className={styles.statNum} style={{color:'#e8729a'}}>0.17%</div><div className={styles.statLabel}>Fraud Rate</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum}>Manual</div><div className={styles.statLabel}>Detection Method</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum}>1.5%</div><div className={styles.statLabel}>NPL Ratio</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum}>Tier 1</div><div className={styles.statLabel}>Branch Rank</div></div>
                                </div>
                                {project.supervisor&&(<div className={styles.contextMeta}><span>Supervisor: {project.supervisor}</span><span>{project.institution} / {project.period}</span></div>)}
                              </div>
                            )}
                            {currentTab==='approach'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.problemBox}>
                                  <div className={styles.problemLabel}>Research Question</div>
                                  <div className={styles.problemText}>{project.researchQuestion}</div>
                                </div>
                                <div className={styles.approachGrid}>
                                  {[{icon:'01',label:'Classify',desc:'Binary classification — Fraud (1) vs Legitimate (0)'},{icon:'02',label:'Handle Imbalance',desc:'SMOTE oversampling to balance 0.17% minority class'},{icon:'03',label:'Compare Models',desc:'Logistic Regression, Decision Tree, Random Forest'},{icon:'04',label:'Optimize Recall',desc:'Maximize fraud detection, minimize false positives'}].map((a,i)=>(
                                    <div key={i} className={styles.approachCard}><div className={styles.approachIcon}>{a.icon}</div><div className={styles.approachLabel}>{a.label}</div><div className={styles.approachDesc}>{a.desc}</div></div>
                                  ))}
                                </div>
                                <div className={styles.toolsRow}><span className={styles.panelLabel}>Tools</span><div className={styles.toolsList} style={{marginTop:8}}>{project.tools?.map((t,i)=><span key={i} className={styles.tool} style={{fontSize:13,padding:'5px 12px'}}>{t}</span>)}</div></div>
                              </div>
                            )}
                            {currentTab==='analysis'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.statRow}>
                                  <div className={styles.statBox}><div className={styles.statNum}>284,807</div><div className={styles.statLabel}>Transactions</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum}>31</div><div className={styles.statLabel}>Variables</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum} style={{color:'#e8729a'}}>0.17%</div><div className={styles.statLabel}>Fraud Rate</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum}>2 days</div><div className={styles.statLabel}>Window</div></div>
                                </div>
                                <PieChart/>
                                <EdaCards/>
                              </div>
                            )}
                            {currentTab==='methodology'&&(
                              <div className={styles.panelContent}>
                                {project.methodology&&<PipelineSteps steps={project.methodology} hasCharts={hasCharts}/>}
                                {project.models&&<div className={styles.panelBlock}><span className={styles.panelLabel}>Models</span><div className={styles.modelsCompact}>{project.models.map((m,i)=>(<div key={i} className={`${styles.modelCompact} ${m.name&&m.name.includes('Best')?styles.modelCompactBest:''}`}><div className={styles.modelCompactName}>{m.name}</div><div className={styles.modelCompactStats}><span className={styles.mStat}><span className={styles.mVal}>{m.accuracy}</span><span className={styles.mKey}>Acc</span></span><span className={styles.mStat}><span className={styles.mVal} style={{color:'#e8729a'}}>{m.recall_fraud}</span><span className={styles.mKey}>Recall</span></span><span className={styles.mStat}><span className={styles.mVal}>{m.fp}</span><span className={styles.mKey}>FP</span></span></div><div className={styles.modelCompactNote}>{m.note}</div></div>))}</div></div>}
                              </div>
                            )}
                            {currentTab==='results'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.heroStats}>
                                  <div className={styles.heroStat}><div className={styles.heroNum}>99.95%</div><div className={styles.heroLabel}>Accuracy</div><div className={styles.heroSub}>Random Forest</div></div>
                                  <div className={styles.heroStat} style={{borderColor:'#e8729a'}}><div className={styles.heroNum} style={{color:'#e8729a'}}>84.16%</div><div className={styles.heroLabel}>Recall on Fraud</div><div className={styles.heroSub}>85 of 101 caught</div></div>
                                  <div className={styles.heroStat} style={{borderColor:'#5a9e82'}}><div className={styles.heroNum} style={{color:'#5a9e82'}}>10</div><div className={styles.heroLabel}>False Positives</div><div className={styles.heroSub}>vs 1,393 (LR+SMOTE)</div></div>
                                </div>
                                <ModelCompareChart/>
                                <ConfusionMatrix/>
                              </div>
                            )}
                            {currentTab==='outcome'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Impact</span>
                                  <div className={styles.impactRow}>
                                    <div className={styles.impactStat} style={{borderColor:'#5a9e82'}}><div className={styles.impactNum} style={{color:'#5a9e82'}}>99.98%</div><div className={styles.impactLabel}>Specificity</div><div className={styles.impactSub}>Zero customer disruption</div></div>
                                    <div className={styles.impactStat} style={{borderColor:'#e8729a'}}><div className={styles.impactNum} style={{color:'#e8729a'}}>84%</div><div className={styles.impactLabel}>Fraud Caught</div><div className={styles.impactSub}>Before financial loss</div></div>
                                    <div className={styles.impactStat} style={{borderColor:'#5b8db8'}}><div className={styles.impactNum} style={{color:'#5b8db8'}}>~99%</div><div className={styles.impactLabel}>Workload Cut</div><div className={styles.impactSub}>Manual review reduced</div></div>
                                    <div className={styles.impactStat} style={{borderColor:'#9060c0'}}><div className={styles.impactNum} style={{color:'#9060c0'}}>10</div><div className={styles.impactLabel}>False Positives</div><div className={styles.impactSub}>vs 1,393 from LR</div></div>
                                  </div>
                                  <div className={styles.tierGrid}>
                                    <div className={styles.tierCard} style={{borderTopColor:'#5a9e82'}}><div className={styles.tierLabel} style={{color:'#5a9e82'}}>Now: Deploy</div><div className={styles.tierDesc}>3-tier alert system replacing manual review.</div></div>
                                    <div className={styles.tierCard} style={{borderTopColor:'#f0a030'}}><div className={styles.tierLabel} style={{color:'#f0a030'}}>Next: Explain</div><div className={styles.tierDesc}>SHAP explainability for compliance.</div></div>
                                    <div className={styles.tierCard} style={{borderTopColor:'#5b8db8'}}><div className={styles.tierLabel} style={{color:'#5b8db8'}}>Future: Real-time</div><div className={styles.tierDesc}>Sub-second stream scoring.</div></div>
                                  </div>
                                </div>
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Reflection</span>
                                  <div className={styles.reflectGrid}>
                                    <div className={styles.reflectCard} style={{borderTopColor:'#5a9e82'}}>
                                      <div className={styles.reflectHeader} style={{color:'#5a9e82'}}><span>✓</span> What worked</div>
                                      <ul className={styles.reflectList}>
                                        <li><span className={styles.reflectHL}>SMOTE + Random Forest</span> solved class imbalance — recall 63% to 84%, false positives held at just 10</li>
                                        <li><span className={styles.reflectHL}>Robust Scaler</span> resisted $25,691 outlier distortion where standard normalization would have failed</li>
                                        <li>Framing results as <span className={styles.reflectHL}>operational cost (FP count)</span> rather than accuracy % resonated far more with bank leadership</li>
                                      </ul>
                                    </div>
                                    <div className={styles.reflectCard} style={{borderTopColor:'#e8729a'}}>
                                      <div className={styles.reflectHeader} style={{color:'#e8729a'}}><span>→</span> What I would do differently</div>
                                      <ul className={styles.reflectList}>
                                        <li>Add <span className={styles.reflectHL}>real-time scoring pipeline</span> — most fraud losses occur within 30 minutes of the transaction</li>
                                        <li>Use <span className={styles.reflectHL}>cost-sensitive loss function</span> weighting missed fraud 10x higher than false positives</li>
                                        <li>Build <span className={styles.reflectHL}>SHAP explainability</span> so analysts understand why each transaction was flagged</li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Real-world Parallels <span style={{fontWeight:400,color:'#bbb',fontSize:9,letterSpacing:0}}>click a case</span></span>
                                  <ParallelCases/>
                                </div>
                              </div>
                            )}
                            </>
                          )}

                          {/* ══ PROJECT 2 TABS ══ */}
                          {isP2&&(
                            <>
                            {currentTab==='context'&&(
                              <div className={`${styles.panelContent} ${contextHighlight===project.id?styles.panelContentHighlight:''}`}>
                                <div className={styles.problemBox}>
                                  <div className={styles.problemLabel}>The Problem</div>
                                  <div className={styles.problemText}>E-commerce platforms generate massive behavioral data that remains underutilized without effective visualization. This project analyzed Walmart India customer data to extract actionable business insights — translating raw transaction records into strategic recommendations across demographics, products, payments, and geography.</div>
                                </div>
                                <div className={styles.statRow}>
                                  <div className={styles.statBox}><div className={styles.statNum}>21K</div><div className={styles.statLabel}>Transactions</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum}>14</div><div className={styles.statLabel}>Variables</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum} style={{color:'#5b8db8'}}>6</div><div className={styles.statLabel}>Dimensions Analyzed</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum}>12</div><div className={styles.statLabel}>Cities</div></div>
                                </div>
                                <div className={styles.eda3col}>
                                  <div className={styles.edaCard}><div className={styles.edaTitle}>Dataset</div><div className={styles.edaDesc}>Kaggle open dataset — Walmart India. 14 fields: CID, TID, Gender, Age Group, Purchase Date, Product Category, Discount, Payment Method, Location, Net Amount.</div></div>
                                  <div className={styles.edaCard}><div className={styles.edaTitle}>Scope</div><div className={styles.edaDesc}>Full year of transactions across 12 Indian cities. Demographics, product, payment, seasonal, and geographic dimensions analyzed.</div></div>
                                  <div className={styles.edaCard}><div className={styles.edaTitle}>Storytelling</div><div className={styles.edaDesc}>3 buyer personas (Khari / Nayar / Sam) woven through analysis — making insights memorable and boardroom-ready.</div></div>
                                </div>
                                {project.supervisor&&(<div className={styles.contextMeta}><span>Supervisor: {project.supervisor}</span><span>{project.institution} / {project.period}</span></div>)}
                              </div>
                            )}
                            {currentTab==='approach'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.problemBox}>
                                  <div className={styles.problemLabel}>Research Question</div>
                                  <div className={styles.problemText}>{project.researchQuestion}</div>
                                </div>
                                <div className={styles.approachGrid}>
                                  {[{icon:'01',label:'Demographics',desc:'Gender, age group, revenue by cohort — who is buying?'},{icon:'02',label:'Products',desc:'Category revenue ranking, seasonal trends, discount utilization'},{icon:'03',label:'Payments',desc:'Credit/Debit/UPI/COD breakdown — how are they paying?'},{icon:'04',label:'Geography',desc:'City-level revenue mapping — top vs emerging markets'},{icon:'05',label:'Seasonal',desc:'Monthly trends, peak periods, promotional timing'},{icon:'06',label:'Storytelling',desc:'3 buyer personas weaving data into a business narrative'}].map((a,i)=>(
                                    <div key={i} className={styles.approachCard}><div className={styles.approachIcon}>{a.icon}</div><div className={styles.approachLabel}>{a.label}</div><div className={styles.approachDesc}>{a.desc}</div></div>
                                  ))}
                                </div>
                                <div className={styles.toolsRow}><span className={styles.panelLabel}>Tools</span><div className={styles.toolsList} style={{marginTop:8}}>{project.tools?.map((t,i)=><span key={i} className={styles.tool} style={{fontSize:13,padding:'5px 12px'}}>{t}</span>)}</div></div>
                              </div>
                            )}
                            {currentTab==='analysis'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.statRow}>
                                  <div className={styles.statBox}><div className={styles.statNum} style={{color:'#5b8db8'}}>33/33/33</div><div className={styles.statLabel}>Gender Split (%)</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum} style={{color:'#e8729a'}}>25-45</div><div className={styles.statLabel}>Core Age Group</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum} style={{color:'#5a9e82'}}>Electronics</div><div className={styles.statLabel}>Top Category</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum} style={{color:'#9060c0'}}>Mumbai</div><div className={styles.statLabel}>Top City</div></div>
                                </div>
                                <RevenueBarChart models={project.models}/>
                                <SeasonalChart/>
                                <div className={styles.eda3col}>
                                  <div className={styles.edaCard}>
                                    <div className={styles.edaTitle}>Gender Distribution</div>
                                    <div className={styles.edaStat} style={{color:'#5b8db8'}}>33/33/33</div>
                                    <div className={styles.edaDesc}>Female 33.6%, Male 32.9%, Other 33.5% — near-perfect parity. Rare in e-commerce — signals genuinely inclusive platform design.</div>
                                  </div>
                                  <div className={styles.edaCard}>
                                    <div className={styles.edaTitle}>Age Revenue</div>
                                    <div className={styles.edaStat} style={{color:'#e8729a'}}>60M+</div>
                                    <div className={styles.edaDesc}>Age 25-45 generates 60M+ INR — 3x the 45-60 group (20M). Classic Pareto: 33% of users driving 60% of revenue.</div>
                                  </div>
                                  <div className={styles.edaCard}>
                                    <div className={styles.edaTitle}>Geographic Spread</div>
                                    <div className={styles.edaStat} style={{color:'#5a9e82'}}>32M</div>
                                    <div className={styles.edaDesc}>Mumbai leads at 32M INR, Delhi 31M. Dehradun and Srinagar under 2M — untapped Tier-2 growth markets.</div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {currentTab==='methodology'&&(
                              <div className={styles.panelContent}>
                                {project.methodology&&<PipelineSteps steps={project.methodology} hasCharts={false}/>}
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Visualization Stack</span>
                                  <div className={styles.eda3col}>
                                    <div className={styles.edaCard}><div className={styles.edaTitle}>Pandas</div><div className={styles.edaDesc}>Data cleaning, type conversion, date parsing, aggregation by category/city/age group.</div></div>
                                    <div className={styles.edaCard}><div className={styles.edaTitle}>Matplotlib + Seaborn</div><div className={styles.edaDesc}>Static charts — bar, pie, box plots for distribution analysis and category comparison.</div></div>
                                    <div className={styles.edaCard}><div className={styles.edaTitle}>Plotly</div><div className={styles.edaDesc}>Interactive charts for the Streamlit dashboard — hover, zoom, filter by dimension.</div></div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {currentTab==='results'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.heroStats}>
                                  <div className={styles.heroStat} style={{borderColor:'#5b8db8'}}><div className={styles.heroNum} style={{color:'#5b8db8'}}>441K</div><div className={styles.heroLabel}>Electronics Revenue</div><div className={styles.heroSub}>INR — top category by 30%</div></div>
                                  <div className={styles.heroStat} style={{borderColor:'#e8729a'}}><div className={styles.heroNum} style={{color:'#e8729a'}}>60M+</div><div className={styles.heroLabel}>Core Segment Revenue</div><div className={styles.heroSub}>Age 25-45 — 3x next cohort</div></div>
                                  <div className={styles.heroStat} style={{borderColor:'#5a9e82'}}><div className={styles.heroNum} style={{color:'#5a9e82'}}>80%</div><div className={styles.heroLabel}>Seasonal Swing</div><div className={styles.heroSub}>Dec 18M vs Feb 10M</div></div>
                                </div>
                                <PaymentChart/>
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Key Results</span>
                                  <ul className={styles.resultsList}>{project.results?.map((r,i)=><li key={i}>{r}</li>)}</ul>
                                </div>
                              </div>
                            )}
                            {currentTab==='outcome'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Impact</span>
                                  <div className={styles.impactRow}>
                                    <div className={styles.impactStat} style={{borderColor:'#5b8db8'}}><div className={styles.impactNum} style={{color:'#5b8db8'}}>441K</div><div className={styles.impactLabel}>Top Category</div><div className={styles.impactSub}>Electronics INR</div></div>
                                    <div className={styles.impactStat} style={{borderColor:'#e8729a'}}><div className={styles.impactNum} style={{color:'#e8729a'}}>60M+</div><div className={styles.impactLabel}>Core Segment</div><div className={styles.impactSub}>Age 25-45 revenue</div></div>
                                    <div className={styles.impactStat} style={{borderColor:'#5a9e82'}}><div className={styles.impactNum} style={{color:'#5a9e82'}}>80%</div><div className={styles.impactLabel}>Seasonal Gap</div><div className={styles.impactSub}>Feb low to Dec peak</div></div>
                                    <div className={styles.impactStat} style={{borderColor:'#9060c0'}}><div className={styles.impactNum} style={{color:'#9060c0'}}>14.6%</div><div className={styles.impactLabel}>UPI Growth</div><div className={styles.impactSub}>Fastest payment segment</div></div>
                                  </div>
                                  <div className={styles.tierGrid}>
                                    <div className={styles.tierCard} style={{borderTopColor:'#5b8db8'}}><div className={styles.tierLabel} style={{color:'#5b8db8'}}>Priority: Electronics</div><div className={styles.tierDesc}>Front-load inventory before Q4. SEASONALOFFER21 drove 15K purchases — replicate at scale.</div></div>
                                    <div className={styles.tierCard} style={{borderTopColor:'#e8729a'}}><div className={styles.tierLabel} style={{color:'#e8729a'}}>Target: Age 25-45</div><div className={styles.tierDesc}>Loyalty program for core cohort. 60% of revenue from 33% of users — protect CLV.</div></div>
                                    <div className={styles.tierCard} style={{borderTopColor:'#9060c0'}}><div className={styles.tierLabel} style={{color:'#9060c0'}}>Expand: Tier-2 Cities</div><div className={styles.tierDesc}>Dehradun, Srinagar under 2M INR — localized campaigns to unlock growth ceiling.</div></div>
                                  </div>
                                </div>
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Reflection</span>
                                  <div className={styles.reflectGrid}>
                                    <div className={styles.reflectCard} style={{borderTopColor:'#5a9e82'}}>
                                      <div className={styles.reflectHeader} style={{color:'#5a9e82'}}><span>✓</span> What worked</div>
                                      <ul className={styles.reflectList}>
                                        <li><span className={styles.reflectHL}>Data storytelling via personas</span> (Khari/Nayar/Sam) made the analysis memorable — not just charts but a narrative</li>
                                        <li><span className={styles.reflectHL}>Plotly interactive charts</span> let stakeholders self-explore instead of passively receiving slides</li>
                                        <li>Identifying <span className={styles.reflectHL}>Tier-2 cities as untapped markets</span> gave actionable strategic insight beyond what was asked</li>
                                      </ul>
                                    </div>
                                    <div className={styles.reflectCard} style={{borderTopColor:'#e8729a'}}>
                                      <div className={styles.reflectHeader} style={{color:'#e8729a'}}><span>→</span> What I would do differently</div>
                                      <ul className={styles.reflectList}>
                                        <li>Build a <span className={styles.reflectHL}>predictive layer</span> — forecast next quarter revenue by category using time series models</li>
                                        <li>Add <span className={styles.reflectHL}>customer lifetime value (CLV)</span> segmentation within the 25-45 cohort to identify highest-value sub-segments</li>
                                        <li>Use <span className={styles.reflectHL}>A/B testing framework</span> to measure SEASONALOFFER21 ROI against discount cost</li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Real-world Parallels <span style={{fontWeight:400,color:'#bbb',fontSize:9,letterSpacing:0}}>click a case</span></span>
                                  <P2ParallelCases/>
                                </div>
                              </div>
                            )}
                            </>
                          )}

                          {/* ══ PROJECT 3 ══ */}
                          {project.id===3&&(
                            <>
                            {currentTab==='context'&&(
                              <div className={`${styles.panelContent} ${contextHighlight===project.id?styles.panelContentHighlight:''}`}>
                                <div className={styles.problemBox}>
                                  <div className={styles.problemLabel}>The Problem</div>
                                  <div className={styles.problemText}>While IT adoption in banking is well-studied, no prior research had examined the combined effect of core banking, basic IT, and e-payment systems on credit risk simultaneously. This study fills that gap using regularized regression on Vietnamese commercial bank data — 2017 to 2022.</div>
                                </div>
                                <div className={styles.statRow}>
                                  <div className={styles.statBox}><div className={styles.statNum}>121</div><div className={styles.statLabel}>Observations</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum}>3</div><div className={styles.statLabel}>IT Variables</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum} style={{color:'#e8729a'}}>0.156</div><div className={styles.statLabel}>Ridge Lambda</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum}>5 yrs</div><div className={styles.statLabel}>Data Period</div></div>
                                </div>
                                <div className={styles.eda3col}>
                                  <div className={styles.edaCard}><div className={styles.edaTitle}>COB</div><div className={styles.edaStat} style={{color:'#5a9e82'}}>β = -0.009</div><div className={styles.edaDesc}>Core Banking Index: modules deployed, system connections, automation level, data reconciliation quality.</div></div>
                                  <div className={styles.edaCard}><div className={styles.edaTitle}>BAD</div><div className={styles.edaStat} style={{color:'#5b8db8'}}>β = -0.020</div><div className={styles.edaDesc}>Basic IT Applications: data management, analytics tools, IT infrastructure quality across the bank.</div></div>
                                  <div className={styles.edaCard}><div className={styles.edaTitle}>DAP</div><div className={styles.edaStat} style={{color:'#e8729a'}}>β = +0.206</div><div className={styles.edaDesc}>Electronic Payment: interbank e-payment, SWIFT, bilateral payment systems — increases credit risk.</div></div>
                                </div>
                                <div className={styles.contextMeta}>
                                  <span>Co-authors: {project.supervisor}</span>
                                  <span>{project.institution} · {project.period} · {project.doi}</span>
                                </div>
                              </div>
                            )}
                            {currentTab==='approach'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.problemBox}>
                                  <div className={styles.problemLabel}>Research Question</div>
                                  <div className={styles.problemText}>{project.researchQuestion}</div>
                                </div>
                                <div className={styles.approachGrid}>
                                  {[{icon:'01',label:'Gap Identification',desc:'First study to combine COB + BAD + DAP effects on credit risk simultaneously'},{icon:'02',label:'Variable Construction',desc:'COB = 5 sub-indices from ICT Report; RIST = bad debt % of total outstanding'},{icon:'03',label:'Ridge Regression',desc:'L2 regularization (λ=0.156) handles multicollinearity between IT indices'},{icon:'04',label:'Validation Strategy',desc:'77/20/24 train-validation-test split; MSE, RMSE, MAE/MAD, MAPE evaluated'}].map((a,i)=>(
                                    <div key={i} className={styles.approachCard}><div className={styles.approachIcon}>{a.icon}</div><div className={styles.approachLabel}>{a.label}</div><div className={styles.approachDesc}>{a.desc}</div></div>
                                  ))}
                                </div>
                                <div className={styles.toolsRow}><span className={styles.panelLabel}>Tools</span><div className={styles.toolsList} style={{marginTop:8}}>{project.tools?.map((t,i)=><span key={i} className={styles.tool} style={{fontSize:13,padding:'5px 12px'}}>{t}</span>)}</div></div>
                              </div>
                            )}
                            {currentTab==='analysis'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.statRow}>
                                  <div className={styles.statBox}><div className={styles.statNum}>121</div><div className={styles.statLabel}>Observations</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum}>2017-22</div><div className={styles.statLabel}>Period</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum} style={{color:'#e8729a'}}>Unbalanced</div><div className={styles.statLabel}>Panel Type</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum}>Listed</div><div className={styles.statLabel}>Bank Coverage</div></div>
                                </div>
                                <div className={styles.eda3col}>
                                  <div className={styles.edaCard}><div className={styles.edaTitle}>Data Source 1</div><div className={styles.edaDesc}>Vietnam ICT Index Reports (2017-2020, 2022) — Ministry of Information and Communications. No 2021 report exists, creating unbalanced panel.</div></div>
                                  <div className={styles.edaCard}><div className={styles.edaTitle}>Data Source 2</div><div className={styles.edaDesc}>Financial statements of Vietnamese commercial banks listed on stock exchange. RIST = % bad debt with capital loss risk / total outstanding debt.</div></div>
                                  <div className={styles.edaCard}><div className={styles.edaTitle}>Panel Structure</div><div className={styles.edaDesc}>Unbalanced panel — bank list in ICT Index varies by year. 121 obs collected across banks with complete COB, BAD, DAP, and RIST data.</div></div>
                                </div>
                                <ModelMetricsChart/>
                              </div>
                            )}
                            {currentTab==='methodology'&&(
                              <div className={styles.panelContent}>
                                {project.methodology&&<PipelineSteps steps={project.methodology} hasCharts={false}/>}
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Why Ridge Regression?</span>
                                  <div className={styles.eda3col}>
                                    <div className={styles.edaCard}><div className={styles.edaTitle}>Multicollinearity</div><div className={styles.edaDesc}>COB, BAD, DAP are correlated IT indices. OLS would inflate coefficients. Ridge L2 penalty shrinks them toward zero stably.</div></div>
                                    <div className={styles.edaCard}><div className={styles.edaTitle}>Small Sample</div><div className={styles.edaDesc}>121 observations across 5 years. Regularization prevents overfitting — critical when n is small relative to variable complexity.</div></div>
                                    <div className={styles.edaCard}><div className={styles.edaTitle}>Lambda = 0.156</div><div className={styles.edaDesc}>Optimal penalty found via cross-validation. Balances bias-variance tradeoff: enough shrinkage without losing explanatory power.</div></div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {currentTab==='results'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.heroStats}>
                                  <div className={styles.heroStat} style={{borderColor:'#e8729a'}}><div className={styles.heroNum} style={{color:'#e8729a'}}>+0.206</div><div className={styles.heroLabel}>DAP Coefficient</div><div className={styles.heroSub}>E-payment INCREASES risk</div></div>
                                  <div className={styles.heroStat} style={{borderColor:'#5b8db8'}}><div className={styles.heroNum} style={{color:'#5b8db8'}}>0.837</div><div className={styles.heroLabel}>BAD Importance</div><div className={styles.heroSub}>Highest feature score</div></div>
                                  <div className={styles.heroStat} style={{borderColor:'#5a9e82'}}><div className={styles.heroNum} style={{color:'#5a9e82'}}>0.363</div><div className={styles.heroLabel}>Test MSE</div><div className={styles.heroSub}>No overfitting detected</div></div>
                                </div>
                                <CoefficientChart/>
                                <FeatureImportanceChart/>
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Key Results</span>
                                  <ul className={styles.resultsList}>{project.results?.map((r,i)=><li key={i}>{r}</li>)}</ul>
                                </div>
                              </div>
                            )}
                            {currentTab==='outcome'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Policy Impact</span>
                                  <div className={styles.impactRow}>
                                    <div className={styles.impactStat} style={{borderColor:'#e8729a'}}><div className={styles.impactNum} style={{color:'#e8729a'}}>+0.206</div><div className={styles.impactLabel}>DAP Risk Signal</div><div className={styles.impactSub}>Largest coefficient — highest priority for monitoring</div></div>
                                    <div className={styles.impactStat} style={{borderColor:'#5b8db8'}}><div className={styles.impactNum} style={{color:'#5b8db8'}}>0.837</div><div className={styles.impactLabel}>BAD Importance</div><div className={styles.impactSub}>IT infrastructure quality matters most</div></div>
                                    <div className={styles.impactStat} style={{borderColor:'#5a9e82'}}><div className={styles.impactNum} style={{color:'#5a9e82'}}>0.457</div><div className={styles.impactLabel}>MAE/MAD</div><div className={styles.impactSub}>Below 0.5 threshold — model valid</div></div>
                                    <div className={styles.impactStat} style={{borderColor:'#9060c0'}}><div className={styles.impactNum} style={{color:'#9060c0'}}>121</div><div className={styles.impactLabel}>Observations</div><div className={styles.impactSub}>Vietnamese commercial banks 2017-2022</div></div>
                                  </div>
                                  <div className={styles.tierGrid}>
                                    <div className={styles.tierCard} style={{borderTopColor:'#5a9e82'}}><div className={styles.tierLabel} style={{color:'#5a9e82'}}>Invest: COB + BAD</div><div className={styles.tierDesc}>Upgrading core banking and basic IT reduces credit risk. Prioritize data analytics and automation quality.</div></div>
                                    <div className={styles.tierCard} style={{borderTopColor:'#e8729a'}}><div className={styles.tierLabel} style={{color:'#e8729a'}}>Control: DAP</div><div className={styles.tierDesc}>E-payment expansion must be paired with strict security policies and real-time transaction monitoring.</div></div>
                                    <div className={styles.tierCard} style={{borderTopColor:'#5b8db8'}}><div className={styles.tierLabel} style={{color:'#5b8db8'}}>Improve: Model</div><div className={styles.tierDesc}>MAPE=55.55% is a known limitation. XGBoost or neural networks could improve point prediction accuracy.</div></div>
                                  </div>
                                </div>
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Reflection</span>
                                  <div className={styles.reflectGrid}>
                                    <div className={styles.reflectCard} style={{borderTopColor:'#5a9e82'}}>
                                      <div className={styles.reflectHeader} style={{color:'#5a9e82'}}><span>✓</span> What worked</div>
                                      <ul className={styles.reflectList}>
                                        <li><span className={styles.reflectHL}>Ridge regression</span> was the right choice — multicollinearity between IT indices would have corrupted OLS estimates</li>
                                        <li>The <span className={styles.reflectHL}>DAP finding (+0.206)</span> was counterintuitive and immediately policy-relevant — e-payments increase risk</li>
                                        <li>Using <span className={styles.reflectHL}>mean dropout loss</span> for feature importance gave a more stable ranking than permutation importance on small samples</li>
                                      </ul>
                                    </div>
                                    <div className={styles.reflectCard} style={{borderTopColor:'#e8729a'}}>
                                      <div className={styles.reflectHeader} style={{color:'#e8729a'}}><span>→</span> What I would do differently</div>
                                      <ul className={styles.reflectList}>
                                        <li>Address <span className={styles.reflectHL}>MAPE=55.55%</span> — try XGBoost or Elastic Net; the high MAPE suggests non-linear relationships the linear model misses</li>
                                        <li>Expand dataset: <span className={styles.reflectHL}>include 2021 imputed data</span> and extend to non-listed banks for a balanced panel</li>
                                        <li>Add <span className={styles.reflectHL}>interaction terms</span> (COB × DAP) to capture whether core banking modernization moderates e-payment risk</li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Real-world Parallels <span style={{fontWeight:400,color:'#bbb',fontSize:9,letterSpacing:0}}>click a case</span></span>
                                  <P3ParallelCases/>
                                </div>
                              </div>
                            )}
                            </>
                          )}

                          {/* ══ PROJECT 4 — AI Impact on Sharing Economy ══ */}
                          {isP4&&(
                            <>
                            {currentTab==='context'&&(
                              <div className={`${styles.panelContent} ${contextHighlight===project.id?styles.panelContentHighlight:''}`}>
                                <div className={styles.problemBox}>
                                  <div className={styles.problemLabel}>The Problem</div>
                                  <div className={styles.problemText}>AI is transforming sharing economy platforms, but prior studies examined individual sectors in isolation. No research had simultaneously compared AI impact across transportation, accommodation, and other shared services using structural modeling. This study develops validated measurement scales for 12 AI applications and quantifies cross-sector impact using GSCA on 250 survey respondents in Ho Chi Minh City.</div>
                                </div>
                                <div className={styles.statRow}>
                                  <div className={styles.statBox}><div className={styles.statNum}>250</div><div className={styles.statLabel}>Respondents</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum}>12</div><div className={styles.statLabel}>AI App Scales</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum} style={{color:'#5b8db8'}}>3</div><div className={styles.statLabel}>Sharing Sectors</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum}>18</div><div className={styles.statLabel}>Significant Paths</div></div>
                                </div>
                                <div className={styles.eda3col}>
                                  <div className={styles.edaCard}><div className={styles.edaTitle}>SC — Transportation</div><div className={styles.edaStat} style={{color:'#5b8db8'}}>β = 0.385</div><div className={styles.edaDesc}>5 AI constructs: schedule optimization, demand forecasting, user authentication, automated support, predictive maintenance.</div></div>
                                  <div className={styles.edaCard}><div className={styles.edaTitle}>HS — Accommodation</div><div className={styles.edaStat} style={{color:'#5a9e82'}}>β = 0.295</div><div className={styles.edaDesc}>4 AI constructs: recommendation system, enhanced security, demand trend forecasting, enhanced user experience.</div></div>
                                  <div className={styles.edaCard}><div className={styles.edaTitle}>SOS — Other Services</div><div className={styles.edaStat} style={{color:'#9060c0'}}>β = 0.265</div><div className={styles.edaDesc}>3 AI constructs: electronics sharing, household sharing, sports equipment sharing platforms.</div></div>
                                </div>
                                <div className={styles.contextMeta}><span>Co-authors: {project.supervisor}</span><span>{project.institution} · {project.period} · {project.doi}</span></div>
                              </div>
                            )}
                            {currentTab==='approach'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.problemBox}><div className={styles.problemLabel}>Research Question</div><div className={styles.problemText}>{project.researchQuestion}</div></div>
                                <div className={styles.approachGrid}>
                                  {[{icon:'01',label:'Scale Development',desc:'12 AI application constructs from group discussions — each measured by 4–5 Likert items'},{icon:'02',label:'Survey Collection',desc:'300 printed questionnaires → 250 valid. Convenience sampling: HCMC university students'},{icon:'03',label:'Reliability Testing',desc:"McDonald's Omega (all >0.769). Corrected item-total correlations all >0.3"},{icon:'04',label:'EFA Validation',desc:'ULS extraction, Promax rotation. KMO=0.825–0.878 significant at 1%'},{icon:'05',label:'GSCA Modeling',desc:'Generalized Structured Component Analysis — handles both formative & reflective variables in one model'},{icon:'06',label:'Path Analysis',desc:'Bootstrap 95% CI for all 18 paths. GFI=0.973 > 0.93, SRMR=0.046 < 0.08'}].map((a,i)=>(
                                    <div key={i} className={styles.approachCard}><div className={styles.approachIcon}>{a.icon}</div><div className={styles.approachLabel}>{a.label}</div><div className={styles.approachDesc}>{a.desc}</div></div>
                                  ))}
                                </div>
                                <div className={styles.toolsRow}><span className={styles.panelLabel}>Tools</span><div className={styles.toolsList} style={{marginTop:8}}>{project.tools?.map((t,i)=><span key={i} className={styles.tool} style={{fontSize:13,padding:'5px 12px'}}>{t}</span>)}</div></div>
                              </div>
                            )}
                            {currentTab==='analysis'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.statRow}>
                                  <div className={styles.statBox}><div className={styles.statNum}>250</div><div className={styles.statLabel}>Valid Responses</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum} style={{color:'#5b8db8'}}>0.825</div><div className={styles.statLabel}>KMO (Indep.)</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum} style={{color:'#5a9e82'}}>53.4%</div><div className={styles.statLabel}>Cumul. Variance</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum}>0.769+</div><div className={styles.statLabel}>Min Omega</div></div>
                                </div>
                                <div className={styles.eda3col}>
                                  <div className={styles.edaCard}><div className={styles.edaTitle}>Sampling & Data Quality</div><div className={styles.edaDesc}>300 printed questionnaires distributed Dec 2023–Jan 2024. 250 valid (83.3% rate). Convenience sample of HCMC students actively using sharing platforms.</div></div>
                                  <div className={styles.edaCard}><div className={styles.edaTitle}>Reliability Analysis</div><div className={styles.edaDesc}>All 15 scales pass reliability threshold. McDonald's Omega range: 0.769–0.834. Corrected item-total r: 0.512–0.706. All well above 0.3 cutoff.</div></div>
                                  <div className={styles.edaCard}><div className={styles.edaTitle}>EFA Results</div><div className={styles.edaDesc}>12 independent factors (53.42% variance). 3 dependent factors (55.03% variance). KMO=0.878 for dependent variables — excellent factor structure.</div></div>
                                </div>
                                <ModelFitCard/>
                              </div>
                            )}
                            {currentTab==='methodology'&&(
                              <div className={styles.panelContent}>
                                {project.methodology&&<PipelineSteps steps={project.methodology} hasCharts={false}/>}
                                <div className={styles.panelBlock}><span className={styles.panelLabel}>Why GSCA?</span><div className={styles.eda3col}><div className={styles.edaCard}><div className={styles.edaTitle}>Mixed Indicators</div><div className={styles.edaDesc}>GSCA handles both formative variables (sector AI applications) and reflective variables (benefit dimensions BAI) in the same model — unlike standard SEM.</div></div><div className={styles.edaCard}><div className={styles.edaTitle}>High-Order Model</div><div className={styles.edaDesc}>BAI is a second-order construct (3 benefit dimensions). GSCA directly models this hierarchy without losing information through aggregation.</div></div><div className={styles.edaCard}><div className={styles.edaTitle}>Small Sample Robust</div><div className={styles.edaDesc}>250 respondents is adequate for GSCA but may strain covariance-based SEM. GSCA is distribution-free and performs well with moderate sample sizes.</div></div></div></div>
                              </div>
                            )}
                            {currentTab==='results'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.heroStats}>
                                  <div className={styles.heroStat} style={{borderColor:'#5b8db8'}}><div className={styles.heroNum} style={{color:'#5b8db8'}}>0.385</div><div className={styles.heroLabel}>Transportation β</div><div className={styles.heroSub}>Strongest AI impact sector</div></div>
                                  <div className={styles.heroStat} style={{borderColor:'#9060c0'}}><div className={styles.heroNum} style={{color:'#9060c0'}}>0.820</div><div className={styles.heroLabel}>BSO Loading</div><div className={styles.heroSub}>Highest benefit dimension</div></div>
                                  <div className={styles.heroStat} style={{borderColor:'#5a9e82'}}><div className={styles.heroNum} style={{color:'#5a9e82'}}>0.973</div><div className={styles.heroLabel}>GFI Model Fit</div><div className={styles.heroSub}>Excellent (threshold 0.93)</div></div>
                                </div>
                                <GSCAPathChart/>
                                <SectorLoadingChart/>
                                <BAILoadingChart/>
                                <div className={styles.panelBlock}><span className={styles.panelLabel}>Key Results</span><ul className={styles.resultsList}>{project.results?.map((r,i)=><li key={i}>{r}</li>)}</ul></div>
                              </div>
                            )}
                            {currentTab==='outcome'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Impact</span>
                                  <div className={styles.impactRow}>
                                    <div className={styles.impactStat} style={{borderColor:'#5b8db8'}}><div className={styles.impactNum} style={{color:'#5b8db8'}}>0.385</div><div className={styles.impactLabel}>Top Sector β</div><div className={styles.impactSub}>Transportation AI impact</div></div>
                                    <div className={styles.impactStat} style={{borderColor:'#9060c0'}}><div className={styles.impactNum} style={{color:'#9060c0'}}>0.727</div><div className={styles.impactLabel}>Top Application</div><div className={styles.impactSub}>PDP (demand forecasting)</div></div>
                                    <div className={styles.impactStat} style={{borderColor:'#5a9e82'}}><div className={styles.impactNum} style={{color:'#5a9e82'}}>44.1%</div><div className={styles.impactLabel}>Variance Explained</div><div className={styles.impactSub}>Structural model (FITs)</div></div>
                                    <div className={styles.impactStat} style={{borderColor:'#e8729a'}}><div className={styles.impactNum} style={{color:'#e8729a'}}>18</div><div className={styles.impactLabel}>Significant Paths</div><div className={styles.impactSub}>All 18 paths p&lt;0.05</div></div>
                                  </div>
                                  <div className={styles.tierGrid}>
                                    <div className={styles.tierCard} style={{borderTopColor:'#5b8db8'}}><div className={styles.tierLabel} style={{color:'#5b8db8'}}>Prioritize: Transportation AI</div><div className={styles.tierDesc}>Invest in dynamic pricing and route optimization — highest ROI sector (β=0.385). Deploy demand forecasting (PDP, loading 0.727) first.</div></div>
                                    <div className={styles.tierCard} style={{borderTopColor:'#5a9e82'}}><div className={styles.tierLabel} style={{color:'#5a9e82'}}>Scale: Accommodation AI</div><div className={styles.tierDesc}>Recommendation systems and trust mechanisms (VAS) drive accommodation benefits. Personalization is the highest-leverage AI application.</div></div>
                                    <div className={styles.tierCard} style={{borderTopColor:'#9060c0'}}><div className={styles.tierLabel} style={{color:'#9060c0'}}>Develop: Other Services</div><div className={styles.tierDesc}>Household (SH=0.750) and electronics (SE=0.748) show high AI potential despite lower adoption — largest untapped opportunity.</div></div>
                                  </div>
                                </div>
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Reflection</span>
                                  <div className={styles.reflectGrid}>
                                    <div className={styles.reflectCard} style={{borderTopColor:'#5a9e82'}}><div className={styles.reflectHeader} style={{color:'#5a9e82'}}><span>✓</span> What worked</div><ul className={styles.reflectList}><li><span className={styles.reflectHL}>GSCA over PLS-SEM</span> — handles mixed formative/reflective constructs without covariance structure assumptions</li><li><span className={styles.reflectHL}>McDonald's Omega</span> over Cronbach's alpha — more reliable estimate, especially for small samples</li><li>The <span className={styles.reflectHL}>three-sector simultaneous comparison</span> is the main contribution — no prior study quantified cross-sector AI impact this way</li></ul></div>
                                    <div className={styles.reflectCard} style={{borderTopColor:'#e8729a'}}><div className={styles.reflectHeader} style={{color:'#e8729a'}}><span>→</span> What I would do differently</div><ul className={styles.reflectList}><li>Expand beyond <span className={styles.reflectHL}>student sample</span> — platform operators and service providers would give less perception-biased data</li><li>Add <span className={styles.reflectHL}>longitudinal dimension</span> — measure respondents before/after AI adoption to establish causality, not just correlation</li><li>Include <span className={styles.reflectHL}>moderating variables</span> — digital literacy, income, and prior experience may moderate the AI-benefit relationship</li></ul></div>
                                  </div>
                                </div>
                                <div className={styles.panelBlock}><span className={styles.panelLabel}>Real-world Parallels <span style={{fontWeight:400,color:'#bbb',fontSize:9,letterSpacing:0}}>click a case</span></span><P4ParallelCases/></div>
                              </div>
                            )}
                            </>
                          )}


                          {/* PROJECT 5 — Panel Data Credit Risk */}
                          {project.id===5&&(
                            <>
                            {currentTab==='context'&&(
                              <div className={`${styles.panelContent} ${contextHighlight===project.id?styles.panelContentHighlight:''}`}>
                                <div className={styles.problemBox}>
                                  <div className={styles.problemLabel}>The Question Everyone Should Be Asking</div>
                                  <div className={styles.problemText}>When a bank starts accumulating bad loans, will it get better on its own — or keep getting worse? This study tracked 27 Vietnamese commercial banks for 10 years and found a clear answer: bad debt is sticky. Banks do not naturally recover; they need active intervention. And the economy outside the bank matters just as much as what is happening inside it.</div>
                                </div>
                                <div className={styles.statRow}>
                                  <div className={styles.statBox}><div className={styles.statNum}>27</div><div className={styles.statLabel}>Banks tracked</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum}>10 yrs</div><div className={styles.statLabel}>2012 to 2022</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum} style={{color:'#5b8db8'}}>272</div><div className={styles.statLabel}>Observations</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum}>54%</div><div className={styles.statLabel}>Of total banking risk</div></div>
                                </div>
                                <div className={styles.eda3col}>
                                  <div className={styles.edaCard}><div className={styles.edaTitle}>The Core Finding</div><div className={styles.edaStat} style={{color:'#5b8db8'}}>beta = 0.496</div><div className={styles.edaDesc}>Half of next year's bad debt is explained by this year's bad debt. Risk does not reset — it compounds unless banks act.</div></div>
                                  <div className={styles.edaCard}><div className={styles.edaTitle}>The Economy Matters</div><div className={styles.edaStat} style={{color:'#f0a030'}}>Macro drivers</div><div className={styles.edaDesc}>Unemployment and inflation both increase bad debt. When the economy struggles, banks struggle — no matter how well-run they are.</div></div>
                                  <div className={styles.edaCard}><div className={styles.edaTitle}>Size Is Protective</div><div className={styles.edaStat} style={{color:'#5a9e82'}}>beta = -0.0014</div><div className={styles.edaDesc}>Bigger banks have better screening, more diversified portfolios, and lower bad debt rates. Scale provides a natural buffer.</div></div>
                                </div>
                                {project.supervisor&&<div className={styles.contextMeta}><span>Course: {project.institution} · {project.period}</span></div>}
                              </div>
                            )}
                            {currentTab==='approach'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.problemBox}><div className={styles.problemLabel}>Research Question</div><div className={styles.problemText}>What factors explain differences in credit risk across Vietnamese commercial banks — and can we build a model that identifies which banks are heading toward trouble before it becomes visible?</div></div>
                                <div className={styles.approachGrid}>
                                  {[{icon:'01',label:'Collect Bank Data',desc:'11 variables per bank per year: past NPL, size, capital, GDP, inflation, unemployment across 27 banks 2012 to 2022'},{icon:'02',label:'Run 4 Models',desc:'OLS, Fixed Effects, Random Effects, GLS with error correction. Each answers a different question about which factors matter.'},{icon:'03',label:'Pick the Right One',desc:'Hausman Test selects Fixed Effects as the correct model. VIF checks confirm no multicollinearity problem.'},{icon:'04',label:'Translate to Policy',desc:'Convert statistical findings into Basel II/III aligned recommendations that risk managers can act on immediately.'}].map((a,i)=>(
                                    <div key={i} className={styles.approachCard}><div className={styles.approachIcon}>{a.icon}</div><div className={styles.approachLabel}>{a.label}</div><div className={styles.approachDesc}>{a.desc}</div></div>
                                  ))}
                                </div>
                                <div className={styles.toolsRow}><span className={styles.panelLabel}>Tools</span><div className={styles.toolsList} style={{marginTop:8}}>{project.tools?.map((t,i)=><span key={i} className={styles.tool} style={{fontSize:13,padding:'5px 12px'}}>{t}</span>)}</div></div>
                              </div>
                            )}
                            {currentTab==='analysis'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.statRow}>
                                  <div className={styles.statBox}><div className={styles.statNum}>272</div><div className={styles.statLabel}>Data points</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum}>11</div><div className={styles.statLabel}>Variables</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum} style={{color:'#5b8db8'}}>2012–22</div><div className={styles.statLabel}>3 economic phases</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum}>Basel II</div><div className={styles.statLabel}>Framework aligned</div></div>
                                </div>
                                <P5MacroChart/>
                                <P5BankSizeViz/>
                              </div>
                            )}
                            {currentTab==='methodology'&&(
                              <div className={styles.panelContent}>
                                {project.methodology&&<PipelineSteps steps={project.methodology} hasCharts={false}/>}
                                <div className={styles.panelBlock}><span className={styles.panelLabel}>Why 4 Different Models?</span>
                                  <div className={styles.eda3col}>
                                    <div className={styles.edaCard}><div className={styles.edaTitle}>OLS (Baseline)</div><div className={styles.edaDesc}>Simple regression. Quick to run but ignores that each bank is different. Used only to establish a starting point to improve on.</div></div>
                                    <div className={styles.edaCard}><div className={styles.edaTitle}>Fixed Effects (Winner)</div><div className={styles.edaDesc}>Accounts for each bank's unique characteristics: management quality, loan mix, regional focus. Hausman test confirmed this is the correct model.</div></div>
                                    <div className={styles.edaCard}><div className={styles.edaTitle}>GLS Correction</div><div className={styles.edaDesc}>Fixes heteroskedasticity (some banks have more volatile results than others). Ensures the standard errors we use for policy recommendations are reliable.</div></div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {currentTab==='results'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.heroStats}>
                                  <div className={styles.heroStat} style={{borderColor:'#5b8db8'}}><div className={styles.heroNum} style={{color:'#5b8db8'}}>0.496</div><div className={styles.heroLabel}>Bad Debt Persistence</div><div className={styles.heroSub}>50% carries forward year-over-year</div></div>
                                  <div className={styles.heroStat} style={{borderColor:'#f0a030'}}><div className={styles.heroNum} style={{color:'#f0a030'}}>2 macro</div><div className={styles.heroLabel}>Economy Signals</div><div className={styles.heroSub}>Unemployment + Inflation</div></div>
                                  <div className={styles.heroStat} style={{borderColor:'#5a9e82'}}><div className={styles.heroNum} style={{color:'#5a9e82'}}>-0.0014</div><div className={styles.heroLabel}>Size Effect</div><div className={styles.heroSub}>Bigger banks = safer banks</div></div>
                                </div>
                                <P5DriverChart/>
                                <div className={styles.panelBlock}><span className={styles.panelLabel}>Key Results</span><ul className={styles.resultsList}>{project.results?.map((r,i)=><li key={i}>{r}</li>)}</ul></div>
                              </div>
                            )}
                            {currentTab==='outcome'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>What This Means in Practice</span>
                                  <div className={styles.impactRow}>
                                    <div className={styles.impactStat} style={{borderColor:'#5b8db8'}}><div className={styles.impactNum} style={{color:'#5b8db8'}}>50%</div><div className={styles.impactLabel}>Risk carries forward</div><div className={styles.impactSub}>Banks need multi-year monitoring</div></div>
                                    <div className={styles.impactStat} style={{borderColor:'#f0a030'}}><div className={styles.impactNum} style={{color:'#f0a030'}}>Macro</div><div className={styles.impactLabel}>Early warning possible</div><div className={styles.impactSub}>Unemployment rises = NPL follows</div></div>
                                    <div className={styles.impactStat} style={{borderColor:'#5a9e82'}}><div className={styles.impactNum} style={{color:'#5a9e82'}}>27</div><div className={styles.impactLabel}>Banks benchmarked</div><div className={styles.impactSub}>Identifies institutions at risk</div></div>
                                    <div className={styles.impactStat} style={{borderColor:'#9060c0'}}><div className={styles.impactNum} style={{color:'#9060c0'}}>Basel</div><div className={styles.impactLabel}>Policy aligned</div><div className={styles.impactSub}>Basel II/III framework ready</div></div>
                                  </div>
                                  <div className={styles.tierGrid}>
                                    <div className={styles.tierCard} style={{borderTopColor:'#5b8db8'}}><div className={styles.tierLabel} style={{color:'#5b8db8'}}>For regulators</div><div className={styles.tierDesc}>Use macro indicators (unemployment, inflation) as leading signals. Do not wait for NPL to spike — act when unemployment starts rising.</div></div>
                                    <div className={styles.tierCard} style={{borderTopColor:'#5a9e82'}}><div className={styles.tierLabel} style={{color:'#5a9e82'}}>For banks</div><div className={styles.tierDesc}>Do not assume bad debt will self-correct. The beta=0.496 finding means active workout strategies are needed, not passive monitoring.</div></div>
                                    <div className={styles.tierCard} style={{borderTopColor:'#9060c0'}}><div className={styles.tierLabel} style={{color:'#9060c0'}}>For small banks</div><div className={styles.tierDesc}>Size disadvantage is real. Smaller banks need stricter internal credit standards to compensate for what scale provides automatically.</div></div>
                                  </div>
                                </div>
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Reflection</span>
                                  <div className={styles.reflectGrid}>
                                    <div className={styles.reflectCard} style={{borderTopColor:'#5a9e82'}}><div className={styles.reflectHeader} style={{color:'#5a9e82'}}><span>✓</span> What worked</div><ul className={styles.reflectList}><li><span className={styles.reflectHL}>Comparing 4 models</span> and using Hausman Test to select the right one shows methodological rigor</li><li><span className={styles.reflectHL}>10-year window</span> across three economic regimes gives the model real predictive credibility</li><li>Framing beta=0.496 as <span className={styles.reflectHL}>risk does not reset</span> made the finding immediately actionable for bank managers</li></ul></div>
                                    <div className={styles.reflectCard} style={{borderTopColor:'#9060c0'}}><div className={styles.reflectHeader} style={{color:'#9060c0'}}><span>→</span> What I would do differently</div><ul className={styles.reflectList}><li>Add <span className={styles.reflectHL}>bank-specific loan type breakdown</span> — real estate heavy banks behave differently from consumer credit banks</li><li>Build a <span className={styles.reflectHL}>real-time dashboard</span> that ingests SBV quarterly data and flags which banks are trending toward trouble</li><li>Test <span className={styles.reflectHL}>non-linear models</span> — bad debt persistence may accelerate past certain thresholds</li></ul></div>
                                  </div>
                                </div>
                                <div className={styles.panelBlock}><span className={styles.panelLabel}>Real-world Parallels <span style={{fontWeight:400,color:'#bbb',fontSize:9}}>click a case</span></span><P5ParallelCases/></div>
                              </div>
                            )}
                            </>
                          )}

                          {/* PROJECT 6 — Stock Bubble Detection */}
                          {project.id===6&&(
                            <>
                            {currentTab==='context'&&(
                              <div className={`${styles.panelContent} ${contextHighlight===project.id?styles.panelContentHighlight:''}`}>
                                <div className={styles.problemBox}>
                                  <div className={styles.problemLabel}>The Problem: Everyone Sees the Crash After It Happens</div>
                                  <div className={styles.problemText}>VN-Index crashed 35% in 2018 and again in 2022. Every time, retail investors only realized it was a bubble after losing money. This project asked: can we build a system that spots the warning signs 2 to 4 weeks before the crash, using only data that is publicly available in real time?</div>
                                </div>
                                <div className={styles.statRow}>
                                  <div className={styles.statBox}><div className={styles.statNum} style={{color:'#c04040'}}>35%</div><div className={styles.statLabel}>VN-Index crash 2018</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum} style={{color:'#c04040'}}>38%</div><div className={styles.statLabel}>VN-Index crash 2022</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum} style={{color:'#5a9e82'}}>2-4 wks</div><div className={styles.statLabel}>Early warning lead time</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum} style={{color:'#5b8db8'}}>97.5%</div><div className={styles.statLabel}>Detection accuracy</div></div>
                                </div>
                                <div className={styles.eda3col}>
                                  <div className={styles.edaCard}><div className={styles.edaTitle}>Signal 1: Market Math</div><div className={styles.edaStat} style={{color:'#5b8db8'}}>MF-DFA</div><div className={styles.edaDesc}>Mathematical analysis of VN-Index price patterns. Detects when market behavior becomes abnormally predictable — the hallmark of a forming bubble.</div></div>
                                  <div className={styles.edaCard}><div className={styles.edaTitle}>Signal 2: Human Behavior</div><div className={styles.edaStat} style={{color:'#5a9e82'}}>Google Trends</div><div className={styles.edaDesc}>When ordinary people suddenly start Googling how to buy stocks in large numbers, that is a classic bubble signal. This system measures it in real time.</div></div>
                                  <div className={styles.edaCard}><div className={styles.edaTitle}>Combined Power</div><div className={styles.edaStat} style={{color:'#9060c0'}}>F1 = 97.5%</div><div className={styles.edaDesc}>Neither signal alone is enough. Together they caught all three major market crashes with 2 to 4 week lead time and minimal false alarms.</div></div>
                                </div>
                              </div>
                            )}
                            {currentTab==='approach'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.problemBox}><div className={styles.problemLabel}>Research Question</div><div className={styles.problemText}>Can combining mathematical market signals (fractal complexity) with behavioral signals (retail search trends) detect stock market bubbles 2 to 4 weeks before they collapse — with accuracy high enough to be actionable?</div></div>
                                <div className={styles.approachGrid}>
                                  {[{icon:'01',label:'Collect market data',desc:'VN-Index daily prices 2015 to 2024. 3 mathematical features extracted: Hurst exponent (H), volatility spread (delta-alpha), asymmetry (A).'},{icon:'02',label:'Measure human FOMO',desc:'Google Trends weekly search volume for stock-related keywords. Captures retail investor panic buying before crashes.'},{icon:'03',label:'Label bubble events',desc:'Identify historical bubble and crash periods manually using price and volume data. These become the training labels.'},{icon:'04',label:'Train 5 ML models',desc:'Random Forest, XGBoost, SVM, Neural Networks, SHAP explainability. Optimize for recall — missing a bubble is worse than a false alarm.'},{icon:'05',label:'Backtest trading strategy',desc:'Simulate selling on Orange Alert, re-entering on stabilization. Compare Sharpe ratio and max drawdown vs buy-and-hold.'},{icon:'06',label:'Design alert framework',desc:'Translate model outputs into a 3-tier system (Yellow, Orange, Red) with objective thresholds for each level.'}].map((a,i)=>(
                                    <div key={i} className={styles.approachCard}><div className={styles.approachIcon}>{a.icon}</div><div className={styles.approachLabel}>{a.label}</div><div className={styles.approachDesc}>{a.desc}</div></div>
                                  ))}
                                </div>
                                <div className={styles.toolsRow}><span className={styles.panelLabel}>Tools</span><div className={styles.toolsList} style={{marginTop:8}}>{project.tools?.map((t,i)=><span key={i} className={styles.tool} style={{fontSize:13,padding:'5px 12px'}}>{t}</span>)}</div></div>
                              </div>
                            )}
                            {currentTab==='analysis'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.statRow}>
                                  <div className={styles.statBox}><div className={styles.statNum}>2015-24</div><div className={styles.statLabel}>10 years of data</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum}>3</div><div className={styles.statLabel}>Bubble events captured</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum} style={{color:'#5b8db8'}}>Daily</div><div className={styles.statLabel}>Data frequency</div></div>
                                  <div className={styles.statBox}><div className={styles.statNum}>Public</div><div className={styles.statLabel}>All data sources</div></div>
                                </div>
                                <P6CrashTimeline/>
                                <P6SignalChart/>
                              </div>
                            )}
                            {currentTab==='methodology'&&(
                              <div className={styles.panelContent}>
                                {project.methodology&&<PipelineSteps steps={project.methodology} hasCharts={false}/>}
                                <div className={styles.panelBlock}><span className={styles.panelLabel}>Why combine math and behavior?</span>
                                  <div className={styles.eda3col}>
                                    <div className={styles.edaCard}><div className={styles.edaTitle}>Math alone misses timing</div><div className={styles.edaDesc}>Fractal signals (Hurst, Asymmetry) detect structural change in the market but can be early by 6 to 8 weeks. Without a behavioral trigger, you would sell too soon.</div></div>
                                    <div className={styles.edaCard}><div className={styles.edaTitle}>Behavior alone is noisy</div><div className={styles.edaDesc}>Google Trends spikes happen for many reasons. A search surge for stocks during New Year is not a bubble signal. Mathematical confirmation filters the noise.</div></div>
                                    <div className={styles.edaCard}><div className={styles.edaTitle}>Together: 2-4 week lead</div><div className={styles.edaDesc}>When both signals fire simultaneously, it has historically been 2 to 4 weeks before the correction. Enough time to reduce exposure and protect capital.</div></div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {currentTab==='results'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.heroStats}>
                                  <div className={styles.heroStat} style={{borderColor:'#5a9e82'}}><div className={styles.heroNum} style={{color:'#5a9e82'}}>97.5%</div><div className={styles.heroLabel}>Detection Accuracy</div><div className={styles.heroSub}>F1 score — best in class</div></div>
                                  <div className={styles.heroStat} style={{borderColor:'#5b8db8'}}><div className={styles.heroNum} style={{color:'#5b8db8'}}>1.87</div><div className={styles.heroLabel}>Sharpe Ratio</div><div className={styles.heroSub}>vs 0.94 buy-and-hold</div></div>
                                  <div className={styles.heroStat} style={{borderColor:'#9060c0'}}><div className={styles.heroNum} style={{color:'#9060c0'}}>18%</div><div className={styles.heroLabel}>Max Drawdown</div><div className={styles.heroSub}>vs 47% without system</div></div>
                                </div>
                                <P6ModelCompare/>
                                <P6AlertSystem/>
                              </div>
                            )}
                            {currentTab==='outcome'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>What This System Actually Does</span>
                                  <div className={styles.impactRow}>
                                    <div className={styles.impactStat} style={{borderColor:'#5a9e82'}}><div className={styles.impactNum} style={{color:'#5a9e82'}}>2-4 wks</div><div className={styles.impactLabel}>Early warning</div><div className={styles.impactSub}>Before crash, not after</div></div>
                                    <div className={styles.impactStat} style={{borderColor:'#5b8db8'}}><div className={styles.impactNum} style={{color:'#5b8db8'}}>2x</div><div className={styles.impactLabel}>Better returns</div><div className={styles.impactSub}>Sharpe 1.87 vs 0.94</div></div>
                                    <div className={styles.impactStat} style={{borderColor:'#9060c0'}}><div className={styles.impactNum} style={{color:'#9060c0'}}>-61%</div><div className={styles.impactLabel}>Drawdown cut</div><div className={styles.impactSub}>From 47% to 18% max loss</div></div>
                                    <div className={styles.impactStat} style={{borderColor:'#5a9e82'}}><div className={styles.impactNum} style={{color:'#5a9e82'}}>Public</div><div className={styles.impactLabel}>Free to deploy</div><div className={styles.impactSub}>Only public data needed</div></div>
                                  </div>
                                  <div className={styles.tierGrid}>
                                    <div className={styles.tierCard} style={{borderTopColor:'#c08820'}}><div className={styles.tierLabel} style={{color:'#c08820'}}>For retail investors</div><div className={styles.tierDesc}>Subscribe to the alert system. Yellow = reduce positions. Red = protect capital. No technical knowledge required to act on the signal.</div></div>
                                    <div className={styles.tierCard} style={{borderTopColor:'#9060c0'}}><div className={styles.tierLabel} style={{color:'#9060c0'}}>For fund managers</div><div className={styles.tierDesc}>Use Orange Alert as a systematic trigger to shift to defensive allocation. Replaces gut-feeling market timing with data-driven discipline.</div></div>
                                    <div className={styles.tierCard} style={{borderTopColor:'#c04040'}}><div className={styles.tierLabel} style={{color:'#c04040'}}>For the SSC</div><div className={styles.tierDesc}>Red Alert maps to existing intervention thresholds. Provides objective, real-time justification for margin restriction or circuit breaker activation.</div></div>
                                  </div>
                                </div>
                                <div className={styles.panelBlock}>
                                  <span className={styles.panelLabel}>Reflection</span>
                                  <div className={styles.reflectGrid}>
                                    <div className={styles.reflectCard} style={{borderTopColor:'#5a9e82'}}><div className={styles.reflectHeader} style={{color:'#5a9e82'}}><span>✓</span> What worked</div><ul className={styles.reflectList}><li>Combining <span className={styles.reflectHL}>math and human behavior</span> was the key insight — neither alone was sufficient, together they were powerful</li><li><span className={styles.reflectHL}>SHAP explainability</span> showed which features drove each prediction — critical for getting regulators to trust the system</li><li>Framing results as <span className={styles.reflectHL}>Sharpe ratio and max drawdown</span> made the business case immediately clear to non-technical readers</li></ul></div>
                                    <div className={styles.reflectCard} style={{borderTopColor:'#9060c0'}}><div className={styles.reflectHeader} style={{color:'#9060c0'}}><span>→</span> What I would do differently</div><ul className={styles.reflectList}><li>Add <span className={styles.reflectHL}>options market signals</span> — implied volatility skew and put/call ratio often precede crashes even earlier than search trends</li><li>Build a <span className={styles.reflectHL}>live dashboard</span> pulling VN-Index API and Google Trends in real time — the model exists, deployment is the next step</li><li>Test on <span className={styles.reflectHL}>sector indices</span> — real estate, banking, tech may have different bubble dynamics than the broad VN-Index</li></ul></div>
                                  </div>
                                </div>
                                <div className={styles.panelBlock}><span className={styles.panelLabel}>Real-world Parallels <span style={{fontWeight:400,color:'#bbb',fontSize:9}}>click a case</span></span><P6ParallelCases/></div>
                              </div>
                            )}
                            </>
                          )}

                          {/* OTHER PROJECTS */}
                          {!hasCharts&&!isP2&&!isP3&&!isP4&&project.id!==5&&project.id!==6&&(
                            <>
                            {currentTab==='context'&&(<div className={`${styles.panelContent} ${contextHighlight===project.id?styles.panelContentHighlight:''}`}><div className={styles.problemBox}><div className={styles.problemLabel}>Context</div><div className={styles.problemText}>{project.context}</div></div>{project.researchQuestion&&(<div className={styles.panelBlock}><span className={styles.panelLabel}>Research Question</span><p className={styles.panelText}>{project.researchQuestion}</p></div>)}{project.supervisor&&(<div className={styles.contextMeta}><span>Supervisor: {project.supervisor}</span><span>{project.institution} / {project.period}</span></div>)}</div>)}
                            {currentTab==='approach'&&(<div className={styles.panelContent}><div className={styles.toolsRow}><span className={styles.panelLabel}>Tools</span><div className={styles.toolsList} style={{marginTop:8}}>{project.tools?.map((t,i)=><span key={i} className={styles.tool} style={{fontSize:13,padding:'5px 12px'}}>{t}</span>)}</div></div></div>)}
                            {currentTab==='analysis'&&(<div className={styles.panelContent}><div className={styles.panelBlock}><span className={styles.panelLabel}>Dataset</span>{project.dataset&&<p className={styles.panelSubtext}>{typeof project.dataset==='string'?project.dataset:project.dataset.source}</p>}</div></div>)}
                            {currentTab==='methodology'&&(<div className={styles.panelContent}>{project.methodology&&<PipelineSteps steps={project.methodology} hasCharts={false}/>}</div>)}
                            {currentTab==='results'&&(<div className={styles.panelContent}><div className={styles.panelBlock}><span className={styles.panelLabel}>Results</span><ul className={styles.resultsList}>{project.results?.map((r,i)=><li key={i}>{r}</li>)}</ul></div>{project.keyFindings&&<div className={styles.panelBlock}><span className={styles.panelLabel}>Key Findings</span><div className={styles.findingPills}>{project.keyFindings.map((f,i)=>(<div key={i} className={`${styles.findingPill} ${i<2?styles.findingHighlight:''}`}><span className={styles.findingIcon}>◆</span><span>{f}</span></div>))}</div></div>}</div>)}
                            {currentTab==='outcome'&&(<div className={styles.panelContent}><div className={styles.problemBox}><div className={styles.problemLabel}>Outcome</div><div className={styles.problemText}>{project.context}</div></div></div>)}
                            </>
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

        {activeTab === 'skills' && (
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
    <div style={{display:'flex',alignItems:'center',gap:'16px',margin:'56px 0 32px'}}>
      <span style={{fontSize:'16px',letterSpacing:'1px',textTransform:'uppercase',color:'#2c3e50',fontWeight:700,whiteSpace:'nowrap',fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif"}}>{label}</span>
      <div style={{flex:1,height:'1.5px',background:'#2c3e50'}}></div>
    </div>
  );
}
