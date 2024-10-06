import React from 'react'
import { string, bool, any } from 'prop-types'
import classNames from '../../../common/utils/classNames'

function FormGroup({ children, showHint, hint, hintType, className, ...props }) {

    return (
        <div
            className={classNames(
                'relative flex flex-col pb-5',
                className
            )}
            {...props}>
            {children}
            {showHint && <p className={classNames(
                'absolute bottom-0 right-0 text-xs',
                hintType === "error" && 'text-red-500 dark:text-red-400',
                hintType === "success" && 'text-green-600 dark:text-green-400',
                (hintType === "" || !hintType) && 'text-subtext dark:text-subtextDark'
            )}>{hint}</p>}
        </div>
    )
}

FormGroup.propTypes = {
    hint: string,
    hintType: string,
    showHint: bool,
    children: any.isRequired
}

export default FormGroup
