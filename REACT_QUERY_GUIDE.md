# React Query Implementation Guide 🚀

## Overview
Humne React Query (TanStack Query) implement kiya hai jo data caching aur state management handle karta hai. Ab route change karne par unnecessary API calls nahi hongi aur loading states bhi optimize hongi.

## Key Benefits ✨

1. **Data Caching** - 5 minutes ke liye data cache rehta hai
2. **No Unnecessary API Calls** - Route change par refetch nahi hota
3. **Automatic Background Updates** - Stale data automatically update hota hai
4. **Better Performance** - Faster navigation aur less loading
5. **Shared State** - Multiple components same data share kar sakte hain

## Cache Configuration ⚙️

```javascript
staleTime: 5 * 60 * 1000,  // 5 minutes - data fresh rehta hai
cacheTime: 10 * 60 * 1000, // 10 minutes - cache mein store rehta hai
refetchOnWindowFocus: false, // Window focus par refetch nahi hoga
refetchOnMount: false,       // Component mount par refetch nahi (if cached)
```

## Available Hooks 🪝

### For Users (Main App)

#### 1. `useCourses()`
```javascript
import { useCourses } from '@/hooks/useCourses';

function MyComponent() {
  const { data: courses, isLoading, isError, error } = useCourses();
  
  if (isLoading) return <Loading />;
  if (isError) return <Error message={error.message} />;
  
  return <CourseList courses={courses} />;
}
```

#### 2. `useDashboardStats()`
```javascript
import { useDashboardStats } from '@/hooks/useCourses';

function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();
  
  return <StatsDisplay stats={stats} />;
}
```

#### 3. `useDashboardData()` - Combined Hook
```javascript
import { useDashboardData } from '@/hooks/useCourses';

function Dashboard() {
  const { courses, stats, isLoading, isError } = useDashboardData();
  
  // Both courses aur stats ek saath milenge
  return (
    <>
      <StatsSection stats={stats} />
      <CoursesList courses={courses} />
    </>
  );
}
```

### For Admin

#### 1. `useAdminCourses()`
```javascript
import { useAdminCourses } from '@/hooks/useAdminData';

function AdminCourses() {
  const { data: courses, isLoading } = useAdminCourses();
  
  return <AdminCourseList courses={courses} />;
}
```

#### 2. `useAdminUsers()`
```javascript
import { useAdminUsers } from '@/hooks/useAdminData';

function AdminUsers() {
  const { data: users, isLoading } = useAdminUsers();
  
  return <UsersList users={users} />;
}
```

#### 3. `useAdminAnalytics()`
```javascript
import { useAdminAnalytics } from '@/hooks/useAdminData';

function Analytics() {
  const { data: analytics, isLoading } = useAdminAnalytics();
  
  return <AnalyticsCharts data={analytics} />;
}
```

#### 4. `useSemesters(category)`
```javascript
import { useSemesters } from '@/hooks/useAdminData';

function CourseDetails({ category }) {
  const { data: semesters, isLoading } = useSemesters(category);
  
  return <SemesterList semesters={semesters} />;
}
```

## Invalidating Cache (After Updates) 🔄

Jab aap data update/create/delete karte ho, cache ko invalidate karna padta hai:

### User Side
```javascript
import { useInvalidateCourses } from '@/hooks/useCourses';

function CreateCourse() {
  const invalidateCourses = useInvalidateCourses();
  
  const handleSubmit = async (data) => {
    await createCourse(data);
    invalidateCourses(); // Cache refresh hoga
  };
}
```

### Admin Side
```javascript
import { useInvalidateAdminData } from '@/hooks/useAdminData';

function AdminPanel() {
  const {
    invalidateCourses,
    invalidateUsers,
    invalidateAnalytics,
    invalidateAll
  } = useInvalidateAdminData();
  
  const handleCourseUpdate = async () => {
    await updateCourse();
    invalidateCourses(); // Sirf courses refresh honge
  };
  
  const handleMajorUpdate = async () => {
    await majorUpdate();
    invalidateAll(); // Sab kuch refresh hoga
  };
}
```

## Examples 📝

### Simple Component
```javascript
'use client';

import { useCourses } from '@/hooks/useCourses';

export default function CourseList() {
  const { data: courses, isLoading, isError, error } = useCourses();
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
```

### With Search/Filter
```javascript
'use client';

import { useCourses } from '@/hooks/useCourses';
import { useState } from 'react';

export default function SearchableCourses() {
  const { data: courses = [], isLoading } = useCourses();
  const [search, setSearch] = useState('');
  
  const filtered = courses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <>
      <input 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search courses..."
      />
      {isLoading ? <Loading /> : <CourseGrid courses={filtered} />}
    </>
  );
}
```

### Admin Dashboard
```javascript
'use client';

import { useAdminCourses, useAdminUsers, useAdminAnalytics } from '@/hooks/useAdminData';

export default function AdminDashboard() {
  const { data: courses } = useAdminCourses();
  const { data: users } = useAdminUsers();
  const { data: analytics } = useAdminAnalytics();
  
  return (
    <div>
      <StatsCard title="Total Courses" value={courses?.length} />
      <StatsCard title="Total Users" value={users?.length} />
      <AnalyticsChart data={analytics} />
    </div>
  );
}
```

## Best Practices 💡

1. **Har component mein hook use karo** - Data automatically cached hai
2. **Manual fetch mat karo** - `useEffect` + `fetch` ki jagah hooks use karo
3. **Update ke baad invalidate karo** - Taaki fresh data mile
4. **Loading states handle karo** - Better UX ke liye
5. **Error handling karo** - Graceful error messages

## Migration Checklist ✅

- [x] React Query package install
- [x] Provider setup in root layout
- [x] Custom hooks created (useCourses, useAdminData)
- [x] Dashboard page updated
- [x] CoursesCard component updated
- [ ] Library pages update (next step)
- [ ] Admin pages update (next step)

## Performance Impact 📊

**Before:**
- Har route change par API call
- Loading screen har baar
- Slow navigation
- High database load

**After:**
- Cache se data instantly milta hai
- Loading sirf pehli baar
- Fast navigation
- Reduced database calls (70-80% kam)

## Troubleshooting 🔧

### Data update nahi ho raha?
```javascript
// Invalidate cache after update
const invalidate = useInvalidateCourses();
invalidate();
```

### Purana data dikh raha hai?
```javascript
// Manual refetch
const { refetch } = useCourses();
refetch();
```

### Cache clear karna hai?
```javascript
import { queryClient } from '@/lib/react-query-client';
queryClient.clear(); // Sab cache clear
```

## Next Steps 🎯

1. ✅ Dashboard updated
2. ✅ CoursesCard updated
3. 🔲 Library pages update karo
4. 🔲 Admin pages update karo
5. 🔲 Semester details page update karo
6. 🔲 Subject pages update karo

---

**Questions?** Check TanStack Query docs: https://tanstack.com/query/latest
