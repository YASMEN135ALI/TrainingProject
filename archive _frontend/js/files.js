// =====================================================
// الرجوع لواجهة إدارة الوثائق
// =====================================================
function goBack() {
    window.location.href = "manage_documents.html";
}


// =====================================================
// جلب الملفات الخاصة بوثيقة معينة
// =====================================================
async function loadFiles() {
    const documentId = document.getElementById("documentId").value;

    if (!documentId) {
        alert("يرجى إدخال رقم الوثيقة أولاً");
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/files/document/${documentId}/`);
        const data = await response.json();

        const container = document.getElementById("filesContainer");
        container.innerHTML = "";

        if (data.length === 0) {
            container.innerHTML = `<p class="text-muted">لا توجد ملفات لهذه الوثيقة.</p>`;
            return;
        }

        data.forEach(file => {
            container.innerHTML += `
                <div class="col-md-4 mb-3">
                    <div class="card shadow-sm">
                        <div class="card-body">

                            <p><strong>رقم الملف:</strong> ${file.file_id}</p>
                            <p><strong>الرافع:</strong> ${file.uploaded_by}</p>

                            <a href="${file.file_path}" target="_blank" class="btn btn-primary btn-sm mb-2">
                                تحميل الملف
                            </a>

                            <button class="btn btn-danger btn-sm" onclick="deleteFile(${file.file_id})">
                                حذف الملف
                            </button>

                        </div>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.log("Error loading files:", error);
    }
}


// =====================================================
// رفع ملف جديد للوثيقة
// =====================================================
async function uploadFile() {
    const documentId = document.getElementById("documentId").value;

    if (!documentId) {
        alert("يرجى إدخال رقم الوثيقة أولاً");
        return;
    }

    const fileInput = document.getElementById("newFile");
    if (fileInput.files.length === 0) {
        alert("يرجى اختيار ملف للرفع");
        return;
    }

    const formData = new FormData();
    formData.append("document_id", documentId);
    formData.append("file_path", fileInput.files[0]);
    formData.append("uploaded_by", 1); // رقم المستخدم (يمكن تعديله لاحقاً)

    try {
        const response = await fetch("http://127.0.0.1:8000/api/files/add/", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        alert("تم رفع الملف بنجاح");

        // إعادة تحميل الملفات
        loadFiles();

    } catch (error) {
        console.log("Error uploading file:", error);
    }
}


// =====================================================
// حذف ملف
// =====================================================
async function deleteFile(fileId) {
    if (!confirm("هل أنتِ متأكدة من حذف هذا الملف؟")) return;

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/files/delete/${fileId}/`, {
            method: "DELETE"
        });

        const data = await response.json();

        alert(data.message);

        // إعادة تحميل الملفات بعد الحذف
        loadFiles();

    } catch (error) {
        console.log("Error deleting file:", error);
    }
}
