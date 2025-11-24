"use client";

import { PricingTable } from '@clerk/nextjs';
import { useTheme } from 'next-themes';

export default function ClerkPricingTable() {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = theme === 'system' ? resolvedTheme : theme;

    return (
        <div className="bg-white dark:bg-[rgb(38,38,36)] rounded-2xl border-2 border-gray-200 dark:border-[rgb(45,45,44)] p-8 shadow-2xl">
            <PricingTable
                appearance={{
                    variables: {
                        colorPrimary: currentTheme === 'dark' ? '#3b82f6' : '#2563eb',
                        colorBackground: currentTheme === 'dark' ? 'rgb(38,38,36)' : '#ffffff',
                        colorText: currentTheme === 'dark' ? '#ffffff' : '#111827',
                        colorTextSecondary: currentTheme === 'dark' ? '#9ca3af' : '#6b7280',
                        colorInputBackground: currentTheme === 'dark' ? 'rgb(45,45,44)' : '#f9fafb',
                        colorInputText: currentTheme === 'dark' ? '#ffffff' : '#111827',
                        colorDanger: currentTheme === 'dark' ? '#ef4444' : '#dc2626',
                    },
                    elements: {
                        card: {
                            backgroundColor: currentTheme === 'dark' ? 'rgb(45,45,44)' : '#ffffff',
                            borderColor: currentTheme === 'dark' ? 'rgb(55,55,54)' : '#e5e7eb',
                            color: currentTheme === 'dark' ? '#ffffff' : '#111827',
                            boxShadow: currentTheme === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        },
                        cardTitle: {
                            color: currentTheme === 'dark' ? '#ffffff' : '#111827',
                            fontWeight: '600',
                        },
                        cardDescription: {
                            color: currentTheme === 'dark' ? '#9ca3af' : '#6b7280',
                        },
                        badge: {
                            backgroundColor: currentTheme === 'dark' ? '#3b82f6' : '#2563eb',
                            color: '#ffffff',
                        },
                        pricingCard: {
                            backgroundColor: currentTheme === 'dark' ? 'rgb(45,45,44)' : '#ffffff',
                            borderColor: currentTheme === 'dark' ? 'rgb(55,55,54)' : '#e5e7eb',
                        },
                        pricingCardPrice: {
                            color: currentTheme === 'dark' ? '#ffffff' : '#111827',
                        },
                        pricingCardFeature: {
                            color: currentTheme === 'dark' ? '#d1d5db' : '#374151',
                        },
                        pricingCardFeatureIcon: {
                            color: currentTheme === 'dark' ? '#ffffff !important' : '#111827 !important',
                            fill: currentTheme === 'dark' ? '#ffffff !important' : '#111827 !important',
                        },
                        button: {
                            backgroundColor: currentTheme === 'dark' ? '#3b82f6' : '#2563eb',
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: currentTheme === 'dark' ? '#2563eb' : '#1d4ed8',
                            }
                        },
                        rootBox: {
                            '& svg': {
                                color: currentTheme === 'dark' ? '#ffffff !important' : '#111827 !important',
                                fill: currentTheme === 'dark' ? '#ffffff !important' : '#111827 !important',
                            },
                            '& path': {
                                fill: currentTheme === 'dark' ? '#ffffff !important' : '#111827 !important',
                                stroke: currentTheme === 'dark' ? '#ffffff !important' : '#111827 !important',
                            }
                        }
                    }
                }}
            />
        </div>
    );
}
