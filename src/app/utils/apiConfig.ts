export function getApiUrl(): string {
  // In production or when accessed via IP, use the same host as the frontend
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = 5000;
    
    // If accessing via localhost, use localhost for API
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//localhost:${port}`;
    }
    
    // If accessing via IP (like from mobile), use the same IP for API
    return `${protocol}//${hostname}:${port}`;
  }
  
  return 'http://localhost:5000';
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${getApiUrl()}/api/health`, {
      method: 'GET',
      timeout: 5000
    });
    return response.ok;
  } catch (err) {
    return false;
  }
}
