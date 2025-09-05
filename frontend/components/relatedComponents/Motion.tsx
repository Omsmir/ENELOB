'use client';
import { motion } from 'framer-motion';
import React from 'react';

export enum Motions {
    TOP = 'top',
    BOTTOM = 'bottom',
    LEFT = 'left',
    RIGHT = 'right',
    FADEIN = 'fadein',
    FADEOUT = 'fadeout',
}

interface Props {
    children: React.ReactNode;
    className?: string;
    form: Motions;
    offset?: number;
    duration?: number;
}

export const MotionComponent: React.FC<Props> = ({
    children,
    className = '',
    form,
    offset = 50,
    duration = 0.7,
}) => {
    const dirMap = {
        left: { x: -offset, y: 0, scale: 0.95 },
        right: { x: offset, y: 0, scale: 0.95 },
        top: { y: -offset, x: 0, scale: 0.95 },
        bottom: { y: offset, x: 0, scale: 0.95 },
        fadein: { x: 0, y: 0, scale: 0.95 },
        fadeout: { x: 0, y: 0, scale: 1.05 },
    };
    const { x, y, scale } = dirMap[form];

    

    const variants = {
        hidden: { opacity: 0, scale: scale, x, y },
        visible: {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            transition: { duration: duration, staggerChildren: 0.3 },
        },
        exit: { opacity: 0, x, y, transition: { duration: 1 } },
    };

    return (
        <motion.section
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            className={className}
        >
            <motion.div variants={variants}>{children}</motion.div>
        </motion.section>
    );
};
