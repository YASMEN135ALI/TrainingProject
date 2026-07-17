// =============================
// إعدادات عامة
// =============================

const API = "http://127.0.0.1:8000/api";
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

// =============================
// التحقق من تسجيل الدخول
// =============================

if (!token) {
    window.location.href = "../login.html";
}

// =============================
// عناصر الصفحة
// =============================

const filterUser = document.getElementById("filterUser");
const filterAction = document.getElementById("filterAction");
const filterDocument = document.getElementById("filterDocument");
const table = document.getElementById("activityTable");
const backButton = document.getElementById("backButton");

// =============================
// زر الرجوع حسب الدور
// =============================
    backButton.href = "../pages/dashboard.html";


// =============================
// تحميل سجل النشاطات
// =============================

async function loadActivity() {
    const params = new URLSearchParams();
    const user = filterUser.value.trim();
    const action = filterAction.value.trim();
    const documentNumber = filterDocument.value.trim();

    if (user) {
        params.append("user", user);
    }

    if (action) {
        params.append("action", action);
    }

    if (documentNumber) {
        params.append("document", documentNumber);
    }

    try {
        const response = await fetch(`${API}/activity/?${params.toString()}`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        // انتهاء صلاحية التوكن
        if (response.status === 401) {
            localStorage.clear();
            window.location.href = "../login.html";
            return;
        }

        if (!response.ok) {
            table.innerHTML =
                `<tr>
                    <td colspan="4" class="text-danger">فشل تحميل سجل النشاطات</td>
                </tr>`;
            return;
        }

        const data = await response.json();
        table.innerHTML = "";

        if (data.length === 0) {
            table.innerHTML =
                `<tr>
                    <td colspan="4" class="text-muted">لا توجد نشاطات</td>
                </tr>`;
            return;
        }

        data.forEach(item => {
            table.innerHTML +=
                `<tr>
                    <td>${item.user || "-"}</td>
                    <td>${item.action || "-"}</td>
                    <td>${item.document || "-"}</td>
                    <td>${item.created_at ? new Date(item.created_at).toLocaleString("ar") : "-"}</td>
                </tr>`;
        });

    } catch (error) {
        console.error("Activity Log Error:", error);
        table.innerHTML =
            `<tr>
                <td colspan="4" class="text-danger">حدث خطأ أثناء تحميل السجل</td>
            </tr>`;
    }
}
