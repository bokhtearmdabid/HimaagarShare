import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingsAPI, bookingsAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { Search, MapPin, Thermometer, Package, Calendar } from 'lucide-react';
import { STORAGE_TYPES, BOOKING_STATUS_LABELS } from '../utils/constants';

const RenterDashboard = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('search');
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    minCapacity: '',
    tempMin: '',
    tempMax: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [listingsRes, bookingsRes] = await Promise.all([
        listingsAPI.getAll(),
        bookingsAPI.getMyBookings()
      ]);
      
      setListings(listingsRes.data.listings);
      setBookings(bookingsRes.data.bookings);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await listingsAPI.getAll(filters);
      setListings(res.data.listings);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await bookingsAPI.cancel(id);
      toast.success('Booking cancelled');
      fetchData();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  if (loading && activeTab === 'search') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightPink py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Renter Dashboard</h1>
          <p className="text-gray-600">Find and book cold storage</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'search'
                ? 'text-maroon border-b-2 border-maroon'
                : 'text-gray-600 hover:text-maroon'
            }`}
          >
            <Search className="w-4 h-4 inline mr-2" />
            Search Storage
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'bookings'
                ? 'text-maroon border-b-2 border-maroon'
                : 'text-gray-600 hover:text-maroon'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            My Bookings ({bookings.length})
          </button>
        </div>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div>
            {/* Search Filters */}
            <Card className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Search Filters</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                <input
                  type="text"
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  className="input"
                />
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="input"
                >
                  <option value="">All Types</option>
                  {STORAGE_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Min Capacity (cu ft)"
                  value={filters.minCapacity}
                  onChange={(e) => setFilters({...filters, minCapacity: e.target.value})}
                  className="input"
                />
                <input
                  type="number"
                  placeholder="Min Temp (°C)"
                  value={filters.tempMin}
                  onChange={(e) => setFilters({...filters, tempMin: e.target.value})}
                  className="input"
                />
                <input
                  type="number"
                  placeholder="Max Temp (°C)"
                  value={filters.tempMax}
                  onChange={(e) => setFilters({...filters, tempMax: e.target.value})}
                  className="input"
                />
              </div>
              <Button onClick={handleSearch} className="mt-4">
                <Search className="w-4 h-4" />
                Search
              </Button>
            </Card>

            {/* Listings Grid */}
            {listings.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-gray-600">No listings found. Try adjusting your filters.</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map(listing => (
                  <Card key={listing.id} hover onClick={() => navigate(`/listing/${listing.id}`)}>
                    {listing.images?.[0] && (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{listing.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {listing.location}
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="badge badge-approved">{listing.type}</span>
                      <span className="font-semibold text-maroon">${listing.pricePerDay}/cu ft/day</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Package className="w-4 h-4 mr-1" />
                      {listing.availableCapacity} cu ft available
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Thermometer className="w-4 h-4 mr-1" />
                      {listing.tempMin}°C to {listing.tempMax}°C
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>

            {bookings.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-gray-600 mb-4">You haven't made any bookings yet</p>
                <Button onClick={() => setActiveTab('search')}>
                  Browse Storage Spaces
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map(booking => (
                  <Card key={booking.id}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {booking.listing.title}
                          </h3>
                          <span className={`badge badge-${booking.status}`}>
                            {BOOKING_STATUS_LABELS[booking.status]}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Location:</strong> {booking.listing.location}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Dates:</strong> {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Capacity:</strong> {booking.capacityRequired} cu ft
                        </p>
                        <p className="text-sm font-semibold text-maroon mt-2">
                          Total: ${booking.totalPrice}
                        </p>
                        {booking.rejectionReason && (
                          <p className="text-sm text-red-600 mt-2">
                            <strong>Rejection Reason:</strong> {booking.rejectionReason}
                          </p>
                        )}
                      </div>
                      
                      {['pending', 'approved'].includes(booking.status) && (
                        <Button
                          variant="danger"
                          onClick={() => handleCancelBooking(booking.id)}
                          className="text-sm"
                        >
                          Cancel Booking
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RenterDashboard;
