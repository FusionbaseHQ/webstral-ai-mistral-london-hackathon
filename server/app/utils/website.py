import os
import json
import hashlib
import re
import httpx
import base64
from markdownify import markdownify as md

CACHE_FILE = '/home/ubuntu/projects/mistral-hack/server/app/utils/cache.json'


def url_to_base64_data_uri(url: str) -> str:
    """
    Fetches the image from the given URL and returns a Base64-encoded Data URI string.
    
    Args:
        url (str): The URL of the image to encode.
    
    Returns:
        str: Base64-encoded Data URI string of the image content.
    
    Raises:
        ValueError: If the URL does not point to a valid image.
        httpx.RequestError: If there's an issue fetching the URL.
    """
    try:
        response = httpx.get(url, timeout=30, follow_redirects=True)
        response.raise_for_status()

        content_type = response.headers.get('Content-Type', '')
        if not content_type.startswith('image/'):
            raise ValueError(f"URL does not point to an image. Content-Type: {content_type}")

        # Get the image format from content type
        image_format = content_type.split('/')[-1]

        # Encode the image content to base64
        encoded_bytes = base64.b64encode(response.content)
        encoded_str = encoded_bytes.decode('utf-8')

        # Create Data URI
        data_uri = f"data:image/{image_format};base64,{encoded_str}"

        return data_uri

    except httpx.RequestError as e:
        raise e



# Load cache
if os.path.exists(CACHE_FILE):
    with open(CACHE_FILE, 'r') as f:
        cache = json.load(f)
else:
    cache = {}

def hash_url(url: str) -> str:
    """Generate a hash for the given URL."""
    return hashlib.sha256(url.encode()).hexdigest()

def save_cache():
    """Save the cache dictionary to a file."""
    with open(CACHE_FILE, 'w') as f:
        json.dump(cache, f)

def website_get_content(url: str, max_newlines: int = 5) -> dict:
    """
    Accesses a website and returns its content in Markdown format,
    ensuring that there are no more than 'max_newlines' consecutive newlines.

    Args:
        url (str): The URL of the website to access.
        max_newlines (int): Maximum number of consecutive newlines allowed.

    Returns:
        dict: The Markdown content of the website or an error message.
    """
    url_hash = hash_url(url)

    # Check if URL is already in cache
    if url_hash in cache:
        cached_data = cache[url_hash]
        # Convert screenshot URL to base64 data URI on the fly
        website_base64_image = url_to_base64_data_uri(cached_data["website_image_url"])
        return {
            "content": cached_data["content"],
            "website_base64_image": website_base64_image,
            "website_image_url": cached_data["website_image_url"]
        }

    try:
        # Fetch HTML content
        response = httpx.get(url, follow_redirects=True, timeout=30)
        response.raise_for_status()

        # Convert HTML to Markdown using markdownify
        markdown_content = md(response.text, heading_style="ATX")

        # Create a regex pattern based on the desired maximum number of newlines
        pattern = rf'\n{{{max_newlines + 1},}}'
        replacement = '\n' * max_newlines
        markdown_content = re.sub(pattern, replacement, markdown_content)

        # Fetch screenshot URL
        # URL is hardoced, move this stuff to some env / config
        screenshot_response = httpx.get(f"{os.getenv('SCREENSHOT_BASE_URL')}/capture-screenshot/?url={url}", timeout=50)
        screenshot_response.raise_for_status()
        screenshot_url = os.getenv('SCREENSHOT_BASE_URL') + screenshot_response.json().get("screenshot_url")

        # Store in cache (only HTML content and screenshot URL)
        cache[url_hash] = {
            "content": markdown_content,
            "website_image_url": screenshot_url
        }
        save_cache()

        # Convert screenshot URL to base64 data URI on the fly
        website_base64_image = url_to_base64_data_uri(screenshot_url)

        return {
            "content": markdown_content,
            "website_base64_image": website_base64_image,
            "website_image_url": screenshot_url
        }

    except httpx.HTTPStatusError as e:
        print(e)
        return {"error": f"HTTP error occurred: {e.response.status_code} - {e.response.reason_phrase}"}
    except httpx.RequestError as e:
        print(e)
        return {"error": f"An error occurred while requesting {e.request.url!r}: {e}"}
    except Exception as e:
        print(e)
        return {"error": f"An unexpected error occurred: {e}"}


    
if __name__ == '__main__':
    website_get_content("https://docs.mistral.ai/capabilities/vision/")

