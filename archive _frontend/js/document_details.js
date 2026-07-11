const API = "http://127.0.0.1:8000/api";
const token = localStorage.getItem("token");

// التحقق من تسجيل الدخول
if (!token) {
    window.location.href = "../login.html";
}

// الحصول على ID من الرابط
const params = new URLSearchParams(window.location.search);
const docId = params.get("id");

// ===============================
// تحميل بيانات الوثيقة
// ===============================
async function loadDocumentDetails() {

    try {
        const response = await fetch(`${API}/documents/${docId}/`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) {
            alert("فشل تحميل بيانات الوثيقة");
            return;
        }

        const doc = await response.json();

        // تعبئة البيانات في الصفحة
        document.getElementById("refNumber").textContent = doc.reference_number || "-";
        document.getElementById("title").textContent = doc.title || "-";
        document.getElementById("category").textContent = doc.category || "-";
        document.getElementById("securityLevel").textContent = doc.security_level || "-";
        document.getElementById("description").textContent = doc.description || "-";
        document.getElementById("owner").textContent = doc.owner || "-";
        document.getElementById("createdAt").textContent = doc.created_at || "-";
        document.getElementById("archiveDate").textContent = doc.archive_date || "-";
        document.getElementById("status").textContent = doc.status || "-";

        // الملف المرفق
        const attachment = document.getElementById("attachmentLink");
        if (doc.attachment) {

            document.getElementById("attachmentLink").href =
                "http://127.0.0.1:8000" + doc.attachment;


        } else {
            attachment.textContent = "لا يوجد ملف";
            attachment.removeAttribute("href");
            attachment.classList.remove("btn-info");
            attachment.classList.add("btn-secondary");
        }

        // روابط الصفحات المرتبطة
        document.getElementById("filesLink").href = `document_files.html?id=${docId}`;
        document.getElementById("statusLink").href = `document_status.html?id=${docId}`;

    } catch (error) {
        console.error(error);
        alert("حدث خطأ أثناء تحميل الوثيقة");
    }
}

loadDocumentDetails();
