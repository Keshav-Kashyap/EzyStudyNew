import { Home, Code, Database, Cpu, BookOpen, GraduationCap } from "lucide-react";

export const courses = [
    {
        id: 1,
        title: "MCA",
        subtitle: "Master of Computer Applications",
        description: "Master of Computer Applications program with comprehensive study materials.",
        documents: "120+ Documents",
        students: "500+ Students",
        category: "Computer Applications",
        image: "🎓",
        bgColor: "from-blue-500 to-blue-700"
    },
    {
        id: 2,
        title: "BCA",
        subtitle: "Bachelor of Computer Applications",
        description: "Bachelor of Computer Applications program with comprehensive study materials.",
        documents: "85+ Documents",
        students: "550+ Students",
        category: "Computer Applications",
        image: "🎯",
        bgColor: "from-yellow-500 to-yellow-600"
    },
    {
        id: 3,
        title: "MCA",
        subtitle: "Master of Computer Applications",
        description: "Master of Computer Applications program with comprehensive study materials.",
        documents: "120+ Documents",
        students: "500+ Students",
        category: "Computer Applications",
        image: "🎓",
        bgColor: "from-blue-500 to-blue-700"
    },
    {
        id: 4,
        title: "MCA",
        subtitle: "Master of Computer Applications",
        description: "Master of Computer Applications program with comprehensive study materials.",
        documents: "120+ Documents",
        students: "500+ Students",
        category: "Computer Applications",
        image: "🎓",
        bgColor: "from-blue-500 to-blue-700"
    },
    {
        id: 5,
        title: "MCA",
        subtitle: "Master of Computer Applications",
        description: "Master of Computer Applications program with comprehensive study materials.",
        documents: "120+ Documents",
        students: "500+ Students",
        category: "Computer Applications",
        image: "🎓",
        bgColor: "from-blue-500 to-blue-700"
    },
    {
        id: 6,
        title: "MCA",
        subtitle: "Master of Computer Applications",
        description: "Master of Computer Applications program with comprehensive study materials.",
        documents: "120+ Documents",
        students: "500+ Students",
        category: "Computer Applications",
        image: "🎓",
        bgColor: "from-blue-500 to-blue-700"
    }
];




export const menuItems = [
    {
        title: "Dashboard",
        icon: "Home", // Icon name as string
        href: "/dashboard",
        isActive: true,
    },
    {
        title: "Popular Notes",
        icon: "TrendingUp",
        href: "/dashboard/popular",
    },
    {
        title: "All Courses",
        icon: "BookOpen",
        href: "/dashboard/allCourses",
    },
];


export const LibraryItems = [

    {
        title: "MCA Library",
        icon: "Code",
        href: "/library/mca",
    },
    {
        title: "BCA Library",
        icon: "Database",
        href: "/library/bca",
    },
    {
        title: "B.Tech Library",
        icon: "Cpu",
        href: "/library/btech",
    },


];





export const adminMenuItems = [
    {
        title: "Dashboard",
        icon: "Home",
        href: "/admin/dashboard",
        isActive: false,
    },
    {
        title: "Library Manager",
        icon: "Upload",
        href: "/admin/library",
    },
    {
        title: "Popular Notes",
        icon: "TrendingUp",
        href: "/admin/popularNotes",
    },
    {
        title: "Analytics",
        icon: "BarChart",
        href: "/admin/analytics",
    },
    {
        title: "User Management",
        icon: "Users",
        href: "/admin/users",
    },
];
export const bottomMenuItems = [
    {
        title: 'Notifications',
        icon: "Bell",
        href: '/notifications',
        badge: 3
    },
    {
        title: 'Reviews',
        icon: "MessageSquare",
        href: '/reviews'
    },
    {
        title: 'Settings',
        icon: "Settings",
        // No href - opens UserProfile dialog
    },
    {
        title: 'Billing',
        icon: "CreditCard",
        href: '/billing'
    },
    {
        title: 'Join Us',
        icon: "Users",
        href: '/join-us'
    }
];
export const adminbottomMenuItems = [
    {
        title: 'Notifications',
        icon: "Bell",
        href: '/notifications',
        badge: 3
    },
    {
        title: 'Settings',
        icon: "Settings",
        // No href - opens UserProfile dialog
    },
    {
        title: 'Billing',
        icon: "CreditCard",
        href: '/billing'
    },
    {
        title: 'Team',
        icon: "Users",
        href: '/join-us'
    }
];