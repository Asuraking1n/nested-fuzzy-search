declare module "nested-fuzzy-search" {
  interface SearchResult {
    path: string;
    value: string | object; // Value can be a string or an object (for arrays or objects)
    score: number;
  }

  // Updated search function type definition to support both arrays and objects
  export function search(
    data: any, // data can now be either an object or an array
    query: string,
    threshold?: number
  ): SearchResult[];
}
