import csvToJson from 'csvtojson';
import { CsvRow, SheetDef, GunRolls, Cache, GunRoll } from './model';

function isEmpty(s: string): boolean {
    if (s==null || s.trim().length == 0 || s.toLowerCase()=='n/a') {
        return true;
    }
    return false;
}

function appendPerks(roll: GunRoll, data: string): void {
    if (isEmpty(data)) return;
    data = data.toLowerCase();
    const perks = data.split(', ');
    let firstDone = false;
    for (const perk of perks) {
        if (!firstDone) {
            roll.godPerks.push(perk);
            firstDone = true;
        } else {
            roll.goodPerks.push(perk);
        }
    }
}

function parseRoll(row: CsvRow): GunRoll {
    const roll: GunRoll = {
        masterwork: isEmpty(row.field9)?null: row.field9.toLowerCase(),
        godPerks: [],
        goodPerks: []
    }
    appendPerks(roll, row.field5);
    appendPerks(roll, row.field6);
    appendPerks(roll, row.field7);
    appendPerks(roll, row.field8);
    return roll;
}

function parseGun(sheet: SheetDef, pveRow: CsvRow, pvpRow: CsvRow): GunRolls {
    const name = pveRow.field1;
    const pveRoll = parseRoll(pveRow);
    const pvpRoll = parseRoll(pvpRow);
    const returnMe: GunRolls = {
        name: name,
        sheet: sheet.name,
        pve: pveRoll,
        pvp: pvpRoll,
        mnk: sheet.mnk, 
        controller: sheet.controller
    }
   
    return returnMe;
}

export async function parseSheet(sheetDef: SheetDef, csvString: string): Promise<GunRolls[]> {
    console.log('Parsing: '+sheetDef.name);
    const jsonObj = await csvToJson({
        noheader: true
    }).fromString(csvString);
    // console.dir(jsonObj);
    let count = 0;
    const guns: GunRolls[] = [];
    for (let i =0 ; i< (jsonObj.length-1); i++) {
        const curRow = jsonObj[i];
        const nextRow = jsonObj[i+1];
        if (curRow.field10.toLowerCase()=='pve') {
            if (nextRow.field10.toLowerCase()=='pvp') {
                // nothing
                const gun = parseGun(sheetDef, curRow, nextRow);
                guns.push(gun);
                count++;
                i++; // skip next row, we already used it
            } else {
                console.log('Problem!');
                console.dir(curRow);
                console.dir(nextRow);
            }
        }

    }
    console.log('Found: '+count);
   
    return guns;
}