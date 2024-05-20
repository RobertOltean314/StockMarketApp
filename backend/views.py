from django import forms
from django.http import Http404, JsonResponse
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.views.generic import TemplateView
from django.views.generic.edit import FormView, UpdateView
from backend.forms import WatchlistForm
from backend.models import Stock, Watchlist


class StockNameForm(forms.Form):
    stock_name = forms.CharField(max_length=20)

class DashboardView(TemplateView):
    template_name = 'stocks/dashboard.html'

    def get(self, request, *args, **kwargs):
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            stock_name = kwargs.get('stock_name')
            data = Stock.get_data(stock_name)
            return JsonResponse(data, safe=False)
        else:
            return super().get(request, *args, **kwargs)
        
        
class StockGraphView(FormView):
    template_name = 'stocks/dashboard.html'
    form_class = StockNameForm

    def get(self, request, *args, **kwargs):
        stock_name = request.GET.get('stock_name')

        return redirect('dashboard', stock_name=stock_name)
    

class HomePageView(TemplateView):
    template_name='home/home.html'
    
class WatchlistView(UpdateView):
    model = Watchlist 
    form_class = WatchlistForm
    template_name = 'stocks/watchlist.html'
    success_url = reverse_lazy('watchlist')  # replace with your success url

    def get_object(self, queryset=None):
        return Watchlist.objects.get_or_create(user=self.request.user)[0]