export type CurrencyProvider = {
  id: string;
  currency: string;
  currencySymbol: string;
  name: string;
  referralUrl: string;
  description: string;
  localStorageKey: string;
  methods: ('lightning' | 'onchain')[];
};

export const CURRENCY_PROVIDERS: CurrencyProvider[] = [
  {
    id: 'bringin-eur',
    currency: 'EUR',
    currencySymbol: '€',
    name: 'Bringin',
    referralUrl: 'https://bringin.me/AMBOSS',
    description: 'Convert between sats and EUR',
    localStorageKey: 'bringin_lightning_address',
    methods: ['lightning', 'onchain'],
  },
];
