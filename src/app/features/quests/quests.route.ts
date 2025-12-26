import { Routes } from "@angular/router";

export default [
  {
    path: "",
    loadComponent: () => import("./pages/quests/quests.component")
      .then(m => m.QuestsComponent),
  }
] satisfies Routes;