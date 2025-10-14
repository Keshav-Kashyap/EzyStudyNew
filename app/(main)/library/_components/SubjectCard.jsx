
"use client"
import React, { useState, useEffect } from 'react';
import { Download, ArrowLeft, Loader2 } from 'lucide-react';
import { useParams } from "next/navigation";
import Link from 'next/link';

const SubjectCard = ({ subject, onDownload }) => {
    return (
        <div className="bg-white dark:bg-[rgb(24,24,24)] rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {subject.name}
                </h3>
                {subject.code && (
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        {subject.code}
                    </span>
                )}
            </div>

            {/* Materials List */}
            <div className="space-y-3  ">
                {subject.materials && subject.materials.length > 0 ? (
                    subject.materials.map((material) => (
                        <div
                            key={material.id}
                            className="flex items-center flex-wrap justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                        >
                            <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {material.title}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {material.type || 'PDF'} • {material.size || '2.5 MB'}
                                </p>
                            </div>
                            <button
                                onClick={() => onDownload(material)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                            >
                                <Download className="h-4 w-4" />
                                Download
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                        No materials available
                    </p>
                )}
            </div>
        </div>
    );
};


export default SubjectCard;