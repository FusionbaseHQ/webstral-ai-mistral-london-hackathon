import React from 'react'
import Container from '../Container';
import classNames from '../../../common/utils/classNames';
import CopyInput from '../../Form/CopyInput';
import { useIntl } from 'react-intl';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';


export default function Header({ id, title, subtitle, type, breadcrumbs, children }) {

    const intl = useIntl()

    const createBreadcrumbs = (id, type, title, breadcrumbs = []) => {

        let label = null
        let url = null

        switch (type?.toLowerCase()) {
            case "stream":
                label = intl.formatMessage({
                    id: 'component.breadcrumb.label.data.stream',
                    description: 'label of breadcrumb for data type stream',
                    defaultMessage: 'Streams'
                })
                url = `/search/streams/${title}`
                break;
            case "service":
                label = intl.formatMessage({
                    id: 'component.breadcrumb.label.data.service',
                    description: 'label of breadcrumb for data type service',
                    defaultMessage: 'Services'
                })
                url = `/search/services/${title}`
                break;
            case "organization":
                label = intl.formatMessage({
                    id: 'component.breadcrumb.label.entity.organization',
                    description: 'label of breadcrumb for entity organization',
                    defaultMessage: 'Organizations'
                })
                url = !!id ? `/search/organizations/${title}` : `/search/organizations/organization`
                break;
            case "location":
                label = intl.formatMessage({
                    id: 'component.breadcrumb.label.entity.location',
                    description: 'label of breadcrumb for entity location',
                    defaultMessage: 'Locations'
                })
                url = !!id ? `/search/locations/${title}` : `/search/locations/location`
                break;
            case "person":
                label = intl.formatMessage({
                    id: 'component.breadcrumb.label.entity.person',
                    description: 'label of breadcrumb for entity person',
                    defaultMessage: 'Persons'
                })
                url = !!id ? `/search/persons/${title}` : `/search/persons/person`
                break;
            case "event":
                label = intl.formatMessage({
                    id: 'component.breadcrumb.label.entity.event',
                    description: 'label of breadcrumb for entity event',
                    defaultMessage: 'Events'
                })
                url = !!id ? `/search/events/${title}` : `/search/events/event`
                break;
            case "feature":
                label = intl.formatMessage({
                    id: 'component.breadcrumb.label.relation.feature',
                    description: 'label of breadcrumb for feature relation',
                    defaultMessage: 'Relations'
                })
                url = `/search/relations/${title}`
                break;
            case "relation":
                label = intl.formatMessage({
                    id: 'component.breadcrumb.label.relation',
                    description: 'label of breadcrumb for relation',
                    defaultMessage: 'Relations'
                })
                url = `/search/relations/${title}`
                break;
            default:
                break;
        }

        return [{
            label: label,
            url: url
        }, ...breadcrumbs]


    }

    const breadcrumbLinks = createBreadcrumbs(id, type, title, breadcrumbs)
    const inputWidth = id?.length + 5 || 10

    return (
        <>
            <div>
                <Container className={classNames(
                    'pt-8'
                )}>
                    {!!title &&
                        <div className='flex flex-col'>
                            <div className='space-y-3'>
                                <div className='flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 w-full'>
                                    <div className='flex flex-col sm:flex-row'>
                                        {breadcrumbLinks?.map(({ label, url }, index) => (
                                            <div className='flex items-center space-x-1' key={index}>
                                                <Link className='truncate text-sm text-gray-600 dark:text-slate-300 font-medium hover:text-primary dark:hover:text-primary cursor-pointer' href={url}>{label}</Link>
                                                <ChevronRightIcon className='w-3 h-3 text-gray-400' />
                                            </div>
                                        ))}
                                    </div>
                                    {!!id &&
                                        <div className='flex items-center w-full'>
                                            <CopyInput
                                                value={id}
                                                short
                                                style={{ width: `${inputWidth}ch` }}
                                                className="truncate !pl-1 pr-8 !bg-transparent dark:!bg-transparent !border-none !ring-0 text-gray-700 placeholder:text-gray-400 focus:ring-inset focus:ring-primary focus:border-primary text-sm font-medium border-slate-500 shadow-none"
                                                copyClassName='!bg-transparent dark:!bg-transparent !border-none text-gray-700 border-gray-500 shadow-none !rounded-full hover:!bg-gray-700/10 dark:hover:!bg-slate-200/10'
                                                wrapperClassName="w-full sm:w-fit"
                                            />
                                        </div>
                                    }
                                </div>
                                <div>
                                    <h1 className='text-text dark:text-textDark'>{title}</h1>
                                    {!!subtitle && <span className='text-subtext dark:text-subtextDark'>{subtitle}</span>}
                                </div>
                            </div>
                        </div>
                    }
                    {children}
                </Container>
            </div>
        </>
    )
}