const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../login.html";
}

// تحميل الإعدادات
async function loadSettings() {
    const response = await fetch("http://127.0.0.1:8000/api/settings/1/", {
        headers: { "Authorization": "Bearer " + token }
    });

    const data = await response.json();

    document.getElementById("docTypes").value = data.document_types || "";
    document.getElementById("securityLevels").value = data.security_levels || "";
    document.getElementById("archiveRules").value = data.archive_rules || "";
}

loadSettings();


// حفظ الإعدادات
async function saveSettings() {
    const body = {
        document_types: document.getElementById("docTypes").value,
        security_levels: document.getElementById("securityLevels").value,
        archive_rules: document.getElementById("archiveRules").value
    };

    const response = await fetch("http://127.0.0.1:8000/api/settings/1/", {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    if (response.ok) {
        alert("تم حفظ الإعدادات بنجاح");
    } else {
        alert("خطأ في حفظ الإعدادات");
    }
}
