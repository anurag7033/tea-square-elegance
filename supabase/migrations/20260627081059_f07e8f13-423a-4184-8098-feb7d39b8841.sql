-- Grant EXECUTE on has_role so RLS policies (including storage) can call it
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon, service_role;