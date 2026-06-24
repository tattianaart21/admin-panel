let basUrl = "";
let tracesUrl = "";
let benchUrl = "";

try {
  const base = window.location.origin;
  const res = await fetch(`${base}/config.json`);
  const config = await res.json();

  basUrl = config.BAS_API_URL;
  tracesUrl = config.TRACES_API_URL;
  benchUrl = config.BENCH_API_URL;
} catch (e) {
  console.error(e);
}

export const config = {
  basUrl,
  tracesUrl,
  benchUrl,
} as const;

export type Config = typeof config;
