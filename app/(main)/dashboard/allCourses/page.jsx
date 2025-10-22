"use client"
import React, { useState } from 'react'
import CoursesCard from './_components/CoursesCard';
import SearchFilterToolbar from '../../_components/SearchFilterToolbar'

const page = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    return (
        <div>
            <SearchFilterToolbar
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onFilterClick={() => console.log('Filter clicked')}
            />
            <CoursesCard
                searchQuery={searchQuery}
                viewMode={viewMode}
            />
        </div>
    )
}

export default page;