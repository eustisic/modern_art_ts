import { S3 } from 'aws-sdk'
import axios from 'axios'
import logger from '../logger'

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})

const uploadImageFromUrl = async (imageUrl: string, artist: string): Promise<AWS.S3.ManagedUpload.SendData> => {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'stream'
    })
    const id = Math.random().toString(16).slice(2)

    const key = `${artist}/${id}`

    if (!process.env.S3_BUCKET) {
      logger.error('no bucket provided')
      throw new Error('no bucket provided')
    }
    logger.info(`uploading ${key}`)

    return s3.upload({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: response.data,
      ContentType: 'image/png'
    }).promise()
  } catch (e) {
    logger.error(`error uploading image for ${artist}`)
    throw e
  }
}

export const uploadImages = async (imageUrls: string[], artist: string) => {
  const uploadPromises = imageUrls.map((imageUrl) => 
        uploadImageFromUrl(imageUrl, artist)
    )
    
    try {
        const results = await Promise.all(uploadPromises);
        logger.info('All images have been uploaded successfully')
        return results;
    } catch (error) {
        logger.error('An error occurred:', error)
        throw error;
    }
}