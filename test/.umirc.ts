import { defineConfig } from "umi";

export default defineConfig({
  mfsu: false,
  routes: [
    { path: "/", component: "index" },
  ],
  npmClient: "pnpm",
});
