import { cn } from '@/lib/utils';
import { Image, Skeleton } from 'antd';
import React from 'react';

export enum SkeletonType {
    HEAD = 'h1',
    PARAGRAPH = 'p',
    AVATAR = 'avatar',
    INPUT = 'input',
}
interface CustomSkeletonProps {
    classname?: string;
    innerText?: string | undefined;
    SkeletonType: SkeletonType;
    loading: boolean;
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
    src?: string;
    width?: number;
    height?: number;
    size?: number;
    shape?: 'circle' | 'square';
}

const RenderSkeleton = ({ props }: { props: CustomSkeletonProps }) => {
    const { setLoading } = props;

    const setHandler = () => {
        if (setLoading) {
            setLoading(false);
        }
    };
    switch (props.SkeletonType) {
        case SkeletonType.HEAD:
            return (
                <h1 className={cn('relative', props.classname)}>
                    {props.loading && (
                        <Skeleton
                            active
                            title={{ width: '100%' }}
                            paragraph={{ rows: 0 }}
                            style={{ width: '100%' }}
                            className="absolute"
                        />
                    )}
                    <span className={`relative block ${props.loading && 'hidden'} w-full `}>
                        {props.innerText}
                    </span>
                </h1>
            );
        case SkeletonType.AVATAR:
            return (
                <span
                    className={cn(
                        'relative border overflow-hidden cursor-pointer',
                        props.classname
                    )}
                >
                    {props.loading && (
                        <Skeleton.Avatar
                            active
                            size={props.size}
                            shape={props.shape}
                            className="absolute inset-0"
                        />
                    )}
                    <Image
                        width={props.width}
                        height={props.height}
                        src={props.src || '/assets/images/dr-cameron.png'}
                        loading="lazy"
                        onLoad={setHandler}
                        className="w-full h-full object-cover object-center "
                    />
                </span>
            );

        default:
            return null;
    }
};
const CustomSkeleton = (props: CustomSkeletonProps) => {
    return <RenderSkeleton props={props} />;
};

export default CustomSkeleton;
