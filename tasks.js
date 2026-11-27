
const taskForm = document.getElementById("taskForm");
const taskName = document.getElementById("taskName");
const taskCourse = document.getElementById("taskCourse");
const taskDeadline = document.getElementById("taskDeadline");
const taskPriority = document.getElementById("taskPriority");
const taskNotes = document.getElementById("taskNotes");

const pendingList = document.getElementById("pendingTaskList");
const completedList = document.getElementById("completedTaskList");

const taskSearch = document.getElementById("taskSearch");
const taskFilter = document.getElementById("taskFilter");
const taskSort = document.getElementById("taskSort");

let tasks = [];
let editingId = null;
let messageTimer;
let storageError = false;

try {
    tasks = JSON.parse(localStorage.getItem("unimateTasks")) || [];

    if (!Array.isArray(tasks)) {
        tasks = [];
    }
} catch (error) {
    tasks = [];
    storageError = true;
}

function showToday() {
    const today = new Date();

    document.getElementById("taskToday").textContent =
        "📅 " + today.toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}

function saveTasks() {
    try {
        localStorage.setItem("unimateTasks", JSON.stringify(tasks));
        return true;
    } catch (error) {
        showMessage("Changes could not be saved in your browser.", "#dc2626");
        return false;
    }
}

function showMessage(message, color) {
    const messageBox = document.getElementById("taskMessage");

    clearTimeout(messageTimer);

    messageBox.textContent = message;
    messageBox.style.backgroundColor = color;
    messageBox.classList.add("show");

    messageTimer = setTimeout(function() {
        messageBox.classList.remove("show");
    }, 3000);
}

function daysRemaining(task) {
    const today = new Date();
    const deadline = new Date(task.deadline + "T00:00:00");

    const todayDate = Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const deadlineDate = Date.UTC(
        deadline.getFullYear(),
        deadline.getMonth(),
        deadline.getDate()
    );

    return Math.round(
        (deadlineDate - todayDate) / 86400000
    );
}

function isOverdue(task) {
    return !task.completed && daysRemaining(task) < 0;
}

function getCountdown(task) {
    const days = daysRemaining(task);

    if (days < 0) {
        return "Overdue by " + Math.abs(days) +
            (days === -1 ? " day" : " days");
    }

    if (days === 0) {
        return "Due today";
    }

    if (days === 1) {
        return "Due tomorrow";
    }

    return "Due in " + days + " days";
}

taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = taskName.value.trim();
    const course = taskCourse.value.trim();
    const deadline = taskDeadline.value;
    const priority = taskPriority.value;
    const notes = taskNotes.value.trim();

    if (!name || !course || !deadline || !priority) {
        showMessage("Please complete all required fields.", "#dc2626");
        return;
    }

    let message;

    if (editingId === null) {
        const newTask = {
            id: Math.max(Date.now(), ...tasks.map(function(task) {
                return task.id + 1;
            })),
            name: name,
            course: course,
            deadline: deadline,
            priority: priority,
            notes: notes,
            completed: false
        };

        tasks.push(newTask);

        message = "✓ Task added successfully!";
    } else {
        const task = tasks.find(function(task) {
            return task.id === editingId;
        });

        if (!task) {
            resetForm();
            showMessage("Task could not be found.", "#dc2626");
            return;
        }

        task.name = name;
        task.course = course;
        task.deadline = deadline;
        task.priority = priority;
        task.notes = notes;

        message = "✓ Task updated successfully!";
    }

    resetForm();

    taskSearch.value = "";
    taskFilter.value = "all";

    if (saveTasks()) {
        showMessage(message, "#16a34a");
    }

    displayTasks();
});

function resetForm() {
    taskForm.reset();
    editingId = null;

    document.getElementById("taskFormTitle").textContent =
        "Create a New Task";

    document.getElementById("taskSubmit").textContent =
        "+ Add Task";

    document.getElementById("taskCancel").hidden = true;
}

function editTask(id) {
    const task = tasks.find(function(task) {
        return task.id === id;
    });

    if (!task) {
        return;
    }

    editingId = id;

    taskName.value = task.name;
    taskCourse.value = task.course;
    taskDeadline.value = task.deadline;
    taskPriority.value = task.priority;
    taskNotes.value = task.notes || "";

    document.getElementById("taskFormTitle").textContent =
        "Edit Task";

    document.getElementById("taskSubmit").textContent =
        "Save Changes";

    document.getElementById("taskCancel").hidden = false;

    taskForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    taskName.focus();
}

document.getElementById("taskCancel").addEventListener("click", function() {
    resetForm();
    showMessage("Editing cancelled.", "#6366f1");
});

function deleteTask(id) {
    const confirmed = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
        return;
    }

    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    if (editingId === id) {
        resetForm();
    }

    if (saveTasks()) {
        showMessage("Task deleted successfully.", "#6366f1");
    }

    displayTasks();
}

function toggleTask(id) {
    const task = tasks.find(function(task) {
        return task.id === id;
    });

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    if (saveTasks()) {
        if (task.completed) {
            showMessage("🎉 Great job! Task completed.", "#16a34a");
        } else {
            showMessage("Task moved back to pending.", "#6366f1");
        }
    }

    displayTasks();
}

function createTaskCard(task) {
    const card = document.createElement("div");

    card.className = "task-card " + task.priority.toLowerCase();

    if (task.completed) {
        card.classList.add("completed");
    }

    if (isOverdue(task)) {
        card.classList.add("overdue");
    }

    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.completed;

    checkbox.setAttribute(
        "aria-label",
        "Change status of " + task.name
    );

    checkbox.addEventListener("change", function() {
        toggleTask(task.id);
    });

    const details = document.createElement("div");
    details.className = "task-details";

    const title = document.createElement("h4");
    title.textContent = task.name;

    const course = document.createElement("p");
    course.textContent = "📚 " + task.course;

    const deadline = document.createElement("p");

    const formattedDate = new Date(
        task.deadline + "T00:00:00"
    ).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    deadline.textContent = "📅 Due: " + formattedDate;

    details.appendChild(title);
    details.appendChild(course);
    details.appendChild(deadline);

    if (!task.completed) {
        const countdown = document.createElement("p");

        countdown.className = "task-countdown";
        countdown.textContent = "⏳ " + getCountdown(task);

        if (isOverdue(task)) {
            countdown.classList.add("late");
        } else if (daysRemaining(task) <= 1) {
            countdown.classList.add("urgent");
        }

        details.appendChild(countdown);
    }

    if (task.notes) {
        const notes = document.createElement("p");
        notes.textContent = "📝 " + task.notes;
        details.appendChild(notes);
    }

    const priority = document.createElement("span");

    priority.className =
        "task-priority " + task.priority.toLowerCase();

    priority.textContent = task.priority + " Priority";

    details.appendChild(priority);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "task-edit";
    editButton.textContent = "Edit";

    editButton.addEventListener("click", function() {
        editTask(task.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "task-delete";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function() {
        deleteTask(task.id);
    });

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    card.appendChild(checkbox);
    card.appendChild(details);
    card.appendChild(actions);

    return card;
}

function displayTasks() {
    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    const search = taskSearch.value.toLowerCase().trim();
    const filter = taskFilter.value;
    const sort = taskSort.value;

    let visibleTasks = tasks.filter(function(task) {
        const matchesSearch =
            task.name.toLowerCase().includes(search) ||
            task.course.toLowerCase().includes(search) ||
            (task.notes || "").toLowerCase().includes(search);

        if (!matchesSearch) {
            return false;
        }

        if (filter === "pending") {
            return !task.completed;
        }

        if (filter === "completed") {
            return task.completed;
        }

        if (filter === "overdue") {
            return isOverdue(task);
        }

        return true;
    });

    const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3
    };

    visibleTasks.sort(function(a, b) {
        if (sort === "priority") {
            return priorityOrder[a.priority] -
                priorityOrder[b.priority];
        }

        if (sort === "newest") {
            return b.id - a.id;
        }

        return a.deadline.localeCompare(b.deadline);
    });

    visibleTasks.forEach(function(task) {
        const card = createTaskCard(task);

        if (task.completed) {
            completedList.appendChild(card);
        } else {
            pendingList.appendChild(card);
        }
    });

    if (pendingList.children.length === 0) {
        pendingList.innerHTML =
            '<p class="task-empty">No pending tasks to display.</p>';
    }

    if (completedList.children.length === 0) {
        completedList.innerHTML =
            '<p class="task-empty">No completed tasks to display.</p>';
    }

    document.getElementById("taskPendingSection").hidden =
        filter === "completed";

    document.getElementById("taskCompletedSection").hidden =
        filter === "pending" || filter === "overdue";

    updateStatistics();
}

function updateStatistics() {
    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const pending = total - completed;

    const overdue = tasks.filter(function(task) {
        return isOverdue(task);
    }).length;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("taskTotal").textContent = total;
    document.getElementById("taskPending").textContent = pending;
    document.getElementById("taskCompleted").textContent = completed;
    document.getElementById("taskOverdue").textContent = overdue;

    document.getElementById("taskPercentage").textContent =
        percentage + "%";

    document.getElementById("taskProgressCircle").style.setProperty(
        "--task-percent",
        percentage + "%"
    );

    const progressText = document.getElementById("taskProgressText");

    if (total === 0) {
        progressText.textContent =
            "Complete your first task to get started!";
    } else if (percentage === 100) {
        progressText.textContent =
            "Amazing work! You completed all your tasks!";
    } else if (percentage >= 50) {
        progressText.textContent =
            "You're doing great! " + completed + " of " +
            total + " tasks completed.";
    } else {
        progressText.textContent =
            completed + " of " + total +
            " tasks completed. Keep going!";
    }
}

taskSearch.addEventListener("input", displayTasks);
taskFilter.addEventListener("change", displayTasks);
taskSort.addEventListener("change", displayTasks);

showToday();
displayTasks();

if (storageError) {
    showMessage("Previously saved tasks could not be loaded.", "#dc2626");
}

setInterval(function() {
    showToday();
    displayTasks();
}, 60000);
