export const affiliateMixin = {
    data: function() {
        return {
            partner: [
                {
                    partner: "BrickHunter",
                    order: 1,
                    countries: [
                        {
                            country: "at",
                            linkType: "webgains",
                            wgcampaignid: 1491765,
                            wgprogramid: 268005,
                            clickref: "BrickHunter"
                        },
                        {
                            country: "be",
                            linkType: "webgains",
                            wgcampaignid: 1491765,
                            wgprogramid: 274945,
                            clickref: "BrickHunter"
                        },
                        {
                            country: "ch",
                            linkType: "webgains",
                            wgcampaignid: 1491765,
                            wgprogramid: 268015,
                            clickref: "BrickHunter"
                        },
                        {
                            country: "de",
                            linkType: "webgains",
                            wgcampaignid: 1491765,
                            wgprogramid: 267995,
                            clickref: "BrickHunter"
                        },
                        {
                            country: "dk",
                            linkType: "webgains",
                            wgcampaignid: 1491765,
                            wgprogramid: 274925,
                            clickref: "BrickHunter"
                        },
                        {
                            country: "es",
                            linkType: "webgains",
                            wgcampaignid: 1491765,
                            wgprogramid: 274875,
                            clickref: "BrickHunter"
                        },
                        {
                            country: "fi",
                            linkType: "webgains",
                            wgcampaignid: 1491765,
                            wgprogramid: 274915,
                            clickref: "BrickHunter"
                        },
                        {
                            country: "fr",
                            linkType: "webgains",
                            wgcampaignid: 1491765,
                            wgprogramid: 268085,
                            clickref: "BrickHunter"
                        },
                        {
                            country: "it",
                            linkType: "webgains",
                            wgcampaignid: 1491765,
                            wgprogramid: 274895,
                            clickref: "BrickHunter"
                        },
                        {
                            country: "nl",
                            linkType: "webgains",
                            wgcampaignid: 1491765,
                            wgprogramid: 270975,
                            clickref: "BrickHunter"
                        },
                        {
                            country: "no",
                            linkType: "webgains",
                            wgcampaignid: 1491765,
                            wgprogramid: 274935,
                            clickref: "BrickHunter"
                        },
                        {
                            country: "se",
                            linkType: "webgains",
                            wgcampaignid: 1491765,
                            wgprogramid: 274905,
                            clickref: "BrickHunter"
                        },
                    ]
                },
                /*{
                    partner: "StoneWars",
                    order: 2,
                    countries: [
                        {
                            country: "de",
                            linkType: "webgains",
                            wgcampaignid: 99999,
                            wgprogramid: 88888,
                            clickref: "BrickHunter"
                        },
                    ]
                }*/
            ],
        };
    },
    methods: {
        getPartnerForCountry(country) {
            var partners = this.partner.filter(p => p.countries.filter(c => c.country == country).length > 0);

            partners.map(p => {
                p.countries = p.countries.filter(c => c.country == country);
            });

            return partners.sort(function(a, b) {
                return a.order - b.order;
            });
        }
    }
};
