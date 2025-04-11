"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"
import { useNavigation } from "@react-navigation/native"

const ChatbotScreen = () => {
  const navigation = useNavigation()
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const flatListRef = useRef(null)

  // Generate a random chat ID for this session
  const [chatId] = useState(() => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  })

  useEffect(() => {
    // Add a welcome message when the screen loads
    setChatHistory([
      {
        id: Date.now().toString(),
        text: "Hello! I'm your AI assistant. How can I help you today?",
        isUser: false,
        sources: [],
      },
    ])
  }, [])

  const sendMessage = async () => {
    if (message.trim() === "") return

    const userMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      sources: [],
    }

    setChatHistory((prevHistory) => [...prevHistory, userMessage])
    setMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("https://intelligent-agent-mu.vercel.app/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          question: userMessage.text,
        }),
      })

      const data = await response.json()

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response || "I'm sorry, I couldn't process your request.",
        isUser: false,
        sources: data.sources || [],
      }

      setChatHistory((prevHistory) => [...prevHistory, botMessage])
    } catch (error) {
      console.error("Error sending message:", error)

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, there was an error processing your request. Please try again.",
        isUser: false,
        sources: [],
      }

      setChatHistory((prevHistory) => [...prevHistory, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const renderChatItem = ({ item }) => {
    return (
      <View style={[styles.messageContainer, item.isUser ? styles.userMessageContainer : styles.botMessageContainer]}>
        <Text style={[styles.messageText, item.isUser ? styles.userMessageText : styles.botMessageText]}>
          {item.text}
        </Text>

        {item.sources && item.sources.length > 0 && (
          <View style={styles.sourcesContainer}>
            <Text style={styles.sourcesTitle}>Sources:</Text>
            {item.sources.map((source, index) => (
              <View key={index} style={styles.sourceItem}>
                <Text style={styles.sourceText}>{source}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Icon name="bars" size={38} color="#E63946" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>AI Assistant</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={chatHistory}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1D3557" />
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={isLoading || message.trim() === ""}>
          <Icon name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#A8DADC",
  },
  menuButton: {
    marginRight: 8,
    marginTop: 20,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1D3557",
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 20,
    marginBottom: 12,
  },
  userMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#1D3557",
    borderTopRightRadius: 4,
  },
  botMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#A8DADC",
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  botMessageText: {
    color: "#1D3557",
  },
  sourcesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  sourcesTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
    color: "#F1FAEE",
  },
  sourceItem: {
    marginVertical: 2,
  },
  sourceText: {
    fontSize: 12,
    color: "#F1FAEE",
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#A8DADC",
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 2,
    borderColor: "#1D3557",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: "#F1FAEE",
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E63946",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  loadingContainer: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 20,
  },
})

export default ChatbotScreen
