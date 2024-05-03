'use client'

import { createClient } from '@supabase/supabase-js';

const supabase = createClient("NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY");

export const downloadFile = async (filePath: string) => {
  const { data, error } = await supabase.storage
   .from('Supporting Docs')
   .download(filePath);

  if (error) {
    console.error('Error downloading file:', error);
    return null;
  }

  return data;
};