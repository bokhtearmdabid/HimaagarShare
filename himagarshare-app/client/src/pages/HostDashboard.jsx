import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingsAPI, bookingsAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, DollarSign, Package, CheckCircle, XCircle, Clock } from 'lucide-react';
import { BOOKING_STATUS_LABELS } from '../utils/constants';

const HostDashboard = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [listingsRes, bookingsRes, earningsRes] = await Promise.all([
        listingsAPI.getMyListings(),
        bookingsAPI.getRequests(),
        listingsAPI.getEarnings()
      ]);
      
      setListings(listingsRes.data.listings);
      setBookings(bookingsRes.data.bookings);
      setEarnings(earningsRes.data.earnings);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      await listingsAPI.delete(id);
      toast.success('Listing deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete listing');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await bookingsAPI.updateStatus(bookingId, { status });
      toast.success(`Booking ${status}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon"></div>
      </div>
    );
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending');

  return (
    <div className="min-h-screen bg-lightPink py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Host Dashboard</h1>
          <p className="text-gray-600">Manage your listings and bookings</p>
        </div>

        {/* Earnings Summary */}
        {earnings && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center">
              <DollarSign className="w-8 h-8 text-maroon mx-auto mb-2" />
              <div className="text-2xl font-bold text-maroon">${earnings.totalEarnings}</div>
              <div className="text-sm text-gray-600">Total Earnings</div>
            </Card>
            <Card className="text-center">
              <Package className="w-8 h-8 text-maroon mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{earnings.totalListings}</div>
              <div className="text-sm text-gray-600">Active Listings</div>
            </Card>
            <Card className="text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{earnings.activeBookings}</div>
              <div className="text-sm text-gray-600">Active Bookings</div>
            </Card>
            <Card className="text-center">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{pendingBookings.length}</div>
              <div className="text-sm text-gray-600">Pending Requests</div>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'listings'
                ? 'text-maroon border-b-2 border-maroon'
                : 'text-gray-600 hover:text-maroon'
            }`}
          >
            My Listings ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'bookings'
                ? 'text-maroon border-b-2 border-maroon'
                : 'text-gray-600 hover:text-maroon'
            }`}
          >
            Booking Requests ({bookings.length})
          </button>
        </div>

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Listings</h2>
              <Button onClick={() => navigate('/host/add-listing')}>
                <Plus className="w-4 h-4" />
                Add Listing
              </Button>
            </div>

            {listings.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-gray-600 mb-4">You haven't created any listings yet</p>
                <Button onClick={() => navigate('/host/add-listing')}>
                  Create Your First Listing
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map(listing => (
                  <Card key={listing.id} hover>
                    {listing.images?.[0] && (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{listing.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{listing.location}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="badge badge-approved">{listing.type}</span>
                      <span className="font-semibold text-maroon">${listing.pricePerDay}/day</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      <div>Capacity: {listing.availableCapacity}/{listing.totalCapacity} cu ft</div>
                      <div>Temp: {listing.tempMin}°C to {listing.tempMax}°C</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        className="flex-1 text-sm"
                        onClick={() => navigate(`/host/edit-listing/${listing.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        className="text-sm"
                        onClick={() => handleDeleteListing(listing.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Requests</h2>

            {bookings.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-gray-600">No booking requests yet</p>
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
                          <strong>Renter:</strong> {booking.renter.name}
                          {booking.renter.businessName && ` (${booking.renter.businessName})`}
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
                        {booking.notes && (
                          <p className="text-sm text-gray-600 mt-2 italic">
                            <strong>Notes:</strong> {booking.notes}
                          </p>
                        )}
                      </div>
                      
                      {booking.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleUpdateBookingStatus(booking.id, 'approved')}
                            className="text-sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleUpdateBookingStatus(booking.id, 'rejected')}
                            className="text-sm"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </Button>
                        </div>
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

export default HostDashboard;
