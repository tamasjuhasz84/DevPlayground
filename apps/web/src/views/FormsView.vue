<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { listForms, createForm } from "../lib/api.js";

const router = useRouter();

// State
const forms = ref([]);
const loading = ref(false);
const error = ref(null);
const createDialog = ref(false);
const creating = ref(false);

// Form data
const newForm = ref({
  name: "",
  description: "",
});

// Data table headers
const headers = [
  { title: "Name", key: "name", sortable: true },
  { title: "Description", key: "description", sortable: false },
  { title: "Status", key: "status", sortable: true },
  { title: "Created", key: "createdAt", sortable: true },
  { title: "Actions", key: "actions", sortable: false, align: "end" },
];

/**
 * Load all forms from API
 */
async function loadForms() {
  loading.value = true;
  error.value = null;

  try {
    forms.value = await listForms();
  } catch (err) {
    error.value = err.message || "Failed to load forms";
    console.error("Error loading forms:", err);
  } finally {
    loading.value = false;
  }
}

/**
 * Open create dialog
 */
function openCreateDialog() {
  newForm.value = {
    name: "",
    description: "",
  };
  createDialog.value = true;
}

/**
 * Close create dialog
 */
function closeCreateDialog() {
  createDialog.value = false;
  newForm.value = {
    name: "",
    description: "",
  };
}

/**
 * Handle form creation
 */
async function handleCreateForm() {
  if (!newForm.value.name.trim()) {
    return;
  }

  creating.value = true;
  error.value = null;

  try {
    const created = await createForm({
      name: newForm.value.name.trim(),
      description: newForm.value.description.trim() || null,
    });

    // Refresh list
    await loadForms();

    // Close dialog
    closeCreateDialog();

    // Navigate to edit view (route will be created in next prompt)
    router.push(`/forms/${created.id}/edit`);
  } catch (err) {
    error.value = err.message || "Failed to create form";
    console.error("Error creating form:", err);
  } finally {
    creating.value = false;
  }
}

/**
 * Navigate to form editor
 */
function editForm(form) {
  router.push(`/forms/${form.id}/edit`);
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  if (!dateString) return "N/A";

  try {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

// Load forms on mount
onMounted(() => {
  loadForms();
});
</script>

<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Forms</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Manage and create forms</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog" :disabled="loading">
        Create Form
      </v-btn>
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

    <!-- Forms Data Table -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="forms"
        :loading="loading"
        :items-per-page="10"
        class="elevation-1"
      >
        <!-- Status column -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="item.status === 'active' ? 'success' : 'default'"
            size="small"
            variant="flat"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Created date column -->
        <template v-slot:item.createdAt="{ item }">
          <span class="text-caption">
            {{ formatDate(item.createdAt) }}
          </span>
        </template>

        <!-- Actions column -->
        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="small" variant="text" @click="editForm(item)" />
        </template>

        <!-- Loading state -->
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@5" />
        </template>

        <!-- No data state -->
        <template v-slot:no-data>
          <div class="text-center py-8">
            <v-icon size="64" color="grey-lighten-1" class="mb-4"> mdi-form-select </v-icon>
            <p class="text-h6 text-medium-emphasis">No forms yet</p>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Create your first form to get started
            </p>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
              Create Form
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Create Form Dialog -->
    <v-dialog v-model="createDialog" max-width="600" persistent>
      <v-card>
        <v-card-title class="text-h5"> Create New Form </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="handleCreateForm">
            <v-text-field
              v-model="newForm.name"
              label="Form Name"
              placeholder="e.g., Customer Feedback"
              variant="outlined"
              :rules="[(v) => !!v || 'Name is required']"
              autofocus
              class="mb-4"
              :disabled="creating"
            />

            <v-textarea
              v-model="newForm.description"
              label="Description (optional)"
              placeholder="Brief description of this form"
              variant="outlined"
              rows="3"
              :disabled="creating"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeCreateDialog" :disabled="creating"> Cancel </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="handleCreateForm"
            :loading="creating"
            :disabled="!newForm.name.trim() || creating"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
