exports.isNotOctober = function() {
  const currentMonth = new Date().getMonth();
  return currentMonth !== 9;
}
