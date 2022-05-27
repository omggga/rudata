'use strict'

const utils = require('./utils')
const config = require('./config')

//Default routing config
const route = {
	getEndOfDayOnExchanges: {
		url: 'Archive/EndOfDayOnExchanges/',
		defaults: {
			official: false
		}
	},
	getInstruments: {
		url: 'Info/Instruments/',
		defaults: {
			pageNum: 1,
			pageSize: 1000
		},
		havePages: true
	},
	getSecurities: {
		url: 'Info/Securities/',
		defaults: {
			count: 20000
		}
	},
	getConstituents: {
		url: 'Indicator/Constituents/',
		defaults: {
			pageNum: 1,
			pageSize: 1000
		},
		havePages: true
	},
	getArchiveHistory: {
		url: 'Archive/History/',
		defaults: {
			official: true
		}
	},
	getSecurityRatingsHist: {
		url: 'Rating/SecurityRatingsHist/'
	},
	getRiskFee: {
		url: 'Indicator/RiskFree/'
	},
	getClassification: {
		url: 'Bond/Classification/',
		defaults: {
			count: 50000
		}
	},
	getDateOptions: {
		url: 'Bond/DateOptions/'
	},
	getCompanyRatingsHist: {
		url: 'Rating/CompanyRatingsHist/',
		insertID: 'id'
	},
	getShareDividend: {
		url: 'Info/ShareDividend/',
		defaults: {
			pageNum: 1,
			pageSize: 1000
		},
		havePages: true
	},
	getShareDividendById: {
		url: 'Info/ShareDividend/',
		defaults: {
			pageNum: 1,
			pageSize: 1000
		},
		havePages: true,
		insertID: 'id'
	},
	getCorporateActions: {
		url: 'CorporateAction/Actions/',
		defaults: {
			count: 20000
		}
	},
	getCurrencyRate: {
		url: 'Archive/CurrencyRate/'
	},
	getEndOfDay: {
		url: 'Archive/EndOfDay/'
	}
}

class Api {
	constructor() {
		this.token = null
	}

	async login() {
		const body = {
			login: config.rudat.user,
			password: config.rudat.pass
		}
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		}
		const response = await utils.requestUntilSuccess(`${config.rudat.url}/Account/Login`, options)
		if (!response.ok) {
			throw new Error(`Ошибка! [${response.status}]:${response.statusText}`)
		}

		const result = await response.json()
		if (!result.token) {
			throw new Error(`Ошибка при получении авторизационного токена, ответ не содержит переменной token`)
		}

		this.token = 'Bearer ' + result.token
	}

	//Итоги торгов по инструментам за период на различных площадках
	getEndOfDayOnExchanges(filters, packageData) {
		return this.get(route['getEndOfDayOnExchanges'], filters, packageData)
	}

	//Получить краткий справочник по торговым инструментам
	getInstruments(filters, packageData) {
		return this.get(route['getInstruments'], filters, packageData)
	}

	//Итоги торгов по инструментам за период на различных площадках
	getSecurities(filters, packageData) {
		return this.get(route['getSecurities'], filters, packageData)
	}

	//Выборка состава индексов
	getConstituents(filters, packageData) {
		return this.get(route['getConstituents'], filters, packageData)
	}

	//Получить данные о торгах за указанный период
	getArchiveHistory(filters, packageData) {
		return this.get(route['getArchiveHistory'], filters, packageData)
	}

	//Получить рейтинги инструмента, его эмитента и основных организаторов выпуска
	getSecurityRatingsHist(filters, packageData) {
		return this.get(route['getSecurityRatingsHist'], filters, packageData)
	}

	//Значения безрисковых кривых на дату
	getRiskFee(filters, packageData) {
		return this.get(route['getRiskFee'], filters, packageData)
	}

	//Получить классификацию выпуска
	getClassification(filters, packageData) {
		return this.get(route['getClassification'], filters, packageData)
	}

	//Получить параметры облигации, зависимые от даты
	getDateOptions(filters, packageData) {
		return this.get(route['getDateOptions'], filters, packageData)
	}

	//Получить рейтинги компании за период
	getCompanyRatingsHist(filters, packageData) {
		return this.get(route['getCompanyRatingsHist'], filters, packageData)
	}

	//Информация по дивидендам
	getShareDividend(filters, packageData) {
		return this.get(route['getShareDividend'], filters, packageData)
	}

	//Информация по дивидендам для конкретной организации
	getShareDividendById(filters, packageData) {
		return this.get(route['getShareDividendById'], filters, packageData)
	}

	//Получить корпоративные действия
	getCorporateActions(filters, packageData) {
		return this.get(route['getCorporateActions'], filters, packageData)
	}

	//Получить кросс-курс двух валют
	getCurrencyRate(filters, packageData) {
		return this.get(route['getCurrencyRate'], filters, packageData)
	}

	//Получить данные по результатам торгов на заданную дату
	getEndOfDay(filters, packageData) {
		return this.get(route['getEndOfDay'], filters, packageData)
	}

	async get(optionsConfig, filters, packageData) {
		if (!packageData) {
			const data = await this.getData(optionsConfig, filters)
			return utils.obj2xml({ 'item-list': { item: data } })
		}

		let result = []
		for (let filter of filters) {
			const tag = Object.keys(filter).filter((k) => k.startsWith('@'))
			const data = await this.getData(optionsConfig, filter)
			result.push({ 'item-list': { [tag[0]]: filter[tag[0]], item: data } })
		}

		let xml = '<list>'
		for (let res of result) {
			xml += utils.obj2xml({ 'item-list': res['item-list'] })
		}
		xml += '</list>'
		return xml
	}

	async getData(optionsConfig, filters) {
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: this.token
			}
		}

		let total
		const requestOptions = this.parseFilters(filters, optionsConfig.defaults)
		if (optionsConfig.havePages) {
			total = []
			let processing = true
			while (processing) {
				options.body = JSON.stringify(requestOptions)
				// prettier-ignore
				const result = await this.request(`${config.rudat.url}/${optionsConfig.url}${optionsConfig.insertID ? filters[optionsConfig.insertID] : ''}`, options)
				if (result.length === 0) {
					processing = false
					break
				}
				total = total.concat(result)
				requestOptions.pageNum++
			}
		} else {
			options.body = JSON.stringify(requestOptions)
			// prettier-ignore
			total = await this.request(`${config.rudat.url}/${optionsConfig.url}${optionsConfig.insertID ? filters[optionsConfig.insertID] : ''}`, options)
		}

		return total
	}

	async request(url, options) {
		const response = await utils.requestUntilSuccess(url, options)
		if (!response.ok) {
			throw new Error(`Ошибка! [${response.status}]:${response.statusText}`)
		}
		return response.json()
	}

	parseFilters(filters, defaults = {}) {
		const options = {}
		for (let [key, value] of Object.entries(filters)) {
			if (Array.isArray(value)) {
				//[].concat using to create empty array beacuse if there is only one element in array, fast-xml-parser convert it to object inside
				options[key] = [].concat(value[0][Object.keys(value[0])])
			} else {
				options[key] = value
			}
		}
		return { ...defaults, ...options }
	}
}

module.exports = Api
