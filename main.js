const packageDetails = {
	starter: {
		title: "Starter Website",
		price: "Vanaf €350 setup + €49/mnd",
		description:
			"Voor kleine zelfstandigen die snel professioneel online willen staan.",
		benefits: [
			"1 pagina",
			"Mobielvriendelijk ontwerp",
			"30 minuten onderhoud per maand",
		],
		inquiryMessage:
			"Hallo BMA Studio,\n\nIk ben geïnteresseerd in het Starter Website pakket. Ik wil graag meer informatie over de opstart, de maandelijkse kost en wat jullie nodig hebben om te beginnen.\n\nAlvast bedankt!",
	},
	local: {
		title: "Local Business Website",
		badge: "Aanbevolen",
		price: "Vanaf €550 setup + €79/mnd",
		description:
			"Voor lokale bedrijven die een duidelijke bedrijfswebsite nodig hebben.",
		benefits: [
			"3 tot 4 pagina's",
			"Contactformulier en Google Maps",
			"1 uur onderhoud per maand",
		],
		inquiryMessage:
			"Hallo BMA Studio,\n\nIk ben geïnteresseerd in het Local Business Website pakket. Ik wil graag bespreken hoe jullie mijn bedrijf online kunnen zetten met meerdere pagina's, een contactformulier en Google Maps.\n\nAlvast bedankt!",
	},
	content: {
		title: "Website + Content",
		price: "Vanaf €750 setup + €149/mnd",
		description:
			"Voor bedrijven die naast een website ook sterker zichtbaar willen zijn op sociale media.",
		benefits: [
			"4 tot 5 pagina's",
			"2 korte social media edits per maand",
			"2 uur onderhoud per maand",
		],
		inquiryMessage:
			"Hallo BMA Studio,\n\nIk ben geïnteresseerd in het Website + Content pakket. Ik wil graag meer informatie over een website in combinatie met social media content en maandelijks onderhoud.\n\nAlvast bedankt!",
	},
};

const header = document.querySelector(".site-header");
const progressBar = document.querySelector(".scroll-progress");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const navButtons = document.querySelectorAll(
	"header [data-target], .hero-section [data-target], .founder-section [data-target]",
);
const packageCards = document.querySelectorAll("[data-package]");
const spotlight = document.querySelector(".package-spotlight");
const spotlightCard = document.querySelector(".spotlight-card");
const spotlightClose = document.querySelector(".spotlight-close");
const spotlightBack = document.querySelector(".spotlight-back");
const portfolioToggle = document.querySelector("[data-portfolio-toggle]");
const portfolioProjects = document.querySelector("#portfolio-projects");
const contactForm = document.querySelector(".contact-form");
const contactSubmit = contactForm?.querySelector("[type='submit']");
const contactStatus = contactForm?.querySelector(".success-message");
const year = document.querySelector("#year");
let activePackageKey = "";
let scrollUpdateQueued = false;

if (year) year.textContent = new Date().getFullYear();

function clampNumber(value, min, max) {
	return Math.min(max, Math.max(min, value));
}

function scrollToSection(id) {
	const section = document.getElementById(id);
	if (!section) return;

	const runScroll = () =>
		section.scrollIntoView({ behavior: "smooth", block: "start" });

	if (mobileMenu?.classList.contains("is-open")) {
		closeMenu();
		window.setTimeout(runScroll, 230);
		return;
	}

	runScroll();
}

function updateScrollState() {
	const maxScroll =
		document.documentElement.scrollHeight - document.documentElement.clientHeight;
	const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

	header?.classList.toggle("is-scrolled", window.scrollY > 14);
	document.documentElement.style.setProperty(
		"--scroll-progress",
		String(clampNumber(progress, 0, 1)),
	);

	const activeId = ["diensten", "over-ons", "portfolio", "pakketten", "contact", "reviews"].reduce(
		(current, id) => {
			const section = document.getElementById(id);
			return section && section.getBoundingClientRect().top <= 180
				? id
				: current;
		},
		"",
	);

	document.querySelectorAll(".nav-link[data-target], .mobile-nav-link[data-target]").forEach((link) => {
		link.classList.toggle("is-active", link.dataset.target === activeId);
	});
}

function scheduleScrollStateUpdate() {
	if (scrollUpdateQueued) return;

	scrollUpdateQueued = true;
	window.requestAnimationFrame(() => {
		scrollUpdateQueued = false;
		updateScrollState();
	});
}

function closeMenu() {
	if (!menuToggle || !mobileMenu) return;

	menuToggle.classList.remove("is-open");
	menuToggle.setAttribute("aria-expanded", "false");
	mobileMenu.classList.remove("is-open");
	document.body.classList.remove("menu-open");
}

function openSpotlight(packageKey) {
	const item = packageDetails[packageKey];
	if (!item || !spotlight) return;

	activePackageKey = packageKey;
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
	if (!spotlight) return;

	spotlight.hidden = true;
	document.body.style.overflow = "";
}

function fillPackageMessage(packageKey) {
	const item = packageDetails[packageKey];
	const messageField = contactForm?.elements.message;
	if (!item || !messageField) return;

	messageField.value = item.inquiryMessage;
	setError("message", "");
	hideContactStatus();

	window.setTimeout(() => {
		messageField.focus({ preventScroll: true });
	}, 220);
}

function setError(field, message) {
	if (!contactForm) return;

	const input = contactForm.elements[field];
	const error = contactForm.querySelector(`[data-error-for="${field}"]`);

	if (!input || !error) return;

	input.setAttribute("aria-invalid", message ? "true" : "false");
	error.textContent = message;
}

function hideContactStatus() {
	if (!contactStatus) return;

	contactStatus.hidden = true;
	contactStatus.classList.remove("is-error");
}

function showContactStatus(message, type = "success") {
	if (!contactStatus) return;

	contactStatus.textContent = message;
	contactStatus.classList.toggle("is-error", type === "error");
	contactStatus.hidden = false;
}

function validateForm() {
	if (!contactForm) return false;

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

function setupPortfolioToggle() {
	if (!portfolioToggle || !portfolioProjects) return;

	portfolioToggle.addEventListener("click", () => {
		const isOpen = !portfolioProjects.hidden;

		portfolioProjects.hidden = isOpen;
		portfolioToggle.setAttribute("aria-expanded", String(!isOpen));
		portfolioToggle.textContent = isOpen ? "Bekijk projecten" : "Verberg projecten";

		if (!isOpen) {
			portfolioProjects.querySelectorAll(".reveal").forEach((item) => {
				item.classList.add("is-visible");
			});
		}
	});
}

function setupHeroParallax() {
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;
	const heroMockup = document.querySelector("[data-hero-parallax]");
	const depthScene = document.querySelector("[data-depth-scene]");
	const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

	if ((!heroMockup && !depthScene) || prefersReducedMotion) return;

	let parallaxQueued = false;
	let lastScrollY = window.scrollY;
	let windY = 0;

	const updateParallax = () => {
		parallaxQueued = false;
		const scrollDelta = window.scrollY - lastScrollY;
		lastScrollY = window.scrollY;
		windY += (clampNumber(scrollDelta, -80, 80) - windY) * 0.16;
		depthScene?.style.setProperty("--wind-y", `${windY.toFixed(2)}px`);

		if (!heroMockup || !canHover) return;
		const viewportCenter = window.innerHeight / 2;
		const rect = heroMockup.getBoundingClientRect();
		const distance = rect.top + rect.height / 2 - viewportCenter;
		heroMockup.style.setProperty(
			"--parallax-y",
			`${Math.round(distance * -0.018)}px`,
		);
	};

	const updateScene = (event) => {
		if (!depthScene || !canHover) return;
		const x = (event.clientX / window.innerWidth - 0.5) * 24;
		const y = (event.clientY / window.innerHeight - 0.5) * 18;
		depthScene.style.setProperty("--scene-x", `${x.toFixed(2)}px`);
		depthScene.style.setProperty("--scene-y", `${y.toFixed(2)}px`);
	};

	const resetScene = () => {
		if (!depthScene) return;
		depthScene.style.setProperty("--scene-x", "0px");
		depthScene.style.setProperty("--scene-y", "0px");
	};

	const scheduleParallax = () => {
		if (parallaxQueued) return;
		parallaxQueued = true;
		window.requestAnimationFrame(updateParallax);
	};

	window.addEventListener("scroll", scheduleParallax, { passive: true });
	window.addEventListener("resize", scheduleParallax);
	if (canHover) {
		window.addEventListener("pointermove", updateScene, { passive: true });
		window.addEventListener("pointerleave", resetScene);
	}
	updateParallax();
}

function setupPackageQueryPrefill() {
	if (!contactForm) return;

	const packageKey = new URLSearchParams(window.location.search).get("pakket");
	if (!packageKey || !packageDetails[packageKey]) return;

	fillPackageMessage(packageKey);
}

document.querySelector("[data-scroll-top]")?.addEventListener("click", () => {
	window.scrollTo({ top: 0, behavior: "smooth" });
});

menuToggle?.addEventListener("click", () => {
	const isOpen = !mobileMenu.classList.contains("is-open");
	menuToggle.classList.toggle("is-open", isOpen);
	menuToggle.setAttribute("aria-expanded", String(isOpen));
	mobileMenu.classList.toggle("is-open", isOpen);
	document.body.classList.toggle("menu-open", isOpen);
});

navButtons.forEach((button) => {
	button.addEventListener("click", () =>
		scrollToSection(button.dataset.target),
	);
});

if (spotlight) {
	packageCards.forEach((card) => {
		card.addEventListener("click", () => openSpotlight(card.dataset.package));
	});

	spotlight.addEventListener("click", closeSpotlight);
	spotlightCard?.addEventListener("click", (event) => event.stopPropagation());
	spotlightClose?.addEventListener("click", closeSpotlight);
	spotlightBack?.addEventListener("click", closeSpotlight);

	spotlight
		.querySelector("[data-target='contact']")
		?.addEventListener("click", () => {
			const selectedPackageKey = activePackageKey;
			closeSpotlight();
			fillPackageMessage(selectedPackageKey);
			window.setTimeout(() => scrollToSection("contact"), 120);
		});
}

window.addEventListener("keydown", (event) => {
	if (event.key === "Escape" && spotlight && !spotlight.hidden) closeSpotlight();
});

window.addEventListener("scroll", scheduleScrollStateUpdate, { passive: true });
window.addEventListener("resize", updateScrollState);

contactForm?.addEventListener("input", (event) => {
	if (event.target.name) setError(event.target.name, "");
	hideContactStatus();
});

contactForm?.addEventListener("submit", async (event) => {
	event.preventDefault();

	if (!validateForm()) return;

	hideContactStatus();
	contactSubmit.disabled = true;
	contactSubmit.textContent = "Versturen...";

	try {
		const response = await fetch(contactForm.dataset.endpoint, {
			method: "POST",
			body: new FormData(contactForm),
			headers: {
				Accept: "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Contact form submission failed");
		}

		contactForm.reset();
		showContactStatus("Bedankt. Je aanvraag is verzonden.");
	} catch (error) {
		showContactStatus(
			"Versturen lukt niet. Mail ons rechtstreeks via info@bmastudio.be.",
			"error",
		);
	} finally {
		contactSubmit.disabled = false;
		contactSubmit.textContent = "Verstuur aanvraag";
	}
});

setupReveal();
setupPortfolioToggle();
setupHeroParallax();
setupPackageQueryPrefill();
updateScrollState();
