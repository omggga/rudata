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
	getEndOfDayOnExchanges(filters) {
		return this.get(route['getEndOfDayOnExchanges'], filters)
	}

	//Получить краткий справочник по торговым инструментам
	getInstruments(filters) {
		return this.get(route['getInstruments'], filters)
	}

	//Итоги торгов по инструментам за период на различных площадках
	getSecurities(filters) {
		return this.get(route['getSecurities'], filters)
	}

	//Выборка состава индексов
	getConstituents(filters) {
		return this.get(route['getConstituents'], filters)
	}

	//Получить данные о торгах за указанный период
	getArchiveHistory(filters) {
		return this.get(route['getArchiveHistory'], filters)
	}

	//Получить рейтинги инструмента, его эмитента и основных организаторов выпуска
	getSecurityRatingsHist(filters) {
		return this.get(route['getSecurityRatingsHist'], filters)
	}

	//Значения безрисковых кривых на дату
	getRiskFee(filters) {
		return this.get(route['getRiskFee'], filters)
	}

	//Получить классификацию выпуска
	getClassification(filters) {
		return this.get(route['getClassification'], filters)
	}

	//Получить параметры облигации, зависимые от даты
	getDateOptions(filters) {
		return this.get(route['getDateOptions'], filters)
	}

	//Получить рейтинги компании за период
	getCompanyRatingsHist(filters) {
		return this.get(route['getCompanyRatingsHist'], filters)
	}

	async get(optionsConfig, filters) {
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
			//Processing api routes with pagination in response
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
			//Process raw data witouth pages
			options.body = JSON.stringify(requestOptions)
			// prettier-ignore
			total = await this.request(`${config.rudat.url}/${optionsConfig.url}${optionsConfig.insertID ? filters[optionsConfig.insertID] : ''}`, options)
		}

		return utils.obj2xml({ 'item-list': { item: total } })
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
