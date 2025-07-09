'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function FollowButton({ profileId }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthUserAndFollowingStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setAuthUser(user);

      if (user && user.id !== profileId) {
        const { count } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', user.id)
          .eq('following_id', profileId);
        setIsFollowing(!!count);
      }
      setLoading(false);
    };

    fetchAuthUserAndFollowingStatus();
  }, [profileId]);

  const handleFollow = async () => {
    if (!authUser) return; // Should not happen if button is rendered correctly

    if (isFollowing) {
      // Unfollow
      setIsFollowing(false);
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', authUser.id)
        .eq('following_id', profileId);
      if (error) {
        console.error('Error unfollowing:', error);
        setIsFollowing(true); // Revert state if there was an error
      }
    } else {
      // Follow
      setIsFollowing(true);
      const { error } = await supabase.from('follows').insert([{ follower_id: authUser.id, following_id: profileId }]);
      if (error) {
        console.error('Error following:', error);
        setIsFollowing(false); // Revert state if there was an error
      }
    }
  };

  if (loading) return null; // Or a loading spinner

  if (authUser && authUser.id === profileId) {
    return (
      <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Edit Profile
      </button>
    );
  }

  if (authUser) {
    return (
      <button
        onClick={handleFollow}
        className={`mt-2 px-4 py-2 text-white rounded ${
          isFollowing ? 'bg-gray-500' : 'bg-green-500'
        }`}
      >
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    );
  }

  return null; // Not authenticated, don't show button
}
