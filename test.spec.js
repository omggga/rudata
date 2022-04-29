'use strict'

const assert = require('assert')
const moment = require('moment')

const Api = require('./api')
const config = require('./config')
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

		const filtersList = getFilters(xml)
		const data = await api.getEndOfDayOnExchanges(filtersList)
		assert.ok(data.includes('item-list'), 'Получены неверные данные от Rudata при получении данных')
	}).timeout(10000)

	it(`getInstruments`, async () => {
		const xml = `<filters>
			<filter>UPDATE_DATE > #${moment().format('YYYY-MM-DD')}#</filter>
		</filters>`

		const filtersList = getFilters(xml)
		const data = await api.getInstruments(filtersList)
		assert.ok(data.includes('item-list'), 'Получены неверные данные от Rudata при получении данных')
	}).timeout(25000)

	it(`getSecurities`, async () => {
		const xml = `<filters>
			<filter>UPDATE_DATE > #${moment().format('YYYY-MM-DD')}#</filter>
		</filters>`

		const filtersList = getFilters(xml)
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

		const filtersList = getFilters(xml)
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

		const filtersList = getFilters(xml)
		const data = await api.getArchiveHistory(filtersList)
		assert.ok(data.includes('item-list'), 'Получены неверные данные от Rudata при получении данных')
	}).timeout(5000)

	it(`getSecurityRatingsHist`, async () => {
		const xml = `<filters>
			<dateFrom>2022-04-03</dateFrom>
			<dateTo>2022-04-04</dateTo>
		</filters>`

		const filtersList = getFilters(xml)
		const data = await api.getSecurityRatingsHist(filtersList)
		assert.ok(data.includes('item-list'), 'Получены неверные данные от Rudata при получении данных')
	}).timeout(5000)

	it(`getRiskFee`, async () => {
		const xml = `<filters>
			<date>2022-04-11</date>
			<curveCode>MOEX.RUB.ZCYC</curveCode>
		</filters>`

		const filtersList = getFilters(xml)
		const data = await api.getRiskFee(filtersList)
		assert.ok(data.includes('term'), 'Получены неверные данные от Rudata при получении данных')
	}).timeout(5000)

	it(`getClassification`, async () => {
		const xml = `<filters>
			<filters>id_fintool in (6044,9387,20386,20561,82026,87551,87883,90641,91503,96612,99118,120738,120739,120851,122117,123573,124705,124839,125767,126096,126668,126957,127147,127328,127429,127430,128333,128646,129540,129559,129819,130151,131385,132432,132681,133004,133512,133687,133688,135444,135988,136022,137450,137539,137673,138182,138309,138425,138617,138658,139181,139351,139592,139944,140412,146323,146660,147633,149183,150644,150717,151052,151193,151340,151631,151675,151723,151774,152185,152430,154891,155051,155311,155716,155750,156569,156608,156683,156751,156890,156936,157056,157280,157954,158184,158426,158617,159234,160479,161273,161275,161696,161724,161875,162004,162209,162459,162767,162841,162842,162933,164109,164816,164885,164951,166360,166366,166370,166408,166723,167832,167836,169421,169476,170031,170388,170462,170716,170717,170851,170900,171002,171025,171172,171232,172026,172042,172043,172355,172376,173050,173295,173398,174254,174480,175239,175282,175297,175539,175959,176138,176814,177649,177841,179135,179155,179574,179800,179822,180344,181667,182440,183148,183165,183551,183839,184648,184931,184993,185012,185017,185037,185235,185466,185643,185726,185782,185842,185896,185980,186484,187167,187474,187559,189679,190598) and id_type_group in ( 3, 62 )</filters>
		</filters>`

		const filtersList = getFilters(xml)
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

		const filtersList = getFilters(xml)
		const data = await api.getDateOptions(filtersList)
		assert.ok(data.includes('couponDate'), 'Получены неверные данные от Rudata при получении данных')
	}).timeout(5000)

	it(`getCompanyRatingsHist`, async () => {
		const xml = `<filters>
			<id>95023</id>
			<dateFrom>2022-03-24</dateFrom>
			<dateTo>2022-04-01</dateTo>
		</filters>`

		const filtersList = getFilters(xml)
		const data = await api.getCompanyRatingsHist(filtersList)
		assert.ok(data.includes('rating_id'), 'Получены неверные данные от Rudata при получении данных')
	}).timeout(10000)
})

function getFilters(data) {
	const jsonFilters = utils.xml2obj(data, { arrayMode: true })
	return jsonFilters['filters'][0]
}
