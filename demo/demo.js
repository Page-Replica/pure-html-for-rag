// Use the cleanHtml function from the bundled module (loaded via script tag in index.html)
const { cleanHtml } = window.pureHtmlForRag;

// Statistics tracking function
function analyzeHtml(html) {
  const stats = {
    scripts: (html.match(/<script[^>]*>[\s\S]*?<\/script>/gi) || []).length,
    styles: (html.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || []).length + 
            (html.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi) || []).length,
    images: (html.match(/<img[^>]*>/gi) || []).length + 
            (html.match(/<picture[^>]*>[\s\S]*?<\/picture>/gi) || []).length + 
            (html.match(/<svg[^>]*>[\s\S]*?<\/svg>/gi) || []).length,
    forms: (html.match(/<form[^>]*>[\s\S]*?<\/form>/gi) || []).length + 
           (html.match(/<input[^>]*>/gi) || []).length + 
           (html.match(/<button[^>]*>[\s\S]*?<\/button>/gi) || []).length + 
           (html.match(/<select[^>]*>/gi) || []).length + 
           (html.match(/<textarea[^>]*>[\s\S]*?<\/textarea>/gi) || []).length,
    attributes: (html.match(/\sstyle\s*=/gi) || []).length + 
                (html.match(/\sclass\s*=/gi) || []).length + 
                (html.match(/\son[a-z]+\s*=/gi) || []).length,
  };
  return stats;
}

// Example HTML templates
const examples = {
  basic: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Basic Page</title>
  <script src="analytics.js"></script>
  <style>
    body { font-family: Arial; }
    .header { color: #333; }
  </style>
</head>
<body>
  <h1>Welcome to My Site</h1>
  <p style="color: blue;">This is a simple paragraph.</p>
  <img src="logo.png" alt="Logo" />
</body>
</html>`,

  blog: `<!DOCTYPE html>
<html>
<head>
  <title>My Blog Post</title>
  <link rel="stylesheet" href="styles.css">
  <script async src="https://www.googletagmanager.com/gtag/js"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
  </script>
</head>
<body>
  <header class="site-header">
    <nav class="navbar">
      <a href="/" class="logo">
        <img src="logo.svg" alt="Site Logo" />
      </a>
    </nav>
  </header>
  
  <article class="post">
    <h1>10 Tips for Better Productivity</h1>
    <div class="meta">
      <span class="author">By John Doe</span>
      <span class="date">January 7, 2026</span>
    </div>
    
    <img src="hero.jpg" class="featured-image" alt="Productivity" />
    
    <p>In today's fast-paced world, staying productive is more important than ever.</p>
    
    <h2>Tip 1: Start Early</h2>
    <p>The early bird catches the worm. Starting your day early gives you a head start.</p>
    
    <h2>Tip 2: Take Breaks</h2>
    <p>Regular breaks help maintain focus and prevent burnout.</p>
    
    <!-- Ad placement -->
    <div class="ad-container">
      <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    </div>
    
    <form class="newsletter" action="/subscribe" method="post">
      <input type="email" name="email" placeholder="Your email">
      <button type="submit">Subscribe</button>
    </form>
  </article>
  
  <footer>
    <p>&copy; 2026 My Blog. All rights reserved.</p>
  </footer>
</body>
</html>`,

  ecommerce: `<!DOCTYPE html>
<html>
<head>
  <title>Premium Headphones - $199</title>
  <meta name="description" content="Buy premium wireless headphones">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="main.css">
  <script src="jquery.min.js"></script>
  <script src="cart.js"></script>
  <style>
    .product { display: flex; }
    .price { color: #e74c3c; font-size: 2em; }
  </style>
</head>
<body>
  <div class="product-page">
    <h1>Premium Wireless Headphones</h1>
    
    <div class="product-gallery">
      <img src="headphones-1.jpg" alt="Product view 1" class="main-image" />
      <div class="thumbnails">
        <img src="thumb-1.jpg" onclick="changeImage(1)" />
        <img src="thumb-2.jpg" onclick="changeImage(2)" />
        <img src="thumb-3.jpg" onclick="changeImage(3)" />
      </div>
    </div>
    
    <div class="product-info">
      <p class="price">$199.99</p>
      <p class="description">Experience crystal-clear audio with our premium wireless headphones.</p>
      
      <ul class="features">
        <li>Active Noise Cancellation</li>
        <li>40-hour battery life</li>
        <li>Premium build quality</li>
      </ul>
      
      <form class="add-to-cart-form">
        <select name="quantity" class="quantity-select">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <button type="submit" class="btn-primary">Add to Cart</button>
      </form>
      
      <div class="social-share">
        <button onclick="shareOnFacebook()" class="share-btn">
          <svg width="24" height="24">...</svg>
          Share
        </button>
      </div>
    </div>
  </div>
  
  <script>
    function changeImage(index) {
      document.querySelector('.main-image').src = 'headphones-' + index + '.jpg';
    }
  </script>
</body>
</html>`,

  complex: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complex Modern Website</title>
  
  <!-- Analytics -->
  <script async src="https://www.google-analytics.com/analytics.js"></script>
  <script src="https://cdn.segment.com/analytics.js"></script>
  
  <!-- Styles -->
  <link rel="stylesheet" href="bootstrap.min.css">
  <link rel="stylesheet" href="custom.css">
  <link rel="preload" href="fonts/main.woff2" as="font">
  <link rel="icon" type="image/png" href="favicon.png">
  
  <style>
    :root { --primary: #667eea; }
    body { margin: 0; font-family: system-ui; }
    .hero { background: linear-gradient(135deg, #667eea, #764ba2); }
    .modal { display: none; position: fixed; }
  </style>
  
  <!-- Third-party scripts -->
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
</head>
<body>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="/">
      <img src="logo.svg" width="30" height="30" alt="Logo">
      BrandName
    </a>
    <button class="navbar-toggler" onclick="toggleMenu()">
      <span class="navbar-toggler-icon"></span>
    </button>
  </nav>

  <section class="hero" style="padding: 100px 0; text-align: center;">
    <video autoplay muted loop class="hero-video">
      <source src="hero.mp4" type="video/mp4">
    </video>
    <h1 style="color: white; font-size: 3em;">Welcome to Our Platform</h1>
    <p style="color: rgba(255,255,255,0.9);">Build amazing things with our tools</p>
    <button onclick="showSignup()" class="btn btn-primary btn-lg">Get Started</button>
  </section>

  <section class="features">
    <h2>Our Features</h2>
    <div class="row">
      <div class="col-md-4">
        <svg class="feature-icon" width="64" height="64">
          <circle cx="32" cy="32" r="30" fill="#667eea"/>
        </svg>
        <h3>Fast Performance</h3>
        <p>Lightning-fast load times and smooth interactions.</p>
      </div>
      <div class="col-md-4">
        <canvas id="chart1" width="200" height="200"></canvas>
        <h3>Powerful Analytics</h3>
        <p>Track everything that matters to your business.</p>
      </div>
      <div class="col-md-4">
        <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                width="100%" height="200" frameborder="0"></iframe>
        <h3>Video Tutorials</h3>
        <p>Learn with our comprehensive video guides.</p>
      </div>
    </div>
  </section>

  <!-- Newsletter signup -->
  <section class="newsletter">
    <h2>Stay Updated</h2>
    <form action="/subscribe" method="POST" class="newsletter-form">
      <input type="email" 
             name="email" 
             placeholder="Enter your email" 
             class="form-control"
             required>
      <input type="hidden" name="source" value="homepage">
      <button type="submit" class="btn btn-success">Subscribe</button>
    </form>
  </section>

  <!-- Modal dialog -->
  <div id="signupModal" class="modal" style="display:none;">
    <div class="modal-content">
      <button onclick="closeModal()" class="close">&times;</button>
      <h2>Create Account</h2>
      <form id="signupForm">
        <input type="text" name="username" placeholder="Username">
        <input type="email" name="email" placeholder="Email">
        <input type="password" name="password" placeholder="Password">
        <button type="submit">Sign Up</button>
      </form>
    </div>
  </div>

  <footer class="site-footer">
    <p>&copy; 2026 BrandName. All rights reserved.</p>
    <div class="social-links">
      <a href="#" onclick="trackSocial('twitter')">
        <img src="twitter-icon.png" alt="Twitter">
      </a>
      <a href="#" onclick="trackSocial('facebook')">
        <img src="facebook-icon.png" alt="Facebook">
      </a>
    </div>
  </footer>

  <!-- Scripts at bottom for performance -->
  <script src="bootstrap.bundle.min.js"></script>
  <script>
    function toggleMenu() {
      document.querySelector('.navbar-collapse').classList.toggle('show');
    }
    
    function showSignup() {
      document.getElementById('signupModal').style.display = 'block';
      gtag('event', 'signup_clicked');
    }
    
    function closeModal() {
      document.getElementById('signupModal').style.display = 'none';
    }
    
    function trackSocial(network) {
      analytics.track('Social Click', { network: network });
    }
    
    // Initialize chart
    const ctx = document.getElementById('chart1').getContext('2d');
    // ... chart rendering code
  </script>
  
  <!-- Tracking pixels -->
  <noscript>
    <img src="https://analytics.example.com/pixel.gif" alt="" style="display:none">
  </noscript>
</body>
</html>`
};

// DOM elements
const inputHtml = document.getElementById("inputHtml");
const outputHtml = document.getElementById("outputHtml");
const inputCount = document.getElementById("inputCount");
const outputCount = document.getElementById("outputCount");
const reduction = document.getElementById("reduction");
const cleanBtn = document.getElementById("cleanBtn");
const clearBtn = document.getElementById("clearBtn");

const collapseWhitespaceCheckbox = document.getElementById("collapseWhitespace");
const removeEmptyElementsCheckbox = document.getElementById("removeEmptyElements");
const removeCommentsCheckbox = document.getElementById("removeComments");
const allowAnchorAttributesCheckbox = document.getElementById("allowAnchorAttributes");

// Update character counts
function updateCounts() {
  const inputLength = inputHtml.value.length;
  const outputLength = outputHtml.value.length;
  
  inputCount.textContent = `${inputLength.toLocaleString()} chars`;
  outputCount.textContent = `${outputLength.toLocaleString()} chars`;
  
  if (outputLength > 0 && inputLength > 0) {
    const percent = ((1 - outputLength / inputLength) * 100).toFixed(1);
    reduction.textContent = `(${percent}% smaller)`;
  } else {
    reduction.textContent = "";
  }
}

// Clean HTML function
function performClean() {
  const input = inputHtml.value;
  if (!input.trim()) {
    outputHtml.value = "";
    updateCounts();
    hideStats();
    return;
  }

  const startTime = performance.now();
  const beforeStats = analyzeHtml(input);

  const options = {
    collapseWhitespace: collapseWhitespaceCheckbox.checked,
    removeEmptyElements: removeEmptyElementsCheckbox.checked,
    removeComments: removeCommentsCheckbox.checked,
    allowedAttributeTags: allowAnchorAttributesCheckbox.checked ? ["a"] : [],
  };

  try {
    const cleaned = cleanHtml(input, options);
    const endTime = performance.now();
    const processingTime = (endTime - startTime).toFixed(2);
    
    outputHtml.value = cleaned;
    updateCounts();
    updateStats(input, cleaned, beforeStats, processingTime);
  } catch (error) {
    outputHtml.value = `Error: ${error.message}`;
    updateCounts();
    hideStats();
  }
}

// Update statistics dashboard
function updateStats(input, output, beforeStats, processingTime) {
  const inputLength = input.length;
  const outputLength = output.length;
  const saved = inputLength - outputLength;
  const reductionPercent = ((saved / inputLength) * 100).toFixed(1);
  const ratio = (inputLength / outputLength).toFixed(1);
  const totalRemovals = Object.values(beforeStats).reduce((a, b) => a + b, 0);
  
  // Update main stats
  document.getElementById("statReduction").textContent = `${reductionPercent}%`;
  document.getElementById("statBytes").textContent = `${saved.toLocaleString()} chars saved`;
  document.getElementById("statTime").textContent = `${processingTime}ms`;
  document.getElementById("statRemovals").textContent = totalRemovals;
  document.getElementById("statRemovalsText").textContent = totalRemovals === 1 ? "element removed" : "elements removed";
  document.getElementById("statRatio").textContent = `${ratio}:1`;
  
  // Update progress bars
  const maxCount = Math.max(...Object.values(beforeStats), 1);
  
  updateProgressBar("Scripts", beforeStats.scripts, maxCount);
  updateProgressBar("Styles", beforeStats.styles, maxCount);
  updateProgressBar("Images", beforeStats.images, maxCount);
  updateProgressBar("Forms", beforeStats.forms, maxCount);
  updateProgressBar("Attrs", beforeStats.attributes, maxCount);
  
  // Show dashboard
  document.getElementById("statsDashboard").classList.add("visible");
}

function updateProgressBar(name, count, maxCount) {
  const percentage = (count / maxCount) * 100;
  document.getElementById(`progress${name}`).textContent = count;
  document.getElementById(`progress${name}Fill`).style.width = `${percentage}%`;
}

function hideStats() {
  document.getElementById("statsDashboard").classList.remove("visible");
}

// Event listeners
cleanBtn.addEventListener("click", performClean);

clearBtn.addEventListener("click", () => {
  inputHtml.value = "";
  outputHtml.value = "";
  updateCounts();
  hideStats();
});

inputHtml.addEventListener("input", updateCounts);

// Auto-clean on checkbox change
[collapseWhitespaceCheckbox, removeEmptyElementsCheckbox, removeCommentsCheckbox, allowAnchorAttributesCheckbox].forEach(checkbox => {
  checkbox.addEventListener("change", () => {
    if (inputHtml.value.trim()) {
      performClean();
    }
  });
});

// Example buttons
document.querySelectorAll(".example-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const exampleKey = btn.getAttribute("data-example");
    if (examples[exampleKey]) {
      inputHtml.value = examples[exampleKey];
      updateCounts();
      performClean();
    }
  });
});

// Initial setup
updateCounts();
performClean();
