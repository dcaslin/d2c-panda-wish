import { Cache, GunRoll, GunRolls, SheetDef } from './model';

function chooseRoll(gun1: GunRolls, gun2: GunRolls): GunRolls {
    let returnMe = gun1;
    if (gun2.pve.goodPerks.length > gun1.pve.goodPerks.length) {
        returnMe = gun2;
    }
    return returnMe;
}

function dedupeGuns(allGuns: GunRolls[]): GunRolls[] {
    let gunsByName: { [key: string]: GunRolls } = {};
    let dupeCount = 0;
    // first pass
    for (const gun of allGuns) {
        const tag = gun.name + gun.version + gun.controller + gun.mnk;        
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
        const tag = gun.name + gun.version + gun.controller;
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

function validateGunRoll(gun: GunRolls, roll: GunRoll, 
    perkCandidates: Set<string>, 
    mwCandidates: Set<string>,
    errorMsgs: string[]): number {
    let problems = 0;
    for (const mw of roll.masterwork) {
        if (!mwCandidates.has(mw)) {
            const msg = `Bad MW: ${mw} | From ${gun.name} on ${gun.sheet}`;
            errorMsgs.push(msg);
            console.log('xxxxx ' + msg);
            problems++;
        }
    }
    for (const perk of roll.greatPerks) {
        if (!perkCandidates.has(perk)) {
            const msg = `Bad perk: ${perk} | From ${gun.name} on ${gun.sheet}`;
            errorMsgs.push(msg);
            console.log('xxxxx ' + msg);
            problems++;
        }
    }
    for (const perk of roll.goodPerks) {
        if (!perkCandidates.has(perk)) {
            const msg = `Bad perk: ${perk} | From ${gun.name} on ${gun.sheet}`;
            errorMsgs.push(msg);
            console.log('xxxxx ' + msg);
            problems++;
        }
    }
    return problems;
}

function validateGunRolls(gun: GunRolls, gunCandidates: Set<string>, 
    perkCandidates: Set<string>, mwCandidates: Set<string>,
    errorMsgs: string[]): number {
    let problems = 0;
    if (!gunCandidates.has(gun.name)) {
        const msg = `Gun name missing: ${gun.name} | From sheet ${gun.sheet}`;
        console.log('xxxxx ' + msg);
        errorMsgs.push(msg);
        problems++;
    }
    problems+= validateGunRoll(gun, gun.pve, perkCandidates, mwCandidates, errorMsgs);
    problems+= validateGunRoll(gun, gun.pvp, perkCandidates, mwCandidates, errorMsgs);
    return problems;
}

export function validateGuns(sd:SheetDef, allGuns: GunRolls[], db: Cache, errMsgs: string[]): number {
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

    let problems = 0;
    for (const gun of allGuns) {
        problems+=validateGunRolls(gun, gunCandidates, perkCandidates, mwCandidates, errMsgs);
    }
    if (problems > 0) {
        const msg = `--- Sheet ${sd.name} has ${problems} problems to correct.---`;
        console.log('xxxxx '+msg); 
    } else {
        console.log(`***** Sheet ${sd.name} is perfect!`);
    }
    return problems;

}

export function cookGuns(allGuns: GunRolls[]): GunRolls[] {

    const deduped = dedupeGuns(allGuns);
    return deduped;
}
