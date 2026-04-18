"use client";

import { useEffect, useMemo, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, FileText, Search, SquareStack } from "lucide-react";
import { getFileType, getViewerUrl } from "@/lib/utils";

function formatDate(value) {
    if (!value) return "Recently added";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Recently added";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function PersonalizedNotesList({
    selectedSubject,
    selectedSemester,
    semesters = [],
    activeSemesterName,
    onSemesterChange,
    subjects = [],
    searchQuery,
    onSearchQueryChange,
    notes = [],
    selectedUnitId,
    onUnitSelect,
    selectedUnit,
    onSubjectSelect,
}) {
    const previewRef = useRef(null);

    const viewerUrl = useMemo(() => {
        if (!selectedUnit?.fileUrl) return null;
        return getViewerUrl(selectedUnit.fileUrl, selectedUnit.type || getFileType(selectedUnit.fileUrl));
    }, [selectedUnit]);

    useEffect(() => {
        if (!selectedUnit || !previewRef.current) return;

        const timeoutId = window.setTimeout(() => {
            previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);

        return () => window.clearTimeout(timeoutId);
    }, [selectedUnit]);

    return (
        <Card className="overflow-hidden border-slate-200/80 dark:border-slate-700 bg-white/90 dark:bg-[#30302E] shadow-sm">
            <CardHeader className="border-b border-slate-200 dark:border-slate-700 pb-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <CardTitle className="text-lg text-slate-900 dark:text-white">Units</CardTitle>
                            <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                                {notes.length} available
                            </Badge>
                        </div>
                        <CardDescription className="text-slate-500 dark:text-slate-400">
                            {selectedSemester ? `${selectedSemester.name}` : "Choose a subject"}
                        </CardDescription>
                    </div>

                    <div className="w-full lg:max-w-sm space-y-3">
                        <Select value={activeSemesterName || undefined} onValueChange={onSemesterChange}>
                            <SelectTrigger className="w-full h-11 bg-slate-50 dark:bg-black/10 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                                <SelectValue placeholder="Choose a semester" />
                            </SelectTrigger>
                            <SelectContent>
                                {semesters.map((semester) => (
                                    <SelectItem key={semester.id || semester.name} value={semester.name}>
                                        {semester.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedSubject?.id ? String(selectedSubject.id) : undefined} onValueChange={(value) => onSubjectSelect(Number(value))}>
                            <SelectTrigger className="w-full h-11 bg-slate-50 dark:bg-black/10 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                                <SelectValue placeholder="Choose a subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {subjects.map((subject) => (
                                    <SelectItem key={subject.id} value={String(subject.id)}>
                                        {subject.code ? `${subject.code} - ` : ""}{subject.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                value={searchQuery}
                                onChange={(event) => onSearchQueryChange(event.target.value)}
                                placeholder="Search units by title or keyword"
                                className="pl-9 h-11 bg-slate-50 dark:bg-black/10 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-4 max-h-[calc(100vh-11rem)] overflow-y-auto">
                <div className="flex flex-wrap gap-3">
                    {notes.map((note) => {
                        const active = note.id === selectedUnitId;
                        return (
                            <button
                                key={note.id}
                                type="button"
                                onClick={() => onUnitSelect(note.id)}
                                className={`rounded-full px-4 py-2 text-sm font-medium border transition-all duration-200 ${active
                                    ? "border-blue-500 bg-blue-600 text-white shadow-sm"
                                    : "border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-black/10 hover:border-blue-300 dark:hover:border-blue-500/50 hover:bg-slate-100 dark:hover:bg-black/20 text-slate-700 dark:text-slate-300"
                                    }`}
                            >
                                {note.unit || `Unit ${note.id}`}
                            </button>
                        );
                    })}

                    {!notes.length ? (
                        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-600 p-8 text-center space-y-2">
                            <FileText className="mx-auto h-10 w-10 text-slate-400" />
                            <p className="font-medium text-slate-900 dark:text-white">No units found</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Try another subject or clear the search field to see all available units.
                            </p>
                        </div>
                    ) : null}
                </div>

                <div ref={previewRef} className="scroll-mt-6 rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-black/10 overflow-hidden">
                    <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
                        <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedUnit?.unit || "Unit preview"}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{selectedUnit?.title || "Select a unit above"}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <FileText className="h-4 w-4" />
                            Scroll here to read the PDF
                        </div>
                    </div>

                    {selectedUnit ? (
                        viewerUrl ? (
                            <iframe
                                title={selectedUnit.title}
                                src={viewerUrl}
                                className="h-[640px] w-full border-0 bg-white dark:bg-black"
                                allow="autoplay; clipboard-read; clipboard-write"
                            />
                        ) : (
                            <div className="flex h-[640px] items-center justify-center p-8 text-center text-slate-500 dark:text-slate-400">
                                <div className="space-y-3 max-w-sm">
                                    <FileText className="mx-auto h-12 w-12 text-slate-400" />
                                    <p className="font-medium text-slate-900 dark:text-white">Preview unavailable</p>
                                    <p className="text-sm">This unit does not currently have a previewable file link.</p>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="flex h-[640px] items-center justify-center p-8 text-center text-slate-500 dark:text-slate-400">
                            <div className="space-y-3 max-w-sm">
                                <SquareStack className="mx-auto h-12 w-12 text-slate-400" />
                                <p className="font-medium text-slate-900 dark:text-white">Pick a unit</p>
                                <p className="text-sm">Select a unit from above to load its PDF below.</p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}