# Visible — Career Decision Intelligence

> Know your leverage before the meeting.

Visible is a career operating system for professionals whose work is
underrecognized. It gives employees the evidence, the language, and
the analysis to walk into their next review, negotiation, or career
decision with complete information — not gut feeling.

---

## What It Does

Three high-stakes career moment tools built on a single data spine:

| Tool | Problem | Output |
|------|---------|--------|
| **Review Ready** | Performance review coming up | Executive-ready promotion case document |
| **Offer Lens** | Job offer on the table | True total compensation comparison |
| **Signal Check** | Something feels wrong | Departure signal analysis and options |

---

## Bootcamp Assignment Context

This project also satisfies the **React Module Project** requirement
(FakeStore E-Commerce App). The same component architecture that powers
Visible is used with FakeStoreAPI as the data source in assignment mode.

**To run in FakeStore assignment mode:**
```
VITE_API_MODE=fakestore
```

**To run in Visible product mode:**
```
VITE_API_MODE=visible
```

All CRUD operations, routing, loading states, error handling, and
navigation satisfy the FakeStore assignment requirements. Products
map to WorkEntry shape — the same components, the same patterns,
different data.

---

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **React Router v6** for navigation
- **Auth0** for authentication
- **Axios** for API calls
- **Claude API** (Anthropic) for the Review Ready intelligence layer

---

## Project Structure

```
src/
  domain/               — TypeScript types for every domain
  application/
    actions/            — API calls and business logic
  infrastructure/
    auth/               — Auth0 provider and ProtectedRoute
    repositories/
      local/            — API service layer (FakeStore + Visible modes)
  presentation/
    pages/              — Route-level page components
    components/         — Reusable UI components
  intelligence/         — Claude API integration
  index.css             — Global design system
  App.tsx               — Routing shell
  main.tsx              — Entry point
```

---

## Setup Instructions

**1. Clone the repository**
```bash
git clone https://github.com/kmatosli/visible-app.git
cd visible-app
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your Auth0 credentials:
```
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id
VITE_API_MODE=fakestore
```

**4. Start the development server**
```bash
npm run dev
```

The app runs at `http://localhost:5173`

---

## Auth0 Setup

1. Create an application at [auth0.com](https://auth0.com)
2. Application type: Single Page Application
3. Add to Allowed Callback URLs: `http://localhost:5173`
4. Add to Allowed Logout URLs: `http://localhost:5173`
5. Add to Allowed Web Origins: `http://localhost:5173`
6. Copy Domain and Client ID to your `.env` file

---

## Assignment Requirements Satisfied

| Requirement | Implementation |
|-------------|---------------|
| Home page with navigation | `DashboardPage.tsx` at `/` |
| Product listing page | `EntryListPage.tsx` at `/entries` |
| Product details page with useParams | `EntryDetailPage.tsx` at `/entries/:id` |
| Add product form (POST) | `EntryFormPage.tsx` at `/entries/new` |
| Edit product form (PUT) | `EntryFormPage.tsx` at `/entries/:id/edit` |
| Delete with confirmation modal | `EntryDetailPage.tsx` |
| Navbar with mobile support | `AppHeader.tsx` |
| Loading states | All pages |
| Error handling | All pages |
| React Router navigation | `App.tsx` |
| Axios for API calls | `apiService.ts` |

---

## The Product Vision

This is not a school project. It is a product being built for the
professionals who have spent years doing valuable work that organizations
consistently underrecognize.

The information asymmetry in employment has always worked in the
employer's favor. Visible closes that gap.
