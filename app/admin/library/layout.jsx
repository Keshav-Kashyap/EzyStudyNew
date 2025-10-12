"use client";
import UploadSection from "./_components/UploadSection";

export default function LibraryLayout({ children }) {
    return (

        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
            <UploadSection />
            <main >{children}</main>
        </div>

    );
}
