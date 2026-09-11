<template>
  <div class="password-field">
    <input :id="id" :type="visible ? 'text' : 'password'" :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)" :minlength="minlength" :autocomplete="autocomplete"
      :required="required" />
    <button type="button" class="password-toggle" @click="visible = !visible"
      :aria-label="visible ? 'Hide password' : 'Show password'">{{ visible ? "Hide" : "Show" }}</button>
  </div>
</template>
<script setup>
import { ref } from 'vue'

defineProps({
  id: { type: String, required: true },
  modelValue: { type: String, default: "" },
  minlength: { type: [Number, String], default: null },
  autocomplete: { type: String, default: "current-password" },
  required: { type: Boolean, default: false }
})

defineEmits(['update:modelValue'])

const visible = ref(false)
</script>
