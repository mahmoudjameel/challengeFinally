
import I18n from '../screens/Translation/I18n';


const educationData = [
  { key: 1, label: "متوسطة" },
  { key: 2, label: "الثانوية" },
  { key: 3, label: "بكالوريوس" },
  { key: 4, label: "ماجتسير" },
  { key: 5, label: "دكتوراة" },
];

// const friendsData = [
//   { key: 1, label:I18n.t('malesonly')},
//   { key: 2, label:I18n.t('only')},
//   { key: 3, label:I18n.t('both')},
// ];

const chatData = [
  { key: 1, label: "نعم" },
  { key: 2, label: "لا" },
];

const profileData = [
  { key: 1, label: I18n.t('All')},
  { key: 2, label: I18n.t('friendsonly')},
];

const searchFilter = [
  { key: 1, label: I18n.t('All')},
  { key: 2, label: I18n.t('WinnerChallenges')},
  { key: 3, label: I18n.t('loserchallenges')},
];

const typeData = [
  { key: 1, label: I18n.t('Technicalproblem')},
  { key: 2, label: I18n.t('Inquireabouttheinformation')},
];

const talentTime = [
  { key: 0, label: I18n.t('Immediately') },
  { key: 1, label: I18n.t('afterhour')},
  { key: 2, label: I18n.t('aftertwohours') },
  { key: 4, label: I18n.t('after4hours') },
  { key: 8, label: I18n.t('after8hours') },
  { key: 16, label: I18n.t('after16hours')  },
  { key: 24, label: I18n.t('after24hours')  },
];

const talentFilter = [
  { key: 0, label: I18n.t('All')  },
  { key: 1, label: I18n.t('public') },
  { key: 2, label: I18n.t('theathlete') },
  { key: 3, label:  I18n.t('cultural') },
  { key: 4, label: I18n.t('arts')},
  { key: 5, label: I18n.t('educational') },
  { key: 6, label: I18n.t('closedchallenges') },
  { key: 7, label: I18n.t('openchallenges') },
  { key: 8, label: I18n.t('FinishedChallenges')},
  { key: 9, label: I18n.t('yourchallenges') },
  { key: 10, label: I18n.t('Favorites') },
];

const talentSort = [
  { key: 1, label: I18n.t('latest') },
  { key: 2, label: I18n.t('toprated') },
  { key: 3, label: I18n.t('oldest') },
  { key: 4, label: I18n.t('lowestrated') },
];

const employeeType = [
  { key: 1, label: "دعم فني" },
  { key: 2, label: "مدير الاشتراكات" },
];

const months = [
  "يناير",
  "فبراير",
  "مارس",
  "إبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const days = ["اﻷحد", "اﻷثنين", "الثلاثاء", "اﻷربعاء", "الخميس", "الجمعة", "السبت"];

const countries = [
  {
    key: "00",
    label: "اخرى",
    cities: [{ key: "0", label: "اخرى" }],
  },
  {
  key: "kos",
  label: I18n.t('SouthKorea'),
  league: 419,
   cities: [
   {
   key: "1",
   label: "Seoul",
   },
  {
   key: "2",
   label: "Suwon",
   },
   {
   key: "3",
   label: "Ulsan",
   },
   {
   key: "4",
   label: "Sangju",
   },
   {
   key: "5",
   label: "Jeonju",
   },
  {
   key: "6",
   label: "Gwangju",
   },
   {
   key: "7",
   label: "Gimcheon",
   },
   {
   key: "8",
   label: "Jeonju",
   },
  {
  key: "9",
   label: "Ansan",
   },
   {
   key: "10",
   label: "Cheonan",
   },
   ],
   },
   {
    key: "MAN",
    label: I18n.t('worldCup'),
    league: 562,
     cities: [
     {
     key: "1",
     label: "ALL",
     },
     ],
     },
 

    {
  key: "SA",
      label: I18n.t('saudi'),
      league: 654,
      cities: [
      {
      key: "1",
      label: "الرياض",
      },
      {
      key: "2",
      label: "القصيم",
      },
      {
    key: "3",
    label: "مكة المكرمة",
    },
    {
    key: "4",
    label: "المدينة المنورة",
    },
    {
    key: "5",
    label: "حائل",
    },
    {
    key: "6",
    label: "الجوف",
    },
    {
    key: "7",
    label: "تبوك",
    },
    {
    key: "8",
    label: "الحدود الشمالية",
    },
    {
    key: "9",
    label: "عسير",
    },
    {
    key: "10",
    label: "جازان",
    },
    {
    key: "11",
    label: "نجران",
    },
    {
    key: "12",
    label: "الباحة",
    },
    {
    key: "13",
    label: "الشرقية",
    },
    ],
    },
  {
    key: "AE",
    label: I18n.t('Emirates'),
    league: 516,
  cities: [
  {
  key: "1",
  label: "أبو ظبي",
  },
  {
  key: "2",
  label: "عجمان",
  },
  {
  key: "3",
  label: "دبي",
  },
  {
  key: "4",
  label: "الفجيرة",
  },
  {
  key: "5",
  label: "رأس الخيمة",
  },
  {
  key: "6",
  label: "الشارقة",
  },
  {
  key: "7",
  label: "أم القيوين",
  },
  {
  key: "8",
  label: "الإمارات العربية المتحدة",
  },
  ],
  },
    {
    key: "BH",
    label: I18n.t('ALBahrayn'),
    league: 649,
 cities: [
 {
 key: "1",
 label: "العاصمة",
 },
 {
 key: "2",
 label: "المحرق",
 },
 {
 key: "3",
 label: "الشمالية",
 },
 {
 key: "4",
 label: "الجنوبية",
 },
 {
 key: "5",
 label: "البحرين",
 },
 ],
 },
  {
    key: "EG",
    label: I18n.t('Egypt'),
    league: 508,
  cities: [
  {
  key: "1",
  label: "الإسكندرية",
  },
  {
  key: "2",
  label: "الإسماعيلية",
  },
  {
  key: "3",
  label: "أسوان",
  },
  {
  key: "4",
  label: "أسيوط",
  },
  {
  key: "5",
  label: "الأقصر",
  },
  {
  key: "6",
  label: "البحر الأحمر",
  },
  {
  key: "7",
  label: "البحيرة",
  },
  {
  key: "8",
  label: "بني سويف",
  },
  {
  key: "9",
  label: "بور سعيد",
  },
  {
  key: "10",
  label: "جنوب سيناء",
  },
  {
  key: "11",
  label: "الجيزة",
  },
  {
  key: "12",
  label: "الدقهلية",
  },
  {
  key: "13",
  label: "دمياط",
  },
  {
  key: "14",
  label: "سوهاج",
  },
  {
  key: "15",
  label: "السويس",
  },
  {
  key: "16",
  label: "الشرقية",
  },
  {
  key: "17",
  label: "شمال سيناء",
  },
  {
  key: "18",
  label: "الغربية",
  },
  {
  key: "19",
  label: "الفيوم",
  },
  {
  key: "20",
  label: "القاهرة",
  },
  {
  key: "21",
  label: "القليوبية",
  },
  {
  key: "22",
  label: "قنا",
  },
  {
  key: "23",
  label: "كفر الشيخ",
  },
  {
  key: "24",
  label: "مطروح",
  },
  {
  key: "25",
  label: "المنوفية",
  },
  {
  key: "26",
  label: "المنيا",
  },
  {
  key: "27",
  label: "الوادي الجديد",
  },
  ],
  },
{
 key: "SY",
    label: I18n.t('Syrian'),
    league: 313,
 cities: [
 {
 key: "1",
 label: "الحسكة",
 },
{
 key: "2",
 label: "دير الزور",
 },
 {
 key: "3",
 label: "الرقة",
 },
 {
 key: "4",
 label: "حلب",
 },
 {
 key: "5",
 label: "إدلب",
 },
{
 key: "6",
 label: "اللاذقية",
 },
 {
 key: "7",
 label: "طرطوس",
 },
 {
 key: "8",
 label: "حماة",
 },
{
key: "9",
 label: "دمشق",
 },
 {
 key: "10",
 label: "درعا",
 },
 {
 key: "11",
 label: "حمص",
 },
 ],
 },
  {
    key: "DZ",
    label: I18n.t('Algeria'),
    league: 671,
  cities: [
  {
  key: "1",
  label: "أدرار",
  },
  {
  key: "2",
  label: "الشلف",
  },
  {
  key: "3",
  label: "الأغواط",
  },
  {
  key: "4",
  label: "أم البواقي",
  },
  {
  key: "5",
  label: "ولاية باتنة",
  },
  {
  key: "6",
  label: "ولاية بجاية",
  },
  {
  key: "7",
  label: "ولاية بسكرة",
  },
  {
  key: "8",
  label: "ولاية بشار",
  },
  {
  key: "9",
  label: "ولاية البليدة",
  },
  {
  key: "10",
  label: "البويرة",
  },
  {
  key: "11",
  label: "تمنراست",
  },
  {
  key: "12",
  label: "ولاية تبسة",
  },
  {
  key: "13",
  label: "تلمسان",
  },
  {
  key: "14",
  label: "تيارت",
  },
  {
  key: "15",
  label: "تيزي وزو",
  },
  {
  key: "16",
  label: "الجزائر",
  },
  {
  key: "17",
  label: "ولاية الجلفة",
  },
  {
  key: "18",
  label: "ولاية جيجل",
  },
  {
  key: "19",
  label: "ولاية سطيف",
  },
  {
  key: "20",
  label: "ولاية سعيدة",
  },
  {
  key: "21",
  label: "سكيكدة",
  },
  {
  key: "22",
  label: "سيدي بلعباس",
  },
  {
  key: "23",
  label: "ولاية عنابة",
  },
  {
  key: "24",
  label: "ولاية قالمة",
  },
  {
  key: "25",
  label: "قسنطينة",
  },
  {
  key: "26",
  label: "ولاية المدية",
  },
  {
  key: "27",
  label: "مستغانم",
  },
  {
  key: "28",
  label: "المسيلة",
  },
  {
  key: "29",
  label: "معسكر",
  },
  {
  key: "30",
  label: "ورقلة",
  },
  {
  key: "31",
  label: "وهران",
  },
  {
  key: "32",
  label: "البيض",
  },
  {
  key: "33",
  label: "إليزي",
  },
  {
  key: "34",
  label: "ولاية برج بوعريريج",
  },
  {
  key: "35",
  label: "بومرداس",
  },
  {
  key: "36",
  label: "الطارف",
  },
  {
  key: "37",
  label: "تندوف",
  },
  {
  key: "38",
  label: "تسمسيلت",
  },
  {
  key: "39",
  label: "الوادي",
  },
  {
  key: "40",
  label: "خنشلة",
  },
  {
  key: "41",
  label: "سوق أهراس",
  },
  {
  key: "42",
  label: "تيبازة",
  },
  {
  key: "43",
  label: "ميلة",
  },
  {
  key: "44",
  label: "عين الدفلى",
  },
  {
  key: "45",
  label: "النعامة",
  },
  {
  key: "46",
  label: "عين تموشنت",
  },
  {
  key: "47",
  label: "غرداية",
  },
  {
  key: "48",
  label: "غليزان",
  },
  ],
  },
  {
    key: "JO",
    label: I18n.t('Jordan'),
    league: 503,
  cities: [
  {
  key: "1",
  label: "العاصمة",
  },
  {
  key: "2",
  label: "إربد",
  },
  {
  key: "3",
  label: "البلقاء",
  },
  {
  key: "4",
  label: "الكرك",
  },
  {
  key: "5",
  label: "معان",
  },
  {
  key: "6",
  label: "الزرقاء",
  },
  {
  key: "7",
  label: "المفرق",
  },
  {
  key: "8",
  label: "الطفيلة",
  },
  {
  key: "9",
  label: "مادبا",
  },
  {
  key: "10",
  label: "جرش",
  },
  {
  key: "11",
  label: "عجلون",
  },
  {
  key: "12",
  label: "العقبة",
  },
  {
  key: "13",
  label: "عمان",
  },
  ],
  },
  {
    key: "KW",
    label: I18n.t('Kuwait'),
    league: 220,
  cities: [
  {
  key: "1",
  label: "العاصمة",
  },
  {
  key: "2",
  label: "حولي",
  },
  {
  key: "3",
  label: "الأحمدي",
  },
  {
  key: "4",
  label: "الجهراء",
  },
  {
  key: "5",
  label: "الفروانية",
  },
  {
  key: "6",
  label: "مبارك الكبير",
  },
  {
  key: "7",
  label: "الكويت",
  },
  ],
  },
  {
    key: "LB",
    label: I18n.t('Lebanon'),
    league: 224,
 cities: [
 {
 key: "1",
 label: "بيروت",
 },
 {
 key: "2",
 label: "جبل لبنان",
 },
 {
 key: "3",
 label: "لبنان الشمالية",
 },
 {
 key: "4",
 label: "لبنان الجنوبية",
 },
 {
 key: "5",
 label: "البقاع",
 },
 {
 key: "6",
 label: "النبطية",
 },
 {
 key: "7",
 label: "بعلبك ",
 },
 {
 key: "8",
 label: "عكار",
 },
 ],
 },
  {
    key: "MA",
    label: I18n.t('Morocco'),
    league: 411,
  cities: [
  {
  key: "1",
  label: "طنجة تطوان الحسيمة",
  },
  {
  key: "2",
  label: "الشرق",
  },
  {
  key: "3",
  label: "فاس مكناس",
  },
  {
  key: "4",
  label: "الرباط سلا القنيطرة",
  },
  {
  key: "5",
  label: "بني ملال خنيفرة",
  },
  {
  key: "6",
  label: "الدار البيضاء سطات",
  },
  {
  key: "7",
  label: "مراكش",
  },
  {
  key: "8",
  label: "درعة تافيلالت",
  },
  {
  key: "9",
  label: "سوس ماسة",
  },
  {
  key: "10",
  label: "كلميم واد نون",
  },
  {
  key: "11",
  label: "العيون الساقية الحمراء",
  },
  {
  key: "12",
  label: "الداخلة وادي الذهب",
  },
  {
  key: "13",
  label: "الرباط",
  },
  {
  key: "14",
  label: "أقادير",
  },
  ],
  },
  {
    key: "OM",
    label: I18n.t('Omman'),
    league: 513,
  cities: [
  {
  key: "1",
  label: "الداخلية",
  },
  {
  key: "2",
  label: "جنوب الباطنة",
  },
  {
  key: "3",
  label: "شمال الباطنة",
  },
  {
  key: "4",
  label: "شمال الشرقية",
  },
  {
  key: "5",
  label: "جنوب الشرقية",
  },
  {
  key: "6",
  label: "الظاهرة",
  },
  {
  key: "7",
  label: "مسقط",
  },
  {
  key: "8",
  label: "مسندم",
  },
  {
  key: "9",
  label: "ظفار",
  },
  {
  key: "10",
  label: "البريمي",
  },
  {
  key: "11",
  label: "سلطنة عمان",
  },
  ],
  },
  {
    key: "IQ",
    label: I18n.t('Iraq'),
    league: 495,
  cities: [
  {
  key: "1",
  label: "الأنبار",
  },
  {
  key: "2",
  label: "بابل",
  },
  {
  key: "3",
  label: "بغداد",
  },
  {
  key: "4",
  label: "البصرة",
  },
  {
  key: "5",
  label: "ديالى",
  },
  {
  key: "6",
  label: "كربلاء",
  },
  {
  key: "7",
  label: "دهوك",
  },
  {
  key: "8",
  label: "كركوك",
  },
  {
  key: "9",
  label: "ميسان",
  },
  {
  key: "10",
  label: "المثنى",
  },
  {
  key: "11",
  label: "أربيل",
  },
  {
  key: "12",
  label: "النجف",
  },
  {
  key: "13",
  label: "نينوى",
  },
  {
  key: "14",
  label: "القادسية",
  },
  {
  key: "15",
  label: "صلاح الدين",
  },
  {
  key: "16",
  label: "حلبجة",
  },
  {
  key: "17",
  label: "ذي قار",
  },
  {
  key: "18",
  label: "واسط",
  },
  ],
  },
  {
    key: "QA",
    label: I18n.t('Qatar'),
    league: 647,
 cities: [
 {
 key: "1",
 label: "الشمال",
 },
 {
 key: "2",
 label: "الخور",
 },
 {
 key: "3",
 label: "الشحانية",
 },
 {
 key: "4",
 label: "أم صلال",
 },
 {
 key: "5",
 label: "الضعاين",
 },
 {
 key: "6",
 label: "الدوحة",
 },
 {
 key: "7",
 label: "الريان",
 },
 {
 key: "8",
 label: "الوكرة",
 },
 {
 key: "9",
 label: "قطر",
 },
 ],
 },
  {
    key: "TN",
    label: I18n.t('Tunis'),
    league: 317,
  cities: [
  {
  key: "1",
  label: "أريانة",
  },
  {
  key: "2",
  label: "باجة",
  },
  {
  key: "3",
  label: "بنزرت",
  },
  {
  key: "4",
  label: "بن عروس",
  },
  {
  key: "5",
  label: "تطاوين",
  },
  {
  key: "6",
  label: "توزر",
  },
  {
  key: "7",
  label: "تونس",
  },
  {
  key: "8",
  label: "جندوبة",
  },
  {
  key: "9",
  label: "زغوان",
  },
  {
  key: "10",
  label: "سليانة",
  },
  {
  key: "11",
  label: "سوسة",
  },
  {
  key: "12",
  label: "سيدي بوزيد",
  },
  {
  key: "13",
  label: "صفاقس",
  },
  {
  key: "14",
  label: "قابس",
  },
  {
  key: "15",
  label: "قبلي",
  },
  {
  key: "16",
  label: "القصرين",
  },
  {
  key: "17",
  label: "قفصة",
  },
  {
  key: "18",
  label: "القيروان",
  },
  {
  key: "19",
  label: "الكاف",
  },
  {
  key: "20",
  label: "مدنين",
  },
  {
  key: "21",
  label: "المنستير",
  },
  {
  key: "22",
  label: "منوبة",
  },
  {
  key: "23",
  label: "المهدية",
  },
  {
  key: "24",
  label: "نابل",
  },
  ],
  },
  {
    key: "PS",
    label: I18n.t('Palestine'),
    league: 617,
  cities: [
  {
  key: "1",
  label: "القدس",
  },
  {
  key: "2",
  label: "بيت لحم",
  },
  {
  key: "3",
  label: "الخليل",
  },
  {
  key: "4",
  label: "رام الله والبيرة",
  },
  {
  key: "5",
  label: "نابلس",
  },
  {
  key: "6",
  label: "سلفيت",
  },
  {
  key: "7",
  label: "قلقيلية",
  },
  {
  key: "8",
  label: "طولكرم",
  },
  ,
  {
  key: "9",
  label: "طوباس",
  },
  ,
  {
  key: "10",
  label: "جنين",
  },
  ,
  {
  key: "11",
  label: "اريحا",
  },
  ,
  {
  key: "12",
  label: "غزة",
  },
  ,
  {
  key: "13",
  label: "بيت حنون",
  },
  ,
  {
  key: "14",
  label: "بيت لاهيا",
  },
  ,
  {
  key: "15",
  label: "دير البلح",
  },
  ,
  {
  key: "16",
  label: "خان يونس",
  },
  ,
  {
  key: "17",
  label: "رفح",
  },

  ],
  },
  {
      key: "sdn",
      label: I18n.t('SUDAN'),
      league: 303,
       cities: [
       {
       key: "1",
       label: "ALL",
       },
       ],
      },
  {
    key: "TR",
    label: I18n.t('Turkia'),
    league: 318,
  cities: [
  {
  key: "1",
  label: "أضنة",
  },
  {
  key: "2",
  label: "أديامان",
  },
  {
  key: "3",
  label: "أغري",
  },
  {
  key: "4",
  label: "أماصيا",
  },
  {
  key: "5",
  label: "أنقرة",
  },
  {
  key: "6",
  label: "أنطاليا",
  },
  {
  key: "7",
  label: "أرتڤين",
  },
  {
  key: "8",
  label: "أيدين",
  },
  {
  key: "9",
  label: "بورصة",
  },
  {
  key: "10",
  label: "چنق ‌قلعه",
  },
  {
  key: "11",
  label: "دنيزلي",
  },
  {
  key: "12",
  label: "ديار بكر",
  },
  {
  key: "13",
  label: "أرض‌روم",
  },
  {
  key: "14",
  label: "إسكي‌ شهر",
  },
  {
  key: "15",
  label: "مرسين",
  },
  {
  key: "16",
  label: "إسطنبول",
  },
  {
  key: "17",
  label: "إزمير",
  },
  {
  key: "18",
  label: "قارص",
  },
  {
  key: "19",
  label: "كاستامونو",
  },
  {
  key: "20",
  label: "قيصرية",
  },
  {
  key: "21",
  label: "قونية",
  },
  {
  key: "22",
  label: "كوتاهيا",
  },
  {
  key: "23",
  label: "سيڤاس",
  },
  {
  key: "24",
  label: "طرابزون",
  },
  {
  key: "25",
  label: "عشاق",
  },
  {
  key: "26",
  label: "ڤان",
  },
  {
  key: "27",
  label: "يوزگات",
  },
  {
  key: "28",
  label: "عثمانية",
  },
  {
  key: "29",
  label: "أرض‌خان",
  },
  {
  key: "30",
  label: "تركيا",
  },
  ],
  },
  {
    key: "ES",
    label: I18n.t('Spain'),
    league: 302,
 cities: [
 {
 key: "1",
 label: "Aragón",
 },
 {
 key: "2",
 label: "Asturias",
 },
 {
 key: "3",
 label: "Andalucía",
 },
 {
 key: "4",
 label: "País Vasco",
 },
 {
 key: "5",
 label: "Extremadura",
 },
 {
 key: "6",
 label: "Valenciana",
 },
 {
 key: "7",
 label: "Islas Baleares",
 },
 {
 key: "8",
 label: "Canarias",
 },
 {
 key: "9",
 label: "Galicia",
 },
 {
 key: "10",
 label: "Castilla y León",
 },
 {
 key: "11",
 label: "Castilla-La Mancha",
 },
 {
 key: "12",
 label: "Cantabria",
 },
 {
 key: "13",
 label: "Cataluña",
 },
 {
 key: "14",
 label: "La Rioja",
 },
 {
 key: "15",
 label: "Madrid",
 },
 {
 key: "16",
 label: "Murcia",
 },
 {
 key: "17",
 label: "Navarra",
 },
 ],
 },
  {
    key: "GB",
    label: I18n.t('Unitedkingdom'),
    league: 152,
  cities: [
  {
  key: "1",
  label: "London",
  },
  {
  key: "2",
  label: "Manchester",
  },
  {
  key: "3",
  label: "Liverpool",
  },
  {
  key: "4",
  label: "Newcastle",
  },
  {
  key: "5",
  label: "Birmingham",
  },
  {
  key: "6",
  label: "Oxford",
  },
  {
  key: "7",
  label: "Cambridge",
  },
  {
  key: "8",
  label: "Lake District",
  },
  {
  key: "9",
  label: "Cotswolds",
  },
  {
  key: "10",
  label: "Stonehenge",
  },
  {
  key: "11",
  label: "Bristol",
  },
  {
  key: "12",
  label: "Bath",
  },
  {
  key: "13",
  label: "Snowdonia",
  },
  ],
  },
{
 key: "EY",
    label: I18n.t('Italia'),
    league: 205,
 cities: [
 {
 key: "1",
 label: "Roma",
 },
{
 key: "2",
 label: "Milano",
 },
 {
 key: "3",
 label: "Napoli",
 },
 {
 key: "4",
 label: "Torino",
 },
 {
 key: "5",
 label: "Firenze",
 },
{
 key: "6",
 label: "Catania",
 },
 {
 key: "7",
 label: "Trieste",
 },
 {
 key: "8",
 label: "Palermo",
 },
{
key: "9",
 label: "Bologna",
 },
 {
 key: "10",
 label: "Genova",
 },
 {
 key: "11",
 label: "Verona",
 },
 ],
 },
  {
    key: "DE",
    label: I18n.t('Germany'),
    league: 175,
  cities: [
  {
  key: "1",
  label: "Berlin",
  },
  {
  key: "2",
  label: "Munich",
  },
  {
  key: "3",
  label: "Frankfurt",
  },
  {
  key: "4",
  label: "Stuttgart",
  },
  {
  key: "5",
  label: "Garmisch",
  },
  {
  key: "6",
  label: "Düsseldorf",
  },
  {
  key: "7",
  label: "Baden-Baden",
  },
  {
  key: "8",
  label: "Hamburg",
  },
  {
  key: "9",
  label: "Cologne",
  },
  {
  key: "10",
  label: "Heidelberg",
  },
  {
  key: "11",
  label: "Bonn",
  },
  {
  key: "12",
  label: "Hanover",
  },
  {
  key: "13",
  label: "Dortmund",
  },
  {
  key: "14",
  label: "Leipzig",
  },
  {
  key: "15",
  label: "Potsdam",
  },
  ],
  },

  {
    key: "BR",
   label: I18n.t('Brazil'),
    league: 75,
  cities: [
  {
  key: "1",
  label: "Sao Paulo",
  },
  {
  key: "2",
  label: "Salvador",
  },
  {
  key: "3",
  label: "Recife",
  },
  {
  key: "4",
  label: "Buzios",
  },
  {
  key: "5",
  label: "Brasilia",
  },
  {
  key: "6",
  label: "Belem",
  },
  {
  key: "7",
  label: "Manaus",
  },
  {
  key: "8",
  label: "Curitiba",
  },
  {
  key: "9",
  label: "Belo Horizonte",
  },
  {
  key: "10",
  label: "Fortaleza",
  },
  ],
  },
{
    key: "AR",
    label: I18n.t('Argentina'),
    league: 662,
  cities: [
  {
  key: "1",
  label: "Buenos Aires",
  },
  {
  key: "2",
  label: "Buenos Aires",
  },
  {
  key: "3",
  label: "Catamarca",
  },
  {
  key: "4",
  label: "Chaco",
  },
  {
  key: "5",
  label: "Corrientes",
  },
  {
  key: "6",
  label: "Entre Ríos",
  },
  {
  key: "7",
  label: "La Pampa",
  },
  {
  key: "8",
  label: "Misiones",
  },
  {
  key: "9",
  label: "Salta",
 },
  ],
  },

{
    key: "RU",
    label: I18n.t('Russia'),
    league: 344,
  cities: [
  {
  key: "1",
  label: "Абакан",
  },
  {
  key: "2",
  label: "Москва",
  },
  {
  key: "3",
  label: "Мосальск",
  },
  {
  key: "4",
  label: "Можайск",
  },
  {
  key: "5",
  label: "Можга",
  },
  {
  key: "6",
  label: "Корсаков",
  },
  {
  key: "7",
  label: "Кинешма",
  },
  {
  key: "8",
  label: "Гагарин",
  },
  {
  key: "9",
  label: "Братск",
 },
  ],
  },
  {
    key: "MX",
    label: I18n.t('Mexico'),
    league: 521,
  cities: [
  {
  key: "1",
  label: "Mexico",
  },
  {
  key: "2",
  label: "Tijuana",
  },
  {
  key: "3",
  label: "Ecatepec",
  },
  {
  key: "4",
  label: "León",
  },
  {
  key: "5",
  label: "Puebla",
  },
  {
  key: "6",
  label: "Ciudad Juárez",
  },
  {
  key: "7",
  label: "Guadalajara",
  },
  {
  key: "8",
  label: "Zapopan",
  },
  {
  key: "9",
  label: "Monterrey",
  },
  {
  key: "10",
  label: "Chihuahua",
  },
  {
  key: "11",
  label: "Mérida",
  },
  {
  key: "12",
  label: "Saltillo",
  },
  {
  key: "13",
  label: "Cancún",
  },
  {
  key: "14",
  label: "Saltillo",
  },
  {
  key: "15",
  label: "Aguascalientes",
  },
  {
  key: "16",
  label: "Hermosillo",
  },
  {
  key: "17",
  label: "Mexicali",
  },
  {
  key: "18",
  label: "Culiacán",
  },
  {
  key: "19",
  label: "Querétaro",
  },
  {
  key: "20",
  label: "Morelia",
  },
  {
  key: "21",
  label: "Chimalhuacán",
  },
  {
  key: "22",
  label: "Reynosa",
  },
  {
  key: "23",
  label: "Durango",
  },
  {
  key: "24",
  label: "Tuxtla Gutiérrez",
  },
  {
  key: "25",
  label: "Veracruz",
  },
  {
  key: "26",
  label: "Ciudad Apodaca",
  },
  {
  key: "27",
  label: "Matamoros",
  },
  ],
  },
  {
    key: "CH",
    label: I18n.t('Switzerland'),
    league: 308,
  cities: [
  {
  key: "1",
  label: "Zürich",
  },
  {
  key: "2",
  label: "Geneva",
  },
  {
  key: "3",
  label: "Basel",
  },
  {
  key: "4",
  label: "Lausanne",
  },
  {
  key: "5",
  label: "Bern",
  },
  {
  key: "6",
  label: "Winterthur",
  },
  {
  key: "7",
  label: "Lucerne",
  },
  {
  key: "8",
  label: "St. Gallen",
  },
  {
  key: "9",
  label: "Lugano",
  },
  {
  key: "10",
  label: "Thun",
  },
  {
  key: "11",
  label: "Bellinzona",
  },
  {
  key: "12",
  label: "Fribourg",
  },
  {
  key: "13",
  label: "Schaffhausen",
  },
  ],
  },
  {
    key: "CO",
    label: I18n.t('Colombia'),
    league: 517,
  cities: [
  {
  key: "1",
  label: "Cartagena",
  },
  {
  key: "2",
  label: "Medellin",
  },
  {
  key: "3",
  label: "Eje Cafetero",
  },
  {
  key: "4",
  label: "Leticia",
  },
  {
  key: "5",
  label: "Bogotá",
  },
  {
  key: "6",
  label: "The Lost City",
  },
  {
  key: "7",
  label: "Providencia Island",
  },
  {
  key: "8",
  label: "Hacienda Nápoles",
  },
  {
  key: "9",
  label: "Orinoquía",
  },
  ],
  },
  {
    key: "DK",
    label: I18n.t('Denmark'),
    league: 135,
  cities: [
  {
  key: "1",
  label: "København",
  },
  {
  key: "2",
  label: "Skagen",
  },
  {
  key: "3",
  label: "Ribe",
  },
  {
  key: "4",
  label: "Dragør",
  },
  {
  key: "5",
  label: "Ærøskøbing",
  },
  {
  key: "6",
  label: "Hornbæk",
  },
  {
  key: "7",
  label: "Ebeltoft",
  },
  {
  key: "8",
  label: "Sorø",
  },
  {
  key: "9",
  label: "Maribo",
  },
  {
  key: "10",
  label: "Svaneke",
  },
  {
  key: "11",
  label: "Mariager",
  },
  ],
  },
  {
    key: "FR",
    label: I18n.t('France'),
    league: 165,
cities: [
{
key: "1",
label: "Paris",
},
{
key: "2",
label: "Marseille",
},
{
key: "3",
label: "Lyon",
},
{
key: "4",
label: "Toulouse",
},
{
key: "5",
label: "Latifa",
},
{
key: "6",
label: "Nantes",
},
{
key: "7",
label: "Strasbourg",
},
{
key: "8",
label: "Montpellier",
},
{
key: "9",
label: "Bordeaux",
},
{
key: "10",
label: "Lille",
},
{
key: "11",
label: "Versailles",
},
{
key: "12",
label: "Caen",
},
{
key: "13",
label: "Valance",
},
],
},
{
    key: "AU",
    label: I18n.t('Australia'),
    league: 713,
  cities: [
  {
  key: "1",
  label: "New South Wales",
  },
  {
  key: "2",
  label: "Queensland",
  },
  {
  key: "3",
  label: "South Australia",
  },
  {
  key: "4",
  label: "Tasmania",
  },
  {
  key: "5",
  label: "Victoria",
  },
  {
  key: "6",
  label: "Western Australia",
  },
  ],
  },
{
    key: "SD",
    label: I18n.t('Sweden'),
    league: 306,
  cities: [
  {
  key: "1",
  label: "Stockholm",
  },
  {
  key: "2",
  label: "Goeteborg",
  },
  {
  key: "3",
  label: "Malmoe",
  },
  {
  key: "4",
  label: "Uppsala",
  },
  {
  key: "5",
  label: "Sollentuna",
  },
  {
  key: "6",
  label: "OErebro",
  },
  ],
  },
{
    key: "SD",
    label: I18n.t('China'),
    league: 520,
  cities: [
  {
  key: "1",
  label: "上海",
  },
  {
  key: "2",
  label: "北京",
  },
  {
  key: "3",
  label: "香港",
  },
  {
  key: "4",
  label: "天津",
  },
  {
  key: "5",
  label: "武汉",
  },
  {
  key: "6",
  label: "齐齐哈尔",
  },
  ],
  },
  {
    key: "GR",
    label: I18n.t('Greece'),
    league: 179,
  cities: [
  {
  key: "1",
  label: "Athens",
  },
  {
  key: "2",
  label: "Thessaloniki",
  },
  {
  key: "3",
  label: "Patras",
  },
  {
  key: "4",
  label: "Piraeus",
  },
  {
  key: "5",
  label: "Larissa",
  },
  {
  key: "6",
  label: "Peristeri",
  },
  {
  key: "7",
  label: "Iraklion",
  },
  {
  key: "8",
  label: "Kallithea",
  },
  {
  key: "9",
  label: "Acharnes",
  },
  {
  key: "10",
  label: "Kalamaria",
  },
  ],
  },
  {
    key: "PT",
    label: I18n.t('Portugal'),
    league: 476,
  cities: [
  {
  key: "1",
  label: "Albufeira",
  },
  {
  key: "2",
  label: "Lisbonم",
  },
  {
  key: "3",
  label: "Porto",
  },
  {
  key: "4",
  label: "Funchal",
  },
  {
  key: "5",
  label: "Lagos",
  },
  {
  key: "6",
  label: "Qashkish",
  },
  {
  key: "7",
  label: "Portimao",
  },
  {
  key: "8",
  label: "Villa Nowa Dghaya",
  },
  {
  key: "9",
  label: "centra",
  },
  {
  key: "10",
  label: "Viana do Castelo",
  },
  ],
  },
  {
    key: "US",
    label: I18n.t('USA'),
    league: 332,
  cities: [
  {
  key: "1",
  label: "New York",
  },
  {
  key: "2",
  label: "Los Angeles",
  },
  {
  key: "3",
  label: "Chicago",
  },
  {
  key: "4",
  label: "Houston",
  },
  {
  key: "5",
  label: "Phoenix",
  },
  {
  key: "6",
  label: "Philadelphia",
  },
  {
  key: "7",
  label: "San Antonio",
  },
  {
  key: "8",
  label: "San Diego",
  },
  {
  key: "9",
  label: "Dallas",
  },
  {
  key: "10",
  label: "San Jose",
  },
  {
  key: "11",
  label: "Austin",
  },
  {
  key: "12",
  label: "Fort Worth",
  },
  {
  key: "13",
  label: "Jacksonville",
  },
  {
  key: "14",
  label: "Columbus",
  },
  {
  key: "15",
  label: "Charlotte",
  },
  {
  key: "16",
  label: "San Francisco",
  },
  {
  key: "17",
  label: "Seattle",
  },
  {
  key: "18",
  label: "Denver",
  },
  {
  key: "19",
  label: "Washington",
  },
  {
  key: "20",
  label: "Boston",
  },
  {
  key: "21",
  label: "El Paso",
  },
  {
  key: "22",
  label: "Nashville",
  },
  {
  key: "23",
  label: "Atlanta",
  },
  {
  key: "24",
  label: "Fresno",
  },
  {
  key: "25",
  label: "Long Beach",
  },
  {
  key: "26",
  label: "Oakland",
  },
  {
  key: "27",
  label: "Honolulu",
  },
  ],
  },
  {
    key: "UY",
    label: I18n.t('purple'),
    league: 115,
  cities: [
  {
  key: "1",
  label: "Montevideo",
  },
  {
  key: "2",
  label: "Salto",
  },
  {
  key: "3",
  label: "Paysandu",
  },
  {
  key: "4",
  label: "Carmelo",
  },
  {
  key: "5",
  label: "choi",
  },
  {
  key: "6",
  label: "Cologne",
  },
  {
  key: "7",
  label: "Dorazno",
  },
  {
  key: "8",
  label: "Punta del Diablo",
  },
  {
  key: "9",
  label: "Periapolis",
  },
  {
  key: "10",
  label: "Punta del Este",
  },
  ],
  },
{
    key: "GH",
    label: I18n.t('Ghana'),
    league: 177,
 cities: [
 {
 key: "1",
 label: "Ahafo Region",
 },
 {
 key: "2",
 label: "Ashanti Region",
 },
 {
 key: "3",
 label: "Bono Region",
 },
 {
 key: "4",
 label: "Bono East Region",
 },
 {
 key: "5",
 label: "Central Region",
 },
{
 key: "6",
 label: "Eastern Region",
 },
 {
 key: "7",
 label: "Greater Accra Region",
 },
 {
 key: "8",
 label: "Northern Region",
 },
{
key: "9",
 label: "Upper",
 },
 {
 key: "10",
 label: "Volta Region",
 },
 {
 key: "11",
 label: "Western",
 },
 ],
 },
  {
    key: "IR",
    label: I18n.t('Iran'),
    league: 576,
  cities: [
  {
  key: "1",
  label: "أذربيجان الشرقية",
  },
  {
  key: "2",
  label: "أذربيجان الغربية",
  },
  {
  key: "3",
  label: "أردبيل",
  },
  {
  key: "4",
  label: "أصفهان",
  },
  {
  key: "5",
  label: "ألبرز",
  },
  {
  key: "6",
  label: "محافظة إيلام",
  },
  {
  key: "7",
  label: "بوشهر",
  },
  {
  key: "8",
  label: "طهران",
  },
  {
  key: "9",
  label: "تشهارمحال وبختیاري",
  },
  {
  key: "10",
  label: "خراسان الجنوبية",
  },
  {
  key: "11",
  label: "خراسان رضوي",
  },
  {
  key: "12",
  label: "خراسان شمالي",
  },
  {
  key: "13",
  label: "محافظة خوزستان",
  },
  {
  key: "14",
  label: "زنجان",
  },
  {
  key: "15",
  label: "سمنان",
  },
  {
  key: "16",
  label: "سيستان وبلوتشستان",
  },
  {
  key: "17",
  label: "فارس",
  },
  {
  key: "18",
  label: "قزوين",
  },
  {
  key: "19",
  label: "قم",
  },
  {
  key: "20",
  label: "كردستان",
  },
  {
  key: "21",
  label: "كرمان",
  },
  {
  key: "22",
  label: "كرمانشاه",
  },
  {
  key: "23",
  label: "كهكیلویه وبویر أحمد",
  },
  {
  key: "24",
  label: "غلستان",
  },
  {
  key: "25",
  label: "غيلان",
  },
  {
  key: "26",
  label: "لرستان",
  },
  {
  key: "27",
  label: "مازندران",
  },
  {
  key: "28",
  label: "مركزي",
  },
  {
  key: "29",
  label: "هرمزغان",
  },
  {
  key: "30",
  label: "همدان",
  },
  {
  key: "31",
  label: "يزد",
  },
  ],
  },
{
key: "MZ",
label: I18n.t('Malaysia'),
league: 591,
 cities: [
 {
 key: "1",
 label: "Malaysia",
 },
 ],
 },
{
key: "MAN",
label: I18n.t('Albania'),
league: 31,
 cities: [
 {
 key: "1",
 label: "Berat",
 },
{
 key: "2",
 label: "Dibër",
 },
 {
 key: "3",
 label: "Durrës",
 },
 {
 key: "4",
 label: "Elbasan",
 },
 {
 key: "5",
 label: "Fier",
 },
{
 key: "6",
 label: "Gjirokastër",
 },
 {
 key: "7",
 label: "Korçë",
 },
 {
 key: "8",
 label: "Kukës",
 },
{
key: "9",
 label: "Lezhë",
 },
 {
 key: "10",
 label: "Shkodër",
 },
 {
 key: "11",
 label: "Tirana",
 },
 ],
 },
{
key: "CF",
label: I18n.t('SouthAfrica'),
league: 531,
 cities: [
 {
 key: "1",
 label: "Port Elizabeth",
 },
{
 key: "2",
 label: "Bloemfontein",
 },
 {
 key: "3",
 label: "Johannesburg",
 },
 {
 key: "4",
 label: "Durban",
 },
 {
 key: "5",
 label: "Polokwane",
 },
{
 key: "6",
 label: "Mbombela",
 },
 {
 key: "7",
 label: "Klerksdorp",
 },
 {
 key: "8",
 label: "Kimberley",
 },
{
key: "9",
 label: "Cape Town",
 },
 {
 key: "10",
 label: "Johannesburg",
 },
 ],
 },
{
key: "ML",
label: I18n.t('Malawi'),
league: 564,
 cities: [
 {
 key: "1",
 label: "Malawi",
 },
 ],
 },
{
key: "NL",
label: I18n.t('Holland'),
league: 584,
 cities: [
 {
 key: "1",
 label: "Amsterdam",
 },
{
 key: "2",
 label: "Rotterdam",
 },
 {
 key: "3",
 label: "Utrecht",
 },
 {
 key: "4",
 label: "Eindhoven",
 },
 ],
 },
 {
  key: "NL",
  label: I18n.t('Ireland'),
  league: 507,

   },
 {
 key: "PH",
    label: I18n.t('Philippines'),
    league: 696,
  cities: [
  {
  key: "1",
  label: "Manila",
  },
  {
  key: "2",
  label: "Davao City",
  },
  {
  key: "3",
  label: "Caloocan",
  },
  {
  key: "4",
  label: "Taguig",
  },
  {
  key: "5",
  label: "Pasig",
  },
  {
  key: "6",
  label: "Cagayan de Oro",
  },
  {
  key: "7",
  label: "Quezon City",
  },
  ],
  },
{
key: "PK",
label: I18n.t('Belgium'),
league: 64,
 cities: [
 {
 key: "1",
 label: "Alost",
 },
{
 key: "2",
 label: "Andenne",
 },
 {
 key: "3",
 label: "Bilzen",
 },
 {
 key: "4",
 label: "Couvin",
 },
 ],
 },
{
key: "OZ",
label: I18n.t('OwzBakistan'),
league: 335,
 cities: [
 {
 key: "1",
 label: "Bukhara",
 },
{
 key: "2",
 label: "Kyzylkum",
 },
 {
 key: "3",
 label: "Tashkent",
 },
 {
 key: "4",
 label: "Samarkand",
 },
 ],
 },
{
key: "SL",
label: I18n.t('CoteDIvoire'),
league: 123,
 cities: [
 {
 key: "1",
 label: "Sassandra",
 },
{
 key: "2",
 label: "Soubré",
 },
 {
 key: "3",
 label: "Abengourou",
 },
 {
 key: "4",
 label: "Minignan",
 },
 ],
 },
 {
  key: "MAN",
  label: I18n.t('ArabTeams'),
  league: 684,
   cities: [
   {
   key: "1",
   label: "ALL",
   },
   ],
  },
  {
    key: "MAN",
    label: I18n.t('EuropeanTeams'),
    league: 354,
     cities: [
     {
     key: "1",
     label: "ALL",
     },
     ],
    },
  {
    key: "WMAN",
    label: I18n.t('WomensTeams'),
    league: 440,
     cities: [
     {
     key: "1",
     label: "ALL",
     },
     ],
    },
{
key: "kos",
label: I18n.t('SouthKorea'),
league: 419,
 cities: [
 {
 key: "1",
 label: "Seoul",
 },
{
 key: "2",
 label: "Suwon",
 },
 {
 key: "3",
 label: "Ulsan",
 },
 {
 key: "4",
 label: "Sangju",
 },
 {
 key: "5",
 label: "Jeonju",
 },
{
 key: "6",
 label: "Gwangju",
 },
 {
 key: "7",
 label: "Gimcheon",
 },
 {
 key: "8",
 label: "Jeonju",
 },
{
key: "9",
 label: "Ansan",
 },
 {
 key: "10",
 label: "Cheonan",
 },
 ],
 },

];

const countriesDropdown = [
  {
    id: "ALL",
    name: I18n.t('All') ,
  },
  {
    id: "AD",
    name: "أندورا",
  },
  {
    id: "AE",
    name: "الامارات العربية المتحدة",
  },
  {
    id: "AF",
    name: "أفغانستان",
  },
  {
    id: "AG",
    name: "أنتيجوا وبربودا",
  },
  {
    id: "AI",
    name: "أنجويلا",
  },
  {
    id: "AL",
    name: "ألبانيا",
  },
  {
    id: "AM",
    name: "أرمينيا",
  },
  {
    id: "AO",
    name: "أنجولا",
  },
  {
    id: "AQ",
    name: "القطب الجنوبي",
  },
  {
    id: "AR",
    name: "الأرجنتين",
  },
  {
    id: "AS",
    name: "ساموا الأمريكية",
  },
  {
    id: "AT",
    name: "النمسا",
  },
  {
    id: "AU",
    name: "أستراليا",
  },
  {
    id: "AW",
    name: "آروبا",
  },
  {
    id: "AX",
    name: "جزر أولان",
  },
  {
    id: "AZ",
    name: "أذربيجان",
  },
  {
    id: "BA",
    name: "البوسنة والهرسك",
  },
  {
    id: "BB",
    name: "بربادوس",
  },
  {
    id: "BD",
    name: "بنجلاديش",
  },
  {
    id: "BE",
    name: "بلجيكا",
  },
  {
    id: "BF",
    name: "بوركينا فاسو",
  },
  {
    id: "BG",
    name: "بلغاريا",
  },
  {
    id: "BH",
    name: "البحرين",
  },
  {
    id: "BI",
    name: "بوروندي",
  },
  {
    id: "BJ",
    name: "بنين",
  },
  {
    id: "BL",
    name: "سان بارتيلمي",
  },
  {
    id: "BM",
    name: "برمودا",
  },
  {
    id: "BN",
    name: "بروناي",
  },
  {
    id: "BO",
    name: "بوليفيا",
  },
  {
    id: "BQ",
    name: "بونير",
  },
  {
    id: "BR",
    name: "البرازيل",
  },
  {
    id: "BS",
    name: "الباهاما",
  },
  {
    id: "BT",
    name: "بوتان",
  },
  {
    id: "BV",
    name: "جزيرة بوفيه",
  },
  {
    id: "BW",
    name: "بتسوانا",
  },
  {
    id: "BY",
    name: "روسيا البيضاء",
  },
  {
    id: "BZ",
    name: "بليز",
  },
  {
    id: "CA",
    name: "كندا",
  },
  {
    id: "CC",
    name: "جزر كوكوس",
  },
  {
    id: "CD",
    name: "جمهورية الكونغو الديمقراطية",
  },
  {
    id: "CF",
    name: "جمهورية افريقيا الوسطى",
  },
  {
    id: "CG",
    name: "الكونغو - برازافيل",
  },
  {
    id: "CH",
    name: "سويسرا",
  },
  {
    id: "CI",
    name: "ساحل العاج",
  },
  {
    id: "CK",
    name: "جزر كوك",
  },
  {
    id: "CL",
    name: "شيلي",
  },
  {
    id: "CM",
    name: "الكاميرون",
  },
  {
    id: "CN",
    name: "الصين",
  },
  {
    id: "CO",
    name: "كولومبيا",
  },
  {
    id: "CR",
    name: "كوستاريكا",
  },
  {
    id: "CU",
    name: "كوبا",
  },
  {
    id: "CV",
    name: "الرأس الأخضر",
  },
  {
    id: "CW",
    name: "كوراساو",
  },
  {
    id: "CX",
    name: "جزيرة الكريسماس",
  },
  {
    id: "CY",
    name: "قبرص",
  },
  {
    id: "CZ",
    name: "جمهورية التشيك",
  },
  {
    id: "DE",
    name: "ألمانيا",
  },
  {
    id: "DJ",
    name: "جيبوتي",
  },
  {
    id: "DK",
    name: "الدانمرك",
  },
  {
    id: "DM",
    name: "دومينيكا",
  },
  {
    id: "DO",
    name: "جمهورية الدومينيك",
  },
  {
    id: "DZ",
    name: "الجزائر",
  },
  {
    id: "EC",
    name: "الاكوادور",
  },
  {
    id: "EE",
    name: "استونيا",
  },
  {
    id: "EG",
    name: "مصر",
  },
  {
    id: "EH",
    name: "الصحراء الغربية",
  },
  {
    id: "ER",
    name: "اريتريا",
  },
  {
    id: "ES",
    name: "أسبانيا",
  },
  {
    id: "ET",
    name: "اثيوبيا",
  },
  {
    id: "FI",
    name: "فنلندا",
  },
  {
    id: "FJ",
    name: "فيجي",
  },
  {
    id: "FK",
    name: "جزر فوكلاند",
  },
  {
    id: "FM",
    name: "ميكرونيزيا",
  },
  {
    id: "FO",
    name: "جزر فارو",
  },
  {
    id: "FR",
    name: "فرنسا",
  },
  {
    id: "GA",
    name: "الجابون",
  },
  {
    id: "GB",
    name: "المملكة المتحدة",
  },
  {
    id: "GD",
    name: "جرينادا",
  },
  {
    id: "GE",
    name: "جورجيا",
  },
  {
    id: "GF",
    name: "غويانا",
  },
  {
    id: "GG",
    name: "غيرنزي",
  },
  {
    id: "GH",
    name: "غانا",
  },
  {
    id: "GI",
    name: "جبل طارق",
  },
  {
    id: "GL",
    name: "جرينلاند",
  },
  {
    id: "GM",
    name: "غامبيا",
  },
  {
    id: "GN",
    name: "غينيا",
  },
  {
    id: "GP",
    name: "جوادلوب",
  },
  {
    id: "GQ",
    name: "غينيا الاستوائية",
  },
  {
    id: "GR",
    name: "اليونان",
  },
  {
    id: "GS",
    name: "جورجيا الجنوبية وجزر ساندويتش الجنوبية",
  },
  {
    id: "GT",
    name: "جواتيمالا",
  },
  {
    id: "GU",
    name: "جوام",
  },
  {
    id: "GW",
    name: "غينيا بيساو",
  },
  {
    id: "GY",
    name: "غيانا",
  },
  {
    id: "HK",
    name: "هونج كونج الصينية",
  },
  {
    id: "HM",
    name: "جزيرة هيرد وماكدونالد",
  },
  {
    id: "HN",
    name: "هندوراس",
  },
  {
    id: "HR",
    name: "كرواتيا",
  },
  {
    id: "HT",
    name: "هايتي",
  },
  {
    id: "HU",
    name: "المجر",
  },
  {
    id: "ID",
    name: "اندونيسيا",
  },
  {
    id: "IE",
    name: "أيرلندا",
  },
  {
    id: "IM",
    name: "جزيرة مان",
  },
  {
    id: "IN",
    name: "الهند",
  },
  {
    id: "IO",
    name: "المحيط الهندي البريطاني",
  },
  {
    id: "IQ",
    name: "العراق",
  },
  {
    id: "IR",
    name: "ايران",
  },
  {
    id: "IS",
    name: "أيسلندا",
  },
  {
    id: "IT",
    name: "ايطاليا",
  },
  {
    id: "JE",
    name: "جيرسي",
  },
  {
    id: "JM",
    name: "جامايكا",
  },
  {
    id: "JO",
    name: "الأردن",
  },
  {
    id: "JP",
    name: "اليابان",
  },
  {
    id: "KE",
    name: "كينيا",
  },
  {
    id: "KG",
    name: "قرغيزستان",
  },
  {
    id: "KH",
    name: "كمبوديا",
  },
  {
    id: "KI",
    name: "كيريباتي",
  },
  {
    id: "KM",
    name: "جزر القمر",
  },
  {
    id: "KN",
    name: "سانت كيتس ونيفيس",
  },
  {
    id: "KP",
    name: "كوريا الشمالية",
  },
  {
    id: "KR",
    name: "كوريا الجنوبية",
  },
  {
    id: "KW",
    name: "الكويت",
  },
  {
    id: "KY",
    name: "جزر الكايمن",
  },
  {
    id: "KZ",
    name: "كازاخستان",
  },
  {
    id: "LA",
    name: "لاوس",
  },
  {
    id: "LB",
    name: "لبنان",
  },
  {
    id: "LC",
    name: "سانت لوسيا",
  },
  {
    id: "LI",
    name: "ليختنشتاين",
  },
  {
    id: "LK",
    name: "سريلانكا",
  },
  {
    id: "LR",
    name: "ليبيريا",
  },
  {
    id: "LS",
    name: "ليسوتو",
  },
  {
    id: "LT",
    name: "ليتوانيا",
  },
  {
    id: "LU",
    name: "لوكسمبورج",
  },
  {
    id: "LV",
    name: "لاتفيا",
  },
  {
    id: "LY",
    name: "ليبيا",
  },
  {
    id: "MA",
    name: "المغرب",
  },
  {
    id: "MC",
    name: "موناكو",
  },
  {
    id: "MD",
    name: "مولدافيا",
  },
  {
    id: "ME",
    name: "الجبل الأسود",
  },
  {
    id: "MF",
    name: "سانت مارتين",
  },
  {
    id: "MG",
    name: "مدغشقر",
  },
  {
    id: "MH",
    name: "جزر المارشال",
  },
  {
    id: "MK",
    name: "مقدونيا",
  },
  {
    id: "ML",
    name: "مالي",
  },
  {
    id: "MM",
    name: "ميانمار",
  },
  {
    id: "MN",
    name: "منغوليا",
  },
  {
    id: "MO",
    name: "ماكاو الصينية",
  },
  {
    id: "MP",
    name: "جزر ماريانا الشمالية",
  },
  {
    id: "MQ",
    name: "مارتينيك",
  },
  {
    id: "MR",
    name: "موريتانيا",
  },
  {
    id: "MS",
    name: "مونتسرات",
  },
  {
    id: "MT",
    name: "مالطا",
  },
  {
    id: "MU",
    name: "موريشيوس",
  },
  {
    id: "MV",
    name: "جزر الملديف",
  },
  {
    id: "MW",
    name: "ملاوي",
  },
  {
    id: "MX",
    name: "المكسيك",
  },
  {
    id: "MY",
    name: "ماليزيا",
  },
  {
    id: "MZ",
    name: "موزمبيق",
  },
  {
    id: "NA",
    name: "ناميبيا",
  },
  {
    id: "NC",
    name: "كاليدونيا الجديدة",
  },
  {
    id: "NE",
    name: "النيجر",
  },
  {
    id: "NF",
    name: "جزيرة نورفوك",
  },
  {
    id: "NG",
    name: "نيجيريا",
  },
  {
    id: "NI",
    name: "نيكاراجوا",
  },
  {
    id: "NL",
    name: "هولندا",
  },
  {
    id: "NO",
    name: "النرويج",
  },
  {
    id: "NP",
    name: "نيبال",
  },
  {
    id: "NR",
    name: "نورو",
  },
  {
    id: "NU",
    name: "نيوي",
  },
  {
    id: "NZ",
    name: "نيوزيلاندا",
  },
  {
    id: "OM",
    name: "عمان",
  },
  {
    id: "PA",
    name: "بنما",
  },
  {
    id: "PE",
    name: "بيرو",
  },
  {
    id: "PF",
    name: "بولينيزيا الفرنسية",
  },
  {
    id: "PG",
    name: "بابوا غينيا الجديدة",
  },
  {
    id: "PH",
    name: "الفيلبين",
  },
  {
    id: "PK",
    name: "باكستان",
  },
  {
    id: "PL",
    name: "بولندا",
  },
  {
    id: "PM",
    name: "سانت بيير وميكولون",
  },
  {
    id: "PN",
    name: "بتكايرن",
  },
  {
    id: "PR",
    name: "بورتوريكو",
  },
  {
    id: "PS",
    name: "فلسطين",
  },
  {
    id: "PT",
    name: "البرتغال",
  },
  {
    id: "PW",
    name: "بالاو",
  },
  {
    id: "PY",
    name: "باراجواي",
  },
  {
    id: "QA",
    name: "قطر",
  },
  {
    id: "RE",
    name: "روينيون",
  },
  {
    id: "RO",
    name: "رومانيا",
  },
  {
    id: "RS",
    name: "صربيا",
  },
  {
    id: "RU",
    name: "روسيا",
  },
  {
    id: "RW",
    name: "رواندا",
  },
  {
    id: "SA",
    name: "المملكة العربية السعودية",
  },
  {
    id: "SB",
    name: "جزر سليمان",
  },
  {
    id: "SC",
    name: "سيشل",
  },
  {
    id: "SD",
    name: "السودان",
  },
  {
    id: "SE",
    name: "السويد",
  },
  {
    id: "SG",
    name: "سنغافورة",
  },
  {
    id: "SH",
    name: "سانت هيلنا",
  },
  {
    id: "SI",
    name: "سلوفينيا",
  },
  {
    id: "SJ",
    name: "سفالبارد وجان مايان",
  },
  {
    id: "SK",
    name: "سلوفاكيا",
  },
  {
    id: "SL",
    name: "سيراليون",
  },
  {
    id: "SM",
    name: "سان مارينو",
  },
  {
    id: "SN",
    name: "السنغال",
  },
  {
    id: "SO",
    name: "الصومال",
  },
  {
    id: "SR",
    name: "سورينام",
  },
  {
    id: "SS",
    name: "جنوب السودان",
  },
  {
    id: "ST",
    name: "ساو تومي وبرينسيبي",
  },
  {
    id: "SV",
    name: "السلفادور",
  },
  {
    id: "SX",
    name: "سينت مارتن",
  },
  {
    id: "SY",
    name: "سوريا",
  },
  {
    id: "SZ",
    name: "سوازيلاند",
  },
  {
    id: "TC",
    name: "جزر الترك وجايكوس",
  },
  {
    id: "TD",
    name: "تشاد",
  },
  {
    id: "TF",
    name: "المقاطعات الجنوبية الفرنسية",
  },
  {
    id: "TG",
    name: "توجو",
  },
  {
    id: "TH",
    name: "تايلند",
  },
  {
    id: "TJ",
    name: "طاجكستان",
  },
  {
    id: "TK",
    name: "توكيلو",
  },
  {
    id: "TL",
    name: "تيمور الشرقية",
  },
  {
    id: "TM",
    name: "تركمانستان",
  },
  {
    id: "TN",
    name: "تونس",
  },
  {
    id: "TO",
    name: "تونجا",
  },
  {
    id: "TR",
    name: "تركيا",
  },
  {
    id: "TT",
    name: "ترينيداد وتوباغو",
  },
  {
    id: "TV",
    name: "توفالو",
  },
  {
    id: "TW",
    name: "تايوان",
  },
  {
    id: "TZ",
    name: "تانزانيا",
  },
  {
    id: "UA",
    name: "أوكرانيا",
  },
  {
    id: "UG",
    name: "أوغندا",
  },
  {
    id: "UM",
    name: "جزر الولايات المتحدة البعيدة الصغيرة",
  },
  {
    id: "US",
    name: "الولايات المتحدة الأمريكية",
  },
  {
    id: "UY",
    name: "أورجواي",
  },
  {
    id: "UZ",
    name: "أوزبكستان",
  },
  {
    id: "VA",
    name: "الفاتيكان",
  },
  {
    id: "VC",
    name: "سانت فنسنت وغرنادين",
  },
  {
    id: "VE",
    name: "فنزويلا",
  },
  {
    id: "VG",
    name: "جزر فرجين البريطانية",
  },
  {
    id: "VI",
    name: "جزر فرجين الأمريكية",
  },
  {
    id: "VN",
    name: "فيتنام",
  },
  {
    id: "VU",
    name: "فانواتو",
  },
  {
    id: "WF",
    name: "جزر والس وفوتونا",
  },
  {
    id: "WS",
    name: "ساموا",
  },
  {
    id: "XK",
    name: "كوسوفو",
  },
  {
    id: "YE",
    name: "اليمن",
  },
  {
    id: "YT",
    name: "مايوت",
  },
  {
    id: "ZA",
    name: "جمهورية جنوب افريقيا",
  },
  {
    id: "ZM",
    name: "زامبيا",
  },
  {
    id: "ZW",
    name: "زيمبابوي",
  },
];

export {
  educationData,
  // friendsData,
  chatData,
  profileData,
  searchFilter,
  typeData,
  talentTime,
  talentFilter,
  talentSort,
  employeeType,
  months,
  days,
  countries,
  countriesDropdown,
};
