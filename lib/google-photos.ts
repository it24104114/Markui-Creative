import type { ProjectDriveAsset } from '@/lib/project-content';

const GOOGLE_PHOTO_URL_PATTERN = /^https:\/\/lh3\.googleusercontent\.com\/[A-Za-z0-9_\-./=:%?&+,;~]+$/;
const BLOCKED_GOOGLE_PHOTO_SEGMENTS = ['/a-/', '/proxy/', '/ogw/'];
const BLOCKED_GOOGLE_PHOTO_SIZE_HINTS = /(=s(16|24|32|40|48|64|72|96)(-c)?$)/i;

function decodeGooglePhotosPayload(input: string) {
  return input
    .replace(/\\u003d/g, '=')
    .replace(/\\u0026/g, '&')
    .replace(/\\\//g, '/');
}

function normalizeGooglePhotoAssetUrl(url: string) {
  const trimmed = url.split(/["'<\s]/)[0]?.trim();
  if (!trimmed) return null;

  return trimmed.includes('=') ? trimmed : `${trimmed}=w1600-h1600-no`;
}

function toCanonicalGooglePhotoUrl(url: string) {
  const [base] = url.split('=');
  return base;
}

function isGooglePhotoCandidateUrl(url: string) {
  if (!GOOGLE_PHOTO_URL_PATTERN.test(url)) {
    return false;
  }

  if (BLOCKED_GOOGLE_PHOTO_SEGMENTS.some((segment) => url.includes(segment))) {
    return false;
  }

  return !BLOCKED_GOOGLE_PHOTO_SIZE_HINTS.test(url);
}

export async function listGooglePhotosSharedImages(sharedUrl: string): Promise<ProjectDriveAsset[]> {
  const response = await fetch(sharedUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    },
    redirect: 'follow',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Google Photos link could not be loaded');
  }

  const html = decodeGooglePhotosPayload(await response.text());
  const matches = html.match(/https:\/\/lh3\.googleusercontent\.com\/[A-Za-z0-9_\-./=:%?&+,;~]+/g) ?? [];
  const uniqueUrls = Array.from(new Set(matches))
    .map((url) => normalizeGooglePhotoAssetUrl(url))
    .filter((url): url is string => !!url)
    .filter((url) => isGooglePhotoCandidateUrl(url));

  const dedupedUrls = Array.from(new Map(uniqueUrls.map((url) => [toCanonicalGooglePhotoUrl(url), url])).values());

  if (dedupedUrls.length === 0) {
    throw new Error('No public images were found in this Google Photos link');
  }

  return dedupedUrls.slice(0, 120).map((url, index) => ({
    id: `google-photo-${index + 1}`,
    url,
    thumbnailUrl: url,
    name: `Google Photo ${index + 1}`,
  }));
}