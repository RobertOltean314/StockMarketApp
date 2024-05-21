from django.urls import path
from backend import views

urlpatterns = [
    path('', views.HomePageView.as_view(), name='home'),
    path('stock_graph/', views.StockGraphView.as_view(), name='stock_graph'),
    path('dashboard/<str:stock_name>/', views.DashboardView.as_view(), name='dashboard'),
    path('watchlist/', views.WatchlistView.as_view(), name='watchlist'),
]
