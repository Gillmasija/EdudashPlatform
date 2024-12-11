# EduDash - Educational Platform

An educational platform for teacher-student management with role-based access.

## Features

- User Management (Teachers & Students)
- Assignment Management
- WhatsApp Integration for Communication
- Profile Management
- Teacher-Student Assignment System
- Real-time Notifications
- File Upload for Assignments

## Tech Stack

- Frontend: React with TypeScript
- Backend: Django
- Database: PostgreSQL
- Styling: Bootstrap 5 & Custom CSS
- Authentication: Django Authentication System

## Setup Instructions

1. Clone the repository
```bash
git clone [your-repository-url]
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
```
DATABASE_URL=your_database_url
SECRET_KEY=your_django_secret_key
DEBUG=True
```

5. Run migrations
```bash
python manage.py migrate
```

6. Start the development server
```bash
npm run dev
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
