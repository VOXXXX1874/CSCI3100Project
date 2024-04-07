import React, { useContext, useState, useEffect, useCallback } from 'react'
import { useContacts } from './ContactsProvider'
import { useSocket } from './SocketProvider'

const ConversationsContext = React.createContext()

export function useConversations() {
  return useContext(ConversationsContext)
}

export function ConversationsProvider({ id, children }) {
  const [conversations, setConversations] = useState([])
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0)
  const { contacts } = useContacts()
  const socket = useSocket()

  // createConversation: 
  // Allows users to create conversation
  function createConversation(recipients) {
    setConversations(prevConversations => {
      return [...prevConversations, { recipients, messages: [] }]
    })
  }

  // addMessageToConversation: 
  // Adds a message to a conversation. If the conversation with the requested recipients already exists, it will add the 
  // new message to the existing conversation. If the conversation does not already exist, it will greate a new conversation object
  // with the desired recipients and new message
  const addMessageToConversation = useCallback(({ recipients, text, sender }) => {
    console.log(text)
    setConversations(prevConversations => {
      let madeChange = false
      const newMessage = { sender, text }
      const newConversations = prevConversations.map(conversation => {
        if (arrayEquality(conversation.recipients, recipients)) {
          madeChange = true
          return {
            ...conversation,
            messages: [...conversation.messages, newMessage]
          }
        }

        return conversation
      })

      if (madeChange) {
        return newConversations
      } else {
        return [
          ...prevConversations,
          { recipients, messages: [newMessage] }
        ]
      }
    })
  }, [setConversations])

  // useEffect: 
  // Runs every render where either 'socket' or 'addMessageToConversation' dependencies have changed
  // If socket is null, return early. If socket is not null, 'receive-message' event listener attached to socket. 
  // When 'receive-message' event is emitted on the socket, addMessageToConversation function is called
  // socket.off removes event listener for 'receive-message' event from socket
  useEffect(() => {
    if (socket == null) return

    socket.on('receive-message', addMessageToConversation)

    return () => socket.off('receive-message')
  }, [socket, addMessageToConversation])

  // sendMessage:
  // emits 'send-message' event to socket with object contaning recipients and text of message
  // Calls addMessageToConversation function to add message to a conversation
  function sendMessage(recipients, text){
    socket.emit('send-message', { recipients, text })

    addMessageToConversation({ recipients, text, sender: id})
  }

  // formattedConversations:
  // recipients: format the recipients of a conversation, creating an object for each recipient { id: recipient, name }
  // messages: format the messages of a conversation, creating an object for each message { ...message, senderName: name, fromMe }
  // selected: boolean variable of whether whether a conversation is currently selected
  // returns formattedConversations, which contains an array of objects of form { ...conversation, messages, recipients, selected }
  const formattedConversations = conversations.map((conversation, index) => {
    const recipients = conversation.recipients.map(recipient => {
        const contact = contacts.find(contact => {
            return contact.id === recipient
        })
        const name = (contact && contact.name) || recipient
        return { id: recipient, name}
    })
    const messages = conversation.messages.map(message=>{
        const contact = contacts.find(contact => {
            return contact.id === message.sender
        })
        const name = (contact && contact.name) || message.sender
        const fromMe = id === message.sender
        return { ...message, senderName: name, fromMe }
    })

    const selected = index === selectedConversationIndex
    return { ...conversation, messages, recipients, selected }
  })

  // value: 
  // All the functions and variables that will be provided by ConversationsContext
  const value = {
    conversations: formattedConversations,
    selectedConversation: formattedConversations[selectedConversationIndex],
    sendMessage,
    selectConversationIndex: setSelectedConversationIndex,
    createConversation
  }

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  )
}

function arrayEquality(a, b){
    if (a.length !== b.length) return false

    a.sort()
    b.sort()

    return a.every((element, index) => {
        return element === b[index]
    })
}