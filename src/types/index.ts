export const enum TypeSearch {
  USERS = "users",
  REPOSITORIES = "repositories",
  ISSUES = "issues",
}

export interface RequestBody {
  searchTerm?: TypeSearch;
  searchType?: string;
}
