---
author: Eko Supriyono
pubDatetime: 2025-1-10T15:22:00Z
modDatetime: 2024-12-21T09:12:47.400Z
title: Django - Isolasi dan Keamanan dalam Pengembangan Berbasis Django Menggunakan Docker
slug: django-isolasi-dan-keamanan-mengembangkan-django-dengan-docker
featured: true
draft: false
tags:
  - django
  - webdev
  - docker
description: Pengembangan aplikasi berbasis Django dengan menggunakan Docker
---

## A. Memasang Docker

Berikut adalah langkah-langkah instalasi Docker terbaru untuk Ubuntu 24.04 LTS:

1. **Terhubung ke VPS**:
   ▪ Pertama, terhubung ke VPS Ubuntu 24.04 Anda menggunakan SSH, PAM, atau metode lain yang memungkinkan interaksi ke VPS.

2. **Perbarui Daftar Paket**:
   ▪ Mulailah dengan memperbarui daftar paket di VPS Anda:

```bash
sudo apt-get update
```

3. **Instal Dependensi yang Diperlukan**:
   ▪ Instal dependensi yang diperlukan untuk instalasi Docker:

```bash
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```

4. **Tambahkan Kunci GPG Docker**:
   ▪ Tambahkan kunci GPG resmi Docker ke sistem Anda:

```bash

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

5. **Atur Repositori Docker**:
   ▪ Atur repositori Docker stabil:

```bash
echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
$(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

6. **Instal Docker Engine Terbaru**:
   ▪ Instal versi terbaru dari Docker Engine:

```bash
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

7. **Verifikasi Instalasi Docker**:
   ▪ Pastikan Docker terinstal dengan benar dengan menjalankan perintah berikut:

```bash
sudo docker run hello-world
```

▪ Ini akan menampilkan pesan "Hello from Docker!", yang mengkonfirmasi bahwa Docker terinstal dan berjalan dengan benar.

8. **Verifikasi Instalasi Docker Compose**:
   ▪ Konfirmasi bahwa Docker Compose terinstal dengan benar dengan menjalankan:

```bash
docker compose version
```

▪ Ini akan menampilkan versi Docker Compose yang terinstal.

## B. Konfigurasi untuk menjalankan perintah docker pada user non root

1. **Buat Grup Docker**:
   ▪ Buka terminal atau command prompt.
   ▪ Jalankan perintah berikut untuk membuat grup baru bernama "docker" (jika belum ada):

```bash
sudo groupadd docker
```

2. **Tambahkan Pengguna Non-Root ke Grup Docker**:
   ▪ Jalankan perintah berikut untuk menambahkan pengguna non-root Anda ke grup "docker":

```bash
sudo usermod -aG docker <nama_pengguna_anda>
```

Ganti <nama_pengguna_anda> dengan nama pengguna non-root yang ingin Anda gunakan.

3. **Aktifkan Perubahan**:
   ▪ Untuk mengaktifkan perubahan, Anda perlu keluar dan masuk kembali, atau jalankan perintah berikut:

```bash
newgrp docker
```

4. **Verifikasi Pengguna Non-Root Dapat Menjalankan Perintah Docker**:
   ▪ Sekarang, coba jalankan perintah Docker sebagai pengguna non-root:

```bash
docker run hello-world
```

▪ Perintah ini akan menjalankan kontainer Docker "Hello World" tanpa ada kesalahan izin.

Ringkasan langkah-langkahnya:

1. Buat grup Docker: sudo groupadd docker
2. Tambahkan pengguna non-root ke grup Docker: sudo usermod -aG docker <nama_pengguna_anda>
3. Aktifkan perubahan: newgrp docker
4. Verifikasi pengguna non-root dapat menjalankan perintah Docker: docker run hello-world

Setelah menyelesaikan langkah-langkah ini, pengguna non-root yang Anda tentukan akan dapat menjalankan perintah Docker tanpa menggunakan awalan sudo.

Ingatlah bahwa menambahkan pengguna ke grup "docker" memberikan mereka hak istimewa yang lebih tinggi, jadi pastikan hanya menambahkan pengguna yang dapat dipercaya ke grup ini.

## C. Menggunakan file compose untuk menjalankan sebuah project

Selanjutnya kita membahas secara rinci bagaimana menggunakan Docker Compose untuk mengelola sebuah proyek, mulai dari menjalankan image, menyiapkan database, hingga mengatur TLS menggunakan Traefik. Bayangkan Anda ingin membuat sebuah rumah. Untuk membuat rumah itu, Anda membutuhkan beberapa bahan, seperti balok-balok kayu, atap, pintu, dan jendela, dsb.

Nah, file `compose.yaml` itu seperti daftar bahan-bahan yang kamu butuhkan untuk membuat rumah itu. Di dalam file `compose.yaml`, Anda akan menuliskan semua komponen yang diperlukan untuk membuat proyek, seperti aplikasi web, database, dan layanan lainnya.

Dengan memiliki file `compose.yaml` ini, Anda dapat dengan mudah membuat dan menjalankan seluruh proyek kamu hanya dengan satu perintah. Jadi, kamu tidak perlu lagi mengingat-ingat satu per satu apa saja yang harus Anda siapkan. Berikut adalah sebuah contoh compose file yang dapat digunakan untuk menjalankan sebuah aplikasi dengan database postgreSQL.

```docker
version: '3'
services:
  web:
    image: your-web-app:latest
    ports:
      - 80:8080
    environment:
      - DB_HOST=database
      - DB_NAME=myapp
    depends_on:
      - database
  database:
    image: postgres:12
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_PASSWORD=mysecretpassword
    volumes:
      - db-data:/var/lib/postgresql/data
volumes:
  db-data:
```

Perintah Docker Compose tersebut mendefinisikan dua layanan: web dan database. Mari kita jelaskan masing-masing bagian dari file tersebut:

I. **Versi Docker Compose**
`version: '3'`
• Menentukan versi dari Docker Compose yang digunakan. Versi 3 adalah salah satu versi yang umum digunakan dan mendukung berbagai fitur untuk pengelolaan layanan.

II. **Layanan (Services)**
File ini mendefinisikan dua layanan:

1. **Web Service**

```docker
web:
  image: your-web-app:latest
  ports:
    - 80:8080
  environment:
    - DB_HOST=database
    - DB_NAME=myapp
  depends_on:
    - database
```

▪ image: Menentukan image Docker yang akan digunakan untuk layanan ini. Dalam hal ini, your-web-app:latest adalah nama dan tag dari image yang akan dijalankan.
▪ ports: Mengatur pemetaan port. Di sini, port 80 di host akan dipetakan ke port 8080 di container. Artinya, jika Anda mengakses port 80 di mesin host, itu akan diarahkan ke port 8080 di container.
▪ environment: Mendefinisikan variabel lingkungan yang akan digunakan di dalam container. Dalam contoh ini, DB_HOST diatur ke database, dan DB_NAME diatur ke myapp. Ini biasanya digunakan untuk mengkonfigurasi aplikasi agar dapat terhubung ke database.
▪ depends_on: Menentukan bahwa layanan web tergantung pada layanan database. Docker Compose akan memastikan bahwa layanan database dimulai sebelum layanan web.

2. **Database Service**

```docker
database:
  image: postgres:12
  environment:
    - POSTGRES_DB=myapp
    - POSTGRES_PASSWORD=mysecretpassword
  volumes:
    - db-data:/var/lib/postgresql/data
```

▪ image: Menentukan image Docker yang akan digunakan untuk layanan ini, dalam hal ini adalah postgres:12, yang merupakan versi 12 dari PostgreSQL.
▪ environment: Menentukan variabel lingkungan untuk konfigurasi database. POSTGRES_DB diatur ke myapp, yang berarti sebuah database dengan nama myapp akan dibuat. POSTGRES_PASSWORD diatur ke mysecretpassword, yang akan digunakan sebagai password untuk user default PostgreSQL.
▪ volumes: Mengatur volume untuk menyimpan data database secara persisten. Dalam hal ini, volume bernama db-data akan dipetakan ke direktori /var/lib/postgresql/data di dalam container PostgreSQL. Ini memastikan bahwa data database tidak hilang meskipun container dihentikan atau dihapus.

III. **Volume**

```docker
volumes:
  db-data:
```

• Mendefinisikan volume bernama db-data. Volume ini digunakan untuk menyimpan data secara persisten, sehingga data tidak hilang ketika container dihapus atau dihentikan.

Selanjutnya untuk menjalankan file docker compose tersebut kita dapat mengetikkan perintah:

```bash
docker compose -f compose.yaml up -d
```

Perintah ini akan menjalan 2 service kita sebelumnya, halaman web yang dapat diakses pada port 80 dan database yang akan diakses oleh web service.

## D. Inisiasi awal pengembangan aplikasi berbasis Django menggunakan Docker

Selanjutnya kita lihat bagaimana mengembangkan sebuah aplikasi berbasis Django menggunakan bantuan service docker dan docker compose. Alasan mengapa kita menggunakan model pengembangan seperti ini adalah:

**1. Isolasi Lingkungan**
• **Lingkungan yang Konsisten**: Docker memungkinkan Anda untuk mengisolasi aplikasi dan semua dependensinya dalam container. Ini memastikan bahwa aplikasi Django Anda berjalan dengan cara yang sama di berbagai lingkungan (pengembangan, pengujian, produksi), mengurangi masalah "works on my machine".
• **Menghindari Konflik Dependensi**: Dengan Docker, Anda dapat memiliki beberapa proyek dengan dependensi yang berbeda tanpa khawatir tentang konflik.

**2. Kemudahan Pengaturan**
• **Pengaturan Cepat**: Dengan Docker Compose, Anda dapat mendefinisikan semua layanan yang diperlukan (seperti database, cache, dan aplikasi web) dalam satu file (docker-compose.yml). Ini membuatnya mudah untuk memulai proyek baru hanya dengan satu perintah (docker-compose up).
• **Konfigurasi yang Mudah**: Anda dapat dengan mudah mengubah pengaturan layanan (seperti versi database atau variabel lingkungan) tanpa perlu mengubah banyak file.

**3. Pengelolaan Versi**
• **Rollback dan Versi**: Dengan Docker, Anda dapat dengan mudah beralih antara versi aplikasi yang berbeda. Jika terjadi masalah setelah pembaruan, Anda dapat kembali ke versi sebelumnya dengan cepat.
• **Image Versioning**: Anda bisa menggunakan tag untuk image Docker, sehingga Anda bisa mengontrol versi aplikasi dan dependensinya dengan lebih baik.

**4. Pengujian yang Efisien**
• **Pengujian Otomatis**: Anda dapat menjalankan suite pengujian di dalam container, memastikan bahwa pengujian dilakukan di lingkungan yang bersih dan konsisten.
• **Mendukung Berbagai Versi**: Anda dapat dengan mudah menguji aplikasi Anda terhadap berbagai versi Django atau database dengan menjalankan container yang berbeda.

**5. Keamanan**
• **Isolasi Keamanan**: Docker memberikan lapisan isolasi antara aplikasi dan sistem operasi, yang dapat meningkatkan keamanan aplikasi Anda.
• **Kontrol Akses**: Anda dapat mengatur kontrol akses untuk container dan jaringan, memberikan keamanan tambahan.

Dengan mengetahui beberapa kelebihan pengembangan menggunakan docker dan compose mari kita coba melakukan pengembangan aplikasinya. Berikut adalah contoh konfigurasi Docker Compose untuk menjalankan aplikasi Django yang dihosting di Docker Hub. Kita akan menggunakan image open-source Django yang sudah ada di Docker Hub, seperti django (yang merupakan image resmi untuk Django) dan mengatur database PostgreSQL untuk aplikasi tersebut.

1. **Buat Struktur Proyek**
   Pertama, buat folder untuk proyek Anda dan buat file docker-compose.yml di dalamnya.

```bash
mkdir django-app
cd django-app
touch Dockerfile
```

2. Buat "Cetakan" Django Image Custom
   Karena django image dalam dockerhub sudah deprecated, kita bisa membuat sendiri image django kita, dalam hal ini kita menggunakan Dockerfile sebagai cetakan. Berikut adalah contoh file tersebut:

```
# Menggunakan image resmi Python dari Docker Hub
FROM python:3.12.6-bookworm

# Menetapkan direktori kerja di dalam container
WORKDIR /app

# Menyalin file requirements ke dalam container
COPY requirements.txt .

# Menginstal paket yang diperlukan
RUN pip install --no-cache-dir -r requirements.txt

# Menyalin sisa kode aplikasi ke dalam container
COPY . .

# Mengekspos port tempat aplikasi berjalan
EXPOSE 8000

# Perintah untuk menjalankan aplikasi
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

Jangan lupa untuk menambahkan requirements.txt file sebagai daftar library python yang kita butuhkan. Untuk contoh kali ini kita cukup menggunakan 2 library saja yaitu django dan psycopg2-binary

```requirements.txt
Django>=5.1.1,<5.2
psycopg2-binary
```

3. **Isi File** compose.yml
   Berikut adalah contoh isi dari compose.yml:

```docker
version: '3.8'

services:
  web:
    build: .
    volumes:
      - .:/app
    ports:
      - "18000:8000"
    environment:
      - DB_HOST=db
      - DB_NAME=myapp
      - DB_USER=postgres
      - DB_PASSWORD=mysecretpassword
    depends_on:
      - db

  db:
    image: postgres:12
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=mysecretpassword
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:

```

Setelah Anda membuat file compose.yml, Anda dapat menjalankan aplikasi dengan perintah berikut:

```bash
docker compose run web django-admin startproject myproject .
```

Perintah ini akan:
• Mengunduh image yang diperlukan (jika belum ada di sistem Anda).
• Membuat dan menjalankan container untuk layanan web (Django) dan
• Menginisiasi project berbasis django kita.
Jika berhasil maka struktur proyek kita akan berbentuk seperti ini

```bash
.
├── Dockerfile
├── compose.yml
├── manage.py
├── myproject
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── requirements.txt
```

Selanjutnya kita dapat mencoba menjalankan proyek kita dengan perintah:

```bash
docker compose up
```

Dengan mengunjungi halaman `localhost:8000` kita dapat melihat aplikasi kita sudah berjalan pada server development.

Sampai pada tahap ini kita sudah dapat memulai pengembangan aplikasi menggunakan docker dan django.

## E. Mengembangkan API dengan Django

Pada contoh kali ini kita akan membuat sebuah API untuk platform LMS menggunakan Django dan django-ninja. Untuk memulai aplikasi kita dapat melakukan perintah:

```bash
docker compose run web python manage.py startapp course
```

Perintah ini akan membuat boilerplate untuk modul course dalam proyek kita. Saat ini aplikasi kita akan memiliki struktur sebagai berikut:

```bash
.
├── Dockerfile
├── compose.yml
├── course
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── migrations
│   ├── models.py
│   ├── tests.py
│   └── views.py
├── db.sqlite3
├── manage.py
├── myproject
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── requirements.txt
```

Setelah ditambahkan kita harus menambahkan "course" pada daftar aplikasi yang terinstall. Ubah `settings.py` seperti ini.

```python
INSTALLED_APPS = [
	... # aplikasi yang lain
    "course",
]
```

Kemudian kita bisa menambahkan base model untuk obyek `course` dengan field title dan description.

```python
from django.db import models


class Course(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.title)
```

Selanjutnya kita membutuhkan skema untuk mengakses model ini, `schema` ini mirip dengan `form` pada proyek django yang berbasis monolithic dimana pengguna bisa memasukkan dan memodifikasi data menggunakan html form.

```python
from datetime import datetime
from ninja import Schema, Field
from pydantic import validator

class CourseSchema(Schema):
    id: int
    title: str
    description: str
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now().isoformat())

	@validator('created_at', 'updated_at', pre=True)
    def convert_datetime_to_string(cls, value):
        if isinstance(value, datetime):
            return value.isoformat()  # Convert datetime to ISO format string
        return value  # Return the value as is if it's already a string

class CourseInSchema(Schema):
    title: str
    description: str
```

Selanjutnya kita tambahkan `view` berupa api CRUD untuk model kita.

```python
from ninja import NinjaAPI
from .models import Course
from .schemas import CourseSchema, CourseInSchema

api = NinjaAPI()

@api.get("/courses")
def list_courses(request):
    courses = Course.objects.all()
    return [CourseSchema.from_orm(course) for course in courses]

@api.post("/courses")
def create_course(request, course: CourseInSchema):
    course_instance = Course.objects.create(**course.dict())
    return CourseSchema.from_orm(course_instance)

@api.get("/courses/{course_id}")
def get_course(request, course_id: int):
    course = Course.objects.get(id=course_id)
    return CourseSchema.from_orm(course)

@api.put("/courses/{course_id}")
def update_course(request, course_id: int, course: CourseInSchema):
    course_instance = Course.objects.get(id=course_id)
    for attr, value in course.dict().items():
        setattr(course_instance, attr, value)
    course_instance.save()
    return CourseSchema.from_orm(course_instance)

@api.delete("/courses/{course_id}")
def delete_course(request, course_id: int):
    course = Course.objects.get(id=course_id)
    course.delete()
    return {"success": True}
```

Terakhir kita bisa menambahkan urls ini pada file urls utama kita.

```python
from django.contrib import admin
from django.urls import path

from course.api import api as courses_api

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', courses_api.urls),  # Tambahkan ini
]
```

Sampai dengan tahap ini kita sudah berhasil menghasilkan fungsional CRUD pada obyek Course. Selanjutnya kita bisa melakukan testing pada setiap endpoint yang kita buat. Kita bisa lihat dokumentasi swagger-nya pada alamat localhost:8000/api/v1/docs
![[Pasted image 20240930184515.png]]

## Kesimpulan

Dalam tutorial ini, kita telah mempelajari cara mengembangkan API menggunakan Django dan Django Ninja dengan memanfaatkan Docker dan PostgreSQL. Proses dimulai dengan menyiapkan lingkungan pengembangan menggunakan Docker Compose, yang memungkinkan kita untuk dengan mudah mengelola layanan dan dependensi aplikasi. Kita juga telah membuat model untuk fitur kursus (course) dalam platform Learning Management System (LMS) dan mengimplementasikan operasi CRUD (Create, Read, Update, Delete) untuk mengelola data kursus.

Selama proses ini, kita mengatasi berbagai tantangan, termasuk pengaturan koneksi database, penanganan validasi data menggunakan Pydantic, dan memastikan bahwa aplikasi Django kita berfungsi dengan baik di dalam container Docker. Dengan menggunakan skrip penantian, kita memastikan bahwa aplikasi web hanya mulai berjalan setelah database PostgreSQL siap menerima koneksi.

Dengan fondasi yang telah dibangun, langkah selanjutnya akan fokus pada pengembangan fungsionalitas lain dalam aplikasi, serta persiapan untuk implementasi di lingkungan produksi. Ini akan mencakup aspek-aspek seperti pengelolaan pengguna, autentikasi, dan pengaturan pengujian untuk memastikan aplikasi siap untuk digunakan secara luas.

## Daftar Referensi

1. **Django Documentation**
   ▪ Django. (n.d.). _Django Documentation_. Retrieved from [https://docs.djangoproject.com/en/stable/](https://docs.djangoproject.com/en/stable/)
2. **Django Ninja Documentation**
   ▪ Django Ninja. (n.d.). _Django Ninja - Fast API Framework for Django_. Retrieved from [https://django-ninja.rest-framework.com/](https://django-ninja.rest-framework.com/)
3. **Docker Documentation**
   ▪ Docker. (n.d.). _Get Started with Docker_. Retrieved from [https://docs.docker.com/get-started/](https://docs.docker.com/get-started/)
   ▪ Docker. (n.d.). _Docker Compose_. Retrieved from [https://docs.docker.com/compose/](https://docs.docker.com/compose/)
4. **PostgreSQL Documentation**
   ▪ PostgreSQL. (n.d.). _PostgreSQL Documentation_. Retrieved from [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)
5. **Pydantic Documentation**
   ▪ Pydantic. (n.d.). _Pydantic - Data validation and settings management using Python type annotations_. Retrieved from [https://pydantic-docs.helpmanual.io/](https://pydantic-docs.helpmanual.io/)
6. **Python Official Documentation**
   ▪ Python Software Foundation. (n.d.). _Python Documentation_. Retrieved from [https://docs.python.org/3/](https://docs.python.org/3/)
7. **Docker Hub**
   ▪ Docker Hub. (n.d.). _Docker Official Images_. Retrieved from [https://hub.docker.com/search?q=&type=image](https://hub.docker.com/search?q=&type=image)
8. **Django Tutorials**
   ▪ Django Girls. (n.d.). _Django Girls Tutorial_. Retrieved from [https://tutorial.djangogirls.org/](https://tutorial.djangogirls.org/)
