<script setup lang="ts">
import { reactive } from "vue";

interface Field {
  type: string;
  label: string;
  model: string;
  required?: boolean;
  placeholder?: string;
  validation?: Record<string, any>;
  options?: { label: string; value: string }[];
  accept?: string;
  visibleIf?: Record<string, any>;
  fields?: Field[];
}

const props = defineProps<{
  schema: {
    title: string;
    description?: string;
    fields: Field[];
  };
}>();

const formData = reactive<Record<string, any>>({});

props.schema.fields.forEach((field) => {
  if (field.type === "group") {
    formData[field.model] = {};
    field.fields?.forEach((subField) => {
      formData[field.model][subField.model] = "";
    });
  } else {
    formData[field.model] = field.type === "checkbox" ? false : "";
  }
});

function isVisible(field: Field): boolean {
  if (!field.visibleIf) return true;
  return Object.entries(field.visibleIf).every(
    ([key, val]) => formData[key] === val
  );
}

function handleSubmit() {
  console.log("Submitted Data:", formData);
  alert("Form submitted!");
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-2">{{ schema.title }}</h2>
    <p v-if="schema.description" class="mb-4 text-gray-600">
      {{ schema.description }}
    </p>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <template v-for="field in schema.fields" :key="field.model">
        <Transition name="fade">
          <div v-if="isVisible(field)">
            <div v-if="['text', 'email', 'tel'].includes(field.type)">
              <label class="block font-medium mb-1">{{ field.label }}</label>
              <input
                :type="field.type"
                :placeholder="field.placeholder"
                v-model="formData[field.model]"
                :required="field.required"
                class="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <!-- Select -->
            <div v-else-if="field.type === 'select'">
              <label class="block font-medium mb-1">{{ field.label }}</label>
              <select
                v-model="formData[field.model]"
                :required="field.required"
                class="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">-- Select --</option>
                <option
                  v-for="option in field.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <!-- Textarea -->
            <div v-else-if="field.type === 'textarea'">
              <label class="block font-medium mb-1">{{ field.label }}</label>
              <textarea
                v-model="formData[field.model]"
                :placeholder="field.placeholder"
                :required="field.required"
                class="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
            </div>

            <!-- File -->
            <div v-else-if="field.type === 'file'">
              <label class="block font-medium mb-1">{{ field.label }}</label>
              <input
                type="file"
                :accept="field.accept"
                :required="field.required"
                @change="e => formData[field.model] = (e.target as HTMLInputElement)?.files?.[0] ?? null"
                 class="w-full mx-auto block rounded-lg border border-blue-200 bg-blue-200 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <!-- Checkbox -->
            <div
              v-else-if="field.type === 'checkbox'"
              class="flex items-center gap-2"
            >
              <input
                type="checkbox"
                v-model="formData[field.model]"
                :id="field.model"
                class="rounded"
              />
              <label :for="field.model">{{ field.label }}</label>
            </div>

            <!-- Group -->
            <div
              v-else-if="field.type === 'group'"
              class="border flex flex-col gap-2 border-gray-300 rounded-lg shadow-sm p-4 bg-white transition duration-300 hover:shadow-md"
            >
              <h3 class="font-semibold mb-2">{{ field.label }}</h3>
              <div v-for="subField in field.fields" :key="subField.model">
                <label class="block font-medium mb-1">{{
                  subField.label
                }}</label>
                <input
                  :type="subField.type"
                  v-model="formData[field.model][subField.model]"
                  :required="subField.required"
                  class="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </Transition>
      </template>

      <button
        type="submit"
        class="bg-blue-400 w-full text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  </div>

  {{ formData }}
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
