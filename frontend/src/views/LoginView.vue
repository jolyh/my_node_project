<template>
  <div id="login-view">
    <header>
      <h1>My Node Project</h1>
    </header>
    <main id="app">
      <section class="card auth-card">
        <div class="auth-heading">
          <p class="eyebrow">My Node Project</p>
          <h1>{{ mode === MODE.LOGIN ? "Welcome back" : "Create your account" }}</h1>
          <p class="auth-description">{{ mode === MODE.LOGIN ? "Sign in to continue." : "Join the project with a few details." }}</p>
        </div>
        <div class="auth-switch" role="tablist" aria-label="Account access">
          <button type="button" class="auth-switch-button" :class="{ active: mode === MODE.LOGIN }"
            @click="switchMode(MODE.LOGIN)" role="tab" :aria-selected="mode === MODE.LOGIN">Log in</button>
          <button type="button" class="auth-switch-button" :class="{ active: mode === MODE.SIGNUP }"
            @click="switchMode(MODE.SIGNUP)" role="tab" :aria-selected="mode === MODE.SIGNUP">Sign up</button>
        </div>
        <form v-if="mode === MODE.LOGIN" @submit.prevent="login">
          <div class="form-group">
            <label for="login-email">Email</label>
            <input id="login-email" type="email" v-model="loginData.email" placeholder="you@example.com" autocomplete="email"
              required />
          </div>
          <div class="form-group">
            <label for="login-password">Password</label>
            <div class="password-field">
              <input id="login-password" :type="showLoginPassword ? 'text' : 'password'" v-model="loginData.password"
                minlength="8" autocomplete="current-password" required />
              <button type="button" class="password-toggle" @click="showLoginPassword = !showLoginPassword"
                :aria-label="showLoginPassword ? 'Hide password' : 'Show password'">{{ showLoginPassword ?
                  "Hide" : "Show" }}</button>
            </div>
          </div>
          <p v-if="loginAction.error.value" class="message message-error">{{ loginAction.error.value }}</p>
          <button type="submit" class="btn btn-primary btn-block" :disabled="loginAction.loading.value">Log in</button>
        </form>
        <form v-else-if="mode === MODE.SIGNUP" @submit.prevent="signup">
          <div class="form-group">
            <label for="signup-name">Name</label>
            <input id="signup-name" type="text" v-model="signupData.name" placeholder="Your name" autocomplete="name"
              required />
          </div>
          <div class="form-group">
            <label for="signup-email">Email</label>
            <input id="signup-email" type="email" v-model="signupData.email" placeholder="you@example.com"
              autocomplete="email" required />
          </div>
          <div class="form-group">
            <label for="signup-password">Password</label>
            <div class="password-field">
              <input id="signup-password" :type="showSignupPassword ? 'text' : 'password'" v-model="signupData.password"
                minlength="8" autocomplete="new-password" required />
              <button type="button" class="password-toggle" @click="showSignupPassword = !showSignupPassword"
                :aria-label="showSignupPassword ? 'Hide password' : 'Show password'">{{ showSignupPassword ?
                  "Hide" : "Show" }}</button>
            </div>
          </div>
          <p v-if="signupAction.error.value" class="message message-error">{{ signupAction.error.value }}</p>
          <p v-if="signupSuccess" class="message message-success">{{ signupSuccess }}</p>
          <button type="submit" class="btn btn-primary btn-block" :disabled="signupAction.loading.value">Create account</button>
        </form>
      </section>
    </main>
    <footer>
      <button type="button" class="btn btn-secondary btn-quick-login" @click="quickLogin">Quick Login</button>
      <button type="button" class="btn btn-secondary btn-quick-signup" @click="quickCreateAccount">Quick Create Account</button>
      <p>&copy; 2024 My Node Project. All rights reserved.</p>
    </footer>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

import api from '../assets/scripts/api.js'
import session from '../assets/scripts/session.js'
import navigation from '../assets/scripts/navigation.js'
import { useAsyncAction } from '../composables/useAsyncAction.js'

if (session.token.get() !== null) navigation.goToUsers();

const MODE = {
  LOGIN : "login",
  SIGNUP : "signup"
}

const loginData = reactive({
  email: "",
  password: ""
});

const signupData = reactive({
  name: "",
  email: "",
  password: ""
});

const clearSignupData = () => {
  signupData.name = "";
  signupData.email = "";
  signupData.password = "";
};

const mode = ref(MODE.LOGIN)
const showLoginPassword = ref(false)
const showSignupPassword = ref(false)
const signupSuccess = ref("")

const loginAction = useAsyncAction()
const signupAction = useAsyncAction()

const quickLogin = async () => {
  loginData.email = "toto@example.com";
  loginData.password = "toto1234";
  await login(); 
};

const quickCreateAccount = async () => {
  signupData.name = "Toto";
  signupData.email = "toto@example.com";
  signupData.password = "toto1234";
  signupData.role = "admin";
  await signup();
};

const login = async () => {
  const { success } = await loginAction.run(api.auth.login, loginData.email, loginData.password);
  if (success) navigation.goToUsers();
};

const signup = async () => {
  const { success } = await signupAction.run(api.auth.signup, signupData.name, signupData.email, signupData.password);
  if (success) {
    signupSuccess.value = "Account created successfully. You can now log in.";
    clearSignupData();
  }
};

const switchMode = (newMode) => {
  mode.value = newMode;
  loginAction.clear();
  signupAction.clear();
  signupSuccess.value = "";
};
</script>