import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { codeInput } from "@sanity/code-input";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";
import { colorInput } from "@sanity/color-input";

const singletonActions = new Set(["publish", "discardChanges", "restore"]);
const singletonTypes = new Set([
  "firstSite",
  "generalConfig",
  "mainTopic",
  "pinnedPost",
  "visitCounter",
  "adds",
]);

export default defineConfig({
  name: "default",
  title: "news-content",

  projectId: process.env.SANITY_STUDIO_API_PROJECT_ID ?? "",
  dataset: "production",

  plugins: [
    structureTool({ structure }),
    visionTool(),
    codeInput(),
    colorInput(),
  ],

  schema: {
    types: schemaTypes,

    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
});
