const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export function getImageUrl(imagePath?: string | null): string {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6';
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }

  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`;
  }

  return `${API_BASE_URL}/${imagePath}`;
}
