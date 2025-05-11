# 📋 Complaint Management System (CMS)

A full-stack web application for managing user complaints with token-based authentication, role-based access control, and a dynamic frontend built using JavaScript, Bootstrap, and AJAX. Designed for two user types — **normal users** and **company users** — each with different privileges and access rights.

---

## 🚀 Features

- 👤 **User Registration and Login**
- 🔐 **Token-Based Authentication (DRF Token Auth)**
- 🧑‍💼 Role-based Access: `Normal User` and `Company User`
- 📝 Create, Edit, View, and Close Complaints
- 📂 File Upload Support (images, PDFs, docs)
- 📊 Company Dashboard with Analytics and Graphs (Chart.js)
- 📧 Email Notifications (Welcome and Complaint Resolved)
- 🔍 Filtering, Searching, Sorting by complaint fields
- 📱 Fully responsive UI with Bootstrap 5

---

## 🛠️ Tech Stack

| Layer        | Technology Used                              |
|--------------|-----------------------------------------------|
| Backend      | Django, Django REST Framework (DRF)           |
| Frontend     | HTML5, CSS3, JavaScript, Bootstrap 5, jQuery  |
| Auth         | DRF Token Authentication                      |
| Communication| AJAX / Fetch API                              |
| Emailing     | Django's Email Backend (Gmail SMTP)           |
| Storage      | Local File System (`FileField` uploads)       |
| Database     | SQLite3 (default) – switchable to PostgreSQL  |

---

## 🧑‍💻 Project Structure

```
django_api_project/
├── complaint_ms/            # Main Django project
├── complaint_app/           # App for complaints & views
├── user_app/                # App for user registration/login
├── templates/
├── static/
└── manage.py
```

---

## ✅ Setup Instructions

> 📝 Make sure Python and pip are installed.

### 1. Clone the Repository

```bash
git clone [[https://github.com/yourusername/complaint-management-system.git](https://github.com/Ojas2081/complaint_system.git)]
cd complaint_ms
```

### 2. Create Virtual Environment

```bash
python -m venv myenv
source myenv/bin/activate    # On Windows: myenv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Email (for Gmail)

In `settings.py`, add:

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'youremail@gmail.com'
EMAIL_HOST_PASSWORD = 'your_app_password'  # Use Gmail App Password
```

### 5. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Superuser (for Admin Access)

```bash
python manage.py createsuperuser
```

### 7. Run Server

```bash
python manage.py runserver
```

Visit `http://127.0.0.1:8000/` to use the application.

---

## ✨ Functionality Overview

| Role          | Capabilities                                                                 |
|---------------|-------------------------------------------------------------------------------|
| Normal User   | Register/Login, File Complaint, View/Edit Own Complaints                     |
| Company User  | View All Complaints, Assign Users, Update Status/Resolution, View Dashboard  |

---

## 🔒 Authentication Flow

- Users login and receive a **DRF Token**
- Token is stored in `localStorage`
- Requests use `Authorization: Token <token>` header
- Pages redirect to `/login` if token is missing or expired

---

## 🔄 Frontend ↔ Backend Communication

- **AJAX/Fetch API** for complaint creation and updates
- `FormData` used for file uploads
- CSRF token handled via JavaScript

---

## 📧 Email Notifications

- ✔ Welcome Email after registration
- ✔ Resolution Email after ticket closure

---

## 📊 Company Dashboard

- Charts and graphs (Chart.js)
- Complaint stats by status/category/assignee
- Table with search and sort

---

## 🤝 Contributions

This is a student-built project. Contributions are welcome via pull requests or feedback!

---
