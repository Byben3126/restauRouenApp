import { useEffect, useState } from 'react'
import { FlatList, Image, View, Dimensions, TouchableOpacity } from 'react-native'
import { Float } from 'react-native/Libraries/Types/CodegenTypes'
import ImageView from "react-native-image-viewing";

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
  const [visible, setIsVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState<number>(0);

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
  <>
   <FlatList
      data={imageSizes}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap, paddingHorizontal }}
      renderItem={({ item, index }) => (
        <TouchableOpacity onPress={() => {setImageIndex(index); setIsVisible(true) }}>
          <Image
            source={{ uri: item.uri }}
            style={{ width: item.width, height: item.height, borderRadius}}
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}
    />
    <ImageView
      images={images}
      imageIndex={imageIndex}
      visible={visible}
      onRequestClose={() => setIsVisible(false)}
    />
  </>
   
  )
}

export default ImageCarousel