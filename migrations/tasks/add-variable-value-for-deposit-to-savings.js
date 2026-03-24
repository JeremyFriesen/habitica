/* Migration task done via mongosh
 * Date: 2026-03-23
 * Purpose: Add optional variable value boolean for Dax's '$$ Savings $$' reward
 */

/* UP */
/*
db.tasks.updateOne(
  { 
    _id: '717166ff-baec-4a2a-94c3-17046fccd02a' 
  }, 
  { 
    $set: { 
      variableValue: true
    } 
  }
);
*/

/* DOWN */
/*
db.tasks.updateOne(
  { 
    _id: '717166ff-baec-4a2a-94c3-17046fccd02a' 
  }, 
  { 
    $set: { 
      variableValue: undefined
    } 
  }
);
*/