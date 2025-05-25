<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  content: {
    type: String as any,
    default: "",
  },
});
</script>

<template>
  <div class="max-w-2xl mt-4 mx-auto p-6 bg-white rounded-lg shadow">
    <h4 class="text-center text-lg text-gray-700 font-bold">Submited Data</h4>
    <div>
      <pre class="code-block">
    <code>{{ props.content }}</code>
  </pre>
    </div>

    <button
      type="submit"
      @click="$emit('resetForm')"
      class="bg-orange-300 w-full mt-2 text-black px-4 py-2 rounded hover:bg-orange-400"
    >
      Reset
    </button>
  </div>
</template>

<style scoped>
.code-block {
  background-color: #2d2d2d; /* Dark background */
  color: #ffffff; /* White text */
  padding: 1rem;
  border-radius: 8px;
  font-family: "Courier New", monospace;
  font-size: 14px;
  overflow-x: auto;
  white-space: pre;
}
</style>
