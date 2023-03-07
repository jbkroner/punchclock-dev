function isTrackedHostname(hostname) {
  const trackedHostNames = ["www.arstechnica.com", "www.google.com", "www.youtube.com"];
  return trackedHostNames.includes(hostname);
}

export { isTrackedHostname };
