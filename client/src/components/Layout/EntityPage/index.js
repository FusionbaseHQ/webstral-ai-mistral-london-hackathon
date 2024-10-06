import React from 'react'
import Container from '../Container'
import Header from '../Header'
import EntityPanel from './EntityPanel'

export default function EntityPage({ entityId, title, type, address, panelContent, headerContent, children }) {

    return (
        <>
            <Header isOverlap>
                <div className='absolute left-0 sm:w-full lg:w-80'>
                    <EntityPanel
                        entityId={entityId}
                        title={title}
                        type={type}
                        address={address}
                    >
                        {panelContent}
                    </EntityPanel>
                </div>
                <div className='ml-16 sm:ml-48 lg:ml-80'>
                    {headerContent}
                </div>
            </Header>
            <Container>
                <div className='relative pl-16 sm:pl-48 lg:pl-80 pb-16'>
                    {children}
                </div>
            </Container>
        </>
    )
}