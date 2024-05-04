import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider'

/* The Conversations component is used to display the list of conversations
    The component takes the conversations and selectConversationIndex function from the ConversationsProvider context
    The component displays the list of conversations
    The component displays the list of recipients in each conversation
    The component highlights the selected conversation
*/
export default function Conversations() {

    const { conversations, selectConversationIndex } = useConversations()

    return (
        <ListGroup variant="flush">
            {conversations.map((conversation, index) => (
                <ListGroup.Item 
                    key={index}
                    action 
                    onClick = {() => selectConversationIndex(index)}
                    active={conversation.selected}
                >
                    {conversation.recipients.map(recipients => recipients.name).join(', ')}
                </ListGroup.Item>
            ))}
        </ListGroup>
    )
}
