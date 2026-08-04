## Goal

Turn Eloria Store into an admin-manageable storefront: database-backed catalog, image storage, secure admin login, and a full CRUD dashboard — while keeping the premium public design untouched.

## Phase 1 — Backend foundation (Lovable Cloud)

1. Enable Lovable Cloud (Supabase under the hood — you don't need any external account).
2. Create schema:
   - `categories` (slug, name, tagline, sort_order, hero_image_url)
   - `collections` (name, category_id)
   - `products` (name, slug, category_id, collection, price_kes, original_price_kes, description, features[], colors[], sizes[], stock, rating, reviews, tag, is_active, sort_order)
   - `product_images` (product_id, url, alt, position) — enables real galleries
   - `homepage_sections` (banners, promo strips — editable)
   - `site_settings` (WhatsApp, phone, Instagram, address — editable)
   - `enquiries` (name, email, message, status) — captures contact form + newsletter
   - `app_role` enum + `user_roles` table + `has_role()` security-definer function (RLS-safe admin check)
3. Create Storage bucket `product-images` (public read, admin write).
4. RLS: public SELECT on active products/categories/settings; admin-only INSERT/UPDATE/DELETE via `has_role(auth.uid(), 'admin')`.

## Phase 2 — Seed data & image ingestion

1. Migrate every existing product from `src/lib/products.ts` into the DB (I'll write a migration `INSERT` block).
2. Extract the 93 ZIP images, dedupe by hash, upload to the `product-images` bucket.
3. Categorize by visually sampling batches (I already saw sofa covers, shoes, bedsheets in the zip). For each image, I'll assign it to one of: Curtains, Bedding & Home Textiles, Sofa Covers (new), Handbags, Shoes, or a temp **"Uncategorized"** category that only admins can see — flagged for your review from the dashboard.
4. Group visually similar images into single products with galleries where obvious; keep singletons otherwise. Generic launch names (e.g. "Chocolate Ruffle Sofa Cover Set") — you'll rename them from the dashboard.

## Phase 3 — Admin dashboard (`/admin`)

Auth-gated (email/password + Google sign-in), `admin` role required.

**Screens:**

- **Dashboard home** — quick stats: product count, enquiries, low-stock.
- **Products** — table + filters, inline stock/price edits, add/edit modal with drag-and-drop image gallery, tag toggles (New / Bestseller / Sale), archive toggle.
- **Categories & Collections** — reorder, rename, upload hero image.
- **Uncategorized queue** — the images I couldn't confidently classify. One click to assign to a product/category.
- **Homepage** — edit hero copy, promo strip text, featured product IDs.
- **Site Settings** — WhatsApp, phone, Instagram, address, business hours.
- **Enquiries** — inbox of contact form submissions + newsletter signups, mark as read/replied.

**First admin account:** After Cloud is enabled you'll sign up once, then I'll run a one-time SQL insert to grant your user the `admin` role. I'll give you the email/password steps in-chat.

## Phase 4 — Public site rewrites

- Replace `src/lib/products.ts` imports with server-fn loaders reading from the DB (loader → TanStack Query pattern).
- Product page uses the real `product_images` gallery.
- Category page pulls dynamically; new **Sofa Covers** category shows up in the mega menu automatically.
- Homepage banners and site settings (WhatsApp number, address) come from `site_settings` so you can update them without a redeploy.
- Contact form + newsletter write to `enquiries`.

## Phase 5 — Polish (only after 1–4 are solid)

- Category-page filters (price / color / size) and sort dropdown.
- Trust-signals strip on homepage (Secure Checkout · Nationwide Delivery · Easy Returns).
- Product badges (Best Seller / New Arrival) driven by DB tags.
- SEO already largely in place; I'll re-verify sitemap picks up DB products.

## What I need from you before I start

Nothing to start Phases 1–3. You'll need to:

1. **Sign up on the site once** after I enable auth so I can promote your account to admin.
2. **Confirm the new "Sofa Covers" category name** (or suggest another).

## Out of scope for this turn — needs your input later

Not blockers for launch; call these out when you're ready:

- **Google Analytics / Meta Pixel / TikTok Pixel** — send the IDs and I'll wire them in.
- **Google Search Console** — send the verification tag.
- **Payments (M-Pesa / card)** — separate integration; WhatsApp checkout stays as the primary CTA.
- **Newsletter delivery** (Mailchimp/Resend) — for now signups just go into `enquiries`.

## Realism note

This is a genuinely large change — schema, RLS, storage, auth, admin UI, public rewrites, 93 images categorized. It won't all land in one message. I'll ship in the order above and pause after Phase 2 so you can spot-check the seeded catalog before we lock the admin UI on top.

Approve this plan and I'll start with Phase 1 (enable Cloud + schema + storage bucket).
