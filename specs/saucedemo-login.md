# Saucedemo Login Test Plan

## Application Overview

Swag Labs (https://www.saucedemo.com) is a demo e-commerce site. The root page is a single login form with a Username textbox, a Password textbox and a Login button. It also lists the accepted usernames (`standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user`, `error_user`, `visual_user`) and the shared password `secret_sauce`.

A successful login navigates to `/inventory.html`, which shows six products. A failed login stays on `/` and shows a dismissible error banner (`alert` role, text prefixed with "Epic sadface:"), and both inputs get the red `error` class.

This plan was produced by read-only exploration with `playwright-cli` in a headed browser. No test code was written.

**Exploration notes**

- The Login button's `data-test` attribute is `login-button`. The error container is `data-test="error"`.
- Validation runs in order: username required, then password required, then credential check. A form with only a password reports "Username is required".
- The console shows 401 errors from `events.backtrace.io` (third-party telemetry). They are unrelated to login, so tests should not fail on console errors.
- Scenarios 1.3 and 1.4 submit the form with the missing field left blank, so they cover validation with the other field both filled and empty.

## Test Scenarios

### 1. Login

**Preconditions for all scenarios:** A fresh browser context (no cookies or storage), navigated to `https://www.saucedemo.com/`. The login form is displayed, both fields are empty and no error is shown. Each scenario is independent and must not rely on state from another.

**Seed:** none exists yet (`tests/seed.spec.ts` should be created to navigate to `https://www.saucedemo.com/`).

#### 1.1. standard-user-successful-login

**File:** `tests/login/standard-user-successful-login.spec.ts`

**Preconditions:** Login page loaded, user not authenticated. `standard_user` is a valid, unlocked account.

**Steps:**
  1. Type `standard_user` into the Username field
    - expect: Username field contains `standard_user`
  2. Type `secret_sauce` into the Password field
    - expect: Password field contains a value (masked input)
    - expect: No error banner is visible
  3. Click the Login button
    - expect: URL is `https://www.saucedemo.com/inventory.html`
    - expect: Page title is "Swag Labs"
    - expect: "Products" heading is visible
    - expect: The sort dropdown is visible, with "Name (A to Z)" selected by default
    - expect: Six products are listed, the first being "Sauce Labs Backpack" at $29.99
    - expect: The cart is empty (accessible name "Cart, empty")
    - expect: The "Open Menu" button is visible
    - expect: The login form is no longer visible

#### 1.2. locked-out-user-shows-error

**File:** `tests/login/locked-out-user-shows-error.spec.ts`

**Preconditions:** Login page loaded, user not authenticated. `locked_out_user` is a valid username that is blocked from signing in.

**Steps:**
  1. Type `locked_out_user` into the Username field
    - expect: Username field contains `locked_out_user`
  2. Type `secret_sauce` into the Password field
    - expect: No error banner is visible yet
  3. Click the Login button
    - expect: An error alert is visible with the text "Epic sadface: Sorry, this user has been locked out."
    - expect: URL remains `https://www.saucedemo.com/`
    - expect: The login form is still visible
    - expect: Username and Password fields keep their entered values
    - expect: The inventory page is not shown

#### 1.3. empty-username-shows-error

**File:** `tests/login/empty-username-shows-error.spec.ts`

**Preconditions:** Login page loaded, user not authenticated.

**Steps:**
  1. Leave the Username field empty and click the Login button
    - expect: An error alert is visible with the text "Epic sadface: Username is required"
    - expect: URL remains `https://www.saucedemo.com/`
    - expect: Both fields remain empty
  2. Reload the page, type `secret_sauce` into the Password field only, and click the Login button
    - expect: The same error "Epic sadface: Username is required" is shown (the username check takes priority)
    - expect: Password field still contains the entered value
    - expect: URL remains `https://www.saucedemo.com/`
  3. Click the "Dismiss error" button
    - expect: The error alert is no longer visible

#### 1.4. empty-password-shows-error

**File:** `tests/login/empty-password-shows-error.spec.ts`

**Preconditions:** Login page loaded, user not authenticated.

**Steps:**
  1. Type `standard_user` into the Username field and leave the Password field empty
    - expect: Username field contains `standard_user`
    - expect: Password field is empty
  2. Click the Login button
    - expect: An error alert is visible with the text "Epic sadface: Password is required"
    - expect: URL remains `https://www.saucedemo.com/`
    - expect: Username field still contains `standard_user`
    - expect: The inventory page is not shown

#### 1.5. invalid-credentials-show-error

**File:** `tests/login/invalid-credentials-show-error.spec.ts`

**Preconditions:** Login page loaded, user not authenticated. `foo` / `bar` do not match any account.

**Steps:**
  1. Type `foo` into the Username field
    - expect: Username field contains `foo`
  2. Type `bar` into the Password field
    - expect: Password field contains a value
  3. Click the Login button
    - expect: An error alert is visible with the text "Epic sadface: Username and password do not match any user in this service"
    - expect: URL remains `https://www.saucedemo.com/`
    - expect: Username and Password fields are highlighted as invalid (red `error` class)
    - expect: Entered values are retained in both fields
  4. Click the "Dismiss error" button
    - expect: The error alert is no longer visible
    - expect: The login form and entered values remain
