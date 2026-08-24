<template>
  <div class="management-view">
    <header>
      <p class="eyebrow">User dashboard</p>
      <h1>{{ user?.name ?? 'User' }}</h1>
    </header>
    <main>
      <p v-if="error" class="message message-error">{{ error }}</p>

      <section v-if="user" class="card card-wide management-card">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Account</p>
            <h2>Profile</h2>
          </div>
          <button class="btn" type="button" @click="navigation.goToUsers">Back to users</button>
        </div>
        <dl class="profile-details">
          <div><dt>ID</dt><dd>#{{ user.id }}</dd></div>
          <div><dt>Name</dt><dd>{{ user.name }}</dd></div>
          <div><dt>Email</dt><dd>{{ user.email }}</dd></div>
          <div><dt>Role</dt><dd>{{ user.role }}</dd></div>
        </dl>
      </section>

      <section class="card card-wide management-card">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Purchase history</p>
            <h2>Orders</h2>
          </div>
          <button class="btn" type="button" @click="loadDashboard" :disabled="loading">Refresh</button>
        </div>
        <ul v-if="orders.length" class="list">
          <li v-for="order in orders" :key="order.id" class="list-item">
            <div class="record-summary">
              <strong>Product #{{ order.productId }}</strong>
              <span>#{{ order.id }} · {{ order.quantity }} items · {{ formatStatus(order.status) }}</span>
            </div>
            <span class="record-summary">
              <strong>{{ formatPrice(order.totalPrice) }}</strong>
              <span>Delivery {{ formatDate(order.deliveryDate) }}</span>
            </span>
          </li>
        </ul>
        <p v-else-if="!loading" class="empty-state">This user has no orders.</p>
        <p v-else class="empty-state">Loading dashboard...</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '../assets/scripts/api.js'
import navigation from '../assets/scripts/navigation.js'

const route = useRoute()
const user = ref(null)
const orders = ref([])
const error = ref('')
const loading = ref(false)

const loadDashboard = async () => {
  loading.value = true
  error.value = ''
  const userId = route.params.id

  try {
    const [userResult, ordersResult] = await Promise.all([
      api.users.get(userId),
      api.users.orders(userId)
    ])
    user.value = userResult.user
    orders.value = ordersResult.orders
  } catch (loadError) {
    user.value = null
    orders.value = []
    error.value = loadError.message || 'Unable to load the user dashboard.'
  } finally {
    loading.value = false
  }
}

const formatStatus = (status) => [
  'Pending', 'Confirmed', 'In progress', 'Completed', 'Canceled', 'Failed'
][Number(status)] ?? 'Unknown'
const formatPrice = (price) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(price) || 0)
const formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'Not set'

watch(() => route.params.id, loadDashboard, { immediate: true })
</script>