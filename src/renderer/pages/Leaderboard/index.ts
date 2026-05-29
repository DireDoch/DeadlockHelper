/**
 * Leaderboards — Main Page (redirects to Rankings sub-page)
 */

export class LeaderboardPage {
  private container: HTMLElement | null = null;

  mount(container: HTMLElement): void {
    this.container = container;
    // Auto-navigate to the Rankings sub-page (Player Leaderboard)
    document.dispatchEvent(new CustomEvent('navigate-to-subpage', { detail: { page: 'rankings' } }));
  }
}
