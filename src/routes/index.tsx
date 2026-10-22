import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, ArrowUpRight, Braces, BrainCircuit, Camera, Check, Code2, FlaskConical, Github, ScanLine, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Equation } from '@/components/equation';
import { FunctionPlot } from '@/components/function-plot';
import { GraphWorkspace } from '@/components/graph-workspace';
import { initialSample } from '@/lib/graph-samples';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'GraphCam — AI-Powered Mathematical Graph Recognition' },
    { name: 'description', content: 'GraphCam recognizes ten mathematical function families from graph images using on-device AI. Upload a graph or explore interactive samples.' },
    { property: 'og:title', content: 'GraphCam — AI-Powered Mathematical Graph Recognition' },
    { property: 'og:description', content: 'Recognize mathematical function families from graph images with GraphCam. Private, on-device classification and interactive graph samples.' },
    { property: 'og:site_name', content: 'GraphCam' },
    { name: 'twitter:title', content: 'GraphCam — AI-Powered Mathematical Graph Recognition' },
    { name: 'twitter:description', content: 'Recognize mathematical function families from graph images with GraphCam. Private, on-device classification and interactive graph samples.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

function Index() {
  return <>
    <header className="site-header"><div className="site-container header-inner"><a className="brand" href="#top" aria-label="GraphCam home"><svg className="brand-icon" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="3" y="6" width="26" height="23" rx="6" stroke="currentColor" strokeWidth="2"/><path d="M11 6l2-3h6l2 3M8 23c3 0 3-12 8-12s5 12 8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M7 17h18M16 9v17" stroke="currentColor" strokeWidth="1" opacity=".35"/></svg>GraphCam<span className="text-primary">.</span></a><div className="header-right"><nav className="header-nav" aria-label="Main navigation"><a href="#workspace">Workspace</a><a href="#how-it-works">How It Works</a><a href="#about">About</a></nav><span className="header-divider"/><Button asChild variant="ghost" size="sm" className="header-github"><a href="https://github.com/SinghAziz/GraphCam" target="_blank" rel="noreferrer"><Github />GitHub<ArrowUpRight /></a></Button></div></div></header>
    <main id="top">
      <section className="hero"><div className="site-container hero-inner"><div className="hero-copy"><span className="eyebrow"><span className="eyebrow-dot"/>Computer vision meets mathematics</span><h1>Turn Mathematical<br/>Graphs Into <span>Equations.</span></h1><p className="hero-subtitle">Upload a graph, explore its mathematical structure, and discover the function that best describes it.</p><div className="hero-actions"><Button asChild className="hero-cta"><a href="#workspace"><ScanLine />Analyze a Graph<ArrowRight /></a></Button><span className="small-note"><Check size={13}/>Free to explore. Built for curiosity.</span></div></div><div className="hero-visual">{initialSample && <div className="hero-plot"><FunctionPlot sample={initialSample} hero /></div>}<div className="hero-equation"><Equation math={'y = \\sin(x)'}/></div><div className="hero-insight"><div><div className="insight-title"><ScanLine size={15}/>A familiar curve. A clear equation.</div><div className="insight-detail">Sine function<span className="mx-2">·</span>Periodic<span className="mx-2">·</span>Amplitude 1</div></div><span className="demo-badge"><FlaskConical size={11}/>Sample preview</span></div></div></div></section>
      <GraphWorkspace />
      <section id="how-it-works" className="how-section"><div className="site-container"><div className="how-heading"><h2>From pixels to possibilities.</h2><span className="small-note">The recognition pipeline</span></div><div className="process-grid"><div className="process-item"><div className="process-icon"><Upload /></div><h3><span>01</span>Upload</h3><p>Start with an image of a mathematical graph. The original Python pipeline resizes it to 128 × 128 pixels and normalizes pixel values.</p><ArrowRight className="process-arrow"/></div><div className="process-item"><div className="process-icon"><BrainCircuit /></div><h3><span>02</span>Recognize</h3><p>A TensorFlow / Keras convolutional neural network classifies a candidate from 10 function families. Here it runs directly in your browser.</p><ArrowRight className="process-arrow"/></div><div className="process-item"><div className="process-icon"><Braces /></div><h3><span>03</span>Explore</h3><p>Uploads show the predicted family and confidence. Sample graphs plot known equations; equation parameter estimation is not included.</p></div></div></div></section>
      <section id="about" className="site-container about-section"><div><span className="eyebrow">An EMBER portfolio project</span><h2>A different way to see mathematics.</h2><p>GraphCam explores how computer vision can connect the shape of a graph to its function family. The original project pairs a Python CNN with a Flask upload interface; this interactive companion brings its mathematics to life.</p><div className="tech-list">{['Python', 'TensorFlow', 'Keras', 'Flask', 'NumPy', 'React', 'TypeScript'].map(t => <span key={t} className="tech-tag">{t}</span>)}</div><p className="small-note"><FlaskConical size={13}/>Uploaded images are classified by the original trained model; sample graphs use known equations.</p></div><div className="repo-links"><a className="repo-link" href="https://github.com/SinghAziz/GraphCam_App" target="_blank" rel="noreferrer"><Code2 /><div><strong>GraphCam application</strong><span>The original Flask interface & inference workflow</span></div><ArrowUpRight /></a><a className="repo-link" href="https://github.com/SinghAziz/GraphCam" target="_blank" rel="noreferrer"><Github /><div><strong>Behind the model</strong><span>CNN architecture, training & graph classification</span></div><ArrowUpRight /></a></div></section>
    </main>
    <footer className="site-footer"><div className="site-container footer-inner"><div><span className="footer-brand">GraphCam.</span>Where computer vision meets mathematical intuition.</div><span className="footer-right"><Camera />A project by Har Aziz Singh<ArrowUpRight size={11}/></span></div></footer>
  </>;
}
