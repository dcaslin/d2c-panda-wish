import { GunRolls, Cache, GunRoll, InventoryItem } from './model';
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
    if (gun2.pve.goodPerks.length > gun1.pve.goodPerks.length) {
        returnMe = gun2;
    }
    // console.log(`    Dupe for ${gun1.name}: ${gun1.sheet} vs ${gun2.sheet}. Choosing: ${returnMe.sheet}`);
    return returnMe;
}

function dedupeGuns(allGuns: GunRolls[]): GunRolls[] {
    let gunsByName: { [key: string]: GunRolls } = {};
    let dupeCount = 0;
    // first pass
    for (const gun of allGuns) {
        const tag = gun.name + gun.controller + gun.mnk;
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
        const tag = gun.name + gun.controller;
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

function validateGunRoll(gun: GunRolls, roll: GunRoll, perkCandidates: Set<string>, mwCandidates: Set<string>): void {
    const mw = roll.masterwork;
    for (const mw of roll.masterwork) {
        if (!mwCandidates.has(mw)) {
            console.error(`bad mw ${mw}. From ${gun.name} on ${gun.sheet}`);
        }
    }
    for (const perk of roll.godPerks) {
        if (!perkCandidates.has(perk)) {
            console.error(`bad perk ${perk}. From ${gun.name} on ${gun.sheet}`);
        }
    }
    for (const perk of roll.goodPerks) {
        if (!perkCandidates.has(perk)) {
            console.error(`bad perk ${perk}. From ${gun.name} on ${gun.sheet}`);
        }
    }
}

function validateGunRolls(gun: GunRolls, gunCandidates: Set<string>, perkCandidates: Set<string>, mwCandidates: Set<string>): void {
    if (!gunCandidates.has(gun.name)) {
        console.error(`Gun name ${gun.name} is missing. From sheet ${gun.sheet}`);
    }
    validateGunRoll(gun, gun.pve, perkCandidates, mwCandidates);
    validateGunRoll(gun, gun.pvp, perkCandidates, mwCandidates);
}

export function cookGuns(allGuns: GunRolls[], db: Cache): GunRolls[] {
    const perkCandidates = new Set<string>();
    const gunCandidates = new Set<string>();
    const mwCandidates = new Set<string>();

    for (const key of Object.keys(db.InventoryItem)) {
        const ii = db.InventoryItem[key];
        // possible perk, bucket type consumable
        if (ii.inventory.bucketTypeHash == 1469714392 || ii.inventory.bucketTypeHash==3313201758) {
            perkCandidates.add(ii.displayProperties.name.toLowerCase());
        } else if (ii.inventory.bucketTypeHash == 1498876634 ||
            ii.inventory.bucketTypeHash == 2465295065 ||
            ii.inventory.bucketTypeHash == 953998645) {
            gunCandidates.add(ii.displayProperties.name.toLowerCase());
        }
    }

    for (const key of Object.keys(db.Stat)) {
        const stat = db.Stat[key];
        mwCandidates.add(stat.displayProperties.name.toLowerCase());
    }
    const deduped = dedupeGuns(allGuns);

    for (const gun of deduped) {
        validateGunRolls(gun, gunCandidates, perkCandidates, mwCandidates);
    }

    return deduped;
}
