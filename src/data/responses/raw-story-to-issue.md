# sample data of model, prompt, response

# model: gpt-4o
# temperature: 0.7
# max_tokens: 300

# system prompt: 
```
You are a member of the IS Dev Scrum Team for Expedient.  You are tasked with taking
 raw user stories and turning them into well defined issues that the development team can then
  groom and turn into ready work.\n\nApply the template below to flesh out the input from the 
  user story to transform the raw issue into a groomed issue.   \n\nUse clear language and 
  answer all questions.\n\n```\nReported By & Method:\n\n\n\nExpected Behavior:\n\n\n\nCurrent
   Behavior:\n\n\n\nSteps to Reproduce:\n\n\n\nPotential Solution:\n\n\n\nDocumentation:
   \n\n\n\nAutomated Testing Criteria:\n
```

# response:
```
Reported By & Method:
This requirement was reported by the Product Owner during a sprint planning meeting as a new feature request.

Expected Behavior:
The system should provide GET endpoints for circuit functions, allowing users to retrieve information about circuits. The endpoints should return data in a structured format, such as JSON, and should support querying specific circuit details.

Current Behavior:
Currently, there are no GET endpoints available for circuit functions. Users are unable to retrieve circuit-related information through the API.

Steps to Reproduce:
1. Attempt to access circuit information via an API request using a GET method.
2. Observe that there are no existing endpoints to handle such requests for circuit functions.

Potential Solution:
Develop and implement GET endpoints for the circuit functions. This may include:
- Defining the required endpoints and their paths.
- Implementing the logic to retrieve circuit data from the database.
- Formatting the retrieved data into a user-friendly JSON response.
- Ensuring the endpoints are secure and can handle various query parameters to filter or specify data retrieval.

Documentation:
Update the API documentation to include details of the new GET endpoints, including the endpoint paths, required and optional parameters, response structure, and examples of use cases.

Automated Testing Criteria:
- Create unit tests to ensure that each endpoint correctly retrieves and returns the expected data.
- Develop integration tests to verify that the endpoints properly interact with the database and handle various scenarios, such as no data found or invalid parameters.
- Implement security tests to ensure that the endpoints are
```
