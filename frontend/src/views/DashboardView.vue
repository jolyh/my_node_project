<template>
    <div class="dashboard-view" style="display:flex ; flex-direction: row; gap: 20px;">
        <UsersView style="flex: 1;" />
        <OrdersView style="flex: 2;" />
    </div>
</template>
<script setup>
import UsersView from './UsersView.vue'
import OrdersView from './OrdersView.vue'


</script>