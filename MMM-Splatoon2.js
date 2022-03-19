/**
 * Magic Mirror
 * Module: MMM-Splatoon2
 *
 * By Red-CS
 */

Module.register("MMM-Splatoon2", {
  // Default configs
  defaults: {
    turf: true, // Show Turf War rotations
    ranked: true, // Show Ranked rotations
    league: true, // Show League rotations
    updateInterval: 600 // Update every 10 minutes
  },

  start: () => {
    self = this

    setInterval(() => {
      self.updateDom()
    }, this.config.updateInterval)
  },

  getStyles: () => {
    return ["MMM-Splatoon2.css"]
  }
})
