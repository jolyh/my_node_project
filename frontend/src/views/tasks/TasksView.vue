<template>
  <div class="management-view">
    <header>
      <p class="eyebrow">Administration</p>
      <h1>Tasks</h1>
    </header>
    <main>
      <p v-if="message" class="message message-success">{{ message }}</p>
      <p v-if="error" class="message message-error">{{ error }}</p>

      <section class="card card-wide management-card">
        <div class="section-heading">
          <div>
            <p class="eyebrow">{{ editingTaskId ? 'Edit task' : 'New task' }}</p>
            <h2>{{ editingTaskId ? 'Update task' : 'Create task' }}</h2>
          </div>
          <button v-if="editingTaskId" class="btn" type="button" @click="resetForm">Cancel</button>
        </div>
        <form class="management-form" @submit.prevent="saveTask">
          <div class="form-group">
            <label for="task-title">Title</label>
            <input id="task-title" v-model="taskForm.title" type="text" required />
          </div>
          <div class="form-group">
            <label for="task-description">Description</label>
            <input id="task-description" v-model="taskForm.description" type="text" />
          </div>
          <div class="form-group" v-if="editingTaskId">
            <label for="task-status">Status</label>
            <select id="task-status" v-model.number="taskForm.status" required>
              <option v-for="status in taskStatuses" :key="status.value" :value="status.value">{{ status.label }}</option>
            </select>
          </div>
          <button class="btn btn-primary" type="submit" :disabled="createAction.loading.value || updateAction.loading.value">
            {{ editingTaskId ? 'Save changes' : 'Create task' }}
          </button>
        </form>
      </section>

      <section class="card card-wide board-card">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Task board</p>
            <h2>Swimlanes</h2>
          </div>
          <button class="btn" type="button" @click="listTasks" :disabled="listAction.loading.value">Refresh</button>
        </div>
        <TaskBoard
          :tasks="tasks"
          :move-task="moveTask"
          @edit="editTask"
          @delete="removeTask"
          @error="showError(updateAction)"
        />
      </section>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTask } from '@composables/tasks/useTask.js'
import { taskStatuses } from '@composables/tasks/useLane.js'
import TaskBoard from '@components/tasks/TaskBoard.vue'

const route = useRoute()
const authorId = route.params.id ? Number(route.params.id) : null

const {
  tasks,
  message,
  error,
  editingTaskId,
  taskForm,
  listAction,
  createAction,
  updateAction,
  showError,
  resetForm,
  editTask,
  listTasks,
  moveTask,
  saveTask,
  removeTask
} = useTask(authorId)

onMounted(async () => {
  await listTasks()
})
</script>

<style scoped>
.board-card {
  max-width: 100%;
}
</style>
