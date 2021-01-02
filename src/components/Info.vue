<template>
    <div>
        <h1>{{ donateTitle }}</h1>
        <p>{{ donateText }}</p>
        <img
            alt=""
            border="0"
            src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
            @click="donate()"
            style="cursor: pointer"
        />
        <h1>{{ disclaimerTitle }}</h1>
        <p>{{ disclaimerText1 }}</p>
        <p>{{ disclaimerText2 }}</p>
        <h1>{{ licenseTitle }}</h1>
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
        <h1>{{ affiliateTitle }}</h1>
        <p>{{ affiliateText }}</p>
        <h1>BrickHunter Version</h1>
        <p>{{ $store.state.version.current }}</p>
    </div>
</template>

<script>
export default {
    methods: {
        link(value) {
            browser.tabs.create({ url: value });
        },
        donate() {
            browser.runtime.sendMessage({
                contentScriptQuery: 'donate',
            });
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
        licenseTitle() {
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
        affiliateTitle() {
            return browser.i18n.getMessage('info_affiliateTitel');
        },
        affiliateText() {
            return browser.i18n.getMessage('info_affiliateText');
        },
        donateTitle() {
            return browser.i18n.getMessage('info_donateTitel');
        },
        donateText() {
            return browser.i18n.getMessage('info_donateText');
        },
    },
};
</script>
