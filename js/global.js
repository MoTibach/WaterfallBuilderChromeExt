const API_DOMAIN = "app.mopub.com";
const BASE_URL = `https://${API_DOMAIN}`;
const GET_ADUNIT = "/web-client/api/ad-units/get";
const GET_ORDERS = "/web-client/api/orders/query";
const GET_ORDER = "/web-client/api/orders/get";
const GET_LINEITEM = "/web-client/api/line-items/get";
const UPDATE_LINEITEM = "/web-client/api/line-items/update";
const UPDATE_ADSOURCE = "/web-client/api/ad-units/update-ad-source";
const CREATE_LINEITEM = "/web-client/api/line-items/create";
const CREATE_ORDER = "/web-client/api/orders/create";
const GET_APPS = "/web-client/api/apps/query";
const GET_ADUNITS = "/web-client/api/ad-units/query";
const GET_ACCOUNT = "/web-client/api/users/query";

// Tabulator Objects
var WaterfallTable, LineItemTable, OrderTable;

// Current Ad Unit Id
var AdUnitId;

// Current Ad Unit Name (Waterfall Name)
var AdUnitName;

// WaterfallTable Grouping Option Flag
WaterfallGrouping = true;

// Number of changed line items
var NumberOfUpdatedLineItems = 0;

// When Create New Order
const NEW_ORDER_NAME_POSTFIX = " (Created by WBExt)";
const NEW_ORDER_ADVERTISER = "Advertiser";
const NEW_ORDER_DESC = "Created by WaterfallBuilder Chrome Ext";

// When Create New Line Item (Suffix Default)
const NEW_LINE_ITEM_NAME_SUFFIX = " (New)";

// Duplicated Line Item Name Suffix
var LineItemNameSuffix = NEW_LINE_ITEM_NAME_SUFFIX;

// New Order Name Suffix
var OrderNameSuffix = NEW_ORDER_NAME_POSTFIX;

// Table Heights and P
const WATERFALL_TABLE_HEIGHT = 700;
const LINEITEM_TABLE_HEIGHT = 504;
const ORDER_TABLE_HEIGHT = 504; 
const LINEITEM_PAGINATION_SIZE = 7;
const ORDER_PAGINATION_SIZE = 7;

// Line Item Type Name
const TYPE_NAME = {
	gtee: "Guaranteed",
	non_gtee: "Non-guaranteed",
	promo: "Promotional",
	backfill_promo: "Backfill Promotional",
	mpx_line_item: "Marketplace",
	network: "Network",
	advanced_bidding_mpx: "AB MPX",
	advanced_bidding_network: "AB Network",
	marketplace: "Default MPX",
  pmp_line_item: "Private Marketplace",
  segment: "Segment"
}

// Network Type Name
const NETWORK_TYPE_NAME = {
	admob_native: "AdMob",
	applovin_sdk: "AppLovin",
	adcolony: "AdColony",
	chartboost: "Chartboost",
	facebook: "Facebook",
	ironsource: "IronSource",
	tapjoy: "TapJoy",
	vungle: "Vungle",
	verizon: "Verizon",
	unity: "Unity",
	yahoo: "Yahoo",
	pangle: "Pangle",
	custom_html: "Custom JS",
	custom_native: "Custom SDK"
}

// New Line Item Name
const NEW_NETWORK_LINEITEM_NAME = "New Network Line Item";
const NEW_DIRECT_LINEITEM_NAME = "New Direct Line Item";
const NEW_MPX_LINEITEM_NAME = "New MPX Line Item";

// Country List
const COUNTRY_LIST = [
	{ country_code: "AF", country: "Afghanistan" }, 
	{ country_code: "AX", country: "Aland Islands" }, 
	{ country_code: "AL", country: "Albania" }, 
	{ country_code: "DZ", country: "Algeria" }, 
	{ country_code: "AS", country: "American Samoa" }, 
	{ country_code: "AD", country: "Andorra" }, 
	{ country_code: "AO", country: "Angola" }, 
	{ country_code: "AI", country: "Anguilla" }, 
	{ country_code: "AG", country: "Antigua" }, 
	{ country_code: "AR", country: "Argentina" }, 
	{ country_code: "AM", country: "Armenia" }, 
	{ country_code: "AW", country: "Aruba" }, 
	{ country_code: "AU", country: "Australia" }, 
	{ country_code: "AT", country: "Austria" }, 
	{ country_code: "AZ", country: "Azerbaijan" }, 
	{ country_code: "BS", country: "Bahamas" }, 
	{ country_code: "BH", country: "Bahrain" }, 
	{ country_code: "BD", country: "Bangladesh" }, 
	{ country_code: "BB", country: "Barbados" }, 
	{ country_code: "BY", country: "Belarus" }, 
	{ country_code: "BE", country: "Belgium" }, 
	{ country_code: "BZ", country: "Belize" }, 
	{ country_code: "BJ", country: "Benin" }, 
	{ country_code: "BM", country: "Bermuda" }, 
	{ country_code: "BT", country: "Bhutan" }, 
	{ country_code: "BO", country: "Bolivia" }, 
	{ country_code: "BA", country: "Bosnia" }, 
	{ country_code: "BW", country: "Botswana" }, 
	{ country_code: "BV", country: "Bouvet Island" }, 
	{ country_code: "BR", country: "Brazil" }, 
	{ country_code: "VG", country: "British Virgin Islands" }, 
	{ country_code: "BN", country: "Brunei" }, 
	{ country_code: "BG", country: "Bulgaria" }, 
	{ country_code: "BF", country: "Burkina Faso" }, 
	{ country_code: "MM", country: "Burma" }, 
	{ country_code: "BI", country: "Burundi" }, 
	{ country_code: "TC", country: "Caicos Islands" }, 
	{ country_code: "KH", country: "Cambodia" }, 
	{ country_code: "CM", country: "Cameroon" }, 
	{ country_code: "CA", country: "Canada" }, 
	{ country_code: "CV", country: "Cape Verde" }, 
	{ country_code: "KY", country: "Cayman Islands" }, 
	{ country_code: "CF", country: "Central African Republic" }, 
	{ country_code: "TD", country: "Chad" }, 
	{ country_code: "CL", country: "Chile" }, 
	{ country_code: "CN", country: "China" }, 
	{ country_code: "CX", country: "Christmas Island" }, 
	{ country_code: "CC", country: "Cocos Islands" }, 
	{ country_code: "CO", country: "Colombia" }, 
	{ country_code: "KM", country: "Comoros" }, 
	{ country_code: "CG", country: "Congo Brazzaville" }, 
	{ country_code: "CD", country: "Congo" }, 
	{ country_code: "CK", country: "Cook Islands" }, 
	{ country_code: "CR", country: "Costa Rica" }, 
	{ country_code: "CI", country: "Cote Divoire" }, 
	{ country_code: "HR", country: "Croatia" }, 
	{ country_code: "CU", country: "Cuba" }, 
	{ country_code: "CY", country: "Cyprus" }, 
	{ country_code: "CZ", country: "Czech Republic" }, 
	{ country_code: "DK", country: "Denmark" }, 
	{ country_code: "DJ", country: "Djibouti" }, 
	{ country_code: "DM", country: "Dominica" }, 
	{ country_code: "DO", country: "Dominican Republic" }, 
	{ country_code: "EC", country: "Ecuador" }, 
	{ country_code: "EG", country: "Egypt" }, 
	{ country_code: "SV", country: "El Salvador" }, 
	{ country_code: "GQ", country: "Equatorial Guinea" }, 
	{ country_code: "ER", country: "Eritrea" }, 
	{ country_code: "EE", country: "Estonia" }, 
	{ country_code: "ET", country: "Ethiopia" }, 
	{ country_code: "EU", country: "European Union" }, 
	{ country_code: "FK", country: "Falkland Islands" }, 
	{ country_code: "FO", country: "Faroe Islands" }, 
	{ country_code: "FJ", country: "Fiji" }, 
	{ country_code: "FI", country: "Finland" }, 
	{ country_code: "FR", country: "France" }, 
	{ country_code: "GF", country: "French Guiana" }, 
	{ country_code: "PF", country: "French Polynesia" }, 
	{ country_code: "TF", country: "French Territories" }, 
	{ country_code: "GA", country: "Gabon" }, 
	{ country_code: "GM", country: "Gambia" }, 
	{ country_code: "GE", country: "Georgia" }, 
	{ country_code: "DE", country: "Germany" }, 
	{ country_code: "GH", country: "Ghana" }, 
	{ country_code: "GI", country: "Gibraltar" }, 
	{ country_code: "GR", country: "Greece" }, 
	{ country_code: "GL", country: "Greenland" }, 
	{ country_code: "GD", country: "Grenada" }, 
	{ country_code: "GP", country: "Guadeloupe" }, 
	{ country_code: "GU", country: "Guam" }, 
	{ country_code: "GT", country: "Guatemala" }, 
	{ country_code: "GW", country: "Guinea-Bissau" }, 
	{ country_code: "GN", country: "Guinea" }, 
	{ country_code: "GY", country: "Guyana" }, 
	{ country_code: "HT", country: "Haiti" }, 
	{ country_code: "HM", country: "Heard Island" }, 
	{ country_code: "HN", country: "Honduras" }, 
	{ country_code: "HK", country: "Hong Kong" }, 
	{ country_code: "HU", country: "Hungary" }, 
	{ country_code: "IS", country: "Iceland" }, 
	{ country_code: "IN", country: "India" }, 
	{ country_code: "IO", country: "Indian Ocean Territory" }, 
	{ country_code: "ID", country: "Indonesia" }, 
	{ country_code: "IR", country: "Iran" }, 
	{ country_code: "IQ", country: "Iraq" }, 
	{ country_code: "IE", country: "Ireland" }, 
	{ country_code: "IL", country: "Israel" }, 
	{ country_code: "IT", country: "Italy" }, 
	{ country_code: "JM", country: "Jamaica" }, 
	{ country_code: "JP", country: "Japan" }, 
	{ country_code: "JO", country: "Jordan" }, 
	{ country_code: "KZ", country: "Kazakhstan" }, 
	{ country_code: "KE", country: "Kenya" }, 
	{ country_code: "KI", country: "Kiribati" }, 
	{ country_code: "KW", country: "Kuwait" }, 
	{ country_code: "KG", country: "Kyrgyzstan" }, 
	{ country_code: "LA", country: "Laos" }, 
	{ country_code: "LV", country: "Latvia" }, 
	{ country_code: "LB", country: "Lebanon" }, 
	{ country_code: "LS", country: "Lesotho" }, 
	{ country_code: "LR", country: "Liberia" }, 
	{ country_code: "LY", country: "Libya" }, 
	{ country_code: "LI", country: "Liechtenstein" }, 
	{ country_code: "LT", country: "Lithuania" }, 
	{ country_code: "LU", country: "Luxembourg" }, 
	{ country_code: "MO", country: "Macau" }, 
	{ country_code: "MK", country: "Macedonia" }, 
	{ country_code: "MG", country: "Madagascar" }, 
	{ country_code: "MW", country: "Malawi" }, 
	{ country_code: "MY", country: "Malaysia" }, 
	{ country_code: "MV", country: "Maldives" }, 
	{ country_code: "ML", country: "Mali" }, 
	{ country_code: "MT", country: "Malta" }, 
	{ country_code: "MH", country: "Marshall Islands" }, 
	{ country_code: "MQ", country: "Martinique" }, 
	{ country_code: "MR", country: "Mauritania" }, 
	{ country_code: "MU", country: "Mauritius" }, 
	{ country_code: "YT", country: "Mayotte" }, 
	{ country_code: "MX", country: "Mexico" }, 
	{ country_code: "FM", country: "Micronesia" }, 
	{ country_code: "MD", country: "Moldova" }, 
	{ country_code: "MC", country: "Monaco" }, 
	{ country_code: "MN", country: "Mongolia" }, 
	{ country_code: "ME", country: "Montenegro" }, 
	{ country_code: "MS", country: "Montserrat" }, 
	{ country_code: "MA", country: "Morocco" }, 
	{ country_code: "MZ", country: "Mozambique" }, 
	{ country_code: "NA", country: "Namibia" }, 
	{ country_code: "NR", country: "Nauru" }, 
	{ country_code: "NP", country: "Nepal" }, 
	{ country_code: "AN", country: "Netherlands Antilles" }, 
	{ country_code: "NL", country: "Netherlands" }, 
	{ country_code: "NC", country: "New Caledonia" }, 
	{ country_code: "PG", country: "New Guinea" }, 
	{ country_code: "NZ", country: "New Zealand" }, 
	{ country_code: "NI", country: "Nicaragua" }, 
	{ country_code: "NE", country: "Niger" }, 
	{ country_code: "NG", country: "Nigeria" }, 
	{ country_code: "NU", country: "Niue" }, 
	{ country_code: "NF", country: "Norfolk Island" }, 
	// { country_code: "KP", country: "North Korea" }, 
	{ country_code: "MP", country: "Northern Mariana Islands" }, 
	{ country_code: "NO", country: "Norway" }, 
	{ country_code: "OM", country: "Oman" }, 
	{ country_code: "PK", country: "Pakistan" }, 
	{ country_code: "PW", country: "Palau" }, 
	{ country_code: "PS", country: "Palestine" }, 
	{ country_code: "PA", country: "Panama" }, 
	{ country_code: "PY", country: "Paraguay" }, 
	{ country_code: "PE", country: "Peru" }, 
	{ country_code: "PH", country: "Philippines" }, 
	{ country_code: "PN", country: "Pitcairn Islands" }, 
	{ country_code: "PL", country: "Poland" }, 
	{ country_code: "PT", country: "Portugal" }, 
	{ country_code: "PR", country: "Puerto Rico" }, 
	{ country_code: "QA", country: "Qatar" }, 
	{ country_code: "RE", country: "Reunion" }, 
	{ country_code: "RO", country: "Romania" }, 
	{ country_code: "RU", country: "Russia" }, 
	{ country_code: "RW", country: "Rwanda" }, 
	{ country_code: "SH", country: "Saint Helena" }, 
	{ country_code: "KN", country: "Saint Kitts and Nevis" }, 
	{ country_code: "LC", country: "Saint Lucia" }, 
	{ country_code: "PM", country: "Saint Pierre" }, 
	{ country_code: "VC", country: "Saint Vincent" }, 
	{ country_code: "WS", country: "Samoa" }, 
	{ country_code: "SM", country: "San Marino" }, 
	{ country_code: "GS", country: "Sandwich Islands" }, 
	{ country_code: "ST", country: "Sao Tome" }, 
	{ country_code: "SA", country: "Saudi Arabia" }, 
	{ country_code: "SN", country: "Senegal" }, 
	{ country_code: "CS", country: "Serbia" }, 
	{ country_code: "RS", country: "Serbia" }, 
	{ country_code: "SC", country: "Seychelles" }, 
	{ country_code: "SL", country: "Sierra Leone" }, 
	{ country_code: "SG", country: "Singapore" }, 
	{ country_code: "SK", country: "Slovakia" }, 
	{ country_code: "SI", country: "Slovenia" }, 
	{ country_code: "SB", country: "Solomon Islands" }, 
	{ country_code: "SO", country: "Somalia" }, 
	{ country_code: "ZA", country: "South Africa" }, 
	{ country_code: "KR", country: "Korea, Republic of" }, 
	{ country_code: "ES", country: "Spain" }, 
	{ country_code: "LK", country: "Sri Lanka" }, 
	{ country_code: "SD", country: "Sudan" }, 
	{ country_code: "SR", country: "Suriname" }, 
	{ country_code: "SJ", country: "Svalbard" }, 
	{ country_code: "SZ", country: "Swaziland" }, 
	{ country_code: "SE", country: "Sweden" }, 
	{ country_code: "CH", country: "Switzerland" }, 
	{ country_code: "SY", country: "Syria" }, 
	{ country_code: "TW", country: "Taiwan" }, 
	{ country_code: "TJ", country: "Tajikistan" }, 
	{ country_code: "TZ", country: "Tanzania" }, 
	{ country_code: "TH", country: "Thailand" }, 
	{ country_code: "TL", country: "Timorleste" }, 
	{ country_code: "TG", country: "Togo" }, 
	{ country_code: "TK", country: "Tokelau" }, 
	{ country_code: "TO", country: "Tonga" }, 
	{ country_code: "TT", country: "Trinidad" }, 
	{ country_code: "TN", country: "Tunisia" }, 
	{ country_code: "TR", country: "Turkey" }, 
	{ country_code: "TM", country: "Turkmenistan" }, 
	{ country_code: "TV", country: "Tuvalu" }, 
	{ country_code: "UG", country: "Uganda" }, 
	{ country_code: "UA", country: "Ukraine" }, 
	{ country_code: "AE", country: "United Arab Emirates" }, 
	{ country_code: "GB", country: "United Kingdom" }, 
	{ country_code: "US", country: "United States" }, 
	{ country_code: "UY", country: "Uruguay" }, 
	{ country_code: "UM", country: "Us Minor Islands" }, 
	{ country_code: "VI", country: "Us Virgin Islands" }, 
	{ country_code: "UZ", country: "Uzbekistan" }, 
	{ country_code: "VU", country: "Vanuatu" }, 
	{ country_code: "VA", country: "Vatican City" }, 
	{ country_code: "VE", country: "Venezuela" }, 
	{ country_code: "VN", country: "Vietnam" }, 
	{ country_code: "WF", country: "Wallis and Futuna" }, 
	{ country_code: "EH", country: "Western Sahara" }, 
	{ country_code: "YE", country: "Yemen" }, 
	{ country_code: "ZM", country: "Zambia" }, 
	{ country_code: "ZW", country: "Zimbabwe" }
];
