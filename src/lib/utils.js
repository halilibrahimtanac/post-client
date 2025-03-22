export const constructMediaUrl = (relativePath) => {
    if (!relativePath) return null;
    const normalizedPath = relativePath.replace(/\\/g, '.');
    return `http://localhost:3000/media/${normalizedPath}`;
  };