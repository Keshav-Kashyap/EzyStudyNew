import Link from 'next/link';
import { generateMetadata as generateSeoMetadata } from '@/lib/seo-config';

export const metadata = generateSeoMetadata({
    title: 'Terms and Conditions',
    description: 'Read the terms and conditions for using Ezy Learn and its educational services.',
    url: '/terms',
    keywords: ['terms and conditions', 'Ezy Learn terms', 'user agreement'],
});

const LAST_UPDATED = 'April 19, 2026';

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[rgb(38,38,36)]">
            <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                        Terms and Conditions
                    </h1>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                        Last updated: {LAST_UPDATED}
                    </p>

                    <div className="mt-8 space-y-6 text-slate-700 dark:text-slate-300">
                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">1. Acceptance of Terms</h2>
                            <p className="mt-2 leading-7">
                                By accessing or using Ezy Learn, you agree to follow these Terms and our Privacy Policy. If you do not
                                agree, please do not use the platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">2. Platform Purpose</h2>
                            <p className="mt-2 leading-7">
                                Ezy Learn provides academic resources such as notes, syllabus support, and study materials for educational
                                use only. Content is provided as-is for learning and reference.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">3. User Responsibilities</h2>
                            <ul className="mt-2 list-disc space-y-2 pl-6 leading-7">
                                <li>Use the platform only for lawful and educational purposes.</li>
                                <li>Do not upload, share, or distribute harmful, illegal, or misleading content.</li>
                                <li>Do not attempt unauthorized access to other accounts, admin systems, or platform data.</li>
                                <li>Respect copyright and intellectual property rights of all content owners.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">4. Accounts and Access</h2>
                            <p className="mt-2 leading-7">
                                Some sections may require sign-in. You are responsible for keeping your account credentials secure and for
                                activities under your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">5. Intellectual Property</h2>
                            <p className="mt-2 leading-7">
                                All platform branding, layout, and original content belong to Ezy Learn or respective owners. You may not
                                reproduce or redistribute materials for commercial use without permission.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">6. Disclaimer</h2>
                            <p className="mt-2 leading-7">
                                We work to keep materials accurate and useful, but we do not guarantee complete accuracy, reliability, or
                                suitability for all exams and institutions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">7. Limitation of Liability</h2>
                            <p className="mt-2 leading-7">
                                Ezy Learn is not liable for any direct or indirect loss resulting from use of the platform, including
                                reliance on study material outcomes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">8. Changes to Terms</h2>
                            <p className="mt-2 leading-7">
                                We may update these Terms from time to time. Updated terms become effective once published on this page.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">9. Contact</h2>
                            <p className="mt-2 leading-7">
                                If you have questions about these Terms, contact us via the support channels on the home page.
                                You can also review our{' '}
                                <Link href="/privacy-policy" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                                    Privacy Policy
                                </Link>
                                .
                            </p>
                        </section>
                    </div>
                </div>
            </section>
        </main>
    );
}