# CampusPulse Architecture & Working Notes

## 1. Problem Statement

Institutes need a repeatable way to maintain a student list and record daily presence. The first CampusPulse version digitizes this workflow in a single browser application with no server dependency.

## 2. Functional Flow

### Student Registration
1. User enters student name, roll number, and program/batch.
2. JavaScript validates required values.
3. Duplicate roll numbers are rejected.
4. A UUID is assigned to the student.
5. State is saved to `localStorage`.
6. The dashboard and attendance table re-render.

### Daily Attendance
1. The user selects an attendance date.
2. Each student's status is read from `attendance[date][studentId]`.
3. Status can be changed to `present`, `absent`, or `unmarked`.
4. The state is persisted immediately.
5. Summary cards are recalculated for the selected date.

### Search and Filtering
The UI filters the in-memory roster by:
- student name,
- roll number,
- program/batch,
- and selected attendance status.

The underlying stored roster is not modified by filtering.

### CSV Export
The application creates rows with:
`Date, Student, Roll Number, Program, Status`

Those rows are converted to CSV, wrapped in a browser Blob, and downloaded locally.

## 3. State Shape

```js
{
  students: [
    {
      id: "uuid",
      name: "Ayesha Khan",
      roll: "FSWD-021",
      program: "Full Stack Web Development"
    }
  ],
  attendance: {
    "2026-09-25": {
      "student-uuid": "present"
    }
  }
}
```

The date-first attendance map keeps a daily register independent from the student master record.

## 4. UI Architecture

### Sidebar
Provides simple navigation anchors for Dashboard, Students, Attendance, and About.

### Dashboard Cards
Derived values only:
- total students,
- present count,
- absent count,
- attendance rate.

### Student Form
Creates roster records. It does not directly store attendance.

### Attendance Table
Acts as the operational workspace for searching, status changes, and student removal.

## 5. Why Vanilla JavaScript?

This repository is a connector demonstration and student project. Vanilla JavaScript keeps the code:
- inspectable,
- dependency-free,
- runnable without Node/npm,
- and focused on browser fundamentals.

Using React for this first version would add tooling before the core workflow needs it.

## 6. Current Limitations

This is not a production ERP. Current limitations include:
- one-browser storage only,
- no accounts or roles,
- no central database,
- no server-side validation,
- no attendance locking/approval,
- no audit trail,
- no backups,
- no multi-device synchronization,
- no encryption-at-rest strategy.

## 7. Recommended Production Architecture

```text
React Client
    |
    v
Express REST API
    |
    +--> Authentication / RBAC
    +--> Student Service
    +--> Attendance Service
    +--> Reporting Service
    |
    v
MongoDB
```

Suggested roles:
- **Admin:** manage users, batches, students, reports.
- **Teacher:** mark attendance for assigned batches.
- **Student:** view own attendance summary.

## 8. Candidate Database Collections

### users
`name, email, passwordHash, role, status`

### batches
`name, course, startDate, endDate, teacherIds`

### students
`name, rollNumber, batchId, contact, status`

### attendance
`studentId, batchId, date, status, markedBy, markedAt`

A unique compound constraint such as `studentId + date` would help prevent duplicate daily attendance rows.

## 9. Suggested Next Phases

**Phase 2 — MERN Foundation**
- React/Vite frontend
- Express server
- MongoDB models
- environment configuration

**Phase 3 — Identity & Authorization**
- login
- password hashing
- protected APIs
- Admin/Teacher roles

**Phase 4 — Reporting**
- date-range analytics
- batch attendance percentages
- student attendance history
- CSV/PDF reporting

**Phase 5 — Institute Operations**
- courses and batches
- fee status
- notices
- assignment/submission tracking
- audit/activity log

## 10. Development Record

The repository history is intentionally split into functional commits so reviewers can see how the application evolved:
1. UI foundation
2. working attendance behavior
3. documentation and architecture

That structure mirrors a basic professional Git workflow even though this is a compact demo project.
