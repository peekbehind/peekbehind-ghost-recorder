test( "compact", function() {

  var custom = 42;
  var major = -1;
  var minor = -2;
  var patch = -3;
  var container = "#container";
  var path = "p[3]/ul/li[2]";
  var activity = -9;
  var left = 1234;
  var top = 5678;
  var time1 = 1000;
  var time2 = 10000;
  var details = "#any";
  var specifics = 34;

  var ghost0 = [custom,major,minor,patch];
  var json0 = JSON.stringify( ghost0 );
  compact( ghost0 );
  deepEqual( JSON.stringify( ghost0 ), json0,
                                         "no change expected without records");

  var ghost1 = [
    custom,
    major,minor,patch,
    [
      container,
      path,
      activity,
      left,
      top,
      time1
    ]
  ];
  var json1 = JSON.stringify( ghost1 );
  compact( ghost1 );
  strictEqual( JSON.stringify( ghost1 ), json1,
                                     "no change expected for a single record");

  var ghost2 = [
    custom,
    major,minor,patch,
    [
      container,
      path,
      activity,
      left,
      top,
      time1
    ],
    [
      container,
      path,
      activity,
      left,
      top,
      time2
    ]
  ];
  var expected2 = [
    custom,
    major,minor,patch,
    [
      container,
      path,
      activity,
      left,
      top,
      [
        time1
      ],
      [
        time2
      ]
    ]
  ];
  compact( ghost2 );
  deepEqual( ghost2, expected2,                   "nesting expected at times");

  var ghost3 = [
    custom,
    major,minor,patch,
    [
      container,
      path,
      activity,
      left,
      2000,
      time1
    ],
    [
      container,
      path,
      activity,
      left,
      4000,
      time2
    ]
  ];
  var expected3 = [
    custom,
    major,minor,patch,
    [
      container,
      path,
      activity,
      left,
      [
        2000,
        time1
      ],
      [
        4000,
        time2
      ]
    ]
  ];
  compact( ghost3 );
  deepEqual( ghost3, expected3,                     "nesting expected at top");

  var ghost4 = [
    custom,
    major,minor,patch,
    [
      container,
      path,
      activity,
      3000,
      top,
      time1
    ],
    [
      container,
      path,
      activity,
      4000,
      top,
      time2
    ]
  ];
  var expected4 = [
    custom,
    major,minor,patch,
    [
      container,
      path,
      activity,
      [
        3000,
        top,
        time1
      ],
      [
        4000,
        top,
        time2
      ]
    ]
  ];
  compact( ghost4 );
  deepEqual( ghost4, expected4,                    "nesting expected at left");

  var ghost5 = [
    custom,
    major,minor,patch,
    [
      container,
      path,
      -1,
      left,
      top,
      time1
    ],
    [
      container,
      path,
      -2,
      left,
      top,
      time2
    ]
  ];
  var expected5 = [
    custom,
    major,minor,patch,
    [
      container,
      path,
      [
        -1,
        left,
        top,
        time1
      ],
      [
        -2,
        left,
        top,
        time2
      ]
    ]
  ];
  compact( ghost5 );
  deepEqual( ghost5, expected5,           "nesting expected at activity type");

  var ghost6 = [
    custom,
    major,minor,patch,
    [
      container,
      "p[1]",
      activity,
      left,
      top,
      time1
    ],
    [
      container,
      "p[2]",
      activity,
      left,
      top,
      time2
    ]
  ];
  var expected6 = [
    custom,
    major,minor,patch,
    [
      container,
      [
        "p[1]",
        activity,
        left,
        top,
        time1
      ],
      [
        "p[2]",
        activity,
        left,
        top,
        time2
      ]
    ]
  ];
  compact( ghost6 );
  deepEqual( ghost6, expected6,                    "nesting expected at path");

  var ghost7 = [
    custom,
    major,minor,patch,
    [
      "#container1",
      path,
      activity,
      left,
      top,
      time1
    ],
    [
      "#container2",
      path,
      activity,
      left,
      top,
      time2
    ]
  ];
  var json7 = JSON.stringify( ghost7 );
  compact( ghost7 );
  strictEqual( JSON.stringify( ghost7 ), json7,
                "no extra nesting expected with different ancestor selectors");

  var ghost8 = [
    custom,
    major,minor,patch,
    [
      "#container1",
      "p[1]",
      activity,
      left,
      top,
      0
    ],
    [
      "#container1",
      "p[2]",
      -1,
      6000,
      top,
      1000
    ],
    [
      "#container1",
      "p[2]",
      -1,
      6000,
      top,
      2000
    ],
    [
      "#container1",
      "p[2]",
      -1,
      7000,
      4000,
      3000
    ],
    [
      "#container1",
      "p[2]",
      -1,
      7000,
      3000,
      4000
    ],
    [
      "#container1",
      "p[2]",
      -2,
      left,
      top,
      5000
    ],
    [
      "#container2",
      path,
      activity,
      left,
      top,
      6000
    ]
  ];
  var expected8 = [
    custom,
    major,minor,patch,
    [
      "#container1",
      [
        "p[1]",
        activity,
        left,
        top,
        0
      ],
      [
        "p[2]",
        [
          -1,
          [
            6000,
            top,
            [
              1000
            ],
            [
              2000
            ]
          ],
          [
            7000,
            [
              4000,
              3000
            ],
            [
              3000,
              4000
            ]
          ]
        ],
        [
          -2,
          left,
          top,
          5000
        ]
      ]
    ],
    [
      "#container2",
      path,
      activity,
      left,
      top,
      6000
    ]
  ];
  compact( ghost8 );
  deepEqual( ghost8, expected8,             "five levels of nesting expected");

  var ghost9 = [
    custom,
    major,minor,patch,
    [
      container,
      path,
      activity,
      left,
      top,
      1000
    ],
    [
      container,
      path,
      activity,
      left,
      top,
      2000
    ],
    [
      container,
      path,
      activity,
      left,
      top,
      3000
    ],
    [
      container,
      path,
      activity,
      left,
      top,
      4000
    ],
    [
      container,
      path,
      activity,
      left,
      top,
      5000
    ]
  ];
  var expected9 = [
    custom,
    major,minor,patch,
    [
      container,
      path,
      activity,
      left,
      top,
      [
        1000
      ],
      [
        2000
      ],
      [
        3000
      ],
      [
        4000
      ],
      [
        5000
      ]
    ]
  ];
  compact( ghost9 );
  deepEqual( ghost9, expected9,  "nesting at times expected with five values");

  var ghost10 = [
    custom,
    major,minor,patch,
    [
      container,
      path,
      -5,
      left,
      top,
      time1
    ],
    [
      container,
      path,
      -4,
      left,
      top,
      time1
    ],
    [
      container,
      path,
      -3,
      left,
      top,
      time1
    ],
    [
      container,
      path,
      -2,
      left,
      top,
      time1
    ],
    [
      container,
      path,
      -1,
      left,
      top,
      time2
    ]
  ];
  var expected10 = [
    custom,
    major,minor,patch,
    [
      container,
      path,
      [
        -5,
        left,
        top,
        time1
      ],
      [
        -4,
        left,
        top,
        time1
      ],
      [
        -3,
        left,
        top,
        time1
      ],
      [
        -2,
        left,
        top,
        time1
      ],
      [
        -1,
        left,
        top,
        time2
      ]
    ]
  ];
  compact( ghost10 );
  deepEqual( ghost10, expected10,
                         "nesting expected at activity type with five values");

  var ghost11 = [
    custom,
    major,minor,patch,
    [
      container,
      path,
      activity,
      left,
      top,
      time1
    ],
    [
      container,
      path,
      activity,
      left,
      top,
      time1
    ]
  ];
  var expected11 = [
    custom,
    major,minor,patch,
    [
      container,
      path,
      activity,
      left,
      top,
      time1,
      [],
      []
    ]
  ];
  compact( ghost11 );
  deepEqual( ghost11, expected11,
     "nesting expected at details with empty arrays when details are omitted");

  var ghost12 = [
    custom,
    major,minor,patch,
    [
      container,
      path,
      activity,
      left,
      top,
      time1,
      details,
      specifics
    ],
    [
      container,
      path,
      activity,
      left,
      top,
      time1,
      details,
      specifics
    ],
  ];
  var expected12 = [
    custom,
    major,minor,patch,
    [
      container,
      path,
      activity,
      left,
      top,
      time1,
      [
        details,
        specifics
      ],
      [
        details,
        specifics
      ]
    ]
  ];
  compact( ghost12 );
  deepEqual( ghost12, expected12,
                                     "nesting expected at details even with " +
                                      "common value of details and specifics");

  var ghost13 = [
    custom,
    major,minor,patch,
    [
      container,
      path,
      activity,
      left,
      top,
      time1,
      [1,2,3],
      specifics
    ],
    [
      container,
      path,
      activity,
      left,
      top,
      time1,
      [1,5,9]
    ],
  ];
  var expected13 = [
    custom,
    major,minor,patch,
    [
      container,
      path,
      activity,
      left,
      top,
      time1,
      [
        [1,2,3],
        specifics
      ],
      [
        [1,5,9]
      ]
    ]
  ];
  compact( ghost13 );
  deepEqual( ghost13, expected13,
                      "nesting expected at details with or without specifics");
});
