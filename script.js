
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priority");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const progressBar = document.getElementById("progressBar");
const progressPercent = document.getElementById("progressPercent");
const emptyMessage = document.getElementById("emptyMessage");

let tasks = JSON.parse(localStorage.getItem("studentTasks")) || [];

let currentFilter = "all";

// Save tasks in browser
function saveTasks() {
    localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

// Add new task
taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const taskName = taskInput.value.trim();

    if (taskName === "") {
        return;
    }

    const newTask = {
        id: Date.now(),
        name: taskName,
        priority: priorityInput.value,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();
});

// Display tasks
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    filteredTasks.forEach(task => {

        const li = document.createElement("li");
        li.className = "task-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {
            toggleTask(task.id);
        });

        const info = document.createElement("div");
        info.className = "task-info";

        const name = document.createElement("div");
        name.className = "task-name";

        if (task.completed) {
            name.classList.add("done");
        }

        name.textContent = task.name;

        const priority = document.createElement("div");
        priority.className = "priority";
        priority.textContent = "Priority: " + task.priority;

        info.appendChild(name);
        info.appendChild(priority);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            deleteTask(task.id);
        });

        li.appendChild(checkbox);
        li.appendChild(info);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });

    updateDashboard();

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";
}

// Complete or uncomplete task
function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

// Delete task
function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

// Update statistics
function updateDashboard() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    progressBar.style.width = percentage + "%";
    progressPercent.textContent = percentage + "%";
}

// Filter buttons
document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", function() {

        currentFilter = button.dataset.filter;

        document.querySelectorAll(".filter").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        renderTasks();
    });
});

// Initial display
renderTasks();