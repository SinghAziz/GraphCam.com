// Keep model transport separate from sample math. The adapter runs the
// original GraphCam CNN (CNN_Model.h5, converted to browser format in
// public/model) with the same preprocessing as the Flask app.
export type ModelResult = {
  family: string;
  label: string;
  confidence: number;
  explanation?: string;
};
export type InferenceAdapter = { analyze: (file: File, signal?: AbortSignal) => Promise<ModelResult> };

// Training labels: alphabetical sub-folders of GraphCam/Graphs, as produced by
// image_dataset_from_directory and hardcoded in GraphCam_App/app.py.
export const MODEL_LABELS = ['cos', 'cosec', 'cot', 'cubic', 'exp', 'log', 'quad', 'sec', 'sin', 'tan'] as const;
export const LABEL_NAMES: Record<(typeof MODEL_LABELS)[number], string> = {
  cos: 'Cosine', cosec: 'Cosecant', cot: 'Cotangent', cubic: 'Cubic', exp: 'Exponential',
  log: 'Logarithmic', quad: 'Quadratic', sec: 'Secant', sin: 'Sine', tan: 'Tangent',
};
export const SUPPORTED_FAMILIES = ['Sine', 'Cosine', 'Tangent', 'Secant', 'Cosecant', 'Cotangent', 'Quadratic', 'Cubic', 'Exponential', 'Logarithmic'];

const IMG_SIZE = 128;
let modelPromise: Promise<import('@tensorflow/tfjs').LayersModel> | null = null;

async function loadModel() {
  const tf = await import('@tensorflow/tfjs');
  if (!modelPromise) modelPromise = tf.loadLayersModel('/model/model.json').catch(e => { modelPromise = null; throw e; });
  return { tf, model: await modelPromise };
}

async function toPixels(file: File): Promise<Float32Array> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = IMG_SIZE; canvas.height = IMG_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.imageSmoothingEnabled = false; // Keras load_img default: nearest-neighbour resize
  ctx.drawImage(bitmap, 0, 0, IMG_SIZE, IMG_SIZE);
  bitmap.close();
  const { data } = ctx.getImageData(0, 0, IMG_SIZE, IMG_SIZE);
  const out = new Float32Array(IMG_SIZE * IMG_SIZE * 3);
  for (let i = 0, j = 0; i < data.length; i += 4) { out[j++] = (data[i] ?? 0) / 255; out[j++] = (data[i + 1] ?? 0) / 255; out[j++] = (data[i + 2] ?? 0) / 255; }
  return out;
}

export const inferenceAdapter: InferenceAdapter = {
  async analyze(file) {
    const [{ tf, model }, pixels] = await Promise.all([loadModel(), toPixels(file)]);
    const probs = Array.from(tf.tidy(() => (model.predict(tf.tensor4d(pixels, [1, IMG_SIZE, IMG_SIZE, 3])) as import('@tensorflow/tfjs').Tensor).dataSync()));
    if (probs.length !== MODEL_LABELS.length) throw new Error('Unexpected model output');
    const confidence = Math.max(...probs);
    const label = MODEL_LABELS[probs.indexOf(confidence)] ?? MODEL_LABELS[0];
    return { label, family: LABEL_NAMES[label], confidence };
  },
};

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export function validateGraphImage(file: File): string | null {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return 'Please select a PNG, JPG, or WebP image.';
  if (file.size > MAX_IMAGE_BYTES) return 'This image is too large. Please choose a file smaller than 10 MB.';
  if (file.size === 0) return 'This file is empty. Please choose another image.';
  return null;
}
