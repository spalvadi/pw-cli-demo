// spec: specs/saucedemo-login.md (scenario 1.1)
import { meta } from 'reporting-labs';
import { test, expect } from '../../src/fixtures/base';

test.describe('Login', () => {
  test('@smoke @critical standard user logs in successfully', async ({ loginPage, inventoryPage, users }) => {
    meta({ priority: 'P0', severity: 'critical', owner: 'sujanapalvadi', feature: 'authentication', component: 'login', team: 'qa' });

    // 1. Type standard_user into the Username field
    await loginPage.usernameInput.fill(users.standard.username);
    await expect(loginPage.usernameInput).toHaveValue(users.standard.username);

    // 2. Type secret_sauce into the Password field
    await loginPage.passwordInput.fill(users.standard.password);
    await expect(loginPage.passwordInput).toHaveValue(users.standard.password);
    await expect(loginPage.errorMessage).toBeHidden();

    // 3. Click the Login button
    await loginPage.loginButton.click();
    await expect(inventoryPage.page).toHaveURL('/inventory.html');
    await expect(inventoryPage.page).toHaveTitle('Swag Labs');
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.sortDropdown).toHaveValue('az');
    await expect(inventoryPage.products).toHaveCount(6);
    await expect(inventoryPage.productName(0)).toHaveText('Sauce Labs Backpack');
    await expect(inventoryPage.productPrice(0)).toHaveText('$29.99');
    await expect(inventoryPage.cartLink).toHaveAccessibleName('Cart, empty');
    await expect(inventoryPage.menuButton).toBeVisible();
    await expect(loginPage.loginButton).toBeHidden();
  });
});
