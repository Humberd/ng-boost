import { safeResolve } from './safe-resolve';

describe('safeResolve', () => {
  it('should return callback response when there is no error', () => {
    expect(safeResolve(() => 'xyz')).toBe('xyz');
    expect(safeResolve(() => 'xyz', 'abc')).toBe('xyz');
  });

  it('should return default fallback when there is an error', () => {
    expect(safeResolve(() => ({} as any).x.y.z)).toBe(undefined);
  });

  it('should return custom fallback when there is an error', () => {
    expect(safeResolve(() => ({} as any).x.y.z, 'foobar')).toBe('foobar');
  });
});
