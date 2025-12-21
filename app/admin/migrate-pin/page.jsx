"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, Database } from 'lucide-react';
import { toast } from 'sonner';

export default function MigrationPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const runMigration = async () => {
        setLoading(true);
        setResult(null);
        
        try {
            const response = await fetch('/api/migrate/add-pinned-columns');
            const data = await response.json();
            
            setResult(data);
            
            if (data.success) {
                toast.success('Migration completed successfully!');
            } else {
                toast.error('Migration failed: ' + data.error);
            }
        } catch (error) {
            setResult({ success: false, error: error.message });
            toast.error('Migration failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="w-6 h-6" />
                            Database Migration - Add Pin Columns
                        </CardTitle>
                        <CardDescription>
                            Run this migration to add pin functionality to materials
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                What this migration does:
                            </h3>
                            <ul className="list-disc list-inside text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                <li>Adds <code>isPinned</code> column to material_subject_mapping table</li>
                                <li>Adds <code>pinnedAt</code> column to track when material was pinned</li>
                                <li>Creates an index for better query performance</li>
                                <li>Enables admins to pin up to 3 materials per subject</li>
                            </ul>
                        </div>

                        <Button 
                            onClick={runMigration} 
                            disabled={loading}
                            className="w-full"
                            size="lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Running Migration...
                                </>
                            ) : (
                                <>
                                    <Database className="w-4 h-4 mr-2" />
                                    Run Migration
                                </>
                            )}
                        </Button>

                        {result && (
                            <div className={`p-4 rounded-lg border ${
                                result.success 
                                    ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' 
                                    : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                            }`}>
                                <div className="flex items-start gap-2">
                                    {result.success ? (
                                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                    )}
                                    <div className="flex-1">
                                        <p className={`font-semibold ${
                                            result.success 
                                                ? 'text-green-900 dark:text-green-100' 
                                                : 'text-red-900 dark:text-red-100'
                                        }`}>
                                            {result.success ? 'Success!' : 'Error'}
                                        </p>
                                        <p className={`text-sm mt-1 ${
                                            result.success 
                                                ? 'text-green-800 dark:text-green-200' 
                                                : 'text-red-800 dark:text-red-200'
                                        }`}>
                                            {result.message || result.error}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
