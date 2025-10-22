import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Reusable Card Component
 * @param {Object} item - Card data (note, course, etc.)
 * @param {string} imageUrl - Image source
 * @param {string} title - Main title
 * @param {string} subtitle - Subtitle/description
 * @param {Array} badges - Array of badge objects: { label, variant, icon }
 * @param {Array} stats - Array of stat objects: { icon, label, value, bgColor }
 * @param {Array} actions - Array of action objects: { label, onClick, variant, icon }
 * @param {string} variant - 'default' or 'full-image'
 */
const GenericCard = ({
    item,
    imageUrl,
    title,
    subtitle,
    description,
    badges = [],
    stats = [],
    actions = [],
    variant = 'default',
    showStats = true, // new prop: controls whether stats are displayed (default true)
    adminActions = null // Admin action buttons (three-dot menu)
}) => {
    return (
        <Card className="group overflow-hidden   transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] shadow-lg border bg-white dark:bg-[rgb(24,24,24)]/50 border-gray-200 dark:border-gray-700">

            {/* Image Header */}
            <div className={`relative ${variant === 'full-image' ? 'h-44' : 'h-40'} overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-gray-700`}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-full h-full flex items-center justify-center">
                        <span className="text-white text-4xl">📄</span>
                    </div>
                )}

                <div className="absolute inset-0 bg-black/20"></div>

                {/* Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {badges.filter(b => b.position === 'top-right').map((badge, idx) => (
                        <Badge
                            key={idx}
                            className={`${badge.bgColor} border-0 shadow-lg font-semibold text-xs`}
                        >
                            {badge.icon && <span className="mr-1">{badge.icon}</span>}
                            {badge.label}
                        </Badge>
                    ))}
                </div>

                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {badges.filter(b => b.position === 'top-left').map((badge, idx) => (
                        <Badge
                            key={idx}
                            variant="secondary"
                            className={`${badge.bgColor} border-0 shadow-lg font-semibold text-xs`}
                        >
                            {badge.label}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Header Content */}
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white mb-1 line-clamp-2">
                    {title}
                </CardTitle>
                {subtitle && (
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                        {subtitle}
                    </p>
                )}
                {description && (
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                        {description}
                    </p>
                )}
            </CardHeader>

            {/* Stats */}
            {showStats && stats.length > 0 && (
                <CardContent className="pt-0 pb-3">
                    <div className="flex items-center  justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center flex-wrap justify-between w-full gap-4">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className={`p-2 rounded-lg ${stat.bgColor} dark:bg-opacity-20 flex items-center justify-center`}>
                                        <span className="text-slate-700 dark:text-slate-300">
                                            {stat.icon}
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        {stat.value} {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            )}

            {/* Action Buttons */}
            {actions.length > 0 && (() => {
                const hasSecondary = actions.some(a => a.variant === 'outline' || a.label === '' || a.icon && !a.fullWidth);
                const onlyPrimaryFull = actions.length === 1 && actions[0].fullWidth;

                return (
                    <CardContent className="pt-3 pb-4">
                        <div className="flex gap-2 flex-wrap items-center">
                            {actions.map((action, idx) => {
                                const isLikeButton = action.icon?.props?.className?.includes('fill-red-500');
                                const isShareButton = action.icon?.props?.className?.includes('text-blue-600');

                                // If single primary action and no secondary, make it larger
                                const primaryLarge = onlyPrimaryFull && !hasSecondary;

                                const buttonClass = action.fullWidth
                                    ? `${primaryLarge ? 'flex-1 h-12 text-lg' : 'flex-1 h-10'}`
                                    : 'flex-shrink-0 w-12 h-10 p-0';

                                const buttonContent = (
                                    <Button
                                        key={idx}
                                        onClick={action.onClick}
                                        variant={action.variant || 'default'}
                                        className={`
                                            ${buttonClass}
                                            ${action.variant === 'outline'
                                                ? `border-2 ${isLikeButton
                                                    ? 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                    : isShareButton
                                                        ? 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                } hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-medium shadow-sm hover:shadow-md transition-all duration-300 group`
                                                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300'}
                                        `}
                                    >
                                        {action.fullWidth ? (
                                            <span className={`flex items-center justify-center gap-2 ${primaryLarge ? 'text-lg' : ''}`}>
                                                {action.icon}
                                                <span className={`font-semibold ${primaryLarge ? 'text-base' : 'text-sm'}`}>{action.label}</span>
                                            </span>
                                        ) : (
                                            <span className={`flex flex-col items-center justify-center gap-0.5 group-hover:scale-105 transition-transform duration-200`}>
                                                {action.icon}
                                                {action.label && (
                                                    <span className="text-[10px] font-bold leading-none text-slate-600 dark:text-slate-400">
                                                        {action.label}
                                                    </span>
                                                )}
                                            </span>
                                        )}
                                    </Button>
                                );

                                return action.href ? (
                                    <Link key={idx} href={action.href} className={action.fullWidth ? 'flex-1' : ''}>
                                        {buttonContent}
                                    </Link>
                                ) : (
                                    buttonContent
                                );
                            })}

                            {/* Admin Actions - Three-dot menu next to primary button */}
                            {adminActions && (
                                <div className="flex-shrink-0">
                                    {adminActions}
                                </div>
                            )}
                        </div>
                    </CardContent>
                );
            })()}
        </Card>
    );
};

export default GenericCard;