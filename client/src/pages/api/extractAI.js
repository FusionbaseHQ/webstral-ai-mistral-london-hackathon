import { Readable } from 'stream';

export default async function handler(req, res) {
    const { prompt } = req.query;

    console.log('Received request with prompt:', prompt);

    // Set headers to enable streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.flushHeaders();

    try {
        // Make a request to the external streaming API
        const externalResponse = await fetch(`${process.env.SERVER_API_URL}/v1/agent/create`, {
            method: 'POST',
            headers: {
                'Accept': 'text/plain',
                'Content-Type': 'application/json' // Add this header to indicate JSON body
                // Include any other necessary headers
            },
            body: JSON.stringify({
                prompt: prompt,  // Convert the body to JSON string
                name: 'agent-1'
            })
        });        

        if (!externalResponse.ok) {
            res.status(externalResponse.status).end(`Error fetching data: ${externalResponse.statusText}`);
            return;
        }

        // Convert the web ReadableStream to a Node.js Readable stream
        const webStream = externalResponse.body;

        if (!webStream) {
            res.status(500).end('No response body from external API');
            return;
        }

        // Use Readable.fromWeb to convert the web stream to a Node.js stream
        const nodeStream = Readable.fromWeb(webStream);

        // Pipe the external API response directly to the client
        nodeStream.pipe(res);

        // Handle errors in the nodeStream
        nodeStream.on('error', (error) => {
            console.error('Error in nodeStream:', error);
            res.end();
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).end(`Server error: ${error.message}`);
    }
}
