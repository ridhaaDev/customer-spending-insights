import type { StorybookConfig } from "@storybook/nextjs-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  framework: "@storybook/nextjs-vite",
  stories: ["../src/stories/**/*.stories.@(ts|tsx)"],
  addons: [],
  // Next's Tailwind loader is Turbopack-only, so Storybook's Vite builder needs the Tailwind plugin.
  viteFinal: async (viteConfig) => {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()];
    return viteConfig;
  },
};

export default config;
