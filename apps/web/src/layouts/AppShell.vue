<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const drawer = ref(true);
const router = useRouter();

const items = [
  { title: "Dashboard", to: "/" },
  { title: "Form Builder", to: "/forms" },
  { title: "Fill Form", to: "/fill" },
  { title: "Submissions", to: "/submissions" },
  { title: "Quality", to: "/quality" },
];

function go(to) {
  router.push(to);
}
</script>

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-subheader>Dev Playground</v-list-subheader>

        <v-list-item v-for="it in items" :key="it.to" :title="it.title" @click="go(it.to)" />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>Dev Playground</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container class="py-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>
