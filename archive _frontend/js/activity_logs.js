const API = "http://127.0.0.1:8000/api";

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

// ===========================
// التحقق من تسجيل الدخول
// ===========================
if (!token) {
    window.location.href = "../login.html";
}

// السماح فقط للمدير ومدير النظام
if (!["admin", "manager"].includes(role)) {
    alert("ليس لديك صلاحية للوصول إلى هذه الصفحة.");
    window.location.href = "dashboard.html";
}

// عناصر الصفحة
const filterUser = document.getElementById("filterUser");
const filterAction = document.getElementById("filterAction");
const filterDocument = document.getElementById("filterDocument");
const table = document.getElementById("activityTable");

// ===========================
// تحميل سجل النشاطات
// ===========================
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
            throw new Error("فشل تحميل النشاطات");
        }

        const data = await response.json();

        table.innerHTML = "";

        if (data.length === 0) {
            table.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">
                        لا توجد نشاطات
                    </td>
                </tr>
            `;
            return;
        }

        data.forEach(item => {
            table.innerHTML += `
                <tr>
                    <td>${item.user || "-"}</td>
                    <td>${item.action || "-"}</td>
                    <td>${item.document || "-"}</td>
                    <td>${item.created_at || "-"}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error(error);
        alert("حدث خطأ أثناء تحميل النشاطات.");
    }
}

// تحميل أولي
loadActivity();
