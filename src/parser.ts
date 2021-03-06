import csvToJson from 'csvtojson';
import { CsvRow, GunRoll, GunRolls, SheetDef } from './model';

function isEmpty(s: string): boolean {
    if (s==null || s.trim().length == 0 || s.toLowerCase()=='n/a') {
        return true;
    }
    return false;
}

function appendPerks(roll: GunRoll, data: string): void {
    if (isEmpty(data)) return;
    data = data.toLowerCase();
    if (data.startsWith('any - ')) {
        data = data.substr('any - '.length);
    }
    const perks = data.split(', ');
    let firstDone = false;
    for (const perk of perks) {
        if (!firstDone) {
            roll.greatPerks.push(perk);
            firstDone = true;
        } else {
            roll.goodPerks.push(perk);
        }
    }
}

function grabMw(mwString: string): string[] {
    if (isEmpty(mwString)){ 
        return [];
    }
    mwString = mwString.toLowerCase();
    const mws = mwString.split(' or ');
    const returnMe = [];
    for (let mw of mws) {
        mw = mw.trim();
        if ('reload' == mw) {
            returnMe.push('reload speed');
        } else {
            returnMe.push(mw);
        }
    }
    return returnMe;
}

function parseRoll(row: CsvRow): GunRoll {
    const roll: GunRoll = {
        masterwork: grabMw(row.field9),
        greatPerks: [],
        goodPerks: []
    }
    appendPerks(roll, row.field5);
    appendPerks(roll, row.field6);
    appendPerks(roll, row.field7);
    appendPerks(roll, row.field8);
    return roll;
}

function parseGun(sheet: SheetDef, pveRow: CsvRow, pvpRow: CsvRow): GunRolls {
    let name = pveRow.field1.toLowerCase();
    
    if (name.endsWith(' 1610')) {
        name = name.substring(0, name.length - ' 1610'.length);
    }
    if (name.endsWith(' 1410')) {
        name = name.substring(0, name.length - ' 1410'.length);
    }
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
        if (curRow.field10 && curRow.field10.toLowerCase()=='pve') {
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