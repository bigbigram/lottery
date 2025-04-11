export function validateEnv() {
  const required = [
    'VITE_BASE_URL',
    'VITE_API_URL',
    'VITE_RAZORPAY_KEY'
  ];

  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate URL format
  try {
    new URL(import.meta.env.VITE_API_URL);
    new URL(import.meta.env.VITE_BASE_URL);
  } catch {
    throw new Error('Invalid URL format in environment variables');
  }
}
