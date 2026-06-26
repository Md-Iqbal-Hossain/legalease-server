// const express = require('express');
// const app = express()
// const port = 5000
// require('dotenv').config();

// const { MongoClient, ServerApiVersion } = require('mongodb');

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })




// const uri = process.env.MONGO_DB_URI;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();


//     const database = client.db("legalease_db");
//     const movies = database.collection("movies");

//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);



// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

// *********************************************************************


// const express = require('express');
// const cors = require('cors'); // Pro-tip: You will need this to connect your frontend next!
// const app = express();
// const port = 5000;
// require('dotenv').config();

// const { MongoClient, ServerApiVersion } = require('mongodb');

// // Middleware
// app.use(cors());
// app.use(express.json()); // Essential for handling incoming JSON data from your frontend forms

// app.get('/', (req, res) => {
//   res.send('LegalEase Server is running!')
// });

// const uri = process.env.MONGO_DB_URI;

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// // 1. Declare the collection variable in the outer scope
// let servicesCollection;

// async function run() {
//   try {
//     // Connect the client to the server
//     await client.connect();

//     // 2. Map your legal services database and collection accurately
//     const database = client.db("legalease_db");
//     servicesCollection = database.collection("services"); 

//     app.post('/services', async(req, res) =>{
//         const service = req.body;
//         const result = await servicesCollection.insertOne(service);
//         res.send(result);
//     })

//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
//     /* ----------------------------------------------------
//        YOUR FRONTEND ENDPOINTS WILL GO RIGHT HERE 👇
//        Example:
//        app.get('/api/lawyer/services', async (req, res) => { ... })
//        ---------------------------------------------------- */

//   } catch (error) {
//     console.error("Database connection error:", error);
//   }
// }
// run().catch(console.dir);

// app.listen(port, () => {
//   console.log(`LegalEase Server listening on port ${port}`)
// });

// ***************************************************************


// const express = require('express');
// const cors = require('cors');
// const app = express();
// const port = 5000;
// require('dotenv').config();

// // Destructure ObjectId alongside MongoClient so we can query specific documents
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// // Middleware
// app.use(cors());
// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('LegalEase Server is running!')
// });

// const uri = process.env.MONGO_DB_URI;

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// let servicesCollection;

// async function run() {
//   try {
//     // Connect the client to the server
//     await client.connect();

//     const database = client.db("legalease_db");
//     servicesCollection = database.collection("services"); 

//     /* =========================================================================
//        LEGAL SERVICES CRUD ROUTES
//        ========================================================================= */

//     // 1. CREATE: Add a new service offering configuration
//     app.post('/services', async (req, res) => {
//       try {
//         const service = req.body;
        
//         // Clean and normalize incoming form entries
//         if (service.fee) service.fee = Number(service.fee);
//         service.dateJoined = new Date().toISOString();
//         service.status = "Available"; // Initializing state default values
        
//         const result = await servicesCollection.insertOne(service);
//         res.status(201).send({ ...service, _id: result.insertedId });
//       } catch (error) {
//         res.status(500).send({ message: "Failed to insert legal service", error });
//       }
//     });

//     // 2. READ: Stream out all registered legal services 
//     app.get('/services', async (req, res) => {
//       try {
//         const cursor = servicesCollection.find().sort({ _id: -1 }); // Newest entries show at top of table
//         const results = await cursor.toArray();
//         res.status(200).send(results);
//       } catch (error) {
//         res.status(500).send({ message: "Failed to read legal services", error });
//       }
//     });

//     // 3. UPDATE: Modify an operational service entry via client parameters
//     app.put('/services/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const updatePayload = req.body;
        
//         // CRITICAL: MongoDB will crash if you attempt to overwrite or mutate an existing immutable system _id
//         delete updatePayload._id; 
//         if (updatePayload.fee) updatePayload.fee = Number(updatePayload.fee);

//         const filter = { _id: new ObjectId(id) };
//         const updateDoc = { $set: updatePayload };
        
//         const result = await servicesCollection.updateOne(filter, updateDoc);
        
//         if (result.matchedCount === 0) {
//           return res.status(404).send({ message: "Target document not found" });
//         }
        
//         res.status(200).send({ _id: id, ...updatePayload });
//       } catch (error) {
//         res.status(500).send({ message: "Failed to update legal service options", error });
//       }
//     });

//     // 4. DELETE: Cleanly clear an entity drop route
//     app.delete('/services/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const filter = { _id: new ObjectId(id) };
//         const result = await servicesCollection.deleteOne(filter);
        
//         if (result.deletedCount === 1) {
//           res.status(200).send(result);
//         } else {
//           res.status(404).send({ message: "No matching document found to delete" });
//         }
//       } catch (error) {
//         res.status(500).send({ message: "Failed to execute document deletion", error });
//       }
//     });

//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");

//   } catch (error) {
//     console.error("Database connection error:", error);
//   }
// }
// run().catch(console.dir);

// app.listen(port, () => {
//   console.log(`LegalEase Server listening on port ${port}`)
// });

// ***********************************************************************************


// index.js
// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// const app = express();
// const port = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// const uri = process.env.MONGO_DB_URI;
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // MongoDB কানেকশন স্টাবলিশমেন্ট
//     await client.connect();
//     const database = client.db("legalease_db");
    
//     // কালেকশন ডিক্লারেশন
//     const servicesCollection = database.collection("services");
//     const hiringsCollection = database.collection("hirings"); // নতুন কালেকশন

//     console.log("Pinged your deployment. You successfully connected to MongoDB!");

//     /* =========================================================================
//        ১. SERVICES ENDPOINTS (CRUD)
//        ========================================================================= */
//     app.post('/services', async (req, res) => {
//       const newService = req.body;
//       const result = await servicesCollection.insertOne(newService);
//       res.send(result);
//     });

//     app.get('/services', async (req, res) => {
//       const result = await servicesCollection.find().toArray();
//       res.send(result);
//     });

//     app.put('/services/:id', async (req, res) => {
//       const id = req.params.id;
//       const filter = { _id: new ObjectId(id) };
//       const updatedDoc = { $set: req.body };
//       const result = await servicesCollection.updateOne(filter, updatedDoc);
//       res.send(result);
//     });

//     app.delete('/services/:id', async (req, res) => {
//       const id = req.params.id;
//       const filter = { _id: new ObjectId(id) };
//       const result = await servicesCollection.deleteOne(filter);
//       res.send(result);
//     });

//     /* =========================================================================
//        ২. LAWYER HIRING HISTORY ENDPOINTS (New)
//        ========================================================================= */
    
//     // GET: নির্দিষ্ট আইনজীবীর ইমেইল অনুযায়ী তার সমস্ত রিকোয়েস্ট লোড করা
//     app.get('/lawyer/hirings/:email', async (req, res) => {
//       try {
//         const email = req.params.email;
//         const query = { lawyerEmail: email };
//         const result = await hiringsCollection.find(query).sort({ _id: -1 }).toArray();
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Database streaming read failure.", error });
//       }
//     });

//     // PATCH: আইনজীবীর অ্যাকশন অনুযায়ী পেন্ডিং রিকোয়েস্ট Accept/Reject করা
//     app.patch('/hirings/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const { status } = req.body;
//         const filter = { _id: new ObjectId(id) };
//         const updateDoc = {
//           $set: { status: status }
//         };
//         const result = await hiringsCollection.updateOne(filter, updateDoc);
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Server mutation rejected status change.", error });
//       }
//     });

//   } finally {
//     // ক্লায়েন্ট ওপেন থাকবে যাতে রিকোয়েস্ট অনবরত হ্যান্ডেল হতে পারে
//   }
// }
// run().catch(console.dir);

// app.get('/', (req, res) => {
//   res.send('LegalEase Workflow Optimization Engine Running...');
// });

// app.listen(port, () => {
//   console.log(`Server listening quietly on port ${port}`);
// });

// *******************************************************************

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_DB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // MongoDB কানেকশন স্টাবলিশমেন্ট
    await client.connect();
    const database = client.db("legalease_db");
    
    // কালেকশন ডিক্লারেশন সমূহ
    const servicesCollection = database.collection("services");
    const hiringsCollection = database.collection("hirings");
    const lawyerProfilesCollection = database.collection("lawyer_profiles"); // নতুন প্রোফাইল কালেকশন

    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    /* =========================================================================
       ১. SERVICES ENDPOINTS (CRUD)
       ========================================================================= */
    app.post('/services', async (req, res) => {
      const newService = req.body;
      const result = await servicesCollection.insertOne(newService);
      res.send(result);
    });

    app.get('/services', async (req, res) => {
      const result = await servicesCollection.find().toArray();
      res.send(result);
    });

    app.put('/services/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = { $set: req.body };
      const result = await servicesCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.delete('/services/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await servicesCollection.deleteOne(filter);
      res.send(result);
    });

    /* =========================================================================
       ২. LAWYER HIRING HISTORY ENDPOINTS (Inbound Case Requests)
       ========================================================================= */
    app.get('/lawyer/hirings/:email', async (req, res) => {
      try {
        const email = req.params.email;
        const query = { lawyerEmail: email };
        const result = await hiringsCollection.find(query).sort({ _id: -1 }).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Database streaming read failure.", error });
      }
    });

    app.patch('/hirings/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const { status } = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: { status: status }
        };
        const result = await hiringsCollection.updateOne(filter, updateDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Server mutation rejected status change.", error });
      }
    });

    /* =========================================================================
       ৩. LAWYER BROWSE & DIRECTORY APIS (Aligned with HireLoop Spec)
       ========================================================================= */
    
    // GET: সমস্ত আইনজীবীর প্রোফাইল ফিল্টারসহ নিয়ে আসা
    app.get('/api/lawyers', async (req, res) => {
      try {
        const query = {};
        // যদি স্পেশালটি কুয়েরি প্যারামিটার থাকে (যেমন: /api/lawyers?specialty=Corporate)
        if (req.query.specialty) {
          query.specialty = { $regex: req.query.specialty, $options: 'i' }; // Case-insensitive অনুসন্ধান
        }
        const cursor = lawyerProfilesCollection.find(query).sort({ _id: -1 });
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to stream lawyer profiles.", error });
      }
    });

    // GET: সুনির্দিষ্ট আইডি দিয়ে একজন আইনজীবীর প্রোফাইল বের করা
    app.get('/api/lawyers/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await lawyerProfilesCollection.findOne(query);
        if (!result) {
          return res.status(404).send({ message: "Lawyer profile node not found." });
        }
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error targeting direct object profile.", error });
      }
    });

    // POST: নতুন আইনজীবীর প্রোফাইল ডাটাবেজে যুক্ত করা
    app.post('/api/lawyers', async (req, res) => {
      try {
        const profile = req.body;
        const newProfile = {
          ...profile,
          createdAt: new Date()
        };
        const result = await lawyerProfilesCollection.insertOne(newProfile);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Onboarding state mutation rejected.", error });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Database environment baseline checks verified successfully.");

  } finally {
    // ক্লায়েন্ট অন থাকবে যাতে অনবরত কানেকশন রিসিভ করা যায়
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('LegalEase Workflow Optimization Engine Running...');
});

app.listen(port, () => {
  console.log(`Server listening quietly on port ${port}`);
});