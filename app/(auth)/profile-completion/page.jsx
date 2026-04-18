"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const HEARD_OPTIONS = [
    "YouTube",
    "Instagram",
    "Google Search",
    "Friend / Classmate",
    "Teacher / Coaching",
    "Telegram / WhatsApp",
    "Other",
];

function StepProgress({ currentStep }) {
    const percent = currentStep === 1 ? 50 : 100;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-800 dark:text-white">Step {currentStep} of 2</span>
                <span className="text-slate-500 dark:text-slate-300">{percent}% complete</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}

export default function ProfileCompletionPage() {
    const { isLoaded, isSignedIn } = useUser();
    const router = useRouter();
    const [step, setStep] = useState(1);

    const [heardFrom, setHeardFrom] = useState("");
    const [heardOther, setHeardOther] = useState("");

    const [courses, setCourses] = useState([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [semester, setSemester] = useState("1");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        const cachedProfile = localStorage.getItem("user_profile_cache");
        if (cachedProfile) {
            try {
                const parsed = JSON.parse(cachedProfile);
                if (parsed?.courseId) setSelectedCourseId(parsed.courseId);
                if (parsed?.semester) setSemester(String(parsed.semester));
                if (parsed?.heardFrom) setHeardFrom(parsed.heardFrom);
            } catch {
                // Ignore invalid cache and continue fresh.
            }
        }

        const fetchCourses = async () => {
            try {
                setIsLoadingCourses(true);
                const response = await fetch("/api/courses/list");
                const data = await response.json();

                if (data?.success && Array.isArray(data?.courses)) {
                    setCourses(data.courses);
                    localStorage.setItem("courses_list_cache", JSON.stringify(data.courses));
                } else {
                    setCourses([]);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
                const cachedCourses = localStorage.getItem("courses_list_cache");
                if (cachedCourses) {
                    try {
                        setCourses(JSON.parse(cachedCourses));
                    } catch {
                        setCourses([]);
                    }
                } else {
                    setCourses([]);
                }
            } finally {
                setIsLoadingCourses(false);
            }
        };

        fetchCourses();
    }, []);

    const canContinueStep1 = useMemo(() => {
        if (!heardFrom) return false;
        if (heardFrom === "Other" && !heardOther.trim()) return false;
        return true;
    }, [heardFrom, heardOther]);

    const canFinish = Boolean(selectedCourseId) && Boolean(semester);

    const toggleCourse = (courseId) => {
        setSelectedCourseId((prev) => (prev === courseId ? null : courseId));
    };

    const finishProfile = async () => {
        if (!isLoaded || !isSignedIn) {
            setSubmitError("Please sign in first.");
            return;
        }

        if (!selectedCourseId || !semester) {
            setSubmitError("Please select course and semester.");
            return;
        }

        setSubmitError("");
        setIsSubmitting(true);

        try {
            // Ensure user exists in local DB and get integer user id.
            const registerRes = await fetch("/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const registerData = await registerRes.json();
            const dbUserId = registerData?.user?.id;

            if (!registerRes.ok || !dbUserId) {
                throw new Error(registerData?.error || "Failed to resolve user profile id");
            }

            const heardFromValue = heardFrom === "Other" ? heardOther.trim() : heardFrom;
            const profileRes = await fetch("/api/users/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: dbUserId,
                    course_id: selectedCourseId,
                    semester: Number(semester),
                    heard_from: heardFromValue,
                }),
            });

            const profileData = await profileRes.json();

            if (!profileRes.ok || !profileData?.success) {
                throw new Error(profileData?.message || "Failed to save profile");
            }

            const selectedCourse = courses.find((course) => course?.id === selectedCourseId);
            localStorage.setItem("user_profile_cache", JSON.stringify({
                userId: dbUserId,
                courseId: selectedCourseId,
                courseName: selectedCourse?.name || "",
                semester: Number(semester),
                heardFrom: heardFromValue,
                updatedAt: new Date().toISOString(),
            }));

            router.push("/personalized");
        } catch (error) {
            setSubmitError(error?.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-white px-4 py-10 text-slate-900 dark:bg-[rgb(38,38,36)] dark:text-white sm:py-14">
            <div className="mx-auto w-full max-w-3xl">
                <div className="mb-6 flex items-center gap-2 text-sm font-medium text-cyan-700 dark:text-cyan-300">
                    <Sparkles className="h-4 w-4" />
                    Quick Setup
                </div>

                <Card className="border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#30302E]">
                    <CardHeader className="space-y-4">
                        <CardTitle className="text-2xl sm:text-3xl">Complete Your Profile</CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-300">
                            2 quick steps to personalize your learning dashboard and recommendations.
                        </CardDescription>
                        <StepProgress currentStep={step} />
                    </CardHeader>

                    <CardContent className="space-y-8">
                        {step === 1 && (
                            <section className="space-y-5">
                                <div>
                                    <h2 className="text-lg font-semibold">How did you hear about us?</h2>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                        This helps us understand where students are discovering Ezy Learn.
                                    </p>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    {HEARD_OPTIONS.map((option) => {
                                        const active = heardFrom === option;
                                        return (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => setHeardFrom(option)}
                                                className={cn(
                                                    "rounded-xl border px-4 py-3 text-left text-sm transition-all",
                                                    "hover:border-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10",
                                                    active
                                                        ? "border-cyan-500 bg-cyan-50 text-slate-900 shadow-sm ring-2 ring-cyan-500/25 dark:bg-cyan-500/15 dark:text-white"
                                                        : "border-slate-300 bg-white text-slate-900 dark:border-white/10 dark:bg-[#262624] dark:text-white"
                                                )}
                                            >
                                                <span className="font-medium">{option}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {heardFrom === "Other" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="heard-other">Please specify source</Label>
                                        <Input
                                            id="heard-other"
                                            value={heardOther}
                                            onChange={(e) => setHeardOther(e.target.value)}
                                            placeholder="Ex: College seminar, blog, offline poster"
                                        />
                                    </div>
                                )}
                            </section>
                        )}

                        {step === 2 && (
                            <section className="space-y-5">
                                <div>
                                    <h2 className="text-lg font-semibold">Choose your courses</h2>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                        Please select your course and semester.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="semester">Select semester</Label>
                                    <Input
                                        id="semester"
                                        type="number"
                                        min="1"
                                        max="12"
                                        value={semester}
                                        onChange={(event) => setSemester(event.target.value)}
                                        placeholder="Ex: 1"
                                    />
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    {isLoadingCourses && (
                                        <p className="text-sm text-slate-600 dark:text-slate-300">Loading courses...</p>
                                    )}

                                    {!isLoadingCourses && courses.length === 0 && (
                                        <p className="text-sm text-red-600 dark:text-red-300">
                                            No courses found. Please refresh and try again.
                                        </p>
                                    )}

                                    {!isLoadingCourses && courses.map((course) => {
                                        const courseName = course?.name || "";
                                        const active = selectedCourseId === course?.id;

                                        return (
                                            <button
                                                key={course?.id ?? courseName}
                                                type="button"
                                                onClick={() => toggleCourse(course?.id)}
                                                className={cn(
                                                    "rounded-xl border px-4 py-3 text-left text-sm transition-all",
                                                    "hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10",
                                                    active
                                                        ? "border-emerald-500 bg-emerald-50 text-slate-900 shadow-sm ring-2 ring-emerald-500/25 dark:bg-emerald-500/15 dark:text-white"
                                                        : "border-slate-300 bg-white text-slate-900 dark:border-white/10 dark:bg-[#262624] dark:text-white"
                                                )}
                                            >
                                                <span className="flex items-center justify-between gap-3 font-medium">
                                                    {courseName}
                                                    {active && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {submitError && (
                                    <p className="text-sm text-red-600 dark:text-red-300">{submitError}</p>
                                )}

                            </section>
                        )}

                        <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => (step === 1 ? setStep(2) : setStep(1))}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                {step === 1 ? "Skip for now" : "Back"}
                            </Button>

                            {step === 1 ? (
                                <Button type="button" onClick={() => setStep(2)} disabled={!canContinueStep1}>
                                    Continue
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            ) : (
                                <Button type="button" onClick={finishProfile} disabled={!canFinish || isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Finish Setup"}
                                    <CheckCircle2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
