document.addEventListener("DOMContentLoaded", async function () {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // عرض اسم المستخدم
    document.getElementById("username").textContent =
        localStorage.getItem("username") || "Admin";

    // دالة جلب البيانات من API
    async function fetchData(url) {
        try {
            const response = await fetch(
                "http://127.0.0.1:8000" + url,
                {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                console.log("API ERROR", response.status);
                return [];
            }

            return await response.json();

        } catch (error) {
            console.log(error);
            return [];
        }
    }

    // عدد المستخدمين
    const users = await fetchData("/api/users/");
    document.getElementById("countUsers").textContent = users.length;

    // عدد الوثائق
    const documents = await fetchData("/api/documents/");
    document.getElementById("countDocuments").textContent = documents.length;

    // عدد الملفات
    const files = await fetchData("/api/files/");
    document.getElementById("countFiles").textContent = files.length;

    // الوثائق المؤرشفة
    const archived = documents.filter(doc => doc.status === "archived");
    document.getElementById("countArchived").textContent = archived.length;

    // النشاطات
    const activities = await fetchData("/api/activity/");
    const table = document.getElementById("activityTable");

    table.innerHTML = "";

    activities.slice(0, 5).forEach(item => {
        table.innerHTML += `
            <tr>
                <td>${item.user || "-"}</td>
                <td>${item.action}</td>
                <td>${item.document || "-"}</td>
                <td>${item.created_at}</td>
            </tr>
        `;
    });

});

// تسجيل الخروج
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    window.location.href = "login.html";
}
