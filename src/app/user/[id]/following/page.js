
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import UserCard from '@/app/components/UserCard';

async function getUser(supabase, id) {
    const { data: user, error } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('id', id)
        .single();
    if (error) return null;
    return user;
}

async function getFollowing(supabase, userId) {
    const { data, error } = await supabase
        .from('follows')
        .select('following_id, profiles:following_id(*)')
        .eq('follower_id', userId);
    if (error) return [];
    return data;
}

async function getFollowingStatus(supabase, authUserId, targetUserId) {
    if (!authUserId) return false;
    const { count } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', authUserId)
        .eq('following_id', targetUserId);
    return count > 0;
}

export default async function FollowingPage({ params }) {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user: authUser } } = await supabase.auth.getUser();

    const user = await getUser(supabase, params.id);
    if (!user) {
        notFound();
    }

    const following = await getFollowing(supabase, params.id);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{user.username} is Following</h1>
            <div className="space-y-4">
                {following.map(async (follow) => {
                    const isFollowing = await getFollowingStatus(supabase, authUser?.id, follow.following_id);
                    return (
                        <UserCard
                            key={follow.following_id}
                            profile={follow.profiles}
                            isFollowing={isFollowing}
                            authUserId={authUser?.id}
                        />
                    );
                })}
            </div>
        </div>
    );
}
