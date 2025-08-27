import { test, expect } from '@playwright/test'

test.describe('Vehicle Recommender Wizard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should complete vehicle recommendation flow', async ({ page }) => {
    // Check initial state
    await expect(page.locator('h1')).toContainText('¿Cuál es tu presupuesto?')
    
    // Step 1: Budget range
    await page.locator('input[type="number"]').first().fill('300000')
    await page.locator('input[type="number"]').last().fill('500000')
    await page.getByRole('button', { name: 'Continuar' }).click()
    
    // Step 2: Down payment
    await page.locator('input[type="number"]').first().fill('5000000')
    await page.locator('input[type="number"]').last().fill('10000000')
    await page.getByRole('button', { name: 'Continuar' }).click()
    
    // Step 3: Body type
    await expect(page.locator('h1')).toContainText('¿Qué tipo de auto te acomoda?')
    await page.getByRole('button', { name: 'Sedán' }).click()
    await page.getByRole('button', { name: 'SUV' }).click()
    await page.getByRole('button', { name: 'Continuar' }).click()
    
    // Step 4: Fuel type
    await page.getByRole('button', { name: 'Bencina' }).click()
    await page.getByRole('button', { name: 'Continuar' }).click()
    
    // Step 5: Transmission
    await page.getByRole('button', { name: 'Automática' }).click()
    await page.getByRole('button', { name: 'Continuar' }).click()
    
    // Step 6: Usage
    await page.getByRole('button', { name: 'Ciudad' }).click()
    await page.getByRole('button', { name: 'Familiar' }).click()
    await page.getByRole('button', { name: 'Ver resultados' }).click()
    
    // Results page
    await expect(page.locator('h1')).toContainText('Lo que mejor calza contigo')
    await expect(page.locator('article').first()).toBeVisible()
  })

  test('should navigate between steps', async ({ page }) => {
    // Go to step 2
    await page.locator('input[type="number"]').first().fill('300000')
    await page.locator('input[type="number"]').last().fill('500000')
    await page.getByRole('button', { name: 'Continuar' }).click()
    
    // Go back to step 1
    await page.getByRole('button', { name: 'Volver' }).click()
    await expect(page.locator('h1')).toContainText('¿Cuál es tu presupuesto?')
    
    // Values should be preserved
    await expect(page.locator('input[type="number"]').first()).toHaveValue('300000')
    await expect(page.locator('input[type="number"]').last()).toHaveValue('500000')
  })

  test('should validate required fields', async ({ page }) => {
    // Try to continue without selecting body type
    await page.locator('input[type="number"]').first().fill('300000')
    await page.locator('input[type="number"]').last().fill('500000')
    await page.getByRole('button', { name: 'Continuar' }).click()
    
    // Skip down payment (optional)
    await page.getByRole('button', { name: 'Continuar' }).click()
    
    // Try to continue without selecting body type (required)
    const continueButton = page.getByRole('button', { name: 'Continuar' })
    await expect(continueButton).toBeDisabled()
    
    // Select a body type
    await page.getByRole('button', { name: 'Sedán' }).click()
    await expect(continueButton).toBeEnabled()
  })

  test('should persist answers on page refresh', async ({ page }) => {
    // Fill first step
    await page.locator('input[type="number"]').first().fill('400000')
    await page.locator('input[type="number"]').last().fill('600000')
    await page.getByRole('button', { name: 'Continuar' }).click()
    
    // Go to step 3
    await page.getByRole('button', { name: 'Continuar' }).click()
    await page.getByRole('button', { name: 'SUV' }).click()
    
    // Refresh page
    await page.reload()
    
    // Should be on the same step
    await expect(page.locator('h1')).toContainText('¿Qué tipo de auto te acomoda?')
    
    // SUV should still be selected
    const suvButton = page.getByRole('button', { name: 'SUV' })
    await expect(suvButton).toHaveAttribute('aria-pressed', 'true')
  })

  test('should switch between vehicles and insurance verticals', async ({ page }) => {
    // Start with vehicles
    await expect(page.locator('h1')).toContainText('¿Cuál es tu presupuesto?')
    
    // Switch to insurance
    await page.getByRole('button', { name: 'Seguros' }).click()
    await expect(page.locator('h1')).toContainText('¿Cuál es tu presupuesto mensual para el seguro?')
    
    // Switch back to vehicles
    await page.getByRole('button', { name: 'Vehículos' }).click()
    await expect(page.locator('h1')).toContainText('¿Cuál es tu presupuesto?')
  })

  test('should handle empty results gracefully', async ({ page }) => {
    // Set unrealistic budget
    await page.locator('input[type="number"]').first().fill('1000')
    await page.locator('input[type="number"]').last().fill('2000')
    
    // Complete wizard quickly
    for (let i = 0; i < 5; i++) {
      await page.getByRole('button', { name: 'Continuar' }).click()
      // Select first option if needed
      const buttons = await page.locator('button[type="button"]').all()
      if (buttons.length > 2) {
        await buttons[0].click()
      }
    }
    
    await page.getByRole('button', { name: 'Ver resultados' }).click()
    
    // Should show empty state or results
    const results = page.locator('article')
    const emptyState = page.getByText('No encontramos resultados')
    
    const hasResults = await results.count() > 0
    const hasEmptyState = await emptyState.isVisible().catch(() => false)
    
    expect(hasResults || hasEmptyState).toBeTruthy()
  })
})

test.describe('Insurance Recommender Wizard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Seguros' }).click()
  })

  test('should complete insurance recommendation flow', async ({ page }) => {
    // Step 1: Monthly budget
    await page.locator('input[type="number"]').first().fill('30000')
    await page.locator('input[type="number"]').last().fill('60000')
    await page.getByRole('button', { name: 'Continuar' }).click()
    
    // Step 2: Deductible range
    await page.locator('input[type="number"]').first().fill('5')
    await page.locator('input[type="number"]').last().fill('10')
    await page.getByRole('button', { name: 'Continuar' }).click()
    
    // Step 3: Minimum coverages
    await page.getByRole('button', { name: 'RC ≥ 1000 UF' }).click()
    await page.getByRole('button', { name: 'Daños propios' }).click()
    await page.getByRole('button', { name: 'Continuar' }).click()
    
    // Step 4: Preferences
    await page.getByRole('button', { name: 'Taller de marca' }).click()
    await page.getByRole('button', { name: 'Auto de reemplazo' }).click()
    await page.getByRole('button', { name: 'Ver resultados' }).click()
    
    // Results page
    await expect(page.locator('h1')).toContainText('Lo que mejor calza contigo')
    await expect(page.locator('article').first()).toBeVisible()
  })
})