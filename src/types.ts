enum MessageType {
  CONTENT_SCRIPT,
  POPUP,
  SERVICE_WORKER,
  EMPTY,
}

enum MessageCatagory {
  REQUEST,
  RESPONSE,
  EMPTY,
}

type Message = {
  from: MessageType;
  to: MessageType;
  catagory: MessageCatagory;
  signature: string;
  message: any | undefined;
};

export { MessageType, MessageCatagory, type Message };
