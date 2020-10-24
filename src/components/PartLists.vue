<template>
    <div>
        <span style="float: right"
            >{{ $store.state.totalPositions }} / 2500 {{ positions }}</span
        >
        <b-list-group style="clear: both">
            <b-list-group-item
                v-for="partList in partLists"
                :key="partList.id"
                href="#"
                @click="selectPartList(partList.id)"
                style="display: inline"
                :variant="variant(partList.date)"
            >
                <span style="display: inline-block; margin-right: 20px"
                    ><div @click.stop>
                        <b-form-checkbox
                            :id="'cart-' + partList.id"
                            v-model="partList.cart"
                            name="checkbox-1"
                            @click="cart(partList.id, partList.cart)"
                            ><b-icon icon="cart4" aria-hidden="true"></b-icon
                        ></b-form-checkbox></div></span
                ><span
                    style="max-width:340px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: inline-block; vertical-align: bottom"
                    >{{ partList.name }}</span
                ><span style="float: right" @click.stop
                    ><b-icon
                        icon="trash"
                        aria-hidden="true"
                        @click="deleteList(partList.id)"
                    ></b-icon></span
                ><span style="float: right; margin-right: 20px">{{
                    partList.date | formatDate
                }}</span
                ><span style="float: right; margin-right: 20px;"
                    > <b-badge variant="primary" pill>{{ partList.positions.length }}</b-badge></span
                ></b-list-group-item
            >
        </b-list-group>
    </div>
</template>

<script>
export default {
    data: () => ({
        partLists: null,
        totalPositions: 0,
    }),
    methods: {
        selectPartList(id) {
            this.$router.push('/partLists/' + id).catch(() => {});
            //this.$emit('changePage', 'wantedList+' + id);
        },
        variant(date) {
            var d = Date.now() - new Date(date).getTime();
            if (d > 1000 * 60 * 60 * 48) {
                return 'danger';
            } else if (d > 1000 * 60 * 60 * 24) {
                return 'warning';
            }
        },
        cart(id, value) {
            console.log(this.partLists, id, value);
        },
        deleteList(id) {
            this.$store.commit('deletePartList', id);
            this.loadPartLists();
        },
        loadPartLists() {
            this.partLists = this.$store.state.partLists.sort((a, b) => {
                if (a.name.toUpperCase() > b.name.toUpperCase()) {
                    return 1;
                } else {
                    return -1;
                }
            });
        },
    },
    watch: {
        partLists: {
            handler(val, oldVal) {
                val.forEach((item) => {
                    this.$store.commit('setPartList', item);
                });
            },
            deep: true,
        },
    },
    beforeMount() {
        this.loadPartLists();
        this.totalPositions = this.$store.state.totalPositions;
    },
    computed: {
        positions() {
            return browser.i18n.getMessage('partList_Positions');
        },
    },
};
</script>
