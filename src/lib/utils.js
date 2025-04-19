export const constructMediaUrl = (relativePath) => {
  if (!relativePath) return null;
  const normalizedPath = relativePath.replace(/\\/g, '.');
  return `http://localhost:3000/media/${normalizedPath}`;
};

export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};