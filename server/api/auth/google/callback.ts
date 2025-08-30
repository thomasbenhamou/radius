export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { code } = query
  
  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Authorization code required'
    })
  }
  
  try {
    // Exchange code for tokens
    const tokenResponse = await $fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000/api/auth/google/callback'
      }
    })
    
    // Get user info
    const userResponse = await $fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`
      }
    })
    
    // Set session cookie
    setCookie(event, 'user_session', JSON.stringify({
      user: userResponse,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    }), {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 hours
    })
    
    // Redirect to home page
    return sendRedirect(event, '/?auth=success')
    
  } catch (error) {
    console.error('Auth error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Authentication failed'
    })
  }
})
