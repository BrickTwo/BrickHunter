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
  selectedCategory: TreeNode<any>;
  categoriesSubscription: Subscription;
  filterSubscription: Subscription;
  configMode = false;
  configCategories: TreeNode[];
  selectedConfigCategories: TreeNode[];
  excludeSelectedCategoryIds: boolean;

  constructor(private readonly browsePartsService: BrowsePartsService) {}

  ngOnInit(): void {
    this.excludeSelectedCategoryIds = this.browsePartsService.filter.excludeSelectedCategoyIds;

    this.categoriesSubscription = this.browsePartsService.categories$.subscribe(categories => {
      this.categories = categories
        .filter(c => c.quantity > 0)
        .map(cat => {
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

      this.configCategories = categories.map(cat => {
        return {
          label: cat.name,
          data: String(cat.quantity),
          key: String(cat.id),
          active: true,
        };
      });

      this.selectedCategory = {
        key: String(this.browsePartsService.filter.categoryId),
      };

      this.selectedConfigCategories = this.configCategories.filter(c =>
        this.browsePartsService.filter.excludeCategoryIds?.some(id => id === Number(c.key))
      );
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

  onConfigCategory(id: string) {
    this.browsePartsService.setExlcudeCategoryId(this.selectedConfigCategories.map(c => Number(c.key)));
  }

  onChangeExcludeSeclectedCategoryIds(value: boolean) {
    this.browsePartsService.setExcludeSelectedCategoryIds(this.excludeSelectedCategoryIds);
  }

  ngOnDestroy(): void {
    if (this.categoriesSubscription) this.categoriesSubscription.unsubscribe();
    if (this.filterSubscription) this.filterSubscription.unsubscribe();
  }
}
