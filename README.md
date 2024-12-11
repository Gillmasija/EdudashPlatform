# EduDash - Educational Platform

A comprehensive educational platform for teacher-student management with role-based access, built with React and Django.

## Features

- 👥 User Management (Teachers & Students)
- 📚 Assignment Management
- 💬 WhatsApp Integration for Communication
- 👤 Profile Management
- 📝 Teacher-Student Assignment System
- 🔔 Real-time Notifications
- 📤 File Upload for Assignments

## Tech Stack

- **Frontend**: React with TypeScript, Shadcn UI Components
- **Backend**: Django REST Framework
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Authentication**: Custom JWT Authentication

## Prerequisites

- Node.js (v18 or higher)
- Python (3.11 or higher)
- PostgreSQL

## Setup Instructions

### Local Development

1. Clone the repository
```bash
git clone https://github.com/[your-username]/edudash.git
cd edudash
```

2. Install Python dependencies
```bash
pip install -r requirements.txt
```

3. Install Node.js dependencies
```bash
npm install
```

4. Set up environment variables
Create a `.env` file in the root directory with:
```env
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[dbname]
SECRET_KEY=your_django_secret_key
DEBUG=True
```

5. Run database migrations
```bash
python manage.py migrate
```

6. Start the development servers
```bash
# Start Django server
python manage.py runserver

# In another terminal, start React development server
npm run dev
```

### Deploying on Replit

1. Fork this repository to your Replit account
2. Add the following secrets in your Replit environment:
   - `DATABASE_URL`
   - `SECRET_KEY`
   - Other necessary environment variables
3. Click the "Run" button

The application will automatically:
- Install dependencies
- Run migrations
- Start the development server

## Project Structure

```
edudash/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page components
│   │   └── types/       # TypeScript types
├── dashboard/           # Django dashboard app
├── users/              # Django users app
├── static/             # Static files
└── templates/          # Django templates
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Support

For support, email support@edudash.com or join our Discord channel.
