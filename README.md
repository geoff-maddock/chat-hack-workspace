# ChatHack Workspace Alpha

This project is a workspace app for building and enriching data with OpenAI API compatible LLMs.
Create and refine prompts, pull in data from other sources, query the LLM, and refine the responses.

## Getting Started
- Clone the repository
- Copy the environment template `cp .env.dist .env`
  - Add your OpenAI API key and URL to the .env file
- Run `npm install` install dependencies
- Run `npm run dev` to start the development server

## Implemented Features
- **Chat**: Chat with OpenAI API compatible LLMs.  Accept or delete responses.  Group into conversations.  
- **Conversations**: Group chats into conversations.  Add tags and rate the conversation.
- **Prompt Templates**: Create, refine, and apply a knowledge base system prompts for various purposes.
- **Settings**: Set the model, temperature, max tokens and system prompt being used to communicate with the LLM.

### Roadmap / Potential Improvements
- **Tasks**: Create, assign, and track tasks.  Pull from the Microsoft API (To Do).  Refine with the LLM and update in To Do.
- **Enrich**: Enrich your work planning data with the LLM.  Pull in from Jira or other datasorces
- **Align**: Align your data with goals.  Create and track goals, and align your data with them.  Pull in from 15five or other datasources.
- User authentication and authorization for ownership and access to data - Azure AD.  
- Sync data to a database for access from multiple devices.


## Related links
https://vite.dev/
https://platform.openai.com/docs/api-reference/chat
https://chat.expedient.cloud/
https://github.com/Expedient/aictrl-chat
https://developer.mozilla.org/en-US/docs/Web/API

### Additional research
https://helpdesk.expedient.com/hc/en-us/requests/16549?page=1
https://github.com/Expedient/is-dev-api/blob/main/env.ts
https://modelcontextprotocol.io/

---
# Brainstorming / Backlog
- **Chat**: Add a chat-bot model to generate and refine text from the LLM.
  - [x] Add connection to Expedient CTRL LLM
  - [x] Create chat UI
    - [x] Allow user to select model
  - [] Add controls to modify or re-roll chat, either by the whole conversation or by individual messages
  - [x] Store requests and responses in IndexDB
  - [] Set a status on chats: "Archive", "Working", "Refine", "Research", "Complete"
  - [] Add conversation management
- **Tasks**:
  - [] Create task UI - Create List, Create Task, Set due data
  - [] Sync with Microsoft To DO
- **Enrich**:
  - [] Create system prompts
    - [] Schema: Role, Topic (tags, or single), Prompt, Model, Version, Order (for chaining prompts)
    - [] Create prompts for these types of queries:  
        - Standup
        - Issue - Creation
        - Issue - Grooming
        - Issue - Work
        - Issue - Review
        - Task - Spike
        - Task - Unlabelled
  - [] Create cron job that will work on refining or researching existing chats
- **Align**:
  - [] Create goal UI to add or edit goals
  - [] Goal schema: Name, Level, Parent, Description, Due Date, Status
  - [] Create example goals:
        - Company - Expedient
        - Department - BITS
        - Team - IS Dev
        - Epic - Various
        - Sprint - Two Weeks of Work with a specific goal
        - Individual - Specific Items
  - [] Allow the goal sets to be referenced in the chat for alignment
  - [] Add action to create a list of tasks to align with a goal