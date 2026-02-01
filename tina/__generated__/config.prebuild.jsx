// tina/config.ts
import { defineConfig } from "tinacms";
var config_default = defineConfig({
  branch: "",
  clientId: "",
  token: "",
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "prompt",
        label: "Prompts",
        path: "content/prompts",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "type",
            label: "Type",
            required: true,
            options: ["Prompts", "Image Prompts", "Skills"]
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            required: true,
            options: [
              "Creative",
              "Technical",
              "Business",
              "Academic",
              "Persona",
              "Cinematic",
              "Portrait",
              "Stylized",
              "Architecture",
              "Engineering",
              "Writing",
              "Strategy",
              "Design"
            ]
          },
          {
            type: "string",
            name: "shortDescription",
            label: "Short Description",
            required: true,
            ui: {
              component: "textarea"
            }
          },
          {
            type: "string",
            name: "skills",
            label: "Skills",
            list: true
          },
          {
            type: "rich-text",
            name: "body",
            label: "Full Prompt",
            isBody: true
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
