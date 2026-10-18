// State
let tasks = JSON.parse(localStorage.getItem('todo_tasks')) || [];
const priorityValues = { 'low': 1, 'medium': 2, 'high': 3 };

// DOM Elements
const taskInput = document.getElementById('taskInput');
const taskDueDate = document.getElementById('taskDueDate');
const taskPriority = document.getElementById('taskPriority');
const taskTag = document.getElementById('taskTag');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');
const sortSelect = document.getElementById('sortSelect');
const taskList = document.getElementById('taskList');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const themeToggle = document.getElementById('themeToggle');

// Initialize
window.onload = function() {
  // Load Theme
  const savedTheme = localStorage.getItem('todo_theme') || 'light';
  if (savedTheme === 'dark') document.body.setAttribute('data-theme', 'dark');
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

  // Load Filter State
  filterSelect.value = localStorage.getItem('todo_filter') || 'all';
  sortSelect.value = localStorage.getItem('todo_sort') || 'newest';

  updateUI();
};

// Toggle Theme
themeToggle.addEventListener('click', () => {
  const isDark = document.body.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.body.removeAttribute('data-theme');
    localStorage.setItem('todo_theme', 'light');
    themeToggle.textContent = '🌙';
  } else {
    document.body.setAttribute('data-theme', 'dark');
    localStorage.setItem('todo_theme', 'dark');
    themeToggle.textContent = '☀️';
  }
});

// Add Task via Enter
taskInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') window.addTask();
});

// Add Task
window.addTask = function() {
  const text = taskInput.value.trim();
  if (!text) {
    alert("Task cannot be empty!");
    return;
  }

  const newTask = {
    id: Date.now().toString(),
    text: text,
    completed: false,
    dueDate: taskDueDate.value,
    priority: taskPriority.value,
    tag: taskTag.value.trim(),
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  saveTasks();
  
  // Reset Inputs
  taskInput.value = '';
  taskDueDate.value = '';
  taskTag.value = '';
  taskPriority.value = 'medium';
  
  taskInput.focus();
  updateUI();
};

// Delete Task
window.deleteTask = function(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  updateUI();
};

// Toggle Task
window.toggleTask = function(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    updateUI();
  }
};

// Edit Task
window.editTask = function(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const newText = prompt("Edit your task:", task.text);
  if (newText !== null && newText.trim() !== "") {
    task.text = newText.trim();
    saveTasks();
    updateUI();
  }
};

// Save Tasks
function saveTasks() {
  localStorage.setItem('todo_tasks', JSON.stringify(tasks));
}

// Save Filters on change
filterSelect.addEventListener('change', () => {
  localStorage.setItem('todo_filter', filterSelect.value);
});
sortSelect.addEventListener('change', () => {
  localStorage.setItem('todo_sort', sortSelect.value);
});

// Bulk Actions
window.toggleAllTasks = function() {
  const anyPending = tasks.some(t => !t.completed);
  tasks.forEach(t => t.completed = anyPending);
  saveTasks();
  updateUI();
};

window.clearCompleted = function() {
  if (confirm("Are you sure you want to clear all completed tasks?")) {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    updateUI();
  }
};

// Update UI
window.updateUI = function() {
  const filter = filterSelect.value;
  const sort = sortSelect.value;
  const search = searchInput.value.toLowerCase();

  // Filter
  let processedTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(search) || (task.tag && task.tag.toLowerCase().includes(search));
    const matchesFilter = filter === 'all' ? true : 
                          filter === 'completed' ? task.completed : 
                          !task.completed;
    return matchesSearch && matchesFilter;
  });

  // Sort
  processedTasks.sort((a, b) => {
    if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sort === 'priority') {
      const pDiff = priorityValues[b.priority] - priorityValues[a.priority];
      if (pDiff !== 0) return pDiff;
      return new Date(b.createdAt) - new Date(a.createdAt); // Secondary sort
    }
    return 0;
  });

  // Render
  taskList.innerHTML = '';
  processedTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    
    // Priority indicator
    const prioIndicator = document.createElement('div');
    prioIndicator.className = `priority-indicator p-${task.priority}`;
    
    // Meta information
    let metaHTML = '';
    if (task.dueDate) metaHTML += `<span>📅 ${task.dueDate}</span>`;
    if (task.tag) metaHTML += `<span class="task-tag">${task.tag}</span>`;

    li.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')">
      <div class="task-content">
        <span class="task-text">${task.text}</span>
        ${metaHTML ? `<div class="task-meta">${metaHTML}</div>` : ''}
      </div>
      <div class="task-actions">
        <button class="icon-btn" onclick="editTask('${task.id}')" title="Edit">✏️</button>
        <button class="icon-btn delete" onclick="deleteTask('${task.id}')" title="Delete">🗑️</button>
      </div>
    `;
    li.prepend(prioIndicator);
    taskList.appendChild(li);
  });

  // Update Stats
  totalTasksEl.textContent = `Total: ${tasks.length}`;
  completedTasksEl.textContent = `Completed: ${tasks.filter(t => t.completed).length}`;
};
