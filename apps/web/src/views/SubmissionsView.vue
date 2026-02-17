<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { listForms, listSubmissions } from "../lib/api.js";

// State
const forms = ref([]);
const selectedFormId = ref(null);
const submissions = ref([]);
const loading = ref(false);
const error = ref(null);

// Dialog state
const viewDialog = ref(false);
const selectedSubmission = ref(null);

// Data table headers
const headers = [
  { title: "Created At", key: "createdAt", sortable: true },
  { title: "Status", key: "status", sortable: true },
  { title: "ID", key: "id", sortable: false },
  { title: "Actions", key: "actions", sortable: false, align: "end" },
];

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
 * Load submissions for selected form
 */
async function loadSubmissionsForForm() {
  if (!selectedFormId.value) {
    submissions.value = [];
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const data = await listSubmissions(selectedFormId.value);
    // Sort by createdAt descending (latest first)
    submissions.value = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (err) {
    error.value = err.message || "Failed to load submissions";
    submissions.value = [];
  } finally {
    loading.value = false;
  }
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

/**
 * Shorten ID for display
 */
function shortId(id) {
  if (!id) return "";
  return id.length > 8 ? id.substring(0, 8) + "..." : id;
}

/**
 * Open view dialog for submission
 */
function viewPayload(submission) {
  selectedSubmission.value = submission;
  viewDialog.value = true;
}

/**
 * Close view dialog
 */
function closeDialog() {
  viewDialog.value = false;
  selectedSubmission.value = null;
}

/**
 * Get form items for v-select
 */
const formItems = computed(() => {
  return forms.value.map((f) => ({
    value: f.id,
    title: f.name,
  }));
});

/**
 * Get pretty-printed JSON payload
 */
const prettyPayload = computed(() => {
  if (!selectedSubmission.value?.payload) return "{}";
  try {
    return JSON.stringify(selectedSubmission.value.payload, null, 2);
  } catch {
    return String(selectedSubmission.value.payload);
  }
});

// Watch for form selection changes
watch(selectedFormId, () => {
  loadSubmissionsForForm();
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
      <h1 class="text-h4 font-weight-bold">Submissions</h1>
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

    <!-- Form Selector -->
    <v-select
      v-model="selectedFormId"
      label="Select a Form"
      :items="formItems"
      item-title="title"
      item-value="value"
      variant="outlined"
      :loading="loading && !selectedFormId"
      :disabled="loading && !selectedFormId"
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

    <!-- Submissions Table -->
    <v-data-table
      v-else
      :headers="headers"
      :items="submissions"
      :loading="loading"
      :items-per-page="10"
    >
      <!-- Created date column -->
      <template v-slot:item.createdAt="{ item }">
        {{ formatDate(item.createdAt) }}
      </template>

      <!-- Status column -->
      <template v-slot:item.status="{ item }">
        <v-chip :color="item.status === 'submitted' ? 'success' : 'default'" size="small">
          {{ item.status }}
        </v-chip>
      </template>

      <!-- ID column (shortened) -->
      <template v-slot:item.id="{ item }">
        <span class="text-caption text-medium-emphasis">{{ shortId(item.id) }}</span>
      </template>

      <!-- Actions column -->
      <template v-slot:item.actions="{ item }">
        <v-btn size="small" variant="text" @click="viewPayload(item)"> View payload </v-btn>
      </template>

      <!-- No data state -->
      <template v-slot:no-data>
        <div class="text-center py-8 text-medium-emphasis">No submissions yet</div>
      </template>
    </v-data-table>

    <!-- View Payload Dialog -->
    <v-dialog v-model="viewDialog" max-width="800">
      <v-card v-if="selectedSubmission">
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Submission Payload</span>
          <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
        </v-card-title>

        <v-card-text>
          <pre style="overflow-x: auto; font-family: monospace; font-size: 0.875rem">{{
            prettyPayload
          }}</pre>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
