import styled from 'styled-components'
import { MiniArrowRight } from '@components/global/icons/MiniArrowRight'
import { useRouter } from 'next/router'
import { addHours, format } from 'date-fns'
import { bookingService } from '@service/booking'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import Image from 'next/image'
import { getImageUrl } from '@util/images'
import { useTranslation } from 'next-i18next'

const Card = styled.div`
    display: flex;
    flex-direction: row;
    padding: 0 24px 0 0;
    max-height: 160px;
    background: #ffffff;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.04), 0px 2px 20px rgba(0, 0, 0, 0.08);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 24px;
    position: relative;
`
const CardContent = styled.div`
    display: flex;
    max-height: 160px;
    flex-direction: column;
    justify-content: space-between;
    padding: 14px 24px 24px 24px;
`

const imageParams = {
    width: 150,
    height: 160,
    fit: 'crop',
}

const ImageWrap = styled.div`
    width: ${imageParams.width}px;
    height: ${imageParams.height}px;
    position: relative;

    & img {
        object-fit: cover;
    }
`

const SmallHeading = styled.h4`
    font-weight: bold;
    font-size: 14px;
    margin: 0;
    color: #000000;
`

const Text = styled.p`
    font-weight: 500;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.8);
    margin: 0;
`

const ReturnDate = styled.p`
    font-weight: bold;
    font-size: 14px;
    line-height: 19px;
    color: #ff5a5a;
    margin: 0;
`

const CardContentWrapper = styled.div`
    display: flex;
    flex: 1;
    justify-content: space-between;
`

const ArrowWrapper = styled.div`
    display: flex;
    align-items: center;
`

const Recommended = styled.div`
    padding: 3px 7px;
    font-style: normal;
    font-weight: bold;
    font-size: 10px;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    background: #f5f5f5;
    mix-blend-mode: normal;
    text-transform: capitalize;
    width: fit-content;
`

export const MyRentalCard = ({ rental }) => {
    const { t } = useTranslation()
    const { push } = useRouter()

    const { listingId, bookingId, handbackTime, status } = rental

    const mockPic = 'MockCar.png'

    const findCoverImage = (photos: any) => {
        if (!photos || photos?.length === 0) {
            return mockPic
        }
        const foundCover = photos?.find((photo) => photo.isCover)
        return foundCover ? foundCover.imageKey : photos[0].imageKey
    }

    const { data, isError } = useQuery(['myrental', bookingId], async () => {
        return await bookingService.getListingById(listingId)
    })

    const rentalListing = data?.data

    const [coverImage, setCoverImage] = useState(mockPic)

    useEffect(() => {
        setCoverImage(findCoverImage(rentalListing?.photos))
    }, [rentalListing])

    if (!rental || !rentalListing || isError) {
        return null
    }

    const { make, model } = rentalListing

    const returnDate = new Date(handbackTime as string)
    const returnTime = rental.includeDelivery
        ? format(returnDate, 'YYY. MMM. d HH:mm') + ' - ' + format(addHours(returnDate, 2), 'HH:mm')
        : format(returnDate, 'YYY. MMM. d HH:mm')

    const filterStatus = (status: string) => {
        return status.toLowerCase().replace('_', ' ')
    }

    return (
        <Card className={'carCard'} onClick={() => push(`/dubai/booking/${bookingId}`)}>
            <ImageWrap>
                <Image
                    src={mockPic}
                    loader={() => getImageUrl(coverImage, imageParams)}
                    width={imageParams.width}
                    height={imageParams.height}
                />
            </ImageWrap>
            <CardContentWrapper>
                <CardContent>
                    <div>
                        <SmallHeading>{make}</SmallHeading>
                        <SmallHeading>{model}</SmallHeading>
                    </div>
                    <Recommended>{filterStatus(status)}</Recommended>
                    <div>
                        <Text>{t('myRentalCard.return', 'Return')}</Text>
                        <ReturnDate>{returnTime}</ReturnDate>
                    </div>
                </CardContent>
                <ArrowWrapper className={'iconSvgArrow'}>
                    <MiniArrowRight />
                </ArrowWrapper>
            </CardContentWrapper>
        </Card>
    )
}
