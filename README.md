# ChatHack Workspace Alpha

This app is a workspace application for developers to improve their productivity by connecting together different APIs, tools and services in one place.  Pre-cursor to Auto-Dev Workspace project.

## Features
- **Chat**: Chat with the Expedient CTRL LLM, store and rate responses, and refine the responses.
- **Tasks**: Create, assign, and track tasks.  Refine with the LLM and update in To Do.
- **Enrich**: Enrich your data with the LLM.  Create and use a knowledge base of system prompts to improve your text.
- **Align**: Align your work with the hierarchy of company goals.

## Backlog
- **Chat**: Add a chatbot to the chat.
  - [x] Add connection to Expedient CTRL LLN
  - [x] Create chat UI
  - [] Add controls to modify or re-roll the chat, either by the whole chat or by individual messages
  - [] Store requests and responses in IndexDB
  - [] Set a status on chats: "Archive", "Working", "Refine", "Research", "Complete"
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