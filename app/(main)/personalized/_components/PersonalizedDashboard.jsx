"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import PersonalizedNotesList from "./PersonalizedNotesList";

function semesterNameToSlug(name) {
    return (name || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
}

function extractSemesterNumber(name) {
    const match = String(name || "").match(/\d+/);
    return match ? Number(match[0]) : null;
}

export default function PersonalizedDashboard() {
    const router = useRouter();

    const [isBootLoading, setIsBootLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [profileCache, setProfileCache] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [availableSemesters, setAvailableSemesters] = useState([]);

    const [activeSemesterName, setActiveSemesterName] = useState("");
    const [profileSemesterName, setProfileSemesterName] = useState("");
    const [isLoadingSemesterData, setIsLoadingSemesterData] = useState(false);

    const [semesterSubjects, setSemesterSubjects] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [selectedUnitId, setSelectedUnitId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [showSemesterDialog, setShowSemesterDialog] = useState(false);
    const [pendingSemesterName, setPendingSemesterName] = useState("");
    const [isSavingProfileSemester, setIsSavingProfileSemester] = useState(false);

    useEffect(() => {
        const boot = async () => {
            try {
                setIsBootLoading(true);
                setLoadError("");

                let cache = null;
                const raw = localStorage.getItem("user_profile_cache");
                if (raw) {
                    try {
                        cache = JSON.parse(raw);
                    } catch {
                        cache = null;
                    }
                }

                // Fallback to API if local cache missing.
                if (!cache?.courseId) {
                    const profileRes = await fetch("/api/users/profile");
                    const profileData = await profileRes.json();

                    if (!profileRes.ok || !profileData?.success || !profileData?.profile?.courseId) {
                        throw new Error("Profile not completed yet. Please complete your profile first.");
                    }

                    cache = {
                        userId: profileData.profile.userId,
                        courseId: profileData.profile.courseId,
                        courseName: profileData.course?.name || "",
                        heardFrom: profileData.profile.heardFrom || "",
                        semester: profileData.preferredSemester || null,
                        updatedAt: new Date().toISOString(),
                    };
                    localStorage.setItem("user_profile_cache", JSON.stringify(cache));
                }

                let courseName = cache.courseName;
                if (!courseName) {
                    const coursesRes = await fetch("/api/courses/list");
                    const coursesData = await coursesRes.json();
                    const selected = (coursesData?.courses || []).find((course) => course.id === cache.courseId);
                    courseName = selected?.name || "";
                    localStorage.setItem("courses_list_cache", JSON.stringify(coursesData?.courses || []));
                }

                if (!courseName) {
                    throw new Error("Selected course is invalid. Please complete profile again.");
                }

                const courseRes = await fetch(`/api/courses/${encodeURIComponent(courseName)}`);
                const courseData = await courseRes.json();

                if (!courseRes.ok || !courseData?.success) {
                    throw new Error(courseData?.error || "Unable to load course semesters.");
                }

                const semesters = courseData?.course?.semesters || [];
                if (!semesters.length) {
                    throw new Error("No semesters found for selected course.");
                }

                const semesterFromCacheNumber = Number(cache.semester) || null;
                let preferredName = "";

                if (semesterFromCacheNumber) {
                    preferredName = semesters.find((sem) => {
                        const semNo = extractSemesterNumber(sem.name);
                        return semNo === semesterFromCacheNumber;
                    })?.name || "";
                }

                setSelectedCourse({
                    id: cache.courseId,
                    title: courseName,
                    category: courseName,
                });
                setAvailableSemesters(semesters);
                setProfileCache({ ...cache, courseName });

                if (preferredName) {
                    setProfileSemesterName(preferredName);
                    setActiveSemesterName(preferredName);
                } else {
                    setPendingSemesterName(semesters[0].name);
                    setShowSemesterDialog(true);
                }
            } catch (error) {
                setLoadError(error?.message || "Unable to load personalized dashboard.");
            } finally {
                setIsBootLoading(false);
            }
        };

        boot();
    }, []);

    useEffect(() => {
        const loadSemesterData = async () => {
            if (!selectedCourse?.category || !activeSemesterName) return;

            try {
                setIsLoadingSemesterData(true);

                const semesterSlug = semesterNameToSlug(activeSemesterName);
                const semesterRes = await fetch(
                    `/api/courses/${encodeURIComponent(selectedCourse.category)}/semester/${encodeURIComponent(semesterSlug)}`
                );
                const semesterData = await semesterRes.json();

                if (!semesterRes.ok || !semesterData?.success) {
                    throw new Error(semesterData?.error || "Unable to load selected semester.");
                }

                const subjects = (semesterData?.semester?.subjects || []).map((subject) => ({
                    ...subject,
                    materials: (subject?.materials || []).map((material, index) => ({
                        ...material,
                        unit: material?.unit || `Unit ${index + 1}`,
                    })),
                }));

                setSemesterSubjects(subjects);
                setSelectedSubjectId(null);
                setSelectedUnitId(null);
            } catch (error) {
                setLoadError(error?.message || "Unable to load selected semester data.");
            } finally {
                setIsLoadingSemesterData(false);
            }
        };

        loadSemesterData();
    }, [selectedCourse, activeSemesterName]);

    useEffect(() => {
        if (!semesterSubjects.length) {
            setSelectedSubjectId(null);
            setSelectedUnitId(null);
            return;
        }

        const exists = semesterSubjects.some((subject) => subject.id === selectedSubjectId);
        if (!selectedSubjectId || !exists) {
            setSelectedSubjectId(semesterSubjects[0].id);
        }
    }, [semesterSubjects, selectedSubjectId]);

    const selectedSubject = useMemo(() => {
        if (!semesterSubjects.length) return null;
        return semesterSubjects.find((subject) => subject.id === selectedSubjectId) || semesterSubjects[0] || null;
    }, [semesterSubjects, selectedSubjectId]);

    const subjectNotes = selectedSubject?.materials || [];

    const filteredNotes = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return subjectNotes;

        return subjectNotes.filter((note) => {
            const haystack = [note.title, note.description, note.type, note.tags]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            return haystack.includes(query);
        });
    }, [searchQuery, subjectNotes]);

    useEffect(() => {
        if (!filteredNotes.length) {
            setSelectedUnitId(null);
            return;
        }

        const exists = filteredNotes.some((note) => note.id === selectedUnitId);
        if (!selectedUnitId || !exists) {
            setSelectedUnitId(filteredNotes[0].id);
        }
    }, [filteredNotes, selectedUnitId]);

    const selectedUnit = useMemo(() => {
        if (!filteredNotes.length) return null;
        return filteredNotes.find((note) => note.id === selectedUnitId) || filteredNotes[0] || null;
    }, [filteredNotes, selectedUnitId]);

    const selectedSemester = useMemo(() => {
        return availableSemesters.find((semester) => semester.name === activeSemesterName) || null;
    }, [availableSemesters, activeSemesterName]);

    const handleConfirmProfileSemester = async () => {
        if (!pendingSemesterName || !profileCache?.courseId) return;

        const semesterNumber = extractSemesterNumber(pendingSemesterName) || 1;
        setIsSavingProfileSemester(true);

        try {
            const registerRes = await fetch("/api/users/register", { method: "POST" });
            const registerData = await registerRes.json();
            const dbUserId = registerData?.user?.id;

            if (!registerRes.ok || !dbUserId) {
                throw new Error(registerData?.error || "Unable to resolve user.");
            }

            const profileRes = await fetch("/api/users/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: dbUserId,
                    course_id: profileCache.courseId,
                    semester: semesterNumber,
                    heard_from: profileCache.heardFrom || "Unknown",
                }),
            });

            const profileData = await profileRes.json();
            if (!profileRes.ok || !profileData?.success) {
                throw new Error(profileData?.message || "Unable to save semester preference.");
            }

            const nextCache = {
                ...profileCache,
                userId: dbUserId,
                semester: semesterNumber,
                updatedAt: new Date().toISOString(),
            };
            localStorage.setItem("user_profile_cache", JSON.stringify(nextCache));
            setProfileCache(nextCache);
            setProfileSemesterName(pendingSemesterName);
            setActiveSemesterName(pendingSemesterName);
            setShowSemesterDialog(false);
        } catch (error) {
            setLoadError(error?.message || "Unable to save semester preference.");
        } finally {
            setIsSavingProfileSemester(false);
        }
    };

    if (isBootLoading) {
        return (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#30302E] p-6 text-sm text-slate-600 dark:text-slate-300">
                Loading your personalized dashboard...
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="rounded-2xl border border-red-300 dark:border-red-500/40 bg-red-50 dark:bg-red-500/10 p-6 space-y-3">
                <p className="text-sm text-red-700 dark:text-red-300">{loadError}</p>
                <Button type="button" onClick={() => router.push("/profile-completion")}>
                    Go to profile completion
                </Button>
            </div>
        );
    }

    return (
        <>
            <Dialog open={showSemesterDialog}>
                <DialogContent className="sm:max-w-md" hideCloseButton>
                    <DialogHeader>
                        <DialogTitle>Select your semester</DialogTitle>
                        <DialogDescription>
                            Choose your current semester. This will be used as your default personalized view.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2 py-2">
                        <Label htmlFor="initial-semester">Semester</Label>
                        <Select value={pendingSemesterName} onValueChange={setPendingSemesterName}>
                            <SelectTrigger id="initial-semester">
                                <SelectValue placeholder="Choose semester" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableSemesters.map((semester) => (
                                    <SelectItem key={semester.id || semester.name} value={semester.name}>
                                        {semester.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={handleConfirmProfileSemester}
                            disabled={!pendingSemesterName || isSavingProfileSemester}
                        >
                            {isSavingProfileSemester ? "Saving..." : "Continue"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="space-y-6">
                <div className="w-full">
                    <PersonalizedNotesList
                        selectedSubject={selectedSubject}
                        selectedSemester={selectedSemester || (profileSemesterName ? { name: profileSemesterName } : null)}
                        semesters={availableSemesters}
                        activeSemesterName={activeSemesterName}
                        onSemesterChange={setActiveSemesterName}
                        subjects={semesterSubjects}
                        searchQuery={searchQuery}
                        onSearchQueryChange={setSearchQuery}
                        notes={filteredNotes}
                        selectedUnitId={selectedUnitId}
                        onUnitSelect={setSelectedUnitId}
                        selectedUnit={selectedUnit}
                        onSubjectSelect={setSelectedSubjectId}
                    />
                </div>

                {isLoadingSemesterData ? (
                    <div className="text-sm text-slate-600 dark:text-slate-300">Loading selected semester data...</div>
                ) : null}
            </div>
        </>
    );
}
