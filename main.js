// DB-free main script: uses static sample data and localStorage for form persistence

let allTours = [];
let galleryImages = [];
let reviewsList = [];
let currentFilter = 'all';

window.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

async function initializeApp() {
  setupNavigation();
  setupScrollEffects();
  await loadTours();
  await loadGallery();
  await loadReviews();
  setupBookingForm();
  setupNewsletterForm();
  setupTourFilters();
}

function setupNavigation() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          navLinks.forEach(l => l.classList.remove('active'));
          this.classList.add('active');

          const navbarCollapse = document.querySelector('.navbar-collapse');
          if (navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
          }

          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  const sections = [...document.querySelectorAll('section[id]')];

  function updateActiveNav() {
    const scrollPosition = window.scrollY + 120; // account for fixed nav height
    let currentSectionId = sections[0]?.id || null;

    sections.forEach(section => {
      if (section.offsetTop <= scrollPosition) {
        currentSectionId = section.id;
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();
}

function setupScrollEffects() {
  const scrollTopBtn = document.getElementById('scroll-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

async function loadTours() {
  // Static sample tours (replace image_url values later)
  allTours = [
    {
      id: 't1',
      title: 'Classic Sri Lanka Round Tour',
      description: '10-day classic round tour visiting cultural triangle, tea country and southern beaches.',
      price: 899,
      duration: '10 days',
      category: 'round_tour',
      image_url: 'images/tours/tour-1.jpg',
      highlights: ['Cultural Triangle', 'Tea Plantations', 'Galle Fort'],
      featured: true
    },
    {
      id: 't2',
      title: 'Sigiriya & Kandy Day Tour',
      description: 'A focused day trip to the majestic Sigiriya Rock and the cultural city of Kandy.',
      price: 120,
      duration: '1 day',
      category: 'day_tour',
      image_url: 'images/tours/tour-2.jpg',
      highlights: ['Sigiriya Rock', 'Local Guide'],
      featured: false
    },
    {
      id: 't3',
      title: 'Airport Pick-Up & Drop Service',
      description: 'Start and end your journey smoothly with reliable airport pick-up and drop services. Our professional drivers provide meet-and-greet assistance and flight tracking for a stress-free transfer.',
      price: 40,
      duration: 'Per transfer',
      category: 'transport',
      image_url: 'images/tours/tour-3.jpg',
      highlights: ['Meet & Greet', 'Flight Tracking'],
      featured: false
    },
    {
      id: 't4',
      title: 'Southern Coast Beach Escape',
      description: '5-day relaxed beach stay along Sri Lanka\'s southern coast with snorkeling and cultural visits.',
      price: 499,
      duration: '5 days',
      category: 'round_tour',
      image_url: 'images/tours/tour-4.jpg',
      highlights: ['Unawatuna Beach', 'Galle Fort', 'Snorkeling'],
      featured: false
    },
    {
      id: 't5',
      title: 'Hill Country Tea & Train Journey',
      description: 'Three-day itinerary focusing on Nuwara Eliya, tea estates and the scenic Kandy to Ella train ride.',
      price: 299,
      duration: '3 days',
      category: 'round_tour',
      image_url: 'images/tours/tour-5.jpg',
      highlights: ['Tea Factory Visit', 'Scenic Train', 'Waterfalls'],
      featured: false
    },
    {
      id: 't6',
      title: 'Cultural Triangle Highlights',
      description: 'Explore Anuradhapura, Polonnaruwa and Sigiriya with expert guides over 4 days.',
      price: 349,
      duration: '4 days',
      category: 'cultural',
      image_url: 'images/tours/tour-6.jpg',
      highlights: ['Ancient Ruins', 'Local Cuisine', 'Temple Visits'],
      featured: false
    },
    {
      id: 'a1',
      title: 'Ayurveda Wellness Retreat - 3 Days',
      description: 'Short ayurveda detox and rejuvenation program with traditional treatments and dietary guidance.',
      price: 399,
      duration: '3 days',
      category: 'ayurveda',
      image_url: 'images/tours/tour-7.jpg',
      highlights: ['Ayurvedic Treatments', 'Herbal Meals', 'Yoga Sessions'],
      featured: false
    },
    {
      id: 'a2',
      title: 'Traditional Ayurveda & Yoga Package - 7 Days',
      description: 'Week-long full ayurvedic residential package combining personalized therapies, yoga and meditation.',
      price: 899,
      duration: '7 days',
      category: 'ayurveda',
      image_url: 'images/tours/tour-8.jpg',
      highlights: ['Personalized Plan', 'Daily Yoga', 'Therapist Consultations'],
      featured: false
    },
    {
      id: 't7',
      title: '4-Day Cultural Explorer (Negombo to Sigiriya)',
      description: 'Journey from Negombo to Kandy and Sigiriya with cultural visits, scenic drives, and comfortable stays over four days.',
      price: 499,
      duration: '4 days',
      category: 'round_tour',
      image_url: 'images/tours/tour-9.jpg',
      highlights: ['Negombo Beach', 'Kandy Temple of the Tooth', 'Sigiriya Rock Fortress'],
      featured: false
    },
    {
      id: 't8',
      title: '4-Day Southern Beach & Safari Adventure',
      description: 'Enjoy coastal relaxation in Hikkaduwa and Mirissa with a safari option at Udawalawe or Yala and a whale watching excursion.',
      price: 549,
      duration: '4 days',
      category: 'round_tour',
      image_url: 'images/tours/tour-10.jpg',
      highlights: ['Hikkaduwa Beach', 'Safari Experience', 'Whale Watching'],
      featured: false
    },
    {
      id: 't9',
      title: '7-Day Classic Sri Lanka Tour',
      description: 'A comprehensive seven-day itinerary covering Sigiriya, Kandy, Ella, safari and southern beaches.',
      price: 999,
      duration: '7 days',
      category: 'round_tour',
      image_url: 'images/tours/tour-11.jpg',
      highlights: ['Sigiriya Rock', 'Kandy Cultural Show', 'Ella Train Ride', 'Mirissa Whale Watch'],
      featured: false
    },
    {
      id: 't10',
      title: '10-Day Grand Sri Lanka Experience',
      description: 'Explore the best of Sri Lanka over ten days with visits to cultural sites, hill country, safaris, and coastal escapes.',
      price: 1499,
      duration: '10 days',
      category: 'round_tour',
      image_url: 'images/tours/tour-12.jpg',
      highlights: ['Cultural Triangle', 'Highlands', 'National Parks', 'Beaches'],
      featured: false
    },
    {
      id: 'd1',
      title: 'Colombo City Tour',
      description: 'Guided exploration of Colombo\'s landmarks including Gangaramaya Temple, Independence Square and Pettah market.',
      price: 60,
      duration: '1 day',
      category: 'day_tour',
      image_url: 'images/tours/tour-13.jpg',
      highlights: ['Gangaramaya Temple', 'Pettah Market', 'Galle Face Green'],
      featured: false
    },
    {
      id: 'd2',
      title: 'Sigiriya Village Tour',
      description: 'Experience authentic village life near Sigiriya via bullock cart, paddy fields and local home visit with lunch.',
      price: 80,
      duration: '1 day',
      category: 'day_tour',
      image_url: 'images/tours/tour-14.jpg',
      highlights: ['Bullock Cart Ride', 'Local Lunch', 'Paddy Fields'],
      featured: false
    },
    {
      id: 'd3',
      title: 'Galle City Tour',
      description: 'Walk through the historic streets of Galle Fort, lighthouse and Dutch architecture with ocean views.',
      price: 75,
      duration: '1 day',
      category: 'day_tour',
      image_url: 'images/tours/tour-15.jpg',
      highlights: ['Galle Fort', 'Lighthouse', 'Colonial Streets'],
      featured: false
    },
    {
      id: 'd4',
      title: 'Ella City Tour',
      description: 'Visit Nine Arches Bridge, Little Adam’s Peak and other scenic viewpoints around Ella.',
      price: 70,
      duration: '1 day',
      category: 'day_tour',
      image_url: 'images/tours/tour-16.jpg',
      highlights: ['Nine Arches Bridge', 'Little Adam’s Peak', 'Waterfalls'],
      featured: false
    },
    {
      id: 'd5',
      title: 'Kandy City Tour',
      description: 'Explore Kandy including the Temple of the Tooth, Kandy Lake and the Royal Botanical Gardens.',
      price: 65,
      duration: '1 day',
      category: 'day_tour',
      image_url: 'images/tours/tour-17.jpg',
      highlights: ['Temple of the Tooth', 'Kandy Lake', 'Botanical Gardens'],
      featured: false
    },
    {
      id: 'd6',
      title: 'Nuwara Eliya City Tour',
      description: 'Discover tea plantations, Gregory Lake and colonial architecture in the hill town of Nuwara Eliya.',
      price: 85,
      duration: '1 day',
      category: 'day_tour',
      image_url: 'images/tours/tour-18.jpg',
      highlights: ['Tea Plantations', 'Gregory Lake', 'Victoria Park'],
      featured: false
    },
    {
      id: 'w1',
      title: 'Udawalawe National Park Safari',
      description: 'Safari in Udawalawe to see wild elephants, water buffalo, crocodiles and diverse birdlife.',
      price: 150,
      duration: 'Full day',
      category: 'wildlife',
      image_url: 'images/tours/tour-19.jpg',
      highlights: ['Elephants', 'Bird Watching', 'Open Grasslands'],
      featured: false
    },
    {
      id: 'w2',
      title: 'Yala National Park Safari',
      description: 'Explore Yala National Park, famous for its high leopard population along with elephants and crocodiles.',
      price: 170,
      duration: 'Full day',
      category: 'wildlife',
      image_url: 'images/tours/tour-20.jpg',
      highlights: ['Leopards', 'Elephants', 'Diverse Habitats'],
      featured: false
    },
    {
      id: 'w3',
      title: 'Minneriya National Park Safari',
      description: 'Witness the annual gathering of elephants and other wildlife in the open plains of Minneriya.',
      price: 160,
      duration: 'Half day',
      category: 'wildlife',
      image_url: 'images/tours/tour-21.jpg',
      highlights: ['Elephant Gathering', 'Birds', 'Reservoir Views'],
      featured: false
    },
    {
      id: 'w4',
      title: 'Wilpattu National Park Safari',
      description: 'A quieter safari experience in Wilpattu, Sri Lanka’s largest park with leopards, elephants and sloth bears.',
      price: 180,
      duration: 'Full day',
      category: 'wildlife',
      image_url: 'images/tours/tour-22.jpg',
      highlights: ['Leopards', 'Sloth Bears', 'Natural Lakes'],
      featured: false
    },
    {
      id: 'w5',
      title: 'Madu River Safari – Balapitiya',
      description: 'Boat safari through mangroves and cinnamon islands on the peaceful Madu River near Balapitiya.',
      price: 90,
      duration: 'Half day',
      category: 'wildlife',
      image_url: 'images/tours/tour-23.jpg',
      highlights: ['Mangroves', 'Birdlife', 'Village Scenes'],
      featured: false
    },
    {
      id: 'w6',
      title: 'Whale Watching – Mirissa',
      description: 'Early morning boat trip from Mirissa to spot blue whales, sperm whales and dolphins.',
      price: 120,
      duration: 'Half day',
      category: 'wildlife',
      image_url: 'images/tours/tour-24.jpg',
      highlights: ['Whales', 'Dolphins', 'Ocean Views'],
      featured: false
    }
  ];

  displayTours(allTours);
  populateTourDropdown(allTours);
}

function displayTours(tours) {
  const toursGrid = document.getElementById('tours-grid');

  if (tours.length === 0) {
    toursGrid.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-muted">No tours available at the moment.</p>
      </div>
    `;
    return;
  }

  toursGrid.innerHTML = tours.map(tour => `
    <div class="col-lg-4 col-md-6 tour-item" data-category="${tour.category}">
      <div class="card tour-card">
        <div class="tour-card-img-wrapper">
          <img src="${tour.image_url || 'https://images.pexels.com/photos/3250613/pexels-photo-3250613.jpeg'}"
               loading="lazy" decoding="async"
               class="card-img-top tour-card-img"
               alt="${tour.title}">
          <span class="tour-category-badge">${formatCategory(tour.category)}</span>
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title mb-3">${tour.title}</h5>
          <p class="card-text text-muted mb-3 flex-grow-1">${truncateText(tour.description, 120)}</p>

          <div class="mb-3">
            <span class="tour-duration">
              <i class="bi bi-clock me-2"></i>${tour.duration}
            </span>
          </div>

          ${tour.highlights && tour.highlights.length > 0 ? `
            <div class="mb-3">
              <h6 class="small text-muted mb-2">Highlights:</h6>
              <div class="highlight-list">
                ${tour.highlights.map(h => `<span class="badge bg-secondary highlight-badge me-1 mb-1">${h}</span>`).join('')}
              </div>
            </div>
          ` : ''}

          <div class="mt-auto pt-3 border-top d-flex justify-content-center">
            <a href="#booking" class="btn btn-primary" onclick="selectTour('${tour.id}', '${tour.title.replace(/'/g, "\\'")}')">
              Book Now
            </a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function displayToursError() {
  const toursGrid = document.getElementById('tours-grid');
  toursGrid.innerHTML = `
    <div class="col-12 text-center py-5">
      <i class="bi bi-exclamation-triangle text-warning fs-1 mb-3"></i>
      <p class="text-muted">Unable to load tours. Please try again later.</p>
    </div>
  `;
}

function formatCategory(category) {
  const categories = {
    'round_tour': 'Round Tour',
    'day_tour': 'Day Tour',
    'transport': 'Transport',
    'ayurveda': 'Ayurveda',
    'wildlife': 'Wildlife',
    'cultural': 'Cultural'
  };
  return categories[category] || category;
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function setupTourFilters() {
  const filterButtons = document.querySelectorAll('[data-filter]');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      currentFilter = filter;

      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      if (filter === 'all') {
        displayTours(allTours);
      } else {
        const filteredTours = allTours.filter(tour => tour.category === filter);
        displayTours(filteredTours);
      }
    });
  });
}

function populateTourDropdown(tours) {
  const tourSelect = document.getElementById('tourPackage');
  tourSelect.innerHTML = '<option value="">Select a tour package</option>' +
    tours.map(tour => `<option value="${tour.id}">${tour.title}</option>`).join('');
}

window.selectTour = function(tourId, tourTitle) {
  const tourSelect = document.getElementById('tourPackage');
  tourSelect.value = tourId;

  document.getElementById('booking').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
};

const FORMSPREE_BOOKING_URL = 'https://formspree.io/f/maqplpdz'; // replace with your Formspree form ID
const FORMSPREE_NEWSLETTER_URL = 'https://formspree.io/f/mwvrwrnn'; // replace with your Formspree form ID

async function sendFormData(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    body: data
  });

  if (!response.ok) {
    const json = await response.json().catch(() => null);
    const message = json?.error || response.statusText || 'Failed to send form';
    throw new Error(message);
  }

  return response.json();
}

async function loadGallery() {
  // Static local gallery images
  galleryImages = [
    { id: 'g1', title: 'Beach Sunset', image_url: 'images/gallery/gallery-1.jpeg' },
    { id: 'g2', title: 'Tea Plantation', image_url: 'images/gallery/gallery-2.jpeg' },
    { id: 'g3', title: 'Historic Temple', image_url: 'images/gallery/gallery-3.jpeg' },
    { id: 'g4', title: 'Wildlife Safari', image_url: 'images/gallery/gallery-4.jpeg' },
    { id: 'g5', title: 'Cultural Temple', image_url: 'images/gallery/gallery-5.jpeg' },
    { id: 'g6', title: 'Tea Valley', image_url: 'images/gallery/gallery-6.jpeg' },
    { id: 'g7', title: 'Surf Beach', image_url: 'images/gallery/gallery-7.jpeg' },
    { id: 'g8', title: 'Elephant Safari', image_url: 'images/gallery/gallery-8.jpeg' },
    { id: 'g9', title: 'Mountain View', image_url: 'images/gallery/gallery-9.jpeg' },
    { id: 'g10', title: 'Sunset Cruise', image_url: 'images/gallery/gallery-10.jpeg' },
    { id: 'g11', title: 'Hidden Waterfall', image_url: 'images/gallery/gallery-11.jpeg' },
    { id: 'g12', title: 'Road Trip', image_url: 'images/gallery/gallery-12.jpeg' }
  ];

  displayGallery(galleryImages);
}

function displayGallery(images) {
  const galleryGrid = document.getElementById('gallery-grid');

  if (images.length === 0) {
    galleryGrid.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-muted">No images available.</p>
      </div>
    `;
    return;
  }

  galleryGrid.innerHTML = images.map(image => `
    <div class="col-lg-3 col-md-4 col-6">
      <div class="gallery-item">
        <img src="${image.image_url}" alt="${image.title}" loading="lazy" decoding="async">
        <div class="gallery-overlay">
          <i class="bi bi-zoom-in"></i>
        </div>
      </div>
    </div>
  `).join('');
}

function displayGalleryError() {
  const galleryGrid = document.getElementById('gallery-grid');
  galleryGrid.innerHTML = `
    <div class="col-12 text-center py-5">
      <p class="text-muted">Unable to load gallery images.</p>
    </div>
  `;
}

async function loadReviews() {
  // Static sample reviews
  reviewsList = [
    { id: 'r1', customer_name: 'Emily', rating: 5, review_text: 'Amazing experience! Highly recommended.', created_at: new Date().toISOString() },
    { id: 'r2', customer_name: 'James', rating: 5, review_text: 'Professional guides and smooth logistics.', created_at: new Date().toISOString() },
    { id: 'r3', customer_name: 'Sita', rating: 4, review_text: 'Beautiful places and friendly staff.', created_at: new Date().toISOString() }
  ];

  displayReviews(reviewsList);
}

function displayReviews(reviews) {
  const reviewsContainer = document.getElementById('reviews-container');

  if (reviews.length === 0) {
    reviewsContainer.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-muted">No reviews yet. Be the first to share your experience!</p>
      </div>
    `;
    return;
  }

  reviewsContainer.innerHTML = reviews.map(review => `
    <div class="col-lg-4 col-md-6">
      <div class="review-card">
        <div class="review-stars">
          ${generateStars(review.rating)}
        </div>
        <p class="text-muted mb-3">"${review.review_text}"</p>
        <div class="review-author">
          <i class="bi bi-person-circle me-2"></i>${review.customer_name}
        </div>
        <small class="text-muted">${formatDate(review.created_at)}</small>
      </div>
    </div>
  `).join('');
}

function displayReviewsError() {
  const reviewsContainer = document.getElementById('reviews-container');
  reviewsContainer.innerHTML = `
    <div class="col-12 text-center py-5">
      <p class="text-muted">Unable to load reviews.</p>
    </div>
  `;
}

function generateStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<i class="bi bi-star-fill"></i>';
    } else {
      stars += '<i class="bi bi-star"></i>';
    }
  }
  return stars;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function setupBookingForm() {
  const bookingForm = document.getElementById('booking-form');
  const successAlert = document.getElementById('booking-success');
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = bookingForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';
    submitButton.disabled = true;

    const formData = new FormData();
    formData.append('first_name', document.getElementById('firstName').value);
    formData.append('last_name', document.getElementById('lastName').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('phone', document.getElementById('phone').value);
    formData.append('tour_package', document.getElementById('tourPackage').selectedOptions[0]?.text || 'N/A');
    formData.append('arrival_date', document.getElementById('arrivalDate').value);
    formData.append('arrival_time', document.getElementById('arrivalTime').value);
    formData.append('adults', document.getElementById('adults').value);
    formData.append('children', document.getElementById('children').value);
    formData.append('departure_location', document.getElementById('departureLocation').value);
    formData.append('arrival_location', document.getElementById('arrivalLocation').value);
    formData.append('message', document.getElementById('message').value);

    try {
      if (FORMSPREE_BOOKING_URL.includes('your-booking-id')) {
        throw new Error('Please set your Formspree booking URL in main.js before submitting.');
      }

      await sendFormData(FORMSPREE_BOOKING_URL, formData);

      bookingForm.reset();
      successAlert.classList.remove('d-none');
      setTimeout(() => successAlert.classList.add('d-none'), 5000);
      submitButton.innerHTML = '<i class="bi bi-check-circle me-2"></i>Submitted!';
      setTimeout(() => {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
      }, 2000);
    } catch (err) {
      console.error('Booking submit error:', err);
      alert(err.message || 'There was an error submitting your booking. Please try again.');
      submitButton.innerHTML = originalButtonText;
      submitButton.disabled = false;
    }
  });
}

function setupNewsletterForm() {
  const newsletterForm = document.getElementById('newsletter-form');
  const successAlert = document.getElementById('newsletter-success');
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = newsletterForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Subscribing...';
    submitButton.disabled = true;

    const email = document.getElementById('newsletter-email').value;

    try {
      if (FORMSPREE_NEWSLETTER_URL.includes('your-newsletter-id')) {
        throw new Error('Please set your Formspree newsletter URL in main.js before submitting.');
      }

      const data = new FormData();
      data.append('email', email);
      await sendFormData(FORMSPREE_NEWSLETTER_URL, data);

      newsletterForm.reset();
      successAlert.classList.remove('d-none');
      setTimeout(() => successAlert.classList.add('d-none'), 5000);
      submitButton.innerHTML = '<i class="bi bi-check-circle me-2"></i>Subscribed!';
      setTimeout(() => {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
      }, 2000);
    } catch (error) {
      console.error('Newsletter submit error:', error);
      alert(error.message || 'There was an error subscribing to the newsletter. Please try again.');
      submitButton.innerHTML = originalButtonText;
      submitButton.disabled = false;
    }
  });
}
