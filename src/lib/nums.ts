// 숫자 포맷터 소수점두자리수,
export function formatNumber(value: number, digit: number = 0) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digit,
    maximumFractionDigits: digit,
  }).format(value);
}
