const API = "http://127.0.0.1:8000/api";
const token = localStorage.getItem("token");

// ===============================
// التحقق من تسجيل الدخول
// ===============================
if (!token) {
    window.location.href = "../login.html";
}

// عناصر الصفحة
const table = document.getElementById("documentsTable");
const filterCategory = document.getElementById("filterCategory");
const filterStatus = document.getElementById("filterStatus");

// ===============================
// تحميل التصنيفات
// ===============================
async function loadCategories() {

    const response = await fetch(`${API}/categories/`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const categories = await response.json();

    categories.forEach(cat => {
        filterCategory.innerHTML += `
            <option value="${cat.id}">
                ${cat.name}
            </option>
        `;
    });
}

loadCategories();

// ===============================
// تحميل الوثائق
// ===============================
async function loadDocuments() {

    let url = `${API}/documents/?`;

    if (filterCategory.value) {
        url += `category=${filterCategory.value}&`;
    }

    if (filterStatus.value) {
        url += `status=${filterStatus.value}&`;
    }

    const response = await fetch(url, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const documents = await response.json();

    table.innerHTML = "";

    documents.forEach(doc => {
        table.innerHTML += `
            <tr>
                <td>${doc.reference_number}</td>
                <td>${doc.title}</td>
                <td>${doc.category_name || "-"}</td>
                <td>${doc.status || "-"}</td>
                <td>${doc.owner_name || "-"}</td>

                <td>
                    <a href="document_details.html?id=${doc.id}"
                       class="btn btn-info btn-sm">
                        عرض
                    </a>

                    <a href="edit_document.html?id=${doc.id}"
                       class="btn btn-warning btn-sm">
                        تعديل
                    </a>

                    <button class="btn btn-danger btn-sm"
                            onclick="deleteDocument(${doc.id})">
                        حذف
                    </button>

                    <button class="btn btn-secondary btn-sm"
                            onclick="archiveDocument(${doc.id})">
                        أرشفة
                    </button>
                </td>
            </tr>
        `;
    });
}

loadDocuments();

// ===============================
// حذف وثيقة
// ===============================
async function deleteDocument(id) {

    if (!confirm("هل تريد حذف الوثيقة؟")) return;

    const response = await fetch(`${API}/documents/${id}/`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (response.ok) {
        alert("تم حذف الوثيقة");
        loadDocuments();
    } else {
        alert("فشل الحذف");
    }
}

// ===============================
// أرشفة وثيقة
// ===============================
async function archiveDocument(id) {

    const response = await fetch(`${API}/documents/${id}/`, {
        method: "PATCH",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: "ARCHIVED"
        })
    });

    if (response.ok) {
        alert("تمت الأرشفة");
        loadDocuments();
    } else {
        alert("فشل الأرشفة");
    }
}
