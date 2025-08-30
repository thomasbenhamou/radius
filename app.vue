<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>Radius App</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!isAuthenticated" @click="signIn" color="primary">
        Sign In with Google
      </v-btn>
      <v-btn v-else @click="signOut" color="secondary">
        Sign Out
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <NuxtPage />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
const { isAuthenticated, signIn, signOut } = useAuth()
</script>
