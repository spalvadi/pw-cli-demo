import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly title: Locator;
  readonly sortDropdown: Locator;
  readonly menuButton: Locator;
  readonly cartLink: Locator;
  readonly products: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId('title');
    this.sortDropdown = page.getByRole('combobox');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.cartLink = page.getByRole('button', { name: /Cart/ });
    this.products = page.getByTestId('inventory-item');
  }

  productName(index: number): Locator {
    return this.products.nth(index).getByTestId('inventory-item-name');
  }

  productPrice(index: number): Locator {
    return this.products.nth(index).getByTestId('inventory-item-price');
  }
}
