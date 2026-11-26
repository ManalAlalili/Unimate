
// UniMate Grade Tracker

var courses = [];
var grades = [];

// Add course when the form is submitted
document.getElementById("gradeForm").addEventListener("submit", addCourse);

function addCourse(event) {
    event.preventDefault();

    var courseName = document.getElementById("courseName").value.trim();
    var courseGrade = parseFloat(document.getElementById("courseGrade").value);
    var message = document.getElementById("message");

    // Validate user input
    if (courseName == "" || isNaN(courseGrade) ||
        courseGrade < 0 || courseGrade > 100) {
        message.textContent = "Please enter a valid course name and grade.";
        return;
    }

    // Store course name and grade
    courses.push(courseName);
    grades.push(courseGrade);

    message.textContent = "Course added successfully!";

    document.getElementById("gradeForm").reset();

    displayCourses();
    calculateGrades();
}

// Display courses in the table
function displayCourses() {
    var gradeList = document.getElementById("gradeList");

    gradeList.innerHTML = "";

    for (var i = 0; i < courses.length; i++) {
        var row = document.createElement("tr");

        var nameCell = document.createElement("td");
        nameCell.textContent = courses[i];

        var gradeCell = document.createElement("td");
        gradeCell.textContent = grades[i] + "%";

        var actionCell = document.createElement("td");
        var deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("onclick", "deleteCourse(" + i + ")");

        actionCell.appendChild(deleteButton);

        row.appendChild(nameCell);
        row.appendChild(gradeCell);
        row.appendChild(actionCell);

        gradeList.appendChild(row);
    }

    if (courses.length == 0) {
        document.getElementById("emptyMessage").style.display = "block";
    } else {
        document.getElementById("emptyMessage").style.display = "none";
    }
}

// Calculate average and highest grade
function calculateGrades() {
    var total = 0;
    var average = 0;
    var highest = 0;

    for (var i = 0; i < grades.length; i++) {
        total += grades[i];

        if (grades[i] > highest) {
            highest = grades[i];
        }
    }

    if (grades.length > 0) {
        average = total / grades.length;
    }

    // Update summary cards
    document.getElementById("totalCourses").textContent = courses.length;
    document.getElementById("averageGrade").textContent = average.toFixed(2) + "%";
    document.getElementById("highestGrade").textContent = highest + "%";

    // Update academic progress
    document.getElementById("progressBar").value = average;
    document.getElementById("progressText").textContent = average.toFixed(2) + "%";

    // Display motivation message
    var motivation = document.getElementById("motivationText");

    if (grades.length == 0) {
        motivation.textContent = "Start by adding your first course!";
    } else if (average >= 90) {
        motivation.textContent = "Excellent work! Keep it up!";
    } else if (average >= 75) {
        motivation.textContent = "Great progress! Keep studying!";
    } else if (average >= 60) {
        motivation.textContent = "Good effort! You can improve!";
    } else {
        motivation.textContent = "Keep practicing and never give up!";
    }
}

// Delete a course
function deleteCourse(index) {
    if (confirm("Are you sure you want to delete this course?")) {
        courses.splice(index, 1);
        grades.splice(index, 1);

        document.getElementById("message").textContent =
            "Course deleted successfully!";

        displayCourses();
        calculateGrades();
    }
}
