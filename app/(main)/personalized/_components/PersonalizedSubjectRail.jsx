"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Search } from "lucide-react";
import { useMemo, useState } from "react";

export default function PersonalizedSubjectRail({
    courseTitle,
    courseCategory,
    semesterName,
    subjects = [],
    selectedSubjectId,
    onSubjectSelect,
}) {
    const [subjectFilter, setSubjectFilter] = useState("");

    const filteredSubjects = useMemo(() => {
        const query = subjectFilter.trim().toLowerCase();
        if (!query) return subjects;

        return subjects.filter((subject) => {
            const haystack = [subject.name, subject.code, subject.description]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            return haystack.includes(query);
        });
    }, [subjects, subjectFilter]);

    return (
        <Card className="sticky top-6 overflow-hidden border-slate-200/80 dark:border-slate-700 bg-white/90 dark:bg-[#30302E] shadow-sm">
            <CardHeader className="border-b border-slate-200 dark:border-slate-700 pb-5">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <CardTitle className="text-lg text-slate-900 dark:text-white">Subjects</CardTitle>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{courseTitle || "Course"} • {semesterName || "Semester"}</p>
                    </div>
                    <div className="h-10 w-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <BookOpen className="h-5 w-5" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4 max-h-[calc(100vh-11rem)] overflow-y-auto">
                <div className="space-y-2">
                    <label className="relative block">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            value={subjectFilter}
                            onChange={(event) => setSubjectFilter(event.target.value)}
                            placeholder="Filter subjects"
                            className="pl-9 h-11 bg-slate-50 dark:bg-black/10 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400"
                        />
                    </label>
                </div>

                <div className="space-y-3">
                    {filteredSubjects.map((subject) => {
                        const activeSubject = subject.id === selectedSubjectId;
                        return (
                            <button
                                key={subject.id}
                                type="button"
                                onClick={() => onSubjectSelect(subject.id)}
                                className={`w-full px-4 py-3 text-left rounded-2xl border transition-all flex items-start justify-between gap-3 ${activeSubject
                                    ? "bg-slate-900 text-white dark:bg-slate-950 border-slate-900 dark:border-slate-800"
                                    : "bg-slate-50/80 dark:bg-black/10 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-black/20 text-slate-700 dark:text-slate-300"
                                    }`}
                            >
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-medium leading-tight">{subject.name}</p>
                                        {subject.code ? (
                                            <Badge variant="outline" className="border-slate-300 dark:border-slate-600 text-[10px] uppercase tracking-[0.16em]">
                                                {subject.code}
                                            </Badge>
                                        ) : null}
                                    </div>
                                    <p className="text-xs leading-relaxed text-inherit/70">
                                        {subject.materials?.length || 0} notes available
                                    </p>
                                </div>
                            </button>
                        );
                    })}

                    {!filteredSubjects.length ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 p-5 text-center text-sm text-slate-500 dark:text-slate-400">
                            No subjects match your current filter.
                        </div>
                    ) : null}
                </div>
            </CardContent>
        </Card>
    );
}