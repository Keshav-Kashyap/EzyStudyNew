import { GraduationCap } from 'lucide-react'
import React from 'react'

const HeroHeader = ({ heading, subHeading, icon: Icon }) => {
    return (
        <div className="flex justify-between items-start mb-10">
            <div className="flex-1">
                <div className="flex items-center gap-2 sm:gap-4 mb-6">
                    <div className="p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-lg border border-blue-200 dark:border-blue-800">
                        {Icon && <Icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />}
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 sm:mb-2 text-slate-900 dark:text-white">
                            {heading}
                        </h1>
                        <p className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-300">
                            {subHeading}
                        </p>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default HeroHeader