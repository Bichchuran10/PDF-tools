const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const multer = require("multer");
const { mergePdfs } = require("./merge");
const upload = multer({ dest: "uploads/" });
app.use("/static", express.static("public"));

const port = 3000;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "templates/index.html"));
});

app.post("/merge", upload.array("pdfs", 2), async (req, res, next) => {
  console.log(req.files);
  //   console.log(req);
  let d = await mergePdfs(
    path.join(__dirname, req.files[0].path),
    path.join(__dirname, req.files[1].path)
  );
  const filePaths = req.files.map((file) => file.path);
  // Delete the uploaded files
  filePaths.forEach((filePath) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(`Error deleting file: ${filePath}`, err);
      } else {
        console.log(`Deleted file: ${filePath}`);
      }
    });
  });

  res.redirect(`http://localhost:3000/static/${d}.pdf`);
  //   res.redirect(`/${d}.pdf`);

  //   res.send({ data: req.files });
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
});

app.listen(port, () => {
  console.log(`app listening on port http://localhost:${port}`);
});
