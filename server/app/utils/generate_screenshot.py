import requests
import os
import uuid
from urllib.parse import quote

def generate_screenshot(
    url: str,
    access_key: str,
    content_folder: str = "content",
    format: str = "jpg",
    image_quality: int = 80
) -> str:
    """
    Generates a screenshot of the specified URL using the ScreenshotOne API
    and saves it to the designated content folder.

    Args:
        url (str): The URL of the webpage to capture.
        access_key (str): Your ScreenshotOne API access key.
        content_folder (str, optional): Directory to save the screenshot. Defaults to "content".
        format (str, optional): Image format (e.g., 'jpg', 'png'). Defaults to "jpg".
        image_quality (int, optional): Quality of the image (1-100). Defaults to 80.

    Returns:
        str: The filename of the saved screenshot.

    Raises:
        Exception: If the API request fails or saving the file encounters an error.
    """
    api_endpoint = "https://api.screenshotone.com/take"

    # URL-encode the target URL
    encoded_url = quote(url, safe='')

    # Define query parameters
    params = {
        "access_key": access_key,
        "url": url,  # Alternatively, use encoded_url if the API expects encoded strings
        "full_page": "true",
        "full_page_scroll": "true",
        "viewport_width": 1920/2,
        "viewport_height": 1080/2,
        "device_scale_factor": 1,
        "format": format,
        "image_quality": image_quality,
        "block_ads": "true",
        "block_cookie_banners": "true",
        "block_banners_by_heuristics": "false",
        "block_trackers": "true",
        "delay": 0,
        "timeout": 60
    }

    try:
        # Send GET request to the ScreenshotOne API
        response = requests.get(api_endpoint, params=params, timeout=70)  # Slightly higher timeout to account for network delays
        response.raise_for_status()  # Raise an error for bad status codes

        # Ensure the content folder exists
        os.makedirs(content_folder, exist_ok=True)

        # Generate a unique filename using UUID
        filename = f"{uuid.uuid4()}.{format}"
        file_path = os.path.join(content_folder, filename)

        # Save the image content to the file
        with open(file_path, 'wb') as file:
            file.write(response.content)

        print(f"Screenshot saved successfully as {file_path}")
        return filename

    except requests.exceptions.RequestException as req_err:
        print(f"Request error while generating screenshot: {req_err}")
        raise

    except IOError as io_err:
        print(f"I/O error while saving screenshot: {io_err}")
        raise

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        raise


if __name__ == '__main__':
    generate_screenshot()