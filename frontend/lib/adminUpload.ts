import { adminAuthHeaders, adminFetch, handleAdminSessionExpired, parseApiError } from '@/lib/adminApi';

export const ADMIN_MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB
export const ADMIN_MAX_VIDEO_UPLOAD_BYTES = 50 * 1024 * 1024; // 50MB

const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const ALLOWED_VIDEO_MIME_TYPES = new Set(['video/mp4', 'video/webm']);

export function validateAdminImageFile(file: File): string | null {
  if (!ALLOWED_UPLOAD_MIME_TYPES.has(file.type)) {
    return 'Unsupported file type. Please upload JPG, PNG, WEBP, or GIF.';
  }
  if (file.size > ADMIN_MAX_UPLOAD_BYTES) {
    return `File too large. Maximum allowed size is ${Math.floor(ADMIN_MAX_UPLOAD_BYTES / (1024 * 1024))}MB.`;
  }
  return null;
}

export function validateAdminVideoFile(file: File): string | null {
  if (!ALLOWED_VIDEO_MIME_TYPES.has(file.type)) {
    return 'Unsupported file type. Please upload MP4 or WebM.';
  }
  if (file.size > ADMIN_MAX_VIDEO_UPLOAD_BYTES) {
    return `File too large. Maximum allowed size is ${Math.floor(ADMIN_MAX_VIDEO_UPLOAD_BYTES / (1024 * 1024))}MB.`;
  }
  return null;
}

export async function uploadAdminImage(file: File): Promise<string> {
  const validationError = validateAdminImageFile(file);
  if (validationError) throw new Error(validationError);

  const formData = new FormData();
  formData.append('image', file);

  const res = await adminFetch('/api/upload', {
    method: 'POST',
    headers: adminAuthHeaders(),
    body: formData,
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Upload failed.', { onAuthError: handleAdminSessionExpired }));
  }

  const data = await res.json();
  const url = typeof data?.url === 'string' ? data.url.trim() : '';
  if (!url) throw new Error('Upload completed but no media URL was returned.');
  return url;
}

export async function uploadAdminVideo(file: File): Promise<string> {
  const validationError = validateAdminVideoFile(file);
  if (validationError) throw new Error(validationError);

  const formData = new FormData();
  formData.append('video', file);

  const res = await adminFetch('/api/upload-video', {
    method: 'POST',
    headers: adminAuthHeaders(),
    body: formData,
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res, 'Upload failed.', { onAuthError: handleAdminSessionExpired }));
  }

  const data = await res.json();
  const url = typeof data?.url === 'string' ? data.url.trim() : '';
  if (!url) throw new Error('Upload completed but no media URL was returned.');
  return url;
}
