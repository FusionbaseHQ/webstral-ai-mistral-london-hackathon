import React from 'react'
import Container from '../Container'
import Header from '../Header'

export default function DataPage({ id, title, subtitle, type, breadcrumbs, children }) {

    return (
        <>
            <Header
                title={title}
                subtitle={subtitle}
                id={id}
                type={type}
                breadcrumbs={breadcrumbs}
            />
            <Container className='relative mt-6 pb-6'>
                {children}
            </Container>
        </>
    )
}