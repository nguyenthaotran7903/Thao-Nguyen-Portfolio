'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

export default function EdaCards() {
  const [active, setActive] = useState('correlation');

  const cards = [
    {
      key: 'outlier',
      title: 'Outliers',
      icon: '◈',
      summary:
        'Transactions > $10,000 flagged via IQR method.',
      detail:
        'The Interquartile Range (IQR = Q3 − Q1) defines normal bounds: Lower = Q1 − 1.5×IQR, Upper = Q3 + 1.5×IQR. Points outside are outliers.',
      stat: '$25,691',
      statLabel: 'Max transaction',
      color: '#5b8db8',

      viz: () => {
        return (
          <svg
            width="100%"
            viewBox="0 0 380 150"
            className={styles.chartSvg}
          >
            <circle cx="60" cy="80" r="5" fill="#5b8db8" />
            <circle cx="110" cy="90" r="5" fill="#5b8db8" />
            <circle cx="170" cy="40" r="6" fill="#e8729a" />
            <circle cx="240" cy="70" r="5" fill="#5b8db8" />
            <circle cx="320" cy="20" r="7" fill="#e8729a" />

            <line
              x1="20"
              y1="120"
              x2="360"
              y2="120"
              stroke="#ddd"
            />

            <text x="20" y="138" className={styles.svgLabel}>
              Transaction distribution
            </text>
          </svg>
        );
      },
    },

    {
      key: 'correlation',
      title: 'Correlation',
      icon: '◉',

      summary:
        '31-feature heatmap. Payment history & collateral = top predictors.',

      detail:
        'Pearson correlation heatmap across all 31 features revealed that V14 and V17 (PCA components) have the strongest negative correlation with the fraud class.',

      stat: 'r > 0.8',
      statLabel: 'Top predictors',
      color: '#5a9e82',

      viz: () => {
        const n = 8;
        const cellSize = 18;
        const cellGap = 4;

        return (
          <div className={styles.heatmapWrapper}>
            <svg
              width="100%"
              viewBox="0 0 380 230"
              preserveAspectRatio="xMinYMin meet"
              className={styles.chartSvg}
            >
              {/* Heatmap */}
              {Array.from({ length: n }).map((_, i) =>
                Array.from({ length: n }).map((_, j) => {
                  const value = Math.abs(
                    Math.cos((i + 1) * (j + 1) * 0.5)
                  );

                  const highlight =
                    (i === 0 && j === 6) ||
                    (i === 6 && j === 0) ||
                    (i === 1 && j === 6) ||
                    (i === 6 && j === 1);

                  return (
                    <rect
                      key={`${i}-${j}`}
                      x={j * (cellSize + cellGap) + 20}
                      y={i * (cellSize + cellGap) + 18}
                      width={cellSize}
                      height={cellSize}
                      rx="4"
                      fill={
                        highlight
                          ? '#e8729a'
                          : i === j
                          ? '#111111'
                          : '#5b8db8'
                      }
                      opacity={
                        highlight
                          ? 0.95
                          : i === j
                          ? 1
                          : value * 0.55 + 0.15
                      }
                    />
                  );
                })
              )}

              {/* Caption */}
              <text
                x="20"
                y="188"
                className={styles.svgTitle}
              >
                8 key features shown
              </text>

              {/* Legend */}
              <g transform="translate(20,208)">
                {/* High correlation */}
                <rect
                  width="12"
                  height="12"
                  rx="3"
                  fill="#e8729a"
                />

                <text
                  x="20"
                  y="6"
                  className={styles.legendPink}
                >
                  High fraud correlation
                </text>

                {/* Self correlation */}
                <rect
                  x="210"
                  width="12"
                  height="12"
                  rx="3"
                  fill="#111111"
                />

                <text
                  x="230"
                  y="6"
                  className={styles.legendGray}
                >
                  Self correlation
                </text>
              </g>
            </svg>
          </div>
        );
      },
    },

    {
      key: 'time',
      title: 'Time Pattern',
      icon: '◷',
      summary:
        'Bimodal distribution — peaks at business hours.',
      detail:
        'Transaction time density plot revealed morning and afternoon peaks aligned with business hours.',
      stat: '2× higher',
      statLabel: 'Overnight fraud rate',
      color: '#9060c0',

      viz: () => {
        return (
          <svg
            width="100%"
            viewBox="0 0 380 150"
            className={styles.chartSvg}
          >
            <path
              d="M20 100 Q80 40 140 80 T260 60 T360 90"
              fill="none"
              stroke="#9060c0"
              strokeWidth="3"
            />

            <text x="20" y="135" className={styles.svgLabel}>
              Bimodal transaction pattern
            </text>
          </svg>
        );
      },
    },
  ];

  const activeCard = cards.find((c) => c.key === active);

  return (
    <div className={styles.edaInteractive}>
      {/* Cards */}
      <div className={styles.eda3col}>
        {cards.map((c) => (
          <div
            key={c.key}
            className={`${styles.edaCard} ${
              active === c.key
                ? styles.edaCardActive
                : ''
            }`}
            onClick={() => setActive(c.key)}
            style={{
              borderColor:
                active === c.key
                  ? c.color
                  : '#ebebeb',
            }}
          >
            <div className={styles.edaCardHeader}>
              <span
                className={styles.edaIcon}
                style={{ color: c.color }}
              >
                {c.icon}
              </span>

              <span className={styles.edaTitle}>
                {c.title}
              </span>
            </div>

            <div
              className={styles.edaStat}
              style={{ color: c.color }}
            >
              {c.stat}
            </div>

            <div className={styles.edaStatLabel}>
              {c.statLabel}
            </div>

            <div className={styles.edaDesc}>
              {c.summary}
            </div>
          </div>
        ))}
      </div>

      {/* Detail */}
      {activeCard && (
        <div
          className={styles.edaDetail}
          style={{
            borderLeftColor: activeCard.color,
          }}
        >
          <div className={styles.edaDetailViz}>
            {activeCard.viz()}
          </div>

          <div className={styles.edaDetailText}>
            <div
              className={styles.edaDetailTitle}
              style={{ color: activeCard.color }}
            >
              {activeCard.title}
            </div>

            <div className={styles.edaDetailBody}>
              {activeCard.detail}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

