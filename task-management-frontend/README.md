1) In case you are getting error "You are running `create-react-app` 5.0.1, which is behind the latest release (5.1.0)"
    npm uninstall -g create-react-app
    npm install -g create-react-app
2) To create the create app
    npx create-react-app task-management-frontend --template typescript
3) Install dependencies
    a) cd task-management-frontend or open app in visual studio code
    b) Install the material css and basic components
        npm install axios @types/axios react-router-dom @types/react-router-dom
        npm install @mui/material @emotion/react @emotion/styled
        npm install @mui/icons-material
        npm install @mui/x-data-grid
        npm install lucide-react
        npm install -D tailwindcss postcss autoprefixer
        npx tailwindcss init -p
        npm install bootstrap

        FYI - trying tailwind but not working so for now using bootstrap
4) Create folder structure 
    src/
    ├── components/
    │   └── TaskManagementDashboard.tsx
    ├── types/
    │   └── index.ts
    ├── services/
    │   └── api.ts
    ├── App.tsx
    ├── App.css
    └── index.tsx
5) Start App
    npm start
