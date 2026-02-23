const {
  gregorianToJulian,
  getGregorianJulianOffset,
  validateGregorianDate,
  isGregorianLeapYear,
  isJulianLeapYear,
  daysInGregorianMonth,
  daysInJulianMonth,
  formatDate,
  getMonthName,
} = require('./calendar');

// --- isGregorianLeapYear ---
console.log('=== isGregorianLeapYear ===');
console.assert(isGregorianLeapYear(2000) === true, '2000 is leap');
console.assert(isGregorianLeapYear(1900) === false, '1900 is not leap');
console.assert(isGregorianLeapYear(2024) === true, '2024 is leap');
console.assert(isGregorianLeapYear(2023) === false, '2023 is not leap');
console.assert(isGregorianLeapYear(1600) === true, '1600 is leap');
console.assert(isGregorianLeapYear(1700) === false, '1700 is not leap');
console.log('OK');

// --- isJulianLeapYear ---
console.log('=== isJulianLeapYear ===');
console.assert(isJulianLeapYear(1900) === true, '1900 is Julian leap');
console.assert(isJulianLeapYear(2000) === true, '2000 is Julian leap');
console.assert(isJulianLeapYear(2023) === false, '2023 is not Julian leap');
console.log('OK');

// --- daysInGregorianMonth ---
console.log('=== daysInGregorianMonth ===');
console.assert(daysInGregorianMonth(2024, 2) === 29, 'Feb 2024 = 29');
console.assert(daysInGregorianMonth(2023, 2) === 28, 'Feb 2023 = 28');
console.assert(daysInGregorianMonth(1900, 2) === 28, 'Feb 1900 = 28');
console.assert(daysInGregorianMonth(2000, 2) === 29, 'Feb 2000 = 29');
console.assert(daysInGregorianMonth(2023, 1) === 31, 'Jan = 31');
console.assert(daysInGregorianMonth(2023, 4) === 30, 'Apr = 30');
console.log('OK');

// --- daysInJulianMonth ---
console.log('=== daysInJulianMonth ===');
console.assert(daysInJulianMonth(1900, 2) === 29, 'Feb 1900 Julian = 29');
console.assert(daysInJulianMonth(2100, 2) === 29, 'Feb 2100 Julian = 29');
console.log('OK');

// --- getGregorianJulianOffset ---
console.log('=== getGregorianJulianOffset ===');
// Current era (2000-2099): century=20, offset = 20 - 5 - 2 = 13
console.assert(getGregorianJulianOffset(2026, 2, 23) === 13, '2026-02-23 offset = 13');
console.assert(getGregorianJulianOffset(2000, 6, 15) === 13, '2000-06-15 offset = 13');
// 1900s: century=19, offset = 19 - 4 - 2 = 13
console.assert(getGregorianJulianOffset(1900, 3, 1) === 13, '1900-03-01 offset = 13');
// Before March 1, 1900: uses century 18, offset = 18 - 4 - 2 = 12
console.assert(getGregorianJulianOffset(1900, 2, 28) === 12, '1900-02-28 offset = 12');
// 1800s: century=18, offset = 18 - 4 - 2 = 12
console.assert(getGregorianJulianOffset(1800, 3, 1) === 12, '1800-03-01 offset = 12');
// Before March 1, 1800: century 17, offset = 17 - 4 - 2 = 11
console.assert(getGregorianJulianOffset(1800, 2, 28) === 11, '1800-02-28 offset = 11');
// 1582 (start of Gregorian): offset = 15 - 3 - 2 = 10
console.assert(getGregorianJulianOffset(1582, 10, 15) === 10, '1582-10-15 offset = 10');
// Before Gregorian reform
console.assert(getGregorianJulianOffset(1582, 10, 4) === 0, '1582-10-04 offset = 0');
console.assert(getGregorianJulianOffset(1500, 1, 1) === 0, '1500-01-01 offset = 0');
console.log('OK');

// --- gregorianToJulian ---
console.log('=== gregorianToJulian ===');

// Today 2026-02-23 Gregorian = 2026-02-10 Julian (offset 13)
let result = gregorianToJulian(2026, 2, 23);
console.assert(result.year === 2026 && result.month === 2 && result.day === 10,
  `2026-02-23 -> ${result.day}.${result.month}.${result.year}, expected 10.2.2026`);
console.assert(result.offset === 13, 'offset should be 13');

// 2026-01-01 Gregorian = 2025-12-19 Julian (offset 13, crosses year boundary)
result = gregorianToJulian(2026, 1, 1);
console.assert(result.year === 2025 && result.month === 12 && result.day === 19,
  `2026-01-01 -> ${result.day}.${result.month}.${result.year}, expected 19.12.2025`);

// 2000-03-14 Gregorian = 2000-03-01 Julian (offset 13)
result = gregorianToJulian(2000, 3, 14);
console.assert(result.year === 2000 && result.month === 3 && result.day === 1,
  `2000-03-14 -> ${result.day}.${result.month}.${result.year}, expected 1.3.2000`);

// 1582-10-15 Gregorian = 1582-10-05 Julian (offset 10)
result = gregorianToJulian(1582, 10, 15);
console.assert(result.year === 1582 && result.month === 10 && result.day === 5,
  `1582-10-15 -> ${result.day}.${result.month}.${result.year}, expected 5.10.1582`);

// 1900-02-28 Gregorian = 1900-02-16 Julian (offset 12)
result = gregorianToJulian(1900, 2, 28);
console.assert(result.year === 1900 && result.month === 2 && result.day === 16,
  `1900-02-28 -> ${result.day}.${result.month}.${result.year}, expected 16.2.1900`);

// 1900-03-01 Gregorian = 1900-02-17 Julian (offset 13, crosses month)
result = gregorianToJulian(1900, 3, 1);
console.assert(result.year === 1900 && result.month === 2 && result.day === 17,
  `1900-03-01 -> ${result.day}.${result.month}.${result.year}, expected 17.2.1900`);

// 2100-03-01 Gregorian = 2100-02-16 Julian (offset 14, century=21, 21-5-2=14)
result = gregorianToJulian(2100, 3, 1);
console.assert(result.year === 2100 && result.month === 2 && result.day === 16,
  `2100-03-01 -> ${result.day}.${result.month}.${result.year}, expected 16.2.2100`);

console.log('OK');

// --- validateGregorianDate ---
console.log('=== validateGregorianDate ===');
console.assert(validateGregorianDate(2026, 2, 23).valid === true, '2026-02-23 valid');
console.assert(validateGregorianDate(1581, 1, 1).valid === false, '1581 too early');
console.assert(validateGregorianDate(2026, 13, 1).valid === false, 'month 13 invalid');
console.assert(validateGregorianDate(2026, 2, 29).valid === false, 'Feb 29 in non-leap');
console.assert(validateGregorianDate(2024, 2, 29).valid === true, 'Feb 29 in leap');
console.assert(validateGregorianDate(1582, 10, 10).valid === false, '1582-10-10 gap');
console.assert(validateGregorianDate(1582, 10, 15).valid === true, '1582-10-15 valid');
console.log('OK');

// --- formatDate ---
console.log('=== formatDate ===');
console.assert(formatDate(23, 2, 2026) === '23. 2. 2026', 'format check');
console.log('OK');

// --- getMonthName ---
console.log('=== getMonthName ===');
console.assert(getMonthName(1) === 'Leden', 'Jan');
console.assert(getMonthName(12) === 'Prosinec', 'Dec');
console.log('OK');

console.log('\n✅ All tests passed!');
