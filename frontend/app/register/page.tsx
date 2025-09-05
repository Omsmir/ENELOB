import RegisterForm from '@/components/RegisterForm';
import { Metadata } from 'next';
import Image from 'next/image';
import React from 'react';
export const metadata: Metadata = {
    title: 'Enelob - Register',
};

const page = () => {
    return (
        <main className="flex h-screen min-h-screen dark:bg-[var(--sidebar-accent)]">
            <div className="container remove-scrollbar flex justify-center items-center">
                <div className=" max-w-[860px] flex-1 flex-col py-10">
                    <RegisterForm />
                </div>
            </div>
            <Image
                src="/assets/images/register.jpg"
                alt="resetImage"
                priority
                width={1000}
                height={1000}
                className="side-img  md:max-w-[50%]"
            />
        </main>
    );
};

export default page;
