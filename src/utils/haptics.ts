/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Vibration API wrapper for tactile haptic feedback in Candy Crush 2
class HapticFeedback {
  private enabled: boolean = true;

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
  }

  private trigger(pattern: number | number[]) {
    if (!this.enabled || !this.isSupported()) return;
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration errors gracefully (e.g. browser policy or iframe constraints)
    }
  }

  // Short, crisp pulse on normal match, scaling slightly with combo cascade
  public match(streak: number = 1) {
    if (streak <= 1) {
      this.trigger(25);
    } else if (streak === 2) {
      this.trigger([30, 25, 30]);
    } else if (streak === 3) {
      this.trigger([35, 20, 35, 20, 40]);
    } else {
      this.trigger([40, 20, 45, 20, 55]);
    }
  }

  // Tactile pulse when creating a special candy (Striped, Wrapped, Bomb)
  public createSpecial(type: string) {
    if (type.includes('striped')) {
      this.trigger([35, 25, 35]);
    } else if (type === 'wrapped') {
      this.trigger([50, 30, 50]);
    } else if (type === 'color_bomb') {
      this.trigger([60, 25, 70, 25, 80]);
    } else {
      this.trigger(30);
    }
  }

  // Heavy, layered haptic burst when a special candy or super combo detonates
  public clearSpecial(type: 'striped' | 'wrapped' | 'color_bomb' | 'combo') {
    switch (type) {
      case 'striped':
        // Fast laser zip
        this.trigger([40, 30, 45]);
        break;
      case 'wrapped':
        // Double explosion thump
        this.trigger([60, 40, 75]);
        break;
      case 'color_bomb':
        // Intense multi-zap rumble
        this.trigger([50, 25, 60, 25, 80]);
        break;
      case 'combo':
        // Colossal super-combo rumble
        this.trigger([70, 35, 80, 35, 110]);
        break;
      default:
        this.trigger(40);
    }
  }

  // Punchy tactile feedback for booster activations (Hammer, Swap, Shuffle)
  public booster() {
    this.trigger([45, 30, 65]);
  }

  // Light tap on swap
  public swap() {
    this.trigger(15);
  }

  // Error tap on invalid swap
  public invalid() {
    this.trigger([40, 40, 40]);
  }

  // Wheel tick tap
  public tick() {
    this.trigger(12);
  }

  // Celebratory pulse on level win / Sugar Crush
  public win() {
    this.trigger([50, 40, 60, 40, 90, 50, 120]);
  }
}

export const haptics = new HapticFeedback();
