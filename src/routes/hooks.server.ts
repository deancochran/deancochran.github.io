export async function handle({ event, resolve, error }) {
  const route = event.url;

  const start = performance.now();
  const response = await resolve(event);
  const end = performance.now();

  const responseTime = end - start;

  if (responseTime > 2000) {
    console.log(`🐢 ${route} took ${responseTime.toFixed(2)} ms`);
  }

  if (responseTime < 1000) {
    console.log(`🚀 ${route} took ${responseTime.toFixed(2)} ms`);
  }

  return response;
}
