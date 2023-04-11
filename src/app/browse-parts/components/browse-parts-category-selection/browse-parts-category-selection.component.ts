import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'dexie';
import { BrowsePartsService, FilterChangedProperty } from '../../service/browse-parts.service';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-browse-parts-category-selection',
  templateUrl: './browse-parts-category-selection.component.html',
  styleUrls: ['./browse-parts-category-selection.component.scss'],
})
export class BrowsePartsCategorySelectionComponent implements OnInit, OnDestroy {
  categories: TreeNode[];
  selectedCategory: TreeNode;
  categoriesSubscription: Subscription;
  filterSubscription: Subscription;

  constructor(private readonly browsePartsService: BrowsePartsService) {}

  ngOnInit(): void {
    this.categoriesSubscription = this.browsePartsService.categories$.subscribe(categories => {
      this.categories = categories.map(cat => {
        return {
          label: cat.name,
          data: String(cat.quantity),
          key: String(cat.id),
          active: true,
        };
      });

      this.categories.unshift({
        key: '9999',
        label: 'All',
        data: categories.reduce((a, b) => a + b.quantity, 0),
      });

      this.selectedCategory = {
        key: String(this.browsePartsService.filter.categoryId),
      };
    });

    this.filterSubscription = this.browsePartsService.filterState$.subscribe(filterChanged => {
      switch (filterChanged.property) {
        case FilterChangedProperty.category:
          this.selectedCategory = {
            key: String(filterChanged.filter.categoryId),
          };
      }
    });
  }

  onSelectCategory(id: string) {
    this.browsePartsService.setCategory(Number(id));
  }

  ngOnDestroy(): void {
    if (this.categoriesSubscription) this.categoriesSubscription.unsubscribe();
    if (this.filterSubscription) this.filterSubscription.unsubscribe();
  }
}
