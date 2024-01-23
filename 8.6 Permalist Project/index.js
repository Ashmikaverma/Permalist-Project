import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "ashmika",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



async function list(){
  let items=[];
  const result=await db.query("SELECT * FROM items");
  console.log("database setup");
    result.rows.forEach((task)=>{
    items.push(task);
  });
  return items;
}

app.get("/", async(req, res) => {
  const tasks=await list();
  res.render("index.ejs", {
    listTitle: "today",
    listItems: tasks,
  });
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
 
  try{
    await db.query("INSERT INTO items(title)VALUES($1)",[item])
  ;
  res.redirect("/");}
  catch(err){
    console.log(err);
  }
});

app.post("/edit", async(req, res) => {
  const taskTitle=req.body.updatedItemTitle
   const taskId=req.body.updatedItemId;
   try{
    await db.query("UPDATE items SET title=$1 WHERE id=$2",[taskTitle,taskId]);
    res.redirect("/");}
    catch(err){
      console.log(err);
    }
   }
);

app.post("/delete", async(req, res) => {
  const taskId=req.body.deleteItemId;
  try{
  await db.query("DELETE FROM items  WHERE id=$1",[taskId]);
  res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
