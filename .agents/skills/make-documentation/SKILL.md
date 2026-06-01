---
name: Documentation Implementation
description: Technical documentation, API references, user guides, maintaining documentation quality. Use for documentation, docs, user-docs, api-docs, guide, readme tags. Provides documentation patterns, validation, clarity standards.
allowed-tools: Read, Write, Edit, Grep, Glob
---

# Documentation Implementation Skill

Domain-specific guidance for creating clear, comprehensive technical documentation.

## When To Use This Skill

Load this Skill when task has tags:
- `documentation`, `docs`, `user-docs`, `api-docs`
- `guide`, `readme`, `tutorial`, `reference`

## Validation Commands

### Check Documentation
```bash
# Markdown linting
npx markdownlint **/*.md

# Spell check
npx cspell "**/*.md"

# Link checking
npx markdown-link-check docs/**/*.md

# Build documentation site (if applicable)
npm run docs:build
mkdocs build
```

### Preview Documentation
```bash
# Live preview
npm run docs:serve
mkdocs serve

# Static site preview
python -m http.server 8000 -d docs/
```

## Success Criteria (Before Completing Task)

✅ **Documentation is accurate** (reflects actual behavior)
✅ **Documentation is complete** (all required sections present)
✅ **Examples work** (code examples run without errors)
✅ **Links are valid** (no broken links)
✅ **Spelling and grammar correct**
✅ **Follows project style guide**

## Common Documentation Tasks

### API Documentation
- Endpoint descriptions (path, method)
- Request parameters (required, optional, types)
- Response schemas (success, error)
- Status codes (200, 400, 401, 404, 500)
- Example requests/responses
- Authentication requirements

### User Guides
- Step-by-step instructions
- Screenshots or diagrams
- Prerequisites
- Troubleshooting section
- FAQs

### README Files
- Project overview
- Installation instructions
- Quick start guide
- Configuration options
- Contributing guidelines

### Code Documentation
- Function/method descriptions
- Parameter documentation
- Return value documentation
- Usage examples
- Edge cases and gotchas

## Documentation Patterns

### API Endpoint Documentation

```markdown
## POST /api/users

Creates a new user account.

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "email": "user@example.com",    // Required, must be valid email
  "password": "secure123",        // Required, min 8 characters
  "name": "John Doe"              // Required
}
```

**Success Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**

- **400 Bad Request** - Invalid input
  ```json
  { "error": "Invalid email format", "code": "VALIDATION_ERROR" }
  ```

- **409 Conflict** - Email already exists
  ```json
  { "error": "Email already registered", "code": "DUPLICATE_EMAIL" }
  ```

**Example Request:**
```bash
curl -X POST https://api.example.com/api/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secure123","name":"John Doe"}'
```
```

### User Guide Pattern

```markdown
# Feature Title

Brief overview of what this guide covers.

## Prerequisites

- Requirement 1
- Requirement 2

## Step 1: Action Name

Clear instruction. One action per step.

## Troubleshooting

**Problem:** Symptom description
**Solution:** Fix or workaround
```

### Code Documentation Pattern

```typescript
/**
 * Brief description of what the function does.
 *
 * @param paramName - Description (type, constraints)
 * @returns Description of return value
 * @throws ErrorType - When this error occurs
 *
 * @example
 * const result = myFunction('input');
 * console.log(result); // expected output
 */
function myFunction(paramName: string): ReturnType { }
```

## Blocker Report Format

```
⚠️ BLOCKED - Requires Senior Engineer

Issue: [Specific problem]

Attempted Research:
- [Sources checked]
- [Why it didn't work]

Blocked By: [Task ID / incomplete implementation / unclear requirements]

Partial Progress: [What documentation you DID complete]

Requires: [What needs to happen to unblock]
```

## Documentation Quality Checklist

### Clarity
✅ Simple, clear language — defines terms on first use
✅ Short sentences (< 25 words), active voice
✅ Consistent terminology throughout

### Completeness
✅ All required sections present
✅ All parameters and status codes documented
✅ Edge cases and troubleshooting included

### Accuracy
✅ Code examples tested and working
✅ API responses match actual responses
✅ Links valid, version numbers correct

### Formatting
✅ Consistent heading levels
✅ Code blocks have language specified
✅ Proper markdown syntax

## Writing Style Guidelines

**Active voice:** "The API returns the user object" not "The user object is returned"

**Be specific:** "Send a POST request to /api/users with email, password, and name" not "Call the endpoint with the data"

**Show, don't tell:** Provide working code examples with expected output for every feature.

**Anticipate questions:** After each instruction, consider what could go wrong and add troubleshooting.

## What NOT to Do

❌ Use jargon without explaining it
❌ Assume prior knowledge
❌ Skip error cases
❌ Provide untested code examples
❌ Use vague terms ("simply", "just", "obviously")
❌ Forget to update docs when code changes
❌ Document implementation details users don't need

## Focus Areas

When reading task sections, prioritize:
- `requirements` — What needs documenting
- `context` — Purpose and audience
- `documentation` — Existing docs to update
- `implementation` — How it actually works

## Remember

- **Accuracy is critical** — test everything you document
- **Clarity over cleverness** — simple language wins
- **Examples are essential** — every feature needs working examples
- **Update, don't duplicate** — check if docs already exist
- **Test your instructions** — follow them yourself
- **Users read docs when stuck** — be helpful and thorough
