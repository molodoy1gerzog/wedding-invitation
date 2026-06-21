const SHEET_NAME = 'Ответы гостей';

function doPost(event) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Дата и время',
      'Имя гостя',
      'Присутствие',
      'Предпочтения в алкоголе'
    ]);
    sheet.setFrozenRows(1);
  }

  const data = JSON.parse(event.postData.contents);
  const attendance = data.attendance === 'yes' ? 'Будет' : 'Не сможет';
  const alcohol = Array.isArray(data.alcohol) ? data.alcohol.join(', ') : '';

  sheet.appendRow([
    new Date(),
    data.name || '',
    attendance,
    alcohol
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
