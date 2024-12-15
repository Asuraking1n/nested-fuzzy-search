// Levenshtein algorithm
function calculateLevenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

function similarityScore(a, b) {
  // a and b should be strings before calculating Levenshtein
  if (typeof a !== "string" || typeof b !== "string") {
    return 0;
  }
  const distance = calculateLevenshtein(a, b);
  return 1 - distance / Math.max(a.length, b.length);
}

function extractText(data, path = "") {
  const results = [];
  if (Array.isArray(data)) {
    data.forEach((item, index) =>
      results.push(...extractText(item, `${path}[${index}]`))
    );
  } else if (data && typeof data === "object") {
    Object.entries(data).forEach(([key, value]) =>
      results.push(...extractText(value, `${path}.${key}`))
    );
  } else if (typeof data === "string") {
    results.push({ path, value: data });
  }
  return results;
}

// Function to handle array input
function searchInArray(data, query, threshold) {
  return data
    .map((item, index) => {
      const flatData = extractText(item, `[${index}]`);
      const matches = flatData
        .map(({ path, value }) => {
          const score = similarityScore(value, query);
          return { path, value, score };
        })
        .filter((result) => result.score >= threshold)
        .sort((a, b) => b.score - a.score);
      return matches.length > 0 ? { index, originalData: item, matches } : null;
    })
    .filter((result) => result !== null);
}

// Function to handle object input
function searchInObject(data, query, threshold) {
  const flatData = extractText(data);
  return flatData
    .map(({ path, value }) => {
      const score = similarityScore(value, query);
      return { path, value, score };
    })
    .filter((result) => result.score >= threshold)
    .sort((a, b) => b.score - a.score);
}

// Main search function
function search(
  data,
  query,
  options = {
    threshold: 0.6,
    outputMode: "flat",
  }
) {
  const { threshold, outputMode } = options;
  if (Array.isArray(data) && outputMode === "tree") {
    return searchInArray(data, query, threshold);
  } else if (data && typeof data === "object") {
    return searchInObject(data, query, threshold);
  }
  return [];
}

export { search };
