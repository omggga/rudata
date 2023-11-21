'use strict'

const assert = require('assert')
const moment = require('moment')

const Api = require('./api')
const utils = require('./utils')

describe('runner.js', () => {
	let api

	before(async () => {
		api = new Api()
		await api.login()
	})

	it(`getEndOfDayOnExchanges`, async () => {
		const xml = `<filters>
			<codes>
				<code>US0378331005</code>
			</codes>
			<dateFrom>2022-03-24</dateFrom>
			<dateTo>2022-03-30</dateTo>
			<fields>
				<field>MPRICE</field>
				<field>LCLOSE</field>
				<field>DISCOUNT</field>
			</fields>
		</filters>`

		const { filtersList } = getFilters(xml)
		const data = await api.getEndOfDayOnExchanges(filtersList)
		assert.ok(data.includes('item-list'), 'Получены неверные данные от Rudata при получении данных')
	}).timeout(10000)

	it(`getInstruments`, async () => {
		const xml = `<filters>
			<filter>UPDATE_DATE > #${moment().format('YYYY-MM-DD')}#</filter>
		</filters>`

		const { filtersList } = getFilters(xml)
		const data = await api.getInstruments(filtersList)
		assert.ok(data.includes('item-list'), 'Получены неверные данные от Rudata при получении данных')
	}).timeout(25000)

	it(`getSecurities`, async () => {
		const xml = `<filters>
			<filter>UPDATE_DATE > #${moment().format('YYYY-MM-DD')}#</filter>
		</filters>`

		const { filtersList } = getFilters(xml)
		const data = await api.getSecurities(filtersList)
		assert.ok(data.includes('item-list'), 'Получены неверные данные от Rudata при получении данных')
	}).timeout(5000)

	it(`getConstituents`, async () => {
		const xml = `<filters>
			<fintoolIds>
				<fintoolId>108162</fintoolId>
			</fintoolIds>
			<dateFrom>2022-04-01</dateFrom>
			<dateTo>2022-04-04</dateTo>
		</filters>`

		const { filtersList } = getFilters(xml)
		const data = await api.getConstituents(filtersList)
		assert.ok(data.includes('item-list'), 'Получены неверные данные от Rudata при получении данных')
	}).timeout(10000)

	it(`getArchiveHistory`, async () => {
		const xml = `<filters>
			<issId>139590</issId>
			<dateFrom>2022-04-01</dateFrom>
			<dateTo>2022-04-04</dateTo>
			<step>1440</step>
		</filters>`

		const { filtersList } = getFilters(xml)
		const data = await api.getArchiveHistory(filtersList)
		assert.ok(data.includes('item-list'), 'Получены неверные данные от Rudata при получении данных')
	}).timeout(5000)

	it(`getSecurityRatingsHist`, async () => {
		const xml = `<filters>
			<dateFrom>2022-04-03</dateFrom>
			<dateTo>2022-04-04</dateTo>
		</filters>`

		const { filtersList } = getFilters(xml)
		const data = await api.getSecurityRatingsHist(filtersList)
		assert.ok(data.includes('item-list'), 'Получены неверные данные от Rudata при получении данных')
	}).timeout(5000)

	it(`getRiskFee`, async () => {
		const xml = `<filters>
			<date>2022-04-11</date>
			<curveCode>MOEX.RUB.ZCYC</curveCode>
		</filters>`

		const { filtersList } = getFilters(xml)
		const data = await api.getRiskFee(filtersList)
		assert.ok(data.includes('term'), 'Получены неверные данные от Rudata при получении данных')
	}).timeout(5000)

	it(`getClassification`, async () => {
		const xml = `<filters>
			<filters>id_fintool in (6044,9387,20386,20561,82026,87551,87883,90641,91503,96612,99118,120738,120739,120851,122117) and id_type_group in ( 3, 62 )</filters>
		</filters>`

		const { filtersList } = getFilters(xml)
		const data = await api.getClassification(filtersList)
		assert.ok(data.includes('id_fintool'), 'Получены неверные данные от Rudata при получении данных')
	}).timeout(5000)

	it(`getDateOptions`, async () => {
		const xml = `<filters>
			<symbol>USU5007TAA35</symbol>
			<date>2022-04-03</date>
			<isCloseRegister>true</isCloseRegister>
			<useFixDate>true</useFixDate>
		</filters>`

		const { filtersList } = getFilters(xml)
		const data = await api.getDateOptions(filtersList)
		assert.ok(data.includes('couponDate'), 'Получены неверные данные от Rudata при получении данных')
	}).timeout(5000)

	it(`getCompanyRatingsHist`, async () => {
		const xml = `<filters>
			<id>95023</id>
			<dateFrom>2022-03-24</dateFrom>
			<dateTo>2022-04-01</dateTo>
		</filters>`

		const { filtersList } = getFilters(xml)
		const data = await api.getCompanyRatingsHist(filtersList)
		assert.ok(data.includes('rating_id'), 'Получены неверные данные от Rudata при получении данных')
	}).timeout(10000)

	it(`getShareDividend`, async () => {
		const xml = `<filters>
			<filter>UPDATE_DATE > #${moment().format('YYYY-MM-DD')}#</filter>
		</filters>`

		const { filtersList } = getFilters(xml)
		const data = await api.getShareDividend(filtersList)
		assert.ok(data.includes('decision_date'), 'Получены неверные данные от Rudata при получении данных')
	}).timeout(5000)

	it(`getShareDividendById`, async () => {
		const xml = `<filters>
			<id>126738</id>
		</filters>`

		const { filtersList } = getFilters(xml)
		const data = await api.getShareDividendById(filtersList)
		assert.ok(data.includes('decision_date'), 'Получены неверные данные от Rudata при получении данных')
	}).timeout(5000)

	it(`getCorporateActions`, async () => {
		const xml = `<filters>
			<filter>UPDATE_DATE > #${moment().format('YYYY-MM-DD')}#</filter>
		</filters>`

		const { filtersList } = getFilters(xml)
		const data = await api.getCorporateActions(filtersList)
		assert.ok(data.includes('msg_id'), 'Получены неверные данные от Rudata при получении данных')
	}).timeout(5000)

	it(`getCurrencyRate`, async () => {
		const xml = `<filters>
			<from>USD</from>
			<to>RUB</to>
			<date>2022-05-24</date>
		</filters>`

		const { filtersList } = getFilters(xml)
		const data = await api.getCurrencyRate(filtersList)
		assert.ok(data.includes('rate'), 'Получены неверные данные от Rudata при получении данных')
	}).timeout(5000)

	it(`getEndOfDay`, async () => {
		const xml = `<filters-list>
			<filters>
				<issId>782490</issId>
				<date>2022-05-25</date>
				<dateType>ACTUAL</dateType>
				<official>false</official>
				<fields>
					<field>id_iss</field>
					<field>TIME</field>
					<field>LAST</field>
					<field>VOL_ACC</field>
					<field>DEAL_ACC</field>
				</fields>
			</filters>
			<filters>
				<issId>782483</issId>
				<date>2022-05-25</date>
				<dateType>ACTUAL</dateType>
				<official>false</official>
				<fields>
					<field>id_iss</field>
					<field>TIME</field>
					<field>LAST</field>
					<field>VOL_ACC</field>
					<field>DEAL_ACC</field>
				</fields>
			</filters>
		</filters-list>`

		const { filtersList, packageData } = getFilters(xml)
		const data = await api.getEndOfDay(filtersList, packageData)
		assert.ok(data.includes('item-list'), 'Получены неверные данные от Rudata при получении данных')
	}).timeout(10000)
})

function getFilters(data) {
	const jsonFilters = utils.xml2obj(data.toString('utf16le'), { arrayMode: true })
	const packageData = jsonFilters['filters-list'] ? true : false

	let filtersList
	if (packageData) {
		filtersList = jsonFilters['filters-list'][0]['filters']
		if (!filtersList) {
			throw new Error(`Получен неверный список фильтров для пакетного запроса.`)
		}
	} else {
		filtersList = jsonFilters['filters'][0]
		if (!filtersList) {
			throw new Error(`Получен неверный список фильтров для запроса.`)
		}
	}
	return { filtersList, packageData }
}
