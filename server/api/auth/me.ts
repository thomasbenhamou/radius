export default defineEventHandler(async (event) => {
  const sessionCookie = getCookie(event, 'user_session')
  
  if (!sessionCookie) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated'
    })
  }
  
  try {
    const session = JSON.parse(sessionCookie)
    
    // Check if session is expired
    if (new Date(session.expires) < new Date()) {
      deleteCookie(event, 'user_session')
      throw createError({
        statusCode: 401,
        statusMessage: 'Session expired'
      })
    }
    
    return { user: session.user }
  } catch (error) {
    deleteCookie(event, 'user_session')
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid session'
    })
  }
})
