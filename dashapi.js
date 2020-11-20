
const pgeSize = 5
const pgNo = 2

const filterObject={
     "items.food_label_id":{$in:["Veg_Non-Veg","Veg"]},
    // "items.classification": { $all: ["Lactose Free","Balanced", ] }
}

const cursor = db.getCollection('honk00498-menumodels')
   .aggregate([

      { $match: { menu_type: "Sashimi & Nigiri" } },
      { $project: { items: 1, _id: 0 } },
      { $unwind: "$items" },
      //  this is the place to apply all the filers in the query 
      { $match : filterObject },
      // {$project : { "items.food_label_id":1  } }
       { $sort: { "items.id_no": 1 } },
       { $group: { _id: "$items.parent_id", members: { $push: "$items" } } },
      {
         $project: {
            parent: {
               $cond: { if: { $eq: ["$_id", "NULL"] }, then: "$$REMOVE", else: { $arrayElemAt: ["$members", 0] } }
            },
            members:
            {
               $cond: { if: { $eq: ["$_id", "NULL"] }, then: "$members", else: {$slice: ["$members", { $subtract: [1, { $size: "$members" }] }]} }
            }
            
         }
      }
   ])

while (cursor.hasNext()) {
   printjson(cursor.next());
}


//{ $project :{ members:1, parent: { $arrayElemAt: [ "$members", 0 ] } }}






