import { definePreset } from '@primeuix/themes';
import Material from '@primeuix/themes/material';
import type { ExtendedCSS } from '@primeuix/themes/types';
type PresetStyleOptions = Parameters<Exclude<ExtendedCSS, string | undefined>>[0];

const presetCss = (css: ExtendedCSS, options: PresetStyleOptions): string =>
  typeof css === 'function' ? css(options) : css ?? '';

// The legacy Material theme uses the same state opacities for these button colors.
const buttonColors = { primary: '10, 52, 99', danger: '211, 47, 47', success: '104, 159, 56' };
const buttonVariants = Object.fromEntries(Object.entries(buttonColors).map(([severity, rgb]) => [severity, {
  color: `rgb(${rgb})`, borderColor: `rgb(${rgb})`,
  hoverBackground: `rgba(${rgb}, 0.04)`, activeBackground: `rgba(${rgb}, 0.16)`,
}]));
const switchHandleShadow = '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)';

// Measured Angular-17 reference values. Component geometry is verified separately.
export const BrickHunterPreset = definePreset(Material, {
  primitive: { borderRadius: { xs: '2px', sm: '4px', md: '4px', lg: '4px', xl: '4px' } },
  semantic: {
    focusRing: { width: '0', shadow: 'none' },
    disabledOpacity: '0.38',
    formField: { paddingX: '1rem', paddingY: '1rem', borderRadius: '4px' },
    colorScheme: {
      light: {
        primary: {
          color: '#0a3463',
          contrastColor: '#ffffff',
          hoverColor: 'rgba(10, 52, 99, 0.92)',
          activeColor: 'rgba(10, 52, 99, 0.68)',
        },
        highlight: { background: 'rgba(10, 52, 99, 0.12)', color: '#0a3463' },
        text: { color: 'rgba(0, 0, 0, 0.87)', mutedColor: 'rgba(0, 0, 0, 0.6)' },
        content: {
          background: '#ffffff',
          hoverBackground: '#f5f5f5',
          borderColor: 'rgba(0, 0, 0, 0.12)',
          color: 'rgba(0, 0, 0, 0.87)',
        },
        formField: {
          background: '#ffffff',
          color: 'rgba(0, 0, 0, 0.87)',
          borderColor: 'rgba(0, 0, 0, 0.38)',
          hoverBorderColor: 'rgba(0, 0, 0, 0.87)',
          focusBorderColor: '#0a3463',
        },
      },
    },
  },
  components: {
    progressspinner: { colorScheme: { light: { root: {
      colorOne: '#d62d20', colorTwo: '#0057e7', colorThree: '#008744', colorFour: '#ffa700',
    } } } },
    radiobutton: {
      root: { borderColor: '#757575', hoverBorderColor: '#757575', focusBorderColor: '#757575' },
      css: `
        .p-radiobutton { border-radius: 50%; transition: box-shadow 0.2s; }
        .p-radiobutton-box { border-width: 2px; }
        .p-radiobutton:not(.p-disabled):has(.p-radiobutton-input:hover) { box-shadow: 0 0 1px 10px rgba(0, 0, 0, 0.04); }
        .p-radiobutton:not(.p-disabled):has(.p-radiobutton-input:focus) { box-shadow: 0 0 1px 10px rgba(0, 0, 0, 0.12); }
        .p-radiobutton.p-radiobutton-checked:not(.p-disabled):has(.p-radiobutton-input:hover) { box-shadow: 0 0 1px 10px rgba(10, 52, 99, 0.04); }
        .p-radiobutton.p-radiobutton-checked:not(.p-disabled):has(.p-radiobutton-input:focus) { box-shadow: 0 0 1px 10px rgba(10, 52, 99, 0.12); }
        .p-radiobutton.p-disabled { opacity: 0.38; }
      `,
    },
    inputnumber: {
      button: { width: '3rem' },
      colorScheme: { light: { button: { background: '#0a3463', hoverBackground: 'rgba(10, 52, 99, 0.92)',
        activeBackground: 'rgba(10, 52, 99, 0.68)', color: '#ffffff', hoverColor: '#ffffff', activeColor: '#ffffff' } } },
      css: `
        .p-inputnumber-stacked .p-inputnumber-button-group { position: static; height: auto; z-index: auto; }
        .p-inputnumber-stacked .p-inputnumber-button { min-height: 19px; }
        .p-inputnumber-stacked .p-inputnumber-input { border-top-right-radius: 0; border-bottom-right-radius: 0; }
        .p-inputnumber-stacked .p-inputnumber-increment-button { border-top-right-radius: 4px; }
        .p-inputnumber-stacked .p-inputnumber-decrement-button { border-bottom-right-radius: 4px; }
        .p-inputnumber-button svg { width: 0.875rem; height: 0.875rem; }
        .p-inputnumber-button { font: inherit; vertical-align: bottom; }
      `,
    },
    select: {
      root: { disabledBackground: '#ffffff', disabledColor: 'rgba(0, 0, 0, 0.87)', focusRing: { width: '0', shadow: 'none' } },
      dropdown: { width: '2.357rem', color: 'rgba(0, 0, 0, 0.6)' },
      overlay: {
        borderColor: 'transparent',
        shadow: '0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12)',
      },
      list: { padding: '0', gap: '0' },
      option: {
        padding: '1rem',
        borderRadius: '0',
        color: 'rgba(0, 0, 0, 0.87)',
        focusColor: 'rgba(0, 0, 0, 0.87)',
        focusBackground: 'rgba(0, 0, 0, 0.04)',
        selectedColor: '#0a3463',
        selectedFocusColor: '#0a3463',
        selectedBackground: 'rgba(10, 52, 99, 0.12)',
        selectedFocusBackground: 'rgba(10, 52, 99, 0.12)',
      },
      css: options => `${presetCss(Material.components.select.css, options)}
        .p-select-overlay { border: 0; }
        .p-select.p-disabled { opacity: 0.38; }
        .p-select-dropdown svg { width: 0.875rem; height: 0.875rem; }
      `,
    },
    toast: {
      root: { width: '25rem', borderRadius: '4px', borderWidth: '0' },
      content: { padding: '1.5rem', gap: '0' },
      text: { gap: '0.5rem' },
      summary: { fontWeight: '700', fontSize: '1rem' },
      detail: { fontWeight: '400', fontSize: '1rem' },
      icon: { size: '2rem' },
      closeButton: { width: '2rem', height: '2rem' },
      closeIcon: { size: '0.875rem' },
      colorScheme: {
        light: {
          info: { background: '#b3e5fc', color: '#01579b', detailColor: '#01579b' },
          success: { background: '#c8e6c9', color: '#1b5e20', detailColor: '#1b5e20' },
          warn: { background: '#ffecb3', color: '#7f6003', detailColor: '#7f6003' },
          error: { background: '#ffcdd2', color: '#b71c1c', detailColor: '#b71c1c' },
        },
      },
      css: `
        .p-toast { opacity: 0.9; }
        .p-toast-message { backdrop-filter: none; box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12); }
        .p-toast-message-text { margin-left: 1rem; }
        .p-toast-message-icon { width: 0.875rem; height: auto; }
        .p-toast-message-icon svg { width: 0.875rem; height: 0.875rem; }
        .p-toast .p-toast-close-button { min-width: 0; width: 2rem; height: 2rem; margin: 0; right: 0; padding: 0; color: inherit; justify-content: center; }
        /* Toast 18 used a text Button; retain its primary-color hover on the native close button in 19. */
        .p-toast .p-toast-message .p-toast-close-button:hover { background: rgba(10, 52, 99, 0.04); color: #0a3463; }
      `,
    },
    button: {
      root: {
        paddingX: '1rem',
        paddingY: '0.714rem',
        borderRadius: '4px',
        gap: '0',
        label: { fontWeight: '500' },
        focusRing: { width: '0' },
        sm: { fontSize: '0.875rem', paddingX: '0.875rem', paddingY: '0.62475rem' },
        lg: { fontSize: '1.25rem', paddingX: '1.25rem', paddingY: '0.8925rem' },
      },
      colorScheme: {
        light: {
          root: Object.fromEntries(Object.entries(buttonColors).map(([severity, rgb]) => [severity, {
            background: `rgb(${rgb})`, hoverBackground: `rgba(${rgb}, 0.92)`, activeBackground: `rgba(${rgb}, 0.68)`,
            borderColor: `rgb(${rgb})`, hoverBorderColor: 'transparent', activeBorderColor: 'transparent',
            color: '#ffffff', hoverColor: '#ffffff', activeColor: '#ffffff',
          }])),
          outlined: buttonVariants,
          text: buttonVariants,
        },
      },
      css: options => `${presetCss(Material.components.button.css, options)}
        /* PrimeNG 17 aligned inline buttons to the line bottom, including table cells. */
        .p-button { border: 0; min-width: 4rem; vertical-align: bottom; justify-content: normal; }
        .p-button.p-button:not(:disabled):hover, .p-button.p-button:not(:disabled):active { border: 0; }
        .p-button-label { flex: 1 1 auto; }
        .p-button .p-button-icon-left { margin-right: 0.5rem; }
        .p-button .p-button-icon-right { margin-left: 0.5rem; }
        .p-button .p-button-icon-top { margin-bottom: 0.5rem; }
        .p-button .p-button-icon-bottom { margin-top: 0.5rem; }
        .p-button.p-button-icon-only .p-button-icon { margin: 0; }
        .p-button-icon-only { min-width: auto; padding: 0.714rem; justify-content: center; }
        .p-button-outlined { box-shadow: inset 0 0 0 1px; }
        ${Object.entries(buttonColors).map(([severity, rgb]) => {
          const selector = severity === 'primary' ? '.p-button' : `.p-button.p-button-${severity}`;
          return `${selector}:enabled:focus { background: rgba(${rgb}, 0.76); }
            ${selector}:enabled:active { background: rgba(${rgb}, 0.68); }
            ${selector}.p-button-text:enabled:focus, ${selector}.p-button-outlined:enabled:focus { background: rgba(${rgb}, 0.12); }
            ${selector}.p-button-text:enabled:active, ${selector}.p-button-outlined:enabled:active { background: rgba(${rgb}, 0.16); }
            ${selector}.p-button-text .p-ink, ${selector}.p-button-outlined .p-ink { background: rgba(${rgb}, 0.16); }`;
        }).join('\n')}
        .p-button-outlined:enabled:focus { box-shadow: inset 0 0 0 1px; }
        .p-button:disabled { background: rgba(0, 0, 0, 0.12); color: rgba(0, 0, 0, 0.38); opacity: 1; }
        .p-button:disabled.p-button-text, .p-button:disabled.p-button-outlined { background: transparent; }
      `,
    },
    card: {
      body: { padding: '1rem', gap: '0' },
      title: { fontSize: '1.5rem', fontWeight: '700' },
      css: `
        .p-card-title, .p-card-subtitle { margin-bottom: 0.5rem; }
        .p-card-content { padding: 1rem 0; }
        .p-card-footer { padding: 1rem 0 0; }
      `,
    },
    inputgroup: {
      addon: { background: '#e0e0e1', color: 'rgba(0, 0, 0, 0.6)', padding: '1rem', minWidth: '2.357rem' },
    },
    divider: { horizontal: { margin: '1.25rem 0', padding: '0 1.25rem' } },
    tree: {
      root: { gap: '0' },
      node: { padding: '0.5rem', borderRadius: '4px', gap: '0' },
    },
    checkbox: {
      root: {
        borderColor: '#757575', hoverBorderColor: '#757575', focusBorderColor: '#757575',
        disabledBackground: '#ffffff', checkedDisabledBorderColor: '#757575',
      },
      // Keep the public CheckIcon SVG used in 17 instead of Material 18's larger CSS tick.
      css: `
        p-checkbox { display: inline-flex; vertical-align: bottom; align-items: center; }
        .p-checkbox { border-radius: 50%; transition: box-shadow 0.2s; }
        .p-checkbox-box { border-width: 2px; position: relative; }
        .p-checkbox:not(.p-disabled):has(.p-checkbox-input:hover) { box-shadow: 0 0 1px 10px rgba(0, 0, 0, 0.04); }
        .p-checkbox.p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) { box-shadow: 0 0 1px 10px rgba(10, 52, 99, 0.04); }
        .p-checkbox:not(.p-disabled):has(.p-checkbox-input:focus) { box-shadow: 0 0 1px 10px rgba(0, 0, 0, 0.12); }
        .p-checkbox.p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:focus) { box-shadow: 0 0 1px 10px rgba(10, 52, 99, 0.12); }
        /* Table's legacy markup used black halos and did not focus its hidden input on mouse clicks.
           Repeat the root class to override both checked and unchecked generic checkbox states. */
        .p-datatable :is(p-tableCheckbox, p-tableHeaderCheckbox) .p-checkbox.p-checkbox:not(.p-disabled):has(.p-checkbox-input:focus) { box-shadow: none; }
        .p-datatable :is(p-tableCheckbox, p-tableHeaderCheckbox) .p-checkbox.p-checkbox:not(.p-disabled):has(.p-checkbox-input:hover) { box-shadow: 0 0 1px 10px rgba(0, 0, 0, 0.04); }
        .p-datatable :is(p-tableCheckbox, p-tableHeaderCheckbox) .p-checkbox.p-checkbox:not(.p-disabled):has(.p-checkbox-input:focus-visible) { box-shadow: 0 0 1px 10px rgba(0, 0, 0, 0.12); }
        .p-checkbox.p-disabled { opacity: 0.38; }
        .p-checkbox.p-checkbox-checked.p-disabled .p-checkbox-box { background: #0a3463; border-color: #0a3463; }
        .p-checkbox.p-checkbox-checked.p-disabled .p-checkbox-icon { color: #ffffff; }
      `,
    },
    togglebutton: {
      root: { padding: '0.714rem 1rem', borderColor: 'rgba(0, 0, 0, 0.12)', checkedBorderColor: '#e0e0e1' },
      colorScheme: { light: { root: { hoverBackground: '#f6f6f6', checkedBackground: '#e0e0e1' } } },
      css: `
        .p-togglebutton.p-togglebutton-checked:not(:disabled):hover,
        .p-togglebutton.p-togglebutton-checked:focus { background: #d9d8d9; border-color: #d9d8d9; }
        .p-togglebutton:not(.p-togglebutton-checked):focus { background: #e0e0e1; border-color: #e0e0e1; }
      `,
    },
    selectbutton: {
      css: `
        /* Legacy inline flow wraps whole choices on narrow screens. */
        .p-selectbutton { display: inline-block; }
        .p-selectbutton p-togglebutton { display: inline-block; vertical-align: bottom; }
        .p-selectbutton .p-togglebutton { vertical-align: bottom; border-left-width: 1px; }
        .p-selectbutton .p-togglebutton:not(:last-child) { border-right-width: 0; }
      `,
    },
    toggleswitch: {
      root: { borderWidth: '1px', borderRadius: '0.5rem', gap: '0px' },
      colorScheme: {
        light: {
          root: {
            background: 'rgba(0, 0, 0, 0.38)',
            disabledBackground: 'rgba(0, 0, 0, 0.38)',
            hoverBackground: 'rgba(0, 0, 0, 0.38)',
            checkedBackground: 'rgba(10, 52, 99, 0.5)',
            checkedHoverBackground: 'rgba(10, 52, 99, 0.5)',
          },
          handle: { background: '#ffffff', disabledBackground: '#ffffff', hoverBackground: '#ffffff' },
        },
      },
      css: `
        .p-toggleswitch-handle { box-shadow: ${switchHandleShadow}; }
        /* Legacy slider border (+1px) cancels the handle's -1px start; translation is 24px. */
        .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle { inset-inline-start: 1.5rem; }
        .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-handle { box-shadow: ${switchHandleShadow}, 0 0 1px 10px rgba(0, 0, 0, 0.04); }
        .p-toggleswitch.p-toggleswitch-checked:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-handle { box-shadow: 0 0 1px 10px rgba(10, 52, 99, 0.04), ${switchHandleShadow}; }
        .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:focus) .p-toggleswitch-handle { box-shadow: 0 0 1px 10px rgba(0, 0, 0, 0.12), ${switchHandleShadow}; }
        .p-toggleswitch.p-toggleswitch-checked:not(.p-disabled):has(.p-toggleswitch-input:focus) .p-toggleswitch-handle { box-shadow: 0 0 1px 10px rgba(10, 52, 99, 0.12), ${switchHandleShadow}; }
        .p-toggleswitch.p-disabled { opacity: 0.38; }
        .p-toggleswitch.p-toggleswitch-checked.p-disabled .p-toggleswitch-slider { background: rgba(10, 52, 99, 0.5); }
        .p-toggleswitch.p-toggleswitch-checked.p-disabled .p-toggleswitch-handle { background: #0a3463; }
      `,
    },
    paginator: {
      root: { gap: '0' },
      navButton: {
        width: '3rem',
        height: '3rem',
        color: 'rgba(0, 0, 0, 0.6)',
        hoverColor: 'rgba(0, 0, 0, 0.6)',
        hoverBackground: 'rgba(0, 0, 0, 0.04)',
      },
      css: `
        .p-paginator-page, .p-paginator-first, .p-paginator-prev, .p-paginator-next, .p-paginator-last { margin: 0.143rem; font: inherit; }
        .p-paginator svg { width: 0.875rem; height: 0.875rem; }
      `,
    },
    datatable: {
      headerCell: {
        padding: '1rem',
        borderColor: '#e4e4e4',
        selectedBackground: '#ffffff',
        selectedColor: 'rgba(0, 0, 0, 0.87)',
      },
      bodyCell: { borderColor: '#e4e4e4' },
      columnTitle: { fontWeight: '500' },
      // PrimeNG 20 uses the same sort-icon class as Table's own CSS.
      css: options => `${presetCss(Material.components.datatable.css, options)}
        /* Icons now render directly inside p-sorticon rather than a separate wrapper. */
        .p-datatable p-sorticon { display: inline; }
        .p-datatable p-sorticon svg.p-datatable-sort-icon { vertical-align: middle !important; }
        .p-datatable .p-datatable-sort-icon { color: rgba(0, 0, 0, 0.6); margin-left: 0.5rem; vertical-align: middle; width: 0.875rem; height: 0.875rem; }
        .p-datatable .p-datatable-column-sorted .p-datatable-sort-icon { color: rgba(0, 0, 0, 0.87); }
        .p-datatable-thead .p-button { min-height: 1.4375rem; }
      `,
    },
    tag: {
      root: { fontSize: '0.75rem', padding: '0.25rem 0.4rem' },
      colorScheme: {
        light: {
          warn: { background: '#fbc02d', color: '#212529' },
          info: { background: '#2196f3', color: '#ffffff' },
          danger: { background: '#d32f2f', color: '#ffffff' },
          success: { background: '#689f38', color: '#ffffff' },
        },
      },
      css: `.p-tag-label:empty { display: none; }`,
    },
    tabs: {
      tab: {
        padding: '1rem 1.5rem',
        fontWeight: '500',
        color: 'rgba(0, 0, 0, 0.6)',
        hoverColor: 'rgba(0, 0, 0, 0.6)',
        hoverBackground: 'rgba(10, 52, 99, 0.04)',
        activeBorderColor: 'rgba(0, 0, 0, 0.12)',
        margin: '0',
      },
      activeBar: { bottom: '0' },
      tabpanel: { padding: '0' },
      css: options => `${presetCss(Material.components.tabs.css, options)}
        .p-tab { font-family: inherit; font-size: 1rem; line-height: 1; border-top-left-radius: 4px; border-top-right-radius: 4px; }
        .p-tabpanels { padding: 0; }
        .p-tablist-content:not(.p-tablist-viewport) { overflow: hidden; }
      `,
    },
    message: {
      content: { padding: '0.75rem', gap: '0.5rem' },
      text: { fontWeight: '400' },
      icon: { size: '1rem' },
      colorScheme: {
        light: {
          warn: { background: '#ffecb3', color: '#7f6003' },
          info: { background: '#b3e5fc', color: '#01579b' },
          error: { background: '#ffcdd2', color: '#b71c1c' },
          success: { background: '#c8e6c9', color: '#1b5e20' },
        },
      },
    },
    dialog: {
      header: { padding: '1.5rem' },
      title: { fontWeight: '500' },
      content: { padding: '0 1.5rem 1.5rem' },
      footer: { padding: '1rem 1.5rem' },
      css: `
        .p-dialog { position: relative; border: 0; background: transparent; color: initial; }
        .p-dialog-header, .p-dialog-content, .p-dialog-footer { background: #ffffff; color: rgba(0, 0, 0, 0.87); }
        .p-dialog-header { border-top-left-radius: 4px; border-top-right-radius: 4px; }
        .p-dialog-footer { border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; display: block; text-align: right; }
        .p-dialog-footer button { margin: 0 0.5rem 0 0; }
        .p-confirmdialog .p-dialog-footer svg { width: 0.875rem; height: 0.875rem; }
        .p-dialog-content:last-of-type { border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; }
        .p-dialog .p-dialog-header .p-button { min-width: 0; width: 2.5rem; height: 2.5rem; padding: 0; color: rgba(0, 0, 0, 0.6); }
        .p-dialog .p-dialog-header .p-button svg { width: 0.875rem; height: 0.875rem; }
        .p-dialog .p-dialog-header .p-button:enabled:focus,
        .p-dialog .p-dialog-header .p-button:enabled:active { background: transparent; color: rgba(0, 0, 0, 0.6); outline: 0; box-shadow: none; }
        .p-dialog .p-dialog-header .p-button:enabled:hover { background: rgba(0, 0, 0, 0.04); color: rgba(0, 0, 0, 0.6); }
      `,
    },
    drawer: {
      header: { padding: '1rem' },
      content: { padding: '0 1rem 1rem' },
      css: `
        .p-drawer { border: 0; }
        /* PrimeNG 17 clears the transform after opening. Preserve animations,
           then restore its stable shadow/text rasterization and containing block. */
        .p-drawer-active:not(.ng-animating) { transform: none !important; }
        .p-drawer-header:has(.p-button) { justify-content: flex-end; }
        .p-drawer .p-drawer-header .p-button { min-width: 0; width: 2.5rem; height: 2.5rem; padding: 0; color: rgba(0, 0, 0, 0.6); }
        .p-drawer .p-drawer-header .p-button svg { width: 0.875rem; height: 0.875rem; }
        .p-drawer .p-drawer-header .p-button:enabled:focus,
        .p-drawer .p-drawer-header .p-button:enabled:active { background: transparent; color: rgba(0, 0, 0, 0.6); outline: 0; box-shadow: none; }
        .p-drawer .p-drawer-header .p-button:enabled:hover { background: rgba(0, 0, 0, 0.04); color: rgba(0, 0, 0, 0.6); }
      `,
    },
    fileupload: {
      root: { borderColor: '#e0e0e0', borderRadius: '4px' },
      header: { padding: '1rem', gap: '0' },
      content: { padding: '2rem 1rem', gap: '0' },
      css: `
        .p-fileupload-header { display: block; }
        .p-fileupload-header .p-button { margin-right: 0.5rem; }
        .p-fileupload-header .p-button svg { width: 0.875rem; height: 0.875rem; margin-right: 0.5rem; }
        .p-fileupload-header .p-button:disabled { opacity: 0.38; }
        .p-fileupload-content { border: 0; border-top: 1px solid #e0e0e0; position: relative; }
        .p-fileupload-content .p-progressbar { position: absolute; top: 0; left: 0; }
      `,
    },
  },
});
