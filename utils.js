'use strict'

const fetch = require('node-fetch')
const AbortController = require('abort-controller')
const xmlParser = require('fast-xml-parser')
const Parser = require('fast-xml-parser').j2xParser

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
	supressEmptyNode: true,
	tagValueProcessor: (value) => escapeValue(value),
	attrValueProcessor: (value) => escapeAttrValue(value)
}

function xml2obj(data, options) {
	return xmlParser.parse(data, Object.assign({}, xml2jsonOptions, options))
}

function obj2xml(data, options) {
	const parser = new Parser(Object.assign({}, json2xmlOptions, options))
	return parser.parse(data)
}

function validate(data) {
	return xmlParser.validate(data)
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

module.exports = {
	request,
	requestUntilSuccess,
	execUntilSuccess,
	xml2obj,
	obj2xml
}
