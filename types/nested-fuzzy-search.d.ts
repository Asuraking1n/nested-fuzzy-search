declare module "nested-fuzzy-search" {
  interface SearchResult {
    path: string;
    value: string;
    score: number;
  }

  export function search(
    data: any[],
    query: string,
    threshold?: number
  ): SearchResult[];
}
