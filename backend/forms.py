from django import forms
from .models import Watchlist

class AddStockForm(forms.Form):
    stock = forms.CharField(max_length=20)

class WatchlistForm(forms.ModelForm):
    class Meta:
        model = Watchlist
        fields = ['stocks']