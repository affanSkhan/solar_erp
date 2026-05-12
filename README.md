# Solar ERP Setup Instructions

## Requirements
- Node.js (v18+)
- Docker & Docker Compose
- PostgreSQL

## 1. Init Project
Navigate into the `erp-system` and initialize the generic Next.js app:
```bash
cd erp-system
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

## 2. Install Packages
```bash
npm install prisma @prisma/client
npm install docxtemplater pizzip
npm install zod react-hook-form @hookform/resolvers/zod
npm install next-auth bcryptjs jsonwebtoken
npm install lucide-react class-variance-authority clsx tailwind-merge
```

## 3. Database
- Start local database using docker: `docker-compose up db -d`
- Sync Prisma schemas:
```bash
npx prisma generate
npx prisma db push
```

## 4. Templating Engine
Place your edited `.docx` templates into `erp-system/templates` replacing the target parameters with: `{{customer_name}}`, `{{consumer_number}}`, etc.

## 5. Convert to PDF (LibreOffice)
In order to convert the documents into PDF on production, the provided `Dockerfile` already has `libreoffice` embedded in it. Headless `soffice` converts securely on the server upon every `.docx` push.
