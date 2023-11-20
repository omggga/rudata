'use strict'

const utils = require('utils')
const config = require('./app.config')
require('./all-settled')

const route = {
	getEndOfDayOnExchanges: {
		url: 'Archive/EndOfDayOnExchanges/',
		defaults: {
			official: false,
			pageNum: 1,
			pageSize: 100
		},
		havePages: true
	},
	getInstruments: {
		url: 'Info/Instruments/',
		defaults: {
			pageNum: 1,
			pageSize: 300
		},
		havePages: true
	},
	getSecurities: {
		url: 'Info/Securities/',
		defaults: {
			pageNum: 1,
			pageSize: 100
		},
		havePages: true
	},
	getCalendarV2: {
		url: 'Info/CalendarV2/',
		defaults: {
			pageNum: 1,
			pageSize: 100
		},
		havePages: true
	},
	getConstituents: {
		url: 'Indicator/Constituents/',
		defaults: {
			pageNum: 1,
			pageSize: 300
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
			pageNum: 1,
			pageSize: 100
		},
		havePages: true
	},
	getIndicatorList: {
		url: 'Indicator/List',
		defaults: {
			pageNum: 1,
			pageSize: 100
		},
		havePages: true
	},
	getDateOptions: {
		url: 'Bond/DateOptions/'
	},
	getTimeTable: {
		url: 'Bond/TimeTable/',
		defaults: {
			pageNum: 1,
			pageSize: 300
		},
		havePages: true
	},
	getCouponsExt: {
		url: 'Bond/CouponsExt/',
		defaults: {
			pageNum: 1,
			pageSize: 300
		},
		havePages: true
	},
	getBondCoupons: {
		url: 'Bond/',
		defaults: {
			pageNum: 1,
			pageSize: 300
		},
		havePages: true,
		prependID: 'id',
		prependUrl: '/Coupons'
	},
	getBonds: {
		url: 'Bond/Coupons/',
		defaults: {
			pageNum: 1,
			pageSize: 300
		},
		havePages: true
	},
	getBondOffers: {
		url: 'Bond/Offers/',
		defaults: {
			pageNum: 1,
			pageSize: 300
		},
		havePages: true
	},
	getCompanyRatingsHist: {
		url: 'Rating/CompanyRatingsHist/',
		insertID: 'id'
	},
	getShareDividend: {
		url: 'Info/ShareDividend/',
		defaults: {
			pageNum: 1,
			pageSize: 300
		},
		havePages: true
	},
	getShareDividendById: {
		url: 'Info/ShareDividend/',
		defaults: {
			pageNum: 1,
			pageSize: 300
		},
		havePages: true,
		insertID: 'id'
	},
	getCorporateActions: {
		url: 'CorporateAction/Actions/',
		defaults: {
			pageNum: 1,
			pageSize: 300
		},
		havePages: true
	},
	getCurrencyRate: {
		url: 'Archive/CurrencyRate/'
	},
	getEndOfDay: {
		url: 'Archive/EndOfDay/'
	},
	getIFXFintoolRefData: {
		url: 'Info/IFXFintoolRefData',
		defaults: {
			pager: {
				page: 1,
				size: 100
			}
		},
		havePages: true
	},
	getFintoolReferenceData: {
		url: 'Info/FintoolReferenceData',
		defaults: {
			pager: {
				page: 1,
				size: 100
			}
		},
		havePages: true
	},
	getBondConvertation: {
		url: 'Bond/Convertation',
		defaults: {
			pageNum: 1,
			pageSize: 100
		},
		havePages: true
	},
	getFintoolConvertation: {
		url: 'Info/FintoolConvertation',
		defaults: {
			pageNum: 1,
			pageSize: 100
		},
		havePages: true
	},
	getInfoEmitents: {
		url: 'Info/Emitents',
		defaults: {
			pageNum: 1,
			pageSize: 100
		},
		havePages: true
	}
}

class Api {
	constructor(options) {
		this.limiter = options.limiter
		this.token = null
	}

	async login() {
		const body = JSON.stringify({
			login: config.rudat.user,
			password: config.rudat.pass
		})

		const options = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body
		}

		const response = await utils.requestUntilSuccess(`${config.rudat.url}/Account/Login`, options)
		if (!response.ok) {
			throw new Error(`Ошибка! [${response.status}]: ${response.statusText}`)
		}

		const result = await response.json()
		if (!result.token) {
			throw new Error('Ошибка при получении авторизационного токена, ответ не содержит переменной token')
		}

		this.token = `Bearer ${result.token}`
	}

	//Итоги торгов по инструментам за период на различных площадках
	getEndOfDayOnExchanges(filters, packageData, isQuery) {
		return this.get(route['getEndOfDayOnExchanges'], filters, packageData, isQuery)
	}

	//Получить краткий справочник по торговым инструментам
	getInstruments(filters, packageData, isQuery) {
		return this.get(route['getInstruments'], filters, packageData, isQuery)
	}

	//Итоги торгов по инструментам за период на различных площадках
	getSecurities(filters, packageData, isQuery) {
		return this.get(route['getSecurities'], filters, packageData, isQuery)
	}

	//Выборка состава индексов
	getConstituents(filters, packageData, isQuery) {
		return this.get(route['getConstituents'], filters, packageData, isQuery)
	}

	//Получить данные о торгах за указанный период
	getArchiveHistory(filters, packageData, isQuery) {
		return this.get(route['getArchiveHistory'], filters, packageData, isQuery)
	}

	//Получить рейтинги инструмента, его эмитента и основных организаторов выпуска
	getSecurityRatingsHist(filters, packageData, isQuery) {
		return this.get(route['getSecurityRatingsHist'], filters, packageData, isQuery)
	}

	//Значения безрисковых кривых на дату
	getRiskFee(filters, packageData, isQuery) {
		return this.get(route['getRiskFee'], filters, packageData, isQuery)
	}

	//Получить классификацию выпуска
	getClassification(filters, packageData, isQuery) {
		return this.get(route['getClassification'], filters, packageData, isQuery)
	}

	//Выборка справочника индикаторов
	getIndicatorList(filters, packageData, isQuery) {
		return this.get(route['getIndicatorList'], filters, packageData, isQuery)
	}

	//Получить параметры облигации, зависимые от даты
	getDateOptions(filters, packageData, isQuery) {
		return this.get(route['getDateOptions'], filters, packageData, isQuery)
	}

	//Получить календарь событий
	getTimeTable(filters, packageData, isQuery) {
		return this.get(route['getTimeTable'], filters, packageData, isQuery)
	}

	//Получить данные по купонам
	getBondCoupons(filters, packageData, isQuery) {
		return this.get(route['getBondCoupons'], filters, packageData, isQuery)
	}

	//Получить данные по купонам (общее)
	getBonds(filters, packageData, isQuery) {
		return this.get(route['getBonds'], filters, packageData, isQuery)
	}

	//Получить данные по досрочным выкупам/офертам
	getBondOffers(filters, packageData, isQuery) {
		return this.get(route['getBondOffers'], filters, packageData, isQuery)
	}

	//Получить расширенные данные по купонам
	getCouponsExt(filters, packageData, isQuery) {
		return this.get(route['getCouponsExt'], filters, packageData, isQuery)
	}

	//Получить рейтинги компании за период
	getCompanyRatingsHist(filters, packageData, isQuery) {
		return this.get(route['getCompanyRatingsHist'], filters, packageData, isQuery)
	}

	//Информация по дивидендам
	getShareDividend(filters, packageData, isQuery) {
		return this.get(route['getShareDividend'], filters, packageData, isQuery)
	}

	//Информация по дивидендам для конкретной организации
	getShareDividendById(filters, packageData, isQuery) {
		return this.get(route['getShareDividendById'], filters, packageData, isQuery)
	}

	//Получить корпоративные действия
	getCorporateActions(filters, packageData, isQuery) {
		return this.get(route['getCorporateActions'], filters, packageData, isQuery)
	}

	//Получить кросс-курс двух валют
	getCurrencyRate(filters, packageData, isQuery) {
		return this.get(route['getCurrencyRate'], filters, packageData, isQuery)
	}

	//Получить данные по результатам торгов на заданную дату
	getEndOfDay(filters, packageData, isQuery) {
		return this.get(route['getEndOfDay'], filters, packageData, isQuery)
	}

	//Получить справочник Интерфакс по финансовым инструментам
	getIFXFintoolRefData(filters, packageData, isQuery) {
		return this.get(route['getIFXFintoolRefData'], filters, packageData, isQuery)
	}

	//Получить данные по конвертациям облигаций в другие инструменты
	getBondConvertation(filters, packageData, isQuery) {
		return this.get(route['getBondConvertation'], filters, packageData, isQuery)
	}

	//Получить данные по конвертациям инструментов в другие инструменты
	getFintoolConvertation(filters, packageData, isQuery) {
		return this.get(route['getFintoolConvertation'], filters, packageData, isQuery)
	}

	//Получить расширенный справочник по финансовым инструментам
	getFintoolReferenceData(filters, packageData, isQuery) {
		return this.get(route['getFintoolReferenceData'], filters, packageData, isQuery)
	}

	//Возвращает календарь событий по инструментам за период
	getCalendarV2(filters, packageData, isQuery) {
		return this.get(route['getCalendarV2'], filters, packageData, isQuery)
	}

	//Получить краткий справочник по эмитентам
	getInfoEmitents(filters, packageData, isQuery) {
		return this.get(route['getInfoEmitents'], filters, packageData, isQuery)
	}

	async get(optionsConfig, filters, packageData, isQuery) {
		if (!packageData && !isQuery) {
			const data = await this.limiter.schedule(() => this.getData(optionsConfig, filters))
			return utils.obj2xml({ 'item-list': { item: data } })
		}

		let result = []
		for (const filter of filters) {
			const tag = Object.keys(filter).find((k) => k.startsWith('@'))
			try {
				const data = await this.limiter.schedule(() => this.getData(optionsConfig, filter))
				const batchData = isQuery
					? { batch: { [tag]: filter[tag], 'item-list': { item: data } } }
					: { 'item-list': { '@tag': filter[tag], '@err': 0, item: data } }

				result.push(batchData)
			} catch (err) {
				const errorData = isQuery
					? { batch: { [tag]: filter[tag], error: err.toString() } }
					: { 'item-list': { '@tag': filter[tag], '@err': 1, error: err.toString() } }

				result.push(errorData)
			}
		}

		return utils.obj2xml(isQuery ? { 'batch-list': result } : { list: result })
	}

	async getData(optionsConfig, filters) {
		const requestOptions = { ...optionsConfig.defaults, ...this.parseFilters(filters) }
		let url = `${config.rudat.url}/${optionsConfig.url}`

		if (optionsConfig.prependID) {
			url += `${filters[optionsConfig.prependID]}${optionsConfig.prependUrl}`
		} else if (optionsConfig.insertID) {
			url += filters[optionsConfig.insertID]
		}

		if (optionsConfig.havePages) {
			let pageNum = 1
			let total = []
			let processing = true

			while (processing) {
				requestOptions.pageNum = pageNum
				const data = await this.request(url, requestOptions)
				if (Array.isArray(data) && data.length === 0) break
				total = [...total, ...data]
				if (data.length < requestOptions.pageSize) break
				pageNum++
			}

			return total
		}

		return this.request(url, requestOptions)
	}

	async request(url, options) {
		const response = await utils.requestUntilSuccess(url, options, 60000)
		if (!response.ok) {
			const errorText = await response.text()
			throw new Error(`Ошибка! [${response.status}]:${response.statusText}, ${errorText}`)
		}
		return response.json()
	}

	parseFilters(filters, defaults = {}) {
		const options = {}
		for (let [key, value] of Object.entries(filters)) {
			if (Array.isArray(value)) {
				//[].concat using to create empty array beacuse if there is only one element in array, util.xml2obj convert it to object inside
				options[key] = [].concat(value[0][Object.keys(value[0])])
			} else {
				options[key] = value
			}
		}
		return { ...defaults, ...options }
	}
}

module.exports = Api
