import Link from 'next/link';
import { generateMetadata as generateSeoMetadata } from '@/lib/seo-config';

export const metadata = generateSeoMetadata({
    title: 'Privacy Policy',
    description: 'Read how Ezy Learn collects, uses, and protects your information.',
    url: '/privacy-policy',
    keywords: ['privacy policy', 'data protection', 'Ezy Learn privacy'],
});

const LAST_UPDATED = 'April 19, 2026';

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[rgb(38,38,36)]">
            <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                        Privacy Policy
                    </h1>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                        Last updated: {LAST_UPDATED}
                    </p>

                    <div className="mt-8 space-y-6 text-slate-700 dark:text-slate-300">
                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">1. Information We Collect</h2>
                            <ul className="mt-2 list-disc space-y-2 pl-6 leading-7">
                                <li>Basic profile details required for account access and platform personalization.</li>
                                <li>Usage data such as pages visited, features used, and interaction patterns.</li>
                                <li>Technical data including browser type, device information, and IP-based diagnostics.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">2. How We Use Information</h2>
                            <ul className="mt-2 list-disc space-y-2 pl-6 leading-7">
                                <li>To provide and improve study resources and platform features.</li>
                                <li>To secure accounts, prevent abuse, and monitor reliability.</li>
                                <li>To communicate important service updates and support responses.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">3. Data Sharing</h2>
                            <p className="mt-2 leading-7">
                                We do not sell personal data. Information may be shared only with trusted service providers that help operate
                                authentication, hosting, analytics, and core functionality, under appropriate safeguards.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">4. Cookies and Similar Technologies</h2>
                            <p className="mt-2 leading-7">
                                We may use cookies or local storage to keep sessions active, remember preferences, and improve performance.
                                You can manage cookie preferences through your browser settings.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">5. Data Security</h2>
                            <p className="mt-2 leading-7">
                                We use reasonable administrative and technical measures to protect your information. However, no internet
                                transmission method is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">6. Data Retention</h2>
                            <p className="mt-2 leading-7">
                                We retain personal data only as long as needed for service delivery, legal compliance, and security purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">7. Your Rights</h2>
                            <p className="mt-2 leading-7">
                                Depending on applicable law, you may request access, correction, or deletion of your personal information.
                                You can contact us for such requests.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">8. Children&apos;s Privacy</h2>
                            <p className="mt-2 leading-7">
                                The platform is intended for students and learners. If you believe a minor has provided inappropriate personal
                                data, please contact us so we can review and take action.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">9. Policy Updates</h2>
                            <p className="mt-2 leading-7">
                                We may update this Privacy Policy periodically. Changes are effective once posted on this page with a revised
                                date.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">10. Contact</h2>
                            <p className="mt-2 leading-7">
                                For privacy-related questions, contact us through the support options available on the website. You can also
                                read our{' '}
                                <Link href="/terms" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                                    Terms and Conditions
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