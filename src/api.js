import { supabase } from './lib/supabase'

// Menu Operations
export const menuApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('menu')
      .select('*')
      .order('id', { ascending: false })
    if (error) throw error
    return data
  },

  add: async (item) => {
    const { data, error } = await supabase
      .from('menu')
      .insert({ name: item.name.trim(), price: Number(item.price) })
      .select()
      .single()
    if (error) throw error
    return data
  },

  update: async (id, item) => {
    const { data, error } = await supabase
      .from('menu')
      .update({ name: item.name, price: item.price })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  delete: async (id) => {
    const { error } = await supabase.from('menu').delete().eq('id', id)
    if (error) throw error
  }
}

// Bill Operations (CRITICAL - saves bill + items)
export const billApi = {
  create: async (mobile, items, total) => {
    // 1. Insert bill
    const { data: bill, error: billError } = await supabase
      .from('bills')
      .insert({ mobile, total })
      .select()
      .single()
    
    if (billError) throw billError

    // 2. Insert items
    const billItems = items.map(item => ({
      bill_id: bill.id,
      item_name: item.name,
      price: item.price,
      qty: item.qty
    }))

    const { error: itemsError } = await supabase
      .from('bill_items')
      .insert(billItems)

    if (itemsError) throw itemsError

    return bill.id
  },

  getById: async (id) => {
    const { data: bill, error: billError } = await supabase
      .from('bills')
      .select('*')
      .eq('id', id)
      .single()
    
    if (billError) throw billError

    const { data: items, error: itemsError } = await supabase
      .from('bill_items')
      .select('item_name, price, qty')
      .eq('bill_id', id)
    
    if (itemsError) throw itemsError

    return { ...bill, items }
  },

  getReport: async (date) => {
    const { data, error } = await supabase
      .from('bills')
      .select(`
        id,
        mobile,
        total,
        created_at,
        bill_items (id)
      `)
      .eq('created_at::date', date)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    // Format to match backend response
    return data.map(row => ({
      ...row,
      item_count: row.bill_items.length
    }))
  }
}

export default menuApi