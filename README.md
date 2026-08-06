# نظام الأرشفة الإلكترونية

## فكرة المشروع
نظام أرشفة إلكتروني يهدف إلى تحويل الوثائق الورقية إلى ملفات رقمية منظمة وآمنة، مع إمكانية إدارة الوثائق، البحث عنها، التحكم بالصلاحيات، ومتابعة نشاطات المستخدمين.

## التقنيات المستخدمة

### Backend
- Python
- Django
- Django REST Framework
- JWT Authentication

### Frontend
- HTML
- CSS
- Bootstrap
- JavaScript (Fetch API)

### Database
- SQLite

# طريقة تشغيل المشروع

## 1- تحميل المشروع

`bash
git clone https://github.com/YASMEN135ALI/TrainingProject.git

ثم الدخول إلى مجلد المشروع:

cd TrainingProject

تشغيل Backend

الدخول إلى مجلد الـ Backend:

cd backend

إنشاء البيئة الافتراضية:

python -m venv venv

تفعيل البيئة:

Windows:

venv\Scripts\activate

تثبيت المكتبات:

pip install -r requirements.txt

تشغيل قاعدة البيانات:

python manage.py migrate

إنشاء مستخدم مدير:

python manage.py createsuperuser

تشغيل السيرفر:

python manage.py runserver

سيعمل الـ API على:

http://127.0.0.1:8000/
تشغيل Frontend

فتح مجلد:

archive_frontend

ثم تشغيل الصفحات باستخدام Live Server.

صفحة البداية:

pages/login.html

أنواع المستخدمين والصلاحيات

Admin

إدارة المستخدمين.

إدارة الصلاحيات.

إدارة الوثائق.

إدارة الإعدادات.

مشاهدة سجل النشاطات.


Manager

إدارة الوثائق حسب الصلاحيات الممنوحة.

متابعة العمليات الخاصة بالقسم.


Employee

التعامل مع الوثائق المسموح بها فقط.

API Authentication

يستخدم النظام JWT Authentication.

بعد تسجيل الدخول يتم تخزين:

Access Token

User Role


ويتم استخدامه لحماية طلبات API.
مميزات النظام

تسجيل الدخول الآمن.

إدارة المستخدمين.

إدارة الصلاحيات.

أرشفة الوثائق.

البحث المتقدم.

رفع الملفات.

سجل النشاطات.

التحكم بمستويات السرية
