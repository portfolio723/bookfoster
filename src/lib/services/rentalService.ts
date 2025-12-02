
import { supabase } from '@/lib/supabaseClient';
import { createNotification } from './notificationService';

// Create rental request
export const createRentalRequest = async (
  bookId: string,
  renterId: string,
  startDate: Date,
  endDate: Date,
  notes?: string
) => {
  try {
    // Get book details
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single();

    if (bookError || !book || book.available_quantity <= 0) {
      throw new Error('Book not available');
    }

    const numberOfDays = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    const totalRentalCost = numberOfDays * (book.price_per_day || 0);

    const { data, error } = await supabase
      .from('rentals')
      .insert([
        {
          book_id: bookId,
          renter_id: renterId,
          owner_id: book.owner_id,
          rental_start_date: startDate,
          rental_end_date: endDate,
          number_of_days: numberOfDays,
          price_per_day: book.price_per_day,
          total_rental_cost: totalRentalCost,
          notes,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Create notification for owner
    await createNotification(book.owner_id, 'Rental Request', `New rental request for ${book.title}.`);

    return { success: true, rental: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create rental' };
  }
};

// Get user rentals (as renter)
export const getUserRentals = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('rentals')
      .select('*, books(*), profiles!owner_id(full_name, avatar_url)')
      .eq('renter_id', userId);

    if (error) throw error;
    return { success: true, rentals: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch rentals' };
  }
};

// Get rental requests for user's books (as owner)
export const getRentalRequests = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('rentals')
      .select('*, books(*), profiles!renter_id(full_name, avatar_url, phone)')
      .eq('owner_id', userId);

    if (error) throw error;
    return { success: true, rentals: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch rental requests' };
  }
};

// Approve rental
export const approveRental = async (rentalId: string, ownerId: string) => {
  try {
    // Get rental details
    const { data: rental, error: fetchError } = await supabase
      .from('rentals')
      .select('*, books(title)')
      .eq('id', rentalId)
      .single();

    if (fetchError || !rental || rental.owner_id !== ownerId) {
      throw new Error('Unauthorized or rental not found');
    }

    const { data, error } = await supabase
      .from('rentals')
      .update({ status: 'active', updated_at: new Date() })
      .eq('id', rentalId)
      .select()
      .single();

    if (error) throw error;

    // Decrease available quantity
    await supabase.rpc('decrement_book_quantity', { book_id_param: rental.book_id });


    // Create notification for renter
    await createNotification(rental.renter_id, 'Rental Approved', `Your rental request for "${rental.books.title}" has been approved.`);

    return { success: true, rental: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to approve rental' };
  }
};

// Return rental
export const returnRental = async (rentalId: string, renterId: string) => {
  try {
    const { data: rental, error: fetchError } = await supabase
      .from('rentals')
      .select('*, books(title)')
      .eq('id', rentalId)
      .single();

    if (fetchError || !rental || rental.renter_id !== renterId) {
      throw new Error('Unauthorized or rental not found');
    }

    const actualReturnDate = new Date();
    const rentalEndDate = new Date(rental.rental_end_date);
    let lateFees = 0;

    if (actualReturnDate > rentalEndDate) {
      const daysLate = Math.ceil(
        (actualReturnDate.getTime() - rentalEndDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      lateFees = daysLate * ((rental.price_per_day || 0) * 1.5); // 50% penalty on daily price
    }

    const { data, error } = await supabase
      .from('rentals')
      .update({
        status: 'returned',
        actual_return_date: actualReturnDate,
        late_fees: lateFees,
        updated_at: new Date(),
      })
      .eq('id', rentalId)
      .select()
      .single();

    if (error) throw error;

    // Increase available quantity
    await supabase.rpc('increment_book_quantity', { book_id_param: rental.book_id });

    // Create notification for owner
    await createNotification(rental.owner_id, 'Book Returned', `"${rental.books.title}" has been returned by the renter.`);

    return { success: true, rental: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to return rental' };
  }
};
