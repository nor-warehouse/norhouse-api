export interface PaginationRequest {
  limit?: number;
  page?: number;
}

export interface PaginationResult<T = unknown> {
  count: number;
  entries: T[];
}

export class PaginationService {
  private DEFAULT_PAGE = 1;
  private DEFAULT_LIMIT = 20;
  private DEFAULT_OPTIONS: PaginationRequest = {
    limit: this.DEFAULT_LIMIT,
    page: this.DEFAULT_PAGE,
  };

  public paginate<T = unknown>(entries: T[], options: PaginationRequest = this.DEFAULT_OPTIONS): PaginationResult<T> {
    const { limit, page } = options;
    const index = (options.page - 1) * options.limit;
    return {
      count: entries.length,
      entries: entries.slice(index, page * limit),
    };
  }
}
