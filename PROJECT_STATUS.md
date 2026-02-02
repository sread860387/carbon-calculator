# Carbon Calculator - Project Status

**Last Updated:** 2026-02-02

## Current State
Production-ready carbon calculator deployed at Vercel with full functionality for film & TV production emissions tracking.

## Recent Work Completed

### 1. Scope 1 & 2 Emissions Breakdown (Jan 2026)
- ✅ Implemented SEA & BAFTA albert methodology for scope classifications
- ✅ Added Scope 1, 2, 3 breakdown card to Dashboard
- ✅ Updated PDF, CSV, and email exports to include scope breakdown
- ✅ Created `src/utils/scopeClassifications.ts` utility

**Scope Classifications:**
- **Scope 1**: Utilities (heat), Fuel (generators + vehicles)
- **Scope 2**: Utilities (electricity), EV Charging
- **Scope 3**: Hotels, Commercial Travel, Charter Flights

### 2. Production Info Persistence Fix
- ✅ Fixed critical bug where Production Information wasn't saving
- ✅ Added proper Date serialization/deserialization to Zustand persist
- ✅ Storage version bumped to v3 (users need to re-enter data once)

### 3. Hotels Module Enhancements
- ✅ Added informational note about scope classification
- ✅ Clarified: crew accommodation = Scope 3, production offices = Scope 1 & 2
- ✅ Added guidance to use Production Info + Utilities for hotel offices
- ✅ **NEW**: Multiple simultaneous forms feature
  - Users can open multiple entry forms at once
  - Each form is independent with Cancel button
  - Auto-closes on submit
  - "+ Add Another Entry" button

## Modules Implemented
1. ✅ Production Info
2. ✅ Utilities (electricity, natural gas, fuel oil)
3. ✅ Fuel (generators, production vehicles)
4. ✅ EV Charging
5. ✅ Hotels & Housing
6. ✅ Commercial Travel (flights)
7. ✅ Charter Flights

## Export Features
- ✅ Comprehensive PDF report (multi-page with recommendations)
- ✅ CSV export (production summary)
- ✅ JSON export (planned)
- ✅ Data contribution to SEA via email (Resend API)

## Known Issues / Future Enhancements

### Suggested Improvements
1. **Multiple Forms Feature**: Currently only in Hotels module
   - Could expand to: Utilities, Fuel, EV Charging, Commercial Travel, Charter Flights

2. **Duplicate Entry**: Add "Duplicate" button to forms to copy values

3. **Draft Persistence**: Save in-progress forms across page reloads

4. **User Feedback from Testing**:
   - Production Info now fixed (was not persisting)

### Not Yet Implemented
- Transport module (from original plan - road/air/rail)
- Waste module
- Additional modules as needed

## Technical Stack
- React 18 + TypeScript + Vite
- Tailwind CSS
- Zustand (state management with persist)
- react-hook-form + Zod validation
- jsPDF + jsPDF-AutoTable (PDF export)
- PapaParse (CSV export)
- Resend API (email service)
- Deployed on Vercel

## File Structure
```
/Users/samread/carbon-calculator/
├── src/
│   ├── components/
│   │   ├── modules/      # Module-specific components
│   │   ├── ui/           # Reusable UI components
│   │   └── shared/       # Shared components (ContributeDataModal)
│   ├── pages/            # Page components
│   ├── store/            # Zustand stores
│   ├── services/
│   │   ├── calculations/ # Emission calculations
│   │   └── export/       # PDF, CSV, JSON export
│   ├── types/            # TypeScript definitions
│   ├── utils/            # Utilities (formatters, scopeClassifications)
│   └── config/           # Emission factors
├── api/
│   └── contribute-data.ts # Vercel serverless function
└── dist/                 # Build output
```

## Key Files
- `src/utils/scopeClassifications.ts` - Scope 1 & 2 calculation logic
- `src/store/useProductionInfoStore.ts` - Fixed Date persistence
- `src/pages/DashboardPage.tsx` - Main dashboard with scope breakdown
- `src/pages/HotelsPage.tsx` - Example of multiple forms feature
- `src/services/export/comprehensivePdfExport.ts` - PDF generation
- `api/contribute-data.ts` - Email submission to SEA

## Environment Variables (Vercel)
- `RESEND_API_KEY` - For email functionality (currently using test domain)

## Git Repository
- Repo: https://github.com/sread860387/carbon-calculator
- Branch: main
- Latest commits:
  - Multiple forms feature
  - Scope classification note
  - Production Info persistence fix
  - Scope 1 & 2 breakdown

## Next Session TODO
When resuming:
1. Consider expanding multiple forms feature to other modules
2. Test all functionality end-to-end
3. Consider adding duplicate entry feature
4. Consider adding Transport module (if needed)
5. Get user feedback on recent changes

## Documentation
- `CONTRIBUTING_DATA_SETUP.md` - Email service setup instructions
- `PROJECT_STATUS.md` - This file
- Plan file at: `~/.claude/plans/parsed-sprouting-walrus.md`

## Contact
- Calculator deployed at Vercel
- User: samread
- Working directory: `/Users/samread/carbon-calculator`
