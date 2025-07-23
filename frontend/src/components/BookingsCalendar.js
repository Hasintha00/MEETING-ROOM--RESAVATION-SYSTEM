
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import BookingModal from './BookingModal';

const localizer = momentLocalizer(moment);

const BookingsCalendar = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await axios.get('http://localhost:5000/api/bookings');
    const formattedEvents = res.data.map(booking => ({
      title: booking.title,
      start: new Date(booking.startTime),
      end: new Date(booking.endTime),
      resource: booking,
    }));
    setEvents(formattedEvents);
  };

  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent({ start, end });
    setModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
    fetchBookings();
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
      {modalOpen && (
        <BookingModal
          open={modalOpen}
          handleClose={closeModal}
          booking={selectedEvent}
        />
      )}
    </div>
  );
};

export default BookingsCalendar;
