"use client";
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Grid, List, Search } from 'lucide-react';

/**
 * SearchFilterToolbar - Reusable search, filter, and view mode toolbar
 * Styled similar to WelcomeContainer
 * 
 * Props:
 * - searchValue: current search query
 * - onSearchChange: (value) => void
 * - viewMode: 'grid' | 'list'
 * - onViewModeChange: (mode) => void
 * - onFilterClick: () => void (optional)
 */
const SearchFilterToolbar = ({
    searchValue = '',
    onSearchChange = () => { },
    viewMode = 'grid',
    onViewModeChange = () => { },
    onFilterClick = () => { }
}) => {
    return (
        <div className="mb-6 p-6 rounded-lg bg-white dark:bg-[rgb(38,38,36)] border border-gray-300 dark:border-gray-700">
            {/* Search and Controls in one row */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between" >
                <div className="flex-1 max-w-md relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500 dark:text-slate-400" />
                    <Input
                        placeholder="Search courses, categories, or topics..."
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-12 h-12 text-base border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[rgb(24,24,24)] text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 border-gray-300 dark:border-gray-600"
                    />
                </div>

                <div className="flex gap-3 items-center">
                    <Button
                        variant="outline"
                        onClick={onFilterClick}
                        className="h-12 px-4 shadow-sm border-gray-300 dark:border-gray-600 text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>

                    <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-300 dark:border-gray-600">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => onViewModeChange('grid')}
                            className={`rounded-none h-12 px-4 ${viewMode === "grid"
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                                }`}
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => onViewModeChange('list')}
                            className={`rounded-none h-12 px-4 ${viewMode === "list"
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                                }`}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchFilterToolbar;
