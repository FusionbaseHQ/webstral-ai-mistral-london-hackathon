import React, { useContext, useState } from 'react';
import { bool, number, string } from 'prop-types';
import Button from '../Button';
import SyntaxHighlighter from 'react-syntax-highlighter';
import CopyToClipboard from 'react-copy-to-clipboard';
import { ClipboardDocumentCheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { a11yLight, a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../../tailwind.config.js'
import classNames from '../../common/utils/classNames';


const Code = ({ language, children, className, ...props }) => {

    const fullConfig = resolveConfig(tailwindConfig)

    //State
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopy = () => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
    }

    return (
        <div className={classNames(
            'relative h-full w-full flex flex-col md:flex-row-reverse justify-between bg-gray-50 dark:bg-slate-800 pl-4 py-4 pr-4 overflow-auto',
            className
        )} {...props}>
            <div className='absolute right-4 top-4 flex-none'>
                <CopyToClipboard text={children} onCopy={handleCopy}>
                    <Button
                        size='xs'
                        className={copySuccess ? '!text-green-500 dark:!text-green-300' : ''}
                        icon={copySuccess ? <ClipboardDocumentCheckIcon /> : <ClipboardDocumentIcon />}>
                        Copy
                    </Button>
                </CopyToClipboard>
            </div>
            <div className='grow h-full overflow-x-hidden'>
                <SyntaxHighlighter
                    language={language}
                    style={a11yLight}
                    wrapLongLines
                    customStyle={{
                        height: '100%',
                        fontSize: '14px',
                        backgroundColor: fullConfig.theme.colors.gray['50'],
                    }}
                >
                    {children}
                </SyntaxHighlighter>
            </div>
        </div>
    )
}

Code.propTypes = {
    title: string,
    subtitle: string,
    isMultiline: bool,
    children: string,
    height: number,
    width: number,
    isLoading: bool,
    hideValue: bool,
    hideString: string,
    replaceString: string
}

export default Code