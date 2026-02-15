import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type SendMessageInput } from "@shared/routes";
import { supabase } from "@/lib/supabase";

// POST /api/messages -> Supabase Insert
export function useSendMessage() {
  return useMutation({
    mutationFn: async (data: SendMessageInput) => {
      // Map the input to the Supabase table columns
      const { error } = await supabase
        .from('messages')
        .insert({
          type: data.type,
          content: data.content,
          vibe: data.vibe,
          bouquet_id: data.bouquetId,
          note: data.note,
          sender_device: data.senderDevice,
          sender_location: data.senderLocation,
          instagram_username: data.instagramUsername, // Added field
        });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    },
  });
}

// GET /api/creators/:id/messages -> Supabase Select
export function useMessages(creatorId: number | undefined) {
  return useQuery({
    queryKey: ['messages', creatorId], // simplified key
    queryFn: async () => {
      // For now, we ignore creatorId since it's Single Admin, 
      // or we could filter if we add a creator_id column later.
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      // Map Supabase snake_case to camelCase for frontend
      return data.map((msg: any) => ({
        id: msg.id,
        type: msg.type,
        content: msg.content,
        vibe: msg.vibe,
        bouquetId: msg.bouquet_id,
        note: msg.note,
        isRead: msg.is_read,
        createdAt: new Date(msg.created_at),
        senderTimestamp: msg.created_at, // using created_at as timestamp
        senderDevice: msg.sender_device,
        senderLocation: msg.sender_location,
        instagramUsername: msg.instagram_username // Map new field
      }));
    },
    // Only fetch if we are "logged in" (creatorId is present)
    enabled: !!creatorId,
  });
}
