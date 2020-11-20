const cursor = db.bookings.aggregate([
  {
    $match:{ userId: ObjectId('5f62429d9068c03928e0a05b')  }
  }
  ,{
    $group:{
      _id:null,
      averageRating: { 
         $avg:"$userRating"
      }
    }
  }
])
 

while (cursor.hasNext()) {
   printjson(cursor.next());
}