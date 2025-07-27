// Sample hotel data
const hotels = [
    {
        id: 1,
        name: "Grand Palace Hotel",
        location: "New York",
        rating: 5,
        price: 299,
        image: "🏨",
        amenities: ["WiFi", "Pool", "Spa", "Restaurant"]
    },
    {
        id: 2,
        name: "Ocean View Resort",
        location: "Miami",
        rating: 4,
        price: 199,
        image: "🌊",
        amenities: ["WiFi", "Beach Access", "Pool", "Bar"]
    },
    {
        id: 3,
        name: "Mountain Lodge",
        location: "Colorado",
        rating: 4,
        price: 159,
        image: "🏔️",
        amenities: ["WiFi", "Hiking", "Restaurant", "Fireplace"]
    },
    {
        id: 4,
        name: "City Center Hotel",
        location: "Chicago",
        rating: 4,
        price: 179,
        image: "🏙️",
        amenities: ["WiFi", "Gym", "Business Center", "Restaurant"]
    },
    {
        id: 5,
        name: "Beachside Inn",
        location: "California",
        rating: 3,
        price: 129,
        image: "🏖️",
        amenities: ["WiFi", "Beach Access", "Pool"]
    },
    {
        id: 6,
        name: "Luxury Suites",
        location: "Las Vegas",
        rating: 5,
        price: 399,
        image: "✨",
        amenities: ["WiFi", "Casino", "Spa", "Fine Dining", "Pool"]
    }
];

// Global variables
let filteredHotels = [...hotels];
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
let currentHotel = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    displayHotels(hotels);
    displayBookings();
    setupEventListeners();
    setMinDate();
});

// Set minimum date to today
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkin').min = today;
    document.getElementById('checkout').min = today;
    
    // Update checkout min date when checkin changes
    document.getElementById('checkin').addEventListener('change', function() {
        document.getElementById('checkout').min = this.value;
    });
}

// Setup event listeners
function setupEventListeners() {
    // Modal close functionality
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Booking form submission
    document.getElementById('bookingForm').addEventListener('submit', handleBookingSubmission);
    
    // Smooth scrolling for navigation
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Search hotels function
function searchHotels() {
    const destination = document.getElementById('destination').value.toLowerCase();
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    
    if (!checkin || !checkout) {
        alert('Please select check-in and check-out dates');
        return;
    }
    
    if (new Date(checkin) >= new Date(checkout)) {
        alert('Check-out date must be after check-in date');
        return;
    }
    
    // Filter hotels based on destination
    if (destination) {
        filteredHotels = hotels.filter(hotel => 
            hotel.location.toLowerCase().includes(destination) ||
            hotel.name.toLowerCase().includes(destination)
        );
    } else {
        filteredHotels = [...hotels];
    }
    
    displayHotels(filteredHotels);
    
    // Scroll to hotels section
    document.getElementById('hotels').scrollIntoView({ behavior: 'smooth' });
}

// Display hotels
function displayHotels(hotelsToShow) {
    const hotelsGrid = document.getElementById('hotelsGrid');
    
    if (hotelsToShow.length === 0) {
        hotelsGrid.innerHTML = '<p class="text-center">No hotels found matching your criteria.</p>';
        return;
    }
    
    hotelsGrid.innerHTML = hotelsToShow.map(hotel => `
        <div class="hotel-card">
            <div class="hotel-image">
                ${hotel.image}
            </div>
            <div class="hotel-info">
                <h3>${hotel.name}</h3>
                <div class="hotel-rating">
                    ${'⭐'.repeat(hotel.rating)}
                </div>
                <p><i class="fas fa-map-marker-alt"></i> ${hotel.location}</p>
                <div class="hotel-price">$${hotel.price}/night</div>
                <p><strong>Amenities:</strong> ${hotel.amenities.join(', ')}</p>
                <button class="book-hotel-btn" onclick="openBookingModal(${hotel.id})">
                    Book Now
                </button>
            </div>
        </div>
    `).join('');
}

// Open booking modal
function openBookingModal(hotelId) {
    currentHotel = hotels.find(hotel => hotel.id === hotelId);
    const modal = document.getElementById('bookingModal');
    const selectedHotelDiv = document.getElementById('selectedHotel');
    
    selectedHotelDiv.innerHTML = `
        <div class="selected-hotel-info">
            <h3>${currentHotel.name}</h3>
            <p><i class="fas fa-map-marker-alt"></i> ${currentHotel.location}</p>
            <p class="hotel-rating">${'⭐'.repeat(currentHotel.rating)}</p>
            <p><strong>Price:</strong> $${currentHotel.price}/night</p>
        </div>
    `;
    
    updateBookingSummary();
    modal.style.display = 'block';
}

// Update booking summary
function updateBookingSummary() {
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const summaryDiv = document.getElementById('summaryDetails');
    
    if (checkin && checkout && currentHotel) {
        const nights = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
        const totalPrice = nights * currentHotel.price;
        
        summaryDiv.innerHTML = `
            <p><strong>Check-in:</strong> ${formatDate(checkin)}</p>
            <p><strong>Check-out:</strong> ${formatDate(checkout)}</p>
            <p><strong>Nights:</strong> ${nights}</p>
            <p><strong>Price per night:</strong> $${currentHotel.price}</p>
            <hr>
            <p><strong>Total Price:</strong> $${totalPrice}</p>
        `;
    }
}

// Handle booking form submission
function handleBookingSubmission(e) {
    e.preventDefault();
    
    const formData = {
        id: Date.now(),
        hotelId: currentHotel.id,
        hotelName: currentHotel.name,
        hotelLocation: currentHotel.location,
        guestName: document.getElementById('guestName').value,
        guestEmail: document.getElementById('guestEmail').value,
        guestPhone: document.getElementById('guestPhone').value,
        roomType: document.getElementById('roomType').value,
        checkin: document.getElementById('checkin').value,
        checkout: document.getElementById('checkout').value,
        guests: document.getElementById('guests').value,
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
    };
    
    // Calculate total price
    const nights = Math.ceil((new Date(formData.checkout) - new Date(formData.checkin)) / (1000 * 60 * 60 * 24));
    formData.totalPrice = nights * currentHotel.price;
    formData.nights = nights;
    
    // Add to bookings
    bookings.push(formData);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Close modal and reset form
    document.getElementById('bookingModal').style.display = 'none';
    document.getElementById('bookingForm').reset();
    
    // Show success message
    alert('Booking confirmed! Check your bookings section for details.');
    
    // Refresh bookings display
    displayBookings();
    
    // Scroll to bookings section
    document.getElementById('bookings').scrollIntoView({ behavior: 'smooth' });
}

// Display bookings
function displayBookings() {
    const bookingsList = document.getElementById('bookingsList');
    
    if (bookings.length === 0) {
        bookingsList.innerHTML = '<p class="text-center">No bookings found. Book a hotel to see your reservations here.</p>';
        return;
    }
    
    bookingsList.innerHTML = bookings.map(booking => `
        <div class="booking-item">
            <div class="booking-header">
                <h3>${booking.hotelName}</h3>
                <span class="booking-status status-${booking.status}">${booking.status.toUpperCase()}</span>
            </div>
            <div class="booking-details">
                <p><strong>Booking ID:</strong> #${booking.id}</p>
                <p><strong>Guest:</strong> ${booking.guestName}</p>
                <p><strong>Location:</strong> ${booking.hotelLocation}</p>
                <p><strong>Check-in:</strong> ${formatDate(booking.checkin)}</p>
                <p><strong>Check-out:</strong> ${formatDate(booking.checkout)}</p>
                <p><strong>Nights:</strong> ${booking.nights}</p>
                <p><strong>Room Type:</strong> ${booking.roomType}</p>
                <p><strong>Guests:</strong> ${booking.guests}</p>
                <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
                <p><strong>Booked on:</strong> ${formatDate(booking.bookingDate.split('T')[0])}</p>
                ${booking.status === 'confirmed' ? `
                    <button class="cancel-btn" onclick="cancelBooking(${booking.id})">
                        Cancel Booking
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Cancel booking
function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        const bookingIndex = bookings.findIndex(booking => booking.id === bookingId);
        if (bookingIndex !== -1) {
            bookings[bookingIndex].status = 'cancelled';
            localStorage.setItem('bookings', JSON.stringify(bookings));
            displayBookings();
            alert('Booking cancelled successfully.');
        }
    }
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Add event listeners for real-time summary updates
document.addEventListener('DOMContentLoaded', function() {
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    if (checkinInput && checkoutInput) {
        checkinInput.addEventListener('change', updateBookingSummary);
        checkoutInput.addEventListener('change', updateBookingSummary);
    }
});
