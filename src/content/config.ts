import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      // author: z.string().default(SITE.author),
      createdAt: z.date(),
      updatedAt: z.date().optional(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      // ogImage: image()
      //   .refine((img) => img.width >= 1200 && img.height >= 630, {
      //     message: "OpenGraph image must be at least 1200 X 630 pixels!",
      //   })
      //   .or(z.string())
      //   .optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      // editPost: z
      //   .object({
      //     disabled: z.boolean().optional(),
      //     url: z.string().optional(),
      //     text: z.string().optional(),
      //     appendFilePath: z.boolean().optional(),
      //   })
      //   .optional(),
    }),
});

const project = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/project" }),
  schema: ({ image }) =>
    z.object({
      // author: z.string().default(SITE.author),
      createdAt: z.date(),
      updatedAt: z.date().optional(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      // ogImage: image()
      //   .refine((img) => img.width >= 1200 && img.height >= 630, {
      //     message: "OpenGraph image must be at least 1200 X 630 pixels!",
      //   })
      //   .or(z.string())
      //   .optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      // editPost: z
      //   .object({
      //     disabled: z.boolean().optional(),
      //     url: z.string().optional(),
      //     text: z.string().optional(),
      //     appendFilePath: z.boolean().optional(),
      //   })
      //   .optional(),
    }),
});

// const projects = defineCollection({});

export const collections = {
  blog,
  project,
};
