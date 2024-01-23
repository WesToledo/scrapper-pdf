export function getMonthNameByNumber(monthName: string) {
  const months = {
    JAN: 1,
    FEV: 2,
    MAR: 3,
    ABR: 4,
    MAI: 5,
    JUN: 6,
    JUL: 7,
    AGO: 8,
    AG0: 8,
    SET: 9,
    OUT: 10,
    "0UT": 10,
    NOV: 11,
    N0V: 11,
    DEZ: 12,
  };

  return months[monthName] || 0;
}
