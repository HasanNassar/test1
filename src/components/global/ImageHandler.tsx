import Image from 'next/image'
import { useState } from 'react'

export const ImageHandler = ({ imageUrl, fallbackImageUrl, ...props }) => {
    const [src, setSrc] = useState(imageUrl)
    return <Image {...props} src={src} onError={() => setSrc(fallbackImageUrl)} />
}
