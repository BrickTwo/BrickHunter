import { reactive, readonly, watch, ref, Ref } from "vue";
import i18n from "@/i18n";

export interface LocalStorageObject {
  country: string;
  language: string;
  uiLanguage: string;
}

export abstract class LocalStorageStore {
  protected state: LocalStorageObject;
  public isInitialized = ref(false);

  constructor() {
    const data = this.data();
    // this.setup(data);
    this.state = reactive(data) as LocalStorageObject;
  }

  protected abstract data(): LocalStorageObject;

  // protected setup(data: T): void {}

  public getState(): LocalStorageObject {
    return readonly(this.state) as unknown as LocalStorageObject;
  }

  async init() {
    if (!this.isInitialized.value) {
      this.state.country = localStorage.getItem("country") || "";
      this.state.language = localStorage.getItem("language") || "";
      this.state.uiLanguage = localStorage.getItem("uiLanguage") || "en";
      i18n.global.locale.value = this.state.uiLanguage;
      localStorage.setItem("country", this.state.country);
      localStorage.setItem("language", this.state.language);
      localStorage.setItem("uiLanguage", this.state.uiLanguage);
      watch(
        () => this.state,
        () => {
          localStorage.setItem("country", this.state.country);
          localStorage.setItem("language", this.state.language);
          localStorage.setItem("uiLanguage", this.state.uiLanguage);
        },
        { deep: true }
      );

      this.isInitialized.value = true;
    }
  }

  getIsInitialized(): Ref<boolean> {
    return this.isInitialized;
  }
}

class SettingsStore extends LocalStorageStore {
  protected data(): LocalStorageObject {
    return {
      country: "",
      language: "",
      uiLanguage: "",
    };
  }

  SetUiLanguager(language: string) {
    this.state.uiLanguage = language;
  }

  SetCountry(country: string) {
    this.state.country = country;
  }

  SetLanguaga(language: string) {
    this.state.language = language;
  }
}

export const settingsStore: SettingsStore = new SettingsStore();
