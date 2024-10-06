import Container from "../../components/Layout/Container";
import Button from "../../components/Button";
import { useRouter } from "next/router";
import Head from "next/head";
import { useState, useEffect } from 'react';
import { CheckCircleIcon, ClockIcon, PlusIcon, ArrowPathIcon, CodeBracketIcon } from '@heroicons/react/20/solid';
import Modal from "../../components/Modal";
import Input from "../../components/Form/Input";
import ReactMarkdown from 'react-markdown';
import { useInView } from 'react-intersection-observer';
import JsonViewer from "../../components/JsonViewer";
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export default function ExtractDetails() {
    const router = useRouter();
    const { slug } = router.query;

    // State variables
    const [agents, setAgents] = useState([]);
    const [selectedAgentSlug, setSelectedAgentSlug] = useState('');

    // State for the prompt input
    const [showPromptInput, setShowPromptInput] = useState(false);
    const [newPrompt, setNewPrompt] = useState('');

    // State for the currently visible step
    const [inViewStepIndex, setInViewStepIndex] = useState(0);

    // Initialize the first agent and start fetching data
    useEffect(() => {
        if (!router.isReady) return;

        const initialAgentSlug = slug || 'Agent 1';
        const initialAgent = {
            slug: initialAgentSlug,
            introContent: [],
            steps: [],
            status: 'pending',
            dataFetching: true,
            finalResult: null,
            title: initialAgentSlug,
        };
        setAgents([initialAgent]);
        setSelectedAgentSlug(initialAgentSlug);

        fetchAgentData(initialAgentSlug);
    }, [router.isReady, slug]);

    // Fetch streaming data for an agent
    const fetchAgentData = async (agentSlug) => {
        try {
            const response = await fetch(`/api/extractAI?prompt=${encodeURIComponent(agentSlug)}`);
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let done = false;

            // Initialize parsingState to maintain state between chunks
            const parsingState = {
                buffer: '',
                introContent: [],
                steps: [],
                currentStep: null,
                currentSegment: null,
                agentTitle: '',
                agentExecutionStarted: false,
                finalResultContent: '',
                finalResult: null,
                executionEnded: false,
                parsingFinalResult: false,
                pendingStepStart: false,
            };

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                if (value) {
                    const chunk = decoder.decode(value);

                    // Parse the chunk and update parsingState
                    parseChunk(chunk, parsingState);

                    // Update the agent's steps, introContent, status, title, and final result
                    setAgents(prevAgents => {
                        return prevAgents.map(agent => {
                            if (agent.slug === agentSlug) {
                                const status = parsingState.executionEnded ? 'completed' : 'in-progress';
                                return {
                                    ...agent,
                                    introContent: [...parsingState.introContent],
                                    steps: [...parsingState.steps],
                                    status,
                                    finalResult: parsingState.finalResult,
                                    title: parsingState.agentTitle || agent.slug,
                                };
                            }
                            return agent;
                        });
                    });
                }
            }

            // When done, set dataFetching to false
            setAgents(prevAgents => {
                return prevAgents.map(agent => {
                    if (agent.slug === agentSlug) {
                        return { ...agent, dataFetching: false };
                    }
                    return agent;
                });
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error appropriately
        }
    };

    // Modify the parseMarkdown function to parseChunk
    const parseChunk = (chunk, state) => {
        // Append the chunk to any leftover data from previous chunks
        state.buffer += chunk;

        // Split the buffer into tokens
        const tokens = state.buffer.split(/(<[^>]+>)/g);

        // If the last token is incomplete, save it for the next chunk
        if (!state.buffer.endsWith('>')) {
            state.buffer = tokens.pop();
        } else {
            state.buffer = '';
        }

        for (let token of tokens) {
            token = token.trim();
            if (token.length === 0) continue; // Skip empty tokens
            if (token.startsWith('<') && token.endsWith('>')) {
                // It's a tag
                if (token.startsWith('<title:')) {
                    // Agent title
                    const titleMatch = token.match(/<title:\s*(.*?)>/);
                    if (titleMatch) {
                        state.agentTitle = titleMatch[1].trim();
                    }
                } else if (token === '<agent_execution_start>') {
                    state.agentExecutionStarted = true;
                } else if (token === '<agent_execution_end>') {
                    state.executionEnded = true;
                } else if (token.match(/<step_(\d+)_start>/)) {
                    // Start of a step
                    const stepMatch = token.match(/<step_(\d+)_start>/);
                    if (stepMatch) {
                        const stepNumber = parseInt(stepMatch[1], 10);
                        state.currentStep = {
                            step: stepNumber,
                            label: '', // Will set after we get <step_title: ...>
                            content: [],
                            status: 'in-progress',
                        };
                        state.pendingStepStart = true; // Expecting <step_title: ...>

                        // Add the current step to steps immediately
                        state.steps.push(state.currentStep);
                    }
                } else if (token.startsWith('<step_title:')) {
                    if (state.currentStep && state.pendingStepStart) {
                        const titleMatch = token.match(/<step_title:\s*(.*?)>/);
                        if (titleMatch) {
                            state.currentStep.label = titleMatch[1].trim();
                            state.pendingStepStart = false; // Got the title
                        }
                    } else {
                        console.warn('Unexpected <step_title: ...> tag');
                    }
                } else if (token.match(/<step_\d+_done>/)) {
                    // End of a step
                    if (state.currentStep) {
                        state.currentStep.status = 'completed';
                        state.currentStep = null;
                        state.pendingStepStart = false;
                        state.currentSegment = null;
                    }
                } else if (token === '<function_call_start>') {
                    // Start of a function call
                    if (state.currentStep) {
                        state.currentSegment = {
                            type: 'function_call',
                            content: '',
                            status: 'in-progress',
                        };
                        state.currentStep.content.push(state.currentSegment);
                    } else {
                        // Function call outside of a step
                        console.warn('Function call outside of a step');
                    }
                } else if (token === '<function_call_done>') {
                    // End of a function call
                    if (state.currentSegment && state.currentSegment.type === 'function_call') {
                        state.currentSegment.status = 'completed';
                        state.currentSegment = null;
                    } else {
                        console.warn('Function call done without a current function call');
                    }
                } else if (token === '<result_start>') {
                    // Start of final result
                    state.parsingFinalResult = true;
                    state.finalResultContent = '';
                } else if (token === '<result_done>') {
                    // End of final result
                    state.parsingFinalResult = false;
                    // Parse the final result JSON
                    try {
                        state.finalResult = JSON.parse(state.finalResultContent);
                    } catch (e) {
                        console.error('Error parsing final result JSON:', e);
                        state.finalResult = null;
                    }
                } else {
                    // Unknown tag
                    console.warn('Unknown tag:', token);
                }
            } else {
                // Content between tags
                if (state.parsingFinalResult) {
                    state.finalResultContent += token;
                } else if (state.currentStep) {
                    if (state.currentSegment && state.currentSegment.type === 'function_call') {
                        // We are inside a function call
                        state.currentSegment.content += token + ' '; // Append content to function call
                    } else {
                        // We are in normal text content within a step
                        let lastSegment = state.currentStep.content[state.currentStep.content.length - 1];
                        if (lastSegment && lastSegment.type === 'text') {
                            lastSegment.content += token + ' ';
                        } else {
                            state.currentSegment = {
                                type: 'text',
                                content: token + ' ',
                            };
                            state.currentStep.content.push(state.currentSegment);
                        }
                    }
                } else {
                    // Content outside of any step
                    // Append to introContent
                    if (state.introContent.length > 0) {
                        // Append to last content if it's text
                        let lastContent = state.introContent[state.introContent.length - 1];
                        if (lastContent.type === 'text') {
                            lastContent.content += token + ' ';
                        } else {
                            state.introContent.push({ type: 'text', content: token + ' ' });
                        }
                    } else {
                        state.introContent.push({ type: 'text', content: token + ' ' });
                    }
                }
            }
        }
    };

    const addNewAgent = () => {
        setShowPromptInput(true);
    };

    const handleCreateAgent = () => {
        const newAgentSlug = newPrompt.trim();
        if (newAgentSlug) {
            const newAgent = {
                slug: newAgentSlug,
                introContent: [],
                steps: [],
                status: 'pending',
                dataFetching: true,
                finalResult: null,
                title: newAgentSlug,
            };
            setAgents([...agents, newAgent]);
            setSelectedAgentSlug(newAgentSlug);
            setNewPrompt('');
            setShowPromptInput(false);

            // Start fetching data for the new agent
            fetchAgentData(newAgentSlug);
        }
    };

    const selectedAgent = agents.find(agent => agent.slug === selectedAgentSlug);

    // Icons based on status
    const getStatusIcon = (status) => {
        const iconClasses = "!h-4 !w-4 flex-shrink-0";
        switch (status) {
            case 'completed':
                return <CheckCircleIcon className={`${iconClasses} text-text`} />;
            case 'in-progress':
                return <ArrowPathIcon className={`${iconClasses} text-primary animate-spin`} />;
            case 'pending':
                return <ClockIcon className={`${iconClasses} text-gray-400`} />;
            default:
                return null;
        }
    };

    // Text based on status
    const getStatusText = (text, status, isSelected) => {
        const textClasses = "ml-2";

        if (isSelected) {
            return <span className={`${textClasses} text-primary font-semibold`}>{text}</span>;
        }

        switch (status) {
            case 'completed':
                return <span className={`${textClasses} text-text hover:font-semibold`}>{text}</span>;
            case 'in-progress':
                return <span className={`${textClasses} text-primary hover:font-semibold`}>{text}</span>;
            case 'pending':
                return <span className={`${textClasses} text-gray-500 hover:font-semibold`}>{text}</span>;
            default:
                return null;
        }
    };

    // Handler for clicking on a step in the sidebar
    const handleStepClick = (index) => {
        const element = document.getElementById(`step-${index}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // StepComponent remains the same
    const StepComponent = ({ step, index }) => {
        const [ref, inView] = useInView({
            threshold: 0.5,
        });

        useEffect(() => {
            if (inView) {
                setInViewStepIndex(index);
            }
        }, [inView, index]);

        // Custom renderers for ReactMarkdown
        return (
            <div ref={ref} id={`step-${index}`} className="mb-12">
                <div className="flex items-center mb-4">
                    {getStatusIcon(step.status)}
                    <h2 className="text-2xl font-bold ml-2">{step.label || `Step ${step.step}`}</h2>
                </div>
                <div className="ml-4 mb-4 space-y-4">
                    {step.content.map((segment, idx) => (
                        <ReactMarkdown
                            key={idx}
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={renderers}
                        >
                            {segment.content}
                        </ReactMarkdown>
                    ))}
                </div>
                <hr className="my-6 border-gray-300" />
            </div>
        );
    };

    // Style for the JsonViewer
    const jsonViewerStyle = {
        width: '100%',
        overflow: 'scroll',
        wordBreak: 'break-word',
        padding: '16px',
        borderRadius: '16px',
    };

    const renderers = {
        img: ({ src, alt }) => (
            <img src={src} alt={alt} className="max-w-full h-auto" />
        ),
        a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                {children}
            </a>
        ),
    };

    return (
        <>
            <Head>
                <title>{selectedAgent?.title || 'AI Agent Hub'}</title>
                <meta name="description" content={`JSON API: ${selectedAgent?.title}`} />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Container size="full" className="h-screen overflow-hidden">
                <div className="grid grid-cols-12 h-full">
                    {/* Sidebar */}
                    <div className="col-span-4 bg-primary/5 -ml-8 pl-8 p-8 overflow-y-auto">
                        <Button look="primary" onClick={addNewAgent} className="mb-4" icon={<PlusIcon />}>
                            Create Agent
                        </Button>
                        {agents.length > 0 ? (
                            agents.map((agent, agentIndex) => (
                                <div
                                    key={agentIndex}
                                    className={`space-y-2 p-2.5 rounded hover:bg-primary/10 ${selectedAgentSlug === agent.slug && 'bg-primary/20 hover:bg-primary/20'
                                        }`}
                                >
                                    <div
                                        className={`cursor-pointer flex items-center font-semibold ${selectedAgentSlug === agent.slug && 'border-b pb-2.5 border-b-primary/20'
                                            }`}
                                        onClick={() => {
                                            setSelectedAgentSlug(agent.slug);
                                        }}
                                    >
                                        {getStatusIcon(agent.status)}
                                        {getStatusText(agent.title || agent.slug, agent.status)}
                                    </div>
                                    {/* Steps */}
                                    {selectedAgentSlug === agent.slug && agent.steps.length > 0 && (
                                        <div className="ml-4 space-y-1">
                                            {agent.steps.map((step, stepIndex) => (
                                                <div
                                                    key={stepIndex}
                                                    className={`cursor-pointer flex items-center ${inViewStepIndex === stepIndex ? 'text-primary font-semibold' : ''
                                                        }`}
                                                    onClick={() => handleStepClick(stepIndex)}
                                                >
                                                    {getStatusIcon(step.status)}
                                                    {getStatusText(step.label || `Step ${step.step}`, step.status, inViewStepIndex === stepIndex)}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500 dark:text-gray-400">
                                No agents created yet. Click "+ Create Agent" to get started.
                            </div>
                        )}
                    </div>
                    {/* Main Content */}
                    <div className="col-span-8 p-8 overflow-y-auto">
                        {selectedAgent ? (
                            <div>
                                {/* Render introContent if available */}
                                {selectedAgent.introContent && selectedAgent.introContent.length > 0 && (
                                    <div className="mb-12">
                                        <div className="mb-4 space-y-4">
                                            {selectedAgent.introContent.map((segment, idx) => (
                                                <ReactMarkdown
                                                    key={idx}
                                                    remarkPlugins={[remarkGfm]}
                                                    rehypePlugins={[rehypeRaw]}
                                                    components={renderers}
                                                >
                                                    {segment.content}
                                                </ReactMarkdown>
                                            ))}
                                        </div>
                                        <hr className="my-6 border-gray-300" />
                                    </div>
                                )}
                                {/* Render Steps */}
                                {selectedAgent.steps.map((step, index) => (
                                    <StepComponent key={index} step={step} index={index} />
                                ))}
                                {/* Display the final result */}
                                {selectedAgent.finalResult && (
                                    <div>
                                        <div className="flex items-center space-x-4 mb-4">
                                            <h2 className="text-2xl font-bold mb-0">Your API</h2>
                                            <Button size="xs" icon={<CodeBracketIcon />}>Use via API</Button>
                                        </div>
                                        <JsonViewer data={selectedAgent.finalResult} style={jsonViewerStyle} />
                                    </div>
                                )}
                            </div>
                        ) : selectedAgent && selectedAgent.dataFetching ? (
                            <div className="flex items-center justify-center h-full">
                                <ArrowPathIcon className="h-6 w-6 text-blue-500 animate-spin mr-2" />
                                <span>Loading data...</span>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-center text-gray-500 dark:text-gray-400">
                                <span>No agent selected</span>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
            {/* Modal for new Agents */}
            <Modal
                title="Create new Agent"
                isOpen={showPromptInput}
                onClose={() => setShowPromptInput(false)}
                closeOnOutsideClick
            >
                <div>
                    <Input
                        type="text"
                        value={newPrompt}
                        onChange={(e) => setNewPrompt(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-4 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="New prompt..."
                    />
                    <div className="flex justify-end space-x-2">
                        <Button
                            onClick={() => {
                                setShowPromptInput(false);
                                setNewPrompt('');
                            }}
                        >
                            Cancel
                        </Button>
                        <Button look="primary" onClick={handleCreateAgent}>
                            Create Agent
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}