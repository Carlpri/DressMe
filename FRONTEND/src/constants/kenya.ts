/**
 * Complete list of Kenya's 47 counties and their major towns/cities.
 * Source: Kenya National Bureau of Statistics (KNBS)
 */

export interface KenyaCounty {
  name: string;
  code: number;
  /** Principal towns/cities within the county */
  towns: string[];
}

export const KENYA_COUNTIES: KenyaCounty[] = [
  { code: 1,  name: "Mombasa",          towns: ["Mombasa", "Changamwe", "Likoni", "Kisauni", "Nyali", "Mvita"] },
  { code: 2,  name: "Kwale",            towns: ["Kwale", "Msambweni", "Kinango", "Ukunda", "Diani"] },
  { code: 3,  name: "Kilifi",           towns: ["Kilifi", "Malindi", "Watamu", "Mariakani", "Kaloleni", "Ganze"] },
  { code: 4,  name: "Tana River",       towns: ["Hola", "Garsen", "Bura"] },
  { code: 5,  name: "Lamu",             towns: ["Lamu", "Mokowe", "Faza"] },
  { code: 6,  name: "Taita-Taveta",     towns: ["Voi", "Wundanyi", "Taveta", "Mwatate"] },
  { code: 7,  name: "Garissa",          towns: ["Garissa", "Dadaab", "Balambala", "Ijara"] },
  { code: 8,  name: "Wajir",            towns: ["Wajir", "Habaswein", "Tarbaj", "Eldas"] },
  { code: 9,  name: "Mandera",          towns: ["Mandera", "Takaba", "Rhamu", "Banissa"] },
  { code: 10, name: "Marsabit",         towns: ["Marsabit", "Moyale", "Laisamis", "Saku"] },
  { code: 11, name: "Isiolo",           towns: ["Isiolo", "Garbatulla", "Merti"] },
  { code: 12, name: "Meru",             towns: ["Meru", "Nkubu", "Maua", "Timau", "Chuka", "Githongo"] },
  { code: 13, name: "Tharaka-Nithi",    towns: ["Chuka", "Marimanti", "Kathwana"] },
  { code: 14, name: "Embu",             towns: ["Embu", "Runyenjes", "Siakago", "Ishiara"] },
  { code: 15, name: "Kitui",            towns: ["Kitui", "Mutomo", "Mwingi", "Migwani", "Zombe"] },
  { code: 16, name: "Machakos",         towns: ["Machakos", "Athi River", "Kangundo", "Tala", "Mavoko"] },
  { code: 17, name: "Makueni",          towns: ["Wote", "Makueni", "Emali", "Sultan Hamud", "Makindu"] },
  { code: 18, name: "Nyandarua",        towns: ["Ol Kalou", "Engineer", "Njabini", "Nyahururu"] },
  { code: 19, name: "Nyeri",            towns: ["Nyeri", "Othaya", "Karatina", "Mukurwe-ini", "Tetu"] },
  { code: 20, name: "Kirinyaga",        towns: ["Kerugoya", "Kutus", "Kianyaga", "Sagana", "Kagio"] },
  { code: 21, name: "Murang'a",         towns: ["Murang'a", "Thika", "Kangema", "Maragua", "Kigumo"] },
  { code: 22, name: "Kiambu",           towns: ["Kiambu", "Thika", "Ruiru", "Juja", "Githunguri", "Limuru", "Kikuyu", "Ruaka", "Tigoni", "Karuri"] },
  { code: 23, name: "Turkana",          towns: ["Lodwar", "Kakuma", "Lokichogio", "Kalokol"] },
  { code: 24, name: "West Pokot",       towns: ["Kapenguria", "Kitale", "Sigor", "Alale"] },
  { code: 25, name: "Samburu",          towns: ["Maralal", "Baragoi", "Wamba"] },
  { code: 26, name: "Trans-Nzoia",      towns: ["Kitale", "Endebess", "Kiminini", "Saboti"] },
  { code: 27, name: "Uasin Gishu",      towns: ["Eldoret", "Burnt Forest", "Turbo", "Moiben", "Ainabkoi"] },
  { code: 28, name: "Elgeyo-Marakwet",  towns: ["Iten", "Kabarnet", "Chepterwai", "Lelan"] },
  { code: 29, name: "Nandi",            towns: ["Kapsabet", "Nandi Hills", "Mosoriot", "Kobujoi"] },
  { code: 30, name: "Baringo",          towns: ["Kabarnet", "Eldama Ravine", "Mogotio", "Marigat", "Timboroa"] },
  { code: 31, name: "Laikipia",         towns: ["Nanyuki", "Nyahururu", "Rumuruti", "Doldol"] },
  { code: 32, name: "Nakuru",           towns: ["Nakuru", "Naivasha", "Gilgil", "Molo", "Njoro", "Rongai", "Subukia", "Bahati"] },
  { code: 33, name: "Narok",            towns: ["Narok", "Kilgoris", "Aitong", "Suswa"] },
  { code: 34, name: "Kajiado",          towns: ["Kajiado", "Ngong", "Kitengela", "Ongata Rongai", "Kiserian", "Namanga"] },
  { code: 35, name: "Kericho",          towns: ["Kericho", "Litein", "Londiani", "Kipkelion"] },
  { code: 36, name: "Bomet",            towns: ["Bomet", "Sotik", "Chulaimbo", "Longisa"] },
  { code: 37, name: "Kakamega",         towns: ["Kakamega", "Mumias", "Malava", "Lugari", "Likuyani"] },
  { code: 38, name: "Vihiga",           towns: ["Vihiga", "Maragoli", "Mbale", "Luanda"] },
  { code: 39, name: "Bungoma",          towns: ["Bungoma", "Webuye", "Kimilili", "Chwele", "Sirisia"] },
  { code: 40, name: "Busia",            towns: ["Busia", "Malaba", "Nambale", "Funyula"] },
  { code: 41, name: "Siaya",            towns: ["Siaya", "Bondo", "Ugunja", "Yala", "Ukwala"] },
  { code: 42, name: "Kisumu",           towns: ["Kisumu", "Ahero", "Muhoroni", "Maseno", "Katito"] },
  { code: 43, name: "Homa Bay",         towns: ["Homa Bay", "Oyugis", "Mbita", "Ndhiwa"] },
  { code: 44, name: "Migori",           towns: ["Migori", "Awendo", "Rongo", "Isebania", "Kehancha"] },
  { code: 45, name: "Kisii",            towns: ["Kisii", "Ogembo", "Suneka", "Keroka", "Nyamache"] },
  { code: 46, name: "Nyamira",          towns: ["Nyamira", "Keroka", "Nyansiongo", "Masaba"] },
  { code: 47, name: "Nairobi",          towns: ["Nairobi CBD", "Westlands", "Kasarani", "Embakasi", "Langata", "Dagoretti", "Karen", "Kilimani", "Parklands", "South C", "South B", "Lavington", "Roysambu", "Ruaraka", "Makadara"] },
];

/** Sorted county names for simple Select dropdowns */
export const KENYA_COUNTY_NAMES = KENYA_COUNTIES.map((c) => c.name).sort();

/** Returns towns for a given county name, empty array if not found */
export function getTownsForCounty(countyName: string): string[] {
  return KENYA_COUNTIES.find((c) => c.name === countyName)?.towns ?? [];
}
