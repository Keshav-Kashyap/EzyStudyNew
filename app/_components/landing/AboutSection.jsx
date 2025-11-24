import TeamSection from '@/components/about/TeamSection';
import ContactSection from '@/components/about/ContactSection';

export default function AboutSection() {
    return (
        <section id="about" className="w-full py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-[rgb(24,24,24)] dark:via-[rgb(28,28,32)] dark:to-[rgb(32,28,36)]">
            <div className="max-w-7xl mx-auto px-6">
                <TeamSection />
                <ContactSection />
            </div>
        </section>
    );
}
