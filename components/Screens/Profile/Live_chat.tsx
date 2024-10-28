import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import io, { Socket } from "socket.io-client";
import config from "@/app/api-request/config";

// Define the message type
type Message = {
  text: string;
  sender: string;
  timestamp: string;
};

const ChatScreen = () => {
  // State to store messages
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const socketRef = useRef<Socket | null>(null);

  // Connect to the backend chat server
  useEffect(() => {
    // Initialize socket connection using config
    socketRef.current = io(config.SOCKET_IO_URL);

    // Listen for incoming messages
    socketRef.current.on("receiveMessage", (message: Message) => {
      console.log("Message received:", message); // Log the received message
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the socket connection
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Function to send message
  const sendMessage = () => {
    if (messageText.trim() !== "") {
      const message: Message = {
        text: messageText,
        sender: "user", // You can customize sender info
        timestamp: new Date().toISOString(),
      };

      // Emit the message to the server
      socketRef.current?.emit("sendMessage", message);

      // Add message to local state
      setMessages((prevMessages) => [...prevMessages, message]);

      // Clear the input field
      setMessageText("");
    }
  };

  // Render each message in the chat
  const renderMessage = ({ item }: { item: Message }) => {
    const isUserMessage = item.sender === "user";
    const isBotMessage = item.sender === "bot";

    return (
      <View
        style={[
          styles.messageContainer,
          isUserMessage
            ? styles.userMessage
            : isBotMessage
            ? styles.botMessage
            : styles.otherMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    );
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Chat messages list */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesList}
      />

      {/* Message input and send button */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={messageText}
          onChangeText={(text) => setMessageText(text)}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  messagesList: {
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#4CAF50",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ccc",
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: "#fff",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 50,
    padding: 10,
    marginLeft: 10,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#007BFF", // Different color for bot messages
  },
});

export default ChatScreen;
