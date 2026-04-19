import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="py-12 bg-gray-900 text-white">
            <div className="container mx-auto px-4 text-center">
                <p className="text-gray-400">© 2026 Ezy Learn. All rights reserved.</p>
                <div className="mt-4 flex items-center justify-center gap-5 text-sm text-gray-300">
                    <Link href="/terms" className="hover:text-white hover:underline">
                        Terms
                    </Link>
                    <span aria-hidden="true">|</span>
                    <Link href="/privacy-policy" className="hover:text-white hover:underline">
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </footer>
    );
}
