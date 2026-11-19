// Structured data (JSON-LD) for search engines, built from the same
// data files the page uses so the two can never drift apart.
import faq from './faq.json' with { type: 'json' };
import site from './site.json' with { type: 'json' };

const organization = {
	'@context': 'https://schema.org',
	'@type': 'Organization',
	name: site.name,
	alternateName: 'Berez',
	url: site.url,
	logo: `${site.url}/logo.svg`,
	image: `${site.url}/og-image.png`,
	description: site.description,
	areaServed: ['Portland', 'Gresham', 'Troutdale', 'Fairview'].map((name) => ({
		'@type': 'City',
		name,
		containedInPlace: { '@type': 'State', name: 'Oregon' },
	})),
	knowsAbout: [
		'Multifamily Real Estate Investment',
		'Apartment Building Acquisitions',
		'Value-Add Real Estate Strategy',
		'Workforce Housing',
		'Asset Management',
		'Portland Metro Real Estate Market',
	],
};

const website = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	name: site.name,
	url: site.url,
	description: site.description,
	inLanguage: 'en-US',
	dateModified: site.updated,
};

const faqPage = {
	'@context': 'https://schema.org',
	'@type': 'FAQPage',
	mainEntity: faq.map(({ question, answer, detail }) => ({
		'@type': 'Question',
		name: question,
		acceptedAnswer: {
			'@type': 'Answer',
			text: [answer, ...detail].join(' '),
		},
	})),
};

export default [organization, website, faqPage];
