<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { listForms, getForm, createSubmission } from "../lib/api.js";

// State
const forms = ref([]);
const selectedFormId = ref(null);
const form = ref(null);
const values = ref({});
const loading = ref(false);
const submitting = ref(false);
const error = ref(null);
const successSnackbar = ref(false);
const validationError = ref(null);

/**
 * Load all forms
 */
async function loadForms() {
  loading.value = true;
  error.value = null;

  try {
    forms.value = await listForms();
  } catch (err) {
    error.value = err.message || "Failed to load forms";
  } finally {
    loading.value = false;
  }
}

/**
 * Load selected form with fields
 */
async function loadSelectedForm() {
  if (!selectedFormId.value) {
    form.value = null;
    values.value = {};
    return;
  }

  loading.value = true;
  error.value = null;
  validationError.value = null;

  try {
    form.value = await getForm(selectedFormId.value);
    initializeValues();
  } catch (err) {
    error.value = err.message || "Failed to load form";
    form.value = null;
    values.value = {};
  } finally {
    loading.value = false;
  }
}

/**
 * Initialize values object with defaults based on field types
 */
function initializeValues() {
  if (!form.value?.fields) {
    values.value = {};
    return;
  }

  const newValues = {};
  for (const field of form.value.fields) {
    switch (field.type) {
      case "text":
        newValues[field.name] = "";
        break;
      case "select":
        newValues[field.name] = null;
        break;
      case "checkbox":
        newValues[field.name] = false;
        break;
      case "rating":
        newValues[field.name] = 0;
        break;
      default:
        newValues[field.name] = null;
    }
  }
  values.value = newValues;
}

/**
 * Get sorted fields by ord
 */
const sortedFields = computed(() => {
  if (!form.value?.fields) return [];
  return [...form.value.fields].sort((a, b) => (a.ord || 0) - (b.ord || 0));
});

/**
 * Validate required fields
 */
function validateForm() {
  if (!form.value?.fields) return { valid: true };

  const missingFields = [];

  for (const field of form.value.fields) {
    if (!field.required) continue;

    const value = values.value[field.name];
    const label = field.label || field.name;

    // Check if value is empty based on type
    if (field.type === "text" && (!value || value.trim() === "")) {
      missingFields.push(label);
    } else if (field.type === "select" && (value === null || value === undefined || value === "")) {
      missingFields.push(label);
    } else if (field.type === "checkbox" && !value) {
      missingFields.push(label);
    } else if (field.type === "rating" && (!value || value === 0)) {
      missingFields.push(label);
    }
  }

  if (missingFields.length > 0) {
    return {
      valid: false,
      message: `Missing required fields: ${missingFields.join(", ")}`,
    };
  }

  return { valid: true };
}

/**
 * Submit form
 */
async function handleSubmit() {
  const validation = validateForm();
  if (!validation.valid) {
    validationError.value = validation.message;
    return;
  }

  submitting.value = true;
  error.value = null;
  validationError.value = null;

  try {
    await createSubmission(selectedFormId.value, values.value);
    successSnackbar.value = true;
    initializeValues();
  } catch (err) {
    error.value = err.message || "Failed to submit form";
  } finally {
    submitting.value = false;
  }
}

/**
 * Get form items for v-select
 */
const formItems = computed(() => {
  return forms.value
    .filter((f) => f.status === "active")
    .map((f) => ({
      value: f.id,
      title: f.name,
    }));
});

// Watch for form selection changes
watch(selectedFormId, () => {
  loadSelectedForm();
});

// Load forms on mount
onMounted(() => {
  loadForms();
});
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold">Fill Form</h1>
    </div>

    <!-- Error Alert -->
    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      closable
      @click:close="error = null"
      class="mb-4"
    >
      {{ error }}
    </v-alert>

    <!-- Validation Error -->
    <v-alert
      v-if="validationError"
      type="error"
      variant="tonal"
      closable
      @click:close="validationError = null"
      class="mb-4"
    >
      {{ validationError }}
    </v-alert>

    <!-- Form Selector -->
    <v-select
      v-model="selectedFormId"
      label="Select a Form"
      :items="formItems"
      item-title="title"
      item-value="value"
      variant="outlined"
      :loading="loading && !form"
      :disabled="loading && !form"
      class="mb-6"
    />

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <!-- No Form Selected -->
    <div v-else-if="!selectedFormId" class="text-center py-12 text-medium-emphasis">
      <p>Please select a form</p>
    </div>

    <!-- Form Display -->
    <v-card v-else-if="form">
      <v-card-title>{{ form.name }}</v-card-title>
      <v-card-subtitle v-if="form.description">
        {{ form.description }}
      </v-card-subtitle>

      <v-card-text>
        <v-form @submit.prevent="handleSubmit">
          <!-- Dynamic Fields -->
          <div v-for="field in sortedFields" :key="field.name" class="mb-4">
            <!-- Text Input -->
            <v-text-field
              v-if="field.type === 'text'"
              v-model="values[field.name]"
              :label="field.label || field.name"
              variant="outlined"
              :disabled="submitting"
            />

            <!-- Select Dropdown -->
            <v-select
              v-else-if="field.type === 'select'"
              v-model="values[field.name]"
              :label="field.label || field.name"
              :items="field.config?.options || []"
              item-title="title"
              item-value="value"
              variant="outlined"
              :disabled="submitting"
            />

            <!-- Checkbox -->
            <v-checkbox
              v-else-if="field.type === 'checkbox'"
              v-model="values[field.name]"
              :label="field.label || field.name"
              :disabled="submitting"
            />

            <!-- Rating -->
            <div v-else-if="field.type === 'rating'">
              <label class="text-body-2 mb-2 d-block">
                {{ field.label || field.name }}
              </label>
              <v-rating
                v-model="values[field.name]"
                :length="field.config?.max || 5"
                :disabled="submitting"
                hover
              />
            </div>
          </div>

          <!-- Submit Button -->
          <v-btn
            type="submit"
            color="primary"
            block
            :loading="submitting"
            :disabled="submitting || loading"
          >
            Submit
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Success Snackbar -->
    <v-snackbar v-model="successSnackbar" color="success" :timeout="3000">
      Form submitted successfully!
    </v-snackbar>
  </div>
</template>
