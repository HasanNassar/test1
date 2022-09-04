import styled from 'styled-components'
import Image from 'next/image'
import { getImageUrl } from '@util/images'
import { useMediaQuery } from '@hooks/mediaQuery'
import { device } from '@util/responsive'

export const CarImage = ({ src }: { src: string }) => {
    const isDesktop = useMediaQuery(device.laptop)

    const mockPic = 'MockCar.png'

    const imageParams = {
        width: isDesktop ? 1920 : 960,
        height: isDesktop ? 1080 : 540,
        aspectRatio: '16:9',
        fit: 'crop',
    }

    if (!src) {
        return null
    }

    return (
        <Image
            src={mockPic}
            loader={() => getImageUrl(src, imageParams)}
            width={imageParams.width}
            height={imageParams.height}
        />
    )
}
