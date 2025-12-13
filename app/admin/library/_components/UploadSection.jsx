"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import CreateMaterialButton from './CreateMaterialButton'

const UploadSection = () => {
    const params = useParams();

    // Extract category (code) and semester from URL if present
    const category = params?.code || null; // e.g., "MCA"
    const semesterIdParam = params?.semesterId || null; // e.g., "semester-1"

    // Convert semester ID back to semester name (semester-1 -> Semester 1)
    const semesterName = semesterIdParam
        ? semesterIdParam
            .split('-')
            .map((word, index) =>
                index === 0
                    ? word.charAt(0).toUpperCase() + word.slice(1)
                    : word
            )
            .join(' ')
        : null;
    return (
        <div className='bg-white dark:bg-[rgb(38,38,36)] shadow-2xl'>
            <div className='px-8 py-6 border-b border-gray-200 dark:border-slate-700/50'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight'>
                            Create New Material
                        </h1>
                        <p className='text-sm text-gray-600 dark:text-slate-400'>
                            Manage your educational content with subject codes
                        </p>
                    </div>
                    <div className='hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800/50 rounded-lg border border-gray-300 dark:border-slate-700/30'>
                        <svg className='w-5 h-5 text-emerald-600 dark:text-emerald-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                        </svg>
                        <span className='text-sm font-medium text-gray-700 dark:text-slate-300'>Content Manager</span>
                    </div>
                </div>
            </div>

            <div className='px-8 py-6 bg-gray-50 dark:bg-transparent'>
                <div className='flex flex-wrap gap-3'>
                    <CreateMaterialButton formtype={"material"} category={category} semesterName={semesterName} />
                    <CreateMaterialButton formtype={"subject"} category={category} semesterName={semesterName} />
                    <CreateMaterialButton formtype={"semester"} category={category} />
                    <CreateMaterialButton formtype={"course"} />
                </div>
            </div>
        </div>
    )
}

export default UploadSection