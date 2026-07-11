document.addEventListener("DOMContentLoaded", function () {
    console.log("Login JS Loaded");

    const form = document.getElementById("loginForm");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const msg = document.getElementById("loginMessage");

        msg.textContent = "";

        if (!username || !password) {
            msg.textContent = "يرجى إدخال اسم المستخدم وكلمة المرور.";
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const result = await response.json();
            console.log(result);

            if (response.ok) {

                // حفظ البيانات
                localStorage.setItem("token", result.access);
                localStorage.setItem("role", result.role);

                // التوجيه حسب الدور
                if (result.role === "admin") {
                    window.location.href = "dashboard.html";

                } else if (result.role === "employee") {
                    window.location.href = "dashboard-employee.html";

                } else {
                    msg.textContent = "دور المستخدم غير معروف.";
                }

            } else {
                msg.textContent = result.error || "بيانات الدخول غير صحيحة.";
            }

        } catch (error) {
            console.error("Error:", error);
            msg.textContent = "تعذر الاتصال بالخادم.";
        }
    });
});