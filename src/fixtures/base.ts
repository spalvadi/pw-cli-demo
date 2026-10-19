import { test as baseTest } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import usersData from '../../tests/data/users.json';

export { expect } from '@playwright/test';

type Fixtures = {
  users: typeof usersData;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
};

export const test = baseTest.extend<Fixtures>({
  users: async ({}, use) => {
    await use(usersData);
  },
  // Opens the login page, so every test starts there.
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
});
