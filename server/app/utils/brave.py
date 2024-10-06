import httpx
from urllib.parse import quote_plus
import os

def brave_search(q: str):
    headers = {
        "x-subscription-token": os.getenv("BRAVE_API_KEY")
    }
    q = quote_plus(q)
    response = httpx.get(f"https://api.search.brave.com/res/v1/web/search?q={q}", headers=headers)
    results = response.json()
    results = transform_results(results)
    return results

def transform_results(input_json):
    """
    Transforms the input JSON into the desired format:
    
    {
        "infobox": {"title": ..., "description": ...},
        "links": [{"title":..., "url": ..., "description":...}]
    }
    
    Args:
        input_json (dict): The original JSON data.
    
    Returns:
        dict: The transformed JSON.
    """
    transformed = {
        "infobox": {"title": "", "description": ""},
        "links": []
    }
    
    # Extract infobox information
    try:
        infobox_results = input_json["infobox"]["results"]
        if infobox_results and isinstance(infobox_results, list):
            first_infobox = infobox_results[0]
            transformed["infobox"]["title"] = first_infobox.get("title", "")
            transformed["infobox"]["description"] = first_infobox.get("long_desc", "")
    except (KeyError, TypeError):
        # Handle missing keys or wrong data types
        pass
    
    # Extract links information from web results
    try:
        web_results = input_json["web"]["results"]
        if web_results and isinstance(web_results, list):
            for result in web_results:
                if isinstance(result, dict):
                    link = {
                        "title": result.get("title", ""),
                        "url": result.get("url", ""),
                        "description": result.get("description", "")
                    }
                    transformed["links"].append(link)
    except (KeyError, TypeError):
        # Handle missing keys or wrong data types
        pass
    
    return transformed
