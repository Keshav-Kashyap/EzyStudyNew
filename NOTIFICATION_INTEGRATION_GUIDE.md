# Notification System - Integration Guide

## How to Trigger Notifications in Admin Actions

### Step 1: Import the Notification Service

```javascript
import axios from 'axios';
import { NOTIFICATION_TYPES } from '@/services/notificationService';
```

### Step 2: Broadcast Notification After Admin Action

#### Example 1: When Creating a New Course

```javascript
// In your course creation API or action
const createCourse = async (courseData) => {
    try {
        // Create the course first
        const newCourse = await db.insert(adminCourses).values(courseData).returning();
        
        // Broadcast notification to all users
        await axios.post('/api/admin/notifications/broadcast', {
            type: NOTIFICATION_TYPES.COURSE_CREATED,
            courseName: courseData.name,
            courseCode: courseData.code,
            actionUrl: `/library/${courseData.code}`
        });
        
        return newCourse;
    } catch (error) {
        console.error('Error creating course:', error);
        throw error;
    }
};
```

#### Example 2: When Creating a New Semester

```javascript
const createSemester = async (semesterData) => {
    try {
        const newSemester = await db.insert(adminSemesters).values(semesterData).returning();
        
        // Get course details for notification
        const [course] = await db
            .select()
            .from(adminCourses)
            .where(eq(adminCourses.id, semesterData.courseId));
        
        await axios.post('/api/admin/notifications/broadcast', {
            type: NOTIFICATION_TYPES.SEMESTER_CREATED,
            courseName: course.name,
            courseCode: course.code,
            semesterName: semesterData.name,
            actionUrl: `/library/${course.code}/${semesterData.name}`
        });
        
        return newSemester;
    } catch (error) {
        console.error('Error creating semester:', error);
        throw error;
    }
};
```

#### Example 3: When Creating a New Subject

```javascript
const createSubject = async (subjectData) => {
    try {
        const newSubject = await db.insert(adminSubjects).values(subjectData).returning();
        
        // Get course and semester details
        const [course] = await db.select().from(adminCourses).where(eq(adminCourses.id, subjectData.courseId));
        const [semester] = await db.select().from(adminSemesters).where(eq(adminSemesters.id, subjectData.semesterId));
        
        await axios.post('/api/admin/notifications/broadcast', {
            type: NOTIFICATION_TYPES.SUBJECT_CREATED,
            courseName: course.name,
            courseCode: course.code,
            semesterName: semester.name,
            subjectName: subjectData.name,
            actionUrl: `/library/${course.code}/${semester.name}/${subjectData.code}`
        });
        
        return newSubject;
    } catch (error) {
        console.error('Error creating subject:', error);
        throw error;
    }
};
```

#### Example 4: When Uploading Study Material

```javascript
const uploadMaterial = async (materialData) => {
    try {
        const newMaterial = await db.insert(adminMaterials).values(materialData).returning();
        
        // Get related details
        const [course] = await db.select().from(adminCourses).where(eq(adminCourses.id, materialData.courseId));
        const [semester] = await db.select().from(adminSemesters).where(eq(adminSemesters.id, materialData.semesterId));
        const [subject] = await db.select().from(adminSubjects).where(eq(adminSubjects.id, materialData.subjectId));
        
        await axios.post('/api/admin/notifications/broadcast', {
            type: NOTIFICATION_TYPES.MATERIAL_UPLOADED,
            courseName: course.name,
            courseCode: course.code,
            semesterName: semester.name,
            subjectName: subject.name,
            materialTitle: materialData.title,
            actionUrl: `/library/${course.code}/${semester.name}/${subject.code}`
        });
        
        return newMaterial;
    } catch (error) {
        console.error('Error uploading material:', error);
        throw error;
    }
};
```

## Available Notification Types

```javascript
NOTIFICATION_TYPES = {
    COURSE_CREATED: 'course_created',
    SEMESTER_CREATED: 'semester_created',
    SUBJECT_CREATED: 'subject_created',
    MATERIAL_UPLOADED: 'material_uploaded',
    COURSE_UPDATED: 'course_updated',
    SEMESTER_UPDATED: 'semester_updated',
    SUBJECT_UPDATED: 'subject_updated',
}
```

## Integration Checklist

- [ ] Import `axios` and `NOTIFICATION_TYPES` in your admin API files
- [ ] After successful course creation, call broadcast API with `COURSE_CREATED`
- [ ] After successful semester creation, call broadcast API with `SEMESTER_CREATED`
- [ ] After successful subject creation, call broadcast API with `SUBJECT_CREATED`
- [ ] After successful material upload, call broadcast API with `MATERIAL_UPLOADED`
- [ ] Test notifications in browser with permission enabled
- [ ] Verify notifications appear in sidebar bell icon
- [ ] Verify unread count updates correctly

## Testing Notifications

1. Enable browser notifications when prompted
2. Login as admin
3. Create a new course/semester/subject
4. Check the notification bell in sidebar
5. Verify browser notification pops up
6. Click on notification to navigate to the content

## Notes

- Notifications are created for ALL active users when content is added
- Browser notifications require user permission
- Notifications persist in database and can be viewed later
- Users can mark notifications as read or delete them
- Notification polling happens every 30 seconds automatically
