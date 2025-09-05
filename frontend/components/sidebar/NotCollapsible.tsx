'use client';
import React from 'react';
import {  SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ItemProps } from './Collapsible';
import { inter } from '@/fonts/font';

const NotCollapsible = ({ item }: ItemProps) => {
    const pathname = usePathname();

    return (
        <SidebarMenuItem
            key={item.title}
            className="mb-1"
        >
            <SidebarMenuButton
                asChild
                tooltip={item.title}
            >
                <Link
                    href={item.url}
                    className={clsx('h-full rounded-xl transition-colors hover:text-slate-50', {
                        'bg-[var(--sidebar-accent)]  text-slate-50 dark:bg-[var(--sidebar-accent)]':
                            pathname == item.url,
                    })}
                >
                    <item.icon />
                    <div className={`font-medium ${inter.className} capitalize`}>{item.title}</div>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
};

export default NotCollapsible;
