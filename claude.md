# Claude Workflow Instructions

1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the todo .md file with a summary of the changes you made and any other relevant information.
8. DO NOT BE LAZY. NEVER BE LAZY. IF THERE IS A BUG FIND THE ROOT CAUSE AND FIX IT. NO TEMPORARY FIXES. YOU ARE A SENIOR DEVELOPER. NEVER BE LAZY

---

# Answer Engine Optimization (AEO) Guidelines

All content added to this site MUST follow these AEO best practices to rank well in AI answer engines (ChatGPT, Perplexity, Google AI Overview, Claude, etc.)

## Required for Every Page

### 1. Custom Metadata (Server Components)
Every page needs unique metadata exported at the top:
```typescript
export const metadata: Metadata = {
  title: 'Descriptive Page Title',
  description: 'Clear, informative description (150-300 chars) that directly answers what the page is about',
  openGraph: {
    title: 'Page Title',
    description: 'Description for social sharing',
    url: 'https://benchmarkequip.com/page-path',
  },
}
```

### 2. Structured Data (JSON-LD)
Add appropriate schema markup in the page's `<head>` or body:
- **Blog posts**: BlogPosting schema (already implemented)
- **Service pages**: Service schema
- **FAQ content**: FAQPage schema
- **How-to guides**: HowTo schema with steps
- **Equipment pages**: Product schema

### 3. Content Structure
- Use clear heading hierarchy (H1 > H2 > H3)
- One H1 per page that clearly states the topic
- Use H2s for main sections, H3s for subsections
- Write in clear, direct language that AI can parse
- Answer the "who, what, when, where, why, how" upfront

## Required for Blog Content

### 1. BlogPosting Schema (already in BlogPostClient.tsx)
Ensure all blog posts have:
- headline, description, datePublished, dateModified
- author with name and url
- publisher with logo
- mainEntityOfPage
- keywords array

### 2. Content Best Practices
- **Lead with the answer**: Put the key information in the first paragraph
- **Use lists and tables**: AI engines parse structured content better
- **Include specific numbers/stats**: "24-hour delivery" not "fast delivery"
- **Define terms**: Explain industry jargon for broader understanding
- **Add internal links**: Link to related blog posts and service pages

### 3. FAQ Sections
When adding FAQs to any page, use FAQPage schema:
```typescript
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Direct, complete answer text."
      }
    }
  ]
}
```

## Content Writing Rules for AEO

1. **Be direct**: Start sentences with the subject, avoid filler words
2. **Be specific**: Use exact numbers, names, locations
3. **Be comprehensive**: Cover the topic fully so AI has complete context
4. **Be authoritative**: Cite sources, include expertise signals
5. **Be current**: Include dates and update content regularly
6. **Use natural language**: Write how people actually ask questions
7. **Answer related questions**: Anticipate follow-up questions in content

## Schema Types Reference

| Content Type | Schema to Use |
|--------------|---------------|
| Blog posts | BlogPosting |
| Equipment guides | HowTo or Article |
| Service descriptions | Service |
| FAQ sections | FAQPage |
| Company info | LocalBusiness (in root layout) |
| Reviews/testimonials | Review, AggregateRating |
| Equipment listings | Product |
| Team members | Person |
| Breadcrumbs | BreadcrumbList |

## Testing AEO

After adding content, verify:
1. Schema validates at https://validator.schema.org/
2. Rich results preview at https://search.google.com/test/rich-results
3. Content is crawlable (check robots.txt allows the path)
4. Page appears in sitemap.xml