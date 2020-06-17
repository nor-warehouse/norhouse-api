/* eslint-disable @typescript-eslint/no-use-before-define */
import { PaginationRequest, PaginationResult, PaginationService } from '../';

const paginationService = new PaginationService();
let result: PaginationResult;

describe('Given a PaginationService', () => {
  test('when paginate method is executed with a falsy value, then should return 0 entries and 0 count', () => {
    whenPaginateIsExecuted([], undefined);
    thenAssertResult(0, 0);
  });

  test('when paginate method is executed with no entries, page nor limit, then should return 0 entries and 0 count', () => {
    whenPaginateIsExecuted([], {});
    thenAssertResult(0, 0);
  });

  test('when paginate method is executed with no entries, page 1 and limit 5, then should return 0 entries and 0 count', () => {
    whenPaginateIsExecuted([], { page: 1, limit: 5 });
    thenAssertResult(0, 0);
  });

  test('when paginate method is executed with entries but no page and limit, then should return default limit entries from the default page', () => {
    whenPaginateIsExecuted(withEntries(2), undefined);
    thenAssertResult(2, 2);
  });

  test('when paginate method is executed with entries and page 0, then should return entries from the first page', () => {
    whenPaginateIsExecuted(withEntries(2), { page: 0 });
    thenAssertResult(2, 2);
  });

  test('when paginate method is executed with entries and limit less than 0, then should return 0 entries', () => {
    whenPaginateIsExecuted(withEntries(2), { limit: -2 });
    thenAssertResult(2, 0);
  });

  test('when paginate method is executed with 3 entries, page 1 and limit 2, then should return 2 entries from the first page', () => {
    whenPaginateIsExecuted(withEntries(3), { page: 1, limit: 2 });
    thenAssertResult(3, 2);
  });

  test('when paginate method is executed with 3 entries, page 2 and limit 2, then should return 1 entry from the second page', () => {
    whenPaginateIsExecuted(withEntries(3), { page: 2, limit: 2 });
    thenAssertResult(3, 1);
  });
});

function withEntries(count: number): number[] {
  return new Array(count);
}

function whenPaginateIsExecuted(entries: number[], options: PaginationRequest): void {
  result = paginationService.paginate<number>(entries, options);
}

function thenAssertResult(expectedCount: number, expectedEntriesLength: number): void {
  expect(result.count).toEqual(expectedCount);
  expect(result.entries).toHaveLength(expectedEntriesLength);
}
