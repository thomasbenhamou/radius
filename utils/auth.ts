
export const useAuth = () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)
  
  const signIn = () => {
    // Redirect to our Google OAuth endpoint
    window.location.href = '/api/auth/google'
  }
  
  const signOut = () => {
    // Clear session cookie
    document.cookie = 'user_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    user.value = null
  }
  
  const checkAuth = async () => {
    try {
      const response = await $fetch('/api/auth/me')
      user.value = response.user
    } catch (error) {
      user.value = null
    }
  }
  
  // Check auth on mount
  onMounted(() => {
    checkAuth()
  })
  
  return {
    user: readonly(user),
    isAuthenticated,
    signIn,
    signOut,
    checkAuth
  }
}

