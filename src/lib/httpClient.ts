import { HttpMethod, KeyValuePair, BodyType, AuthConfig, ResponseData, Environment } from '@/types';

function substituteVars(text: string, env?: Environment): string {
  if (!env) return text;
  const vars = env.variables.filter((v) => v.enabled && v.key);
  let result = text;
  for (const v of vars) {
    result = result.replaceAll(`{{${v.key}}}`, v.value);
  }
  return result;
}

export async function sendRequest(opts: {
  method: HttpMethod;
  url: string;
  params: KeyValuePair[];
  headers: KeyValuePair[];
  bodyType: BodyType;
  bodyContent: string;
  auth: AuthConfig;
  env?: Environment;
}): Promise<ResponseData> {
  const { method, params, headers, bodyType, bodyContent, auth, env } = opts;
  let url = substituteVars(opts.url, env);

  // Build query params
  const activeParams = params.filter((p) => p.enabled && p.key);
  if (activeParams.length) {
    const searchParams = new URLSearchParams();
    activeParams.forEach((p) => searchParams.append(
      substituteVars(p.key, env),
      substituteVars(p.value, env)
    ));
    const separator = url.includes('?') ? '&' : '?';
    url += separator + searchParams.toString();
  }

  // Build headers
  const reqHeaders: Record<string, string> = {};
  headers
    .filter((h) => h.enabled && h.key)
    .forEach((h) => {
      reqHeaders[substituteVars(h.key, env)] = substituteVars(h.value, env);
    });

  // Auth
  if (auth.type === 'bearer' && auth.bearer) {
    reqHeaders['Authorization'] = `Bearer ${substituteVars(auth.bearer, env)}`;
  } else if (auth.type === 'basic' && auth.basicUser) {
    const encoded = btoa(`${substituteVars(auth.basicUser, env)}:${substituteVars(auth.basicPass || '', env)}`);
    reqHeaders['Authorization'] = `Basic ${encoded}`;
  }

  // Body
  let body: string | FormData | undefined;
  if (method !== 'GET') {
    if (bodyType === 'json' && bodyContent.trim()) {
      reqHeaders['Content-Type'] = reqHeaders['Content-Type'] || 'application/json';
      body = substituteVars(bodyContent, env);
    } else if (bodyType === 'form-data' && bodyContent.trim()) {
      try {
        const parsed = JSON.parse(substituteVars(bodyContent, env));
        const formData = new FormData();
        Object.entries(parsed).forEach(([k, v]) => formData.append(k, String(v)));
        body = formData;
      } catch {
        body = substituteVars(bodyContent, env);
      }
    } else if (bodyType === 'raw' && bodyContent.trim()) {
      body = substituteVars(bodyContent, env);
    }
  }

  const start = performance.now();

  const res = await fetch(url, {
    method,
    headers: reqHeaders,
    body,
  });

  const duration = Math.round(performance.now() - start);
  const text = await res.text();
  const size = new Blob([text]).size;

  const resHeaders: Record<string, string> = {};
  res.headers.forEach((v, k) => {
    resHeaders[k] = v;
  });

  return {
    status: res.status,
    statusText: res.statusText,
    headers: resHeaders,
    body: text,
    duration,
    size,
  };
}

export function toCurl(opts: {
  method: HttpMethod;
  url: string;
  params: KeyValuePair[];
  headers: KeyValuePair[];
  bodyType: BodyType;
  bodyContent: string;
  auth: AuthConfig;
}): string {
  const { method, params, headers, bodyType, bodyContent, auth } = opts;
  let url = opts.url;

  const activeParams = params.filter((p) => p.enabled && p.key);
  if (activeParams.length) {
    const sp = new URLSearchParams();
    activeParams.forEach((p) => sp.append(p.key, p.value));
    url += (url.includes('?') ? '&' : '?') + sp.toString();
  }

  const parts = [`curl -X ${method} '${url}'`];

  headers
    .filter((h) => h.enabled && h.key)
    .forEach((h) => parts.push(`-H '${h.key}: ${h.value}'`));

  if (auth.type === 'bearer' && auth.bearer) {
    parts.push(`-H 'Authorization: Bearer ${auth.bearer}'`);
  } else if (auth.type === 'basic' && auth.basicUser) {
    parts.push(`-u '${auth.basicUser}:${auth.basicPass || ''}'`);
  }

  if (method !== 'GET' && bodyContent.trim()) {
    if (bodyType === 'json') {
      parts.push(`-H 'Content-Type: application/json'`);
      parts.push(`-d '${bodyContent}'`);
    } else {
      parts.push(`-d '${bodyContent}'`);
    }
  }

  return parts.join(' \\\n  ');
}
