// inisialisasi awal
let todos = JSON.parse(localStorage.getItem('tasku_todos')) || [];
let editingTaskId = null; 

//format tanggal YYYY-MM-DD
function formatDateKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
// tanggal aktif di kalender
let selectedDate = formatDateKey(); 

function saveAll() { localStorage.setItem('tasku_todos', JSON.stringify(todos)); }
// profile dropdown
document.getElementById('profileBtn').addEventListener('click', function(e) {
  document.getElementById('profileDropdown').classList.toggle('open');
});

document.addEventListener('click', function(e) {
  if (!document.getElementById('profileWrapper').contains(e.target)) {
    document.getElementById('profileDropdown').classList.remove('open');
  }
});
// konfirm logout
function handleLogout() {
  if (confirm('Yakin ingin keluar?')) {
    localStorage.removeItem('tasku_todos');
    todos = [];
    alert('Anda telah keluar. Sampai jumpa!');
    location.href = 'login.html';
  }
}

// flatpickr
// ambil tugas 
function getTaskDates() { return new Set(todos.map(t => t.date)); }

// tandai tugas per hari di kalender
function markDaysWithTasks(dObj, dStr, fpInstance, dayElem) {
    if (getTaskDates().has(formatDateKey(dayElem.dateObj))) {
        dayElem.classList.add('has-task');
    }
}

// konfigurasi flatpickr
const fp = flatpickr("#main-calendar", {
  inline: true,
  defaultDate: "today",
  dateFormat: "Y-m-d",
  onDayCreate: markDaysWithTasks, 
  onChange: 
  function(selectedDates, dateStr) {
    selectedDate = dateStr;
    resetFormMode(); 
    renderTaskPanel();
  },
  onReady: 
  function(selectedDates, dateStr) {
    selectedDate = dateStr;
    renderTaskPanel();
  }
});

function refreshCalendar() {
  fp.set('onDayCreate', markDaysWithTasks);
  fp.redraw();
}
// format tanggal untuk tampilan
function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m, d).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' });
}

// summary task panel
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
        <div class="custom-checkbox${todo.completed ? ' checked' : ''}" onclick="toggleTask(${todo.id})"></div>
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
// filter input
function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// CRUD
document.getElementById('todo-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const text = document.getElementById('todo-input').value.trim();
  const tag  = document.getElementById('todo-tag').value;
  if (!text) return;

  if (editingTaskId !== null) {
    todos = todos.map(t => t.id === editingTaskId ? { ...t, text, tag } : t);
    resetFormMode();
  } else {
    todos.push({ id: Date.now(), text, tag, date: selectedDate, completed: false });
  }

  saveAll();
  document.getElementById('todo-input').value = '';
  refreshCalendar();
  renderTaskPanel();
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

function toggleTask(id) {
  todos = todos.map(t => t.id === id ? {...t, completed: !t.completed} : t);
  saveAll();
  renderTaskPanel();
}

function deleteTask(id) {
  if (confirm('Hapus tugas ini?')) {
    if (editingTaskId === id) resetFormMode(); 
    todos = todos.filter(t => t.id !== id);
    saveAll();
    refreshCalendar();
    renderTaskPanel();
  }
}