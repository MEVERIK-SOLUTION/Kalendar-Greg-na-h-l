export const metadata = {
  title: 'Kalendář – Gregoriánský na Juliánský',
  description: 'Převod data z gregoriánského na juliánský kalendář. Online kalkulačka s živým výpočtem.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
