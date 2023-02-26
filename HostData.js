function HostData(hostname) {
  this.hostname = hostname;
  this.activationTime = Date.now();
  this.deactivationTime = Date.now();
  this.totalTime = 0;
}

export { HostData };
