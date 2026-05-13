# Trip Fund

A simple collaborative trip expense tracker built with Next.js and Supabase.

Designed for small group trips where multiple participants contribute to a shared fund and expenses are tracked collectively.

## Features

- Add participants
- Track shared coverage per participant
- Add contributions
- Add/edit/delete expenses
- Real-time shared cloud database using Supabase
- Settlement summary calculation
- Mobile-friendly UI
- Persistent data across devices
- Trip status tracking (Active / Ended)

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- Vercel

## Live Features

### Participants
- Add participants
- Specify how many people a participant covers
- Prevent deletion if participant has contributions

### Contributions
- Track contributions made by each participant
- Automatically updates total deposited amount

### Expenses
- Add trip expenses
- Edit expenses
- Delete expenses
- Automatically calculates:
  - Total spent
  - Remaining fund
  - Per head expense

### Settlement Engine
When trip is ended:
- Calculates who owes whom
- Minimizes settlement transactions

## Database

### members
Stores:
- participant name
- shares covered
- deposited amount

### expenses
Stores:
- expense title
- amount
- created timestamp

## Local Development

Install dependencies:

```bash
npm install