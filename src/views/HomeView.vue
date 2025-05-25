<script setup lang="ts">
import DynamicForm from '../components/DynamicForm.vue'
import { jobApplicationSchema } from '../schemas/jobApplicationSchema.ts'
</script>

<template>
  <DynamicForm :schema="jobApplicationSchema" />
</template>
