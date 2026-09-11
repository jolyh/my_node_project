<template>
  <div class="management-view">
    <header>
      <p class="eyebrow">Administration</p>
      <h1>Users</h1>
    </header>
    <main>
      <p v-if="message" class="message message-success">{{ message }}</p>
      <p v-if="error" class="message message-error">{{ error }}</p>
      <DataTable
        title="All users"
        subtitle="Directory"
        :columns="columns"
        :items="filteredUsers"
        :item-key="(user) => user.id"
        :refreshing="listAction.loading.value"
        create-label="New user"
        empty-text="No users found."
        @refresh="listUsers"
        @create="openCreate"
      >
        <template #filters>
          <div class="form-group">
            <label for="filter-id">ID</label>
            <input id="filter-id" v-model.trim="filters.id" type="text" placeholder="Filter by ID" />
          </div>
          <div class="form-group">
            <label for="filter-name">Name</label>
            <input id="filter-name" v-model.trim="filters.name" type="text" placeholder="Filter by name" />
          </div>
          <div class="form-group">
            <label for="filter-email">Email</label>
            <input id="filter-email" v-model.trim="filters.email" type="text" placeholder="Filter by email" />
          </div>
          <div class="form-group">
            <label for="filter-role">Role</label>
            <select id="filter-role" v-model="filters.role">
              <option value="">All roles</option>
              <option v-for="role in roleOptions" :key="role.value" :value="String(role.value)">{{ role.label }}</option>
            </select>
          </div>
          <button v-if="hasActiveFilters" class="btn btn-icon" type="button" @click="clearFilters"><IconClear /><span class="sr-only">Clear filters</span></button>
        </template>
        <template #row="{ item: user }">
          <td>#{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ userRole.toString(user.role) }}</td>
          <td>
            <span class="form-actions">
              <button class="btn btn-icon" type="button" @click="navigation.goToUser(user.id)"><IconView /><span class="sr-only">View</span></button>
              <button class="btn btn-icon" type="button" @click="openEdit(user)"><IconEdit /><span class="sr-only">Edit</span></button>
              <button class="btn btn-icon btn-danger" type="button" @click="deleteUser(user.id)"><IconDelete /><span class="sr-only">Delete</span></button>
            </span>
          </td>
        </template>
      </DataTable>
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

      <Modal v-if="isFormOpen" @close="closeForm">
        <template #header>
          <h2>{{ editingUserId != null ? 'Update account' : 'Create account' }}</h2>
        </template>
        <UserForm
          :form="userForm"
          :editing="editingUserId != null"
          :loading="saveAction.loading.value"
          :current-user-role="currentUserRole"
          @submit="saveUser"
        />
      </Modal>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@api/api.js'
import { useAsyncAction } from '@composables/useAsyncAction.js'
import navigation from '@router/navigation.js'
import session from '@stores/session.js'
import Modal from '@components/global/Modal.vue'
import UserForm from '@components/UserForm.vue'
import DataTable from '@components/DataTable.vue'
import IconView from '@components/icons/IconView.vue'
import IconEdit from '@components/icons/IconEdit.vue'
import IconDelete from '@components/icons/IconDelete.vue'
import IconClear from '@components/icons/IconClear.vue'
import { userRole } from '#shared/user.js'

const currentUserRole = session.getUser()?.role ?? null

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'actions', label: 'Actions' }
]

const roleOptions = Object.entries(userRole)
  .filter(([, value]) => typeof value === 'number')
  .map(([, value]) => ({ value, label: userRole.toString(value) }))
  .sort((a, b) => a.value - b.value)

const users = ref([])
const selectedUser = ref(null)
const editingUserId = ref(null)
const isFormOpen = ref(false)
const message = ref('')
const error = ref('')
const userForm = reactive({ name: '', email: '', password: '', role: null })
const filters = reactive({ id: '', name: '', email: '', role: '' })

const listAction = useAsyncAction()
const saveAction = useAsyncAction()
const deleteAction = useAsyncAction()

const hasActiveFilters = computed(() =>
  Object.values(filters).some((value) => value !== '')
)

const filteredUsers = computed(() =>
  users.value.filter((user) => {
    if (filters.id && !String(user.id).includes(filters.id)) return false
    if (filters.name && !user.name.toLowerCase().includes(filters.name.toLowerCase())) return false
    if (filters.email && !user.email.toLowerCase().includes(filters.email.toLowerCase())) return false
    if (filters.role && Number(user.role) !== Number(filters.role)) return false
    return true
  })
)

const clearFilters = () => {
  Object.assign(filters, { id: '', name: '', email: '', role: '' })
}

const listUsers = async () => {
  const { success, result } = await listAction.run(api.users.list)
  if (success) users.value = result.users
  else error.value = listAction.error.value
};

const resetForm = () => {
  editingUserId.value = null
  Object.assign(userForm, { name: '', email: '', password: '', role: null })
}

const openCreate = () => {
  resetForm()
  isFormOpen.value = true
}

const openEdit = (user) => {
  editingUserId.value = user.id
  Object.assign(userForm, { name: user.name, email: user.email, password: '', role: user.role })
  isFormOpen.value = true
};

const closeForm = () => {
  isFormOpen.value = false
  resetForm()
}

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
    closeForm()
    await listUsers()
  } else error.value = saveAction.error.value
};

onMounted(() => {
  listUsers()
});
</script>