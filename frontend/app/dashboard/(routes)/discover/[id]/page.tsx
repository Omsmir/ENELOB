import React from 'react';
import dynamic from 'next/dynamic';

const FriendLayout = dynamic(() => import('@/components/discover/friend/FriendLayout'));

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;

    return <FriendLayout id={id} />;
};

export default page;
