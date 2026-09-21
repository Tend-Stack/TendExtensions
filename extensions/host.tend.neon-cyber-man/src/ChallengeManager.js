export class ChallengeManager {
  constructor({ topSectorPellets = 0 } = {}) {
    this.startedAt = 0;
    this.topSectorPellets = topSectorPellets;
    this.topRemaining = topSectorPellets;
    this.comboChain = 0;
    this.multiplier = 1;
    this.maxMultiplier = 1;
    this.lastPelletAt = -Infinity;
    this.overclockUsed = false;
    this.ghostChain = 0;
    this.gemChips = 0;
    this.completed = new Set();
    this.objectives = [
      { id: 'top-sector', title: 'Sector Breach', detail: 'Clear the top sector within 30s', reward: 30 },
      { id: 'no-overclock', title: 'Cold Circuit', detail: 'Survive 45s without Overclock', reward: 35 },
      { id: 'combo-x5', title: 'Hyper Chain', detail: 'Reach a ×5 pellet multiplier', reward: 40 }
    ];
  }

  start(now) {
    this.startedAt = now;
  }

  elapsed(now) {
    return Math.max(0, now - this.startedAt);
  }

  registerPellet({ now, topSector = false, moving = true }) {
    const withinChain = moving && now - this.lastPelletAt <= 1050;
    this.comboChain = withinChain ? this.comboChain + 1 : 1;
    this.lastPelletAt = now;
    this.multiplier = Math.min(5, 1 + Math.floor((this.comboChain - 1) / 5));
    this.maxMultiplier = Math.max(this.maxMultiplier, this.multiplier);
    if (topSector) this.topRemaining = Math.max(0, this.topRemaining - 1);

    const newly = [];
    if (this.multiplier >= 5 && !this.completed.has('combo-x5')) newly.push(this.complete('combo-x5'));
    if (this.topRemaining === 0 && this.topSectorPellets > 0 && this.elapsed(now) <= 30000 && !this.completed.has('top-sector')) {
      newly.push(this.complete('top-sector'));
    }
    return {
      points: 10 * this.multiplier,
      multiplier: this.multiplier,
      chain: this.comboChain,
      completed: newly.filter(Boolean)
    };
  }

  resetCombo() {
    this.comboChain = 0;
    this.multiplier = 1;
  }

  registerOverclock() {
    this.overclockUsed = true;
    this.ghostChain = 0;
  }

  registerGhostEat() {
    this.ghostChain += 1;
    return 250 * Math.min(4, this.ghostChain);
  }

  registerGem(chips = 15) {
    this.gemChips += chips;
    return chips;
  }

  update(now) {
    const completed = [];
    if (!this.overclockUsed && this.elapsed(now) >= 45000 && !this.completed.has('no-overclock')) {
      completed.push(this.complete('no-overclock'));
    }
    return completed.filter(Boolean);
  }

  complete(id) {
    if (this.completed.has(id)) return null;
    const objective = this.objectives.find((item) => item.id === id);
    if (!objective) return null;
    this.completed.add(id);
    return objective;
  }

  rewardChips(score) {
    const objectiveChips = this.objectives
      .filter((objective) => this.completed.has(objective.id))
      .reduce((sum, objective) => sum + objective.reward, 0);
    return Math.floor(score / 1500) + objectiveChips + this.gemChips;
  }

  snapshot(now) {
    return {
      elapsedMs: this.elapsed(now),
      multiplier: this.multiplier,
      maxMultiplier: this.maxMultiplier,
      comboChain: this.comboChain,
      topRemaining: this.topRemaining,
      topTotal: this.topSectorPellets,
      overclockUsed: this.overclockUsed,
      completed: [...this.completed]
    };
  }
}
