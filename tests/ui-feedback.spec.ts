import { test, expect } from '@playwright/test';

test.describe('UI Feedback et Layout Réactif', () => {
  test('Retour visuel de sauvegarde du prompt système', async ({ page }) => {
    // Naviguer vers l'application
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Fermer le wizard WebGPU s'il est présent
    try {
      const closeWizardBtn = page.getByTestId('close-wizard-btn');
      await expect(closeWizardBtn).toBeVisible({ timeout: 2000 });
      await closeWizardBtn.click();
    } catch (e) {
      // Le modal n'est pas apparu, on continue
    }

    // Ouvrir le panneau de droite si non ouvert (pour s'assurer que le prompt système est visible)
    // Par défaut sur desktop (1280px), il est ouvert.
    const rightSidebar = page.getByTestId('right-sidebar');
    await expect(rightSidebar).toBeVisible();

    // Trouver le champ de texte du prompt système
    const systemPromptTextarea = page.getByTestId('system-prompt-textarea');
    await expect(systemPromptTextarea).toBeVisible();

    // Modifier le texte
    await systemPromptTextarea.fill('Nouveau prompt système de test');

    // Déclencher le blur
    await systemPromptTextarea.blur();

    // Vérifier l'apparition du retour visuel
    const savedFeedback = page.getByTestId('system-prompt-saved-feedback');
    await expect(savedFeedback).toBeVisible();
    await expect(savedFeedback).toContainText('Enregistré');

    // Vérifier qu'il disparait après 2 secondes (timeout de 2500ms pour être sûr)
    await expect(savedFeedback).toBeHidden({ timeout: 3000 });

    // --- TEST 2: LE DESIGN S'ADAPTE À LA TAILLE DE LA PAGE (RESPONSIVE) ---
    // Sur desktop (1280px ou 1300px), la sidebar droite est visible
    await expect(rightSidebar).toBeVisible();

    // Changer la taille de l'écran pour simuler une tablette/petit écran (< 1200px)
    await page.setViewportSize({ width: 1024, height: 800 });

    // La sidebar droite doit être masquée
    await expect(rightSidebar).toBeHidden();
    
    // Le bouton pour toggle la sidebar doit ouvrir le sheet (ou la sidebar mobile)
    // En vue mobile (< 1200px), il y a un toggle différent pour la navbar mobile vs desktop,
    // On peut changer la taille à 1300px pour vérifier la réouverture
    await page.setViewportSize({ width: 1300, height: 800 });
    
    // La sidebar droite doit redevenir visible après un redimensionnement
    // (L'événement resize du layout va recalculer checkMobile et isRightSidebarOpen = true)
    await expect(rightSidebar).toBeVisible();
  });
});
