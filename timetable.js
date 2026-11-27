
// Get HTML elements
const form = document.getElementById("timetableForm");
const courseInput = document.getElementById("course");
const dayInput = document.getElementById("day");
const startInput = document.getElementById("startTime");
const endInput = document.getElementById("endTime");
const classroomInput = document.getElementById("classroom");
const message = document.getElementById("message");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

// Days of the week
const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];

// Load saved classes from Local Storage
let classes = JSON.parse(
    localStorage.getItem("timetableClasses")
) || [];

let editingId = null;


// Save data in Local Storage
function saveData() {
    localStorage.setItem(
        "timetableClasses",
        JSON.stringify(classes)
    );
}


// Display weekly timetable
function displayTimetable() {

    days.forEach(day => {

        const dayColumn = document.getElementById(day);

        dayColumn.innerHTML = "";

        const dayClasses = classes
            .filter(item => item.day === day)
            .sort((a, b) =>
                a.startTime.localeCompare(b.startTime)
            );

        if (dayClasses.length === 0) {
            dayColumn.innerHTML =
                '<p class="empty">No classes scheduled</p>';
        }

        dayClasses.forEach(item => {

            const card = document.createElement("div");
            card.className = "class-card";

            const title = document.createElement("h4");
            title.textContent = item.course;

            const time = document.createElement("p");
            time.textContent =
                "Time: " + item.startTime + " - " + item.endTime;

            const room = document.createElement("p");
            room.textContent = "Room: " + item.classroom;

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.className = "edit-btn";
            editButton.addEventListener("click", () => {
                editClass(item.id);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-btn";
            deleteButton.addEventListener("click", () => {
                deleteClass(item.id);
            });

            card.append(title, time, room,
                        editButton, deleteButton);

            dayColumn.appendChild(card);
        });
    });
}


// Validate user inputs
function validateInputs() {

    const course = courseInput.value.trim();
    const day = dayInput.value;
    const start = startInput.value;
    const end = endInput.value;
    const classroom = classroomInput.value.trim();

    if (!course || !day || !start || !end || !classroom) {
        showMessage("Please fill in all fields.", "red");
        return false;
    }

    if (end <= start) {
        showMessage(
            "End time must be after start time.",
            "red"
        );
        return false;
    }

    // Check for overlapping classes
    const conflict = classes.some(item => {

        if (item.day !== day || item.id === editingId) {
            return false;
        }

        return start < item.endTime &&
               end > item.startTime;
    });

    if (conflict) {
        showMessage(
            "You already have a class during this time!",
            "red"
        );
        return false;
    }

    return true;
}


// Display messages
function showMessage(text, color) {
    message.textContent = text;
    message.style.color = color;
}


// Add or Update a class
form.addEventListener("submit", function(event) {

    event.preventDefault();

    if (!validateInputs()) {
        return;
    }

    const classData = {
        id: editingId || Date.now(),
        course: courseInput.value.trim(),
        day: dayInput.value,
        startTime: startInput.value,
        endTime: endInput.value,
        classroom: classroomInput.value.trim()
    };

    if (editingId !== null) {

        const index = classes.findIndex(
            item => item.id === editingId
        );

        classes[index] = classData;

        showMessage("Class updated successfully!", "green");

    } else {

        classes.push(classData);

        showMessage("Class added successfully!", "green");
    }

    saveData();
    displayTimetable();
    resetForm();
});


// Edit a class
function editClass(id) {

    const item = classes.find(item => item.id === id);

    if (!item) return;

    editingId = id;

    courseInput.value = item.course;
    dayInput.value = item.day;
    startInput.value = item.startTime;
    endInput.value = item.endTime;
    classroomInput.value = item.classroom;

    saveBtn.textContent = "Update Class";
    cancelBtn.hidden = false;

    document.getElementById("formTitle").textContent =
        "Edit Class";

    message.textContent = "";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// Delete a class
function deleteClass(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this class?"
    );

    if (!confirmed) return;

    classes = classes.filter(item => item.id !== id);

    saveData();
    displayTimetable();

    if (editingId === id) {
        resetForm();
    }

    showMessage("Class deleted successfully!", "green");
}


// Reset form
function resetForm() {

    form.reset();

    editingId = null;

    saveBtn.textContent = "Add Class";
    cancelBtn.hidden = true;

    document.getElementById("formTitle").textContent =
        "Add New Class";
}


// Cancel editing
cancelBtn.addEventListener("click", function() {
    resetForm();
    message.textContent = "";
});


// Display saved classes when page loads
displayTimetable();
