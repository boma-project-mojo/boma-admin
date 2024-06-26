import { computed } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import ENV from '../config/environment';

export default Component.extend({
  session: service(),

  is_saving: false,
  is_editing_or_new: computed('is_editing', 'festival.isNew', function () {
    return this.get('festival.isNew') === true || this.is_editing === true;
  }),
  file_is_loaded: false,
  timezones: [
    'Europe/Andorra',
    'Asia/Dubai',
    'Asia/Kabul',
    'America/Antigua',
    'America/Anguilla',
    'Europe/Tirane',
    'Asia/Yerevan',
    'Africa/Luanda',
    'Antarctica/McMurdo',
    'Antarctica/Casey',
    'Antarctica/Davis',
    'Antarctica/DumontDUrville',
    'Antarctica/Mawson',
    'Antarctica/Palmer',
    'Antarctica/Rothera',
    'Antarctica/Syowa',
    'Antarctica/Troll',
    'Antarctica/Vostok',
    'America/Argentina/Buenos_Aires',
    'America/Argentina/Cordoba',
    'America/Argentina/Salta',
    'America/Argentina/Jujuy',
    'America/Argentina/Tucuman',
    'America/Argentina/Catamarca',
    'America/Argentina/La_Rioja',
    'America/Argentina/San_Juan',
    'America/Argentina/Mendoza',
    'America/Argentina/San_Luis',
    'America/Argentina/Rio_Gallegos',
    'America/Argentina/Ushuaia',
    'Pacific/Pago_Pago',
    'Europe/Vienna',
    'Australia/Lord_Howe',
    'Antarctica/Macquarie',
    'Australia/Hobart',
    'Australia/Currie',
    'Australia/Melbourne',
    'Australia/Sydney',
    'Australia/Broken_Hill',
    'Australia/Brisbane',
    'Australia/Lindeman',
    'Australia/Adelaide',
    'Australia/Darwin',
    'Australia/Perth',
    'Australia/Eucla',
    'America/Aruba',
    'Europe/Mariehamn',
    'Asia/Baku',
    'Europe/Sarajevo',
    'America/Barbados',
    'Asia/Dhaka',
    'Europe/Brussels',
    'Africa/Ouagadougou',
    'Europe/Sofia',
    'Asia/Bahrain',
    'Africa/Bujumbura',
    'Africa/Porto-Novo',
    'America/St_Barthelemy',
    'Atlantic/Bermuda',
    'Asia/Brunei',
    'America/La_Paz',
    'America/Kralendijk',
    'America/Noronha',
    'America/Belem',
    'America/Fortaleza',
    'America/Recife',
    'America/Araguaina',
    'America/Maceio',
    'America/Bahia',
    'America/Sao_Paulo',
    'America/Campo_Grande',
    'America/Cuiaba',
    'America/Santarem',
    'America/Porto_Velho',
    'America/Boa_Vista',
    'America/Manaus',
    'America/Eirunepe',
    'America/Rio_Branco',
    'America/Nassau',
    'Asia/Thimphu',
    'Africa/Gaborone',
    'Europe/Minsk',
    'America/Belize',
    'America/St_Johns',
    'America/Halifax',
    'America/Glace_Bay',
    'America/Moncton',
    'America/Goose_Bay',
    'America/Blanc-Sablon',
    'America/Toronto',
    'America/Nipigon',
    'America/Thunder_Bay',
    'America/Iqaluit',
    'America/Pangnirtung',
    'America/Atikokan',
    'America/Winnipeg',
    'America/Rainy_River',
    'America/Resolute',
    'America/Rankin_Inlet',
    'America/Regina',
    'America/Swift_Current',
    'America/Edmonton',
    'America/Cambridge_Bay',
    'America/Yellowknife',
    'America/Inuvik',
    'America/Creston',
    'America/Dawson_Creek',
    'America/Fort_Nelson',
    'America/Vancouver',
    'America/Whitehorse',
    'America/Dawson',
    'Indian/Cocos',
    'Africa/Kinshasa',
    'Africa/Lubumbashi',
    'Africa/Bangui',
    'Africa/Brazzaville',
    'Europe/Zurich',
    'Africa/Abidjan',
    'Pacific/Rarotonga',
    'America/Santiago',
    'America/Punta_Arenas',
    'Pacific/Easter',
    'Africa/Douala',
    'Asia/Shanghai',
    'Asia/Urumqi',
    'America/Bogota',
    'America/Costa_Rica',
    'America/Havana',
    'Atlantic/Cape_Verde',
    'America/Curacao',
    'Indian/Christmas',
    'Asia/Nicosia',
    'Asia/Famagusta',
    'Europe/Prague',
    'Europe/Berlin',
    'Europe/Busingen',
    'Africa/Djibouti',
    'Europe/Copenhagen',
    'America/Dominica',
    'America/Santo_Domingo',
    'Africa/Algiers',
    'America/Guayaquil',
    'Pacific/Galapagos',
    'Europe/Tallinn',
    'Africa/Cairo',
    'Africa/El_Aaiun',
    'Africa/Asmara',
    'Europe/Madrid',
    'Africa/Ceuta',
    'Atlantic/Canary',
    'Africa/Addis_Ababa',
    'Europe/Helsinki',
    'Pacific/Fiji',
    'Atlantic/Stanley',
    'Pacific/Chuuk',
    'Pacific/Pohnpei',
    'Pacific/Kosrae',
    'Atlantic/Faroe',
    'Europe/Paris',
    'Africa/Libreville',
    'Europe/London',
    'America/Grenada',
    'Asia/Tbilisi',
    'America/Cayenne',
    'Europe/Guernsey',
    'Africa/Accra',
    'Europe/Gibraltar',
    'America/Godthab',
    'America/Danmarkshavn',
    'America/Scoresbysund',
    'America/Thule',
    'Africa/Banjul',
    'Africa/Conakry',
    'America/Guadeloupe',
    'Africa/Malabo',
    'Europe/Athens',
    'Atlantic/South_Georgia',
    'America/Guatemala',
    'Pacific/Guam',
    'Africa/Bissau',
    'America/Guyana',
    'Asia/Hong_Kong',
    'America/Tegucigalpa',
    'Europe/Zagreb',
    'America/Port-au-Prince',
    'Europe/Budapest',
    'Asia/Jakarta',
    'Asia/Pontianak',
    'Asia/Makassar',
    'Asia/Jayapura',
    'Europe/Dublin',
    'Asia/Jerusalem',
    'Europe/Isle_of_Man',
    'Asia/Kolkata',
    'Indian/Chagos',
    'Asia/Baghdad',
    'Asia/Tehran',
    'Atlantic/Reykjavik',
    'Europe/Rome',
    'Europe/Jersey',
    'America/Jamaica',
    'Asia/Amman',
    'Asia/Tokyo',
    'Africa/Nairobi',
    'Asia/Bishkek',
    'Asia/Phnom_Penh',
    'Pacific/Tarawa',
    'Pacific/Enderbury',
    'Pacific/Kiritimati',
    'Indian/Comoro',
    'America/St_Kitts',
    'Asia/Pyongyang',
    'Asia/Seoul',
    'Asia/Kuwait',
    'America/Cayman',
    'Asia/Almaty',
    'Asia/Qyzylorda',
    'Asia/Qostanay',
    'Asia/Aqtobe',
    'Asia/Aqtau',
    'Asia/Atyrau',
    'Asia/Oral',
    'Asia/Vientiane',
    'Asia/Beirut',
    'America/St_Lucia',
    'Europe/Vaduz',
    'Asia/Colombo',
    'Africa/Monrovia',
    'Africa/Maseru',
    'Europe/Vilnius',
    'Europe/Luxembourg',
    'Europe/Riga',
    'Africa/Tripoli',
    'Africa/Casablanca',
    'Europe/Monaco',
    'Europe/Chisinau',
    'Europe/Podgorica',
    'America/Marigot',
    'Indian/Antananarivo',
    'Pacific/Majuro',
    'Pacific/Kwajalein',
    'Europe/Skopje',
    'Africa/Bamako',
    'Asia/Yangon',
    'Asia/Ulaanbaatar',
    'Asia/Hovd',
    'Asia/Choibalsan',
    'Asia/Macau',
    'Pacific/Saipan',
    'America/Martinique',
    'Africa/Nouakchott',
    'America/Montserrat',
    'Europe/Malta',
    'Indian/Mauritius',
    'Indian/Maldives',
    'Africa/Blantyre',
    'America/Mexico_City',
    'America/Cancun',
    'America/Merida',
    'America/Monterrey',
    'America/Matamoros',
    'America/Mazatlan',
    'America/Chihuahua',
    'America/Ojinaga',
    'America/Hermosillo',
    'America/Tijuana',
    'America/Bahia_Banderas',
    'Asia/Kuala_Lumpur',
    'Asia/Kuching',
    'Africa/Maputo',
    'Africa/Windhoek',
    'Pacific/Noumea',
    'Africa/Niamey',
    'Pacific/Norfolk',
    'Africa/Lagos',
    'America/Managua',
    'Europe/Amsterdam',
    'Europe/Oslo',
    'Asia/Kathmandu',
    'Pacific/Nauru',
    'Pacific/Niue',
    'Pacific/Auckland',
    'Pacific/Chatham',
    'Asia/Muscat',
    'America/Panama',
    'America/Lima',
    'Pacific/Tahiti',
    'Pacific/Marquesas',
    'Pacific/Gambier',
    'Pacific/Port_Moresby',
    'Pacific/Bougainville',
    'Asia/Manila',
    'Asia/Karachi',
    'Europe/Warsaw',
    'America/Miquelon',
    'Pacific/Pitcairn',
    'America/Puerto_Rico',
    'Asia/Gaza',
    'Asia/Hebron',
    'Europe/Lisbon',
    'Atlantic/Madeira',
    'Atlantic/Azores',
    'Pacific/Palau',
    'America/Asuncion',
    'Asia/Qatar',
    'Indian/Reunion',
    'Europe/Bucharest',
    'Europe/Belgrade',
    'Europe/Kaliningrad',
    'Europe/Moscow',
    'Europe/Kirov',
    'Europe/Astrakhan',
    'Europe/Volgograd',
    'Europe/Saratov',
    'Europe/Ulyanovsk',
    'Europe/Samara',
    'Asia/Yekaterinburg',
    'Asia/Omsk',
    'Asia/Novosibirsk',
    'Asia/Barnaul',
    'Asia/Tomsk',
    'Asia/Novokuznetsk',
    'Asia/Krasnoyarsk',
    'Asia/Irkutsk',
    'Asia/Chita',
    'Asia/Yakutsk',
    'Asia/Khandyga',
    'Asia/Vladivostok',
    'Asia/Ust-Nera',
    'Asia/Magadan',
    'Asia/Sakhalin',
    'Asia/Srednekolymsk',
    'Asia/Kamchatka',
    'Asia/Anadyr',
    'Africa/Kigali',
    'Asia/Riyadh',
    'Pacific/Guadalcanal',
    'Indian/Mahe',
    'Africa/Khartoum',
    'Europe/Stockholm',
    'Asia/Singapore',
    'Atlantic/St_Helena',
    'Europe/Ljubljana',
    'Arctic/Longyearbyen',
    'Europe/Bratislava',
    'Africa/Freetown',
    'Europe/San_Marino',
    'Africa/Dakar',
    'Africa/Mogadishu',
    'America/Paramaribo',
    'Africa/Juba',
    'Africa/Sao_Tome',
    'America/El_Salvador',
    'America/Lower_Princes',
    'Asia/Damascus',
    'Africa/Mbabane',
    'America/Grand_Turk',
    'Africa/Ndjamena',
    'Indian/Kerguelen',
    'Africa/Lome',
    'Asia/Bangkok',
    'Asia/Dushanbe',
    'Pacific/Fakaofo',
    'Asia/Dili',
    'Asia/Ashgabat',
    'Africa/Tunis',
    'Pacific/Tongatapu',
    'Europe/Istanbul',
    'America/Port_of_Spain',
    'Pacific/Funafuti',
    'Asia/Taipei',
    'Africa/Dar_es_Salaam',
    'Europe/Simferopol',
    'Europe/Kiev',
    'Europe/Uzhgorod',
    'Europe/Zaporozhye',
    'Africa/Kampala',
    'Pacific/Midway',
    'Pacific/Wake',
    'America/New_York',
    'America/Detroit',
    'America/Kentucky/Louisville',
    'America/Kentucky/Monticello',
    'America/Indiana/Indianapolis',
    'America/Indiana/Vincennes',
    'America/Indiana/Winamac',
    'America/Indiana/Marengo',
    'America/Indiana/Petersburg',
    'America/Indiana/Vevay',
    'America/Chicago',
    'America/Indiana/Tell_City',
    'America/Indiana/Knox',
    'America/Menominee',
    'America/North_Dakota/Center',
    'America/North_Dakota/New_Salem',
    'America/North_Dakota/Beulah',
    'America/Denver',
    'America/Boise',
    'America/Phoenix',
    'America/Los_Angeles',
    'America/Anchorage',
    'America/Juneau',
    'America/Sitka',
    'America/Metlakatla',
    'America/Yakutat',
    'America/Nome',
    'America/Adak',
    'Pacific/Honolulu',
    'America/Montevideo',
    'Asia/Samarkand',
    'Asia/Tashkent',
    'Europe/Vatican',
    'America/St_Vincent',
    'America/Caracas',
    'America/Tortola',
    'America/St_Thomas',
    'Asia/Ho_Chi_Minh',
    'Pacific/Efate',
    'Pacific/Wallis',
    'Pacific/Apia',
    'Asia/Aden',
    'Indian/Mayotte',
    'Africa/Johannesburg',
    'Africa/Lusaka',
    'Africa/Harare',
  ],
  actions: {

    /* 
     * delete()
     *
     * Handle the action to delete a festival.
     */
    delete() {
      if (confirm('Are you sure?')) {
        this.festival.deleteRecord();
        this.festival.save();
      } else {
        return false;
      }
    },
    /* 
     * edit()
     *
     * Handle the action to edit a festival.
     */
    edit() {
      this.set('is_editing', true);
    },
    /* 
     * cancel()
     *
     * Handle the action to cancel editing a festival.
     */   
    cancel() {
      this.festival.rollbackAttributes();
      this.set('is_editing', false);
      this.set('file_is_loaded', false);
    },
    /* 
     * discard()
     *
     * Handle the action to discard creating a festival.
     */   
    discard() {
      if (confirm('Are you sure?')) {
        this.festival.deleteRecord();
        this.resetNewFestival();
      } else {
        return false;
      }
    },
    /* 
     * save()
     *
     * Save festival
     * 
     * resetNewFestival   boolean    Set to true to refresh the model and initialise new festival attributes
     */   
    save(resetNewFestival) {
      this.set('is_saving', true);
      var festival = this.festival;

      festival.set('content', this.content);
      festival.set('organisation', this.organisation);

      return festival
        .save()
        .then(() => {
          this.set('is_saving', false);
          this.set('file_is_loaded', false);
          if (resetNewFestival) {
            this.refreshModel();
          } else {
            this.set('is_editing', false);
            this.set('errors', null);
          }
        })
        .catch((response) => {
          this.set('is_saving', false);
          this.set('errors', response.errors);
        });
    },
    /* 
     * saveNew()
     *
     * Save a new festival
     */  
    saveNew() {
      this.send('save', true);
    },
    /* 
     * getFile()
     *
     * Handles the action to get a full export of the festival data in the provided
     * format type
     * 
     * type     str     The desired format (pdf, csv or xml)
     */ 
    getFile(type) {
      var self = this;
      let headers = {};

      self.set(`generating-${type}`, true);

      if (this.get('session.isAuthenticated')) {
        headers[
          'Authorization'
        ] = `Token user_token="${this.session.data.authenticated.user_token}", user_email="${this.session.data.authenticated.user_email}"`;
      }

      return axios.get(
        `${ENV.APP['options']['apiURL']}/festivals/${this.festival.id}/as_${type}.${type}`,
        {
          headers,
        }
      ).then((response)=>{
        self.set(`generating-${type}`, false);
        self.set(`${type}-url`, response.data.filename);
      })
      .catch(function (response) {
        console.log(response);
        self.set(`generating-${type}`, false);
      });
    },
  },
});
