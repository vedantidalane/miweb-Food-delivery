// ── RESTAURANT REVIEWS MODULE ──

function getReviews(restaurantId) {
  const all = JSON.parse(localStorage.getItem('foodrush_reviews') || '{}');
  return all[restaurantId] || [];
}

function saveReview(restaurantId, review) {
  const all = JSON.parse(localStorage.getItem('foodrush_reviews') || '{}');
  if (!all[restaurantId]) all[restaurantId] = [];
  review.id = Date.now();
  review.date = new Date().toISOString();
  review.helpful = 0;
  review.unhelpful = 0;
  all[restaurantId].unshift(review);
  localStorage.setItem('foodrush_reviews', JSON.stringify(all));
  return review;
}

function voteReview(restaurantId, reviewId, type) {
  const votedKey = 'foodrush_review_votes';
  const voted = JSON.parse(localStorage.getItem(votedKey) || '{}');
  const voteKey = `${restaurantId}_${reviewId}`;
  if (voted[voteKey]) {
    showToast('You already voted on this review', 'warning');
    return false;
  }
  const all = JSON.parse(localStorage.getItem('foodrush_reviews') || '{}');
  const reviews = all[restaurantId] || [];
  const review = reviews.find(r => r.id === reviewId);
  if (review) {
    review[type]++;
    localStorage.setItem('foodrush_reviews', JSON.stringify(all));
    voted[voteKey] = type;
    localStorage.setItem(votedKey, JSON.stringify(voted));
    return true;
  }
  return false;
}

function getAverageRating(restaurantId) {
  const reviews = getReviews(restaurantId);
  if (!reviews.length) return 0;
  return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
}

function getRatingDistribution(restaurantId) {
  const reviews = getReviews(restaurantId);
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => { if (dist[r.rating] !== undefined) dist[r.rating]++; });
  return dist;
}

function renderStars(rating, size = '1rem') {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) html += `<i class="fas fa-star" style="color:#ffc107;font-size:${size}"></i>`;
    else if (i - rating < 1) html += `<i class="fas fa-star-half-alt" style="color:#ffc107;font-size:${size}"></i>`;
    else html += `<i class="far fa-star" style="color:#ddd;font-size:${size}"></i>`;
  }
  return html;
}

function renderReviewCard(review, restaurantId) {
  const voted = JSON.parse(localStorage.getItem('foodrush_review_votes') || '{}');
  const voteKey = `${restaurantId}_${review.id}`;
  const userVote = voted[voteKey] || '';
  const dateStr = new Date(review.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

  return `
    <div class="review-card fade-in">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div>
          <div class="fw-700"><i class="fas fa-user-circle me-2 text-muted"></i>${review.name}</div>
          <div class="mt-1">${renderStars(review.rating, '.9rem')}</div>
        </div>
        <span class="step-time">${dateStr}</span>
      </div>
      <p class="mb-2" style="color:var(--text-secondary);">${review.text}</p>
      <div class="d-flex gap-2">
        <button class="vote-btn ${userVote === 'helpful' ? 'voted' : ''}" onclick="handleVote(${restaurantId}, ${review.id}, 'helpful')">
          <i class="fas fa-thumbs-up me-1"></i>${review.helpful}
        </button>
        <button class="vote-btn ${userVote === 'unhelpful' ? 'voted' : ''}" onclick="handleVote(${restaurantId}, ${review.id}, 'unhelpful')">
          <i class="fas fa-thumbs-down me-1"></i>${review.unhelpful}
        </button>
      </div>
    </div>`;
}

function renderRatingDistribution(restaurantId) {
  const dist = getRatingDistribution(restaurantId);
  const reviews = getReviews(restaurantId);
  const total = reviews.length || 1;
  let html = '';
  for (let i = 5; i >= 1; i--) {
    const pct = Math.round((dist[i] / total) * 100);
    html += `
      <div class="rating-bar">
        <span class="small fw-600" style="min-width:18px;">${i}</span>
        <i class="fas fa-star small" style="color:#ffc107;"></i>
        <div class="rating-bar-fill"><div style="width:${pct}%"></div></div>
        <span class="small text-muted" style="min-width:30px;">${dist[i]}</span>
      </div>`;
  }
  return html;
}

function handleVote(restaurantId, reviewId, type) {
  if (voteReview(restaurantId, reviewId, type)) {
    showToast('Thanks for your feedback!', 'success');
    if (typeof renderReviewsSection === 'function') renderReviewsSection(restaurantId);
  }
}

// Seed some demo reviews
function seedDemoReviews() {
  const existing = JSON.parse(localStorage.getItem('foodrush_reviews') || '{}');
  if (Object.keys(existing).length > 0) return;

  const demoReviews = {
    1: [
      { id: 1001, name: 'Rahul S.', rating: 5, text: 'Amazing burgers! The Whopper is always perfect. Fast delivery too.', date: '2024-11-01T10:30:00Z', helpful: 12, unhelpful: 1 },
      { id: 1002, name: 'Priya M.', rating: 4, text: 'Good taste but packaging could be better. Fries were slightly cold.', date: '2024-10-28T14:20:00Z', helpful: 8, unhelpful: 2 }
    ],
    2: [
      { id: 1003, name: 'Amit K.', rating: 5, text: 'Best pizza in town! Pepperoni feast is a must-try.', date: '2024-11-05T18:15:00Z', helpful: 15, unhelpful: 0 },
      { id: 1004, name: 'Sneha R.', rating: 4, text: 'Consistent quality every time. Love the cheese burst options.', date: '2024-10-20T20:45:00Z', helpful: 6, unhelpful: 1 }
    ],
    3: [
      { id: 1005, name: 'Mohammed A.', rating: 5, text: 'Authentic Hyderabadi biryani! The mutton biryani is heavenly.', date: '2024-11-10T12:00:00Z', helpful: 20, unhelpful: 0 },
      { id: 1006, name: 'Kavita D.', rating: 4, text: 'Great flavors but delivery took a bit longer than expected.', date: '2024-10-15T19:30:00Z', helpful: 4, unhelpful: 3 }
    ],
    5: [
      { id: 1007, name: 'Rohan P.', rating: 4, text: 'Classic McD taste. McAloo Tikki never disappoints!', date: '2024-11-08T11:00:00Z', helpful: 9, unhelpful: 1 }
    ]
  };
  localStorage.setItem('foodrush_reviews', JSON.stringify(demoReviews));
}

// Run on load
seedDemoReviews();
