import React from 'react'
import Link from 'next/link'

export default function NavLogo() {
    return (
        <div className="flex items-center lg:px-0">
            {/* Show full logo when light mode is one */}
            <div className="hidden flex-shrink-0 md:block md:dark:hidden cursor-pointer">
                <Link href="/" className='font-bold'>
                    Webstral AI
                </Link>
            </div>
        </div>
    )
}