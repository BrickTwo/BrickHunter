<template>
    <div>
        <b-dropdown right>
            <template v-slot:button-content>
                BrickHunter
            </template>
            <b-dropdown-item
                href="#"
                v-for="affiliate in affiliates"
                :key="affiliate.key"
                :value="affiliate.key"
            >
                {{ affiliate.value }}
            </b-dropdown-item>
        </b-dropdown>
    </div>
</template>

<script>
export default {
    props: {
        noAffiliate: {
            type: Boolean,
        },
    },
    data() {
        return {
            affiliates: [
                { key: 'brickhunter', value: 'BrickHunter' },
                { key: 'stonewars', value: 'StoneWars' },
                { key: 'doctorbrick', value: 'Doctor Brick' },
            ],
        };
    },
    beforeMount() {
        if(this.noAffiliate)
        this.affiliates.push({ key: 'no', value: 'Ohne Affiliate' })
    }
};
</script>
