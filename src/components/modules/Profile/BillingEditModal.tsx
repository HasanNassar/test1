import { identityService } from '@service/identity'
import { useTranslation } from 'next-i18next'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useQueryClient } from 'react-query'
import styled from 'styled-components'
import { paymentCacheKeys, paymentService } from '../../../service/payment'
import { Cross } from '../../global/icons/Cross'
import { Modal } from '../../global/Modal'

type FormData = {
    billingName: string
    addressLine1: string
    addressLine2: string
    city: string
    region: string
    zipCode: string
    country: string
}

export const BillingEditModal: React.FC<{
    billingId: string
    setModal: React.Dispatch<React.SetStateAction<string | undefined>>
}> = ({ setModal, billingId }) => {
    const { t } = useTranslation()
    const { USER_BILLING_ADDRESS } = paymentCacheKeys
    const { data, isLoading, error } = useQuery(USER_BILLING_ADDRESS, () =>
        paymentService.getUserBillingAddress(billingId),
    )

    const { data: userData } = useQuery('user', identityService.getMe)
    const queryClient = useQueryClient()

    const {
        register,
        setValue,
        handleSubmit,
        getValues,
        reset,

        formState: { errors },
    } = useForm<FormData>()

    useEffect(() => {
        if (data?.data) {
            reset({
                billingName: data.data.billingName || '',
                addressLine1: data.data?.addressLine1 || '',
                addressLine2: data.data?.addressLine2 || '',
                city: data.data?.city || '',
                region: data.data?.region || '',
                zipCode: data.data?.zipCode || '',
                country: data.data?.country || '',
            })
        }
    }, [data])

    const onSubmit = async (e) => {
        e.preventDefault()
        const userBillingAddress = getValues()
        const res = await paymentService.putUserBillingAddress(billingId, {
            ...userBillingAddress,
        })
        if (res.status === 201) {
            queryClient.invalidateQueries(USER_BILLING_ADDRESS)
        }
        setModal(undefined)
    }
    if (isLoading || error) return null

    return (
        <Modal wrapperComponent={ModalWrapper} setModal={() => setModal(undefined)}>
            <form onSubmit={onSubmit}>
                <Wrapper>
                    <FlexContainer>
                        <Heading>{t('profileBillingDetailsHeader', 'Individual billing details')}</Heading>
                        <div onClick={() => setModal(undefined)}>
                            <Cross />
                        </div>
                    </FlexContainer>

                    <InputListWrapper>
                        <InputListItem key="0">
                            <InputLabel htmlFor="0">{t('profileIndividualBillingName', 'Billing name')}</InputLabel>
                            <InputField {...register('billingName')} editable={true} />
                        </InputListItem>
                    </InputListWrapper>

                    <SubHeading>{t('profileIndividualBillingAddressHeadline', 'Billing address')}</SubHeading>
                    <InputListWrapper>
                        <InputListItem key="1">
                            <InputLabel htmlFor="1">
                                {t('profileIndividualBillingAddress', 'Address line 1')}
                            </InputLabel>
                            <InputField {...register('addressLine1')} editable={true} />
                        </InputListItem>
                    </InputListWrapper>
                    <InputListWrapper>
                        <InputListItem key="2">
                            <InputLabel htmlFor="2">
                                {t('profileIndividualBillingAddressLine2', 'Address line 2')}
                            </InputLabel>
                            <InputField {...register('addressLine2')} editable={true} />
                        </InputListItem>
                    </InputListWrapper>

                    <Container>
                        <CityWrapper>
                            <InputListItem key="4">
                                <InputLabel htmlFor="4">{t('profileIndividualBillingCity', 'city')}</InputLabel>
                                <InputField {...register('city')} editable={true} />
                            </InputListItem>
                        </CityWrapper>
                    </Container>
                    <InputListWrapper>
                        <InputListItem key="5">
                            <InputLabel htmlFor="5">{t('profileIndividualBillingState', 'State/province')}</InputLabel>
                            <InputField {...register('region')} editable={true} />
                        </InputListItem>
                    </InputListWrapper>
                    <InputListWrapper>
                        <InputListItem>
                            <InputLabel htmlFor="5">{t('profileIndividualBillingCountry', 'Country')}</InputLabel>
                            <SelectField id="countries" {...register('country')}>
                                <option value="United Arab Emirates">
                                    {t('profileIndividualBillingCountryUAE', 'United Arab Emirates')}
                                </option>
                                <option value="Hungary">{t('profileIndividualBillingCountryHU', 'Hungary')}</option>
                            </SelectField>
                        </InputListItem>
                    </InputListWrapper>
                    <CenterContainer>
                        <SaveButton type="submit">{t('profileIndividualBillingButtonSave', 'Save')}</SaveButton>
                        <Cancel onClick={() => setModal(undefined)}>
                            {t('profileIndividualBillingButtonCancel', 'Cancel')}
                        </Cancel>
                    </CenterContainer>
                </Wrapper>
            </form>
        </Modal>
    )
}

const ModalWrapper = styled.div`
    position: fixed;
    z-index: 50;
    overflow-y: scroll;
    inset: 0;
    background: white;
    padding-bottom: 5rem;
`

const Wrapper = styled.div`
    padding: var(--padding);
    background: white;
    & > ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }
`

const Heading = styled.h1`
    color: rgba(0, 0, 0, 1);
    font-weight: 800;
    font-size: 24px;
    margin: 0;
`

const SubHeading = styled.h4`
    font-weight: 800;
    font-size: 16px;
    margin: 8px 0 1rem 0;
    color: rgba(0, 0, 0, 1);
`

const InputListItem = styled.li`
    display: flex;
    flex-direction: column;
    width: 100%;
`

const InputListWrapper = styled.div`
    display: flex;
    margin-bottom: var(--padding);
`

const CityWrapper = styled.div`
    display: flex;
    margin-bottom: var(--padding);
    flex: 1;
`

const ZipWrapper = styled.div`
    display: flex;
    margin-bottom: var(--padding);
    max-width: 120px;
`

const InputLabel = styled.label<{ htmlFor: string }>`
    font-weight: 600;
    font-size: 10px;
    line-height: 14px;
    text-transform: uppercase;
    color: rgba(0, 0, 0, 0.4);
    margin-bottom: 0.5rem;
`

const InputField = styled.input<{ id?: string; editable: boolean }>`
    height: 48px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 4px;
    border: none;
    padding: 0 1rem;
    font-weight: var(--weight-bold);
    font-size: 14px;
    color: ${(props) => (props.editable ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.4)')};
    :focus {
        outline: none;
    }
`

const SaveButton = styled.button`
    background: #ff5a5a;
    border-radius: 100px;
    color: white;
    font-size: var(--size-16);
    font-weight: var(--weight-bold);
    border: none;
    padding: 1rem;
    width: 100%;
    margin-top: 1rem;
    margin-bottom: 24px;
`

const Cancel = styled.h5`
    font-weight: bold;
    font-size: 16px;
    color: rgba(255, 90, 90, 1);
    margin: 0;
`
const FlexContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
`

const Container = styled.div`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    align-items: center;
    column-gap: 24px;
`
const CenterContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
`

const SelectField = styled.select`
    height: 48px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 4px;
    border: none;
    padding: 0 1rem;
    font-weight: var(--weight-bold);
    font-size: 14px;
    color: rgba(0, 0, 0, 0.8);
    :focus {
        outline: none;
    }
`
