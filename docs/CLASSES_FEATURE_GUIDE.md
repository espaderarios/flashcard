# Classes & Profile Management Feature Guide

## Overview

This guide documents the new Classes and enhanced Profile features added to the Flashcard Study application. These features enable teachers to create and manage classes, and students to enroll in classes and take class-specific quizzes.

---

## ✨ New Features

### 1. **Enhanced Student Profile** 👤

Students can now maintain a comprehensive profile with:

#### Profile Components:
- **Profile Picture**: Upload and manage a profile picture
- **Personal Information**:
  - Full Name
  - Student ID
  - Email Address
  - School/Institution
  - Grade/Level
- **Google Account Integration**: 
  - Connect a Google account for authentication
  - Disconnect Google account as needed

#### Profile Features:
- Profile picture upload (max 5MB)
- Profile picture removal
- Real-time profile updates
- Persistent storage in browser localStorage
- Google account linking (demo mode - ready for OAuth2 integration)

**File Location**: [app.js](../app.js) lines 3180-3320

---

### 2. **Student Classes Tab** 📚

A new Classes section in the Student view allows students to:

#### Features:
- **Enroll in Classes**:
  - Enter 6-character class code provided by teacher
  - Automatic validation of class code
  - Prevention of duplicate enrollments
  - Success/error feedback

- **View Enrolled Classes**:
  - List of all classes student is enrolled in
  - Enrollment date tracking
  - Option to unenroll from classes

- **Access Class Quizzes**:
  - View all quizzes assigned to each class
  - Quiz metadata (number of questions, time limits, due dates)
  - Visual indicators for overdue quizzes
  - Start quiz button with time limit support

- **Quiz Time Tracking**:
  - Support for time-limited quizzes
  - Automatic timer countdown
  - Time limit validation before quiz start

**File Location**: [app.js](../app.js) lines 3325-3480

---

### 3. **Teacher Classes Tab** 🏫

A new Classes section in the Teacher view allows teachers to:

#### Class Management:
- **Create Classes**:
  - Class Name (required)
  - Subject
  - Grade Level
  - Description
  - Auto-generated 6-character class code

- **View Created Classes**:
  - List of all classes created by teacher
  - Class metadata (subject, grade, description)
  - Class code display and copy functionality
  - Enrolled student count

- **Manage Enrollments**:
  - View list of enrolled students
  - Display enrolled student IDs
  - Enrollment tracking

- **Manage Class Quizzes**:
  - Add existing quizzes to classes
  - Remove quizzes from classes
  - Display quiz metadata within classes
  - Modal-based quiz selection interface

- **Delete Classes**:
  - Remove classes with confirmation
  - Automatic cleanup of associated quizzes

#### Class Code System:
- 6-character alphanumeric codes (A-Z, 0-9)
- Automatic uniqueness validation
- Copy-to-clipboard functionality
- Sharable with students for enrollment

**File Location**: [app.js](../app.js) lines 3495-3800

---

## 🗄️ Data Storage

All class and profile data is stored in browser localStorage using the following keys:

### Storage Keys:

```javascript
const STUDENT_PROFILE_KEY = "student_profile";
const STUDENT_CLASSES_KEY = "student_enrolled_classes";
const TEACHER_CLASSES_KEY = "teacher_classes";
const CLASS_QUIZZES_KEY = "class_quizzes";
```

### Data Structures:

#### Student Profile
```javascript
{
  name: string,
  id: string (Student ID),
  email: string,
  school: string,
  grade: string,
  profilePictureUrl: string (base64),
  googleId: string,
  googleEmail: string
}
```

#### Teacher Class
```javascript
{
  id: string (class_TIMESTAMP),
  name: string,
  subject: string,
  grade: string,
  description: string,
  classCode: string (6 chars),
  teacherId: string,
  createdAt: ISO8601 timestamp
}
```

#### Class Enrollment
```javascript
{
  classId: string,
  className: string,
  teacherId: string,
  studentId: string,
  enrolledAt: ISO8601 timestamp
}
```

#### Class Quiz
```javascript
{
  id: string (quizId),
  classId: string,
  title: string,
  questions: array,
  timeLimit: number (minutes) or null,
  createdAt: ISO8601 timestamp
}
```

---

## 🔧 Core Functions

### Student Profile Functions

```javascript
// Save/Load profile
saveStudentProfile(profileData)
getStudentProfile()

// Profile picture management
handleProfilePictureUpload(file)
removeProfilePicture()

// Google account
connectGoogle()
disconnectGoogle()
saveEnhancedProfile()
```

### Student Classes Functions

```javascript
// Enrollment
enrollStudentInClass(classCode)
getStudentEnrolledClasses(studentId)
unenrollFromClass(classId)

// Quiz access
getClassQuizzes(classId)
startClassQuiz(quizId)
```

### Teacher Classes Functions

```javascript
// Class management
saveClass(classData)
getTeacherClasses(teacherId)
getClassById(classId)
deleteClass(classId)
createNewClass()
deleteTeacherClass(classId)

// Class code generation
generateClassCode()

// Quiz management
saveClassQuiz(quizData)
openAddQuizToClassModal(classId)
assignQuizToClass(classId, quizId)
removeQuizFromClass(classId, quizId)
```

---

## 📊 UI Tabs

### Student View Tabs:
- **Quiz**: Original quiz selection view
- **Classes** (NEW): Class enrollment and quiz management
- **Profile** (ENHANCED): Enhanced student profile with picture and Google auth

### Teacher View Tabs:
- **Dashboard**: Quiz creation and management
- **Classes** (NEW): Class and enrollment management
- **Profile**: Teacher profile information

---

## 🚀 Integration Points

### Current Implementation:
- ✅ Complete localStorage-based storage
- ✅ Full UI with form validation
- ✅ Tab-based navigation
- ✅ Toast notifications for user feedback
- ✅ Modal dialogs for quiz selection
- ✅ Responsive design with existing theme system

### Future Enhancement Opportunities:

1. **Cloud Synchronization**:
   - Migrate data from localStorage to Cloudflare KV
   - Add Cloudflare Worker endpoints for class CRUD

2. **Authentication**:
   - Implement proper OAuth2 with Google
   - Add email verification
   - Role-based access control

3. **Advanced Features**:
   - Class invitations via email
   - Attendance tracking
   - Grade tracking per student
   - Quiz deadlines with reminders
   - Class announcements
   - Student progress analytics

4. **Scalability**:
   - Database integration (PostgreSQL/MongoDB)
   - API server for data synchronization
   - Real-time updates using WebSockets

---

## 📝 File Modifications

### [app.js](../app.js)

**Lines 1-120**: Storage function constants and definitions
- Added 4 new localStorage keys
- Added 10 new storage functions

**Lines 3180-3480**: Enhanced Student Profile and Classes Views
- `renderEnhancedStudentProfile()` - Profile UI with picture and Google auth
- `renderStudentClassesView()` - Class enrollment and quiz management
- Helper functions for profile operations

**Lines 3495-3800**: Teacher Classes View
- `renderTeacherClassesView()` - Complete class management interface
- Class creation, editing, and deletion
- Student enrollment tracking
- Quiz assignment and removal

**Lines 3535-3555**: Updated Teacher Tab Navigation
- Added "Classes" tab between "Dashboard" and "Profile"
- Updated content routing to include classes view

### [www/app.js](../www/app.js)

**Mirror implementation** of all functions in [app.js](../app.js) to maintain synchronization between root and www directories.

---

## 🔐 Security Considerations

### Current Limitations:
- localStorage is limited to ~5-10MB per domain
- No encryption of stored data
- Client-side validation only
- No authentication for data access

### Recommendations:
1. Implement server-side validation
2. Add encryption for sensitive data
3. Implement proper authentication
4. Use HTTPS for all communications
5. Add access control lists (ACLs)
6. Implement data backup and recovery

---

## 📚 Usage Examples

### For Students:

**1. Update Profile**:
```
1. Click "Profile" tab in Student view
2. Upload profile picture (optional)
3. Fill in personal information
4. Connect Google account (optional)
5. Click "Save Profile"
```

**2. Enroll in Class**:
```
1. Click "Classes" tab in Student view
2. Enter class code from teacher
3. Click "Enroll"
4. View enrolled classes and their quizzes
5. Click "Take Quiz" to start a quiz
```

### For Teachers:

**1. Create Class**:
```
1. Click "Classes" tab in Teacher view
2. Fill in class details (name, subject, grade)
3. Click "Create Class"
4. Share the generated class code with students
```

**2. Add Quiz to Class**:
```
1. Go to "Classes" tab
2. Find the class
3. Click "+ Add Quiz" button
4. Select a quiz from your Dashboard
5. Click to confirm assignment
```

---

## 🐛 Known Limitations

1. **Profile Picture**: Base64 encoding increases localStorage usage
2. **Class Code**: Simple generation (not suitable for large scale)
3. **Quiz Time Limits**: No server-side validation
4. **Data Persistence**: Limited to single browser/device
5. **Google Auth**: Demo mode only (requires OAuth2 setup)

---

## 🔄 Migration Path

To migrate this feature to production:

1. **Phase 1**: Set up Cloudflare Workers endpoints
2. **Phase 2**: Create Cloudflare KV namespaces for classes
3. **Phase 3**: Implement database schema in backend
4. **Phase 4**: Add proper authentication (OAuth2)
5. **Phase 5**: Implement real-time synchronization
6. **Phase 6**: Add analytics and reporting

---

## 📞 Support & Feedback

For issues or feature requests related to the Classes feature, please refer to:
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [INTEGRATION_CHECKLIST.md](INTEGRATION_CHECKLIST.md)

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Feature Status**: Fully Implemented (localStorage, UI complete)
