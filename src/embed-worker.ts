const VECTOR_DIMENSION = 384;

type InitMessage = {
  type: "init";
};

type EmbedMessage = {
  type: "embed";
  text: string;
  id: number;
};

type WorkerMessage = InitMessage | EmbedMessage;

function normalize(vector: number[]): number[] {
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (magnitude === 0) {
    return vector;
  }

  return vector.map((value) => value / magnitude);
}

function embedText(text: string): number[] {
  const vector = new Array<number>(VECTOR_DIMENSION).fill(0);
  const input = text.trim().toLowerCase();

  for (let index = 0; index < input.length; index += 1) {
    const code = input.charCodeAt(index);
    const slot = (code + index * 31) % VECTOR_DIMENSION;
    vector[slot] += 1;
    vector[(slot * 7 + 17) % VECTOR_DIMENSION] += code / 255;
  }

  return normalize(vector);
}

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  try {
    if (event.data.type === "init") {
      self.postMessage({ type: "ready" });
      return;
    }

    if (event.data.type === "embed") {
      self.postMessage({
        type: "embedding",
        id: event.data.id,
        vector: embedText(event.data.text),
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Embedding worker failed";
    self.postMessage({ type: "error", message });
  }
};
