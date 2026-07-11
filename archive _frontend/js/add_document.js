const API = "http://127.0.0.1:8000/api";
const token = localStorage.getItem("token");

// التحقق من وجود التوكن
if (!token) {
    window.location.href = "../login.html";
}

// ===========================
// تحميل التصنيفات
// ===========================
async function loadCategories() {

    const response = await fetch(`${API}/categories/`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const categories = await response.json();
    const select = document.getElementById("category");

    categories.forEach(category => {
        select.innerHTML += `
            <option value="${category.id}">
                ${category.name}
            </option>
        `;
    });
}

loadCategories();

// ===========================
// تحميل المستخدمين
// ===========================
async function loadUsers() {

    const response = await fetch(`${API}/users/`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const users = await response.json();
    const select = document.getElementById("owner");

    users.forEach(user => {
        select.innerHTML += `
            <option value="${user.id}">
                ${user.username}
            </option>
        `;
    });
}

loadUsers();

// ===========================
// إضافة وثيقة
// ===========================
async function addDocument() {

    const refNumber = document.getElementById("refNumber").value;
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const securityLevel = document.getElementById("securityLevel").value;
    const description = document.getElementById("description").value;
    const owner = document.getElementById("owner").value;
    const archiveDate = document.getElementById("archiveDate").value;
    const attachment = document.getElementById("attachment").files[0];

    // التحقق من الحقول الأساسية
    if (!refNumber || !title || !category || !owner) {
        alert("يرجى تعبئة الحقول الأساسية");
        return;
    }

    const formData = new FormData();

    formData.append("reference_number", refNumber);
    formData.append("title", title);
    formData.append("category", category);
    formData.append("security_level", securityLevel);
    formData.append("description", description);
    formData.append("owner", owner);

    if (archiveDate) {
        formData.append("archive_date", archiveDate);
    }

    if (attachment) {
        formData.append("attachment", attachment);
    }

    const response = await fetch(`${API}/documents/`, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token
        },
        body: formData
    });

    const result = await response.json();

    if (response.ok) {
        alert("تمت إضافة الوثيقة بنجاح");
        window.location.href = "documents.html";
    } else {
        console.log(result);
        alert(JSON.stringify(result));
    }
}
