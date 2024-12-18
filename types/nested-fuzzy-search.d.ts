declare module "nested-fuzzy-search" {
  interface SearchResult {
    path: string;
    value: string | object; // Value can be a string or an object (for arrays or objects)
    score: number;
  }

  interface SearchOptions {
    threshold?: number;
    outputMode?: "flat" | "tree";
    excludeKeys?: string[];
    exact?: boolean;
  }

  // Synchronous search function
  export function search(
    data: any, // Can be an object or an array
    query: string,
    options?: SearchOptions
  ): SearchResult[];

  // Asynchronous streaming search function (returns an async iterable)
  export function searchStream(
    data: any, // Can be an object or an array
    query: string,
    options?: SearchOptions
  ): AsyncGenerator<SearchResult, void, unknown>;
}
