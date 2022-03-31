import Excel from "exceljs";

export async function exportExcel(data: Array<any>, filename: string) {
  if( !Array.isArray(data) || data.length === 0 ){
    return;
  }
  
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet(filename);
  
  const keys = Object.keys(data[0].toJSON());

  const template = keys.map(k => {
    return {header: k.toUpperCase(), key: k, width: 25}
  });

  worksheet.columns = template;
  worksheet.addRows(data);
  const file = workbook.xlsx.writeBuffer();

  return file;
}
