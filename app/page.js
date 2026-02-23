'use client';
import { useState, useMemo } from 'react';
import './globals.css';

/* ── Gregorian → Julian calendar conversion core ── */

function isGregorianLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function isJulianLeapYear(year) {
  return year % 4 === 0;
}

function daysInGregorianMonth(year, month) {
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isGregorianLeapYear(year)) return 29;
  return days[month - 1];
}

function daysInJulianMonth(year, month) {
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isJulianLeapYear(year)) return 29;
  return days[month - 1];
}

function getGregorianJulianOffset(year, month, day) {
  if (year < 1582 || (year === 1582 && month < 10) ||
      (year === 1582 && month === 10 && day < 15)) return 0;
  let effectiveYear = month <= 2 ? year - 1 : year;
  const century = Math.floor(effectiveYear / 100);
  return century - Math.floor(century / 4) - 2;
}

function gregorianToJulian(year, month, day) {
  const offset = getGregorianJulianOffset(year, month, day);
  if (offset === 0) return { year, month, day, offset };

  let jDay = day - offset;
  let jMonth = month;
  let jYear = year;

  while (jDay < 1) {
    jMonth -= 1;
    if (jMonth < 1) { jMonth = 12; jYear -= 1; }
    jDay += daysInJulianMonth(jYear, jMonth);
  }

  return { year: jYear, month: jMonth, day: jDay, offset };
}

function validateDate(year, month, day) {
  if (year < 1582) return 'Rok musí být 1582 nebo vyšší.';
  if (month < 1 || month > 12) return 'Měsíc musí být 1–12.';
  const max = daysInGregorianMonth(year, month);
  if (day < 1 || day > max) return `Den musí být 1–${max}.`;
  if (year === 1582 && month === 10 && day >= 5 && day <= 14)
    return 'Dny 5.–14. 10. 1582 neexistují (reforma kalendáře).';
  return null;
}

const MONTH_NAMES = [
  'Leden','Únor','Březen','Duben','Květen','Červen',
  'Červenec','Srpen','Září','Říjen','Listopad','Prosinec',
];

function getDayOfWeek(y, m, d) {
  const names = ['Neděle','Pondělí','Úterý','Středa','Čtvrtek','Pátek','Sobota'];
  return names[new Date(y, m - 1, d).getDay()];
}

/* ── UI ── */

export default function Home() {
  const today = new Date();
  const [day, setDay] = useState(today.getDate());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const numDay = Number(day);
  const numMonth = Number(month);
  const numYear = Number(year);

  const error = useMemo(
    () => validateDate(numYear, numMonth, numDay),
    [numYear, numMonth, numDay],
  );

  const result = useMemo(() => {
    if (error) return null;
    return gregorianToJulian(numYear, numMonth, numDay);
  }, [numYear, numMonth, numDay, error]);

  function setToday() {
    const now = new Date();
    setDay(now.getDate());
    setMonth(now.getMonth() + 1);
    setYear(now.getFullYear());
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Kalendář – Gregoriánský → Juliánský</h1>
        <p>Převod data z gregoriánského na juliánský kalendář</p>
      </header>

      {/* Input card */}
      <div className="card">
        <div className="card-title">Gregoriánské datum (vstup)</div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="day">Den</label>
            <input
              id="day"
              type="number"
              min="1"
              max="31"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className={error ? 'error' : ''}
            />
          </div>
          <div className="form-group">
            <label htmlFor="month">Měsíc</label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {MONTH_NAMES.map((name, i) => (
                <option key={i + 1} value={i + 1}>{name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="year">Rok</label>
            <input
              id="year"
              type="number"
              min="1582"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={error ? 'error' : ''}
            />
          </div>
        </div>
        <button className="today-btn" onClick={setToday} type="button">
          ↻ Dnes
        </button>
        {error && <div className="error-message">{error}</div>}
      </div>

      {/* Result card */}
      {result && (
        <div className="card result-card">
          <div className="card-title">Juliánské datum (výsledek)</div>
          <div className="result-weekday">{getDayOfWeek(numYear, numMonth, numDay)}</div>
          <div className="result-date">
            {result.day}. {MONTH_NAMES[result.month - 1]} {result.year}
          </div>
          <div className="result-details">
            <div className="result-detail">
              <div className="label">Rozdíl</div>
              <div className="value">{result.offset} dní</div>
            </div>
            <div className="result-detail">
              <div className="label">Juliánský měsíc</div>
              <div className="value">{MONTH_NAMES[result.month - 1]}</div>
            </div>
            <div className="result-detail">
              <div className="label">Vzorec</div>
              <div className="value">
                <span className="offset-badge">−{result.offset}d</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info section */}
      <div className="info-section">
        <div className="info-card">
          <h3>Jak výpočet funguje?</h3>
          <ul>
            <li>Juliánský kalendář má přestupný rok každé 4 roky bez výjimky.</li>
            <li>Gregoriánský kalendář vynechává přestupné roky v letech dělitelných 100, pokud nejsou dělitelná 400.</li>
            <li>Rozdíl: <code>C − ⌊C/4⌋ − 2</code>, kde <code>C = ⌊rok/100⌋</code></li>
            <li>Aktuálně (2000–2099) je rozdíl <strong>13 dní</strong>.</li>
            <li>Gregoriánský kalendář platí od 15. října 1582.</li>
          </ul>
        </div>
      </div>

      <footer className="footer">
        Kalendář – Gregoriánský na Juliánský &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}