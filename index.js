/* ===================== TOGGLE LOGIN / SIGNUP ===================== */
const container = document.getElementById("Container");
const registerBtn = document.getElementById("Register");
const loginBtn = document.getElementById("login");

if (registerBtn && loginBtn && container) {
    registerBtn.addEventListener("click", () => {
        container.classList.add("active");
    });

    loginBtn.addEventListener("click", () => {
        container.classList.remove("active");
    });
}

/* ===================== SIGN UP VALIDATION ===================== */
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = signupName.value.trim();
        const email = signupEmail.value.trim();
        const password = signupPassword.value.trim();
        const msg = document.getElementById("signupMsg");

        msg.innerText = "";

        if (name === "" || name.includes(" ")) {
            msg.style.color = "#FF4C4C";
            msg.innerText = "Name should not contain spaces";
            return;
        }

        if (!email.endsWith("@gmail.com") || email.includes(" ")) {
            msg.style.color = "#FF4C4C";
            msg.innerText = "Email must be a valid @gmail.com address";
            return;
        }

        if (password.length < 6 || password.includes(" ")) {
            msg.style.color = "#FF4C4C";
            msg.innerText = "Password must be at least 6 characters with no spaces";
            return;
        }

        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userPassword", password);

        msg.style.color = "#00FF7F";
        msg.innerText = "Signup successful! Please Sign In.";

        container.classList.remove("active");
        signupForm.reset();
    });
}

/* ===================== SIGN IN VALIDATION ===================== */
const signinForm = document.getElementById("signinForm");

if (signinForm) {
    signinForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = signinEmail.value.trim();
        const password = signinPassword.value.trim();
        const msg = document.getElementById("signinMsg");

        msg.innerText = "";

        if (email.includes(" ") || password.includes(" ")) {
            msg.style.color = "#FF4C4C";
            msg.innerText = "Spaces are not allowed";
            return;
        }

        const storedEmail = localStorage.getItem("userEmail");
        const storedPassword = localStorage.getItem("userPassword");

        if (!storedEmail) {
            msg.style.color = "#FF4C4C";
            msg.innerText = "Account not found. Please Sign Up.";
            return;
        }

        if (email === storedEmail && password === storedPassword) {
            localStorage.setItem("isLoggedIn", "true");
            document.getElementById("login-form").style.display = "none";
            document.getElementById("website").style.display = "block";
        } else {
            msg.style.color = "#FF4C4C";
            msg.innerText = "Invalid email or password";
        }
    });
}

/* ===================== LOGIN STATE CHECK ===================== */
document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
        document.getElementById("login-form").style.display = "none";
        document.getElementById("website").style.display = "block";
    } else {
        document.getElementById("login-form").style.display = "block";
        document.getElementById("website").style.display = "none";
    }
});

// Logout 
function logout() {
    localStorage.removeItem("isLoggedIn");
    window.location.reload();
}

// Section scroll down
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        const target = document.querySelector(targetId);

        if (target) {
            e.preventDefault();
            const offset = 110; // navbar height
            const position = target.offsetTop - offset;

            window.scrollTo({
                top: position,
                behavior: "smooth"
            });
        }
    });
});

// Serach Operations
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const originalOrder = new Map();

document
  .querySelectorAll(".card, .Console-card, .Accessories-card, .PC-card")
  .forEach(item => {
      const parent = item.parentElement;
      if (!originalOrder.has(parent)) {
          originalOrder.set(parent, []);
      }
      originalOrder.get(parent).push(item);
  });


function performSearch() {
    const value = searchInput.value.toLowerCase().trim();
    if (!value) return resetSearch();
    if (value === "") {
    resetSearch();
    return;
}


    const groups = [
        { selector: ".card", section: "#Buy\\ Games\\ \\&\\ Sell\\ games" },
        { selector: ".Console-card", section: "#Console" },
        { selector: ".Accessories-card", section: "#Accessories" },
        { selector: ".PC-card", section: "#PC\\ Components" }
    ];

    let firstMatch = null;

    groups.forEach(group => {
        const items = [...document.querySelectorAll(group.selector)];
        const container = items[0]?.parentElement;
        if (!container) return;

        const matched = [];
        const others = [];

        items.forEach(item => {
            const title = item.querySelector("h3").innerText.toLowerCase();
            title.includes(value) ? matched.push(item) : others.push(item);
        });

        // Re-append: matched first, others after
        [...matched, ...others].forEach(el => container.appendChild(el));

        if (matched.length && !firstMatch) {
            firstMatch = document.querySelector(group.section);
        }
    });

    // Auto scroll to matched section
    if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: "smooth" });
    }
}

// Reset
function resetSearch() {
    originalOrder.forEach((items, container) => {
        items.forEach(item => {
            item.style.display = "block";
            container.appendChild(item); // restore original order
        });
    });
}


// Click
searchBtn.addEventListener("click", performSearch);

// Enter key
searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") performSearch();
});



/* ===================== CART + SLIDERS ===================== */
document.addEventListener("DOMContentLoaded", function () {

    /* ---------- CART DATA ---------- */
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCartCount() {
        let count = 0;
        cart.forEach(item => count += item.quantity);
        const cartCount = document.getElementById("cartCount");
        if (cartCount) cartCount.innerText = count;
    }

    /* ---------- ADD TO CART ---------- */
    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", () => {
            const name = btn.dataset.name;
            const price = Number(btn.dataset.price);
            const image = btn.dataset.image;

            const existingItem = cart.find(item => item.name === name);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    name,
                    price,
                    image,
                    quantity: 1
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
        });
    });

    /* ---------- GO TO CART ---------- */
    window.goToCart = function () {
        window.location.href = "cart.html";
    };

    // Home page + sliders
    let currentSlide = 0;
    const slides = document.querySelectorAll(".slide");

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove("active"));
        slides[index].classList.add("active");
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    /* Auto slide every 4 seconds */
    setInterval(nextSlide, 4000);


    /* ---------- GAME SLIDER ---------- */
    const gameList = document.getElementById("gameList");
    const leftArrow = document.getElementById("leftArrow");
    const rightArrow = document.getElementById("rightArrow");

    if (gameList && leftArrow && rightArrow) {
        rightArrow.onclick = () => gameList.scrollBy({ left: 300, behavior: "smooth" });
        leftArrow.onclick = () => gameList.scrollBy({ left: -300, behavior: "smooth" });
    }

    /* ---------- CONSOLE SLIDER ---------- */
    const Consoles_content = document.getElementById("Consoles_content");
    const leftArrow1 = document.getElementById("leftArrow1");
    const rightArrow1 = document.getElementById("rightArrow1");

    if (Consoles_content && leftArrow1 && rightArrow1) {
        rightArrow1.onclick = () => Consoles_content.scrollBy({ left: 300, behavior: "smooth" });
        leftArrow1.onclick = () => Consoles_content.scrollBy({ left: -300, behavior: "smooth" });
    }

    // Accessories
    const Accessories_content = document.getElementById("Accessories_content");
    const leftArrow2 = document.getElementById("leftArrow2");
    const rightArrow2 = document.getElementById("rightArrow2");

    if (Accessories_content && leftArrow2 && rightArrow2) {
        rightArrow2.onclick = () => Accessories_content.scrollBy({ left: 300, behavior: "smooth" });
        leftArrow2.onclick = () => Accessories_content.scrollBy({ left: -300, behavior: "smooth" });
    }

    // PC Components
    // ===== PC COMPONENTS SLIDER =====
    const PCList = document.getElementById("PCList");
    const leftArrow3 = document.getElementById("leftArrow3");
    const rightArrow3 = document.getElementById("rightArrow3");

    if (PCList && leftArrow3 && rightArrow3) {
        rightArrow3.addEventListener("click", () => {
            PCList.scrollBy({ left: 300, behavior: "smooth" });
        });

        leftArrow3.addEventListener("click", () => {
            PCList.scrollBy({ left: -300, behavior: "smooth" });
        });
    }


    updateCartCount();
});
