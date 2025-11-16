"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import EzyLoader from './(main)/_components/Loading'
import { useContext, useEffect, useState } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import JsonLd from '@/components/JsonLd';
import {
  generateOrganizationJsonLd,
  generateBreadcrumbJsonLd,
  generateWebsiteJsonLd,
  generateEducationalPlatformJsonLd,
  siteConfig
} from '@/lib/seo-config';
import { BookOpen, FileText, Download, Users, Star, ArrowRight, CheckCircle, Zap, Shield, TrendingUp, Award, GraduationCap, MessageSquare } from 'lucide-react'; 'lucide-react';
import { usePopularNotes, usePopularCourses, useReviews } from '@/hooks/useCourses';
import PopularNotesSection from '@/components/sections/PopularNotesSection';

export default function HeroSectionOne() {
  const { isSignedIn, user } = useUser();
  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();

  // Fetch popular notes and courses
  const { data: popularNotesData, isLoading: notesLoading } = usePopularNotes();
  const { data: popularCoursesData, isLoading: coursesLoading } = usePopularCourses();

  const popularNotes = popularNotesData?.notes?.slice(0, 3) || [];
  const courses = Array.isArray(popularCoursesData) ? popularCoursesData : [];

  const onDashboard = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/sign-in')
    }
  }

  // Structured data for SEO
  const organizationData = generateOrganizationJsonLd();
  const websiteData = generateWebsiteJsonLd();
  const platformData = generateEducationalPlatformJsonLd();

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Ezy Learn?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ezy Learn is a free educational platform providing comprehensive study materials, notes, and PDF documents for MCA, BCA, and BTech courses. We offer 500+ materials with proper study structure and YouTube channel recommendations."
        }
      },
      {
        "@type": "Question",
        "name": "Is Ezy Learn free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Ezy Learn is completely free. You can access all study materials, download PDFs, and use all features without any payment."
        }
      },
      {
        "@type": "Question",
        "name": "What courses are available on Ezy Learn?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We currently offer study materials for MCA (Master of Computer Applications), BCA (Bachelor of Computer Applications), and BTech (Bachelor of Technology) courses with semester-wise organized content."
        }
      },
      {
        "@type": "Question",
        "name": "How do I download study materials?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simply sign up for a free account, browse to your course and semester, select the subject, and click the download button for any study material you need."
        }
      }
    ]
  };

  return (
    <div className="relative bg-white dark:bg-[rgb(38,38,36)] min-h-screen">
      {/* JSON-LD Structured Data for SEO */}
      <JsonLd data={organizationData} />
      <JsonLd data={websiteData} />
      <JsonLd data={platformData} />
      <JsonLd data={faqData} />

      {/* SEO Meta Tags */}
      <head>
        <title>{siteConfig.title}</title>
        <meta name="description" content={siteConfig.description} />
        <meta name="keywords" content={siteConfig.keywords.join(', ')} />
        <link rel="canonical" href={siteConfig.url} />
      </head>

      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 bg-white dark:bg-[rgb(38,38,36)]">
        {/* Gradient Blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 text-center lg:text-left">
              <div className="inline-block mb-4">
                <span className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                  Study Smarter, Not Harder
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {"Ezy Learn".split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="inline-block mr-4">
                    {word}
                  </motion.span>
                ))}
                <br />
                <span className="text-blue-600 dark:text-blue-400">
                  Easy Study, Smart Success
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0">
                Access thousands of study materials, download notes, and ace your exams with our comprehensive learning platform.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <button
                  onClick={onDashboard}
                  className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link href="/library">
                  <button className="px-8 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105">
                    Browse Library
                  </button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-start">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">10K+</div>
                  <div className="text-gray-600 dark:text-gray-400">Students</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">500+</div>
                  <div className="text-gray-600 dark:text-gray-400">Study Materials</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">50+</div>
                  <div className="text-gray-600 dark:text-gray-400">Subjects</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex-1 relative">
              <div className="relative w-full max-w-lg mx-auto">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-20" />
                <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <Image
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                    alt="Students studying"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                    priority
                  />
                </div>
                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -left-4 top-1/4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute -right-4 bottom-1/4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                  <Award className="w-8 h-8 text-purple-600" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Curved Separator - Deeper Downward Arc */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-[120px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 Q600,150 1200,0 L1200,120 L0,120 Z" className="fill-gray-50 dark:fill-gray-900/50"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Ezy Learn?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to excel in your studies, all in one place.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FileText,
                title: "Complete Notes",
                desc: "Access comprehensive study notes for all subjects with detailed explanations and examples"
              },
              {
                icon: BookOpen,
                title: "Structured Learning",
                desc: "Follow our curated learning path with proper sequence - know which subject to study first"
              },
              {
                icon: TrendingUp,
                title: "Best YouTube Channels",
                desc: "Get recommendations for top YouTube channels for each subject to enhance your learning"
              },
              {
                icon: CheckCircle,
                title: "Complete Syllabus",
                desc: "Access full curriculum with proper structure, semester-wise breakdown and exam patterns"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <div className="w-14 h-14 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Notes Section */}
      <PopularNotesSection notes={popularNotes} loading={notesLoading} isSignedIn={isSignedIn} />

      {/* Courses Section */}
      <CoursesSection courses={courses} loading={coursesLoading} />

      {/* Reviews Section */}
      <ReviewsSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already acing their exams with Ezy Learn.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={onDashboard}
                className="px-10 py-5 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
                Get Started Now - It&apos;s Free!
              </button>
              <Link href="/reviews">
                <button className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 shadow-xl">
                  Leave a Review
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2025 Ezy Learn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const Navbar = () => {
  const { user } = useUser();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[rgb(38,38,36)]/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/image.jpeg"
              alt="Ezy Learn Logo"
              width={40}
              height={40}
              className="rounded-xl"
            />
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Ezy Learn</h1>
          </Link>

          <div className="flex items-center gap-4">
            {!user ? (
              <Link href='/sign-in'>
                <button className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300">
                  Login
                </button>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <UserButton />
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300">
                  Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const CoursesSection = ({ courses, loading }) => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <GraduationCap className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            Popular Courses
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Explore our most enrolled courses
          </p>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-xl h-80 animate-pulse" />
            ))}
          </div>
        ) : courses && courses.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course, i) => {
              const courseImages = {
                'MCA': 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&h=400&fit=crop',
                'BCA': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
                'BTECH': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop',
                'BTech': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop'
              };

              const courseImage = course.image || courseImages[course.category] || courseImages[course.code] || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop';

              return (
                <motion.div
                  key={course.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div className="h-48 relative overflow-hidden">
                    <Image
                      src={courseImage}
                      alt={course.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 hidden items-center justify-center">
                      <BookOpen className="w-20 h-20 text-white/30" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 text-gray-900 rounded-full text-sm font-bold backdrop-blur-sm">
                        {course.semesters || 0} Semesters
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm">
                      {course.description || 'Comprehensive course with complete study materials'}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm font-semibold">{course.totalMaterials || course.documents || 0}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-semibold">{course.students || 0}+</span>
                      </div>
                    </div>
                    <Link href={`/library/${course.category || course.code}`}>
                      <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center gap-2">
                        Explore Course
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'MCA', desc: 'Master of Computer Applications', img: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&h=400&fit=crop', semesters: 4 },
              { title: 'BCA', desc: 'Bachelor of Computer Applications', img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop', semesters: 6 },
              { title: 'BTech', desc: 'Bachelor of Technology', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop', semesters: 8 }
            ].map((course, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src={course.img}
                    alt={course.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white/90 text-gray-900 rounded-full text-sm font-bold">
                      {course.semesters} Semesters
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    {course.desc}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm font-semibold">100+</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-semibold">500+</span>
                    </div>
                  </div>
                  <Link href={`/library/${course.title.toUpperCase()}`}>
                    <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center gap-2">
                      Explore Course
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Courses Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12">
          <Link href="/library">
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 mx-auto">
              View All Courses
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const ReviewsSection = () => {
  const { data: reviewsData, isLoading } = useReviews();
  const reviews = Array.isArray(reviewsData) ? reviewsData.slice(0, 3) : [];

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <section className="py-20 bg-white dark:bg-[rgb(38,38,36)]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <MessageSquare className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            What Students Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Trusted by thousands of students nationwide
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <motion.div
                key={review.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {getInitials(review.userName)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{review.userName}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className={`w-5 h-5 ${starIndex < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                        }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic line-clamp-3">&quot;{review.reviewText}&quot;</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>No reviews yet. Be the first to leave a review!</p>
          </div>
        )}

        {/* View All Reviews Button */}
        {reviews && reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12">
            <Link href="/reviews">
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 mx-auto">
                View All Reviews
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};
