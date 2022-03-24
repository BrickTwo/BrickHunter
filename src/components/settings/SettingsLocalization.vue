<template>
  <n-form-item
    :label="$t('settings.localization.languageBrickHunter')"
    path="languageValue"
  >
    <n-select v-model:value="languageValue" :options="languageOptions" />
  </n-form-item>
  <n-form-item
    :label="$t('settings.localization.legoCountry')"
    path="languageValue"
  >
    <n-select
      v-model:value="countryValue"
      :options="countryOptions"
      :render-label="renderCountryFlag"
    />
  </n-form-item>
  <n-form-item
    :label="$t('settings.localization.legoLanguage')"
    path="languageValue"
  >
    <n-select
      v-model:value="legoLanguageValue"
      :options="legoLanguageOptions"
    />
  </n-form-item>
</template>

<script lang="ts">
import { defineComponent, ref, watch, h, onMounted } from "vue";
import i18n from "@/i18n";
import { LocalizationSettingsLegoOptions } from "@/service/lists/localizationSettingsLegoOptions";
import { ICountry } from "@/types/types";
import { settingsStore } from "@/store/settings-store";

export default defineComponent({
  name: "SettingsLocalization",
  setup() {
    const languageValue = ref(settingsStore.getState().uiLanguage || "en");
    const countryValue = ref(settingsStore.getState().country || "us");

    const languageOptions = [
      {
        label: "English",
        value: "en",
      },
      {
        label: "Deutsch",
        value: "de",
      },
    ];

    const countryOptions = ref(
      new LocalizationSettingsLegoOptions().getCountries()
    );

    const getMainLanguage = (): string => {
      const returnValue = countryOptions.value.find(
        (c) => c.value == countryValue.value
      )?.languages[0]?.value;
      return returnValue ? returnValue : "en";
    };

    const legoLanguageValue = ref(
      settingsStore.getState().language || getMainLanguage()
    );
    const legoLanguageOptions = ref(
      countryOptions.value.find((c) => c.value == countryValue.value)?.languages
    );

    const renderCountryFlag = (option: ICountry) => {
      return h("span", {}, [
        h("img", {
          src: `./flags/${option.value}.png`,
          width: "20",
        }),
        h("span", {
          innerHTML: option.label,
        }),
      ]);
    };

    onMounted(() => {
      settingsStore.SetCountry(countryValue.value);
      settingsStore.SetLanguaga(legoLanguageValue.value);
    });

    watch(
      () => settingsStore.getState(),
      () => {
        languageValue.value = settingsStore.getState().uiLanguage;
        countryValue.value = settingsStore.getState().country;
        legoLanguageValue.value =
          settingsStore.getState().language || getMainLanguage();
      },
      { deep: true }
    );

    watch(
      () => languageValue.value,
      () => {
        settingsStore.SetUiLanguager(languageValue.value);
        i18n.global.locale.value = languageValue.value;
        countryOptions.value =
          new LocalizationSettingsLegoOptions().getCountries();
        legoLanguageOptions.value = countryOptions.value.find(
          (c) => c.value == countryValue.value
        )?.languages;
        legoLanguageValue.value = getMainLanguage();
      }
    );

    watch(
      () => countryValue.value,
      () => {
        settingsStore.SetCountry(countryValue.value);
        legoLanguageOptions.value = countryOptions.value.find(
          (c) => c.value == countryValue.value
        )?.languages;

        legoLanguageValue.value = getMainLanguage();
      }
    );

    watch(
      () => legoLanguageValue.value,
      () => {
        settingsStore.SetLanguaga(legoLanguageValue.value);
      }
    );

    return {
      languageValue,
      countryValue,
      legoLanguageValue,
      languageOptions,
      countryOptions,
      legoLanguageOptions,
      renderCountryFlag,
    };
  },
});
</script>
