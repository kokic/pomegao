
/**
 * Adjusts the weights of an object's properties according to the following steps:
 * 1. Find the minimum weight ω. If ω <= 0, add ω to all weights and proceed to the next step.
 * 2. Find the maximum weight α, the second maximum weight βand the minimum weight ω. 
 *    If α - β > ω, adjust the maximum weight to β + ω and proceed to the next step.
 * 3. Calculate the number of weights n. If there are an odd number of weights, find the median weight η. 
 *    Otherwise, η is the average of the two middle weights. Proceed to the next step.
 * 4. Calculate the sum of all weights sum. Adjust each weight weight to m / sum * weight, 
 *    rounded to one decimal place. Proceed to the next step.
 * If the sum of all weights sum < m, calculate δ = m - sum and add δ to the maximum weight.
 * If the sum of all weights sum > m, calculate δ = sum - m and subtract δ from the maximum weight.
 * Returns the adjusted data object.
 * 
 * @param {Object} data - The object whose property weights are to be adjusted.
 * @param {number} m - The desired sum of all weights.
 * @returns {Object} - The adjusted data object.
 */
function adjustWeights(data, m) {
  const weights = Object.values(data);
  const n = weights.length;
  const omega = Math.min(...weights);
  
  if (omega <= 0) {
    for (const key in data) {
      data[key] += Math.abs(omega);
    }
  }

  const alpha = Math.max(...weights);
  const beta = weights.filter(w => w !== alpha).reduce((acc, cur) => cur > acc ? cur : acc, -Infinity);
  if (alpha - beta > omega) {
    data[Object.keys(data).find(key => data[key] === alpha)] = beta + omega;
  }

  const sortedWeights = Object.values(data).sort((a, b) => a - b);
  const medianIndex = Math.floor(n / 2);

  const eta = n % 2 === 1
    ? sortedWeights[medianIndex]
    : (sortedWeights[medianIndex - 1] + sortedWeights[medianIndex]) / 2;
  
  const sum = weights.reduce((acc, cur) => acc + cur, 0);
  for (const key in data) {
    data[key] = parseFloat((m / sum * data[key]).toFixed(1));
  }
  
  const sumAdjusted = Object.values(data).reduce((acc, cur) => acc + cur, 0);
  if (sumAdjusted < m) {
    const maxKey = Object.keys(data).reduce((a, b) => data[a] > data[b] ? a : b);
    data[maxKey] += parseFloat((m - sumAdjusted).toFixed(1));
  } else if (sumAdjusted > m) {
    const maxKey = Object.keys(data).reduce((a, b) => data[a] > data[b] ? a : b);
    data[maxKey] -= parseFloat((sumAdjusted - m).toFixed(1));
  }
  return data;
}
