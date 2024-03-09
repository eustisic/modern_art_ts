import type { Request, Response } from "express"
import logger from "../logger"
import { KVSTORE } from "../kvstore"
import { AIClient} from "../openai"
import { uploadImages } from "./uploadImages"

const promptHandler = async (req: Request, res: Response) => {
  let query = req.query.q

  if (!query || typeof query !== 'string') {
    logger.log('info', 'no query string found')
    res.status(400).send(JSON.stringify({message: 'bad request'}))
    return
  }

  const artist = (query as string).toUpperCase()

  let prompt: string | undefined, found: boolean, err: string

  if (!KVSTORE.has(artist)) {

    found = await AIClient.isArtist(artist)

    if (!found) {
      res.status(404).send(JSON.stringify({message: 'artist not found'}))
      return
    }
    // get prompt form open ai
    // insert into store
    prompt = await AIClient.getPrompt(artist)
    if (prompt && prompt.length) {
      KVSTORE.set(artist, prompt)
    } else {
      err = `error getting prompt for ${artist}`
      logger.error(err)
      res.status(500).send(JSON.stringify({message: err}))
      return
    }
  }

  // get prompt form store
  prompt = KVSTORE.get(artist) as string

  // generate images and get image urls from prompt
  const imageUrls = await AIClient.getImages(prompt)

  try {
    // upload images to s3
    await uploadImages(imageUrls, artist)
    res.status(200).send(JSON.stringify({message: 'success'}))
  } catch (e) {
    res.status(500).send(JSON.stringify({error: e}))
  }
}

export default promptHandler