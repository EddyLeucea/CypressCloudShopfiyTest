import { defineConfig } from "cypress"

export default defineConfig({
  projectId: "1zreq5",
  allowCypressEnv: false,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
