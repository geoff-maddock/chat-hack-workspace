# ChatHack Workspace Alpha

This app is a workspace application for developers to improve their productivity by connecting together different APIs, tools and services in one place.  Pre-cursor to Auto-Dev Workspace project.

## Features
- **Chat**: Chat with the Expedient CTRL LLM, store, tag and rate responses, and refine the responses.  Group into conversations and topical spaces. Store requests and responses in local database for analysis and improvement.
- **Prompt Templates**: Create, refine, tag and apply system prompts to improve LLM responses for particular types of queries.
- **Tasks**: Create, assign, and track tasks.  Refine with the LLM and update in To Do.
- **Enrich**: Enrich your data with the LLM.  Create and use a knowledge base of system prompts to improve your text.
- **Align**: Align your work with the hierarchy of company goals.

## Backlog
- **Chat**: Add a chat-bot model to generate and refine text from the LLM.
  - [x] Add connection to Expedient CTRL LLM
  - [x] Create chat UI
    - [] Allow user to select model
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

  ### Questions & Bugs
  - How to identify the user? Currently no auth.  Azure Token?
  - Sync this data to a database so that it can be accessed from multiple devices.