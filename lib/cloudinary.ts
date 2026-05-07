import { v2 as cloudinary } from 'cloudinary';

function isPlaceholder(value: string | undefined) {
  if (!value) return true;
  return value.startsWith('your-');
}

export function hasCloudinaryConfig() {
  return !isPlaceholder(process.env.CLOUDINARY_CLOUD_NAME)
    && !isPlaceholder(process.env.CLOUDINARY_API_KEY)
    && !isPlaceholder(process.env.CLOUDINARY_API_SECRET);
}

export function getCloudinaryConfigError() {
  return 'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.';
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? 'markui_uploads';
export const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';

export function getOptimizedUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  quality?: number | 'auto';
  format?: string;
}) {
  const { width, height, quality = 'auto', format = 'auto' } = options ?? {};
  const transforms = [`q_${quality}`, `f_${format}`];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`, 'c_fill');

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms.join(',')}/${publicId}`;
}
