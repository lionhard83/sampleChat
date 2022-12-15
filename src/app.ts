import express, { raw, Request, Response } from "express";
import bodyParser from "body-parser";
import uniqid from "uniqid";

console.log(uniqid());

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

type Message = { author: string; text: string };
type Chat = { name: string; id: string; messages: Message[] };

const chats: Chat[] = [];
console.log("chats:", chats);

app.get("/", (_: Request, res: Response) => {
  res.send("Server is running");
});

app.get("/chats", (_: Request, res: Response) => {
  res.json(chats);
});

app.get("/chats/:id", (req: Request, res: Response) => {
  const chat = chats.find((chat) => chat.id === req.params.id);
  if (chat) {
    res.json(chat);
  } else {
    res.status(404).json({ message: "Chat not found" });
  }
});

app.post("/chats", (req: Request, res: Response) => {
  const { name } = req.body;
  const newChat = { name, id: uniqid(), messages: [] };
  chats.push(newChat);
  res.json(newChat);
});

app.post("/chats/:id/messages", (req: Request, res: Response) => {
  const { author, text } = req.body;
  const chat = chats.find((chat) => chat.id === req.params.id);
  if (chat) {
    chat.messages.push({ author, text });
    res.json(chat);
  } else {
    res.status(404).json({ message: "Chat not found" });
  }
});

app.listen(3000, () => console.log("Server is running"));
