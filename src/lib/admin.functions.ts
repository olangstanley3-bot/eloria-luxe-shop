import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: roleData, error: roleError } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError || !roleData) {
      throw new Response("Forbidden", { status: 403 });
    }

    const { count: productCount } = await context.supabase
      .from("products")
      .select("*", { count: "exact", head: true });
    const { count: categoryCount } = await context.supabase
      .from("categories")
      .select("*", { count: "exact", head: true });
    const { count: imageCount } = await context.supabase
      .from("product_images")
      .select("*", { count: "exact", head: true });
    const { count: enquiryCount } = await context.supabase
      .from("enquiries")
      .select("*", { count: "exact", head: true });

    return {
      productCount: productCount ?? 0,
      categoryCount: categoryCount ?? 0,
      imageCount: imageCount ?? 0,
      enquiryCount: enquiryCount ?? 0,
    };
  });

export const checkAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error || !data) {
      throw new Response("Forbidden", { status: 403 });
    }
    return { isAdmin: true };
  });
