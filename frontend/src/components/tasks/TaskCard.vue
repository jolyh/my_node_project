<template>
  <article
    class="board-card-item"
    draggable="true"
    @dragstart.stop="onDragStart"
  >
    <strong>{{ task.title }}</strong>
    <p v-if="task.description">{{ task.description }}</p>
    <span class="form-actions">
      <button class="btn btn-icon" type="button" @click="$emit('edit', task)"><IconEdit /><span class="sr-only">Edit</span></button>
      <button class="btn btn-icon btn-danger" type="button" @click="$emit('delete', task.id)"><IconDelete /><span class="sr-only">Delete</span></button>
    </span>
  </article>
</template>

<script setup>
import IconEdit from '@components/icons/IconEdit.vue'
import IconDelete from '@components/icons/IconDelete.vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['dragstart', 'edit', 'delete'])

const onDragStart = (event) => {
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', String(props.task.id))
  emit('dragstart', event, props.task)
}
</script>

<style scoped>
.board-card-item {
  display: grid;
  gap: 0.35rem;
  padding: 0.5rem 0.65rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  cursor: grab;
  overflow-wrap: anywhere;
}

.board-card-item:active {
  cursor: grabbing;
}

.board-card-item p {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
}
</style>
