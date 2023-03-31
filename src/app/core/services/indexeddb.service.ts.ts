import Dexie, { Table } from 'dexie';
import { Injectable } from '@angular/core';
import { IColor, IPartsList } from 'src/app/models/parts-list';

@Injectable()
export class IndexedDBService extends Dexie {
  partsLists!: Table<IPartsList, string>;
  partLists!: Table<any, string>;
  colors!: Table<IColor>;

  constructor() {
    super('brickhunterDB');
    this.version(1).stores({
      partsLists: 'uuid',
      partLists: '',
    });
    this.version(2)
      .stores({
        partsLists: 'uuid',
        partLists: '',
        colors: 'id',
      })
      .upgrade(transaction => {
        this.colors.bulkAdd(colorsInit);
      });
  }
}

const colorsInit: IColor[] = [
  {
    id: -1,
    name: '[Unknown]',
    rgb: '0033B2',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [
          0, 28, 29, 30, 31, 32, 33, 34, 60, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149,
          150, 151, 152, 153, 154, 156, 157, 160, 162, 163, 169,
        ],
        extDescrs: [
          'Not Applicable',
          'Modulex Medium Stone Gray',
          'Modulex Charcoal Gray',
          'Modulex Orange',
          'Modulex Ochre Yellow',
          'Modulex Olive Green',
          'Modulex Pastel Green',
          'Modulex Tile Blue',
          'Fabuland Orange',
          'Modulex Aqua Green',
          'Modulex Black',
          'Modulex Brown',
          'Modulex Buff',
          'Modulex Clear',
          'Modulex Lemon',
          'Modulex Light Gray',
          'Modulex Light Orange',
          'Modulex Light Yellow',
          'Modulex Medium Blue',
          'Modulex Pastel Blue',
          'Modulex Pink',
          'Modulex Pink Red',
          'Modulex Red',
          'Modulex Teal Blue',
          'Modulex Terracotta',
          'Modulex Tile Brown',
          'Modulex Tile Gray',
          'Modulex Violet',
          'Modulex White',
          'Warm Yellowish Orange',
          'Medium Yellowish Orange',
          'Dark Nougat',
          'Transparent Fire Yellow',
          'Transparent Light Royal Blue',
          'Curry',
        ],
      },
      lDraw: {
        extIds: [16, 24, 65, 66, 67, 273, 324, 375, 406, 449, 490, 493, 494, 495, 496, 504, 511],
        extDescrs: [
          'Main_Colour',
          'Edge_Colour',
          'Rubber_Yellow',
          'Rubber_Trans_Yellow',
          'Rubber_Trans_Clear',
          'Rubber_Blue',
          'Rubber_Red',
          'Rubber_Light_Gray',
          'Rubber_Dark_Blue',
          'Rubber_Purple',
          'Rubber_Lime',
          'Magnet',
          'Electric_Contact_Alloy',
          'Electric_Contact_Copper',
          'Rubber_Light_Bluish_Gray',
          'Rubber_Flat_Silver',
          'Rubber_White',
        ],
      },
      lego: {
        extIds: [125, 158],
        extDescrs: ['Light Orange', 'Tr. Flu. Red'],
      },
    },
  },
  {
    id: 0,
    name: 'Black',
    rgb: '05131D',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [11],
        extDescrs: ['Black'],
      },
      brickOwl: {
        extIds: [38],
        extDescrs: ['Black'],
      },
      lDraw: {
        extIds: [0, 256],
        extDescrs: ['Black', 'Rubber_Black'],
      },
      lego: {
        extIds: [26, 1012],
        extDescrs: ['Black', 'CONDUCT. BLACK'],
      },
    },
  },
  {
    id: 1,
    name: 'Blue',
    rgb: '0055BF',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [7],
        extDescrs: ['Blue'],
      },
      brickOwl: {
        extIds: [39],
        extDescrs: ['Blue'],
      },
      lDraw: {
        extIds: [1],
        extDescrs: ['Blue'],
      },
      lego: {
        extIds: [23],
        extDescrs: ['Bright Blue'],
      },
    },
  },
  {
    id: 2,
    name: 'Green',
    rgb: '237841',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [6],
        extDescrs: ['Green'],
      },
      brickOwl: {
        extIds: [61],
        extDescrs: ['Green'],
      },
      lDraw: {
        extIds: [2],
        extDescrs: ['Green'],
      },
      lego: {
        extIds: [28],
        extDescrs: ['Dark green'],
      },
    },
  },
  {
    id: 3,
    name: 'Dark Turquoise',
    rgb: '008F9B',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [39],
        extDescrs: ['Dark Turquoise'],
      },
      brickOwl: {
        extIds: [58],
        extDescrs: ['Dark Turquoise'],
      },
      lDraw: {
        extIds: [3],
        extDescrs: ['Dark_Turquoise'],
      },
      lego: {
        extIds: [107],
        extDescrs: ['Bright bluish green'],
      },
    },
  },
  {
    id: 4,
    name: 'Red',
    rgb: 'C91A09',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [5],
        extDescrs: ['Red'],
      },
      brickOwl: {
        extIds: [81],
        extDescrs: ['Red'],
      },
      lDraw: {
        extIds: [4],
        extDescrs: ['Red'],
      },
      lego: {
        extIds: [21],
        extDescrs: ['Bright red'],
      },
    },
  },
  {
    id: 5,
    name: 'Dark Pink',
    rgb: 'C870A0',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [47],
        extDescrs: ['Dark Pink'],
      },
      brickOwl: {
        extIds: [17],
        extDescrs: ['Dark Pink'],
      },
      lDraw: {
        extIds: [5],
        extDescrs: ['Dark_Pink'],
      },
      lego: {
        extIds: [221],
        extDescrs: ['Bright Purple'],
      },
    },
  },
  {
    id: 6,
    name: 'Brown',
    rgb: '583927',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [8],
        extDescrs: ['Brown'],
      },
      brickOwl: {
        extIds: [46],
        extDescrs: ['Brown'],
      },
      lDraw: {
        extIds: [6],
        extDescrs: ['Brown'],
      },
      lego: {
        extIds: [25, 217],
        extDescrs: ['Earth Orange', 'Brown'],
      },
    },
  },
  {
    id: 7,
    name: 'Light Gray',
    rgb: '9BA19D',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [9],
        extDescrs: ['Light Gray'],
      },
      brickOwl: {
        extIds: [66],
        extDescrs: ['Light Gray'],
      },
      lDraw: {
        extIds: [7],
        extDescrs: ['Light_Gray'],
      },
      lego: {
        extIds: [2],
        extDescrs: ['Grey'],
      },
    },
  },
  {
    id: 8,
    name: 'Dark Gray',
    rgb: '6D6E5C',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [10],
        extDescrs: ['Dark Gray'],
      },
      brickOwl: {
        extIds: [53],
        extDescrs: ['Dark Gray'],
      },
      lDraw: {
        extIds: [8],
        extDescrs: ['Dark_Gray'],
      },
      lego: {
        extIds: [27],
        extDescrs: ['Dark grey'],
      },
    },
  },
  {
    id: 9,
    name: 'Light Blue',
    rgb: 'B4D2E3',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [62],
        extDescrs: ['Light Blue'],
      },
      brickOwl: {
        extIds: [63],
        extDescrs: ['Light Blue'],
      },
      lDraw: {
        extIds: [9],
        extDescrs: ['Light_Blue'],
      },
      lego: {
        extIds: [45],
        extDescrs: ['Light blue'],
      },
    },
  },
  {
    id: 10,
    name: 'Bright Green',
    rgb: '4B9F4A',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [36],
        extDescrs: ['Bright Green'],
      },
      brickOwl: {
        extIds: [41],
        extDescrs: ['Bright Green'],
      },
      lDraw: {
        extIds: [10],
        extDescrs: ['Bright_Green'],
      },
      lego: {
        extIds: [37],
        extDescrs: ['Bright Green'],
      },
    },
  },
  {
    id: 11,
    name: 'Light Turquoise',
    rgb: '55A5AF',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [40],
        extDescrs: ['Light Turquoise'],
      },
      brickOwl: {
        extIds: [12],
        extDescrs: ['Light Turquoise'],
      },
      lDraw: {
        extIds: [11],
        extDescrs: ['Light_Turquoise'],
      },
      lego: {
        extIds: [116],
        extDescrs: ['Med. bluish green'],
      },
    },
  },
  {
    id: 12,
    name: 'Salmon',
    rgb: 'F2705E',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [25],
        extDescrs: ['Salmon'],
      },
      brickOwl: {
        extIds: [84],
        extDescrs: ['Salmon'],
      },
      lDraw: {
        extIds: [12],
        extDescrs: ['Salmon'],
      },
      lego: {
        extIds: [4],
        extDescrs: ['Brick Red'],
      },
    },
  },
  {
    id: 13,
    name: 'Pink',
    rgb: 'FC97AC',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [23],
        extDescrs: ['Pink'],
      },
      brickOwl: {
        extIds: [3],
        extDescrs: ['Pink'],
      },
      lDraw: {
        extIds: [13],
        extDescrs: ['Pink'],
      },
      lego: {
        extIds: [1007],
        extDescrs: ['L.REDVIOL'],
      },
    },
  },
  {
    id: 14,
    name: 'Yellow',
    rgb: 'F2CD37',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [3],
        extDescrs: ['Yellow'],
      },
      brickOwl: {
        extIds: [93],
        extDescrs: ['Yellow'],
      },
      lDraw: {
        extIds: [14],
        extDescrs: ['Yellow'],
      },
      lego: {
        extIds: [24],
        extDescrs: ['Bright yellow'],
      },
    },
  },
  {
    id: 15,
    name: 'White',
    rgb: 'FFFFFF',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [1],
        extDescrs: ['White'],
      },
      brickOwl: {
        extIds: [92],
        extDescrs: ['White'],
      },
      lDraw: {
        extIds: [15],
        extDescrs: ['White'],
      },
      lego: {
        extIds: [1],
        extDescrs: ['White'],
      },
    },
  },
  {
    id: 17,
    name: 'Light Green',
    rgb: 'C2DAB8',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [38],
        extDescrs: ['Light Green'],
      },
      brickOwl: {
        extIds: [11],
        extDescrs: ['Light Green'],
      },
      lDraw: {
        extIds: [17],
        extDescrs: ['Light_Green'],
      },
      lego: {
        extIds: [6],
        extDescrs: ['Light green'],
      },
    },
  },
  {
    id: 18,
    name: 'Light Yellow',
    rgb: 'FBE696',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [33],
        extDescrs: ['Light Yellow'],
      },
      brickOwl: {
        extIds: [9],
        extDescrs: ['Light Yellow'],
      },
      lDraw: {
        extIds: [18],
        extDescrs: ['Light_Yellow'],
      },
      lego: {
        extIds: [3],
        extDescrs: ['Light yellow'],
      },
    },
  },
  {
    id: 19,
    name: 'Tan',
    rgb: 'E4CD9E',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [2],
        extDescrs: ['Tan'],
      },
      brickOwl: {
        extIds: [89],
        extDescrs: ['Tan'],
      },
      lDraw: {
        extIds: [19],
        extDescrs: ['Tan'],
      },
      lego: {
        extIds: [5],
        extDescrs: ['Brick yellow'],
      },
    },
  },
  {
    id: 20,
    name: 'Light Violet',
    rgb: 'C9CAE2',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [44],
        extDescrs: ['Light Violet'],
      },
      brickOwl: {
        extIds: [16],
        extDescrs: ['Light Violet'],
      },
      lDraw: {
        extIds: [20],
        extDescrs: ['Light_Violet'],
      },
      lego: {
        extIds: [39],
        extDescrs: ['Light bluish violet'],
      },
    },
  },
  {
    id: 21,
    name: 'Glow In Dark Opaque',
    rgb: 'D4D5C9',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [46],
        extDescrs: ['Glow In Dark Opaque'],
      },
      brickOwl: {
        extIds: [127],
        extDescrs: ['Glow in the Dark Opaque'],
      },
      lDraw: {
        extIds: [21],
        extDescrs: ['Glow_In_Dark_Opaque'],
      },
      lego: {
        extIds: [50],
        extDescrs: ['Phosp. White'],
      },
    },
  },
  {
    id: 22,
    name: 'Purple',
    rgb: '81007B',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [24],
        extDescrs: ['Purple'],
      },
      brickOwl: {
        extIds: [4],
        extDescrs: ['Purple'],
      },
      lDraw: {
        extIds: [22],
        extDescrs: ['Purple'],
      },
      lego: {
        extIds: [104],
        extDescrs: ['Bright violet'],
      },
    },
  },
  {
    id: 23,
    name: 'Dark Blue-Violet',
    rgb: '2032B0',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [109],
        extDescrs: ['Dark Blue-Violet'],
      },
      brickOwl: {
        extIds: [49],
        extDescrs: ['Dark Royal Blue'],
      },
      lDraw: {
        extIds: [23],
        extDescrs: ['Dark_Blue_Violet'],
      },
      lego: {
        extIds: [196],
        extDescrs: ['Dark Royal blue'],
      },
    },
  },
  {
    id: 25,
    name: 'Orange',
    rgb: 'FE8A18',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [4],
        extDescrs: ['Orange'],
      },
      brickOwl: {
        extIds: [80],
        extDescrs: ['Orange'],
      },
      lDraw: {
        extIds: [25],
        extDescrs: ['Orange'],
      },
      lego: {
        extIds: [106],
        extDescrs: ['Bright orange'],
      },
    },
  },
  {
    id: 26,
    name: 'Magenta',
    rgb: '923978',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [71],
        extDescrs: ['Magenta'],
      },
      brickOwl: {
        extIds: [72],
        extDescrs: ['Magenta'],
      },
      lDraw: {
        extIds: [26],
        extDescrs: ['Magenta'],
      },
      lego: {
        extIds: [124],
        extDescrs: ['Bright reddish violet'],
      },
    },
  },
  {
    id: 27,
    name: 'Lime',
    rgb: 'BBE90B',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [34],
        extDescrs: ['Lime'],
      },
      brickOwl: {
        extIds: [70],
        extDescrs: ['Lime'],
      },
      lDraw: {
        extIds: [27],
        extDescrs: ['Lime'],
      },
      lego: {
        extIds: [119],
        extDescrs: ['Br. yellowish green'],
      },
    },
  },
  {
    id: 28,
    name: 'Dark Tan',
    rgb: '958A73',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [69],
        extDescrs: ['Dark Tan'],
      },
      brickOwl: {
        extIds: [57],
        extDescrs: ['Dark Tan'],
      },
      lDraw: {
        extIds: [28],
        extDescrs: ['Dark_Tan'],
      },
      lego: {
        extIds: [138],
        extDescrs: ['Sand yellow'],
      },
    },
  },
  {
    id: 29,
    name: 'Bright Pink',
    rgb: 'E4ADC8',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [104],
        extDescrs: ['Bright Pink'],
      },
      brickOwl: {
        extIds: [45],
        extDescrs: ['Bright Pink'],
      },
      lDraw: {
        extIds: [29],
        extDescrs: ['Bright_Pink'],
      },
      lego: {
        extIds: [222],
        extDescrs: ['Light Purple'],
      },
    },
  },
  {
    id: 30,
    name: 'Medium Lavender',
    rgb: 'AC78BA',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [157],
        extDescrs: ['Medium Lavender'],
      },
      brickOwl: {
        extIds: [76],
        extDescrs: ['Medium Lavender'],
      },
      lDraw: {
        extIds: [30],
        extDescrs: ['Medium_Lavender'],
      },
      lego: {
        extIds: [324],
        extDescrs: ['Medium Lavender'],
      },
    },
  },
  {
    id: 31,
    name: 'Lavender',
    rgb: 'E1D5ED',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [154],
        extDescrs: ['Lavender'],
      },
      brickOwl: {
        extIds: [36],
        extDescrs: ['Lavender'],
      },
      lDraw: {
        extIds: [31],
        extDescrs: ['Lavender'],
      },
      lego: {
        extIds: [325],
        extDescrs: ['Lavender'],
      },
    },
  },
  {
    id: 32,
    name: 'Trans-Black IR Lens',
    rgb: '635F52',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [32],
        extDescrs: ['Trans_Black_IR_Lens'],
      },
      lego: {
        extIds: [109, 355],
        extDescrs: ['Black IR', 'Tr.Black IR'],
      },
    },
  },
  {
    id: 33,
    name: 'Trans-Dark Blue',
    rgb: '0020A0',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [14],
        extDescrs: ['Trans-Dark Blue'],
      },
      brickOwl: {
        extIds: [98],
        extDescrs: ['Transparent Dark Blue'],
      },
      lDraw: {
        extIds: [33],
        extDescrs: ['Trans_Dark_Blue'],
      },
      lego: {
        extIds: [43],
        extDescrs: ['Tr. Blue'],
      },
    },
  },
  {
    id: 34,
    name: 'Trans-Green',
    rgb: '84B68D',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [20],
        extDescrs: ['Trans-Green'],
      },
      brickOwl: {
        extIds: [100],
        extDescrs: ['Transparent Green'],
      },
      lDraw: {
        extIds: [34],
        extDescrs: ['Trans_Green'],
      },
      lego: {
        extIds: [48],
        extDescrs: ['Tr. Green'],
      },
    },
  },
  {
    id: 35,
    name: 'Trans-Bright Green',
    rgb: 'D9E4A7',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [108],
        extDescrs: ['Trans-Bright Green'],
      },
      brickOwl: {
        extIds: [96],
        extDescrs: ['Transparent Bright Green'],
      },
      lDraw: {
        extIds: [35],
        extDescrs: ['Trans_Bright_Green'],
      },
      lego: {
        extIds: [311],
        extDescrs: ['Transparent Bright Green'],
      },
    },
  },
  {
    id: 36,
    name: 'Trans-Red',
    rgb: 'C91A09',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [17],
        extDescrs: ['Trans-Red'],
      },
      brickOwl: {
        extIds: [108],
        extDescrs: ['Transparent Red'],
      },
      lDraw: {
        extIds: [36],
        extDescrs: ['Trans_Red'],
      },
      lego: {
        extIds: [41],
        extDescrs: ['Tr. Red'],
      },
    },
  },
  {
    id: 40,
    name: 'Trans-Black',
    rgb: '635F52',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [13],
        extDescrs: ['Trans-Black'],
      },
      brickOwl: {
        extIds: [95],
        extDescrs: ['Transparent Black'],
      },
      lDraw: {
        extIds: [40],
        extDescrs: ['Trans_Black'],
      },
      lego: {
        extIds: [111],
        extDescrs: ['Tr. Brown'],
      },
    },
  },
  {
    id: 41,
    name: 'Trans-Light Blue',
    rgb: 'AEEFEC',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [15],
        extDescrs: ['Trans-Light Blue'],
      },
      brickOwl: {
        extIds: [101],
        extDescrs: ['Transparent Light Blue'],
      },
      lDraw: {
        extIds: [43],
        extDescrs: ['Trans_Medium_Blue'],
      },
      lego: {
        extIds: [42],
        extDescrs: ['Tr. Lg blue'],
      },
    },
  },
  {
    id: 42,
    name: 'Trans-Neon Green',
    rgb: 'F8F184',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [16],
        extDescrs: ['Trans-Neon Green'],
      },
      brickOwl: {
        extIds: [103],
        extDescrs: ['Transparent Neon Green'],
      },
      lDraw: {
        extIds: [42],
        extDescrs: ['Trans_Neon_Green'],
      },
      lego: {
        extIds: [49],
        extDescrs: ['Tr. Flu. Green'],
      },
    },
  },
  {
    id: 43,
    name: 'Trans-Very Lt Blue',
    rgb: 'C1DFF0',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [113],
        extDescrs: ['Trans-Aqua'],
      },
      brickOwl: {
        extIds: [25],
        extDescrs: ['Transparent Very Light Blue'],
      },
      lDraw: {
        extIds: [39],
        extDescrs: ['Trans_Light_Blue'],
      },
      lego: {
        extIds: [229],
        extDescrs: ['Transparent Light Bluish Green'],
      },
    },
  },
  {
    id: 45,
    name: 'Trans-Dark Pink',
    rgb: 'DF6695',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [50],
        extDescrs: ['Trans-Dark Pink'],
      },
      brickOwl: {
        extIds: [99],
        extDescrs: ['Transparent Dark Pink'],
      },
      lDraw: {
        extIds: [37],
        extDescrs: ['Trans_Dark_Pink'],
      },
      lego: {
        extIds: [113],
        extDescrs: ['Tr. Medi. reddish violet'],
      },
    },
  },
  {
    id: 46,
    name: 'Trans-Yellow',
    rgb: 'F5CD2F',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [19],
        extDescrs: ['Trans-Yellow'],
      },
      brickOwl: {
        extIds: [109],
        extDescrs: ['Transparent Yellow'],
      },
      lDraw: {
        extIds: [46],
        extDescrs: ['Trans_Yellow'],
      },
      lego: {
        extIds: [44],
        extDescrs: ['Tr. Yellow'],
      },
    },
  },
  {
    id: 47,
    name: 'Trans-Clear',
    rgb: 'FCFCFC',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [12],
        extDescrs: ['Trans-Clear'],
      },
      brickOwl: {
        extIds: [97],
        extDescrs: ['Transparent'],
      },
      lDraw: {
        extIds: [47],
        extDescrs: ['Trans_Clear'],
      },
      lego: {
        extIds: [40],
        extDescrs: ['Transparent'],
      },
    },
  },
  {
    id: 52,
    name: 'Trans-Purple',
    rgb: 'A5A5CB',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [51],
        extDescrs: ['Trans-Purple'],
      },
      brickOwl: {
        extIds: [107],
        extDescrs: ['Transparent Purple'],
      },
      lDraw: {
        extIds: [52],
        extDescrs: ['Trans_Purple'],
      },
      lego: {
        extIds: [126, 236],
        extDescrs: ['Tr. Bright bluish violet', 'TR. BR. RED. LI'],
      },
    },
  },
  {
    id: 54,
    name: 'Trans-Neon Yellow',
    rgb: 'DAB000',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [121],
        extDescrs: ['Trans-Neon Yellow'],
      },
      brickOwl: {
        extIds: [104],
        extDescrs: ['Transparent Neon Yellow'],
      },
      lDraw: {
        extIds: [54],
        extDescrs: ['Trans_Neon_Yellow'],
      },
      lego: {
        extIds: [157],
        extDescrs: ['Transparent Fluorescent Yellow'],
      },
    },
  },
  {
    id: 57,
    name: 'Trans-Neon Orange',
    rgb: 'FF800D',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [18],
        extDescrs: ['Trans-Neon Orange'],
      },
      brickOwl: {
        extIds: [161],
        extDescrs: ['Transparent Neon Reddish Orange'],
      },
      lDraw: {
        extIds: [38],
        extDescrs: ['Trans_Neon_Orange'],
      },
      lego: {
        extIds: [47],
        extDescrs: ['Tr. Flu. Reddish orange'],
      },
    },
  },
  {
    id: 60,
    name: 'Chrome Antique Brass',
    rgb: '645A4C',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [57],
        extDescrs: ['Chrome Antique Brass'],
      },
      brickOwl: {
        extIds: [110],
        extDescrs: ['Chrome Brass'],
      },
      lDraw: {
        extIds: [60],
        extDescrs: ['Chrome_Antique_Brass'],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 61,
    name: 'Chrome Blue',
    rgb: '6C96BF',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [52],
        extDescrs: ['Chrome Blue'],
      },
      brickOwl: {
        extIds: [112],
        extDescrs: ['Chrome Blue'],
      },
      lDraw: {
        extIds: [61],
        extDescrs: ['Chrome_Blue'],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 62,
    name: 'Chrome Green',
    rgb: '3CB371',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [64],
        extDescrs: ['Chrome Green'],
      },
      brickOwl: {
        extIds: [113],
        extDescrs: ['Chrome Green'],
      },
      lDraw: {
        extIds: [62],
        extDescrs: ['Chrome_Green'],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 63,
    name: 'Chrome Pink',
    rgb: 'AA4D8E',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [82],
        extDescrs: ['Chrome Pink'],
      },
      brickOwl: {
        extIds: [114],
        extDescrs: ['Chrome Pink'],
      },
      lDraw: {
        extIds: [63],
        extDescrs: ['Chrome_Pink'],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 64,
    name: 'Chrome Black',
    rgb: '1B2A34',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [122],
        extDescrs: ['Chrome Black'],
      },
      brickOwl: {
        extIds: [111],
        extDescrs: ['Chrome Black'],
      },
      lDraw: {
        extIds: [64],
        extDescrs: ['Chrome_Black'],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 68,
    name: 'Very Light Orange',
    rgb: 'F3CF9B',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [96],
        extDescrs: ['Very Light Orange'],
      },
      brickOwl: {
        extIds: [91],
        extDescrs: ['Very Light Orange'],
      },
      lDraw: {
        extIds: [68],
        extDescrs: ['Very_Light_Orange'],
      },
      lego: {
        extIds: [36],
        extDescrs: ['Light Yellowish Orange'],
      },
    },
  },
  {
    id: 69,
    name: 'Light Purple',
    rgb: 'CD6298',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [93],
        extDescrs: ['Light Purple'],
      },
      brickOwl: {
        extIds: [69],
        extDescrs: ['Light Purple'],
      },
      lDraw: {
        extIds: [69],
        extDescrs: ['Light_Purple'],
      },
      lego: {
        extIds: [198],
        extDescrs: ['Bright Reddish Lilac'],
      },
    },
  },
  {
    id: 70,
    name: 'Reddish Brown',
    rgb: '582A12',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [88],
        extDescrs: ['Reddish Brown'],
      },
      brickOwl: {
        extIds: [82],
        extDescrs: ['Reddish Brown'],
      },
      lDraw: {
        extIds: [70],
        extDescrs: ['Reddish_Brown'],
      },
      lego: {
        extIds: [192],
        extDescrs: ['Reddish Brown'],
      },
    },
  },
  {
    id: 71,
    name: 'Light Bluish Gray',
    rgb: 'A0A5A9',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [86],
        extDescrs: ['Light Bluish Gray'],
      },
      brickOwl: {
        extIds: [64],
        extDescrs: ['Medium Stone Gray'],
      },
      lDraw: {
        extIds: [71],
        extDescrs: ['Light_Bluish_Gray'],
      },
      lego: {
        extIds: [194],
        extDescrs: ['Medium stone grey'],
      },
    },
  },
  {
    id: 72,
    name: 'Dark Bluish Gray',
    rgb: '6C6E68',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [85],
        extDescrs: ['Dark Bluish Gray'],
      },
      brickOwl: {
        extIds: [50],
        extDescrs: ['Dark Stone Gray'],
      },
      lDraw: {
        extIds: [72],
        extDescrs: ['Dark_Bluish_Gray'],
      },
      lego: {
        extIds: [199],
        extDescrs: ['Dark stone grey'],
      },
    },
  },
  {
    id: 73,
    name: 'Medium Blue',
    rgb: '5A93DB',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [42],
        extDescrs: ['Medium Blue'],
      },
      brickOwl: {
        extIds: [14],
        extDescrs: ['Medium Blue'],
      },
      lDraw: {
        extIds: [73],
        extDescrs: ['Medium_Blue'],
      },
      lego: {
        extIds: [102],
        extDescrs: ['Medium blue'],
      },
    },
  },
  {
    id: 74,
    name: 'Medium Green',
    rgb: '73DCA1',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [37],
        extDescrs: ['Medium Green'],
      },
      brickOwl: {
        extIds: [10],
        extDescrs: ['Medium Green'],
      },
      lDraw: {
        extIds: [74],
        extDescrs: ['Medium_Green'],
      },
      lego: {
        extIds: [29],
        extDescrs: ['Medium green'],
      },
    },
  },
  {
    id: 75,
    name: 'Speckle Black-Copper',
    rgb: '05131D',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [116],
        extDescrs: ['Speckle Black-Copper'],
      },
      brickOwl: {
        extIds: [133],
        extDescrs: ['Speckle Black Copper'],
      },
      lDraw: {
        extIds: [75],
        extDescrs: ['Speckle_Black_Copper'],
      },
      lego: {
        extIds: [75],
        extDescrs: ['COP. DIF.'],
      },
    },
  },
  {
    id: 76,
    name: 'Speckle DBGray-Silver',
    rgb: '6C6E68',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [117],
        extDescrs: ['Speckle DBGray-Silver'],
      },
      brickOwl: {
        extIds: [134],
        extDescrs: ['Speckle Gray'],
      },
      lDraw: {
        extIds: [76],
        extDescrs: ['Speckle_Dark_Bluish_Gray_Silver'],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 77,
    name: 'Light Pink',
    rgb: 'FECCCF',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [56],
        extDescrs: ['Light Pink'],
      },
      brickOwl: {
        extIds: [68],
        extDescrs: ['Light Pink'],
      },
      lDraw: {
        extIds: [77],
        extDescrs: ['Light_Pink'],
      },
      lego: {
        extIds: [17, 223],
        extDescrs: ['Rose', 'Light Pink'],
      },
    },
  },
  {
    id: 78,
    name: 'Light Nougat',
    rgb: 'F6D7B3',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [90],
        extDescrs: ['Light Nougat'],
      },
      brickOwl: {
        extIds: [65],
        extDescrs: ['Light Flesh'],
      },
      lDraw: {
        extIds: [78],
        extDescrs: ['Light_Flesh'],
      },
      lego: {
        extIds: [283],
        extDescrs: ['Light Nougat'],
      },
    },
  },
  {
    id: 79,
    name: 'Milky White',
    rgb: 'FFFFFF',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [60],
        extDescrs: ['Milky White'],
      },
      brickOwl: {
        extIds: [130],
        extDescrs: ['Translucent White'],
      },
      lDraw: {
        extIds: [79],
        extDescrs: ['Milky_White'],
      },
      lego: {
        extIds: [20],
        extDescrs: ['Nature'],
      },
    },
  },
  {
    id: 80,
    name: 'Metallic Silver',
    rgb: 'A5A9B4',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [67],
        extDescrs: ['Metallic Silver'],
      },
      brickOwl: {
        extIds: [126],
        extDescrs: ['Metallic Silver'],
      },
      lDraw: {
        extIds: [80],
        extDescrs: ['Metallic_Silver'],
      },
      lego: {
        extIds: [298, 336, 1002],
        extDescrs: ['Cool silver', 'SILVER INK', 'C.SILVER, DR. L'],
      },
    },
  },
  {
    id: 81,
    name: 'Metallic Green',
    rgb: '899B5F',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [70],
        extDescrs: ['Metallic Green'],
      },
      brickOwl: {
        extIds: [125],
        extDescrs: ['Metallic Green'],
      },
      lDraw: {
        extIds: [81],
        extDescrs: ['Metallic_Green'],
      },
      lego: {
        extIds: [200],
        extDescrs: ['Lemon Metallic'],
      },
    },
  },
  {
    id: 82,
    name: 'Metallic Gold',
    rgb: 'DBAC34',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [65],
        extDescrs: ['Metallic Gold'],
      },
      brickOwl: {
        extIds: [124],
        extDescrs: ['Metallic Gold'],
      },
      lDraw: {
        extIds: [82],
        extDescrs: ['Metallic_Gold'],
      },
      lego: {
        extIds: [335, 1004],
        extDescrs: ['GOLD INK', 'W.GOLD, DR.LA.'],
      },
    },
  },
  {
    id: 84,
    name: 'Medium Nougat',
    rgb: 'AA7D55',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [150],
        extDescrs: ['Medium Nougat'],
      },
      brickOwl: {
        extIds: [74],
        extDescrs: ['Medium Dark Flesh'],
      },
      lDraw: {
        extIds: [84],
        extDescrs: ['Medium_Dark_Flesh'],
      },
      lego: {
        extIds: [312],
        extDescrs: ['Medium Nougat'],
      },
    },
  },
  {
    id: 85,
    name: 'Dark Purple',
    rgb: '3F3691',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [89],
        extDescrs: ['Dark Purple'],
      },
      brickOwl: {
        extIds: [55],
        extDescrs: ['Dark Purple'],
      },
      lDraw: {
        extIds: [85],
        extDescrs: ['Dark_Purple'],
      },
      lego: {
        extIds: [268],
        extDescrs: ['Medium Lilac'],
      },
    },
  },
  {
    id: 86,
    name: 'Light Brown',
    rgb: '7C503A',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [91],
        extDescrs: ['Light Brown'],
      },
      brickOwl: {
        extIds: [52],
        extDescrs: ['Dark Flesh'],
      },
      lDraw: {
        extIds: [86],
        extDescrs: ['Dark_Flesh'],
      },
      lego: {
        extIds: [86],
        extDescrs: ['BROWN'],
      },
    },
  },
  {
    id: 89,
    name: 'Royal Blue',
    rgb: '4C61DB',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [97],
        extDescrs: ['Blue-Violet'],
      },
      brickOwl: {
        extIds: [40],
        extDescrs: ['Royal Blue'],
      },
      lDraw: {
        extIds: [89],
        extDescrs: ['Blue_Violet'],
      },
      lego: {
        extIds: [195],
        extDescrs: ['R. BLUE'],
      },
    },
  },
  {
    id: 92,
    name: 'Nougat',
    rgb: 'D09168',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [28],
        extDescrs: ['Nougat'],
      },
      brickOwl: {
        extIds: [6],
        extDescrs: ['Flesh'],
      },
      lDraw: {
        extIds: [92],
        extDescrs: ['Flesh'],
      },
      lego: {
        extIds: [18],
        extDescrs: ['Nougat'],
      },
    },
  },
  {
    id: 100,
    name: 'Light Salmon',
    rgb: 'FEBABD',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [26],
        extDescrs: ['Light Salmon'],
      },
      brickOwl: {
        extIds: [5],
        extDescrs: ['Light Salmon'],
      },
      lDraw: {
        extIds: [100],
        extDescrs: ['Light_Salmon'],
      },
      lego: {
        extIds: [100],
        extDescrs: ['Light red'],
      },
    },
  },
  {
    id: 110,
    name: 'Violet',
    rgb: '4354A3',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [43],
        extDescrs: ['Violet'],
      },
      brickOwl: {
        extIds: [15],
        extDescrs: ['Violet'],
      },
      lDraw: {
        extIds: [110],
        extDescrs: ['Violet'],
      },
      lego: {
        extIds: [110, 1009],
        extDescrs: ['Bright Bluish Violet', 'LILAC'],
      },
    },
  },
  {
    id: 112,
    name: 'Medium Bluish Violet',
    rgb: '6874CA',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [73],
        extDescrs: ['Medium Violet'],
      },
      brickOwl: {
        extIds: [78],
        extDescrs: ['Medium Violet'],
      },
      lDraw: {
        extIds: [112],
        extDescrs: ['Medium_Violet'],
      },
      lego: {
        extIds: [112, 213],
        extDescrs: ['Medium Bluish Violet', 'Medium Royal Blue'],
      },
    },
  },
  {
    id: 114,
    name: 'Glitter Trans-Dark Pink',
    rgb: 'DF6695',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [100],
        extDescrs: ['Glitter Trans-Dark Pink'],
      },
      brickOwl: {
        extIds: [132],
        extDescrs: ['Transparent Pink Glitter'],
      },
      lDraw: {
        extIds: [114],
        extDescrs: ['Glitter_Trans_Dark_Pink'],
      },
      lego: {
        extIds: [114],
        extDescrs: ['Tr. Medium Reddish-Violet w. Glitter 2%'],
      },
    },
  },
  {
    id: 115,
    name: 'Medium Lime',
    rgb: 'C7D23C',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [76],
        extDescrs: ['Medium Lime'],
      },
      brickOwl: {
        extIds: [77],
        extDescrs: ['Medium Lime'],
      },
      lDraw: {
        extIds: [115],
        extDescrs: ['Medium_Lime'],
      },
      lego: {
        extIds: [115],
        extDescrs: ['Med. yellowish green'],
      },
    },
  },
  {
    id: 117,
    name: 'Glitter Trans-Clear',
    rgb: 'FFFFFF',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [101],
        extDescrs: ['Glitter Trans-Clear'],
      },
      brickOwl: {
        extIds: [131],
        extDescrs: ['Transparent Glitter'],
      },
      lDraw: {
        extIds: [117],
        extDescrs: ['Glitter_Trans_Clear'],
      },
      lego: {
        extIds: [117],
        extDescrs: ['Transparent Glitter'],
      },
    },
  },
  {
    id: 118,
    name: 'Aqua',
    rgb: 'B3D7D1',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [41],
        extDescrs: ['Aqua'],
      },
      brickOwl: {
        extIds: [13],
        extDescrs: ['Aqua'],
      },
      lDraw: {
        extIds: [118],
        extDescrs: ['Aqua'],
      },
      lego: {
        extIds: [118],
        extDescrs: ['Light bluish green'],
      },
    },
  },
  {
    id: 120,
    name: 'Light Lime',
    rgb: 'D9E4A7',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [35],
        extDescrs: ['Light Lime'],
      },
      brickOwl: {
        extIds: [67],
        extDescrs: ['Light Lime'],
      },
      lDraw: {
        extIds: [120],
        extDescrs: ['Light_Lime'],
      },
      lego: {
        extIds: [120],
        extDescrs: ['Lig. yellowish green'],
      },
    },
  },
  {
    id: 125,
    name: 'Light Orange',
    rgb: 'F9BA61',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [32],
        extDescrs: ['Light Orange'],
      },
      brickOwl: {
        extIds: [8],
        extDescrs: ['Light Orange'],
      },
      lDraw: {
        extIds: [125],
        extDescrs: ['Light_Orange'],
      },
      lego: {
        extIds: [121],
        extDescrs: ['Medium Yellowish Orange'],
      },
    },
  },
  {
    id: 129,
    name: 'Glitter Trans-Purple',
    rgb: 'A5A5CB',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [102],
        extDescrs: ['Glitter Trans-Purple'],
      },
      brickOwl: {
        extIds: [22],
        extDescrs: ['Transparent Purple Glitter'],
      },
      lDraw: {
        extIds: [129],
        extDescrs: ['Glitter_Trans_Purple'],
      },
      lego: {
        extIds: [129],
        extDescrs: ['Tr. Bright Bluish Violet w. Glitter 2%'],
      },
    },
  },
  {
    id: 132,
    name: 'Speckle Black-Silver',
    rgb: '05131D',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [111],
        extDescrs: ['Speckle Black-Silver'],
      },
      brickOwl: {
        extIds: [24],
        extDescrs: ['Speckle Black'],
      },
      lDraw: {
        extIds: [132],
        extDescrs: ['Speckle_Black_Silver'],
      },
      lego: {
        extIds: [132],
        extDescrs: ['Black Glitter'],
      },
    },
  },
  {
    id: 133,
    name: 'Speckle Black-Gold',
    rgb: '05131D',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [151],
        extDescrs: ['Speckle Black-Gold'],
      },
      brickOwl: {
        extIds: [35],
        extDescrs: ['Speckle Black Gold'],
      },
      lDraw: {
        extIds: [133],
        extDescrs: ['Speckle_Black_Gold'],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 134,
    name: 'Copper',
    rgb: 'AE7A59',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [84],
        extDescrs: ['Copper'],
      },
      brickOwl: {
        extIds: [116],
        extDescrs: ['Copper'],
      },
      lDraw: {
        extIds: [134],
        extDescrs: ['Copper'],
      },
      lego: {
        extIds: [134, 139, 1016],
        extDescrs: ['COPPER, DR.LA.', 'Copper', 'COPPER INK'],
      },
    },
  },
  {
    id: 135,
    name: 'Pearl Light Gray',
    rgb: '9CA3A8',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [66],
        extDescrs: ['Pearl Light Gray'],
      },
      brickOwl: {
        extIds: [122],
        extDescrs: ['Pearl Light Gray'],
      },
      lDraw: {
        extIds: [135],
        extDescrs: ['Pearl_Light_Gray'],
      },
      lego: {
        extIds: [131, 296, 1015],
        extDescrs: ['Silver', 'Cool silver', 'C.SILVER'],
      },
    },
  },
  {
    id: 137,
    name: 'Metal Blue',
    rgb: '7988A1',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [78],
        extDescrs: ['Metal Blue'],
      },
      brickOwl: {
        extIds: [118],
        extDescrs: ['Metallic Blue'],
      },
      lDraw: {
        extIds: [137],
        extDescrs: ['Metal_Blue'],
      },
      lego: {
        extIds: [137, 145],
        extDescrs: ['Metal Blue', 'Sand blue metallic'],
      },
    },
  },
  {
    id: 142,
    name: 'Pearl Light Gold',
    rgb: 'DCBC81',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [61],
        extDescrs: ['Pearl Light Gold'],
      },
      brickOwl: {
        extIds: [121],
        extDescrs: ['Pearl Light Gold'],
      },
      lDraw: {
        extIds: [142],
        extDescrs: ['Pearl_Light_Gold'],
      },
      lego: {
        extIds: [127],
        extDescrs: ['Gold'],
      },
    },
  },
  {
    id: 143,
    name: 'Trans-Medium Blue',
    rgb: 'CFE2F7',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [74],
        extDescrs: ['Trans-Medium Blue'],
      },
      brickOwl: {
        extIds: [102],
        extDescrs: ['Transparent Medium Blue'],
      },
      lDraw: {
        extIds: [41],
        extDescrs: ['Trans_Medium_Blue'],
      },
      lego: {
        extIds: [143],
        extDescrs: ['Tr. Flu. Blue'],
      },
    },
  },
  {
    id: 148,
    name: 'Pearl Dark Gray',
    rgb: '575857',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [77],
        extDescrs: ['Pearl Dark Gray'],
      },
      brickOwl: {
        extIds: [119],
        extDescrs: ['Pearl Dark Gray'],
      },
      lDraw: {
        extIds: [87, 148],
        extDescrs: ['Metallic_Dark_Gray', 'Pearl_Dark_Gray'],
      },
      lego: {
        extIds: [148, 316],
        extDescrs: ['Mettalic Dark Grey', 'Titanium Metallic'],
      },
    },
  },
  {
    id: 150,
    name: 'Pearl Very Light Gray',
    rgb: 'ABADAC',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [119],
        extDescrs: ['Pearl Very Light Gray'],
      },
      brickOwl: {
        extIds: [27],
        extDescrs: ['Pearl Very Light Gray'],
      },
      lDraw: {
        extIds: [150],
        extDescrs: ['Pearl_Very_Light_Grey'],
      },
      lego: {
        extIds: [150],
        extDescrs: ['Metallic Light Gray'],
      },
    },
  },
  {
    id: 151,
    name: 'Very Light Bluish Gray',
    rgb: 'E6E3E0',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [99],
        extDescrs: ['Very Light Bluish Gray'],
      },
      brickOwl: {
        extIds: [90],
        extDescrs: ['Light Stone Gray'],
      },
      lDraw: {
        extIds: [151],
        extDescrs: ['Very_Light_Bluish_Gray'],
      },
      lego: {
        extIds: [208],
        extDescrs: ['Light stone grey'],
      },
    },
  },
  {
    id: 158,
    name: 'Yellowish Green',
    rgb: 'DFEEA5',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [158],
        extDescrs: ['Yellowish Green'],
      },
      brickOwl: {
        extIds: [94],
        extDescrs: ['Yellowish Green'],
      },
      lDraw: {
        extIds: [326],
        extDescrs: ['Yellowish_Green'],
      },
      lego: {
        extIds: [326],
        extDescrs: ['Spring Yellow Green'],
      },
    },
  },
  {
    id: 178,
    name: 'Flat Dark Gold',
    rgb: 'B48455',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [81],
        extDescrs: ['Flat Dark Gold'],
      },
      brickOwl: {
        extIds: [21],
        extDescrs: ['Flat Dark Gold'],
      },
      lDraw: {
        extIds: [178],
        extDescrs: ['Flat_Dark_Gold'],
      },
      lego: {
        extIds: [1001],
        extDescrs: ['Gold Metallic'],
      },
    },
  },
  {
    id: 179,
    name: 'Flat Silver',
    rgb: '898788',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [95],
        extDescrs: ['Flat Silver'],
      },
      brickOwl: {
        extIds: [117],
        extDescrs: ['Flat Silver'],
      },
      lDraw: {
        extIds: [179],
        extDescrs: ['Flat_Silver'],
      },
      lego: {
        extIds: [315],
        extDescrs: ['Silver Metallic'],
      },
    },
  },
  {
    id: 182,
    name: 'Trans-Orange',
    rgb: 'F08F1C',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [98],
        extDescrs: ['Trans-Orange'],
      },
      brickOwl: {
        extIds: [105],
        extDescrs: ['Transparent Orange'],
      },
      lDraw: {
        extIds: [57],
        extDescrs: ['Trans_Orange'],
      },
      lego: {
        extIds: [182],
        extDescrs: ['Tr. Bright Orange'],
      },
    },
  },
  {
    id: 183,
    name: 'Pearl White',
    rgb: 'F2F3F2',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [83],
        extDescrs: ['Pearl White'],
      },
      brickOwl: {
        extIds: [123],
        extDescrs: ['Pearlescent'],
      },
      lDraw: {
        extIds: [183],
        extDescrs: ['Pearl_White'],
      },
      lego: {
        extIds: [183],
        extDescrs: ['Metallic White'],
      },
    },
  },
  {
    id: 191,
    name: 'Bright Light Orange',
    rgb: 'F8BB3D',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [110],
        extDescrs: ['Bright Light Orange'],
      },
      brickOwl: {
        extIds: [43],
        extDescrs: ['Bright Light Orange'],
      },
      lDraw: {
        extIds: [191],
        extDescrs: ['Bright_Light_Orange'],
      },
      lego: {
        extIds: [191],
        extDescrs: ['Flame yellowish orange'],
      },
    },
  },
  {
    id: 212,
    name: 'Bright Light Blue',
    rgb: '9FC3E9',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [105],
        extDescrs: ['Bright Light Blue'],
      },
      brickOwl: {
        extIds: [42],
        extDescrs: ['Bright Light Blue'],
      },
      lDraw: {
        extIds: [212],
        extDescrs: ['Bright_Light_Blue'],
      },
      lego: {
        extIds: [212],
        extDescrs: ['Light Royal blue'],
      },
    },
  },
  {
    id: 216,
    name: 'Rust',
    rgb: 'B31004',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [27],
        extDescrs: ['Rust'],
      },
      brickOwl: {
        extIds: [83],
        extDescrs: ['Rust'],
      },
      lDraw: {
        extIds: [216],
        extDescrs: ['Rust'],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 226,
    name: 'Bright Light Yellow',
    rgb: 'FFF03A',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [103],
        extDescrs: ['Bright Light Yellow'],
      },
      brickOwl: {
        extIds: [44],
        extDescrs: ['Bright Light Yellow'],
      },
      lDraw: {
        extIds: [226],
        extDescrs: ['Bright_Light_Yellow'],
      },
      lego: {
        extIds: [226],
        extDescrs: ['Cool Yellow'],
      },
    },
  },
  {
    id: 230,
    name: 'Trans-Pink',
    rgb: 'E4ADC8',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [107],
        extDescrs: ['Trans-Pink'],
      },
      brickOwl: {
        extIds: [106],
        extDescrs: ['Transparent Pink'],
      },
      lDraw: {
        extIds: [45],
        extDescrs: ['Trans_Pink'],
      },
      lego: {
        extIds: [230],
        extDescrs: ['TR. BR. PURPLE'],
      },
    },
  },
  {
    id: 232,
    name: 'Sky Blue',
    rgb: '7DBFDD',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [87],
        extDescrs: ['Sky Blue'],
      },
      brickOwl: {
        extIds: [88],
        extDescrs: ['Sky Blue'],
      },
      lDraw: {
        extIds: [232],
        extDescrs: ['Sky_Blue'],
      },
      lego: {
        extIds: [232],
        extDescrs: ['Dove blue'],
      },
    },
  },
  {
    id: 236,
    name: 'Trans-Light Purple',
    rgb: '96709F',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [114],
        extDescrs: ['Trans-Light Purple'],
      },
      brickOwl: {
        extIds: [26],
        extDescrs: ['Transparent Light Purple'],
      },
      lDraw: {
        extIds: [44, 284],
        extDescrs: ['Trans_Light_Purple', 'Trans_Light_Purple'],
      },
      lego: {
        extIds: [284],
        extDescrs: ['TR. RED-LILAC'],
      },
    },
  },
  {
    id: 272,
    name: 'Dark Blue',
    rgb: '0A3463',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [63],
        extDescrs: ['Dark Blue'],
      },
      brickOwl: {
        extIds: [48],
        extDescrs: ['Dark Blue'],
      },
      lDraw: {
        extIds: [272],
        extDescrs: ['Dark_Blue'],
      },
      lego: {
        extIds: [140],
        extDescrs: ['Earth blue'],
      },
    },
  },
  {
    id: 288,
    name: 'Dark Green',
    rgb: '184632',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [80],
        extDescrs: ['Dark Green'],
      },
      brickOwl: {
        extIds: [20],
        extDescrs: ['Dark Green'],
      },
      lDraw: {
        extIds: [288],
        extDescrs: ['Dark_Green'],
      },
      lego: {
        extIds: [141],
        extDescrs: ['Earth Green'],
      },
    },
  },
  {
    id: 294,
    name: 'Glow In Dark Trans',
    rgb: 'BDC6AD',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [118],
        extDescrs: ['Glow In Dark Trans'],
      },
      brickOwl: {
        extIds: [128],
        extDescrs: ['Glow in the Dark Transparent'],
      },
      lDraw: {
        extIds: [294],
        extDescrs: ['Glow_In_Dark_Trans'],
      },
      lego: {
        extIds: [294],
        extDescrs: ['Phosphorescent Green'],
      },
    },
  },
  {
    id: 297,
    name: 'Pearl Gold',
    rgb: 'AA7F2E',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [115],
        extDescrs: ['Pearl Gold'],
      },
      brickOwl: {
        extIds: [120],
        extDescrs: ['Pearl Gold'],
      },
      lDraw: {
        extIds: [297],
        extDescrs: ['Pearl_Gold'],
      },
      lego: {
        extIds: [297],
        extDescrs: ['Warm Gold'],
      },
    },
  },
  {
    id: 308,
    name: 'Dark Brown',
    rgb: '352100',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [120],
        extDescrs: ['Dark Brown'],
      },
      brickOwl: {
        extIds: [51],
        extDescrs: ['Dark Brown'],
      },
      lDraw: {
        extIds: [308],
        extDescrs: ['Dark_Brown'],
      },
      lego: {
        extIds: [308],
        extDescrs: ['Dark Brown'],
      },
    },
  },
  {
    id: 313,
    name: 'Maersk Blue',
    rgb: '3592C3',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [72],
        extDescrs: ['Maersk Blue'],
      },
      brickOwl: {
        extIds: [71],
        extDescrs: ['Maersk Blue'],
      },
      lDraw: {
        extIds: [313],
        extDescrs: ['Maersk_Blue'],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 320,
    name: 'Dark Red',
    rgb: '720E0F',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [59],
        extDescrs: ['Dark Red'],
      },
      brickOwl: {
        extIds: [56],
        extDescrs: ['Dark Red'],
      },
      lDraw: {
        extIds: [320],
        extDescrs: ['Dark_Red'],
      },
      lego: {
        extIds: [154],
        extDescrs: ['Dark red'],
      },
    },
  },
  {
    id: 321,
    name: 'Dark Azure',
    rgb: '078BC9',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [153],
        extDescrs: ['Dark Azure'],
      },
      brickOwl: {
        extIds: [47],
        extDescrs: ['Dark Azure'],
      },
      lDraw: {
        extIds: [321],
        extDescrs: ['Dark_Azure'],
      },
      lego: {
        extIds: [321],
        extDescrs: ['Dark Azur'],
      },
    },
  },
  {
    id: 322,
    name: 'Medium Azure',
    rgb: '36AEBF',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [156],
        extDescrs: ['Medium Azure'],
      },
      brickOwl: {
        extIds: [73],
        extDescrs: ['Medium Azure'],
      },
      lDraw: {
        extIds: [322],
        extDescrs: ['Medium_Azure'],
      },
      lego: {
        extIds: [322],
        extDescrs: ['Medium Azure'],
      },
    },
  },
  {
    id: 323,
    name: 'Light Aqua',
    rgb: 'ADC3C0',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [152],
        extDescrs: ['Light Aqua'],
      },
      brickOwl: {
        extIds: [62],
        extDescrs: ['Light Aqua'],
      },
      lDraw: {
        extIds: [323],
        extDescrs: ['Light_Aqua'],
      },
      lego: {
        extIds: [323],
        extDescrs: ['Aqua'],
      },
    },
  },
  {
    id: 326,
    name: 'Olive Green',
    rgb: '9B9A5A',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [155],
        extDescrs: ['Olive Green'],
      },
      brickOwl: {
        extIds: [79],
        extDescrs: ['Olive Green'],
      },
      lDraw: {
        extIds: [330],
        extDescrs: ['Olive_Green'],
      },
      lego: {
        extIds: [330],
        extDescrs: ['Olive Green'],
      },
    },
  },
  {
    id: 334,
    name: 'Chrome Gold',
    rgb: 'BBA53D',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [21],
        extDescrs: ['Chrome Gold'],
      },
      brickOwl: {
        extIds: [2],
        extDescrs: ['Chrome Gold'],
      },
      lDraw: {
        extIds: [334],
        extDescrs: ['Chrome_Gold'],
      },
      lego: {
        extIds: [310],
        extDescrs: ['Metalized Gold'],
      },
    },
  },
  {
    id: 335,
    name: 'Sand Red',
    rgb: 'D67572',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [58],
        extDescrs: ['Sand Red'],
      },
      brickOwl: {
        extIds: [87],
        extDescrs: ['Sand Red'],
      },
      lDraw: {
        extIds: [335],
        extDescrs: ['Sand_Red'],
      },
      lego: {
        extIds: [153],
        extDescrs: ['Sand red'],
      },
    },
  },
  {
    id: 351,
    name: 'Medium Dark Pink',
    rgb: 'F785B1',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [94],
        extDescrs: ['Medium Dark Pink'],
      },
      brickOwl: {
        extIds: [75],
        extDescrs: ['Medium Dark Pink'],
      },
      lDraw: {
        extIds: [351],
        extDescrs: ['Medium_Dark_Pink'],
      },
      lego: {
        extIds: [22],
        extDescrs: ['Medium Reddish Violet'],
      },
    },
  },
  {
    id: 366,
    name: 'Earth Orange',
    rgb: 'FA9C1C',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [29],
        extDescrs: ['Earth Orange'],
      },
      brickOwl: {
        extIds: [59],
        extDescrs: ['Earth Orange'],
      },
      lDraw: {
        extIds: [366],
        extDescrs: ['Earth_Orange'],
      },
      lego: {
        extIds: [1008],
        extDescrs: ['L.ORABROWN'],
      },
    },
  },
  {
    id: 373,
    name: 'Sand Purple',
    rgb: '845E84',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [54],
        extDescrs: ['Sand Purple'],
      },
      brickOwl: {
        extIds: [86],
        extDescrs: ['Sand Purple'],
      },
      lDraw: {
        extIds: [373],
        extDescrs: ['Sand_Purple'],
      },
      lego: {
        extIds: [136],
        extDescrs: ['Sand violet'],
      },
    },
  },
  {
    id: 378,
    name: 'Sand Green',
    rgb: 'A0BCAC',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [48],
        extDescrs: ['Sand Green'],
      },
      brickOwl: {
        extIds: [18],
        extDescrs: ['Sand Green'],
      },
      lDraw: {
        extIds: [378],
        extDescrs: ['Sand_Green'],
      },
      lego: {
        extIds: [151],
        extDescrs: ['Sand green'],
      },
    },
  },
  {
    id: 379,
    name: 'Sand Blue',
    rgb: '6074A1',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [55],
        extDescrs: ['Sand Blue'],
      },
      brickOwl: {
        extIds: [85],
        extDescrs: ['Sand Blue'],
      },
      lDraw: {
        extIds: [379],
        extDescrs: ['Sand_Blue'],
      },
      lego: {
        extIds: [135],
        extDescrs: ['Sand blue'],
      },
    },
  },
  {
    id: 383,
    name: 'Chrome Silver',
    rgb: 'E0E0E0',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [22],
        extDescrs: ['Chrome Silver'],
      },
      brickOwl: {
        extIds: [115],
        extDescrs: ['Chrome Silver'],
      },
      lDraw: {
        extIds: [383],
        extDescrs: ['Chrome_Silver'],
      },
      lego: {
        extIds: [309],
        extDescrs: ['Metalized Silver'],
      },
    },
  },
  {
    id: 450,
    name: 'Fabuland Brown',
    rgb: 'B67B50',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [106],
        extDescrs: ['Fabuland Brown'],
      },
      brickOwl: {
        extIds: [23],
        extDescrs: ['Fabuland Brown'],
      },
      lDraw: {
        extIds: [450],
        extDescrs: ['Fabuland_Brown'],
      },
      lego: {
        extIds: [12],
        extDescrs: ['Light Orange Brown'],
      },
    },
  },
  {
    id: 462,
    name: 'Medium Orange',
    rgb: 'FFA70B',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [31],
        extDescrs: ['Medium Orange'],
      },
      brickOwl: {
        extIds: [7],
        extDescrs: ['Medium Orange'],
      },
      lDraw: {
        extIds: [462],
        extDescrs: ['Medium_Orange'],
      },
      lego: {
        extIds: [105],
        extDescrs: ['Br. yellowish orange'],
      },
    },
  },
  {
    id: 484,
    name: 'Dark Orange',
    rgb: 'A95500',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [68],
        extDescrs: ['Dark Orange'],
      },
      brickOwl: {
        extIds: [54],
        extDescrs: ['Dark Orange'],
      },
      lDraw: {
        extIds: [484],
        extDescrs: ['Dark_Orange'],
      },
      lego: {
        extIds: [38],
        extDescrs: ['Dark Orange'],
      },
    },
  },
  {
    id: 503,
    name: 'Very Light Gray',
    rgb: 'E6E3DA',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [49],
        extDescrs: ['Very Light Gray'],
      },
      brickOwl: {
        extIds: [19],
        extDescrs: ['Very Light Gray'],
      },
      lDraw: {
        extIds: [503],
        extDescrs: ['Very_Light_Gray'],
      },
      lego: {
        extIds: [103],
        extDescrs: ['Light grey'],
      },
    },
  },
  {
    id: 1000,
    name: 'Glow in Dark White',
    rgb: 'D9D9D9',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [159],
        extDescrs: ['Glow in Dark White'],
      },
      brickOwl: {
        extIds: [129],
        extDescrs: ['Glow in the Dark White'],
      },
      lDraw: {
        extIds: [329],
        extDescrs: ['Glow_In_Dark_White'],
      },
      lego: {
        extIds: [329],
        extDescrs: ['WHITE GLOW'],
      },
    },
  },
  {
    id: 1001,
    name: 'Medium Violet',
    rgb: '9391E4',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [245],
        extDescrs: ['Lilac'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [112, 219],
        extDescrs: ['Medium_Violet', 'Lilac'],
      },
      lego: {
        extIds: [219],
        extDescrs: ['Lilac'],
      },
    },
  },
  {
    id: 1002,
    name: 'Glitter Trans-Neon Green',
    rgb: 'C0F500',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [163],
        extDescrs: ['Glitter Trans-Neon Green'],
      },
      brickOwl: {
        extIds: [167],
        extDescrs: ['Transparent Neon Green Glitter'],
      },
      lDraw: {
        extIds: [339],
        extDescrs: ['Glitter_Trans_Neon_Green'],
      },
      lego: {
        extIds: [339],
        extDescrs: ['TR.FL.GRE W/GLI'],
      },
    },
  },
  {
    id: 1003,
    name: 'Glitter Trans-Light Blue',
    rgb: '68BCC5',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [162],
        extDescrs: ['Glitter Trans-Light Blue'],
      },
      brickOwl: {
        extIds: [165],
        extDescrs: ['Transparent Light Blue Glitter'],
      },
      lDraw: {
        extIds: [302],
        extDescrs: ['Glitter_Trans_Light_Blue'],
      },
      lego: {
        extIds: [302],
        extDescrs: ['PCTR LI.BLUE W/'],
      },
    },
  },
  {
    id: 1004,
    name: 'Trans-Flame Yellowish Orange',
    rgb: 'FCB76D',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [164],
        extDescrs: ['Trans Light Orange'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [231],
        extDescrs: ['Trans_Bright_Light_Orange'],
      },
      lego: {
        extIds: [231],
        extDescrs: ['TR. FL. YEL ORA'],
      },
    },
  },
  {
    id: 1005,
    name: 'Trans-Fire Yellow',
    rgb: 'FBE890',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [234],
        extDescrs: ['Trans_Fire_Yellow'],
      },
      lego: {
        extIds: [234],
        extDescrs: ['TR. FIRE YELL'],
      },
    },
  },
  {
    id: 1006,
    name: 'Trans-Light Royal Blue',
    rgb: 'B4D4F7',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [293],
        extDescrs: ['Trans_Light_Blue_Violet'],
      },
      lego: {
        extIds: [293],
        extDescrs: ['TR. L.ROYAL BLUE'],
      },
    },
  },
  {
    id: 1007,
    name: 'Reddish Lilac',
    rgb: '8E5597',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [227],
        extDescrs: ['Clikits Lavender'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [218],
        extDescrs: ['Medium Purple'],
      },
      lego: {
        extIds: [218],
        extDescrs: ['RED. LILAC'],
      },
    },
  },
  {
    id: 1008,
    name: 'Vintage Blue',
    rgb: '039CBD',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1009,
    name: 'Vintage Green',
    rgb: '1E601E',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1010,
    name: 'Vintage Red',
    rgb: 'CA1F08',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1011,
    name: 'Vintage Yellow',
    rgb: 'F3C305',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1012,
    name: 'Fabuland Orange',
    rgb: 'EF9121',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [160],
        extDescrs: ['Fabuland Orange'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [509],
        extDescrs: ['Fabuland_Orange'],
      },
      lego: {
        extIds: [19],
        extDescrs: ['Light Brown'],
      },
    },
  },
  {
    id: 1013,
    name: 'Modulex White',
    rgb: 'F4F4F4',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [123],
        extDescrs: ['Mx White'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1014,
    name: 'Modulex Light Bluish Gray',
    rgb: 'AfB5C7',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [124],
        extDescrs: ['Mx Light Bluish Gray'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1015,
    name: 'Modulex Light Gray',
    rgb: '9C9C9C',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [125],
        extDescrs: ['Mx Light Gray'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1016,
    name: 'Modulex Charcoal Gray',
    rgb: '595D60',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [126],
        extDescrs: ['Mx Charcoal Gray'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1017,
    name: 'Modulex Tile Gray',
    rgb: '6B5A5A',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [127],
        extDescrs: ['Mx Tile Gray'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1018,
    name: 'Modulex Black',
    rgb: '4D4C52',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [128],
        extDescrs: ['Mx Black'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1019,
    name: 'Modulex Tile Brown',
    rgb: '330000',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [131],
        extDescrs: ['Mx Tile Brown'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1020,
    name: 'Modulex Terracotta',
    rgb: '5C5030',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [134],
        extDescrs: ['Mx Terracotta'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1021,
    name: 'Modulex Brown',
    rgb: '907450',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [132],
        extDescrs: ['Mx Brown'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1022,
    name: 'Modulex Buff',
    rgb: 'DEC69C',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [133],
        extDescrs: ['Mx Buff'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1023,
    name: 'Modulex Red',
    rgb: 'B52C20',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [129],
        extDescrs: ['Mx Red'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1024,
    name: 'Modulex Pink Red',
    rgb: 'F45C40',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [130],
        extDescrs: ['Mx Pink Red'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1025,
    name: 'Modulex Orange',
    rgb: 'F47B30',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [135],
        extDescrs: ['Mx Orange'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1026,
    name: 'Modulex Light Orange',
    rgb: 'F7AD63',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [136],
        extDescrs: ['Mx Light Orange'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1027,
    name: 'Modulex Light Yellow',
    rgb: 'FFE371',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [137],
        extDescrs: ['Mx Light Yellow'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1028,
    name: 'Modulex Ochre Yellow',
    rgb: 'FED557',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [138],
        extDescrs: ['Mx Ochre Yellow'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1029,
    name: 'Modulex Lemon',
    rgb: 'BDC618',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [139],
        extDescrs: ['Mx Lemon'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1030,
    name: 'Modulex Pastel Green',
    rgb: '7DB538',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [141],
        extDescrs: ['Mx Pastel Green'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1031,
    name: 'Modulex Olive Green',
    rgb: '7C9051',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [140],
        extDescrs: ['Mx Olive Green'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1032,
    name: 'Modulex Aqua Green',
    rgb: '27867E',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [142],
        extDescrs: ['Mx Aqua Green'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1033,
    name: 'Modulex Teal Blue',
    rgb: '467083',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [146],
        extDescrs: ['Mx Teal Blue'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1034,
    name: 'Modulex Tile Blue',
    rgb: '0057A6',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [143],
        extDescrs: ['Mx Tile Blue'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1035,
    name: 'Modulex Medium Blue',
    rgb: '61AFFF',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [144],
        extDescrs: ['Mx Medium Blue'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1036,
    name: 'Modulex Pastel Blue',
    rgb: '68AECE',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [145],
        extDescrs: ['Mx Pastel Blue'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1037,
    name: 'Modulex Violet',
    rgb: 'BD7D85',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [147],
        extDescrs: ['Mx Violet'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1038,
    name: 'Modulex Pink',
    rgb: 'F785B1',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [148],
        extDescrs: ['Mx Pink'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1039,
    name: 'Modulex Clear',
    rgb: 'FFFFFF',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [149],
        extDescrs: ['Mx Clear'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1040,
    name: 'Modulex Foil Dark Gray',
    rgb: '595D60',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [210],
        extDescrs: ['Mx Foil Dark Gray'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1041,
    name: 'Modulex Foil Light Gray',
    rgb: '9C9C9C',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [211],
        extDescrs: ['Mx Foil Light Gray'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1042,
    name: 'Modulex Foil Dark Green',
    rgb: '006400',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [212],
        extDescrs: ['Mx Foil Dark Green'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1043,
    name: 'Modulex Foil Light Green',
    rgb: '7DB538',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [213],
        extDescrs: ['Mx Foil Light Green'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1044,
    name: 'Modulex Foil Dark Blue',
    rgb: '0057A6',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [214],
        extDescrs: ['Mx Foil Dark Blue'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1045,
    name: 'Modulex Foil Light Blue',
    rgb: '68AECE',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [215],
        extDescrs: ['Mx Foil Light Blue'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1046,
    name: 'Modulex Foil Violet',
    rgb: '4B0082',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [216],
        extDescrs: ['Mx Foil Violet'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1047,
    name: 'Modulex Foil Red',
    rgb: '8B0000',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [217],
        extDescrs: ['Mx Foil Red'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1048,
    name: 'Modulex Foil Yellow',
    rgb: 'FED557',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [218],
        extDescrs: ['Mx Foil Yellow'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1049,
    name: 'Modulex Foil Orange',
    rgb: 'F7AD63',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [219],
        extDescrs: ['Mx Foil Orange'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 1050,
    name: 'Coral',
    rgb: 'FF698F',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [220],
        extDescrs: ['Coral'],
      },
      brickOwl: {
        extIds: [173],
        extDescrs: ['Coral'],
      },
      lDraw: {
        extIds: [353],
        extDescrs: ['Coral'],
      },
      lego: {
        extIds: [353, 1017],
        extDescrs: ['Vibrant Coral', 'CORAL'],
      },
    },
  },
  {
    id: 1051,
    name: 'Pastel Blue',
    rgb: '5AC4DA',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [72],
        extDescrs: ['Maersk Blue'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [11],
        extDescrs: ['Pastel Blue'],
      },
    },
  },
  {
    id: 1052,
    name: 'Glitter Trans-Orange',
    rgb: 'F08F1C',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [222],
        extDescrs: ['Glitter Trans-Orange'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [341],
        extDescrs: ['Glitter_Trans_Orange'],
      },
      lego: {
        extIds: [1018],
        extDescrs: ['TR.BR:ORA W/GLI'],
      },
    },
  },
  {
    id: 1053,
    name: 'Trans-Blue Opal',
    rgb: '68BCC5',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [223],
        extDescrs: ['Satin Trans-Light Blue'],
      },
      brickOwl: {
        extIds: [175],
        extDescrs: ['Transparent Blue Opal'],
      },
      lDraw: {
        extIds: [362],
        extDescrs: ['Opal_Trans_Light_Blue'],
      },
      lego: {
        extIds: [362],
        extDescrs: ['Transparent Blue Opal'],
      },
    },
  },
  {
    id: 1054,
    name: 'Trans-Medium Reddish Violet Opal',
    rgb: 'CE1D9B',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [224],
        extDescrs: ['Satin Trans-Dark Pink'],
      },
      brickOwl: {
        extIds: [199],
        extDescrs: ['Transparent Dark Pink Opal'],
      },
      lDraw: {
        extIds: [364],
        extDescrs: ['Opal_Trans_Dark_Pink'],
      },
      lego: {
        extIds: [362],
        extDescrs: ['Transparent Medium Reddish Violet with Opalescence'],
      },
    },
  },
  {
    id: 1055,
    name: 'Trans-Clear Opal',
    rgb: 'FCFCFC',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [228],
        extDescrs: ['Satin White'],
      },
      brickOwl: {
        extIds: [193],
        extDescrs: ['Transparent Opal'],
      },
      lDraw: {
        extIds: [360],
        extDescrs: ['Opal_Trans_Clear'],
      },
      lego: {
        extIds: [360],
        extDescrs: ['Transparent with Opalescence'],
      },
    },
  },
  {
    id: 1056,
    name: 'Trans-Brown Opal',
    rgb: '583927',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [229],
        extDescrs: ['Satin Trans-Black'],
      },
      brickOwl: {
        extIds: [201],
        extDescrs: ['Transparent Black Opal'],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [360, 363],
        extDescrs: ['Transparent Brown with Opalescence', 'Transparent Brown With Opalescence'],
      },
    },
  },
  {
    id: 1057,
    name: 'Trans-Light Bright Green',
    rgb: 'C9E788',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [226],
        extDescrs: ['Trans-Light Bright Green'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [227],
        extDescrs: ['Transparent Bright Yellowish Green'],
      },
    },
  },
  {
    id: 1058,
    name: 'Trans-Light Green',
    rgb: '94E5AB',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [221],
        extDescrs: ['Trans-Light Green'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [285],
        extDescrs: ['TranS_Light_Green'],
      },
      lego: {
        extIds: [285],
        extDescrs: ['Transparent Light Green'],
      },
    },
  },
  {
    id: 1059,
    name: 'Trans-Purple Opal',
    rgb: '8320B7',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [230],
        extDescrs: ['Satin Trans-Purple'],
      },
      brickOwl: {
        extIds: [203],
        extDescrs: ['Transparent Purple Opal'],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [1020],
        extDescrs: ['Tr.Violet Opal'],
      },
    },
  },
  {
    id: 1060,
    name: 'Trans-Green Opal',
    rgb: '84B68D',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [233],
        extDescrs: ['Satin Trans-Bright Green'],
      },
      brickOwl: {
        extIds: [207],
        extDescrs: ['Transparent Green Opal'],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [367, 1021],
        extDescrs: ['Transparent Green With Opalescence', 'Tr.Green Opal'],
      },
    },
  },
  {
    id: 1061,
    name: 'Trans-Dark Blue Opal',
    rgb: '0020A0',
    isTrans: true,
    externalIds: {
      brickLink: {
        extIds: [232],
        extDescrs: ['Satin Trans-Dark Blue'],
      },
      brickOwl: {
        extIds: [209],
        extDescrs: ['Transparent Dark Blue Opal'],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [366, 1019],
        extDescrs: ['Transparent Blue With Opalescence', 'Tr.Blue Opal'],
      },
    },
  },
  {
    id: 1062,
    name: 'Vibrant Yellow',
    rgb: 'EBD800',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [236],
        extDescrs: ['Neon Yellow'],
      },
      brickOwl: {
        extIds: [211],
        extDescrs: ['Vibrant Yellow'],
      },
      lDraw: {
        extIds: [368],
        extDescrs: ['Vibrant_Yellow'],
      },
      lego: {
        extIds: [368],
        extDescrs: ['Vibrant Yellow'],
      },
    },
  },
  {
    id: 1063,
    name: 'Metallic Copper',
    rgb: 'B46A00',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [346],
        extDescrs: ['Copper Metallic'],
      },
    },
  },
  {
    id: 1064,
    name: 'Fabuland Red',
    rgb: 'FF8014',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [508],
        extDescrs: ['Fabuland_Red'],
      },
      lego: {
        extIds: [13],
        extDescrs: ['Red Orange'],
      },
    },
  },
  {
    id: 1065,
    name: 'Reddish Gold',
    rgb: 'AC8247',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [235],
        extDescrs: ['Reddish Gold'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [189],
        extDescrs: ['Reddish_Gold'],
      },
      lego: {
        extIds: [189],
        extDescrs: ['Reddish Gold'],
      },
    },
  },
  {
    id: 1066,
    name: 'Curry',
    rgb: 'DD982E',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [161],
        extDescrs: ['Dark Yellow'],
      },
      brickOwl: {
        extIds: [169],
        extDescrs: ['Curry'],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [180],
        extDescrs: ['Curry'],
      },
    },
  },
  {
    id: 1067,
    name: 'Dark Nougat',
    rgb: 'AD6140',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [225],
        extDescrs: ['Dark Nougat'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [128],
        extDescrs: ['Dark_Nougat'],
      },
      lego: {
        extIds: [128],
        extDescrs: ['Dark Nougat'],
      },
    },
  },
  {
    id: 1068,
    name: 'Reddish Orange',
    rgb: 'EE5434',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [231],
        extDescrs: ['Dark Salmon'],
      },
      brickOwl: {
        extIds: [158],
        extDescrs: ['Reddish Orange'],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [123],
        extDescrs: ['Bright Reddish Orange'],
      },
    },
  },
  {
    id: 1069,
    name: 'Pearl Red',
    rgb: 'D60026',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [181],
        extDescrs: ['Pearl Red'],
      },
      lDraw: {
        extIds: [184],
        extDescrs: ['Metallic_Bright_Red'],
      },
      lego: {
        extIds: [184],
        extDescrs: ['Metallic Bright Red'],
      },
    },
  },
  {
    id: 1070,
    name: 'Pearl Blue',
    rgb: '0059A3',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [189],
        extDescrs: ['Pearl Blue'],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [185],
        extDescrs: ['Metallic Bright Blue'],
      },
    },
  },
  {
    id: 1071,
    name: 'Pearl Green',
    rgb: '008E3C',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [183],
        extDescrs: ['Pearl Green'],
      },
      lDraw: {
        extIds: [186],
        extDescrs: ['Metallic_Dark_Green'],
      },
      lego: {
        extIds: [186],
        extDescrs: ['Metallic Dark Green'],
      },
    },
  },
  {
    id: 1072,
    name: 'Pearl Brown',
    rgb: '57392C',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [187],
        extDescrs: ['Sand Yellow Metallic'],
      },
    },
  },
  {
    id: 1073,
    name: 'Pearl Black',
    rgb: '0A1327',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [244],
        extDescrs: ['Pearl Black'],
      },
      brickOwl: {
        extIds: [185],
        extDescrs: ['Pearl Black'],
      },
      lDraw: {
        extIds: [83],
        extDescrs: ['Metallic_Black'],
      },
      lego: {
        extIds: [149],
        extDescrs: ['Metallic Black'],
      },
    },
  },
  {
    id: 1074,
    name: 'Duplo Blue',
    rgb: '009ECE',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [188],
        extDescrs: ['Tiny Blue'],
      },
    },
  },
  {
    id: 1075,
    name: 'Duplo Medium Blue',
    rgb: '3E95B6',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [269],
        extDescrs: ['Tiny-Medium Blue'],
      },
    },
  },
  {
    id: 1076,
    name: 'Duplo Lime',
    rgb: 'FFF230',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [15],
        extDescrs: ['Lemon'],
      },
    },
  },
  {
    id: 1077,
    name: 'Fabuland Lime',
    rgb: '78FC78',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [248],
        extDescrs: ['Fabuland Lime'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [510],
        extDescrs: ['Fabuland_Pastel_Green'],
      },
      lego: {
        extIds: [14],
        extDescrs: ['Pastel Green'],
      },
    },
  },
  {
    id: 1078,
    name: 'Duplo Medium Green',
    rgb: '468A5F',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [210],
        extDescrs: ['Faded Green'],
      },
    },
  },
  {
    id: 1079,
    name: 'Duplo Light Green',
    rgb: '60BA76',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [233],
        extDescrs: ['Light Faded Green'],
      },
    },
  },
  {
    id: 1080,
    name: 'Light Tan',
    rgb: 'F3C988',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [224],
        extDescrs: ['Light Brick Yellow'],
      },
    },
  },
  {
    id: 1081,
    name: 'Rust Orange',
    rgb: '872B17',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [216],
        extDescrs: ['Rust'],
      },
      lego: {
        extIds: [216],
        extDescrs: ['Rust'],
      },
    },
  },
  {
    id: 1082,
    name: 'Clikits Pink',
    rgb: 'FE78B0',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [295],
        extDescrs: ['Flamingo_Pink'],
      },
      lego: {
        extIds: [295],
        extDescrs: ['Flamingo Pink'],
      },
    },
  },
  {
    id: 1083,
    name: 'Two-tone Copper',
    rgb: '945148',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [273],
        extDescrs: ['Bionicle Copper'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [176],
        extDescrs: ['Red Flip/Flop'],
      },
    },
  },
  {
    id: 1084,
    name: 'Two-tone Gold',
    rgb: 'AB673A',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [238],
        extDescrs: ['Bionicle Gold'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [178],
        extDescrs: ['Yellow Flip/Flop'],
      },
    },
  },
  {
    id: 1085,
    name: 'Two-tone Silver',
    rgb: '737271',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [239],
        extDescrs: ['Bionicle Silver'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [179],
        extDescrs: ['Silver Flip/Flop'],
      },
    },
  },
  {
    id: 1086,
    name: 'Pearl Lime',
    rgb: '6A7944',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [200],
        extDescrs: ['Lemon Metallic'],
      },
    },
  },
  {
    id: 1087,
    name: 'Duplo Pink',
    rgb: 'FF879C',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [16],
        extDescrs: ['Pink'],
      },
    },
  },
  {
    id: 1088,
    name: 'Medium Brown',
    rgb: '755945',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [240],
        extDescrs: ['Medium Brown'],
      },
      brickOwl: {
        extIds: [213],
        extDescrs: ['Medium Brown'],
      },
      lDraw: {
        extIds: [370],
        extDescrs: ['Medium_Brown'],
      },
      lego: {
        extIds: [370],
        extDescrs: ['Medium Brown'],
      },
    },
  },
  {
    id: 1089,
    name: 'Warm Tan',
    rgb: 'CCA373',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [241],
        extDescrs: ['Medium Tan'],
      },
      brickOwl: {
        extIds: [217],
        extDescrs: ['Warm Tan'],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [1089],
        extDescrs: ['Warm Tan'],
      },
    },
  },
  {
    id: 1090,
    name: 'Duplo Turquoise',
    rgb: '3FB69E',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [],
        extDescrs: [],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
  {
    id: 9999,
    name: '[No Color/Any Color]',
    rgb: '05131D',
    isTrans: false,
    externalIds: {
      brickLink: {
        extIds: [0],
        extDescrs: ['(Not Applicable)'],
      },
      brickOwl: {
        extIds: [],
        extDescrs: [],
      },
      lDraw: {
        extIds: [],
        extDescrs: [],
      },
      lego: {
        extIds: [],
        extDescrs: [],
      },
    },
  },
];
