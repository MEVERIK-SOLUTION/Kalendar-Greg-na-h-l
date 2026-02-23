/**
 * Gregorian to Julian Calendar Converter
 *
 * Mathematical basis:
 * The Gregorian calendar reform (1582) corrected the accumulated error
 * of the Julian calendar by skipping 10 days and modifying the leap year rule.
 *
 * Julian calendar: leap year every 4 years (no exceptions)
 * Gregorian calendar: leap year every 4 years, EXCEPT centuries not divisible by 400
 *
 * The offset between the two calendars grows by 3 days every 400 years.
 *
 * Formula for offset (days Gregorian is ahead of Julian):
 *   century = floor(year / 100)
 *   offset = century - floor(century / 4) - 2
 *
 * The century correction applies from March 1 of the century year.
 * For dates before March 1 in a century year, use the previous century's offset.
 *
 * To convert Gregorian → Julian: subtract the offset from the Gregorian date.
 */

/**
 * Check if a year is a leap year in the Gregorian calendar.
 * @param {number} year
 * @returns {boolean}
 */
function isGregorianLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Check if a year is a leap year in the Julian calendar.
 * @param {number} year
 * @returns {boolean}
 */
function isJulianLeapYear(year) {
  return year % 4 === 0;
}

/**
 * Get the number of days in a month for the Gregorian calendar.
 * @param {number} year
 * @param {number} month - 1-12
 * @returns {number}
 */
function daysInGregorianMonth(year, month) {
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isGregorianLeapYear(year)) return 29;
  return days[month - 1];
}

/**
 * Get the number of days in a month for the Julian calendar.
 * @param {number} year
 * @param {number} month - 1-12
 * @returns {number}
 */
function daysInJulianMonth(year, month) {
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isJulianLeapYear(year)) return 29;
  return days[month - 1];
}

/**
 * Calculate the offset in days between Gregorian and Julian calendars
 * for a given Gregorian date.
 *
 * @param {number} year - Gregorian year
 * @param {number} month - Gregorian month (1-12)
 * @param {number} day - Gregorian day
 * @returns {number} - Number of days to subtract from Gregorian to get Julian
 */
function getGregorianJulianOffset(year, month, day) {
  // For dates before the Gregorian reform (15 Oct 1582), the calendars are the same
  if (year < 1582 || (year === 1582 && month < 10) ||
      (year === 1582 && month === 10 && day < 15)) {
    return 0;
  }

  // Determine effective century for the offset calculation.
  // The offset changes on March 1 of century years not divisible by 400.
  let effectiveYear = year;
  if (month <= 2) {
    effectiveYear = year - 1;
  }
  const century = Math.floor(effectiveYear / 100);
  return century - Math.floor(century / 4) - 2;
}

/**
 * Convert a Gregorian calendar date to a Julian calendar date.
 *
 * @param {number} year - Gregorian year (>= 1582)
 * @param {number} month - Gregorian month (1-12)
 * @param {number} day - Gregorian day (1-31)
 * @returns {{ year: number, month: number, day: number, offset: number, dayOfWeek: string }}
 */
function gregorianToJulian(year, month, day) {
  const offset = getGregorianJulianOffset(year, month, day);

  if (offset === 0) {
    return { year, month, day, offset, dayOfWeek: getDayOfWeek(year, month, day) };
  }

  // Subtract offset days from the Gregorian date
  let jDay = day - offset;
  let jMonth = month;
  let jYear = year;

  // Handle day underflow
  while (jDay < 1) {
    jMonth -= 1;
    if (jMonth < 1) {
      jMonth = 12;
      jYear -= 1;
    }
    jDay += daysInJulianMonth(jYear, jMonth);
  }

  return {
    year: jYear,
    month: jMonth,
    day: jDay,
    offset,
    dayOfWeek: getDayOfWeek(year, month, day),
  };
}

/**
 * Get the day of week for a Gregorian date.
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {string}
 */
function getDayOfWeek(year, month, day) {
  const date = new Date(year, month - 1, day);
  const days = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
  return days[date.getDay()];
}

/**
 * Validate a Gregorian date input.
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {{ valid: boolean, error?: string }}
 */
function validateGregorianDate(year, month, day) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return { valid: false, error: 'Datum musí být celá čísla.' };
  }
  if (year < 1582) {
    return { valid: false, error: 'Rok musí být 1582 nebo vyšší (po zavedení gregoriánského kalendáře).' };
  }
  if (month < 1 || month > 12) {
    return { valid: false, error: 'Měsíc musí být v rozmezí 1–12.' };
  }
  const maxDay = daysInGregorianMonth(year, month);
  if (day < 1 || day > maxDay) {
    return { valid: false, error: `Den musí být v rozmezí 1–${maxDay} pro daný měsíc.` };
  }
  if (year === 1582 && month === 10 && day >= 5 && day <= 14) {
    return { valid: false, error: 'Dny 5.–14. října 1582 v gregoriánském kalendáři neexistují (reforma kalendáře).' };
  }
  return { valid: true };
}

/**
 * Format a date as a Czech locale string (DD. MM. YYYY).
 * @param {number} day
 * @param {number} month
 * @param {number} year
 * @returns {string}
 */
function formatDate(day, month, year) {
  return `${day}. ${month}. ${year}`;
}

/**
 * Get month name in Czech.
 * @param {number} month - 1-12
 * @returns {string}
 */
function getMonthName(month) {
  const names = [
    'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
    'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec',
  ];
  return names[month - 1];
}

module.exports = {
  gregorianToJulian,
  getGregorianJulianOffset,
  validateGregorianDate,
  isGregorianLeapYear,
  isJulianLeapYear,
  daysInGregorianMonth,
  daysInJulianMonth,
  formatDate,
  getMonthName,
  getDayOfWeek,
};
