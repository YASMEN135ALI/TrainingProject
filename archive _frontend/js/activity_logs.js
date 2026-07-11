const API = "http://127.0.0.1:8000/api";
const token = localStorage.getItem("token");

// التحقق من التوكن
if (!token) {
    window.location.href = "../login.html";
}

// عناصر الفلاتر
const filterUser = document.getElementById("filterUser");
const filterAction = document.getElementById("filterAction");
const filterDocument = document.getElementById("filterDocument");

const table = document.getElementById("activityTable");


// =============================
// تحميل سجل النشاطات
// =============================
async function loadActivity() {

    const params = new URLSearchParams();

    if (filterUser.value.trim() !== "") {
        params.append("user", filterUser.value.trim());
    }

    if (filterAction.value.trim() !== "") {
        params.append("action", filterAction.value.trim());
    }

    if (filterDocument.value.trim() !== "") {
        params.append("document", filterDocument.value.trim());
    }

    try {
        const response = await fetch(`${API}/activity/?${params.toString()}`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) {
            alert("فشل تحميل النشاطات");
            return;
        }

        const data = await response.json();
        table.innerHTML = "";

        if (data.length === 0) {
            table.innerHTML = `
                <tr>
                    <td colspan="4" class="text-muted">لا توجد نتائج</td>
                </tr>
            `;
            return;
        }

        data.forEach(item => {
            table.innerHTML += `
                <tr>
                    <td>${item.user_name || "-"}</td>
                    <td>${item.action || "-"}</td>
                    <td>${item.document_title || "-"}</td>
                    <td>${new Date(item.timestamp).toLocaleString()}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.log("Error loading activity:", error);
        alert("حدث خطأ أثناء تحميل النشاطات");
    }
}

// تحميل أولي
loadActivity();
