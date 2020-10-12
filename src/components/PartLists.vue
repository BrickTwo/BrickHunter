<template>
    <div>
        <b-list-group>
            <b-list-group-item href="#" @click="selectPartList('')" style="display: inline"
                >
                <span style="display: inline-block; margin-right: 20px"><b-form-checkbox
      id="checkbox-1"
      name="checkbox-1"
      value="accepted"
      unchecked-value="not_accepted"
    ><b-icon icon="cart4" aria-hidden="true"></b-icon
                ></b-form-checkbox></span><span>WantedList</span><span style="float: right"><b-icon icon="trash" aria-hidden="true"></b-icon
                ></b-form-checkbox></span><span style="float: right; margin-right: 20px">12.10.2020 13:34</span><span style="float: right; margin-right: 20px;">Positions: 56</span></b-list-group-item
            >
            <b-list-group-item href="#" @click="selectPartList('')" variant="warning"
                ><span style="display: inline-block; margin-right: 20px"><b-form-checkbox
      id="checkbox-1"
      name="checkbox-1"
      value="accepted"
      unchecked-value="not_accepted"
    ><b-icon icon="cart4" aria-hidden="true"></b-icon
                ></b-form-checkbox></span><span>Zweite WantedList</span><span style="float: right"><b-icon icon="trash" aria-hidden="true"></b-icon
                ></b-form-checkbox></span><span style="float: right; margin-right: 20px; color:">11.10.2020 13:34</span><span style="float: right; margin-right: 20px;">Positions: 12</span></b-list-group-item
            >
            <b-list-group-item href="#" @click="selectPartList('')" variant="danger"
                ><span style="display: inline-block; margin-right: 20px"><b-form-checkbox
      id="checkbox-1"
      name="checkbox-1"
      value="accepted"
      unchecked-value="not_accepted"
    ><b-icon icon="cart4" aria-hidden="true"></b-icon
                ></b-form-checkbox></span><span>Nebulon GWP</span><span style="float: right"><b-icon icon="trash" aria-hidden="true"></b-icon
                ></b-form-checkbox></span><span style="float: right; margin-right: 20px;">09.10.2020 13:34</span><span style="float: right; margin-right: 20px;">Positions: 115</span></b-list-group-item
            >
        </b-list-group>
    </div>
</template>

<script>
export default {
    data: () => ({}),
    methods: {
        selectPartList(partList) {
            this.$emit('changePage', 'wantedList');
        },
    },
};
</script>
