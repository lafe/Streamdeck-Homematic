export interface TitleDefinition {
    fontFamily: "Arial" | "Arial Black" | "Comic Sans MS" | "Courier" | "Courier New" | "Georgia" | "Impact" | "Microsoft Sans Serif" | "Symbol" | "Tahoma" | "Times New Roman" | "Trebuchet MS" | "Verdana" | "Webdings" | "Wingdings";
    fontSize: number;
    fontStyle: "Regular" | "Bold" | "Italic" | "Bold Italic";
    fontUnderline: boolean;
    showTitle: boolean;
    titleAlignment: "bottom" | "middle" | "top";
    titleColor: string;
}