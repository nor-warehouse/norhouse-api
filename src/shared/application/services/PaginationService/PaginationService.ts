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
    const { limit = this.DEFAULT_LIMIT, page = this.DEFAULT_PAGE } = options;
    const pageNum = Math.max(1, page);
    const minLimit = Math.max(0, limit);
    const index = (pageNum - 1) * minLimit;
    const result = entries.slice(index, pageNum * minLimit);
    return {
      count: entries.length,
      entries: result,
    };
  }
}
