import fetch from 'node-fetch'
import AbortController from 'abort-controller'
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser'

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
	const { signal } = controller

	const options = { ...defaultProps, signal, ...opts }
	const requestTimeout = setTimeout(() => controller.abort(), timeout)

	try {
		return await fetch(url, options)
	} finally {
		clearTimeout(requestTimeout)
	}
}

async function requestUntilSuccess(url, options, timeout = 30000, retryOptions = {}) {
	const retryOpts = { ...defaultRetryOptions, ...retryOptions }
	return execUntilSuccess(request, null, [url, options, timeout], retryOpts)()
}

async function execUntilSuccess(fn, thisCtx, args, { attemptsLimit, interval }) {
	let attempts = 0
	const exec = async () => {
		try {
			return await fn.apply(thisCtx, args)
		} catch (err) {
			if (++attempts > attemptsLimit) throw err
			await new Promise((resolve) => setTimeout(resolve, interval))
			return exec()
		}
	}
	return exec()
}

const xml2jsonOptions = {
	attributeNamePrefix: '@',
	ignoreAttributes: false
}

const json2xmlOptions = {
	...xml2jsonOptions,
	suppressEmptyNode: true,
	tagValueProcessor: (tagName, tagValue) => escapeValue(tagValue),
	attributeValueProcessor: (name, value) => escapeAttrValue(value)
}

const xml2obj = (data, options = {}) => new XMLParser({ ...xml2jsonOptions, ...options }).parse(data)

const obj2xml = (data, options = {}) => new XMLBuilder({ ...json2xmlOptions, ...options }).build(data)

const validate = XMLValidator.validate

const escapeValue = (value) =>
	typeof value === 'string'
		? value.replace(
				/&(?!(?:apos|quot|[gl]t|amp);|#)|>|</g,
				(char) => ({ '&': '&amp;', '>': '&gt;', '<': '&lt;' }[char])
		  )
		: value

const escapeAttrValue = (value) =>
	typeof value === 'string'
		? value.replace(
				/&(?!(?:apos|quot|[gl]t|amp);|#)|>|<|"|'/g,
				(char) => ({ '&': '&amp;', '>': '&gt;', '<': '&lt;', '"': '&quot;', "'": '&apos;' }[char])
		  )
		: value

const removeProcessingInstructions = (xmlBuf) => Buffer.from(xmlBuf.toString().replace(RM_PI_REGEX, ''))

export { request, requestUntilSuccess, execUntilSuccess, xml2obj, obj2xml }
