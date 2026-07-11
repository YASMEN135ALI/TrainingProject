const API = "http://127.0.0.1:8000/api";
const token = localStorage.getItem("token");

// التحقق من وجود التوكن
if (!token) {
    window.location.href = "../login.html";
}

const table = document.getElementById("categoriesTable");

// =======================
// تحميل التصنيفات
// =======================
async function loadCategories() {

    const response = await fetch(`${API}/categories/`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (!response.ok) {
        alert("خطأ في تحميل التصنيفات");
        return;
    }

    const data = await response.json();
    table.innerHTML = "";

    data.forEach(cat => {
        table.innerHTML += `
            <tr>
                <td>${cat.id}</td>
                <td>${cat.name}</td>
                <td>
                    <button class="btn btn-warning btn-sm"
                        onclick="openEditCategory(${cat.id}, '${cat.name}')">
                        تعديل
                    </button>

                    <button class="btn btn-danger btn-sm"
                        onclick="deleteCategory(${cat.id})">
                        حذف
                    </button>
                </td>
            </tr>
        `;
    });
}

loadCategories();

// =======================
// فتح إضافة
// =======================
function openAddCategory() {
    let modal = new bootstrap.Modal(
        document.getElementById("addCategoryModal")
    );
    modal.show();
}

// =======================
// إضافة تصنيف
// =======================
async function addCategory() {

    const name = document.getElementById("addCategoryName").value;

    const response = await fetch(`${API}/categories/`, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: name })
    });

    if (response.ok) {
        alert("تم إضافة التصنيف");
        loadCategories();
    } else {
        const error = await response.json();
        alert(JSON.stringify(error));
    }
}

// =======================
// فتح تعديل
// =======================
function openEditCategory(id, name) {

    document.getElementById("editCategoryId").value = id;
    document.getElementById("editCategoryName").value = name;

    let modal = new bootstrap.Modal(
        document.getElementById("editCategoryModal")
    );
    modal.show();
}

// =======================
// تعديل تصنيف
// =======================
async function updateCategory() {

    const id = document.getElementById("editCategoryId").value;
    const name = document.getElementById("editCategoryName").value;

    const response = await fetch(`${API}/categories/${id}/`, {
        method: "PATCH",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: name })
    });

    if (response.ok) {
        alert("تم تعديل التصنيف");
        loadCategories();
    } else {
        alert("خطأ في التعديل");
    }
}

// =======================
// حذف تصنيف
// =======================
async function deleteCategory(id) {

    if (!confirm("هل أنت متأكد من الحذف؟")) {
        return;
    }

    const response = await fetch(`${API}/categories/${id}/`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (response.ok) {
        alert("تم حذف التصنيف");
        loadCategories();
    } else {
        alert("خطأ في الحذف");
    }
}
// =======================
// حذف تصنيف
// =======================
async function deleteCategory(id) {

    if (!confirm("هل أنت متأكد من الحذف؟")) {
        return;
    }

    const response = await fetch(`${API}/categories/${id}/`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (response.ok) {
        alert("تم حذف التصنيف");
        loadCategories();
    } else {
        alert("خطأ في الحذف");
    }
}
