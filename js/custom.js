// Richard Hey Studios — animações e experiência (GSAP)
(function () {
	/* ---------- Menu: indicador de seção ativa (não depende do GSAP) ---------- */
	var spySections = ['links', 'sobre', 'contato']
		.map(function (id) { return document.getElementById(id); })
		.filter(Boolean);
	var menuLinks = document.querySelectorAll('.menu__link');
	function updateActiveLink() {
		var pos = window.scrollY + window.innerHeight * 0.4;
		var current = '';
		spySections.forEach(function (sec) {
			var top = sec.getBoundingClientRect().top + window.scrollY;
			if (top <= pos && top + sec.offsetHeight > pos) current = '#' + sec.id;
		});
		menuLinks.forEach(function (l) {
			l.classList.toggle('menu__link--active', l.getAttribute('href') === current);
		});
	}
	window.addEventListener('scroll', updateActiveLink, { passive: true });
	window.addEventListener('load', updateActiveLink);
	updateActiveLink();

	if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
	gsap.registerPlugin(ScrollTrigger);

	/* ---------- Hero: garante o título sempre visível ----------
	   A intro do template (app.min.js) usa gsap.from + ScrollTrigger no #title,
	   o que pode travar o título com opacity 0 após um refresh. Substituímos
	   por uma intro própria que sempre termina visível. */
	var heroTitle = document.getElementById('title');
	var heroText = document.querySelector('.hero__text');
	var heroCircle = document.querySelector('.decor-hero__circle');
	var heroCta = document.querySelector('.hero__cta');
	[heroTitle, heroText, heroCircle].forEach(function (el) {
		if (!el) return;
		gsap.killTweensOf(el);
		ScrollTrigger.getAll().forEach(function (st) {
			if (st.trigger === el) st.kill();
		});
	});

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		[heroTitle, heroText, heroCircle].forEach(function (el) {
			if (el) gsap.set(el, { clearProps: 'all' });
		});
		return;
	}

	if (heroTitle) {
		gsap.fromTo(heroTitle,
			{ x: 0, y: 34, opacity: 0 },
			{ x: 0, y: 0, opacity: 1, duration: 1.1, delay: 1.15, ease: 'power3.out', clearProps: 'transform,opacity' }
		);
	}

	if (heroText) {
		gsap.fromTo(heroText,
			{ x: 0, y: 24, opacity: 0 },
			{ x: 0, y: 0, opacity: 1, duration: 0.9, delay: 1.5, ease: 'power2.out', clearProps: 'transform,opacity' }
		);
	}

	if (heroCircle) {
		gsap.fromTo(heroCircle,
			{ opacity: 0 },
			{ opacity: 1, duration: 1.2, delay: 1.6, ease: 'power2.out', clearProps: 'opacity' }
		);
	}

	if (heroCta) {
		gsap.fromTo(heroCta,
			{ y: 24, opacity: 0 },
			{ y: 0, opacity: 1, duration: 0.9, delay: 1.75, ease: 'power2.out', clearProps: 'transform,opacity' }
		);
	}

	var finePointer = window.matchMedia('(pointer: fine)').matches;

	/* ---------- Header: esconde ao rolar para baixo, volta ao subir ---------- */
	var header = document.querySelector('.header');
	var lastY = window.scrollY;
	window.addEventListener('scroll', function () {
		if (!header) return;
		if (document.documentElement.classList.contains('menu-open') || document.body.classList.contains('menu-open')) return;
		var y = window.scrollY;
		if (y > lastY && y > 120) {
			header.classList.add('header--hidden');
		} else {
			header.classList.remove('header--hidden');
		}
		lastY = y;
	}, { passive: true });

	/* ---------- Hero: entrada da tag + parallax 3D no conteúdo ---------- */
	gsap.from('.hero .tag-badge', { y: -28, opacity: 0, duration: 0.8, delay: 1.1, ease: 'power2.out' });

	var heroSection = document.querySelector('.hero');
	var heroContent = document.querySelector('.hero__content');
	if (finePointer && heroSection && heroContent) {
		heroSection.addEventListener('mousemove', function (e) {
			var ry = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
			var rx = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
			gsap.to(heroContent, {
				rotateY: ry * 4,
				rotateX: -rx * 3,
				transformPerspective: 900,
				duration: 0.6,
				ease: 'power2.out'
			});
		});
		heroSection.addEventListener('mouseleave', function () {
			gsap.to(heroContent, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power2.out' });
		});
	}

	/* ---------- Títulos: revelação palavra por palavra ---------- */
	var splitTargets = document.querySelectorAll('.design-product__title, .studio__title, .about__title, .catch-glimse__text');
	splitTargets.forEach(function (el) {
		var text = el.textContent.trim().replace(/\s+/g, ' ');
		el.innerHTML = text.split(' ').map(function (w) {
			return '<span class="w-mask"><span class="w">' + w + '</span></span>';
		}).join(' ');
		gsap.from(el.querySelectorAll('.w'), {
			yPercent: 110,
			duration: 0.75,
			stagger: 0.05,
			ease: 'power3.out',
			scrollTrigger: { trigger: el, start: 'top 85%' }
		});
	});

	/* ---------- Manifesto: subtexto e CTA ---------- */
	gsap.from('.design-product__subtext, .inner__text, .inner__details', {
		opacity: 0,
		y: 30,
		stagger: 0.12,
		duration: 0.7,
		ease: 'power2.out',
		scrollTrigger: { trigger: '.design-product__content', start: 'top 78%' }
	});

	/* ---------- Página de links: cascata ---------- */
	gsap.from('.link__item', {
		opacity: 0,
		y: 40,
		stagger: 0.08,
		duration: 0.6,
		ease: 'power2.out',
		scrollTrigger: { trigger: '.services__links', start: 'top 85%' }
	});

	/* ---------- Showcase: imagem com zoom-out ---------- */
	gsap.from('.studio__image img', {
		scale: 1.15,
		opacity: 0,
		duration: 1.1,
		ease: 'power2.out',
		scrollTrigger: { trigger: '.studio__image', start: 'top 85%' }
	});

	/* ---------- Sobre mim: reveals ---------- */
	document.querySelectorAll('.sobre-reveal').forEach(function (el) {
		gsap.from(el, {
			opacity: 0,
			y: 40,
			duration: 0.8,
			ease: 'power2.out',
			scrollTrigger: { trigger: el, start: 'top 85%' }
		});
	});

	gsap.from('.sobre-card', {
		opacity: 0,
		y: 50,
		duration: 0.7,
		stagger: 0.15,
		ease: 'power2.out',
		scrollTrigger: { trigger: '.sobre-timeline', start: 'top 85%' }
	});

	gsap.from('.clientes__item', {
		opacity: 0,
		y: 30,
		duration: 0.6,
		stagger: 0.1,
		ease: 'power2.out',
		scrollTrigger: { trigger: '.clientes__grid', start: 'top 90%' }
	});

	/* ---------- Tilt 3D (cards e foto) ---------- */
	function addTilt(el, maxDeg) {
		el.addEventListener('mousemove', function (e) {
			var r = el.getBoundingClientRect();
			var px = (e.clientX - r.left) / r.width - 0.5;
			var py = (e.clientY - r.top) / r.height - 0.5;
			gsap.to(el, {
				rotateY: px * maxDeg * 2,
				rotateX: -py * maxDeg * 2,
				transformPerspective: 700,
				duration: 0.4,
				ease: 'power2.out'
			});
		});
		el.addEventListener('mouseleave', function () {
			gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power2.out' });
		});
	}

	if (finePointer) {
		document.querySelectorAll('.sobre-card').forEach(function (el) { addTilt(el, 6); });
		document.querySelectorAll('.sobre-photo img').forEach(function (el) { addTilt(el, 5); });
		document.querySelectorAll('.link__item').forEach(function (el) { addTilt(el, 2); });
	}

	/* Recalcula os gatilhos depois que imagens carregam (evita reveals travados no mobile) */
	window.addEventListener('load', function () {
		ScrollTrigger.refresh();
	});
})();
