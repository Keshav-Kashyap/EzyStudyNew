import { X } from "lucide-react";
import { UserProfile } from "@clerk/clerk-react";

function SettingsDialog({ isSettingsOpen, setIsSettingsOpen }) {
    if (!isSettingsOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setIsSettingsOpen(false)}
        >
            {/* Close button */}
            <button
                onClick={() => setIsSettingsOpen(false)}
                className="fixed top-8 right-8 z-[60] text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2 hover:bg-black/70"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Clerk User Profile - Click propagation stop */}
            <div
                className="relative z-[55]"
                onClick={(e) => e.stopPropagation()}
            >
                <UserProfile
                    appearance={{
                        baseTheme: undefined,
                        variables: {
                            colorBackground: "#181818",
                            colorPrimary: "#ffffff",
                            colorText: "#ffffff",
                        },
                        elements: {
                            rootBox: "w-full h-full bg-[#181818] text-white",
                            card: "shadow-none bg-[#181818] border-none",
                        },
                    }}
                />
            </div>
        </div>
    );
}

export default SettingsDialog;