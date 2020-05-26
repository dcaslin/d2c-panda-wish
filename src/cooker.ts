import { GunRolls, Cache, GunRoll } from './model';
import * as _ from 'lodash';

function mergeRoll(gun1: GunRoll, gun2: GunRoll): GunRoll {
    let mw = null;
    if (gun1.masterwork == gun2.masterwork) {
        mw = gun1.masterwork;
    }
    else if (gun1.masterwork && !gun2.masterwork) {
        mw = gun1.masterwork;
    } else if (gun2.masterwork && !gun1.masterwork) {
        mw = gun2.masterwork;
    } else {
        throw new Error(gun1.masterwork + ' does not match ' + gun2.masterwork);
    }
    return {
        masterwork: mw,
        godPerks: _.union(gun1.godPerks, gun2.godPerks),
        goodPerks: _.union(gun1.goodPerks, gun2.goodPerks)
    }
}

function chooseRoll(gun1: GunRolls, gun2: GunRolls): GunRolls {
    let returnMe = gun1;
    if (gun2.pve.goodPerks.length>gun1.pve.goodPerks.length) {
        returnMe = gun2;
    } 
    console.log(`    Dupe for ${gun1.name}: ${gun1.sheet} vs ${gun2.sheet}. Choosing: ${returnMe.sheet}`);
    return returnMe;
}

function dedupeGuns(allGuns: GunRolls[]): GunRolls[] {
    let gunsByName: { [key: string]: GunRolls } = {};
    let dupeCount = 0;
    // first pass
    for (const gun of allGuns) {
        const tag = gun.name+gun.controller+gun.mnk;
        if (gunsByName[tag] == null) {
            gunsByName[tag] = gun;
        } else {
            const old = gunsByName[tag];
            gunsByName[tag] = chooseRoll(old, gun);
            dupeCount++;
        }
    }
    let deduped = [];
    for (const key of Object.keys(gunsByName)) {
        const gun = gunsByName[key];
        deduped.push(gun);
    }
    gunsByName = {};
    // second pass for mkn+controller legacy vs newer that are split up (Dire Promise)
    for (const gun of deduped) {
        const tag = gun.name+gun.controller;
        if (gunsByName[tag] == null) {
            gunsByName[tag] = gun;
        } else {
            const old = gunsByName[tag];
            gunsByName[tag] = chooseRoll(old, gun);
            dupeCount++;
        }
    }
    deduped = [];
    for (const key of Object.keys(gunsByName)) {
        const gun = gunsByName[key];
        deduped.push(gun);
    }
    gunsByName = {};   
    console.log(`Removed ${dupeCount} duplicates`);
    return deduped;
}

export function cookGuns(allGuns: GunRolls[], db: Cache): GunRolls[] {
    const deduped = dedupeGuns(allGuns);
    return deduped;
}