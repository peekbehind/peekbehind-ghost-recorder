test( "compact", function(){

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

  deepEqual(
    compact( [custom,major,minor,patch,[]] ),
    [custom,major,minor,patch,[]],
                   "General Custom field and version fields must be copied, " +
                                         "even with an empty list of records");

  var input0 = [
    custom,
    major,minor,patch,
    container,
    path,
    activity,
    left,
    top,
    time1
  ];
  var json0 = JSON.stringify( input0 );
  var result0 = compact( input0 );
  strictEqual( JSON.stringify( input0 ), json0,
                                   "input ghost data 0 must not be modified");
  deepEqual( result0, input0,      "a clone is expected for a single record");

  var input1 = [
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
  var json1 = JSON.stringify( input1 );
  var output1 = [
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
  var result1 = compact( input1 );
  strictEqual( JSON.stringify( input1 ), json1,
                                   "input ghost data 1  must not be modified");
  deepEqual( result1, output1,                    "nesting expected at times");

  var input2 = [
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
  var output2 = [
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
  var result2 = compact( input2 );
  deepEqual( result2, output2,                      "nesting expected at top");

  var input3 = [
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
  var output3 = [
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
  var result3 = compact( input3 );
  deepEqual( result3, output3,                     "nesting expected at left");

  var input4 = [
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
  var output4 = [
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
  var result4 = compact( input4 );
  deepEqual( result4, output4,            "nesting expected at activity type");

  var input5 = [
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
  var output5 = [
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
  var result5 = compact( input5 );
  deepEqual( result5, output5,                     "nesting expected at path");

  var input6 = [
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
  var json6 = JSON.stringify( input6 );
  var result6 = compact( input6 );
  strictEqual( JSON.stringify( result6 ), json6,
                "no extra nesting expected with different ancestor selectors");

  var input7 = [
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
  var output7 = [
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
              4000
            ],
            [
              3000
            ],
            [
              3000
            ],
            [
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
  var result7 = compact( input7 );
  deepEqual( result7, output7,              "five levels of nesting expected");

  var input8 = [
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
  var output8 = [
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
  var result8 = compact( input8 );
  deepEqual( result8, output8,   "nesting at times expected with five values");

  var input9 = [
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
  var output9 = [
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
  var result9 = compact( input9 );
  deepEqual( result9, output9,
                         "nesting expected at activity type with five values");

  var input10 = [
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
  var output10 = [
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
  var result10 = compact( input10 );
  deepEqual( result10, output10,
     "nesting expected at details with empty arrays when details are omitted");

  var input11 = [
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
  var output11 = [
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
  var result11 = compact( input11 );
  deepEqual( result11, output11,
                                     "nesting expected at details even with " +
                                      "common value of details and specifics");

  var input12 = [
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
  var output12 = [
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
  var result12 = compact( input12 );
  deepEqual( result12, output12,
                      "nesting expected at details with or without specifics");
});
