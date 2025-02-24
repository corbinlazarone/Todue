/**
 * Rate limiter middleware
 * Reference: https://medium.com/@abrar.adam.09/implementing-rate-limiting-in-next-js-api-routes-without-external-packages-7195ca4ef768
 */

const rateLimitMap = new Map();

export function rateLimit(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const limit = 100; // Limiting requests to 100 per minute per IP
  const windowMs = 60 * 1000; // 1 minute

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, {
      count: 0,
      lastReset: Date.now(),
    });
  }

  const ipData = rateLimitMap.get(ip);

  if (Date.now() - ipData.lastReset > windowMs) {
    ipData.count = 0;
    ipData.lastReset = Date.now();
  }

  if (ipData.count >= limit) {
    return new Response("Too Many Requests", { status: 429 });
  }

  ipData.count += 1;
  return null;
}