<template>
  <form class="management-form" @submit.prevent="$emit('submit')">
    <div class="form-group">
      <label for="user-name">Name</label>
      <input id="user-name" v-model.trim="form.name" required autocomplete="name" />
    </div>
    <div class="form-group">
      <label for="user-email">Email</label>
      <input id="user-email" v-model.trim="form.email" type="email" required autocomplete="email" />
    </div>
    <div class="form-group">
      <label for="user-password">{{ editing ? 'New password' : 'Password' }}</label>
      <input id="user-password" v-model="form.password" type="password" minlength="8" :required="!editing" autocomplete="new-password" />
    </div>
    <div class="form-group" v-if="assignableRoles.length">
      <label for="user-role">Role</label>
      <select id="user-role" v-model.number="form.role" required>
        <option v-for="role in assignableRoles" :key="role.value" :value="role.value">{{ role.label }}</option>
      </select>
    </div>
    <button class="btn btn-primary" type="submit" :disabled="loading">{{ editing ? 'Save changes' : 'Create user' }}</button>
  </form>
</template>

<script setup>
import { computed } from 'vue'
import { userRole } from '#shared/user.js'

const props = defineProps({
  form: {
    type: Object,
    required: true
  },
  editing: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  currentUserRole: {
    type: Number,
    default: null
  }
})

defineEmits(['submit'])

console.log("Current user role:", props.currentUserRole)
console.log("Editing:", props.editing)

// Only offer roles strictly below the acting user's role, never grant equal/higher privilege
const assignableRoles = computed(() => {
  if (props.currentUserRole === null) return []
  const lowerRoles = userRole.getLowerOrEqualRoles(props.currentUserRole);
  return lowerRoles.map(role => ({ value: role, label: userRole.toLabel(role) }));
})
</script>

