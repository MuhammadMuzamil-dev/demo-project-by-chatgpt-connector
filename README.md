# CampusPulse — Institute Attendance & Student Operations Dashboard

CampusPulse is a lightweight institute-management prototype built to demonstrate how a student project can solve a real operational problem with a clean UI and practical browser-side data handling.

## Selected Field

**Education Technology / Institute Operations (mini ERP module)**

The project focuses on a common institute workflow: maintaining a student roster and recording daily attendance. It intentionally starts as a frontend-only prototype so the core workflow is easy to inspect, run, and extend.

## What the Tool Does

- Add students with name, roll number, and program/batch.
- Record **Present**, **Absent**, or **Unmarked** attendance for a selected date.
- Show dashboard totals and attendance percentage.
- Search students and filter them by attendance status.
- Mark the entire current roster present in one action.
- Export a dated attendance sheet as CSV.
- Persist roster and attendance data in the browser with `localStorage`.
- Reset the prototype back to seeded demo data.

## Why This Project

Small training institutes often begin with spreadsheets, chat groups, or paper registers. CampusPulse turns one repetitive workflow into a simple digital dashboard. It is deliberately scoped as a student-friendly mini ERP module rather than pretending to be a production-grade institutional ERP.

## Technology Stack

| Layer | Technology | Reason |
|---|---|---|
| Structure | HTML5 | Simple, semantic, dependency-free UI |
| Styling | CSS3 | Responsive dashboard without a UI framework |
| Logic | Vanilla JavaScript | Clear DOM/state logic for learning and review |
| Persistence | Browser localStorage | Zero-backend demo persistence |
| Reporting | Blob + CSV export | Downloadable attendance records |
| Version control | Git + GitHub | Auditable project history |

## Project Structure

```text
.
├── index.html
├── styles.css
├── app.js
├── README.md
└── docs/
    └── ARCHITECTURE.md
```

## How to Run

1. Clone the repository.
2. Open `index.html` directly in a modern browser.
3. Add a student or use the seeded demo roster.
4. Select a date and mark attendance.
5. Refresh the browser to confirm local persistence.
6. Use **Export CSV** to download the current date's attendance.

No package installation or build command is required.

## Data & Privacy Note

This prototype stores data only in the current browser's local storage. There is no server, login system, cloud database, encryption layer, or multi-user synchronization. Do not use it for real sensitive student records without implementing proper authentication, authorization, secure backend storage, backups, and privacy controls.

## Git History

The project was intentionally developed in meaningful stages:

1. `feat: scaffold CampusPulse institute dashboard`
2. `feat: add roster attendance persistence and CSV export`
3. `docs: document CampusPulse architecture and usage`

This keeps the repository history understandable instead of publishing the entire project as one opaque commit.

## Future MERN Expansion

A production-oriented next version could use:

- **React** for component-based frontend state and routing.
- **Node.js + Express** for REST APIs.
- **MongoDB** for students, batches, attendance, and users.
- **JWT/session authentication** with role-based access for Admin, Teacher, and Student.
- Attendance reports by date range, batch, and student.
- Import/export, audit logs, notifications, and institute-level dashboards.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the internal workflow and extension plan.

---

Built as a GitHub Connector + Desktop Commander integration demo and as a practical institute-related student project.
