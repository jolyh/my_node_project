<template>
  <div class="management-view">
    <header>
      <p class="eyebrow">Administration</p>
      <h1>Users</h1>
    </header>
    <main>
      <p v-if="message" class="message message-success">{{ message }}</p>
      <p v-if="error" class="message message-error">{{ error }}</p>
      <section class="card card-wide management-card">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Directory</p>
            <h2>All users</h2>
          </div>
          <button class="btn" type="button" @click="listUsers" :disabled="listAction.loading.value">Refresh</button>
        </div>
        <ul v-if="users.length" class="list">
          <li class="list-item" v-for="user in users" :key="user.id">
            <div class="record-summary">
              <strong>{{ user.name }}</strong>
              <span>#{{ user.id }} · {{ user.email }}</span>
            </div>
            <span class="form-actions">
              <button class="btn" type="button" @click="navigation.goToUserDetails(user.id)">View</button>
              <button class="btn" type="button" @click="editUser(user)">Edit</button>
              <button class="btn btn-danger" type="button" @click="deleteUser(user.id)">Delete</button>
            </span>
          </li>
        </ul>
        <p v-else class="empty-state">No users found.</p>
      </section>
      <section class="card card-wide management-card">
        <div class="section-heading">
          <div>
            <p class="eyebrow">{{ editingUserId ? 'Edit user' : 'New user' }}</p>
            <h2>{{ editingUserId ? 'Update account' : 'Create account' }}</h2>
          </div>
          <button v-if="editingUserId" class="btn" type="button" @click="resetForm">Cancel</button>
        </div>
        <form class="management-form" @submit.prevent="saveUser">
          <div class="form-group">
            <label for="user-name">Name</label>
            <input id="user-name" v-model.trim="userForm.name" required autocomplete="name" />
          </div>
          <div class="form-group">
            <label for="user-email">Email</label>
            <input id="user-email" v-model.trim="userForm.email" type="email" required autocomplete="email" />
          </div>
          <div class="form-group">
            <label for="user-password">{{ editingUserId ? 'New password' : 'Password' }}</label>
            <input id="user-password" v-model="userForm.password" type="password" minlength="8" :required="!editingUserId" autocomplete="new-password" />
          </div>
          <button class="btn btn-primary" type="submit" :disabled="saveAction.loading.value">{{ editingUserId ? 'Save changes' : 'Create user' }}</button>
        </form>
      </section>
      <section v-if="selectedUser" class="card card-wide">
        <h2>User details</h2>
        <dl class="profile-details">
          <div>
            <dt>Name</dt>
            <dd>{{ selectedUser.name }}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{{ selectedUser.email }}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{{ selectedUser.role }}</dd>
          </div>
        </dl>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../assets/scripts/api.js'
import { useAsyncAction } from '../composables/useAsyncAction.js'
import navigation from '../assets/scripts/navigation.js'
import session from '../assets/scripts/session.js'

if (session.token.get() === null) {
  navigation.goToLogin();
}

const users = ref([])
const selectedUser = ref(null)
const editingUserId = ref(null)
const message = ref('')
const error = ref('')
const userForm = reactive({ name: '', email: '', password: '' })

const listAction = useAsyncAction()
const getAction = useAsyncAction()
const saveAction = useAsyncAction()
const deleteAction = useAsyncAction()

const listUsers = async () => {
  const { success, result } = await listAction.run(api.users.list)
  if (success) users.value = result.users
  else error.value = listAction.error.value
};

const getUser = async (id) => {
  const { success, result } = await getAction.run(api.users.get, id)
  if (success) selectedUser.value = result.user
  else error.value = getAction.error.value
};

const resetForm = () => {
  editingUserId.value = null
  Object.assign(userForm, { name: '', email: '', password: '' })
}

const editUser = (user) => {
  editingUserId.value = user.id
  Object.assign(userForm, { name: user.name, email: user.email, password: '' })
};

const deleteUser = async (id) => {
  if (!window.confirm('Delete this user?')) return
  const { success } = await deleteAction.run(api.users.remove, id)
  if (success) {
    if (selectedUser.value?.id === id) selectedUser.value = null
    message.value = 'User deleted.'
    await listUsers()
  } else error.value = deleteAction.error.value
};

const saveUser = async () => {
  const action = editingUserId.value ? api.users.update : api.users.create
  const argumentsForAction = editingUserId.value
    ? [editingUserId.value, { ...userForm }]
    : [{ ...userForm }]
  const { success } = await saveAction.run(action, ...argumentsForAction)
  if (success) {
    message.value = editingUserId.value ? 'User updated.' : 'User created.'
    resetForm()
    await listUsers()
  } else error.value = saveAction.error.value
};

onMounted(() => {
  listUsers()
});
</script>