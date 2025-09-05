'use client';

import Loading from '@/app/loading';
import { useSession } from 'next-auth/react';

interface AuthCheckProps {
    children: React.ReactNode;
}

const AuthProvider: React.FC<AuthCheckProps> = ({ children }) => {
    const { status } = useSession();

    // Prevent rendering until session is verified
    if (status === 'loading') {
        return <Loading />;
    }

    return <>{children}</>;
};

export default AuthProvider;
