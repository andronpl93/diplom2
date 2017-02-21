from django.conf.urls import url
from django.contrib import admin
from . import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', views.start),
    url(r'^graf/([A-Z]{3})/$', views.graf),
    url(r'^update_select/([A-Z]{3})/$', views.update_select),
    url(r'^couple/([A-Z]{3})_([A-Z]{3})/([A-Z]{3})/$', views.couple),
]
