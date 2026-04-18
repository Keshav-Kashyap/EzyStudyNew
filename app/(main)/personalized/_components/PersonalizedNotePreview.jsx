"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink, FileText, Layers3, MonitorPlay, PanelRightOpen } from "lucide-react";
import { getFileType, getViewerUrl } from "@/lib/utils";

function formatDate(value) {
    if (!value) return "Recently updated";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Recently updated";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function PersonalizedNotePreview({ selectedCourse, selectedSemester, selectedSubject, selectedNote }) {
    const viewerUrl = selectedNote?.fileUrl ? getViewerUrl(selectedNote.fileUrl, selectedNote.type || getFileType(selectedNote.fileUrl)) : null;

    return (
        <Card className="sticky top-6 overflow-hidden border-slate-200/80 dark:border-slate-700 bg-white/90 dark:bg-[#30302E] shadow-sm">
            <CardHeader className="border-b border-slate-200 dark:border-slate-700 pb-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                        <CardTitle className="text-lg text-slate-900 dark:text-white">Preview</CardTitle>
                        <CardDescription className="text-slate-500 dark:text-slate-400">
                            {selectedNote ? "Open the document in the panel below" : "Pick a note to start reading"}
                        </CardDescription>
                    </div>
                    <div className="h-10 w-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <PanelRightOpen className="h-5 w-5" />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-4 max-h-[calc(100vh-11rem)] overflow-y-auto">
                {selectedNote ? (
                    <>
                        <div className="space-y-4 rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/10 p-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge className="bg-blue-600 text-white hover:bg-blue-600">{selectedNote.type || "PDF"}</Badge>
                                <Badge variant="outline" className="border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300">
                                    {selectedSubject?.name || "Subject"}
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{selectedNote.title}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300">{selectedNote.description || "This note is ready to preview in the reader."}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-black/20 p-3">
                                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Course</p>
                                    <p className="mt-1 font-medium text-slate-900 dark:text-white">{selectedCourse?.category || "N/A"}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-black/20 p-3">
                                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Semester</p>
                                    <p className="mt-1 font-medium text-slate-900 dark:text-white">{selectedSemester?.name || "N/A"}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-black/20 p-3">
                                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Notes</p>
                                    <p className="mt-1 font-medium text-slate-900 dark:text-white">{selectedSubject?.materials?.length || 0}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-black/20 p-3">
                                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Updated</p>
                                    <p className="mt-1 font-medium text-slate-900 dark:text-white">{formatDate(selectedNote.createdAt)}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                                    <a href={selectedNote.fileUrl || "#"} target="_blank" rel="noreferrer">
                                        <ExternalLink className="mr-2 h-4 w-4" /> Open source
                                    </a>
                                </Button>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200">
                                            <MonitorPlay className="mr-2 h-4 w-4" /> Full reader
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-[96vw] w-[96vw] h-[92vh] p-0 overflow-hidden border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181818]">
                                        <div className="flex h-full flex-col">
                                            <DialogHeader className="p-5 border-b border-slate-200 dark:border-slate-700 text-left">
                                                <DialogTitle className="text-slate-900 dark:text-white">{selectedNote.title}</DialogTitle>
                                                <DialogDescription className="text-slate-500 dark:text-slate-400">
                                                    {selectedSubject?.name || "Subject"} • {selectedSemester?.name || "Semester"}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex-1 bg-slate-100 dark:bg-black/30">
                                                {viewerUrl ? (
                                                    <iframe
                                                        title={selectedNote.title}
                                                        src={viewerUrl}
                                                        className="h-full w-full border-0"
                                                        allow="autoplay; clipboard-read; clipboard-write"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center p-8 text-center text-slate-500 dark:text-slate-400">
                                                        <div className="space-y-3 max-w-sm">
                                                            <FileText className="mx-auto h-12 w-12 text-slate-400" />
                                                            <p className="font-medium text-slate-900 dark:text-white">Preview unavailable</p>
                                                            <p className="text-sm">This note does not currently have a previewable file link.</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-black/5 dark:bg-black/20">
                            {viewerUrl ? (
                                <iframe
                                    title={selectedNote.title}
                                    src={viewerUrl}
                                    className="h-[540px] w-full border-0 bg-white dark:bg-black"
                                    allow="autoplay; clipboard-read; clipboard-write"
                                />
                            ) : (
                                <div className="flex h-[540px] items-center justify-center p-8 text-center text-slate-500 dark:text-slate-400">
                                    <div className="space-y-3 max-w-sm">
                                        <FileText className="mx-auto h-12 w-12 text-slate-400" />
                                        <p className="font-medium text-slate-900 dark:text-white">No preview link available</p>
                                        <p className="text-sm">Open the source link to view or download this note.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex h-[660px] items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50/80 dark:bg-black/10 p-8 text-center">
                        <div className="space-y-4 max-w-sm">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <Layers3 className="h-8 w-8" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-lg font-semibold text-slate-900 dark:text-white">Choose a note to preview</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Select a subject on the left, then click a note in the middle to open the document here.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}