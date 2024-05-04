import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { useContacts } from '../contexts/ContactsProvider'

/* The Contacts component is used to display the list of contacts
    The component takes the contacts from the ContactsProvider context
    The component displays the list of contacts
*/
export default function Contacts() {

    const { contacts } = useContacts()

    return (
        <ListGroup variant="flush">
            {contacts.map(contact => (
                <ListGroup.Item key = {contact.id}>
                    {contact.name}
                </ListGroup.Item>
            ))}
        </ListGroup>
    )
}
