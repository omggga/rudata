'use strict'

const fetch = require('node-fetch')
const AbortController = require('abort-controller')
const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser')

const RM_PI_REGEX = /<\?(?!xml ).*?\?>[\r\n]*/g

const defaultProps = {
	method: 'GET',
	headers: {}
}

const defaultRetryOptions = {
	attemptsLimit: 5,
	interval: 1000
}

async function request(url, opts, timeout = 30000) {
	const controller = new AbortController()
	const signal = controller.signal

	const options = Object.assign({}, defaultProps, { signal }, opts)
	const requestTimeout = setTimeout(() => {
		controller.abort()
	}, timeout)

	try {
		const response = await fetch(url, options)
		return response
	} finally {
		clearTimeout(requestTimeout)
	}
}

function requestUntilSuccess(url, options, timeout = 30000, retryOptions) {
	const retryOpts = Object.assign({}, defaultRetryOptions, retryOptions)
	return execUntilSuccess(request, this, [url, options, timeout], retryOpts)()
}

function execUntilSuccess(fn, thisCtx, args, options) {
	let attempts = 0

	return async function exec() {
		try {
			return await fn.apply(thisCtx, args)
		} catch (err) {
			if (++attempts > options.attemptsLimit) throw err

			return new Promise((resolve, reject) => {
				setTimeout(async () => {
					try {
						return resolve(await exec())
					} catch (err) {
						return reject(err)
					}
				}, options.interval)
			})
		}
	}
}

const xml2jsonOptions = {
	attributeNamePrefix: '@',
	ignoreAttributes: false
}

const json2xmlOptions = {
	attributeNamePrefix: '@',
	ignoreAttributes: false,
	suppressEmptyNode: true,
	tagValueProcessor: (tagName, tagValue) => escapeValue(tagValue),
	attributeValueProcessor: (name, value) => escapeAttrValue(value)
}

function xml2obj(data, options) {
	const xmlParser = new XMLParser({ ...xml2jsonOptions, ...options })
	return xmlParser.parse(data)
}

function obj2xml(data, options) {
	const builder = new XMLBuilder({ ...json2xmlOptions, ...options })
	return builder.build(data)
}

function validate(data) {
	return XMLValidator.validate(data)
}

function escapeValue(value) {
	if (typeof value === 'string') {
		return value.replace(/&(?!(?:apos|quot|[gl]t|amp);|#)|>|</g, function(char) {
			switch (char) {
				case '&':
					return '&amp;'
				case '>':
					return '&gt;'
				case '<':
					return '&lt;'
			}
		})
	}
	return value
}

function escapeAttrValue(value) {
	if (typeof value === 'string') {
		return value.replace(/&(?!(?:apos|quot|[gl]t|amp);|#)|>|<|"|'/g, function(char) {
			switch (char) {
				case '&':
					return '&amp;'
				case '>':
					return '&gt;'
				case '<':
					return '&lt;'
				case '"':
					return '&quot;'
				case "'":
					return '&apos;'
			}
		})
	}
	return value
}

function removeProcessingInstructions(xmlBuf) {
	const xmlStr = xmlBuf.toString()
	return Buffer.from(xmlStr.replace(RM_PI_REGEX, ''))
}

module.exports = {
	request,
	requestUntilSuccess,
	execUntilSuccess,
	xml2obj,
	obj2xml
}
