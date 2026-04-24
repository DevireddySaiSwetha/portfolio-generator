// Test the full portfolio generation flow using Swetha's resume text
// Run with: node test-flow.mjs

import Groq from 'groq-sdk'
import * as dotenv from 'dotenv'
import { readFileSync } from 'fs'

dotenv.config({ path: '.env.local' })

const RESUME_TEXT = `
SAI SWETHA DEVIREDDY
+1 (774) 418-6971 | devireddysaiswetha@gmail.com | LinkedIn
SENIOR BACKEND SOFTWARE ENGINEER | CLOUD-NATIVE | MICROSERVICES | GCP / AWS

Senior Backend Software Engineer with 7+ years of experience building scalable, cloud-native microservices using Java, Spring Boot, and distributed systems architecture. Proven expertise in developing REST and GraphQL APIs, event-driven systems, and CI/CD pipelines across AWS and Azure, with working knowledge of Google Cloud Platform (GCP) and Kubernetes (GKE).

TECHNICAL SKILLS:
Languages: Java (Core, 21), Go
Frameworks: Spring Boot, Spring Cloud, Hibernate, JUnit, Mockito
Microservices & APIs: REST APIs, GraphQL, Distributed Systems
Cloud Platforms: AWS (Lambda, API Gateway, EventBridge, EKS), Azure, GCP (GKE, Pub/Sub)
Containers & Orchestration: Docker, Kubernetes (EKS, exposure to GKE)
CI/CD & DevOps: GitHub Actions, Jenkins, Argo CD, GitOps
Messaging & Streaming: Kafka, ActiveMQ
Databases: PostgreSQL, MongoDB, DynamoDB
Security: OAuth2, SAML, IAM, KMS, Secrets Management, HIPAA-aligned architecture
Monitoring: Dynatrace, Splunk, OpenTelemetry

PROFESSIONAL EXPERIENCE

Senior Software Engineer
Evernorth (Cigna) | Apr 2024 – Present
- Designed cloud-native microservices using Java Spring Boot for clinical and pharmacy workflows
- Built REST APIs and GraphQL-ready data models for flexible client-driven data retrieval
- Implemented event-driven architecture using AWS EventBridge, Kafka, and Step Functions
- Deployed containerized services on Kubernetes (EKS) with GKE deployment patterns
- Automated CI/CD pipelines using GitHub Actions and Argo CD (GitOps)
- Applied IAM, encryption (KMS), and HIPAA-aligned PHI security practices

Senior Software Developer
Elevance Health | Aug 2021 – Aug 2022
- Designed scalable microservices architecture using Spring Boot
- Built RESTful APIs for healthcare plan automation workflows
- Implemented event-driven systems using Kafka
- Automated CI/CD pipelines using Jenkins and Bitbucket

Software Developer & Cloud Engineer
Siemens Technology | Jul 2017 – Aug 2021
- Developed backend microservices using Java and Spring Boot
- Built event-driven messaging systems using ActiveMQ
- Deployed containerized applications on Kubernetes (EKS) with GCP (GKE, Pub/Sub) exposure
- Automated infrastructure using Terraform and CI/CD pipelines
- Implemented OAuth2 and JWT authentication
- Optimized using PostgreSQL, Redis, and DynamoDB

EDUCATION
Master of Science in Computer Science
Clark University, Worcester, MA
`

const EXTRACTION_PROMPT = `You are a resume parser. Extract structured data from the resume text below and return valid JSON only. No markdown, no explanation, no code fences — just raw JSON.

Schema:
{
  "name": "Full Name",
  "title": "Current Job Title",
  "summary": "2-3 sentence professional summary",
  "email": "email@example.com",
  "phone": "+1 (xxx) xxx-xxxx or null",
  "github": "https://github.com/username or null",
  "linkedin": "https://linkedin.com/in/username or null",
  "skills": [
    { "category": "Category Name", "items": ["skill1", "skill2"] }
  ],
  "experience": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "period": "Month Year – Month Year",
      "bullets": ["achievement 1", "achievement 2"]
    }
  ],
  "education": [
    { "degree": "Degree Name", "school": "School Name", "year": "Year" }
  ],
  "projects": [
    {
      "title": "Project Title",
      "description": "2-3 sentence description",
      "gradient": "linear-gradient(135deg, #5000ca 0%, #00b4d8 100%)",
      "link": null
    }
  ]
}`

async function testResumeParser() {
  console.log('=== TEST 1: Resume Parsing (Groq) ===')
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: EXTRACTION_PROMPT },
        { role: 'user', content: RESUME_TEXT },
      ],
      temperature: 0.1,
    })

    let raw = completion.choices[0].message.content?.trim() ?? '{}'
    raw = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    const parsed = JSON.parse(raw)

    console.log('✅ Resume parsed successfully')
    console.log(`   Name: ${parsed.name}`)
    console.log(`   Title: ${parsed.title}`)
    console.log(`   Email: ${parsed.email}`)
    console.log(`   Phone: ${parsed.phone}`)
    console.log(`   Skills categories: ${parsed.skills?.length ?? 0}`)
    console.log(`   Experience entries: ${parsed.experience?.length ?? 0}`)
    console.log(`   Education entries: ${parsed.education?.length ?? 0}`)
    console.log(`   Projects: ${parsed.projects?.length ?? 0}`)
    return parsed
  } catch (err) {
    console.error('❌ Resume parsing failed:', err.message)
    return null
  }
}

async function testBackgroundGen() {
  console.log('\n=== TEST 2: Background Image Generation ===')
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/generate-background`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bgTheme: 'space' }),
    })
    const data = await res.json()
    if (data.url) {
      console.log('✅ Background image URL generated:', data.url.slice(0, 60) + '...')
      return data.url
    } else {
      console.error('❌ No URL returned:', data)
      return null
    }
  } catch (err) {
    console.error('❌ Background gen failed:', err.message)
    return null
  }
}

async function testPublishApi(parsedData) {
  console.log('\n=== TEST 3: Publish Portfolio to Supabase ===')
  try {
    // We need a real user_id for this — skip if no test user
    console.log('⏭️  Skipped (requires authenticated user_id from Supabase)')
    console.log('   This will work end-to-end through the /bot UI')
  } catch (err) {
    console.error('❌ Publish failed:', err.message)
  }
}

async function testPortfolioRoute() {
  console.log('\n=== TEST 4: App Health Check ===')
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_APP_URL)
    console.log(`✅ App is running — status: ${res.status}`)
  } catch (err) {
    console.error('❌ App not reachable:', err.message)
    console.log('   Make sure dev server is running: npm run dev')
  }
}

// Run all tests
console.log('Portfolio Generator — Flow Test')
console.log('================================\n')

const parsed = await testResumeParser()
await testBackgroundGen()
await testPublishApi(parsed)
await testPortfolioRoute()

console.log('\n================================')
console.log('Tests complete.')
