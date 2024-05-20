from datetime import datetime

from dateutil.relativedelta import relativedelta
from django.db import models, transaction
import yfinance as yf
from django.contrib.auth.models import User


class Stock(models.Model):
    stock_name = models.CharField(max_length=10)
    date = models.DateField()
    open_price = models.FloatField()
    highest_price = models.FloatField()
    lowest_price = models.FloatField()
    close_price = models.FloatField()
    volume = models.FloatField()
    dividends = models.FloatField()
    stock_splits = models.FloatField()

    @classmethod
    @transaction.atomic
    def get_stock_info(cls, stock_name):
        end_date = datetime.today().strftime('%Y-%m-%d')
        start_date = (datetime.today() - relativedelta(years=5)).strftime('%Y-%m-%d')
        tickerData = yf.Ticker(stock_name)
        tickerDf = tickerData.history(period='1d', start=start_date, end=end_date)

        if tickerDf.empty:
            raise ValueError(f"No data found for stock: {stock_name}")

        new_stocks = []
        for index, row in tickerDf.iterrows():
            if not cls.objects.filter(stock_name=stock_name, date=index).exists():
                new_stock = cls(
                    stock_name=stock_name,
                    date=index,
                    open_price=row['Open'],
                    highest_price=row['High'],
                    lowest_price=row['Low'],
                    close_price=row['Close'],
                    volume=row['Volume'],
                    dividends=row['Dividends'],
                    stock_splits=row['Stock Splits']
                )
                new_stocks.append(new_stock)

        cls.objects.bulk_create(new_stocks)

    @classmethod
    def get_data(cls, stock_name):
        stock_name = stock_name.upper()
        stocks = list(
            cls.objects.filter(stock_name=stock_name).values('date', 'open_price', 'highest_price', 'lowest_price',
                                                             'close_price', 'volume'))
        if not stocks:
            cls.get_stock_info(stock_name)
            stocks = list(
                cls.objects.filter(stock_name=stock_name).values('date', 'open_price', 'highest_price', 'lowest_price',
                                                                 'close_price', 'volume'))
        return stocks
    
class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stocks = models.ManyToManyField(Stock)