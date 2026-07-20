
DROP POLICY IF EXISTS "Anyone can submit enquiry (anon)" ON public.enquiries;
DROP POLICY IF EXISTS "Anyone can submit enquiry (auth)" ON public.enquiries;

CREATE POLICY "Anyone can submit enquiry (anon)"
  ON public.enquiries FOR INSERT TO anon
  WITH CHECK (
    status = 'new'
    AND kind IN ('contact','newsletter','quote','callback')
    AND (
      (message IS NOT NULL AND length(trim(message)) BETWEEN 1 AND 4000)
      OR (email IS NOT NULL AND length(trim(email)) BETWEEN 3 AND 320)
    )
  );

CREATE POLICY "Anyone can submit enquiry (auth)"
  ON public.enquiries FOR INSERT TO authenticated
  WITH CHECK (
    status = 'new'
    AND kind IN ('contact','newsletter','quote','callback')
    AND (
      (message IS NOT NULL AND length(trim(message)) BETWEEN 1 AND 4000)
      OR (email IS NOT NULL AND length(trim(email)) BETWEEN 3 AND 320)
    )
  );
