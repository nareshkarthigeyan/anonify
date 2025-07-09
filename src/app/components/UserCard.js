
import Link from 'next/link';

export default function UserCard({ profile, isFollowing, authUserId }) {
    return (
        <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
                <Link href={`/user/${profile.id}`}>
                    <p className="font-bold cursor-pointer">{profile.username}</p>
                </Link>
                <p className="text-gray-600">{profile.bio}</p>
            </div>
            {authUserId && authUserId !== profile.id && (
                <button className="px-4 py-2 bg-blue-500 text-white rounded">
                    {isFollowing ? 'Followed ✅' : 'Follow ➕'}
                </button>
            )}
        </div>
    );
}
