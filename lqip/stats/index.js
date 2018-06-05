function Stats() {
  this.cached = 0
  this.generated = 0
}

Stats.prototype.addCached = function addCached() {
  this.cached = this.cached + 1
}

Stats.prototype.addGenerated = function addGenerated() {
  this.generated = this.generated + 1
}

exports.Stats = Stats
