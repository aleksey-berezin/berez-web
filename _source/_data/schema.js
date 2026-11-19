// Structured data (JSON-LD) for search engines, built from the same
// data files the page uses so the two can never drift apart.
import faq from './faq.json' with { type: 'json' };
import site from './site.json' with { type: 'json' };

const id = (name) => `${site.url}/#${name}`;

const organization = {
	'@type': 'Organization',
	'@id': id('organization'),
	name: site.name,
	alternateName: 'Berez',
	url: `${site.url}/`,
	logo: `${site.url}/apple-touch-icon.png`,
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
	'@type': 'WebSite',
	'@id': id('website'),
	name: site.name,
	url: `${site.url}/`,
	description: site.description,
	inLanguage: 'en-US',
	publisher: { '@id': id('organization') },
};

// The home page itself. FAQPage is a kind of WebPage.
const page = {
	'@type': 'FAQPage',
	'@id': id('page'),
	url: `${site.url}/`,
	name: site.name,
	inLanguage: 'en-US',
	dateModified: site.updated,
	isPartOf: { '@id': id('website') },
	about: { '@id': id('organization') },
	mainEntity: faq.map(({ question, answer, detail }) => ({
		'@type': 'Question',
		name: question,
		acceptedAnswer: {
			'@type': 'Answer',
			text: [answer, ...detail].join(' '),
		},
	})),
};

export default {
	'@context': 'https://schema.org',
	'@graph': [organization, website, page],
};
