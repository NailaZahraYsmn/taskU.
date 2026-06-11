// Inisialisasi awal (kosong, data diambil dari database)
let todos = [];
let editingTaskId = null;

// format tanggal YYYY-MM-DD
function formatDateKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
// tanggal aktif di kalender
let selectedDate = formatDateKey();

// =========================================
// MODIFIKASI: Logika Fitur Light Mode
// =========================================
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

// Cek preferensi tema pengguna di localStorage saat halaman pertama dimuat
if (localStorage.getItem("lightMode") === "true") {
  document.body.classList.add("light-mode");
  themeIcon.classList.replace("bi-sun-fill", "bi-moon-stars-fill");
}

// Event listener untuk mendeteksi klik pada tombol tema
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  const isLightMode = document.body.classList.contains("light-mode");
  localStorage.setItem("lightMode", isLightMode);
  
  if (isLightMode) {
    themeIcon.classList.replace("bi-sun-fill", "bi-moon-stars-fill");
  } else {
    themeIcon.classList.replace("bi-moon-stars-fill", "bi-sun-fill");
  }
});
// AMBIL DATA DARI DATABASE (READ)
function loadTodos() {
  fetch("api_tasks.php?action=list")
    .then((response) => response.json())
    .then((data) => {
      todos = data;
      refreshCalendar();
      renderTaskPanel();
      checkDeadlineReminders(); // Cek pengingat deadline setiap kali data dimuat
    })
    .catch((error) => console.error("Error load data:", error));
}

// profile dropdown
document.getElementById("profileBtn").addEventListener("click", function (e) {
  document.getElementById("profileDropdown").classList.toggle("open");
});

document.addEventListener("click", function (e) {
  if (!document.getElementById("profileWrapper").contains(e.target)) {
    document.getElementById("profileDropdown").classList.remove("open");
  }
});

// konfirm logout (Hapus pembersihan localStorage karena data sudah aman di DB)
function handleLogout() {
  if (confirm("Yakin ingin keluar?")) {
    todos = [];
    fetch("logout.php", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          alert("Anda berhasil keluar.");
          window.location.href = "login.php";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Gagal memproses logout.");
      });
  }
}

// flatpickr
function getTaskDates() {
  return new Set(todos.map((t) => t.date));
}

// tandai tugas per hari di kalender
// =================================================================
// PERBAIKAN: Logika Penanda Kalender (Tanda Tidak Akan Hilang)
// =================================================================
function markDaysWithTasks(dObj, dStr, fpInstance, dayElem) {
  const dateKey = formatDateKey(dayElem.dateObj);
  const tasksOnDate = todos.filter(t => t.date === dateKey);
  dayElem.classList.remove("has-task", "has-urgent-task");

  if (tasksOnDate.length > 0) {
    const hasUrgent = tasksOnDate.some(t => !t.completed && (t.tag.includes("TINGGI") || t.tag === "PENTING"));
    
    if (hasUrgent) {
      dayElem.classList.add("has-urgent-task");
    } else {
      dayElem.classList.add("has-task");
    }
  }
}
// konfigurasi flatpickr
const fp = flatpickr("#main-calendar", {
  inline: true,
  defaultDate: "today",
  dateFormat: "Y-m-d",
  onDayCreate: markDaysWithTasks,
  onChange: function (selectedDates, dateStr) {
    selectedDate = dateStr;
    resetFormMode();
    renderTaskPanel();
  },
  onReady: function (selectedDates, dateStr) {
    selectedDate = dateStr;
    loadTodos(); // Panggil data dari database saat kalender siap
  },
});

function refreshCalendar() {
  fp.set("onDayCreate", markDaysWithTasks);
  fp.redraw();
}

// format tanggal untuk tampilan
function formatDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m-1 , d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// summary task panel
function renderTaskPanel() {
  document.getElementById("selected-date-label").textContent =
    formatDate(selectedDate);
  const container = document.getElementById("task-list-container");
  const filtered = todos.filter((t) => t.date === selectedDate);

  if (!filtered.length) {
    container.innerHTML = `
      <div class="task-empty">
        <i class="bi bi-clipboard-x"></i>
        Tidak ada tugas untuk tanggal ini.
      </div>`;
    return;
  }

  const group = document.createElement("div");
  group.className = "task-group";

  const hdr = document.createElement("div");
  hdr.className = "task-group-header";
  hdr.innerHTML = `
    <span>${formatDate(selectedDate)}</span>
    <span style="color:var(--text-muted);font-size:.7rem;">${filtered.length} tugas</span>`;
  group.appendChild(hdr);

  filtered.forEach((todo) => {
    const tagClass =
      {
        PENTING: "tag-penting",
        SEDANG: "tag-opsional",
        TAMBAHAN: "tag-tambahan",
      }[todo.tag] || "tag-tambahan";
    const item = document.createElement("div");
    item.className = `task-item${todo.completed ? " completed" : ""}`;
    item.innerHTML = `
      <div class="task-item-left">
        <div class="custom-checkbox${todo.completed ? " checked" : ""}" onclick="toggleTask(${todo.id}, ${todo.completed})"></div>
        <div>
          <span class="task-tag-badge ${tagClass}">${todo.tag}</span>
          <div class="task-item-text">${escapeHtml(todo.text)}</div>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn-edit" onclick="editTask(${todo.id})" title="Edit Tugas">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn-delete" onclick="deleteTask(${todo.id})" title="Hapus Tugas">
          <i class="bi bi-trash3"></i>
        </button>
      </div>`;
    group.appendChild(item);
  });

  container.innerHTML = "";
  container.appendChild(group);
}

// filter input
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// PROSES SIMPAN / EDIT KE DATABASE (CREATE / UPDATE)
document.getElementById("todo-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const text = document.getElementById("todo-input").value.trim();
  const tag = document.getElementById("todo-tag").value;
  if (!text) return;

  const payload = { text, tag, date: selectedDate };
  if (editingTaskId !== null) {
    payload.id = editingTaskId;
  }

  fetch("api_tasks.php?action=save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        document.getElementById("todo-input").value = "";
        resetFormMode();
        loadTodos(); // Muat ulang data terbaru dari database
      } else {
        alert("Gagal menyimpan tugas!");
      }
    });
});

function editTask(id) {
  const taskToEdit = todos.find((t) => t.id == id);
  if (!taskToEdit) return;

  document.getElementById("todo-input").value = taskToEdit.text;
  document.getElementById("todo-tag").value = taskToEdit.tag;
  editingTaskId = id;

  const submitBtn = document.querySelector(".btn-add");
  submitBtn.textContent = "Edit";
  submitBtn.style.backgroundColor = "var(--tag-opsional)";
}

function resetFormMode() {
  editingTaskId = null;
  const submitBtn = document.querySelector(".btn-add");
  if (submitBtn) {
    submitBtn.textContent = "Add";
    submitBtn.style.backgroundColor = "var(--accent)";
  }
}

// TOGGLE PROSES CHECKLIST (UPDATE STATUS KE DATABASE)
function toggleTask(id, currentStatus) {
  fetch("api_tasks.php?action=toggle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id, completed: !currentStatus }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        loadTodos();
      }
    });
}

// HAPUS DATA DARI DATABASE (DELETE)
function deleteTask(id) {
  if (confirm("Hapus tugas ini?")) {
    if (editingTaskId === id) resetFormMode();

    fetch("api_tasks.php?action=delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          loadTodos();
        }
      });
  }
}

document.getElementById("progress-text").textContent = `${completedTasks}/${totalTasks} Selesai (${progressPercent}%)`;
document.getElementById("task-progress-bar").style.width = `${progressPercent}%`;
// MODIFIKASI: Hitung Data untuk Summary Tugas (Hanya menghitung tugas yg BELUM selesai)
  const tinggiCount = filtered.filter(t => t.tag === "URGENSI TINGGI" && !t.completed).length;
  const sedangCount = filtered.filter(t => t.tag === "URGENSI SEDANG" && !t.completed).length;
  const rendahCount = filtered.filter(t => t.tag === "URGENSI RENDAH" && !t.completed).length;

  // hasil hitungan ditampilkan di summary panel
  document.getElementById("count-tinggi").textContent = tinggiCount;
  document.getElementById("count-sedang").textContent = sedangCount;
  document.getElementById("count-rendah").textContent = rendahCount;
function checkDeadlineReminders() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset jam ke 00:00 agar hitungan hari akurat
  
  const targetDate = new Date(today);
  targetDate.setDate(targetDate.getDate() + 2); // Rentang pantauan: Sampai H-2

  // Filter tugas: Cari yang BELUM selesai DAN batas waktunya kurang dari/sama dengan H-2
  const approachingTasks = todos.filter(t => {
    if (t.completed) return false;
    
    const tDate = new Date(t.date);
    tDate.setHours(0, 0, 0, 0);
    
    return tDate <= targetDate;
  });

  if (approachingTasks.length > 0) {
    // Susun elemen list HTML untuk setiap tugas
    let listHtml = `<p class="mb-2" style="font-size: 0.9rem;">Ada <strong>${approachingTasks.length} tugas</strong> yang butuh perhatianmu:</p><ul class="mb-0" style="padding-left: 18px;">`;
    
    approachingTasks.forEach(task => {
      // Jika tag urgensinya tinggi, teksnya kita beri warna merah
      const isUrgent = task.tag.includes("TINGGI") || task.tag === "PENTING";
      const textStyle = isUrgent ? "color: var(--danger); font-weight: 600;" : "color: var(--text-muted);";
      
      listHtml += `<li style="font-size: 0.85rem; ${textStyle} margin-bottom: 4px;">
                    ${escapeHtml(task.text)} 
                    <span style="font-size: 0.7rem; display: block; color: var(--text-secondary);">Target: ${formatDate(task.date)}</span>
                   </li>`;
    });
    listHtml += `</ul>`;

    // Masukkan ke dalam HTML
    document.getElementById("deadline-list").innerHTML = listHtml;
    
    // Tampilkan Toast tanpa autohide
    const toastEl = document.getElementById("deadlineToast");
    const toast = new bootstrap.Toast(toastEl, { autohide: false }); 
    toast.show();
  }
}