from django import forms
from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import redirect, get_object_or_404, render
from django.urls import reverse_lazy, reverse
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
    template_name = 'home/home.html'


class WatchlistView(UpdateView):
    model = Watchlist
    form_class = WatchlistForm
    template_name = 'stocks/watchlist.html'
    success_url = reverse_lazy('watchlist')  # replace with your success url

    def get_object(self, queryset=None):
        return Watchlist.objects.get_or_create(user=self.request.user)[0]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        watchlist = self.get_object()
        context['stocks'] = [(stock, stock.get_most_recent_data()) for stock in watchlist.stocks.all()]
        return context

    def post(self, request, *args, **kwargs):
        action = request.POST.get('action')
        stock_name = request.POST.get('stock_name').strip()  # Remove leading and trailing whitespaces
        print(f"stock_name: {stock_name}")  # Print the stock_name to the console
        stock = get_object_or_404(Stock, stock_name__iexact=stock_name)
        watchlist = self.get_object()

        if action == 'add':
            watchlist.stocks.add(stock)
        elif action == 'remove':
            watchlist.stocks.remove(stock)

        return HttpResponseRedirect(reverse('watchlist'))
