import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type LoginInput, type CreateCreatorInput } from "@shared/routes";

// GET /api/creators/:slug
export function useCreator(slug: string | null) {
  return useQuery({
    queryKey: [api.creators.getBySlug.path, slug],
    queryFn: async () => {
      if (!slug) return null;
      const url = buildUrl(api.creators.getBySlug.path, { slug });
      const res = await fetch(url);
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch creator');
      
      return api.creators.getBySlug.responses[200].parse(await res.json());
    },
    enabled: !!slug,
    retry: false,
  });
}

// POST /api/creators
export function useCreateCreator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCreatorInput) => {
      const validated = api.creators.create.input.parse(data);
      const res = await fetch(api.creators.create.path, {
        method: api.creators.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        if (res.status === 400 || res.status === 409) {
          const error = await res.json();
          throw new Error(error.message || 'Validation failed');
        }
        throw new Error('Failed to create account');
      }
      
      return api.creators.create.responses[201].parse(await res.json());
    },
    // We don't invalidate queries here as the user just created their account
  });
}

// POST /api/login
export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const validated = api.creators.login.input.parse(data);
      const res = await fetch(api.creators.login.path, {
        method: api.creators.login.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Invalid passcode');
        }
        throw new Error('Login failed');
      }

      return api.creators.login.responses[200].parse(await res.json());
    },
  });
}
