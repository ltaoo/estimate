export const computeEstimates = (estimates) => {
  const result = estimates.reduce((a, b) => {
    const res = a;
    res[b.value] = res[b.value] || 0;
    res[b.value] += 1;
    return res;
  }, {});
  return Object.keys(result).map(val => {
    return {
      value: val,
      number: result[val],
    };
  });
}
