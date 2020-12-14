import { Box, Flex, ResponsiveImage } from "@artsy/palette"
import { ArtistConsignHeaderImages_artist } from "v2/__generated__/ArtistConsignHeaderImages_artist.graphql"
import { last } from "lodash"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components"

type Artworks = ArtistConsignHeaderImages_artist["targetSupply"]["microfunnel"]["artworksConnection"]["edges"]

interface HeaderImageProps {
  artist: ArtistConsignHeaderImages_artist
}

export const ArtistConsignHeaderImages: React.FC<HeaderImageProps> = props => {
  const leftImage =
    props.artist.targetSupply.microfunnel?.artworksConnection?.edges?.[0]?.node
  const rightImage = last(
    props.artist.targetSupply.microfunnel?.artworksConnection?.edges
  )?.node
  const error = !(leftImage && rightImage)
  if (error) {
    return null
  }
  return (
    <HeaderImageContainer>
      <Flex width="100%" justifyContent="space-between" m="auto">
        <LeftImage>
          <LeftImagePhoto {...leftImage} />
        </LeftImage>
        <RightImage>
          <RightImagePhoto {...rightImage} />
        </RightImage>
      </Flex>
    </HeaderImageContainer>
  )
}

export const ArtistConsignHeaderImagesFragmentContainer = createFragmentContainer(
  ArtistConsignHeaderImages,
  {
    artist: graphql`
      fragment ArtistConsignHeaderImages_artist on Artist {
        targetSupply {
          microfunnel {
            artworksConnection {
              edges {
                node {
                  image {
                    resized(height: 395) {
                      width
                      height
                      url
                    }
                  }
                  ...FillwidthItem_artwork
                }
              }
            }
          }
        }
      }
    `,
  }
)
interface ImageProps {
  image: Artworks[0]["node"]["image"]
}
const LeftImagePhoto: React.FC<ImageProps> = ({ image }) => {
  return (
    <ResponsiveImage
      src={image.resized.url}
      style={{
        backgroundPosition: "left",
        transformOrigin: "left",
      }}
    />
  )
}

const RightImagePhoto: React.FC<ImageProps> = ({ image }) => {
  return <ResponsiveImage src={image.resized.url} />
}

const LeftImage = styled(Box)`
  left: -8%;
  position: absolute;
  transform-origin: center;
  transform: translateY(-50%);
  width: 25%;
`

const RightImage = styled(Box)`
  position: absolute;
  right: -10%;
  top: 20%;
  transform-origin: center;
  transform: translateY(-50%);
  width: 30%;
`

const HeaderImageContainer = styled(Flex).attrs({
  flexDirection: "column",
  justifyContent: "center",
})`
  width: 100%;
  height: 100%;
  position: absolute;
  margin: auto;
`
