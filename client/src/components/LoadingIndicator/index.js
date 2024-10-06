import { any, string } from 'prop-types'
import React from 'react'
import classNames from '../../common/utils/classNames'

function LoadingIndicator({ className, size = 'base', color = 'primary' }) {

    let sizeClass = ''

    switch (size) {
        case "xs":
            sizeClass = 'h-3 w-3';
            break;
        case "sm":
            sizeClass = 'h-4 w-4';
            break;
        case "base":
            sizeClass = 'h-5 w-5';
            break;
        case "lg":
            sizeClass = 'h-7 w-7';
            break;
        case "xl":
            sizeClass = 'h-9 w-9';
            break;
        case "2xl":
            sizeClass = 'h-12 w-12';
            break;
        default:
            sizeClass = 'h-5 w-5';
            break;
    }

    return (
        <svg className={classNames(
            className,
            `text-${color}`,
            sizeClass,
            "animate-spin"
        )} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    )
}

LoadingIndicator.propTypes =
{
    color: string,
    classNames: string,
}


export default LoadingIndicator