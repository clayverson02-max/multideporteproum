# Plan: Transformation to "Desafío 7 Días de Transformación" Sales Page

The project will be pivoted from a client manager dashboard to a high-conversion sales page in Spanish for a 7-day fitness transformation challenge, following the structure of the reference page.

## Visual Design
- **Theme**: Aggressive dark mode with bright accents (Yellow for highlights, Green/Purple for urgency).
- **Typography**: Bold headers, readable body text.
- **Layout**: Single-page long-form sales letter style.

## Technical Changes

### Routing & Layout
- Modify `src/routes/__root.tsx`: Remove `SidebarProvider` and `AppSidebar`. Update metadata.
- Rewrite `src/routes/index.tsx`: Implement the full sales page structure.

### Sales Page Structure
1. **Urgency Bar**: Sticky top banner with countdown/urgency text.
2. **Hero**: Aggressive headline, subheadline, and VSL placeholder.
3. **Pain Points**: Emotional copy about weight loss struggles.
4. **Offer Breakdown**: Cards for the 50 exercises and 50 recipes.
5. **Methodology**: 3-step process description.
6. **Social Proof**: Result transformations.
7. **Bonuses**: 4 exclusive bonus items.
8. **Pricing**: Comparison table (Basic vs Premium).
9. **Guarantee**: 7-day satisfaction badge.
10. **Comparison**: "With vs Without" the challenge.
11. **FAQ**: Accordion with common questions.
12. **CTA**: Multiple standardized buttons throughout the page.

### Styles
- Update `src/styles.css` with the new color palette (Yellow: `#FFFF00`, Urgency Green: `#00FF00` or Purple).

## User Review Required

> [!IMPORTANT]
> The existing "Assessoria Clayverson Demontier" management UI will be removed.

### Questions
1. Do you want to keep the "RF Multimarcas" or "Assessoria" logo, or should I create a new fitness-related branding?
2. Should the checkout buttons lead to a specific URL (like Hotmart/Stripe), or just show a message for now?
3. Should I keep the Supabase integration logic for a "Waitlist" or similar, or remove it entirely?
