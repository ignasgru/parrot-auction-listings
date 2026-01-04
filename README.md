# Parrot Ops - Warehouse Operations System

A modern warehouse operations web application for ParrotAuction / HiBid via AuctionFlex360. Replaces manual processes with a clean UI while using Google Sheets/Drive as the backend.

## 🎯 Overview

Parrot Ops manages warehouse inventory, bins, lots, and zones through an interactive map-based interface. All data is stored in Google Sheets, and photos are organized in Google Drive folders.

## 📋 Core Principles

1. **Google Sheets is the source of truth** (database)
2. **Google Drive stores photos** (each lot has its own folder)
3. **Warehouse floorplan is editable** (zones defined in square feet)
4. **Bins contain multiple lots** (unlimited)
5. **Operational status is driven by bin workflow** (statuses like PHOTO_PROCESS, READY_FOR_ANALYSIS, READY_FOR_FLEX)
6. **Flex export is generated** from bins marked READY_FOR_FLEX
7. **Authentication is required** (Google OAuth via NextAuth)

## 🗄️ Data Model

Uses one Google Spreadsheet with the following tabs:

### BINS Sheet
Physical storage containers with columns:
- `BinID` (primary key)
- `Zone` (e.g., A, Office, Ken Rack)
- `Position` (optional, shelf/row)
- `Size` (XS…XXXL)
- `Status` (workflow status - drives automation/export)
- `Last Updated`, `Notes` (optional)
- `QR` (optional, printed)

### LOTS Sheet
Auction lots with columns:
- `LotID` (primary key, LOT-00001…)
- `BinID` (ref to BINS.BinID; many lots can share same BinID)
- `Title`, `Description`, `Condition`, `Category`
- `Status` (optional, can mirror bin status)
- `Buyer`, `Price`
- `Photos Folder Name`, `Photos Folder URL`
- `Photos Link` / `Listing URL` (optional)

**Rule:** Every lot must have its own Drive folder.

### ZONE_LAYOUT Sheet
Floorplan geometry with columns:
- `ZoneID`
- `X`, `Y` (top-left corner in feet)
- `Width`, `Height` (feet)
- `Active` (TRUE/FALSE)

Warehouse dimensions: 75 ft wide × 50 ft tall

### FLEX_EXPORT Sheet
AuctionFlex360 import format. Populated from lots where bin status = READY_FOR_FLEX.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Cloud Project with:
  - OAuth 2.0 Client ID and Secret
  - Google Sheets API enabled
  - Google Drive API enabled
- Google Spreadsheet with the tabs above

### Environment Variables

Create `.env.local`:

```bash
# NextAuth
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Google Sheets
GOOGLE_SHEET_ID=your-google-sheet-id
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### Installation

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## 📁 Project Structure

```
parrot-ops/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth routes
│   │   ├── bins/         # Bin operations
│   │   ├── lots/         # Lot operations
│   │   └── zone-layout/  # Zone layout CRUD
│   ├── bins/             # Bin pages
│   ├── lots/             # Lot pages
│   ├── map/              # Map viewer/editor
│   ├── find/             # Search page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
├── lib/                  # Utilities
│   ├── auth.ts          # NextAuth config
│   └── google.ts        # Google APIs client
└── package.json
```

## 🔑 API Routes

- `GET /api/zone-layout` - Read zone layout
- `POST /api/zone-layout` - Save zone layout
- `GET /api/bins` - Get all bins
- `GET /api/lots?bin=BINID` - Get lots in bin
- `POST /api/lots/create` - Create new lot
- `POST /api/lots/move` - Move lot between bins
- `POST /api/bin/clean` - Clean bin (remove all lots)
- `GET /api/search?q=...` - Search lots (TODO)

All routes require authentication.

## 🗺️ Features

### Map Page (`/map`)
- Interactive warehouse map with Konva.js
- Visual zones and bins
- Edit mode: drag, resize, rename zones
- Bin tiles color-coded by status
- Click bins to see lots
- Create lots, move lots, clean bins

### Bins Page (`/bins`)
- List all bins
- View bin details
- See lots in each bin

### Search (`/find`)
- Search lots by LotID, Buyer, Title
- Highlights location on map

## 🔄 Workflow

1. **Intake**: Create lot, take photos, upload to Drive folder
2. **Storage**: Assign lot to bin (LOTS.BinID = binId)
3. **Status Flow**:
   - PHOTO_PROCESS → READY_FOR_ANALYSIS → READY_FOR_FLEX → DONE
4. **Export**: Generate FLEX_EXPORT from READY_FOR_FLEX bins
5. **After Sale**: Search by LotID/Buyer, view location on map

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS, shadcn/ui
- **Map**: Konva.js (canvas rendering)
- **Auth**: NextAuth.js with Google Provider
- **Backend**: Google Sheets API, Google Drive API
- **Hosting**: Vercel

## 📝 Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🔐 Authentication

Uses Google OAuth with scopes:
- `https://www.googleapis.com/auth/spreadsheets`
- `https://www.googleapis.com/auth/drive.file`

Requires `access_type=offline` and `prompt=consent` for refresh tokens.

## 📊 Status Values

### Bin Status
- `EMPTY`
- `PHOTO_PROCESS`
- `READY_FOR_ANALYSIS`
- `READY_FOR_FLEX`
- `DONE`
- `BROKEN`

## 🚧 Known Limitations

- **Flex Image URLs**: Drive links may not work in Flex import. Consider using public image URLs or a proxy endpoint.

## 📚 Development

### Adding New Features

1. Follow the data model (Google Sheets tabs)
2. Use existing API patterns
3. Ensure authentication is enforced
4. Test with real Google Sheets data

### Code Style

- TypeScript strict mode
- ESLint configured
- Prefer server components, use client components when needed
- Use NextAuth session for authentication

## 📄 License

Private project - ParrotAuction

## 👥 Support

For issues or questions, contact the development team.
