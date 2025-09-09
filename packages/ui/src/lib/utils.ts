import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const capitalizeFirstLetter = (str: string): string => {
    if (!str) return str;
    return str[0].toUpperCase() + str.slice(1);
};

export const formatCurrency = (
    amount: number,
    currencySymbol = '$',
): string => {
    const absAmount = Math.abs(amount);
    const formattedAmount = absAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return `${amount < 0 ? '-' : ''}${currencySymbol}${formattedAmount}`;
};

export const objectToSearchParamString = (obj: Record<string, any> | undefined): string => {
    if (!obj || Object.keys(obj).length === 0) {
        return '';
    }

    return '?' + new URLSearchParams(obj).toString();
};

export const getSearchParamsFromUrl = (): Record<string, any> => {
    const searchParams = new URLSearchParams(window.location.search);
    const params: Record<string, any> = {};

    for (const [key, value] of searchParams) {
        params[key] = value;
    }

    return params;
};

export const formatDate = (date: Date | string): string => {
    return format(date, 'MMMM dd, yyyy');
};

export const formatDateTime = (date: Date | string): string => {
    return format(date, 'MMMM dd, yyyy HH:mm');
};

export const formatMetaTitle = (pageTitle?: string): string => {
    if (!pageTitle) {
        return 'Track Gastos';
    }

    return `${pageTitle} | Track Gastos`;
};

export const getVisiblePages = (total: number, page: number) => {
    const totalPages = Math.ceil(total / 10);
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
        range.push(i);
    }

    if (page - delta > 2) {
        rangeWithDots.push(1, '...');
    } else {
        rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
        rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
};