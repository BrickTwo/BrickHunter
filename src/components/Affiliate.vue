<template>
    <div>
        <b-dropdown right variant="primary">
            <template v-slot:button-content>
                {{ getAffiliateValue(selectedAffiliate) }}
            </template>
            <b-dropdown-item
                href="#"
                v-for="option in options"
                :key="option.key"
                :value="option.key"
                @click="selectAffiliate(option.key)"
            >
                {{ option.value }}
            </b-dropdown-item>
        </b-dropdown>
    </div>
</template>

<script>
import { affiliateMixin } from '@/mixins/affiliateMixin';

export default {
    props: {
        noAffiliate: {
            type: Boolean,
        },
    },
    data() {
        return {
            selectedAffiliate: null,
            options: [],
        };
    },
    mixins: [affiliateMixin],
    methods: {
        selectAffiliate(key, partner) {
            this.selectedAffiliate = key;
            var find = this.options.find((o) => o.key == key);
            this.$store.commit('setAffiliate', find.partner);
        },
        getAffiliateValue(key) {
            if (!key) return;
            var find = this.options.find((o) => o.key == key);
            return find?.value;
        },
    },
    beforeMount() {
        var partners = this.getPartnerForCountry(this.$store.state.country); 
        
        if(partners){
            partners.map(p => {
                this.options.unshift( { key: p.partner, value: "Affiliate: " + p.partner, partner: p.countries[0] });
            });
        }

        if (this.noAffiliate)
            this.options.push({ key: 'no', value: this.labelNoAffiliate, partner: null });

        this.selectedAffiliate = this.options[0].key;
        this.$store.commit('setAffiliate', this.options[0].partner);
    },
    computed: {
        labelNoAffiliate() {
            return browser.i18n.getMessage('affiliate_noAffiliate');
        },
    }
};
</script>
