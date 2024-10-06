import React from 'react'
import { string, bool, any } from 'prop-types'
import classNames from '../../../common/utils/classNames';


function PageHeading({ title, subtitle, center, className, ...props }) {

    return (
        <div className={classNames(
            className,
            'space-y-1 mb-10',
            !!center && 'text-center justify-center'
        )} {...props}>
            <h1 className="text-3xl tracking-tight text-gray-900 dark:text-white">{title}</h1>
            {!!subtitle &&
                <p className={classNames(
                    'text-subtext dark:text-subtextDark',
                    !!center ? 'text-center justify-center' : 'max-w-2xl'
                )}>{subtitle}</p>
            }
        </div>
    );
}

PageHeading.propTypes = {
    title: string.isRequired,
    subtitle: any,
    center: bool,
    className: string,
    props: any
}

export default PageHeading