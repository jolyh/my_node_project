<template>
  <section class="card card-full management-card">
    <div class="section-heading">
      <div>
        <p v-if="subtitle" class="eyebrow">{{ subtitle }}</p>
        <h2>{{ title }}</h2>
      </div>
      <span class="form-actions">
        <button class="btn btn-icon" type="button" @click="$emit('refresh')" :disabled="refreshing">
          <IconRefresh /><span class="sr-only">Refresh</span>
        </button>
        <button v-if="creatable" class="btn btn-icon btn-primary" type="button" @click="$emit('create')">
          <IconAdd /><span class="sr-only">{{ createLabel }}</span>
        </button>
      </span>
    </div>

    <form class="filter-form" @submit.prevent>
      <slot name="filters" />
    </form>

    <div class="data-table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!items.length">
            <td :colspan="columns.length" class="empty-state">{{ emptyText }}</td>
          </tr>
          <tr v-for="item in items" :key="itemKey(item)">
            <slot name="row" :item="item" />
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import IconRefresh from './icons/IconRefresh.vue'
import IconAdd from './icons/IconAdd.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  columns: {
    type: Array,
    required: true
  },
  items: {
    type: Array,
    default: () => []
  },
  itemKey: {
    type: Function,
    required: true
  },
  emptyText: {
    type: String,
    default: 'No results found.'
  },
  refreshing: {
    type: Boolean,
    default: false
  },
  creatable: {
    type: Boolean,
    default: true
  },
  createLabel: {
    type: String,
    default: 'Create'
  }
})

defineEmits(['refresh', 'create'])
</script>

<style scoped>
.filter-form {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.filter-form :deep(.form-group) {
  flex: 1 1 160px;
}

.data-table td.empty-state {
  text-align: center;
}
</style>
