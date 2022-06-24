---
title: Django Basics Cheatsheet
tags: ["software", "cheatsheets"]
---
## Installation
```shell
pip install django
pip install django-ckeditor
```

To use with PostGreSQL,

```shell
pip install psycopg2
```

## Scaffolding
### Create a Project
```shell
django-admin startproject <project_name>
```

### Create an app
Navigate to the project folder (containing ''manage.py'') and create an app for your project.
```shell
cd <project_name>
python manage.py startapp <app_name>
```

### Include the app
In **settings.py,** (suppose the app name is **main**) -
```python
INSTALLED_APPS = [
	'main',
	# ...
]
```

### settings.py
```python
SECRET_KEY = os.environ.get('SECRET_KEY')
DEBUG = os.environ.get('DEBUG').lower() == 'true'

ALLOWED_HOSTS = [
    '0.0.0.0',
    'localhost',
    '127.0.0.1',
    '<ip-address>',
    '<domain-name>'
]

STATIC_ROOT = os.path.join(BASE_DIR, "static")
STATIC_URL = '/static/'

MEDIA_ROOT = os.path.join(BASE_DIR, "media")
MEDIA_URL = '/media/'

CKEDITOR_UPLOAD_PATH = "uploads/"
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'full',
    },
}

INSTALLED_APPS = [
	'ckeditor',
    'ckeditor_uploader',
    'main',
]

# POSTGRES DATABASE
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASS'),
        'HOST': os.environ.get('DB_HOST'),
    }
}

LANGUAGE_CODE = 'en-us'

TIME_ZONE =  'Asia/Kolkata'

USE_I18N = True

USE_L10N = True

USE_TZ = True
```

### Setup Database
```shell
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```
