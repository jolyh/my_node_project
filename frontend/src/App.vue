<template>
  <div id="layout">
    <!-- This navigation menu stays visible on every page -->
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/users">Manage Users</router-link> |
      <router-link to="/orders">Manage Orders</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/logout">Logout</router-link>
    </nav>

    <!-- Vue Router dynamically swaps out components right here -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<style src="./assets/css/global.css"></style>