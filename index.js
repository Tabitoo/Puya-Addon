#!/usr/bin/env node
const express = require('express')
const serverless = require('./serverless')
const app = express()

app.use((req, res, next) => serverless(req, res, next));

module.exports = app
