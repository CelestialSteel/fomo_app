'use client'; // If fetching from a Client Component

import { useEffect, useState } from 'react';
import { api } from '@/lib/api'; // Import the axios helper

export default function EventListExample() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // This calls: https://your-railway-app.com/events
        api.get('/events')
            .then((response) => {
                setEvents(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("API Error:", error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-gray-600">Loading events...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Events from Backend API</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                    <div
                        key={event.id}
                        className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                    >
                        <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                        <p className="text-gray-600 mb-2">{event.description}</p>
                        <div className="text-sm text-gray-500">
                            <p>📍 {event.location}</p>
                            <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                            <p>💰 ${event.price}</p>
                        </div>
                    </div>
                ))}
            </div>

            {events.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                    No events found.
                </div>
            )}
        </div>
    );
}
