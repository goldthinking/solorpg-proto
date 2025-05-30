// @/api/question.js

export async function fetchStreamingAnswer(promptPayload, onChunk, onFinish) {
  try {
    const res = await fetch('/api/characterQuestion/ai/fetch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: JSON.stringify(promptPayload) }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let done = false;
    let resultText = '';

    while (!done) {
      const result = await reader.read();
      done = result.done;

      const chunk = decoder.decode(result.value || new Uint8Array(), { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.trim()) {
          try {
            const json = JSON.parse(line);
            const response = json.response || '';
            resultText += response;
            onChunk?.(response); // 实时推送到回调
          } catch (e) {
            console.warn('JSON parse error:', line);
          }
        }
      }
    }

    onFinish?.(resultText);
    return resultText;

  } catch (error) {
    console.error('流式请求出错:', error);
    throw error;
  }
}
