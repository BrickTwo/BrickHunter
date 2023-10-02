import { Injectable } from '@angular/core';
import { Affiliate } from 'src/app/models/global';

@Injectable()
export class AffiliateService {
  partner: Affiliate[] = [
    {
      countryCode: 'at',
      linkType: 'rakuten',
      id: '3LKazBDVhJw',
      mid: 50641,
      clickref: 'BrickHunterAT',
    },
    {
      countryCode: 'au',
      linkType: 'rakuten',
      id: '3LKazBDVhJw',
      mid: 50641,
      clickref: 'BrickHunterAU',
    },
    {
      countryCode: 'be',
      linkType: 'rakuten',
      id: '3LKazBDVhJw',
      mid: 50641,
      clickref: 'BrickHunterBE',
    },
    {
      countryCode: 'ca',
      linkType: 'rakuten',
      id: '3LKazBDVhJw',
      mid: 50641,
      clickref: 'BrickHunterCA',
    },
    {
      countryCode: 'ch',
      linkType: 'rakuten',
      id: '3LKazBDVhJw',
      mid: 50641,
      clickref: 'BrickHunterCH',
    },
    {
      countryCode: 'cz',
      linkType: 'rakuten',
      id: '3LKazBDVhJw',
      mid: 50641,
      clickref: 'BrickHunterCZ',
    },
    {
      countryCode: 'de',
      linkType: 'rakuten',
      id: '3LKazBDVhJw',
      mid: 50641,
      clickref: 'BrickHunterDE',
    },
    {
      countryCode: 'dk',
      linkType: 'rakuten',
      id: '3LKazBDVhJw',
      mid: 50641,
      clickref: 'BrickHunterDK',
    },
    {
      countryCode: 'es',
      linkType: 'rakuten',
      id: '3LKazBDVhJw',
      mid: 50641,
      clickref: 'BrickHunterES',
    },
    {
      countryCode: 'fi',
      linkType: 'rakuten',
      id: '3LKazBDVhJw',
      mid: 50641,
      clickref: 'BrickHunterFI',
    },
    {
      countryCode: 'fr',
      linkType: 'rakuten',
      id: '3LKazBDVhJw',
      mid: 50641,
      clickref: 'BrickHunterFR',
    },
    {
      countryCode: 'hu',
      linkType: 'rakuten',
      id: '3LKazBDVhJw',
      mid: 50641,
      clickref: 'BrickHunterHU',
    },
    {
      countryCode: 'it',
      linkType: 'rakuten',
      id: '3LKazBDVhJw',
      mid: 50641,
      clickref: 'BrickHunterIT',
    },
    {
      countryCode: 'nl',
      linkType: 'rakuten',
      id: '3LKazBDVhJw',
      mid: 50641,
      clickref: 'BrickHunterNL',
    },
    {
      countryCode: 'no',
      linkType: 'rakuten',
      id: '3LKazBDVhJw',
      mid: 50641,
      clickref: 'BrickHunterNO',
    },
    {
      countryCode: 'pl',
      linkType: 'rakuten',
      id: '3LKazBDVhJw',
      mid: 50641,
      clickref: 'BrickHunterPL',
    },
    {
      countryCode: 'se',
      linkType: 'rakuten',
      id: '3LKazBDVhJw',
      mid: 50641,
      clickref: 'BrickHunterSE',
    },
  ];

  getPartnerForCountry(countryCode: string) {
    return this.partner.find(p => p.countryCode === countryCode);
  }
}
