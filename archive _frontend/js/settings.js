const API = "http://127.0.0.1:8000/api";
const token = localStorage.getItem("token");

// التحقق من وجود التوكن
if (!token) {
    window.location.href = "../login.html";
}

// ===========================
// تحميل الإعدادات
// ===========================
async function loadSettings() {
    try {
        const response = await fetch(`${API}/settings/1/`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) {
            alert("تعذر تحميل الإعدادات");
            return;
        }

        const data = await response.json();

        document.getElementById("docTypes").value =
            JSON.stringify(data.document_types || {}, null, 4);

        document.getElementById("securityLevels").value =
            JSON.stringify(data.security_levels || {}, null, 4);

        document.getElementById("archiveRules").value =
            JSON.stringify(data.archive_rules || {}, null, 4);

    } catch (error) {
        console.error(error);
        alert("حدث خطأ أثناء تحميل الإعدادات");
    }
}

// تحميل الإعدادات عند فتح الصفحة
loadSettings();


// ===========================
// حفظ الإعدادات
// ===========================
async function saveSettings() {

    let documentTypes;
    let securityLevels;
    let archiveRules;

    // التحقق من صحة JSON
    try {
        documentTypes = JSON.parse(document.getElementById("docTypes").value);
        securityLevels = JSON.parse(document.getElementById("securityLevels").value);
        archiveRules = JSON.parse(document.getElementById("archiveRules").value);

    } catch (error) {
        alert("صيغة JSON غير صحيحة");
        return;
    }

    const body = {
        document_types: documentTypes,
        security_levels: securityLevels,
        archive_rules: archiveRules
    };

    try {
        const response = await fetch(`${API}/settings/1/`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            alert("تم حفظ الإعدادات بنجاح");
            loadSettings();
        } else {
            const error = await response.json();
            console.log(error);
            alert("فشل حفظ الإعدادات");
        }

    } catch (error) {
        console.error(error);
        alert("حدث خطأ أثناء الحفظ");
    }
}
