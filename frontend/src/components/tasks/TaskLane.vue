<template>
  <div
    class="board-lane"
    @dragover.prevent
    @dragenter.prevent
    @drop.prevent="$emit('drop', $event, lane.value)"
  >
    <div class="board-lane__header">
      <span>{{ lane.label }}</span>
      <span class="board-lane__count">{{ lane.tasks.length }}</span>
    </div>
    <div
      class="board-lane__body"
      @dragover.prevent
      @dragenter.prevent
      @drop.prevent.stop="$emit('drop', $event, lane.value)"
    >
      <TaskCard
        v-for="task in lane.tasks"
        :key="task.id"
        :task="task"
        @dragstart="(e, t) => $emit('dragstart', e, t)"
        @edit="(t) => $emit('edit', t)"
        @delete="(id) => $emit('delete', id)"
      />
      <p v-if="!lane.tasks.length" class="empty-state">No tasks.</p>
    </div>
  </div>
</template>

<script setup>
import TaskCard from './TaskCard.vue'

defineProps({
  lane: {
    type: Object,
    required: true
  }
})

defineEmits(['drop', 'dragstart', 'edit', 'delete'])
</script>

<style scoped>
.board-lane {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 8rem;
  min-width: 260px;
  flex: 1 1 0;
  padding: 0.5rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.board-lane__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.25rem 0.25rem 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.board-lane__count {
  color: var(--color-muted);
}

.board-lane__body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 4rem;
}

.empty-state {
  color: var(--color-muted);
  font-size: 0.875rem;
  margin: 0;
  padding: 0.5rem 0;
}
</style>
