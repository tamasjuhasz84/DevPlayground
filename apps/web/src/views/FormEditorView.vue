<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getForm, saveFormSchema } from "../lib/api.js";

const route = useRoute();
const router = useRouter();

const formId = ref(route.params.id);
const loading = ref(false);
const saving = ref(false);
const error = ref(null);
const saveSuccess = ref(false);

// Form data
const form = ref({
  name: "",
  description: "",
  status: "active",
  fields: [],
});

// Field types supported in MVP
const fieldTypes = [
  { value: "text", title: "Text Input" },
  { value: "select", title: "Dropdown Select" },
  { value: "checkbox", title: "Checkbox" },
  { value: "rating", title: "Rating" },
];

const statusOptions = [
  { value: "active", title: "Active" },
  { value: "archived", title: "Archived" },
];

/**
 * Load form with fields from API
 */
async function loadForm() {
  loading.value = true;
  error.value = null;

  try {
    const data = await getForm(formId.value);
    form.value = {
      name: data.name || "",
      description: data.description || "",
      status: data.status || "active",
      fields: data.fields || [],
    };
  } catch (err) {
    error.value = err.message || "Failed to load form";
    console.error("Error loading form:", err);
  } finally {
    loading.value = false;
  }
}

/**
 * Add a new field
 */
function addField() {
  const newOrder =
    form.value.fields.length > 0 ? Math.max(...form.value.fields.map((f) => f.order || 0)) + 1 : 0;

  form.value.fields.push({
    type: "text",
    name: `field_${Date.now()}`,
    label: "New Field",
    required: false,
    order: newOrder,
    config: null,
  });
}

/**
 * Remove a field by index
 */
function removeField(index) {
  form.value.fields.splice(index, 1);
  reorderFields();
}

/**
 * Move field up
 */
function moveFieldUp(index) {
  if (index === 0) return;
  const temp = form.value.fields[index];
  form.value.fields[index] = form.value.fields[index - 1];
  form.value.fields[index - 1] = temp;
  reorderFields();
}

/**
 * Move field down
 */
function moveFieldDown(index) {
  if (index === form.value.fields.length - 1) return;
  const temp = form.value.fields[index];
  form.value.fields[index] = form.value.fields[index + 1];
  form.value.fields[index + 1] = temp;
  reorderFields();
}

/**
 * Reorder all fields sequentially
 */
function reorderFields() {
  form.value.fields.forEach((field, index) => {
    field.order = index;
  });
}

/**
 * Handle field type change
 */
function onFieldTypeChange(field) {
  // Initialize config based on type
  if (field.type === "select") {
    if (!field.config || !field.config.options) {
      field.config = {
        options: [
          { title: "Option 1", value: "opt1" },
          { title: "Option 2", value: "opt2" },
        ],
      };
    }
  } else if (field.type === "rating") {
    if (!field.config || !field.config.max) {
      field.config = { max: 5 };
    }
  } else {
    field.config = null;
  }
}

/**
 * Add option to select field
 */
function addSelectOption(field) {
  if (!field.config) {
    field.config = { options: [] };
  }
  if (!field.config.options) {
    field.config.options = [];
  }
  field.config.options.push({
    title: `Option ${field.config.options.length + 1}`,
    value: `opt${field.config.options.length + 1}`,
  });
}

/**
 * Remove option from select field
 */
function removeSelectOption(field, optionIndex) {
  if (field.config && field.config.options) {
    field.config.options.splice(optionIndex, 1);
  }
}

/**
 * Seed demo form with sample fields
 */
function seedDemoForm() {
  form.value.fields = [
    {
      type: "text",
      name: "customer_name",
      label: "Customer Name",
      required: true,
      order: 0,
      config: null,
    },
    {
      type: "text",
      name: "email",
      label: "Email Address",
      required: true,
      order: 1,
      config: null,
    },
    {
      type: "select",
      name: "satisfaction",
      label: "How satisfied are you?",
      required: true,
      order: 2,
      config: {
        options: [
          { title: "Very Satisfied", value: "very_satisfied" },
          { title: "Satisfied", value: "satisfied" },
          { title: "Neutral", value: "neutral" },
          { title: "Dissatisfied", value: "dissatisfied" },
          { title: "Very Dissatisfied", value: "very_dissatisfied" },
        ],
      },
    },
    {
      type: "rating",
      name: "quality_rating",
      label: "Rate our service quality",
      required: false,
      order: 3,
      config: { max: 5 },
    },
    {
      type: "checkbox",
      name: "recommend",
      label: "Would you recommend us to others?",
      required: false,
      order: 4,
      config: null,
    },
  ];
}

/**
 * Save form schema
 */
async function saveForm() {
  saving.value = true;
  error.value = null;
  saveSuccess.value = false;

  try {
    await saveFormSchema(formId.value, {
      name: form.value.name,
      description: form.value.description || null,
      status: form.value.status,
      fields: form.value.fields,
    });

    saveSuccess.value = true;
    setTimeout(() => {
      saveSuccess.value = false;
    }, 3000);
  } catch (err) {
    error.value = err.message || "Failed to save form";
    console.error("Error saving form:", err);
  } finally {
    saving.value = false;
  }
}

/**
 * Check if form can be saved
 */
const canSave = computed(() => {
  return form.value.name.trim().length > 0;
});

// Load form on mount
onMounted(() => {
  loadForm();
});
</script>

<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center">
        <v-btn icon="mdi-arrow-left" variant="text" @click="router.push('/forms')" class="mr-4" />
        <div>
          <h1 class="text-h4 font-weight-bold">Form Editor</h1>
          <p class="text-subtitle-1 text-medium-emphasis">ID: {{ formId }}</p>
        </div>
      </div>

      <div class="d-flex gap-2">
        <v-btn
          color="secondary"
          variant="outlined"
          prepend-icon="mdi-database-import"
          @click="seedDemoForm"
          :disabled="loading || saving"
        >
          Seed Demo Form
        </v-btn>
        <v-btn
          color="primary"
          prepend-icon="mdi-content-save"
          @click="saveForm"
          :loading="saving"
          :disabled="!canSave || loading"
        >
          Save
        </v-btn>
      </div>
    </div>

    <!-- Success Alert -->
    <v-alert v-if="saveSuccess" type="success" variant="tonal" class="mb-4">
      Form saved successfully!
    </v-alert>

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

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" />
      <p class="text-body-1 text-medium-emphasis mt-4">Loading form...</p>
    </div>

    <!-- Form Editor -->
    <div v-else>
      <!-- Form Details -->
      <v-card class="mb-6">
        <v-card-title class="text-h6">Form Details</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                label="Form Name"
                variant="outlined"
                :disabled="saving"
                :rules="[(v) => !!v || 'Name is required']"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.status"
                label="Status"
                :items="statusOptions"
                item-title="title"
                item-value="value"
                variant="outlined"
                :disabled="saving"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                label="Description"
                variant="outlined"
                rows="2"
                :disabled="saving"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Fields Editor -->
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h6">Form Fields</span>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            size="small"
            @click="addField"
            :disabled="saving"
          >
            Add Field
          </v-btn>
        </v-card-title>
        <v-card-text>
          <!-- Empty State -->
          <div v-if="form.fields.length === 0" class="text-center py-12">
            <v-icon size="64" color="grey-lighten-1" class="mb-4"> mdi-form-textbox </v-icon>
            <p class="text-h6 text-medium-emphasis">No fields yet</p>
            <p class="text-body-2 text-medium-emphasis mb-4">Add fields to build your form</p>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="addField">
              Add First Field
            </v-btn>
          </div>

          <!-- Fields List -->
          <div v-else>
            <v-card
              v-for="(field, index) in form.fields"
              :key="index"
              variant="outlined"
              class="mb-4"
            >
              <v-card-text>
                <v-row>
                  <!-- Field Order & Controls -->
                  <v-col cols="12" class="d-flex justify-space-between align-center pb-0">
                    <v-chip size="small" color="primary" variant="flat"> #{{ index + 1 }} </v-chip>
                    <div class="d-flex gap-1">
                      <v-btn
                        icon="mdi-arrow-up"
                        size="x-small"
                        variant="text"
                        :disabled="index === 0 || saving"
                        @click="moveFieldUp(index)"
                      />
                      <v-btn
                        icon="mdi-arrow-down"
                        size="x-small"
                        variant="text"
                        :disabled="index === form.fields.length - 1 || saving"
                        @click="moveFieldDown(index)"
                      />
                      <v-btn
                        icon="mdi-delete"
                        size="x-small"
                        variant="text"
                        color="error"
                        :disabled="saving"
                        @click="removeField(index)"
                      />
                    </div>
                  </v-col>

                  <!-- Field Type -->
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="field.type"
                      label="Field Type"
                      :items="fieldTypes"
                      item-title="title"
                      item-value="value"
                      variant="outlined"
                      density="compact"
                      :disabled="saving"
                      @update:model-value="onFieldTypeChange(field)"
                    />
                  </v-col>

                  <!-- Field Name -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="field.name"
                      label="Field Name (key)"
                      variant="outlined"
                      density="compact"
                      :disabled="saving"
                      :rules="[(v) => !!v || 'Name is required']"
                    />
                  </v-col>

                  <!-- Field Label -->
                  <v-col cols="12" md="8">
                    <v-text-field
                      v-model="field.label"
                      label="Field Label (displayed)"
                      variant="outlined"
                      density="compact"
                      :disabled="saving"
                    />
                  </v-col>

                  <!-- Required Checkbox -->
                  <v-col cols="12" md="4" class="d-flex align-center">
                    <v-checkbox
                      v-model="field.required"
                      label="Required"
                      density="compact"
                      :disabled="saving"
                      hide-details
                    />
                  </v-col>

                  <!-- Select Options Config -->
                  <v-col v-if="field.type === 'select'" cols="12">
                    <v-divider class="mb-4" />
                    <div class="d-flex justify-space-between align-center mb-2">
                      <span class="text-subtitle-2">Select Options</span>
                      <v-btn
                        size="x-small"
                        prepend-icon="mdi-plus"
                        @click="addSelectOption(field)"
                        :disabled="saving"
                      >
                        Add Option
                      </v-btn>
                    </div>
                    <v-row
                      v-for="(option, optIndex) in field.config?.options || []"
                      :key="optIndex"
                      dense
                    >
                      <v-col cols="5">
                        <v-text-field
                          v-model="option.title"
                          label="Title"
                          variant="outlined"
                          density="compact"
                          :disabled="saving"
                          hide-details
                        />
                      </v-col>
                      <v-col cols="5">
                        <v-text-field
                          v-model="option.value"
                          label="Value"
                          variant="outlined"
                          density="compact"
                          :disabled="saving"
                          hide-details
                        />
                      </v-col>
                      <v-col cols="2" class="d-flex align-center">
                        <v-btn
                          icon="mdi-delete"
                          size="x-small"
                          variant="text"
                          color="error"
                          :disabled="saving"
                          @click="removeSelectOption(field, optIndex)"
                        />
                      </v-col>
                    </v-row>
                  </v-col>

                  <!-- Rating Config -->
                  <v-col v-if="field.type === 'rating'" cols="12">
                    <v-divider class="mb-4" />
                    <v-text-field
                      v-model.number="field.config.max"
                      label="Maximum Rating"
                      type="number"
                      variant="outlined"
                      density="compact"
                      :disabled="saving"
                      min="1"
                      max="10"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}
</style>
