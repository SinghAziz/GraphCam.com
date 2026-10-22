import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, FileImage, FlaskConical, ImagePlus, Info, ScanLine, Sparkles, Trash2, Upload, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Equation } from '@/components/equation';
import { FunctionPlot } from '@/components/function-plot';
import { graphSamples, initialSample, type GraphSample } from '@/lib/graph-samples';
import { inferenceAdapter, SUPPORTED_FAMILIES, validateGraphImage, type ModelResult } from '@/lib/graph-inference';

export function GraphWorkspace() {
  const [selected, setSelected] = useState<GraphSample | null>(initialSample ?? null);
  const [result, setResult] = useState<GraphSample | null>(initialSample ?? null);
  const [modelResult, setModelResult] = useState<ModelResult | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const request = useRef(0);
  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file); setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  function acceptFile(next: File) {
    const validation = validateGraphImage(next);
    if (validation) { setError(validation); return; }
    request.current++; setFile(next); setSelected(null); setResult(null); setModelResult(null); setError(''); setUnavailable(false); setAnalyzed(false); setBusy(false);
  }
  function chooseSample(sample: GraphSample) {
    request.current++; setSelected(sample); setResult(sample); setModelResult(null); setFile(null); setError(''); setUnavailable(false); setAnalyzed(false); setBusy(false);
  }
  function reset() {
    request.current++; setFile(null); setSelected(null); setResult(null); setModelResult(null); setError(''); setUnavailable(false); setAnalyzed(false); setBusy(false);
    if (input.current) input.current.value = '';
  }
  async function analyze() {
    setError(''); setAnalyzed(false);
    if (selected) { setResult(selected); setAnalyzed(true); return; }
    if (!file) { setError('Choose a sample or upload an image first.'); return; }
    const current = ++request.current;
    setBusy(true);
    try {
      const prediction = await inferenceAdapter.analyze(file);
      if (current === request.current) { setModelResult(prediction); setAnalyzed(true); }
    } catch { if (current === request.current) { setUnavailable(true); setError('The model could not analyze this image. No result was produced — please try again.'); } }
    finally { if (current === request.current) setBusy(false); }
  }
  return <section id="workspace" className="workspace-section site-container">
    <div className="section-top"><div><div className="section-heading"><ScanLine /><h2>Graph workspace</h2></div><p className="section-subtitle">A little image. A world of mathematics.</p></div><div className="local-badge"><span />Runs in your browser · No sign-up</div></div>
    <div className="workspace">
      <div className="input-panel">
        <div className="panel-top"><span className="panel-heading"><Upload size={15} />Your graph</span><span className="step-tag">01 / INPUT</span></div>
        <input ref={input} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" aria-label="Upload graph image" onChange={e => { const next = e.target.files?.[0]; if (next) acceptFile(next); e.target.value = ''; }} />
        <div className={`drop-zone ${dragging ? 'dragging' : ''}`} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); const next = e.dataTransfer.files[0]; if (next) acceptFile(next); }}>
          {preview ? <img src={preview} className="uploaded-image" alt="Uploaded mathematical graph" onError={() => { setError('This image could not be opened. Please choose a valid image.'); setFile(null); }} /> : <><div className="upload-symbol"><ImagePlus size={22} /></div><p className="drop-title">Drop your graph image here</p><p className="drop-helper">or choose one from your device</p><Button variant="outline" size="sm" onClick={() => input.current?.click()}><Upload size={13} />Browse files</Button><span className="file-types">PNG, JPG, WEBP · UP TO 10 MB</span></>}
          {preview && <span className="demo-badge preview-label"><FileImage size={11} />Uploaded image</span>}
        </div>
        {file && <div className="file-row"><span className="file-name">{file.name}</span><div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => input.current?.click()}><RotateCcw />Replace</Button><Button variant="ghost" size="icon" title="Remove image" aria-label="Remove image" onClick={reset}><Trash2 /></Button></div></div>}
        {error && <p role="alert" className="error-text">{error}</p>}
        <p className="input-note"><strong>Supported families:</strong> {SUPPORTED_FAMILIES.join(', ').toLowerCase()}. Results are limited to these; unusual, unclear or unsupported graphs may be misclassified.</p>
        <div className="sample-heading">or explore a sample graph</div>
        <div className="sample-grid">{graphSamples.slice(0, 4).map(sample => <Button key={sample.id} variant="outline" className={`sample-button ${selected?.id === sample.id ? 'selected' : ''}`} onClick={() => chooseSample(sample)} aria-label={sample.family} aria-pressed={selected?.id === sample.id}><FunctionPlot sample={sample} miniature /><span>{sample.family}</span></Button>)}</div>
        <div className="family-picker"><label htmlFor="sample-family">More function families</label><select id="sample-family" value={selected?.id ?? ''} onChange={e => { const sample = graphSamples.find(s => s.id === e.target.value); if (sample) chooseSample(sample); }}><option value="" disabled>Select a sample</option>{graphSamples.map(s => <option key={s.id} value={s.id}>{s.family}</option>)}</select></div>
        <Button className="analyze-button" disabled={busy || (!selected && !file)} onClick={analyze}>{busy ? <ScanLine /> : analyzed ? <Check /> : <Sparkles />}{busy ? 'Analyzing…' : analyzed ? (file ? 'Graph classified' : 'Sample explored') : 'Analyze Graph'}{!busy && !analyzed && <ArrowRight className="ml-auto" />}</Button>
        <p className="input-note">Your image is classified on your device and never uploaded. Samples use known equations.</p>
      </div>
      <div className="result-panel" aria-live="polite">
        <div className="panel-top"><span className="panel-heading"><ScanLine size={15} />Analysis</span><span className="step-tag">02 / EXPLORE</span></div>
        {result ? <>
          <div className="result-summary"><div><div className="result-heading">FUNCTION FAMILY</div><div className="result-family">{result.family} function</div></div><span className="demo-badge"><FlaskConical size={11} />Demonstration</span></div>
          <div className="equation-box"><Equation math={result.equation} /></div>
          <div className="result-graph"><FunctionPlot key={result.id} sample={result} interactive /></div>
          <p className="result-explanation">{result.description}</p>
          <div className="properties"><div><div className="property-label">DOMAIN</div><Equation className="property-value" math={result.domain} /></div><div><div className="property-label">RANGE</div><Equation className="property-value" math={result.range} /></div><div><div className="property-label">{result.property.label.toUpperCase()}</div><Equation className="property-value" math={result.property.value} /></div></div>
          <div className="result-bottom"><span>Known sample · Not a model prediction</span><Button variant="ghost" size="sm" onClick={reset}><RotateCcw />Start over</Button></div>
        </> : modelResult ? <>
          <div className="result-summary"><div><div className="result-heading">PREDICTED CLASS</div><div className="result-family">{modelResult.family} function</div></div><span className="demo-badge"><ScanLine size={11} />Model prediction</span></div>
          <div className="properties"><div><div className="property-label">CONFIDENCE</div><div className="property-value">{(modelResult.confidence * 100).toFixed(1)}%</div></div><div><div className="property-label">MODEL LABEL</div><div className="property-value">{modelResult.label}</div></div></div>
          <p className="result-explanation">Predicted by the GraphCam CNN. It identifies the function family only; it does not estimate the equation's parameters. Graphs outside the supported families may be misclassified.</p>
          <div className="result-bottom"><span>Live model prediction</span><Button variant="ghost" size="sm" onClick={reset}><RotateCcw />Analyze another graph</Button></div>
        </> : <div className="unavailable"><Info size={30} /><span className="demo-badge">{unavailable ? 'Inference failed' : 'Ready to explore'}</span><h3>{unavailable ? 'No prediction was made.' : file ? 'Your graph is ready' : 'A new graph, a new discovery.'}</h3><p>{unavailable ? 'The model could not run on this image, so no class or confidence is shown. Try again or use a different image.' : file ? 'Press Analyze Graph to classify it with the GraphCam model.' : 'Choose one of the sample graphs to explore its equation and mathematical properties, or upload your own image.'}</p><Button variant="outline" onClick={() => { if (initialSample) chooseSample(initialSample); }}><FlaskConical />Explore a sine sample</Button>{file && <Button variant="ghost" size="sm" className="mt-3" onClick={reset}><RotateCcw />Analyze another graph</Button>}</div>}
      </div>
    </div>
  </section>;
}