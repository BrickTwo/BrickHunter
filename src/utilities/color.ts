export interface IColor {
  id: number;
  name: string;
  rgb: string;
  is_trans: boolean;
  external_ids: {
    LDraw?: {
      ext_ids: Array<number>;
      ext_descrs: Array<Array<string>>;
    };
    BrickOwl?: {
      ext_ids: Array<number>;
      ext_descrs: Array<Array<string>>;
    };
    LEGO?: {
      ext_ids: Array<number>;
      ext_descrs: Array<Array<string>>;
    };
    Peeron?: {
      ext_ids: Array<number | null>;
      ext_descrs: Array<Array<string>>;
    };
    BrickLink?: {
      ext_ids: Array<number>;
      ext_descrs: Array<Array<string>>;
    };
  };
}

export class Color {
  public static brickLinkToRebrickable(colorId?: number): number {
    if (!colorId) return -1;

    const color = colors.find((color) => {
      return color.external_ids.BrickLink?.ext_ids.find((id) => {
        return id === colorId;
      });
    });

    return color ? color.id : -1;
  }

  public static getColor(colorId: number | undefined, type: string): IColor {
    if (!colorId) return colors[0];

    const color = colors.find((color) => {
      switch (type) {
        case "BrickLink":
          return color.external_ids.BrickLink?.ext_ids.find((id) => {
            return id === colorId;
          });
        case "Rebrickable": {
          return color.id === colorId;
        }
      }
    });

    return color ? color : colors[0];
  }
}

export function brickLinkToRebrickable(colorId?: number) {
  return Color.brickLinkToRebrickable(colorId);
}

export function getColor(colorId: number | undefined, type: string) {
  return Color.getColor(colorId, type);
}

const colors: IColor[] = [
  {
    id: -1,
    name: "[Unknown]",
    rgb: "00000000",
    is_trans: false,
    external_ids: {
      BrickOwl: {
        ext_ids: [
          0, 28, 29, 30, 31, 32, 33, 34, 60, 135, 136, 137, 138, 139, 140, 141,
          142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 156,
          157, 158, 160, 162, 163, 169,
        ],
        ext_descrs: [
          ["Not Applicable"],
          ["Modulex Medium Stone Gray"],
          ["Modulex Charcoal Gray"],
          ["Modulex Orange"],
          ["Modulex Ochre Yellow"],
          ["Modulex Olive Green"],
          ["Modulex Pastel Green"],
          ["Modulex Tile Blue"],
          ["Fabuland Orange"],
          ["Modulex Aqua Green"],
          ["Modulex Black"],
          ["Modulex Brown"],
          ["Modulex Buff"],
          ["Modulex Clear"],
          ["Modulex Lemon"],
          ["Modulex Light Gray"],
          ["Modulex Light Orange"],
          ["Modulex Light Yellow"],
          ["Modulex Medium Blue"],
          ["Modulex Pastel Blue"],
          ["Modulex Pink"],
          ["Modulex Pink Red"],
          ["Modulex Red"],
          ["Modulex Teal Blue"],
          ["Modulex Terracotta"],
          ["Modulex Tile Brown"],
          ["Modulex Tile Gray"],
          ["Modulex Violet"],
          ["Modulex White"],
          ["Warm Yellowish Orange"],
          ["Medium Yellowish Orange"],
          ["Reddish Orange"],
          ["Dark Nougat"],
          ["Transparent Fire Yellow"],
          ["Transparent Light Royal Blue"],
          ["Curry"],
        ],
      },
      LEGO: {
        ext_ids: [16, 125, 158, 176, 178],
        ext_descrs: [
          ["Pink"],
          ["Light Orange"],
          ["Tr. Flu. Red"],
          ["Red Flip/Flop"],
          ["Yellow Flip/Flop"],
        ],
      },
      Peeron: {
        ext_ids: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        ext_descrs: [
          ["blackgoldglitter"],
          ["curry"],
          ["dknougat"],
          ["ffred"],
          ["ffyellow"],
          ["fabulime"],
          ["fabuorange"],
          ["metalliccopper"],
          ["metallicwhite"],
          ["neonblue"],
          ["pearlgreen"],
          ["pearlescentpink"],
          ["redpink"],
          ["trltgreen"],
          ["trsalmon"],
        ],
      },
      LDraw: {
        ext_ids: [
          16, 24, 65, 66, 67, 273, 324, 375, 406, 449, 490, 493, 494, 495, 496,
          504, 511,
        ],
        ext_descrs: [
          ["Main_Colour"],
          ["Edge_Colour"],
          ["Rubber_Yellow"],
          ["Rubber_Trans_Yellow"],
          ["Rubber_Trans_Clear"],
          ["Rubber_Blue"],
          ["Rubber_Red"],
          ["Rubber_Light_Gray"],
          ["Rubber_Dark_Blue"],
          ["Rubber_Purple"],
          ["Rubber_Lime"],
          ["Magnet"],
          ["Electric_Contact_Alloy"],
          ["Electric_Contact_Copper"],
          ["Rubber_Light_Bluish_Gray"],
          ["Rubber_Flat_Silver"],
          ["Rubber_White"],
        ],
      },
    },
  },
  {
    id: 0,
    name: "Black",
    rgb: "05131D",
    is_trans: false,
    external_ids: {
      LDraw: {
        ext_ids: [256, 0],
        ext_descrs: [["Rubber_Black"], ["Black"]],
      },
      BrickLink: {
        ext_ids: [11],
        ext_descrs: [["Black"]],
      },
      BrickOwl: {
        ext_ids: [38],
        ext_descrs: [["Black"]],
      },
      LEGO: {
        ext_ids: [26, 149, 1012],
        ext_descrs: [
          ["Black", "BLACK"],
          ["Metallic Black", "MET.BLACK"],
          ["CONDUCT. BLACK"],
        ],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["black"]],
      },
    },
  },
  {
    id: 1,
    name: "Blue",
    rgb: "0055BF",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [7],
        ext_descrs: [["Blue"]],
      },
      BrickOwl: {
        ext_ids: [39],
        ext_descrs: [["Blue"]],
      },
      LEGO: {
        ext_ids: [23, 185],
        ext_descrs: [
          ["Bright Blue", "BR.BLUE"],
          ["Metallic Bright Blue", "MET. BR. BLUE"],
        ],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["blue"]],
      },
      LDraw: {
        ext_ids: [1],
        ext_descrs: [["Blue"]],
      },
    },
  },
  {
    id: 2,
    name: "Green",
    rgb: "237841",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [6],
        ext_descrs: [["Green"]],
      },
      BrickOwl: {
        ext_ids: [61],
        ext_descrs: [["Green"]],
      },
      LEGO: {
        ext_ids: [28, 186],
        ext_descrs: [
          ["Dark green", "DK.GREEN"],
          ["Metallic Dark Green", "MET. DK. GREEN"],
        ],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["green"]],
      },
      LDraw: {
        ext_ids: [2, 186],
        ext_descrs: [["Green"], ["Metallic_Dark_Green"]],
      },
    },
  },
  {
    id: 3,
    name: "Dark Turquoise",
    rgb: "008F9B",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [39],
        ext_descrs: [["Dark Turquoise"]],
      },
      BrickOwl: {
        ext_ids: [58],
        ext_descrs: [["Dark Turquoise"]],
      },
      LEGO: {
        ext_ids: [107],
        ext_descrs: [["Bright bluish green", "BR.BLUEGREEN"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["teal"]],
      },
      LDraw: {
        ext_ids: [3],
        ext_descrs: [["Dark_Turquoise"]],
      },
    },
  },
  {
    id: 4,
    name: "Red",
    rgb: "C91A09",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [5],
        ext_descrs: [["Red"]],
      },
      BrickOwl: {
        ext_ids: [81],
        ext_descrs: [["Red"]],
      },
      LEGO: {
        ext_ids: [21, 184],
        ext_descrs: [
          ["Bright red", "BR.RED"],
          ["Metallic Bright Red", "MET. BR. RED"],
        ],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["red"]],
      },
      LDraw: {
        ext_ids: [4, 184],
        ext_descrs: [["Red"], ["Metallic_Bright_Red"]],
      },
    },
  },
  {
    id: 5,
    name: "Dark Pink",
    rgb: "C870A0",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [47],
        ext_descrs: [["Dark Pink"]],
      },
      BrickOwl: {
        ext_ids: [17],
        ext_descrs: [["Dark Pink"]],
      },
      LEGO: {
        ext_ids: [221],
        ext_descrs: [["Bright Purple", "BR. PURPLE"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["dkpink"]],
      },
      LDraw: {
        ext_ids: [5],
        ext_descrs: [["Dark_Pink"]],
      },
    },
  },
  {
    id: 6,
    name: "Brown",
    rgb: "583927",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [8],
        ext_descrs: [["Brown"]],
      },
      BrickOwl: {
        ext_ids: [46],
        ext_descrs: [["Brown"]],
      },
      LEGO: {
        ext_ids: [187, 217, 25],
        ext_descrs: [
          ["Sand Yellow Metallic", "MET. EAR.ORA"],
          ["Brown"],
          ["Earth Orange", "EARTH-ORA"],
        ],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["oldbrown"]],
      },
      LDraw: {
        ext_ids: [6],
        ext_descrs: [["Brown"]],
      },
    },
  },
  {
    id: 7,
    name: "Light Gray",
    rgb: "9BA19D",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [9],
        ext_descrs: [["Light Gray"]],
      },
      BrickOwl: {
        ext_ids: [66],
        ext_descrs: [["Light Gray"]],
      },
      LEGO: {
        ext_ids: [2],
        ext_descrs: [["Grey"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["oldgray"]],
      },
      LDraw: {
        ext_ids: [7],
        ext_descrs: [["Light_Gray"]],
      },
    },
  },
  {
    id: 8,
    name: "Dark Gray",
    rgb: "6D6E5C",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [10],
        ext_descrs: [["Dark Gray"]],
      },
      BrickOwl: {
        ext_ids: [53],
        ext_descrs: [["Dark Gray"]],
      },
      LEGO: {
        ext_ids: [27],
        ext_descrs: [["Dark grey", "DK.GREY"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["olddkgray"]],
      },
      LDraw: {
        ext_ids: [8],
        ext_descrs: [["Dark_Gray"]],
      },
    },
  },
  {
    id: 9,
    name: "Light Blue",
    rgb: "B4D2E3",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [62],
        ext_descrs: [["Light Blue"]],
      },
      BrickOwl: {
        ext_ids: [63],
        ext_descrs: [["Light Blue"]],
      },
      LEGO: {
        ext_ids: [45],
        ext_descrs: [["Light blue"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["ltblue"]],
      },
      LDraw: {
        ext_ids: [9],
        ext_descrs: [["Light_Blue"]],
      },
    },
  },
  {
    id: 10,
    name: "Bright Green",
    rgb: "4B9F4A",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [36],
        ext_descrs: [["Bright Green"]],
      },
      BrickOwl: {
        ext_ids: [41],
        ext_descrs: [["Bright Green"]],
      },
      LEGO: {
        ext_ids: [37],
        ext_descrs: [["Bright Green", "BR.GREEN"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["btgreen"]],
      },
      LDraw: {
        ext_ids: [10],
        ext_descrs: [["Bright_Green"]],
      },
    },
  },
  {
    id: 11,
    name: "Light Turquoise",
    rgb: "55A5AF",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [40],
        ext_descrs: [["Light Turquoise"]],
      },
      BrickOwl: {
        ext_ids: [12],
        ext_descrs: [["Light Turquoise"]],
      },
      LEGO: {
        ext_ids: [116],
        ext_descrs: [["Med. bluish green", "MD.BL-GREEN"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["ltteal"]],
      },
      LDraw: {
        ext_ids: [11],
        ext_descrs: [["Light_Turquoise"]],
      },
    },
  },
  {
    id: 12,
    name: "Salmon",
    rgb: "F2705E",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [25],
        ext_descrs: [["Salmon"]],
      },
      BrickOwl: {
        ext_ids: [84],
        ext_descrs: [["Salmon"]],
      },
      LEGO: {
        ext_ids: [4],
        ext_descrs: [["Brick Red"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["salmon"]],
      },
      LDraw: {
        ext_ids: [12],
        ext_descrs: [["Salmon"]],
      },
    },
  },
  {
    id: 13,
    name: "Pink",
    rgb: "FC97AC",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [23],
        ext_descrs: [["Pink"]],
      },
      BrickOwl: {
        ext_ids: [3],
        ext_descrs: [["Pink"]],
      },
      LEGO: {
        ext_ids: [1007],
        ext_descrs: [["L.REDVIOL"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["pink"]],
      },
      LDraw: {
        ext_ids: [13],
        ext_descrs: [["Pink"]],
      },
    },
  },
  {
    id: 14,
    name: "Yellow",
    rgb: "F2CD37",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [3],
        ext_descrs: [["Yellow"]],
      },
      BrickOwl: {
        ext_ids: [93],
        ext_descrs: [["Yellow"]],
      },
      LEGO: {
        ext_ids: [24],
        ext_descrs: [["Bright yellow", "BR.YEL"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["yellow"]],
      },
      LDraw: {
        ext_ids: [14],
        ext_descrs: [["Yellow"]],
      },
    },
  },
  {
    id: 15,
    name: "White",
    rgb: "FFFFFF",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [1],
        ext_descrs: [["White"]],
      },
      BrickOwl: {
        ext_ids: [92],
        ext_descrs: [["White"]],
      },
      LEGO: {
        ext_ids: [1],
        ext_descrs: [["White"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["white"]],
      },
      LDraw: {
        ext_ids: [15],
        ext_descrs: [["White"]],
      },
    },
  },
  {
    id: 17,
    name: "Light Green",
    rgb: "C2DAB8",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [38],
        ext_descrs: [["Light Green"]],
      },
      BrickOwl: {
        ext_ids: [11],
        ext_descrs: [["Light Green"]],
      },
      LEGO: {
        ext_ids: [6],
        ext_descrs: [["Light green", "L.GREEN"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["ltgreen"]],
      },
      LDraw: {
        ext_ids: [17],
        ext_descrs: [["Light_Green"]],
      },
    },
  },
  {
    id: 18,
    name: "Light Yellow",
    rgb: "FBE696",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [33],
        ext_descrs: [["Light Yellow"]],
      },
      BrickOwl: {
        ext_ids: [9],
        ext_descrs: [["Light Yellow"]],
      },
      LEGO: {
        ext_ids: [3],
        ext_descrs: [["Light yellow"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["ltyellow"]],
      },
      LDraw: {
        ext_ids: [18],
        ext_descrs: [["Light_Yellow"]],
      },
    },
  },
  {
    id: 19,
    name: "Tan",
    rgb: "E4CD9E",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [2],
        ext_descrs: [["Tan"]],
      },
      BrickOwl: {
        ext_ids: [89],
        ext_descrs: [["Tan"]],
      },
      LEGO: {
        ext_ids: [5],
        ext_descrs: [["Brick yellow", "BRICK-YEL"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["tan"]],
      },
      LDraw: {
        ext_ids: [19],
        ext_descrs: [["Tan"]],
      },
    },
  },
  {
    id: 20,
    name: "Light Violet",
    rgb: "C9CAE2",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [44],
        ext_descrs: [["Light Violet"]],
      },
      BrickOwl: {
        ext_ids: [16],
        ext_descrs: [["Light Violet"]],
      },
      LEGO: {
        ext_ids: [39],
        ext_descrs: [["Light bluish violet", "L.BLUEVIOL"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["ltviolet"]],
      },
      LDraw: {
        ext_ids: [20],
        ext_descrs: [["Light_Violet"]],
      },
    },
  },
  {
    id: 21,
    name: "Glow In Dark Opaque",
    rgb: "D4D5C9",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [46],
        ext_descrs: [["Glow In Dark Opaque"]],
      },
      BrickOwl: {
        ext_ids: [127],
        ext_descrs: [["Glow in the Dark Opaque"]],
      },
      LEGO: {
        ext_ids: [50],
        ext_descrs: [["Phosp. White", "PHOS.WHITE"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["glowinthedark"]],
      },
      LDraw: {
        ext_ids: [21],
        ext_descrs: [["Glow_In_Dark_Opaque"]],
      },
    },
  },
  {
    id: 22,
    name: "Purple",
    rgb: "81007B",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [24],
        ext_descrs: [["Purple"]],
      },
      BrickOwl: {
        ext_ids: [4],
        ext_descrs: [["Purple"]],
      },
      LEGO: {
        ext_ids: [104],
        ext_descrs: [["Bright violet", "BR. VIOLET"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["purple"]],
      },
      LDraw: {
        ext_ids: [22],
        ext_descrs: [["Purple"]],
      },
    },
  },
  {
    id: 23,
    name: "Dark Blue-Violet",
    rgb: "2032B0",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [109],
        ext_descrs: [["Dark Blue-Violet"]],
      },
      BrickOwl: {
        ext_ids: [49],
        ext_descrs: [["Dark Royal Blue"]],
      },
      LEGO: {
        ext_ids: [196],
        ext_descrs: [["Dark Royal blue", "DK. R.BLUE"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["dkroyalblue"]],
      },
      LDraw: {
        ext_ids: [23],
        ext_descrs: [["Dark_Blue_Violet"]],
      },
    },
  },
  {
    id: 25,
    name: "Orange",
    rgb: "FE8A18",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [4],
        ext_descrs: [["Orange"]],
      },
      BrickOwl: {
        ext_ids: [80],
        ext_descrs: [["Orange"]],
      },
      LEGO: {
        ext_ids: [106],
        ext_descrs: [["Bright orange", "BR.ORANGE"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["orange"]],
      },
      LDraw: {
        ext_ids: [25],
        ext_descrs: [["Orange"]],
      },
    },
  },
  {
    id: 26,
    name: "Magenta",
    rgb: "923978",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [71],
        ext_descrs: [["Magenta"]],
      },
      BrickOwl: {
        ext_ids: [72],
        ext_descrs: [["Magenta"]],
      },
      LEGO: {
        ext_ids: [124],
        ext_descrs: [["Bright reddish violet", "BR.RED-VIOL."]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["magenta"]],
      },
      LDraw: {
        ext_ids: [26],
        ext_descrs: [["Magenta"]],
      },
    },
  },
  {
    id: 27,
    name: "Lime",
    rgb: "BBE90B",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [34],
        ext_descrs: [["Lime"]],
      },
      BrickOwl: {
        ext_ids: [70],
        ext_descrs: [["Lime"]],
      },
      LEGO: {
        ext_ids: [119],
        ext_descrs: [["Br. yellowish green", "BR.YEL-GREEN"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["lime"]],
      },
      LDraw: {
        ext_ids: [27],
        ext_descrs: [["Lime"]],
      },
    },
  },
  {
    id: 28,
    name: "Dark Tan",
    rgb: "958A73",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [69],
        ext_descrs: [["Dark Tan"]],
      },
      BrickOwl: {
        ext_ids: [57],
        ext_descrs: [["Dark Tan"]],
      },
      LEGO: {
        ext_ids: [138],
        ext_descrs: [["Sand yellow"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["dktan"]],
      },
      LDraw: {
        ext_ids: [28],
        ext_descrs: [["Dark_Tan"]],
      },
    },
  },
  {
    id: 29,
    name: "Bright Pink",
    rgb: "E4ADC8",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [104],
        ext_descrs: [["Bright Pink"]],
      },
      BrickOwl: {
        ext_ids: [45],
        ext_descrs: [["Bright Pink"]],
      },
      LEGO: {
        ext_ids: [222],
        ext_descrs: [["Light Purple", "LGH. PURPLE"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["btpink"]],
      },
      LDraw: {
        ext_ids: [29],
        ext_descrs: [["Bright_Pink"]],
      },
    },
  },
  {
    id: 30,
    name: "Medium Lavender",
    rgb: "AC78BA",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [157],
        ext_descrs: [["Medium Lavender"]],
      },
      BrickOwl: {
        ext_ids: [76],
        ext_descrs: [["Medium Lavender"]],
      },
      LEGO: {
        ext_ids: [324],
        ext_descrs: [["Medium Lavender", "MEDIUM LAVENDEL"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["mdlavender"]],
      },
      LDraw: {
        ext_ids: [30],
        ext_descrs: [["Medium_Lavender"]],
      },
    },
  },
  {
    id: 31,
    name: "Lavender",
    rgb: "E1D5ED",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [154],
        ext_descrs: [["Lavender"]],
      },
      BrickOwl: {
        ext_ids: [36],
        ext_descrs: [["Lavender"]],
      },
      LEGO: {
        ext_ids: [325],
        ext_descrs: [["Lavender"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["lavender"]],
      },
      LDraw: {
        ext_ids: [31],
        ext_descrs: [["Lavender"]],
      },
    },
  },
  {
    id: 32,
    name: "Trans-Black IR Lens",
    rgb: "635F52",
    is_trans: true,
    external_ids: {
      LDraw: {
        ext_ids: [32],
        ext_descrs: [["Trans_Black_IR_Lens"]],
      },
    },
  },
  {
    id: 33,
    name: "Trans-Dark Blue",
    rgb: "0020A0",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [14],
        ext_descrs: [["Trans-Dark Blue"]],
      },
      BrickOwl: {
        ext_ids: [98],
        ext_descrs: [["Transparent Dark Blue"]],
      },
      LEGO: {
        ext_ids: [43],
        ext_descrs: [["Tr. Blue", "TR.BLUE"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["trblue"]],
      },
      LDraw: {
        ext_ids: [33],
        ext_descrs: [["Trans_Dark_Blue"]],
      },
    },
  },
  {
    id: 34,
    name: "Trans-Green",
    rgb: "84B68D",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [20],
        ext_descrs: [["Trans-Green"]],
      },
      BrickOwl: {
        ext_ids: [100],
        ext_descrs: [["Transparent Green"]],
      },
      LEGO: {
        ext_ids: [48],
        ext_descrs: [["Tr. Green", "TR.GREEN"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["trgreen"]],
      },
      LDraw: {
        ext_ids: [34],
        ext_descrs: [["Trans_Green"]],
      },
    },
  },
  {
    id: 35,
    name: "Trans-Bright Green",
    rgb: "D9E4A7",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [108],
        ext_descrs: [["Trans-Bright Green"]],
      },
      BrickOwl: {
        ext_ids: [96],
        ext_descrs: [["Transparent Bright Green"]],
      },
      LEGO: {
        ext_ids: [311],
        ext_descrs: [["Transparent Bright Green", "TR. BR. GREEN"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["trbtgreen"]],
      },
      LDraw: {
        ext_ids: [35],
        ext_descrs: [["Trans_Bright_Green"]],
      },
    },
  },
  {
    id: 36,
    name: "Trans-Red",
    rgb: "C91A09",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [17],
        ext_descrs: [["Trans-Red"]],
      },
      BrickOwl: {
        ext_ids: [108],
        ext_descrs: [["Transparent Red"]],
      },
      LEGO: {
        ext_ids: [41],
        ext_descrs: [["Tr. Red", "TR.RED"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["trred"]],
      },
      LDraw: {
        ext_ids: [36],
        ext_descrs: [["Trans_Red"]],
      },
    },
  },
  {
    id: 40,
    name: "Trans-Black",
    rgb: "635F52",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [13],
        ext_descrs: [["Trans-Black"]],
      },
      BrickOwl: {
        ext_ids: [95],
        ext_descrs: [["Transparent Black"]],
      },
      LEGO: {
        ext_ids: [111],
        ext_descrs: [["Tr. Brown", "TR.BROWN"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["smoke"]],
      },
      LDraw: {
        ext_ids: [40],
        ext_descrs: [["Trans_Black"]],
      },
    },
  },
  {
    id: 41,
    name: "Trans-Light Blue",
    rgb: "AEEFEC",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [15],
        ext_descrs: [["Trans-Light Blue"]],
      },
      BrickOwl: {
        ext_ids: [101],
        ext_descrs: [["Transparent Light Blue"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["trltblue"]],
      },
      LDraw: {
        ext_ids: [43],
        ext_descrs: [["Trans_Medium_Blue"]],
      },
      LEGO: {
        ext_ids: [42],
        ext_descrs: [["Tr. Lg blue", "TR.L.BLUE", "1.MULT"]],
      },
    },
  },
  {
    id: 42,
    name: "Trans-Neon Green",
    rgb: "F8F184",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [16],
        ext_descrs: [["Trans-Neon Green"]],
      },
      BrickOwl: {
        ext_ids: [103],
        ext_descrs: [["Transparent Neon Green"]],
      },
      LEGO: {
        ext_ids: [49],
        ext_descrs: [["Tr. Flu. Green", "TR.FL.GREEN"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["trneongreen"]],
      },
      LDraw: {
        ext_ids: [42],
        ext_descrs: [["Trans_Neon_Green"]],
      },
    },
  },
  {
    id: 43,
    name: "Trans-Very Lt Blue",
    rgb: "C1DFF0",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [113],
        ext_descrs: [["Trans-Aqua"]],
      },
      BrickOwl: {
        ext_ids: [25],
        ext_descrs: [["Transparent Very Light Blue"]],
      },
      LEGO: {
        ext_ids: [229],
        ext_descrs: [["Transparent Light Bluish Green", "TR. LGH. BL. GR"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["triceblue"]],
      },
      LDraw: {
        ext_ids: [39],
        ext_descrs: [["Trans_Light_Blue"]],
      },
    },
  },
  {
    id: 45,
    name: "Trans-Dark Pink",
    rgb: "DF6695",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [50],
        ext_descrs: [["Trans-Dark Pink"]],
      },
      BrickOwl: {
        ext_ids: [99],
        ext_descrs: [["Transparent Dark Pink"]],
      },
      LEGO: {
        ext_ids: [113],
        ext_descrs: [["Tr. Medi. reddish violet", "TR.ML.R.VIOL"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["trpink"]],
      },
      LDraw: {
        ext_ids: [37],
        ext_descrs: [["Trans_Dark_Pink"]],
      },
    },
  },
  {
    id: 46,
    name: "Trans-Yellow",
    rgb: "F5CD2F",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [19],
        ext_descrs: [["Trans-Yellow"]],
      },
      BrickOwl: {
        ext_ids: [109],
        ext_descrs: [["Transparent Yellow"]],
      },
      LEGO: {
        ext_ids: [44],
        ext_descrs: [["Tr. Yellow", "TR.YEL"]],
      },
      Peeron: {
        ext_ids: [null, null],
        ext_descrs: [["tryellow"], ["trltyellow"]],
      },
      LDraw: {
        ext_ids: [46],
        ext_descrs: [["Trans_Yellow"]],
      },
    },
  },
  {
    id: 47,
    name: "Trans-Clear",
    rgb: "FCFCFC",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [12],
        ext_descrs: [["Trans-Clear"]],
      },
      BrickOwl: {
        ext_ids: [97],
        ext_descrs: [["Transparent"]],
      },
      LEGO: {
        ext_ids: [40],
        ext_descrs: [["Transparent", "TR."]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["clear"]],
      },
      LDraw: {
        ext_ids: [47],
        ext_descrs: [["Trans_Clear"]],
      },
    },
  },
  {
    id: 52,
    name: "Trans-Purple",
    rgb: "A5A5CB",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [51],
        ext_descrs: [["Trans-Purple"]],
      },
      BrickOwl: {
        ext_ids: [107],
        ext_descrs: [["Transparent Purple"]],
      },
      LEGO: {
        ext_ids: [126, 236],
        ext_descrs: [
          ["Tr. Bright bluish violet", "TR.KL.BL.VIO"],
          ["TR. BR. RED. LI"],
        ],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["trpurple"]],
      },
      LDraw: {
        ext_ids: [52],
        ext_descrs: [["Trans_Purple"]],
      },
    },
  },
  {
    id: 54,
    name: "Trans-Neon Yellow",
    rgb: "DAB000",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [121],
        ext_descrs: [["Trans-Neon Yellow"]],
      },
      BrickOwl: {
        ext_ids: [104],
        ext_descrs: [["Transparent Neon Yellow"]],
      },
      LEGO: {
        ext_ids: [157],
        ext_descrs: [["Transparent Fluorescent Yellow"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["trpeach"]],
      },
      LDraw: {
        ext_ids: [54],
        ext_descrs: [["Trans_Neon_Yellow"]],
      },
    },
  },
  {
    id: 57,
    name: "Trans-Neon Orange",
    rgb: "FF800D",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [18],
        ext_descrs: [["Trans-Neon Orange"]],
      },
      BrickOwl: {
        ext_ids: [161],
        ext_descrs: [["Transparent Neon Reddish Orange"]],
      },
      LEGO: {
        ext_ids: [47],
        ext_descrs: [["Tr. Flu. Reddish orange", "TR.FL.REDORA"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["trneonorange"]],
      },
      LDraw: {
        ext_ids: [38],
        ext_descrs: [["Trans_Neon_Orange"]],
      },
    },
  },
  {
    id: 60,
    name: "Chrome Antique Brass",
    rgb: "645A4C",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [57],
        ext_descrs: [["Chrome Antique Brass"]],
      },
      BrickOwl: {
        ext_ids: [110],
        ext_descrs: [["Chrome Brass"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["chromebrass"]],
      },
      LDraw: {
        ext_ids: [60],
        ext_descrs: [["Chrome_Antique_Brass"]],
      },
    },
  },
  {
    id: 61,
    name: "Chrome Blue",
    rgb: "6C96BF",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [52],
        ext_descrs: [["Chrome Blue"]],
      },
      BrickOwl: {
        ext_ids: [112],
        ext_descrs: [["Chrome Blue"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["chromeblue"]],
      },
      LDraw: {
        ext_ids: [61],
        ext_descrs: [["Chrome_Blue"]],
      },
    },
  },
  {
    id: 62,
    name: "Chrome Green",
    rgb: "3CB371",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [64],
        ext_descrs: [["Chrome Green"]],
      },
      BrickOwl: {
        ext_ids: [113],
        ext_descrs: [["Chrome Green"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["chromegreen"]],
      },
      LDraw: {
        ext_ids: [62],
        ext_descrs: [["Chrome_Green"]],
      },
    },
  },
  {
    id: 63,
    name: "Chrome Pink",
    rgb: "AA4D8E",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [82],
        ext_descrs: [["Chrome Pink"]],
      },
      BrickOwl: {
        ext_ids: [114],
        ext_descrs: [["Chrome Pink"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["chromepink"]],
      },
      LDraw: {
        ext_ids: [63],
        ext_descrs: [["Chrome_Pink"]],
      },
    },
  },
  {
    id: 64,
    name: "Chrome Black",
    rgb: "1B2A34",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [122],
        ext_descrs: [["Chrome Black"]],
      },
      BrickOwl: {
        ext_ids: [111],
        ext_descrs: [["Chrome Black"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["chromeblack"]],
      },
      LDraw: {
        ext_ids: [64],
        ext_descrs: [["Chrome_Black"]],
      },
    },
  },
  {
    id: 68,
    name: "Very Light Orange",
    rgb: "F3CF9B",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [96],
        ext_descrs: [["Very Light Orange"]],
      },
      BrickOwl: {
        ext_ids: [91],
        ext_descrs: [["Very Light Orange"]],
      },
      LEGO: {
        ext_ids: [36],
        ext_descrs: [["Light Yellowish Orange"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["paleorange"]],
      },
      LDraw: {
        ext_ids: [68],
        ext_descrs: [["Very_Light_Orange"]],
      },
    },
  },
  {
    id: 69,
    name: "Light Purple",
    rgb: "CD6298",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [93],
        ext_descrs: [["Light Purple"]],
      },
      BrickOwl: {
        ext_ids: [69],
        ext_descrs: [["Light Purple"]],
      },
      LEGO: {
        ext_ids: [198],
        ext_descrs: [["Bright Reddish Lilac", "BR. RED. LILAC"]],
      },
      Peeron: {
        ext_ids: [null, null],
        ext_descrs: [["ltpurple"], ["btpurple"]],
      },
      LDraw: {
        ext_ids: [69],
        ext_descrs: [["Light_Purple"]],
      },
    },
  },
  {
    id: 70,
    name: "Reddish Brown",
    rgb: "582A12",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [88],
        ext_descrs: [["Reddish Brown"]],
      },
      BrickOwl: {
        ext_ids: [82],
        ext_descrs: [["Reddish Brown"]],
      },
      LEGO: {
        ext_ids: [192],
        ext_descrs: [["Reddish Brown", "RED. BROWN"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["redbrown"]],
      },
      LDraw: {
        ext_ids: [70],
        ext_descrs: [["Reddish_Brown"]],
      },
    },
  },
  {
    id: 71,
    name: "Light Bluish Gray",
    rgb: "A0A5A9",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [86],
        ext_descrs: [["Light Bluish Gray"]],
      },
      BrickOwl: {
        ext_ids: [64],
        ext_descrs: [["Medium Stone Gray"]],
      },
      LEGO: {
        ext_ids: [194],
        ext_descrs: [["Medium stone grey", "MED. ST-GREY"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["mdstone"]],
      },
      LDraw: {
        ext_ids: [71],
        ext_descrs: [["Light_Bluish_Gray"]],
      },
    },
  },
  {
    id: 72,
    name: "Dark Bluish Gray",
    rgb: "6C6E68",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [85],
        ext_descrs: [["Dark Bluish Gray"]],
      },
      BrickOwl: {
        ext_ids: [50],
        ext_descrs: [["Dark Stone Gray"]],
      },
      LEGO: {
        ext_ids: [199],
        ext_descrs: [["Dark stone grey", "DK. ST. GREY"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["dkstone"]],
      },
      LDraw: {
        ext_ids: [72],
        ext_descrs: [["Dark_Bluish_Gray"]],
      },
    },
  },
  {
    id: 73,
    name: "Medium Blue",
    rgb: "5A93DB",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [42],
        ext_descrs: [["Medium Blue"]],
      },
      BrickOwl: {
        ext_ids: [14],
        ext_descrs: [["Medium Blue"]],
      },
      LEGO: {
        ext_ids: [102],
        ext_descrs: [["Medium blue", "MD.BLUE"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["mdblue"]],
      },
      LDraw: {
        ext_ids: [73],
        ext_descrs: [["Medium_Blue"]],
      },
    },
  },
  {
    id: 74,
    name: "Medium Green",
    rgb: "73DCA1",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [37],
        ext_descrs: [["Medium Green"]],
      },
      BrickOwl: {
        ext_ids: [10],
        ext_descrs: [["Medium Green"]],
      },
      LEGO: {
        ext_ids: [29],
        ext_descrs: [["Medium green", "MD.GREEN"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["mdgreen"]],
      },
      LDraw: {
        ext_ids: [74],
        ext_descrs: [["Medium_Green"]],
      },
    },
  },
  {
    id: 75,
    name: "Speckle Black-Copper",
    rgb: "05131D",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [116],
        ext_descrs: [["Speckle Black-Copper"]],
      },
      BrickOwl: {
        ext_ids: [133],
        ext_descrs: [["Speckle Black Copper"]],
      },
      LEGO: {
        ext_ids: [75],
        ext_descrs: [["COP. DIF."]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["blackcopperglitter"]],
      },
      LDraw: {
        ext_ids: [75],
        ext_descrs: [["Speckle_Black_Copper"]],
      },
    },
  },
  {
    id: 76,
    name: "Speckle DBGray-Silver",
    rgb: "6C6E68",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [117],
        ext_descrs: [["Speckle DBGray-Silver"]],
      },
      BrickOwl: {
        ext_ids: [134],
        ext_descrs: [["Speckle Gray"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["dkstoneglitter"]],
      },
      LDraw: {
        ext_ids: [76],
        ext_descrs: [["Speckle_Dark_Bluish_Gray_Silver"]],
      },
    },
  },
  {
    id: 77,
    name: "Light Pink",
    rgb: "FECCCF",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [56],
        ext_descrs: [["Light Pink"]],
      },
      BrickOwl: {
        ext_ids: [68],
        ext_descrs: [["Light Pink"]],
      },
      LEGO: {
        ext_ids: [223],
        ext_descrs: [["Light Pink"]],
      },
      Peeron: {
        ext_ids: [null, null],
        ext_descrs: [["parapink"], ["ltpink"]],
      },
      LDraw: {
        ext_ids: [77],
        ext_descrs: [["Light_Pink"]],
      },
    },
  },
  {
    id: 78,
    name: "Light Flesh",
    rgb: "F6D7B3",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [90],
        ext_descrs: [["Light Nougat"]],
      },
      BrickOwl: {
        ext_ids: [65],
        ext_descrs: [["Light Flesh"]],
      },
      LEGO: {
        ext_ids: [283],
        ext_descrs: [["Light Nougat", "L.NOUGAT"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["ltflesh"]],
      },
      LDraw: {
        ext_ids: [78],
        ext_descrs: [["Light_Flesh"]],
      },
    },
  },
  {
    id: 79,
    name: "Milky White",
    rgb: "FFFFFF",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [60],
        ext_descrs: [["Milky White"]],
      },
      BrickOwl: {
        ext_ids: [130],
        ext_descrs: [["Translucent White"]],
      },
      LEGO: {
        ext_ids: [20],
        ext_descrs: [["Nature"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["trluwhite"]],
      },
      LDraw: {
        ext_ids: [79],
        ext_descrs: [["Milky_White"]],
      },
    },
  },
  {
    id: 80,
    name: "Metallic Silver",
    rgb: "A5A9B4",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [67],
        ext_descrs: [["Metallic Silver"]],
      },
      BrickOwl: {
        ext_ids: [126],
        ext_descrs: [["Metallic Silver"]],
      },
      LEGO: {
        ext_ids: [298, 1002, 1015, 296, 336],
        ext_descrs: [
          ["Cool silver"],
          ["C.SILVER, DR. L"],
          ["C.SILVER"],
          ["Cool silver"],
          ["SILVER INK"],
        ],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["metallicsilver"]],
      },
      LDraw: {
        ext_ids: [80],
        ext_descrs: [["Metallic_Silver"]],
      },
    },
  },
  {
    id: 81,
    name: "Metallic Green",
    rgb: "899B5F",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [70],
        ext_descrs: [["Metallic Green"]],
      },
      BrickOwl: {
        ext_ids: [125],
        ext_descrs: [["Metallic Green"]],
      },
      LEGO: {
        ext_ids: [200],
        ext_descrs: [["Lemon Metallic"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["metallicgreen"]],
      },
      LDraw: {
        ext_ids: [81],
        ext_descrs: [["Metallic_Green"]],
      },
    },
  },
  {
    id: 82,
    name: "Metallic Gold",
    rgb: "DBAC34",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [65],
        ext_descrs: [["Metallic Gold"]],
      },
      BrickOwl: {
        ext_ids: [124],
        ext_descrs: [["Metallic Gold"]],
      },
      LEGO: {
        ext_ids: [1004, 335],
        ext_descrs: [["W.GOLD, DR.LA."], ["GOLD INK"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["metallicgold"]],
      },
      LDraw: {
        ext_ids: [82],
        ext_descrs: [["Metallic_Gold"]],
      },
    },
  },
  {
    id: 84,
    name: "Medium Dark Flesh",
    rgb: "CC702A",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [150],
        ext_descrs: [["Medium Nougat"]],
      },
      BrickOwl: {
        ext_ids: [74],
        ext_descrs: [["Medium Dark Flesh"]],
      },
      LEGO: {
        ext_ids: [312],
        ext_descrs: [["Medium Nougat", "M. NOUGAT"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["mddkflesh"]],
      },
      LDraw: {
        ext_ids: [84],
        ext_descrs: [["Medium_Dark_Flesh"]],
      },
    },
  },
  {
    id: 85,
    name: "Dark Purple",
    rgb: "3F3691",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [89],
        ext_descrs: [["Dark Purple"]],
      },
      BrickOwl: {
        ext_ids: [55],
        ext_descrs: [["Dark Purple"]],
      },
      LEGO: {
        ext_ids: [268],
        ext_descrs: [["Medium Lilac", "M. LILAC"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["mdlilac"]],
      },
      LDraw: {
        ext_ids: [85],
        ext_descrs: [["Dark_Purple"]],
      },
    },
  },
  {
    id: 86,
    name: "Dark Flesh",
    rgb: "7C503A",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [91],
        ext_descrs: [["Medium Brown"]],
      },
      BrickOwl: {
        ext_ids: [52],
        ext_descrs: [["Dark Flesh"]],
      },
      LEGO: {
        ext_ids: [86],
        ext_descrs: [["BROWN"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["dkflesh"]],
      },
      LDraw: {
        ext_ids: [86],
        ext_descrs: [["Dark_Flesh"]],
      },
    },
  },
  {
    id: 89,
    name: "Royal Blue",
    rgb: "4C61DB",
    is_trans: false,
    external_ids: {
      LEGO: {
        ext_ids: [195],
        ext_descrs: [["R. BLUE"]],
      },
      LDraw: {
        ext_ids: [89],
        ext_descrs: [["Blue_Violet"]],
      },
    },
  },
  {
    id: 92,
    name: "Flesh",
    rgb: "D09168",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [28],
        ext_descrs: [["Nougat"]],
      },
      BrickOwl: {
        ext_ids: [6],
        ext_descrs: [["Flesh"]],
      },
      LEGO: {
        ext_ids: [18],
        ext_descrs: [["Nougat"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["flesh"]],
      },
      LDraw: {
        ext_ids: [92],
        ext_descrs: [["Flesh"]],
      },
    },
  },
  {
    id: 100,
    name: "Light Salmon",
    rgb: "FEBABD",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [26],
        ext_descrs: [["Light Salmon"]],
      },
      BrickOwl: {
        ext_ids: [5],
        ext_descrs: [["Light Salmon"]],
      },
      LEGO: {
        ext_ids: [100],
        ext_descrs: [["Light red"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["ltsalmon"]],
      },
      LDraw: {
        ext_ids: [100],
        ext_descrs: [["Light_Salmon"]],
      },
    },
  },
  {
    id: 110,
    name: "Violet",
    rgb: "4354A3",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [43],
        ext_descrs: [["Violet"]],
      },
      BrickOwl: {
        ext_ids: [15],
        ext_descrs: [["Violet"]],
      },
      LEGO: {
        ext_ids: [110, 1009],
        ext_descrs: [["Bright Bluish Violet", "BR.BLUEVIOL"], ["LILAC"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["violet"]],
      },
      LDraw: {
        ext_ids: [110],
        ext_descrs: [["Violet"]],
      },
    },
  },
  {
    id: 112,
    name: "Blue-Violet",
    rgb: "6874CA",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [97],
        ext_descrs: [["Blue-Violet"]],
      },
      BrickOwl: {
        ext_ids: [40],
        ext_descrs: [["Royal Blue"]],
      },
      LEGO: {
        ext_ids: [112],
        ext_descrs: [["Medium Bluish Violet", "ML.BLUEVIOL"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["royalblue"]],
      },
      LDraw: {
        ext_ids: [112],
        ext_descrs: [["Medium_Violet"]],
      },
    },
  },
  {
    id: 114,
    name: "Glitter Trans-Dark Pink",
    rgb: "DF6695",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [100],
        ext_descrs: [["Glitter Trans-Dark Pink"]],
      },
      BrickOwl: {
        ext_ids: [132],
        ext_descrs: [["Transparent Pink Glitter"]],
      },
      LEGO: {
        ext_ids: [114],
        ext_descrs: [
          ["Tr. Medium Reddish-Violet w. Glitter 2%", "TR.M.R.V.GLI"],
        ],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["trpinkglitter"]],
      },
      LDraw: {
        ext_ids: [114],
        ext_descrs: [["Glitter_Trans_Dark_Pink"]],
      },
    },
  },
  {
    id: 115,
    name: "Medium Lime",
    rgb: "C7D23C",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [76],
        ext_descrs: [["Medium Lime"]],
      },
      BrickOwl: {
        ext_ids: [77],
        ext_descrs: [["Medium Lime"]],
      },
      LEGO: {
        ext_ids: [115],
        ext_descrs: [["Med. yellowish green", "MD.YEL-GREEN"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["mdlime"]],
      },
      LDraw: {
        ext_ids: [115],
        ext_descrs: [["Medium_Lime"]],
      },
    },
  },
  {
    id: 117,
    name: "Glitter Trans-Clear",
    rgb: "FFFFFF",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [101],
        ext_descrs: [["Glitter Trans-Clear"]],
      },
      BrickOwl: {
        ext_ids: [131],
        ext_descrs: [["Transparent Glitter"]],
      },
      LEGO: {
        ext_ids: [117],
        ext_descrs: [["Transparent Glitter", "TR.W.GLITTER"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["clearglitter"]],
      },
      LDraw: {
        ext_ids: [117],
        ext_descrs: [["Glitter_Trans_Clear"]],
      },
    },
  },
  {
    id: 118,
    name: "Aqua",
    rgb: "B3D7D1",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [41],
        ext_descrs: [["Aqua"]],
      },
      BrickOwl: {
        ext_ids: [13],
        ext_descrs: [["Aqua"]],
      },
      LEGO: {
        ext_ids: [118],
        ext_descrs: [["Light bluish green", "L.BLUE-GREEN"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["aqua"]],
      },
      LDraw: {
        ext_ids: [118],
        ext_descrs: [["Aqua"]],
      },
    },
  },
  {
    id: 120,
    name: "Light Lime",
    rgb: "D9E4A7",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [35],
        ext_descrs: [["Light Lime"]],
      },
      BrickOwl: {
        ext_ids: [67],
        ext_descrs: [["Light Lime"]],
      },
      LEGO: {
        ext_ids: [120],
        ext_descrs: [["Lig. yellowish green", "L.YEL-GREEN"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["ltlime"]],
      },
      LDraw: {
        ext_ids: [120],
        ext_descrs: [["Light_Lime"]],
      },
    },
  },
  {
    id: 125,
    name: "Light Orange",
    rgb: "F9BA61",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [32],
        ext_descrs: [["Light Orange"]],
      },
      BrickOwl: {
        ext_ids: [8],
        ext_descrs: [["Light Orange"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["ltorange"]],
      },
      LDraw: {
        ext_ids: [125],
        ext_descrs: [["Light_Orange"]],
      },
    },
  },
  {
    id: 129,
    name: "Glitter Trans-Purple",
    rgb: "A5A5CB",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [102],
        ext_descrs: [["Glitter Trans-Purple"]],
      },
      BrickOwl: {
        ext_ids: [22],
        ext_descrs: [["Transparent Purple Glitter"]],
      },
      LEGO: {
        ext_ids: [129],
        ext_descrs: [
          ["Tr. Bright Bluish Violet w. Glitter 2%", "TR.BR.BL.V.G"],
        ],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["trpurpleglitter"]],
      },
      LDraw: {
        ext_ids: [129],
        ext_descrs: [["Glitter_Trans_Purple"]],
      },
    },
  },
  {
    id: 132,
    name: "Speckle Black-Silver",
    rgb: "05131D",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [111],
        ext_descrs: [["Speckle Black-Silver"]],
      },
      BrickOwl: {
        ext_ids: [24],
        ext_descrs: [["Speckle Black"]],
      },
      LEGO: {
        ext_ids: [132],
        ext_descrs: [["Black Glitter", "CO.SILVER DIF"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["blackglitter"]],
      },
      LDraw: {
        ext_ids: [132],
        ext_descrs: [["Speckle_Black_Silver"]],
      },
    },
  },
  {
    id: 133,
    name: "Speckle Black-Gold",
    rgb: "05131D",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [151],
        ext_descrs: [["Speckle Black-Gold"]],
      },
      BrickOwl: {
        ext_ids: [35],
        ext_descrs: [["Speckle Black Gold"]],
      },
      LDraw: {
        ext_ids: [133],
        ext_descrs: [["Speckle_Black_Gold"]],
      },
    },
  },
  {
    id: 134,
    name: "Copper",
    rgb: "AE7A59",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [84],
        ext_descrs: [["Copper"]],
      },
      BrickOwl: {
        ext_ids: [116],
        ext_descrs: [["Copper"]],
      },
      LEGO: {
        ext_ids: [139, 1016, 134],
        ext_descrs: [
          ["Copper", "RED. GOLD"],
          ["COPPER INK"],
          ["COPPER, DR.LA."],
        ],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["pearlcopper"]],
      },
      LDraw: {
        ext_ids: [134],
        ext_descrs: [["Copper"]],
      },
    },
  },
  {
    id: 135,
    name: "Pearl Light Gray",
    rgb: "9CA3A8",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [66],
        ext_descrs: [["Pearl Light Gray"]],
      },
      BrickOwl: {
        ext_ids: [122],
        ext_descrs: [["Pearl Light Gray"]],
      },
      LEGO: {
        ext_ids: [179, 131],
        ext_descrs: [["Silver flip/flop", "SILVER"], ["Silver"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["pearlltgray"]],
      },
      LDraw: {
        ext_ids: [135],
        ext_descrs: [["Pearl_Light_Gray"]],
      },
    },
  },
  {
    id: 137,
    name: "Metal Blue",
    rgb: "7988A1",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [78],
        ext_descrs: [["Metal Blue"]],
      },
      BrickOwl: {
        ext_ids: [118],
        ext_descrs: [["Metallic Blue"]],
      },
      LEGO: {
        ext_ids: [145, 137],
        ext_descrs: [["Sand blue metallic"], ["Metal Blue", "MET.SAND.BLU"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["pearlblue"]],
      },
      LDraw: {
        ext_ids: [137],
        ext_descrs: [["Metal_Blue"]],
      },
    },
  },
  {
    id: 142,
    name: "Pearl Light Gold",
    rgb: "DCBC81",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [61],
        ext_descrs: [["Pearl Light Gold"]],
      },
      BrickOwl: {
        ext_ids: [121],
        ext_descrs: [["Pearl Light Gold"]],
      },
      LEGO: {
        ext_ids: [127],
        ext_descrs: [["Gold"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["pearlltgold"]],
      },
      LDraw: {
        ext_ids: [142],
        ext_descrs: [["Pearl_Light_Gold"]],
      },
    },
  },
  {
    id: 143,
    name: "Trans-Medium Blue",
    rgb: "CFE2F7",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [74],
        ext_descrs: [["Trans-Medium Blue"]],
      },
      BrickOwl: {
        ext_ids: [102],
        ext_descrs: [["Transparent Medium Blue"]],
      },
      LEGO: {
        ext_ids: [143],
        ext_descrs: [["Tr. Flu. Blue", "TR.FL. BLUE"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["trmdblue"]],
      },
      LDraw: {
        ext_ids: [41],
        ext_descrs: [["Trans_Medium_Blue"]],
      },
    },
  },
  {
    id: 148,
    name: "Pearl Dark Gray",
    rgb: "575857",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [77],
        ext_descrs: [["Pearl Dark Gray"]],
      },
      BrickOwl: {
        ext_ids: [119],
        ext_descrs: [["Pearl Dark Gray"]],
      },
      LEGO: {
        ext_ids: [316, 148],
        ext_descrs: [
          ["Titanium Metallic", "TITAN. METAL."],
          ["Mettalic Dark Grey", "MET.DK.GREY"],
        ],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["pearldkgray"]],
      },
      LDraw: {
        ext_ids: [83, 148, 87],
        ext_descrs: [
          ["Metallic_Black"],
          ["Pearl_Dark_Gray"],
          ["Metallic_Dark_Gray"],
        ],
      },
    },
  },
  {
    id: 150,
    name: "Pearl Very Light Gray",
    rgb: "ABADAC",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [119],
        ext_descrs: [["Pearl Very Light Gray"]],
      },
      BrickOwl: {
        ext_ids: [27],
        ext_descrs: [["Pearl Very Light Gray"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["pearlvlgray"]],
      },
      LDraw: {
        ext_ids: [150],
        ext_descrs: [["Pearl_Very_Light_Grey"]],
      },
    },
  },
  {
    id: 151,
    name: "Very Light Bluish Gray",
    rgb: "E6E3E0",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [99],
        ext_descrs: [["Very Light Bluish Gray"]],
      },
      BrickOwl: {
        ext_ids: [90],
        ext_descrs: [["Light Stone Gray"]],
      },
      LEGO: {
        ext_ids: [208],
        ext_descrs: [["Light stone grey", "LGH. ST. GREY"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["ltstone"]],
      },
      LDraw: {
        ext_ids: [151],
        ext_descrs: [["Very_Light_Bluish_Gray"]],
      },
    },
  },
  {
    id: 158,
    name: "Yellowish Green",
    rgb: "DFEEA5",
    is_trans: false,
    external_ids: {
      LDraw: {
        ext_ids: [326],
        ext_descrs: [["Yellowish_Green"]],
      },
      BrickLink: {
        ext_ids: [158],
        ext_descrs: [["Yellowish Green"]],
      },
      BrickOwl: {
        ext_ids: [94],
        ext_descrs: [["Yellowish Green"]],
      },
      LEGO: {
        ext_ids: [326],
        ext_descrs: [["Spring Yellow Green", "SPR. YELL. GREE"]],
      },
    },
  },
  {
    id: 178,
    name: "Flat Dark Gold",
    rgb: "B48455",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [81],
        ext_descrs: [["Flat Dark Gold"]],
      },
      BrickOwl: {
        ext_ids: [21],
        ext_descrs: [["Flat Dark Gold"]],
      },
      LEGO: {
        ext_ids: [1001],
        ext_descrs: [["Gold Metallic", "MET.SAND.YEL"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["pearldkgold"]],
      },
      LDraw: {
        ext_ids: [178],
        ext_descrs: [["Flat_Dark_Gold"]],
      },
    },
  },
  {
    id: 179,
    name: "Flat Silver",
    rgb: "898788",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [95],
        ext_descrs: [["Flat Silver"]],
      },
      BrickOwl: {
        ext_ids: [117],
        ext_descrs: [["Flat Silver"]],
      },
      LEGO: {
        ext_ids: [315],
        ext_descrs: [["Silver Metallic", "SILVER MET."]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["pearlsilver"]],
      },
      LDraw: {
        ext_ids: [179],
        ext_descrs: [["Flat_Silver"]],
      },
    },
  },
  {
    id: 182,
    name: "Trans-Orange",
    rgb: "F08F1C",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [98],
        ext_descrs: [["Trans-Orange"]],
      },
      BrickOwl: {
        ext_ids: [105],
        ext_descrs: [["Transparent Orange"]],
      },
      LEGO: {
        ext_ids: [182],
        ext_descrs: [["Tr. Bright Orange", "TR. BR. ORANGE"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["trdkorange"]],
      },
      LDraw: {
        ext_ids: [57],
        ext_descrs: [["Trans_Orange"]],
      },
    },
  },
  {
    id: 183,
    name: "Pearl White",
    rgb: "F2F3F2",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [83],
        ext_descrs: [["Pearl White"]],
      },
      BrickOwl: {
        ext_ids: [123],
        ext_descrs: [["Pearlescent"]],
      },
      LEGO: {
        ext_ids: [183],
        ext_descrs: [["Metallic White", "MET. WHITE"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["pearlescent"]],
      },
      LDraw: {
        ext_ids: [183],
        ext_descrs: [["Pearl_White"]],
      },
    },
  },
  {
    id: 191,
    name: "Bright Light Orange",
    rgb: "F8BB3D",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [110],
        ext_descrs: [["Bright Light Orange"]],
      },
      BrickOwl: {
        ext_ids: [43],
        ext_descrs: [["Bright Light Orange"]],
      },
      LEGO: {
        ext_ids: [191],
        ext_descrs: [["Flame yellowish orange", "FL. YELL-ORA"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["btltorange"]],
      },
      LDraw: {
        ext_ids: [191],
        ext_descrs: [["Bright_Light_Orange"]],
      },
    },
  },
  {
    id: 212,
    name: "Bright Light Blue",
    rgb: "9FC3E9",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [105],
        ext_descrs: [["Bright Light Blue"]],
      },
      BrickOwl: {
        ext_ids: [42],
        ext_descrs: [["Bright Light Blue"]],
      },
      LEGO: {
        ext_ids: [212],
        ext_descrs: [["Light Royal blue", "LGH. ROY. BLUE"]],
      },
      Peeron: {
        ext_ids: [null, null],
        ext_descrs: [["ltroyalblue"], ["btltblue"]],
      },
      LDraw: {
        ext_ids: [212],
        ext_descrs: [["Bright_Light_Blue"]],
      },
    },
  },
  {
    id: 216,
    name: "Rust",
    rgb: "B31004",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [27],
        ext_descrs: [["Rust"]],
      },
      BrickOwl: {
        ext_ids: [83],
        ext_descrs: [["Rust"]],
      },
      LEGO: {
        ext_ids: [216],
        ext_descrs: [["Rust"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["rust"]],
      },
      LDraw: {
        ext_ids: [216],
        ext_descrs: [["Rust"]],
      },
    },
  },
  {
    id: 226,
    name: "Bright Light Yellow",
    rgb: "FFF03A",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [103],
        ext_descrs: [["Bright Light Yellow"]],
      },
      BrickOwl: {
        ext_ids: [44],
        ext_descrs: [["Bright Light Yellow"]],
      },
      LEGO: {
        ext_ids: [226],
        ext_descrs: [["Cool Yellow", "COOL YEL."]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["coolyellow"]],
      },
      LDraw: {
        ext_ids: [226],
        ext_descrs: [["Bright_Light_Yellow"]],
      },
    },
  },
  {
    id: 230,
    name: "Trans-Pink",
    rgb: "E4ADC8",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [107],
        ext_descrs: [["Trans-Pink"]],
      },
      BrickOwl: {
        ext_ids: [106],
        ext_descrs: [["Transparent Pink"]],
      },
      LEGO: {
        ext_ids: [230],
        ext_descrs: [["TR. BR. PURPLE"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["trltpink"]],
      },
      LDraw: {
        ext_ids: [45],
        ext_descrs: [["Trans_Pink"]],
      },
    },
  },
  {
    id: 232,
    name: "Sky Blue",
    rgb: "7DBFDD",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [87],
        ext_descrs: [["Sky Blue"]],
      },
      BrickOwl: {
        ext_ids: [88],
        ext_descrs: [["Sky Blue"]],
      },
      LEGO: {
        ext_ids: [232],
        ext_descrs: [["Dove blue", "DO. BLUE"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["doveblue"]],
      },
      LDraw: {
        ext_ids: [232],
        ext_descrs: [["Sky_Blue"]],
      },
    },
  },
  {
    id: 236,
    name: "Trans-Light Purple",
    rgb: "96709F",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [114],
        ext_descrs: [["Trans-Light Purple"]],
      },
      BrickOwl: {
        ext_ids: [26],
        ext_descrs: [["Transparent Light Purple"]],
      },
      LEGO: {
        ext_ids: [284],
        ext_descrs: [["TR. RED-LILAC", "TR. RE-LILAC"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["trlilac"]],
      },
      LDraw: {
        ext_ids: [44, 284],
        ext_descrs: [["Trans_Light_Purple"], ["Trans_Light_Purple"]],
      },
    },
  },
  {
    id: 272,
    name: "Dark Blue",
    rgb: "0A3463",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [63],
        ext_descrs: [["Dark Blue"]],
      },
      BrickOwl: {
        ext_ids: [48],
        ext_descrs: [["Dark Blue"]],
      },
      LEGO: {
        ext_ids: [140],
        ext_descrs: [["Earth blue"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["navyblue"]],
      },
      LDraw: {
        ext_ids: [272],
        ext_descrs: [["Dark_Blue"]],
      },
    },
  },
  {
    id: 288,
    name: "Dark Green",
    rgb: "184632",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [80],
        ext_descrs: [["Dark Green"]],
      },
      BrickOwl: {
        ext_ids: [20],
        ext_descrs: [["Dark Green"]],
      },
      LEGO: {
        ext_ids: [141],
        ext_descrs: [["Earth Green", "EARTH GREEN"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["dkgreen"]],
      },
      LDraw: {
        ext_ids: [288],
        ext_descrs: [["Dark_Green"]],
      },
    },
  },
  {
    id: 294,
    name: "Glow In Dark Trans",
    rgb: "BDC6AD",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [118],
        ext_descrs: [["Glow In Dark Trans"]],
      },
      BrickOwl: {
        ext_ids: [128],
        ext_descrs: [["Glow in the Dark Transparent"]],
      },
      LEGO: {
        ext_ids: [294],
        ext_descrs: [["Phosphorescent Green", "PH.GREEN"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["trglowinthedark"]],
      },
      LDraw: {
        ext_ids: [294],
        ext_descrs: [["Glow_In_Dark_Trans"]],
      },
    },
  },
  {
    id: 297,
    name: "Pearl Gold",
    rgb: "AA7F2E",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [115],
        ext_descrs: [["Pearl Gold"]],
      },
      BrickOwl: {
        ext_ids: [120],
        ext_descrs: [["Pearl Gold"]],
      },
      LEGO: {
        ext_ids: [297],
        ext_descrs: [["Warm Gold", "W.GOLD"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["pearlgold"]],
      },
      LDraw: {
        ext_ids: [297],
        ext_descrs: [["Pearl_Gold"]],
      },
    },
  },
  {
    id: 308,
    name: "Dark Brown",
    rgb: "352100",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [120],
        ext_descrs: [["Dark Brown"]],
      },
      BrickOwl: {
        ext_ids: [51],
        ext_descrs: [["Dark Brown"]],
      },
      LEGO: {
        ext_ids: [308],
        ext_descrs: [["Dark Brown", "DK. BROWN"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["dkbrown"]],
      },
      LDraw: {
        ext_ids: [308],
        ext_descrs: [["Dark_Brown"]],
      },
    },
  },
  {
    id: 313,
    name: "Maersk Blue",
    rgb: "3592C3",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [72],
        ext_descrs: [["Maersk Blue"]],
      },
      BrickOwl: {
        ext_ids: [71],
        ext_descrs: [["Maersk Blue"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["maerskblue"]],
      },
      LDraw: {
        ext_ids: [313],
        ext_descrs: [["Maersk_Blue"]],
      },
    },
  },
  {
    id: 320,
    name: "Dark Red",
    rgb: "720E0F",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [59],
        ext_descrs: [["Dark Red"]],
      },
      BrickOwl: {
        ext_ids: [56],
        ext_descrs: [["Dark Red"]],
      },
      LEGO: {
        ext_ids: [154],
        ext_descrs: [["Dark red", "NEW DARK RED", "10. MULTI"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["dkred"]],
      },
      LDraw: {
        ext_ids: [320],
        ext_descrs: [["Dark_Red"]],
      },
    },
  },
  {
    id: 321,
    name: "Dark Azure",
    rgb: "078BC9",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [153],
        ext_descrs: [["Dark Azure"]],
      },
      BrickOwl: {
        ext_ids: [47],
        ext_descrs: [["Dark Azure"]],
      },
      LEGO: {
        ext_ids: [321],
        ext_descrs: [["Dark Azur"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["dkazure"]],
      },
      LDraw: {
        ext_ids: [321],
        ext_descrs: [["Dark_Azure"]],
      },
    },
  },
  {
    id: 322,
    name: "Medium Azure",
    rgb: "36AEBF",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [156],
        ext_descrs: [["Medium Azure"]],
      },
      BrickOwl: {
        ext_ids: [73],
        ext_descrs: [["Medium Azure"]],
      },
      LEGO: {
        ext_ids: [322],
        ext_descrs: [["Medium Azure", "MEDIUM AZUR"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["mdazure"]],
      },
      LDraw: {
        ext_ids: [322],
        ext_descrs: [["Medium_Azure"]],
      },
    },
  },
  {
    id: 323,
    name: "Light Aqua",
    rgb: "ADC3C0",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [152],
        ext_descrs: [["Light Aqua"]],
      },
      BrickOwl: {
        ext_ids: [62],
        ext_descrs: [["Light Aqua"]],
      },
      LEGO: {
        ext_ids: [323],
        ext_descrs: [["Aqua"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["ltaqua"]],
      },
      LDraw: {
        ext_ids: [323],
        ext_descrs: [["Light_Aqua"]],
      },
    },
  },
  {
    id: 326,
    name: "Olive Green",
    rgb: "9B9A5A",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [155],
        ext_descrs: [["Olive Green"]],
      },
      BrickOwl: {
        ext_ids: [79],
        ext_descrs: [["Olive Green"]],
      },
      LEGO: {
        ext_ids: [330],
        ext_descrs: [["Olive Green", "OLIVE GREEN"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["olivegreen"]],
      },
      LDraw: {
        ext_ids: [330],
        ext_descrs: [["Olive_Green"]],
      },
    },
  },
  {
    id: 334,
    name: "Chrome Gold",
    rgb: "BBA53D",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [21],
        ext_descrs: [["Chrome Gold"]],
      },
      BrickOwl: {
        ext_ids: [2],
        ext_descrs: [["Chrome Gold"]],
      },
      LEGO: {
        ext_ids: [310],
        ext_descrs: [["Metalized Gold"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["chromegold"]],
      },
      LDraw: {
        ext_ids: [334],
        ext_descrs: [["Chrome_Gold"]],
      },
    },
  },
  {
    id: 335,
    name: "Sand Red",
    rgb: "D67572",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [58],
        ext_descrs: [["Sand Red"]],
      },
      BrickOwl: {
        ext_ids: [87],
        ext_descrs: [["Sand Red"]],
      },
      LEGO: {
        ext_ids: [153],
        ext_descrs: [["Sand red"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["sandred"]],
      },
      LDraw: {
        ext_ids: [335],
        ext_descrs: [["Sand_Red"]],
      },
    },
  },
  {
    id: 351,
    name: "Medium Dark Pink",
    rgb: "F785B1",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [94],
        ext_descrs: [["Medium Dark Pink"]],
      },
      BrickOwl: {
        ext_ids: [75],
        ext_descrs: [["Medium Dark Pink"]],
      },
      LEGO: {
        ext_ids: [22],
        ext_descrs: [["Medium Reddish Violet", "MD.REDVIOL"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["duplorose"]],
      },
      LDraw: {
        ext_ids: [351],
        ext_descrs: [["Medium_Dark_Pink"]],
      },
    },
  },
  {
    id: 366,
    name: "Earth Orange",
    rgb: "FA9C1C",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [29],
        ext_descrs: [["Earth Orange"]],
      },
      BrickOwl: {
        ext_ids: [59],
        ext_descrs: [["Earth Orange"]],
      },
      LEGO: {
        ext_ids: [128, 1008],
        ext_descrs: [["Dark Nougat", "DARK NOUGAT"], ["L.ORABROWN"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["earthorange"]],
      },
      LDraw: {
        ext_ids: [366, 128],
        ext_descrs: [["Earth_Orange"], ["Dark_Nougat"]],
      },
    },
  },
  {
    id: 373,
    name: "Sand Purple",
    rgb: "845E84",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [54],
        ext_descrs: [["Sand Purple"]],
      },
      BrickOwl: {
        ext_ids: [86],
        ext_descrs: [["Sand Purple"]],
      },
      LEGO: {
        ext_ids: [136],
        ext_descrs: [["Sand violet"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["sandpurple"]],
      },
      LDraw: {
        ext_ids: [373],
        ext_descrs: [["Sand_Purple"]],
      },
    },
  },
  {
    id: 378,
    name: "Sand Green",
    rgb: "A0BCAC",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [48],
        ext_descrs: [["Sand Green"]],
      },
      BrickOwl: {
        ext_ids: [18],
        ext_descrs: [["Sand Green"]],
      },
      LEGO: {
        ext_ids: [151],
        ext_descrs: [["Sand green"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["sandgreen"]],
      },
      LDraw: {
        ext_ids: [378],
        ext_descrs: [["Sand_Green"]],
      },
    },
  },
  {
    id: 379,
    name: "Sand Blue",
    rgb: "6074A1",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [55],
        ext_descrs: [["Sand Blue"]],
      },
      BrickOwl: {
        ext_ids: [85],
        ext_descrs: [["Sand Blue"]],
      },
      LEGO: {
        ext_ids: [135],
        ext_descrs: [["Sand blue"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["sandblue"]],
      },
      LDraw: {
        ext_ids: [379],
        ext_descrs: [["Sand_Blue"]],
      },
    },
  },
  {
    id: 383,
    name: "Chrome Silver",
    rgb: "E0E0E0",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [22],
        ext_descrs: [["Chrome Silver"]],
      },
      BrickOwl: {
        ext_ids: [115],
        ext_descrs: [["Chrome Silver"]],
      },
      LEGO: {
        ext_ids: [309],
        ext_descrs: [["Metalized Silver"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["chromesilver"]],
      },
      LDraw: {
        ext_ids: [383],
        ext_descrs: [["Chrome_Silver"]],
      },
    },
  },
  {
    id: 450,
    name: "Fabuland Brown",
    rgb: "B67B50",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [106],
        ext_descrs: [["Fabuland Brown"]],
      },
      BrickOwl: {
        ext_ids: [23],
        ext_descrs: [["Fabuland Brown"]],
      },
      LEGO: {
        ext_ids: [12],
        ext_descrs: [["Light Orange Brown"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["fabubrown"]],
      },
      LDraw: {
        ext_ids: [450],
        ext_descrs: [["Fabuland_Brown"]],
      },
    },
  },
  {
    id: 462,
    name: "Medium Orange",
    rgb: "FFA70B",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [31],
        ext_descrs: [["Medium Orange"]],
      },
      BrickOwl: {
        ext_ids: [7],
        ext_descrs: [["Medium Orange"]],
      },
      LEGO: {
        ext_ids: [105],
        ext_descrs: [["Br. yellowish orange", "BR.YELORA"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["mdorange"]],
      },
      LDraw: {
        ext_ids: [462],
        ext_descrs: [["Medium_Orange"]],
      },
    },
  },
  {
    id: 484,
    name: "Dark Orange",
    rgb: "A95500",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [68],
        ext_descrs: [["Dark Orange"]],
      },
      BrickOwl: {
        ext_ids: [54],
        ext_descrs: [["Dark Orange"]],
      },
      LEGO: {
        ext_ids: [38],
        ext_descrs: [["Dark Orange", "DK.ORA"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["dkorange"]],
      },
      LDraw: {
        ext_ids: [484],
        ext_descrs: [["Dark_Orange"]],
      },
    },
  },
  {
    id: 503,
    name: "Very Light Gray",
    rgb: "E6E3DA",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [49],
        ext_descrs: [["Very Light Gray"]],
      },
      BrickOwl: {
        ext_ids: [19],
        ext_descrs: [["Very Light Gray"]],
      },
      LEGO: {
        ext_ids: [103],
        ext_descrs: [["Light grey"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["scalagray"]],
      },
      LDraw: {
        ext_ids: [503],
        ext_descrs: [["Very_Light_Gray"]],
      },
    },
  },
  {
    id: 1000,
    name: "Glow in Dark White",
    rgb: "D9D9D9",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [159],
        ext_descrs: [["Glow in Dark White"]],
      },
      BrickOwl: {
        ext_ids: [129],
        ext_descrs: [["Glow in the Dark White"]],
      },
      LEGO: {
        ext_ids: [329],
        ext_descrs: [["WHITE GLOW"]],
      },
      LDraw: {
        ext_ids: [329],
        ext_descrs: [["Glow_In_Dark_White"]],
      },
    },
  },
  {
    id: 1001,
    name: "Medium Violet",
    rgb: "9391E4",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [73],
        ext_descrs: [["Medium Violet"]],
      },
      BrickOwl: {
        ext_ids: [78],
        ext_descrs: [["Medium Violet"]],
      },
      LEGO: {
        ext_ids: [219, 112],
        ext_descrs: [["Lilac"], ["Medium Bluish Violet"]],
      },
      Peeron: {
        ext_ids: [null],
        ext_descrs: [["mdviolet"]],
      },
      LDraw: {
        ext_ids: [219, 112],
        ext_descrs: [["Lilac"], ["Medium_Violet"]],
      },
    },
  },
  {
    id: 1002,
    name: "Glitter Trans-Neon Green",
    rgb: "C0F500",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [163],
        ext_descrs: [["Glitter Trans-Neon Green"]],
      },
      BrickOwl: {
        ext_ids: [167],
        ext_descrs: [["Transparent Neon Green Glitter"]],
      },
      LEGO: {
        ext_ids: [339],
        ext_descrs: [["TR.FL.GRE W/GLI"]],
      },
      LDraw: {
        ext_ids: [339],
        ext_descrs: [["Glitter_Trans_Neon_Green"]],
      },
    },
  },
  {
    id: 1003,
    name: "Glitter Trans-Light Blue",
    rgb: "68BCC5",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [162],
        ext_descrs: [["Glitter Trans-Light Blue"]],
      },
      BrickOwl: {
        ext_ids: [165],
        ext_descrs: [["Transparent Light Blue Glitter"]],
      },
      LDraw: {
        ext_ids: [302],
        ext_descrs: [["Glitter_Trans_Light_Blue"]],
      },
      LEGO: {
        ext_ids: [302],
        ext_descrs: [["PCTR LI.BLUE W/", "4.MULT", "TR LI.BLUE W/"]],
      },
    },
  },
  {
    id: 1004,
    name: "Trans-Flame Yellowish Orange",
    rgb: "FCB76D",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [164],
        ext_descrs: [["Trans Light Orange"]],
      },
      LEGO: {
        ext_ids: [231],
        ext_descrs: [["TR. FL. YEL ORA"]],
      },
      LDraw: {
        ext_ids: [231],
        ext_descrs: [["Trans_Bright_Light_Orange"]],
      },
    },
  },
  {
    id: 1005,
    name: "Trans-Fire Yellow",
    rgb: "FBE890",
    is_trans: true,
    external_ids: {
      LDraw: {
        ext_ids: [234],
        ext_descrs: [["Trans_Fire_Yellow"]],
      },
      LEGO: {
        ext_ids: [234],
        ext_descrs: [["TR. FIRE YELL"]],
      },
    },
  },
  {
    id: 1006,
    name: "Trans-Light Royal Blue",
    rgb: "B4D4F7",
    is_trans: true,
    external_ids: {
      LEGO: {
        ext_ids: [293],
        ext_descrs: [["TR. L.ROYAL BLUE", "TR.L.ROYAL BLUE"]],
      },
      LDraw: {
        ext_ids: [293],
        ext_descrs: [["Trans_Light_Blue_Violet"]],
      },
    },
  },
  {
    id: 1007,
    name: "Reddish Lilac",
    rgb: "8E5597",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [227],
        ext_descrs: [["Clikits Lavender"]],
      },
      LEGO: {
        ext_ids: [218],
        ext_descrs: [["RED. LILAC"]],
      },
      LDraw: {
        ext_ids: [218],
        ext_descrs: [["Medium Purple"]],
      },
    },
  },
  {
    id: 1008,
    name: "Vintage Blue",
    rgb: "039CBD",
    is_trans: false,
    external_ids: {},
  },
  {
    id: 1009,
    name: "Vintage Green",
    rgb: "1E601E",
    is_trans: false,
    external_ids: {},
  },
  {
    id: 1010,
    name: "Vintage Red",
    rgb: "CA1F08",
    is_trans: false,
    external_ids: {},
  },
  {
    id: 1011,
    name: "Vintage Yellow",
    rgb: "F3C305",
    is_trans: false,
    external_ids: {},
  },
  {
    id: 1012,
    name: "Fabuland Orange",
    rgb: "EF9121",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [160],
        ext_descrs: [["Fabuland Orange"]],
      },
    },
  },
  {
    id: 1013,
    name: "Modulex White",
    rgb: "F4F4F4",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [123],
        ext_descrs: [["Mx White"]],
      },
    },
  },
  {
    id: 1014,
    name: "Modulex Light Bluish Gray",
    rgb: "AfB5C7",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [124],
        ext_descrs: [["Mx Light Bluish Gray"]],
      },
    },
  },
  {
    id: 1015,
    name: "Modulex Light Gray",
    rgb: "9C9C9C",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [125],
        ext_descrs: [["Mx Light Gray"]],
      },
    },
  },
  {
    id: 1016,
    name: "Modulex Charcoal Gray",
    rgb: "595D60",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [126],
        ext_descrs: [["Mx Charcoal Gray"]],
      },
    },
  },
  {
    id: 1017,
    name: "Modulex Tile Gray",
    rgb: "6B5A5A",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [127],
        ext_descrs: [["Mx Tile Gray"]],
      },
    },
  },
  {
    id: 1018,
    name: "Modulex Black",
    rgb: "4D4C52",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [128],
        ext_descrs: [["Mx Black"]],
      },
    },
  },
  {
    id: 1019,
    name: "Modulex Tile Brown",
    rgb: "330000",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [131],
        ext_descrs: [["Mx Tile Brown"]],
      },
    },
  },
  {
    id: 1020,
    name: "Modulex Terracotta",
    rgb: "5C5030",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [134],
        ext_descrs: [["Mx Terracotta"]],
      },
    },
  },
  {
    id: 1021,
    name: "Modulex Brown",
    rgb: "907450",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [132],
        ext_descrs: [["Mx Brown"]],
      },
    },
  },
  {
    id: 1022,
    name: "Modulex Buff",
    rgb: "DEC69C",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [133],
        ext_descrs: [["Mx Buff"]],
      },
    },
  },
  {
    id: 1023,
    name: "Modulex Red",
    rgb: "B52C20",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [129],
        ext_descrs: [["Mx Red"]],
      },
    },
  },
  {
    id: 1024,
    name: "Modulex Pink Red",
    rgb: "F45C40",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [130],
        ext_descrs: [["Mx Pink Red"]],
      },
    },
  },
  {
    id: 1025,
    name: "Modulex Orange",
    rgb: "F47B30",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [135],
        ext_descrs: [["Mx Orange"]],
      },
    },
  },
  {
    id: 1026,
    name: "Modulex Light Orange",
    rgb: "F7AD63",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [136],
        ext_descrs: [["Mx Light Orange"]],
      },
    },
  },
  {
    id: 1027,
    name: "Modulex Light Yellow",
    rgb: "FFE371",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [137],
        ext_descrs: [["Mx Light Yellow"]],
      },
    },
  },
  {
    id: 1028,
    name: "Modulex Ochre Yellow",
    rgb: "FED557",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [138],
        ext_descrs: [["Mx Ochre Yellow"]],
      },
    },
  },
  {
    id: 1029,
    name: "Modulex Lemon",
    rgb: "BDC618",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [139],
        ext_descrs: [["Mx Lemon"]],
      },
    },
  },
  {
    id: 1030,
    name: "Modulex Pastel Green",
    rgb: "7DB538",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [141],
        ext_descrs: [["Mx Pastel Green"]],
      },
    },
  },
  {
    id: 1031,
    name: "Modulex Olive Green",
    rgb: "7C9051",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [140],
        ext_descrs: [["Mx Olive Green"]],
      },
    },
  },
  {
    id: 1032,
    name: "Modulex Aqua Green",
    rgb: "27867E",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [142],
        ext_descrs: [["Mx Aqua Green"]],
      },
    },
  },
  {
    id: 1033,
    name: "Modulex Teal Blue",
    rgb: "467083",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [146],
        ext_descrs: [["Mx Teal Blue"]],
      },
    },
  },
  {
    id: 1034,
    name: "Modulex Tile Blue",
    rgb: "0057A6",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [143],
        ext_descrs: [["Mx Tile Blue"]],
      },
    },
  },
  {
    id: 1035,
    name: "Modulex Medium Blue",
    rgb: "61AFFF",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [144],
        ext_descrs: [["Mx Medium Blue"]],
      },
    },
  },
  {
    id: 1036,
    name: "Modulex Pastel Blue",
    rgb: "68AECE",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [145],
        ext_descrs: [["Mx Pastel Blue"]],
      },
    },
  },
  {
    id: 1037,
    name: "Modulex Violet",
    rgb: "BD7D85",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [147],
        ext_descrs: [["Mx Violet"]],
      },
    },
  },
  {
    id: 1038,
    name: "Modulex Pink",
    rgb: "F785B1",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [148],
        ext_descrs: [["Mx Pink"]],
      },
    },
  },
  {
    id: 1039,
    name: "Modulex Clear",
    rgb: "FFFFFF",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [149],
        ext_descrs: [["Mx Clear"]],
      },
    },
  },
  {
    id: 1040,
    name: "Modulex Foil Dark Gray",
    rgb: "595D60",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [210],
        ext_descrs: [["Mx Foil Dark Gray"]],
      },
    },
  },
  {
    id: 1041,
    name: "Modulex Foil Light Gray",
    rgb: "9C9C9C",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [211],
        ext_descrs: [["Mx Foil Light Gray"]],
      },
    },
  },
  {
    id: 1042,
    name: "Modulex Foil Dark Green",
    rgb: "006400",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [212],
        ext_descrs: [["Mx Foil Dark Green"]],
      },
    },
  },
  {
    id: 1043,
    name: "Modulex Foil Light Green",
    rgb: "7DB538",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [213],
        ext_descrs: [["Mx Foil Light Green"]],
      },
    },
  },
  {
    id: 1044,
    name: "Modulex Foil Dark Blue",
    rgb: "0057A6",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [214],
        ext_descrs: [["Mx Foil Dark Blue"]],
      },
    },
  },
  {
    id: 1045,
    name: "Modulex Foil Light Blue",
    rgb: "68AECE",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [215],
        ext_descrs: [["Mx Foil Light Blue"]],
      },
    },
  },
  {
    id: 1046,
    name: "Modulex Foil Violet",
    rgb: "4B0082",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [216],
        ext_descrs: [["Mx Foil Violet"]],
      },
    },
  },
  {
    id: 1047,
    name: "Modulex Foil Red",
    rgb: "8B0000",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [217],
        ext_descrs: [["Mx Foil Red"]],
      },
    },
  },
  {
    id: 1048,
    name: "Modulex Foil Yellow",
    rgb: "FED557",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [218],
        ext_descrs: [["Mx Foil Yellow"]],
      },
    },
  },
  {
    id: 1049,
    name: "Modulex Foil Orange",
    rgb: "F7AD63",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [219],
        ext_descrs: [["Mx Foil Orange"]],
      },
    },
  },
  {
    id: 1050,
    name: "Coral",
    rgb: "FF698F",
    is_trans: false,
    external_ids: {
      LDraw: {
        ext_ids: [353],
        ext_descrs: [["Coral"]],
      },
      BrickLink: {
        ext_ids: [220],
        ext_descrs: [["Coral"]],
      },
      LEGO: {
        ext_ids: [1017],
        ext_descrs: [["CORAL"]],
      },
    },
  },
  {
    id: 1051,
    name: "Pastel Blue",
    rgb: "5AC4DA",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [72],
        ext_descrs: [["Maersk Blue"]],
      },
      LEGO: {
        ext_ids: [11],
        ext_descrs: [["Pastel Blue", "PASTBLU"]],
      },
    },
  },
  {
    id: 1052,
    name: "Glitter Trans-Orange",
    rgb: "F08F1C",
    is_trans: true,
    external_ids: {
      BrickLink: {
        ext_ids: [222],
        ext_descrs: [["Glitter Trans-Orange"]],
      },
      LDraw: {
        ext_ids: [341],
        ext_descrs: [["Glitter_Trans_Orange"]],
      },
      LEGO: {
        ext_ids: [1018],
        ext_descrs: [["TR.BR:ORA W/GLI"]],
      },
    },
  },
  {
    id: 1053,
    name: "Trans-Blue Opal",
    rgb: "68BCC5",
    is_trans: true,
    external_ids: {
      BrickOwl: {
        ext_ids: [175],
        ext_descrs: [["Transparent Blue Opal"]],
      },
      LDraw: {
        ext_ids: [362],
        ext_descrs: [["Opal_Trans_Light_Blue"]],
      },
      BrickLink: {
        ext_ids: [223],
        ext_descrs: [["Satin Trans-Light Blue"]],
      },
      LEGO: {
        ext_ids: [362],
        ext_descrs: [["Transparent Blue Opal", "TR. BLUE OPAL"]],
      },
    },
  },
  {
    id: 1054,
    name: "Trans-Medium Reddish Violet Opal",
    rgb: "CE1D9B",
    is_trans: true,
    external_ids: {
      BrickOwl: {
        ext_ids: [199],
        ext_descrs: [["Transparent Dark Pink Opal"]],
      },
      LEGO: {
        ext_ids: [362],
        ext_descrs: [
          [
            "Transparent Medium Reddish Violet with Opalescence",
            "Tr.M.Violet Opa",
          ],
        ],
      },
      LDraw: {
        ext_ids: [364],
        ext_descrs: [["Opal_Trans_Dark_Pink"]],
      },
      BrickLink: {
        ext_ids: [224],
        ext_descrs: [["Satin Trans-Dark Pink"]],
      },
    },
  },
  {
    id: 1055,
    name: "Trans-Clear Opal",
    rgb: "FCFCFC",
    is_trans: true,
    external_ids: {
      BrickOwl: {
        ext_ids: [193],
        ext_descrs: [["Transparent Opal"]],
      },
      LDraw: {
        ext_ids: [360],
        ext_descrs: [["Opal_Trans_Clear"]],
      },
      LEGO: {
        ext_ids: [360],
        ext_descrs: [["Transparent with Opalescence", "Tr. Opalescence"]],
      },
      BrickLink: {
        ext_ids: [228],
        ext_descrs: [["Satin White"]],
      },
    },
  },
  {
    id: 1056,
    name: "Trans-Brown Opal",
    rgb: "583927",
    is_trans: true,
    external_ids: {
      BrickOwl: {
        ext_ids: [201],
        ext_descrs: [["Transparent Black Opal"]],
      },
      BrickLink: {
        ext_ids: [229],
        ext_descrs: [["Satin Trans-Black"]],
      },
      LEGO: {
        ext_ids: [360],
        ext_descrs: [["Transparent Brown with Opalescence", "Tr. Brown Opal"]],
      },
    },
  },
  {
    id: 1057,
    name: "Trans-Light Bright Green",
    rgb: "C9E788",
    is_trans: true,
    external_ids: {
      LEGO: {
        ext_ids: [227],
        ext_descrs: [["Transparent Bright Yellowish Green", "TR. BR. YEL GR"]],
      },
      BrickLink: {
        ext_ids: [226],
        ext_descrs: [["Trans-Light Bright Green"]],
      },
    },
  },
  {
    id: 1058,
    name: "Trans-Light Green",
    rgb: "94E5AB",
    is_trans: true,
    external_ids: {
      LDraw: {
        ext_ids: [285],
        ext_descrs: [["TranS_Light_Green"]],
      },
      LEGO: {
        ext_ids: [285],
        ext_descrs: [["Transparent Light Green"]],
      },
      BrickLink: {
        ext_ids: [221],
        ext_descrs: [["Trans-Light Green"]],
      },
    },
  },
  {
    id: 1059,
    name: "Trans-Purple Opal",
    rgb: "8320B7",
    is_trans: true,
    external_ids: {
      BrickOwl: {
        ext_ids: [203],
        ext_descrs: [["Transparent Purple Opal"]],
      },
      LEGO: {
        ext_ids: [1020],
        ext_descrs: [["Tr.Violet Opal"]],
      },
      BrickLink: {
        ext_ids: [230],
        ext_descrs: [["Satin Trans-Purple"]],
      },
    },
  },
  {
    id: 1060,
    name: "Trans-Green Opal",
    rgb: "84B68D",
    is_trans: true,
    external_ids: {
      BrickOwl: {
        ext_ids: [207],
        ext_descrs: [["Transparent Green Opal"]],
      },
      BrickLink: {
        ext_ids: [233],
        ext_descrs: [["Satin Trans-Bright Green"]],
      },
      LEGO: {
        ext_ids: [1021],
        ext_descrs: [["Tr.Green Opal"]],
      },
    },
  },
  {
    id: 1061,
    name: "Trans-Dark Blue Opal",
    rgb: "0020A0",
    is_trans: true,
    external_ids: {
      BrickOwl: {
        ext_ids: [209],
        ext_descrs: [["Transparent Dark Blue Opal"]],
      },
      BrickLink: {
        ext_ids: [232],
        ext_descrs: [["Satin Trans-Dark Blue"]],
      },
      LEGO: {
        ext_ids: [1019],
        ext_descrs: [["Tr.Blue Opal"]],
      },
    },
  },
  {
    id: 1062,
    name: "Vibrant Yellow",
    rgb: "EBD800",
    is_trans: false,
    external_ids: {
      BrickOwl: {
        ext_ids: [211],
        ext_descrs: [["Vibrant Yellow"]],
      },
      BrickLink: {
        ext_ids: [236],
        ext_descrs: [["Neon Yellow"]],
      },
      LEGO: {
        ext_ids: [368],
        ext_descrs: [["Vibrant Yellow"]],
      },
    },
  },
  {
    id: 1063,
    name: "Metallic Copper",
    rgb: "B46A00",
    is_trans: false,
    external_ids: {
      LEGO: {
        ext_ids: [346],
        ext_descrs: [["Copper Metallic"]],
      },
    },
  },
  {
    id: 1064,
    name: "Fabuland Red",
    rgb: "FF8014",
    is_trans: false,
    external_ids: {
      LEGO: {
        ext_ids: [13],
        ext_descrs: [["Red Orange"]],
      },
    },
  },
  {
    id: 1065,
    name: "Reddish Gold",
    rgb: "AC8247",
    is_trans: false,
    external_ids: {
      LDraw: {
        ext_ids: [189],
        ext_descrs: [["Reddish_Gold"]],
      },
      BrickLink: {
        ext_ids: [235],
        ext_descrs: [["Reddish Gold"]],
      },
      LEGO: {
        ext_ids: [189],
        ext_descrs: [["Reddish Gold", "Gold Metallic"]],
      },
    },
  },
  {
    id: 1066,
    name: "Curry",
    rgb: "DD982E",
    is_trans: false,
    external_ids: {
      BrickOwl: {
        ext_ids: [169],
        ext_descrs: [["Curry"]],
      },
      LEGO: {
        ext_ids: [180],
        ext_descrs: [["Curry"]],
      },
      BrickLink: {
        ext_ids: [161],
        ext_descrs: [["Dark Yellow"]],
      },
    },
  },
  {
    id: 9999,
    name: "[No Color/Any Color]",
    rgb: "05131D",
    is_trans: false,
    external_ids: {
      BrickLink: {
        ext_ids: [0],
        ext_descrs: [["(Not Applicable)"]],
      },
    },
  },
];
