exports.isNotOctober = function () {
  const currentMonth = new Date().getMonth() + 1;
  return currentMonth !== 10;
};
