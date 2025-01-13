export class Shift {
    duration: number;
    category: string;

    static readonly INTENSIIV = "intensiiv";
    static readonly LÜHIKE_PÄEV = "lühike päev";
    static readonly OSAKOND = "osakond";
    static readonly TÜHI = "";
    static readonly PUHKUS = "P";
    static readonly SOOVI_PUHKUS = "D";
    static readonly KEELATUD = "X";
    static readonly KOOLITUS = "K";

    constructor(duration: number, category: string) {
        this.duration = duration;
        this.setCategory(category);
    }

    setCategory(category: string): void {
        this.category = category;
    }
}
