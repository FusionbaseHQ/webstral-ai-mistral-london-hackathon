import React from 'react'
import classNames from '../../../common/utils/classNames'

export default function Label({ children, className, ...props }) {

    return (
        <label
            className={classNames(
                'block text-sm font-semibold leading-6 text-gray-900 dark:text-slate-100 mb-2.5',
                className
            )}
            {...props}
        >{children}</label>
    )
}
