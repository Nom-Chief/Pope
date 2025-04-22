import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Initialize Supabase with explicit options for anonymous access
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'pope-updates'
    }
  }
});

// Test the connection and check table contents
supabase.auth.getSession().then(({ data: { session }, error }) => {
  if (error) {
    console.error('Supabase connection error:', error);
  } else {
    console.log('Supabase connection successful');
    console.log('Session:', session ? 'Active' : 'No active session');
    
    // Check if table exists and has any data
    supabase
      .from('completed_clips')
      .select('count')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error checking table:', error);
        } else {
          console.log('Total records in completed_clips:', data);
        }
      });

    // Check for any records with the name 'Pope Updates'
    supabase
      .from('completed_clips')
      .select('*')
      .eq('name', 'Pope Updates')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error checking for Pope Updates:', error);
        } else {
          console.log('Records with name "Pope Updates":', data);
        }
      });
  }
});

export type PopeUpdate = Database['public']['Tables']['completed_clips']['Row'];

function formatAudioUrl(url: string): string {
  if (!url) {
    console.warn('Empty audio URL provided');
    return '';
  }
  if (url.startsWith('http')) {
    console.log('Using full URL:', url);
    return url;
  }
  const formattedUrl = `${supabaseUrl}/storage/v1/object/public/audio-clips/${url}`;
  console.log('Formatted audio URL:', formattedUrl);
  return formattedUrl;
}

export async function fetchLatestUpdate(): Promise<PopeUpdate | null> {
  console.log('Fetching latest update...');
  try {
    // First try with exact name match
    let { data, error } = await supabase
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

    // If no exact match, try case-insensitive search
    if (!data) {
      console.log('No exact match found, trying case-insensitive search...');
      const { data: caseInsensitiveData, error: caseError } = await supabase
        .from('completed_clips')
        .select('*')
        .ilike('name', '%pope%updates%')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (caseError) {
        console.error('Error in case-insensitive search:', caseError);
        return null;
      }
      data = caseInsensitiveData;
    }

    console.log('Latest update data:', data);

    if (data) {
      const formattedData = {
        ...data,
        audio_url: formatAudioUrl(data.audio_url)
      };
      console.log('Formatted latest update:', formattedData);
      return formattedData;
    }

    console.log('No latest update found');
    return null;
  } catch (error) {
    console.error('Error fetching latest update:', error);
    return null;
  }
}

export async function fetchPreviousUpdates(limit = 10, page = 0): Promise<PopeUpdate[]> {
  console.log(`Fetching previous updates - Page: ${page}, Limit: ${limit}`);
  try {
    // First try with exact name match
    let { data, error } = await supabase
      .from('completed_clips')
      .select('*')
      .eq('name', 'Pope Updates')
      .order('created_at', { ascending: false })
      .range(page * limit + 1, (page + 1) * limit);

    if (error) {
      console.error('Error fetching previous updates:', error);
      return [];
    }

    // If no exact matches, try case-insensitive search
    if (!data || data.length === 0) {
      console.log('No exact matches found, trying case-insensitive search...');
      const { data: caseInsensitiveData, error: caseError } = await supabase
        .from('completed_clips')
        .select('*')
        .ilike('name', '%pope%updates%')
        .order('created_at', { ascending: false })
        .range(page * limit + 1, (page + 1) * limit);

      if (caseError) {
        console.error('Error in case-insensitive search:', caseError);
        return [];
      }
      data = caseInsensitiveData;
    }

    console.log('Previous updates data:', data);

    const formattedData = (data || []).map(update => ({
      ...update,
      audio_url: formatAudioUrl(update.audio_url)
    }));
    
    console.log('Formatted previous updates:', formattedData);
    return formattedData;
  } catch (error) {
    console.error('Error fetching previous updates:', error);
    return [];
  }
}