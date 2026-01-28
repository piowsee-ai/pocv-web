// LLM prompts templates

// Supported languages
export type ResumeLanguage = "en" | "id";

export const LANGUAGE_LABELS: Record<ResumeLanguage, string> = {
  en: "English",
  id: "Bahasa Indonesia",
};

/**
 * RESUME_ENHANCEMENT_PROMPT
 * Used when first generating/enhancing CV descriptions; user inputed description only
 * 
 * @param resumeData - User-inputted resume data as formatted string
 * @param lang - Target language for output ("en" | "id")
 * @param schema - JSON schema example for output structure
 * 
 * Input: Formatted data with only description filled. This data should be parsed into the full JSON format.
 * Output: Plain text (bullet points starting with "• ", separated by newlines)
 */
export const RESUME_ENHANCEMENT_PROMPT = (resumeData: string, lang: ResumeLanguage = "en", schema: string = RESUME_SCHEMA) => 
`You are an expert resume writer. Your job is to parse the description provided by the user into a JSON formatted. Output ONLY the JSON object, no other text.

Follow these rules:
1. Description guidelines:
- Start with strong action verbs (Developed, Led, Implemented, Optimized, Built, etc.)
- Include metrics, numbers, percentages ONLY IF mentioned in source text, don't invent metrics or details
- Examples:
    With metrics (good): "Led team of 5 developers to create mobile app with 10K+ downloads."
    Without metrics (bad): "Developed responsive web interfaces using React and TypeScript."

2. Content Optimization:
- Prioritize impact-focused statements, state the bussiness or technical outcome when possible
- Keep 2-4 bullet points per section (education/work/orgs)
- Priority order: Technical > Leadership > General
- Merge similar points using "and" when exceeding limit. If merging, preserve key verbs:
    Bad: "Did X. Did Y."
    Good: "Spearheaded X and Y resulting in Z"
- Use past tense for past roles, present tense for current roles
- Avoid buzzwords and fluff - be specific and concrete
- Do NOT use em dash ("—") anywhere in the writing/output, even if it exists, remove it
- Use "" for missing text fields and [] for missing arrays

3. Formatting Rules:
- Treat these as equivalent list markers: •, ‣, ➢, 1., a, -, etc.)
- Preserve ALL original information unless redundant
- Ignore line wrapping differences between mobile/desktop

4. Language Requirements:
- Output keys should remain in ENGLISH. Use proper punctuation and capitalization (like commas, periods, title case, etc.)
- Translate all field values to ${LANGUAGE_LABELS[lang]}.
- Use professional and industry-standard terminology in the target language.

Example output JSON format:
${schema}

Current Resume:
${resumeData}
`;

/**
 * EXTRACT_KEYWORDS_PROMPT
 * Used to extract keywords from job description
 * 
 * @param jobDescription - Job description to extract keywords from
 * 
 * Input: plain text (job description)
 * Output: JSON (extracted keywords)
 */
export const EXTRACT_KEYWORDS_PROMPT = (jobDescription: string) => `Extract job requirements as JSON. Output ONLY the JSON object, no other text.

Example format:
{{
  "required_skills": ["Python", "AWS"],
  "preferred_skills": ["Kubernetes"],
  "experience_requirements": ["5+ years"],
  "education_requirements": ["Bachelor's in CS"],
  "key_responsibilities": ["Lead team"],
  "keywords": ["microservices", "agile"],
  "experience_years": 5,
  "seniority_level": "senior"
}}

Extract numeric years (e.g., "5+ years" → 5) and infer seniority level.

Job description:
${jobDescription}
`;

/**
 * CRITICAL_TRUTHFULNESS_RULES & CRITICAL_TRUTHFULNESS_RULES_TEMPLATE
 * Used to generate truthfulness rules for curating resume
 * 
 * @param rule_7 - Rule 7 to be added to the template
 * 
 * Input: plain text (rule 7)
 * Output: plain text (truthfulness rules)
 */
export const TRUTHFUL_TEMPLATE = (rule_7: string) => `CRITICAL TRUTHFULNESS RULES - NEVER VIOLATE:
1. DO NOT add any skill, tool, technology, or certification that is not explicitly mentioned in the original resume
2. DO NOT invent numeric achievements (e.g., "increased by 30%") unless they exist in original
3. DO NOT add company names, product names, or technical terms not in the original
4. DO NOT upgrade experience level (e.g., "Junior" -> "Senior")
5. DO NOT add languages, frameworks, or platforms the candidate hasn't used
6. DO NOT extend employment dates or change timelines (start/end years)
7. ${rule_7}
8. Preserve factual accuracy - only use information provided by the candidate

Violation of these rules could cause serious problems for the candidate in job interviews.
`;

export const TRUTHFUL_RULES = {
    "nudge": TRUTHFUL_TEMPLATE(
        "DO NOT add new bullet points or content - only rephrase existing content"
    ),
    "keywords": TRUTHFUL_TEMPLATE(
        "You may rephrase existing bullet points to include keywords, but do NOT add new bullet points"
    ),
    "full": TRUTHFUL_TEMPLATE(
        "You may expand existing bullet points or add new ones that elaborate on existing work, but DO NOT invent entirely new responsibilities"
    ),
};

export const IMPROVE_RESUME_PROMPT_NUDGE = (truth_rules: string, lang: ResumeLanguage, schema: string = RESUME_SCHEMA, resumeData: string, jobDescription: string, jobKeywords: string) => `Lightly nudge this resume toward the job description. Output ONLY the JSON object, no other text.

${truth_rules}

IMPORTANT: Generate ALL text content (summary, descriptions, skills) in ${LANGUAGE_LABELS[lang]}.

Rules:
- Make minimal, conservative edits only where there is a clear existing match
- Do NOT change the candidate's role, industry, or seniority level
- Do NOT introduce new tools, technologies, or certifications not already present
- Do NOT add new bullet points or sections
- Preserve original bullet count and ordering within each section
- Keep proper nouns (names, company names, locations) unchanged
- Preserve the structure of any customSections from the original resume
- Preserve original date ranges exactly - do not modify years
- If the resume is non-technical, do NOT add technical jargon
- Do NOT use em dash ("—") anywhere in the writing/output, even if it exists, remove it

Job Description:
${jobDescription}

Keywords to emphasize (only if already supported by resume content):
${jobKeywords}

Original Resume:
${resumeData}

Output in this JSON format:
${schema}
`;


export const IMPROVE_RESUME_PROMPT_KEYWORDS = (truth_rules: string, lang: ResumeLanguage, schema: string = RESUME_SCHEMA, resumeData: string, jobDescription: string, jobKeywords: string) => `Enhance this resume with relevant keywords from the job description. Output ONLY the JSON object, no other text.

${truth_rules}

IMPORTANT: Generate ALL text content (summary, descriptions, skills) in ${LANGUAGE_LABELS[lang]}.

Rules:
- Strengthen alignment by weaving in relevant keywords where evidence already exists
- You may rephrase bullet points to include keyword phrasing
- Do NOT introduce new skills, tools, or certifications not in the resume
- Do NOT change role, industry, or seniority level
- Preserve the structure of any customSections from the original resume
- Preserve original date ranges exactly - do not modify years
- If resume is non-technical, keep language non-technical while still aligning keywords
- Do NOT use em dash ("—") anywhere in the writing/output, even if it exists, remove it

Job Description:
${jobDescription}

Keywords to emphasize:
${jobKeywords}

Original Resume:
${resumeData}

Output in this JSON format:
${schema}
`;


export const IMPROVE_RESUME_PROMPT_FULL = (truth_rules: string, lang: ResumeLanguage, schema: string = RESUME_SCHEMA, resumeData: string, jobDescription: string, jobKeywords: string) => `Tailor this resume for the job. Output ONLY the JSON object, no other text.

${truth_rules}

IMPORTANT: Generate ALL text content (summary, descriptions, skills) in ${LANGUAGE_LABELS[lang]}.

Rules:
- Rephrase content to highlight relevant experience
- DO NOT invent new information
- Use action verbs and quantifiable achievements
- Keep proper nouns (names, company names, locations) unchanged
- Translate job titles, descriptions, and skills to {output_language}
- Preserve the structure of any customSections from the original resume
- Improve custom section content the same way as standard sections
- Preserve original date ranges exactly - do not modify years
- Calculate and emphasize total relevant experience duration when it matches requirements
- Do NOT use em dash ("—") anywhere in the writing/output, even if it exists, remove it

Job Description:
${jobDescription}

Keywords to emphasize:
${jobKeywords}

Original Resume:
${resumeData}

Output in this JSON format:
${schema}
`;

export const IMPROVE_RESUME_PROMPTS = {
    "nudge": IMPROVE_RESUME_PROMPT_NUDGE,
    "keywords": IMPROVE_RESUME_PROMPT_KEYWORDS,
    "full": IMPROVE_RESUME_PROMPT_FULL,
};

/**
 * PARSE_RESUME_PROMPT (currently not being used - no pdf upload)
 * Used to parse raw resume text (from PDF/document upload) into structured JSON
 * 
 * @param resumeText - Raw text extracted from resume document
 * @param schema - JSON schema example for output structure (use RESUME_SCHEMA_EXAMPLE)
 */
export const PARSE_RESUME_PROMPT = (resumeText: string, schema: string = RESUME_SCHEMA) => 
`Parse this resume into JSON. Output ONLY the JSON object, no other text.

Map content to standard sections when possible. For non-standard sections (like Publications, Volunteer Work, Research), add them to customSections with an appropriate type.

Example output format:
${schema}

Custom section types:
- "text": Single text block (e.g., objective, statement)
- "itemList": List of items with title, subtitle, years, description (e.g., publications, research)
- "stringList": Simple list of strings (e.g., hobbies, interests)

Rules:
- Use "" for missing text fields, [] for missing arrays, null for optional fields
- Number IDs starting from 1
- Format years as "YYYY - YYYY" or "YYYY - Present"
- Use snake_case for custom section keys (e.g., "volunteer_work", "publications")
- Preserve the original section name as a descriptive key
- Normalize dates: "Jan 2020" → "2020", "2020-2021" → "2020 - 2021", "Current"/"Ongoing" → "Present"
- For ambiguous dates like "3 years experience", infer approximate years from context or use "~YYYY"
- Flag overlapping dates (concurrent roles) by preserving both, don't merge

Resume to parse:
${resumeText}`;

/**
 * RESUME_SCHEMA_EXAMPLE
 * JSON schema example used as reference to show LLM expected format
 */
const RESUME_SCHEMA_EXAMPLE = `{
  "personalData": {
    "name": "John Doe",
    "phone": "+1-555-0100",
    "email": "john@example.com",
    "location": "San Francisco, CA",
    "website": "https://johndoe.dev",
    "linkedin": "linkedin.com/in/johndoe",
    "github": "github.com/johndoe"
  },
  "summary": "Experienced software engineer with 5+ years...",
  "educations": [
    {
      "institution": "University of California",
      "degree": "Bachelor of Science",
      "major": "Computer Science",
      "location": "Los Angeles, CA",
      "gpa": "3.8/4.0",
      "startDate": "08/2014",
      "endDate": "05/2018",
      "description": [
        "Graduate with honors.",
        "Part of Robotics, Consulting, and Programming club."
      ]
    }
  ],
  "workExperiences": [
    {
      "position": "Senior Software Engineer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "startDate": "2020-01-01",
      "endDate": "Present",
      "description": [
        "Led development of microservices architecture",
        "Improved system performance by 40%"
      ]
    }
  ],
  "organizationExperiences": [
    {
      "position": "Volunteer Coordinator",
      "organization": "Nonprofit Org",
      "startDate": "01/2019",
      "endDate": "12/2021",
      "description": [
        "Organized community events with 200+ attendees",
        "Managed team of 10 volunteers"
    ]
    }
  ],
  "personalProjects": [
    {
      "name": "Open Source Tool",
      "description": [
        "Built CLI tool with 1000+ GitHub stars",
        "Used by 50+ companies worldwide"
      ]
    }
  ],
  "additional": {
    "skills": ["Python", "JavaScript", "AWS", "Docker"],
    "languages": ["English (Native)", "Spanish (Conversational)"],
    "certifications": ["AWS Solutions Architect"],
    "achievements": ["Employee of the Year 2022"]
  },
  "customSections": [
    {
      "sectionKey": "publications",
      "sectionTitle": "Publications",
      "sectionType": "itemList",
      "text": "",
      "items": [
        {
          "title": "Paper Title",
          "subtitle": "Journal Name",
          "years": "2023",
          "description": ["Brief description of the publication"]
        }
      ]
    },
    {
      "sectionKey": "volunteer_work",
      "sectionTitle": "Volunteer Work",
      "sectionType": "text",
      "text": "Description of volunteer activities...",
      "items": []
    }
  ]
}`

// Use this as reference
export const RESUME_SCHEMA = RESUME_SCHEMA_EXAMPLE;