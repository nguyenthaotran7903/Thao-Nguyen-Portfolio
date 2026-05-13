import './globals.css';

export const metadata = {
  title: 'Thảo Nguyên Trần - Data Analyst & Risk Management Specialist',
  description: 'Data analyst with expertise in credit risk, fraud detection, machine learning, and quantitative research. Specialized in banking, financial risk analysis, and data visualization.',
  keywords: 'data analyst, risk management, machine learning, fraud detection, credit risk, Python, R, SQL, STATA',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
