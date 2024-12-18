import {
  searchInArray,
  searchInArrayStream,
  searchInObject,
  searchInObjectStream,
} from "./utils/index.js";

// Main search function
function search(
  data,
  query,
  options = {
    threshold: 0.6,
    outputMode: "flat",
    excludeKeys: [],
    exact: false,
  }
) {
  const { threshold, outputMode, excludeKeys, exact } = options;
  if (Array.isArray(data) && outputMode === "tree") {
    return searchInArray(data, query, { threshold, excludeKeys, exact });
  } else if (data && typeof data === "object") {
    return searchInObject(data, query, { threshold, excludeKeys, exact });
  }
  return [];
}

async function* searchStream(
  data,
  query,
  options = {
    threshold: 0.6,
    outputMode: "flat",
    excludeKeys: [],
    exact: false,
  }
) {
  const { threshold, outputMode, excludeKeys, exact } = options;
  if (Array.isArray(data) && outputMode === "tree") {
    yield* searchInArrayStream(data, query, { threshold, excludeKeys, exact });
  } else if (data && typeof data === "object") {
    yield* searchInObjectStream(data, query, { threshold, excludeKeys, exact });
  }
}

export { search, searchStream };
