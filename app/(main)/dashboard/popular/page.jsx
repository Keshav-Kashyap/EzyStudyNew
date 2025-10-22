"use client"

import React, { useState } from 'react'
import PopularNotesGrid from './_components/PupularNotesGrid'
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
            <PopularNotesGrid />
        </div>
    )
}

export default page