import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

// Upload book cover image
export const uploadBookCover = async (file: File, userId: string) => {
  try {
    const fileName = `${userId}/${uuidv4()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('book-covers')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from('book-covers')
      .getPublicUrl(fileName);

    return { success: true, url: publicUrl.publicUrl };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Image upload failed' };
  }
};

// Add book (for rent, buy, or donate)
export const addBook = async (
  userId: string,
  bookData: {
    title: string;
    author: string;
    isbn?: string;
    category: string;
    condition: string;
    language?: string;
    pages?: number;
    published_year?: number;
    description?: string;
    cover_image_url?: string;
    book_type: 'rent' | 'buy' | 'donate';
    price_per_day?: number;
    price_buy?: number;
    stock_quantity?: number;
  }
) => {
  try {
    const { data, error } = await supabase
      .from('books')
      .insert([
        {
          owner_id: userId,
          ...bookData,
          available_quantity: bookData.stock_quantity || 1,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, book: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to add book' };
  }
};

// Get all active books
export const getAllBooks = async (filters?: {
  category?: string;
  condition?: string;
  book_type?: string;
  minPrice?: number;
  maxPrice?: number;
}) => {
  try {
    let query = supabase
      .from('books')
      .select('*, profiles(full_name, avatar_url, phone)')
      .eq('status', 'active');

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.condition) {
      query = query.eq('condition', filters.condition);
    }
    if (filters?.book_type) {
      query = query.eq('book_type', filters.book_type);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { success: true, books: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch books' };
  }
};

// Get user's books
export const getUserBooks = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('owner_id', userId);

    if (error) throw error;
    return { success: true, books: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch user books' };
  }
};

// Get single book details
export const getBookDetails = async (bookId: string) => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*, profiles(full_name, avatar_url, phone, email)')
      .eq('id', bookId)
      .single();

    if (error) throw error;
    return { success: true, book: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch book' };
  }
};

// Update book
export const updateBook = async (bookId: string, userId: string, updates: any) => {
  try {
    // Verify ownership
    const { data: book, error: fetchError } = await supabase
      .from('books')
      .select('owner_id')
      .eq('id', bookId)
      .single();

    if (fetchError || book.owner_id !== userId) {
      throw new Error('Unauthorized');
    }

    const { data, error } = await supabase
      .from('books')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', bookId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, book: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update book' };
  }
};

// Delete book
export const deleteBook = async (bookId: string, userId: string) => {
  try {
    // Verify ownership
    const { data: book, error: fetchError } = await supabase
      .from('books')
      .select('owner_id')
      .eq('id', bookId)
      .single();

    if (fetchError || book.owner_id !== userId) {
      throw new Error('Unauthorized');
    }

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', bookId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete book' };
  }
};

// Search books
export const searchBooks = async (query: string) => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*, profiles(full_name, avatar_url)')
      .eq('status', 'active')
      .or(`title.ilike.%${query}%,author.ilike.%${query}%,category.ilike.%${query}%`);

    if (error) throw error;
    return { success: true, books: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Search failed' };
  }
};