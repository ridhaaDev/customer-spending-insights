import type { Decorator, Preview } from "@storybook/nextjs-vite";
import { useEffect, type ReactNode } from "react";
import "../src/app/globals.css";

// Mirrors the toolbar choice onto <html data-theme>, which globals.css honours over the OS setting.
function ThemeFrame({ theme, children }: { theme: string; children: ReactNode }) {
  useEffect(() => {
    if (theme === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
  }, [theme]);
  return <div className="bg-surface p-6 text-ink">{children}</div>;
}

const withTheme: Decorator = (Story, { globals }) => (
  <ThemeFrame theme={globals.theme as string}>
    <Story />
  </ThemeFrame>
);

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: "Colour scheme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "system", title: "System" },
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "system" },
  parameters: {
    backgrounds: { disable: true },
    layout: "fullscreen",
    controls: { expanded: true },
  },
};

export default preview;
