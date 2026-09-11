<template>
  <div class="board">
    <TaskLane
      v-for="lane in groupedByStatus"
      :key="lane.value"
      :lane="lane"
      @dragstart="onDragStart"
      @drop="handleDrop"
      @edit="(task) => $emit('edit', task)"
      @delete="(id) => $emit('delete', id)"
    />
  </div>
</template>

<script setup>
import { toRef } from 'vue'
import TaskLane from './TaskLane.vue'
import { useLane } from '@composables/tasks/useLane.js'

const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  },
  moveTask: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'error'])

const tasksRef = toRef(props, 'tasks')

const {
  groupedByStatus,
  onDragStart,
  onDrop
} = useLane({
  tasks: tasksRef,
  moveTask: props.moveTask,
  onError: () => emit('error')
})

const handleDrop = (event, status) => {
  onDrop(event, status)
}
</script>

<style scoped>
.board {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: flex-start;
  overflow-x: auto;
}
</style>
