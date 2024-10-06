import json
from typing import Dict, Any, Callable, Generator, List, Optional
import re
import sys
import os
import json_repair

# jajaja hackathon
sys.path.append("/home/ubuntu/projects/mistral-hack/server")

from openai import OpenAI # Some benchmarks
from mistralai import Mistral # 🫡
from rich import print
from app.utils.brave import brave_search, transform_results
from app.utils.website import website_get_content

def search(q: str) -> List[Dict[str, Any]]:
    """
    Mock search function. In a real scenario, this would perform a web search.
    """
    #print(f"Executing search with query: {q}")
    brave_results = brave_search(q=q)
    #print(brave_results)
    return brave_results


def website(url: str|dict) -> Dict[str, Any]:
    """
    Mock website function. In a real scenario, this would fetch website content.
    """   
    # Poor mans parser
    url = LLMService.get_response(str(url), "Return the full URL of the website in this JSON {\"url\": \"<url>\"}. Make sure that <ur> is not relative, but always the full url.")
    return website_get_content(url if isinstance(url, str) else url.get("url"))


class Guidance:
    
    @staticmethod
    def get_guidance_dict(prompt:str, provider: str = "MISTRAL") -> dict:
        SYSTEM_MESSAGE =     {
      "role": "system",
      "content": [
        {
          "text": """**Task:** Generate a step-by-step guidance plan in response to a user's query, focusing on data extraction, reasoning, and entity matching tasks. Break down the task into detailed steps in JSON format, ensuring each step includes specific labels, tasks, goals, execution steps, variables, and prompts for processing previous outputs when necessary.

**Each step should contain the following fields:**
- **label**: A brief identifier for the step.
- **task**: A detailed description of what this step aims to accomplish.
- **step**: The sequence number of this step in the overall process.
- **goal**: The desired outcome of completing this step.
- **execution**: An object containing an array of function calls needed to execute this step, in order.
  - **execution_steps**: An array of function call objects, each including:
    - **function**: The name of the function to call (`"search"` or `"website"`), or `null` if processing internally.
    - **input**: A dictionary of input parameters for the function, or `null` if not applicable.
    - **variable**: The key name in the result dictionary where the function's output will be stored.
    - **dependent_function_outputs** (if applicable): An array specifying the outputs required from previous steps for this function call. Each item includes:
      - **from_step**: The step number where the output was generated.
      - **variable**: The variable name from the previous step to reference.
    - **prompt** (if applicable): A clear instruction to process previous outputs to generate the current function's input or to perform internal processing. The prompt should specify that both textual and visual content (screenshots) should be considered when necessary.

**Available Functions:**
- **search**: Perform a web search.
  - **Input**: `{"q": "<search query>"}`
  - **Output**: Returns search results containing titles and URLs.
- **website**: Open a website and retrieve its content.
  - **Input**: `{"url": "<website URL>"}`
  - **Output**: Returns the website's raw content (HTML or markdown), a screenshot of the website, and a list of links on the website.

**Notes on Fields:**
- **Execution Field**: The `execution` field should contain an array called `execution_steps`, consisting of function call objects as specified. Dependencies on previous outputs are specified directly within each `execution_step` via `dependent_function_outputs`.
- **Considering Textual and Visual Content**: When processing website data, prompts should instruct to consider both the textual content and the screenshot, as some information may only be available visually.
- **Full Path URLs**: When extracting URLs (e.g., from website content), always ensure that the URLs are full paths, not relative paths. For example, if a link on a website is "/contact", you should convert it to a full URL like "https://example.com/contact", using the base URL of the website.

**Output Format:**
- The output should be a JSON object with a single key `"algorithm"`, mapping to a list of step objects.
- Each step object must include the fields: `"label"`, `"task"`, `"step"`, `"goal"`, and `"execution"`.
- Ensure the JSON is properly formatted and valid just like the one above. Make sure to have a fully working JSON following the same strucutre.

**Example:**

**User Query**: "What are the T-shirt sizes of the Mistral AI team?"

**Output**:
```json
{
  "algorithm": [
    {
      "label": "Search for Mistral AI",
      "task": "Find information about Mistral AI.",
      "step": 1,
      "goal": "Obtain search results to identify Mistral AI's official website.",
      "execution": {
        "execution_steps": [
          {
            "function": "search",
            "input": {"q": "Mistral AI"},
            "variable": "search_results_step1"
          }
        ]
      }
    },
    {
      "label": "Identify Official Website",
      "task": "Extract the official website URL from search results.",
      "step": 2,
      "goal": "Determine the correct URL for Mistral AI's official website.",
      "execution": {
        "execution_steps": [
          {
            "function": null,
            "input": null,
            "variable": "official_website_url",
            "dependent_function_outputs": [
              {"from_step": 1, "variable": "search_results_step1"}
            ],
            "prompt": "From `search_results_step1`, extract the official website URL of Mistral AI, ensuring it is a full path URL, and return as JSON {\"url\": \"<official_website_url>\"}."
          }
        ]
      }
    },
    {
      "label": "Access Official Website",
      "task": "Open Mistral AI's official website.",
      "step": 3,
      "goal": "Retrieve content and links from the official website.",
      "execution": {
        "execution_steps": [
          {
            "function": "website",
            "input": {"url": "<official_website_url>"},
            "variable": "website_content_step3",
            "dependent_function_outputs": [
              {"from_step": 2, "variable": "official_website_url"}
            ]
          }
        ]
      }
    },
    {
      "label": "Find Team Page URL",
      "task": "Extract the URL of the team or about us page from the website content.",
      "step": 4,
      "goal": "Obtain the specific URL to access team member information.",
      "execution": {
        "execution_steps": [
          {
            "function": null,
            "input": null,
            "variable": "team_page_url",
            "dependent_function_outputs": [
              {"from_step": 3, "variable": "website_content_step3"}
            ],
            "prompt": "From `website_content_step3`, including both textual content and the screenshot, find the link to the team or 'About Us' page, ensure it is a full path URL, and return as JSON {\"url\": \"<team_page_url>\"}."
          }
        ]
      }
    },
    {
      "label": "Access Team Page",
      "task": "Open the team or about us page on the official website.",
      "step": 5,
      "goal": "Retrieve content and links from the team page.",
      "execution": {
        "execution_steps": [
          {
            "function": "website",
            "input": {"url": "<team_page_url>"},
            "variable": "team_page_content_step5",
            "dependent_function_outputs": [
              {"from_step": 4, "variable": "team_page_url"}
            ]
          }
        ]
      }
    },
    {
      "label": "Extract Team Information",
      "task": "Gather names and images of team members from the team page.",
      "step": 6,
      "goal": "Compile data necessary for estimating T-shirt sizes.",
      "execution": {
        "execution_steps": [
          {
            "function": null,
            "input": null,
            "variable": "team_member_data",
            "dependent_function_outputs": [
              {"from_step": 5, "variable": "team_page_content_step5"}
            ],
            "prompt": "From `team_page_content_step5`, considering both the textual content and the screenshot, extract the names and full path image URLs of team members and return as JSON {\"team_members\": [{\"name\": \"<name>\", \"image_url\": \"<image_url>\"}, ...]}."
          }
        ]
      }
    },
    {
      "label": "Estimate T-shirt Sizes",
      "task": "Analyze team member images to estimate sizes.",
      "step": 7,
      "goal": "Determine probable T-shirt sizes based on visual data.",
      "execution": {
        "execution_steps": [
          {
            "function": null,
            "input": null,
            "variable": "estimated_sizes",
            "dependent_function_outputs": [
              {"from_step": 6, "variable": "team_member_data"}
            ],
            "prompt": "Using `team_member_data`, analyze the images to estimate the T-shirt sizes for each team member and return as JSON {\"estimated_sizes\": [{\"name\": \"<name>\", \"size\": \"<size>\"}, ...]}."
          }
        ]
      }
    },
    {
      "label": "Compile Final Report",
      "task": "Summarize the estimated T-shirt sizes for each member.",
      "step": 8,
      "goal": "Provide a cohesive report of findings.",
      "execution": {
        "execution_steps": [
          {
            "function": null,
            "input": null,
            "variable": "final_report",
            "dependent_function_outputs": [
              {"from_step": 7, "variable": "estimated_sizes"}
            ],
            "prompt": "Compile the `estimated_sizes` into a final report in a readable format."
          }
        ]
      }
    }
  ]
}
""",
          "type": "text"
        }
      ]
    }
        
        if provider == "OPENAI":
            client = OpenAI()
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[SYSTEM_MESSAGE,{
                    "role": "user", "content": prompt
                }],
                temperature=0,
                max_tokens=4095,
                top_p=1,
            #   frequency_penalty=0,
            #   presence_penalty=0,
                response_format={
                    "type": "json_object"
                }
            )
        else:
            # Default is Mistral
            print("Model: Mistral")
            client = Mistral(api_key=os.getenv("MISTRAL_API_KEY")) # client.chat.complete(

            response = client.chat.complete(
                model="mistral-large-latest",
                messages=[SYSTEM_MESSAGE,{
                    "role": "user", "content": prompt
                }],
                temperature=0,
                max_tokens=4095,
                top_p=1,
                response_format={
                    "type": "json_object"
                }
            )
        
        obj = {}
        obj = json.loads(response.choices[0].message.content)

        return obj
 

class LLMService:
    @staticmethod
    def get_response(data: Dict[str, Any], prompt: str, label_prompt: str = None, title_prompt: str = None, api_prompt: str = None) -> Dict[str, Any]:
        """
        Mock LLM response. In a real scenario, this would interface with an LLM.
        """     
        # Hack but we are on a hackathon
        if label_prompt is None:
            use_model = "mistral-large-latest"
            #use_model = "gpt-4o"
            if "website_base64_image" in str(data):
                if len(list(data.keys())) == 1:
                    data = data[list(data.keys())[0]]
                message_content = [{"type": "text", "text": prompt + '\n\nApply the instructions above to the following (json) content:\n' + data.get("content") + '\n\n Use the website screenshot to answer the instructions if necessary as well.'}, {"type": "image_url", "image_url": data.get("website_base64_image")}]
                use_model = "pixtral-12b-2409"
                #use_model = "gpt-4o"
            else:
                if isinstance(data, dict) and "content" in data:
                    message_content = [{"type": "text", "text": prompt + '\n\nApply the instructions above to the following (json) content:\n' + data.get("content")}]
                else:
                    message_content = [{"type": "text", "text": prompt + '\n\nApply the instructions above to the following (json) content:\n' + str(data)}]
        else:
            use_model = "mistral-large-latest"
            label_prompt = """Task:

Transform the current sub-step and overall step information from an execution engine agent into a human-readable label.

Instructions:

1. Extract Relevant Information:
   - Parse the provided JSON data to identify and extract key fields such as `label`, `task`, `step`, `goal`, and any dependencies within the execution object.

2. Contextual Understanding:
   - Utilize the extracted fields to understand the context of the current action.
   - Consider how `label`, `task`, `step`, and dependencies interrelate to provide a comprehensive overview of the action being performed.

3. Construct Descriptive Label:
   - Formulate a clear and concise statement that accurately represents the current action.
   - Ensure the description is easily understandable to someone without prior context.
   - Incorporate relevant details such as step numbers, specific actions, and dependencies.
   - Do not name any variable names and do not use the word sub-step
   - Do not add any step number into the markdown. If titles are used they should have a meaningful naming and not just something like "Step XYZ".

4. Format the Output:
   - Present the final output as a JSON object with the following structure:

   ```json
   {
     "step": <step_number_as_integer>,
     "title": <A cripst and comprehensive title for the step, could be based on the input>,
     "markdown": <markdown_formatted_message>
   }
   ```
   - The `markdown` field should contain a well-formatted message that may include elements like bold text, links, or other markdown features to enhance readability. Do not add any formatting information like "it should be structured like...".
""" + f"\n\n Now do it for this instruction: {label_prompt}"
            message_content = [{"type": "text", "text": label_prompt}]
        
        # hacky hack mack
        if title_prompt is not None:
            message_content = [{"type": "text", "text": f"Generate a crisp and short title for this prompt: '{title_prompt}'\n respond in this JSON {{\"title\": <the title>}}"}]
            
        # hacky hack mack WTF BROO
        if api_prompt is not None:
            use_model = "mistral-large-latest"
            message_content = [{"type": "text", "text": f"""Imagine that the following prompt is used to create an API endpoint. Generalize the prompt, identify its input parameters, and create a potential API endpoint.

            For example, consider a prompt asking for the number of employees of a company. The input parameter for this API would be the 'company_name'. 

            Now, based on the given prompt, generate the API parameters:

            Prompt: '{api_prompt}'

            Respond in the following JSON format:

            {{
            "parameters": [
                {{"name": "<name_of_parameter_for_example_company_name_website_url_etc.>", "type": "<data_type_of_parameter>"}}
            ],
            "url_path": "/v1/agent-crawl/"
            }}
            """}]          
        
        # from openai import OpenAI
        # client = OpenAI()  #client.chat.completions.create(
        
        client = Mistral(api_key=os.getenv("MISTRAL_API_KEY")) # client.chat.complete(

        response = client.chat.complete(
        model=use_model,
        messages=[{
            "role": "user", "content": message_content
        }],
        temperature=0.0,
        max_tokens=4095,
        top_p=1,
     #   frequency_penalty=0,
     #   presence_penalty=0,
        response_format={
            "type": "json_object"
        }
        )

        obj = {}        
        try:
            obj = json.loads(response.choices[0].message.content)
        except json.JSONDecodeError as e:
            obj = json_repair.loads(response.choices[0].message.content)
            
        # print("LABEL PROMPT ", obj)

        return obj

# Helper function to replace placeholders in the input dict
def replace_placeholders(input_data: Any, variables: Dict[str, Any]) -> Any:
    if isinstance(input_data, dict):
        return {k: replace_placeholders(v, variables) for k, v in input_data.items()}
    elif isinstance(input_data, list):
        return [replace_placeholders(item, variables) for item in input_data]
    elif isinstance(input_data, str):
        # Replace placeholders like <variable_name> with actual values
        pattern = re.compile(r"<(.*?)>")
        matches = pattern.findall(input_data)
        for match in matches:
            if match in variables:
                input_data = input_data.replace(f"<{match}>", str(variables[match]))
            else:
                raise ValueError(f"Variable '{match}' not found for placeholder replacement.")
        return input_data
    else:
        return input_data

class ExecutionEngine:
    def __init__(self, input_dict: Dict[str, Any]):
        print(input_dict.get("algorithm", []))
        self.algorithm_steps = sorted(input_dict.get("algorithm", []), key=lambda x: x.get("step", 0))
        self.variables: Dict[str, Any] = {}
        self.function_registry: Dict[str, Callable] = {
            "search": search,
            "website": website
            # Add other functions here as needed
        }

    def replace_placeholders(self, input_data: Any) -> Any:
        if isinstance(input_data, dict):
            return {k: self.replace_placeholders(v) for k, v in input_data.items()}
        elif isinstance(input_data, str):
            # Replace placeholders like <variable_name> with actual values
            for var, value in self.variables.items():
                placeholder = f"<{var}>"
                if placeholder in input_data:
                    if isinstance(value, (dict, list)):
                        value = json.dumps(value)
                    input_data = input_data.replace(placeholder, str(value))
            return input_data
        elif isinstance(input_data, list):
            return [self.replace_placeholders(item) for item in input_data]
        else:
            return input_data

    def execute(self) -> Generator[str, None, None]:
        yield '<agent_execution_start>'
        total_steps = sum(
            len(step.get("execution", {}).get("execution_steps", []))
            for step in self.algorithm_steps
        )
        
        current_step = 0
        for step in self.algorithm_steps:
            label = step.get("label")
            step_number = step.get("step")

            execution_steps = step.get("execution", {}).get("execution_steps", [])
            for exec_step in execution_steps:
                current_step += 1
                last_step = (current_step == total_steps)
                
                function_name = exec_step.get("function")
                input_data = exec_step.get("input")
                variable_name = exec_step.get("variable")
                dependent_outputs = exec_step.get("dependent_function_outputs", [])
                prompt = exec_step.get("prompt")

                # Gather dependent data
                dependent_data = {}
                for dep in dependent_outputs:
                    from_step = dep.get("from_step")
                    var = dep.get("variable")
                    if var in self.variables:
                        dependent_data[var] = self.variables[var]
                    else:
                        yield f"Error: Variable '{var}' from step {from_step} not found.\n"
                        continue  # Skip to the next execution step
                
                step_message = LLMService.get_response({}, "", label_prompt = f"Overall Step:\n{str(step)}\n\nCurrent Sub Step:\n{exec_step}" )
                print(step_message)
                yield f'<step_{step_message.get("step")}_start>'
                yield f'<step_title: {step_message.get("title") }>'
                yield  step_message.get("markdown") + "\n"                
                
                if function_name:
                    if function_name not in self.function_registry:
                        yield f"Error: Unknown function '{function_name}'.\n"
                        continue

                    # Replace placeholders in input_data
                    if input_data:
                        try:
                            processed_input = self.replace_placeholders(input_data)
                            
                            print("Processed input ", processed_input)
                            
                            # If the input contains JSON strings, parse them
                            if isinstance(processed_input, str):
                                processed_input = json.loads(processed_input)
                        except ValueError as e:
                            yield f"Error in placeholder replacement: {e}\n"
                            continue
                    else:
                        processed_input = {}

                    # Execute the functionprint("---------")
                    try:
                        func = self.function_registry[function_name]
                        
                        print("---------")
                        print("CALL ", function_name, " with ", processed_input)
                        print("---------")
                        
                        # Yield when the function call is website
                        if function_name == "website":
                            yield f'<function_call_start>Gathering data from [{processed_input.get("url")}]({processed_input.get("url")})' 
                            #yield f'\nGathering data from [{processed_input.get("url")}]({processed_input.get("url")})' 
                            
                        if function_name == "search":
                            yield f'<function_call_start>Search for **{processed_input.get("q")}**'
                            #yield f'\nFunction Call: Search for **{processed_input.get("q")}**'             
                        
                        result = func(**processed_input)
                        
                        # Yield when the function call is website
                        if function_name == "website":
                            yield f'<function_call_done>Gathered data\n![Website]({result.get("website_image_url")})'                            
                            #yield f'\nGathered data\n![Website]({result.get("website_image_url")})'
                            
                        if function_name == "search":
                            yield f'<function_call_done>Got {len(result.get("links"))} results for **{processed_input.get("q")}**. Selecting the most relevant.' 
                            #yield f'\nGot {len(result.get("links"))} results for **{processed_input.get("q")}**. Selecting the most relevant.'  
                        
                        
                        self.variables[variable_name] = result
                        # Limit the stored result to 250 characters for logging
                        result_str = json.dumps(result) if isinstance(result, (dict, list)) else str(result)
                        print(f"Stored variable '{variable_name}': {result_str[:250]}...\n")
                        #yield f"Stored variable '{variable_name}': {result_str[:250]}...\n"
                    except Exception as e:
                        yield f"Error executing function '{function_name}': {e}\n"

                elif prompt:
                    try:
                        
                        has_image = False
                        if "website_base64_image" in str(dependent_data):
                            if len(list(dependent_data.keys())) == 1:
                                    dependent_data = dependent_data[list(dependent_data.keys())[0]]
                            has_image = True
      
                        
                        #print("DEPENDENT DATA: ", dependent_data)
                        response = LLMService.get_response(dependent_data, prompt)

                        self.variables[variable_name] = response
                        # Limit the stored response to 250 characters for logging
                        response_str = json.dumps(response) if isinstance(response, (dict, list)) else str(response)
                        
                        if last_step:
                            yield "<result_start>"
                            yield response_str
                            yield "<result_done>"
                        #yield f"Stored variable '{variable_name}': {response_str[:250]}...\n"
                        print(f"Stored variable '{variable_name}': {response_str[:250]}...\n")
                    except Exception as e:
                        yield f"Error executing prompt: {e}\n"

                else:
                    yield "Error: Execution step must have either 'function' or 'prompt'.\n"
            
            
            yield f'<step_{step_message.get("step")}_done>'

        # Optionally, determine and yield the final output
        # This could be the last step's variable or any other logic as needed
        # For flexibility, we'll output all variables
        #yield "\n=== Execution Complete ===\n"
        #yield "Variables Collected:\n"
        try:
            variables_str = json.dumps(self.variables, indent=2)
            #yield f"{variables_str}\n"
        except Exception as e:
            yield f"Error formatting variables: {e}\n"
            
        # Get api definition
        api_definition = LLMService.get_response(data={}, prompt="", api_prompt=prompt)
        yield f'<api_definition_start>{json.dumps(api_definition)}<api_definition_end>'
            
        yield '<agent_execution_end>'

    def get_variable(self, var_name: str) -> Optional[Any]:
        return self.variables.get(var_name)
    
    def get_variables(self) -> Optional[Any]:
        return self.variables

# Example usage with the provided input dictionary

if __name__ == "__main__":

    input_dict = {}
    engine = ExecutionEngine(input_dict)
    engine.execute()

    # Retrieve and print the final report
    final_report = engine.get_variable("final_report")
    print("\n=== Final Report ===")
    print(engine.get_variables())
