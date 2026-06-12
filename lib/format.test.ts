import { describe, it, expect } from 'vitest';
import { formatPhone } from './format';

describe('formatPhone', () => {
  it('01012345678 → 010-1234-5678', () => {
    expect(formatPhone('01012345678')).toBe('010-1234-5678');
  });

  it('01099992222 → 010-9999-2222', () => {
    expect(formatPhone('01099992222')).toBe('010-9999-2222');
  });

  it('이미 포맷된 번호 → 그대로', () => {
    expect(formatPhone('010-1234-5678')).toBe('010-1234-5678');
  });
});
