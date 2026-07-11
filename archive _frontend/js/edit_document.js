const API = "http://127.0.0.1:8000/api";
const token = localStorage.getItem("token");

// التحقق من وجود التوكن
if (!token) {
    window.location.href = "../login.html";
}

// الحصول على ID من الرابط
const params = new URLSearchParams(window.location.search);
const docId = params.get("id");

// ===========================
// تحميل التصنيفات
// ===========================
async function loadCategories(selectedCategory) {

    const response = await fetch(`${API}/categories/`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const data = await response.json();
    const select = document.getElementById("category");

    select.innerHTML = `
        <option value="">اختر التصنيف</option>
    `;

    data.forEach(cat => {
        select.innerHTML += `
            <option value="${cat.id}">
                ${cat.name}
            </option>
        `;
    });

    if (selectedCategory) {
        select.value = selectedCategory;
    }
}

// ===========================
// تحميل المستخدمين
// ===========================
async function loadUsers(selectedOwner) {

    const response = await fetch(`${API}/users/`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const data = await response.json();
    const select = document.getElementById("owner");

    select.innerHTML = `
        <option value="">اختر المالك</option>
    `;

    data.forEach(user => {
        select.innerHTML += `
            <option value="${user.id}">
                ${user.username}
            </option>
        `;
    });

    if (selectedOwner) {
        select.value = selectedOwner;
    }
}

// ===========================
// تحميل بيانات الوثيقة
// ===========================
async function loadDocument() {

    const response = await fetch(`${API}/documents/${docId}/`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const doc = await response.json();

    document.getElementById("refNumber").value = doc.reference_number;
    document.getElementById("title").value = doc.title;
    document.getElementById("description").value = doc.description || "";
    document.getElementById("securityLevel").value = doc.security_level;
    document.getElementById("archiveDate").value = doc.archive_date || "";

    // تحميل القوائم مع تحديد القيمة الحالية
    await loadCategories(doc.category);
    await loadUsers(doc.owner);
}

loadDocument();

// ===========================
// تعديل الوثيقة
// ===========================
async function updateDocument() {

    const formData = new FormData();

    formData.append("reference_number", document.getElementById("refNumber").value);
    formData.append("title", document.getElementById("title").value);
    formData.append("category", document.getElementById("category").value);
    formData.append("security_level", document.getElementById("securityLevel").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("owner", document.getElementById("owner").value);
    formData.append("archive_date", document.getElementById("archiveDate").value);

    const file = document.getElementById("attachment").files[0];
    if (file) {
        formData.append("attachment", file);
    }

    const response = await fetch(`${API}/documents/${docId}/`, {
        method: "PATCH",
        headers: {
            "Authorization": "Bearer " + token
        },
        body: formData
    });

    if (response.ok) {
        alert("تم تعديل الوثيقة بنجاح");
        window.location.href = "documents.html";
    } else {
        const error = await response.json();
        console.log(error);
        alert("حدث خطأ أثناء التعديل");
    }
}
