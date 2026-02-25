import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listingsAPI, bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { MapPin, Thermometer, Package, DollarSign, Calendar } from 'lucide-react';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isRenter } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    capacityRequired: '',
    notes: ''
  });
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchListing();
  }, [id]);

  useEffect(() => {
    calculatePrice();
  }, [bookingData.startDate, bookingData.endDate, bookingData.capacityRequired]);

  const fetchListing = async () => {
    try {
      const res = await listingsAPI.getById(id);
      setListing(res.data.listing);
    } catch (error) {
      toast.error('Failed to load listing');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!bookingData.startDate || !bookingData.endDate || !bookingData.capacityRequired || !listing) {
      setTotalPrice(0);
      return;
    }

    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (days > 0) {
      const price = days * parseFloat(bookingData.capacityRequired) * parseFloat(listing.pricePerDay);
      setTotalPrice(price.toFixed(2));
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }

    if (!isRenter) {
      toast.error('Only renters can book storage');
      return;
    }

    try {
      await bookingsAPI.create({
        listingId: listing.id,
        ...bookingData,
        totalPrice
      });
      toast.success('Booking request sent!');
      navigate('/renter/dashboard?tab=bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon"></div>
      </div>
    );
  }

  if (!listing) return null;

  return (
    <div className="min-h-screen bg-lightPink py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          ← Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Listing Details */}
          <div className="lg:col-span-2">
            <Card>
              {listing.images?.[0] && (
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-96 object-cover rounded-lg mb-6"
                />
              )}

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{listing.title}</h1>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2 text-maroon" />
                {listing.location}
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Package className="w-5 h-5 mr-2 text-maroon" />
                  <span><strong>Available:</strong> {listing.availableCapacity} / {listing.totalCapacity} cu ft</span>
                </div>
                <div className="flex items-center">
                  <Thermometer className="w-5 h-5 mr-2 text-maroon" />
                  <span><strong>Temp:</strong> {listing.tempMin}°C to {listing.tempMax}°C</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-maroon" />
                  <span><strong>Price:</strong> ${listing.pricePerDay}/cu ft/day</span>
                </div>
                <div>
                  <span className="badge badge-approved">{listing.type}</span>
                </div>
              </div>

              {listing.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{listing.description}</p>
                </div>
              )}

              {listing.amenities?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.amenities.map(amenity => (
                      <span key={amenity} className="badge badge-approved">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-2">Host Information</h3>
                <p className="text-gray-600">
                  <strong>Name:</strong> {listing.owner.name}
                  {listing.owner.businessName && ` (${listing.owner.businessName})`}
                </p>
                <p className="text-gray-600">
                  <strong>Phone:</strong> {listing.owner.phone || 'Not provided'}
                </p>
              </div>
            </Card>
          </div>

          {/* Booking Form */}
          <div>
            <Card className="sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Book This Space</h3>
              
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={bookingData.startDate}
                    onChange={(e) => setBookingData({...bookingData, startDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={bookingData.endDate}
                    onChange={(e) => setBookingData({...bookingData, endDate: e.target.value})}
                    min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Package className="w-4 h-4 inline mr-1" />
                    Capacity Required (cu ft) *
                  </label>
                  <input
                    type="number"
                    value={bookingData.capacityRequired}
                    onChange={(e) => setBookingData({...bookingData, capacityRequired: e.target.value})}
                    max={listing.availableCapacity}
                    min="1"
                    step="0.01"
                    className="input"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Max available: {listing.availableCapacity} cu ft
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                    className="input"
                    rows="3"
                    placeholder="Any special requirements..."
                  />
                </div>

                {totalPrice > 0 && (
                  <div className="bg-babyPink p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Price:</span>
                      <span className="text-2xl font-bold text-maroon">${totalPrice}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Payment will be processed upon host approval
                    </p>
                  </div>
                )}

                <Button type="submit" className="w-full">
                  Send Booking Request
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
