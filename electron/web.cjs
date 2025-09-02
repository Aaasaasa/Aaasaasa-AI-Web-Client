const cheerio = require('cheerio')
// const fetch = require('node-fetch')
const fetch = global.fetch ?? ((...args) => import('node-fetch').then(({ default: f }) => f(...args)));

async function httpGet(url) {
  const res = await fetch(url, { redirect: 'follow' })
  const text = await res.text()
  return {
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
    body: text
  }
}

async function httpPost(url, body, headers = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body || {})
  })
  const text = await res.text()
  return {
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
    body: text
  }
}

function toReadable(html, baseUrl) {
  const $ = cheerio.load(html, { baseURI: baseUrl })

  const title = $('title').text().trim() || null
  const articleContent =
    $('article').text().trim() ||
    $('main').text().trim() ||
    $('body').text().trim()

  return {
    title,
    byline: null,
    content: articleContent || null,
    textContent: articleContent || null
  }
}

module.exports = {
  httpGet,
  httpPost,
  toReadable
}
