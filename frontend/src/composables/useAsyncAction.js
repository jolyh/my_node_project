import { ref } from 'vue'

// Each call creates its own loading/error refs, so components stay isolated even though this logic is shared.
export function useAsyncAction() {
    const loading = ref(false)
    const error = ref('')

    const run = async (action, ...args) => {
        loading.value = true
        error.value = ''
        try {
            const result = await action(...args)
            return { success: true, result }
        } catch (err) {
            console.error(err)
            error.value = err.message || 'An error occurred. Please try again.'
            return { success: false, error: err }
        } finally {
            loading.value = false
        }
    }

    const clear = () => {
        error.value = ''
        loading.value = false
    }

    return { loading, error, run, clear }
}
