import React from 'react'
import classNames from '../../../common/utils/classNames'

export default function Input({className, ...props}) {

    return (
        <input
            {...props}
            className={classNames(
                className,
                'block w-full bg-white dark:bg-slate-800 rounded-md border-0 px-3.5 py-2 text-gray-900 dark:text-slate-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-slate-700 placeholder:text-gray-400 focus:ring-inset sm:leading-6 focus:ring-primary focus:border-primary sm:text-sm border-gray-300 dark:border-slate-700'
            )}
        />
    )
}
