import React from 'react'
import NavLogo from './NavLogo'
import classNames from '../../common/utils/classNames'

export default function Navbar() {

    return (
        <div className={classNames(
            "fixed top-0 w-full bg-clip-padding backdrop-filter backdrop-blur-lg flex-grow-0 flex-shrink-0 !bg-transparent dark:bg-transparent border-b border-muted dark:border-mutedDark z-20 position",
        )}>
            <div className="mx-auto max-w-full px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
                <div className="relative flex h-16 justify-between">
                    <div className="relative z-10 flex px-2 lg:px-0">
                        <div className="flex flex-shrink-0 items-center">
                            <NavLogo />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}