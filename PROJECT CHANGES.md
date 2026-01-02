UPDATES

1. WHEN CLICKED ON CREATE PROJECT IN DASHBOARD USER MUST SEE TWO CLICKABLE SCALECARDS . 

OPTION 1 : CONNECT REPOSITORY

AFTER CLICK -> PROMPT A CENTERD INPUT FEILD ASKING A REPOSITORY NAME. (SHOULD HAVE GREEN 'CONNECT' BUTTON.

OPTION 2: FROM SCRATCH

AFTER CLICK -> LEADS TO THE EXISITING WIZARD (NO CHANGES)


CONNECT BUTTON:

SHOULD LEAD TO THE PROJECT EDITOR(EDITOR IS TO BE CHANGED AHEAD)

CREATE PROJECT BUTTON(EXISITING):

SHOULD LEAD TO THE PROJECT EDITOR(EDITOR IS TO BE CHANGED AHEAD)

PROJECT EDITOR
--------------------
NOTES
________

+ DONT CHANGE ANY VISUAL APPEARANCE

MAIN CHANGE
____________
IDEA: THE PROJECT EDITOR IS A WORKSPACE FOR FORKING GITHUB PROJECTS WHICH ARE CREATED USING AI TOOLS LIKE :

"""
1. Planning & Ideation

ChatGPT / GPT-5 Mini – Generate website ideas, layouts, and user flows.

Notion AI / Mem.ai – Organize requirements, create wireframes, or project boards.

Miro AI / Whimsical AI – AI-assisted mind mapping or flowchart creation.

2. Design & Prototyping

Figma AI / FigJam AI – Design UI/UX, generate mockups, or auto-create components.

Canva AI – Create graphics, icons, banners, and social media visuals.

Adobe Firefly – Generate AI images, backgrounds, and web assets.

Runway / Leonardo AI – Create custom visuals, animations, and 3D elements.

3. Frontend Development

GitHub Copilot / Codeium / CodeWhisperer – Auto-complete and generate React, HTML, CSS, JS code.

Vercel AI / Next.js AI – Scaffold full frontend frameworks with AI suggestions.

Tailwind CSS AI plugin – Generate responsive utility classes automatically.

Framer AI – Turn design prototypes into code.

4. Backend Development

ChatGPT / GPT-5 Mini for backend – Generate Node.js, Django, Flask, or FastAPI boilerplate code.

Replit AI – Auto-generate backend routes, APIs, or server logic.

MongoDB Atlas AI / Supabase AI – Auto-generate database schemas and queries.

Postman AI – Generate API test scripts automatically.

5. Database & Storage

Supabase AI / Firebase AI – Auto-generate tables, queries, and authentication flows.

Chroma / Weaviate / Pinecone AI – AI-assisted vector DB for search or recommendation features.

6. Content Generation

ChatGPT / Jasper / Writesonic – Generate landing page copy, blogs, product descriptions.

Synthesia / Runway ML – AI video content for hero sections or product demos.

ElevenLabs / Murf AI – AI voiceovers for tutorials or narrations.

7. SEO & Marketing

SurferSEO / Semrush AI – Optimize content for search engines.

Copy.ai / Jasper SEO mode – Generate meta tags, descriptions, and headlines.

VidIQ / TubeBuddy AI – For video marketing insights if hosting multimedia content.

8. Testing & QA

Testim AI / Mabl / Functionize – Automated UI testing.

Sentry AI / LogRocket AI – AI-assisted error detection & debugging.

Percy AI – Visual regression testing.

9. Deployment & DevOps

Vercel AI / Netlify AI – Automatic CI/CD pipelines.

Render AI / Railway AI – Deploy full-stack apps with AI optimization.

Docker + AI scripts – Generate Dockerfiles and deployment configs.

10. Analytics & Monitoring

Google Analytics AI / Heap AI – Insights and trend analysis.

Hotjar AI / FullStory AI – AI-assisted session replay analysis. 
"""

THE PROJECT EDITOR HAS FOUR MAIN SECTIONS 

editor/library 
_________________

where the user keeps track about what are the prompts he used to build the websites using the above tools

editor/plans
_________________

in this section user plans what are the changes need in future. Its a classic chat interface

editor/status 
_________________

keep track of the plan created in plan sectoin whether it has accomplished or not like a todo list


editor/docs
____________

this is a carbon copy of github.gg documentaion section where it gives detailed description of every file in the project(repo)
refer : https://github.gg

initial state(not used before)
...............................

centerd button "Initialze"

which sends a request to the backend to generate docs


THE NABIGATION IS DONE THROUGH THE SIDEBAR(CUTOMIZE IT FOR 4 SECTIONS)


FLOW(AFTER THE WIZARD)

IF USER CLICKED "CONNECT REPOSITORY":

IT DIRECTS TO editor/plan section

  IF USER LOGS FOR THE FIRST TIME

  should see a chat interface 

  if not : loads history from the db

IF USER CLICKED "FROM SCRATCH":

  should leads to editor/library where it shows a button(centerd) iniitalize prompts

STRICTLY USE MY DESIGN SYSTEM AND COMPONENTS