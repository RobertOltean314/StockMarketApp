const config = {displayModeBar: false};

window.onload = function () {
    if (window.location.pathname.includes('/dashboard/')) {
        document.getElementById('candlestick-button').click();
    }
}

function getStockNameFromUrl() {
    const url = window.location.pathname;
    const parts = url.split('/');
    return parts[parts.length - 2]; 
}

function candleStickGraph() {
    const stockSymbol = getStockNameFromUrl();

    // Clear the graph containers
    Plotly.purge('graph-container');

    const fetchData = fetch('/dashboard/' + stockSymbol.toUpperCase() + '/', {
        method: 'GET',
        headers: {'X-Requested-With': 'XMLHttpRequest'}
    })

    const updatedData = fetchData.then(response => response.json())

    updatedData.then(data => {
        // Filter the data to exclude dates with no data
        const df = data.filter(row => row.open_price !== null && row.highest_price !== null && row.lowest_price !== null && row.close_price !== null);

        const fig = {
            data: [{
                x: df.map(row => row.date),
                open: df.map(row => row.open_price),
                high: df.map(row => row.highest_price),
                low: df.map(row => row.lowest_price),
                close: df.map(row => row.close_price),
                type: 'candlestick'
            }],
            layout: {
                title: stockSymbol + ' Candle Stick', // Include the stock symbol in the title
                xaxis: {
                    rangeselector: {
                        buttons: [
                            {count: 1, label: '1d', step: 'day', stepmode: 'backward'},
                            {count: 7, label: '1w', step: 'day', stepmode: 'backward'},
                            {count: 1, label: '1m', step: 'month', stepmode: 'backward'},
                            {count: 3, label: '3m', step: 'month', stepmode: 'backward'},
                            {count: 6, label: '6m', step: 'month', stepmode: 'backward'},
                            {count: 1, label: '1y', step: 'year', stepmode: 'backward'},
                            {count: 5, label: '5y', step: 'year', stepmode: 'backward'},
                            {step: 'all'}
                        ]
                    },
                    rangeslider: {visible: true}
                }
            }
        };
        Plotly.newPlot('graph-container', fig.data, fig.layout, config);
    });
}

function timeSeriesGraph() {
    const stockSymbol = getStockNameFromUrl();

    // Clear the graph containers
    Plotly.purge('graph-container');

    const fetchData = fetch('/dashboard/' + stockSymbol.toUpperCase() + '/', {
        method: 'GET',
        headers: {'X-Requested-With': 'XMLHttpRequest'}
    })

    const updatedData = fetchData.then(response => response.json())

    updatedData.then(data => {
        const df = data.filter(row => row.open_price !== null && row.highest_price !== null && row.lowest_price !== null && row.close_price !== null);
        const fig = {
            data: [{
                x: df.map(row => row.date),
                y: df.map(row => row.highest_price),
                type: 'scatter'
            }],
            layout: {
                title: stockSymbol + 'Time Series', // Include the stock symbol in the title
                xaxis: {
                    rangeselector: {
                        buttons: [
                            {count: 1, label: '1d', step: 'day', stepmode: 'backward'},
                            {count: 7, label: '1w', step: 'day', stepmode: 'backward'},
                            {count: 1, label: '1m', step: 'month', stepmode: 'backward'},
                            {count: 3, label: '3m', step: 'month', stepmode: 'backward'},
                            {count: 6, label: '6m', step: 'month', stepmode: 'backward'},
                            {count: 1, label: '1y', step: 'year', stepmode: 'backward'},
                            {count: 5, label: '5y', step: 'year', stepmode: 'backward'},
                            {step: 'all'}
                        ]
                    },
                    rangeslider: {visible: true}
                }
            }
        };
        Plotly.newPlot('graph-container', fig.data, fig.layout, config);
    });
}

function ohlcGraph() {
    const stockSymbol = getStockNameFromUrl();

    Plotly.purge('graph-container');

    const fetchData = fetch('/dashboard/' + stockSymbol.toUpperCase() + '/', {
        method: 'GET',
        headers: {'X-Requested-With': 'XMLHttpRequest'}
    })

    const updatedData = fetchData.then(response => response.json())

    updatedData.then(data => {
        const df = data.filter(row => row.open_price !== null && row.highest_price !== null && row.lowest_price !== null && row.close_price !== null);

        const ohlcTrace = {
            x: df.map(row => row.date),
            open: df.map(row => row.open_price),
            high: df.map(row => row.highest_price),
            low: df.map(row => row.lowest_price),
            close: df.map(row => row.close_price),
            type: 'ohlc',
            name: 'OHLC'
        }

        const ohlcLayout = {
            title: stockSymbol + ' OHLC',
            xaxis: {
                rangeselector: {
                    buttons: [
                        {count: 1, label: '1d', step: 'day', stepmode: 'backward'},
                        {count: 7, label: '1w', step: 'day', stepmode: 'backward'},
                        {count: 1, label: '1m', step: 'month', stepmode: 'backward'},
                        {count: 3, label: '3m', step: 'month', stepmode: 'backward'},
                        {count: 6, label: '6m', step: 'month', stepmode: 'backward'},
                        {count: 1, label: '1y', step: 'year', stepmode: 'backward'},
                        {count: 5, label: '5y', step: 'year', stepmode: 'backward'},
                        {step: 'all'}
                    ]
                },
                rangeslider: {visible: true}
            }
        }

        Plotly.newPlot('graph-container', [ohlcTrace], ohlcLayout, config)

    })
}

function volumeGraph() {
    const stockSymbol = getStockNameFromUrl();

    Plotly.purge('graph-container');

    const fetchData = fetch('/dashboard/' + stockSymbol.toUpperCase() + '/', {
        method: 'GET',
        headers: {'X-Requested-With': 'XMLHttpRequest'}
    })

    const updatedData = fetchData.then(response => response.json())

    updatedData.then(data => {
        const df = data.filter(row => row.open_price !== null && row.highest_price !== null && row.lowest_price !== null && row.close_price !== null);

        const volumeTrace = {
            x: df.map(row => row.date),
            y: df.map(row => row.volume),
            type: 'bar',
            name: 'Volume'
        }

        const volumeLayout = {
            title: stockSymbol + ' Volume',
            xaxis: {
                rangeselector: {
                    buttons: [
                        {count: 1, label: '1d', step: 'day', stepmode: 'backward'},
                        {count: 7, label: '1w', step: 'day', stepmode: 'backward'},
                        {count: 1, label: '1m', step: 'month', stepmode: 'backward'},
                        {count: 3, label: '3m', step: 'month', stepmode: 'backward'},
                        {count: 6, label: '6m', step: 'month', stepmode: 'backward'},
                        {count: 1, label: '1y', step: 'year', stepmode: 'backward'},
                        {count: 5, label: '5y', step: 'year', stepmode: 'backward'},
                        {step: 'all'}
                    ]
                },
                rangeslider: {visible: true}
            }
        }

        Plotly.newPlot('graph-container', [volumeTrace], volumeLayout, config)
    })
}

document.getElementById('candlestick-button').addEventListener('click', candleStickGraph);

document.getElementById('timeseries-button').addEventListener('click', timeSeriesGraph)

document.getElementById('ohlc-button').addEventListener('click', ohlcGraph);

document.getElementById('volume-button').addEventListener('click', volumeGraph);