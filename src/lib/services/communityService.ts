
import { supabase } from '@/lib/supabaseClient';
import { createNotification } from './notificationService';
import { getCurrentUser } from './authService';

// Create community post
export const createCommunityPost = async (
  authorId: string,
  title: string,
  content: string,
  category?: string,
  bookId?: string
) => {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .insert([
        {
          author_id: authorId,
          title,
          content,
          category,
          book_id: bookId,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Create notification for admin/community
    return { success: true, post: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create post' };
  }
};

// Get all community posts
export const getCommunityPosts = async (category?: string, limit: number = 20, offset: number = 0) => {
  try {
    let query = supabase
      .from('community_posts')
      .select('*, profiles!author_id(full_name, avatar_url)');

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Fetch reply count, reaction count for each post
    const postsWithStats = await Promise.all(
      data.map(async (post) => {
        const { data: comments, error: commentsError } = await supabase
          .from('community_comments')
          .select('id', { count: 'exact' })
          .eq('post_id', post.id);

        const { data: reactions } = await supabase
          .from('community_reactions')
          .select('id', { count: 'exact' })
          .eq('post_id', post.id);

        return {
          ...post,
          commentCount: comments?.length || 0,
          reactionCount: reactions?.length || 0,
        };
      })
    );

    return { success: true, posts: postsWithStats };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch posts' };
  }
};

// Get post details with comments
export const getPostDetails = async (postId: string) => {
  try {
    // Get post
    const { data: post, error: postError } = await supabase
      .from('community_posts')
      .select('*, profiles!author_id(full_name, avatar_url, id)')
      .eq('id', postId)
      .single();

    if (postError) throw postError;

    // Update view count
    await supabase.rpc('increment_view_count', { post_id_param: postId });


    // Get comments
    const { data: comments, error: commentsError } = await supabase
      .from('community_comments')
      .select('*, profiles!author_id(full_name, avatar_url, id)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (commentsError) throw commentsError;

    // Get reactions
    const { data: reactions } = await supabase
      .from('community_reactions')
      .select('*')
      .eq('post_id', postId);

    // Get user's reactions if logged in
    const currentUser = await getCurrentUser();
    let userReactions: any[] = [];
    if (currentUser) {
      const { data: userReacts } = await supabase
        .from('community_reactions')
        .select('reaction_type')
        .eq('post_id', postId)
        .eq('user_id', currentUser.id);

      userReactions = userReacts || [];
    }

    return {
      success: true,
      post,
      comments,
      reactions: reactions || [],
      userReactions,
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch post' };
  }
};

// Add comment to post
export const addCommentToPost = async (
  postId: string,
  authorId: string,
  content: string
) => {
  try {
    const { data, error } = await supabase
      .from('community_comments')
      .insert([
        {
          post_id: postId,
          author_id: authorId,
          content,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Get post author and notify
    const { data: post } = await supabase
      .from('community_posts')
      .select('author_id')
      .eq('id', postId)
      .single();

    if (post && post.author_id !== authorId) {
      await createNotification(
        post.author_id,
        'New Comment',
        'Someone commented on your post'
      );
    }

    return { success: true, comment: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to add comment' };
  }
};

// React to post or comment
export const addReactionToPost = async (
  postId: string,
  userId: string,
  reactionType: 'like' | 'love' | 'helpful' = 'like'
) => {
  try {
    // Check if reaction already exists
    const { data: existing } = await supabase
      .from('community_reactions')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .eq('reaction_type', reactionType)
      .single();

    if (existing) {
      // Remove reaction
      const { error: deleteError } = await supabase
        .from('community_reactions')
        .delete()
        .eq('id', existing.id);

      if (deleteError) throw deleteError;
      return { success: true, removed: true };
    } else {
      // Add reaction
      const { data, error } = await supabase
        .from('community_reactions')
        .insert([
          {
            post_id: postId,
            user_id: userId,
            reaction_type: reactionType,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, reaction: data, removed: false };
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to add reaction' };
  }
};

// React to comment
export const addReactionToComment = async (
  commentId: string,
  userId: string,
  reactionType: 'like' | 'love' | 'helpful' = 'like'
) => {
  try {
    // Check if reaction already exists
    const { data: existing } = await supabase
      .from('community_reactions')
      .select('*')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .eq('reaction_type', reactionType)
      .single();

    if (existing) {
      // Remove reaction
      const { error: deleteError } = await supabase
        .from('community_reactions')
        .delete()
        .eq('id', existing.id);

      if (deleteError) throw deleteError;
      return { success: true, removed: true };
    } else {
      // Add reaction
      const { data, error } = await supabase
        .from('community_reactions')
        .insert([
          {
            comment_id: commentId,
            user_id: userId,
            reaction_type: reactionType,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, reaction: data, removed: false };
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to add reaction' };
  }
};

// Delete post
export const deletePost = async (postId: string, authorId: string) => {
  try {
    const { data: post, error: fetchError } = await supabase
      .from('community_posts')
      .select('author_id')
      .eq('id', postId)
      .single();

    if (fetchError || post.author_id !== authorId) {
      throw new Error('Unauthorized');
    }

    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete post' };
  }
};

// Update post
export const updatePost = async (
  postId: string,
  authorId: string,
  updates: { title?: string; content?: string; category?: string }
) => {
  try {
    const { data: post, error: fetchError } = await supabase
      .from('community_posts')
      .select('author_id')
      .eq('id', postId)
      .single();

    if (fetchError || post.author_id !== authorId) {
      throw new Error('Unauthorized');
    }

    const { data, error } = await supabase
      .from('community_posts')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', postId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, post: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update post' };
  }
};
