
-- Remove the security definer view; use column-level grants instead
DROP VIEW IF EXISTS public.public_site_settings;

-- Restore public SELECT policy but rely on column-level grants
DROP POLICY IF EXISTS "Public reads site settings" ON public.site_settings;
CREATE POLICY "Public reads site settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);

-- Revoke full-table SELECT and grant only safe columns to anon/authenticated
REVOKE SELECT ON public.site_settings FROM anon, authenticated;
GRANT SELECT (
  id, phone_number, phone_display, whatsapp_number, email_address,
  business_address, business_hours, business_location, site_url,
  facebook_url, instagram_url, tiktok_url,
  google_analytics_id, meta_pixel_id, tiktok_pixel_id, updated_at
) ON public.site_settings TO anon, authenticated;

-- Admins still get full row access via the existing admin policy;
-- ensure service_role retains full access
GRANT ALL ON public.site_settings TO service_role;
