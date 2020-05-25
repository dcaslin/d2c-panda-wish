import fs from 'fs';
import { Cache, SheetDef } from './model';
import axios, { AxiosInstance } from 'axios';

async function loadManifest(): Promise<Cache> {
    const sManifest = await fs.promises.readFile('./data/destiny2.json', "utf8");
    const db: Cache = JSON.parse(sManifest);
    return db;
}

const DOC_ID = '1UlPqO4koKRcqMxl2VO4JzdgkKyY7LW07W0k91S_Yl8U';
const SHEETS: SheetDef[] = [
    {
        name: 'warmin',
        id: '1887133722',
        controller: true,
        mnk: true
    },
    {
        name: 'forsaken',
        id: '454784100',
        controller: true,
        mnk: true
    },
    {
        name: 'outlaw',
        id: '1048378745',
        controller: true,
        mnk: true
    },
    {
        name: 'forge',
        id: '1040045404',
        controller: true,
        mnk: true
    }, {
        name: 'drifter',
        id: '1699940197',
        controller: true,
        mnk: true
    }, {
        name: 'opulence',
        id: '186668623',
        controller: true,
        mnk: true
    }, {
        name: 'undying',
        id: '2008495226',
        controller: true,
        mnk: true
    }, {
        name: 'dawn - mnk ',
        id: '366622822',
        controller: false,
        mnk: true
    }, {
        name: 'dawn - controller',
        id: '1051377705',
        controller: true,
        mnk: false
    },
    {
        name: 'worthy - mnk',
        id: '868628670',
        controller: true,
        mnk: false
    }, {
        name: 'worthy - controller',
        id: '964017795',
        controller: true,
        mnk: false
    }
];


async function downloadSheet(ax: AxiosInstance, sd: SheetDef): Promise<string> {
    // "https://docs.google.com/spreadsheets/d/<document_id>/export?format=csv&gid=<sheet_id>"

    const url = `https://docs.google.com/spreadsheets/d/${DOC_ID}/export?format=csv&gid=${sd.id}`;
    console.log(url);
    const resp = await ax.get(url, {
        responseType: 'text'
    });
    console.log(resp.data);
    return resp.data;

}

async function downloadSpreadSheet() {

    const ax = axios.create({
        timeout: 10000
    });
    if (!fs.existsSync('./tmp/')){
        fs.mkdirSync('./tmp/');
    }
    for (const sd of SHEETS) {
        const csv = await downloadSheet(ax, sd);
        await fs.promises.writeFile('./tmp/'+sd.name+".csv", csv);
    }
}

async function run() {
    console.log("start");
    try {
        console.log("run");
        const cache = loadManifest();

        await downloadSpreadSheet();


    } catch (exc) {
        console.dir(exc);
    } finally {
        console.log("done");
    }
}

console.log("2");
run();