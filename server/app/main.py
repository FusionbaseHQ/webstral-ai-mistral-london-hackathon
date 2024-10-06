from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
import os
from typing import Optional
from app.routers import chat
from app.utils.generate_screenshot import generate_screenshot

app = FastAPI(title="Webstral AI")

# Include routers
app.include_router(chat.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Webstral AI API"}


from fastapi.responses import StreamingResponse
import asyncio

async def markdown_steps():
    steps = [
        {
            "step_number": 1,
            "title": "Searching for Mistral AI",
            "description": "We begin by searching the web for information about Mistral AI to gather initial insights.",
            "substeps": [
                {
                    "description": "Initiating a search query for 'Mistral AI'.",
                    "result": "Search query 'Mistral AI' has been initiated."
                },
                {
                    "description": "Executing the search function to retrieve relevant information.",
                    "result": "Search function executed successfully, retrieving search results."
                },
                {
                    "description": "Compiling the search results for further analysis.",
                    "result": "Collected search results containing multiple links and resources about Mistral AI."
                }
            ],
            "tag": "<Step1Done>"
        },
        {
            "step_number": 2,
            "title": "Identifying the Official Website",
            "description": "From the search results, we extract the official website URL of Mistral AI.",
            "substeps": [
                {
                    "description": "Parsing the search results to identify potential official websites.",
                    "result": "Parsed search results and identified candidate URLs."
                },
                {
                    "description": "Evaluating the credibility of each candidate URL.",
                    "result": "Assessed the credibility and relevance of each URL."
                },
                {
                    "description": "Selecting the most credible URL as the official website.",
                    "result": "Successfully identified the official website URL for Mistral AI."
                }
            ],
            "tag": "<Step2Done>"
        },
        {
            "step_number": 3,
            "title": "Accessing the Official Website",
            "description": "With the official URL in hand, we access Mistral AI's website to retrieve content and links.",
            "substeps": [
                {
                    "description": "Sending a request to the official website URL.",
                    "result": "Request to the official website sent successfully."
                },
                {
                    "description": "Fetching the HTML content of the official website.",
                    "result": "Retrieved HTML content from Mistral AI's official website."
                },
                {
                    "description": "Extracting all available links and resources from the website.",
                    "result": "Extracted content and links for further navigation."
                }
            ],
            "tag": "<Step3Done>"
        },
        {
            "step_number": 4,
            "title": "Locating the Team Page",
            "description": "Next, we locate the 'Team' or 'About Us' page within the website to gather information about the team members.",
            "substeps": [
                {
                    "description": "Scanning the website's navigation menu for relevant links.",
                    "result": "Identified potential links to 'Team' or 'About Us' pages."
                },
                {
                    "description": "Following the identified links to access the team-related pages.",
                    "result": "Accessed the team or 'About Us' page successfully."
                },
                {
                    "description": "Verifying the content of the team page for accuracy.",
                    "result": "Confirmed the presence of team member information on the page."
                }
            ],
            "tag": "<Step4Done>"
        },
        {
            "step_number": 5,
            "title": "Accessing the Team Page",
            "description": "We then access the team page to retrieve detailed information and links related to the team members.",
            "substeps": [
                {
                    "description": "Sending a request to the team page URL.",
                    "result": "Request to the team page sent successfully."
                },
                {
                    "description": "Fetching the HTML content of the team page.",
                    "result": "Retrieved HTML content from the team page."
                },
                {
                    "description": "Extracting detailed information and links about each team member.",
                    "result": "Extracted names and profile links of all team members."
                }
            ],
            "tag": "<Step5Done>"
        },
        {
            "step_number": 6,
            "title": "Extracting Team Information",
            "description": "From the team page, we gather the names and images of the team members.",
            "substeps": [
                {
                    "description": "Parsing the team page content to identify team member sections.",
                    "result": "Identified sections containing team member information."
                },
                {
                    "description": "Extracting the names of each team member.",
                    "result": "Collected names of all team members."
                },
                {
                    "description": "Retrieving the image URLs associated with each team member.",
                    "result": "Gathered image URLs for all team members."
                }
            ],
            "tag": "<Step6Done>"
        },
        {
            "step_number": 7,
            "title": "Estimating T-shirt Sizes",
            "description": "Using the collected images, we analyze them to estimate the probable T-shirt sizes of each team member.",
            "substeps": [
                {
                    "description": "Downloading the images of each team member.",
                    "result": "Downloaded all team member images successfully."
                },
                {
                    "description": "Applying image analysis techniques to estimate T-shirt sizes.",
                    "result": "Analyzed images and estimated T-shirt sizes."
                },
                {
                    "description": "Compiling the estimated sizes into a structured format.",
                    "result": "Created a list of estimated T-shirt sizes for each team member."
                }
            ],
            "tag": "<Step7Done>"
        },
        {
            "step_number": 8,
            "title": "Compiling the Final Report",
            "description": "Finally, we compile all the estimated T-shirt sizes into a comprehensive and readable report.",
            "substeps": [
                {
                    "description": "Aggregating all estimated sizes into a single document.",
                    "result": "Aggregated T-shirt size data successfully."
                },
                {
                    "description": "Formatting the aggregated data into a readable report format.",
                    "result": "Formatted the data into a cohesive report."
                },
                {
                    "description": "Reviewing the final report for accuracy and completeness.",
                    "result": "Final report compiled and ready for presentation."
                }
            ],
            "tag": "<Step8Done>"
        }
    ]
    
    for step in steps:
        # Yield main step
        main_step_markdown = f"### Step {step['step_number']}: {step['title']}\n\n{step['description']}\n\n"
        yield main_step_markdown
        await asyncio.sleep(0.5)  # Simulate delay between main step and substeps

        # Yield substeps
        for idx, substep in enumerate(step['substeps'], start=1):
            substep_markdown = (
                f"#### Substep {idx}: {substep['description']}\n\n"
                f"**Result:** {substep['result']}\n\n"
            )
            yield substep_markdown
            await asyncio.sleep(0.5)  # Simulate delay between substeps

        # Yield step done tag
        tag_markdown = f"{step['tag']}\n\n"
        yield tag_markdown
        await asyncio.sleep(1)  # Simulate delay before next step


# This is just some test to test streaming responses in the UI
@app.get("/demo-stream")
async def demo_stream():
    return StreamingResponse(markdown_steps(), media_type="text/markdown")


# Ensure the 'content' directory exists
content_directory = os.path.join(os.path.dirname(__file__), "content")
os.makedirs(content_directory, exist_ok=True)

# Mount the 'content' directory to serve static files
app.mount("/content", StaticFiles(directory=content_directory), name="content")


# Retrieve the access key from environment variables for security
SCREENSHOTONE_ACCESS_KEY = os.getenv("SCREENSHOTONE_ACCESS_KEY")

@app.get("/capture-screenshot/")
def capture_screenshot(url: str, format: Optional[str] = "jpg", image_quality: Optional[int] = 95):
    if not SCREENSHOTONE_ACCESS_KEY:
        raise HTTPException(status_code=500, detail="Screenshot API access key not configured.")

    try:
        filename = generate_screenshot(
            url=url,
            access_key=SCREENSHOTONE_ACCESS_KEY,
            format=format,
            image_quality=image_quality
        )
        screenshot_url = f"/content/{filename}"
        return {"screenshot_url": screenshot_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
