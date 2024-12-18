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

function extractText(data, path = "", excludeKeys = []) {
  const results = [];
  if (Array.isArray(data)) {
    data.forEach((item, index) =>
      results.push(...extractText(item, `${path}[${index}]`, excludeKeys))
    );
  } else if (data && typeof data === "object") {
    Object.entries(data).forEach(([key, value]) => {
      if (!excludeKeys.includes(key)) {
        results.push(...extractText(value, `${path}.${key}`, excludeKeys));
      }
    });
  } else if (typeof data === "string") {
    results.push({ path, value: data });
  }
  return results;
}

// Function to handle array input
export function searchInArray(data, query, options) {
  const { threshold, excludeKeys, exact } = options;
  return data
    .map((item, index) => {
      const flatData = extractText(item, `[${index}]`, excludeKeys);

      const dataWithSimilarityScore = flatData.map(({ path, value }) => {
        const score = similarityScore(value, query);
        return { path, value, score };
      });

      if (exact) {
        const matches = dataWithSimilarityScore
          .filter((result) => result.value === query)
          .sort((a, b) => b.score - a.score);

        return matches.length > 0
          ? { index, originalData: item, matches }
          : null;
      }

      const matches = dataWithSimilarityScore
        .filter((result) => result.score >= threshold)
        .sort((a, b) => b.score - a.score);

      return matches.length > 0 ? { index, originalData: item, matches } : null;
    })
    .filter((result) => result !== null);
}

// Function to handle object input
export function searchInObject(data, query, options) {
  const { threshold, excludeKeys, exact } = options;
  const flatData = extractText(data, "", excludeKeys);

  const dataWithSimilarityScore = flatData.map(({ path, value }) => {
    const score = similarityScore(value, query);
    return { path, value, score };
  });

  if (exact) {
    return dataWithSimilarityScore
      .filter((result) => result.value === query)
      .sort((a, b) => b.score - a.score);
  }

  return dataWithSimilarityScore
    .filter((result) => result.score >= threshold)
    .sort((a, b) => b.score - a.score);
}

//Streaming functions

async function* extractTextStream(data, path = "", excludeKeys = []) {
  if (Array.isArray(data)) {
    for (let index = 0; index < data.length; index++) {
      yield* extractTextStream(data[index], `${path}[${index}]`, excludeKeys);
    }
  } else if (data && typeof data === "object") {
    for (const [key, value] of Object.entries(data)) {
      if (!excludeKeys.includes(key)) {
        yield* extractTextStream(value, `${path}.${key}`, excludeKeys);
      }
    }
  } else if (typeof data === "string") {
    yield { path, value: data };
  }
}

export async function* searchInArrayStream(data, query, options) {
  const { threshold, excludeKeys, exact } = options;
  for (let index = 0; index < data.length; index++) {
    const item = data[index];
    const flatData = [];
    for await (const extracted of extractTextStream(
      item,
      `[${index}]`,
      excludeKeys
    )) {
      flatData.push(extracted);
    }

    const dataWithSimilarityScore = flatData.map(({ path, value }) => {
      const score = similarityScore(value, query);
      return { path, value, score };
    });

    let matches;
    if (exact) {
      matches = dataWithSimilarityScore
        .filter((result) => result.value === query)
        .sort((a, b) => b.score - a.score);
    } else {
      matches = dataWithSimilarityScore
        .filter((result) => result.score >= threshold)
        .sort((a, b) => b.score - a.score);
    }

    if (matches.length > 0) {
      yield { index, originalData: item, matches };
    }
  }
}

export async function* searchInObjectStream(data, query, options) {
  const { threshold, excludeKeys, exact } = options;

  const flatData = [];
  for await (const extracted of extractTextStream(data, "", excludeKeys)) {
    flatData.push(extracted);
  }

  for (const { path, value } of flatData) {
    const score = similarityScore(value, query);
    if (exact) {
      if (value === query) {
        yield { path, value, score };
      }
    } else {
      if (score >= threshold) {
        yield { path, value, score };
      }
    }
  }
}

