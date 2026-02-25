# HimaagarShare - Cooling-as-a-Service Platform

A two-sided marketplace connecting cold storage owners with small businesses needing flexible storage solutions.

## 🎨 Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL + Sequelize ORM
- **Authentication**: JWT (HTTP-only cookies)
- **Theme**: Baby Pink (#F8C8DC), Maroon (#800000), White

## 🎯 Core Features

### For Hosts (Storage Owners)
- ✅ List cold storage spaces with details
- ✅ Manage listings (view, edit, delete)
- ✅ View and manage booking requests
- ✅ Track earnings overview

### For Renters (Business Owners)
- ✅ Search storage by location, temperature, capacity
- ✅ View detailed listings
- ✅ Book storage with date range
- ✅ Manage bookings and track status

### Platform Features
- ✅ JWT-based authentication
- ✅ Role-based dashboards (Host/Renter)
- ✅ Booking approval workflow
- ✅ Mock payment processing
- ✅ Responsive design (mobile-friendly)

## 🎨 Design Theme

- **Baby Pink** (#F8C8DC): Backgrounds, soft accents
- **Maroon** (#800000): Primary buttons, headers, CTAs
- **White** (#FFFFFF): Text on dark backgrounds, cards

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get current user profile

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create listing (Host only)
- `PUT /api/listings/:id` - Update listing (Host only)
- `DELETE /api/listings/:id` - Delete listing (Host only)
- `GET /api/listings/my-listings` - Get host's listings

### Bookings
- `POST /api/bookings` - Create booking (Renter only)
- `GET /api/bookings/my-bookings` - Get renter's bookings
- `GET /api/bookings/requests` - Get host's booking requests
- `PUT /api/bookings/:id/status` - Update booking status (Host only)

## 📄 License

MIT License - feel free to use this project for learning and commercial purposes.

## 🤝 Contributing

This is an MVP project. Future enhancements could include:
- Real payment gateway integration (Stripe/Razorpay)
- Map integration for location visualization
- Real-time notifications
- Advanced search with geocoding
- Rating and review system
- Chat between hosts and renters

## 📞 Support

For issues or questions, please create an issue in the repository.

---

Built by Bokhtear Md Abid with ❤️ for the cold storage sharing economy
