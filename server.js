const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const { createCanvas, loadImage } = require("canvas");
const app = express();
const fs = require("fs");
const lowDb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const s3Actions = require("./s3Actions");
var multer = require("multer");
const archiver = require("archiver");

var rimraf = require("rimraf");
var path = require("path");

require("dotenv").config({ path: "./config.env" });
// Uncomment for Database connection
// const dbo = require("./DB/connection");

const db = lowDb(new FileSync("./src/traffic.json"));

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
const port = 8443;

const dirTree = require("directory-tree");

// app.get("/", (req, res) => {
//   res.send("Working");
// });

app.post("/renameFile", (req, res) => {
  fs.rename(req.body.from, req.body.to, function (err) {
    if (err) console.log("ERROR: " + err);
  });
  return res.send("done");
});

app.get("/getFolderTree", (req, res) => {
  const uuid = req.query.uuid;
  const tree = dirTree(`src/EditingPage/layers/${uuid}`);
  res.send(JSON.stringify(tree));
});

app.get("/getTotalUsers", (req, res) => {
  const data = db.get("TotalUsers").value();
  return res.json(data);
});

app.get("/getTotalItems", (req, res) => {
  const data = db.get("TotalItems").value();
  return res.json(data);
});

const dest = `src/EditingPage/layers/`;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    if (fs.existsSync(`${dest}/${file.fieldname}`)) {
      cb(null, `${file.fieldname}/${file.originalname}`);
    } else {
      fs.mkdirSync(`${dest}/${file.fieldname}`, { recursive: true });
      cb(null, `${file.fieldname}/${file.originalname}`);
    }
  },
});

const fields = [];
var filePaths = new Set();

var upload = multer({
  limits: { fileSize: 100 * 1000 * 1000 },
  storage: storage,
}).fields(fields);

app.post("/uploadFiles", (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500).json(err);
    } else if (err) {
      // fs.rmdir(
      //   `./src/EditingPage/layers/${uuid}`,
      //   { recursive: true },
      //   (err) => {
      //     if (err) {
      //       return console.log("error occurred in deleting directory", err);
      //     }

      //     console.log("Directory deleted successfully");
      //   }
      // );
      console.log(err);
      return res.status(500).json(err);
    }

    return res.status(200).send(req.file);
  });
});

app.post("/uploadPath", (req, res) => {
  req.body.forEach((file) => {
    const filePath = file.path.split("/")[1];
    const hashKey = file.uuid;
    filePaths.add(hashKey + "/" + filePath);
  });

  filePaths.forEach((file) => {
    fields.push({ name: file });
  });
  return res.send(true);
});

app.post("/deleteLocalFiles", (req, res) => {
  const data = req.body;
  const uuid = data.uuid;
  fs.rmdir(`./src/EditingPage/layers/${uuid}`, { recursive: true }, (err) => {
    if (err) {
      return console.log("error occurred in deleting directory", err);
    }

    console.log("Directory deleted successfully");
  });
  return res.status(200).json("Success");
});

const wr = (w) => {
  const cw = [];
  for (let i = 0; i < w.length; i += 1) {
    cw[i] = w[i] + (cw[i - 1] || 0);
  }

  const mcw = cw[cw.length - 1];
  const rn = mcw * Math.random();

  for (let i = 0; i < w.length; i += 1) {
    if (cw[i] >= rn) {
      return i;
    }
  }
};

app.post("/submitDetails", (request, response) => {
  const data = request.body;
  const uuid = data.uuid;
  const tree = data.folderTree;
  const width = data.canvasWidth;
  const height = data.canvasHeight;
  const canvas = createCanvas(width, height);
  const metadata = [];
  const newData = [];
  const name = data.name;
  const symbol = data.symbol;
  const creators = data.creators;
  const collection = data.collection;
  const seller_fee_basis_points = data.royaltyFee;
  const description = data.description;
  const URL = data.URL;
  const context = canvas.getContext("2d", {
    patternQuality: "bilinear",
    quality: "bilinear",
  });
  var startDate = new Date();

  const layerData = [];

  data &&
    data.objects.map((obj) => {
      layerData.push(obj);
    });

  // sorting based on depth
  layerData &&
    layerData.sort((a, b) => {
      return a.depth - b.depth;
    });

  var values = data.total.value;
  console.log(values, "valuess");

  if (values > 10000) {
    return;
  }

  const folderLayers = tree.children;

  const finalLayers = [];

  // sorting the tree layers based on depth
  layerData.forEach((item) => {
    finalLayers.push(folderLayers.filter((obj) => obj.name === item.name)[0]);
  });
  tree.children = finalLayers;

  if (fs.existsSync(`generated/${uuid}`) === false) {
    fs.mkdirSync(`generated/${uuid}`, { recursive: true });
  }
  // console.log(tree.children, "tree.children");
  while (values) {
    var hash = 0;
    let objRarity = 0;
    let totalRarity = 0;
    var attributesArray = [];

    // eslint-disable-next-line no-loop-func
    tree.children.forEach(async (item, index) => {
      const weights = [];
      // console.log("item: ", item.children);
      item.children.forEach((item) => {
        // console.log("item rarity: ", typeof item.rarity);
        // console.log("item rarity: ", item.rarity);
        if (typeof item.rarity === "string") {
          // console.log("Parse Int");
          weights.push(item.rarity ? parseInt(item.rarity) : 0);
        } else {
          // console.log("Not Parse Int");
          weights.push(item.rarity ? item.rarity : 0);
        }
        // weights.push(item.rarity ? item.rarity : 0);
      });
      // console.log("weights: ", weights);
      const idx = wr(weights);
      // console.log("idx: ", idx);
      const obj = item.children[idx];
      // console.log("Obj: ", obj);
      let pathArray = obj?.path?.split("\\");
      // console.log(obj?.path?.split("\\"), "obj.path");
      // console.log(pathArray, "pathArray");

      let numArr = pathArray?.length - 2;
      if (!numArr) {
        return;
      }
      // console.log("numArr", numArr);
      let traitType = pathArray[numArr === undefined ? 0 : numArr];
      // console.log("Trait Type: ", traitType);
      attributesArray.push({
        traitType: traitType,
        value: obj.name.replace(".png", ""),
      });
      if (attributesArray.length === tree.children.length) {
        newData.push([...attributesArray]);
      }

      objRarity += item.children[idx].rarity
        ? parseInt(item.children[idx].rarity)
        : 50;
      totalRarity += 100;

      const image = await loadImage(`./${obj.path}`);

      context.drawImage(
        image,
        JSON.parse(layerData[index].x),
        JSON.parse(layerData[index].y),
        JSON.parse(layerData[index].width),
        JSON.parse(layerData[index].height)
      );
      const buffer = canvas.toBuffer("image/png", 0);
      fs.writeFileSync(
        __dirname + `/generated/${uuid}/${hash - 1}.png`,
        buffer
      );
      if (tree.children.length === index + 1) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        const rarityPercentage = (objRarity / totalRarity) * 100;
        // Metadata Generation
        let num = hash - 1;
        const dataImage = {
          name: `${name} #${num}`,
          symbol,
          description: description,
          seller_fee_basis_points: seller_fee_basis_points * 100,

          // external_link: URL,
          image: `${num}.png`,
          attributes: newData[num],
          properties: {
            category: "image",
            creators: creators,
            files: [{ uri: `${num}.png`, type: "image/png" }],
          },

          collection: { name: collection },
          // traits: {
          //   rarity: rarityPercentage,
          // },
        };
        let newFile = JSON.stringify(dataImage);
        fs.writeFile(
          `generated/${uuid}/${num}.json`,
          newFile,
          "utf8",
          function (err) {
            if (err) {
              console.log(
                "An error occured while writing JSON Object to File."
              );
              return console.log(err);
            }
          }
        );
        metadata.push(dataImage);
        if (hash === data.total.value) {
          const jsonContent = JSON.stringify(metadata);
          fs.writeFile(
            `generated/${uuid}/metadata.json`,
            jsonContent,
            "utf8",
            function (err) {
              if (err) {
                console.log(
                  "An error occured while writing JSON Object to File."
                );
                return console.log(err);
              }
              // console.log(newData, "newData");
              console.log("JSON file has been saved.");
            }
          );
          return response.json("Success").status(200);
        }

        hash += 1;
      }
    });

    hash += 1;
    values -= 1;
  }
  var endDate = new Date();
  var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
  console.log("The total Time Taken was : ", seconds);
  const totalUsers = db.get("TotalUsers").value() + 1;
  const totalItems = db.get("TotalItems").value();
  db.set("TotalUsers", totalUsers).write();
  db.set("TotalItems", data.total.value + totalItems).write();
});

app.get("/compress", (req, res) => {
  const uuid = req.query.uuid;
  const output = fs.createWriteStream(`generated/${uuid}.zip`);
  const archive = archiver("zip");

  archive.on("error", function (err) {
    res.status(500).send({ error: err.message });
  });

  //on stream closed we can end the request
  archive.on("end", function () {
    console.log("Archive wrote %d bytes", archive.pointer());
  });

  //set the archive name
  res.attachment(`${uuid}.zip`);

  //this is the streaming magic
  archive.pipe(output);

  archive.directory(`generated/${uuid}`, `${uuid}`);

  archive.finalize();

  return res.status(200).json("Success");
});

app.get("/upload", (req, res, next) => {
  const uuid = req.query.uuid;

  s3Actions.uploadFile(`generated/${uuid}.zip`, res);
});

app.get("/resolveFiles", function (req, res, next) {
  const uuid = req.query.uuid;

  // fs.unlink(`./generated/${uuid}.zip`, function (err) {
  //   if (err) throw err;
  //   console.log("File deleted!");
  // });

  return res.status(200).json("Success");
});

var uploadsDir = __dirname + "/generated";
fs.readdir(uploadsDir, function (err, files) {
  files.forEach(function (file, index) {
    fs.stat(path.join(uploadsDir, file), function (err, stat) {
      var endTime, now;
      if (err) {
        return console.log(err);
      }
      now = new Date().getTime();
      endTime = new Date(stat.ctime).getTime() + 3600000;
      if (now > endTime) {
        return rimraf(path.join(uploadsDir, file), function (err) {
          if (err) {
            return console.log(err);
          }
          console.log("successfully deleted");
        });
      }
    });
  });
});

var layerDir = __dirname + "/src/EditingPage/layers";
fs.readdir(layerDir, function (err, files) {
  files.forEach(function (file, index) {
    fs.stat(path.join(layerDir, file), function (err, stat) {
      var endTime, now;
      if (err) {
        return console.log(err);
      }
      now = new Date().getTime();
      endTime = new Date(stat.ctime).getTime() + 5400000;
      if (now > endTime) {
        return rimraf(path.join(layerDir, file), function (err) {
          if (err) {
            return console.log(err);
          }
          console.log("successfully deleted layers");
        });
      }
    });
  });
});

app.use("/", express.static(path.join(__dirname, "src/EditingPage/")));
app.use("/", express.static(path.join(__dirname, "generated/")));
app.use(express.static("./build"));
app.all("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});
app.listen(port, () => {
  // Uncommented for connecting to mongoDB
  // dbo.connectToServer(function (err) {
  //   if (err) console.error(err);
  // });
  console.log(`Server is running on port: ${port}`);
  // console.log(`Example app listening at http://sickalien.store:${port}`);
  console.log(`Example app listening at http://localhost:${port}`);
});

//s3Actions.uploadFile("uuid/src/EditingPage/layers/ball/red eye ball_sr.png");
//uploadFile("src/EditingPage/layers/ball/white eye ball.png");
//s3Actions.emptyS3Directory(process.env.BUCKET_NAME, "src/");
// tree &&
//   tree.children &&
//   tree.children.forEach((items) => {
//     items &&
//       items.children &&
//       items.children.forEach((item) => s3Actions.uploadFile(item.path));
//   });

// OLD LOCAL

// const express = require("express");
// var cors = require("cors");
// const bodyParser = require("body-parser");
// const { createCanvas, loadImage } = require("canvas");
// const app = express();
// const fs = require("fs");
// const lowDb = require("lowdb");
// const FileSync = require("lowdb/adapters/FileSync");
// const s3Actions = require("./s3Actions");
// var multer = require("multer");
// const archiver = require("archiver");

// var path = require("path");

// require("dotenv").config({ path: "./config.env" });
// // Uncomment for Database connection
// // const dbo = require("./DB/connection");

// const db = lowDb(new FileSync("./src/traffic.json"));

// //Here we are configuring express to use body-parser as middle-ware.
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.use(cors());
// const port = 8443;

// const dirTree = require("directory-tree");

// // app.get("/", (req, res) => {
// //   res.send("Working");
// // });

// app.post("/renameFile", (req, res) => {
//   fs.rename(req.body.from, `${req.body.to}.png`, function (err) {
//     if (err) console.log("ERRORs: " + err);
//   });
//   return res.send("done");
// });

// app.get("/getFolderTree", (req, res) => {
//   const uuid = req.query.uuid;
//   const tree = dirTree(`src/EditingPage/layers/${uuid}`);
//   res.send(JSON.stringify(tree));
// });

// app.get("/getTotalUsers", (req, res) => {
//   const data = db.get("TotalUsers").value();
//   return res.json(data);
// });

// app.get("/getTotalItems", (req, res) => {
//   const data = db.get("TotalItems").value();
//   return res.json(data);
// });

// const dest = `src/EditingPage/layers/`;

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, dest);
//   },
//   filename: function (req, file, cb) {
//     if (fs.existsSync(`${dest}/${file.fieldname}`)) {
//       cb(null, `${file.fieldname}/${file.originalname}`);
//     } else {
//       fs.mkdirSync(`${dest}/${file.fieldname}`, { recursive: true });
//       cb(null, `${file.fieldname}/${file.originalname}`);
//     }
//   },
// });

// const fields = [];
// var filePaths = new Set();

// var upload = multer({
//   limits: { fileSize: 10485760 },
//   storage: storage,
// }).fields(fields);

// app.post("/uploadFiles", (req, res) => {
//   upload(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//       console.log(err);
//       return res.status(500).json(err);
//     } else if (err) {
//       // fs.rmdir(
//       //   `./src/EditingPage/layers/${uuid}`,
//       //   { recursive: true },
//       //   (err) => {
//       //     if (err) {
//       //       return console.log("error occurred in deleting directory", err);
//       //     }

//       //     console.log("Directory deleted successfully");
//       //   }
//       // );
//       console.log(err);
//       return res.status(500).json(err);
//     }

//     return res.status(200).send(req.file);
//   });
// });

// app.post("/uploadPath", (req, res) => {
//   req.body.forEach((file) => {
//     const filePath = file.path.split("/")[1];
//     const hashKey = file.uuid;
//     filePaths.add(hashKey + "/" + filePath);
//   });

//   filePaths.forEach((file) => {
//     fields.push({ name: file });
//   });
//   return res.send(true);
// });

// app.post("/deleteLocalFiles", (req, res) => {
//   const data = req.body;
//   const uuid = data.uuid;
//   fs.rmdir(`./src/EditingPage/layers/${uuid}`, { recursive: true }, (err) => {
//     if (err) {
//       return console.log("error occurred in deleting directory", err);
//     }

//     console.log("Directory deleted successfully");
//   });
//   return res.status(200).json("Success");
// });

// const wr = (w) => {
//   const cw = [];
//   for (let i = 0; i < w.length; i += 1) {
//     cw[i] = w[i] + (cw[i - 1] || 0);
//   }

//   const mcw = cw[cw.length - 1];
//   const rn = mcw * Math.random();

//   for (let i = 0; i < w.length; i += 1) {
//     if (cw[i] >= rn) {
//       return i;
//     }
//   }
// };

// app.post("/submitDetails", (request, response) => {
//   const data = request.body;
//   const uuid = data.uuid;
//   const tree = data.folderTree;
//   // console.log("Tree: ", tree.children[0].children);
//   const width = data.canvasWidth;
//   const height = data.canvasHeight;
//   const canvas = createCanvas(width, height);
//   const metadata = [];
//   const newData = [];
//   const name = data.name;
//   const symbol = data.symbol;
//   const creators = data.creators;
//   const collection = data.collection;
//   const seller_fee_basis_points = data.sellerFee;
//   const description = data.description;
//   const URL = data.URL;
//   const context = canvas.getContext("2d", {
//     patternQuality: "bilinear",
//     quality: "bilinear",
//   });
//   var startDate = new Date();

//   const layerData = [];

//   data &&
//     data.objects.map((obj) => {
//       layerData.push(obj);
//     });

//   // sorting based on depth
//   layerData &&
//     layerData.sort((a, b) => {
//       return a.depth - b.depth;
//     });

//   var values = data.total.value;

//   if (values > 10000) {
//     return;
//   }

//   const folderLayers = tree.children;

//   const finalLayers = [];

//   // sorting the tree layers based on depth
//   layerData.forEach((item) => {
//     finalLayers.push(folderLayers.filter((obj) => obj.name === item.name)[0]);
//   });
//   tree.children = finalLayers;

//   if (fs.existsSync(`generated/${uuid}`) === false) {
//     fs.mkdirSync(`generated/${uuid}`, { recursive: true });
//   }

//   while (values) {
//     var hash = 0;
//     let objRarity = 0;
//     let totalRarity = 0;
//     var attributesArray = [];

//     // eslint-disable-next-line no-loop-func
//     tree.children.forEach(async (item, index) => {
//       const weights = [];
//       // const NoneObj = {
//       //   path: `src\\assets\\aloo\\None.png`,
//       //   name: "None.png",
//       //   rarity: "100",
//       // };

//       // let newArr = item.children;
//       // newArr.push(NoneObj);
//       // item.children = item.children.push(NoneObj);
//       // console.log("Item.children: ", item.children);
//       item.children.forEach((item) => {
//         // console.log("Item: ", item);
//         weights.push(item?.rarity ? item?.rarity : 50);
//       });
//       // newArr.forEach((item) => {
//       //   weights.push(item.rarity ? item.rarity : 50);
//       // });

//       const idx = wr(weights);

//       const obj = item.children[idx];
//       // const obj = newArr[idx];
//       // console.log("Obj: ", obj);
//       // console.log("Obj.path: ", obj.path);

//       let pathArray = obj.path.split("\\");
//       let traitType = pathArray[pathArray.length - 2];
//       // console.log(traitType, "traitType");
//       // console.log(obj.name, "obj_Name");
//       attributesArray.push({ traitType, value: obj.name.replace(".png", "") });
//       if (attributesArray.length === tree.children.length) {
//         newData.push([...attributesArray]);
//       }

//       objRarity += item.children[idx].rarity
//         ? parseInt(item.children[idx].rarity)
//         : 50;
//       // objRarity += newArr[idx].rarity ? parseInt(newArr[idx].rarity) : 50;
//       totalRarity += 100;

//       const image = await loadImage(`./${obj.path}`);

//       context.drawImage(
//         image,
//         JSON.parse(layerData[index].x),
//         JSON.parse(layerData[index].y),
//         JSON.parse(layerData[index].width),
//         JSON.parse(layerData[index].height)
//       );
//       const buffer = canvas.toBuffer("image/png", 0);
//       // console.log("CHeck");
//       fs.writeFileSync(
//         __dirname + `/generated/${uuid}/${hash - 1}.png`,
//         buffer
//       );
//       if (tree.children.length === index + 1) {
//         context.clearRect(0, 0, canvas.width, canvas.height);
//         const rarityPercentage = (objRarity / totalRarity) * 100;
//         // Metadata Generation
//         let num = hash - 1;
//         const dataImage = {
//           name: `${name} #${num}`,
//           symbol,
//           seller_fee_basis_points,
//           description: description,
//           external_link: URL,
//           attributes: newData[num],
//           properties: {
//             files: [{ uri: `${num}.png`, type: "image/png" }],
//             category: "image",
//             creators: creators,
//           },
//           collection: { name: collection },
//           traits: {
//             rarity: rarityPercentage,
//           },
//         };
//         let newFile = JSON.stringify(dataImage);
//         fs.writeFile(
//           `generated/${uuid}/${num}.json`,
//           newFile,
//           "utf8",
//           function (err) {
//             if (err) {
//               console.log(
//                 "An error occured while writing JSON Object to File."
//               );
//               return console.log(err);
//             }
//           }
//         );
//         metadata.push(dataImage);
//         if (hash === data.total.value) {
//           const jsonContent = JSON.stringify(metadata);
//           fs.writeFile(
//             `generated/${uuid}/metadata.json`,
//             jsonContent,
//             "utf8",
//             function (err) {
//               if (err) {
//                 console.log(
//                   "An error occured while writing JSON Object to File."
//                 );
//                 return console.log(err);
//               }
//               // console.log(newData, "newData");
//               console.log("JSON file has been saved.");
//             }
//           );
//           return response.json("Success").status(200);
//         }

//         hash += 1;
//       }
//     });

//     hash += 1;
//     values -= 1;
//   }
//   var endDate = new Date();
//   var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
//   console.log("The total Time Taken was : ", seconds);
//   const totalUsers = db.get("TotalUsers").value() + 1;
//   const totalItems = db.get("TotalItems").value();
//   db.set("TotalUsers", totalUsers).write();
//   db.set("TotalItems", data.total.value + totalItems).write();
// });

// app.get("/compress", async (req, res) => {
//   console.log("Check");
//   const uuid = req.query.uuid;

//   console.log(uuid, "uudo");

//   // const compressing = async () => {
//   const output = fs.createWriteStream(`generated/${uuid}.zip`);
//   const archive = archiver("zip");

//   archive.on("error", function (err) {
//     res.status(500).send({ error: err.message });
//   });

//   output.on("close", function () {
//     console.log(archive.pointer(), "total bytes");
//   });
//   //on stream closed we can end the request
//   archive.on("end", function () {
//     console.log("Archive wrote %d bytes", archive.pointer());
//   });
//   archive.on("error", function (errr) {
//     console.log(errr, "erooor");
//   });

//   //this is the streaming magic
//   archive.pipe(output);

//   archive.directory(`generated/${uuid}`, `${uuid}`);
//   // archive.directory(`generated/new${uuid}/${uuid}`, `whatsforlaunchartgen`);

//   archive.finalize();
//   // };

//   // console.log(compressing(), "compressing");

//   // await compressing().then(() => {
//   //   res.attachment("whatsforlaunchartgen.zip");
//   // });

//   console.log("done dona done");
//   // whatsforlaunchartgen
//   // fs.rename()
//   // if (!fs.existsSync(`generated/new${uuid}`)) {
//   //   console.log("CHecking");
//   //   // Do something
//   //   fs.mkdirSync(`generated/new${uuid}`);
//   // }
//   // fs.rename(
//   //   `generated/${uuid}`,
//   //   `generated/new${uuid}/whatsforlaunchartgen`,
//   //   (err) => {
//   //     // res.status(500).send({ error: err });
//   //     console.log("Error: ", err);
//   //   }
//   // );

//   // const output = fs.createWriteStream(
//   //   `generated/${uuid}/whatsforlaunchartgen.zip`
//   // );
//   // const archive = archiver("zip");

//   // archive.on("error", function (err) {
//   //   res.status(500).send({ error: err.message });
//   // });

//   //on stream closed we can end the request
//   // archive.on("end", function () {
//   //   console.log("Archive wrote %d bytes", archive.pointer());
//   // });

//   //this is the streaming magic
//   // archive.pipe(output);

//   // archive.directory(`generated/${uuid}`, `${uuid}`);
//   // archive.directory(`generated/new${uuid}/${uuid}`, `whatsforlaunchartgen`);

//   // archive.finalize();

//   // output.on("finish", () => {
//   //   res.attachment("whatsforlaunchartgen.zip");
//   // });
//   // console.log("Check: ", check);
//   //set the archive name
//   // res.attachment(`${uuid}.zip`);

//   // return res.status(200).json("Success");
// });

// app.get("/upload", (req, res, next) => {
//   const uuid = req.query.uuid;

//   s3Actions.uploadFile(`generated/${uuid}.zip`, res);
// });

// app.get("/resolveFiles", function (req, res, next) {
//   const uuid = req.query.uuid;

//   // fs.unlink(`./generated/${uuid}.zip`, function (err) {
//   //   if (err) throw err;
//   //   console.log("File deleted!");
//   // });

//   return res.status(200).json("Success");
// });
// app.use("/", express.static(path.join(__dirname, "src/EditingPage/")));
// app.use("/", express.static(path.join(__dirname, "generated/")));
// app.use(express.static("./build"));
// app.all("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "build", "index.html"));
// });
// app.listen(port, () => {
//   // Uncommented for connecting to mongoDB
//   // dbo.connectToServer(function (err) {
//   //   if (err) console.error(err);
//   // });
//   console.log(`Server is running on port: ${port}`);
//   // console.log(`Example app listening at http://sickalien.store:${port}`);
//   console.log(`Example app listening at http://localhost:${port}`);
// });

// //s3Actions.uploadFile("uuid/src/EditingPage/layers/ball/red eye ball_sr.png");
// //uploadFile("src/EditingPage/layers/ball/white eye ball.png");
// //s3Actions.emptyS3Directory(process.env.BUCKET_NAME, "src/");
// // tree &&
// //   tree.children &&
// //   tree.children.forEach((items) => {
// //     items &&
// //       items.children &&
// //       items.children.forEach((item) => s3Actions.uploadFile(item.path));
// //   });
