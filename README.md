# Webstral AI

## Introduction
Webstral AI was developed for the Mistral AI London Hackathon 2024 as an innovative system that redefines data extraction from complex websites. Our solution combines advanced visual and reasoning models to provide a holistic understanding of entire webpages, beyond the limitations of traditional data extraction techniques.

### Inspiration
The web is rich with information, but much of it remains locked in intricate layouts and complex visuals that are challenging to extract. Most conventional approaches to data extraction are limited to handling individual page elements, which often leaves valuable data untouched. We wanted to create a system that could intelligently look at entire websites—analyzing their visual and textual components together to derive comprehensive insights. This vision led us to build Webstral AI, a system designed to redefine data extraction from the ground up.

### What It Does
Webstral AI is a next-gen agentic system that leverages advanced visual and reasoning models to extract and structure data from entire websites holistically. Instead of just focusing on tables or individual page components, it treats the whole page as a visual entity, understanding the relationship between the layout, text, and images.

Powered by Pixtral 12b for visual analysis and mistral-large-latest for everything else, Webstral AI uses a combination of cutting-edge technologies to simultaneously interpret visual and textual data. It is guided by an algorithmic reasoning layer that develops an effective approach to extract the data, no matter how complex the webpage is. Users only need to issue a single prompt to initiate this entire process, making data extraction from intricate websites easy and accessible.

## Tech Stack
- **Server**: Python and FastAPI
- **Client**: Next.js (requires Node.js 18+)

## Quickstart Guide

### Prerequisites
- **Server**: Python 3.8+, Pip
- **Client**: Node.js 18+, npm

### Running the Server
1. Navigate to the server directory:
    ```sh
    cd server
    ```
2. Install the required dependencies:
    ```sh
    pip install -r requirements.txt
    ```
3. Start the FastAPI server in development mode (in server/app):
    ```sh
    fastapi dev main.py
    ```

### Running the Client
1. Navigate to the client directory:
    ```sh
    cd client
    ```
2. Install the required dependencies:
    ```sh
    npm install
    ```
3. Start the Next.js development server:
    ```sh
    npm run dev
    ```

## Contributing
We welcome contributions! Feel free to open issues or pull requests if you'd like to contribute to this project.