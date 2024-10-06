import React, { Fragment, useEffect, useState } from 'react'
import PageHeading from '../Headings/PageHeading'
import Input from '../Form/Input'
import Button from '../Button'
import { SparklesIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'

export default function WebAI() {

    const router = useRouter()

    //State
    const [prompt, setPrompt] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        router.push(`/extract/${prompt}`)
    }

    return (
        <div className='h-full pt-28 max-w-2xl mx-auto'>
            <PageHeading
                center
                title="Webstral AI"
                subtitle="One AI to get you everything you ever wanted from the web as a structured JSON API."
            />
            <div className='max-w-xl mx-auto'>
                <form className='flex' onSubmit={handleSubmit}>
                    <Input
                        id="prompt"
                        name="prompt"
                        type="text"
                        placeholder="Ask me to get anything..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        autoFocus
                    />
                    <Button
                        look='primary'
                        className="flex-shrink-0 -ml-2"
                        disabled={prompt === ''}>
                        <SparklesIcon className='h-6 w-6' />
                        <span>Get Data</span>
                    </Button>
                </form>
            </div>
        </div >
    )
}
