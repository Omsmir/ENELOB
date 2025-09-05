'use client';
import { MotionComponent, Motions } from '@/components/relatedComponents/Motion';

const Rootlayout = ({ children }: { children: React.ReactNode }) => {
    return <MotionComponent form={Motions.FADEIN}>{children}</MotionComponent>;
};

export default Rootlayout;
