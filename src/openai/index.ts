import { OpenAI } from "openai"
import logger from "../logger"

class OpenAIClient {
  private client: OpenAI

  constructor() {
    if (!process.env.OPENAI_KEY || !process.env.OPENAI_URL) {
      logger.error('no openai key found')
      process.exit(1)
    }

    this.client = new OpenAI({apiKey: process.env.OPENAI_KEY})

    this.client.apiKey = process.env.OPENAI_KEY
    this.client.baseURL = process.env.OPENAI_URL
  }

  public async getPrompt(artist: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        messages: [{ role: "system", content: `Create a list of 10 comma separated words that describe the style of ${artist}. Limit of 10 words`}],
        model: 'gpt-3.5-turbo'
      })
      return response.choices?.[0]?.message?.content ?? ''
    } catch (e) {
      logger.error(e)
      return ''
    }
  }

  public async isArtist(artist: string): Promise<boolean> {
    const content = `I will provide the name of a potential artist and I want you to return a boolean 'true' or 'false' if the name supplied is an artist. Do not include any explanatory text - just the boolean. Artist: ${artist}`
    try {
      const response = await this.client.chat.completions.create({
        messages: [{role: 'system', content }],
        model: 'gpt-3.5-turbo'
      })

      const isArtist = response.choices[0].message.content === 'True'
      logger.info(`${artist}: ${isArtist}`)
      return isArtist
    } catch (e) {
      logger.error(`error verifying artist`)
      return false
    }
  }

  public async getImages(prompt: string): Promise<string[]> {
    const promptFormat = `Generate an image with no next from this description: ${prompt}`

    try {
      const response = await this.client.images.generate({
        model: 'dall-e-2',
        prompt: promptFormat,
        size: "1024x1024",
        quality: 'standard',
        n: 5,
      })

      return response.data.map(image => image.url ?? '')
    } catch (e) {
      logger.error(e)
      return []
    }
  }
}

export const AIClient =  new OpenAIClient()

export default OpenAIClient