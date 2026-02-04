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
    // Create bill first
    const { data: billData, error: billError } = await supabase.from('bills').insert([{
      mobile,
      total,
      created_at: new Date().toISOString()
    }]).select();
    if (billError) throw new Error(billError.message);
    
    const billId = billData[0].id;
    
    // Insert bill items
    const billItems = items.map(item => ({
      bill_id: billId,
      item_name: item.name,
      price: item.price,
      qty: item.qty
    }));
    
    const { error: itemsError } = await supabase.from('bill_items').insert(billItems);
    if (itemsError) throw new Error(itemsError.message);
    
    return billId;
  },

  getById: async (id) => {
    // Get bill with items
    const { data: billData, error: billError } = await supabase
      .from('bills')
      .select(`
        *,
        items:bill_items(*)
      `)
      .eq('id', id)
      .single();
    if (billError) throw new Error(billError.message);
    return billData;
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