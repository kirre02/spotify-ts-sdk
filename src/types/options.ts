import type { Range } from "@internal/index";

type Market =
	| "AD"
	| "AE"
	| "AG"
	| "AL"
	| "AM"
	| "AO"
	| "AR"
	| "AT"
	| "AU"
	| "AZ"
	| "BA"
	| "BB"
	| "BD"
	| "BE"
	| "BF"
	| "BG"
	| "BH"
	| "BI"
	| "BJ"
	| "BN"
	| "BO"
	| "BR"
	| "BS"
	| "BT"
	| "BW"
	| "BY"
	| "BZ"
	| "CA"
	| "CD"
	| "CG"
	| "CH"
	| "CI"
	| "CL"
	| "CM"
	| "CO"
	| "CR"
	| "CV"
	| "CW"
	| "CY"
	| "CZ"
	| "DE"
	| "DJ"
	| "DK"
	| "DM"
	| "DO"
	| "DZ"
	| "EC"
	| "EE"
	| "EG"
	| "ES"
	| "ET"
	| "FI"
	| "FJ"
	| "FM"
	| "FR"
	| "GA"
	| "GB"
	| "GD"
	| "GE"
	| "GH"
	| "GM"
	| "GN"
	| "GQ"
	| "GR"
	| "GT"
	| "GW"
	| "GY"
	| "HK"
	| "HN"
	| "HR"
	| "HT"
	| "HU"
	| "ID"
	| "IE"
	| "IL"
	| "IN"
	| "IQ"
	| "IS"
	| "IT"
	| "JM"
	| "JO"
	| "JP"
	| "KE"
	| "KG"
	| "KH"
	| "KI"
	| "KM"
	| "KN"
	| "KR"
	| "KW"
	| "KZ"
	| "LA"
	| "LB"
	| "LC"
	| "LI"
	| "LK"
	| "LR"
	| "LS"
	| "LT"
	| "LU"
	| "LV"
	| "LY"
	| "MA"
	| "MC"
	| "MD"
	| "ME"
	| "MG"
	| "MH"
	| "MK"
	| "ML"
	| "MN"
	| "MO"
	| "MR"
	| "MT"
	| "MU"
	| "MV"
	| "MW"
	| "MX"
	| "MY"
	| "MZ"
	| "NA"
	| "NE"
	| "NG"
	| "NI"
	| "NL"
	| "NO"
	| "NP"
	| "NR"
	| "NZ"
	| "OM"
	| "PA"
	| "PE"
	| "PG"
	| "PH"
	| "PK"
	| "PL"
	| "PR"
	| "PS"
	| "PT"
	| "PW"
	| "PY"
	| "QA"
	| "RO"
	| "RS"
	| "RW"
	| "SA"
	| "SB"
	| "SC"
	| "SE"
	| "SG"
	| "SI"
	| "SK"
	| "SL"
	| "SM"
	| "SN"
	| "SR"
	| "ST"
	| "SV"
	| "SZ"
	| "TD"
	| "TG"
	| "TH"
	| "TJ"
	| "TL"
	| "TN"
	| "TO"
	| "TR"
	| "TT"
	| "TV"
	| "TW"
	| "TZ"
	| "UA"
	| "UG"
	| "US"
	| "UY"
	| "UZ"
	| "VC"
	| "VE"
	| "VN"
	| "VU"
	| "WS"
	| "XK"
	| "ZA"
	| "ZM"
	| "ZW";

type Country = {
	AD: {
		langs: { ca: "ca" };
	};
	AE: {
		langs: { ar: "ar" };
	};
	AG: {
		langs: { en: "en" };
	};
	AL: {
		langs: { sq: "sq" };
	};
	AM: {
		langs: { hy: "hy" };
	};
	AO: {
		langs: { pt: "pt" };
	};
	AR: {
		langs: { es: "es"; gn: "gn" };
	};
	AT: {
		langs: { de: "de" };
	};
	AU: {
		langs: { en: "en" };
	};
	AZ: {
		langs: { az: "az" };
	};
	BA: {
		langs: { bs: "bs"; hr: "hr"; sr: "sr" };
	};
	BB: {
		langs: { en: "en" };
	};
	BD: {
		langs: { bn: "bn" };
	};
	BE: {
		langs: { nl: "nl"; fr: "fr"; de: "de" };
	};
	BF: {
		langs: { fr: "fr"; ff: "ff" };
	};
	BG: {
		langs: { bg: "bg" };
	};
	BH: {
		langs: { ar: "ar" };
	};
	BI: {
		langs: { fr: "fr"; rn: "rn" };
	};
	BJ: {
		langs: { fr: "fr" };
	};
	BN: {
		langs: { ms: "ms" };
	};
	BO: {
		langs: { es: "es"; ay: "ay"; qu: "qu" };
	};
	BR: {
		langs: { pt: "pt" };
	};
	BS: {
		langs: { en: "en" };
	};
	BT: {
		langs: { dz: "dz" };
	};
	BW: {
		langs: { en: "en"; tn: "tn" };
	};
	BY: {
		langs: { be: "be"; ru: "ru" };
	};
	BZ: {
		langs: { en: "en"; es: "es" };
	};
	CA: {
		langs: { en: "en"; fr: "fr" };
	};
	CD: {
		langs: { fr: "fr"; ln: "ln"; kg: "kg"; sw: "sw"; lu: "lu" };
	};
	CG: {
		langs: { fr: "fr"; ln: "ln" };
	};
	CH: {
		langs: { de: "de"; fr: "fr"; it: "it"; rm: "rm" };
	};
	CI: {
		langs: { fr: "fr" };
	};
	CL: {
		langs: { es: "es" };
	};
	CM: {
		langs: { en: "en"; fr: "fr" };
	};
	CO: {
		langs: { es: "es" };
	};
	CR: {
		langs: { es: "es" };
	};
	CV: {
		langs: { pt: "pt" };
	};
	CW: {
		langs: { nl: "nl"; pa: "pa"; en: "en" };
	};
	CY: {
		langs: { el: "el"; tr: "tr"; hy: "hy" };
	};
	CZ: {
		langs: { cs: "cs"; sk: "sk" };
	};
	DE: {
		langs: { de: "de" };
	};
	DJ: {
		langs: { fr: "fr"; ar: "ar" };
	};
	DK: {
		langs: { da: "da" };
	};
	DM: {
		langs: { en: "en" };
	};
	DO: {
		langs: { es: "es" };
	};
	DZ: {
		langs: { ar: "ar" };
	};
	EC: {
		langs: { es: "es" };
	};
	EE: {
		langs: { et: "et" };
	};
	EG: {
		langs: { ar: "ar" };
	};
	ES: {
		langs: { es: "es" };
	};
	ET: {
		langs: { am: "am" };
	};
	FI: {
		langs: { fi: "fi"; sv: "sv" };
	};
	FJ: {
		langs: { en: "en"; fj: "fj" };
	};
	FM: {
		langs: { en: "en" };
	};
	FR: {
		langs: { fr: "fr" };
	};
	GA: {
		langs: { fr: "fr" };
	};
	GB: {
		langs: { en: "en" };
	};
	GD: {
		langs: { en: "en" };
	};
	GE: {
		langs: { ka: "ka" };
	};
	GH: {
		langs: { en: "en" };
	};
	GM: {
		langs: { en: "en" };
	};
	GN: {
		langs: { fr: "fr"; ff: "ff" };
	};
	GQ: {
		langs: { es: "es"; fr: "fr"; pt: "pt" };
	};
	GR: {
		langs: { el: "el" };
	};
	GT: {
		langs: { es: "es" };
	};
	GW: {
		langs: { pt: "pt" };
	};
	GY: {
		langs: { en: "en" };
	};
	HK: {
		langs: { en: "en"; zh: "zh" };
	};
	HN: {
		langs: { es: "es" };
	};
	HR: {
		langs: { hr: "hr" };
	};
	HT: {
		langs: { fr: "fr"; ht: "ht" };
	};
	HU: {
		langs: { hu: "hu" };
	};
	ID: {
		langs: { id: "id" };
	};
	IE: {
		langs: { ga: "ga"; en: "en" };
	};
	IL: {
		langs: { he: "he"; ar: "ar" };
	};
	IN: {
		langs: { hi: "hi"; en: "en" };
	};
	IQ: {
		langs: { ar: "ar"; ku: "ku" };
	};
	IS: {
		langs: { is: "is" };
	};
	IT: {
		langs: { it: "it" };
	};
	JM: {
		langs: { en: "en" };
	};
	JO: {
		langs: { ar: "ar" };
	};
	JP: {
		langs: { ja: "ja" };
	};
	KE: {
		langs: { en: "en"; sw: "sw" };
	};
	KG: {
		langs: { ky: "ky"; ru: "ru" };
	};
	KH: {
		langs: { km: "km" };
	};
	KI: {
		langs: { en: "en" };
	};
	KM: {
		langs: { ar: "ar"; fr: "fr" };
	};
	KN: {
		langs: { en: "en" };
	};
	KR: {
		langs: { ko: "ko" };
	};
	KW: {
		langs: { ar: "ar" };
	};
	KZ: {
		langs: { kk: "kk"; ru: "ru" };
	};
	LA: {
		langs: { lo: "lo" };
	};
	LB: {
		langs: { ar: "ar"; fr: "fr" };
	};
	LC: {
		langs: { en: "en" };
	};
	LI: {
		langs: { de: "de" };
	};
	LK: {
		langs: { si: "si"; ta: "ta" };
	};
	LR: {
		langs: { en: "en" };
	};
	LS: {
		langs: { en: "en"; st: "st" };
	};
	LT: {
		langs: { lt: "lt" };
	};
	LU: {
		langs: { fr: "fr"; de: "de"; lb: "lb" };
	};
	LV: {
		langs: { lv: "lv" };
	};
	LY: {
		langs: { ar: "ar" };
	};
	MA: {
		langs: { ar: "ar" };
	};
	MC: {
		langs: { fr: "fr" };
	};
	MD: {
		langs: { ro: "ro" };
	};
	ME: {
		langs: { sr: "sr"; bs: "bs"; sq: "sq"; hr: "hr" };
	};
	MG: {
		langs: { fr: "fr"; mg: "mg" };
	};
	MH: {
		langs: { en: "en"; mh: "mh" };
	};
	MK: {
		langs: { mk: "mk" };
	};
	ML: {
		langs: { fr: "fr" };
	};
	MN: {
		langs: { mn: "mn" };
	};
	MO: {
		langs: { zh: "zh"; pt: "pt" };
	};
	MR: {
		langs: { ar: "ar" };
	};
	MT: {
		langs: { mt: "mt"; en: "en" };
	};
	MU: {
		langs: { en: "en" };
	};
	MV: {
		langs: { dv: "dv" };
	};
	MW: {
		langs: { en: "en"; ny: "ny" };
	};
	MX: {
		langs: { es: "es" };
	};
	MY: {
		langs: { ms: "ms" };
	};
	MZ: {
		langs: { pt: "pt" };
	};
	NA: {
		langs: { en: "en"; af: "af" };
	};
	NE: {
		langs: { fr: "fr" };
	};
	NG: {
		langs: { en: "en" };
	};
	NI: {
		langs: { es: "es" };
	};
	NL: {
		langs: { nl: "nl" };
	};
	NO: {
		langs: { no: "no"; nb: "nb"; nn: "nn" };
	};
	NP: {
		langs: { ne: "ne" };
	};
	NR: {
		langs: { en: "en"; na: "na" };
	};
	NZ: {
		langs: { en: "en"; mi: "mi" };
	};
	OM: {
		langs: { ar: "ar" };
	};
	PA: {
		langs: { es: "es" };
	};
	PE: {
		langs: { es: "es" };
	};
	PG: {
		langs: { en: "en" };
	};
	PH: {
		langs: { en: "en" };
	};
	PK: {
		langs: { ur: "ur"; en: "en" };
	};
	PL: {
		langs: { pl: "pl" };
	};
	PR: {
		langs: { es: "es"; en: "en" };
	};
	PS: {
		langs: { ar: "ar" };
	};
	PT: {
		langs: { pt: "pt" };
	};
	PW: {
		langs: { en: "en" };
	};
	PY: {
		langs: { es: "es"; gn: "gn" };
	};
	QA: {
		langs: { ar: "ar" };
	};
	RO: {
		langs: { ro: "ro" };
	};
	RS: {
		langs: { sr: "sr" };
	};
	RW: {
		langs: { rw: "rw"; en: "en"; fr: "fr" };
	};
	SA: {
		langs: { ar: "ar" };
	};
	SB: {
		langs: { en: "en" };
	};
	SC: {
		langs: { fr: "fr"; en: "en" };
	};
	SE: {
		langs: { sv: "sv" };
	};
	SG: {
		langs: { en: "en"; ms: "ms"; ta: "ta"; zh: "zh" };
	};
	SI: {
		langs: { sl: "sl" };
	};
	SK: {
		langs: { sk: "sk" };
	};
	SL: {
		langs: { en: "en" };
	};
	SM: {
		langs: { it: "it" };
	};
	SN: {
		langs: { fr: "fr" };
	};
	SR: {
		langs: { nl: "nl" };
	};
	ST: {
		langs: { pt: "pt" };
	};
	SV: {
		langs: { es: "es" };
	};
	SZ: {
		langs: { en: "en"; ss: "ss" };
	};
	TD: {
		langs: { fr: "fr"; ar: "ar" };
	};
	TG: {
		langs: { fr: "fr" };
	};
	TH: {
		langs: { th: "th" };
	};
	TJ: {
		langs: { tg: "tg"; ru: "ru" };
	};
	TL: {
		langs: { pt: "pt" };
	};
	TN: {
		langs: { ar: "ar" };
	};
	TO: {
		langs: { en: "en"; to: "to" };
	};
	TR: {
		langs: { tr: "tr" };
	};
	TT: {
		langs: { en: "en" };
	};
	TV: {
		langs: { en: "en" };
	};
	TW: {
		langs: { zh: "zh" };
	};
	TZ: {
		langs: { sw: "sw"; en: "en" };
	};
	UA: {
		langs: { uk: "uk" };
	};
	UG: {
		langs: { en: "en"; sw: "sw" };
	};
	US: {
		langs: { en: "en" };
	};
	UY: {
		langs: { es: "es" };
	};
	UZ: {
		langs: { uz: "uz"; ru: "ru" };
	};
	VC: {
		langs: { en: "en" };
	};
	VE: {
		langs: { es: "es" };
	};
	VN: {
		langs: { vi: "vi" };
	};
	VU: {
		langs: { bi: "bi"; en: "en"; fr: "fr" };
	};
	WS: {
		langs: { sm: "sm"; en: "en" };
	};
	XK: {
		langs: { sq: "sq"; sr: "sr" };
	};
	ZA: {
		langs: {
			af: "af";
			en: "en";
			nr: "nr";
			st: "st";
			ss: "ss";
			tn: "tn";
			ts: "ts";
			ve: "ve";
			xh: "xh";
			zu: "zu";
		};
	};
	ZM: {
		langs: { en: "en" };
	};
	ZW: {
		langs: { en: "en"; sn: "sn"; nd: "nd" };
	};
};

type Code<T> = T extends keyof Country
	? keyof Country[T]["langs"] extends string
		? `${T}_${keyof Country[T]["langs"]}`
		: never
	: never;

type Locale = Code<keyof Country>;

type Limit = Range<1, 50>;

export type MarketOnlyOptions = {
	/**
	 * An ISO 3166-1 alpha-2 country code
	 * @see {@link https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2|ISO 3166-1 alpha-2}
	 */
	market?: Market;
};

export type LocaleOnlyOptions = {
	/**
	 * The desired language, consisting of an ISO 639-1 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore.
	 * Provide this parameter if you want the category strings returned in a particular language.
	 *
	 * @remarks
	 * If `locale` is not supplied, or if the specified language is not available,
	 * the category strings returned will be in the Spotify default language (American English)
	 *
	 * @see {@link https://en.wikipedia.org/wiki/ISO_639-1|ISO 639-1}
	 * @see {@link https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2|ISO 3166-1 alpha-2}
	 */
	locale?: Locale;
};

export type PaginatedMarketOptions = {
	/**
	 * An ISO 3166-1 alpha-2 country code
	 * @see {@link https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2|ISO 3166-1 alpha-2}
	 */
	market?: Market;
	/**
	 * The maximum number of items to return.
	 *
	 * @remarks
	 *
	 * Default: 20.
	 * Minimum: 1.
	 * Maximum: 50.
	 */
	limit?: Limit;
	/**
	 * The index of the first item to return.
	 *
	 * @remarks
	 *
	 * Use with limit to get the next set of items.
	 * Default: 0 (the first item).
	 */
	offset?: number;
};

export type PaginationOptions = {
	/**
	 * The maximum number of items to return.
	 *
	 * @remarks
	 *
	 * Default: 20.
	 * Minimum: 1.
	 * Maximum: 50.
	 */
	limit?: Limit;
	/**
	 * The index of the first item to return.
	 *
	 * @remarks
	 *
	 * Use with limit to get the next set of items.
	 * Default: 0 (the first item).
	 */
	offset?: number;
};

export type AlbumRetrievalOptions = {
	/**
	 * A list of keywords that will be used to filter the response. If not supplied, all album types will be returned.
	 */
	include_groups?: ("album" | "single" | "appears_on" | "compilation")[];
	/**
	 * An ISO 3166-1 alpha-2 country code
	 * @see {@link https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2|ISO 3166-1 alpha-2}
	 */
	market?: Market;
	/**
	 * The maximum number of items to return.
	 *
	 * @remarks
	 *
	 * Default: 20.
	 * Minimum: 1.
	 * Maximum: 50.
	 */
	limit?: Limit;
	/**
	 * The index of the first item to return.
	 *
	 * @remarks
	 *
	 * Use with limit to get the next set of items.
	 * Default: 0 (the first item).
	 */
	offset?: number;
};

export type LocalizedPaginationOptions = {
	/**
	 * The desired language, consisting of an ISO 639-1 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore.
	 * Provide this parameter if you want the category strings returned in a particular language.
	 *
	 * @remarks
	 * If `locale` is not supplied, or if the specified language is not available,
	 * the category strings returned will be in the Spotify default language (American English)
	 *
	 * @see {@link https://en.wikipedia.org/wiki/ISO_639-1|ISO 639-1}
	 * @see {@link https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2|ISO 3166-1 alpha-2}
	 */
	locale?: Locale;
	/**
	 * The maximum number of items to return.
	 *
	 * @remarks
	 *
	 * Default: 20.
	 * Minimum: 1.
	 * Maximum: 50.
	 */
	limit?: Limit;
	/**
	 * The index of the first item to return.
	 *
	 * @remarks
	 *
	 * Use with limit to get the next set of items.
	 * Default: 0 (the first item).
	 */
	offset: number;
};

export type MarketAdditionalTypesOptions = {
	/**
	 * An ISO 3166-1 alpha-2 country code
	 * @see {@link https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2|ISO 3166-1 alpha-2}
	 */
	market?: Market;
	/**
	 * A list of item types that your client supports besides the default track type.
	 *
	 * @remarks
	 * Valid types are:
	 *
	 * * `track`
	 * * `episode`
	 */
	additional_types?: ("track" | "episode")[];
};

export type DateRangeOptions =
	| {
			/**
			 * The maximum number of items to return.
			 *
			 * @remarks
			 *
			 * Default: 20.
			 * Minimum: 1.
			 * Maximum: 50.
			 */
			limit?: Limit;
			/**
			 * A Unix timestamp in milliseconds. Returns all items before (but not including) this cursor position.
			 * If `before` is specified, `after` must not be specified
			 */
			before?: number;
	  }
	| {
			/**
			 * The maximum number of items to return.
			 *
			 * @remarks
			 *
			 * Default: 20.
			 * Minimum: 1.
			 * Maximum: 50.
			 */
			limit?: Limit;
			/**
			 * A Unix timestamp in milliseconds. Returns all items after (but not including) this cursor position.
			 * If `after` is specified, `before` must not be specified.
			 */
			after?: number;
	  };

export type MarketFieldOptions = {
	/**
	 * An ISO 3166-1 alpha-2 country code
	 * @see {@link https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2|ISO 3166-1 alpha-2}
	 */
	market?: Market;
	/**
	 * Filters for the query: a list of the fields to return. If omitted, all fields are returned.
	 * For example, to get just the playlist's description and URI: `fields=["description", "uri"]`.
	 * A dot separator can be used to specify non-reoccurring fields, while parentheses can be used to specify reoccurring fields within objects.
	 * For example, to get just the added date and user ID of the adder: `fields=["tracks.items(added_at, added_by.id)"]`.
	 * Use multiple parentheses to drill down into nested objects, for example: `fields=["tracks.items(track(name,href,album(name,href)))"]`.
	 * Fields can be excluded by prefixing them with an exclamation mark, for example: `fields=["tracks.items(track(name,href,album(!name,href)))"]`
	 */
	fields?: string[];
	/**
	 * A list of item types that your client supports besides the default track type.
	 *
	 * @remarks
	 * Valid types are:
	 *
	 * * `track`
	 * * `episode`
	 */
	additional_types?: ("track" | "episode")[];
};

export type DetailedMarketPaginationOptions = {
	/**
	 * An ISO 3166-1 alpha-2 country code
	 * @see {@link https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2|ISO 3166-1 alpha-2}
	 */
	market?: Market;
	/**
	 * Filters for the query: a list of the fields to return. If omitted, all fields are returned.
	 * For example, to get just the total number of items and the request limit: `fields=["total", "limit"]`.
	 * A dot separator can be used to specify non-reoccurring fields, while parentheses can be used to specify reoccurring fields within objects.
	 * For example, to get just the added date and user ID of the adder: `fields=["items(added_at,added_by.id)"]`.
	 * Use multiple parentheses to drill down into nested objects, for example: `fields=["items(track(name,href,album(name,href)))"]`.
	 * Fields can be excluded by prefixing them with an exclamation mark, for example: `fields=["items.track.album(!external_urls,images)"]`
	 */
	fields?: string[];
	/**
	 * The maximum number of items to return.
	 *
	 * @remarks
	 *
	 * Default: 20.
	 * Minimum: 1.
	 * Maximum: 50.
	 */
	limit?: Limit;
	/**
	 * The index of the first item to return.
	 *
	 * @remarks
	 *
	 * Use with limit to get the next set of items.
	 * Default: 0 (the first item).
	 */
	offset?: number;
	/**
	 * A list of item types that your client supports besides the default track type.
	 *
	 * @remarks
	 * Valid types are:
	 *
	 * * `track`
	 * * `episode`
	 */
	additional_types?: ("track" | "episode")[];
};

export type MarketExternalOptions = {
	/**
	 * An ISO 3166-1 alpha-2 country code
	 * @see {@link https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2|ISO 3166-1 alpha-2}
	 */
	market?: Market;
	/**
	 * The maximum number of items to return.
	 *
	 * @remarks
	 *
	 * Default: 20.
	 * Minimum: 1.
	 * Maximum: 50.
	 */
	limit?: Limit;
	/**
	 * The index of the first item to return.
	 *
	 * @remarks
	 *
	 * Use with limit to get the next set of items.
	 * Default: 0 (the first item).
	 */
	offset?: number;
	/**
	 * If this field is set to `audio` it signals that the client can play externally hosted audio content,
	 * and marks the content as playable in the response.
	 * By default externally hosted audio content is marked as unplayable in the response
	 */
	include_external?: "audio";
};

export type TimeRangePaginationOptions = {
	/**
	 * Over what time frame the affinities are computed.
	 *
	 * @remarks
	 *
	 * Valid values:
	 *
	 * * long_term (calculated from ~1 year of data and including all new data as it becomes available)
	 * * medium_term (approximately last 6 months)
	 * * short_term (approximately last 4 weeks)
	 *
	 * Default: `"medium_term"`
	 */
	time_range?: "long_term" | "medium_term" | "short_term";
	/**
	 * The maximum number of items to return.
	 *
	 * @remarks
	 *
	 * Default: 20.
	 * Minimum: 1.
	 * Maximum: 50.
	 */
	limit?: Limit;
	/**
	 * The index of the first item to return.
	 *
	 * @remarks
	 *
	 * Use with limit to get the next set of items.
	 * Default: 0 (the first item).
	 */
	offset?: number;
};

export type AfterBasedPaginationOptions = {
	/**
	 * The last artist ID retrieved from the previous request.
	 */
	after?: string;
	/**
	 * The maximum number of items to return.
	 *
	 * @remarks
	 *
	 * Default: 20.
	 * Minimum: 1.
	 * Maximum: 50.
	 */
	limit?: Limit;
};

export type AllOptions =
	| MarketOnlyOptions
	| LocaleOnlyOptions
	| PaginatedMarketOptions
	| PaginationOptions
	| AlbumRetrievalOptions
	| LocalizedPaginationOptions
	| MarketAdditionalTypesOptions
	| DateRangeOptions
	| MarketFieldOptions
	| DetailedMarketPaginationOptions
	| MarketExternalOptions
	| TimeRangePaginationOptions
	| AfterBasedPaginationOptions;
