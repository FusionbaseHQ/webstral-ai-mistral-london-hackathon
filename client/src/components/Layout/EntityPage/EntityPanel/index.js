import React, { Fragment } from 'react'
import { useRouter } from 'next/router'
import Badge from '../../../Badge'
import Button from '../../../Button'
import { FormattedMessage, useIntl } from 'react-intl'
import classNames from '../../../../common/utils/classNames'
import resolveAddressComponents from '../../../../common/utils/resolveAddressComponents'

export default function EntityPanel({ entityId, title, type, address, children }) {

    const {
        house_number,
        street,
        postal_code,
        city,
        country,
        state,
        display_address
    } = resolveAddressComponents(address)

    const router = useRouter()
    const intl = useIntl()

    //Url to redirect to the playground when clicking on get data button
    let ENTITY_URL = `/data/entity/${encodeURIComponent(type)}/${encodeURIComponent(entityId)}/${encodeURIComponent(title)}`

    //Returns the correct internationalized label for entity badge
    const createBadge = (type) => {
        let label = null
        switch (type) {
            case "organization":
                label = intl.formatMessage({
                    id: 'component.badge.label.entity.organization',
                    description: 'label of badge for entity organization',
                    defaultMessage: 'Organization'
                })
                break;
            case "location":
                label = intl.formatMessage({
                    id: 'component.badge.label.entity.location',
                    description: 'label of badge for entity location',
                    defaultMessage: 'Location'
                })
                break;
            case "person":
                label = intl.formatMessage({
                    id: 'component.badge.label.entity.person',
                    description: 'label of badge for entity person',
                    defaultMessage: 'Person'
                })
                break;
            case "event":
                label = intl.formatMessage({
                    id: 'component.badge.label.entity.event',
                    description: 'label of badge for entity event',
                    defaultMessage: 'Event'
                })
                break;
            default:
                break;
        }

        return label
    }

    return (
        <div className='w-full sm:p-2 lg:p-4 mx-1 sm:mx-2 lg:mx-4 text-white bg-gradient-to-br from-slate-700/80 to-slate-900/40 bg-clip-padding backdrop-filter backdrop-blur-2xl shadow-lg border-slate-900 rounded-lg'>
            <div className={classNames(
                '-mx-4 px-4 space-y-4',
                !!children && 'border-b border-slate-100/10 mb-4 pb-4'
            )}>
                <div className='flex'>
                    <Badge size="xs" className="!bg-emerald-500/10 !border-emerald-500 !border !font-mono !text-emerald-500">{createBadge(type)}</Badge>
                </div>
                <div className='flex flex-col'>
                    {type === 'organization' &&
                        <Fragment>
                            <h1 className='font-medium text-white'>{title}</h1>
                            <span className='text-slate-300'>{street} {house_number}</span>
                            <span className='text-slate-300'>{postal_code + ' ' + city}</span>
                        </Fragment>
                    }
                    {type === 'location' &&
                        <Fragment>
                            <h1 className='font-medium text-white'>{street ? `${street} ${house_number ? house_number : ''}` : title}</h1>
                            {postal_code && city && <span className='text-slate-300'>{postal_code + ' ' + city}</span>}
                            <span className='text-slate-300'>{country}</span>
                        </Fragment>
                    }
                    {type === 'person' &&
                        <Fragment>
                            <h1 className='font-medium text-white'>{title}</h1>
                            <span className='text-slate-300'>{city}, {country}</span>
                        </Fragment>
                    }
                    {type === 'event' &&
                        <Fragment>
                            <h1 className='font-medium text-white'>{title}</h1>
                            <span className='text-slate-300'>{city}</span>
                            <span className='text-slate-300'>{country}</span>
                        </Fragment>
                    }
                </div>
                <div className='flex space-x-2'>
                    <Button look='primary' size='sm' onClick={() => router.push(ENTITY_URL)}>
                        <FormattedMessage
                            id="component.button.label.get_data"
                            description="button label for main call to action get data"
                            defaultMessage="API Playground"
                        />
                    </Button>
                </div>
            </div>
            {children}
        </div>
    )
}