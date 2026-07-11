const API = "http://127.0.0.1:8000/api";
const token = localStorage.getItem("token");

// التحقق من وجود التوكن
if (!token) {
    window.location.href = "login.html";
}

// تحميل المستخدمين عند فتح الصفحة
document.addEventListener("DOMContentLoaded", loadUsers);

// ===============================
// جلب المستخدمين
// ===============================
async function loadUsers() {

    const response = await fetch(`${API}/users/`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        console.log("Error loading users");
        return;
    }

    const users = await response.json();
    const table = document.getElementById("usersTable");

    table.innerHTML = "";

    users.forEach(user => {
        table.innerHTML += `
            <tr>
                <td>${user.username}</td>
                <td>${user.email || "-"}</td>
                <td>${user.role}</td>
                <td>${user.is_active ? "فعال" : "متوقف"}</td>
                <td>
                    <button class="btn btn-warning btn-sm"
                        onclick="openEditUser(${user.id}, '${user.email}', '${user.role}')">
                        تعديل
                    </button>

                    <button class="btn btn-danger btn-sm"
                        onclick="deleteUser(${user.id})">
                        حذف
                    </button>
                </td>
            </tr>
        `;
    });
}

// ===============================
// فتح نافذة إضافة مستخدم
// ===============================
function openAddUser() {
    let modal = new bootstrap.Modal(
        document.getElementById("addUserModal")
    );
    modal.show();
}

// ===============================
// إضافة مستخدم
// ===============================
async function addUser() {

    const data = {
        username: document.getElementById("addUsername").value,
        email: document.getElementById("addEmail").value,
        password: document.getElementById("addPassword").value,
        role: document.getElementById("addRole").value
    };

    const response = await fetch(`${API}/auth/register/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
        alert("تمت إضافة المستخدم بنجاح");

        loadUsers();

        // إغلاق النافذة
        let modal = bootstrap.Modal.getInstance(
            document.getElementById("addUserModal")
        );
        modal.hide();

    } else {
        alert(JSON.stringify(result));
    }
}

// ===============================
// فتح تعديل المستخدم
// ===============================
function openEditUser(id, email, role) {

    document.getElementById("editId").value = id;
    document.getElementById("editEmail").value = email;
    document.getElementById("editRole").value = role;

    let modal = new bootstrap.Modal(
        document.getElementById("editUserModal")
    );
    modal.show();
}

// ===============================
// تعديل المستخدم
// ===============================
async function updateUser() {

    const id = document.getElementById("editId").value;

    const data = {
        email: document.getElementById("editEmail").value,
        role: document.getElementById("editRole").value
    };

    const response = await fetch(`${API}/users/${id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert("تم تعديل المستخدم");
        loadUsers();
    } else {
        alert("خطأ في التعديل");
    }
}

// ===============================
// حذف المستخدم
// ===============================
async function deleteUser(id) {

    if (!confirm("هل تريد حذف المستخدم؟")) return;

    const response = await fetch(`${API}/users/${id}/`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (response.ok) {
        alert("تم حذف المستخدم");
        loadUsers();
    } else {
        alert("خطأ في حذف المستخدم");
    }
}

// ===============================
// تسجيل خروج
// ===============================
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    window.location.href = "login.html";
}
// ===============================
// حذف مستخدم
// ===============================
async function deleteUser(id) {

    if (!confirm("هل تريد حذف المستخدم؟")) {
        return;
    }

    const response = await fetch(`${API}/users/${id}/`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (response.ok) {
        alert("تم حذف المستخدم");
        loadUsers();
    } else {
        alert("حدث خطأ أثناء الحذف");
    }
}

// ===============================
// Logout
// ===============================
function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    window.location.href = "login.html";
}
