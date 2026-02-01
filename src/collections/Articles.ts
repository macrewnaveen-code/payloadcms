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
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        console.log('🔄 Article webhook hook triggered:', { operation, docId: doc?.id, slug: doc?.slug });
        console.log('🔄 Environment check:', {
          ASTRO_WEBHOOK_URL: process.env.ASTRO_WEBHOOK_URL,
          PAYLOAD_WEBHOOK_SECRET: process.env.PAYLOAD_WEBHOOK_SECRET ? 'SET' : 'NOT SET'
        });

        try {
          const webhookUrl = process.env.ASTRO_WEBHOOK_URL || 'http://localhost:4321/api/payload-webhook';
          const webhookSecret = process.env.PAYLOAD_WEBHOOK_SECRET;

          console.log('🔄 Sending webhook to:', webhookUrl);

          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(webhookSecret && { 'x-payload-webhook-secret': webhookSecret }),
            },
            body: JSON.stringify({
              type: operation,
              collection: 'articles',
              doc,
              timestamp: new Date().toISOString(),
            }),
          });

          if (response.ok) {
            console.log(`✅ Webhook sent for articles ${operation}: ${doc.slug || doc.id}`);
          } else {
            console.error(`❌ Webhook failed: ${response.status} ${response.statusText}`);
          }
        } catch (error) {
          console.error('❌ Webhook error:', error);
        }
      },
    ],
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
