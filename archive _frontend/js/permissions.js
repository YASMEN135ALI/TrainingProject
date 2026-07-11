const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../login.html";
}

const table = document.getElementById("permissionsTable");

// تحميل الصلاحيات
async function loadPermissions() {
    const response = await fetch("http://127.0.0.1:8000/permissions/", {
        headers: { "Authorization": "Bearer " + token }
    });

    const data = await response.json();
    table.innerHTML = "";

    data.forEach(p => {
        table.innerHTML += `
            <tr>
                <td>${p.role}</td>
                <td>${p.can_add ? "✔" : "✖"}</td>
                <td>${p.can_edit ? "✔" : "✖"}</td>
                <td>${p.can_delete ? "✔" : "✖"}</td>
                <td>${p.can_archive ? "✔" : "✖"}</td>
                <td>${p.can_restore ? "✔" : "✖"}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="openEditPermission('${p.id}', '${p.role}', ${p.can_add}, ${p.can_edit}, ${p.can_delete}, ${p.can_archive}, ${p.can_restore})">تعديل</button>
                    <button class="btn btn-danger btn-sm" onclick="deletePermission('${p.id}')">حذف</button>
                </td>
            </tr>
        `;
    });
}

loadPermissions();


// فتح نافذة إضافة صلاحيات
function openAddPermission() {
    const modal = new bootstrap.Modal(document.getElementById("addPermissionModal"));
    modal.show();
}


// إضافة صلاحيات
async function addPermission() {
    const role = document.getElementById("addRole").value;

    const body = {
        role,
        can_add: document.getElementById("addCanAdd").checked,
        can_edit: document.getElementById("addCanEdit").checked,
        can_delete: document.getElementById("addCanDelete").checked,
        can_archive: document.getElementById("addCanArchive").checked,
        can_restore: document.getElementById("addCanRestore").checked
    };

    const response = await fetch("http://127.0.0.1:8000/permissions/", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    if (response.ok) {
        alert("تم إضافة الصلاحيات");
        loadPermissions();
    } else {
        alert("خطأ في الإضافة");
    }
}


// فتح نافذة تعديل صلاحيات
function openEditPermission(id, role, add, edit, del, archive, restore) {
    document.getElementById("editPermissionId").value = id;
    document.getElementById("editRole").value = role;

    document.getElementById("editCanAdd").checked = add;
    document.getElementById("editCanEdit").checked = edit;
    document.getElementById("editCanDelete").checked = del;
    document.getElementById("editCanArchive").checked = archive;
    document.getElementById("editCanRestore").checked = restore;

    const modal = new bootstrap.Modal(document.getElementById("editPermissionModal"));
    modal.show();
}


// تعديل صلاحيات
async function updatePermission() {
    const id = document.getElementById("editPermissionId").value;

    const body = {
        can_add: document.getElementById("editCanAdd").checked,
        can_edit: document.getElementById("editCanEdit").checked,
        can_delete: document.getElementById("editCanDelete").checked,
        can_archive: document.getElementById("editCanArchive").checked,
        can_restore: document.getElementById("editCanRestore").checked
    };

    const response = await fetch(`http://127.0.0.1:8000/permissions/${id}/`, {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    if (response.ok) {
        alert("تم تعديل الصلاحيات");
        loadPermissions();
    } else {
        alert("خطأ في التعديل");
    }
}


// حذف صلاحيات
async function deletePermission(id) {
    if (!confirm("هل أنت متأكد من حذف الصلاحيات؟")) return;

    const response = await fetch(`http://127.0.0.1:8000/permissions/${id}/`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    });

    if (response.ok) {
        alert("تم حذف الصلاحيات");
        loadPermissions();
    } else {
        alert("خطأ في الحذف");
    }
}
