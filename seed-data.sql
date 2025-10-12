-- Direct SQL script to insert default subjects and materials
-- Run this in your database console

-- Insert default subjects for MCA Semester 1
INSERT INTO subjects (category, "semesterName", name, code, description, "isActive", "createdAt", "updatedAt") VALUES
('MCA', 'Semester 1', 'Computer Fundamentals', 'MCA101', 'Basic computer concepts and programming', true, NOW(), NOW()),
('MCA', 'Semester 1', 'Programming in C', 'MCA102', 'C programming language fundamentals', true, NOW(), NOW()),
('MCA', 'Semester 1', 'Mathematics for Computing', 'MCA103', 'Mathematical foundations for computer science', true, NOW(), NOW()),
('MCA', 'Semester 1', 'Digital Electronics', 'MCA104', 'Digital logic and electronics basics', true, NOW(), NOW()),
('MCA', 'Semester 1', 'Communication Skills', 'MCA105', 'Technical communication and soft skills', true, NOW(), NOW());

-- Insert default subjects for MCA Semester 2
INSERT INTO subjects (category, "semesterName", name, code, description, "isActive", "createdAt", "updatedAt") VALUES
('MCA', 'Semester 2', 'Data Structures', 'MCA201', 'Linear and non-linear data structures', true, NOW(), NOW()),
('MCA', 'Semester 2', 'Object Oriented Programming', 'MCA202', 'OOP concepts using Java/C++', true, NOW(), NOW()),
('MCA', 'Semester 2', 'Database Management System', 'MCA203', 'Relational database concepts and SQL', true, NOW(), NOW()),
('MCA', 'Semester 2', 'Computer Networks', 'MCA204', 'Network fundamentals and protocols', true, NOW(), NOW()),
('MCA', 'Semester 2', 'Operating Systems', 'MCA205', 'OS concepts and system programming', true, NOW(), NOW());

-- Insert default subjects for BCA Semester 1
INSERT INTO subjects (category, "semesterName", name, code, description, "isActive", "createdAt", "updatedAt") VALUES
('BCA', 'Semester 1', 'Computer Fundamentals', 'BCA101', 'Introduction to computers and IT', true, NOW(), NOW()),
('BCA', 'Semester 1', 'Programming Principles', 'BCA102', 'Basic programming concepts', true, NOW(), NOW()),
('BCA', 'Semester 1', 'Mathematics-I', 'BCA103', 'Mathematical foundations', true, NOW(), NOW()),
('BCA', 'Semester 1', 'Digital Computer Fundamentals', 'BCA104', 'Computer hardware and software', true, NOW(), NOW()),
('BCA', 'Semester 1', 'English Communication', 'BCA105', 'Communication skills development', true, NOW(), NOW());

-- Insert default subjects for BCA Semester 2
INSERT INTO subjects (category, "semesterName", name, code, description, "isActive", "createdAt", "updatedAt") VALUES
('BCA', 'Semester 2', 'Programming in C', 'BCA201', 'C programming language', true, NOW(), NOW()),
('BCA', 'Semester 2', 'Mathematics-II', 'BCA202', 'Advanced mathematics for computing', true, NOW(), NOW()),
('BCA', 'Semester 2', 'Computer Organization', 'BCA203', 'Computer architecture and organization', true, NOW(), NOW()),
('BCA', 'Semester 2', 'Web Technology', 'BCA204', 'HTML, CSS, JavaScript basics', true, NOW(), NOW()),
('BCA', 'Semester 2', 'Environmental Studies', 'BCA205', 'Environmental awareness', true, NOW(), NOW());

-- Insert default subjects for BTECH Semester 1
INSERT INTO subjects (category, "semesterName", name, code, description, "isActive", "createdAt", "updatedAt") VALUES
('BTECH', 'Semester 1', 'Engineering Mathematics-I', 'BTECH101', 'Calculus and differential equations', true, NOW(), NOW()),
('BTECH', 'Semester 1', 'Engineering Physics', 'BTECH102', 'Physics for engineering applications', true, NOW(), NOW()),
('BTECH', 'Semester 1', 'Engineering Chemistry', 'BTECH103', 'Chemistry for engineering', true, NOW(), NOW()),
('BTECH', 'Semester 1', 'Programming for Problem Solving', 'BTECH104', 'C programming and problem solving', true, NOW(), NOW()),
('BTECH', 'Semester 1', 'English for Communication', 'BTECH105', 'Technical communication skills', true, NOW(), NOW());

-- Insert default subjects for BTECH Semester 2
INSERT INTO subjects (category, "semesterName", name, code, description, "isActive", "createdAt", "updatedAt") VALUES
('BTECH', 'Semester 2', 'Engineering Mathematics-II', 'BTECH201', 'Linear algebra and complex analysis', true, NOW(), NOW()),
('BTECH', 'Semester 2', 'Engineering Graphics', 'BTECH202', 'Technical drawing and CAD', true, NOW(), NOW()),
('BTECH', 'Semester 2', 'Basic Electrical Engineering', 'BTECH203', 'Electrical circuits and machines', true, NOW(), NOW()),
('BTECH', 'Semester 2', 'Data Structures and Algorithms', 'BTECH204', 'DSA using C/C++', true, NOW(), NOW()),
('BTECH', 'Semester 2', 'Environmental Science', 'BTECH205', 'Environmental studies', true, NOW(), NOW());

-- Now insert study materials for each subject
-- This will insert 4 materials for each subject
INSERT INTO study_materials ("subjectId", title, type, description, "fileUrl", "downloadCount", "isActive", "createdAt", "updatedAt")
SELECT 
    s.id,
    s.name || ' - ' || m.title,
    'PDF',
    m.description,
    'https://example.com/materials/' || s.code || '_' || LOWER(REPLACE(m.title, ' ', '_')) || '.pdf',
    FLOOR(RANDOM() * 50),
    true,
    NOW(),
    NOW()
FROM subjects s
CROSS JOIN (
    VALUES 
        ('Lecture Notes', 'Comprehensive lecture notes covering all topics'),
        ('Assignment Questions', 'Practice problems and assignments'),
        ('Previous Year Papers', 'Question papers from previous examinations'),
        ('Reference Book', 'Recommended textbook and reference material')
) AS m(title, description)
WHERE s.code LIKE 'MCA%' OR s.code LIKE 'BCA%' OR s.code LIKE 'BTECH%';