import { Box, Flex, Title, media } from "@artsy/palette"
import { Conversation_me } from "v2/__generated__/Conversation_me.graphql"
import { AppContainer } from "v2/Apps/Components/AppContainer"
import { ConversationFragmentContainer as Conversation } from "v2/Apps/Conversation/Components/Conversation"
import { ConversationsFragmentContainer as Conversations } from "v2/Apps/Conversation/Components/Conversations"
import { findCurrentRoute } from "v2/Artsy/Router/Utils/findCurrentRoute"
import { Match } from "found"
import React, { useState } from "react"
import { RelayRefetchProp, createRefetchContainer, graphql } from "react-relay"
import { Media } from "v2/Utils/Responsive"
import { DetailsFragmentContainer as Details } from "../../Components/Details"
import styled from "styled-components"
interface ConversationRouteProps {
  me: Conversation_me
  conversationID: string
  match: Match
  relay: RelayRefetchProp
}

const ConstrainedHeightContainer = styled(Box)`
  height: calc(100vh - 60px);
`

const ConversationContainer = styled(Flex)`
  height: 100%;
  ${media.lg`
    height: 100%;
  `}
  & > * {
    overflow-x: hidden;
    overflow-y: auto;
  }
  & > .fresnel-greaterThan-sm {
    flex-shrink: 0;
  }
`

export const ConversationRoute: React.FC<ConversationRouteProps> = props => {
  const { me } = props
  const [showDetails, setShowDetails] = useState(false) // TODO based on screen size

  const route = findCurrentRoute(props.match)
  let maxWidth

  if (route.displayFullPage) {
    maxWidth = "100%"
  }
  return (
    <AppContainer maxWidth={maxWidth}>
      <Title>Inbox | Artsy</Title>
      <ConstrainedHeightContainer>
        <ConversationContainer>
          <Media greaterThan="sm">
            <Conversations
              me={me as any}
              selectedConversationID={me.conversation.internalID}
            />
          </Media>
          <Conversation
            conversation={me.conversation}
            refetch={props.relay.refetch}
            setShowDetails={setShowDetails}
            showDetails={showDetails}
          />
          <Details
            conversation={me.conversation}
            showDetails={showDetails}
            setShowDetails={setShowDetails}
          />
        </ConversationContainer>
      </ConstrainedHeightContainer>
    </AppContainer>
  )
}

export const ConversationFragmentContainer = createRefetchContainer(
  ConversationRoute,
  {
    me: graphql`
      fragment Conversation_me on Me
        @argumentDefinitions(conversationID: { type: "String!" }) {
        ...Conversations_me
        conversation(id: $conversationID) {
          internalID
          to {
            name
          }
          ...Conversation_conversation
          ...Details_conversation
        }
      }
    `,
  },
  graphql`
    query ConversationPageQuery($conversationID: String!) {
      me {
        ...Conversation_me @arguments(conversationID: $conversationID)
      }
    }
  `
)

export default ConversationFragmentContainer
