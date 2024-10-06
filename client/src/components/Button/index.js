import React from 'react'
import PropTypes, { any } from 'prop-types'
import LoadingIndicator from '../LoadingIndicator'
import classNames from '../../common/utils/classNames'

function Button({ look = "regular", size = 'base', isLoading = false, icon = null, iconFloat = 'left', children, className, ...props }) {

    let buttonClass = `inline-flex items-center text-center justify-center ${isLoading && 'w-24'}`
    let iconClass = ''
    let indicatorColor = ''
    let indicatorSize = ''

    switch (look) {
        case "primary":
            buttonClass = buttonClass + ` border border-transparent text-white bg-primary hover:bg-primaryHover shadow-sm disabled:bg-gray-400 dark:disabled:bg-slate-700 disabled:cursor-not-allowed`
            indicatorColor = 'white'
            break;
        case "base":
            buttonClass = buttonClass + ` border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-100 bg-white dark:bg-transparent hover:bg-gray-50 hover:dark:bg-slate-800 shadow-sm disabled:text-gray-500 dark:disabled:text-slate-400 disabled:cursor-not-allowed`
            indicatorColor = 'primary'
            break;
        case "ghost":
            buttonClass = buttonClass + ` text-gray-900 dark:text-slate-100 bg-transparent dark:bg-transparent hover:text-primaryHover hover:dark:text-primaryHover disabled:text-gray-500 dark:disabled:text-slate-400 disabled:cursor-not-allowed`
            indicatorColor = 'primary'
            break;
        default:
            buttonClass = buttonClass + ` border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-100 bg-white dark:bg-transparent hover:bg-gray-50 hover:dark:bg-slate-800 shadow-sm disabled:text-gray-500 dark:disabled:text-slate-400 disabled:cursor-not-allowed`
            indicatorColor = 'primary'
            break;
    }

    switch (size) {
        case "xs":
            buttonClass = buttonClass + ` rounded px-2 py-1 text-sm font-medium`
            iconClass = 'w-4 h-4'
            indicatorSize = "sm"
            break;
        case "sm":
            buttonClass = buttonClass + ` rounded-md px-2.5 py-1.5 text-sm font-medium`
            iconClass = 'w-4 h-4'
            indicatorSize = "base"
            break;
        case "base":
            buttonClass = buttonClass + ` rounded-md px-4 py-2 text-sm font-medium`
            iconClass = 'w-5 h-5'
            indicatorSize = "base"
            break;
        case "lg":
            buttonClass = buttonClass + ` rounded-md px-4 py-2 text-base font-medium`
            iconClass = 'w-7 h-7'
            indicatorSize = "lg"
            break;
        case "xl":
            buttonClass = buttonClass + ` rounded-md px-6 py-3 text-base font-medium`
            iconClass = 'w-9 h-9'
            indicatorSize = "xl"
            break;
        case "2xl":
            buttonClass = buttonClass + ` rounded-md px-10 py-5 text-base font-medium`
            iconClass = 'w-12 h-12'
            indicatorSize = "2xl"
            break;
        default:
            buttonClass = buttonClass + ` rounded-md px-4 py-2 text-sm font-medium`
            iconClass = 'w-5 h-5'
            indicatorSize = "base"
            break;
    }

    buttonClass = buttonClass + ` ${className}`
    
    return (
        <button
            className={buttonClass}
            {...props}>
            {isLoading &&
                <LoadingIndicator color={indicatorColor} size={indicatorSize} />
            }
            {!isLoading && !!icon && iconFloat === 'left' &&
                <div className={classNames(
                    iconClass,
                    !!children && 'mr-1'
                )}>{icon}</div>
            }
            {!isLoading &&
                children
            }
            {!isLoading && !!icon && iconFloat === 'right' &&
                <div className={classNames(
                    iconClass,
                    !!children && 'ml-1'
                )}>{icon}</div>
            }
        </button>
    )
}

Button.propTypes =
{
    look: PropTypes.string,
    size: PropTypes.string,
    isLoading: PropTypes.bool,
    children: PropTypes.any,
    className: PropTypes.string,
    icon: PropTypes.any,
    props: PropTypes.any
}


export default Button