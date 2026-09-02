<style src="./assets/css/global.css"></style>

<template>
  <div id="layout">
    <!-- This navigation menu stays visible on every page -->
    <app-header />

    <!-- Vue Router dynamically swaps out components right here -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';

</script>

