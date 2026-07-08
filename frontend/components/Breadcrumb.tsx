import Link from 'next/link';
import { ReactNode } from 'react';

export interface BreadcrumbItem {
    label: string;
    href: string;
    isActive?: boolean;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    separator?: string | ReactNode;
    className?: string;
    itemClassName?: string;
}

export default function Breadcrumb({
    items,
    separator = '/',
    className = '',
    itemClassName = '',
}: BreadcrumbProps) {
    return (
        <nav className={className}>
            <ol className="flex text-xs uppercase tracking-widest text-[#4e8b97] gap-2">
                {items.map((item, index) => (
                    <li key={item.href} className="flex items-center gap-2">
                        {index > 0 && (
                            <span className='text-[#4e8b97]'>
                                {separator}
                            </span>
                        )}
                        {item.isActive ? (
                            <span className={`${itemClassName} text-[#4e8b97]`}>
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className={`${itemClassName} hover:text-primary transition-colors`}
                            >
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}