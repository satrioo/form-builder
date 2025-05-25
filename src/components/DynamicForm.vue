<script setup lang="ts">
import { reactive, ref } from "vue";
import type { PropType } from "vue";
import Result from "./Result.vue";

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


const props = defineProps({
  schema: {
    type: Object as PropType<{
      title: string;
      description?: string;
      fields: Field[];
    }>,
    required: true,
  },
});
const formData = reactive<Record<string, any>>({});
const touched = reactive<Record<string, any>>({});
const isSubmited = ref(false)

props.schema.fields.forEach((field) => {
  if (field.type === "group") {
    formData[field.model] = {};
    touched[field.model] = {};
    field.fields?.forEach((subField) => {
      formData[field.model][subField.model] = "";
      touched[field.model][subField.model] = false;
    });
  } else {
    formData[field.model] = field.type === "checkbox" ? false : "";
    touched[field.model] = false;
  }
});

function isVisible(field: Field): boolean {
  if (!field.visibleIf) return true;
  return Object.entries(field.visibleIf).every(
    ([key, val]) => formData[key] === val
  );
}

function getError(field: Field, value: any): string | null {
  if (field.required) {
    if (field.type === "checkbox") {
      if (value !== true) return "This field is required.";
    } else if (field.type === "file") {
      if (!value) return "Please upload a file.";
    } else {
      if (!value || (typeof value === "string" && value.trim() === ""))
        return "This field is required.";
    }
  }

  if (field.validation?.email && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address.";
    }
  }

  if (field.validation?.number && value) {
    const numberRegex = /^\d+$/;
    if (!numberRegex.test(value)) {
      return "Only numbers are allowed.";
    }
  }

  return null;
}

function handleSubmit() {
  Object.keys(touched).forEach((key) => {
    if (typeof touched[key] === "object") {
      Object.keys(touched[key]).forEach((subKey) => {
        touched[key][subKey] = true;
      });
    } else {
      touched[key] = true;
    }
  });

  let hasError = false;
  props.schema.fields.forEach((field) => {
    if (!isVisible(field)) return; // 🛑 Skip invisible fields

    if (field.type === "group") {
      field.fields?.forEach((subField) => {
        if (!isVisible(subField)) return; // 🛑 Skip invisible sub-fields

        const error = getError(subField, formData[field.model][subField.model]);
        if (error) hasError = true;
      });
    } else {
      const error = getError(field, formData[field.model]);
      if (error) hasError = true;
    }
  });

  if (hasError) {
    alert("Please fix errors before submitting.");
    return;
  }

  alert("Form submitted!");
  isSubmited.value = true
}

const clearForm = () => {
  isSubmited.value = false
  props.schema.fields.forEach((field) => {
    if (field.type === "group") {
      Object.keys(formData[field.model]).forEach((subKey) => {
        formData[field.model][subKey] =
          field.fields?.find(f => f.model === subKey)?.type === "checkbox"
            ? false
            : "";
      });
      Object.keys(touched[field.model]).forEach((subKey) => {
        touched[field.model][subKey] = false;
      });
    } else {
      formData[field.model] = field.type === "checkbox" ? false : "";
      touched[field.model] = false;
    }
  });
};
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
            <!-- Text, Email, Tel -->
            <div v-if="['text', 'email', 'tel'].includes(field.type)">
              <label class="block font-medium mb-1"
                >{{ field.label }}
                <span v-if="field.required" class="text-red-600">*</span>
              </label>
              <input
                :type="field.type"
                :placeholder="field.placeholder"
                v-model="formData[field.model]"
                :required="field.required"
                @blur="touched[field.model] = true"
                :class="[
                  'w-full rounded-lg border p-2.5 text-sm focus:outline-none',
                  touched[field.model] && getError(field, formData[field.model])
                    ? 'border-red-600 focus:border-red-600 focus:ring-red-600'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                ]"
              />
              <p
                v-if="
                  touched[field.model] && getError(field, formData[field.model])
                "
                class="text-red-600 text-sm mt-1"
              >
                {{ getError(field, formData[field.model]) }}
              </p>
            </div>

            <!-- Select -->
            <div v-else-if="field.type === 'select'">
              <label class="block font-medium mb-1"
                >{{ field.label }}
                <span v-if="field.required" class="text-red-600">*</span></label
              >
              <select
                v-model="formData[field.model]"
                :required="field.required"
                @blur="touched[field.model] = true"
                :class="[
                  'w-full rounded-lg border p-2.5 text-sm focus:outline-none',
                  touched[field.model] && getError(field, formData[field.model])
                    ? 'border-red-600 focus:border-red-600 focus:ring-red-600'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                ]"
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
              <p
                v-if="
                  touched[field.model] && getError(field, formData[field.model])
                "
                class="text-red-600 text-sm mt-1"
              >
                {{ getError(field, formData[field.model]) }}
              </p>
            </div>

            <!-- Textarea -->
            <div v-else-if="field.type === 'textarea'">
              <label class="block font-medium mb-1"
                >{{ field.label }}
                <span v-if="field.required" class="text-red-600">*</span></label
              >
              <textarea
                v-model="formData[field.model]"
                :placeholder="field.placeholder"
                :required="field.required"
                rows="4"
                @blur="touched[field.model] = true"
                :class="[
                  'w-full rounded-lg border p-2.5 text-sm focus:outline-none',
                  touched[field.model] && getError(field, formData[field.model])
                    ? 'border-red-600 focus:border-red-600 focus:ring-red-600'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                ]"
              ></textarea>
              <p
                v-if="
                  touched[field.model] && getError(field, formData[field.model])
                "
                class="text-red-600 text-sm mt-1"
              >
                {{ getError(field, formData[field.model]) }}
              </p>
            </div>

            <!-- File -->
            <div v-else-if="field.type === 'file'">
              <label class="block font-medium mb-1"
                >{{ field.label }}
                <span v-if="field.required" class="text-red-600">*</span></label
              >
              <input
                type="file"
                :accept="field.accept"
                :required="field.required"
                @change="e => { formData[field.model] = (e.target as HTMLInputElement)?.files?.[0] ?? null; touched[field.model] = true }"
                class="w-full mx-auto block rounded-lg border border-blue-200 bg-blue-200 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              />
              <p
                v-if="
                  touched[field.model] && getError(field, formData[field.model])
                "
                class="text-red-600 text-sm mt-1"
              >
                {{ getError(field, formData[field.model]) }}
              </p>
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
                @blur="touched[field.model] = true"
                class="rounded"
              />
              <label :for="field.model"
                >{{ field.label }}
                <span v-if="field.required" class="text-red-600">*</span></label
              >
              <p
                v-if="
                  touched[field.model] && getError(field, formData[field.model])
                "
                class="text-red-600 text-sm mt-1"
              >
                {{ getError(field, formData[field.model]) }}
              </p>
            </div>

            <!-- Group -->
            <div
              v-else-if="field.type === 'group'"
              class="border flex flex-col gap-2 border-gray-300 rounded-lg shadow-sm p-4 bg-white transition duration-300 hover:shadow-md"
            >
              <h3 class="font-semibold mb-2">{{ field.label }}</h3>
              <div v-for="subField in field.fields" :key="subField.model">
                <label class="block font-medium mb-1"
                  >{{ subField.label }}
                  <span v-if="subField.required" class="text-red-600"
                    >*</span
                  ></label
                >
                <input
                  :type="subField.type"
                  :placeholder="subField.placeholder"
                  v-model="formData[field.model][subField.model]"
                  :required="subField.required"
                  @blur="touched[field.model][subField.model] = true"
                  :class="[
                    'w-full rounded-lg border p-2.5 text-sm focus:outline-none',
                    touched[field.model][subField.model] &&
                    getError(subField, formData[field.model][subField.model])
                      ? 'border-red-600 focus:border-red-600 focus:ring-red-600'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                  ]"
                />
                <p
                  v-if="
                    touched[field.model][subField.model] &&
                    getError(subField, formData[field.model][subField.model])
                  "
                  class="text-red-600 text-sm mt-1"
                >
                  {{
                    getError(subField, formData[field.model][subField.model])
                  }}
                </p>
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

    <div v-if="isSubmited">
      <Result :content="formData" @resetForm="clearForm" />
    </div>
  </div>
</template>

<style scoped>
input[type="checkbox"] {
  transform: scale(1.3);
  transform-origin: top left;
  top: -2px;
  position: relative;
  margin-right: 0.5rem;
}
</style>
