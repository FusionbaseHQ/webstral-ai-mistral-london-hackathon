import React from 'react'
import { string, array, func, bool, any } from 'prop-types'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Button from '../Button'
import classNames from '../../common/utils/classNames'


function Modal(props) {
    let [isOpen, setIsOpen] = useState(props.isOpen)

    useEffect(() => {
        if (props.isOpen) openModal()
        else closeModal()
    }, [props.isOpen])

    function closeModal() {
        setIsOpen(false)
        if (props.onClose) {
            props.onClose()
        }
    }

    function openModal() {
        setIsOpen(true)
        if (props.onOpen) {
            props.onOpen()
        }
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className={classNames(
                    props?.className,
                    'relative z-[100]'
                )}
                onClose={!!props?.closeOnOutsideClick ? closeModal : () => { }}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 !backdrop-blur-lg bg-white/20 dark:bg-bodyDark/20" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full sm:w-[550px] md:w-[650px] lg:w-[800px] transform rounded-2xl bg-white dark:bg-slate-900 p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                                >
                                    {props.title}
                                </Dialog.Title>
                                <div className="mt-8">
                                    {props.children}
                                </div>

                                {props?.actions?.length > 0 &&
                                    <div className="mt-4 space-x-2">
                                        {props.actions.map((action) => action)}
                                    </div>
                                }
                                {/* Move close button to the bottom, so autofocus goes to first content element */}
                                    <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                                        <Button
                                            look='ghost'
                                            size="sm"
                                            type="button"
                                            className="rounded-md bg-transparent dark:bg-transparent dark:hover:text-slate-400 text-gray-400 dark:text-subtextDark hover:text-gray-500"
                                            onClick={closeModal}
                                        >

                                            <span className="sr-only">Close</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </Button>
                                    </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

Modal.propTypes = {
    title: string.isRequired,
    children: any.isRequired,
    isOpen: bool,
    onClose: func,
    actions: array,
}

export default Modal