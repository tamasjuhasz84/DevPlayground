import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/DashboardView.vue";
import FormsView from "../views/FormsView.vue";
import FormEditorView from "../views/FormEditorView.vue";
import FillView from "../views/FillView.vue";
import SubmissionsView from "../views/SubmissionsView.vue";
import QualityView from "../views/QualityView.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: DashboardView },
    { path: "/forms", component: FormsView },
    { path: "/forms/:id/edit", component: FormEditorView },
    { path: "/fill", component: FillView },
    { path: "/submissions", component: SubmissionsView },
    { path: "/quality", component: QualityView },
  ],
});
