'use client';
import { ChevronRight } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { inter } from '@/fonts/font';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface ItemProps {
    item: {
        title: string;
        url: string;
        isActive?: boolean;
        icon?: any;
        sideItemTitle?: string;
        items?: {
            title: string;
            url: string;
            private?: boolean;
        }[];
    };
}

interface SubItemModelProps {
    subItem: {
        title: string;
        url: string;
    };
}
const SubItemModel = ({ subItem }: SubItemModelProps) => {
    const pathname = usePathname();


    return (
        <SidebarMenuSubItem key={subItem.title}>
            <SidebarMenuSubButton asChild>
                <Link
                    href={subItem.url}
                    className={clsx('text-slate-600 hover:text-slate-50 transition-colors', {
                        'bg-[var(--sidebar-accent)] !text-slate-50  dark:bg-[var(--sidebar-accent)]':
                            pathname == subItem.url,
                    })}
                >
                    <div className=" hover:text-slate-50 transition-colors">{subItem.title}</div>
                </Link>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    );
};
const CollapsibleItems = ({ item }: ItemProps) => {

    return (
        <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
        >
            <SidebarMenuItem className="mb-1">
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        tooltip={item.title}
                        className="h-full rounded-xl cursor-pointer hover:text-slate-50 transition-colors "
                    >
                        {item.icon && <item.icon />}
                        <span className={`font-medium ${inter.className} capitalize`}>
                            {item.title}
                        </span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items?.map(subItem => {
                            if (subItem.private) {
                                if (true)
                                    return (
                                        <SubItemModel
                                            key={subItem.title}
                                            subItem={subItem}
                                        />
                                    );
                            } else {
                                return (
                                    <SubItemModel
                                        key={subItem.title}
                                        subItem={subItem}
                                    />
                                );
                            }
                        })}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
};

export default CollapsibleItems;
