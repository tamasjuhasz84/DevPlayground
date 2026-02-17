<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-2">Quality & Testing</h1>
        <p class="text-subtitle-1 text-medium-emphasis mb-6">
          Comprehensive testing, linting, and continuous integration for enterprise-grade code
          quality.
        </p>
      </v-col>
    </v-row>

    <!-- Tools & Technologies -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="text-h5 bg-primary">
            <v-icon icon="mdi-tools" class="mr-2"></v-icon>
            Tools & Technologies
          </v-card-title>
          <v-card-text class="mt-4">
            <v-list density="comfortable">
              <v-list-item>
                <v-list-item-title class="font-weight-bold">ESLint 10</v-list-item-title>
                <v-list-item-subtitle>
                  JavaScript/ES6+ linting with flat config format
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Prettier</v-list-item-title>
                <v-list-item-subtitle>
                  Opinionated code formatter (100 char width, semicolons, double quotes)
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Jest + Supertest</v-list-item-title>
                <v-list-item-subtitle>
                  API testing with HTTP request simulation
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Vitest + jsdom</v-list-item-title>
                <v-list-item-subtitle>
                  Fast unit testing for Vue components and utilities
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">GitHub Actions</v-list-item-title>
                <v-list-item-subtitle>
                  Automated CI pipeline on push and pull requests
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Running Commands -->
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="text-h5 bg-secondary">
            <v-icon icon="mdi-console" class="mr-2"></v-icon>
            Running Commands
          </v-card-title>
          <v-card-text class="mt-4">
            <v-list density="comfortable">
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Lint All Workspaces</v-list-item-title>
                <v-list-item-subtitle>
                  <code class="bg-grey-lighten-3 px-2 py-1">pnpm lint</code>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Format All Code</v-list-item-title>
                <v-list-item-subtitle>
                  <code class="bg-grey-lighten-3 px-2 py-1">pnpm format</code>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Test All Workspaces</v-list-item-title>
                <v-list-item-subtitle>
                  <code class="bg-grey-lighten-3 px-2 py-1">pnpm test</code>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Test API Only</v-list-item-title>
                <v-list-item-subtitle>
                  <code class="bg-grey-lighten-3 px-2 py-1">pnpm --filter @dp/api test</code>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Test Web Only</v-list-item-title>
                <v-list-item-subtitle>
                  <code class="bg-grey-lighten-3 px-2 py-1">pnpm --filter web test</code>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Generate Coverage</v-list-item-title>
                <v-list-item-subtitle>
                  <code class="bg-grey-lighten-3 px-2 py-1">pnpm --filter @dp/api coverage</code>
                  <br />
                  <code class="bg-grey-lighten-3 px-2 py-1">pnpm --filter web coverage</code>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Coverage & CI -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="text-h5 bg-success">
            <v-icon icon="mdi-chart-line" class="mr-2"></v-icon>
            Coverage Reports
          </v-card-title>
          <v-card-text class="mt-4">
            <p class="mb-4">
              Coverage reports are generated in HTML, LCOV, and text formats for detailed analysis.
            </p>
            <v-list density="comfortable">
              <v-list-item>
                <v-list-item-title class="font-weight-bold">API Coverage</v-list-item-title>
                <v-list-item-subtitle>
                  <code class="text-caption">apps/api/coverage/index.html</code>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Web Coverage</v-list-item-title>
                <v-list-item-subtitle>
                  <code class="text-caption">apps/web/coverage/index.html</code>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">CI Artifacts</v-list-item-title>
                <v-list-item-subtitle>
                  Coverage uploaded to GitHub Actions on every CI run
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <v-alert type="info" variant="tonal" class="mt-4">
              Open <code>coverage/index.html</code> in a browser to view line-by-line coverage
              details.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Test Suites -->
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="text-h5 bg-info">
            <v-icon icon="mdi-test-tube" class="mr-2"></v-icon>
            Test Suites
          </v-card-title>
          <v-card-text class="mt-4">
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <strong>API Tests (Jest)</strong>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <ul class="ml-4">
                    <li><code>health.test.js</code> - Health endpoint smoke tests</li>
                    <li><code>forms.test.js</code> - Form CRUD, schema saving, field ordering</li>
                  </ul>
                  <p class="mt-2 text-caption">
                    Tests use Supertest to call Express routes without binding to a port.
                  </p>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-title>
                  <strong>Web Tests (Vitest)</strong>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <ul class="ml-4">
                    <li><code>api.test.js</code> - API client error handling and unwrapping</li>
                  </ul>
                  <p class="mt-2 text-caption">
                    Tests mock axios to verify request/response logic without real HTTP calls.
                  </p>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Code Style & Conventions -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="text-h5 bg-deep-purple">
            <v-icon icon="mdi-code-braces" class="mr-2"></v-icon>
            Code Style & Conventions
          </v-card-title>
          <v-card-text class="mt-4">
            <v-row>
              <v-col cols="12" md="4">
                <h3 class="text-h6 mb-3">Formatting Rules</h3>
                <v-chip class="ma-1" size="small">Semicolons: Required</v-chip>
                <v-chip class="ma-1" size="small">Quotes: Double</v-chip>
                <v-chip class="ma-1" size="small">Line Width: 100</v-chip>
                <v-chip class="ma-1" size="small">Tab Width: 2 spaces</v-chip>
                <v-chip class="ma-1" size="small">Trailing Commas: ES5</v-chip>
              </v-col>

              <v-col cols="12" md="4">
                <h3 class="text-h6 mb-3">Naming Conventions</h3>
                <p class="text-body-2 mb-2">
                  <strong>Variables:</strong> camelCase (<code>formData</code>)
                </p>
                <p class="text-body-2 mb-2">
                  <strong>Components:</strong> PascalCase (<code>FormsView.vue</code>)
                </p>
                <p class="text-body-2 mb-2">
                  <strong>Functions:</strong> camelCase (<code>getForm</code>)
                </p>
                <p class="text-body-2 mb-2">
                  <strong>Constants:</strong> UPPER_SNAKE_CASE (when appropriate)
                </p>
                <p class="text-body-2 mb-2">
                  <strong>Unused args:</strong> Prefix with <code>_</code>
                </p>
              </v-col>

              <v-col cols="12" md="4">
                <h3 class="text-h6 mb-3">Best Practices</h3>
                <ul class="ml-4">
                  <li class="mb-2">ES modules (ESM) everywhere</li>
                  <li class="mb-2">Async/await over promises</li>
                  <li class="mb-2">Destructuring imports</li>
                  <li class="mb-2">Explicit error handling</li>
                  <li class="mb-2">Type-safe with Zod validation</li>
                  <li class="mb-2">Repository pattern for data access</li>
                </ul>
              </v-col>
            </v-row>

            <v-divider class="my-6"></v-divider>

            <v-row>
              <v-col cols="12">
                <h3 class="text-h6 mb-3">Continuous Integration</h3>
                <p class="text-body-2 mb-3">
                  Every push and pull request triggers automated checks via GitHub Actions:
                </p>
                <v-stepper alt-labels>
                  <v-stepper-header>
                    <v-stepper-item title="Install" value="1"></v-stepper-item>
                    <v-divider></v-divider>
                    <v-stepper-item title="Lint" value="2"></v-stepper-item>
                    <v-divider></v-divider>
                    <v-stepper-item title="Test" value="3"></v-stepper-item>
                    <v-divider></v-divider>
                    <v-stepper-item title="Coverage" value="4"></v-stepper-item>
                  </v-stepper-header>
                </v-stepper>
                <v-alert type="success" variant="tonal" class="mt-4">
                  <strong>CI Status:</strong> Check the badge at the top of the README for current
                  build health.
                </v-alert>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// No dynamic data needed - static quality dashboard
</script>
