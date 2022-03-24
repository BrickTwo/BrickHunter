export function fileImportCSVOptions() {
  return [
    {
      fieldLabel: "Ignore",
      fieldValue: "ignore",
    },
    {
      fieldLabel: "DesignId",
      fieldValue: "designId",
    },
    {
      fieldLabel: "Element",
      fieldValue: "itemNumber",
    },
    {
      fieldLabel: "Color",
      fieldValue: "color",
      fieldChildren: [
        {
          fieldLabel: "BrickLink Name",
          fieldValue: "brickLinkColor",
        },
        {
          fieldLabel: "LEGO Name",
          fieldValue: "legoColor",
        },
      ],
    },
    {
      fieldLabel: "BrickLink Price",
      fieldValue: "brickLinkPrice",
    },
    {
      fieldLabel: "Pick a Brick Price",
      fieldValue: "pickABrickPrice",
    },
    {
      fieldLabel: "Bricks & Pieces Price",
      fieldValue: "bricksAndPiecesPrice",
    },
  ];
}
