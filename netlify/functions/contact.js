const nodemailer = require('nodemailer')
const { username } = require('os').userInfo()

const transporter = nodemailer.createTransport({
  host: 'smtp.eu.mailgun.org',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
})

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
}

async function handler(event) {
  // Logger
  const runId = Date.now().toString().slice(-5)
  const log = (...args) => console.log(runId, ...args)

  // CORS
  const origin = new URL(event.headers.origin)
  const acceptable =
    origin.hostname === 'localhost' &&
    username ===
      'sitek' /* ||

    # TODO

    origin.hostname === 'macieksitkowski.com'
    */

  if (!acceptable) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Unacceptable request' }),
      headers,
    }
  }
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      body: 'CORS ok',
      headers,
    }
  }

  const { name, body, ...otherData } = JSON.parse(event.body)

  const otherDataString = JSON.stringify(otherData, null, 2)

  const text = `${body}\n\n---\n\nOther form data:\n\`\`\`\n${otherDataString}\n\`\`\`\n`

  const message = {
    from: 'msitkowski94@gmail.com',
    to: `msitkowski94@gmail.com`,
    subject: `Email from ${name}`,
    text,
    /* # TODO
         html */
  }

  console.log(message)
  try {
    log('> Sending...')
    await transporter.verify()
    await transporter.sendMail(message)
    log('> Send success!')
  } catch (error) {
    log('> Send failure!',error, error.message)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
      headers,
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
    headers,
  }
}

module.exports = { handler }
