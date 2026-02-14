import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type SendMessageInput } from "@shared/routes";

// POST /api/messages
export function useSendMessage() {
  return useMutation({
    mutationFn: async (data: SendMessageInput) => {
      const validated = api.messages.send.input.parse(data);
      const res = await fetch(api.messages.send.path, {
        method: api.messages.send.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message);
        }
        throw new Error('Failed to send message');
      }

      return api.messages.send.responses[201].parse(await res.json());
    },
  });
}

// GET /api/creators/:id/messages
export function useMessages(creatorId: number | undefined) {
  return useQuery({
    queryKey: [api.messages.list.path, creatorId],
    queryFn: async () => {
      if (!creatorId) throw new Error("Creator ID required");
      
      const url = buildUrl(api.messages.list.path, { id: creatorId });
      const res = await fetch(url);
      
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error('Failed to fetch messages');
      }
      
      return api.messages.list.responses[200].parse(await res.json());
    },
    enabled: !!creatorId,
  });
}
