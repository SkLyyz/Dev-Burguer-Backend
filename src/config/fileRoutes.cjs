const express = require('express')
const { resolve } = require('node:path')

const uploadPath = resolve(__dirname, '..', '..', 'uploads')
const fileRouteConfig = express.static(uploadPath)

module.exports = fileRouteConfig