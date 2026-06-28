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
    
//     // কালেকশন ডিক্লারেশন সমূহ
//     const servicesCollection = database.collection("services");
//     const hiringsCollection = database.collection("hirings");
//     const lawyerProfilesCollection = database.collection("lawyer_profiles"); // নতুন প্রোফাইল কালেকশন

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
//        ২. LAWYER HIRING HISTORY ENDPOINTS (Inbound Case Requests)
//        ========================================================================= */
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

//     /* =========================================================================
//        ৩. LAWYER BROWSE & DIRECTORY APIS (Aligned with HireLoop Spec)
//        ========================================================================= */
    
//     // GET: সমস্ত আইনজীবীর প্রোফাইল ফিল্টারসহ নিয়ে আসা
//     app.get('/api/lawyers', async (req, res) => {
//       try {
//         const query = {};
//         // যদি স্পেশালটি কুয়েরি প্যারামিটার থাকে (যেমন: /api/lawyers?specialty=Corporate)
//         if (req.query.specialty) {
//           query.specialty = { $regex: req.query.specialty, $options: 'i' }; // Case-insensitive অনুসন্ধান
//         }
//         const cursor = lawyerProfilesCollection.find(query).sort({ _id: -1 });
//         const result = await cursor.toArray();
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Failed to stream lawyer profiles.", error });
//       }
//     });

//     // GET: সুনির্দিষ্ট আইডি দিয়ে একজন আইনজীবীর প্রোফাইল বের করা
//     app.get('/api/lawyers/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const query = { _id: new ObjectId(id) };
//         const result = await lawyerProfilesCollection.findOne(query);
//         if (!result) {
//           return res.status(404).send({ message: "Lawyer profile node not found." });
//         }
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Error targeting direct object profile.", error });
//       }
//     });

//     // POST: নতুন আইনজীবীর প্রোফাইল ডাটাবেজে যুক্ত করা
//     app.post('/api/lawyers', async (req, res) => {
//       try {
//         const profile = req.body;
//         const newProfile = {
//           ...profile,
//           createdAt: new Date()
//         };
//         const result = await lawyerProfilesCollection.insertOne(newProfile);
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Onboarding state mutation rejected.", error });
//       }
//     });

//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Database environment baseline checks verified successfully.");

//   } finally {
//     // ক্লায়েন্ট অন থাকবে যাতে অনবরত কানেকশন রিসিভ করা যায়
//   }
// }
// run().catch(console.dir);

// app.get('/', (req, res) => {
//   res.send('LegalEase Workflow Optimization Engine Running...');
// });

// app.listen(port, () => {
//   console.log(`Server listening quietly on port ${port}`);
// });

// *************************************************************

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
//     // MongoDB Connection Establishment
//     await client.connect();
//     const database = client.db("legalease_db");
    
//     // Collection Declarations
//     const servicesCollection = database.collection("services");
//     const hiringsCollection = database.collection("hirings");
//     const lawyerProfilesCollection = database.collection("lawyer_profiles");
//     const usersCollection = database.collection("users"); // Added to sync Better-Auth session accounts

//     console.log("Pinged your deployment. You successfully connected to MongoDB!");

//     /* =========================================================================
//        1. USER METADATA SYNC & PROFILE MANAGEMENT
//        ========================================================================= */
    
//     // POST: Sync account details on initialization or check current profile status
//     app.post('/api/users/sync', async (req, res) => {
//       try {
//         const { email, name, role, image } = req.body;
//         if (!email) return res.status(400).send({ message: "Email context parameter is required." });

//         const filter = { email: email.toLowerCase().trim() };
//         const updateDoc = {
//           $set: {
//             name,
//             role: role || 'client',
//             image,
//             updatedAt: new Date()
//           },
//           $setOnInsert: {
//             createdAt: new Date()
//           }
//         };

//         const result = await usersCollection.updateOne(filter, updateDoc, { upsert: true });
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Account mapping initialization sequence failed.", error });
//       }
//     });

//     /* =========================================================================
//        2. SERVICES ENDPOINTS (CRUD)
//        ========================================================================= */
//     app.post('/api/services', async (req, res) => {
//       try {
//         const newService = req.body;
//         const result = await servicesCollection.insertOne({
//           ...newService,
//           createdAt: new Date()
//         });
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Failed to persist service asset allocation.", error });
//       }
//     });

//     app.get('/api/services', async (req, res) => {
//       try {
//         const result = await servicesCollection.find().sort({ _id: -1 }).toArray();
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Error streaming database services.", error });
//       }
//     });

//     app.put('/api/services/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const filter = { _id: new ObjectId(id) };
//         const updatedDoc = { $set: req.body };
//         const result = await servicesCollection.updateOne(filter, updatedDoc);
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Service records processing mutation rejected.", error });
//       }
//     });

//     app.delete('/api/services/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const filter = { _id: new ObjectId(id) };
//         const result = await servicesCollection.deleteOne(filter);
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Service execution thread failed deletion.", error });
//       }
//     });

//     /* =========================================================================
//        3. LAWYER HIRING HISTORY ENDPOINTS (Inbound Case Requests)
//        ========================================================================= */
    
//     // GET: Fetch case history filtered by target lawyer email
//     app.get('/api/lawyer/hirings/:email', async (req, res) => {
//       try {
//         const email = req.params.email;
//         const query = { lawyerEmail: email.toLowerCase().trim() };
//         const result = await hiringsCollection.find(query).sort({ _id: -1 }).toArray();
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Database streaming read failure.", error });
//       }
//     });

//     // POST: Create a new hiring case request (Client hiring a Lawyer)
//     app.post('/api/hirings', async (req, res) => {
//       try {
//         const hiringData = req.body;
//         const result = await hiringsCollection.insertOne({
//           ...hiringData,
//           status: hiringData.status || 'pending',
//           createdAt: new Date()
//         });
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Failed to register application record pipeline.", error });
//       }
//     });

//     app.patch('/api/hirings/:id', async (req, res) => {
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

//     /* =========================================================================
//        4. LAWYER BROWSE & DIRECTORY APIS 
//        ========================================================================= */
    
//     // GET: Fetch all profiles with case-insensitive search queries
//     app.get('/api/lawDynamic', async (req, res) => {
//       try {
//         const query = {};
//         if (req.query.specialty) {
//           query.specialty = { $regex: req.query.specialty, $options: 'i' };
//         }
//         const result = await lawyerProfilesCollection.find(query).sort({ _id: -1 }).toArray();
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Failed to stream lawyer profiles.", error });
//       }
//     });

//     // GET: Specific lawyer profile data by reference ID
//     app.get('/api/lawDynamic/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const query = { _id: new ObjectId(id) };
//         const result = await lawyerProfilesCollection.findOne(query);
//         if (!result) {
//           return res.status(404).send({ message: "Lawyer profile node not found." });
//         }
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Error targeting direct object profile.", error });
//       }
//     });

//     // POST: Create or update a direct lawyer profile catalog entry
//     app.post('/api/lawDynamic', async (req, res) => {
//       try {
//         const profile = req.body;
//         const newProfile = {
//           ...profile,
//           createdAt: new Date()
//         };
//         const result = await lawyerProfilesCollection.insertOne(newProfile);
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Onboarding state mutation rejected.", error });
//       }
//     });

//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Database environment baseline checks verified successfully.");

//   } finally {
//     // Client remains open continuously
//   }
// }
// run().catch(console.dir);

// app.get('/', (req, res) => {
//   res.send('LegalEase Workflow Optimization Engine Running...');
// });

// app.listen(port, () => {
//   console.log(`Server listening quietly on port ${port}`);
// });

// *******************************************************

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
    
//     // কালেকশন ডিক্লারেশন সমূহ
//     const servicesCollection = database.collection("services");
//     const hiringsCollection = database.collection("hirings");
//     const lawyerProfilesCollection = database.collection("lawyer_profiles");
//     const usersCollection = database.collection("users");

//     console.log("Pinged your deployment. You successfully connected to MongoDB!");

//     /* =========================================================================
//        ১. USER METADATA SYNC & PROFILE MANAGEMENT
//        ========================================================================= */
//     app.post('/api/users/sync', async (req, res) => {
//       try {
//         const { email, name, role, image } = req.body;
//         if (!email) return res.status(400).send({ message: "Email parameter is required." });

//         const filter = { email: email.toLowerCase().trim() };
//         const updateDoc = {
//           $set: {
//             name,
//             role: role || 'client',
//             image,
//             updatedAt: new Date()
//           },
//           $setOnInsert: {
//             createdAt: new Date()
//           }
//         };

//         const result = await usersCollection.updateOne(filter, updateDoc, { upsert: true });
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Account mapping failed.", error });
//       }
//     });

//     /* =========================================================================
//        ২. SERVICES ENDPOINTS (CRUD)
//        ========================================================================= */
//     app.post('/api/services', async (req, res) => {
//       try {
//         const newService = req.body;
//         const result = await servicesCollection.insertOne({
//           ...newService,
//           createdAt: new Date()
//         });
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Failed to create service.", error });
//       }
//     });

//     app.get('/api/services', async (req, res) => {
//       try {
//         const result = await servicesCollection.find().sort({ _id: -1 }).toArray();
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Error streaming services.", error });
//       }
//     });

//     app.put('/api/services/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const filter = { _id: new ObjectId(id) };
//         const updatedDoc = { $set: req.body };
//         const result = await servicesCollection.updateOne(filter, updatedDoc);
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Service mutation rejected.", error });
//       }
//     });

//     app.delete('/api/services/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const filter = { _id: new ObjectId(id) };
//         const result = await servicesCollection.deleteOne(filter);
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Service deletion failed.", error });
//       }
//     });

//     /* =========================================================================
//        ৩. LAWYER HIRING HISTORY ENDPOINTS (Inbound Case Requests)
//        ========================================================================= */
//     app.get('/api/lawyer/hirings/:email', async (req, res) => {
//       try {
//         const email = req.params.email;
//         const query = { lawyerEmail: email.toLowerCase().trim() };
//         const result = await hiringsCollection.find(query).sort({ _id: -1 }).toArray();
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Database read failure.", error });
//       }
//     });

//     app.post('/api/hirings', async (req, res) => {
//       try {
//         const hiringData = req.body;
//         const result = await hiringsCollection.insertOne({
//           ...hiringData,
//           status: hiringData.status || 'pending',
//           createdAt: new Date()
//         });
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Failed to register case record.", error });
//       }
//     });

//     app.patch('/api/hirings/:id', async (req, res) => {
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

//     /* =========================================================================
//        ৪. LAWYER BROWSE & DIRECTORY APIS 
//        ========================================================================= */
//     app.get('/api/lawyers', async (req, res) => {
//       try {
//         const query = {};
//         if (req.query.specialty) {
//           query.specialty = { $regex: req.query.specialty, $options: 'i' };
//         }
//         const result = await lawyerProfilesCollection.find(query).sort({ _id: -1 }).toArray();
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Failed to stream lawyer profiles.", error });
//       }
//     });

//     app.get('/api/lawyers/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const query = { _id: new ObjectId(id) };
//         const result = await lawyerProfilesCollection.findOne(query);
//         if (!result) {
//           return res.status(404).send({ message: "Lawyer profile node not found." });
//         }
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Error targeting profile object.", error });
//       }
//     });

//     app.post('/api/lawyers', async (req, res) => {
//       try {
//         const profile = req.body;
//         const newProfile = {
//           ...profile,
//           createdAt: new Date()
//         };
//         const result = await lawyerProfilesCollection.insertOne(newProfile);
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Profile creation rejected.", error });
//       }
//     });

//     // Baseline checks
//     await client.db("admin").command({ ping: 1 });
//     console.log("Database baseline checks verified successfully.");

//   } finally {
//     // Client remains open
//   }
// }
// run().catch(console.dir);

// app.get('/', (req, res) => {
//   res.send('LegalEase Workflow Optimization Engine Running...');
// });

// app.listen(port, () => {
//   console.log(`Server listening quietly on port ${port}`);
// });

// ************************************************************

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
    
//     // কালেকশন ডিক্লারেশন সমূহ
//     const servicesCollection = database.collection("services");
//     const hiringsCollection = database.collection("hirings");
//     const lawyerProfilesCollection = database.collection("lawyer_profiles");
//     const usersCollection = database.collection("users");

//     console.log("Pinged your deployment. You successfully connected to MongoDB!");

//     /* =========================================================================
//        ১. USER METADATA SYNC & PROFILE MANAGEMENT
//        ========================================================================= */
//     app.post('/api/users/sync', async (req, res) => {
//       try {
//         const { email, name, role, image } = req.body;
//         if (!email) return res.status(400).send({ message: "Email parameter is required." });

//         const filter = { email: email.toLowerCase().trim() };
//         const updateDoc = {
//           $set: {
//             name,
//             role: role || 'client',
//             image,
//             updatedAt: new Date()
//           },
//           $setOnInsert: {
//             createdAt: new Date()
//           }
//         };

//         const result = await usersCollection.updateOne(filter, updateDoc, { upsert: true });
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Account mapping failed.", error });
//       }
//     });

//     /* =========================================================================
//        ২. SERVICES ENDPOINTS (CRUD)
//        ========================================================================= */
//     app.post('/api/services', async (req, res) => {
//       try {
//         const newService = req.body;
//         const result = await servicesCollection.insertOne({
//           ...newService,
//           createdAt: new Date()
//         });
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Failed to create service.", error });
//       }
//     });

//     app.get('/api/services', async (req, res) => {
//       try {
//         const result = await servicesCollection.find().sort({ _id: -1 }).toArray();
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Error streaming services.", error });
//       }
//     });

//     app.put('/api/services/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const filter = { _id: new ObjectId(id) };
//         const updatedDoc = { $set: req.body };
//         const result = await servicesCollection.updateOne(filter, updatedDoc);
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Service mutation rejected.", error });
//       }
//     });

//     app.delete('/api/services/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const filter = { _id: new ObjectId(id) };
//         const result = await servicesCollection.deleteOne(filter);
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Service deletion failed.", error });
//       }
//     });

//     /* =========================================================================
//        ৩. LAWYER HIRING HISTORY ENDPOINTS (Inbound Case Requests)
//        ========================================================================= */
//     app.get('/api/lawyer/hirings/:email', async (req, res) => {
//       try {
//         const email = req.params.email;
//         const query = { lawyerEmail: email.toLowerCase().trim() };
//         const result = await hiringsCollection.find(query).sort({ _id: -1 }).toArray();
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Database read failure.", error });
//       }
//     });

//     app.post('/api/hirings', async (req, res) => {
//       try {
//         const hiringData = req.body;
//         const result = await hiringsCollection.insertOne({
//           ...hiringData,
//           status: hiringData.status || 'pending',
//           createdAt: new Date()
//         });
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Failed to register case record.", error });
//       }
//     });

//     app.patch('/api/hirings/:id', async (req, res) => {
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

//     /* =========================================================================
//        ৪. LAWYER BROWSE & DIRECTORY APIS 
//        ========================================================================= */
//     app.get('/api/lawyers', async (req, res) => {
//       try {
//         const query = {};
//         if (req.query.specialty) {
//           query.specialty = { $regex: req.query.specialty, $options: 'i' };
//         }
//         const result = await lawyerProfilesCollection.find(query).sort({ _id: -1 }).toArray();
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Failed to stream lawyer profiles.", error });
//       }
//     });

//     app.get('/api/lawyers/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const query = { _id: new ObjectId(id) };
//         const result = await lawyerProfilesCollection.findOne(query);
//         if (!result) {
//           return res.status(404).send({ message: "Lawyer profile node not found." });
//         }
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Error targeting profile object.", error });
//       }
//     });

//     app.post('/api/lawyers', async (req, res) => {
//       try {
//         const profile = req.body;
//         const newProfile = {
//           ...profile,
//           createdAt: new Date()
//         };
//         const result = await lawyerProfilesCollection.insertOne(newProfile);
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Profile creation rejected.", error });
//       }
//     });

//     /* =========================================================================
//        ৫. MEMBERSHIP & CLIENT SUBSCRIPTION PLANS API
//        ========================================================================= */
//     app.get('/api/plans', async (req, res) => {
//       try {
//         const planId = req.query.plan_id || 'client_free';
        
//         // ডাইনামিক মেম্বারশিপ ডেটা স্ট্রাকচার
//         const mockPlans = {
//           'client_free': {
//             name: 'Free Tier',
//             maxConsultationsPerMonth: 3,
//             price: 0
//           },
//           'client_premium': {
//             name: 'Premium Tier',
//             maxConsultationsPerMonth: 20,
//             price: 1500
//           }
//         };

//         const activePlan = mockPlans[planId] || mockPlans['client_free'];
//         res.send(activePlan);
//       } catch (error) {
//         res.status(500).send({ message: "Failed to resolve membership tier status.", error });
//       }
//     });

//     // Baseline checks
//     await client.db("admin").command({ ping: 1 });
//     console.log("Database baseline checks verified successfully.");

//   } finally {
//     // Client remains open
//   }
// }
// run().catch(console.dir);

// app.get('/', (req, res) => {
//   res.send('LegalEase Workflow Optimization Engine Running...');
// });

// app.listen(port, () => {
//   console.log(`Server listening quietly on port ${port}`);
// });

// *****************************************************************

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
    
//     // কালেকশন ডিক্লারেশন সমূহ
//     const servicesCollection = database.collection("services");
//     const hiringsCollection = database.collection("hirings");
//     const lawyerProfilesCollection = database.collection("lawyer_profiles");
//     const usersCollection = database.collection("users");

//     console.log("Pinged your deployment. You successfully connected to MongoDB!");

//     /* =========================================================================
//        ১. USER METADATA SYNC & PROFILE MANAGEMENT
//        ========================================================================= */
//     app.post('/api/users/sync', async (req, res) => {
//       try {
//         const { email, name, role, image } = req.body;
//         if (!email) return res.status(400).send({ message: "Email parameter is required." });

//         const filter = { email: email.toLowerCase().trim() };
//         const updateDoc = {
//           $set: {
//             name,
//             role: role || 'client',
//             image,
//             updatedAt: new Date()
//           },
//           $setOnInsert: {
//             createdAt: new Date()
//           }
//         };

//         const result = await usersCollection.updateOne(filter, updateDoc, { upsert: true });
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Account mapping failed.", error });
//       }
//     });

//     /* =========================================================================
//        ২. SERVICES ENDPOINTS (CRUD)
//        ========================================================================= */
//     app.post('/api/services', async (req, res) => {
//       try {
//         const newService = req.body;
//         const result = await servicesCollection.insertOne({
//           ...newService,
//           createdAt: new Date()
//         });
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Failed to create service.", error });
//       }
//     });

//     app.get('/api/services', async (req, res) => {
//       try {
//         const result = await servicesCollection.find().sort({ _id: -1 }).toArray();
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Error streaming services.", error });
//       }
//     });

//     app.put('/api/services/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const filter = { _id: new ObjectId(id) };
//         const updatedDoc = { $set: req.body };
//         const result = await servicesCollection.updateOne(filter, updatedDoc);
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Service mutation rejected.", error });
//       }
//     });

//     app.delete('/api/services/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const filter = { _id: new ObjectId(id) };
//         const result = await servicesCollection.deleteOne(filter);
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Service deletion failed.", error });
//       }
//     });

//     /* =========================================================================
//        ৩. LAWYER HIRING HISTORY ENDPOINTS (Inbound Case Requests)
//        ========================================================================= */
//     app.get('/api/lawyer/hirings/:emailOrId', async (req, res) => {
//       try {
//         const param = req.params.emailOrId.toLowerCase().trim();
        
//         // 💡 ডাইনামিক কোয়েরি: lawyerEmail অথবা lawyerId যেকোনো একটির সাথে মিললেই ডেটা কুয়েরি করবে
//         const query = {
//           $or: [
//             { lawyerEmail: param },
//             { lawyerId: param }
//           ]
//         };
        
//         const result = await hiringsCollection.find(query).sort({ _id: -1 }).toArray();
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Database read failure.", error });
//       }
//     });

//     app.post('/api/hirings', async (req, res) => {
//       try {
//         const hiringData = req.body;
//         const result = await hiringsCollection.insertOne({
//           ...hiringData,
//           status: hiringData.status || 'pending',
//           createdAt: new Date()
//         });
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Failed to register case record.", error });
//       }
//     });

//     app.patch('/api/hirings/:id', async (req, res) => {
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

//     /* =========================================================================
//        ৪. LAWYER BROWSE & DIRECTORY APIS 
//        ========================================================================= */
//     app.get('/api/lawyers', async (req, res) => {
//       try {
//         const query = {};
//         if (req.query.specialty) {
//           query.specialty = { $regex: req.query.specialty, $options: 'i' };
//         }
//         const result = await lawyerProfilesCollection.find(query).sort({ _id: -1 }).toArray();
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Failed to stream lawyer profiles.", error });
//       }
//     });

//     app.get('/api/lawyers/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const query = { _id: new ObjectId(id) };
//         const result = await lawyerProfilesCollection.findOne(query);
//         if (!result) {
//           return res.status(404).send({ message: "Lawyer profile node not found." });
//         }
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Error targeting profile object.", error });
//       }
//     });

//     app.post('/api/lawyers', async (req, res) => {
//       try {
//         const profile = req.body;
//         const newProfile = {
//           ...profile,
//           createdAt: new Date()
//         };
//         const result = await lawyerProfilesCollection.insertOne(newProfile);
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Profile creation rejected.", error });
//       }
//     });

//     /* =========================================================================
//        ৫. MEMBERSHIP & CLIENT SUBSCRIPTION PLANS API
//        ========================================================================= */
//     app.get('/api/plans', async (req, res) => {
//       try {
//         const planId = req.query.plan_id || 'client_free';
        
//         // ডাইনামিক মেম্বারশিপ ডেটা স্ট্রাকচার
//         const mockPlans = {
//           'client_free': {
//             name: 'Free Tier',
//             maxConsultationsPerMonth: 3,
//             price: 0
//           },
//           'client_premium': {
//             name: 'Premium Tier',
//             maxConsultationsPerMonth: 20,
//             price: 1500
//           }
//         };

//         const activePlan = mockPlans[planId] || mockPlans['client_free'];
//         res.send(activePlan);
//       } catch (error) {
//         res.status(500).send({ message: "Failed to resolve membership tier status.", error });
//       }
//     });

//     // Baseline checks
//     await client.db("admin").command({ ping: 1 });
//     console.log("Database baseline checks verified successfully.");

//   } finally {
//     // Client remains open
//   }
// }
// run().catch(console.dir);

// app.get('/', (req, res) => {
//   res.send('LegalEase Workflow Optimization Engine Running...');
// });

// app.listen(port, () => {
//   console.log(`Server listening quietly on port ${port}`);
// });

// **************************************************************

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
//     await client.connect();
//     const database = client.db("legalease_db");
    
//     // কালেকশন সমূহ
//     const servicesCollection = database.collection("services");
//     const hiringsCollection = database.collection("hirings");
//     const lawyerProfilesCollection = database.collection("lawyer_profiles");
//     const usersCollection = database.collection("users");
//     const planCollection = database.collection('plans');
//     const subscriptionCollection = database.collection('subscriptions');

//     console.log("Pinged your deployment. You successfully connected to MongoDB!");

//     /* =========================================================================
//        ১. USER METADATA SYNC & PROFILE MANAGEMENT
//        ========================================================================= */
//     app.post('/api/users/sync', async (req, res) => {
//       try {
//         const { email, name, role, image } = req.body;
//         if (!email) return res.status(400).send({ message: "Email parameter is required." });

//         const filter = { email: email.toLowerCase().trim() };
//         const updateDoc = {
//           $set: {
//             name,
//             role: role || 'client',
//             image,
//             updatedAt: new Date()
//           },
//           $setOnInsert: {
//             createdAt: new Date(),
//             plan: 'lawyer_unverified' // লইয়ারদের জন্য ডিফল্ট প্ল্যান
//           }
//         };

//         const result = await usersCollection.updateOne(filter, updateDoc, { upsert: true });
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Account mapping failed.", error });
//       }
//     });

//     /* =========================================================================
//        ২. LAWYER HIRING HISTORY ENDPOINTS (Inbound Case Requests)
//        ========================================================================= */
//     app.get('/api/lawyer/hirings/:emailOrId', async (req, res) => {
//       try {
//         const param = req.params.emailOrId.toLowerCase().trim();
//         const query = {
//           $or: [
//             { lawyerEmail: param },
//             { lawyerId: param }
//           ]
//         };
//         const result = await hiringsCollection.find(query).sort({ _id: -1 }).toArray();
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Database read failure.", error });
//       }
//     });

//     app.post('/api/hirings', async (req, res) => {
//       try {
//         const hiringData = req.body;
//         const result = await hiringsCollection.insertOne({
//           ...hiringData,
//           status: hiringData.status || 'pending',
//           createdAt: new Date()
//         });
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Failed to register case record.", error });
//       }
//     });

//     app.patch('/api/hirings/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const { status } = req.body;
//         const filter = { _id: new ObjectId(id) };
//         const updateDoc = { $set: { status: status } };
//         const result = await hiringsCollection.updateOne(filter, updateDoc);
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Server mutation rejected status change.", error });
//       }
//     });

//     /* =========================================================================
//        ৩. LAWYER BROWSE & DIRECTORY APIS (Pagination, Search, Filter Included)
//        ========================================================================= */
//     app.get('/api/lawyers', async (req, res) => {
//       try {
//         const query = {};
//         // সার্চ লজিক
//         if (req.query.search) {
//           query.$or = [
//             { name: { $regex: req.query.search, $options: 'i' } },
//             { specialty: { $regex: req.query.search, $options: 'i' } }
//           ];
//         }
//         const result = await lawyerProfilesCollection.find(query).sort({ _id: -1 }).toArray();
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Failed to stream lawyer profiles.", error });
//       }
//     });

//     app.get('/api/lawyers/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const query = { _id: new ObjectId(id) };
//         const result = await lawyerProfilesCollection.findOne(query);
//         if (!result) return res.status(404).send({ message: "Lawyer profile not found." });
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Error targeting profile object.", error });
//       }
//     });

//     /* =========================================================================
//        ৪. PLANS & ONE-TIME PUBLISHING SUBSCRIPTION APIS
//        ========================================================================= */
//     app.get('/api/plans', async (req, res) => {
//       try {
//         const query = {};
//         if (req.query.plan_id) {
//           query.id = req.query.plan_id;
//         }
//         // মক ডেটা রিটার্ন (যদি ডাটাবেজে না থাকে, তবে ফলব্যাক)
//         const mockPlans = {
//           'lawyer_unverified': { id: 'lawyer_unverified', name: 'Unverified Tier', maxServices: 0, price: 0 },
//           'lawyer_premium': { id: 'lawyer_premium', name: 'Verified Professional', maxServices: 10, price: 49 }
//         };
        
//         if (req.query.plan_id) {
//           return res.send(mockPlans[req.query.plan_id] || mockPlans['lawyer_unverified']);
//         }
//         res.send(Object.values(mockPlans));
//       } catch (error) {
//         res.status(500).send({ message: "Failed to resolve plans." });
//       }
//     });

//     app.post('/api/subscriptions', async (req, res) => {
//       try {
//         const data = req.body;
//         const subsInfo = { ...data, createdAt: new Date() };
//         const result = await subscriptionCollection.insertOne(subsInfo);

//         // ইউজারের প্ল্যান আপডেট করা
//         const filter = { email: data.email };
//         const updateDocument = { $set: { plan: data.planId } };
//         await usersCollection.updateOne(filter, updateDocument);
        
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Subscription activation failed." });
//       }
//     });

//     // Baseline check
//     await client.db("admin").command({ ping: 1 });
//     console.log("Database baseline checks verified successfully.");

//   } finally {
//     // Keep connection open
//   }
// }
// run().catch(console.dir);

// app.get('/', (req, res) => {
//   res.send('LegalEase Workflow Optimization Engine Running...');
// });

// app.listen(port, () => {
//   console.log(`Server listening quietly on port ${port}`);
// });

// ***************************************************************

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
    await client.connect();
    const database = client.db("legalease_db");
    
    // কালেকশন সমূহ
    const servicesCollection = database.collection("services");
    const hiringsCollection = database.collection("hirings");
    const lawyerProfilesCollection = database.collection("lawyer_profiles");
    const usersCollection = database.collection("users");
    const planCollection = database.collection('plans');
    const subscriptionCollection = database.collection('subscriptions');

    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    /* =========================================================================
       ১. USER METADATA SYNC & PROFILE MANAGEMENT
       ========================================================================= */
    app.post('/api/users/sync', async (req, res) => {
      try {
        const { email, name, role, image } = req.body;
        if (!email) return res.status(400).send({ message: "Email parameter is required." });

        const filter = { email: email.toLowerCase().trim() };
        const updateDoc = {
          $set: {
            name,
            role: role || 'client',
            image,
            updatedAt: new Date()
          },
          $setOnInsert: {
            createdAt: new Date(),
            plan: 'lawyer_unverified' // লইয়ারদের জন্য ডিফল্ট প্ল্যান
          }
        };

        const result = await usersCollection.updateOne(filter, updateDoc, { upsert: true });
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Account mapping failed.", error });
      }
    });

    /* =========================================================================
       ২. LAWYER HIRING HISTORY ENDPOINTS (Inbound Case Requests)
       ========================================================================= */
    app.get('/api/lawyer/hirings/:emailOrId', async (req, res) => {
      try {
        const param = req.params.emailOrId.toLowerCase().trim();
        const query = {
          $or: [
            { lawyerEmail: param },
            { lawyerId: param }
          ]
        };
        const result = await hiringsCollection.find(query).sort({ _id: -1 }).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Database read failure.", error });
      }
    });

    app.post('/api/hirings', async (req, res) => {
      try {
        const hiringData = req.body;
        const result = await hiringsCollection.insertOne({
          ...hiringData,
          status: hiringData.status || 'pending',
          createdAt: new Date()
        });
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to register case record.", error });
      }
    });

    app.patch('/api/hirings/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const { status } = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = { $set: { status: status } };
        const result = await hiringsCollection.updateOne(filter, updateDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Server mutation rejected status change.", error });
      }
    });

    /* =========================================================================
       ৩. LAWYER BROWSE & DIRECTORY APIS (Pagination, Search, Filter Included)
       ========================================================================= */
    app.get('/api/lawyers', async (req, res) => {
      try {
        const query = {};
        // সার্চ লজিক
        if (req.query.search) {
          query.$or = [
            { name: { $regex: req.query.search, $options: 'i' } },
            { specialty: { $regex: req.query.search, $options: 'i' } }
          ];
        }
        const result = await lawyerProfilesCollection.find(query).sort({ _id: -1 }).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to stream lawyer profiles.", error });
      }
    });

    app.get('/api/lawyers/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await lawyerProfilesCollection.findOne(query);
        if (!result) return res.status(404).send({ message: "Lawyer profile not found." });
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error targeting profile object.", error });
      }
    });

    /* =========================================================================
       ৪. PLANS & ONE-TIME PUBLISHING SUBSCRIPTION APIS
       ========================================================================= */
    app.get('/api/plans', async (req, res) => {
      try {
        const query = {};
        if (req.query.plan_id) {
          query.id = req.query.plan_id;
        }
        // মক ডেটা রিটার্ন (যদি ডাটাবেজে না থাকে, তবে ফলব্যাক)
        const mockPlans = {
          'lawyer_unverified': { id: 'lawyer_unverified', name: 'Unverified Tier', maxServices: 0, price: 0 },
          'lawyer_premium': { id: 'lawyer_premium', name: 'Verified Professional', maxServices: 10, price: 49 }
        };
        
        if (req.query.plan_id) {
          return res.send(mockPlans[req.query.plan_id] || mockPlans['lawyer_unverified']);
        }
        res.send(Object.values(mockPlans));
      } catch (error) {
        res.status(500).send({ message: "Failed to resolve plans." });
      }
    });

    app.post('/api/subscriptions', async (req, res) => {
      try {
        const data = req.body;
        
        // টার্মিনালে ইনকামিং পে-লোড ডেটা দেখার জন্য লগ যোগ করা হয়েছে
        console.log("📥 Received subscription payload from client:", data);

        if (!data.email) {
          return res.status(400).send({ message: "Email is required for subscription activation." });
        }

        const subsInfo = { ...data, createdAt: new Date() };
        const result = await subscriptionCollection.insertOne(subsInfo);

        // ইউজারের প্ল্যান আপডেট করা (ইমেইল ট্রিম এবং লোয়ারকেস হ্যান্ডলিং সহ)
        const filter = { email: data.email.toLowerCase().trim() };
        const updateDocument = { $set: { plan: data.planId } };
        const userUpdate = await usersCollection.updateOne(filter, updateDocument);
        
        console.log("🔄 User plan database update result:", userUpdate);
        
        res.send(result);
      } catch (error) {
        console.error("❌ Subscription error:", error);
        res.status(500).send({ message: "Subscription activation failed." });
      }
    });

    // Baseline check
    await client.db("admin").command({ ping: 1 });
    console.log("Database baseline checks verified successfully.");

  } finally {
    // Keep connection open
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('LegalEase Workflow Optimization Engine Running...');
});

app.listen(port, () => {
  console.log(`Server listening quietly on port ${port}`);
});