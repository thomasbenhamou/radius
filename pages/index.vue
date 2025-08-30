<template>
  <v-card class="mx-auto" max-width="600">
    <v-card-title class="text-h4 text-center pa-6">
      Welcome to Radius
    </v-card-title>
    
    <v-card-text class="text-center">
      <v-avatar v-if="isAuthenticated" size="120" class="mb-4">
        <v-img :src="user?.picture" />
      </v-avatar>
      
      <div v-if="isAuthenticated" class="text-h6 mb-2">
        Hello, {{ user?.name }}!
      </div>
      
      <div v-else class="text-body-1">
        Please sign in to get started
      </div>
    </v-card-text>
    
    <v-card-actions class="justify-center pb-6">
      <v-btn
        v-if="!isAuthenticated"
        color="primary"
        size="large"
        @click="signIn"
      >
        Sign In with Google
      </v-btn>
      
      <v-btn
        v-else
        color="secondary"
        size="large"
        @click="signOut"
      >
        Sign Out
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
const { user, isAuthenticated, signIn, signOut } = useAuth()
</script>
