function HostData(hostname, activationTime) {
  this.hostname = hostname;
  this.previousTime = activationTime;
  this.totalTime = 0;
}

export { HostData };
