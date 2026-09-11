<template>
  <div id="logout-view">
    <main class="auth-card" id="logout-page" aria-live="polite">
      <section class="card">
        <h1>Signing you out</h1>
        <p id="logout-message">{{ message }}</p>
      </section>
    </main>
  </div>
</template>
<script setup>

import api from '@api/api.js'
import router from '@router/router.js'
import { ref } from 'vue';

const message = ref("Removing your session...");

const redirectTimeout = 500; // Should be 5000

const redirectToLogin = () => {
  setTimeout(() => {
    router.push("/login");
  }, redirectTimeout);
};

api.auth.logout()
  .then(() => {
    message.value = "You have been signed out. Redirecting to login...";
    redirectToLogin();
  })
  .catch(() => {
    message.value = "Your local session was removed. Redirecting to login...";
    redirectToLogin();
  });
</script>