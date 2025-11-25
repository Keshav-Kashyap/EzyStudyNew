import { X } from "lucide-react";
import { UserProfile } from "@clerk/clerk-react";

function SettingsDialog({ isSettingsOpen, setIsSettingsOpen }) {
    if (!isSettingsOpen) return null;

    return (
        <div
            className="fixed inset-0  bg-red flex items-center justify-center flex-col p-4"
            onClick={() => setIsSettingsOpen(false)}
        >

           
            <div
                className="relative z-[55]"
                onClick={(e) => e.stopPropagation()}
            >
                <UserProfile

                />
            </div>
        </div>
    );
}

export default SettingsDialog;