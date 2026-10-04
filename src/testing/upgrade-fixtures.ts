import { BrowsePartsPart } from '../app/models/browse-parts';
import { Color } from '../app/models/shared';
import { PartsList } from '../app/models/parts-list';

// Fixed, synthetic data; no account, API or extension profile is required.
export const referenceColors: Color[] = [
  { id: 4, name: 'Red', rgb: 'C91A09', isTrans: false, categories: ['red'],
    externalIds: { lego: { extIds: [21], extDescrs: ['Bright red'] }, brickLink: { extIds: [5], extDescrs: ['Red'] } } },
  { id: 1, name: 'Blue', rgb: '0055BF', isTrans: false, categories: ['blue'],
    externalIds: { lego: { extIds: [23], extDescrs: ['Bright blue'] }, brickLink: { extIds: [7], extDescrs: ['Blue'] } } },
];

export function referencePart(elementId = 300121): BrowsePartsPart {
  return {
    country: 'de', elementId, colorId: 4, description: 'BRICK 2X4 – Referenz', designId: 3001,
    imageUrl: '/assets/icons/icon128.png', color: structuredClone(referenceColors[0]),
    createDateBrick: '2024-01-01T12:00:00', updateDateBrick: '2024-01-01T12:00:00',
    firstAvailabilityDate: '2024-01-01T12:00:00', lastAvailabilityDate: '2024-01-01T12:00:00',
    lastUpdateCountry: '2024-01-01T12:00:00', priceAmount: 0.25, priceCurrency: 'EUR',
    isAvailable: true, maxOrderQuantity: 100, categoryId: 1, deliveryChannel: 'pab', hasPrint: false,
  };
}

export function referenceLists(): PartsList[] {
  return [
    { uuid: 'upgrade-reference', name: 'Upgrade-Referenz', source: 'Mixed', parts: [] },
    { uuid: 'upgrade-empty', name: 'Leere Liste', source: 'Mixed', parts: [] },
  ];
}

export function referenceSearch(count = 2) {
  return {
    bricks: Array.from({ length: count }, (_, index) => referencePart(300121 + index)),
    categories: [{ id: 1, name: 'Bricks', quantity: count }],
    colors: count ? [4, 1] : [],
    countries: [{ countryCode: 'de', lastUpdate: new Date('2024-01-01T12:00:00Z') }],
    page: { total: count, page: 1, limit: count || 25 },
  };
}
