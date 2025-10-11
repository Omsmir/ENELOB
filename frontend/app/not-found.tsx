import React from 'react';
import Link from 'next/link';
import { Button, Result } from 'antd';
const NotFound = () => {
    return (
        <main className="h-screen min-h-screen flex justify-center items-center">
            <Result
                className=""
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Link href={'/dashboard'}>
                        <Button type="primary">Back Home</Button>
                    </Link>
                }
            />
        </main>
    );
};

export default NotFound;
