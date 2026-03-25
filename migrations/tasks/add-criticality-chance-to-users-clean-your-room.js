/* Migration task done via mongosh
 * Date: 2026-03-23
 * Purpose: Add criticality chance to User's 'Clean your room' Daily task
 */

/* UP */
/*
db.tasks.updateOne(
  { 
    _id: '0faebe80-3878-4205-a8aa-fa26a1b629d0' 
  }, 
  { 
    $set: { 
      criticalityChance: { 
        dice: 20, 
        ranges: [ 
          { min: 1, max: 10, modifier: 0 }, 
          { min: 11, max: 19, modifier: 0.1 }, 
          { min: 20, max: 20, modifier: 1 } 
        ] 
      } 
    } 
  }
);
*/

/* DOWN */
/*
db.tasks.updateOne(
  { 
    _id: '0faebe80-3878-4205-a8aa-fa26a1b629d0' 
  }, 
  { 
    $set: { 
      criticalityChance: undefined
    } 
  }
);
*/