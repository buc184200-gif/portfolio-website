const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

const faqCSS = `
		/* ── FAQ Section ── */
		.faq-section {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 100px 40px;
			max-width: 900px;
			margin: 0 auto;
			width: 100%;
			z-index: 2;
			position: relative;
		}
		
		.faq-section h2 {
			font-family: 'Playfair Display', serif;
			font-size: clamp(32px, 5vw, 48px);
			font-weight: 400;
			margin-bottom: 50px;
			text-align: center;
			color: #fff;
			opacity: 0;
			transform: translateY(30px);
		}
		
		.faq-section h2 em {
			font-style: italic;
			color: #c4a882;
		}

		.faq-list {
			width: 100%;
			display: flex;
			flex-direction: column;
			gap: 16px;
		}

		.faq-item {
			background: rgba(15, 15, 15, 0.6);
			border: 1px solid rgba(196, 168, 130, 0.15);
			border-radius: 12px;
			overflow: hidden;
			transition: all 0.4s ease;
			opacity: 0;
			transform: translateY(30px);
			backdrop-filter: blur(10px);
		}
		
		.faq-item:hover {
			border-color: rgba(196, 168, 130, 0.4);
			background: rgba(20, 20, 20, 0.8);
			transform: translateY(-2px);
		}
		
		.faq-question {
			padding: 24px 30px;
			cursor: pointer;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 17px;
			font-weight: 400;
			color: #fff;
			user-select: none;
			transition: color 0.3s ease;
		}
		
		.faq-question:hover {
			color: #c4a882;
		}

		.faq-icon {
			width: 24px;
			height: 24px;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
			flex-shrink: 0;
			margin-left: 15px;
		}
		
		.faq-icon::before, .faq-icon::after {
			content: '';
			position: absolute;
			background: #c4a882;
			transition: all 0.3s ease;
		}
		
		.faq-icon::before {
			width: 14px;
			height: 2px;
		}
		
		.faq-icon::after {
			width: 2px;
			height: 14px;
		}

		.faq-item.active .faq-icon {
			transform: rotate(180deg);
		}
		
		.faq-item.active .faq-icon::after {
			opacity: 0;
			transform: rotate(90deg) scale(0);
		}

		.faq-answer {
			max-height: 0;
			overflow: hidden;
			transition: max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), padding 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease;
			padding: 0 30px;
			color: rgba(255, 255, 255, 0.6);
			font-size: 15px;
			line-height: 1.6;
			opacity: 0;
		}
		
		.faq-item.active .faq-answer {
			padding: 0 30px 24px 30px;
			max-height: 300px;
			opacity: 1;
		}

		@media (max-width: 768px) {
			.faq-section {
				padding: 80px 20px;
			}
			.faq-question {
				font-size: 15px;
				padding: 20px;
			}
			.faq-answer {
				padding: 0 20px;
			}
			.faq-item.active .faq-answer {
				padding: 0 20px 20px 20px;
			}
		}
`;

if (!html.includes('.faq-section {')) {
    html = html.replace('</style>', faqCSS + '\n</style>');
}

const faqHtml = `
		<section class="section faq-section" id="faq" data-stage="4.5">
			<h2 data-reveal>Frequently Asked <em>Questions</em></h2>
			<div class="faq-list">
				<div class="faq-item" data-reveal data-delay="1">
					<div class="faq-question">
						What is included in the website packages?
						<div class="faq-icon"></div>
					</div>
					<div class="faq-answer">
						Our packages include a fully responsive design, SEO optimization, performance tuning, and a dedicated support period. The Growth and Elite packages offer advanced custom designs, animations, and additional integrations based on your specific needs.
					</div>
				</div>
				<div class="faq-item" data-reveal data-delay="2">
					<div class="faq-question">
						How long does it take to build a website?
						<div class="faq-icon"></div>
					</div>
					<div class="faq-answer">
						Typically, a Starter website takes about 1-2 weeks. Growth websites usually take 3-4 weeks, and Elite or fully custom web applications can take 6 weeks or more depending on complexity. We will provide a specific timeline once we understand your exact requirements.
					</div>
				</div>
				<div class="faq-item" data-reveal data-delay="3">
					<div class="faq-question">
						Do you provide maintenance and support after launch?
						<div class="faq-icon"></div>
					</div>
					<div class="faq-answer">
						Yes! Every package comes with a built-in support period (14 to 90 days depending on the tier). After that, we offer extended support and maintenance contracts to ensure your website stays up-to-date, secure, and running smoothly.
					</div>
				</div>
				<div class="faq-item" data-reveal data-delay="4">
					<div class="faq-question">
						Can I update the website content myself?
						<div class="faq-icon"></div>
					</div>
					<div class="faq-answer">
						Absolutely. For the Growth and Elite packages, we can integrate an easy-to-use Content Management System (CMS) that allows you to edit text, update images, and manage blog posts without any coding knowledge.
					</div>
				</div>
				<div class="faq-item" data-reveal data-delay="5">
					<div class="faq-question">
						Do you offer custom pricing if I don't fit into a package?
						<div class="faq-icon"></div>
					</div>
					<div class="faq-answer">
						Yes, we have a custom website builder on our "See More" page where you can select specific features, add-ons, and design levels to get a tailored estimate before reaching out.
					</div>
				</div>
			</div>
		</section>
`;

if (!html.includes('faq-section')) {
    html = html.replace('<section class="section cta-section" data-stage="5">', faqHtml + '\n\t\t<section class="section cta-section" data-stage="5">');
}

fs.writeFileSync('index.html', html, 'utf-8');
console.log('Added FAQ HTML and CSS');
