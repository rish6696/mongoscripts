
const pgeSize = 5
const pgNo = 2

const filterObject={
     "items.food_label_id":{$in:["Veg_Non-Veg","Veg"]},
    // "items.classification": { $all: ["Lactose Free","Balanced", ] }
}

const cursor = db.getCollection('honk00498-menumodels')
   .aggregate([

      { $project: { items: 1, _id: 0 } },
      { $unwind: "$items" },
      // { $match: {
      //     $or:[ { "items.ingredients": { $all: [new RegExp("^Temp")] }},
      //     {"items.menu_type": new RegExp("^Temp") },
      //     { "items.product_name":new RegExp("^Temp") }
      //    ]
      //   }
      //  },
       {
         $project:{ "items.price":1,"items.product_name":1,"items.menu_type":1,"items.food_label_id":1,"items.ingredients":1,"items._id":1,"items.parent_id":1,"items.id_no":1 }
       },
         { $sort: { "items.id_no": 1 } },
         { $group: { _id: "$items.parent_id", members: { $push: "$items" } } },
      {
         $project: {
            parent: {
               $cond: { if: { $eq: ["$_id", -1] }, then: "$$REMOVE", else: { $arrayElemAt: ["$members", 0] } }
            },
            nullmembers:
            {
               $cond: { if: { $eq: ["$_id", -1 ] }, then: "$members", else: "$$REMOVE"  }

            } ,
            members:
            {
               $cond: { if: { $eq: ["$_id", -1 ] }, then: "$$REMOVE", else: {$slice: ["$members", { $subtract: [1, { $size: "$members" }] }]} }
            }, 
         }
      },
      {
         $unwind:{ path: "$nullmembers", preserveNullAndEmptyArrays: true }
      },
      {
         $project:{
            id_no:{
               $cond: { if: { $eq: ["$_id", -1 ] }, then: "$nullmembers.id_no", else: "$_id" }
            },
            members:1,
            nullmembers:1,
            parent:1
         }
      },
      {
         $sort: { "id_no":1 }
      },
      {
         $project:{
             _id:0,id_no:0
         }
      },
   ])

//{ $toInt: "$qty" }
//$nullmembers.id_no
//$_id

  // mongo localhost:27017/dash dashapi.js > output.txt

while (cursor.hasNext()) {
   printjson(cursor.next());
}


//{ $project :{ members:1, parent: { $arrayElemAt: [ "$members", 0 ] } }}






