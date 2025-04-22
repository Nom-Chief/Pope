import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type PopeUpdate = Database['public']['Tables']['completed_clips']['Row'];

function formatAudioUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${supabaseUrl}/storage/v1/object/public/audio-clips/${url}`;
}

export async function fetchLatestUpdate(): Promise<PopeUpdate | null> {
  try {
    const { data, error } = await supabase
      .from('completed_clips')
      .select('*')
      .eq('name', 'Pope Updates')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching latest update:', error);
      return null;
    }

    if (data) {
      return {
        ...data,
        audio_url: formatAudioUrl(data.audio_url)
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching latest update:', error);
    return null;
  }
}

export async function fetchPreviousUpdates(limit = 10, page = 0): Promise<PopeUpdate[]> {
  try {
    const { data, error } = await supabase
      .from('completed_clips')
      .select('*')
      .eq('name', 'Pope Updates')
      .order('created_at', { ascending: false })
      .range(page * limit + 1, (page + 1) * limit);

    if (error) {
      console.error('Error fetching previous updates:', error);
      return [];
    }

    return (data || []).map(update => ({
      ...update,
      audio_url: formatAudioUrl(update.audio_url)
    }));
  } catch (error) {
    console.error('Error fetching previous updates:', error);
    return [];
  }
}