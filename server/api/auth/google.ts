export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  
  if (method === 'GET') {
    // Generate Google OAuth URL
    const clientId = process.env.GOOGLE_CLIENT_ID
    const redirectUri = 'http://localhost:3000/api/auth/google/callback'
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent('openid email profile')}&` +
      `access_type=offline`
    
    return sendRedirect(event, authUrl)
  }
})
