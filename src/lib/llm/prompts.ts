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
 * CURATE_RESUME_PROMPT
 * Used to curate resume based on specific job description
 * 
 * @param resumeData - Current resume data as JSON string
 * @param jobDescription - Target job description to tailor for
 * @param lang - Target language for output ("en" | "id")
 * @param schema - JSON schema example for output structure (use RESUME_SCHEMA_EXAMPLE)
 * 
 * Input: JSON (FormData structure), plain text (job description)
 * Output: JSON (same FormData structure with optimized content)
 */
export const CURATE_RESUME_PROMPT = (resumeData: string, jobDescription: string, lang: ResumeLanguage = "en") => 
`Tailor this resume for the job. Output ONLY the JSON object, no other text.

IMPORTANT: Write the output in ${LANGUAGE_LABELS[lang]}.

Job Description:
${jobDescription}

Current Resume:
${resumeData}

Instructions:
- Reorder and emphasize relevant skills and experiences
- DO NOT invent new information
- Adjust language to match job requirements
- Keep all information truthful
- Return the same JSON structure with optimized content
`;

/**
 * PARSE_RESUME_PROMPT
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
    "title": "Software Engineer",
    "email": "john@example.com",
    "phone": "+1-555-0100",
    "location": "San Francisco, CA",
    "website": "https://johndoe.dev",
    "linkedin": "linkedin.com/in/johndoe",
    "github": "github.com/johndoe"
  },
  "summary": "Experienced software engineer with 5+ years...",
  "workExperience": [
    {
      "id": 1,
      "title": "Senior Software Engineer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "years": "2020 - Present",
      "description": [
        "Led development of microservices architecture",
        "Improved system performance by 40%"
      ]
    }
  ],
  "education": [
    {
      "id": 1,
      "institution": "University of California",
      "degree": "B.S. Computer Science",
      "years": "2014 - 2018",
      "description": "Graduated with honors"
    }
  ],
  "personalProjects": [
    {
      "id": 1,
      "name": "Open Source Tool",
      "role": "Creator & Maintainer",
      "years": "2021 - Present",
      "description": [
        "Built CLI tool with 1000+ GitHub stars",
        "Used by 50+ companies worldwide"
      ]
    }
  ],
  "additional": {
    "technicalSkills": ["Python", "JavaScript", "AWS", "Docker"],
    "languages": ["English (Native)", "Spanish (Conversational)"],
    "certificationsTraining": ["AWS Solutions Architect"],
    "awards": ["Employee of the Year 2022"]
  },
  "customSections": {
    "publications": {
      "sectionType": "itemList",
      "items": [
        {
          "id": 1,
          "title": "Paper Title",
          "subtitle": "Journal Name",
          "years": "2023",
          "description": ["Brief description of the publication"]
        }
      ]
    },
    "volunteer_work": {
      "sectionType": "text",
      "text": "Description of volunteer activities..."
    }
  }
}`

const RESUME_SCHEMA_EXAMPLE2 = `{
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
  "workExperiences": [
    {
      "id": 1,
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
  "educations": [
    {
      "id": 1,
      "institution": "University of California",
      "degree": "B.S. Computer Science",
      "years": "2014 - 2018",
      "description": "Graduated with honors"
    }
  ],
  "personalProjects": [
    {
      "id": 1,
      "name": "Open Source Tool",
      "role": "Creator & Maintainer",
      "years": "2021 - Present",
      "description": [
        "Built CLI tool with 1000+ GitHub stars",
        "Used by 50+ companies worldwide"
      ]
    }
  ],
}`

// Use this as reference
export const RESUME_SCHEMA = RESUME_SCHEMA_EXAMPLE;