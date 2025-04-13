import dotenv from "dotenv"
import twilio from "twilio"

dotenv.config() // Load environment variables

const accountSid: string = process.env.TWILIO_ACCOUNT_SID || ""
const token: string = process.env.TWILIO_AUTH_TOKEN || ""
const from: string = process.env.TWILIO_MESSAGING_SERVICE_SID || ""

const client = twilio(accountSid, token)

/**
 * Sends an SMS message to multiple recipients.
 * @param recipients - An array of phone numbers.
 * @param messageBody - The message content.
 */
export const sendMessages = async (
  recipients: string[],
  messageBody: string
) => {
  console.log({ accountSid, token, from })
  const sendPromises = recipients.map(async (to) => {
    try {
      const message = await client.messages.create({
        from: from,
        to: to,
        body: messageBody,
      })
      console.log({ message })
      console.log(`Message sent to ${to}: ${message.sid}`)
    } catch (error) {
      console.error(`Failed to send message to ${to}:`, error)
    }
  })

  await Promise.all(sendPromises)
}

export const getMessages = async (limit: number = 20) => {
  try {
    const messages = await client.messages.list({
      limit: limit,
    })

    console.log("Listing messages:")
    messages.forEach((message) => {
      console.log(
        `SID: ${message.sid}, To: ${message.to}, Status: ${message.status}, Body: ${message.body}`
      )
    })
  } catch (error) {
    console.error("Failed to fetch messages:", error)
  }
}

// Example usage
const recipientsList: string[] = ["+265888234314"]

sendMessages(recipientsList, "Ahoy from Node.js!")

getMessages()
