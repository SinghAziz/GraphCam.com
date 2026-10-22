export type GraphSample = {
  id: string;
  family: string;
  equation: string;
  fn: (x: number) => number;
  description: string;
  domain: string;
  range: string;
  property: { label: string; value: string };
};

export const graphSamples: GraphSample[] = [
  { id: 'sine', family: 'Sine', equation: 'y = \\sin(x)', fn: Math.sin, description: 'A smooth, periodic wave that oscillates between −1 and 1. It passes through the origin and repeats every 2π units.', domain: '\\mathbb{R}', range: '[-1, 1]', property: { label: 'Period', value: '2\\pi' } },
  { id: 'quadratic', family: 'Quadratic', equation: 'y = x^2', fn: x => x * x, description: 'An upward-opening parabola, symmetric about the y-axis. Its vertex at the origin is the minimum of the function.', domain: '\\mathbb{R}', range: '[0, \\infty)', property: { label: 'Vertex', value: '(0, 0)' } },
  { id: 'exponential', family: 'Exponential', equation: 'y = e^x', fn: Math.exp, description: 'An exponential growth curve. It passes through (0, 1), stays positive, and approaches zero as x decreases.', domain: '\\mathbb{R}', range: '(0, \\infty)', property: { label: 'Y-intercept', value: '(0, 1)' } },
  { id: 'cubic', family: 'Cubic', equation: 'y = x^3', fn: x => x ** 3, description: 'An S-shaped polynomial curve, symmetric about the origin. It increases everywhere and has an inflection point at (0, 0).', domain: '\\mathbb{R}', range: '\\mathbb{R}', property: { label: 'Inflection', value: '(0, 0)' } },
  { id: 'cosine', family: 'Cosine', equation: 'y = \\cos(x)', fn: Math.cos, description: 'A periodic wave that starts at its maximum at (0, 1). Like sine, it oscillates between −1 and 1 every 2π units.', domain: '\\mathbb{R}', range: '[-1, 1]', property: { label: 'Period', value: '2\\pi' } },
  { id: 'tangent', family: 'Tangent', equation: 'y = \\tan(x)', fn: Math.tan, description: 'A periodic function with repeating increasing branches. It is undefined at π/2 + kπ, where vertical asymptotes separate the branches.', domain: 'x \\ne \\frac{\\pi}{2}+k\\pi', range: '\\mathbb{R}', property: { label: 'Period', value: '\\pi' } },
  { id: 'secant', family: 'Secant', equation: 'y = \\sec(x)', fn: x => 1 / Math.cos(x), description: 'The reciprocal of cosine. Its alternating branches stay at or above 1 or at or below −1, with asymptotes wherever cosine is zero.', domain: 'x \\ne \\frac{\\pi}{2}+k\\pi', range: '|y| \\ge 1', property: { label: 'Period', value: '2\\pi' } },
  { id: 'cosecant', family: 'Cosecant', equation: 'y = \\csc(x)', fn: x => 1 / Math.sin(x), description: 'The reciprocal of sine, with vertical asymptotes at integer multiples of π. Its values never lie strictly between −1 and 1.', domain: 'x \\ne k\\pi', range: '|y| \\ge 1', property: { label: 'Period', value: '2\\pi' } },
  { id: 'cotangent', family: 'Cotangent', equation: 'y = \\cot(x)', fn: x => Math.cos(x) / Math.sin(x), description: 'The ratio of cosine to sine. Its decreasing branches repeat every π units, separated by asymptotes at integer multiples of π.', domain: 'x \\ne k\\pi', range: '\\mathbb{R}', property: { label: 'Period', value: '\\pi' } },
  { id: 'logarithmic', family: 'Logarithmic', equation: 'y = \\ln(x)', fn: Math.log, description: 'The inverse of the natural exponential. Defined only for positive x, it crosses (1, 0) and increases slowly with a vertical asymptote at x = 0.', domain: '(0, \\infty)', range: '\\mathbb{R}', property: { label: 'X-intercept', value: '(1, 0)' } },
];

export const initialSample = graphSamples[0];