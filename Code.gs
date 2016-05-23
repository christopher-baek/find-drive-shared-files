/**
 * A Google Apps Script that finds all files shared with other users for edit
 * or view access.
 */


/**
 * CONSTANTS
 */
var SPREADSHEET_NAME = "FindDriveSharedFiles Report: " + new Date();
var USER_EMAIL = Session.getActiveUser().getEmail();



/**
 * MAIN
 */
function main() {
  Logger.log("Starting...");

  var spreadsheet = createNewSpreadsheet();
  var header = ["NAME", "EDITOR_COUNT", "VIEWER_COUNT", "TRASHED", "URL"];
  appendSpreadsheetData(spreadsheet, header);

  var files = DriveApp.getFiles();

  while (files.hasNext()) {
    var file = files.next();

    if (isUserOwnedFile(file) && isSharedFile(file)) {
      logFile(spreadsheet, file);
    }
  }

  SpreadsheetApp.flush();
  Logger.log("Done!");
}


/**
 * Returns a new spreadsheet for logging results
 */
function createNewSpreadsheet() {
  var spreadsheet = SpreadsheetApp.create(SPREADSHEET_NAME);
  return spreadsheet;
}


/**
 * Returns true if the parameter file is owned by the user
 * running the script
 */
function isUserOwnedFile(file) {
  var owner = file.getOwner();
  return owner.getEmail() === USER_EMAIL;
}


/**
 * Returns true if the parameter file has multiple viewers
 * or editors
 */
function isSharedFile(file) {
  return file.getViewers().length > 0 || file.getEditors().length > 0;
}


/**
 * Logs the parameter file to the parameter spreadsheet
 */
function logFile(spreadsheet, file) {
  var fileData = [file.getName(), file.getEditors().length, file.getViewers().length, file.isTrashed(), file.getUrl()];
  appendSpreadsheetData(spreadsheet, fileData);
}


/**
 * Appends parameter data to parameter spreadsheet
 */
function appendSpreadsheetData(spreadsheet, data) {
  spreadsheet.appendRow(data);
}
