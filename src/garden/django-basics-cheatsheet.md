---
title: Django Basics Cheatsheet
tags: ["software", "cheatsheets"]
---
## Using this cheatsheet
This cheatsheet was built for personal use while learning django. Rather than a generalized list of possible scenarios, example code implementing most common features are listed. I usually pick and choose parts from this sheet when I know exactly what I want and just need the specific syntax.

Since [this](/) [digital garden](/garden/digital-garden) is a public document, you are welcome to contribute to it on [GitHub](https://github.com/theabdullahalam/digital-garden/).

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


## Basic Website
### views.py
```python
from django.shortcuts import render
from django.core.paginator import Paginator
from .models import Post, PostType

def index(request):
    return render(request, 'index.html')

def post(request, slug):
    # FETCH OBJ
    post_obj=Post.objects.get(slug = str(slug))

    # HUMAN FRIENDLY DATE
    hfr_date = post_obj.created.strftime('%e %b %Y')
    post_obj.hfr_date = hfr_date

    # CREATE CONTEXT
    context = {
        'post': post_obj,
    }

    # RETURN
    return render(request, 'post.html', context=context)

def posts(request, pageno=1):
    # FETCH ALL POSTS
    posts = Post.objects.filter(p_type__type_name = typename).exclude(slug='about').order_by('-created', 'title')

    # PAGINATE
    paginator = Paginator(posts, 10)
    page_num = int(pageno)
    page_obj = paginator.get_page(page_num)
    posts = page_obj.object_list

    # HUMAN FRIENDLY DATE
    for post in posts:
        hfr_date = post.created.strftime('%e %b %Y')
        post.hfr_date = hfr_date

        post.preview = str(post.content).split('</p>')[0].split('<p>')[1]

    # SET CONTEXT
    context = {
        'posts': posts,
        'pageinator': paginator,
        'page_obj': page_obj,
    }

    # RETURN
    return render(request, 'postlist.html', context=context)

```

### App urls.py
```python
from django.urls import path
from . import views
 
urlpatterns = [

    path('', views.index, name='index'),

    path('post/<slug:slug>', views.post, name='post'),
    path('posts', views.posts, name='posts'),
    path('posts/', views.posts, name='posts'),
    path('posts/page/<int:pageno>', views.posts, name='posts'),

]
```

### Project urls.py
```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import url
 
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main.urls')),
    url(r'^ckeditor/', include('ckeditor_uploader.urls')),
] + static(
    settings.STATIC_URL,
    document_root=settings.STATIC_ROOT
) + static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)
```

## models.py
### Basic Structure
```python
from django.db import models
from django.utils import timezone
from ckeditor_uploader.fields import RichTextUploadingField
from django.utils.text import slugify
 
class PostType(models.Model):
    type_name = models.CharField(max_length=30)

    def __str__(self):
        return str(self.type_name)
 
class Post(models.Model):
    image_file = models.ImageField(upload_to='photographs')
    title = models.CharField(max_length=250)
    p_type=models.ForeignKey(PostType, on_delete=models.CASCADE)
    content = RichTextUploadingField(max_length=14000)
    created = models.DateTimeField(editable=False)
    modified = models.DateTimeField(editable=False)
    slug = models.SlugField(unique=True, max_length=100, blank=True)

    def save(self, *args, **kwargs):
        # UPDATE TIMESTAMPS
        if not self.id:
            self.created = timezone.now()
        self.modified = timezone.now()

        # GENERATE SLUG
        if not self.slug:
            self.slug = slugify(self.title)
        return super(Post, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.title)

    class Meta:
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'

```

### Many to Many Relation
Note that the ''ManyToManyField'' is only defined in one model. It doesn't matter which model has the field, but if in doubt, it should be in the model that will be interacted with in a form.
```python
class Topping(models.Model):
    # ...
    pass

class Pizza(models.Model):
    # ...
    toppings = models.ManyToManyField(Topping)
```

### ImageField Access Examples
```python
car = Car.objects.get(name="57 Chevy")
car.photo
::::::<ImageFieldFile: cars/chevy.jpg>
car.photo.name
::::::'cars/chevy.jpg'
car.photo.path
::::::'/media/cars/chevy.jpg'
car.photo.url
::::::'http://media.example.com/cars/chevy.jpg'
```

## Django Admin
### To create ''superuser''
```shell
python manage.py createsuperuser
```

### admin.py
```python
from django.contrib import admin
from .models import Post, PostType

@admin.register(PostType)
class PostTypeAdmin(admin.ModelAdmin):
    list_display = ('type_name',)
    ordering = ('type_name',)
    search_fields = ('type_name',)

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'p_type')
    ordering = ('title',)
    search_fields = ('title', 'p_type',)
```


