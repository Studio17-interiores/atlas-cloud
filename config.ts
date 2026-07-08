export function normalizeSupabaseUrl(value: string | undefined) {
  if (!value) {
    return "";
  }

  const trimmed = value.trim().replace(/^["']|["']$/g, "");
  const supabaseUrlMatch = trimmed.match(/https:\/\/[a-z0-9-]+\.supabase\.co/i)?.[0];

  if (supabaseUrlMatch) {
    return supabaseUrlMatch;
  }

  if (/^[a-z0-9]{20}$/i.test(trimmed)) {
    return `https://${trimmed}.supabase.co`;
  }

  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    const dashboardProjectRef = url.pathname.match(/\/project\/([a-z0-9]{20})/i)?.[1];

    if (dashboardProjectRef) {
      return `https://${dashboardProjectRef}.supabase.co`;
    }

    if (url.hostname.endsWith(".supabase.co")) {
      return `${url.protocol}//${url.hostname}`;
    }

    return trimmed;
  } catch {
    return trimmed;
  }
}

export function getSupabaseConfig() {
  return {
    url: normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: normalizeSupabaseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  };
}

export function normalizeSupabaseKey(value: string | undefined) {
  return value?.trim().replace(/^["']|["']$/g, "") ?? "";
}

export function describeSupabaseConfig() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const rawAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const normalizedUrl = normalizeSupabaseUrl(rawUrl);
  const normalizedAnonKey = normalizeSupabaseKey(rawAnonKey);

  return {
    hasRawUrl: Boolean(rawUrl),
    normalizedUrl,
    urlLooksCorrect: /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(normalizedUrl),
    authEndpoint: normalizedUrl ? `${normalizedUrl}/auth/v1/token?grant_type=password` : "",
    hasAnonKey: Boolean(normalizedAnonKey),
    anonKeyPrefix: normalizedAnonKey.slice(0, 12),
    anonKeyLooksJwt: normalizedAnonKey.startsWith("eyJ"),
    anonKeyLooksPublishable: normalizedAnonKey.startsWith("sb_publishable_"),
    hasServiceRoleKey: Boolean(serviceRoleKey.trim()),
    appUrl,
    appUrlLooksCorrect: appUrl.startsWith("https://")
  };
}
