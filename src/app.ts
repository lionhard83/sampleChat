import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import uniqid from "uniqid";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

type Message = { author: string; text: string };
type Chat = { name: string; id: string; messages: Message[] };

const chats: Chat[] = [
  {
    name: "Fantacalcio",
    messages: [
      { author: "Carlo", text: "Ciao come stai?" },
      {
        author: "Mimmo",
        text: "Ciao, Bene grazie, tu?",
      },
      {
        author: "Carlo",
        text: "Bene anch'io",
      },
    ],
    id: "pippo",
  },
  { name: "Fantarugby", messages: [], id: "caio" },
];

app.get("/", (_: Request, res: Response) => {
  res.send("Server is running");
});

// /chats?name=ciao
app.get("/chats", ({ query: { name } }: Request, res: Response) => {
  if (name) {
    res.json(
      chats.filter((chat) =>
        chat.name.toLowerCase().includes((name as string).toLowerCase())
      )
    );
  } else {
    res.json(chats);
  }
});

app.get("/chats/:id", (req: Request, res: Response) => {
  const chat = chats.find((chat) => chat.id === req.params.id);
  if (chat) {
    res.json(chat);
  } else {
    res.status(404).json({ message: "Chat not found" });
  }
});

app.get(
  "/chats/:id/messages",
  ({ params: { id }, query: { text } }: Request, res: Response) => {
    const chat = chats.find((chat) => chat.id === id);
    if (chat) {
      if (text) {
        res.json(
          chat.messages.filter(({ text: textInMessage }) =>
            textInMessage.toLowerCase().includes((text as string).toLowerCase())
          )
        );
      } else {
        res.json(chat.messages);
      }
    } else {
      res.status(404).json({ message: "Chat not found" });
    }
  }
);

app.post("/chats", (req: Request, res: Response) => {
  const { name } = req.body;
  const newChat = { name, id: uniqid(), messages: [] };
  chats.push(newChat);
  res.json(newChat);
});

// app.get("/chats/:id/messages"

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
