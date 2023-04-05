
/**
 * Adjusts the weights of an object's properties according to the following steps:
 * 1. Find the minimum weight ω. If ω <= 0, add ω to all weights. Otherwise, proceed to step 2.
 * 
 * 2. Find the maximum weight α, the secondmaximum weight β, and the minimum weight ω. 
 * If α - β > ω, adjust the maximum weight to β + ω.
 * 
 * 3. If there are an odd number of weights, find the median weight η. Otherwise, 
 * η is the average of the two middle weights.
 * 
 * 4. Calculate the sum of all weights, and adjust each weight weight to m / sum * weight, 
 * rounded to one decimal place.
 * 
 * If the sum of all weights is less than m, gradually decrease all weights ℓ >= η by 0.1 until the sum equals m.
 * If the sum of all weights is greater than m, gradually increase weights starting 
 * from the minimum weight by 0.1 until the sum equals m.
 * If the sum of all weights equals m, return the adjusted data object.

 * @param {Object} data - The object whose property weights are to be adjusted.
 * @param {number} m - The desired sum of all weights.
 * @returns {Object} - The adjusted data object.
 */


/**
 * Adjusts the weights of an object's properties to match a target sum.
 * @param {Object} data - The object whose property weights are to be adjusted.
 * @param {number} m - The target sum of the weights.
 * @returns {Object} - A new object with adjusted property weights.
 */
function adjustWeights(data, m) {
  const weights = Object.values(data);
  const n = weights.length;
  const sortedWeights = weights.sort((a, b) => a - b);
  const minWeight = sortedWeights[0];
  const maxWeight = sortedWeights[n - 1];
  const secondMaxWeight = sortedWeights[n - 2];
  let adjustedWeights = {};

  if (minWeight <= 0) {
    adjustedWeights = adjustAllWeights(weights, minWeight);
  } else if (maxWeight - secondMaxWeight > minWeight) {
    adjustedWeights = adjustMaxWeight(weights, secondMaxWeight + minWeight, maxWeight);
  } else {
    adjustedWeights = { ...data };
  }

  let adjustedSum = Object.values(adjustedWeights).reduce((acc, curr) => acc + curr, 0);
  adjustedWeights = Object.fromEntries(Object.entries(adjustedWeights)
    .map(([key, value]) => [key, Math.round((m / adjustedSum * value) * 10) / 10]));

  adjustedSum = Object.values(adjustedWeights).reduce((acc, curr) => acc + curr, 0);
  if (adjustedSum < m) {
    adjustedWeights = adjustHighWeights(adjustedWeights, m, n);
  } else if (adjustedSum > m) {
    adjustedWeights = adjustLowWeights(adjustedWeights, m, n);
  }

  return adjustedWeights;
}

/**
 * Adjusts all weights by a given amount.
 * @param {Array} weights - The array of weights to be adjusted.
 * @param {number} amount - The amount to adjust the weights by.
 * @returns {Object} - An object with adjusted weights.
 */
function adjustAllWeights(weights, amount) {
  const adjustedWeights = {};
  for (let i = 0; i < weights.length; i++) {
    adjustedWeights[i] = weights[i] + amount;
  }
  return adjustedWeights;
}

/**
 * Adjusts the maximum weight to a given value.
 * @param {Array} weights - The array of weights to be adjusted.
 * @param {number} newMax - The new maximum weight.
 * @param {number} oldMax - The old maximum weight.
 * @returns {Object} - An object with adjusted weights.
 */
function adjustMaxWeight(weights, newMax, oldMax) {
  const adjustedWeights = {};
  for (let i = 0; i < weights.length; i++) {
    if (weights[i] === oldMax) {
      adjustedWeights[i] = newMax;
    } else {
      adjustedWeights[i] = weights[i];
    }
  }
  return adjustedWeights;
}

/**
 * Adjusts high weights to match the target sum.
 * @param {Object} data - The object whose property weights are to be adjusted.
 * @param {number} m - The target sum of the weights.
 * @param {number} n - The number of weights.
 * @returns {Object} - An object with adjusted weights.
 */
function adjustHighWeights(data, m, n) {
  const sortedWeights = Object.values(data).sort((a, b) => a - b);
  const eta = n % 2 === 0 ? (sortedWeights[n / 2 - 1] + sortedWeights[n / 2]) / 2 : sortedWeights[(n - 1) / 2];
  let adjustedWeights = { ...data };
  let adjustedSum = Object.values(adjustedWeights).reduce((acc, curr) => acc + curr, 0);

  while (adjustedSum < m) {
    for (const [key, value] of Object.entries(adjustedWeights)) {
      if (value >= eta) {
        adjustedWeights[key] = Math.round((value - 0.1) * 10) / 10;
        adjustedSum = Object.values(adjustedWeights).reduce((acc, curr) => acc + curr, 0);
        if (adjustedSum >= m) {
          break;
        }
      }
    }
  }

  return adjustedWeights;
}

/**
 * Adjusts low weights to match the target sum.
 * @param {Object} data - The object whose property weights are to be adjusted.
 * @param {number} m - The target sum of the weights.
 * @param {number} n - The number of weights.
 * @returns {Object} - An object with adjusted weights.
 */
function adjustLowWeights(data, m, n) {
  const sortedWeights = Object.values(data).sort((a, b) => a - b);
  let adjustedWeights = { ...data };
  let adjustedSum = Object.values(adjustedWeights).reduce((acc, curr) => acc + curr, 0);

  while (adjustedSum > m) {
    for (const [key, value] of Object.entries(adjustedWeights)) {
      if (value < sortedWeights[1]) {
        adjustedWeights[key] = Math.round((value + 0.1) * 10) / 10;
        adjustedSum = Object.values(adjustedWeights).reduce((acc, curr) => acc + curr, 0);
        if (adjustedSum <= m) {
          break;
        }
      }
    }
  }

  return adjustedWeights;
}
