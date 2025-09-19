export const BACKEND_ORIGIN = 'https://techbuilders-backend.onrender.com'


const LOCAL_PLACEHOLDER = '/file.svg'

export function normalizeImageUrl(src?: string | null) {
  // If src is missing or not a primitive string, return the local placeholder
  if (!src || typeof src !== 'string') return LOCAL_PLACEHOLDER;

  try {
    const u = new URL(src);
    return u.href;
  } catch (e) {
    // src may be a relative path like '/media/foo.png' or 'media/foo.png'
    if (src.startsWith('/')) return `${BACKEND_ORIGIN}${src}`;
    return `${BACKEND_ORIGIN}/${src}`;
  }
}
