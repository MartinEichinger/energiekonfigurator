export default function getDayOfYear(__now) {
  var __start = new Date(__now.getFullYear(), 0, 0);
  var __diff = __now - __start + (__start.getTimezoneOffset() - __now.getTimezoneOffset()) * 60 * 1000;
  var __oneDay = 1000 * 60 * 60 * 24;
  var __day = Math.floor(__diff / __oneDay);
  //console.log('Day of year: ' + __day);
  return __day;
}
