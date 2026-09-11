<template>
  <div class="management-view">
    <header>
      <p class="eyebrow">Administration</p>
      <h1>Orders</h1>
    </header>
    <main>
      <p v-if="message" class="message message-success">{{ message }}</p>
      <p v-if="error" class="message message-error">{{ error }}</p>

      <section class="card card-wide management-card">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Order register</p>
            <h2>All orders</h2>
          </div>
          <button class="btn" type="button" @click="listOrders" :disabled="listAction.loading.value">Refresh</button>
        </div>
        <ul v-if="orders.length" class="list">
          <li v-for="order in orders" :key="order.id" class="list-item">
            <div class="record-summary">
              <strong>Product #{{ order.productId }}</strong>
              <span>#{{ order.id }} · User #{{ order.userId }} · {{ order.quantity }} items · {{ orderStatus.toString(order.status) }}</span>
            </div>
            <span class="form-actions">
              <button class="btn btn-icon" type="button" @click="getOrder(order.id)"><IconView /><span class="sr-only">View</span></button>
              <button class="btn btn-icon" type="button" @click="editOrder(order)"><IconEdit /><span class="sr-only">Edit</span></button>
              <button class="btn btn-icon btn-danger" type="button" @click="deleteOrder(order.id)"><IconDelete /><span class="sr-only">Delete</span></button>
            </span>
          </li>
        </ul>
        <p v-else class="empty-state">No orders found.</p>
      </section>

      <section class="card card-wide management-card">
        <div class="section-heading">
          <div>
            <p class="eyebrow">User orders</p>
            <h2>Filter by user</h2>
          </div>
        </div>
        <form class="filter-form" @submit.prevent="listUserOrders">
          <div class="form-group">
            <label for="filter-user">User</label>
            <select id="filter-user" v-model="filterUserId" required>
              <option disabled value="">Select a user</option>
              <option v-for="user in users" :key="user.id" :value="String(user.id)">{{ user.name }} (#{{ user.id }})</option>
            </select>
          </div>
          <button class="btn btn-primary" type="submit" :disabled="userOrdersAction.loading.value">Load orders</button>
        </form>
        <ul v-if="userOrders.length" class="list">
          <li v-for="order in userOrders" :key="order.id" class="list-item">
            <div class="record-summary">
              <strong>Product #{{ order.productId }}</strong>
              <span>#{{ order.id }} · {{ order.quantity }} items · {{ orderStatus.toString(order.status) }}</span>
            </div>
            <button class="btn btn-icon" type="button" @click="getOrder(order.id)"><IconView /><span class="sr-only">View</span></button>
          </li>
        </ul>
        <p v-else-if="userOrdersLoaded" class="empty-state">This user has no orders.</p>
      </section>

      <section class="card card-wide management-card">
        <div class="section-heading">
          <div>
            <p class="eyebrow">{{ editingOrderId ? 'Edit order' : 'New order' }}</p>
            <h2>{{ editingOrderId ? 'Update order' : 'Create order' }}</h2>
          </div>
          <button v-if="editingOrderId" class="btn" type="button" @click="resetForm">Cancel</button>
        </div>
        <form class="management-form" @submit.prevent="saveOrder">
          <div class="form-group">
            <label for="order-user">User</label>
            <select id="order-user" v-model.number="orderForm.userId" required>
              <option disabled value="">Select a user</option>
              <option v-for="user in users" :key="user.id" :value="Number(user.id)">{{ user.name }} (#{{ user.id }})</option>
            </select>
          </div>
          <div class="form-group">
            <label for="order-product">Product ID</label>
            <input id="order-product" v-model.number="orderForm.productId" type="number" min="1" required />
          </div>
          <div class="form-group">
            <label for="order-quantity">Quantity</label>
            <input id="order-quantity" v-model.number="orderForm.quantity" type="number" min="1" required />
          </div>
          <div class="form-group">
            <label for="order-total-price">Total price</label>
            <input id="order-total-price" v-model.number="orderForm.totalPrice" type="number" min="0" step="0.01" required />
          </div>
          <div class="form-group" v-if="editingOrderId">
            <label for="order-status">Status</label>
            <select id="order-status" v-model.number="orderForm.status" required>
              <option v-for="status in Object.keys(orderStatus)" :key="status" :value="orderStatus[status]">{{ orderStatus.toString(orderStatus[status]) }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="order-delivery-date">Delivery date</label>
            <input id="order-delivery-date" v-model="orderForm.deliveryDate" type="date" required />
          </div>
          <button class="btn btn-primary" type="submit" :disabled="saveAction.loading.value">{{ editingOrderId ? 'Save changes' : 'Create order' }}</button>
        </form>
      </section>

      <section v-if="selectedOrder" class="card card-wide">
        <h2>Order details</h2>
        <dl class="profile-details">
          <div><dt>User</dt><dd>#{{ selectedOrder.userId }}</dd></div>
          <div><dt>Product</dt><dd>#{{ selectedOrder.productId }}</dd></div>
          <div><dt>Quantity</dt><dd>{{ selectedOrder.quantity }}</dd></div>
          <div><dt>Total price</dt><dd>{{ selectedOrder.totalPrice }}</dd></div>
          <div><dt>Status</dt><dd>{{ orderStatus.toString(selectedOrder.status) }}</dd></div>
          <div><dt>Delivery date</dt><dd>{{ formatDate(selectedOrder.deliveryDate) }}</dd></div>
        </dl>
      </section>
    </main>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import api from '@api/api.js'
import { useAsyncAction } from '@composables/useAsyncAction.js'
import { orderStatus } from '#shared/orders.js'
import IconView from '@components/icons/IconView.vue'
import IconEdit from '@components/icons/IconEdit.vue'
import IconDelete from '@components/icons/IconDelete.vue'

const orders = ref([])
const users = ref([])
const userOrders = ref([])
const selectedOrder = ref(null)
const editingOrderId = ref(null)
const filterUserId = ref('')
const userOrdersLoaded = ref(false)
const message = ref('')
const error = ref('')
const emptyOrderForm = () => ({ userId: '', productId: '', quantity: 1, totalPrice: 0, status: orderStatus.default(), deliveryDate: '' })
const orderForm = reactive(emptyOrderForm())

const listAction = useAsyncAction()
const getAction = useAsyncAction()
const userOrdersAction = useAsyncAction()
const saveAction = useAsyncAction()
const deleteAction = useAsyncAction()

const showError = (action) => {
  error.value = action.error.value
}

const listOrders = async () => {
  const { success, result } = await listAction.run(api.orders.list)
  if (success) orders.value = result.orders
  else showError(listAction)
}

const loadUsers = async () => {
  const result = await api.users.list()
  users.value = result.users
}

const listUserOrders = async () => {
  const { success, result } = await userOrdersAction.run(api.users.orders, filterUserId.value)
  if (success) {
    userOrders.value = result.orders
    userOrdersLoaded.value = true
  } else showError(userOrdersAction)
}

const getOrder = async (id) => {
  const { success, result } = await getAction.run(api.orders.get, id)
  if (success) selectedOrder.value = result.order
  else showError(getAction)
}

const resetForm = () => {
  editingOrderId.value = null
  Object.assign(orderForm, emptyOrderForm())
}

const editOrder = (order) => {
  editingOrderId.value = order.id
  Object.assign(orderForm, {
    userId: Number(order.userId),
    productId: Number(order.productId),
    quantity: Number(order.quantity),
    totalPrice: Number(order.totalPrice),
    status: Number(order.status),
    deliveryDate: order.deliveryDate?.slice(0, 10) ?? ''
  })
}

const saveOrder = async () => {
  const action = editingOrderId.value ? api.orders.update : api.orders.create
  const argumentsForAction = editingOrderId.value
    ? [editingOrderId.value, { ...orderForm }]
    : [{ ...orderForm }]
  const { success } = await saveAction.run(action, ...argumentsForAction)
  if (success) {
    message.value = editingOrderId.value ? 'Order updated.' : 'Order created.'
    resetForm()
    await listOrders()
    if (filterUserId.value) await listUserOrders()
  } else showError(saveAction)
}

const deleteOrder = async (id) => {
  if (!window.confirm('Delete this order?')) return
  const { success } = await deleteAction.run(api.orders.remove, id)
  if (success) {
    if (selectedOrder.value?.id === id) selectedOrder.value = null
    message.value = 'Order deleted.'
    await listOrders()
    if (filterUserId.value) await listUserOrders()
  } else showError(deleteAction)
}

const formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'Not set'

onMounted(async () => {
  await Promise.all([listOrders(), loadUsers()])
})
</script>