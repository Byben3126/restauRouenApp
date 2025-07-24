import { useEffect, useState } from 'react'
import { FlatList, Image, View, Dimensions } from 'react-native'
import { Float } from 'react-native/Libraries/Types/CodegenTypes'


interface ImageCarouselProps {
  images?: {
    uri: string
  }[]
  borderRadius?: number
  gap?: number
  paddingHorizontal?: number
  imageHeight?: number
}

interface ImageData {
  uri: string
  width: number
  height: number
}

interface ImageSized extends ImageData {
  width: number
  height: number
}

const ImageCarousel = ({
  images = [],
  borderRadius = 8, 
  gap = 10, 
  paddingHorizontal = 0, 
  imageHeight = 200,
} : ImageCarouselProps) => {
  const [imageSizes, setImageSizes] = useState<ImageSized[]>([])

  useEffect(() => {
    const loadSizes = async () => {
      const sizes = await Promise.all<ImageSized>(
        images.map((img) =>
          new Promise(resolve => {
            Image.getSize(img.uri, (width, height) => {
              const ratio = width / height
              resolve({ uri: img.uri, width: imageHeight * ratio, height: imageHeight })
            })
          })
        )
      )
      setImageSizes(sizes)
    }
    loadSizes()
  }, [images])

  return (
    <FlatList
      data={imageSizes}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap, paddingHorizontal }}
      renderItem={({ item }) => (
        <Image
          source={{ uri: item.uri }}
          style={{ width: item.width, height: item.height, borderRadius}}
          resizeMode="cover"
        />
      )}
    />
  )
}

export default ImageCarousel