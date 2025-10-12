"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SeedDefaultPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSeedData = async () => {
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/seed-default', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({
                success: false,
                error: 'Failed to seed data',
                details: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Seed Default Data</h1>

            <div className="space-y-4">
                <p className="text-lg">
                    Click the button below to populate the database with default subjects and study materials for MCA, BCA, and BTECH courses.
                </p>

                <Button
                    onClick={handleSeedData}
                    disabled={loading}
                    className="px-6 py-3 text-lg"
                >
                    {loading ? 'Seeding Data...' : 'Seed Default Data'}
                </Button>

                {result && (
                    <div className="mt-6 p-4 border rounded-lg">
                        {result.success ? (
                            <div className="text-green-600">
                                <h3 className="font-bold text-lg mb-2">Success!</h3>
                                <p>{result.message}</p>
                                <div className="mt-2">
                                    <p><strong>Subjects Added:</strong> {result.summary?.subjectsAdded}</p>
                                    <p><strong>Materials Added:</strong> {result.summary?.materialsAdded}</p>
                                    <p><strong>Courses Processed:</strong> {result.summary?.coursesProcessed}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-red-600">
                                <h3 className="font-bold text-lg mb-2"> Error!</h3>
                                <p>{result.error}</p>
                                {result.details && <p className="mt-2 text-sm">{result.details}</p>}
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                    <h3 className="font-bold mb-2">What will be created:</h3>
                    <ul className="list-disc list-inside space-y-1">
                        <li><strong>MCA:</strong> 10 subjects (5 per semester for Semesters 1-2)</li>
                        <li><strong>BCA:</strong> 10 subjects (5 per semester for Semesters 1-2)</li>
                        <li><strong>BTECH:</strong> 10 subjects (5 per semester for Semesters 1-2)</li>
                        <li><strong>Study Materials:</strong> 4 materials per subject (Lecture Notes, Assignments, Previous Papers, Reference Books)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}