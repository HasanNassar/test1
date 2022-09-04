import { config } from './config'

type ImageUrlParams = {
    width: number
    height?: number
    aspectRatio?: string
    fit?: string
}

export const getImageUrl = (imageKey: string, params: ImageUrlParams) => {
    if (imageKey.startsWith(config.IMAGIN_STUDIOS_BASE_URL)) {
        return imageKey + `&width=${params.width}`
    }

    const imageParams = new URLSearchParams({
        w: params.width.toString(),
        h: params.height?.toString() || '',
        ar: params.aspectRatio || '',
        fit: params.fit || '',
    })
    return `${config.IMAGEX_URL}/${imageKey}?${imageParams.toString()}`
}
