
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO postgres, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO postgres, service_role;

DO $$
DECLARE
  r RECORD;
  new_using TEXT;
  new_check TEXT;
  cmd_text TEXT;
  roles_text TEXT;
BEGIN
  FOR r IN
    SELECT n.nspname AS schema_name,
           c.relname AS table_name,
           p.polname,
           p.polcmd,
           pg_get_expr(p.polqual, p.polrelid) AS using_expr,
           pg_get_expr(p.polwithcheck, p.polrelid) AS check_expr,
           (SELECT string_agg(quote_ident(rol.rolname::text), ', ')
              FROM unnest(p.polroles) x(oid)
              JOIN pg_roles rol ON rol.oid = x.oid) AS roles
    FROM pg_policy p
    JOIN pg_class c ON c.oid = p.polrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE (pg_get_expr(p.polqual, p.polrelid) LIKE '%has_role(%'
        OR pg_get_expr(p.polwithcheck, p.polrelid) LIKE '%has_role(%')
  LOOP
    new_using := coalesce(r.using_expr, '');
    new_check := coalesce(r.check_expr, '');
    new_using := replace(new_using, 'public.has_role(', 'has_role(');
    new_check := replace(new_check, 'public.has_role(', 'has_role(');
    new_using := replace(new_using, 'has_role(', 'private.has_role(');
    new_check := replace(new_check, 'has_role(', 'private.has_role(');

    roles_text := coalesce(r.roles, 'public');

    EXECUTE format('DROP POLICY %I ON %I.%I', r.polname, r.schema_name, r.table_name);

    cmd_text := CASE r.polcmd
      WHEN 'r' THEN 'SELECT' WHEN 'a' THEN 'INSERT'
      WHEN 'w' THEN 'UPDATE' WHEN 'd' THEN 'DELETE'
      ELSE 'ALL' END;

    IF cmd_text = 'INSERT' THEN
      EXECUTE format('CREATE POLICY %I ON %I.%I FOR INSERT TO %s WITH CHECK (%s)',
        r.polname, r.schema_name, r.table_name, roles_text, new_check);
    ELSIF cmd_text = 'UPDATE' THEN
      EXECUTE format('CREATE POLICY %I ON %I.%I FOR UPDATE TO %s USING (%s) WITH CHECK (%s)',
        r.polname, r.schema_name, r.table_name, roles_text, new_using, new_check);
    ELSIF cmd_text = 'ALL' THEN
      EXECUTE format('CREATE POLICY %I ON %I.%I FOR ALL TO %s USING (%s) WITH CHECK (%s)',
        r.polname, r.schema_name, r.table_name, roles_text, new_using, new_check);
    ELSE
      EXECUTE format('CREATE POLICY %I ON %I.%I FOR %s TO %s USING (%s)',
        r.polname, r.schema_name, r.table_name, cmd_text, roles_text, new_using);
    END IF;
  END LOOP;
END $$;

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

DROP POLICY IF EXISTS "Public reads site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Auth reads site settings" ON public.site_settings;

CREATE POLICY "Admins read site settings" ON public.site_settings
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

REVOKE SELECT ON public.site_settings FROM anon;

CREATE OR REPLACE VIEW public.public_site_settings AS
SELECT
  id, phone_number, phone_display, whatsapp_number, email_address,
  business_address, business_hours, business_location, site_url,
  facebook_url, instagram_url, tiktok_url,
  google_analytics_id, meta_pixel_id, tiktok_pixel_id, updated_at
FROM public.site_settings;

ALTER VIEW public.public_site_settings OWNER TO postgres;
GRANT SELECT ON public.public_site_settings TO anon, authenticated;
