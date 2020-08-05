import { ConversationApp_me } from "v2/__generated__/ConversationApp_me.graphql"
import { AppContainer } from "v2/Apps/Components/AppContainer"
import { ConversationsFragmentContainer as Conversations } from "v2/Apps/Conversation/Components/Conversations"
import { findCurrentRoute } from "v2/Artsy/Router/Utils/findCurrentRoute"
import { Match, Router } from "found"
import React, { useEffect, useState } from "react"
import { Title } from "react-head"
import { createFragmentContainer, graphql } from "react-relay"
import { Flex, Spinner, breakpoints } from "@artsy/palette"
import { debounce } from "lodash"
import { NoMessages } from "./Components/NoMessages"

interface ConversationAppProps {
  me: ConversationApp_me
  match: Match
  router: Router
}

interface InboxProps {
  me: ConversationApp_me
  selectedConversation: ConversationApp_me["conversationsConnection"]["edges"][0]["node"]
}

const getViewWidth = () => {
  return Math.max(
    window.document.documentElement.clientWidth,
    window.innerWidth || 0
  )
}

const Inbox: React.FC<InboxProps> = ({ selectedConversation, me }) => {
  return (
    <>
      <Conversations me={me} />
      <Flex
        display={["none", "none", "flex"]}
        height="100%"
        width="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner />
      </Flex>
    </>
  )
}

export const ConversationApp: React.FC<ConversationAppProps> = props => {
  const { me, router } = props
  const [width, setWidth] = useState(0)
  const route = findCurrentRoute(props.match)
  let maxWidth

  const firstConversation = me?.conversationsConnection?.edges[0]?.node

  useEffect(() => {
    setWidth(getViewWidth())
    const listenForResize = debounce(() => {
      setWidth(getViewWidth())
    })
    window.addEventListener("resize", listenForResize)
    return () => window.removeEventListener("resize", listenForResize)
  }, [])

  useEffect(() => {
    if (width > parseInt(breakpoints.md, 10) && firstConversation && router) {
      router.replace(`/user/conversations/${firstConversation.internalID}`)
    }
  }, [router, firstConversation, width])

  if (route.displayFullPage) {
    maxWidth = "100%"
  }

  return (
    <AppContainer maxWidth={maxWidth}>
      <Title>Conversations | Artsy</Title>
      {!firstConversation ? (
        <NoMessages />
      ) : (
        <Inbox selectedConversation={firstConversation} me={me} />
      )}
    </AppContainer>
  )
}

export const ConversationAppFragmentContainer = createFragmentContainer(
  ConversationApp,
  {
    me: graphql`
      fragment ConversationApp_me on Me
        @argumentDefinitions(
          first: { type: "Int", defaultValue: 25 }
          last: { type: "Int" }
          after: { type: "String" }
          before: { type: "String" }
        ) {
        conversationsConnection(
          first: $first
          last: $last
          before: $before
          after: $after
        ) {
          edges {
            node {
              internalID
              to {
                name
              }
            }
          }
        }
        ...Conversations_me
      }
    `,
  }
)

export default ConversationAppFragmentContainer
