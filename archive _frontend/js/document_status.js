const API = "http://127.0.0.1:8000/api";
const token = localStorage.getItem("token");

// التحقق من التوكن
if (!token) {
    window.location.href = "../login.html";
}

// الحصول على ID الوثيقة من الرابط
const params = new URLSearchParams(window.location.search);
const docId = params.get("id");

// زر الرجوع
document.getElementById("backBtn").href = `document_details.html?id=${docId}`;

const table = document.getElementById("statusTable");


// =============================
// تحميل سجل الحالات
// =============================
async function loadStatus() {
    try {
        const response = await fetch(`${API}/statuses/?document=${docId}`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) {
            alert("فشل تحميل الحالات");
            return;
        }

        const data = await response.json();
        table.innerHTML = "";

        data.forEach(st => {
            table.innerHTML += `
                <tr>
                    <td>${st.status}</td>
                    <td>${st.notes || "-"}</td>
                    <td>${st.updated_by_name || "-"}</td>
                    <td>${new Date(st.updated_at).toLocaleString()}</td>

                    <td>
                        <button class="btn btn-warning btn-sm"
                                onclick="editStatus(${st.id})">
                            تعديل
                        </button>

                        <button class="btn btn-danger btn-sm"
                                onclick="deleteStatus(${st.id})">
                            حذف
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.log("Error loading statuses:", error);
        alert("حدث خطأ أثناء تحميل الحالات");
    }
}

loadStatus();


// =============================
// إضافة حالة
// =============================
async function addStatus() {
    const body = {
        document: docId,
        status: document.getElementById("newStatus").value,
        notes: document.getElementById("newNotes").value
    };

    try {
        const response = await fetch(`${API}/statuses/`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            alert("تمت إضافة الحالة");
            document.getElementById("newNotes").value = "";
            loadStatus();
        } else {
            alert("فشل الإضافة");
        }

    } catch (error) {
        console.log("Add Error:", error);
        alert("حدث خطأ أثناء الإضافة");
    }
}


// =============================
// تعديل الحالة
// =============================
async function editStatus(id) {
    const status = prompt("أدخل الحالة الجديدة\nACTIVE / ARCHIVED / DELETED");
    if (!status) return;

    const notes = prompt("الملاحظات");

    try {
        const response = await fetch(`${API}/statuses/${id}/`, {
            method: "PATCH",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status: status,
                notes: notes
            })
        });

        if (response.ok) {
            alert("تم تعديل الحالة");
            loadStatus();
        } else {
            alert("فشل التعديل");
        }

    } catch (error) {
        console.log("Edit Error:", error);
        alert("حدث خطأ أثناء التعديل");
    }
}


// =============================
// حذف الحالة
// =============================
async function deleteStatus(id) {
    if (!confirm("هل تريد حذف الحالة؟")) return;

    try {
        const response = await fetch(`${API}/statuses/${id}/`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (response.ok) {
            alert("تم حذف الحالة");
            loadStatus();
        } else {
            alert("فشل الحذف");
        }

    } catch (error) {
        console.log("Delete Error:", error);
        alert("حدث خطأ أثناء الحذف");
    }
}
