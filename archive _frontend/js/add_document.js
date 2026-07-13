const API = "http://127.0.0.1:8000/api";

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

// ===========================
// التحقق من تسجيل الدخول
// ===========================
if (!token) {
    window.location.href = "../login.html";
}

// السماح فقط للأدوار المصرح لها
if (!["admin", "manager", "employee"].includes(role)) {
    alert("ليس لديك صلاحية للوصول إلى هذه الصفحة");
    window.location.href = "../login.html";
}

// ===========================
// تحميل التصنيفات
// ===========================
async function loadCategories() {
    try {
        const response = await fetch(`${API}/categories/`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) {
            throw new Error("فشل تحميل التصنيفات");
        }

        const categories = await response.json();
        const select = document.getElementById("category");

        categories.forEach(category => {
            select.innerHTML += `<option value="${category.id}">${category.name}</option>`;
        });
    } catch (error) {
        console.error(error);
    }
}

loadCategories();

// ===========================
// تحميل المستخدمين
// ===========================
async function loadUsers() {
    try {
        const response = await fetch(`${API}/users/`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) {
            throw new Error("فشل تحميل المستخدمين");
        }

        const users = await response.json();
        const select = document.getElementById("owner");

        users.forEach(user => {
            select.innerHTML += `<option value="${user.id}">${user.username}</option>`;
        });
    } catch (error) {
        console.error(error);
    }
}

loadUsers();

// ===========================
// إضافة وثيقة
// ===========================
async function addDocument() {
    const refNumber = document.getElementById("refNumber").value.trim();
    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const securityLevel = document.getElementById("securityLevel").value;
    const description = document.getElementById("description").value.trim();
    const owner = document.getElementById("owner").value;
    const archiveDate = document.getElementById("archiveDate").value;
    const attachment = document.getElementById("attachment").files[0];

    // التحقق من الحقول المطلوبة
    if (!refNumber || !title || !category || !owner) {
        alert("يرجى تعبئة جميع الحقول المطلوبة");
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

    try {
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
            console.error(result);
            alert("فشل إضافة الوثيقة");
        }
    } catch (error) {
        console.error(error);
        alert("حدث خطأ أثناء الاتصال بالخادم");
    }
}
