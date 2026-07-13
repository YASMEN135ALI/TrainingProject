const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!token) {
    window.location.href = "../login.html";
}

// عرض اسم المستخدم
if (username) {
    document.getElementById("username").textContent = username;
}

// =========================
// الصلاحيات حسب الدور
// =========================

// الموظف
if (role === "employee") {
    document.querySelector('a[href="users.html"]')?.parentElement.remove();
    document.querySelector('a[href="permissions.html"]')?.parentElement.remove();
    document.querySelector('a[href="settings.html"]')?.parentElement.remove();
    document.querySelector('a[href="activity_logs.html"]')?.parentElement.remove();
}

// مسؤول القسم
else if (role === "manager") {
    // لا يستطيع إدارة المستخدمين
    document.querySelector('a[href="users.html"]')?.parentElement.remove();
    // لا يستطيع تعديل الصلاحيات
    document.querySelector('a[href="permissions.html"]')?.parentElement.remove();
    // لا يستطيع تعديل الإعدادات
    document.querySelector('a[href="settings.html"]')?.parentElement.remove();
    // يستطيع رؤية النشاطات والبحث والوثائق والتصنيفات
}

// المدير
else if (role === "admin") {
    // جميع الصفحات متاحة
}

// =========================
// تحميل البيانات
// =========================

async function loadDashboard() {
    try {
        // الوثائق
        const documentsResponse = await fetch("http://127.0.0.1:8000/api/documents/", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        const documents = await documentsResponse.json();
        document.getElementById("countDocuments").textContent = documents.length;

        const archived = documents.filter(doc => doc.status === "ARCHIVED");
        document.getElementById("countArchived").textContent = archived.length;

        // المستخدمون
        const usersResponse = await fetch("http://127.0.0.1:8000/api/users/", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        const users = await usersResponse.json();
        document.getElementById("countUsers").textContent = users.length;

        // الملفات
        const filesResponse = await fetch("http://127.0.0.1:8000/api/files/", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        const files = await filesResponse.json();
        document.getElementById("countFiles").textContent = files.length;

        // النشاطات
        const activityResponse = await fetch("http://127.0.0.1:8000/api/activity/", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        const activities = await activityResponse.json();
        const table = document.getElementById("activityTable");
        table.innerHTML = "";

        activities.slice(0, 10).forEach(item => {
            table.innerHTML += `
                <tr>
                    <td>${item.user || "-"}</td>
                    <td>${item.action}</td>
                    <td>${item.document || "-"}</td>
                    <td>${item.created_at}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Dashboard Error:", error);
    }
}

loadDashboard();

// =========================
// تسجيل الخروج
// =========================

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    window.location.href = "../login.html";
}
