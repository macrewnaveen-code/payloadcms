import type { CollectionConfig } from 'payload';

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Article', plural: 'Articles' },
  admin: { useAsTitle: 'title' },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'lang', type: 'text', defaultValue: 'en' },
    { name: 'excerpt', type: 'textarea', label: 'Short Excerpt' },
    { name: 'content', type: 'textarea', required: true, label: 'Full Content (HTML/Text)', maxLength: 1000000 },
    { name: 'date', type: 'date', required: true },
    { name: 'modified', type: 'date', label: 'Last Modified' },
    { name: 'link', type: 'text', label: 'Original Link' },
    { 
      name: 'featuredImage', 
      type: 'group', 
      label: 'Featured Image',
      fields: [
        { name: 'url', type: 'text', label: 'Image URL' },
        { name: 'width', type: 'number', label: 'Width' },
        { name: 'height', type: 'number', label: 'Height' },
        { name: 'alt', type: 'text', label: 'Alt Text' },
        { name: 'id', type: 'text', label: 'Image ID' },
      ]
    },
    { name: 'author', type: 'relationship', relationTo: 'authors', hasMany: false },
    { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
  ],
};
