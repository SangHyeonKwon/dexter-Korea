import { describe, it, expect } from 'bun:test';
import { toDartDate, sortByRceptDtDesc, isNoDataError } from './utils.js';

describe('toDartDate', () => {
  it('strips dashes from an ISO date', () => {
    expect(toDartDate('2024-03-15')).toBe('20240315');
  });
});

describe('sortByRceptDtDesc', () => {
  it('orders by rcept_dt descending and caps to limit', () => {
    const list = [
      { rcept_dt: '20230101', id: 'a' },
      { rcept_dt: '20240601', id: 'b' },
      { rcept_dt: '20240105', id: 'c' },
    ];
    const result = sortByRceptDtDesc(list, 2);
    expect(result.map((r) => r.id)).toEqual(['b', 'c']);
  });

  it('does not mutate the input array', () => {
    const list = [{ rcept_dt: '20230101' }, { rcept_dt: '20240601' }];
    sortByRceptDtDesc(list, 10);
    expect(list[0].rcept_dt).toBe('20230101');
  });

  it('tolerates missing rcept_dt', () => {
    const list = [{ rcept_dt: '20240101' }, {}];
    expect(sortByRceptDtDesc(list, 10)).toHaveLength(2);
  });
});

describe('isNoDataError', () => {
  it('detects DART status 013 (no data)', () => {
    expect(isNoDataError('[DART API] foo — status=013 (조회된 데이타가 없습니다)')).toBe(true);
  });

  it('returns false for other errors', () => {
    expect(isNoDataError('[DART API] foo — status=020 (사용한도초과)')).toBe(false);
  });
});
