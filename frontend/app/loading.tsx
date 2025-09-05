import React from 'react';
import { Skeleton, Spin } from 'antd';
const Loading = () => {
    return (
        <div className="absolute flex h-screen my-auto w-full justify-center items-center">
            <Spin size="large" />
        </div>
    );
};

export default Loading;
