
export interface GunRoll {
  masterwork: string|null,
  godPerks: string[],
  goodPerks: string[]
}

export interface GunRolls {
  name: string;
  sheet: string;
  mnk: boolean;
  controller: boolean;
  pve: GunRoll;
  pvp: GunRoll;
}

export interface CsvRow {
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  field5: string;
  field6: string;
  field7: string;
  field8: string;
  field9: string;
  field10: string;
}


export interface SheetDef {
  name: string;
  id: string;
  controller: boolean;
  mnk: boolean;
}

export interface Cache {
    version?: string;
    Vendor?: any;
    Race?: any;
    Gender?: any;
    EnergyType?: any;
    Class?: any;
    Activity?: any;
    ActivityType?: any;
    ActivityMode?: any;
    Milestone?: any;
    Faction?: any;
    Progression?: any;
    InventoryItem?: { [key: string]: InventoryItem };
    Stat?: any;
    Objective?: { [key: string]: Objective };
    ActivityModifier?: any;
    Perk?: any;
    SocketType?: any;
    PlugSet?: any;
    SocketCategory?: any;
    Checklist?: any;
    InventoryBucket?: any;
    EquipmentSlot?: any;
    PresentationNode?: any;
    Record?: any;
    Collectible?: any;
    ItemTierType?: any;
    HistoricalStats?: any;
    RecordSeasons?: any;
    PursuitTags?: { [key: string]: string[] };
    Season?: { [key: string]: Season };
    SeasonPass?: { [key: string]: SeasonPass };
    TagWeights?:  {[key: string]: number};
  }

  export interface InventoryItem {
    displayProperties: DisplayProperties;
    tooltipNotifications: any[];
    backgroundColor: any;
    itemTypeDisplayName: string;
    uiItemDisplayStyle: string;
    itemTypeAndTierDisplayName: string;
    displaySource: string;
    tooltipStyle: string;
    inventory: any;
    stats: any;
    value: any;
    objectives: Objectives;
    acquireRewardSiteHash: number;
    acquireUnlockHash: number;
    investmentStats: any[];
    perks: any[];
    allowActions: boolean;
    doesPostmasterPullHaveSideEffects: boolean;
    nonTransferrable: boolean;
    itemCategoryHashes: number[];
    specialItemType: number;
    itemType: number;
    itemSubType: number;
    classType: number;
    breakerType: number;
    equippable: boolean;
    defaultDamageType: number;
    isWrapper: boolean;
    hash: number;
    index: number;
    redacted: boolean;
    blacklisted: boolean;
  }
  
  // part of Inventory Item
  interface Objectives {
    objectiveHashes: number[];
    displayActivityHashes: number[];
    requireFullObjectiveCompletion: boolean;
    questlineItemHash: number;
    narrative: string;
    objectiveVerbName: string;
    questTypeIdentifier: string;
    questTypeHash: number;
    completionRewardSiteHash: number;
    nextQuestStepRewardSiteHash: number;
    timestampUnlockValueHash: number;
    isGlobalObjectiveItem: boolean;
    useOnObjectiveCompletion: boolean;
    inhibitCompletionUnlockValueHash: number;
    perObjectiveDisplayProperties: any[];
  }
  
  // an Objective record looked up from an objective-hash
  export interface Objective {
    displayProperties: DisplayProperties;
    unlockValueHash: number;
    completionValue: number;
    scope: number;
    locationHash: number;
    allowNegativeValue: boolean;
    allowValueChangeWhenCompleted: boolean;
    isCountingDownward: boolean;
    valueStyle: number;
    progressDescription: string;
    perks: any;
    stats: any;
    minimumVisibilityThreshold: number;
    allowOvercompletion: boolean;
    showValueOnComplete: boolean;
    isDisplayOnlyObjective: boolean;
    completedValueStyle: number;
    inProgressValueStyle: number;
    hash: number;
    index: number;
    redacted: boolean;
    blacklisted: boolean;
  }
  
  export interface Season {
    artifactItemHash: string;
    backgroundImagePath: string;
    blacklisted: boolean;
    displayProperties: DisplayProperties;
    endDate: string;
    hash: string;
    index: number;
    redacted: boolean;
    sealPresentationNodeHash: number;
    seasonNumber: number;
    seasonPassHash: string;
    seasonPassProgressionHash: string;
    seasonPassUnlockHash: string;
    startDate: string;
    startTimeInSeconds: string;
  }
  
  export interface SeasonPass {
    blacklisted: boolean;
    displayProperties: DisplayProperties;
    hash: string;
    index: number;
    prestigeProgressionHash: string;
    redacted: boolean;
    rewardProgressionHash: string;
  }
  
  interface DisplayProperties {
    description: string;
    name: string;
    icon: string;
    hasIcon: boolean;
  }
  