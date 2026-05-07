export const PROJECT_ORIENTATIONS = ['LANDSCAPE', 'PORTRAIT', 'SQUARE'] as const;
export const PROJECT_CONTENT_TYPES = ['REEL', 'POST', 'CAROUSEL', 'CAMPAIGN'] as const;
export const DRIVE_SYNC_STATUSES = ['IDLE', 'SYNCING', 'READY', 'ERROR'] as const;
export const SOCIAL_PLATFORMS = ['youtube', 'instagram', 'tiktok', 'facebook'] as const;
export const DEFAULT_PROJECT_DESCRIPTION = 'Project details coming soon.';
export const DEFAULT_PROJECT_COVER_IMAGE = 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1600&q=80&auto=format&fit=crop';

export type ProjectOrientationValue = (typeof PROJECT_ORIENTATIONS)[number];
export type ProjectContentTypeValue = (typeof PROJECT_CONTENT_TYPES)[number];
export type DriveSyncStatusValue = (typeof DRIVE_SYNC_STATUSES)[number];
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export interface ProjectSocialEmbeds {
  youtube: string[];
  instagram: string[];
  tiktok: string[];
  facebook: string[];
}

export interface ProjectDriveAsset {
  id: string;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  name?: string;
  mimeType?: string;
  webViewLink?: string;
}

export interface ResolvedSocialEmbed {
  platform: SocialPlatform;
  url: string;
  embedUrl: string;
}

const emptySocialEmbedsValue: ProjectSocialEmbeds = {
  youtube: [],
  instagram: [],
  tiktok: [],
  facebook: [],
};

export function emptySocialEmbeds(): ProjectSocialEmbeds {
  return {
    youtube: [],
    instagram: [],
    tiktok: [],
    facebook: [],
  };
}

function normalizeUrlArray(input: unknown): string[] {
  if (!Array.isArray(input)) return [];

  return input
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.trim())
    .filter(Boolean);
}

export function normalizeSocialEmbeds(input: unknown): ProjectSocialEmbeds {
  if (!input || typeof input !== 'object') {
    return emptySocialEmbeds();
  }

  const source = input as Partial<Record<SocialPlatform, unknown>>;

  return {
    youtube: normalizeUrlArray(source.youtube),
    instagram: normalizeUrlArray(source.instagram),
    tiktok: normalizeUrlArray(source.tiktok),
    facebook: normalizeUrlArray(source.facebook),
  };
}

export function normalizeDriveAssets(input: unknown): ProjectDriveAsset[] {
  if (!Array.isArray(input)) return [];

  return input.flatMap((value) => {
    if (!value || typeof value !== 'object') {
      return [];
    }

    const asset = value as Partial<ProjectDriveAsset>;
    if (typeof asset.id !== 'string' || typeof asset.url !== 'string') {
      return [];
    }

    return [{
      id: asset.id,
      url: asset.url,
      thumbnailUrl: typeof asset.thumbnailUrl === 'string' ? asset.thumbnailUrl : undefined,
      width: typeof asset.width === 'number' ? asset.width : undefined,
      height: typeof asset.height === 'number' ? asset.height : undefined,
      name: typeof asset.name === 'string' ? asset.name : undefined,
      mimeType: typeof asset.mimeType === 'string' ? asset.mimeType : undefined,
      webViewLink: typeof asset.webViewLink === 'string' ? asset.webViewLink : undefined,
    }];
  });
}

function safeUrl(url: string): URL | null {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

function resolveYouTubeEmbed(url: string): string | null {
  const parsed = safeUrl(url);
  if (!parsed) return null;

  const host = parsed.hostname.replace(/^www\./, '');
  let videoId: string | null = null;

  if (host === 'youtu.be') {
    videoId = parsed.pathname.split('/').filter(Boolean)[0] ?? null;
  }

  if (!videoId && (host === 'youtube.com' || host === 'm.youtube.com')) {
    if (parsed.pathname === '/watch') {
      videoId = parsed.searchParams.get('v');
    } else {
      const [segment, id] = parsed.pathname.split('/').filter(Boolean);
      if (segment === 'shorts' || segment === 'embed' || segment === 'live') {
        videoId = id ?? null;
      }
    }
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : null;
}

function resolveInstagramEmbed(url: string): string | null {
  const parsed = safeUrl(url);
  if (!parsed) return null;

  const host = parsed.hostname.replace(/^www\./, '');
  if (host !== 'instagram.com') return null;

  const [kind, id] = parsed.pathname.split('/').filter(Boolean);
  if (!kind || !id) return null;
  if (!['p', 'reel', 'reels', 'tv'].includes(kind)) return null;

  const normalizedKind = kind === 'reels' ? 'reel' : kind;
  return `https://www.instagram.com/${normalizedKind}/${id}/embed/captioned/`;
}

function resolveTikTokEmbed(url: string): string | null {
  const parsed = safeUrl(url);
  if (!parsed) return null;

  const host = parsed.hostname.replace(/^www\./, '');
  if (host !== 'tiktok.com' && host !== 'm.tiktok.com') return null;

  const videoMatch = parsed.pathname.match(/\/video\/(\d+)/);
  if (!videoMatch) return null;

  return `https://www.tiktok.com/embed/v2/${videoMatch[1]}`;
}

function resolveFacebookEmbed(url: string): string | null {
  const parsed = safeUrl(url);
  if (!parsed) return null;

  const host = parsed.hostname.replace(/^www\./, '');
  if (!['facebook.com', 'm.facebook.com', 'fb.watch'].includes(host)) {
    return null;
  }

  return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(parsed.toString())}&show_text=true&width=500`;
}

export function resolveSocialEmbed(platform: SocialPlatform, url: string): ResolvedSocialEmbed | null {
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return null;

  const embedUrl =
    platform === 'youtube'
      ? resolveYouTubeEmbed(trimmedUrl)
      : platform === 'instagram'
        ? resolveInstagramEmbed(trimmedUrl)
        : platform === 'tiktok'
          ? resolveTikTokEmbed(trimmedUrl)
          : resolveFacebookEmbed(trimmedUrl);

  if (!embedUrl) return null;

  return {
    platform,
    url: trimmedUrl,
    embedUrl,
  };
}

export function isSupportedSocialUrl(platform: SocialPlatform, url: string): boolean {
  return !!resolveSocialEmbed(platform, url);
}

export function extractDriveFolderId(url: string): string | null {
  const parsed = safeUrl(url.trim());
  if (!parsed) return null;

  const folderMatch = parsed.pathname.match(/\/folders\/([^/?#]+)/);
  if (folderMatch) {
    return folderMatch[1];
  }

  const queryId = parsed.searchParams.get('id');
  if (queryId) {
    return queryId;
  }

  return null;
}

export function isGooglePhotosUrl(url: string): boolean {
  const parsed = safeUrl(url.trim());
  if (!parsed) return false;

  const host = parsed.hostname.replace(/^www\./, '');
  return host === 'photos.google.com' || host === 'photos.app.goo.gl';
}

export function getGallerySourceType(url: string): 'drive' | 'google-photos' | null {
  if (extractDriveFolderId(url)) {
    return 'drive';
  }

  if (isGooglePhotosUrl(url)) {
    return 'google-photos';
  }

  return null;
}

export function formatProjectContentType(value: ProjectContentTypeValue): string {
  switch (value) {
    case 'REEL':
      return 'Reel';
    case 'POST':
      return 'Post';
    case 'CAROUSEL':
      return 'Carousel';
    case 'CAMPAIGN':
      return 'Campaign';
  }
}

export function formatProjectOrientation(value: ProjectOrientationValue): string {
  switch (value) {
    case 'LANDSCAPE':
      return 'Landscape';
    case 'PORTRAIT':
      return 'Portrait';
    case 'SQUARE':
      return 'Square';
  }
}

export function getProjectAspectRatioClass(
  orientation: ProjectOrientationValue | null | undefined,
  size: 'default' | 'large' | 'small' = 'default',
): string {
  if (orientation === 'PORTRAIT') {
    return size === 'small' ? 'aspect-[4/5]' : 'aspect-[3/4]';
  }

  if (orientation === 'SQUARE') {
    return 'aspect-square';
  }

  return size === 'large' ? 'aspect-[4/3]' : size === 'small' ? 'aspect-[3/2]' : 'aspect-[16/10]';
}

export const EMPTY_SOCIAL_EMBEDS = emptySocialEmbedsValue;