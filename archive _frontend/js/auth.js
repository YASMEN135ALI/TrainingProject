document.addEventListener("DOMContentLoaded", function () {

    console.log("Login JS Loaded");

    const form = document.getElementById("loginForm");

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const msg = document.getElementById("loginMessage");

        // مسح الرسالة السابقة
        msg.textContent = "";

        // التحقق من الحقول
        if (!username || !password) {
            msg.textContent = "يرجى إدخال اسم المستخدم وكلمة المرور.";
            return;
        }

        try {

            // إرسال طلب تسجيل الدخول
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

            // نجاح تسجيل الدخول
            if (response.ok) {

                localStorage.setItem("token", result.access);
                localStorage.setItem("role", result.role);

                window.location.href = "dashboard.html";

            } else {

                msg.textContent = result.error || "بيانات الدخول غير صحيحة.";

            }

        } catch (error) {

            console.error(error);
            msg.textContent = "تعذر الاتصال بالخادم.";

        }

    });

});
