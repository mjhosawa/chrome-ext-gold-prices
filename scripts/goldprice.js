"use strict"

class GoldPrice {
    url = 'https://data-asg.goldprice.org/dbXRates/'
    method = 'GET'
    premium
    currencyTo
    currencyFrom
    currencyRate
    purchasePercent
    ounceRatePerGram = 31.10
    conversionPerKarat = {
        18: "750",
        21: "875",
        22: "916",
        24: "999",
    }

    constructor() { }

    /**
     * Get method
     * 
     * @returns {String}
     */
    getMethod() {
        return this.method
    }

    /**
     * Get url
     * 
     * @returns {String}
     */
    getUrl() {
        return this.url + this.getPrimaryCurrency() + ',' + this.getSecondaryCurrency()
    }

    /**
     * Return ounce rate per gram
     * 
     * @returns {Number}
     */
    getOunceRatePerGram() {
        return parseFloat(this.ounceRatePerGram).toFixed(2)
    }

    /**
     * Get primary currency
     * 
     * @returns {String}
     */
    getPrimaryCurrency() {
        return this.currencyFrom
    }

    /**
     * Set primary currency
     * 
     * @param {String} currencyFrom 
     * @returns 
     */
    setPrimaryCurrency(currencyFrom) {
        this.currencyFrom = currencyFrom
        return this
    }

    /**
     * Get secondary currency
     * 
     * @returns {String}
     */
    getSecondaryCurrency() {
        return this.currencyTo
    }

    /**
     * Set secondary currency
     * 
     * @param {String} currencyTo 
     * @returns 
     */
    setSecondaryCurrency(currencyTo) {
        this.currencyTo = currencyTo
        return this
    }

    /**
     * Get currency rate
     * 
     * @returns {Number}
     */
    getCurrencyRate() {
        return parseFloat(this.currencyRate + this.getPremiumRate()).toFixed(2)
    }

    /**
     * Set currency rate
     * 
     * @param {Number} rate 
     * @returns 
     */
    setCurrencyRate(rate) {
        this.currencyRate = parseFloat(rate).toFixed(2)
        return this
    }

    /**
     * Get premium rate
     * 
     * @returns {Number}
     */
    getPremiumRate() {
        return this.premium
    }

    /**
     * Set premium rate
     * 
     * @param {Number} premium 
     * @returns 
     */
    setPremiumRate(premium) {
        this.premium = parseFloat(premium).toFixed(2)
        return this
    }

    /**
     * Get purchase percent
     * 
     * @returns {Number}
     */
    getPurchasePercent() {
        return this.purchasePercent
    }

    /**
     * Set purchase percent
     * 
     * @param {Number} percent 
     * @returns 
     */
    setPurchasePercent(percent) {
        this.purchasePercent = parseInt(percent)
        return this
    }

    /**
     * Return the fetched data from url
     * 
     * @returns {Promise}
     */
    async makeCall() {
        const response = await fetch(this.getUrl(), { method: this.getMethod() })
        return await response.json()
    }

    /**
     * Return currency items
     * 
     * @returns {Promise}
     */
    async getItems() {
        const data = await this.makeCall()
        return data.items
    }

    /**
     * Get currency xau price
     * 
     * @returns {PromiseFulfilledResult}
     */
    async getCurrencyXauPrice() {
        const items = await this.getItems()
        let item = items.find(item => item.curr === this.getSecondaryCurrency())
        return item.xauPrice
    }

    /**
     * Get conversion per karat for the
     * currency rate
     * 
     * @returns {Array}
     */
    getConversions() {
        const rates = []
        for (let key in this.conversionPerKarat) {
            let convertedRate = this.calculateConversionRate(this.conversionPerKarat[key])
            rates.push({
                "karat": key,
                "rate": convertedRate,
                "purchaseRate": this.calculatePurchaseRate(convertedRate),
            })
        }
        return rates
    }

    /**
     * Calculate the conversion
     * 
     * @param {Number} karat 
     * @returns {Number}
     */
    calculateConversionRate(karat) {
        const conversionRate = (this.getCurrencyRate() / this.getOunceRatePerGram()) * (karat / 999)
        return parseFloat(conversionRate).toFixed(2)
    }

    /**
     * Calculate company's purchase rate
     * 
     * @param {Number} rate
     * @return {Number}
     */
    calculatePurchaseRate(rate) {
        const purchaseRate = (rate - ((rate / 100) * this.getPurchasePercent()))
        return parseFloat(purchaseRate).toFixed(2)
    }
}