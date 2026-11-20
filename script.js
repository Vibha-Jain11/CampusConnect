
// ========================================
// CAMPUSCONNECT - MAIN APPLICATION
// ========================================

const STORAGE = {
    posts: "cc_posts",
    registrations: "cc_registrations",
    profile: "cc_profile"
};

const getData = (key, fallback) => {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
};

const saveData = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

// ========================================
// SAMPLE COLLEGE DATA
// Replace these with actual college data.
// ========================================

const events = [
    {
        id: 1,
        title: "Annual Technical Fest",
        date: "2026-12-15",
        category: "Technical",
        location: "Main Auditorium",
        description: "Technical competitions, coding challenges and innovation."
    },
    {
        id: 2,
        title: "AI and Machine Learning Workshop",
        date: "2026-12-20",
        category: "Workshop",
        location: "Computer Lab",
        description: "Explore AI concepts and practical machine learning."
    },
    {
        id: 3,
        title: "Cultural Fest",
        date: "2027-01-10",
        category: "Cultural",
        location: "College Ground",
        description: "Celebrate talent, music, dance and creativity."
    },
    {
        id: 4,
        title: "Sports Championship",
        date: "2027-01-20",
        category: "Sports",
        location: "Sports Complex",
        description: "Participate in interdepartmental sports competitions."
    }
];

const notices = [
    {
        id: 1,
        title: "Semester Examination Update",
        date: "2026-11-20",
        category: "Academic",
        description: "Students should check the official examination schedule."
    },
    {
        id: 2,
        title: "Library Timing Update",
        date: "2026-11-19",
        category: "General",
        description: "Library timing information for students."
    },
    {
        id: 3,
        title: "Workshop Registration",
        date: "2026-11-18",
        category: "Events",
        description: "Registration is open for upcoming technical workshops."
    }
];

// ========================================
// NAVIGATION
// ========================================

const pageNames = {
    dashboard: "Dashboard",
    events: "Events",
    notices: "Notice Board",
    academics: "Academics",
    clubs: "Clubs & Societies",
    resources: "Campus Resources",
    feed: "Campus Feed",
    profile: "My Profile"
};

function showPage(pageId) {
    const page = document.getElementById(pageId);

    if (!page) return;

    document.querySelectorAll(".page").forEach(section => {
        section.classList.remove("active");
    });

    page.classList.add("active");

    document.querySelectorAll(".nav-link").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === pageId
        );
    });

    document.getElementById("pageHeading").textContent =
        pageNames[pageId];

    document.getElementById("sidebar").classList.remove("open");

    history.replaceState(null, "", "#" + pageId);
    window.scrollTo(0, 0);
}

document.addEventListener("click", event => {
    const button = event.target.closest("[data-page]");

    if (button) {
        showPage(button.dataset.page);
    }
});

document.getElementById("menuToggle").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
});

// ========================================
// DATE
// ========================================

document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

// ========================================
// EVENTS
// ========================================

let registrations = getData(STORAGE.registrations, []);

function renderEvents(search = "") {
    const container = document.getElementById("eventList");

    const filtered = events.filter(event =>
        (event.title + " " + event.category)
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    if (!filtered.length) {
        container.innerHTML = "<p>No matching events found.</p>";
        return;
    }

    container.innerHTML = filtered.map(event => {
        const registered = registrations.includes(event.id);

        return `
            <article class="module-card event-card">
                <span class="tag">${event.category}</span>
                <h3>${escapeHTML(event.title)}</h3>
                <p>${escapeHTML(event.description)}</p>
                <p>📅 ${formatDate(event.date)}</p>
                <p>📍 ${escapeHTML(event.location)}</p>
                <button class="${registered ? "secondary-button" : "primary-button"}"
                    data-register="${event.id}"
                    ${registered ? "disabled" : ""}>
                    ${registered ? "Registered ✓" : "Register Now"}
                </button>
            </article>
        `;
    }).join("");
}

function formatDate(date) {
    return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

document.getElementById("eventSearch").addEventListener("input", event => {
    renderEvents(event.target.value);
});

document.addEventListener("click", event => {
    const button = event.target.closest("[data-register]");

    if (!button) return;

    const id = Number(button.dataset.register);

    if (!registrations.includes(id)) {
        registrations.push(id);
        saveData(STORAGE.registrations, registrations);
        renderEvents(document.getElementById("eventSearch").value);
        updateDashboard();
        alert("Event registration successful!");
    }
});

// ========================================
// NOTICES
// ========================================

function renderNotices() {
    const container = document.getElementById("noticeList");

    container.innerHTML = notices.map(notice => `
        <article class="notice-card">
            <span class="tag">${escapeHTML(notice.category)}</span>
            <h3>${escapeHTML(notice.title)}</h3>
            <small>${formatDate(notice.date)}</small>
            <p>${escapeHTML(notice.description)}</p>
        </article>
    `).join("");
}

// ========================================
// CAMPUS FEED
// ========================================

let posts = getData(STORAGE.posts, [
    {
        id: 1,
        text: "Welcome to the campus community!",
        date: new Date().toISOString()
    },
    {
        id: 2,
        text: "Explore upcoming campus events.",
        date: new Date().toISOString()
    }
]);

const postForm = document.getElementById("postForm");
const postInput = document.getElementById("postInput");

postInput.addEventListener("input", () => {
    document.getElementById("charCount").textContent =
        postInput.value.length;
});

postForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = postInput.value.trim();
    const status = document.getElementById("status");

    if (!text) {
        status.textContent = "Please enter a post!";
        return;
    }

    if (text.length > 200) {
        status.textContent = "Post must not exceed 200 characters!";
        return;
    }

    posts.unshift({
        id: Date.now(),
        text: text,
        date: new Date().toISOString()
    });

    saveData(STORAGE.posts, posts);

    postInput.value = "";
    document.getElementById("charCount").textContent = "0";
    status.textContent = "Post published successfully!";

    renderFeed();
    updateDashboard();
});

function renderFeed() {
    const container = document.getElementById("feedList");

    if (!posts.length) {
        container.innerHTML = "<p>No posts yet.</p>";
        return;
    }

    container.innerHTML = posts.map(post => `
        <article class="feed-post">
            <div class="feed-avatar">S</div>
            <div class="feed-content">
                <strong>Campus Member</strong>
                <small>${new Date(post.date).toLocaleString("en-IN")}</small>
                <p>${escapeHTML(post.text)}</p>
            </div>
        </article>
    `).join("");
}

// ========================================
// PROFILE
// ========================================

const profileForm = document.getElementById("profileForm");

function loadProfile() {
    const profile = getData(STORAGE.profile, {});

    document.getElementById("studentName").value =
        profile.name || "";

    document.getElementById("studentId").value =
        profile.studentId || "";

    document.getElementById("department").value =
        profile.department || "";

    document.getElementById("academicYear").value =
        profile.academicYear || "";

    updateProfileName();
}

function updateProfileName() {
    const name = document.getElementById("studentName").value.trim();

    document.getElementById("profileDisplayName").textContent =
        name || "Student";

    document.querySelector(".profile-button").textContent =
        name ? name.split(" ")[0] : "Student";

    document.querySelector(".avatar").textContent =
        name ? name.charAt(0).toUpperCase() : "S";
}

profileForm.addEventListener("submit", event => {
    event.preventDefault();

    const profile = {
        name: document.getElementById("studentName").value.trim(),
        studentId: document.getElementById("studentId").value.trim(),
        department: document.getElementById("department").value,
        academicYear: document.getElementById("academicYear").value
    };

    saveData(STORAGE.profile, profile);
    updateProfileName();

    document.getElementById("profileStatus").textContent =
        "Profile saved successfully!";
});

document.getElementById("studentName").addEventListener(
    "input", updateProfileName
);

// ========================================
// DASHBOARD
// ========================================

function updateDashboard() {
    const upcoming = events.filter(event =>
        new Date(event.date + "T23:59:59") >= new Date()
    );

    document.getElementById("eventCount").textContent =
        upcoming.length;

    document.getElementById("noticeCount").textContent =
        notices.length;

    document.getElementById("postCount").textContent =
        posts.length;

    document.getElementById("registrationCount").textContent =
        registrations.length;

    document.getElementById("dashboardEvents").innerHTML =
        upcoming.slice(0, 3).map(event => `
            <div class="mini-item">
                <strong>${escapeHTML(event.title)}</strong>
                <small>${formatDate(event.date)}</small>
            </div>
        `).join("") || "<p>No upcoming events.</p>";

    document.getElementById("dashboardNotices").innerHTML =
        notices.slice(0, 3).map(notice => `
            <div class="mini-item">
                <strong>${escapeHTML(notice.title)}</strong>
                <small>${formatDate(notice.date)}</small>
            </div>
        `).join("");
}

// ========================================
// HTML SAFETY
// ========================================

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// ========================================
// INITIALIZE APPLICATION
// ========================================

function initializeApp() {
    renderEvents();
    renderNotices();
    renderFeed();
    loadProfile();
    updateDashboard();

    const initialPage = location.hash.substring(1);

    showPage(pageNames[initialPage] ? initialPage : "dashboard");
}

initializeApp();
