
import { TranslationKey } from "./translations";

export interface MapDef {
    id: string;
    nameKey: TranslationKey;
    slug: string;
    image: string;
}

export const MAPS: MapDef[] = [
    {
        id: "dam-battlegrounds",
        nameKey: "mapDamBattlegrounds",
        slug: "dam-battlegrounds",
        image: "https://d1jgxp05n383qi.cloudfront.net/map_images/2560x1440/2560x1440-dam-battlegrounds.jpg"
    },
    {
        id: "stella-montis",
        nameKey: "mapStellaMontis",
        slug: "stella-montis",
        image: "https://d1jgxp05n383qi.cloudfront.net/map_images/2560x1440/2560x1440-stella-montis.jpg"
    },
    {
        id: "buried-city",
        nameKey: "mapBuriedCity",
        slug: "buried-city",
        image: "https://d1jgxp05n383qi.cloudfront.net/map_images/2560x1440/2560x1440-buried-city.jpg"
    },
    {
        id: "spaceport",
        nameKey: "mapSpaceport",
        slug: "spaceport",
        image: "https://d1jgxp05n383qi.cloudfront.net/map_images/2560x1440/2560x1440-spaceport.jpg"
    },
    {
        id: "the-blue-gate",
        nameKey: "mapTheBlueGate",
        slug: "the-blue-gate",
        image: "https://d1jgxp05n383qi.cloudfront.net/map_images/2560x1440/2560x1440-the-blue-gate.jpg"
    },
];

export function getMapBySlug(slug: string): MapDef | undefined {
    return MAPS.find((m) => m.slug === slug);
}