import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Menu Operations
export const menuApi = {
  getAll: async () => {
    const { data, error } = await supabase.from('menu').select('*');
    if (error) throw new Error(error.message);
    return data;
  },

  add: async (item) => {
    const { data, error } = await supabase.from('menu').insert([item]).select();
    if (error) throw new Error(error.message);
    return data[0];
  },

  update: async (id, item) => {
    const { data, error } = await supabase.from('menu').update(item).eq('id', id).select();
    if (error) throw new Error(error.message);
    return data[0];
  },

  delete: async (id) => {
    const { error } = await supabase.from('menu').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  }
};

// Bill Operations
export const billApi = {
  create: async (mobile, items, total) => {
    const { data, error } = await supabase.from('bills').insert([{
      mobile,
      items,
      total,
      created_at: new Date().toISOString()
    }]).select();
    if (error) throw new Error(error.message);
    return data[0].id;
  },

  getById: async (id) => {
    const { data, error } = await supabase.from('bills').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data;
  },

  getReport: async (date) => {
    const { data, error } = await supabase.from('bills')
      .select('*')
      .gte('created_at', `${date}T00:00:00`)
      .lt('created_at', `${date}T23:59:59`);
    if (error) throw new Error(error.message);
    return data;
  }
};

export default menuApi;