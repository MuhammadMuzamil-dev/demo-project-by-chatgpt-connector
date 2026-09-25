const STORAGE_KEY = "campusPulseDataV1";

const seedStudents = [
  { id: crypto.randomUUID(), name: "Ayesha Khan", roll: "FSWD-021", program: "Full Stack Web Development" },
  { id: crypto.randomUUID(), name: "Hamza Ali", roll: "FSWD-022", program: "Full Stack Web Development" },
  { id: crypto.randomUUID(), name: "Mariam Ahmed", roll: "AI-014", program: "AI for Everyone" },
  { id: crypto.randomUUID(), name: "Usman Raza", roll: "CYB-009", program: "Cyber Security" }
];

const state = loadState();

const els = {
  form: document.querySelector("#studentForm"),
  name: document.querySelector("#studentName"),
  roll: document.querySelector("#rollNumber"),
  program: document.querySelector("#program"),
  date: document.querySelector("#attendanceDate"),
  tbody: document.querySelector("#studentTableBody"),
  empty: document.querySelector("#emptyState"),
  search: document.querySelector("#searchInput"),
  filter: document.querySelector("#statusFilter"),
  total: document.querySelector("#totalStudents"),
  present: document.querySelector("#presentCount"),
  absent: document.querySelector("#absentCount"),
  rate: document.querySelector("#attendanceRate"),
  allPresent: document.querySelector("#markAllPresent"),
  exportCsv: document.querySelector("#exportCsv"),
  reset: document.querySelector("#resetDemo")
};

els.date.value = new Date().toISOString().slice(0, 10);
render();

els.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = els.name.value.trim();
  const roll = els.roll.value.trim().toUpperCase();
  const program = els.program.value.trim();

  if (!name || !roll || !program) return;
  if (state.students.some(student => student.roll.toLowerCase() === roll.toLowerCase())) {
    alert("A student with this roll number already exists.");
    return;
  }

  state.students.push({ id: crypto.randomUUID(), name, roll, program });
  saveState();
  els.form.reset();
  render();
});

els.date.addEventListener("change", render);
els.search.addEventListener("input", render);
els.filter.addEventListener("change", render);

els.allPresent.addEventListener("click", () => {
  const date = selectedDate();
  state.attendance[date] ??= {};
  state.students.forEach(student => {
    state.attendance[date][student.id] = "present";
  });
  saveState();
  render();
});

els.exportCsv.addEventListener("click", exportAttendanceCsv);

els.reset.addEventListener("click", () => {
  if (!confirm("Reset CampusPulse to its demo data?")) return;
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
});

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored && Array.isArray(stored.students) && stored.attendance) return stored;
  } catch (error) {
    console.warn("Stored CampusPulse data could not be parsed.", error);
  }
  return { students: seedStudents, attendance: {} };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function selectedDate() {
  return els.date.value || new Date().toISOString().slice(0, 10);
}

function attendanceFor(studentId) {
  return state.attendance[selectedDate()]?.[studentId] ?? "unmarked";
}

function setAttendance(studentId, status) {
  const date = selectedDate();
  state.attendance[date] ??= {};
  if (status === "unmarked") delete state.attendance[date][studentId];
  else state.attendance[date][studentId] = status;
  saveState();
  render();
}

function deleteStudent(studentId) {
  const student = state.students.find(item => item.id === studentId);
  if (!student || !confirm(`Remove ${student.name} from the roster?`)) return;
  state.students = state.students.filter(item => item.id !== studentId);
  Object.values(state.attendance).forEach(day => delete day[studentId]);
  saveState();
  render();
}

function filteredStudents() {
  const query = els.search.value.trim().toLowerCase();
  const wantedStatus = els.filter.value;

  return state.students.filter(student => {
    const matchesQuery = [student.name, student.roll, student.program]
      .some(value => value.toLowerCase().includes(query));
    const status = attendanceFor(student.id);
    const matchesStatus = wantedStatus === "all" || status === wantedStatus;
    return matchesQuery && matchesStatus;
  });
}

function render() {
  const students = filteredStudents();
  els.tbody.innerHTML = "";

  students.forEach(student => {
    const row = document.createElement("tr");
    const status = attendanceFor(student.id);
    row.innerHTML = `
      <td><span class="student-name">${escapeHtml(student.name)}</span></td>
      <td>${escapeHtml(student.roll)}</td>
      <td>${escapeHtml(student.program)}</td>
      <td>
        <select class="status-select" data-student-id="${student.id}">
          <option value="unmarked" ${status === "unmarked" ? "selected" : ""}>Unmarked</option>
          <option value="present" ${status === "present" ? "selected" : ""}>Present</option>
          <option value="absent" ${status === "absent" ? "selected" : ""}>Absent</option>
        </select>
      </td>
      <td class="right"><button class="delete-btn" data-delete-id="${student.id}" type="button">Remove</button></td>
    `;
    els.tbody.appendChild(row);
  });

  document.querySelectorAll(".status-select").forEach(select => {
    select.addEventListener("change", event => setAttendance(event.target.dataset.studentId, event.target.value));
  });
  document.querySelectorAll("[data-delete-id]").forEach(button => {
    button.addEventListener("click", event => deleteStudent(event.target.dataset.deleteId));
  });

  els.empty.hidden = students.length > 0;
  renderSummary();
}

function renderSummary() {
  const total = state.students.length;
  const statuses = state.students.map(student => attendanceFor(student.id));
  const present = statuses.filter(status => status === "present").length;
  const absent = statuses.filter(status => status === "absent").length;
  const rate = total ? Math.round((present / total) * 100) : 0;

  els.total.textContent = total;
  els.present.textContent = present;
  els.absent.textContent = absent;
  els.rate.textContent = `${rate}%`;
}

function exportAttendanceCsv() {
  const rows = [["Date", "Student", "Roll Number", "Program", "Status"]];
  state.students.forEach(student => {
    rows.push([selectedDate(), student.name, student.roll, student.program, attendanceFor(student.id)]);
  });

  const csv = rows
    .map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `campuspulse-attendance-${selectedDate()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}