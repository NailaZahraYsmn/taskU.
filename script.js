// Inisialisasi awal (kosong, data diambil dari database)
let todos = [];
let editingTaskId = null;
let currentSearch = ""; // Variabel penyimpan teks pencarian
let currentStatusFilter = "ALL"; // Variabel penyimpan filter dropdown

// format tanggal YYYY-MM-DD
function formatDateKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
// tanggal aktif di kalender
let selectedDate = formatDateKey();

// =========================================
// FITUR LIGHT MODE
// =========================================
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

// Cek preferensi tema pengguna di localStorage saat halaman pertama dimuat
if (localStorage.getItem("lightMode") === "true") {
  document.body.classList.add("light-mode");
  if(themeIcon) themeIcon.classList.replace("bi-sun-fill", "bi-moon-stars-fill");
}

// Event listener untuk mendeteksi klik pada tombol tema
if(themeToggle) {
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
}

// AMBIL DATA DARI DATABASE (READ)
function loadTodos() {
  fetch("api_tasks.php?action=list")
    .then(async (response) => {
      if (!response.ok) throw new Error("Gagal load data dari server.");
      return response.json();
    })
    .then((data) => {
      todos = data;
      refreshCalendar();
      renderTaskPanel();       // Render "Your Task Today" di atas
      renderBottomTasks();     // Render "Semua Tugas" di bawah
      checkDeadlineReminders(); 
    })
    .catch((error) => console.error("Error load data:", error));
}

// profile dropdown
const profileBtn = document.getElementById("profileBtn");
if(profileBtn) {
    profileBtn.addEventListener("click", function (e) {
        document.getElementById("profileDropdown").classList.toggle("open");
    });
}

document.addEventListener("click", function (e) {
  const wrapper = document.getElementById("profileWrapper");
  if (wrapper && !wrapper.contains(e.target)) {
    const dropdown = document.getElementById("profileDropdown");
    if(dropdown) dropdown.classList.remove("open");
  }
});

// konfirm logout
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

// Penanda hari dengan tugas
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
let fp;
if(document.getElementById("main-calendar")){
    fp = flatpickr("#main-calendar", {
    inline: true,
    defaultDate: "today",
    dateFormat: "Y-m-d",
    onDayCreate: markDaysWithTasks,
    onChange: function (selectedDates, dateStr) {
        selectedDate = dateStr;
        resetFormMode();
        renderTaskPanel(); // Hanya perbarui kotak Your Task Today
    },
    onReady: function (selectedDates, dateStr) {
        selectedDate = dateStr;
        loadTodos(); 
    },
    });
}

function refreshCalendar() {
  if(fp) {
      fp.set("onDayCreate", markDaysWithTasks);
      fp.redraw();
  }
}

// format tanggal untuk tampilan
function formatDate(dateStr) {
  if(!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m-1 , d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// =========================================
// EVENT LISTENER UNTUK SEARCH DAN FILTER
// =========================================
const searchInput = document.getElementById('search-task');
if(searchInput) {
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        renderBottomTasks(); // Hanya perbarui kotak daftar semua tugas di bawah
    });
}

const statusFilter = document.getElementById('filter-status');
if(statusFilter) {
    statusFilter.addEventListener('change', (e) => {
        currentStatusFilter = e.target.value;
        renderBottomTasks(); // Hanya perbarui kotak daftar semua tugas di bawah
    });
}

// =========================================
// RENDER: PANEL ATAS (YOUR TASK TODAY)
// =========================================
function renderTaskPanel() {
  let dateLabel = formatDate(selectedDate);
  const labelElem = document.getElementById("selected-date-label");
  if(labelElem) labelElem.textContent = dateLabel; 
  
  const container = document.getElementById("task-list-container");
  if(!container) return;

  // Hanya ambil tugas untuk tanggal kalender yang diklik
  const tasksForDate = todos.filter((t) => t.date === selectedDate);

  if (!tasksForDate.length) {
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
    <span>Tugas di ${formatDate(selectedDate)}</span>
    <span style="color:var(--text-muted);font-size:.7rem;">${tasksForDate.length} tugas</span>`;
  group.appendChild(hdr);

  tasksForDate.forEach((todo) => {
    const tagClass = { PENTING: "tag-penting", OPSIONAL: "tag-opsional", TAMBAHAN: "tag-tambahan" }[todo.tag] || "tag-tambahan";
      
    const item = document.createElement("div");
    item.className = `task-item${todo.completed ? " completed" : ""}`;
    item.innerHTML = `
      <div class="task-item-left">
        <div class="custom-checkbox${todo.completed ? " checked" : ""}" onclick="toggleTask(${todo.id}, ${todo.completed})"></div>
        <div>
          <span class="task-tag-badge ${tagClass}">${todo.tag === 'OPSIONAL' ? 'SEDANG' : todo.tag}</span>
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

// =========================================
// RENDER: PANEL BAWAH (SEMUA TUGAS + FILTER)
// =========================================
function renderBottomTasks() {
  // 1. UPDATE DATA SUMMARY
  const totalCount = todos.length;
  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = totalCount - completedCount;

  const countTotalElem = document.getElementById("count-total");
  const countActiveElem = document.getElementById("count-active");
  const countCompletedElem = document.getElementById("count-completed");

  if(countTotalElem) countTotalElem.textContent = totalCount;
  if(countActiveElem) countActiveElem.textContent = activeCount;
  if(countCompletedElem) countCompletedElem.textContent = completedCount;

  // 2. SIAPKAN CONTAINER BAWAH (Membuat otomatis jika belum ada)
  let container = document.getElementById("bottom-task-list-container");
  if (!container) {
    const controlsContainer = document.querySelector(".bottom-controls-container");
    if (controlsContainer) {
      container = document.createElement("div");
      container.id = "bottom-task-list-container";
      container.className = "mt-4"; // margin top
      controlsContainer.appendChild(container);
    } else {
      return; 
    }
  }

  // 3. TERAPKAN FILTER & PENCARIAN (SEARCH)
  let filtered = todos; 
  
  if (currentStatusFilter === "ACTIVE") {
    filtered = filtered.filter(t => !t.completed);
  } else if (currentStatusFilter === "COMPLETED") {
    filtered = filtered.filter(t => t.completed);
  } else if (currentStatusFilter === "PENTING") {
    filtered = filtered.filter(t => t.tag === "PENTING");
  }

  if (currentSearch.trim() !== "") {
    const query = currentSearch.toLowerCase();
    filtered = filtered.filter(t => t.text.toLowerCase().includes(query));
  }

  // Urutkan berdasarkan tanggal terdekat terlebih dahulu 
  filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!filtered.length) {
    container.innerHTML = `
      <div class="task-empty task-card mt-3 border-0 shadow-sm" style="background: var(--bg-card);">
        <i class="bi bi-search" style="font-size: 2rem;"></i>
        <div class="mt-2">Tidak ada tugas yang sesuai filter/pencarian.</div>
      </div>`;
    return;
  }

  const group = document.createElement("div");
  group.className = "task-group mt-3 shadow-sm border-0";

  const hdr = document.createElement("div");
  hdr.className = "task-group-header";
  hdr.style.backgroundColor = "var(--bg-card)";
  hdr.innerHTML = `
    <span>Hasil Pencarian & Filter</span>
    <span style="color:var(--text-muted);font-size:.7rem;">${filtered.length} tugas</span>`;
  group.appendChild(hdr);

  filtered.forEach((todo) => {
    const tagClass = { PENTING: "tag-penting", OPSIONAL: "tag-opsional", TAMBAHAN: "tag-tambahan" }[todo.tag] || "tag-tambahan";
      
    const item = document.createElement("div");
    item.className = `task-item${todo.completed ? " completed" : ""}`;
    item.style.backgroundColor = "var(--bg-card)";
    item.innerHTML = `
      <div class="task-item-left">
        <div class="custom-checkbox${todo.completed ? " checked" : ""}" onclick="toggleTask(${todo.id}, ${todo.completed})"></div>
        <div>
          <span class="task-tag-badge ${tagClass}">${todo.tag === 'OPSIONAL' ? 'SEDANG' : todo.tag}</span>
          <div class="task-item-text">
             ${escapeHtml(todo.text)}
             <div style="font-size: 0.65rem; color: var(--text-muted); margin-top: 3px;">
                📅 ${formatDate(todo.date)}
             </div>
          </div>
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
const todoForm = document.getElementById("todo-form");
if(todoForm) {
    todoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    
    const text = document.getElementById("todo-input").value.trim();
    const tag = document.getElementById("todo-tag").value;
    
    if (!text) {
        alert("Teks tugas tidak boleh kosong!");
        return;
    }

    const payload = { text, tag, date: selectedDate };
    if (editingTaskId !== null) {
        payload.id = editingTaskId;
    }
    
    fetch("api_tasks.php?action=save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
        .then(async (res) => {
        const rawText = await res.text();
        try {
            return JSON.parse(rawText);
        } catch (err) {
            console.error("Respon Server BUKAN format JSON! Detail respon:", rawText);
            throw new Error("Terdapat error atau peringatan pada sisi server PHP/Database.");
        }
        })
        .then((data) => {
        if (data.status === "success") {
            document.getElementById("todo-input").value = "";
            resetFormMode();
            loadTodos(); // Muat ulang data terbaru dari database
        } else {
            alert("Gagal menyimpan tugas: " + (data.message || "Pastikan kueri SQL kamu benar"));
        }
        })
        .catch((error) => {
        console.error("Fetch API Gagal:", error);
        alert("Simpan Gagal: " + error.message);
        });
    });
}

function editTask(id) {
  const taskToEdit = todos.find((t) => t.id == id);
  if (!taskToEdit) return;

  document.getElementById("todo-input").value = taskToEdit.text;
  document.getElementById("todo-tag").value = taskToEdit.tag;
  editingTaskId = id;

  const submitBtn = document.querySelector(".btn-add");
  if(submitBtn) {
      submitBtn.textContent = "Edit";
      submitBtn.style.backgroundColor = "var(--tag-opsional)";
  }
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
    })
    .catch(err => console.error("Gagal toggle status:", err));
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
      })
      .catch(err => console.error("Gagal hapus tugas:", err));
  }
}

// FUNGSI CEK DEADLINE
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
    let listHtml = `<p class="mb-2" style="font-size: 0.9rem;">Ada <strong>${approachingTasks.length} tugas</strong> yang butuh perhatianmu:</p><ul class="mb-0" style="padding-left: 18px;">`;
    
    approachingTasks.forEach(task => {
      const isUrgent = task.tag.includes("TINGGI") || task.tag === "PENTING";
      const textStyle = isUrgent ? "color: var(--danger); font-weight: 600;" : "color: var(--text-muted);";
      
      listHtml += `<li style="font-size: 0.85rem; ${textStyle} margin-bottom: 4px;">
                    ${escapeHtml(task.text)} 
                    <span style="font-size: 0.7rem; display: block; color: var(--text-secondary);">Target: ${formatDate(task.date)}</span>
                   </li>`;
    });
    listHtml += `</ul>`;

    const deadlineList = document.getElementById("deadline-list");
    if(deadlineList) deadlineList.innerHTML = listHtml;
    
    // Tampilkan Toast
    const toastEl = document.getElementById("deadlineToast");
    if(toastEl) {
        const toast = new bootstrap.Toast(toastEl, { autohide: false }); 
        toast.show();
    }
  }
}