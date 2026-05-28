// Inisialisasi awal variabel penampung tugas
let todos = [];
let editingTaskId = null; 

// Format tanggal YYYY-MM-DD
function formatDateKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// Tanggal aktif di kalender
let selectedDate = formatDateKey(); 

// AMBIL DATA DARI DATABASE (Ganti fungsi localStorage)
async function fetchTodos() {
  try {
    const response = await fetch('api_tasks.php');
    todos = await response.json();
    refreshCalendar();
    renderTaskPanel();
  } catch (error) {
    console.error('Gagal memuat data tugas:', error);
  }
}

// Profile dropdown toggle
document.getElementById('profileBtn').addEventListener('click', function(e) {
  document.getElementById('profileDropdown').classList.toggle('open');
});

document.addEventListener('click', function(e) {
  if (!document.getElementById('profileWrapper').contains(e.target)) {
    document.getElementById('profileDropdown').classList.remove('open');
  }
});

// Konfirmasi logout (Fungsi AJAX ke logout.php)
function handleLogout() {
  if (confirm('Yakin ingin keluar?')) {
    // Lakukan request ke logout.php untuk menghancurkan session di server
    fetch('logout.php')
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          alert('Anda telah keluar. Sampai jumpa!');
          // Arahkan ke index.php, bukan login.html atau dashboard
          location.href = 'index.php'; 
        } else {
          alert('Gagal logout, terjadi kesalahan pada server.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Terjadi kesalahan jaringan.');
      });
  }
}
// Tandai tugas per hari di kalender
function getTaskDates() { return new Set(todos.map(t => t.date)); }

function markDaysWithTasks(dObj, dStr, fpInstance, dayElem) {
    if (getTaskDates().has(formatDateKey(dayElem.dateObj))) {
        dayElem.classList.add('has-task');
    }
}

// Konfigurasi flatpickr
const fp = flatpickr("#main-calendar", {
  inline: true,
  defaultDate: "today",
  dateFormat: "Y-m-d",
  onDayCreate: markDaysWithTasks, 
  onChange: function(selectedDates, dateStr) {
    selectedDate = dateStr;
    resetFormMode(); 
    renderTaskPanel();
  },
  onReady: function(selectedDates, dateStr) {
    selectedDate = dateStr;
    fetchTodos(); // Ambil data saat kalender siap
  }
});

function refreshCalendar() {
  fp.set('onDayCreate', markDaysWithTasks);
  fp.redraw();
}

// Format tanggal untuk tampilan teks panel
// Format tanggal untuk tampilan teks panel kanan
function formatDate(dateStr) {
  // Ubah potongan string tanggal menjadi tipe data Number
  const [y, m, d] = dateStr.split('-').map(Number);
  
  // m - 1 digunakan untuk menyesuaikan indeks bulan JavaScript (0-11)
  return new Date(y, m - 1, d).toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
}

// Render isi panel daftar tugas
function renderTaskPanel() {
  document.getElementById('selected-date-label').textContent = formatDate(selectedDate);
  const container = document.getElementById('task-list-container');
  const filtered  = todos.filter(t => t.date === selectedDate);

  if (!filtered.length) {
    container.innerHTML = `
      <div class="task-empty">
        <i class="bi bi-clipboard-x"></i>
        Tidak ada tugas untuk tanggal ini.
      </div>`;
    return;
  }

  const group = document.createElement('div');
  group.className = 'task-group';

  const hdr = document.createElement('div');
  hdr.className = 'task-group-header';
  hdr.innerHTML = `
    <span>${formatDate(selectedDate)}</span>
    <span style="color:var(--text-muted);font-size:.7rem;">${filtered.length} tugas</span>`;
  group.appendChild(hdr);

  filtered.forEach(todo => {
    const tagClass = { PENTING:'tag-penting', OPSIONAL:'tag-opsional', TAMBAHAN:'tag-tambahan' }[todo.tag] || 'tag-tambahan';
    const item = document.createElement('div');
    item.className = `task-item${todo.completed ? ' completed' : ''}`;
    item.innerHTML = `
      <div class="task-item-left">
        <div class="custom-checkbox${todo.completed ? ' checked' : ''}" onclick="toggleTask(${todo.id}, ${todo.completed})"></div>
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

  container.innerHTML = '';
  container.appendChild(group);
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// KONTROL PROSES TAMBAH & EDIT (POST KE DATABASE)
document.getElementById('todo-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const text = document.getElementById('todo-input').value.trim();
  const tag  = document.getElementById('todo-tag').value;
  if (!text) return;

  const bodyData = { text, tag, date: selectedDate };
  if (editingTaskId !== null) {
    bodyData.id = editingTaskId;
  }

  try {
    const response = await fetch('api_tasks.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    });
    const result = await response.json();
    
    if(result.status === 'success') {
      document.getElementById('todo-input').value = '';
      resetFormMode();
      fetchTodos(); // Refresh total data terbaru
    }
  } catch (error) {
    console.error('Gagal menyimpan data:', error);
  }
});

function editTask(id) {
  const taskToEdit = todos.find(t => t.id === id);
  if (!taskToEdit) return;

  document.getElementById('todo-input').value = taskToEdit.text;
  document.getElementById('todo-tag').value = taskToEdit.tag;
  editingTaskId = id;

  const submitBtn = document.querySelector('.btn-add'); 
  submitBtn.textContent = 'Edit';
  submitBtn.style.backgroundColor = 'var(--tag-opsional)'; 
}

function resetFormMode() {
  editingTaskId = null;
  const submitBtn = document.querySelector('.btn-add'); 
  if (submitBtn) {
    submitBtn.textContent = 'Add';
    submitBtn.style.backgroundColor = 'var(--accent)';
  }
}

// TOGGLE CHECKBOX STATUS (PUT KE DATABASE)
async function toggleTask(id, currentStatus) {
  try {
    await fetch('api_tasks.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, completed: !currentStatus })
    });
    fetchTodos();
  } catch (error) {
    console.error('Gagal memperbarui status:', error);
  }
}

// HAPUS DATA (DELETE KE DATABASE)
async function deleteTask(id) {
  if (confirm('Hapus tugas ini?')) {
    if (editingTaskId === id) resetFormMode(); 
    try {
      await fetch('api_tasks.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
      });
      fetchTodos();
    } catch (error) {
      console.error('Gagal menghapus data:', error);
    }
  }
}