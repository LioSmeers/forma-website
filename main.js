const packageDetails = {
	starter: {
		title: "Starter Website",
		price: "Vanaf €300 setup + €19/mnd",
		description:
			"Voor kleine zelfstandigen die snel professioneel online willen staan.",
		benefits: [
			"1 pagina",
			"Mobielvriendelijk ontwerp",
			"30 minuten onderhoud per maand",
		],
	},
	local: {
		title: "Local Business Website",
		badge: "Aanbevolen",
		price: "Vanaf €500 setup + €49/mnd",
		description:
			"Voor lokale bedrijven die een duidelijke bedrijfswebsite nodig hebben.",
		benefits: [
			"3 tot 4 pagina's",
			"Contactformulier en Google Maps",
			"1 uur onderhoud per maand",
		],
	},
	content: {
		title: "Website + Content",
		price: "Vanaf €700 setup + €69/mnd",
		description:
			"Voor bedrijven die naast een website ook sterker zichtbaar willen zijn op sociale media.",
		benefits: [
			"4 tot 5 pagina's",
			"2 korte social media edits per maand",
			"2 uur onderhoud per maand",
		],
	},
};

const header = document.querySelector(".site-header");
const progressBar = document.querySelector(".scroll-progress");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const navButtons = document.querySelectorAll(
	"header [data-target], .hero-section [data-target]",
);
const packageCards = document.querySelectorAll("[data-package]");
const spotlight = document.querySelector(".package-spotlight");
const spotlightCard = document.querySelector(".spotlight-card");
const spotlightClose = document.querySelector(".spotlight-close");
const spotlightBack = document.querySelector(".spotlight-back");
const contactForm = document.querySelector(".contact-form");
const year = document.querySelector("#year");

year.textContent = new Date().getFullYear();

function scrollToSection(id) {
	const section = document.getElementById(id);
	if (!section) return;

	const runScroll = () =>
		section.scrollIntoView({ behavior: "smooth", block: "start" });

	if (mobileMenu.classList.contains("is-open")) {
		closeMenu();
		window.setTimeout(runScroll, 230);
		return;
	}

	runScroll();
}

function updateScrollState() {
	const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
	const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

	header.classList.toggle("is-scrolled", window.scrollY > 14);
	progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;

	const activeId = ["diensten", "pakketten", "contact", "reviews"].reduce(
		(current, id) => {
			const section = document.getElementById(id);
			return section && section.getBoundingClientRect().top <= 180
				? id
				: current;
		},
		"",
	);

	document.querySelectorAll(".nav-link, .mobile-nav-link").forEach((link) => {
		link.classList.toggle("is-active", link.dataset.target === activeId);
	});
}

function closeMenu() {
	menuToggle.classList.remove("is-open");
	menuToggle.setAttribute("aria-expanded", "false");
	mobileMenu.classList.remove("is-open");
}

function openSpotlight(packageKey) {
	const item = packageDetails[packageKey];
	if (!item) return;

	spotlight.querySelector("#spotlight-title").textContent = item.title;
	spotlight.querySelector(".spotlight-price").textContent = item.price;
	spotlight.querySelector(".spotlight-description").textContent =
		item.description;

	const badge = spotlight.querySelector(".spotlight-badge");
	badge.hidden = !item.badge;
	badge.textContent = item.badge || "";

	const benefitList = spotlight.querySelector(".spotlight-benefits");
	benefitList.innerHTML = item.benefits
		.map(
			(benefit) =>
				`<li><span class="checkmark">✓</span><span>${benefit}</span></li>`,
		)
		.join("");

	spotlight.hidden = false;
	document.body.style.overflow = "hidden";
}

function closeSpotlight() {
	spotlight.hidden = true;
	document.body.style.overflow = "";
}

function setError(field, message) {
	const input = contactForm.elements[field];
	const error = contactForm.querySelector(`[data-error-for="${field}"]`);

	if (!input || !error) return;

	input.setAttribute("aria-invalid", message ? "true" : "false");
	error.textContent = message;
}

function validateForm() {
	const name = contactForm.elements.name.value.trim();
	const email = contactForm.elements.email.value.trim();
	const message = contactForm.elements.message.value.trim();
	let isValid = true;

	setError("name", "");
	setError("email", "");
	setError("message", "");

	if (!name) {
		setError("name", "Vul je naam in.");
		isValid = false;
	}

	if (!email) {
		setError("email", "Vul je e-mailadres in.");
		isValid = false;
	} else if (!/^\S+@\S+\.\S+$/.test(email)) {
		setError("email", "Vul een geldig e-mailadres in.");
		isValid = false;
	}

	if (!message) {
		setError("message", "Vertel kort wat je nodig hebt.");
		isValid = false;
	}

	return isValid;
}

function setupReveal() {
	const revealItems = document.querySelectorAll(".reveal");
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;

	if (prefersReducedMotion) {
		revealItems.forEach((item) => item.classList.add("is-visible"));
		return;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.16 },
	);

	revealItems.forEach((item) => observer.observe(item));
}

document.querySelector("[data-scroll-top]").addEventListener("click", () => {
	window.scrollTo({ top: 0, behavior: "smooth" });
});

menuToggle.addEventListener("click", () => {
	const isOpen = !mobileMenu.classList.contains("is-open");
	menuToggle.classList.toggle("is-open", isOpen);
	menuToggle.setAttribute("aria-expanded", String(isOpen));
	mobileMenu.classList.toggle("is-open", isOpen);
});

navButtons.forEach((button) => {
	button.addEventListener("click", () =>
		scrollToSection(button.dataset.target),
	);
});

packageCards.forEach((card) => {
	card.addEventListener("click", () => openSpotlight(card.dataset.package));
});

spotlight.addEventListener("click", closeSpotlight);
spotlightCard.addEventListener("click", (event) => event.stopPropagation());
spotlightClose.addEventListener("click", closeSpotlight);
spotlightBack.addEventListener("click", closeSpotlight);

spotlight
	.querySelector("[data-target='contact']")
	.addEventListener("click", () => {
		closeSpotlight();
		window.setTimeout(() => scrollToSection("contact"), 120);
	});

window.addEventListener("keydown", (event) => {
	if (event.key === "Escape" && !spotlight.hidden) closeSpotlight();
});

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);

contactForm.addEventListener("input", (event) => {
	if (event.target.name) setError(event.target.name, "");
	contactForm.querySelector(".success-message").hidden = true;
});

contactForm.addEventListener("submit", (event) => {
	event.preventDefault();

	if (!validateForm()) return;

	contactForm.reset();
	contactForm.querySelector(".success-message").hidden = false;
});

setupReveal();
updateScrollState();
