
// ==========================================
// UNIMATE - STUDY GROUPS
// JavaScript Functionality
// ==========================================


// ==========================================
// 1. STUDY GROUPS DATA
// ==========================================

const groups = [

    {
        id: 1,
        name: "Web Development",
        category: "Programming",
        icon: "💻",
        description: "Learn HTML, CSS and JavaScript with other students.",
        leader: "Sara",
        members: 12,
        objectives: "Practice website development, improve coding skills and share programming knowledge.",
        topics: ["HTML", "CSS", "JavaScript"]
    },

    {
        id: 2,
        name: "Database Management",
        category: "Database",
        icon: "🗄️",
        description: "Study SQL, database design and database management.",
        leader: "Manal",
        members: 8,
        objectives: "Understand SQL queries, database relationships and database design.",
        topics: ["SQL", "MySQL", "Database Design"]
    },

    {
        id: 3,
        name: "Computer Networks",
        category: "Networking",
        icon: "🌐",
        description: "Explore networking concepts and practice network exercises.",
        leader: "Ahmed",
        members: 10,
        objectives: "Understand network protocols, IP addressing and network communication.",
        topics: ["IP Addressing", "Protocols", "Networking"]
    },

    {
        id: 4,
        name: "Multimedia Design",
        category: "Multimedia",
        icon: "🎨",
        description: "Share creative ideas and improve multimedia projects.",
        leader: "Rawda",
        members: 9,
        objectives: "Practice multimedia design, animation and creative projects.",
        topics: ["Animation", "3D Design", "Multimedia"]
    },

    {
        id: 5,
        name: "UI/UX Design",
        category: "Design",
        icon: "🖌️",
        description: "Learn user interface and user experience design.",
        leader: "Mooza",
        members: 7,
        objectives: "Improve interface design, usability and prototyping skills.",
        topics: ["Figma", "Wireframes", "Prototyping"]
    },

    {
        id: 6,
        name: "Java Programming",
        category: "Programming",
        icon: "☕",
        description: "Practice Java programming and solve coding problems.",
        leader: "Sara",
        members: 15,
        objectives: "Develop programming logic and understand object-oriented programming.",
        topics: ["Java", "OOP", "Problem Solving"]
    }

];


// ==========================================
// 2. STUDY RESOURCES DATA
// ==========================================

const resources = [

    {
        id: 1,
        name: "HTML & CSS Learning Guide",
        description: "Beginner web development resource",
        icon: "📄",
        type: "Learning Guide",
        url: "https://developer.mozilla.org/en-US/docs/Learn_web_development"
    },

    {
        id: 2,
        name: "JavaScript Documentation",
        description: "JavaScript tutorials and references",
        icon: "📘",
        type: "Documentation",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
    },

    {
        id: 3,
        name: "SQL Learning Resources",
        description: "Learn SQL and database concepts",
        icon: "🗄️",
        type: "Learning Resource",
        url: "https://www.w3schools.com/sql/"
    },

    {
        id: 4,
        name: "Computer Networking Guide",
        description: "Networking concepts and tutorials",
        icon: "🌐",
        type: "Study Guide",
        url: "https://www.geeksforgeeks.org/computer-network-tutorials/"
    },

    {
        id: 5,
        name: "Figma Design Resources",
        description: "Learn interface and experience design",
        icon: "🎨",
        type: "Design Resource",
        url: "https://help.figma.com/"
    },

    {
        id: 6,
        name: "Java Programming Guide",
        description: "Java tutorials and documentation",
        icon: "☕",
        type: "Documentation",
        url: "https://docs.oracle.com/en/java/"
    }

];


// ==========================================
// 3. LOCAL STORAGE
// ==========================================

const STORAGE_KEY = "studyHubJoinedGroups";

function getJoinedGroups() {

    try {

        const saved = localStorage.getItem(STORAGE_KEY);

        const parsed = saved ? JSON.parse(saved) : [];

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter(id =>
            groups.some(group => group.id === id)
        );

    } catch (error) {

        console.error("Could not load joined groups:", error);

        return [];

    }

}

let joinedGroups = getJoinedGroups();


function saveJoinedGroups() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(joinedGroups)
        );

    } catch (error) {

        console.error("Could not save joined groups:", error);

    }

}


// Display a simulated member count for this browser.
// This is not a shared count across all students.

function getDisplayedMembers(group) {

    const joined = joinedGroups.includes(group.id);

    return group.members + (joined ? 1 : 0);

}


// ==========================================
// 4. DISPLAY STUDY GROUPS
// ==========================================

const groupsContainer =
    document.getElementById("groupsContainer");


function displayGroups(groupList = groups) {

    groupsContainer.innerHTML = "";

    const emptyMessage =
        document.getElementById("emptyMessage");

    emptyMessage.style.display =
        groupList.length === 0 ? "block" : "none";


    groupList.forEach(group => {

        const isJoined =
            joinedGroups.includes(group.id);


        // Group Card

        const card = document.createElement("div");

        card.className = "group-card";


        // Group Header

        const top = document.createElement("div");

        top.className = "group-top";


        const icon = document.createElement("div");

        icon.className = "group-icon";

        icon.textContent = group.icon;


        const category = document.createElement("span");

        category.className = "category-tag";

        category.textContent = group.category;


        top.append(icon, category);


        // Group Name

        const title = document.createElement("h3");

        title.textContent = group.name;


        // Group Description

        const description = document.createElement("p");

        description.className = "group-description";

        description.textContent = group.description;


        // Group Information

        const info = document.createElement("div");

        info.className = "group-info";


        const memberText = document.createElement("span");

        memberText.textContent =
            `👥 ${getDisplayedMembers(group)} Members`;


        const leaderText = document.createElement("span");

        leaderText.textContent =
            `By ${group.leader}`;


        info.append(memberText, leaderText);


        // Buttons

        const buttons = document.createElement("div");

        buttons.className = "group-buttons";


        const joinButton = document.createElement("button");

        joinButton.className = isJoined
            ? "btn btn-danger"
            : "btn btn-primary";

        joinButton.textContent = isJoined
            ? "Leave Group"
            : "Join Group";


        joinButton.addEventListener("click", () => {

            toggleGroup(group.id);

        });


        const detailsButton =
            document.createElement("button");

        detailsButton.className = "details-btn";

        detailsButton.textContent = "Details";


        detailsButton.addEventListener("click", () => {

            showGroupDetails(group.id);

        });


        buttons.append(joinButton, detailsButton);


        card.append(
            top,
            title,
            description,
            info,
            buttons
        );


        groupsContainer.appendChild(card);

    });

}


// ==========================================
// 5. JOIN AND LEAVE GROUP
// ==========================================

function toggleGroup(groupId) {

    const group = groups.find(g => g.id === groupId);

    if (!group) return;


    const isJoined = joinedGroups.includes(groupId);


    if (isJoined) {

        // Leave Group

        joinedGroups = joinedGroups.filter(
            id => id !== groupId
        );

        alert(`You have left ${group.name}.`);

    } else {

        // Join Group

        joinedGroups.push(groupId);

        alert(`You have successfully joined ${group.name}!`);

    }


    saveJoinedGroups();

    updateStatistics();

    displayGroups();

    displayMyGroups();

}


// ==========================================
// 6. GROUP DETAILS
// ==========================================

const groupModal =
    document.getElementById("groupModal");

const modalContent =
    document.getElementById("modalContent");


function showGroupDetails(groupId) {

    const group = groups.find(g => g.id === groupId);

    if (!group) return;


    modalContent.innerHTML = "";


    // Group Title

    const title = document.createElement("h2");

    title.textContent = `${group.icon} ${group.name}`;


    // Description

    const description = document.createElement("p");

    description.textContent = group.description;


    // Information Box

    const details = document.createElement("div");

    details.className = "modal-info";


    const category = document.createElement("p");

    category.textContent =
        `Subject: ${group.category}`;


    const leader = document.createElement("p");

    leader.textContent =
        `Group Leader: ${group.leader}`;


    const members = document.createElement("p");

    members.textContent =
        `Members: ${getDisplayedMembers(group)}`;


    details.append(category, leader, members);


    // Objectives

    const objectiveTitle = document.createElement("h3");

    objectiveTitle.textContent = "Study Objectives";


    const objectives = document.createElement("p");

    objectives.textContent = group.objectives;


    // Topics

    const topicsTitle = document.createElement("h3");

    topicsTitle.textContent = "Group Topics";


    const topics = document.createElement("p");

    topics.textContent =
        group.topics.join(", ");


    modalContent.append(
        title,
        description,
        details,
        objectiveTitle,
        objectives,
        topicsTitle,
        topics
    );


    groupModal.classList.add("show");

}


// ==========================================
// 7. CLOSE GROUP DETAILS
// ==========================================

document.getElementById("closeModal")
    .addEventListener("click", () => {

        groupModal.classList.remove("show");

    });


groupModal.addEventListener("click", (event) => {

    if (event.target === groupModal) {

        groupModal.classList.remove("show");

    }

});


document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        groupModal.classList.remove("show");

    }

});


// ==========================================
// 8. DISPLAY MY STUDY GROUPS
// ==========================================

function displayMyGroups() {

    const container =
        document.getElementById("myGroupsContainer");

    container.innerHTML = "";


    const myGroups = groups.filter(group =>
        joinedGroups.includes(group.id)
    );


    // No Joined Groups

    if (myGroups.length === 0) {

        const message = document.createElement("p");

        message.className = "empty-message";

        message.style.display = "block";

        message.textContent =
            "You have not joined any study groups yet.";

        container.appendChild(message);

        return;

    }


    // Display Joined Groups

    myGroups.forEach(group => {

        const item = document.createElement("div");

        item.className = "my-group-item";


        const info = document.createElement("div");


        const name = document.createElement("h4");

        name.textContent =
            `${group.icon} ${group.name}`;


        const category = document.createElement("p");

        category.textContent =
            `${group.category} • ${getDisplayedMembers(group)} Members`;


        info.append(name, category);


        // Leave Button

        const button = document.createElement("button");

        button.className = "btn btn-danger";

        button.textContent = "Leave";


        button.addEventListener("click", () => {

            toggleGroup(group.id);

        });


        item.append(info, button);

        container.appendChild(item);

    });

}


// ==========================================
// 9. SEARCH AND FILTER GROUPS
// ==========================================

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");


function filterGroups() {

    const searchText =
        searchInput.value.toLowerCase().trim();

    const selectedCategory =
        categoryFilter.value;


    const filteredGroups = groups.filter(group => {

        const matchesSearch =

            group.name.toLowerCase().includes(searchText) ||

            group.description.toLowerCase().includes(searchText) ||

            group.category.toLowerCase().includes(searchText) ||

            group.topics.some(topic =>
                topic.toLowerCase().includes(searchText)
            );


        const matchesCategory =

            selectedCategory === "All" ||

            group.category === selectedCategory;


        return matchesSearch && matchesCategory;

    });


    displayGroups(filteredGroups);

}


// Search while typing

searchInput.addEventListener("input", filterGroups);


// Filter when selecting a subject

categoryFilter.addEventListener("change", filterGroups);


// ==========================================
// 10. DISPLAY STUDY RESOURCES
// ==========================================

function displayResources() {

    const container =
        document.getElementById("resourcesContainer");

    container.innerHTML = "";


    resources.forEach(resource => {

        const card = document.createElement("div");

        card.className = "resource-card";


        // Resource Icon

        const icon = document.createElement("div");

        icon.className = "resource-icon";

        icon.textContent = resource.icon;


        // Resource Information

        const info = document.createElement("div");


        const title = document.createElement("h4");

        title.textContent = resource.name;


        const description = document.createElement("p");

        description.textContent = resource.description;


        // Resource Link

        const link = document.createElement("a");

        link.href = resource.url;

        link.target = "_blank";

        link.rel = "noopener noreferrer";

        link.textContent = "Open Resource ↗";


        info.append(title, description, link);

        card.append(icon, info);

        container.appendChild(card);

    });

}


// ==========================================
// 11. UPDATE STATISTICS
// ==========================================

function updateStatistics() {

    document.getElementById("totalGroups")
        .textContent = groups.length;


    document.getElementById("joinedGroups")
        .textContent = joinedGroups.length;


    document.getElementById("totalResources")
        .textContent = resources.length;

}


// ==========================================
// 12. INITIALIZE STUDY GROUPS PAGE
// ==========================================

function initializePage() {

    displayGroups();

    displayMyGroups();

    displayResources();

    updateStatistics();

}


// Run the page

initializePage();


// ==========================================
// END OF STUDY GROUPS JAVASCRIPT
// ==========================================
