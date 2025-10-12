'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VerifyDataPage() {
    const [subjects, setSubjects] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch subjects
            const subjectsRes = await fetch('/api/check-db');
            const subjectsData = await subjectsRes.json();

            if (subjectsData.success) {
                setSubjects(subjectsData.data.subjects || []);
                setMaterials(subjectsData.data.materials || []);
            } else {
                setError('Failed to load data');
            }
        } catch (err) {
            setError('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Verify Seeded Data</h1>
                <p>Loading data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Verify Seeded Data</h1>
                <div className="bg-red-100 p-4 rounded">
                    <p className="text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    const groupedSubjects = subjects.reduce((acc, subject) => {
        if (!acc[subject.category]) {
            acc[subject.category] = [];
        }
        acc[subject.category].push(subject);
        return acc;
    }, {});

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Verify Seeded Data</h1>

            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Database Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-blue-600">{subjects.length}</div>
                                <div className="text-sm text-gray-600">Total Subjects</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-600">{materials.length}</div>
                                <div className="text-sm text-gray-600">Study Materials</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-purple-600">
                                    {Object.keys(groupedSubjects).length}
                                </div>
                                <div className="text-sm text-gray-600">Course Categories</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {Object.entries(groupedSubjects).map(([category, categorySubjects]) => (
                    <Card key={category}>
                        <CardHeader>
                            <CardTitle>{category} Subjects ({categorySubjects.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {categorySubjects.map((subject) => {
                                    const subjectMaterials = materials.filter(m => m.subjectId === subject.id);
                                    return (
                                        <div key={subject.id} className="border rounded p-3">
                                            <div className="font-medium">{subject.name}</div>
                                            <div className="text-sm text-gray-600">
                                                Code: {subject.code} | Semester: {subject.semesterName}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {subjectMaterials.length} study materials available
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Study Materials Sample</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {materials.slice(0, 5).map((material) => {
                            const subject = subjects.find(s => s.id === material.subjectId);
                            return (
                                <div key={material.id} className="border rounded p-3">
                                    <div className="font-medium">{material.title}</div>
                                    <div className="text-sm text-gray-600">
                                        Subject: {subject?.name} | Type: {material.type}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Downloads: {material.downloadCount}
                                    </div>
                                </div>
                            );
                        })}
                        {materials.length > 5 && (
                            <p className="text-sm text-gray-500 text-center">
                                ... and {materials.length - 5} more materials
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}