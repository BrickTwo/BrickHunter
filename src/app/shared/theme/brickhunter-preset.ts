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
    inputgroup: { addon: { background: '#e0e0e1', color: 'rgba(0, 0, 0, 0.6)', padding: '1rem', minWidth: '2.357rem' } },
    divider: { horizontal: { margin: '1.25rem 0', padding: '0 1.25rem' } },
    datatable: { headerCell: { padding: '1rem' }, columnTitle: { fontWeight: '500' } },
    tag: {
      root: { fontSize: '0.75rem', padding: '0.25rem 0.4rem' },
      colorScheme: { light: { warn: { background: '#fbc02d', color: '#212529' } } },
    },
    dialog: { header: { padding: '1.5rem' }, title: { fontWeight: '500' }, content: { padding: '0 1.5rem 1.5rem' } },
    drawer: { header: { padding: '1rem' }, content: { padding: '0 1rem 1rem' } },
  },
});
