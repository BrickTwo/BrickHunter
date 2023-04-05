import { createSelector } from '@ngrx/store';
import { BrowsePartsPart } from '../models/browse-parts';

export const getParts = (parts: BrowsePartsPart[]) => parts;

export const browsePartsViewModel = createSelector(getParts, (parts: BrowsePartsPart[]) => {
  return {
    parts: parts,
  };
});

export type ViewModel = ReturnType<typeof browsePartsViewModel>;
