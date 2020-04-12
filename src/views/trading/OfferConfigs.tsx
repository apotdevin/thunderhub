export const SortOptions = [
  {
    name: 'none',
    title: 'None',
  },
  {
    name: 'price',
    title: 'Price',
  },
  {
    name: 'payment_window_minutes',
    title: 'Payment Window',
  },
  {
    name: 'user_average_payment_time_minutes',
    title: 'Average Payment Time',
  },
  {
    name: 'user_average_release_time_minutes',
    title: 'Average Release Time',
  },
  {
    name: 'rating',
    title: 'Rating',
  },
];

export const NewOptions = [
  {
    name: 'asset_code',
    title: 'Asset Code',
    options: [
      {
        name: 'BTC',
        title: 'Bitcoin',
      },
      {
        name: 'BTCLN',
        title: 'Lightning Bitcoin',
      },
    ],
  },
  {
    name: 'side',
    title: 'Side',
    options: [
      {
        name: 'buy',
        title: 'I want to sell Bitcoin',
      },
      {
        name: 'sell',
        title: 'I want to buy Bitcoin',
      },
    ],
  },
  {
    name: 'include_global',
    title: 'Include Global Offers',
    options: [
      {
        name: 'true',
        title: 'Yes',
      },
      {
        name: 'false',
        title: 'No',
      },
    ],
  },
  {
    name: 'only_working_now',
    title: 'Only Working Now Offers',
    options: [
      {
        name: 'true',
        title: 'Yes',
      },
      {
        name: 'false',
        title: 'No',
      },
    ],
  },
  {
    name: 'country',
    title: 'Country',
    searchable: true,
  },
  {
    name: 'currency_code',
    title: 'Currency',
    searchable: true,
  },
  {
    name: 'payment_method_type',
    title: 'Payment Type',
    options: [
      {
        name: 'Bank wire',
        title: 'Bank wire',
      },
      {
        name: 'Cash',
        title: 'Cash',
      },
      {
        name: 'Cryptocurrency',
        title: 'Cryptocurrency',
      },
      {
        name: 'Online payment system',
        title: 'Online payment system',
      },
    ],
  },
  // {
  //     name: 'payment_method_id',
  //     title: 'Payment Id',
  // },
  // {
  //     name: 'payment_method_name',
  //     title: 'Payment Name',
  // },
  // {
  //     name: 'volume',
  //     title: 'Volume',
  // },
  // {
  //     name: 'payment_window_minutes_max',
  //     title: 'Max Payment Window',
  // },
  // {
  //     name: 'user_average_payment_time_minutes_max',
  //     title: 'Max User Payment Time',
  // },
  // {
  //     name: 'user_average_release_time_minutes_max',
  //     title: 'Max User Release Time',
  // },
];
