import { GraduationCap } from 'lucide-react'
import React from 'react'

const HeroHeader = ({ heading, subHeading, icon: Icon }) => {
    return (
        <div className="flex justify-between items-start mb-10">
            <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-lg border border-blue-200 dark:border-blue-800">
                        {Icon && <Icon className="h-8 w-8" />}
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 text-slate-900 dark:text-white">
                            {heading}
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300">
                            {subHeading}
                        </p>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default HeroHeader