import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type SendMessageInput } from "@shared/routes";
import { supabase } from "@/lib/supabase";

// POST /api/messages -> Supabase Insert
export function useSendMessage() {
  return useMutation({
    mutationFn: async (data: SendMessageInput) => {
      // Capture IP (Best effort client-side)
      let ip = 'Unknown';
      try {
        const res = await fetch('https://api64.ipify.org?format=json');
        const json = await res.json();
        ip = json.ip;
      } catch (e) {
        console.error("Failed to fetch IP", e);
      }

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
          sender_ip: ip, // Store IP
          instagram_username: data.instagramUsername,
          recipient_name: data.recipientName,
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
        senderIp: msg.sender_ip, // Map IP
        instagramUsername: msg.instagram_username,
        recipientName: msg.recipient_name,
        isPublic: msg.is_public // Map moderation field
      }));
    },
    // Only fetch if we are "logged in" (creatorId is present)
    enabled: !!creatorId,
  });
}

// GET /feed -> Public Approved Messages
export function usePublicMessages() {
  return useQuery({
    queryKey: ['public-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('is_public', true) // Only approved messages
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);

      return data.map((msg: any) => ({
        id: msg.id,
        type: msg.type,
        content: msg.content,
        vibe: msg.vibe,
        bouquetId: msg.bouquet_id,
        note: msg.note,
        createdAt: new Date(msg.created_at),
        senderTimestamp: msg.created_at,
        // NO instagram_username (Anonymous)
      }));
    },
  });
}

// TOGGLE PUBLIC STATUS
export function useTogglePublic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isPublic }: { id: number; isPublic: boolean }) => {
      const { error } = await supabase
        .from('messages')
        .update({ is_public: isPublic })
        .eq('id', id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['public-messages'] });
    },
  });
}

// DELETE MESSAGE
export function useDeleteMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['public-messages'] });
    },
  });
}
