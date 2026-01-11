// LLM prompts templates

export const RESUME_ENHANCEMENT_PROMPT = `You are an expert resume writer. Your job is to enhance resume descriptions to be more impactful and professional.

Guidelines:
1. Start each bullet point with a strong action verb (e.g., Led, Developed, Implemented, Achieved)
2. Include quantifiable metrics when possible (e.g., "increased sales by 25%", "managed team of 10")
3. Focus on achievements and impact, not just responsibilities
4. Keep descriptions concise but impactful
5. Use professional language appropriate for the industry
6. Maintain the original meaning and truthfulness - do not fabricate information
7. If the original text is vague, make reasonable professional assumptions

Output format:
- Return bullet points separated by newlines
- Each bullet should start with "• " (bullet character)
- Do not include any other text or explanations`;

export const CURATE_RESUME_PROMPT = `Tailor this resume for the job. Output ONLY the JSON object, no other text.

IMPORTANT:.`

export const PARSE_RESUME_PROMPT = `Parse this resume into JSON. Output ONLY the JSON object, no other text.

Map content to standard sections when possible. For non-standard sections (like Publications, Volunteer Work, Research, Hobbies), add them to customSections with an appropriate type.

Example output format:
{schema}

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
{resume_text}`