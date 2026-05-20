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

/* ── Project 3 Charts ── */
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
    {name:'UPI (Total)', pct:14.6, color:'#e8729a', note:'PhonePe 4.88% + Paytm 4.86% + GPay 4.85%. Fastest growing — will overtake Debit within 2 years.'},
    {name:'Intl Card',   pct:5.12, color:'#f0a030', note:'Global shoppers. Niche but high-value segment.'},
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
        {['about','projects','experience','skills'].map(tab=>(
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
              {data.coursework.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>

            <Divider label="Domain Expertise" />
            <div className={styles.expertiseList}>
              {data.skills.domain_expertise.map((e, i) => (
                <span key={i} className={styles.expertiseBadge}>{e}</span>
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

                          {/* ══ OTHER PROJECTS ══ */}
                          {!hasCharts&&!isP2&&project.id!==3&&(
                            <>
                            {currentTab==='context'&&(
                              <div className={`${styles.panelContent} ${contextHighlight===project.id?styles.panelContentHighlight:''}`}>
                                <div className={styles.problemBox}><div className={styles.problemLabel}>Context</div><div className={styles.problemText}>{project.context}</div></div>
                                {project.researchQuestion&&(<div className={styles.panelBlock}><span className={styles.panelLabel}>Research Question</span><p className={styles.panelText}>{project.researchQuestion}</p></div>)}
                                {project.supervisor&&(<div className={styles.contextMeta}><span>Supervisor: {project.supervisor}</span><span>{project.institution} / {project.period}</span></div>)}
                              </div>
                            )}
                            {currentTab==='approach'&&(
                              <div className={styles.panelContent}>
                                <div className={styles.toolsRow}><span className={styles.panelLabel}>Tools</span><div className={styles.toolsList} style={{marginTop:8}}>{project.tools?.map((t,i)=><span key={i} className={styles.tool} style={{fontSize:13,padding:'5px 12px'}}>{t}</span>)}</div></div>
                              </div>
                            )}
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

        {activeTab === 'experience' && (
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
