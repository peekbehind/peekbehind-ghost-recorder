/*
  Factorize common values, except in fields which accept any value,
  by introducing an extra level of nesting after common values.

  Parameter:
    ghost - in/out, array of nested records for a single ghost
            to be compacted for transmission to server and storage
*/
function compact( ghost ) {
  var
    // fields common to all records, from which common values can be extracted
    FIRST_COMMON_FIELD = 4, // Ancestor CSS Selector
    LAST_COMMON_FIELD = 9,  // Relative Time
    j,
    // maximum depth of a common chain of values from record to record
    depth = LAST_COMMON_FIELD - FIRST_COMMON_FIELD + 1,
    i,
    length = ghost.length,
    previousRecord,
    currentRecord,
    isStartOfSequence,
    isCommonChain,
    specificChain,
    deletedRecords;

  /*
    Algorithm:
    ----------

    1) Identity chains of common values in subsequent records,
       from longest to shortest

    2) Each time a chain of common values is found in two following records,
       group records by nesting following values of each record each in a
       different array after the chain of common values:

         [a,b,c,d,e1,f1,g1]
         [a,b,c,d,e2,f2,g2]
         becomes
         [a,b,c,d,[e1,f1,g1],[e2,f2,g2]]
  */

  // for each depth, from 6 to 1
  while ( depth > 0 ) {

    // compare each record with the one before
    isStartOfSequence = true;
    previousRecord = ghost[FIRST_COMMON_FIELD];
    for ( i = FIRST_COMMON_FIELD + 1; i < length; i++) {
      currentRecord = ghost[i];
      if ( currentRecord === null ) {
        continue; // skip record deleted in a previous iteration
      }

      // compare each value from current depth to 0 in both records
      isCommonChain = true;
      for ( j = depth - 1; j >= 0 && isCommonChain; j-- ) {
        isCommonChain = ( currentRecord[j] === previousRecord[j] );
      }

      // when a common chain is found at current depth
      if ( isCommonChain ) {

        // only once for each sequence of records starting with common chain
        if ( isStartOfSequence ) {
          // introduce extra level of nesting after the common chain
          // inside first record
          specificChain = previousRecord.slice( depth );
          previousRecord.length = depth;
          previousRecord.push( specificChain );
          isStartOfSequence = false;
        }
        // copy the end of following record with common chain
        // at the end of the first record
        specificChain = currentRecord.slice( depth );
        previousRecord.push( specificChain );

        // mark second record for removal
        // without removing it now, to avoid shifting indexes during the loop
        ghost[i] = null;
      } else {
        // reset flag of extra level for new chain
        isStartOfSequence = true;
        // only update previous record when current record is not deleted
        previousRecord = currentRecord;
      }
    }

    depth--;
  }

  // remove deleted records by shifting following records
  // and reducing the length of the array
  deletedRecords = 0;
  for ( i = FIRST_COMMON_FIELD + 1; i < length; i++) {
    currentRecord = ghost[i];

    if ( currentRecord === null ) {
      deletedRecords++;
    } else if ( deletedRecords > 0 ) {
      // shift record from number of free positions
      ghost[ i - deletedRecords ] = currentRecord;
      ghost[ i ] = null;
    }

  }

  // reduce length of the ghost to account for deleted records
  ghost.length = length - deletedRecords;

}

