import { supabase } from '@/lib/supabaseClient';
import { createNotification } from './notificationService';

// Create donation
export const createDonation = async (
  bookId: string,
  donorId: string,
  donationType: 'direct' | 'community' = 'community',
  notes?: string
) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .insert([
        {
          book_id: bookId,
          donor_id: donorId,
          donation_type: donationType,
          status: 'available',
          notes,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Update book status
    await supabase
      .from('books')
      .update({ book_type: 'donate', status: 'active' })
      .eq('id', bookId);

    return { success: true, donation: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create donation' };
  }
};

// Get available donations
export const getAvailableDonations = async () => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*, books(title, cover_image_url, description), profiles!donor_id(full_name, avatar_url)')
      .eq('status', 'available');

    if (error) throw error;
    return { success: true, donations: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch donations' };
  }
};

// Claim donation
export const claimDonation = async (donationId: string, recipientId: string) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .update({
        recipient_id: recipientId,
        status: 'claimed',
        claimed_date: new Date(),
        updated_at: new Date(),
      })
      .eq('id', donationId)
      .select()
      .single();

    if (error) throw error;

    // Create notification for donor
    await createNotification(
      data.donor_id,
      'Donation Claimed',
      'Your donated book has been claimed'
    );

    return { success: true, donation: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to claim donation' };
  }
};

// Mark donation as delivered
export const markDonationDelivered = async (donationId: string, donorId: string) => {
  try {
    const { data: donation, error: fetchError } = await supabase
      .from('donations')
      .select('*')
      .eq('id', donationId)
      .single();

    if (fetchError || donation.donor_id !== donorId) {
      throw new Error('Unauthorized');
    }

    const { data, error } = await supabase
      .from('donations')
      .update({
        status: 'delivered',
        delivered_date: new Date(),
        updated_at: new Date(),
      })
      .eq('id', donationId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, donation: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update donation' };
  }
};
