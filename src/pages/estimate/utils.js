export const computeEstimates = (estimates) => {
  const result = estimates.reduce((a, b) => {
    const res = a;
    res[b.estimate] = res[b.estimate] || 0;
    res[b.estimate] += 1;
    return res;
  }, {});
  return Object.keys(result).map((val, i) => {
    return {
      id: i,
      value: val,
      number: result[val],
    };
  });
}

export function noop() {}
