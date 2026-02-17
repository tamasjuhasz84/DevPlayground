<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const apiBase = import.meta.env.VITE_API_BASE ?? "http://localhost:3001";
const health = ref(null);
const error = ref("");

async function loadHealth() {
  error.value = "";
  try {
    const { data } = await axios.get(`${apiBase}/health`);
    health.value = data;
  } catch (e) {
    error.value = "Nem érem el az API-t. Fut az apps/api?";
  }
}

onMounted(loadHealth);
</script>

<template>
  <div>
    <h1 class="text-h4 font-weight-bold">Dashboard</h1>

    <v-row class="mt-4">
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Dynamic Form</v-card-title>
          <v-card-text>Admin szerkesztő + kitöltő nézet + submissions lista/export.</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Realtime status</v-card-title>
          <v-card-text>Submission feldolgozás státusz push WebSocketen.</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Quality</v-card-title>
          <v-card-text>Jest/Vitest, lint/format, GitHub Actions pipeline.</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mt-8">
      <v-card-title>API kapcsolat</v-card-title>
      <v-card-text>
        <div v-if="error" class="text-error">{{ error }}</div>
        <div v-else-if="health">
          <div><b>ok:</b> {{ health.ok }}</div>
          <div><b>service:</b> {{ health.service }}</div>
          <div><b>time:</b> {{ health.time }}</div>
        </div>
        <div v-else>Betöltés…</div>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="loadHealth" variant="tonal">Újrapróbál</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
