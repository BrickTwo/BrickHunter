import { definePreset } from '@primeng/themes';
import Material from '@primeng/themes/material';

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
    button: {
      root: {
        paddingX: '1rem',
        paddingY: '0.714rem',
        borderRadius: '4px',
        gap: '0.5rem',
        label: { fontWeight: '500' },
        sm: { fontSize: '0.875rem', paddingX: '0.875rem', paddingY: '0.62475rem' },
        lg: { fontSize: '1.25rem', paddingX: '1.25rem', paddingY: '0.8925rem' },
      },
      // Preserve Material's state rules; only restore the measured legacy geometry.
      css: options => `${Material.components.button.css(options)}
        .p-button { border: 0; min-width: 4rem; }
        .p-button-label { flex: 1 1 auto; }
        .p-button-icon-only { min-width: auto; }
        .p-button-outlined { box-shadow: inset 0 0 0 1px; }
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
    checkbox: { root: { borderColor: '#757575', hoverBorderColor: '#757575', focusBorderColor: '#757575' } },
    togglebutton: {
      root: { padding: '0.714rem 1rem', borderColor: 'rgba(0, 0, 0, 0.12)', checkedBorderColor: '#e0e0e1' },
      colorScheme: { light: { root: { hoverBackground: '#f6f6f6', checkedBackground: '#e0e0e1' } } },
      css: `
        .p-togglebutton.p-togglebutton-checked:not(:disabled):hover,
        .p-togglebutton.p-togglebutton-checked:focus { background: #d9d8d9; border-color: #d9d8d9; }
        .p-togglebutton:not(.p-togglebutton-checked):focus { background: #e0e0e1; border-color: #e0e0e1; }
      `,
    },
    toggleswitch: {
      root: { borderWidth: '0', borderRadius: '0.5rem', gap: '-1px' },
      colorScheme: {
        light: {
          root: {
            background: 'rgba(0, 0, 0, 0.38)',
            hoverBackground: 'rgba(0, 0, 0, 0.38)',
            checkedBackground: 'rgba(10, 52, 99, 0.5)',
            checkedHoverBackground: 'rgba(10, 52, 99, 0.5)',
          },
        },
      },
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
      `,
    },
    datatable: { headerCell: { padding: '1rem' }, columnTitle: { fontWeight: '500' } },
    tag: {
      root: { fontSize: '0.75rem', padding: '0.25rem 0.4rem' },
      colorScheme: { light: { warn: { background: '#fbc02d', color: '#212529' } } },
    },
    tabs: {
      tab: {
        padding: '1rem 1.5rem',
        fontWeight: '500',
        color: 'rgba(0, 0, 0, 0.6)',
        hoverColor: 'rgba(0, 0, 0, 0.6)',
        hoverBackground: 'rgba(10, 52, 99, 0.04)',
        activeBorderColor: 'rgba(0, 0, 0, 0.12)',
      },
      tabpanel: { padding: '0' },
      css: options => `${Material.components.tabs.css(options)}
        .p-tab { font-family: inherit; font-size: 1rem; border-top-left-radius: 4px; border-top-right-radius: 4px; }
        .p-tabpanels { padding: 0; }
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
        .p-dialog { border: 0; }
        .p-dialog .p-dialog-header .p-button { min-width: 0; width: 2.5rem; height: 2.5rem; padding: 0; }
      `,
    },
    drawer: {
      header: { padding: '1rem' },
      content: { padding: '0 1rem 1rem' },
      css: `
        .p-drawer { border: 0; }
        .p-drawer-header:has(.p-button) { justify-content: flex-end; }
        .p-drawer .p-drawer-header .p-button { min-width: 0; width: 2.5rem; height: 2.5rem; padding: 0; color: rgba(0, 0, 0, 0.6); }
      `,
    },
    fileupload: {
      root: { borderColor: '#e0e0e0', borderRadius: '4px' },
      header: { padding: '1rem', gap: '0' },
      content: { padding: '2rem 1rem', gap: '0' },
      css: `
        .p-fileupload-header { display: block; }
        .p-fileupload-header .p-button { margin-right: 0.5rem; }
        .p-fileupload-header .p-button svg { width: 0.875rem; height: 0.875rem; }
        .p-fileupload-header .p-button:disabled { opacity: 0.38; }
        .p-fileupload-content { border: 0; border-top: 1px solid #e0e0e0; position: relative; }
      `,
    },
  },
});
