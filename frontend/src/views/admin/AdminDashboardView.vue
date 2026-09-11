<template>
    <div class="dashboard-view" style="display:flex ; flex-direction: column; gap: 20px;">
        <UsersView style="flex: 1;" />
        <OrdersView style="flex: 1;" />
        <TasksView style="flex: 1;" />
    </div>
</template>
<script setup>
// TODO - content to adjust based on role
import UsersView from '@views/users/UsersView.vue'
import OrdersView from '@views/orders/OrdersView.vue'
import TasksView from '@views/tasks/TasksView.vue'


</script>