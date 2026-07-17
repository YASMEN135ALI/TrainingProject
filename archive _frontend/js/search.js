const API = "http://127.0.0.1:8000/api";
const token = localStorage.getItem("token");

// حماية الصفحة
if (!token) {
    window.location.href = "../login.html";
}

document.addEventListener("DOMContentLoaded", function () {

    const resultsTable = document.getElementById("resultsTable");
    const searchCategory = document.getElementById("searchCategory");
    const searchUser = document.getElementById("searchUser");

    // ===============================
    // تحميل التصنيفات
    // ===============================
    async function loadCategories() {
        try {
            const response = await fetch(`${API}/categories/`, {
                headers: { "Authorization": "Bearer " + token }
            });

            const data = await response.json();

            searchCategory.innerHTML = `
                <option value="">الكل</option>
            `;

            data.forEach(category => {
                searchCategory.innerHTML += `
                    <option value="${category.id}">
                        ${category.name}
                    </option>
                `;
            });

        } catch (error) {
            console.error("Error loading categories:", error);
        }
    }

    // ===============================
    // تحميل المستخدمين
    // ===============================
    async function loadUsers() {
        try {
            const response = await fetch(`${API}/users/`, {
                headers: { "Authorization": "Bearer " + token }
            });

            const data = await response.json();

            searchUser.innerHTML = `
                <option value="">الكل</option>
            `;

            data.forEach(user => {
                searchUser.innerHTML += `
                    <option value="${user.id}">
                        ${user.username}
                    </option>
                `;
            });

        } catch (error) {
            console.error("Error loading users:", error);
        }
    }

    // ===============================
    // البحث
    // ===============================
    window.searchDocuments = async function () {

        const ref = document.getElementById("searchRef").value.trim();
        const title = document.getElementById("searchTitle").value.trim();
        const category = document.getElementById("searchCategory").value;
        const status = document.getElementById("searchStatus").value;
        const user = document.getElementById("searchUser").value;
        const date = document.getElementById("searchDate").value;

        const params = new URLSearchParams();

        if (ref) params.append("reference_number", ref);
        if (title) params.append("title", title);
        if (category) params.append("category", category);
        if (status) params.append("status", status);
        if (user) params.append("owner", user);
        if (date) params.append("created_at", date);

        try {
            const response = await fetch(`${API}/documents/?${params.toString()}`, {
                headers: { "Authorization": "Bearer " + token }
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Search Error:", data);
                alert("حدث خطأ أثناء البحث");
                return;
            }

            resultsTable.innerHTML = "";

            if (data.length === 0) {
                resultsTable.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-muted">
                            لا توجد نتائج
                        </td>
                    </tr>
                `;
                return;
            }

            data.forEach(doc => {
                resultsTable.innerHTML += `
                    <tr>
                        <td>${doc.reference_number || "-"}</td>
                        <td>${doc.title || "-"}</td>
                        <td>${doc.category || "-"}</td>
                        <td>${doc.status || "-"}</td>
                        <td>${doc.owner || "-"}</td>

                        <td>
                            <a href="document_details.html?id=${doc.id}"
                               class="btn btn-info btn-sm">
                                عرض
                            </a>

                            <a href="edit_document.html?id=${doc.id}"
                               class="btn btn-warning btn-sm">
                                تعديل
                            </a>
                        </td>
                    </tr>
                `;
            });

        } catch (error) {
            console.error("Search Error:", error);
            alert("حدث خطأ أثناء البحث");
        }
    };

    // ===============================
    // إعادة التعيين
    // ===============================
    window.resetFilters = function () {

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
    };

    // تحميل البيانات
    loadCategories();
    loadUsers();

});
