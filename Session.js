function Session() {
  /** @type {Map<string, TabData>} */
  this.tabs = new Map();
  
  this.previousTab;
  
  /** @type {Map<string, TabData>} */
  this.hostnames = new Map();
}

export { Session };
