function isTrackedHostname(hostname) {
  const trackedHostNames = ["arstechnica.com", "google.com", "youtube.com"];
  return trackedHostNames.includes(hostname);
}

export { isTrackedHostname };
