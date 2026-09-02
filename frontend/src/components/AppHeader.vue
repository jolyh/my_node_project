<template>
    <header class="app-header">
        <div class="app-header__content">
            <router-link class="app-header__brand" to="/" aria-label="My Application home">
                <img class="app-header__logo" src="@/assets/logo.png" alt="" />
                <span>My Application</span>
            </router-link>

            <nav class="app-header__navigation" aria-label="Main navigation">
                <template v-for="route in visibleRoutes" :key="route.name">
                    <router-link :to="route.path">{{ route.label }}</router-link>
                </template>
            </nav>

            <div v-if="isAuthenticated" class="app-header__account">
                <span class="app-header__user">{{ userName }}</span>
                <router-link class="app-header__logout" to="/logout">Log out</router-link>
            </div>
            <div v-else-if="currentRoute.name !== 'Login'" class="app-header__account app-header__navigation">
                <router-link class="app-header__login" to="/login">Log in</router-link>
            </div>
        </div>
    </header>
</template>
<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router/router.js';
import session from '@/stores/session.js';

const routes = router.getRoutes();
const currentRoute = useRoute();

const isAuthenticated = computed(() => session.isAuthenticated());
const userName = computed(() =>
    session.currentUser.get()?.name
    || session.currentUser.get()?.username
    || 'Account'
);

const visibleRoutes = computed(() => routes.filter((route) => {
    return route.meta.showInHeader
        && (!route.meta.requiresAuth || isAuthenticated.value);
}).map((route) => ({
    ...route,
    label: route.name
})));

</script>