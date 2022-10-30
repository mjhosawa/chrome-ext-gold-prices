"use strict"

// TODO: Get the currency from and currency to from the options config.
const goldprice = new GoldPrice()
goldprice.setPrimaryCurrency('USD')
goldprice.setSecondaryCurrency('KWD')
goldprice.setPremiumRate(6.5)
goldprice.setPurchasePercent(2)

goldprice.getCurrencyXauPrice().then((rate) => {
    goldprice.setCurrencyRate(rate)
    const rates = goldprice.getConversions()
    if (rates != 'undefined' || typeof rates === 'array') {
        let tableData = "";
        for (let key in rates) {
            tableData += "<tr>"
            tableData += "<td>" + rates[key].karat + ' Karat ' + "</td>"
            tableData += "<td>" + rates[key].rate + "</td>"
            tableData += "<td>" + rates[key].purchaseRate + "</td>"
            tableData += "</tr>"
        }
        $('gold-price-table').innerHTML = tableData;
    }
});



