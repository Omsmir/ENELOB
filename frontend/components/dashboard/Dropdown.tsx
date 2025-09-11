'use client';
import React from 'react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DropdownProps {
    innerText?: string;
    disabled?: boolean;
    onclick?: React.Dispatch<React.SetStateAction<any>>;
    children?: React.ReactNode;
}
const Dropdown = (props: DropdownProps) => {
    const setActionState = (e: any) => {
        if (props.onclick) {
            props.onclick(e);
        }
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 focus:outline-none cursor-pointer"
                >
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="bg-slate-100 dark:bg-[var(--sidebar-accent)] p-0 border-0"
            >
                <DropdownMenuItem
                    className="cursor-pointer hover:bg-slate-200 dark:hover:bg-[var(--sidebar-background)]"
                    disabled={props.disabled}
                    onClick={setActionState}
                >
                    {props.innerText}
                    {props.children}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Dropdown;
