// @ts-nocheck — Transformers.js pipeline() overloads are too complex for TS
import { pipeline, env } from '@huggingface/transformers';

let embedder: any = null;

self.onmessage = async (e: MessageEvent) => {
  if (e.data.type === 'init') {
    try {
      env.allowLocalModels = false;
      embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
        dtype: 'q8',
        progress_callback: (progress: any) => {
          self.postMessage({ type: 'progress', ...progress });
        },
      });
      self.postMessage({ type: 'ready' });
    } catch (err) {
      self.postMessage({ type: 'error', message: String(err) });
    }
  }

  if (e.data.type === 'embed' && embedder) {
    try {
      const output = await embedder(e.data.text, { pooling: 'mean', normalize: true });
      self.postMessage({
        type: 'embedding',
        vector: Array.from(output.data),
        id: e.data.id,
      });
    } catch (err) {
      self.postMessage({ type: 'error', message: String(err), id: e.data.id });
    }
  }
};
