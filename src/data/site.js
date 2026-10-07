export const navLinks = [
  { label: 'About', to: '/about' }, { label: 'Projects', to: '/projects' },
  { label: 'Events', to: '/events' }, { label: 'Team', to: '/team' },
  { label: 'Resources', to: '/blog' }, { label: 'Open Source', to: '/open-source' },
]

export const pillars = [
  { id: '01', title: 'AI Projects', text: 'End-to-end AI systems, from ideation and design to deployment.', icon: '◈' },
  { id: '02', title: 'AI Agents', text: 'Tool-using assistants and agentic pipelines that can reason, plan, and act.', icon: '⌘' },
  { id: '03', title: 'Large Language Models', text: 'Prompting, evaluation, fine-tuning, and applications built on foundation models.', icon: '✳' },
  { id: '04', title: 'RAG Pipelines', text: 'Grounding AI responses in real knowledge with retrieval and context.', icon: '⟡' },
  { id: '05', title: 'API Integration', text: 'Connecting AI services, data providers, and platforms into useful products.', icon: '↗' },
  { id: '06', title: 'Open Source', text: 'Building in public and contributing to the wider AI ecosystem.', icon: '◎' },
  { id: '07', title: 'Workshops', text: 'Hands-on sessions for students at every level.', icon: '◉' },
  { id: '08', title: 'Development', text: 'Frontend, backend, deployment, and documentation for complete products.', icon: '◇' },
]

export const approach = [
  { number: '01', title: 'Learn', text: 'Workshops, study sessions, and reading circles build foundational and advanced knowledge.' },
  { number: '02', title: 'Build', text: 'Members form teams and work on real projects using the skills they have developed.' },
  { number: '03', title: 'Ship', text: 'Projects are deployed, documented, and made public instead of ending as notebooks.' },
  { number: '04', title: 'Contribute', text: 'Work goes to open source, and members contribute to existing repositories.' },
]

export const workshopTopics = [
  'Introduction to Large Language Models', 'Building AI Agents from Scratch',
  'RAG Pipeline Architecture', 'Prompt Engineering & Evaluation',
  'Working with OpenAI / Gemini / Mistral APIs', 'Fine-tuning Open Source Models',
  'Open Source Contribution Workflow', 'Deploying AI Applications',
]

export const resourceTools = [
  { name: 'LangChain', detail: 'Build LLM-powered apps', url: 'https://www.langchain.com/' },
  { name: 'LlamaIndex', detail: 'RAG and data framework', url: 'https://www.llamaindex.ai/' },
  { name: 'Hugging Face', detail: 'Model hub and inference', url: 'https://huggingface.co/' },
  { name: 'Ollama', detail: 'Run open models locally', url: 'https://ollama.com/' },
  { name: 'FastAPI', detail: 'Build AI APIs', url: 'https://fastapi.tiangolo.com/' },
]

// Club totals supplied by the user on 2026-10-08.
export const clubStats = [
  { label: 'Members', value: 26 },
  { label: 'Projects made', value: 0 },
  { label: 'Workshops done', value: 1 },
  { label: 'Open contributions', value: 0 },
]

export const featuredProjects = [
  { id: '01', title: null, category: 'LLM / RAG / Agent', description: null, image: null, href: null },
  { id: '02', title: null, category: 'API / Open Source', description: null, image: null, href: null },
  { id: '03', title: null, category: 'AI Agent / Development', description: null, image: null, href: null },
]

export const nextEvent = {
  title: null,
  startsAt: null,
  type: null,
  venue: null,
  description: null,
  registrationUrl: null,
}
