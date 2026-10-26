import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";

// The App Router build runs in the rsc environment with ssr as its child. `vinext init`
// wrote a bare `cloudflare()` because app/ did not exist yet; with the bare form the
// plugin builds a third, worker-named environment and fails to resolve
// virtual:vite-rsc/encryption-key (research.md (b), T001 note).
export default defineConfig({
  plugins: [
    vinext(),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
});
