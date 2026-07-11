const API = "http://127.0.0.1:8000/api";
const token = localStorage.getItem("token");

// التحقق من وجود التوكن
if (!token) {
    window.location.href = "login.html";
}

// الحصول على ID الوثيقة من الرابط
const params = new URLSearchParams(window.location.search);
const docId = params.get("id");

// زر الرجوع
document.getElementById("backBtn").href = `document_details.html?id=${docId}`;

const table = document.getElementById("filesTable");


// =======================
// تحميل الملفات
// =======================
async function loadFiles() {
    try {
        const response = await fetch(`${API}/files/?document=${docId}`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) {
            alert("خطأ في تحميل الملفات");
            return;
        }

        const files = await response.json();
        table.innerHTML = "";

        if (files.length === 0) {
            table.innerHTML = `
                <tr>
                    <td colspan="6" class="text-muted">لا توجد ملفات مرفقة</td>
                </tr>
            `;
            return;
        }

        files.forEach((file, index) => {
            const fileName = file.file_path.split("/").pop();

            table.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${fileName}</td>
                    <td>${file.uploaded_at ? file.uploaded_at.substring(0, 10) : "-"}</td>
                    <td>${file.uploaded_by_name || "-"}</td>

                    <td>
                        <a href="http://127.0.0.1:8000${file.file_path}"
                           target="_blank"
                           class="btn btn-info btn-sm">
                            تحميل
                        </a>
                    </td>

                    <td>
                        <button class="btn btn-danger btn-sm"
                                onclick="deleteFile(${file.id})">
                            حذف
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.log("Error loading files:", error);
        alert("حدث خطأ أثناء تحميل الملفات");
    }
}

loadFiles();


// =======================
// رفع ملف
// =======================
async function uploadFile() {
    const file = document.getElementById("newFile").files[0];

    if (!file) {
        alert("اختر ملفاً أولاً");
        return;
    }

    const formData = new FormData();
    formData.append("document", docId);
    formData.append("file_path", file);

    try {
        const response = await fetch(`${API}/files/`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        });

        if (response.ok) {
            alert("تم رفع الملف بنجاح");
            document.getElementById("newFile").value = "";
            loadFiles();
        } else {
            const error = await response.json();
            console.log(error);
            alert("فشل رفع الملف");
        }

    } catch (error) {
        console.log("Upload Error:", error);
        alert("حدث خطأ أثناء رفع الملف");
    }
}


// =======================
// حذف ملف
// =======================
async function deleteFile(id) {
    if (!confirm("هل تريد حذف الملف؟")) return;

    try {
        const response = await fetch(`${API}/files/${id}/`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (response.ok) {
            alert("تم حذف الملف");
            loadFiles();
        } else {
            alert("تعذر حذف الملف");
        }

    } catch (error) {
        console.log("Delete Error:", error);
        alert("حدث خطأ أثناء حذف الملف");
    }
}
