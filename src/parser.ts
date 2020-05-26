import csvToJson from 'csvtojson';
import { SheetDef } from './model';

export async function parseSheet(sheetDef: SheetDef, csvString: string): Promise<number> {
    console.log('Parsing: '+sheetDef.name);
    const jsonObj = await csvToJson({
        noheader: true
    }).fromString(csvString);
    // console.dir(jsonObj);
    let count = 0;
    for (let i =0 ; i< (jsonObj.length-1); i++) {
        const curRow = jsonObj[i];
        const nextRow = jsonObj[i+1];
        if (curRow.field10.toLowerCase()=='pve') {
            if (nextRow.field10.toLowerCase()=='pvp') {
                // nothing
                count++;
            } else {
                console.log('Problem!');
                console.dir(curRow);
                console.dir(nextRow);
            }
        }

    }
    console.log("Found: "+count);
   
    return count;
}