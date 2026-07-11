const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../login.html";
}

const resultsTable = document.getElementById("resultsTable");


// =============================
// تحميل التصنيفات
// =============================
async function loadCategories() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/categories/", {
            headers: { "Authorization": "Bearer " + token }
        });

        const data = await response.json();
        const select = document.getElementById("searchCategory");

        data.forEach(cat => {
            select.innerHTML += `
                <option value="${cat.name}">${cat.name}</option>
            `;
        });

    } catch (error) {
        console.log("Error loading categories:", error);
    }
}

loadCategories();


// =============================
// تحميل المستخدمين
// =============================
async function loadUsers() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/users/", {
            headers: { "Authorization": "Bearer " + token }
        });

        const data = await response.json();
        const select = document.getElementById("searchUser");

        data.forEach(user => {
            select.innerHTML += `
                <option value="${user.username}">${user.username}</option>
            `;
        });

    } catch (error) {
        console.log("Error loading users:", error);
    }
}

loadUsers();


// =============================
// البحث عن الوثائق
// =============================
async function searchDocuments() {

    let url = "http://127.0.0.1:8000/api/documents/?";

    const ref = document.getElementById("searchRef").value;
   const title = document.getElementById("searchTitle").value.trim();
    const category = document.getElementById("searchCategory").value;
    const status = document.getElementById("searchStatus").value;
    const user = document.getElementById("searchUser").value;
    const date = document.getElementById("searchDate").value;

    if (ref) url += `reference_number=${ref}&`;
    
    if (title) url += `title=${title}&`;
    if (category) url += `category=${category}&`;
    if (status) url += `status=${status}&`;
    if (user) url += `owner=${user}&`;
    if (date) url += `created_at=${date}&`;

    try {
        const response = await fetch(url, {
            headers: { "Authorization": "Bearer " + token }
        });

        const data = await response.json();
        resultsTable.innerHTML = "";

        if (data.length === 0) {
            resultsTable.innerHTML = `
                <tr>
                    <td colspan="6" class="text-muted">لا توجد نتائج</td>
                </tr>
            `;
            return;
        }

        data.forEach(doc => {
            resultsTable.innerHTML += `
                <tr>
                    <td>${doc.reference_number}</td>
                    <td>${doc.title}</td>
                    <td>${doc.category || "-"}</td>
                    <td>${doc.status}</td>
                    <td>${doc.owner || "-"}</td>

                    <td>
                        <a href="document_details.html?id=${doc.id}" class="btn btn-info btn-sm">عرض</a>
                        <a href="edit_document.html?id=${doc.id}" class="btn btn-warning btn-sm">تعديل</a>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.log("Search Error:", error);
        alert("حدث خطأ أثناء البحث");
    }
}


// =============================
// إعادة تعيين الفلاتر
// =============================
function resetFilters() {

    document.getElementById("searchRef").value = "";
    document.getElementById("searchTitle").value = "";
    document.getElementById("searchCategory").value = "";
    document.getElementById("searchStatus").value = "";
    document.getElementById("searchUser").value = "";
    document.getElementById("searchDate").value = "";

    resultsTable.innerHTML = `
        <tr>
            <td colspan="6" class="text-muted">
                لا توجد نتائج
            </td>
        </tr>
    `;
}
