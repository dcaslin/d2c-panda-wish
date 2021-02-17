import axios, { AxiosInstance } from 'axios';
import fs from 'fs';
import { cookGuns, validateGuns } from './cooker';
import { Cache, GunRolls, SheetDef } from './model';
import { parseSheet } from './parser';

async function loadManifest(): Promise<Cache> {
    const sManifest = await fs.promises.readFile('./data/destiny2.json', 'utf8');
    const db: Cache = JSON.parse(sManifest);
    return db;
}

const DOC_ID = '1UlPqO4koKRcqMxl2VO4JzdgkKyY7LW07W0k91S_Yl8U'; // panda
// const DOC_ID = '1G9Lwd-cuBPyY9MdElm3V35SJwdUB7YSsJJTf3s0qwDc'; //d2c
// const DOC_ID = '12_h3BPhajJItfVeTtjAuthN3TuLHBmjnTJXqnfWGNHI'; // Panda WIP
 
const SHEETS: SheetDef[] = [
    {
        name: 'crucible',
        id: '118580353',
        // id: '962067997',
        controller: true,
        mnk: true
    },
    {
        name: 'factions',
        id: '314004979', //1848110149
        // id: '1848110149', //1848110149
        controller: true,
        mnk: true
    },
    {
        name: 'gunsmith',
        id: '1805549613', //239833402
        // id: '239833402', //239833402
        controller: true,
        mnk: true
    },
    {
        name: 'iron-banner',
        id: '1886264796', //1451426902
        // id: '1451426902', //1451426902
        controller: true,
        mnk: true
    },
    {
        name: 'leviathan',
        id: '548389956', //462612581
        // id: '462612581', //462612581
        controller: true,
        mnk: true
    },
    {
        name: 'trials-nine',
        id: '1719954219', //1724140575
        // id: '1724140575', //1724140575
        controller: true,
        mnk: true
    },
    {
        name: 'vanguard',
        id: '1180559530',  //0
        // id: '0',  //0
        controller: true,
        mnk: true
    },
    {
        name: 'world',
        id: '2054777441', //1334420466
        // id: '1334420466', //1334420466
        controller: true,
        mnk: true
    },
    {
        name: 'CoO',
        id: '1581709148', //1796461492
        // id: '1796461492', //1796461492
        controller: true,
        mnk: true
    },
    {
        name: 'warmind',
        id: '1887133722', //2059088939
        // id: '2059088939', //2059088939
        controller: true,
        mnk: true
    },
    {
        name: 'forsaken',
        id: '454784100', //521791848
        // id: '521791848', //521791848
        controller: true,
        mnk: true
    },
    {
        name: 'outlaw',
        id: '1048378745', //1941010486
        // id: '1941010486', //1941010486
        controller: true,
        mnk: true
    },
    {
        name: 'forge',
        id: '1040045404', //639950378
        // id: '639950378', //639950378
        controller: true,
        mnk: true
    }, {
        name: 'drifter',
        id: '1699940197', //1410036383
        // id: '1410036383', //1410036383
        controller: true,
        mnk: true
    }, {
        name: 'opulence',
        id: '186668623', //2105660371
        // id: '2105660371', //2105660371
        controller: true,
        mnk: true
    }, {
        name: 'undying',
        id: '2008495226', //341176218
        // id: '341176218', //341176218
        controller: true,
        mnk: true
    }, {
        name: 'dawn - mnk ',
        id: '366622822', //1520339200
        // id: '1520339200', //1520339200
        controller: false,
        mnk: true
    }, {
        name: 'dawn - controller',
        id: '1051377705', //1421445099
        // id: '1421445099', //1421445099
        controller: true,
        mnk: false
    },
    {
        name: 'worthy - mnk',
        id: '868628670', //2143094443
        // id: '2143094443', //2143094443
        controller: false,
        mnk: true
    }, {
        name: 'worthy - controller',
        id: '964017795', //417047554
        // id: '417047554', //417047554
        controller: true,
        mnk: false
    }, 
    {
        name: 'arrivals - mnk',
        id: '50657812', //656190151
        // id: '656190151', //656190151
        controller: false,
        mnk: true
    }, 
    {
        name: 'arrivals - controller',
        id: '997388828', //245264734
        // id: '245264734', //245264734
        controller: true,
        mnk: false
    },
    {
        // overrideDocId: '12_h3BPhajJItfVeTtjAuthN3TuLHBmjnTJXqnfWGNHI',
        name: 'hunt - mnk',
        // id: '167346674', //222338306
        id: '222338306', //222338306
        controller: false,
        mnk: true
    },
    {
        // overrideDocId: '12_h3BPhajJItfVeTtjAuthN3TuLHBmjnTJXqnfWGNHI',
        name: 'hunt - controller',
        // id: '119709700', //1725410347
        id: '1725410347', // prod
        controller: true,
        mnk: false
    } ,
    {
        overrideDocId: '12_h3BPhajJItfVeTtjAuthN3TuLHBmjnTJXqnfWGNHI',
        name: 'chosen - mnk',        
        id: '823480562', 
        controller: false,
        mnk: true
    },
    {
        overrideDocId: '12_h3BPhajJItfVeTtjAuthN3TuLHBmjnTJXqnfWGNHI',
        name: 'chosen - controller',
        id: '1910720411', // prod
        controller: true,
        mnk: false
    } 
];


async function downloadSheet(ax: AxiosInstance, sd: SheetDef): Promise<string> {
    // "https://docs.google.com/spreadsheets/d/<document_id>/export?format=csv&gid=<sheet_id>"

    let url = `https://docs.google.com/spreadsheets/d/${DOC_ID}/export?format=csv&gid=${sd.id}`;
    if (sd.overrideDocId) {
        console.log('Using override DOC ID');
        url = `https://docs.google.com/spreadsheets/d/${sd.overrideDocId}/export?format=csv&gid=${sd.id}`;
    }
    console.log('Downloading: ' + url);
    const resp = await ax.get(url, {
        responseType: 'text'
    });
    return resp.data;

}

async function downloadSpreadSheet(db: Cache) {
    const ax = axios.create({
        timeout: 10000
    });
    if (!fs.existsSync('./tmp/')) {
        fs.mkdirSync('./tmp/');
    }
    let count = 0;
    let allGuns: GunRolls[] = [];
    let problems = 0;
    const errMsgs: string[] = [];
    for (const sd of SHEETS) {
        // use temp files to not hammer google sheets URL while testing
        // let csv;
        // const fileName = './tmp/' + sd.id + '.csv';
        // if (fs.existsSync(fileName)) {
            // const csv = fs.readFileSync(fileName, 'utf-8');
            // console.log('Found: ' + fileName + ' for ' + sd.name);
        // } else {
            const csv = await downloadSheet(ax, sd);
            await fs.promises.writeFile('./tmp/' + sd.name + '.csv', csv);
            await fs.promises.writeFile('./tmp/' + sd.id + '.csv', csv);
        // }
        const guns = await parseSheet(sd, csv);
        // check early
        problems += validateGuns(sd, guns, db, errMsgs);
        allGuns = allGuns.concat(guns);
        count += guns.length;

    }
    console.log('Total: ' + count);
    if (problems > 0) {
        console.log(`xxxxx There are ${problems} problems to correct`);
    } else {
        console.log('***** Sheets are all perfect!');
    }
    await fs.promises.writeFile('./tmp/allGuns.json', JSON.stringify(allGuns, null, 2));
    const cooked = cookGuns(allGuns);

    let allErrors = '';
    for (const s of errMsgs) {
        allErrors += s;
        allErrors += '\n';
    }
    await fs.promises.writeFile('./sheet-errors.txt', allErrors);
    if (problems==0 ) {
        await fs.promises.writeFile('./panda-godrolls.json', JSON.stringify(cooked, null, 2));
        await fs.promises.writeFile('../d2-checklist/src/assets/panda-godrolls.min.json', JSON.stringify(cooked));
    } else {
        await fs.promises.writeFile('./panda-godrolls-with-errors.json', JSON.stringify(cooked, null, 2));
    }
}

async function run() {
    console.log('Starting');
    try {
        const cache = await loadManifest();

        await downloadSpreadSheet(cache);


    } catch (exc) {
        console.dir(exc);
    } finally {
        console.log('Complete');
    }
}
run();