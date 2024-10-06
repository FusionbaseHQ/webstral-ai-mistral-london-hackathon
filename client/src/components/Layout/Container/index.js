import { any, string, bool } from 'prop-types'

function Container({ children, className = "", full = false, size = 'xl' }) {

    let screenWidth = ''

    switch (size) {
        case 'xs':
            screenWidth = 'max-w-screen-xs mx-auto'
            break;
        case 'sm':
            screenWidth = 'max-w-screen-sm mx-auto'
            break;
        case 'md':
            screenWidth = 'max-w-screen-md mx-auto'
            break;
        case 'lg':
            screenWidth = 'max-w-screen-lg mx-auto'
            break;
        case 'xl':
            screenWidth = 'max-w-screen-xl mx-auto'
            break;
        case '2xl':
            screenWidth = 'max-w-screen-2xl mx-auto'
            break;
        case 'full':
            screenWidth = 'max-w-full mx-auto px-2 sm:px-4 lg:px-8'
            break;
        default:
            screenWidth = 'max-w-screen-xl mx-auto'
            break;
    }

    return (
        <div className='h-full'>
            <div className={`${!full ? screenWidth : ''} px-2 sm:px-4 lg:px-8 ${className}`} >
                {children}
            </div>
        </div>
    )
}

Container.propTypes = {
    children: any,
    className: string,
    full: bool,
    size: string
}

export default Container