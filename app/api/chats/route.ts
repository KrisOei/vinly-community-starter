import { NextRequest, NextResponse } from "next/server";
import { chats, chatMessages, users } from "@/preview/mocks/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const chatId = searchParams.get("id");

  if (chatId) {
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const messages = chatMessages
      .filter((m) => m.chatId === chatId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((m) => {
        const author = users.find((u) => u.id === m.createdById);
        return {
          ...m,
          author: author ? { id: author.id, name: author.name, profilePictureUrl: author.profilePictureUrl } : null,
        };
      });

    const participants = chat.participants.map((p) => {
      const user = users.find((u) => u.id === p.userId);
      return {
        ...p,
        user: user ? { id: user.id, name: user.name, title: user.title, profilePictureUrl: user.profilePictureUrl } : null,
      };
    });

    return NextResponse.json({
      chat: {
        ...chat,
        participants,
        messages,
      },
    });
  }

  const chatList = chats.map((chat) => {
    const participants = chat.participants.map((p) => {
      const user = users.find((u) => u.id === p.userId);
      return {
        ...p,
        user: user ? { id: user.id, name: user.name, title: user.title, profilePictureUrl: user.profilePictureUrl } : null,
      };
    });

    const lastMessageAuthor = chat.lastMessage
      ? users.find((u) => u.id === chat.lastMessage!.createdById)
      : null;

    return {
      id: chat.id,
      name: chat.name,
      groupChat: chat.groupChat,
      participants,
      lastMessage: chat.lastMessage
        ? {
            ...chat.lastMessage,
            author: lastMessageAuthor ? { id: lastMessageAuthor.id, name: lastMessageAuthor.name } : null,
          }
        : null,
      unreadCount: chat.unreadCount,
      updatedAt: chat.updatedAt,
    };
  });

  chatList.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return NextResponse.json({
    chats: chatList,
    total: chatList.length,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { participantIds, message, name } = body;

  if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
    return NextResponse.json({ error: "participantIds is required" }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const mockChat = {
    id: `chat_${Date.now().toString(36)}`,
    name: name || null,
    groupChat: participantIds.length > 1,
    participants: [
      { userId: users[0].id, role: "admin" as const },
      ...participantIds.map((id: string) => ({ userId: id, role: "user" as const })),
    ],
    lastMessage: {
      content: message,
      createdById: users[0].id,
      createdAt: new Date().toISOString(),
    },
    unreadCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ chat: mockChat }, { status: 201 });
}
