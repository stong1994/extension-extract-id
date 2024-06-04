chrome.runtime.onInstalled.addListener(() => {});
chrome.action.onClicked.addListener(async (tab) => {
  console.log("tab url", tab.url);
  const uuidRegex =
    /[0-9a-fA-F]{8}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{4}-?[0-9a-fA-F]{12}/g;
  const mongoRegex = /[0-9a-fA-F]{24}/g;
  const regexes = [uuidRegex, mongoRegex];

  let ids = [];
  for (const regex of regexes) {
    // Extract the IDs from the URL
    const matches = tab.url.match(regex);
    if (matches) {
      ids = ids.concat(matches);
    }
  }
  if (ids.length > 0) {
    const idString = ids.join(",");
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: copyID,
      args: [idString],
    });
    notify("IDs have been copied to clipboard", idString);
  } else {
    notify("No ID found", "No ID found in the URL.");
  }
});

function copyID(id) {
  console.log("getID", id);
  navigator.clipboard.writeText(id);
  console.log("wrote done");
}

function notify(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon32.png", // Replace with your extension's icon
    title: title,
    message: message,
    priority: 1,
  });
}
