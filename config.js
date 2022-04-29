'use strict'

require('dotenv').config()

module.exports = {
	rudat: {
		user: process.env.RUDATUSER,
		pass: process.env.RUDATPASS,
		url: 'https://dh2.efir-net.ru/v2'
	}
}
