import { describe, expect, it } from 'vitest';
import { graphSamples } from '@/lib/graph-samples';
import { MODEL_LABELS, validateGraphImage } from '@/lib/graph-inference';

describe('GraphCam demo honesty and math', () => {
  it('uses the ten verified training labels in alphabetical folder order', () => {
    expect([...MODEL_LABELS]).toEqual([...MODEL_LABELS].sort());
    expect(MODEL_LABELS).toHaveLength(10);
  });
  it('provides ten distinct known sample families', () => {
    expect(new Set(graphSamples.map(s => s.id)).size).toBe(10);
    expect(graphSamples.find(s => s.id === 'sine')?.fn(0)).toBe(0);
    expect(graphSamples.find(s => s.id === 'quadratic')?.fn(-2)).toBe(4);
    expect(graphSamples.find(s => s.id === 'exponential')?.fn(0)).toBe(1);
    expect(graphSamples.find(s => s.id === 'logarithmic')?.fn(1)).toBe(0);
  });
  it('accepts images and rejects unsupported, oversized, and empty files', () => {
    expect(validateGraphImage(new File(['image'], 'graph.png', { type: 'image/png' }))).toBeNull();
    expect(validateGraphImage(new File(['text'], 'graph.txt', { type: 'text/plain' }))).toContain('PNG');
    expect(validateGraphImage(new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'graph.jpg', { type: 'image/jpeg' }))).toContain('too large');
    expect(validateGraphImage(new File([], 'empty.png', { type: 'image/png' }))).toContain('empty');
  });
});