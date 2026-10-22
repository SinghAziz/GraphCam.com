import { useId, useState } from 'react';
import { Minus, Plus, RotateCcw, Grid2X2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { GraphSample } from '@/lib/graph-samples';

export function FunctionPlot({ sample, miniature = false, interactive = false, hero = false }: { sample: GraphSample; miniature?: boolean; interactive?: boolean; hero?: boolean }) {
  const id = useId().replace(/:/g, '');
  const [zoom, setZoom] = useState(1);
  const [grid, setGrid] = useState(true);
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  const w = miniature ? 120 : 560;
  const h = miniature ? 65 : hero ? 320 : 260;
  const xLimit = (miniature ? 4 : 7) / zoom;
  const yLimit = (miniature ? 3 : hero ? 2.7 : 3) / zoom;
  const px = (x: number) => w / 2 + x / xLimit * (w / 2);
  const py = (y: number) => h / 2 - y / yLimit * (h / 2);
  const paths: string[] = [];
  let segment = '';
  let lastY: number | undefined;
  for (let i = 0; i <= 1000; i++) {
    const x = -xLimit + (2 * xLimit * i) / 1000;
    const y = sample.fn(x);
    if (!Number.isFinite(y) || Math.abs(y) > yLimit * 1.5 || (lastY !== undefined && Math.abs(y - lastY) > yLimit)) {
      if (segment) paths.push(segment);
      segment = ''; lastY = undefined; continue;
    }
    segment += `${segment ? 'L' : 'M'}${px(x).toFixed(2)},${py(y).toFixed(2)} `;
    lastY = y;
  }
  if (segment) paths.push(segment);
  const ticks = Array.from({ length: 15 }, (_, i) => i - 7);
  return <>
    {interactive && <div className="graph-tools">
      <Button variant="ghost" size="icon" title="Zoom in" aria-label="Zoom in" disabled={zoom >= 2.5} onClick={() => setZoom(z => Math.min(2.5, z + .25))}><Plus /></Button>
      <Button variant="ghost" size="icon" title="Zoom out" aria-label="Zoom out" disabled={zoom <= .5} onClick={() => setZoom(z => Math.max(.5, z - .25))}><Minus /></Button>
      <Button variant="ghost" size="icon" title="Reset view" aria-label="Reset view" onClick={() => { setZoom(1); setPoint(null); }}><RotateCcw /></Button>
      <Button variant="ghost" size="icon" title="Toggle grid" aria-label="Toggle grid" aria-pressed={grid} onClick={() => setGrid(g => !g)}><Grid2X2 /></Button>
    </div>}
    <svg className={miniature ? 'graph-svg mini-plot' : 'graph-svg'} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label={`${sample.family} function graph`} onPointerLeave={() => setPoint(null)} onPointerMove={interactive ? e => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 2 - 1) * xLimit;
      const y = sample.fn(x);
      setPoint(Number.isFinite(y) && Math.abs(y) <= yLimit ? { x, y } : null);
    } : undefined}>
      <defs><clipPath id={id}><rect width={w} height={h} /></clipPath></defs>
      <g clipPath={`url(#${id})`}>
        {!miniature && grid && ticks.map(t => <g key={t}><line className="plot-grid" x1={px(t)} x2={px(t)} y1={0} y2={h}/><line className="plot-grid" y1={py(t)} y2={py(t)} x1={0} x2={w}/></g>)}
        <line className="plot-axis" x1={0} x2={w} y1={h / 2} y2={h / 2}/><line className="plot-axis" x1={w / 2} x2={w / 2} y1={0} y2={h}/>
        {!miniature && ticks.filter(t => t !== 0 && t % 2 === 0 && Math.abs(t) < xLimit).map(t => <text key={t} className="plot-label" x={px(t)} y={h / 2 + 16} textAnchor="middle">{t}</text>)}
        {!miniature && ticks.filter(t => t !== 0 && Math.abs(t) < yLimit).map(t => <text key={t} className="plot-label" x={w / 2 - 10} y={py(t) + 4} textAnchor="end">{t}</text>)}
        {!miniature && <><text className="plot-label" x={w - 12} y={h / 2 - 8}>x</text><text className="plot-label" x={w / 2 + 10} y={14}>y</text><text className="plot-label" x={w / 2 - 12} y={h / 2 + 16}>0</text></>}
        {hero && <path className="plot-secondary" d={Array.from({ length: 300 }, (_, i) => { const x = -xLimit + 2 * xLimit * i / 299; return `${i ? 'L' : 'M'}${px(x)},${py(Math.cos(x))}`; }).join(' ')} />}
        {paths.map((d, i) => <path key={i} className="plot-curve" d={d} vectorEffect="non-scaling-stroke" />)}
        {point && <circle className="plot-point" cx={px(point.x)} cy={py(point.y)} r={5} />}
      </g>
    </svg>
    {interactive && <span className="graph-coordinate">{point ? `x: ${point.x.toFixed(2)}  y: ${point.y.toFixed(2)}` : `${zoom.toFixed(2)}×`}</span>}
  </>;
}