import katex from 'katex';

export function Equation({ math, className = '' }: { math: string; className?: string }) {
  const markup = katex.renderToString(math, { throwOnError: false, output: 'htmlAndMathml' });
  return <span className={className} dangerouslySetInnerHTML={{ __html: markup }} />;
}