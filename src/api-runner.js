import { runApiTests } from './challenges.js';

export function runApi(source, timeoutMs = 3000) {
  return new Promise((resolve) => {
    const frame = document.createElement('iframe');
    frame.sandbox = 'allow-scripts';
    frame.hidden = true;
    const workerCode = `const runApiTests = ${runApiTests.toString()};
self.onmessage = async (event) => {
  try { self.postMessage(await runApiTests(event.data)); }
  catch (error) { self.postMessage({ error: String(error) }); }
};`;
    const safeWorkerCode = JSON.stringify(workerCode).replaceAll('<', '\\u003c');
    frame.srcdoc = `<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob:; worker-src blob:; connect-src 'none'">
<script>
window.addEventListener('message', (event) => {
  const port = event.ports[0];
  if (!port) return;
  const url = URL.createObjectURL(new Blob([${safeWorkerCode}], { type: 'text/javascript' }));
  const worker = new Worker(url);
  URL.revokeObjectURL(url);
  worker.onmessage = (result) => port.postMessage(result.data);
  worker.onerror = (error) => port.postMessage({ error: error.message || 'Worker failed.' });
  worker.postMessage(event.data);
}, { once: true });
</script>`;
    const channel = new MessageChannel();
    let timer;
    const finish = (result) => {
      clearTimeout(timer);
      channel.port1.close();
      frame.remove();
      resolve(result);
    };
    channel.port1.onmessage = (event) => finish(event.data);
    frame.onload = () => frame.contentWindow.postMessage(source, '*', [channel.port2]);
    document.body.append(frame);
    timer = setTimeout(() => finish({ error: 'Execution timed out. Check for an infinite loop or a promise that never resolves.' }), timeoutMs);
  });
}
