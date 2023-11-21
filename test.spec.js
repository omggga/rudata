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

	const testCases = [
		{
			name: 'getEndOfDayOnExchanges',
			xml: `<filters>
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
					</filters>`,
			apiMethod: 'getEndOfDayOnExchanges',
			timeout: 10000
		},
		{
			name: 'getInstruments',
			xml: `<filters>
					<filter>UPDATE_DATE > #${moment().format('YYYY-MM-DD')}#</filter>
					</filters>`,
			apiMethod: 'getInstruments',
			timeout: 25000
		},
		{
			name: 'getSecurities',
			xml: `<filters>
					<filter>UPDATE_DATE > #${moment().format('YYYY-MM-DD')}#</filter>
					</filters>`,
			apiMethod: 'getSecurities',
			timeout: 5000
		},
		{
			name: 'getConstituents',
			xml: `<filters>
					<fintoolIds>
						<fintoolId>108162</fintoolId>
					</fintoolIds>
					<dateFrom>2022-04-01</dateFrom>
					<dateTo>2022-04-04</dateTo>
					</filters>`,
			apiMethod: 'getConstituents',
			timeout: 10000
		},
		{
			name: 'getArchiveHistory',
			xml: `<filters>
					<issId>139590</issId>
					<dateFrom>2022-04-01</dateFrom>
					<dateTo>2022-04-04</dateTo>
					<step>1440</step>
					</filters>`,
			apiMethod: 'getArchiveHistory',
			timeout: 5000
		},
		{
			name: 'getSecurityRatingsHist',
			xml: `<filters>
					<dateFrom>2022-04-03</dateFrom>
					<dateTo>2022-04-04</dateTo>
					</filters>`,
			apiMethod: 'getSecurityRatingsHist',
			timeout: 5000
		},
		{
			name: 'getRiskFee',
			xml: `<filters>
					<date>2022-04-11</date>
					<curveCode>MOEX.RUB.ZCYC</curveCode>
					</filters>`,
			apiMethod: 'getRiskFee',
			timeout: 5000
		},
		{
			name: 'getClassification',
			xml: `<filters>
					<filters>id_fintool in (6044,9387,20386,20561,82026,87551,87883,90641,91503,96612,99118,120738,120739,120851,122117) and id_type_group in ( 3, 62 )</filters>
					</filters>`,
			apiMethod: 'getClassification',
			timeout: 5000
		},
		{
			name: 'getDateOptions',
			xml: `<filters>
					<symbol>USU5007TAA35</symbol>
					<date>2022-04-03</date>
					<isCloseRegister>true</isCloseRegister>
					<useFixDate>true</useFixDate>
					</filters>`,
			apiMethod: 'getDateOptions',
			timeout: 5000
		},
		{
			name: 'getCompanyRatingsHist',
			xml: `<filters>
					<id>95023</id>
					<dateFrom>2022-03-24</dateFrom>
					<dateTo>2022-04-01</dateTo>
					</filters>`,
			apiMethod: 'getCompanyRatingsHist',
			timeout: 10000
		},
		{
			name: 'getShareDividend',
			xml: `<filters>
					<filter>UPDATE_DATE > #${moment().format('YYYY-MM-DD')}#</filter>
					</filters>`,
			apiMethod: 'getShareDividend',
			timeout: 5000
		},
		{
			name: 'getShareDividendById',
			xml: `<filters>
					<id>126738</id>
					</filters>`,
			apiMethod: 'getShareDividendById',
			timeout: 5000
		},
		{
			name: 'getCorporateActions',
			xml: `<filters>
					<filter>UPDATE_DATE > #${moment().format('YYYY-MM-DD')}#</filter>
					</filters>`,
			apiMethod: 'getCorporateActions',
			timeout: 5000
		},
		{
			name: 'getCurrencyRate',
			xml: `<filters>
					<from>USD</from>
					<to>RUB</to>
					<date>2022-05-24</date>
					</filters>`,
			apiMethod: 'getCurrencyRate',
			timeout: 5000
		},
		{
			name: 'getEndOfDay',
			xml: `<filters-list>
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
					</filters-list>`,
			apiMethod: 'getEndOfDay',
			timeout: 10000
		}
	]

	testCases.forEach(({ name, xml, apiMethod, timeout }) => {
		it(name, async () => {
			const { filtersList } = getFilters(xml)
			const data = await api[apiMethod](filtersList)
			assert.ok(data.includes('item-list'), `Incorrect data received from Rudata for ${name}`)
		}).timeout(timeout)
	})

	function getFilters(xml) {
		const jsonFilters = utils.xml2obj(xml, { arrayMode: true })
		const packageData = jsonFilters['filters-list'] ? true : false

		let filtersList
		if (packageData) {
			filtersList = jsonFilters['filters-list'][0]['filters']
			if (!filtersList) {
				throw new Error('Invalid filter list for batch request.')
			}
		} else {
			filtersList = jsonFilters['filters'][0]
			if (!filtersList) {
				throw new Error('Invalid filter list for request.')
			}
		}
		return { filtersList, packageData }
	}
})
