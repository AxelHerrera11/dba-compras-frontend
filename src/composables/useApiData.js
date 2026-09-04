import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useApiData(request, transform = (value) => value) {
  const data = ref([])
  const error = ref('')
  const loading = ref(true)
  let controller

  async function load() {
    controller?.abort()
    const requestController = new AbortController()
    controller = requestController
    loading.value = true
    error.value = ''

    try {
      data.value = transform(await request({ signal: requestController.signal }))
    } catch (requestError) {
      if (requestError.name !== 'AbortError') {
        data.value = []
        error.value = requestError.message
      }
    } finally {
      if (!requestController.signal.aborted) loading.value = false
    }
  }

  onMounted(load)
  onBeforeUnmount(() => controller?.abort())

  return { data, error, loading, reload: load }
}
