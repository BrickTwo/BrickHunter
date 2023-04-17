import { Injectable } from '@angular/core';
import { Affiliate } from 'src/app/models/global';

@Injectable()
export class AffiliateService {
  partner: Affiliate[] = [
    {
      countryCode: 'at',
      linkType: 'webgains',
      wgcampaignid: 1491765,
      wgprogramid: 268005,
      clickref: 'BrickHunterAT',
    },
    {
      countryCode: 'be',
      linkType: 'webgains',
      wgcampaignid: 1491765,
      wgprogramid: 274945,
      clickref: 'BrickHunterBE',
    },
    {
      countryCode: 'ch',
      linkType: 'webgains',
      wgcampaignid: 1491765,
      wgprogramid: 268015,
      clickref: 'BrickHunterCH',
    },
    {
      countryCode: 'de',
      linkType: 'webgains',
      wgcampaignid: 1491765,
      wgprogramid: 267995,
      clickref: 'BrickHunterDE',
    },
    {
      countryCode: 'dk',
      linkType: 'webgains',
      wgcampaignid: 1491765,
      wgprogramid: 274925,
      clickref: 'BrickHunterDK',
    },
    {
      countryCode: 'es',
      linkType: 'webgains',
      wgcampaignid: 1491765,
      wgprogramid: 274875,
      clickref: 'BrickHunterES',
    },
    {
      countryCode: 'fi',
      linkType: 'webgains',
      wgcampaignid: 1491765,
      wgprogramid: 274915,
      clickref: 'BrickHunterFI',
    },
    {
      countryCode: 'fr',
      linkType: 'webgains',
      wgcampaignid: 1491765,
      wgprogramid: 268085,
      clickref: 'BrickHunterFR',
    },
    {
      countryCode: 'it',
      linkType: 'webgains',
      wgcampaignid: 1491765,
      wgprogramid: 274895,
      clickref: 'BrickHunterIT',
    },
    {
      countryCode: 'nl',
      linkType: 'webgains',
      wgcampaignid: 1491765,
      wgprogramid: 270975,
      clickref: 'BrickHunterNL',
    },
    {
      countryCode: 'no',
      linkType: 'webgains',
      wgcampaignid: 1491765,
      wgprogramid: 274935,
      clickref: 'BrickHunterNO',
    },
    {
      countryCode: 'se',
      linkType: 'webgains',
      wgcampaignid: 1491765,
      wgprogramid: 274905,
      clickref: 'BrickHunterSE',
    },
  ];

  getPartnerForCountry(countryCode: string) {
    return this.partner.find(p => p.countryCode === countryCode);
  }
}
