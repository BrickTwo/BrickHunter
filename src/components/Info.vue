<template>
    <div>
        <h1>{{ disclaimerTitle }}</h1>
        <p>{{ disclaimerText1 }}</p>
        <p>{{ disclaimerText2 }}</p>
        <h1>{{ licenseTitel }}</h1>
        <p>
            {{ licenseText1
            }}<a
                @click="
                    link(
                        'https://github.com/BrickTwo/BrickHunter/blob/master/LICENSE'
                    )
                "
                href=""
                >{{ licenseLink }}</a
            >{{ licenseText2 }}
        </p>
        <p>
            {{ sourceCodeText1
            }}<a
                @click="link('https://github.com/BrickTwo/BrickHunter')"
                href=""
                >{{ sourceCodeLink }}</a
            >{{ sourceCodeText2 }}
        </p>
    </div>
</template>

<script>
export default {
    methods: {
        link(value) {
            browser.tabs.create({ url: value });
        },
    },
    computed: {
        disclaimerTitle() {
            return browser.i18n.getMessage('info_disclaimerTitle');
        },
        disclaimerText1() {
            return browser.i18n.getMessage('info_disclaimerText1');
        },
        disclaimerText2() {
            return browser.i18n.getMessage('info_disclaimerText2');
        },
        licenseTitel() {
            return browser.i18n.getMessage('info_licenseTitel');
        },
        licenseText1() {
            return browser.i18n.getMessage('info_licenseText1');
        },
        licenseLink() {
            return browser.i18n.getMessage('info_licenseLink');
        },
        licenseText2() {
            return browser.i18n.getMessage('info_licenseText2');
        },
        sourceCodeText1() {
            return browser.i18n.getMessage('info_sourceCodeText1');
        },
        sourceCodeLink() {
            return browser.i18n.getMessage('info_sourceCodeLink');
        },
        sourceCodeText2() {
            return browser.i18n.getMessage('info_sourceCodeText2');
        },
    },
};
</script>
