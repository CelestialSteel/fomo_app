'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

/**
 * Comprehensive example showing all CRUD operations using the axios API helper
 */
export default function APIUsageExamples() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Example 1: GET - Fetch all events
    const fetchEvents = async () => {
        setLoading(true);
        setMessage('');

        try {
            const response = await api.get('/events');
            setEvents(response.data);
            setMessage(`✅ Fetched ${response.data.length} events`);
        } catch (error) {
            console.error('Error fetching events:', error);
            setMessage(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Example 2: POST - Create a new event
    const createEvent = async () => {
        setLoading(true);
        setMessage('');

        const newEvent = {
            title: 'Test Event',
            description: 'This is a test event created via API',
            date: new Date().toISOString(),
            location: 'Nairobi, Kenya',
            category: 'Technology',
            price: 1000,
            capacity: 100,
            organizerId: 'test-organizer-id',
        };

        try {
            const response = await api.post('/events', newEvent);
            setMessage(`✅ Event created with ID: ${response.data.id}`);
            // Refresh the events list
            fetchEvents();
        } catch (error) {
            console.error('Error creating event:', error);
            setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Example 3: PATCH - Update an event
    const updateEvent = async (eventId) => {
        setLoading(true);
        setMessage('');

        const updates = {
            title: 'Updated Event Title',
            description: 'This event has been updated',
        };

        try {
            const response = await api.patch(`/events/${eventId}`, updates);
            setMessage(`✅ Event updated successfully`);
            // Refresh the events list
            fetchEvents();
        } catch (error) {
            console.error('Error updating event:', error);
            setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Example 4: DELETE - Delete an event
    const deleteEvent = async (eventId) => {
        setLoading(true);
        setMessage('');

        try {
            await api.delete(`/events/${eventId}`);
            setMessage(`✅ Event deleted successfully`);
            // Refresh the events list
            fetchEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
            setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Example 5: GET with authentication token
    const fetchWithAuth = async (token) => {
        setLoading(true);
        setMessage('');

        try {
            const response = await api.get('/auth/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage(`✅ User data fetched: ${response.data.email}`);
        } catch (error) {
            console.error('Error fetching user:', error);
            setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Example 6: POST with custom headers
    const submitOrder = async () => {
        setLoading(true);
        setMessage('');

        const orderData = {
            userId: 'user-123',
            cartItems: [
                { eventId: 'event-1', quantity: 2, pricePerTicket: 1000 },
            ],
            customerEmail: 'test@example.com',
            customerName: 'Test User',
            customerPhone: '254712345678',
        };

        try {
            const response = await api.post('/orders', orderData, {
                headers: {
                    'X-Custom-Header': 'custom-value',
                },
            });
            setMessage(`✅ Order created: ${response.data.orderId}`);
        } catch (error) {
            console.error('Error creating order:', error);
            setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Load events on component mount
    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">API Usage Examples</h1>

            {/* Status Message */}
            {message && (
                <div className={`mb-4 p-4 rounded-lg ${message.startsWith('✅')
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {message}
                </div>
            )}

            {/* Action Buttons */}
            <div className="mb-8 space-x-4">
                <button
                    onClick={fetchEvents}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Loading...' : 'Fetch Events (GET)'}
                </button>

                <button
                    onClick={createEvent}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                    Create Event (POST)
                </button>

                <button
                    onClick={submitOrder}
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                >
                    Submit Order (POST)
                </button>
            </div>

            {/* Events List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map(event => (
                    <div
                        key={event.id}
                        className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
                    >
                        <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{event.description}</p>

                        <div className="flex gap-2">
                            <button
                                onClick={() => updateEvent(event.id)}
                                disabled={loading}
                                className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 disabled:opacity-50"
                            >
                                Update
                            </button>

                            <button
                                onClick={() => deleteEvent(event.id)}
                                disabled={loading}
                                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:opacity-50"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {events.length === 0 && !loading && (
                <div className="text-center text-gray-500 mt-8">
                    No events found. Click "Fetch Events" to load data.
                </div>
            )}

            {/* Code Examples */}
            <div className="mt-12 space-y-6">
                <h2 className="text-2xl font-bold">Code Examples</h2>

                <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">GET Request:</h3>
                    <pre className="text-sm overflow-x-auto">
                        {`const response = await api.get('/events');
setEvents(response.data);`}
                    </pre>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">POST Request:</h3>
                    <pre className="text-sm overflow-x-auto">
                        {`const response = await api.post('/events', {
  title: 'New Event',
  description: 'Event description',
  // ... other fields
});`}
                    </pre>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">PATCH Request:</h3>
                    <pre className="text-sm overflow-x-auto">
                        {`const response = await api.patch('/events/123', {
  title: 'Updated Title'
});`}
                    </pre>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">DELETE Request:</h3>
                    <pre className="text-sm overflow-x-auto">
                        {`await api.delete('/events/123');`}
                    </pre>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">With Authentication:</h3>
                    <pre className="text-sm overflow-x-auto">
                        {`const response = await api.get('/auth/user', {
  headers: {
    Authorization: \`Bearer \${token}\`
  }
});`}
                    </pre>
                </div>
            </div>
        </div>
    );
}
